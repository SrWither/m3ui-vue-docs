// Every kind of part: its pins (which can depend on its parameters), how it computes its outputs from its inputs,
// and the state it keeps (flip-flops, registers, memories, inputs the user flips). Pure, no Vue.
import { all, and, isZ, known, mask, not, on, or, rose, X, xor, Z, type Sig } from './logic'
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
const range = (n: number, f: (i: number) => Pin) => Array.from({ length: n }, (_, i) => f(i))
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
    params: { inputs: 2, width: 1 },
    edit: ['inputs', 'width'],
    pins: (p) => ({ inputs: range(p.inputs ?? 2, (i) => ({ name: `in${i}`, width: w(p) })), outputs: [{ name: 'out', width: w(p) }] }),
    eval: ({ in: ins, p }) => {
      const m = mask(w(p))
      // Unconnected inputs are left out, as in Logisim
      const used = ins.filter((s) => !isZ(s))
      if (!used.length) return [X(m)]
      let out = used[0]!
      for (const s of used.slice(1)) out = fn(out, s, m)
      return [inverted ? not(out, m) : out]
    },
  }
}

// The ALU ops that read B
const USES_B = new Set([0, 1, 2, 3, 4, 13, 14, 15])

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
    kind: 'clock', label: 'Clock', icon: 'schedule', category: 'io', description: 'Ticks while the simulation plays',
    params: {}, pins: () => ({ inputs: [], outputs: [{ name: 'clk', width: 1 }] }),
    init: () => ({ value: 0 }),
    eval: ({ state }) => [all(state.value, 1)],
  },
  {
    kind: 'led', label: 'LED', icon: 'lightbulb', category: 'io', description: 'Lights up on 1',
    params: { color: 'primary' }, edit: ['color'], pins: () => ({ inputs: [{ name: 'in', width: 1 }], outputs: [] }),
    eval: () => [],
  },
  {
    kind: 'probe', label: 'Probe', icon: 'data_object', category: 'io', description: 'Shows a value in binary, hex and decimal (signed or not)',
    params: { width: 8, signed: false }, edit: ['width', 'signed'], pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }], outputs: [] }),
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
    kind: 'mux', label: 'Multiplexer', icon: 'merge', category: 'plexers', description: 'Passes on the input the select picks',
    params: { select: 1, width: 1 }, edit: ['select', 'width'],
    pins: (p) => ({ inputs: [...range(2 ** (p.select ?? 1), (i) => ({ name: `${i}`, width: w(p) })), { name: 'sel', width: p.select ?? 1 }], outputs: [{ name: 'out', width: w(p) }] }),
    eval: ({ in: ins, p }) => {
      const sel = ins[ins.length - 1]!
      if (!known(sel)) return [X(mask(w(p)))]
      return [ins[sel.v]!]
    },
  },
  {
    kind: 'demux', label: 'Demultiplexer', icon: 'call_split', category: 'plexers', description: 'Sends its input to the output the select picks; the others are 0',
    params: { select: 1, width: 1 }, edit: ['select', 'width'],
    pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }, { name: 'sel', width: p.select ?? 1 }], outputs: range(2 ** (p.select ?? 1), (i) => ({ name: `${i}`, width: w(p) })) }),
    eval: ({ in: [a, sel], p }) => {
      const n = 2 ** (p.select ?? 1)
      const m = mask(w(p))
      if (!known(sel!)) return Array.from({ length: n }, () => X(m))
      return Array.from({ length: n }, (_, i) => (i === sel!.v ? a! : all(0, w(p))))
    },
  },
  {
    kind: 'decoder', label: 'Decoder', icon: 'alt_route', category: 'plexers', description: 'Sets the one output the select picks to 1',
    params: { select: 2 }, edit: ['select'],
    pins: (p) => ({ inputs: [{ name: 'sel', width: p.select ?? 2 }], outputs: range(2 ** (p.select ?? 2), (i) => ({ name: `${i}`, width: 1 })) }),
    eval: ({ in: [sel], p }) => {
      const n = 2 ** (p.select ?? 2)
      if (!known(sel!)) return Array.from({ length: n }, () => X(1))
      return Array.from({ length: n }, (_, i) => all(i === sel!.v ? 1 : 0, 1))
    },
  },

  {
    kind: 'prienc', label: 'Priority encoder', icon: 'low_priority', category: 'plexers', description: 'The number of the highest input that is 1; valid is 0 when none is',
    params: { select: 2 }, edit: ['select'],
    pins: (p) => ({ inputs: range(2 ** (p.select ?? 2), (i) => ({ name: `${i}`, width: 1 })), outputs: [{ name: 'out', width: p.select ?? 2 }, { name: 'valid', width: 1 }] }),
    eval: ({ in: ins, p }) => {
      for (let i = ins.length - 1; i >= 0; i--) {
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
    kind: 'comparator', label: 'Comparator', icon: 'compare_arrows', category: 'arithmetic', description: 'Whether A is less than, equal to or greater than B (unsigned)',
    params: { width: 8 }, edit: ['width'],
    pins: (p) => ({ inputs: [{ name: 'A', width: w(p) }, { name: 'B', width: w(p) }], outputs: [{ name: '<', width: 1 }, { name: '=', width: 1 }, { name: '>', width: 1 }] }),
    eval: ({ in: [a, b] }) => {
      if (!known(a!) || !known(b!)) return [X(1), X(1), X(1)]
      return [all(+(a!.v < b!.v), 1), all(+(a!.v === b!.v), 1), all(+(a!.v > b!.v), 1)]
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
    kind: 'multiplier', label: 'Multiplier', icon: 'close', category: 'arithmetic', description: 'A × B (unsigned): the low half and the high half of the product',
    params: { width: 8 }, edit: ['width'],
    pins: (p) => ({ inputs: [{ name: 'A', width: w(p) }, { name: 'B', width: w(p) }], outputs: [{ name: 'lo', width: w(p) }, { name: 'hi', width: w(p) }] }),
    eval: ({ in: [a, b], p }) => {
      const m = mask(w(p))
      if (!known(a!) || !known(b!)) return [X(m), X(m)]
      const prod = BigInt(a!.v) * BigInt(b!.v)
      return [all(Number(prod & BigInt(m)), w(p)), all(Number(prod >> BigInt(w(p))), w(p))]
    },
  },
  {
    kind: 'divider', label: 'Divider', icon: 'percent', category: 'arithmetic', description: 'A ÷ B (unsigned): quotient and remainder. Dividing by 0 gives all ones and A',
    params: { width: 8 }, edit: ['width'],
    pins: (p) => ({ inputs: [{ name: 'A', width: w(p) }, { name: 'B', width: w(p) }], outputs: [{ name: 'Q', width: w(p) }, { name: 'R', width: w(p) }] }),
    eval: ({ in: [a, b], p }) => {
      const m = mask(w(p))
      if (!known(a!) || !known(b!)) return [X(m), X(m)]
      if (!b!.v) return [all(m, w(p)), a!]
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

  // ── Memory ──────────────────────────────────────────────────────────────────────────────────────────────
  {
    kind: 'dff', label: 'D flip-flop', icon: 'memory', category: 'memory', description: 'Stores D on the clock\'s rising edge',
    params: {}, pins: () => ({ inputs: [{ name: 'D', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 }], outputs: [{ name: 'Q', width: 1 }, { name: 'Q̅', width: 1 }] }),
    init: () => ({ q: 0 }),
    eval: ({ in: [d, clk, clr], state }) => {
      if (rose(state, clk!) && known(d!)) state.q = d!.v
      if (on(clr!)) state.q = 0
      return [all(state.q, 1), all(state.q ^ 1, 1)]
    },
  },
  {
    kind: 'tff', label: 'T flip-flop', icon: 'memory', category: 'memory', description: 'Flips on the clock\'s rising edge while T is 1',
    params: {}, pins: () => ({ inputs: [{ name: 'T', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 }], outputs: [{ name: 'Q', width: 1 }, { name: 'Q̅', width: 1 }] }),
    init: () => ({ q: 0 }),
    eval: ({ in: [t, clk, clr], state }) => {
      if (rose(state, clk!) && on(t!, true)) state.q ^= 1
      if (on(clr!)) state.q = 0
      return [all(state.q, 1), all(state.q ^ 1, 1)]
    },
  },
  {
    kind: 'jkff', label: 'JK flip-flop', icon: 'memory', category: 'memory', description: 'On the rising edge: J sets, K resets, both flip',
    params: {}, pins: () => ({ inputs: [{ name: 'J', width: 1 }, { name: 'K', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 }], outputs: [{ name: 'Q', width: 1 }, { name: 'Q̅', width: 1 }] }),
    init: () => ({ q: 0 }),
    eval: ({ in: [j, k, clk, clr], state }) => {
      if (rose(state, clk!)) {
        const J = on(j!)
        const K = on(k!)
        state.q = J && K ? state.q ^ 1 : J ? 1 : K ? 0 : state.q
      }
      if (on(clr!)) state.q = 0
      return [all(state.q, 1), all(state.q ^ 1, 1)]
    },
  },
  {
    kind: 'register', label: 'Register', icon: 'inventory_2', category: 'memory', description: 'Stores D on the rising edge while enabled',
    params: { width: 8 }, edit: ['width'],
    pins: (p) => ({ inputs: [{ name: 'D', width: w(p) }, { name: 'en', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 }], outputs: [{ name: 'Q', width: w(p) }] }),
    init: () => ({ q: 0 }),
    eval: ({ in: [d, en, clk, clr], state, p }) => {
      if (rose(state, clk!) && on(en!, true) && known(d!)) state.q = d!.v
      if (on(clr!)) state.q = 0
      return [all(state.q, w(p))]
    },
  },
  {
    kind: 'counter', label: 'Counter', icon: 'exposure_plus_1', category: 'memory', description: 'Counts up on the rising edge while enabled, wraps around',
    params: { width: 4 }, edit: ['width'],
    pins: (p) => ({ inputs: [{ name: 'en', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 }], outputs: [{ name: 'Q', width: w(p) }, { name: 'carry', width: 1 }] }),
    init: () => ({ q: 0 }),
    eval: ({ in: [en, clk, clr], state, p }) => {
      const m = mask(w(p))
      if (rose(state, clk!) && on(en!, true)) state.q = state.q >= m ? 0 : state.q + 1
      if (on(clr!)) state.q = 0
      return [all(state.q, w(p)), all(+(state.q === m), 1)]
    },
  },
  {
    kind: 'pc', label: 'Program counter', icon: 'pin_end', category: 'memory', description: 'On the rising edge: jumps to D while load is 1, else steps to the next address (while enabled)',
    params: { width: 4 }, edit: ['width'],
    pins: (p) => ({ inputs: [{ name: 'D', width: w(p) }, { name: 'load', width: 1 }, { name: 'en', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 }], outputs: [{ name: 'PC', width: w(p) }] }),
    init: () => ({ q: 0 }),
    eval: ({ in: [d, load, en, clk, clr], state, p }) => {
      const m = mask(w(p))
      if (rose(state, clk!)) {
        if (on(load!) && known(d!)) state.q = d!.v
        else if (on(en!, true)) state.q = state.q >= m ? 0 : state.q + 1
      }
      if (on(clr!)) state.q = 0
      return [all(state.q, w(p))]
    },
  },
  {
    kind: 'rom', label: 'ROM', icon: 'sd_card', category: 'memory', description: 'Words you write beforehand (or load from a .bin / .hex file), read by address',
    params: { select: 4, width: 8 }, edit: ['select', 'width', 'contents'],
    pins: (p) => ({ inputs: [{ name: 'A', width: p.select ?? 4 }], outputs: [{ name: 'D', width: w(p) }] }),
    init: (p) => ({ cells: cellsOf(p.image, 2 ** (p.select ?? 4), w(p)) }),
    eval: ({ in: [a], state, p }) => [known(a!) ? all(state.cells[a!.v] ?? 0, w(p)) : X(mask(w(p)))],
  },
  {
    kind: 'ram', label: 'RAM', icon: 'memory_alt', category: 'memory',
    description: 'Read by address; writes D on the rising edge while we is 1. Byte addressing: every address is a byte and size picks how many to read or write (little-endian)',
    params: { select: 4, width: 8, addressing: 'word' }, edit: ['addressing', 'select', 'width', 'contents'],
    pins: (p) => ({
      inputs: [
        { name: 'A', width: p.select ?? 4 },
        { name: 'D', width: w(p) },
        { name: 'we', width: 1 },
        { name: 'clk', width: 1 },
        ...(p.addressing === 'byte' ? [{ name: 'size', width: 2 }] : []),
      ],
      outputs: [{ name: 'Q', width: w(p) }],
    }),
    // A copy of its image: what it starts with after every reset
    init: (p) => ({ mem: cellsOf(p.image, 2 ** (p.select ?? 4), p.addressing === 'byte' ? 8 : w(p)).slice() }),
    eval: ({ in: [a, d, we, clk, size], state, p }) => {
      const m = mask(w(p))
      const mem = state.mem as Uint32Array
      const edge = rose(state, clk!)
      if (p.addressing !== 'byte') {
        if (edge && on(we!) && known(a!) && known(d!)) mem[a!.v] = d!.v
        return [known(a!) ? all(mem[a!.v] ?? 0, w(p)) : X(m)]
      }
      // Byte addressing: size 0 = 1 byte, 1 = 2 bytes, 2 or 3 = 4 bytes, never wider than the data bus
      const maxBytes = Math.max(1, Math.floor(w(p) / 8))
      const unconnected = isZ(size!)
      if (!unconnected && !known(size!)) return [X(m)]
      const bytes = Math.min(maxBytes, unconnected ? maxBytes : 2 ** Math.min(size!.v, 2))
      const n = mem.length
      if (edge && on(we!) && known(a!) && known(d!)) {
        for (let i = 0; i < bytes; i++) mem[(a!.v + i) % n] = Math.floor(d!.v / 2 ** (8 * i)) & 0xff
      }
      if (!known(a!)) return [X(m)]
      let v = 0
      for (let i = 0; i < bytes; i++) v += (mem[(a!.v + i) % n] ?? 0) * 2 ** (8 * i)
      return [all(v, w(p))]
    },
  },
  {
    kind: 'shiftreg', label: 'Shift register', icon: 'low_priority', category: 'memory',
    description: 'On the rising edge while enabled: shifts left, D coming in at bit 0 and the top bit going out; load 1 takes P instead',
    params: { width: 8 }, edit: ['width'],
    pins: (p) => ({
      inputs: [{ name: 'D', width: 1 }, { name: 'P', width: w(p) }, { name: 'load', width: 1 }, { name: 'en', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 }],
      outputs: [{ name: 'Q', width: w(p) }, { name: 'out', width: 1 }],
    }),
    init: () => ({ q: 0 }),
    eval: ({ in: [d, par, load, en, clk, clr], state, p }) => {
      const m = mask(w(p))
      if (rose(state, clk!) && on(en!, true)) {
        if (on(load!)) { if (known(par!)) state.q = par!.v }
        else state.q = ((state.q * 2) & m) + (on(d!) ? 1 : 0)
      }
      if (on(clr!)) state.q = 0
      return [all(state.q, w(p)), all(Math.floor(state.q / 2 ** (w(p) - 1)) & 1, 1)]
    },
  },
  {
    kind: 'random', label: 'Random', icon: 'casino', category: 'memory', description: 'A new pseudo-random value on every rising edge while enabled (a xorshift generator; clr restarts it)',
    params: { width: 8 }, edit: ['width'],
    pins: (p) => ({ inputs: [{ name: 'en', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 }], outputs: [{ name: 'Q', width: w(p) }] }),
    init: () => ({ s: 0x2545f491, q: 0 }),
    eval: ({ in: [en, clk, clr], state, p }) => {
      if (rose(state, clk!) && on(en!, true)) {
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
    kind: 'split', label: 'Splitter', icon: 'call_split', category: 'wiring', description: 'Breaks a bus into equal parts, low bits first',
    params: { width: 8, parts: 2 }, edit: ['width', 'parts'],
    pins: (p) => {
      const n = p.parts ?? 2
      const each = w(p) / n
      return { inputs: [{ name: 'bus', width: w(p) }], outputs: range(n, (i) => ({ name: each === 1 ? `${i}` : `${i * each}–${(i + 1) * each - 1}`, width: each })) }
    },
    eval: ({ in: [a], p }) => {
      const n = p.parts ?? 2
      const each = w(p) / n
      const m = mask(each)
      return Array.from({ length: n }, (_, i) => {
        const sh = i * each
        const part = (x: number) => (Math.floor(x / 2 ** sh) & m) >>> 0
        return { m, v: part(a!.v), k: part(a!.k), e: part(a!.e) }
      })
    },
  },
  {
    kind: 'merge', label: 'Merger', icon: 'merge', category: 'wiring', description: 'Joins equal parts into a bus, low bits first',
    params: { width: 8, parts: 2 }, edit: ['width', 'parts'],
    pins: (p) => {
      const n = p.parts ?? 2
      const each = w(p) / n
      return { inputs: range(n, (i) => ({ name: each === 1 ? `${i}` : `${i * each}–${(i + 1) * each - 1}`, width: each })), outputs: [{ name: 'bus', width: w(p) }] }
    },
    eval: ({ in: ins, p }) => {
      const each = w(p) / (p.parts ?? 2)
      const out: Sig = { m: mask(w(p)), v: 0, k: 0, e: 0 }
      ins.forEach((s, i) => {
        const f = 2 ** (i * each)
        out.v += s.v * f
        out.k += s.k * f
        out.e += s.e * f
      })
      return [out]
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
    kind: 'tunnel', label: 'Tunnel', icon: 'sell', category: 'wiring', description: 'Connects without a wire: every tunnel with the same label (in the same circuit) carries what drives any of them',
    params: { width: 1 }, edit: ['width'],
    pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }], outputs: [{ name: 'out', width: w(p) }] }),
    // Never evaluated: the netlist joins tunnels (sim.ts)
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
