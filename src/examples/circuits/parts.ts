// Every kind of part: its pins (which can depend on its parameters), how it computes its outputs from its inputs,
// and the state it keeps (flip-flops, registers, memories, inputs the user flips). Pure, no Vue.
import { all, and, isZ, known, mask, not, on, or, rose, X, xor, Z, type Sig } from './logic'
import { devices, type ColorMode } from './devices'

export type Category = 'io' | 'gates' | 'plexers' | 'arithmetic' | 'memory' | 'wiring'

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
  /** ROM/RAM contents (RAM: what it starts with) */
  contents?: number[]
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
    kind: 'pin', label: 'Input pin', icon: 'input', category: 'io', description: 'Several bits, each flipped with a click',
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
    kind: 'probe', label: 'Probe', icon: 'data_object', category: 'io', description: 'Shows a value in binary, hex and decimal',
    params: { width: 8 }, edit: ['width'], pins: (p) => ({ inputs: [{ name: 'in', width: w(p) }], outputs: [] }),
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
    kind: 'rom', label: 'ROM', icon: 'sd_card', category: 'memory', description: 'Words you write beforehand, read by address',
    params: { select: 4, width: 8, contents: [] }, edit: ['select', 'width', 'contents'],
    pins: (p) => ({ inputs: [{ name: 'A', width: p.select ?? 4 }], outputs: [{ name: 'D', width: w(p) }] }),
    eval: ({ in: [a], p }) => [known(a!) ? all((p.contents?.[a!.v] ?? 0) & mask(w(p)), w(p)) : X(mask(w(p)))],
  },
  {
    kind: 'ram', label: 'RAM', icon: 'memory_alt', category: 'memory',
    description: 'Read by address; writes D on the rising edge while we is 1. Byte addressing: every address is a byte and size picks how many to read or write (little-endian)',
    params: { select: 4, width: 8, contents: [], addressing: 'word' }, edit: ['addressing', 'select', 'width', 'contents'],
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
    init: (p) => ({ mem: Array.from({ length: 2 ** (p.select ?? 4) }, (_, i) => p.contents?.[i] ?? 0) }),
    eval: ({ in: [a, d, we, clk, size], state, p }) => {
      const m = mask(w(p))
      const mem: number[] = state.mem
      const edge = rose(state, clk!)
      if (p.addressing !== 'byte') {
        if (edge && on(we!) && known(a!) && known(d!)) mem[a!.v] = d!.v
        return [known(a!) ? all((mem[a!.v] ?? 0) & m, w(p)) : X(m)]
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
]

export const partByKind = new Map(parts.map((p) => [p.kind, p]))
export const categories: { id: Category; label: string }[] = [
  { id: 'io', label: 'Input / output' },
  { id: 'gates', label: 'Gates' },
  { id: 'plexers', label: 'Plexers' },
  { id: 'arithmetic', label: 'Arithmetic' },
  { id: 'memory', label: 'Memory' },
  { id: 'wiring', label: 'Wiring' },
]
