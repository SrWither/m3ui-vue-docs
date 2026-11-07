// A circuit drawn as one SVG, outside MFlow: the gallery's thumbnails (shapes only, theme colors as CSS variables)
// and the exported image (names, values and wires colored by what they carry, colors resolved so the file stands
// alone). Wires are routed with the library's own path functions, as MFlow routes them on the canvas.
import { getRoutedPath, getSmoothStepPath, type FlowEdge, type FlowPosition } from '@m3ui-vue/m3ui-vue/flow'
import { placed, type PinAt } from './geometry'
import { gateBody, trapezoid, turnTransform } from './shapes'
import { partByKind } from './parts'
import { getCircuit } from './library'
import { format, isZ, known, widthOf, type Sig } from './logic'
import type { PartNode } from './sim'

export interface SchematicColors {
  bg: string
  part: string
  border: string
  text: string
  dim: string
  /** A 1-bit wire at 0, at 1; a bus; nothing driving it; an error */
  low: string
  high: string
  bus: string
  z: string
  error: string
  font: string
}

/** The theme's colors as CSS variables (for an SVG inside the page) */
export const cssColors: SchematicColors = {
  bg: 'var(--color-surface)',
  part: 'var(--color-surface-container-low)',
  border: 'var(--color-outline-variant)',
  text: 'var(--color-on-surface)',
  dim: 'var(--color-on-surface-variant)',
  low: 'var(--color-outline)',
  high: 'var(--color-primary)',
  bus: 'var(--color-tertiary)',
  z: 'var(--color-secondary)',
  error: 'var(--color-error)',
  font: 'inherit',
}

/** The theme's colors resolved, for an image that leaves the page */
export function resolvedColors(el: Element = document.documentElement): SchematicColors {
  const css = getComputedStyle(el)
  const v = (name: string) => css.getPropertyValue(`--color-${name}`).trim()
  return {
    bg: v('surface'), part: v('surface-container-low'), border: v('outline-variant'), text: v('on-surface'), dim: v('on-surface-variant'),
    low: v('outline'), high: v('primary'), bus: v('tertiary'), z: v('secondary'), error: v('error'),
    font: getComputedStyle(document.body).fontFamily,
  }
}

export interface SchematicOptions {
  colors: SchematicColors
  /** 'thumb': outlines and wires only; 'full': names, pin labels, values */
  detail: 'thumb' | 'full'
  /** What a wire carries (colors it), when there's a simulation */
  signal?: (e: FlowEdge) => Sig | null | undefined
  /** A part's live picture (a screen's pixels) as an image URL, drawn over its face */
  picture?: (node: PartNode) => { href: string; x: number; y: number; w: number; h: number } | undefined
  /** A wire's path as drawn elsewhere (MFlow's getEdgePath); else routed here like MFlow's default */
  path?: (e: FlowEdge) => string | undefined
  /** A part's value as text (an LED's, a probe's…) */
  value?: (node: PartNode) => string | undefined
  /** Room around the parts */
  pad?: number
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const OPPOSITE: Record<FlowPosition, FlowPosition> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

/** The circuit as an SVG document (and its size) */
export function schematicSVG(circuit: { nodes: PartNode[]; edges: FlowEdge[] }, o: SchematicOptions): { svg: string; width: number; height: number } {
  const { colors: C, detail } = o
  const full = detail === 'full'
  const pad = o.pad ?? 40
  const parts = circuit.nodes.filter((n) => n.data && partByKind.has(n.data.kind)).map((n) => ({ n, at: placed(n.data!) }))
  const byId = new Map(parts.map((p) => [p.n.id, p]))
  if (!parts.length) return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120"><rect width="200" height="120" fill="${C.bg}"/></svg>`, width: 200, height: 120 }
  const x0 = Math.min(...parts.map((p) => p.n.position.x)) - pad
  const y0 = Math.min(...parts.map((p) => p.n.position.y)) - pad
  const x1 = Math.max(...parts.map((p) => p.n.position.x + p.at.w)) + pad
  const y1 = Math.max(...parts.map((p) => p.n.position.y + p.at.h)) + pad
  const width = Math.ceil(x1 - x0)
  const height = Math.ceil(y1 - y0)
  const out: string[] = []

  // Wires under the parts
  const pinOf = (id: string, handle: string | null | undefined, out: boolean) => {
    const p = byId.get(id)
    if (!p) return null
    const i = Number((handle ?? (out ? 'o0' : 'i0')).slice(1))
    const pin: PinAt | undefined = (out ? p.at.outs : p.at.ins)[i]
    return pin ? { x: p.n.position.x + pin.x, y: p.n.position.y + pin.y, side: pin.side } : null
  }
  // A wire point's pins face where the wire goes
  const facing = (from: { x: number; y: number }, to: { x: number; y: number }): FlowPosition =>
    Math.abs(to.x - from.x) >= Math.abs(to.y - from.y) ? (to.x >= from.x ? 'right' : 'left') : (to.y >= from.y ? 'bottom' : 'top')
  for (const e of circuit.edges) {
    const s = pinOf(e.source, e.sourceHandle, true)
    const t = pinOf(e.target, e.targetHandle, false)
    if (!s || !t) continue
    const sourcePosition = (e.sourcePosition as FlowPosition | undefined) ?? (s.side === 'auto' ? facing(s, t) : s.side)
    const targetPosition = (e.targetPosition as FlowPosition | undefined) ?? (t.side === 'auto' ? OPPOSITE[facing(s, t)] : t.side)
    const p = { sourceX: s.x, sourceY: s.y, sourcePosition, targetX: t.x, targetY: t.y, targetPosition }
    const d = o.path?.(e) ?? (e.route ? getRoutedPath({ ...p, route: e.route }) : getSmoothStepPath(p)).path
    const sig = o.signal?.(e)
    let stroke = C.low
    let w = full ? 2 : 3
    let dash = ''
    if (sig === null) [stroke, dash] = [C.error, '6 4']
    else if (sig) {
      const bus = widthOf(sig) > 1
      if (isZ(sig)) [stroke, dash] = [C.z, '2 4']
      else if (!known(sig) && sig.e) stroke = C.error
      else if (bus) [stroke, w] = [C.bus, 4]
      else if (sig.v) [stroke, w] = [C.high, 3]
    }
    out.push(`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`)
  }

  for (const { n, at } of parts) {
    const data = n.data!
    const def = partByKind.get(data.kind)!
    const params = { ...def.params, ...data.params }
    const title = data.label || (data.kind === 'sub' ? getCircuit(params.circuit)?.name ?? 'Circuit' : def.label)
    const g: string[] = []
    const text = (x: number, y: number, s: string, size: number, fill = C.text, anchor = 'start', weight = 400) =>
      full ? g.push(`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" dominant-baseline="central" font-weight="${weight}">${esc(s)}</text>`) : 0
    if (data.kind === 'point') {
      g.push(`<circle cx="${at.w / 2}" cy="${at.h / 2}" r="4" fill="${C.low}"/>`)
    } else if (data.kind === 'text') {
      if (full) (data.label || 'Text').split('\n').forEach((l, i) => text(10, 20 + i * 20, l, 13, C.dim))
    } else if (at.look === 'gate' || at.look === 'plexer') {
      // Drawn facing east, then turned with the part
      const ge = placed({ ...data, facing: 'east' })
      const inner: string[] = []
      const line = (ax: number, ay: number, bx: number, by: number) => inner.push(`<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${C.dim}" stroke-width="2"/>`)
      if (at.look === 'gate') {
        const b = gateBody(def.gate, !!def.inverted, ge.w, ge.h)
        for (const p of ge.ins) line(0, p.y, 18, p.y)
        line(b.x1, ge.outs[0]!.y, ge.w, ge.outs[0]!.y)
        inner.push(`<path d="${b.d}" fill="${C.part}" stroke="${C.dim}" stroke-width="2" stroke-linejoin="round"/>`)
        if (b.extra) inner.push(`<path d="${b.extra}" fill="none" stroke="${C.dim}" stroke-width="2"/>`)
        if (def.inverted) inner.push(`<circle cx="${b.x1 + 4}" cy="${ge.outs[0]!.y}" r="4" fill="${C.part}" stroke="${C.dim}" stroke-width="2"/>`)
      } else {
        const tz = trapezoid(ge)
        for (const p of [...ge.ins, ...ge.outs]) {
          if (p.side === 'left') line(0, p.y, 16, p.y)
          else if (p.side === 'right') line(ge.w - 16, p.y, ge.w, p.y)
          else if (p.side === 'bottom') line(p.x, tz.bottom, p.x, ge.h)
          else line(p.x, 0, p.x, tz.top)
        }
        inner.push(`<path d="${tz.d}" fill="${C.part}" stroke="${C.dim}" stroke-width="2" stroke-linejoin="round"/>`)
      }
      const turn = turnTransform(at.facing, ge.w, ge.h)
      g.push(turn ? `<g transform="${turn}">${inner.join('')}</g>` : inner.join(''))
    } else {
      // A box or an I/O part: a card with its name, pins named along its sides
      g.push(`<rect x="0.5" y="0.5" width="${at.w - 1}" height="${at.h - 1}" rx="${at.look === 'box' ? 12 : 10}" fill="${C.part}" stroke="${C.border}" stroke-width="1.5"/>`)
      const pins = def.pins(params)
      const facingEast = at.facing === 'east' || at.facing === 'west'
      if (at.look === 'box') {
        if (facingEast) {
          g.push(`<line x1="0" y1="28" x2="${at.w}" y2="28" stroke="${C.border}" stroke-width="1.5"/>`)
          text(10, 14, title, 13, C.text, 'start', 500)
          const left = at.facing === 'east'
          at.ins.forEach((p, i) => text(left ? 8 : at.w - 8, p.y, pins.inputs[i]?.name ?? '', 11, C.dim, left ? 'start' : 'end'))
          at.outs.forEach((p, i) => text(left ? at.w - 8 : 8, p.y, pins.outputs[i]?.name ?? '', 11, C.dim, left ? 'end' : 'start'))
        } else text(at.w / 2, at.h / 2, title, 13, C.text, 'middle', 500)
      } else {
        const v = o.value?.(n)
        text(at.w / 2, v ? at.h / 2 - 8 : at.h / 2, data.label || def.label, 11, C.dim, 'middle')
        if (v) text(at.w / 2, at.h / 2 + 9, v, 14, C.text, 'middle', 500)
      }
      const pic = full ? o.picture?.(n) : undefined
      if (pic) g.push(`<image href="${pic.href}" x="${pic.x}" y="${pic.y}" width="${pic.w}" height="${pic.h}" style="image-rendering:pixelated"/>`)
    }
    // Pin stubs, so a wire visibly ends on the part
    if (full && data.kind !== 'point') for (const p of [...at.ins, ...at.outs]) g.push(`<circle cx="${p.x}" cy="${p.y}" r="3" fill="${C.bg}" stroke="${C.dim}" stroke-width="1.5"/>`)
    out.push(`<g transform="translate(${n.position.x} ${n.position.y})">${g.join('')}</g>`)
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${x0} ${y0} ${width} ${height}" font-family="${esc(C.font)}">`
    + `<rect x="${x0}" y="${y0}" width="${width}" height="${height}" fill="${C.bg}"/>${out.join('')}</svg>`
  return { svg, width, height }
}

/** A probe's, an LED's or a register's value for the exported image */
export function valueText(s: Sig | undefined) {
  return s ? format(s) : undefined
}
