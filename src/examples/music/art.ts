/*
 * Album covers, artist photos and playlist covers drawn as SVG and returned as data URIs, so
 * the example needs no image hosting. Each takes a seed, so the same album always looks the same.
 */
import { rng } from './rng'

export type Motif = 'sun' | 'grid' | 'blobs' | 'moon' | 'rings' | 'waves' | 'bars' | 'pixels'

const uri = (body: string, size = 300) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${size} ${size}'>${body}</svg>`)}`

const gradient = (id: string, [a, b]: [string, string], angle = 1) =>
  `<defs><linearGradient id='${id}' x1='0' y1='0' x2='${angle}' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs>`

function motif(kind: Motif, [light, dark]: [string, string], r: () => number) {
  switch (kind) {
    case 'sun': {
      // A synthwave sun cut by stripes, over a perspective grid.
      const stripes = [0, 1, 2, 3, 4].map((i) => `<rect x='60' y='${142 + i * 13}' width='180' height='${3 + i * 1.6}' fill='${dark}'/>`).join('')
      const lines = [...Array(9)].map((_, i) => `<line x1='150' y1='190' x2='${-90 + i * 60}' y2='300' stroke='${light}' stroke-opacity='.55' stroke-width='1.5'/>`).join('')
      const rows = [0, 1, 2, 3].map((i) => `<line x1='0' y1='${200 + i * i * 9 + i * 8}' x2='300' y2='${200 + i * i * 9 + i * 8}' stroke='${light}' stroke-opacity='.55' stroke-width='1.5'/>`).join('')
      return `<circle cx='150' cy='150' r='90' fill='${light}'/>${stripes}<rect y='190' width='300' height='110' fill='${dark}'/>${lines}${rows}`
    }
    case 'grid': {
      let s = ''
      for (let x = 0; x < 6; x++)
        for (let y = 0; y < 6; y++) if (r() < 0.45) s += `<rect x='${x * 50 + 6}' y='${y * 50 + 6}' width='38' height='38' rx='${r() < 0.5 ? 19 : 6}' fill='${r() < 0.5 ? light : '#fff'}' fill-opacity='${0.35 + r() * 0.5}'/>`
      return s
    }
    case 'blobs':
      return [...Array(5)]
        .map(() => `<circle cx='${r() * 300}' cy='${r() * 300}' r='${40 + r() * 90}' fill='${r() < 0.5 ? light : '#fff'}' fill-opacity='${0.25 + r() * 0.35}'/>`)
        .join('')
    case 'moon':
      return `<circle cx='170' cy='120' r='70' fill='${light}'/><circle cx='200' cy='100' r='62' fill='${dark}'/>${[...Array(18)]
        .map(() => `<circle cx='${r() * 300}' cy='${r() * 300}' r='${0.8 + r() * 1.8}' fill='#fff' fill-opacity='.8'/>`)
        .join('')}<path d='M0 250q75-40 150 0t150 0v50H0z' fill='#000' fill-opacity='.25'/>`
    case 'rings':
      return [...Array(7)].map((_, i) => `<circle cx='${110 + r() * 30}' cy='${170 + r() * 30}' r='${30 + i * 26}' fill='none' stroke='${i % 2 ? light : '#fff'}' stroke-opacity='${0.6 - i * 0.07}' stroke-width='${3 + r() * 8}'/>`).join('')
    case 'waves':
      return [...Array(6)]
        .map((_, i) => {
          const y = 90 + i * 34
          const a = 14 + r() * 20
          return `<path d='M-10 ${y}q40 -${a} 80 0t80 0t80 0t80 0v400h-320z' fill='${i % 2 ? light : '#fff'}' fill-opacity='${0.18 + i * 0.07}'/>`
        })
        .join('')
    case 'bars':
      return [...Array(12)]
        .map((_, i) => {
          const h = 40 + r() * 190
          return `<rect x='${18 + i * 23}' y='${255 - h}' width='14' height='${h}' rx='7' fill='${i % 3 ? light : '#fff'}' fill-opacity='.8'/>`
        })
        .join('')
    case 'pixels': {
      // A little pixel-art critter, mirrored so it's symmetric.
      let s = ''
      for (let y = 0; y < 8; y++)
        for (let x = 0; x < 4; x++)
          if (r() < 0.55 || (y === 3 && x === 1)) {
            const c = y === 3 && x === 1 ? dark : light
            s += `<rect x='${70 + x * 20}' y='${70 + y * 20}' width='20' height='20' fill='${c}'/><rect x='${210 - x * 20}' y='${70 + y * 20}' width='20' height='20' fill='${c}'/>`
          }
      return s
    }
  }
}

export function cover(kind: Motif, colors: [string, string], seed: number) {
  const r = rng(seed * 977 + 13)
  return uri(`${gradient('g', [colors[1], shade(colors[1], 0.25)], r())}<rect width='300' height='300' fill='url(#g)'/>${motif(kind, colors, r)}`)
}

/** An abstract "portrait": a soft silhouette over a gradient. */
export function artistArt(colors: [string, string], seed: number) {
  const r = rng(seed * 131 + 7)
  const hx = 135 + r() * 30
  return uri(
    `${gradient('a', colors, r())}<rect width='300' height='300' fill='url(#a)'/><circle cx='${60 + r() * 180}' cy='${40 + r() * 80}' r='${50 + r() * 50}' fill='#fff' fill-opacity='.2'/><circle cx='${hx}' cy='125' r='52' fill='${colors[1]}' fill-opacity='.85'/><path d='M${hx - 105} 300q0-110 105-110t105 110z' fill='${colors[1]}' fill-opacity='.85'/>`,
  )
}

/** Playlist covers carry their name, like the big streaming apps' mixes. */
export function playlistCover(name: string, colors: [string, string], seed: number) {
  const r = rng(seed * 59 + 3)
  const words = name.split(' ')
  const lines = words.length > 2 ? [words.slice(0, -1).join(' '), words.at(-1)!] : words
  const text = lines.map((l, i) => `<text x='24' y='${226 + i * 34 - (lines.length - 1) * 34}' font-family='system-ui, sans-serif' font-size='32' font-weight='700' fill='#fff'>${l}</text>`).join('')
  return uri(
    `${gradient('p', colors, r())}<rect width='300' height='300' fill='url(#p)'/><circle cx='${200 + r() * 60}' cy='${50 + r() * 50}' r='${70 + r() * 40}' fill='#fff' fill-opacity='.18'/><rect width='300' height='300' fill='url(#p)' fill-opacity='0'/>${text}`,
  )
}

/**
 * For playlists you create: a 2×2 mosaic of the first covers, or a plain tile while empty.
 * The covers are data URIs themselves; encodeURIComponent leaves `'` alone, so they go in a
 * double-quoted href (a single-quoted one would end at the cover's first quote).
 */
export function mosaic(covers: string[]) {
  if (covers.length < 4)
    return covers[0] ?? uri(`<rect width='300' height='300' fill='#9e9e9e' fill-opacity='.25'/><path d='M120 90v90a25 25 0 1 1-12-21v-69h62v26h-50z' fill='#9e9e9e'/>`)
  return uri(covers.slice(0, 4).map((c, i) => `<image href="${c}" x='${(i % 2) * 150}' y='${Math.floor(i / 2) * 150}' width='150' height='150'/>`).join(''))
}

export const likedCover = uri(
  `${gradient('l', ['#7c4dff', '#b2dfdb'])}<rect width='300' height='300' fill='url(#l)'/><path d='M150 215l-12-11c-42-38-70-63-70-94 0-25 20-45 45-45 14 0 28 7 37 17 9-10 23-17 37-17 25 0 45 20 45 45 0 31-28 56-70 94z' fill='#fff'/>`,
)

function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16)
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v + amount * 255)))
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => c(v).toString(16).padStart(2, '0')).join('')}`
}
