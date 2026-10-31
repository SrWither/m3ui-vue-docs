// The simulation: a netlist built from MFlow's nodes and edges, and an event-driven propagation with a unit delay
// per part. Each round evaluates the parts whose inputs changed, all from the values before the round, then
// commits their outputs; flip-flops see a clock edge with the inputs as they were just before it. A circuit that
// keeps changing after ROUND_LIMIT rounds is oscillating. Pure, no Vue.
import type { FlowEdge, FlowNode } from '@m3ui-vue/m3ui-vue/flow'
import { mask, resolve, same, widthOf, X, Z, type Sig } from './logic'
import { partByKind, type Params, type PartDef, type Pin } from './parts'

export interface PartData { kind: string; label?: string; params: Params }
export type PartNode = FlowNode<PartData>

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

export class Simulator {
  parts = new Map<string, Compiled>()
  values = new Map<string, Sig>()
  state = new Map<string, any>()
  fanout = new Map<string, Set<string>>()
  /** The last settle didn't calm down */
  oscillating = false
  /** Rounds the last settle took (the circuit's depth, roughly) */
  rounds = 0

  build(nodes: PartNode[], edges: FlowEdge[]) {
    const before = this.parts
    this.parts = new Map()
    this.fanout = new Map()
    for (const n of nodes) {
      const def = partByKind.get(n.data?.kind ?? '')
      if (!def) continue
      const params = { ...def.params, ...n.data!.params }
      const pins = def.pins(params)
      const sig = `${def.kind}|${JSON.stringify(params)}`
      this.parts.set(n.id, { def, params, pins, drivers: pins.inputs.map(() => []), sig })
      if (before.get(n.id)?.sig !== sig || !this.state.has(n.id)) this.state.set(n.id, def.init?.(params) ?? {})
      pins.outputs.forEach((p, i) => {
        const k = outKey(n.id, i)
        const v = this.values.get(k)
        if (!v || v.m !== mask(p.width)) this.values.set(k, X(mask(p.width)))
      })
    }
    for (const id of this.state.keys()) if (!this.parts.has(id)) this.state.delete(id)
    for (const k of this.values.keys()) {
      const [id, i] = k.split(':')
      if (!this.parts.get(id!)?.pins.outputs[Number(i)]) this.values.delete(k)
    }
    for (const e of edges) {
      const src = this.parts.get(e.source)
      const dst = this.parts.get(e.target)
      const o = handleIndex(e.sourceHandle)
      const i = handleIndex(e.targetHandle)
      if (!src?.pins.outputs[o] || !dst?.pins.inputs[i]) continue
      const k = outKey(e.source, o)
      dst.drivers[i]!.push(k)
      if (!this.fanout.has(k)) this.fanout.set(k, new Set())
      this.fanout.get(k)!.add(e.target)
    }
    this.settle([...this.parts.keys()])
  }

  /** The signals arriving at a part's inputs */
  inputsOf(id: string): Sig[] {
    const c = this.parts.get(id)
    if (!c) return []
    return c.pins.inputs.map((pin, i) => {
      const m = mask(pin.width)
      const ds = c.drivers[i]!.map((k) => this.values.get(k)!).map((s) => (s.m === m ? s : X(m)))
      return ds.length ? resolve(ds, m) : Z(m)
    })
  }
  output(id: string, i: number) {
    return this.values.get(outKey(id, i))
  }
  /** What an edge carries, or null when its ends have different widths */
  edgeSignal(e: FlowEdge): Sig | null {
    const s = this.output(e.source, handleIndex(e.sourceHandle))
    const pin = this.parts.get(e.target)?.pins.inputs[handleIndex(e.targetHandle)]
    if (!s || !pin) return null
    return s.m === mask(pin.width) ? s : null
  }
  widthsOf(e: FlowEdge) {
    const from = this.parts.get(e.source)?.pins.outputs[handleIndex(e.sourceHandle)]?.width
    const to = this.parts.get(e.target)?.pins.inputs[handleIndex(e.targetHandle)]?.width
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
