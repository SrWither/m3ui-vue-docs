// Devices: a pixel screen, a game pad, a keyboard and a text terminal, enough I/O for games, a console, or a
// machine like the NES (its PPU writes pixels, its CPU reads the pads through a shift register). Pure, no Vue:
// they keep their pixels and text in their state, and PartView draws them from there.
import { all, known, mask, on, rose, type Sig } from './logic'
import type { PartDef } from './parts'

export type ColorMode = 'mono' | 'rgb3' | 'rgb332' | 'nes' | 'rgb12' | 'rgb24'
export const colorModes: { value: ColorMode; bits: number; label: string }[] = [
  { value: 'mono', bits: 1, label: '1 bit, on / off' },
  { value: 'rgb3', bits: 3, label: '3 bits, RGB (8 colors)' },
  { value: 'rgb332', bits: 8, label: '8 bits, RGB 3-3-2' },
  { value: 'nes', bits: 6, label: '6 bits, NES palette (64)' },
  { value: 'rgb12', bits: 12, label: '12 bits, RGB 4-4-4' },
  { value: 'rgb24', bits: 24, label: '24 bits, RGB 8-8-8' },
]
const bitsOf = (mode: ColorMode | undefined) => colorModes.find((m) => m.value === (mode ?? 'rgb3'))!.bits

// The 2C02's 64 colors, as the usual emulator palette
const NES = [
  0x7c7c7c, 0x0000fc, 0x0000bc, 0x4428bc, 0x940084, 0xa80020, 0xa81000, 0x881400, 0x503000, 0x007800, 0x006800, 0x005800, 0x004058, 0x000000, 0x000000, 0x000000,
  0xbcbcbc, 0x0078f8, 0x0058f8, 0x6844fc, 0xd800cc, 0xe40058, 0xf83800, 0xe45c10, 0xac7c00, 0x00b800, 0x00a800, 0x00a844, 0x008888, 0x000000, 0x000000, 0x000000,
  0xf8f8f8, 0x3cbcfc, 0x6888fc, 0x9878f8, 0xf878f8, 0xf85898, 0xf87858, 0xfca044, 0xf8b800, 0xb8f818, 0x58d854, 0x58f898, 0x00e8d8, 0x787878, 0x000000, 0x000000,
  0xfcfcfc, 0xa4e4fc, 0xb8b8f8, 0xd8b8f8, 0xf8b8f8, 0xf8a4c0, 0xf0d0b0, 0xfce0a8, 0xf8d878, 0xd8f878, 0xb8f8b8, 0xb8f8d8, 0x00fcfc, 0xf8d8f8, 0x000000, 0x000000,
]
const scale = (v: number, bits: number) => Math.round((v * 255) / mask(bits))
/** A color input's value as 0xRRGGBB */
export function toRGB(mode: ColorMode | undefined, v: number): number {
  switch (mode ?? 'rgb3') {
    case 'mono': return v & 1 ? 0xffffff : 0
    case 'rgb3': return (v & 4 ? 0xff0000 : 0) | (v & 2 ? 0xff00 : 0) | (v & 1 ? 0xff : 0)
    case 'rgb332': return (scale((v >> 5) & 7, 3) << 16) | (scale((v >> 2) & 7, 3) << 8) | scale(v & 3, 2)
    case 'nes': return NES[v & 63]!
    case 'rgb12': return (scale((v >> 8) & 15, 4) << 16) | (scale((v >> 4) & 15, 4) << 8) | scale(v & 15, 4)
    default: return v & 0xffffff
  }
}
// As a pixel of a canvas' ImageData (bytes R, G, B, A in a little-endian Uint32)
const toPixel = (rgb: number) => (0xff000000 | ((rgb & 0xff) << 16) | (rgb & 0xff00) | ((rgb >> 16) & 0xff)) >>> 0
const BLACK = toPixel(0)
/** Bits to address n positions */
export const bitsFor = (n: number) => Math.max(1, Math.ceil(Math.log2(n)))

export interface ScreenState { front: Uint32Array; back: Uint32Array | null; dirty: boolean; clk?: Sig; vs?: number; frames: number }

const screen: PartDef = {
  kind: 'screen',
  label: 'Screen',
  icon: 'tv',
  category: 'io',
  description: 'A grid of pixels: on the clock\'s rising edge, while we is 1, paints pixel (x, y) the color in. Buffered, it shows what was painted on each vsync',
  params: { cols: 32, rows: 32, mode: 'rgb3', pixel: 0, buffered: false },
  edit: ['cols', 'rows', 'mode', 'pixel', 'buffered'],
  pins: (p) => ({
    inputs: [
      { name: 'x', width: bitsFor(p.cols ?? 32) },
      { name: 'y', width: bitsFor(p.rows ?? 32) },
      { name: 'color', width: bitsOf(p.mode) },
      { name: 'we', width: 1 },
      { name: 'clk', width: 1 },
      { name: 'clr', width: 1 },
      ...(p.buffered ? [{ name: 'vsync', width: 1 }] : []),
    ],
    outputs: [],
  }),
  init: (p): ScreenState => {
    const n = (p.cols ?? 32) * (p.rows ?? 32)
    return { front: new Uint32Array(n).fill(BLACK), back: p.buffered ? new Uint32Array(n).fill(BLACK) : null, dirty: true, frames: 0 }
  },
  eval: ({ in: [x, y, color, we, clk, clr, vsync], state, p }) => {
    const st = state as ScreenState
    const cols = p.cols ?? 32
    const target = st.back ?? st.front
    if (rose(st, clk!) && on(we!) && known(x!) && known(y!) && known(color!) && x!.v < cols && y!.v < (p.rows ?? 32)) {
      target[y!.v * cols + x!.v] = toPixel(toRGB(p.mode, color!.v))
      if (!st.back) st.dirty = true
    }
    if (on(clr!)) {
      target.fill(BLACK)
      if (!st.back) st.dirty = true
    }
    if (st.back && vsync) {
      const level = known(vsync) ? vsync.v : 0
      if (level && !st.vs) {
        st.front.set(st.back)
        st.dirty = true
        st.frames++
      }
      st.vs = level
    }
    return []
  },
}

// Bit order of the NES pad, as its shift register sends them
export const PAD_BUTTONS = ['A', 'B', 'Select', 'Start', 'Up', 'Down', 'Left', 'Right'] as const

const joypad: PartDef = {
  kind: 'joypad',
  label: 'Joypad',
  icon: 'sports_esports',
  category: 'io',
  description: 'Eight buttons (A, B, Select, Start, Up, Down, Left, Right; 1 while pressed): as a byte, or one bit at a time like the NES pad. Click it to play with the keyboard',
  params: { serial: false },
  edit: ['serial'],
  pins: (p) =>
    p.serial
      ? { inputs: [{ name: 'strobe', width: 1 }, { name: 'clk', width: 1 }], outputs: [{ name: 'data', width: 1 }] }
      : { inputs: [], outputs: [{ name: 'buttons', width: 8 }] },
  init: () => ({ buttons: 0, shift: 0 }),
  eval: ({ in: [strobe, clk], state, p }) => {
    if (!p.serial) return [all(state.buttons, 8)]
    // While strobe is 1 the register keeps loading the buttons; each rising clk after shifts the next one out,
    // and 1s once all eight are read (as the original pads do)
    if (rose(state, clk!) && !on(strobe!)) state.shift = (state.shift >>> 1) | 0x80
    if (on(strobe!)) state.shift = state.buttons
    return [all(state.shift & 1, 1)]
  },
}

const keyboard: PartDef = {
  kind: 'keyboard',
  label: 'Keyboard',
  icon: 'keyboard',
  category: 'io',
  description: 'Keys typed into it wait in a queue: char is the first one\'s ASCII code and avail says there is one; a rising clk while read is 1 takes it',
  params: {},
  pins: () => ({ inputs: [{ name: 'read', width: 1 }, { name: 'clk', width: 1 }], outputs: [{ name: 'char', width: 7 }, { name: 'avail', width: 1 }] }),
  init: () => ({ queue: [] as number[] }),
  eval: ({ in: [read, clk], state }) => {
    if (rose(state, clk!) && on(read!)) state.queue.shift()
    return [all(state.queue[0] ?? 0, 7), all(state.queue.length ? 1 : 0, 1)]
  },
}

export interface TtyState { lines: string[]; clk?: Sig }
const tty: PartDef = {
  kind: 'tty',
  label: 'Terminal',
  icon: 'terminal',
  category: 'io',
  description: 'Prints the ASCII char on each rising clk while we is 1: Enter goes to the next line, backspace erases, form feed (12) or clr clears',
  params: { cols: 32, rows: 8 },
  edit: ['cols', 'rows'],
  pins: () => ({ inputs: [{ name: 'char', width: 7 }, { name: 'we', width: 1 }, { name: 'clk', width: 1 }, { name: 'clr', width: 1 }], outputs: [] }),
  init: (): TtyState => ({ lines: [''] }),
  eval: ({ in: [ch, we, clk, clr], state, p }) => {
    const st = state as TtyState
    const cols = p.cols ?? 32
    const rows = p.rows ?? 8
    if (rose(st, clk!) && on(we!) && known(ch!)) {
      const c = ch!.v
      const last = st.lines.length - 1
      if (c === 10 || c === 13) st.lines.push('')
      else if (c === 8 || c === 127) st.lines[last] = st.lines[last]!.slice(0, -1)
      else if (c === 12) st.lines = ['']
      else if (c >= 32) {
        if (st.lines[last]!.length >= cols) st.lines.push('')
        st.lines[st.lines.length - 1] += String.fromCharCode(c)
      }
      if (st.lines.length > rows) st.lines = st.lines.slice(-rows)
    }
    if (on(clr!)) st.lines = ['']
    return []
  },
}

export const devices: PartDef[] = [screen, joypad, keyboard, tty]
