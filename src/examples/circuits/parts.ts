// Every kind of part: its pins (which can depend on its parameters), how it computes its outputs from its inputs,
// and the state it keeps (flip-flops, registers, memories, inputs the user flips). Pure, no Vue.
import { all, and, isZ, known, knownSig, mask, not, on, or, sig, signedOf, triggered, X, xor, Z, type Sig, type Trigger } from './logic'
import { bitsFor, devices, sounds, type ColorMode } from './devices'
import { cellsOf } from './memory'
import { getCircuit, interfaceOf } from './library'

export type Category = 'io' | 'sound' | 'gates' | 'plexers' | 'arithmetic' | 'memory' | 'wiring' | 'circuits'
export type ShiftMode = 'shl' | 'shr' | 'sar' | 'rol' | 'ror'

export interface Params {
  /** Bits per pin */
  width?: number
  /** A gate's inputs */
  inputs?: number
  /** Select bits (mux, demux, decoder) or address bits (RAM, ROM) */
  select?: number
  /** Splitter/merger: how many equal parts */
  parts?: number
  /** Constant / input pin value */
  value?: number
  /** LED color role */
  color?: 'primary' | 'tertiary' | 'error' | 'secondary'
  /** ROM/RAM contents written inline (presets); turned into an image when the circuit loads */
  contents?: number[]
  /** ROM/RAM: the id of the image holding its words (RAM: what it starts with), see memory.ts */
  image?: string
  /** RAM: every address a word, or a byte (with a `size` input: byte, half, word) */
  addressing?: 'word' | 'byte'
  /** Screen: size in pixels; terminal: size in characters */
  cols?: number
  rows?: number
  /** Screen: how the color input reads */
  mode?: ColorMode
  /** Screen: px per pixel on the canvas (0: as big as fits 256px) */
  pixel?: number
  /** Screen: draws into a hidden buffer, shown on each vsync rising edge (no half-drawn frames) */
  buffered?: boolean
  /** Joypad: a byte of buttons, or a NES-style shift register (strobe, clk → data) */
  serial?: boolean
  /** ROM: show the Tiny8 mnemonic next to each word */
  asm?: boolean
  /** Subcircuit: the circuit it places */
  circuit?: string
  /** Bit extender: the output width; bit selector: the group it picks */
  to?: number
  /** Bit extender: copies the sign bit (else fills with 0s); probe: shows decimal as signed */
  signed?: boolean
  /** Shifter: which way */
  shift?: ShiftMode
  /** Synthesizer: the pitch input as a MIDI note (7 bits) or in Hz (16 bits) */
  pitch?: 'note' | 'hz'
  /** Buzzer: its pitch in Hz */
  freq?: number
  /** PCM speaker: samples per second */
  rate?: number
  /**
   * Splitter: for each bit of the bus (low first), the output it goes to (-1: none); merger: the input it comes
   * from. Unset: `parts` contiguous parts as equal as they can be (low bits first)
   */
  map?: number[]
  /** RAM/ROM in byte addressing: a 2-bit size input, or one enable per byte (be0…, as Logisim Evolution) */
  bytes?: 'size' | 'enables'
  /** RAM/ROM in byte addressing: a pin per byte (Q0…, D0…) instead of one bus as wide as the word */
  bytePins?: boolean
  /** Plexers: an `en` input; RAM/ROM: an `oe` input (0 lets go of the output) */
  enable?: boolean
  /** Plexers: what isn't picked (or everything while disabled) floats (Z) instead of being 0 */
  tristate?: boolean
  /** Gate: the inputs with a bubble (bit i: input i) */
  negate?: number
  /** XOR/XNOR with more than two inputs: odd parity (as chained XORs), or exactly one input at 1 */
  xorMode?: 'odd' | 'one'
  /** Flip-flops, registers, counters: an edge of the clock, or its level (D flip-flop and register: a latch) */
  trigger?: Trigger
  /** Counter: the highest value it reaches (0: all ones) */
  max?: number
  /** Counter: past the top (or below 0 counting down): wrap around, stay there, or load D */
  overflow?: 'wrap' | 'stay' | 'load'
  /** Counter: D and load inputs */
  loadable?: boolean
  /** Counter: an up input (1 counts up, 0 down; unconnected up) */
  updown?: boolean
  /** Clock: ticks (half periods of the bar's frequency) high, ticks low, and ticks it starts late */
  high?: number
  low?: number
  phase?: number
  /** Pull resistor: what floating bits become */
  pull?: 0 | 1
  /** Bit finder: what it looks for */
  find?: 'low1' | 'high1' | 'low0' | 'high0'
  /** Probe: the base it shows (auto: hex for buses, the bit for one wire) */
  radix?: 'auto' | 'bin' | 'oct' | 'dec' | 'hex'
}

export interface Pin { name: string; width: number }

/** What a part's eval gets: its inputs' signals, its own state, and its parameters */
export interface EvalCtx { in: Sig[]; state: any; p: Params }

export interface PartDef {
  kind: string
  label: string
  icon: string
  category: Category
  description: string
  /** Defaults of the parameters the inspector lets you change */
  params: Params
  /** Which parameters the inspector shows */
  edit?: (keyof Params)[]
  pins(p: Params): { inputs: Pin[]; outputs: Pin[] }
  /** Its state when added (or reset) */
  init?(p: Params): any
  /** The outputs from the inputs; may update its own state (a clock edge) */
  eval(c: EvalCtx): Sig[]
  /** Drawn as a gate shape rather than a box */
  gate?: 'and' | 'or' | 'xor' | 'not' | 'buf' | 'tri'
  /** A bubble on the output */
  inverted?: boolean
}

const w = (p: Params) => p.width ?? 1
const range = <T>(n: number, f: (i: number) => T): T[] => Array.from({ length: n }, (_, i) => f(i))
const bus = (n: number, prefix = '') => range(n, (i) => ({ name: `${prefix}${i}`, width: 1 }))

function gate(kind: string, label: string, icon: string, shape: PartDef['gate'], fn: (a: Sig, b: Sig, m: number) => Sig, inverted = false, description = ''): PartDef {
  return {
    kind,
    label,
    icon,
    category: 'gates',
    description,
    gate: shape,
    inverted,
    params: { inputs: 2, width: 1, negate: 0, ...(shape === 'xor' && { xorMode: 'odd' as const }) },
    edit: ['inputs', 'width', 'negate', ...(shape === 'xor' ? (['xorMode'] as const) : [])],
    pins: (p) => ({ inputs: range(p.inputs ?? 2, (i) => ({ name: `in${i}`, width: w(p) })), outputs: [{ name: 'out', width: w(p) }] }),
    eval: ({ in: ins, p }) => {
      const m = mask(w(p))
      const neg = p.negate ?? 0
      if (shape === 'xor' && p.xorMode === 'one') {
        const out = exactlyOne(ins, neg, m)
        return [!out ? X(m) : inverted ? not(out, m) : out]
      }
      // Unconnected inputs are left out, as in Logisim
      let out: Sig | null = null
      for (let i = 0; i < ins.length; i++) {
        let s = ins[i]!
        if (isZ(s)) continue
        if (neg & (1 << i)) s = not(s, m)
        out = out ? fn(out, s, m) : s
      }
      return [!out ? X(m) : inverted ? not(out, m) : out]
    },
  }
}

/** Per bit, 1 when exactly one of the (connected) inputs is 1; null when none is connected */
function exactlyOne(ins: Sig[], neg: number, m: number): Sig | null {
  let one = 0
  let two = 0
  let unknown = 0
  let any = false
  for (let i = 0; i < ins.length; i++) {
    let s = ins[i]!
    if (isZ(s)) continue
    if (neg & (1 << i)) s = not(s, m)
    any = true
    const ones = s.v & s.k
    two |= one & ones
    one |= ones
    unknown |= ~s.k & m
  }
  if (!any) return null
  // Two 1s settle a bit to 0 whatever the rest are; otherwise it's known only if every input's bit is
  const k = ((two | ~unknown) & m) >>> 0
  return sig(m, (one & ~two & k) >>> 0, k, (m & ~k) >>> 0)
}

// The ALU ops that read B
const USES_B = new Set([0, 1, 2, 3, 4, 13, 14, 15])

/** A clock's level at tick `t`: `low` ticks at 0, then `high` at 1, shifted by `phase` */
export function clockAt(p: Params, t: number) {
  const low = Math.max(1, p.low ?? 1)
  const high = Math.max(1, p.high ?? 1)
  return (t + (p.phase ?? 0)) % (low + high) >= low ? 1 : 0
}

/** A plexer's optional en input */
const enPin = (p: Params): Pin[] => (p.enable ? [{ name: 'en', width: 1 }] : [])
/** Whether a plexer is enabled: true without an en input (or with it unconnected), null when it's unknown */
const enabled = (p: Params, en: Sig | undefined) => (!p.enable || !en || isZ(en) ? true : known(en) ? en.v === 1 : null)
/** What a plexer's unpicked outputs carry: 0, or Z when it's tri-state */
const idle = (p: Params, m: number) => (p.tristate ? Z(m) : knownSig(m, 0))

// ── Splitters ──
export interface SplitPlan {
  /** Per part (output of a splitter, input of a merger): its bits of the bus, low first */
  groups: number[][]
  /** Its pin's width (1 for a part with no bits, which floats) */
  widths: number[]
  /** The bus bit it starts at when its bits are consecutive, else -1 */
  starts: number[]
  names: string[]
}
/** Bits as short text: 0–3, 7, 9–10 */
export function bitNames(bits: number[]) {
  const out: string[] = []
  for (let i = 0; i < bits.length; i++) {
    let j = i
    while (j + 1 < bits.length && bits[j + 1] === bits[j]! + 1) j++
    out.push(j === i ? `${bits[i]}` : `${bits[i]}–${bits[j]}`)
    i = j
  }
  return out.join(',') || '—'
}
/** `n` contiguous parts of a `width`-bit bus, as equal as they can be (the low ones a bit wider), as a map */
export const evenMap = (width: number, n: number) => {
  const map: number[] = []
  for (let o = 0; o < n; o++) for (let i = 0; i < Math.floor(width / n) + (o < width % n ? 1 : 0); i++) map.push(o)
  return map
}
/** Contiguous parts of these widths, low bits first, as a map */
export const widthsMap = (widths: number[]) => widths.flatMap((n, o) => Array.from({ length: n }, () => o))
const plans = new WeakMap<Params, SplitPlan>()
/** How a splitter or merger maps its bus, worked out once per part (the simulator keeps the same params) */
export function splitPlan(p: Params): SplitPlan {
  const have = plans.get(p)
  if (have) return have
  const width = w(p)
  const n = Math.max(1, Math.min(p.parts ?? 2, 32))
  const map = p.map ?? evenMap(width, n)
  const groups: number[][] = Array.from({ length: n }, () => [])
  for (let b = 0; b < width; b++) {
    const o = map[b] ?? -1
    if (o >= 0 && o < n) groups[o]!.push(b)
  }
  const plan: SplitPlan = {
    groups,
    widths: groups.map((g) => Math.max(1, g.length)),
    starts: groups.map((g) => (g.length && g[g.length - 1]! - g[0]! === g.length - 1 ? g[0]! : -1)),
    names: groups.map(bitNames),
  }
  plans.set(p, plan)
  return plan
}

/** A flip-flop's clear and preset, which act at once whatever the clock does (clear wins), then its outputs */
function async1(state: { q: number }, clr: Sig, pre: Sig): Sig[] {
  if (on(pre)) state.q = 1
  if (on(clr)) state.q = 0
  return [all(state.q, 1), all(state.q ^ 1, 1)]
}

// ── Memories ──
/** Where a RAM's or ROM's pins go: byte lanes, the size or enable inputs, one data bus or a pin per byte */
interface MemLayout { lanes: number; lanesOut: number; selPins: Pin[]; enables: boolean; dataPins: (prefix: string) => Pin[] }
function memLayout(p: Params): MemLayout {
  const width = w(p)
  if (p.addressing !== 'byte') return { lanes: 1, lanesOut: 1, selPins: [], enables: false, dataPins: (n) => [{ name: n, width }] }
  const lanes = Math.max(1, Math.floor(width / 8))
  const enables = p.bytes === 'enables'
  const split = !!p.bytePins && lanes > 1
  return {
    lanes,
    lanesOut: split ? lanes : 1,
    enables,
    selPins: enables ? range(lanes, (i) => ({ name: `be${i}`, width: 1 })) : [{ name: 'size', width: 2 }],
    dataPins: (n) => (split ? range(lanes, (i) => ({ name: `${n}${i}`, width: 8 })) : [{ name: n, width }]),
  }
}
/**
 * The byte lanes a byte-addressed access moves, as a bit mask (lane i: the byte at A + i, bits 8i…8i+7), or null
 * when that's unknown. Size: 0 one byte, 1 two, 2 or 3 four, never wider than the data (unconnected: all of it).
 * Enables: each be that's 1 or unconnected
 */
function lanesOf(L: MemLayout, sel: Sig[]): number | null {
  if (L.enables) {
    let lanes = 0
    for (let i = 0; i < L.lanes; i++) {
      const be = sel[i]!
      if (!isZ(be) && !known(be)) return null
      if (on(be, true)) lanes |= 1 << i
    }
    return lanes
  }
  const size = sel[0]!
  if (isZ(size)) return 2 ** L.lanes - 1
  if (!known(size)) return null
  return 2 ** Math.min(L.lanes, 2 ** Math.min(size.v, 2)) - 1
}
/** What a memory puts out at address `a`: the word, or the lanes picked (the others 0); Z while oe is 0 */
function memRead(p: Params, L: MemLayout, cells: ArrayLike<number>, a: Sig, sel: Sig[], oe: Sig | undefined): Sig[] {
  const width = w(p)
  const outs = (f: (m: number) => Sig) => (L.lanesOut > 1 ? range(L.lanesOut, () => f(0xff)) : [f(mask(width))])
  if (oe && !isZ(oe)) {
    if (!known(oe)) return outs(X)
    if (!oe.v) return outs(Z)
  }
  if (!known(a)) return outs(X)
  if (p.addressing !== 'byte') return [all(cells[a.v] ?? 0, width)]
  const lanes = lanesOf(L, sel)
  if (lanes === null) return outs(X)
  const n = cells.length
  const byte = (i: number) => (lanes & (1 << i) ? cells[(a.v + i) % n] ?? 0 : 0)
  if (L.lanesOut > 1) return range(L.lanes, (i) => all(byte(i), 8))
  let v = 0
  for (let i = 0; i < L.lanes; i++) v += byte(i) * 2 ** (8 * i)
  return [all(v, width)]
}

const TINY8 = ['OUT', 'LDA', 'ADD', 'SUB', 'STA', 'LDI', 'JMP', 'JZ']
export const disassemble = (word: number) => `${TINY8[(word >> 4) & 7]} ${word & 15}`

export const parts: PartDef[] = [
  // ── Input / output ──────────────────────────────────────────────────────────────────────────────────────
  {
    kind: 'switch', label: 'Switch', icon: 'toggle_on', category: 'io', description: 'A bit you flip with a click',
    params: {}, pins: () => ({ inputs: [], outputs: [{ name: 'out', width: 1 }] }),
    init: () => ({ value: 0 }),
    eval: ({ state }) => [all(state.value, 1)],
  },
  {
    kind: 'button', label: 'Button', icon: 'radio_button_checked', category: 'io', description: '1 while you hold it down',
    params: {}, pins: () => ({ inputs: [], outputs: [{ name: 'out', width: 1 }] }),
    init: () => ({ value: 0 }),
    eval: ({ state }) => [all(state.value, 1)],
  },
  {
    kind: 'pin', label: 'Input pin', icon: 'input', category: 'io', description: 'Several bits, each flipped with a click; in a circuit used as a subcircuit, one of its inputs (named by its label)',
    params: { width: 4 }, edit: ['width'], pins: (p) => ({ inputs: [], outputs: [{ name: 'out', width: w(p) }] }),
    init: () => ({ value: 0 }),
    eval: ({ state, p }) => [all(state.value & mask(w(p)), w(p))],
  },
  {
    kind: 'const', label: 'Constant', icon: 'pin', category: 'io', description: 'A fixed value',
    params: { width: 1, value: 1 }, edit: ['width', 'value'], pins: (p) => ({ inputs: [], outputs: [{ name: 'out', width: w(p) }] }),
    eval: ({ p }) => [all((p.value ?? 0) & mask(w(p)), w(p))],
  },
  {
    kind: 'clock', label: 'Clock', icon: 'schedule', category: 'io', description: 'Ticks while the simulation plays: so many ticks low, so many high (a tick is half a period at the bar\'s frequency), started late by its phase',
    params: { high: 1, low: 1, phase: 0 }, edit: ['high', 'low', 'phase'], pins: () => ({ inputs: [], outputs: [{ name: 'clk', width: 1 }] }),
    init: (p) => ({ value: clockAt(p, 0), t: 0 }),
    eval: ({ state }) => [all(state.value, 1)],
  },
  {
    kind: 'led', label: 'LED', icon: 'lightbulb', category: 'io', description: 'Lights up on 1',
    params: { color: 'primary' }, edit: ['color'], pins: () => ({ inputs: [{ name: 'in', width: 1 }], outputs: [] }),
    eval: () => [],
  },
  {
    kind: 'probe', label: 'Probe', icon: 'data_object', category: 'io', description: 'Shows a value in binary, hex and decimal (signed or not)',
    params: { width: 8, signed: false, radix: 'auto' }, edit: ['width', 'radix', 'signed'], pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }], outputs: [] }),
    eval: () => [],
  },
  {
    kind: 'outpin', label: 'Output pin', icon: 'output', category: 'io', description: 'Shows its value; in a circuit used as a subcircuit, it becomes one of its outputs (named by its label)',
    params: { width: 1 }, edit: ['width'], pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }], outputs: [] }),
    eval: () => [],
  },
  {
    kind: 'hex', label: 'Hex display', icon: 'looks_one', category: 'io', description: 'A 4-bit value as a digit, 0–F',
    params: {}, pins: () => ({ inputs: [{ name: 'in', width: 4 }], outputs: [] }),
    eval: () => [],
  },
  {
    kind: 'seg7', label: '7-segment', icon: 'timer_10', category: 'io', description: 'Seven segments, a to g, each its own bit',
    params: {}, pins: () => ({ inputs: bus(7).map((_, i) => ({ name: 'abcdefg'[i]!, width: 1 })), outputs: [] }),
    eval: () => [],
  },
  ...devices,
  ...sounds,

  // ── Gates ───────────────────────────────────────────────────────────────────────────────────────────────
  gate('and', 'AND', 'join_inner', 'and', and, false, '1 when every input is 1'),
  gate('or', 'OR', 'join_full', 'or', or, false, '1 when any input is 1'),
  gate('nand', 'NAND', 'join_inner', 'and', and, true, '0 only when every input is 1'),
  gate('nor', 'NOR', 'join_full', 'or', or, true, '1 only when every input is 0'),
  gate('xor', 'XOR', 'join', 'xor', xor, false, '1 when an odd number of inputs are 1'),
  gate('xnor', 'XNOR', 'join', 'xor', xor, true, '1 when an even number of inputs are 1'),
  {
    kind: 'not', label: 'NOT', icon: 'swap_vert', category: 'gates', description: 'Flips every bit', gate: 'not', inverted: true,
    params: { width: 1 }, edit: ['width'], pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }], outputs: [{ name: 'out', width: w(p) }] }),
    eval: ({ in: [a], p }) => [not(a!, mask(w(p)))],
  },
  {
    kind: 'buffer', label: 'Buffer', icon: 'arrow_right_alt', category: 'gates', description: 'Passes its input on', gate: 'buf',
    params: { width: 1 }, edit: ['width'], pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }], outputs: [{ name: 'out', width: w(p) }] }),
    eval: ({ in: [a], p }) => [isZ(a!) ? X(mask(w(p))) : a!],
  },
  {
    kind: 'tristate', label: 'Tri-state', icon: 'call_split', category: 'gates', description: 'Passes its input on while enabled, else lets go of the wire (Z), so several can share a bus', gate: 'tri',
    params: { width: 1 }, edit: ['width'], pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }, { name: 'en', width: 1 }], outputs: [{ name: 'out', width: w(p) }] }),
    eval: ({ in: [a, en], p }) => {
      const m = mask(w(p))
      if (!known(en!)) return [X(m)]
      return [en!.v ? (isZ(a!) ? X(m) : a!) : Z(m)]
    },
  },

  // ── Plexers ─────────────────────────────────────────────────────────────────────────────────────────────
  {
    kind: 'mux', label: 'Multiplexer', icon: 'merge', category: 'plexers', description: 'Passes on the input the select picks; with an enable, 0 (or Z) while en is 0',
    params: { select: 1, width: 1, enable: false, tristate: false }, edit: ['select', 'width', 'enable', 'tristate'],
    pins: (p) => ({
      inputs: [...range(2 ** (p.select ?? 1), (i) => ({ name: `${i}`, width: w(p) })), { name: 'sel', width: p.select ?? 1 }, ...enPin(p)],
      outputs: [{ name: 'out', width: w(p) }],
    }),
    eval: ({ in: ins, p }) => {
      const n = 2 ** (p.select ?? 1)
      const m = mask(w(p))
      const en = enabled(p, ins[n + 1])
      if (en === null) return [X(m)]
      if (!en) return [idle(p, m)]
      const sel = ins[n]!
      if (!known(sel)) return [X(m)]
      return [ins[sel.v]!]
    },
  },
  {
    kind: 'demux', label: 'Demultiplexer', icon: 'call_split', category: 'plexers', description: 'Sends its input to the output the select picks; the others are 0 (or Z)',
    params: { select: 1, width: 1, enable: false, tristate: false }, edit: ['select', 'width', 'enable', 'tristate'],
    pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }, { name: 'sel', width: p.select ?? 1 }, ...enPin(p)], outputs: range(2 ** (p.select ?? 1), (i) => ({ name: `${i}`, width: w(p) })) }),
    eval: ({ in: [a, sel, enIn], p }) => {
      const n = 2 ** (p.select ?? 1)
      const m = mask(w(p))
      const en = enabled(p, enIn)
      if (en === null || (en && !known(sel!))) return Array.from({ length: n }, () => X(m))
      return Array.from({ length: n }, (_, i) => (en && i === sel!.v ? a! : idle(p, m)))
    },
  },
  {
    kind: 'decoder', label: 'Decoder', icon: 'alt_route', category: 'plexers', description: 'Sets the one output the select picks to 1; the others are 0 (or Z)',
    params: { select: 2, enable: false, tristate: false }, edit: ['select', 'enable', 'tristate'],
    pins: (p) => ({ inputs: [{ name: 'sel', width: p.select ?? 2 }, ...enPin(p)], outputs: range(2 ** (p.select ?? 2), (i) => ({ name: `${i}`, width: 1 })) }),
    eval: ({ in: [sel, enIn], p }) => {
      const n = 2 ** (p.select ?? 2)
      const en = enabled(p, enIn)
      if (en === null || (en && !known(sel!))) return Array.from({ length: n }, () => X(1))
      return Array.from({ length: n }, (_, i) => (en && i === sel!.v ? all(1, 1) : idle(p, 1)))
    },
  },

  {
    kind: 'prienc', label: 'Priority encoder', icon: 'low_priority', category: 'plexers', description: 'The number of the highest input that is 1; valid is 0 when none is (or while en is 0)',
    params: { select: 2, enable: false }, edit: ['select', 'enable'],
    pins: (p) => ({ inputs: [...range(2 ** (p.select ?? 2), (i) => ({ name: `${i}`, width: 1 })), ...enPin(p)], outputs: [{ name: 'out', width: p.select ?? 2 }, { name: 'valid', width: 1 }] }),
    eval: ({ in: ins, p }) => {
      const n = 2 ** (p.select ?? 2)
      const en = enabled(p, ins[n])
      if (en === null) return [X(mask(p.select ?? 2)), X(1)]
      if (en) for (let i = n - 1; i >= 0; i--) {
        if (on(ins[i]!)) return [all(i, p.select ?? 2), all(1, 1)]
        if (!isZ(ins[i]!) && !known(ins[i]!)) return [X(mask(p.select ?? 2)), X(1)]
      }
      return [all(0, p.select ?? 2), all(0, 1)]
    },
  },
  {
    kind: 'bitsel', label: 'Bit selector', icon: 'filter_center_focus', category: 'plexers', description: 'Picks one group of bits out of a bus: group sel of the given size, low bits first',
    params: { width: 8, to: 1 }, edit: ['width', 'to'],
    pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }, { name: 'sel', width: bitsFor(w(p) / (p.to ?? 1)) }], outputs: [{ name: 'out', width: p.to ?? 1 }] }),
    eval: ({ in: [a, sel], p }) => {
      const to = p.to ?? 1
      const m = mask(to)
      if (!known(sel!) || sel!.v >= w(p) / to) return [X(m)]
      const part = (x: number) => (Math.floor(x / 2 ** (sel!.v * to)) & m) >>> 0
      return [{ m, v: part(a!.v), k: part(a!.k), e: part(a!.e) }]
    },
  },

  // ── Arithmetic ──────────────────────────────────────────────────────────────────────────────────────────
  {
    kind: 'adder', label: 'Adder', icon: 'add', category: 'arithmetic', description: 'A + B + carry in, with a carry out',
    params: { width: 8 }, edit: ['width'],
    pins: (p) => ({ inputs: [{ name: 'A', width: w(p) }, { name: 'B', width: w(p) }, { name: 'cin', width: 1 }], outputs: [{ name: 'sum', width: w(p) }, { name: 'cout', width: 1 }] }),
    eval: ({ in: [a, b, c], p }) => {
      const m = mask(w(p))
      if (!known(a!) || !known(b!) || (!isZ(c!) && !known(c!))) return [X(m), X(1)]
      const s = a!.v + b!.v + (isZ(c!) ? 0 : c!.v)
      return [all(s % (m + 1), w(p)), all(s > m ? 1 : 0, 1)]
    },
  },
  {
    kind: 'subtractor', label: 'Subtractor', icon: 'remove', category: 'arithmetic', description: 'A − B − borrow in, with a borrow out',
    params: { width: 8 }, edit: ['width'],
    pins: (p) => ({ inputs: [{ name: 'A', width: w(p) }, { name: 'B', width: w(p) }, { name: 'bin', width: 1 }], outputs: [{ name: 'diff', width: w(p) }, { name: 'bout', width: 1 }] }),
    eval: ({ in: [a, b, c], p }) => {
      const m = mask(w(p))
      if (!known(a!) || !known(b!) || (!isZ(c!) && !known(c!))) return [X(m), X(1)]
      const d = a!.v - b!.v - (isZ(c!) ? 0 : c!.v)
      return [all(((d % (m + 1)) + m + 1) % (m + 1), w(p)), all(d < 0 ? 1 : 0, 1)]
    },
  },
  {
    kind: 'comparator', label: 'Comparator', icon: 'compare_arrows', category: 'arithmetic', description: 'Whether A is less than, equal to or greater than B (unsigned, or as two\'s complement)',
    params: { width: 8, signed: false }, edit: ['width', 'signed'],
    pins: (p) => ({ inputs: [{ name: 'A', width: w(p) }, { name: 'B', width: w(p) }], outputs: [{ name: '<', width: 1 }, { name: '=', width: 1 }, { name: '>', width: 1 }] }),
    eval: ({ in: [a, b], p }) => {
      if (!known(a!) || !known(b!)) return [X(1), X(1), X(1)]
      const A = p.signed ? signedOf(a!.v, w(p)) : a!.v
      const B = p.signed ? signedOf(b!.v, w(p)) : b!.v
      return [all(+(A < B), 1), all(+(A === B), 1), all(+(A > B), 1)]
    },
  },

  {
    kind: 'alu', label: 'ALU', icon: 'calculate', category: 'arithmetic',
    description: 'The operation op picks, on A and B, with zero, negative, carry and overflow flags. Ops: 0 A+B+cin, 1 A−B−cin, 2 AND, 3 OR, 4 XOR, 5 NOT A, 6 A<<1, 7 A>>1, 8 A>>1 signed, 9 rotate left, 10 rotate right, 11 A+1, 12 A−1, 13 B, 14 A×B (low half), 15 A−B flags only (Y = A)',
    params: { width: 8 }, edit: ['width'],
    pins: (p) => ({
      inputs: [{ name: 'A', width: w(p) }, { name: 'B', width: w(p) }, { name: 'op', width: 4 }, { name: 'cin', width: 1 }],
      outputs: [{ name: 'Y', width: w(p) }, { name: 'Z', width: 1 }, { name: 'N', width: 1 }, { name: 'C', width: 1 }, { name: 'V', width: 1 }],
    }),
    eval: ({ in: [a, b, op, cin], p }) => {
      const n = w(p)
      const m = mask(n)
      const top = 2 ** (n - 1)
      if (!known(op!) || !known(a!) || (USES_B.has(op!.v) && !known(b!)) || (!isZ(cin!) && !known(cin!)))
        return [X(m), X(1), X(1), X(1), X(1)]
      const A = a!.v
      const B = b!.v
      const ci = isZ(cin!) ? 0 : cin!.v
      const sign = (x: number) => (x >= top ? 1 : 0)
      let y = 0
      let c = 0
      let v = 0
      switch (op!.v) {
        case 0: { const s = A + B + ci; y = s % (m + 1); c = +(s > m); v = +(sign(A) === sign(B) && sign(y) !== sign(A)); break }
        case 1: case 15: { const d = A - B - ci; y = ((d % (m + 1)) + m + 1) % (m + 1); c = +(d < 0); v = +(sign(A) !== sign(B) && sign(y) !== sign(A)); break }
        case 2: y = (A & B) >>> 0; break
        case 3: y = (A | B) >>> 0; break
        case 4: y = (A ^ B) >>> 0; break
        case 5: y = (~A & m) >>> 0; break
        case 6: y = (A * 2) % (m + 1); c = sign(A); break
        case 7: y = Math.floor(A / 2); c = A & 1; break
        case 8: y = Math.floor(A / 2) + (A & top); c = A & 1; break
        case 9: y = ((A * 2) % (m + 1)) + sign(A); c = sign(A); break
        case 10: y = Math.floor(A / 2) + (A & 1) * top; c = A & 1; break
        case 11: y = (A + 1) % (m + 1); c = +(A === m); v = +(A === top - 1); break
        case 12: y = (A + m) % (m + 1); c = +(A === 0); v = +(A === top); break
        case 13: y = B; break
        case 14: { const prod = BigInt(A) * BigInt(B); y = Number(prod & BigInt(m)); c = +(prod > BigInt(m)); break }
      }
      const res = op!.v === 15 ? A : y
      return [all(res, n), all(+(y === 0), 1), all(sign(y), 1), all(c, 1), all(v, 1)]
    },
  },
  {
    kind: 'multiplier', label: 'Multiplier', icon: 'close', category: 'arithmetic', description: 'A × B (unsigned, or as two\'s complement): the low half and the high half of the product',
    params: { width: 8, signed: false }, edit: ['width', 'signed'],
    pins: (p) => ({ inputs: [{ name: 'A', width: w(p) }, { name: 'B', width: w(p) }], outputs: [{ name: 'lo', width: w(p) }, { name: 'hi', width: w(p) }] }),
    eval: ({ in: [a, b], p }) => {
      const m = mask(w(p))
      if (!known(a!) || !known(b!)) return [X(m), X(m)]
      const n = w(p)
      const prod = p.signed ? BigInt.asUintN(2 * n, BigInt(signedOf(a!.v, n)) * BigInt(signedOf(b!.v, n))) : BigInt(a!.v) * BigInt(b!.v)
      return [all(Number(prod & BigInt(m)), n), all(Number(prod >> BigInt(n)), n)]
    },
  },
  {
    kind: 'divider', label: 'Divider', icon: 'percent', category: 'arithmetic', description: 'A ÷ B (unsigned, or as two\'s complement rounding toward 0): quotient and remainder. Dividing by 0 gives all ones and A',
    params: { width: 8, signed: false }, edit: ['width', 'signed'],
    pins: (p) => ({ inputs: [{ name: 'A', width: w(p) }, { name: 'B', width: w(p) }], outputs: [{ name: 'Q', width: w(p) }, { name: 'R', width: w(p) }] }),
    eval: ({ in: [a, b], p }) => {
      const m = mask(w(p))
      if (!known(a!) || !known(b!)) return [X(m), X(m)]
      if (!b!.v) return [all(m, w(p)), a!]
      if (p.signed) {
        const n = w(p)
        const A = signedOf(a!.v, n)
        const B = signedOf(b!.v, n)
        const q = Math.trunc(A / B)
        const wrap = (x: number) => ((x % 2 ** n) + 2 ** n) % 2 ** n
        return [all(wrap(q), n), all(wrap(A - q * B), n)]
      }
      return [all(Math.floor(a!.v / b!.v), w(p)), all(a!.v % b!.v, w(p))]
    },
  },
  {
    kind: 'negator', label: 'Negator', icon: 'exposure_neg_1', category: 'arithmetic', description: 'Two\'s complement: −A',
    params: { width: 8 }, edit: ['width'],
    pins: (p) => ({ inputs: [{ name: 'A', width: w(p) }], outputs: [{ name: '−A', width: w(p) }] }),
    eval: ({ in: [a], p }) => {
      const m = mask(w(p))
      return [known(a!) ? all((m + 1 - a!.v) % (m + 1), w(p)) : X(m)]
    },
  },
  {
    kind: 'shifter', label: 'Shifter', icon: 'keyboard_double_arrow_left', category: 'arithmetic', description: 'Shifts or rotates the input by dist bits: left, right, right keeping the sign, or rotating',
    params: { width: 8, shift: 'shl' }, edit: ['width', 'shift'],
    pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }, { name: 'dist', width: bitsFor(w(p)) }], outputs: [{ name: 'out', width: w(p) }] }),
    eval: ({ in: [a, d], p }) => {
      const n = w(p)
      const m = mask(n)
      if (!known(a!) || !known(d!)) return [X(m)]
      const k = d!.v
      const A = BigInt(a!.v)
      const M = BigInt(m)
      const K = BigInt(Math.min(k, n))
      const r = BigInt(k % n)
      const N = BigInt(n)
      let y: bigint
      switch (p.shift ?? 'shl') {
        case 'shr': y = A >> K; break
        case 'sar': { const neg = a!.v >= 2 ** (n - 1); y = neg ? ((A | ~M) >> K) & M : A >> K; break }
        case 'rol': y = ((A << r) | (A >> ((N - r) % N))) & M; break
        case 'ror': y = ((A >> r) | (A << ((N - r) % N))) & M; break
        default: y = (A << K) & M
      }
      return [all(Number(y & M), n)]
    },
  },

  {
    kind: 'bitadder', label: 'Bit adder', icon: 'functions', category: 'arithmetic', description: 'How many of the input\'s bits are 1',
    params: { width: 8 }, edit: ['width'],
    pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }], outputs: [{ name: 'count', width: bitsFor(w(p) + 1) }] }),
    eval: ({ in: [a], p }) => {
      const out = bitsFor(w(p) + 1)
      if (!known(a!)) return [X(mask(out))]
      let v = a!.v >>> 0
      let n = 0
      while (v) {
        n += v & 1
        v >>>= 1
      }
      return [all(n, out)]
    },
  },
  {
    kind: 'bitfinder', label: 'Bit finder', icon: 'manage_search', category: 'arithmetic', description: 'Where the lowest or highest 1 (or 0) of the input is; found is 0 when there is none',
    params: { width: 8, find: 'low1' }, edit: ['width', 'find'],
    pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }], outputs: [{ name: 'found', width: 1 }, { name: 'index', width: bitsFor(w(p)) }] }),
    eval: ({ in: [a], p }) => {
      const n = w(p)
      const out = bitsFor(n)
      if (!known(a!)) return [X(1), X(mask(out))]
      const find = p.find ?? 'low1'
      const want = find.endsWith('1') ? 1 : 0
      const high = find.startsWith('high')
      for (let j = 0; j < n; j++) {
        const i = high ? n - 1 - j : j
        if (((a!.v >>> i) & 1) === want) return [all(1, 1), all(i, out)]
      }
      return [all(0, 1), all(0, out)]
    },
  },

  // ── Memory ──────────────────────────────────────────────────────────────────────────────────────────────
  {
    kind: 'dff', label: 'D flip-flop', icon: 'memory', category: 'memory', description: 'Stores D on the clock\'s edge (or follows it while the clock is at its level: a latch); clr and pre set it to 0 and 1 at once',
    params: { trigger: 'rising' }, edit: ['trigger'],
    pins: () => ({ inputs: [{ name: 'D', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 }, { name: 'pre', width: 1 }], outputs: [{ name: 'Q', width: 1 }, { name: 'Q̅', width: 1 }] }),
    init: () => ({ q: 0 }),
    eval: ({ in: [d, clk, clr, pre], state, p }) => {
      if (triggered(state, clk!, p.trigger) && known(d!)) state.q = d!.v
      return async1(state, clr!, pre!)
    },
  },
  {
    kind: 'tff', label: 'T flip-flop', icon: 'memory', category: 'memory', description: 'Flips on the clock\'s edge while T is 1; clr and pre set it to 0 and 1 at once',
    params: { trigger: 'rising' }, edit: ['trigger'],
    pins: () => ({ inputs: [{ name: 'T', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 }, { name: 'pre', width: 1 }], outputs: [{ name: 'Q', width: 1 }, { name: 'Q̅', width: 1 }] }),
    init: () => ({ q: 0 }),
    eval: ({ in: [t, clk, clr, pre], state, p }) => {
      if (triggered(state, clk!, p.trigger) && on(t!, true)) state.q ^= 1
      return async1(state, clr!, pre!)
    },
  },
  {
    kind: 'jkff', label: 'JK flip-flop', icon: 'memory', category: 'memory', description: 'On the clock\'s edge: J sets, K resets, both flip; clr and pre set it to 0 and 1 at once',
    params: { trigger: 'rising' }, edit: ['trigger'],
    pins: () => ({ inputs: [{ name: 'J', width: 1 }, { name: 'K', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 }, { name: 'pre', width: 1 }], outputs: [{ name: 'Q', width: 1 }, { name: 'Q̅', width: 1 }] }),
    init: () => ({ q: 0 }),
    eval: ({ in: [j, k, clk, clr, pre], state, p }) => {
      if (triggered(state, clk!, p.trigger)) {
        const J = on(j!)
        const K = on(k!)
        state.q = J && K ? state.q ^ 1 : J ? 1 : K ? 0 : state.q
      }
      return async1(state, clr!, pre!)
    },
  },
  {
    kind: 'register', label: 'Register', icon: 'inventory_2', category: 'memory', description: 'Stores D on the clock\'s edge while enabled (or follows it while the clock is at its level)',
    params: { width: 8, trigger: 'rising' }, edit: ['width', 'trigger'],
    pins: (p) => ({ inputs: [{ name: 'D', width: w(p) }, { name: 'en', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 }], outputs: [{ name: 'Q', width: w(p) }] }),
    init: () => ({ q: 0 }),
    eval: ({ in: [d, en, clk, clr], state, p }) => {
      if (triggered(state, clk!, p.trigger) && on(en!, true) && known(d!)) state.q = d!.v
      if (on(clr!)) state.q = 0
      return [all(state.q, w(p))]
    },
  },
  {
    kind: 'counter', label: 'Counter', icon: 'exposure_plus_1', category: 'memory',
    description: 'Counts on the clock\'s edge while enabled, up to its maximum; past it wraps around, stays or loads D. Optionally loads D (load wins over counting) and counts down while up is 0. carry is 1 at the top (at 0 counting down)',
    params: { width: 4, trigger: 'rising', max: 0, overflow: 'wrap', loadable: false, updown: false }, edit: ['width', 'trigger', 'max', 'overflow', 'loadable', 'updown'],
    pins: (p) => ({
      inputs: [
        { name: 'en', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 },
        ...(p.loadable ? [{ name: 'D', width: w(p) }, { name: 'load', width: 1 }] : []),
        ...(p.updown ? [{ name: 'up', width: 1 }] : []),
      ],
      outputs: [{ name: 'Q', width: w(p) }, { name: 'carry', width: 1 }],
    }),
    init: () => ({ q: 0 }),
    eval: ({ in: ins, state, p }) => {
      const m = mask(w(p))
      const top = p.max ? Math.min(p.max, m) : m
      const [en, clk, clr] = ins
      const d = p.loadable ? ins[3] : undefined
      const load = p.loadable ? ins[4] : undefined
      const upIn = p.updown ? ins[p.loadable ? 5 : 3] : undefined
      const up = !upIn || on(upIn, true)
      const D = () => (d && known(d) ? d.v & m : 0)
      if (triggered(state, clk!, p.trigger)) {
        if (load && on(load)) state.q = D()
        else if (on(en!, true)) {
          const over = up ? state.q >= top : state.q <= 0
          if (!over) state.q += up ? 1 : -1
          else if (p.overflow === 'load') state.q = D()
          else if (p.overflow !== 'stay') state.q = up ? 0 : top
        }
      }
      if (on(clr!)) state.q = 0
      return [all(state.q, w(p)), all(+(up ? state.q === top : state.q === 0), 1)]
    },
  },
  {
    kind: 'pc', label: 'Program counter', icon: 'pin_end', category: 'memory', description: 'On the clock\'s edge: jumps to D while load is 1, else steps to the next address (while enabled)',
    params: { width: 4, trigger: 'rising' }, edit: ['width', 'trigger'],
    pins: (p) => ({ inputs: [{ name: 'D', width: w(p) }, { name: 'load', width: 1 }, { name: 'en', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 }], outputs: [{ name: 'PC', width: w(p) }] }),
    init: () => ({ q: 0 }),
    eval: ({ in: [d, load, en, clk, clr], state, p }) => {
      const m = mask(w(p))
      if (triggered(state, clk!, p.trigger)) {
        if (on(load!) && known(d!)) state.q = d!.v
        else if (on(en!, true)) state.q = state.q >= m ? 0 : state.q + 1
      }
      if (on(clr!)) state.q = 0
      return [all(state.q, w(p))]
    },
  },
  {
    kind: 'rom', label: 'ROM', icon: 'sd_card', category: 'memory',
    description: 'Words you write beforehand (or load from a .bin / .hex file), read by address. Byte addressing: every address is a byte and size (or one enable per byte) picks how many to read (little-endian)',
    params: { select: 4, width: 8, addressing: 'word', bytes: 'size', bytePins: false, enable: false }, edit: ['addressing', 'select', 'width', 'bytes', 'bytePins', 'enable', 'contents'],
    pins: (p) => {
      const L = memLayout(p)
      return {
        inputs: [{ name: 'A', width: p.select ?? 4 }, ...L.selPins, ...(p.enable ? [{ name: 'oe', width: 1 }] : [])],
        outputs: L.dataPins('D'),
      }
    },
    init: (p) => ({ cells: cellsOf(p.image, 2 ** (p.select ?? 4), p.addressing === 'byte' ? 8 : w(p)) }),
    eval: ({ in: ins, state, p }) => {
      const L = memLayout(p)
      const a = ins[0]!
      return memRead(p, L, state.cells, a, ins.slice(1, 1 + L.selPins.length), p.enable ? ins[1 + L.selPins.length] : undefined)
    },
  },
  {
    kind: 'ram', label: 'RAM', icon: 'memory_alt', category: 'memory',
    description: 'Read by address; writes D on the rising edge while we is 1. Byte addressing: every address is a byte and size (or one enable per byte) picks how many to read or write (little-endian)',
    params: { select: 4, width: 8, addressing: 'word', bytes: 'size', bytePins: false, enable: false }, edit: ['addressing', 'select', 'width', 'bytes', 'bytePins', 'enable', 'contents'],
    pins: (p) => {
      const L = memLayout(p)
      return {
        inputs: [
          { name: 'A', width: p.select ?? 4 },
          ...L.dataPins('D'),
          { name: 'we', width: 1 },
          { name: 'clk', width: 1 },
          ...L.selPins,
          ...(p.enable ? [{ name: 'oe', width: 1 }] : []),
        ],
        outputs: L.dataPins('Q'),
      }
    },
    // A copy of its image: what it starts with after every reset
    init: (p) => ({ mem: cellsOf(p.image, 2 ** (p.select ?? 4), p.addressing === 'byte' ? 8 : w(p)).slice() }),
    eval: ({ in: ins, state, p }) => {
      const L = memLayout(p)
      const mem = state.mem as Uint32Array
      const a = ins[0]!
      const ds = ins.slice(1, 1 + L.lanesOut)
      const we = ins[1 + L.lanesOut]!
      const clk = ins[2 + L.lanesOut]!
      const sel = ins.slice(3 + L.lanesOut, 3 + L.lanesOut + L.selPins.length)
      const oe = p.enable ? ins[3 + L.lanesOut + L.selPins.length] : undefined
      const edge = triggered(state, clk)
      if (edge && on(we) && known(a)) {
        if (p.addressing !== 'byte') {
          if (known(ds[0]!)) mem[a.v] = ds[0]!.v
        } else {
          const lanes = lanesOf(L, sel)
          if (lanes !== null) {
            const n = mem.length
            for (let i = 0; i < L.lanes; i++) {
              if (!(lanes & (1 << i))) continue
              const byte = L.lanesOut > 1 ? (known(ds[i]!) ? ds[i]!.v : -1) : known(ds[0]!) ? Math.floor(ds[0]!.v / 2 ** (8 * i)) & 0xff : -1
              if (byte >= 0) mem[(a.v + i) % n] = byte
            }
          }
        }
      }
      return memRead(p, L, mem, a, sel, oe)
    },
  },
  {
    kind: 'shiftreg', label: 'Shift register', icon: 'low_priority', category: 'memory',
    description: 'On the clock\'s edge while enabled: shifts left, D coming in at bit 0 and the top bit going out; load 1 takes P instead',
    params: { width: 8, trigger: 'rising' }, edit: ['width', 'trigger'],
    pins: (p) => ({
      inputs: [{ name: 'D', width: 1 }, { name: 'P', width: w(p) }, { name: 'load', width: 1 }, { name: 'en', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 }],
      outputs: [{ name: 'Q', width: w(p) }, { name: 'out', width: 1 }],
    }),
    init: () => ({ q: 0 }),
    eval: ({ in: [d, par, load, en, clk, clr], state, p }) => {
      const m = mask(w(p))
      if (triggered(state, clk!, p.trigger) && on(en!, true)) {
        if (on(load!)) { if (known(par!)) state.q = par!.v }
        else state.q = ((state.q * 2) & m) + (on(d!) ? 1 : 0)
      }
      if (on(clr!)) state.q = 0
      return [all(state.q, w(p)), all(Math.floor(state.q / 2 ** (w(p) - 1)) & 1, 1)]
    },
  },
  {
    kind: 'random', label: 'Random', icon: 'casino', category: 'memory', description: 'A new pseudo-random value on every clock edge while enabled (a xorshift generator; clr restarts it)',
    params: { width: 8, trigger: 'rising' }, edit: ['width', 'trigger'],
    pins: (p) => ({ inputs: [{ name: 'en', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 }], outputs: [{ name: 'Q', width: w(p) }] }),
    init: () => ({ s: 0x2545f491, q: 0 }),
    eval: ({ in: [en, clk, clr], state, p }) => {
      if (triggered(state, clk!, p.trigger) && on(en!, true)) {
        let x = state.s
        x ^= x << 13
        x ^= x >>> 17
        x ^= x << 5
        state.s = x >>> 0
        state.q = (state.s & mask(w(p))) >>> 0
      }
      if (on(clr!)) Object.assign(state, { s: 0x2545f491, q: 0 })
      return [all(state.q, w(p))]
    },
  },

  // ── Wiring ──────────────────────────────────────────────────────────────────────────────────────────────
  {
    kind: 'split', label: 'Splitter', icon: 'call_split', category: 'wiring', description: 'Breaks a bus into parts of any widths (1, 4, 5, 8…), or sends each bit to the output you pick, as Logisim\'s',
    params: { width: 8, parts: 2 }, edit: ['width', 'parts', 'map'],
    pins: (p) => {
      const plan = splitPlan(p)
      return { inputs: [{ name: 'bus', width: w(p) }], outputs: range(plan.groups.length, (o) => ({ name: plan.names[o]!, width: plan.widths[o]! })) }
    },
    eval: ({ in: [a], p }) => {
      const plan = splitPlan(p)
      return plan.groups.map((bits, o) => {
        if (!bits.length) return Z(1)
        const m = mask(bits.length)
        const start = plan.starts[o]!
        if (start >= 0) {
          const part = (x: number) => (Math.floor(x / 2 ** start) & m) >>> 0
          return sig(m, part(a!.v), part(a!.k), part(a!.e))
        }
        let v = 0
        let k = 0
        let e = 0
        bits.forEach((b, j) => {
          const to = 2 ** j
          if ((a!.v >>> b) & 1) v += to
          if ((a!.k >>> b) & 1) k += to
          if ((a!.e >>> b) & 1) e += to
        })
        return sig(m, v, k, e)
      })
    },
  },
  {
    kind: 'merge', label: 'Merger', icon: 'merge', category: 'wiring', description: 'Joins parts of any widths into a bus, low bits first, or takes each bit from the input you pick',
    params: { width: 8, parts: 2 }, edit: ['width', 'parts', 'map'],
    pins: (p) => {
      const plan = splitPlan(p)
      return { inputs: range(plan.groups.length, (o) => ({ name: plan.names[o]!, width: plan.widths[o]! })), outputs: [{ name: 'bus', width: w(p) }] }
    },
    eval: ({ in: ins, p }) => {
      const plan = splitPlan(p)
      let v = 0
      let k = 0
      let e = 0
      plan.groups.forEach((bits, o) => {
        const s = ins[o]!
        const start = plan.starts[o]!
        if (start >= 0) {
          const f = 2 ** start
          v += s.v * f
          k += s.k * f
          e += s.e * f
          return
        }
        bits.forEach((b, j) => {
          const to = 2 ** b
          if ((s.v >>> j) & 1) v += to
          if ((s.k >>> j) & 1) k += to
          if ((s.e >>> j) & 1) e += to
        })
      })
      // Bits no input feeds float
      return [sig(mask(w(p)), v, k, e)]
    },
  },
  {
    kind: 'extender', label: 'Bit extender', icon: 'width_wide', category: 'wiring', description: 'Makes a bus wider (filling with 0s, or copying the sign bit) or narrower (keeping the low bits)',
    params: { width: 8, to: 16, signed: false }, edit: ['width', 'to', 'signed'],
    pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }], outputs: [{ name: 'out', width: p.to ?? 16 }] }),
    eval: ({ in: [a], p }) => {
      const to = p.to ?? 16
      const n = w(p)
      const m = mask(to)
      if (to <= n) {
        const cut = (x: number) => (x & m) >>> 0
        return [{ m, v: cut(a!.v), k: cut(a!.k), e: cut(a!.e) }]
      }
      const high = (m - mask(n)) >>> 0
      const top = 2 ** (n - 1)
      // The new high bits: 0s, or copies of the top bit (unknown when it is)
      if (!p.signed) return [{ m, v: a!.v, k: (a!.k + high) >>> 0, e: a!.e }]
      if (a!.k & top) return [{ m, v: (a!.v + (a!.v & top ? high : 0)) >>> 0, k: (a!.k + high) >>> 0, e: a!.e }]
      return [{ m, v: a!.v, k: a!.k, e: (a!.e + high) >>> 0 }]
    },
  },
  {
    kind: 'pull', label: 'Pull resistor', icon: 'vertical_align_bottom', category: 'wiring', description: 'Passes its input on with the floating bits (Z) pulled to 0 or 1, for a bus that tri-states let go of',
    params: { width: 1, pull: 0 }, edit: ['width', 'pull'],
    pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }], outputs: [{ name: 'out', width: w(p) }] }),
    eval: ({ in: [a], p }) => {
      const m = mask(w(p))
      const floating = (m & ~a!.k & ~a!.e) >>> 0
      return [sig(m, (a!.v | (p.pull ? floating : 0)) >>> 0, (a!.k | floating) >>> 0, a!.e)]
    },
  },
  {
    kind: 'text', label: 'Text', icon: 'title', category: 'wiring', description: 'A note on the circuit (its label); it carries nothing',
    params: {}, pins: () => ({ inputs: [], outputs: [] }),
    eval: () => [],
  },
  {
    kind: 'tunnel', label: 'Tunnel', icon: 'sell', category: 'wiring', description: 'Connects without a wire: every tunnel with the same label (in the same circuit) carries what drives any of them',
    params: { width: 1 }, edit: ['width'],
    pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }], outputs: [{ name: 'out', width: w(p) }] }),
    // Never evaluated: the netlist joins tunnels (sim.ts)
    eval: () => [],
  },
  {
    kind: 'point', label: 'Wire point', icon: 'fiber_manual_record', category: 'wiring', description: 'A loose end of a wire: drop a wire on nothing to leave one, then wire on from it',
    params: { width: 1 }, edit: ['width'],
    pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }], outputs: [{ name: 'out', width: w(p) }] }),
    // Never evaluated: the netlist joins it to what drives it, like a tunnel (sim.ts)
    eval: () => [],
  },
  {
    kind: 'sub', label: 'Subcircuit', icon: 'developer_board', category: 'circuits', description: 'Another circuit of this project as a part: its input pins are the inputs, its output pins the outputs. Double-click it to open it',
    params: {},
    pins: (p) => interfaceOf(getCircuit(p.circuit)),
    // Never evaluated: the netlist puts its parts in its place (sim.ts)
    eval: () => [],
  },
]

export const partByKind = new Map(parts.map((p) => [p.kind, p]))
export const categories: { id: Category; label: string }[] = [
  { id: 'io', label: 'Input / output' },
  { id: 'sound', label: 'Sound' },
  { id: 'gates', label: 'Gates' },
  { id: 'plexers', label: 'Plexers' },
  { id: 'arithmetic', label: 'Arithmetic' },
  { id: 'memory', label: 'Memory' },
  { id: 'wiring', label: 'Wiring' },
  { id: 'circuits', label: 'Subcircuits' },
]
