// The open circuit's truth table: every combination of its inputs (switches, buttons, input pins) and what its
// outputs (LEDs, output pins, probes, hex displays) show for each. Worked out on a simulator of its own, so the
// one on the canvas keeps its state. Pure, no Vue.
import type { FlowEdge } from '@m3ui-vue/m3ui-vue/flow'
import { Simulator, type PartNode } from './sim'
import { partByKind } from './parts'
import { format, known, type Sig } from './logic'

const INPUTS = new Set(['switch', 'button', 'pin'])
const OUTPUTS = new Set(['led', 'outpin', 'probe', 'hex'])
/** Parts that remember: their outputs depend on what came before, not only on the inputs */
const SEQUENTIAL = new Set(['clock', 'dff', 'tff', 'jkff', 'register', 'counter', 'pc', 'shiftreg', 'ram', 'random', 'keyboard', 'tty', 'screen'])
/** At most this many input bits (1024 rows) */
export const MAX_BITS = 10

export interface TruthColumn { id: string; name: string; bits: number }
export interface TruthTable {
  inputs: TruthColumn[]
  outputs: TruthColumn[]
  /** Per row: the inputs' values, then the outputs' as shown (0/1, hex for buses, X or Z) */
  rows: { ins: number[]; outs: string[] }[]
  /** Why there's no table, or a caveat about it */
  error?: string
  note?: string
}

const byPlace = (a: PartNode, b: PartNode) => a.position.y - b.position.y || a.position.x - b.position.x
const shown = (s: Sig | undefined) => (!s ? '–' : known(s) && s.m === 1 ? String(s.v) : format(s))

export function truthTable(nodes: PartNode[], edges: FlowEdge[]): TruthTable {
  const name = (n: PartNode, i: number, prefix: string) => n.data!.label || `${prefix}${i}`
  const ins = nodes.filter((n) => INPUTS.has(n.data?.kind ?? '')).sort(byPlace)
  const outs = nodes.filter((n) => OUTPUTS.has(n.data?.kind ?? '')).sort(byPlace)
  const width = (n: PartNode) => {
    const def = partByKind.get(n.data!.kind)!
    const p = { ...def.params, ...n.data!.params }
    const pins = def.pins(p)
    return (pins.outputs[0] ?? pins.inputs[0])?.width ?? 1
  }
  const inputs = ins.map((n, i) => ({ id: n.id, name: name(n, i, 'in'), bits: width(n) }))
  const outputs = outs.map((n, i) => ({ id: n.id, name: name(n, i, 'out'), bits: width(n) }))
  if (!inputs.length || !outputs.length) return { inputs, outputs, rows: [], error: 'It needs at least one input (a switch, a button or an input pin) and one output (an LED, an output pin, a probe or a hex display).' }
  const bits = inputs.reduce((s, c) => s + c.bits, 0)
  if (bits > MAX_BITS) return { inputs, outputs, rows: [], error: `Its inputs have ${bits} bits in all: ${2 ** bits} rows is too many (at most ${MAX_BITS} bits).` }
  const sim = new Simulator()
  sim.build(nodes, edges)
  const rows: TruthTable['rows'] = []
  for (let combo = 0; combo < 2 ** bits; combo++) {
    // The first input is the most significant, as truth tables are usually written
    let rest = combo
    const values = [...inputs].reverse().map((c) => {
      const v = rest & ((1 << c.bits) - 1)
      rest >>>= c.bits
      return v
    }).reverse()
    inputs.forEach((c, i) => sim.poke(c.id, { set: { value: values[i]! } }))
    rows.push({ ins: values, outs: outputs.map((c) => shown(sim.inputsOf(c.id)[0])) })
    if (sim.oscillating) return { inputs, outputs, rows: [], error: 'The circuit oscillates for some inputs: it never settles, so it has no truth table.' }
  }
  const sequential = nodes.some((n) => SEQUENTIAL.has(n.data?.kind ?? ''))
  return { inputs, outputs, rows, ...(sequential && { note: 'It has parts that remember (clocks, flip-flops, memories): each row is what it shows right after the rows above it, from a fresh start.' }) }
}

/** The table as CSV */
export function truthCSV(t: TruthTable) {
  const head = [...t.inputs.map((c) => c.name), ...t.outputs.map((c) => c.name)]
  return [head, ...t.rows.map((r) => [...r.ins.map(String), ...r.outs])].map((cells) => cells.map((x) => (/[",\n]/.test(x) ? `"${x.replace(/"/g, '""')}"` : x)).join(',')).join('\n')
}
