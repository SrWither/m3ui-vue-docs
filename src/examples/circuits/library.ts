// The circuits of a project, as parts: any circuit can be placed inside another one as a subcircuit, its input
// pins becoming the part's inputs and its output pins its outputs (top to bottom, as they sit in the circuit).
// useCircuit registers how to find a circuit by id; parts.ts and sim.ts only read through it. Pure, no Vue.
import type { FlowEdge, FlowNode } from '@m3ui-vue/m3ui-vue/flow'
import type { Params, Pin } from './parts'

/** Where a part's outputs point, as in Logisim (east: inputs on the left, outputs on the right) */
export type Facing = 'east' | 'south' | 'west' | 'north'
export interface PartData { kind: string; label?: string; params: Params; facing?: Facing }
export type PartNode = FlowNode<PartData>
export interface CircuitDef { id: string; name: string; nodes: PartNode[]; edges: FlowEdge[] }

let resolver: (id: string) => CircuitDef | undefined = () => undefined
export const setCircuitResolver = (fn: typeof resolver) => (resolver = fn)
export const getCircuit = (id: string | undefined) => (id ? resolver(id) : undefined)

const byPlace = (a: PartNode, b: PartNode) => a.position.y - b.position.y || a.position.x - b.position.x
/** A circuit's input pins and output pins, in the order they become a subcircuit's pins */
export function interfaceNodes(c: CircuitDef) {
  return {
    inputs: c.nodes.filter((n) => n.data?.kind === 'pin').sort(byPlace),
    outputs: c.nodes.filter((n) => n.data?.kind === 'outpin').sort(byPlace),
  }
}
export function interfaceOf(c: CircuitDef | undefined): { inputs: Pin[]; outputs: Pin[] } {
  if (!c) return { inputs: [], outputs: [] }
  const { inputs, outputs } = interfaceNodes(c)
  const pin = (prefix: string) => (n: PartNode, i: number): Pin => ({ name: n.data!.label || `${prefix}${i}`, width: n.data!.params.width ?? (prefix === 'in' ? 4 : 1) })
  return { inputs: inputs.map(pin('in')), outputs: outputs.map(pin('out')) }
}

/** Whether circuit `a` contains `b`, directly or through other subcircuits (so `b` can't hold an `a`) */
export function contains(a: string, b: string, seen = new Set<string>()): boolean {
  if (a === b) return true
  if (seen.has(a)) return false
  seen.add(a)
  const c = getCircuit(a)
  return !!c?.nodes.some((n) => n.data?.kind === 'sub' && !!n.data.params.circuit && contains(n.data.params.circuit, b, seen))
}
