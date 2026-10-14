/*
 * Product "photos" drawn as SVG, so the example needs no image hosting and every color
 * variant gets its own picture. Returned as data URIs: they work in <img>, MCarousel and
 * MLightbox alike.
 */

export type Kind = 'mug' | 'plant' | 'lamp' | 'candle' | 'notebook' | 'speaker' | 'tote'

const shade = (hex: string, amount: number) => {
  const n = parseInt(hex.slice(1), 16)
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v + amount * 255)))
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => c(v).toString(16).padStart(2, '0')).join('')}`
}

function object(kind: Kind, c: string) {
  const dark = shade(c, -0.18)
  const light = shade(c, 0.18)
  switch (kind) {
    case 'mug':
      return `<path d='M150 120h110v120a30 30 0 0 1-30 30h-50a30 30 0 0 1-30-30z' fill='${c}'/><path d='M260 145h18a26 26 0 0 1 0 52h-18' fill='none' stroke='${dark}' stroke-width='14'/><ellipse cx='205' cy='120' rx='55' ry='10' fill='${dark}'/><path d='M190 95q-10-15 0-30M215 95q-10-15 0-30' stroke='#fff' stroke-opacity='.7' stroke-width='5' fill='none' stroke-linecap='round'/>`
    case 'plant':
      return `<ellipse cx='200' cy='115' rx='22' ry='60' fill='#3f8f5b' transform='rotate(-30 200 160)'/><ellipse cx='200' cy='110' rx='22' ry='62' fill='#4fa76c'/><ellipse cx='200' cy='115' rx='22' ry='60' fill='#3f8f5b' transform='rotate(30 200 160)'/><path d='M150 170h100l-14 100h-72z' fill='${c}'/><rect x='144' y='160' width='112' height='18' rx='6' fill='${dark}'/>`
    case 'lamp':
      return `<path d='M160 80h80l30 80h-140z' fill='${c}'/><rect x='194' y='160' width='12' height='90' fill='${dark}'/><ellipse cx='200' cy='255' rx='50' ry='12' fill='${dark}'/><ellipse cx='200' cy='165' rx='60' ry='10' fill='#fff7d1' fill-opacity='.8'/>`
    case 'candle':
      return `<rect x='155' y='130' width='90' height='130' rx='14' fill='${c}'/><ellipse cx='200' cy='130' rx='45' ry='10' fill='${light}'/><rect x='198' y='105' width='4' height='22' fill='#333'/><path d='M200 70q16 22 0 38q-16-16 0-38z' fill='#ffb347'/><rect x='155' y='190' width='90' height='26' fill='${dark}' fill-opacity='.35'/>`
    case 'notebook':
      return `<rect x='140' y='75' width='130' height='180' rx='10' fill='${c}' transform='rotate(-6 205 165)'/><rect x='240' y='80' width='10' height='170' fill='${dark}' transform='rotate(-6 205 165)'/><rect x='160' y='110' width='70' height='26' rx='4' fill='#fff' fill-opacity='.75' transform='rotate(-6 205 165)'/>`
    case 'speaker':
      return `<rect x='140' y='70' width='120' height='190' rx='26' fill='${c}'/><circle cx='200' cy='180' r='42' fill='${dark}'/><circle cx='200' cy='180' r='16' fill='${light}'/><circle cx='200' cy='108' r='14' fill='${dark}'/>`
    case 'tote':
      return `<path d='M150 120q0-60 50-60t50 60' fill='none' stroke='${dark}' stroke-width='10'/><path d='M130 120h140l-12 145h-116z' fill='${c}'/><path d='M175 170h50' stroke='#fff' stroke-opacity='.7' stroke-width='8' stroke-linecap='round'/>`
  }
}

/** A product picture: `view` 0–2 changes the backdrop and framing, for a small gallery. */
export function art(kind: Kind, color: string, backdrop: string, view = 0) {
  const scale = [1, 1.25, 0.85][view]!
  const tx = 200 - 200 * scale
  const ty = 165 - 165 * scale
  const deco = [
    `<circle cx='320' cy='70' r='60' fill='#fff' fill-opacity='.35'/><circle cx='70' cy='260' r='40' fill='#fff' fill-opacity='.25'/>`,
    `<rect x='-40' y='220' width='480' height='120' fill='#000' fill-opacity='.06'/>`,
    `<circle cx='200' cy='165' r='140' fill='#fff' fill-opacity='.3'/>`,
  ][view]!
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 330'><rect width='400' height='330' fill='${backdrop}'/>${deco}<ellipse cx='200' cy='282' rx='90' ry='12' fill='#000' fill-opacity='.12'/><g transform='translate(${tx} ${ty}) scale(${scale})'>${object(kind, color)}</g></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/** A wide promo banner for the hero carousel (its title and text come from MSimpleCarousel's own overlay). */
export function banner(from: string, to: string, kind: Kind, color: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='800' height='400' fill='url(#g)'/><circle cx='620' cy='130' r='170' fill='#fff' fill-opacity='.22'/><circle cx='120' cy='330' r='90' fill='#fff' fill-opacity='.18'/><g transform='translate(300 20) scale(1.15)'>${object(kind, color)}</g></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
