// The outlines of gates and plexers, in a part's own px facing east: drawn by PartView on the canvas and by
// schematic.ts into exported images and the gallery's thumbnails, so both look alike. Pure, no Vue.
import type { Geometry } from './geometry'

/** A gate's body (and an XOR's second curve); `x1` is where the body ends, the output (or its bubble) after it */
export function gateBody(gate: string | undefined, inverted: boolean, w: number, h: number): { d: string; extra?: string; x1: number } {
  const x0 = 14
  const bw = w - 28 - (inverted ? 8 : 0)
  const x1 = x0 + bw
  const t = 4
  const b = h - 4
  const mid = h / 2
  switch (gate) {
    case 'and':
      return { d: `M${x0} ${t} H${x0 + bw / 2} A${bw / 2} ${(b - t) / 2} 0 0 1 ${x0 + bw / 2} ${b} H${x0} Z`, x1 }
    case 'or':
      return { d: `M${x0} ${t} Q${x0 + bw * 0.6} ${t} ${x1} ${mid} Q${x0 + bw * 0.6} ${b} ${x0} ${b} Q${x0 + bw * 0.3} ${mid} ${x0} ${t} Z`, x1 }
    case 'xor':
      return {
        d: `M${x0 + 6} ${t} Q${x0 + bw * 0.6} ${t} ${x1} ${mid} Q${x0 + bw * 0.6} ${b} ${x0 + 6} ${b} Q${x0 + 6 + bw * 0.3} ${mid} ${x0 + 6} ${t} Z`,
        extra: `M${x0} ${t} Q${x0 + bw * 0.3} ${mid} ${x0} ${b}`,
        x1,
      }
    default:
      return { d: `M${x0} ${t + 4} L${x1} ${mid} L${x0} ${b - 4} Z`, x1 }
  }
}

/** A plexer's trapezoid: wide on the side of its many pins, the narrow side's corners `slant` in */
export function trapezoid(g: Pick<Geometry, 'w' | 'h' | 'slant' | 'wide'>): { d: string; bottom: number; top: number } {
  const { w, h, slant = 12, wide } = g
  const l = 16
  const r = w - 16
  const t = 4
  const b = h - 4
  const pts = wide === 'left'
    ? [[l, t], [r, t + slant], [r, b - slant], [l, b]]
    : [[l, t + slant], [r, t], [r, b], [l, b - slant]]
  // Where the bottom and top edges cross the middle (sel and en come in there)
  return { d: `M${pts.map((q) => q.join(' ')).join(' L')} Z`, bottom: b - slant / 2, top: t + slant / 2 }
}

/** The transform that turns a shape drawn facing east (w × h) to `facing`, about its corner and back in place */
export function turnTransform(facing: string, w: number, h: number): string | undefined {
  switch (facing) {
    case 'south': return `translate(${h} 0) rotate(90)`
    case 'west': return `translate(${w} ${h}) rotate(180)`
    case 'north': return `translate(0 ${w}) rotate(270)`
    default: return undefined
  }
}
