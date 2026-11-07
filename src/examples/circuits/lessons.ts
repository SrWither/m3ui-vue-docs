// The tutorial: short lessons whose steps check themselves against the circuit on the canvas (what's placed, what's
// wired to what, what the simulation shows), so the next one comes up as soon as you've done it, and the ones you
// did ahead of time are skipped. Each step also says where on the page to look (CSS selectors, the first one shown
// wins), which the tutorial rings with MTour. Pure, no Vue, no DOM.
import type { FlowEdge } from '@m3ui-vue/m3ui-vue/flow'
import type { PartNode, Simulator } from './sim'

export interface LessonContext {
  nodes: PartNode[]
  edges: FlowEdge[]
  sim: Simulator
  /** Things done outside the canvas */
  did: Set<string>
}
export interface Step {
  /** What to do, in a sentence */
  text: string
  /** Where to find it */
  hint?: string
  done: (x: LessonContext) => boolean
  /**
   * Done once is done for good: for what you do and then undo on purpose (a switch flipped back). Without it a step
   * is checked again all the time, so deleting a part brings back the step that asked for it
   */
  latch?: boolean
  /** What to point at, best first (selectors); none shown: the card waits at the bottom of the screen */
  target?: (x: LessonContext) => string[]
  placement?: 'top' | 'bottom' | 'left' | 'right'
}
export interface Lesson { id: string; title: string; steps: Step[]; outro: string }

/** A part in the palette, or the button that opens it */
const palette = (kind: string) => () => [`[data-part-kind="${kind}"]`, '[data-tour="parts"]']
/** A part on the canvas */
const part = (id: string | undefined) => (id ? [`[data-part-id="${id}"]`] : [])

const ofKind = (x: LessonContext, kind: string) => x.nodes.filter((n) => n.data?.kind === kind)
const count = (x: LessonContext, kind: string) => ofKind(x, kind).length
/** Whether input `i` of some part of `kind` is driven by a part of `from` */
function fed(x: LessonContext, kind: string, inputs: number[], from: string) {
  const fromIds = new Set(ofKind(x, from).map((n) => n.id))
  return ofKind(x, kind).some((n) => inputs.every((i) => x.edges.some((e) => e.target === n.id && e.targetHandle === `i${i}` && fromIds.has(e.source))))
}
/** Whether a part of `kind` drives a part of `to` */
const feeds = (x: LessonContext, kind: string, to: string) => {
  const toIds = new Set(ofKind(x, to).map((n) => n.id))
  const ids = new Set(ofKind(x, kind).map((n) => n.id))
  return x.edges.some((e) => ids.has(e.source) && toIds.has(e.target))
}
/** A switch that's on */
const on = (x: LessonContext, id: string) => !!x.sim.output(id, 0)?.v
/** The first part of `kind` that doesn't drive a part of `to` yet (else the first one) */
function notFeeding(x: LessonContext, kind: string, to: string) {
  const toIds = new Set(ofKind(x, to).map((n) => n.id))
  const all = ofKind(x, kind)
  return (all.find((n) => !x.edges.some((e) => e.source === n.id && toIds.has(e.target))) ?? all[0])?.id
}
const lit = (x: LessonContext, id: string) => {
  const s = x.sim.inputsOf(id)[0]
  return !!s && s.k === s.m && s.v !== 0
}
/** An LED wired from `gate`, lit */
const gateLit = (x: LessonContext, gate: string) => {
  const gates = new Set(ofKind(x, gate).map((n) => n.id))
  return ofKind(x, 'led').some((led) => lit(x, led.id) && x.edges.some((e) => e.target === led.id && gates.has(e.source)))
}

export const lessons: Lesson[] = [
  {
    id: 'and',
    title: 'Your first gate',
    steps: [
      {
        text: 'Add two switches.', hint: 'Parts → Input / output → Switch. Click it twice, or drag it onto the canvas.',
        done: (x) => count(x, 'switch') >= 2, target: palette('switch'), placement: 'right',
      },
      { text: 'Add an AND gate.', hint: 'Parts → Gates → AND.', done: (x) => count(x, 'and') >= 1, target: palette('and'), placement: 'right' },
      { text: 'Add an LED, to see the result.', hint: 'Parts → Input / output → LED.', done: (x) => count(x, 'led') >= 1, target: palette('led'), placement: 'right' },
      {
        text: 'Wire each switch to one of the AND gate\'s inputs.', hint: 'Drag from the dot on this switch\'s right side to a dot on the gate\'s left side.',
        done: (x) => fed(x, 'and', [0, 1], 'switch'), target: (x) => part(notFeeding(x, 'switch', 'and')), placement: 'bottom',
      },
      {
        text: 'Wire the AND gate\'s output to the LED.', hint: 'From the dot on the gate\'s right to the LED\'s.',
        done: (x) => feeds(x, 'and', 'led'), target: (x) => part(ofKind(x, 'and')[0]?.id), placement: 'bottom',
      },
      {
        text: 'Turn both switches on.', hint: 'Click a switch to flip it. The LED lights only while both are on: that\'s AND.',
        done: (x) => gateLit(x, 'and'), latch: true, placement: 'bottom',
        target: (x) => part((ofKind(x, 'switch').find((n) => !on(x, n.id)) ?? ofKind(x, 'led')[0])?.id),
      },
    ],
    outro: 'That\'s a logic gate: its output is 1 only when both inputs are. Wires turn bright when they carry a 1.',
  },
  {
    id: 'half-adder',
    title: 'A half adder',
    steps: [
      { text: 'Add an XOR gate next to the AND.', hint: 'Parts → Gates → XOR.', done: (x) => count(x, 'xor') >= 1, target: palette('xor'), placement: 'right' },
      {
        text: 'Wire both switches into the XOR as well.', hint: 'An output can feed many inputs: drag from this switch\'s dot again (or from its wire, to branch it).',
        done: (x) => fed(x, 'xor', [0, 1], 'switch'), target: (x) => part(notFeeding(x, 'switch', 'xor')), placement: 'bottom',
      },
      {
        text: 'Add a second LED and wire the XOR to it.', hint: 'Parts → Input / output → LED, then from the XOR\'s right dot to it.',
        done: (x) => count(x, 'led') >= 2 && feeds(x, 'xor', 'led'),
        target: (x) => (count(x, 'led') < 2 ? palette('led')() : part(ofKind(x, 'xor')[0]?.id)), placement: 'right',
      },
      {
        text: 'Turn exactly one switch on.', hint: 'XOR is 1 when its inputs differ.',
        done: (x) => gateLit(x, 'xor') && !gateLit(x, 'and'), latch: true, placement: 'bottom',
        target: (x) => {
          const sw = ofKind(x, 'switch')
          const lit = sw.filter((n) => on(x, n.id))
          // Both on: turn one off; none on: turn one on
          return part((lit.length > 1 ? lit[0] : sw[0])?.id)
        },
      },
      {
        text: 'Open the truth table.', hint: 'It tries every combination of the switches for you.',
        done: (x) => x.did.has('table'), latch: true, target: () => ['[data-tour="table"]'], placement: 'bottom',
      },
    ],
    outro: 'You built a half adder: XOR is the sum bit, AND the carry. 1 + 1 = 10 in binary. Chain them with ORs and you get the 4-bit adder in the gallery.',
  },
]
