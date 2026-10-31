// Where a part's pins sit and how big it is, on a 20px pitch so wires line up.
import { partByKind, type PartDef, type Params } from './parts'
import type { PartData } from './sim'

export const PITCH = 20
export type Look = 'gate' | 'box' | 'io'

export interface Geometry { look: Look; w: number; h: number; inY: number[]; outY: number[] }

const IO: Record<string, { w: number; h: number }> = {
  switch: { w: 76, h: 40 },
  button: { w: 60, h: 40 },
  const: { w: 60, h: 40 },
  clock: { w: 64, h: 40 },
  led: { w: 40, h: 40 },
  probe: { w: 132, h: 60 },
  hex: { w: 60, h: 80 },
  tunnel: { w: 100, h: 40 },
  buzzer: { w: 60, h: 40 },
  piano: { w: 248, h: 80 },
}
/** Room for the pin labels left of a screen or terminal */
export const SIDE = 52
export const CHAR_W = 7.25
export const LINE_H = 16
/** A screen's px per pixel: as set, or as big as fits 256px (at most 8) */
export const screenPixel = (p: Params) => p.pixel || Math.max(1, Math.min(8, Math.floor(256 / Math.max(p.cols ?? 32, p.rows ?? 32))))
const STATEFUL = new Set(['register', 'counter', 'pc', 'dff', 'tff', 'jkff', 'ram', 'rom', 'shiftreg', 'random', 'synth', 'pcm'])
const NARROW = new Set(['mux', 'demux', 'decoder', 'split', 'merge', 'prienc', 'bitsel', 'extender', 'negator'])

export function geometry(data: PartData): Geometry {
  const def = partByKind.get(data.kind)! as PartDef
  const p: Params = { ...def.params, ...data.params }
  const { inputs, outputs } = def.pins(p)
  const nIn = inputs.length
  const nOut = outputs.length
  const spread = (n: number, top: number, h: number) =>
    n === 1 ? [Math.round(h / 2 / 10) * 10] : Array.from({ length: n }, (_, i) => top + i * PITCH)
  if (def.gate) {
    const h = Math.max(40, (nIn + 1) * PITCH)
    return { look: 'gate', w: def.inverted ? 88 : 80, h, inY: spread(nIn, PITCH, h), outY: [Math.round(h / 2 / 10) * 10] }
  }
  if (data.kind === 'pin') {
    const bits = p.width ?? 1
    const w = Math.max(76, Math.min(bits, 8) * 18 + 24)
    const h = 40 + Math.ceil(bits / 8) * 22
    return { look: 'io', w, h, inY: [], outY: [h / 2] }
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
  const pinsH = 44 + (nIn - 1) * PITCH + 20
  const inY = Array.from({ length: nIn }, (_, i) => 44 + i * PITCH)
  if (data.kind === 'screen') {
    const px = screenPixel(p)
    return { look: 'box', w: Math.max(160, SIDE + (p.cols ?? 32) * px + 12), h: Math.max(pinsH, 40 + (p.rows ?? 32) * px + 12), inY, outY: [] }
  }
  if (data.kind === 'tty') {
    return { look: 'box', w: Math.ceil(SIDE + (p.cols ?? 32) * CHAR_W + 20), h: Math.max(pinsH, 40 + (p.rows ?? 8) * LINE_H + 16), inY, outY: [] }
  }
  if (data.kind === 'keyboard') return { look: 'box', w: 180, h: 124, inY, outY: Array.from({ length: nOut }, (_, i) => 44 + i * PITCH) }
  if (data.kind === 'seg7') return { look: 'io', w: 100, h: 160, inY: spread(7, PITCH, 160), outY: [] }
  const io = IO[data.kind]
  if (io) return { look: 'io', ...io, inY: spread(nIn, PITCH, io.h), outY: spread(nOut, PITCH, io.h) }
  // A box: a title, then the pins, then (for parts that store something) what's stored
  const top = 44
  const rows = Math.max(nIn, nOut, 1)
  const h = top + (rows - 1) * PITCH + (STATEFUL.has(data.kind) ? 40 : 20)
  const w = data.kind === 'ram' || data.kind === 'rom' || data.kind === 'sub' ? 160 : NARROW.has(data.kind) ? 112 : 132
  return { look: 'box', w, h, inY: Array.from({ length: nIn }, (_, i) => top + i * PITCH), outY: Array.from({ length: nOut }, (_, i) => top + i * PITCH) }
}
