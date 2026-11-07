// Where a part's pins sit and how big it is, on a 20px pitch so wires line up.
import { partByKind, type PartDef, type Params } from './parts'
import type { FlowPosition } from '@m3ui-vue/m3ui-vue/flow'
import type { Facing, PartData } from './library'

export const PITCH = 20
/** Where a box's first pin sits, below its title: on the grid, like every pin, so wires between parts run straight */
const TOP = 40
/** Rounded to the grid */
const onGrid = (v: number) => Math.round(v / PITCH) * PITCH
/**
 * n pins a step apart with one in the middle of the other side (a gate's output, a mux's): with an even n that middle
 * would fall between two grid lines, so the middle slot is left empty, as Logisim does
 */
function fanIn(n: number) {
  if (n <= 1) return { h: 2 * PITCH, ys: [PITCH] }
  if (n % 2) return { h: (n + 1) * PITCH, ys: Array.from({ length: n }, (_, i) => (i + 1) * PITCH) }
  return { h: (n + 2) * PITCH, ys: Array.from({ length: n }, (_, i) => (i + 1 + (i >= n / 2 ? 1 : 0)) * PITCH) }
}
export type Look = 'gate' | 'plexer' | 'box' | 'io'

export interface Geometry {
  look: Look
  w: number
  h: number
  inY: number[]
  outY: number[]
  /** Pins anywhere on the outline (plexers: sel on the bottom), facing east; else inY/outY on the left and right */
  pins?: { ins: PinAt[]; outs: PinAt[] }
  /** A plexer's trapezoid: the wide side (where the many pins are) and how far the narrow side's corners come in */
  wide?: 'left' | 'right'
  slant?: number
}

const IO: Record<string, { w: number; h: number }> = {
  switch: { w: 76, h: 40 },
  button: { w: 60, h: 40 },
  const: { w: 60, h: 40 },
  clock: { w: 64, h: 40 },
  led: { w: 40, h: 40 },
  probe: { w: 132, h: 60 },
  hex: { w: 60, h: 80 },
  tunnel: { w: 100, h: 40 },
  // Just its dot, whose middle sits on the grid (the node's gridOffset), so points can sit a step apart
  point: { w: 20, h: 20 },
  buzzer: { w: 60, h: 40 },
  pull: { w: 60, h: 40 },
  piano: { w: 248, h: 100 },
}
/** Room for the pin labels left of a screen or terminal */
export const SIDE = 52
export const CHAR_W = 7.25
export const LINE_H = 16
/** A screen's px per pixel: as set, or as big as fits 256px (at most 8) */
export const screenPixel = (p: Params) => p.pixel || Math.max(1, Math.min(8, Math.floor(256 / Math.max(p.cols ?? 32, p.rows ?? 32))))
const STATEFUL = new Set(['register', 'counter', 'pc', 'dff', 'tff', 'jkff', 'ram', 'rom', 'shiftreg', 'random', 'synth', 'pcm'])
const NARROW = new Set(['split', 'merge', 'prienc', 'bitsel', 'extender', 'negator', 'bitadder', 'bitfinder'])
const PLEXERS = new Set(['mux', 'demux', 'decoder'])

export function geometry(data: PartData): Geometry {
  const def = partByKind.get(data.kind)! as PartDef
  const p: Params = { ...def.params, ...data.params }
  const { inputs, outputs } = def.pins(p)
  const nIn = inputs.length
  const nOut = outputs.length
  const spread = (n: number, top: number, h: number) =>
    n === 1 ? [onGrid(h / 2)] : Array.from({ length: n }, (_, i) => top + i * PITCH)
  if (def.gate) {
    const { h, ys } = fanIn(nIn)
    return { look: 'gate', w: def.inverted ? 88 : 80, h, inY: ys, outY: [h / 2] }
  }
  if (PLEXERS.has(data.kind)) return plexer(data.kind, p, nIn, nOut)
  if (data.kind === 'text') {
    const lines = (data.label || 'Text').split('\n')
    return { look: 'io', w: Math.max(40, Math.ceil(Math.max(...lines.map((l) => l.length)) * 8.5 / PITCH) * PITCH + PITCH), h: Math.max(1, lines.length) * PITCH + PITCH, inY: [], outY: [] }
  }
  if (data.kind === 'pin') {
    const bits = p.width ?? 1
    const w = Math.max(76, Math.min(bits, 8) * 18 + 24)
    const h = 40 + Math.ceil(bits / 8) * 22
    return { look: 'io', w, h, inY: [], outY: [onGrid(h / 2)] }
  }
  if (data.kind === 'outpin') {
    const bits = p.width ?? 1
    const w = Math.max(76, Math.min(bits, 8) * 12 + 40)
    return { look: 'io', w, h: 40 + (bits > 1 ? 20 : 0), inY: [20], outY: [] }
  }
  if (data.kind === 'joypad') {
    const h = 88
    return { look: 'io', w: p.serial ? 248 : 200, h, inY: spread(nIn, PITCH, h), outY: spread(nOut, PITCH, h) }
  }
  // Boxes with a device drawn beside their pin labels
  const pinsH = TOP + (nIn - 1) * PITCH + 20
  const inY = Array.from({ length: nIn }, (_, i) => TOP + i * PITCH)
  if (data.kind === 'screen') {
    const px = screenPixel(p)
    return { look: 'box', w: Math.max(160, SIDE + (p.cols ?? 32) * px + 12), h: Math.max(pinsH, 40 + (p.rows ?? 32) * px + 12), inY, outY: [] }
  }
  if (data.kind === 'tty') {
    return { look: 'box', w: Math.ceil(SIDE + (p.cols ?? 32) * CHAR_W + 20), h: Math.max(pinsH, 40 + (p.rows ?? 8) * LINE_H + 16), inY, outY: [] }
  }
  // Its field and queue go below the pins
  if (data.kind === 'keyboard') return { look: 'box', w: 180, h: 140, inY, outY: Array.from({ length: nOut }, (_, i) => TOP + i * PITCH) }
  if (data.kind === 'seg7') return { look: 'io', w: 100, h: 160, inY: spread(7, PITCH, 160), outY: [] }
  const io = IO[data.kind]
  if (io) return { look: 'io', ...io, inY: spread(nIn, PITCH, io.h), outY: spread(nOut, PITCH, io.h) }
  // A box: a title, then the pins, then (for parts that store something) what's stored
  const top = TOP
  const rows = Math.max(nIn, nOut, 1)
  const h = top + (rows - 1) * PITCH + (STATEFUL.has(data.kind) ? 40 : 20)
  const w = data.kind === 'ram' || data.kind === 'rom' || data.kind === 'sub' ? 160 : NARROW.has(data.kind) ? 112 : 132
  return { look: 'box', w, h, inY: Array.from({ length: nIn }, (_, i) => top + i * PITCH), outY: Array.from({ length: nOut }, (_, i) => top + i * PITCH) }
}

/**
 * A multiplexer, demultiplexer or decoder as Logisim draws it: a trapezoid, wide on the side of its many pins, the
 * select coming in from the bottom and the enable (when it has one) from the top
 */
function plexer(kind: string, p: Params, nIn: number, nOut: number): Geometry {
  const many = kind === 'mux' ? nIn - 1 - (p.enable ? 1 : 0) : nOut
  // A decoder has no pin in the middle of its other side, so its outputs needn't make room for one
  const { h, ys } = kind === 'decoder' ? { h: (many + 1) * PITCH, ys: Array.from({ length: many }, (_, i) => (i + 1) * PITCH) } : fanIn(many)
  const w = 80
  const mid = onGrid(h / 2)
  const side = (n: number, x: number, s: FlowPosition): PinAt[] => ys.slice(0, n).map((y) => ({ x, y, side: s }))
  const sel: PinAt = { x: 40, y: h, side: 'bottom' }
  const en: PinAt[] = p.enable ? [{ x: 40, y: 0, side: 'top' }] : []
  const ins = kind === 'mux' ? [...side(many, 0, 'left'), sel, ...en] : kind === 'demux' ? [{ x: 0, y: mid, side: 'left' as const }, sel, ...en] : [sel, ...en]
  const outs = kind === 'mux' ? [{ x: w, y: mid, side: 'right' as const }] : side(many, w, 'right')
  return {
    look: 'plexer', w, h, inY: ins.map((q) => q.y), outY: outs.map((q) => q.y),
    pins: { ins, outs }, wide: kind === 'mux' ? 'left' : 'right', slant: Math.min(PITCH, Math.max(8, h / 5)),
  }
}

// ── Turning a part ──────────────────────────────────────────────────────────────────────────────────────
// Gates turn whole, like Logisim's (the shape rotates). Boxes keep their text upright: turned to south or north
// they stand their pins on the top and bottom edges, in order from the left; turned to west they swap sides. I/O
// parts keep their face and move their pin to the middle of the side it points to. Devices with a face of their
// own (screens, keyboards, joypads, the piano…) don't turn.
export const FACINGS: Facing[] = ['east', 'south', 'west', 'north']
const FIXED = new Set(['point', 'text', 'screen', 'tty', 'keyboard', 'joypad', 'seg7', 'piano', 'synth', 'pcm'])
export const canTurn = (data: PartData) => !FIXED.has(data.kind)
/** The next facing a quarter turn clockwise (or back) */
export const turned = (f: Facing | undefined, back = false) => FACINGS[(FACINGS.indexOf(f ?? 'east') + (back ? 3 : 1)) % 4]!

export interface PinAt { x: number; y: number; side: FlowPosition | 'auto' }
export interface Placed extends Geometry { facing: Facing; ins: PinAt[]; outs: PinAt[] }

/** A part's geometry as turned: its size on the canvas and where each pin sits, on which side */
export function placed(data: PartData): Placed {
  const g = geometry(data)
  const facing = canTurn(data) ? data.facing ?? 'east' : 'east'
  // A wire point: both pins at its dot, every wire on the side that faces where it goes (MFlowHandle's 'auto')
  if (data.kind === 'point') return { ...g, facing: 'east', ins: [{ x: g.w / 2, y: g.h / 2, side: 'auto' }], outs: [{ x: g.w / 2, y: g.h / 2, side: 'auto' }] }
  const east: Placed = g.pins
    ? { ...g, facing: 'east', ins: g.pins.ins, outs: g.pins.outs }
    : { ...g, facing: 'east', ins: g.inY.map((y) => ({ x: 0, y, side: 'left' })), outs: g.outY.map((y) => ({ x: g.w, y, side: 'right' })) }
  if (facing === 'east') return east
  const { w, h } = g
  if (g.look === 'gate' || g.look === 'plexer') {
    // Rotated whole about its corner, then moved back in place
    const map = (p: PinAt): PinAt => {
      const side = (s: FlowPosition): FlowPosition => {
        const order: FlowPosition[] = ['top', 'right', 'bottom', 'left']
        return order[(order.indexOf(s) + FACINGS.indexOf(facing)) % 4]!
      }
      if (facing === 'south') return { x: h - p.y, y: p.x, side: side(p.side as FlowPosition) }
      if (facing === 'west') return { x: w - p.x, y: h - p.y, side: side(p.side as FlowPosition) }
      return { x: p.y, y: w - p.x, side: side(p.side as FlowPosition) }
    }
    const vertical = facing !== 'west'
    return { ...g, facing, w: vertical ? h : w, h: vertical ? w : h, ins: east.ins.map(map), outs: east.outs.map(map) }
  }
  if (facing === 'west') return { ...g, facing, ins: g.inY.map((y) => ({ x: w, y, side: 'right' })), outs: g.outY.map((y) => ({ x: 0, y, side: 'left' })) }
  const inSide: FlowPosition = facing === 'south' ? 'top' : 'bottom'
  const outSide: FlowPosition = facing === 'south' ? 'bottom' : 'top'
  if (g.look === 'io') {
    const mid = onGrid(w / 2)
    const row = (n: number, y: number, side: FlowPosition) => Array.from({ length: n }, (_, i) => ({ x: n === 1 ? mid : mid + (i - (n - 1) / 2) * PITCH, y, side }))
    return { ...g, facing, ins: row(g.inY.length, facing === 'south' ? 0 : h, inSide), outs: row(g.outY.length, facing === 'south' ? h : 0, outSide) }
  }
  // A box standing up: its pins along the top and bottom, the title across the middle
  const n = Math.max(g.inY.length, g.outY.length, 1)
  const W = Math.max(120, (n + 1) * PITCH)
  const H = STATEFUL.has(data.kind) ? 140 : 120
  const row = (count: number, y: number, side: FlowPosition) => {
    const start = Math.round((W - (count - 1) * PITCH) / 2 / PITCH) * PITCH
    return Array.from({ length: count }, (_, i) => ({ x: start + i * PITCH, y, side }))
  }
  return { ...g, facing, w: W, h: H, ins: row(g.inY.length, facing === 'south' ? 0 : H, inSide), outs: row(g.outY.length, facing === 'south' ? H : 0, outSide) }
}
