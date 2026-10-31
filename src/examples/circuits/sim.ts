// The simulation: a netlist built from MFlow's nodes and edges, and an event-driven propagation with a unit delay
// per part. Each round evaluates the parts whose inputs changed, all from the values before the round, then
// commits their outputs; flip-flops see a clock edge with the inputs as they were just before it. A circuit that
// keeps changing after ROUND_LIMIT rounds is oscillating. Pure, no Vue.
import type { FlowEdge } from '@m3ui-vue/m3ui-vue/flow'
import { mask, resolve, same, widthOf, X, Z, type Sig } from './logic'
import { partByKind, type Params, type PartDef, type Pin } from './parts'
import { getCircuit, interfaceNodes, type PartData, type PartNode } from './library'

export type { PartData, PartNode }

const ROUND_LIMIT = 1000
const outKey = (node: string, i: number) => `${node}:${i}`
export const handleIndex = (h: string | null | undefined) => Number(h?.slice(1) ?? 0)

export function pinsOf(data: PartData) {
  return partByKind.get(data.kind)!.pins({ ...partByKind.get(data.kind)!.params, ...data.params })
}

interface Compiled {
  def: PartDef
  params: Params
  pins: { inputs: Pin[]; outputs: Pin[] }
  /** Per input, the outputs driving it */
  drivers: string[][]
  /** Fingerprint: its state survives a rebuild while this stays the same */
  sig: string
}

/**
 * The parts that get simulated, with subcircuits and tunnels taken out. A subcircuit's parts take its place (ids
 * `sub/inner`, nested as deep as it goes); its input and output pins and every tunnel become aliases (`@…`), names
 * for "whatever drives this", resolved at the end into the real outputs behind them. So crossing into a subcircuit
 * or through a tunnel costs no delay, and a loop through them works like any other.
 */
function flatten(nodes: PartNode[], edges: FlowEdge[]) {
  const parts: { id: string; def: PartDef; params: Params }[] = []
  const conns: { id: string; i: number; drivers: string[] }[] = []
  const alias = new Map<string, string[]>()
  const addAlias = (k: string, ds: string[]) => alias.set(k, [...(alias.get(k) ?? []), ...ds])
  // The top level's subcircuits and tunnels: what their outputs carry and what reaches their inputs, for drawing
  const virtualOut = new Map<string, string[]>()
  const virtualIn = new Map<string, string[][]>()

  function expand(nodes: PartNode[], edges: FlowEdge[], prefix: string, nested: boolean, stack: string[]) {
    const byId = new Map(nodes.map((n) => [n.id, n]))
    const ios = new Map<string, ReturnType<typeof interfaceNodes>>()
    const kindOf = (n: PartNode | undefined) => n?.data?.kind ?? ''
    for (const n of nodes) {
      const def = partByKind.get(kindOf(n))
      if (!def) continue
      const params = { ...def.params, ...n.data!.params }
      if (def.kind === 'sub') {
        const sub = getCircuit(params.circuit)
        if (!sub || stack.includes(sub.id)) continue
        ios.set(n.id, interfaceNodes(sub))
        expand(sub.nodes, sub.edges, `${prefix}${n.id}/`, true, [...stack, sub.id])
        continue
      }
      if (def.kind === 'tunnel' || (nested && (def.kind === 'pin' || def.kind === 'outpin'))) continue
      parts.push({ id: prefix + n.id, def, params })
    }
    const tunnel = (n: PartNode) => `@${prefix}#${n.data!.label ?? ''}`
    // What an output of a node really is
    const source = (n: PartNode, o: number): string[] => {
      switch (kindOf(n)) {
        case 'sub': { const op = ios.get(n.id)?.outputs[o]; return op ? [`@${prefix}${n.id}/${op.id}`] : [] }
        case 'tunnel': return [tunnel(n)]
        case 'pin': if (nested) return [`@${prefix}${n.id}`]
      }
      return [outKey(prefix + n.id, o)]
    }
    for (const e of edges) {
      const src = byId.get(e.source)
      const dst = byId.get(e.target)
      if (!src || !dst || !partByKind.has(kindOf(src)) || !partByKind.has(kindOf(dst))) continue
      const ds = source(src, handleIndex(e.sourceHandle))
      const i = handleIndex(e.targetHandle)
      const kind = kindOf(dst)
      if (kind === 'sub') {
        const ip = ios.get(dst.id)?.inputs[i]
        if (ip) addAlias(`@${prefix}${dst.id}/${ip.id}`, ds)
        if (!nested) virtualIn.set(dst.id, Object.assign(virtualIn.get(dst.id) ?? [], { [i]: [...(virtualIn.get(dst.id)?.[i] ?? []), ...ds] }))
      } else if (kind === 'tunnel') addAlias(tunnel(dst), ds)
      else if (nested && kind === 'outpin') addAlias(`@${prefix}${dst.id}`, ds)
      else conns.push({ id: prefix + dst.id, i, drivers: ds })
    }
    if (!nested) {
      for (const n of nodes) {
        const k = kindOf(n)
        if (k === 'tunnel') {
          virtualOut.set(outKey(n.id, 0), source(n, 0))
          virtualIn.set(n.id, [source(n, 0)])
        }
        if (k === 'sub') ios.get(n.id)?.outputs.forEach((_, o) => virtualOut.set(outKey(n.id, o), source(n, o)))
      }
    }
  }
  expand(nodes, edges, '', false, [])

  // Aliases down to real outputs (a loop of aliases with nothing driving it is just undriven)
  const memo = new Map<string, string[]>()
  const visiting = new Set<string>()
  const real = (k: string): string[] => {
    if (!k.startsWith('@')) return [k]
    if (memo.has(k)) return memo.get(k)!
    if (visiting.has(k)) return []
    visiting.add(k)
    const out = [...new Set((alias.get(k) ?? []).flatMap(real))]
    visiting.delete(k)
    memo.set(k, out)
    return out
  }
  const resolveAll = (ds: string[]) => [...new Set(ds.flatMap(real))]
  return {
    parts,
    conns: conns.map((c) => ({ ...c, drivers: resolveAll(c.drivers) })),
    virtualOut: new Map([...virtualOut].map(([k, ds]) => [k, resolveAll(ds)])),
    virtualIn: new Map([...virtualIn].map(([k, list]) => [k, Array.from(list, (ds) => resolveAll(ds ?? []))])),
  }
}

export class Simulator {
  parts = new Map<string, Compiled>()
  values = new Map<string, Sig>()
  state = new Map<string, any>()
  fanout = new Map<string, Set<string>>()
  /** Pins of the circuit's own nodes (subcircuits and tunnels too), for the wires between them */
  topPins = new Map<string, { inputs: Pin[]; outputs: Pin[] }>()
  virtualOut = new Map<string, string[]>()
  virtualIn = new Map<string, string[][]>()
  /** The last settle didn't calm down */
  oscillating = false
  /** Rounds the last settle took (the circuit's depth, roughly) */
  rounds = 0

  build(nodes: PartNode[], edges: FlowEdge[]) {
    const before = this.parts
    const flat = flatten(nodes, edges)
    this.parts = new Map()
    this.fanout = new Map()
    this.virtualOut = flat.virtualOut
    this.virtualIn = flat.virtualIn
    this.topPins = new Map(nodes.filter((n) => partByKind.has(n.data?.kind ?? '')).map((n) => [n.id, pinsOf(n.data!)]))
    for (const { id, def, params } of flat.parts) {
      const pins = def.pins(params)
      const sig = `${def.kind}|${JSON.stringify(params)}`
      this.parts.set(id, { def, params, pins, drivers: pins.inputs.map(() => []), sig })
      if (before.get(id)?.sig !== sig || !this.state.has(id)) this.state.set(id, def.init?.(params) ?? {})
      pins.outputs.forEach((p, i) => {
        const k = outKey(id, i)
        const v = this.values.get(k)
        if (!v || v.m !== mask(p.width)) this.values.set(k, X(mask(p.width)))
      })
    }
    for (const id of this.state.keys()) if (!this.parts.has(id)) this.state.delete(id)
    for (const k of this.values.keys()) {
      const cut = k.lastIndexOf(':')
      if (!this.parts.get(k.slice(0, cut))?.pins.outputs[Number(k.slice(cut + 1))]) this.values.delete(k)
    }
    for (const { id, i, drivers } of flat.conns) {
      const dst = this.parts.get(id)
      if (!dst?.pins.inputs[i]) continue
      for (const k of drivers) {
        if (!this.values.has(k)) continue
        dst.drivers[i]!.push(k)
        if (!this.fanout.has(k)) this.fanout.set(k, new Set())
        this.fanout.get(k)!.add(id)
      }
    }
    this.settle([...this.parts.keys()])
  }

  private merged(keys: string[] | undefined, width: number): Sig {
    const m = mask(width)
    const ds = (keys ?? []).map((k) => this.values.get(k)).filter((s): s is Sig => !!s).map((s) => (s.m === m ? s : X(m)))
    return ds.length ? resolve(ds, m) : Z(m)
  }

  /** The signals arriving at a part's inputs (or at a subcircuit's or a tunnel's) */
  inputsOf(id: string): Sig[] {
    const c = this.parts.get(id)
    if (!c) {
      const pins = this.topPins.get(id)
      const v = this.virtualIn.get(id)
      return pins ? pins.inputs.map((pin, i) => this.merged(v?.[i], pin.width)) : []
    }
    return c.pins.inputs.map((pin, i) => this.merged(c.drivers[i], pin.width))
  }
  output(id: string, i: number): Sig | undefined {
    const k = outKey(id, i)
    const v = this.values.get(k)
    if (v) return v
    const pin = this.topPins.get(id)?.outputs[i]
    return pin && this.virtualOut.has(k) ? this.merged(this.virtualOut.get(k), pin.width) : undefined
  }
  /** What an edge carries, or null when its ends have different widths */
  edgeSignal(e: FlowEdge): Sig | null {
    const s = this.output(e.source, handleIndex(e.sourceHandle))
    const pin = this.topPins.get(e.target)?.inputs[handleIndex(e.targetHandle)]
    if (!s || !pin) return null
    return s.m === mask(pin.width) ? s : null
  }
  widthsOf(e: FlowEdge) {
    const from = this.topPins.get(e.source)?.outputs[handleIndex(e.sourceHandle)]?.width
    const to = this.topPins.get(e.target)?.inputs[handleIndex(e.targetHandle)]?.width
    return { from, to }
  }

  settle(start: Iterable<string>) {
    let dirty = new Set(start)
    let rounds = 0
    while (dirty.size && rounds < ROUND_LIMIT) {
      const changes: [string, Sig][] = []
      for (const id of dirty) {
        const c = this.parts.get(id)
        if (!c) continue
        const outs = c.def.eval({ in: this.inputsOf(id), state: this.state.get(id), p: c.params })
        outs.forEach((s, i) => changes.push([outKey(id, i), s]))
      }
      dirty = new Set()
      for (const [k, s] of changes) {
        if (same(this.values.get(k)!, s)) continue
        this.values.set(k, s)
        for (const t of this.fanout.get(k) ?? []) dirty.add(t)
      }
      rounds++
    }
    this.oscillating = dirty.size > 0
    this.rounds = rounds
  }

  /** Changes a part's state (a switch flipped, a button pressed, a RAM word edited) and propagates it */
  poke(id: string, change: (state: any) => void) {
    const st = this.state.get(id)
    if (!st) return
    change(st)
    this.settle([id])
  }
  /** Half a clock period: every clock flips */
  tick() {
    const clocks: string[] = []
    for (const [id, c] of this.parts) {
      if (c.def.kind !== 'clock') continue
      const st = this.state.get(id)
      st.value ^= 1
      clocks.push(id)
    }
    this.settle(clocks)
  }
  /** Every part back to how it starts: registers cleared, memories reloaded, clocks low */
  reset() {
    for (const [id, c] of this.parts) {
      const keep = c.def.kind === 'switch' || c.def.kind === 'pin' ? this.state.get(id) : null
      this.state.set(id, keep ?? c.def.init?.(c.params) ?? {})
    }
    for (const [k, s] of this.values) this.values.set(k, X(s.m))
    this.settle([...this.parts.keys()])
  }
  /** The parts' user-facing state, to save with the circuit */
  snapshot() {
    const out: Record<string, any> = {}
    for (const [id, c] of this.parts) {
      const st = this.state.get(id)
      if (c.def.kind === 'switch' || c.def.kind === 'pin') out[id] = { value: st.value }
    }
    return out
  }
  restore(saved: Record<string, any>) {
    for (const [id, s] of Object.entries(saved ?? {})) {
      const st = this.state.get(id)
      if (st) Object.assign(st, s)
    }
    this.settle([...this.parts.keys()])
  }
}

export { widthOf }
