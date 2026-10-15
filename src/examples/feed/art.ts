/*
 * The "photos" people post, drawn as SVG from a seed (no image hosting): landscapes, cities at
 * night, beaches, food from above and abstract shapes, in a few aspect ratios so grids and
 * masonry have something to arrange.
 */

export type PhotoKind = 'landscape' | 'city' | 'beach' | 'food' | 'abstract'

export interface Photo {
  src: string
  alt: string
  /** Width / height. */
  ratio: number
}

export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const pick = <T>(r: () => number, list: readonly T[]) => list[Math.floor(r() * list.length)]!

const skies: Array<[string, string, string]> = [
  ['#ff9e7a', '#ffd8a8', '#7b4b6b'],
  ['#8ecae6', '#e0f4ff', '#3d5a80'],
  ['#a3c4f3', '#fdf0d5', '#52796f'],
  ['#cdb4db', '#ffc8dd', '#6d597a'],
  ['#264653', '#e9c46a', '#2a9d8f'],
  ['#355070', '#e56b6f', '#6d597a'],
]

function body(kind: PhotoKind, r: () => number, w: number, h: number) {
  const [a, b, c] = pick(r, skies)
  const sky = `<defs><linearGradient id='s' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='${w}' height='${h}' fill='url(#s)'/>`
  const y = (f: number) => Math.round(h * f)
  switch (kind) {
    case 'landscape': {
      const peaks = [...Array(5)].map((_, i) => `${(w / 4) * i},${y(0.45 + r() * 0.2)}`).join(' L')
      return `${sky}<circle cx='${w * (0.2 + r() * 0.6)}' cy='${y(0.25)}' r='${w * 0.08}' fill='#fff6d5' fill-opacity='.9'/><path d='M0 ${y(0.7)} L${peaks} L${w} ${y(0.6)} V${h} H0z' fill='${c}' fill-opacity='.6'/><path d='M0 ${y(0.75)} Q${w * 0.3} ${y(0.6)} ${w * 0.55} ${y(0.72)} T${w} ${y(0.7)} V${h} H0z' fill='${c}'/>`
    }
    case 'city': {
      let s = `<rect width='${w}' height='${h}' fill='#14213d'/><circle cx='${w * 0.8}' cy='${y(0.18)}' r='${w * 0.05}' fill='#fdf0d5'/>`
      let x = 0
      while (x < w) {
        const bw = w * (0.06 + r() * 0.1)
        const bh = h * (0.25 + r() * 0.45)
        s += `<rect x='${x}' y='${h - bh}' width='${bw}' height='${bh}' fill='${pick(r, ['#1d3557', '#22333b', '#2b2d42'])}'/>`
        for (let wy = h - bh + 10; wy < h - 10; wy += 18) for (let wx = x + 6; wx < x + bw - 8; wx += 14) if (r() < 0.35) s += `<rect x='${wx}' y='${wy}' width='6' height='8' fill='#ffd166' fill-opacity='${0.5 + r() * 0.5}'/>`
        x += bw + 2
      }
      return s
    }
    case 'beach':
      return `${sky}<circle cx='${w * 0.5}' cy='${y(0.42)}' r='${w * 0.12}' fill='#ffb703' fill-opacity='.85'/><rect y='${y(0.48)}' width='${w}' height='${y(0.22)}' fill='#219ebc'/><path d='M0 ${y(0.56)}h${w}M0 ${y(0.62)}h${w}' stroke='#fff' stroke-opacity='.3' stroke-width='3'/><path d='M0 ${y(0.7)} Q${w * 0.5} ${y(0.64)} ${w} ${y(0.72)} V${h} H0z' fill='#f4d6a0'/><path d='M${w * 0.78} ${h} q-10 -${h * 0.3} 30 -${h * 0.42}' stroke='#6b4f2a' stroke-width='8' fill='none'/><path d='M${w * 0.84} ${y(0.58)} q-60 -10 -90 30 M${w * 0.84} ${y(0.58)} q60 -20 90 20 M${w * 0.84} ${y(0.58)} q10 -50 50 -60' stroke='#2a9d8f' stroke-width='10' fill='none' stroke-linecap='round'/>`
    case 'food': {
      const R = Math.min(w, h) * 0.36
      const cx = w / 2
      const cy = h / 2
      let s = `<rect width='${w}' height='${h}' fill='${pick(r, ['#e9d8a6', '#f1faee', '#ddbea9', '#cad2c5'])}'/><circle cx='${cx}' cy='${cy}' r='${R + 14}' fill='#fff' fill-opacity='.9'/><circle cx='${cx}' cy='${cy}' r='${R}' fill='${pick(r, ['#fefae0', '#f8edeb'])}'/>`
      const colors = ['#e63946', '#f4a261', '#2a9d8f', '#8ab17d', '#e9c46a', '#9b5de5']
      for (let i = 0; i < 9; i++) {
        const ang = r() * Math.PI * 2
        const d = r() * R * 0.65
        s += `<circle cx='${cx + Math.cos(ang) * d}' cy='${cy + Math.sin(ang) * d}' r='${R * (0.12 + r() * 0.14)}' fill='${pick(r, colors)}'/>`
      }
      return `${s}<rect x='${cx + R + 30}' y='${cy - R}' width='10' height='${R * 2}' rx='5' fill='#adb5bd'/>`
    }
    case 'abstract':
      return `${sky}${[...Array(6)].map(() => `<circle cx='${r() * w}' cy='${r() * h}' r='${(0.1 + r() * 0.3) * Math.min(w, h)}' fill='${pick(r, [a, b, c, '#fff'])}' fill-opacity='${0.3 + r() * 0.5}'/>`).join('')}`
  }
}

const alts: Record<PhotoKind, string[]> = {
  landscape: ['Mountains at golden hour', 'Hills after the rain', 'A quiet valley'],
  city: ['The city at night', 'Lights from the rooftop', 'Downtown after dark'],
  beach: ['A beach at sunset', 'Palm tree and the sea', 'Low tide'],
  food: ['Lunch from above', 'A colorful bowl', 'Brunch'],
  abstract: ['Colors', 'Shapes and light', 'Soft gradients'],
}

export function photo(seed: number, kind?: PhotoKind): Photo {
  const r = rng(seed * 7919 + 1)
  const k = kind ?? pick(r, ['landscape', 'city', 'beach', 'food', 'abstract'] as const)
  const ratio = pick(r, k === 'food' ? [1, 4 / 5] : [4 / 3, 1, 3 / 4, 16 / 9, 4 / 5])
  const w = 800
  const h = Math.round(w / ratio)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'>${body(k, r, w, h)}</svg>`
  return { src: `data:image/svg+xml,${encodeURIComponent(svg)}`, alt: pick(r, alts[k]), ratio }
}

/** A wide profile banner. */
export function banner(seed: number) {
  const r = rng(seed * 104729)
  const [a, b, c] = pick(r, skies)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 300'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${c}'/></linearGradient></defs><rect width='900' height='300' fill='url(#g)'/>${[...Array(5)].map(() => `<circle cx='${r() * 900}' cy='${r() * 300}' r='${40 + r() * 140}' fill='${b}' fill-opacity='${0.15 + r() * 0.3}'/>`).join('')}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
