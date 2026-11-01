// The simulation: a netlist built from MFlow's nodes and edges, and an event-driven propagation with a unit delay
// per part. Each round evaluates the parts whose inputs changed, all from the values before the round, then
// commits their outputs; flip-flops see a clock edge with the inputs as they were just before it. A circuit that
// keeps changing after ROUND_LIMIT rounds is oscillating. Pure, no Vue.
import type { FlowEdge } from '@m3ui-vue/m3ui-vue/flow'
import { mask, resolve, same, widthOf, X, Z, type Sig } from './logic'
import { clockAt, partByKind, type Params, type PartDef, type Pin } from './parts'
import { getCircuit, interfaceNodes, type PartData, type PartNode } from './library'
import { applyOp, type PokeOp } from './ops'

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
  const pinsAt = new Map<string, { inputs: Pin[]; outputs: Pin[] }>()

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
      if (def.kind === 'tunnel' || def.kind === 'point' || (nested && (def.kind === 'pin' || def.kind === 'outpin'))) continue
      parts.push({ id: prefix + n.id, def, params })
    }
    const tunnel = (n: PartNode) => `@${prefix}#${n.data!.label ?? ''}`
    // A wire point: a tunnel of its own (a loose end, or a corner to wire on from)
    const point = (n: PartNode) => `@${prefix}~${n.id}`
    // What an output of a node really is
    const source = (n: PartNode, o: number): string[] => {
      switch (kindOf(n)) {
        case 'sub': { const op = ios.get(n.id)?.outputs[o]; return op ? [`@${prefix}${n.id}/${op.id}`] : [] }
        case 'tunnel': return [tunnel(n)]
        case 'point': return [point(n)]
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
        const k = prefix + dst.id
        virtualIn.set(k, Object.assign(virtualIn.get(k) ?? [], { [i]: [...(virtualIn.get(k)?.[i] ?? []), ...ds] }))
      } else if (kind === 'tunnel') addAlias(tunnel(dst), ds)
      else if (kind === 'point') addAlias(point(dst), ds)
      else if (nested && kind === 'outpin') addAlias(`@${prefix}${dst.id}`, ds)
      else conns.push({ id: prefix + dst.id, i, drivers: ds })
    }
    // What the UI shows for the parts that aren't simulated, at every level (to look inside a subcircuit)
    for (const n of nodes) {
      const k = kindOf(n)
      const def = partByKind.get(k)
      if (!def) continue
      pinsAt.set(prefix + n.id, def.pins({ ...def.params, ...n.data!.params }))
      if (k === 'tunnel' || k === 'point') {
        virtualOut.set(outKey(prefix + n.id, 0), source(n, 0))
        virtualIn.set(prefix + n.id, [source(n, 0)])
      }
      if (k === 'sub') ios.get(n.id)?.outputs.forEach((_, o) => virtualOut.set(outKey(prefix + n.id, o), source(n, o)))
      if (nested && k === 'pin') virtualOut.set(outKey(prefix + n.id, 0), [`@${prefix}${n.id}`])
      if (nested && k === 'outpin') virtualIn.set(prefix + n.id, [[`@${prefix}${n.id}`]])
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
    pinsAt,
  }
}

/**
 * The simulation, compiled: every part an index, every output a slot in one array of signals, each input a list of
 * the slots driving it, each slot the parts it feeds. The hot loop (settle) runs on those integers and reuses its
 * buffers, so a clock tick allocates only the signals the parts return. Ids and the state Map stay for the UI.
 */
export class Simulator {
  parts = new Map<string, Compiled>()
  /** Each part's own state (flip-flops, memories, devices), by id; the UI reads it */
  state = new Map<string, any>()
  /** Pins of the circuit's own nodes (subcircuits and tunnels too), for the wires between them */
  topPins = new Map<string, { inputs: Pin[]; outputs: Pin[] }>()
  virtualOut = new Map<string, string[]>()
  virtualIn = new Map<string, string[][]>()
  /** The last settle didn't calm down */
  oscillating = false
  /** Rounds the last settle took (the circuit's depth, roughly) */
  rounds = 0

  // ── Compiled form ──
  private ids: string[] = []
  private index = new Map<string, number>()
  private defs: PartDef[] = []
  private params: Params[] = []
  private states: any[] = []
  /** Per part, per input: the slots driving it */
  private drivers: number[][][] = []
  /** Per part, per input: its mask */
  private masks: number[][] = []
  /** Per part: its first output slot */
  private outBase: number[] = []
  /** Per slot: its signal, and the parts it feeds */
  private vals: Sig[] = []
  private feeds: number[][] = []
  private slotOf = new Map<string, number>()
  private clocks: number[] = []
  /** Per part: the array its eval gets, reused */
  private inBuf: Sig[][] = []
  private mark = new Uint8Array(0)

  build(nodes: PartNode[], edges: FlowEdge[]) {
    const before = this.parts
    const oldVals = new Map([...this.slotOf].map(([k, i]) => [k, this.vals[i]!]))
    const flat = flatten(nodes, edges)
    this.parts = new Map()
    this.virtualOut = flat.virtualOut
    this.virtualIn = flat.virtualIn
    this.topPins = flat.pinsAt
    this.ids = []
    this.index = new Map()
    this.defs = []
    this.params = []
    this.states = []
    this.drivers = []
    this.masks = []
    this.outBase = []
    this.vals = []
    this.slotOf = new Map()
    this.clocks = []
    this.inBuf = []
    for (const { id, def, params } of flat.parts) {
      const pins = def.pins(params)
      const sig = `${def.kind}|${JSON.stringify(params)}`
      const p = this.ids.length
      this.parts.set(id, { def, params, pins, drivers: pins.inputs.map(() => []), sig })
      if (before.get(id)?.sig !== sig || !this.state.has(id)) this.state.set(id, def.init?.(params) ?? {})
      this.ids.push(id)
      this.index.set(id, p)
      this.defs.push(def)
      this.params.push(params)
      this.states.push(this.state.get(id))
      this.drivers.push(pins.inputs.map(() => []))
      this.masks.push(pins.inputs.map((pin) => mask(pin.width)))
      this.inBuf.push(pins.inputs.map((pin) => Z(mask(pin.width))))
      this.outBase.push(this.vals.length)
      if (def.kind === 'clock') this.clocks.push(p)
      pins.outputs.forEach((pin, i) => {
        const k = outKey(id, i)
        const old = oldVals.get(k)
        this.slotOf.set(k, this.vals.length)
        this.vals.push(old && old.m === mask(pin.width) ? old : X(mask(pin.width)))
      })
    }
    for (const id of this.state.keys()) if (!this.parts.has(id)) this.state.delete(id)
    this.feeds = this.vals.map(() => [])
    for (const { id, i, drivers } of flat.conns) {
      const p = this.index.get(id)
      if (p === undefined || i >= this.drivers[p]!.length) continue
      for (const k of drivers) {
        const slot = this.slotOf.get(k)
        if (slot === undefined) continue
        this.drivers[p]![i]!.push(slot)
        this.parts.get(id)!.drivers[i]!.push(k)
        if (!this.feeds[slot]!.includes(p)) this.feeds[slot]!.push(p)
      }
    }
    this.mark = new Uint8Array(this.ids.length)
    this.settleIdx(this.ids.map((_, i) => i))
  }

  /** What reaches input `i` of part `p` */
  private input(p: number, i: number): Sig {
    const ds = this.drivers[p]![i]!
    const m = this.masks[p]![i]!
    if (ds.length === 1) {
      const s = this.vals[ds[0]!]!
      return s.m === m ? s : X(m)
    }
    if (!ds.length) {
      const z = this.inBuf[p]![i]!
      return z.k === 0 && z.e === 0 && z.m === m ? z : Z(m)
    }
    return resolve(ds.map((d) => (this.vals[d]!.m === m ? this.vals[d]! : X(m))), m)
  }
  private merged(keys: string[] | undefined, width: number): Sig {
    const m = mask(width)
    const ds = (keys ?? []).map((k) => this.vals[this.slotOf.get(k) ?? -1]).filter((s): s is Sig => !!s).map((s) => (s.m === m ? s : X(m)))
    return ds.length ? resolve(ds, m) : Z(m)
  }

  /** The signals arriving at a part's inputs (or at a subcircuit's or a tunnel's) */
  inputsOf(id: string): Sig[] {
    const p = this.index.get(id)
    if (p === undefined) {
      const pins = this.topPins.get(id)
      const v = this.virtualIn.get(id)
      return pins ? pins.inputs.map((pin, i) => this.merged(v?.[i], pin.width)) : []
    }
    return this.masks[p]!.map((_, i) => this.input(p, i))
  }
  output(id: string, i: number): Sig | undefined {
    const k = outKey(id, i)
    const slot = this.slotOf.get(k)
    if (slot !== undefined) return this.vals[slot]
    const pin = this.topPins.get(id)?.outputs[i]
    return pin && this.virtualOut.has(k) ? this.merged(this.virtualOut.get(k), pin.width) : undefined
  }
  /** What an edge carries, or null when its ends have different widths */
  edgeSignal(e: FlowEdge, prefix = ''): Sig | null {
    const s = this.output(prefix + e.source, handleIndex(e.sourceHandle))
    const pin = this.topPins.get(prefix + e.target)?.inputs[handleIndex(e.targetHandle)]
    if (!s || !pin) return null
    return s.m === mask(pin.width) ? s : null
  }
  widthsOf(e: FlowEdge, prefix = '') {
    const from = this.topPins.get(prefix + e.source)?.outputs[handleIndex(e.sourceHandle)]?.width
    const to = this.topPins.get(prefix + e.target)?.inputs[handleIndex(e.targetHandle)]?.width
    return { from, to }
  }

  settle(start: Iterable<string>) {
    const list: number[] = []
    for (const id of start) {
      const p = this.index.get(id)
      if (p !== undefined) list.push(p)
    }
    this.settleIdx(list)
  }
  // Reused between settles
  private chSlot: number[] = []
  private chSig: Sig[] = []
  private settleIdx(start: number[]) {
    const mark = this.mark
    let dirty: number[] = []
    for (const p of start) if (!mark[p]) {
      mark[p] = 1
      dirty.push(p)
    }
    let rounds = 0
    const chSlot = this.chSlot
    const chSig = this.chSig
    while (dirty.length && rounds < ROUND_LIMIT) {
      let n = 0
      for (const p of dirty) {
        mark[p] = 0
        const buf = this.inBuf[p]!
        for (let i = 0; i < buf.length; i++) buf[i] = this.input(p, i)
        const outs = this.defs[p]!.eval({ in: buf, state: this.states[p], p: this.params[p]! })
        const base = this.outBase[p]!
        for (let o = 0; o < outs.length; o++) {
          chSlot[n] = base + o
          chSig[n++] = outs[o]!
        }
      }
      const next: number[] = []
      for (let c = 0; c < n; c++) {
        const slot = chSlot[c]!
        const s = chSig[c]!
        if (same(this.vals[slot]!, s)) continue
        this.vals[slot] = s
        for (const t of this.feeds[slot]!) if (!mark[t]) {
          mark[t] = 1
          next.push(t)
        }
      }
      dirty = next
      rounds++
    }
    for (const p of dirty) mark[p] = 0
    this.oscillating = dirty.length > 0
    this.rounds = rounds
  }

  /** Changes a part's state (a switch flipped, a button pressed, a RAM word edited) and propagates it */
  poke(id: string, op: PokeOp) {
    const st = this.state.get(id)
    if (!st) return
    applyOp(st, op)
    this.settle([id])
  }

  // ── Handing the simulation to a Worker and back ──
  /**
   * The parts' states and every signal, to rebuild this simulation elsewhere (full) or to show it (light: no ROM
   * cells, no RAM words, a screen's pixels only when they changed). Structured-cloneable.
   */
  exportState(full: boolean) {
    const states: Record<string, any> = {}
    for (const [id, st] of this.state) {
      if (full) {
        states[id] = st
        continue
      }
      const copy: any = {}
      for (const k in st) {
        if (k === 'cells' || k === 'mem' || k === 'back') continue
        if (k === 'front' && !st.dirty) continue
        copy[k] = st[k]
      }
      states[id] = copy
    }
    return { states, vals: this.vals, oscillating: this.oscillating }
  }
  /** Takes in what exportState gave (after building the same circuit) */
  importState(data: { states: Record<string, any>; vals: Sig[]; oscillating?: boolean }) {
    for (const [id, s] of Object.entries(data.states)) {
      const p = this.index.get(id)
      const st = this.state.get(id)
      if (!st || p === undefined) continue
      Object.assign(st, s)
    }
    if (data.vals.length === this.vals.length) this.vals = data.vals
    this.oscillating = !!data.oscillating
  }
  /** After a light export has been sent: what it carried once (new pixels, PCM samples) isn't sent again */
  drain() {
    for (const st of this.state.values()) {
      if (st.dirty) st.dirty = false
      if (st.queue && 'level' in st) st.queue = []
    }
  }
  /** One tick (half a period at the bar's frequency): each clock moves on, flipping when its high or low time is up */
  tick() {
    const changed = this.clockBuf
    changed.length = 0
    for (const p of this.clocks) {
      const st = this.states[p]
      st.t = (st.t ?? 0) + 1
      const v = clockAt(this.params[p]!, st.t)
      if (v === st.value) continue
      st.value = v
      changed.push(p)
    }
    if (changed.length) this.settleIdx(changed)
  }
  private clockBuf: number[] = []
  /** Every part back to how it starts: registers cleared, memories reloaded, clocks low */
  reset() {
    this.ids.forEach((id, p) => {
      const def = this.defs[p]!
      const keep = def.kind === 'switch' || def.kind === 'pin' ? this.state.get(id) : null
      const st = keep ?? def.init?.(this.params[p]!) ?? {}
      this.state.set(id, st)
      this.states[p] = st
    })
    this.vals = this.vals.map((s) => X(s.m))
    this.settleIdx(this.ids.map((_, i) => i))
  }
  /** Forgets every state and signal (before building another circuit) */
  clear() {
    this.state.clear()
    this.slotOf = new Map()
    this.vals = []
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
    this.settleIdx(this.ids.map((_, i) => i))
  }
}

export { widthOf }
