/*
 * Top-down food illustrations drawn as SVG and returned as data URIs, so the example needs no
 * photos. Each dish kind has its own drawing; the recipe's colors and a seed from its id vary the
 * details, so the same recipe always looks the same.
 */
import { rng } from './rng'
import type { Recipe } from './data'

type Colors = [string, string, string]

const S = 400
const C = S / 2

const uri = (body: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${S} ${S}'>${body}</svg>`)}`

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
/** Mixes a color toward black (amount > 0) or white (amount < 0). */
export function shade(hex: string, amount: number) {
  const target = amount > 0 ? 0 : 255
  const a = Math.abs(amount)
  return `#${hexToRgb(hex).map((c) => Math.round(c + (target - c) * a).toString(16).padStart(2, '0')).join('')}`
}

function hash(s: string) {
  let h = 2166136261
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return h >>> 0
}

/** A wobbly closed outline around (cx, cy): r jittered by up to `wobble`, smoothed with curves. */
function blob(cx: number, cy: number, r: number, wobble: number, rand: () => number, points = 10) {
  const pts = [...Array(points)].map((_, i) => {
    const a = (i / points) * Math.PI * 2
    const rr = r * (1 - wobble / 2 + rand() * wobble)
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr] as const
  })
  const mid = (i: number) => {
    const [x1, y1] = pts[i % points]!
    const [x2, y2] = pts[(i + 1) % points]!
    return [(x1 + x2) / 2, (y1 + y2) / 2]
  }
  let d = `M${mid(0).join(' ')}`
  for (let i = 1; i <= points; i++) {
    const [px, py] = pts[i % points]!
    d += `Q${px.toFixed(1)} ${py.toFixed(1)} ${mid(i).map((v) => v.toFixed(1)).join(' ')}`
  }
  return `${d}Z`
}

const leaf = (x: number, y: number, len: number, angle: number, fill: string) =>
  `<g transform='translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(0)})'><path d='M0 0Q${len / 2} ${-len / 3} ${len} 0Q${len / 2} ${len / 3} 0 0Z' fill='${fill}'/><path d='M0 0L${len * 0.9} 0' stroke='${shade(fill, 0.3)}' stroke-width='1.2' stroke-opacity='.5'/></g>`

/** Scatter `n` points inside a disc of radius r. */
function scatter(n: number, r: number, rand: () => number, cx = C, cy = C) {
  return [...Array(n)].map(() => {
    const a = rand() * Math.PI * 2
    const d = Math.sqrt(rand()) * r
    return [cx + Math.cos(a) * d, cy + Math.sin(a) * d] as const
  })
}

function cloth(color: string, rand: () => number) {
  const ink = shade(color, 0.18)
  const kind = Math.floor(rand() * 3)
  let pattern = ''
  if (kind === 0) {
    // Gingham
    for (let i = 0; i < 10; i++) pattern += `<rect x='${i * 44}' width='22' height='${S}' fill='${ink}' fill-opacity='.18'/><rect y='${i * 44}' width='${S}' height='22' fill='${ink}' fill-opacity='.18'/>`
  } else if (kind === 1) {
    // Dots
    for (let x = 0; x < 9; x++) for (let y = 0; y < 9; y++) pattern += `<circle cx='${x * 48 + (y % 2) * 24}' cy='${y * 48}' r='5' fill='${ink}' fill-opacity='.28'/>`
  } else {
    // Linen: fine diagonal lines
    for (let i = -10; i < 20; i++) pattern += `<path d='M${i * 30} 0L${i * 30 + S} ${S}' stroke='${ink}' stroke-opacity='.16' stroke-width='3'/>`
  }
  return `<rect width='${S}' height='${S}' fill='${color}'/>${pattern}`
}

const shadow = (r: number) => `<circle cx='${C + 10}' cy='${C + 14}' r='${r}' fill='#000' fill-opacity='.14'/>`
const plate = (r: number, tint = '#fbfaf6') =>
  `${shadow(r)}<circle cx='${C}' cy='${C}' r='${r}' fill='${tint}'/><circle cx='${C}' cy='${C}' r='${r * 0.78}' fill='${shade(tint, 0.04)}'/><circle cx='${C}' cy='${C}' r='${r * 0.76}' fill='${tint}'/>`

function bowl([main, accent, garnish]: Colors, rand: () => number, id: string) {
  let s = `${shadow(172)}<circle cx='${C}' cy='${C}' r='172' fill='#f7f4ee'/><circle cx='${C}' cy='${C}' r='150' fill='${shade(main, 0.25)}'/>`
  s += `<path d='${blob(C, C, 146, 0.06, rand, 14)}' fill='${main}'/>`
  // Swirl of a lighter tone through the soup
  s += `<path d='M${C - 90} ${C + 20}Q${C - 20} ${C - 80} ${C + 60} ${C - 20}T${C + 110} ${C + 40}' stroke='${shade(main, -0.25)}' stroke-width='10' stroke-linecap='round' fill='none' stroke-opacity='.6'/>`
  if (id === 'shakshuka') {
    for (const [x, y] of [[C - 55, C - 50], [C + 60, C - 35], [C - 40, C + 60], [C + 50, C + 65]] as const) {
      s += `<path d='${blob(x, y, 34, 0.3, rand, 8)}' fill='#fbf7ee'/><circle cx='${x + 3}' cy='${y - 2}' r='15' fill='${accent}'/><circle cx='${x - 2}' cy='${y - 7}' r='4' fill='#fff' fill-opacity='.7'/>`
    }
  } else if (id === 'miso-ramen') {
    // Noodles, two halved eggs and spring onion rings
    for (let i = 0; i < 7; i++) s += `<path d='M${C - 110 + i * 8} ${C + 60 + i * 6}q30 -30 60 0t60 0t60 0' stroke='#f2dfa3' stroke-width='7' fill='none' stroke-linecap='round'/>`
    for (const [x, y] of [[C - 50, C - 50], [C + 40, C - 70]] as const) s += `<ellipse cx='${x}' cy='${y}' rx='34' ry='28' fill='#fbf7ee'/><circle cx='${x}' cy='${y}' r='17' fill='#f3a73a'/>`
    s += `<path d='${blob(C + 70, C + 10, 30, 0.4, rand, 7)}' fill='${shade(main, 0.45)}'/>`
  } else {
    s += scatter(7, 95, rand).map(([x, y]) => `<path d='${blob(x, y, 12 + rand() * 12, 0.5, rand, 6)}' fill='${accent}' fill-opacity='.95'/>`).join('')
    if (id === 'pea-soup' || id === 'mushroom-risotto') s += `<path d='${blob(C + 10, C - 10, 38, 0.35, rand, 9)}' fill='#fbf7ee' fill-opacity='.9'/>`
  }
  s += scatter(8, 110, rand).map(([x, y]) => leaf(x, y, 22 + rand() * 18, rand() * 360, garnish)).join('')
  s += scatter(26, 120, rand).map(([x, y]) => `<circle cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' r='${(1.5 + rand() * 2).toFixed(1)}' fill='${shade(main, 0.5)}'/>`).join('')
  return s
}

function pasta([main, accent, garnish]: Colors, rand: () => number, id: string) {
  let s = plate(178)
  if (id === 'pumpkin-gnocchi') {
    s += `<path d='${blob(C, C, 110, 0.12, rand, 12)}' fill='${shade(main, -0.35)}' fill-opacity='.7'/>`
    s += scatter(16, 85, rand).map(([x, y]) => {
      const a = rand() * 180
      return `<g transform='translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(0)})'><rect x='-17' y='-12' width='34' height='24' rx='11' fill='${main}'/><path d='M-9 -10v20M0 -11v22M9 -10v20' stroke='${shade(main, 0.2)}' stroke-width='2'/></g>`
    }).join('')
  } else {
    // A nest of strands
    for (let i = 0; i < 26; i++) {
      const r1 = 30 + rand() * 80
      const a = rand() * Math.PI * 2
      const x = C + Math.cos(a) * 20
      const y = C + Math.sin(a) * 20
      s += `<ellipse cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' rx='${r1.toFixed(1)}' ry='${(r1 * (0.6 + rand() * 0.4)).toFixed(1)}' transform='rotate(${(rand() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})' fill='none' stroke='${i % 3 ? main : shade(main, 0.12)}' stroke-width='6'/>`
    }
    s += scatter(5, 60, rand).map(([x, y]) => `<path d='${blob(x, y, 16 + rand() * 10, 0.45, rand, 7)}' fill='${accent}'/>`).join('')
  }
  s += scatter(7, 90, rand).map(([x, y]) => leaf(x, y, 24 + rand() * 14, rand() * 360, garnish)).join('')
  s += scatter(30, 100, rand).map(([x, y]) => `<circle cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' r='1.6' fill='#3a2f25' fill-opacity='.6'/>`).join('')
  return s
}

function salad([main, accent, garnish]: Colors, rand: () => number) {
  let s = plate(182, '#f6f3ec')
  s += scatter(22, 120, rand).map(([x, y]) => leaf(x, y, 34 + rand() * 30, rand() * 360, rand() < 0.5 ? garnish : shade(garnish, -0.2))).join('')
  // Wedges of the main ingredient
  s += scatter(8, 95, rand).map(([x, y]) => {
    const a = rand() * 360
    return `<path d='M0 0L40 -14A42 42 0 0 1 40 14Z' transform='translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(0)})' fill='${main}'/>`
  }).join('')
  // Wheels of the accent with their segments
  s += scatter(4, 80, rand).map(([x, y]) => {
    const segs = [...Array(8)].map((_, i) => {
      const a = (i / 8) * Math.PI * 2
      return `<path d='M${x.toFixed(1)} ${y.toFixed(1)}L${(x + Math.cos(a) * 22).toFixed(1)} ${(y + Math.sin(a) * 22).toFixed(1)}' stroke='${shade(accent, -0.4)}' stroke-width='1.5'/>`
    }).join('')
    return `<circle cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' r='27' fill='${shade(accent, -0.5)}'/><circle cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' r='23' fill='${accent}'/>${segs}`
  }).join('')
  s += scatter(14, 100, rand).map(([x, y]) => `<rect x='${x.toFixed(1)}' y='${y.toFixed(1)}' width='${8 + rand() * 8}' height='${7 + rand() * 6}' rx='3' fill='#fbfaf4' transform='rotate(${(rand() * 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})'/>`).join('')
  return s
}

function tart([base, fruit, dust]: Colors, rand: () => number) {
  let s = `${shadow(160)}<path d='${blob(C, C, 165, 0.1, rand, 16)}' fill='${shade(base, 0.12)}'/><path d='${blob(C, C, 150, 0.08, rand, 16)}' fill='${base}'/>`
  // Fruit fanned in rings
  for (const [ring, count, r] of [[105, 14, 26], [62, 9, 22], [20, 3, 18]] as const) {
    for (let i = 0; i < count; i++) {
      const a = (i / count) * 360 + ring
      const rad = (a * Math.PI) / 180
      const x = C + Math.cos(rad) * ring
      const y = C + Math.sin(rad) * ring
      s += `<ellipse cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' rx='${r}' ry='${r * 0.55}' transform='rotate(${(a + 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})' fill='${i % 2 ? fruit : shade(fruit, 0.15)}'/>`
      s += `<ellipse cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' rx='${r * 0.6}' ry='${r * 0.2}' transform='rotate(${(a + 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})' fill='#fff' fill-opacity='.25'/>`
    }
  }
  s += scatter(40, 150, rand).map(([x, y]) => `<circle cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' r='${(1.5 + rand() * 2.5).toFixed(1)}' fill='${dust}'/>`).join('')
  return s
}

function stack([cake, berry, butter]: Colors, rand: () => number) {
  let s = plate(180)
  for (let i = 0; i < 4; i++) s += `<path d='${blob(C + 8 - i * 5, C + 10 - i * 6, 118 - i * 3, 0.06, rand, 14)}' fill='${shade(cake, 0.18 - i * 0.05)}'/>`
  s += `<path d='${blob(C - 10, C - 10, 112, 0.05, rand, 14)}' fill='${cake}'/>`
  s += `<path d='${blob(C - 10, C - 10, 84, 0.25, rand, 12)}' fill='${shade(cake, 0.35)}' fill-opacity='.55'/>`
  s += `<rect x='${C - 34}' y='${C - 40}' width='44' height='38' rx='8' fill='${butter}' transform='rotate(12 ${C - 12} ${C - 21})'/>`
  s += scatter(16, 140, rand).map(([x, y]) => `<circle cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' r='11' fill='${berry}'/><circle cx='${(x - 3).toFixed(1)}' cy='${(y - 4).toFixed(1)}' r='3' fill='#fff' fill-opacity='.35'/>`).join('')
  return s
}

function toast([mash, chili, crust]: Colors, rand: () => number) {
  let s = `<rect x='40' y='60' width='320' height='290' rx='40' fill='#000' fill-opacity='.12' transform='translate(10 12)'/><rect x='40' y='60' width='320' height='290' rx='40' fill='#c8955c'/>`
  for (let i = 0; i < 7; i++) s += `<path d='M60 ${90 + i * 38}Q200 ${80 + i * 38 + rand() * 20} 340 ${90 + i * 38}' stroke='#a8743f' stroke-width='3' fill='none' stroke-opacity='.5'/>`
  for (const [x, y, a] of [[80, 90, -6], [205, 110, 8]] as const) {
    s += `<g transform='rotate(${a} ${x + 60} ${y + 95})'><path d='M${x} ${y + 40}Q${x} ${y} ${x + 60} ${y}Q${x + 120} ${y} ${x + 120} ${y + 40}V${y + 190}H${x}Z' fill='${crust}'/><path d='M${x + 10} ${y + 44}Q${x + 10} ${y + 12} ${x + 60} ${y + 12}Q${x + 110} ${y + 12} ${x + 110} ${y + 44}V${y + 178}H${x + 10}Z' fill='${shade(crust, -0.35)}'/>`
    s += `<path d='${blob(x + 60, y + 100, 52, 0.3, rand, 11)}' fill='${mash}'/><path d='${blob(x + 55, y + 95, 30, 0.4, rand, 8)}' fill='${shade(mash, -0.2)}'/>`
    s += scatter(14, 45, rand, x + 60, y + 100).map(([px, py]) => `<circle cx='${px.toFixed(1)}' cy='${py.toFixed(1)}' r='${(2 + rand() * 3).toFixed(1)}' fill='${chili}'/>`).join('')
    s += `</g>`
  }
  return s
}

function taco([shell, beans, onion]: Colors, rand: () => number) {
  let s = plate(182, '#f5f1e8')
  for (const [x, y, a] of [[C - 70, C - 40, -30], [C + 60, C - 60, 25], [C, C + 70, -5]] as const) {
    s += `<g transform='translate(${x} ${y}) rotate(${a})'>`
    s += `<path d='M-75 0A75 75 0 0 0 75 0Z' fill='${shade(shell, 0.1)}'/><path d='M-75 0A75 70 0 0 1 75 0Z' fill='${shell}'/>`
    s += [...Array(10)].map(() => `<circle cx='${(-60 + rand() * 120).toFixed(1)}' cy='${(-6 - rand() * 18).toFixed(1)}' r='${(6 + rand() * 5).toFixed(1)}' fill='${beans}'/>`).join('')
    s += [...Array(4)].map(() => `<path d='M${(-50 + rand() * 90).toFixed(1)} ${(-10 - rand() * 18).toFixed(1)}q10 -12 22 0' stroke='${onion}' stroke-width='4' fill='none' stroke-linecap='round'/>`).join('')
    s += [...Array(5)].map(() => `<circle cx='${(-55 + rand() * 110).toFixed(1)}' cy='${(-8 - rand() * 22).toFixed(1)}' r='4' fill='#6aa84f'/>`).join('')
    s += `<path d='M-70 -4Q0 -26 70 -4' stroke='#fbf7ee' stroke-width='5' fill='none' stroke-linecap='round' stroke-opacity='.9'/></g>`
  }
  return s
}

const cache = new Map<string, string>()

/** The recipe's illustration as a data URI (cached). */
export function dishArt(recipe: Recipe) {
  let out = cache.get(recipe.id)
  if (out) return out
  const rand = rng(hash(recipe.id))
  const { kind, colors, cloth: clothColor } = recipe.art
  const body = {
    bowl: () => bowl(colors, rand, recipe.id),
    pasta: () => pasta(colors, rand, recipe.id),
    salad: () => salad(colors, rand),
    tart: () => tart(colors, rand),
    stack: () => stack(colors, rand),
    toast: () => toast(colors, rand),
    taco: () => taco(colors, rand),
  }[kind]()
  out = uri(cloth(clothColor, rand) + body)
  cache.set(recipe.id, out)
  return out
}
