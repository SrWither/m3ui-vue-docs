/*
 * Travel "photos" drawn as SVG from a seed, so the example needs no image hosting: beaches,
 * mountains, cities, deserts, forests, snow, lakes and islands, at golden hour, by day or at night.
 * Returned as data URIs: they work in <img>, MCarousel and backgrounds alike.
 */

export type SceneKind = 'beach' | 'mountain' | 'city' | 'desert' | 'forest' | 'snow' | 'lake' | 'island'

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

type Time = 'day' | 'golden' | 'night'
const skies: Record<Time, [string, string][]> = {
  day: [['#7ec8f2', '#d9f1ff'], ['#5fa8e8', '#cfe9ff'], ['#8fd3f4', '#f0fbff']],
  golden: [['#ff9e7a', '#ffe0a8'], ['#f2789f', '#ffd3a5'], ['#c86dd7', '#ffb88c']],
  night: [['#0b1d3a', '#3a3f7a'], ['#141e30', '#35577d'], ['#1b1035', '#4b3a74']],
}

const shade = (hex: string, amount: number) => {
  const n = parseInt(hex.slice(1), 16)
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v + amount * 255)))
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => c(v).toString(16).padStart(2, '0')).join('')}`
}

/** A jagged ridge from x=0 to x=w around height `y`, closed down to the bottom. */
function ridge(r: () => number, w: number, h: number, y: number, rough: number, peaks: number) {
  let d = `M0 ${h} L0 ${y + (r() - 0.5) * rough}`
  for (let i = 1; i <= peaks; i++) {
    const x = (w / peaks) * i
    d += ` L${x - w / peaks / 2} ${y - rough * (0.4 + r() * 0.6)} L${x} ${y + (r() - 0.5) * rough * 0.6}`
  }
  return `${d} L${w} ${h} Z`
}

/** A smooth rolling line (hills, dunes, waves), closed down to the bottom. */
function rolling(r: () => number, w: number, h: number, y: number, amp: number, waves: number) {
  let d = `M0 ${h} L0 ${y}`
  for (let i = 0; i < waves; i++) {
    const x0 = (w / waves) * i
    const x1 = (w / waves) * (i + 1)
    d += ` Q${(x0 + x1) / 2} ${y - amp * (0.5 + r())} ${x1} ${y + (r() - 0.5) * amp * 0.5}`
  }
  return `${d} L${w} ${h} Z`
}

function pine(x: number, base: number, size: number, color: string) {
  return `<path d='M${x} ${base - size} L${x + size * 0.35} ${base} L${x - size * 0.35} ${base} Z' fill='${color}'/>`
}

function palm(x: number, base: number, size: number, color: string) {
  const top = base - size
  return `<path d='M${x} ${base} Q${x + size * 0.12} ${base - size * 0.5} ${x + size * 0.05} ${top}' stroke='${color}' stroke-width='${size * 0.05}' fill='none'/>` +
    [-1, -0.4, 0.3, 1].map((s) => `<path d='M${x + size * 0.05} ${top} q${s * size * 0.3} ${-size * 0.12} ${s * size * 0.45} ${size * 0.12}' stroke='${color}' stroke-width='${size * 0.05}' fill='none' stroke-linecap='round'/>`).join('')
}

function body(kind: SceneKind, r: () => number, w: number, h: number) {
  const time: Time = pick(r, kind === 'city' ? ['night', 'night', 'golden'] : ['day', 'day', 'golden', 'golden', 'night'])
  const [top, bottom] = pick(r, skies[time])
  const night = time === 'night'
  const sunX = w * (0.2 + r() * 0.6)
  const sunY = h * (0.15 + r() * 0.2)
  let s = `<defs><linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${top}'/><stop offset='1' stop-color='${bottom}'/></linearGradient></defs><rect width='${w}' height='${h}' fill='url(#sky)'/>`
  if (night) {
    for (let i = 0; i < 40; i++) s += `<circle cx='${r() * w}' cy='${r() * h * 0.5}' r='${0.8 + r() * 1.6}' fill='#fff' fill-opacity='${0.4 + r() * 0.6}'/>`
    s += `<circle cx='${sunX}' cy='${sunY}' r='${Math.min(w, h) * 0.05}' fill='#f6f1d5'/>`
  } else {
    s += `<circle cx='${sunX}' cy='${sunY}' r='${Math.min(w, h) * (time === 'golden' ? 0.11 : 0.07)}' fill='${time === 'golden' ? '#fff1c1' : '#fffbe6'}' fill-opacity='.9'/>`
  }
  const dim = (c: string) => (night ? shade(c, -0.35) : time === 'golden' ? shade(c, -0.08) : c)
  const horizon = h * (0.55 + r() * 0.1)

  switch (kind) {
    case 'beach': {
      const sea = dim(pick(r, ['#1f8fbf', '#2aa5b8', '#1b7fa8']))
      s += `<rect y='${horizon}' width='${w}' height='${h - horizon}' fill='${sea}'/>`
      for (let i = 0; i < 6; i++) s += `<path d='M${r() * w} ${horizon + 10 + r() * (h - horizon) * 0.4} h${30 + r() * 60}' stroke='#fff' stroke-opacity='.35' stroke-width='3' stroke-linecap='round'/>`
      s += `<path d='${rolling(r, w, h, h * 0.8, h * 0.04, 2)}' fill='${dim('#f2d7a0')}'/>`
      s += palm(w * (r() < 0.5 ? 0.15 : 0.82), h * 0.86, h * 0.45, dim('#2f4a33'))
      break
    }
    case 'island': {
      const sea = dim(pick(r, ['#2bb3c0', '#1e9fb3']))
      s += `<rect y='${horizon}' width='${w}' height='${h - horizon}' fill='${sea}'/>`
      const cx = w * (0.35 + r() * 0.3)
      s += `<ellipse cx='${cx}' cy='${horizon + 6}' rx='${w * 0.24}' ry='${h * 0.06}' fill='${dim('#f0d9a8')}'/>`
      s += `<path d='M${cx - w * 0.18} ${horizon} Q${cx} ${horizon - h * 0.2} ${cx + w * 0.16} ${horizon} Z' fill='${dim('#3f8f5b')}'/>`
      s += palm(cx + w * 0.12, horizon + 4, h * 0.25, dim('#24402a'))
      s += `<rect y='${h * 0.85}' width='${w}' height='${h * 0.15}' fill='${dim(shade(sea, -0.1))}'/>`
      break
    }
    case 'mountain':
    case 'snow': {
      const far = dim(kind === 'snow' ? '#b9c6d9' : '#7d8fb3')
      const near = dim(kind === 'snow' ? '#e8eef6' : '#4a5d80')
      s += `<path d='${ridge(r, w, h, horizon - h * 0.12, h * 0.22, 3)}' fill='${far}'/>`
      s += `<path d='${ridge(r, w, h, horizon, h * 0.25, 2)}' fill='${near}'/>`
      if (kind === 'mountain') s += `<path d='${rolling(r, w, h, h * 0.82, h * 0.04, 3)}' fill='${dim('#4f7d4a')}'/>`
      else s += `<path d='${rolling(r, w, h, h * 0.82, h * 0.03, 3)}' fill='${dim('#f7fafd')}'/>`
      for (let i = 0; i < 7; i++) s += pine(r() * w, h * (0.86 + r() * 0.1), h * (0.1 + r() * 0.1), dim(kind === 'snow' ? '#2c4a43' : '#2f5135'))
      if (kind === 'snow') for (let i = 0; i < 30; i++) s += `<circle cx='${r() * w}' cy='${r() * h}' r='${1 + r() * 2.5}' fill='#fff' fill-opacity='.8'/>`
      break
    }
    case 'lake': {
      const mountain = dim('#5b6f95')
      s += `<path d='${ridge(r, w, h, horizon, h * 0.28, 3)}' fill='${mountain}'/>`
      const water = dim(pick(r, ['#3f7fae', '#2f6f8f']))
      s += `<rect y='${horizon}' width='${w}' height='${h - horizon}' fill='${water}'/>`
      // The mountains mirrored in the water, clipped to the lake.
      s += `<clipPath id='water'><rect y='${horizon}' width='${w}' height='${h - horizon}'/></clipPath><g clip-path='url(#water)'><g transform='translate(0 ${horizon * 2}) scale(1 -1)' opacity='.3'><path d='${ridge(rng(1), w, h, horizon, h * 0.28, 3)}' fill='${mountain}'/></g></g>`
      s += `<rect y='${horizon}' width='${w}' height='${h - horizon}' fill='${water}' fill-opacity='.45'/>`
      for (let i = 0; i < 5; i++) s += pine(r() * w, horizon + 2, h * (0.06 + r() * 0.06), dim('#25402f'))
      break
    }
    case 'forest': {
      s += `<path d='${rolling(r, w, h, horizon, h * 0.08, 3)}' fill='${dim('#5f9a62')}'/>`
      s += `<path d='${rolling(r, w, h, horizon + h * 0.12, h * 0.06, 2)}' fill='${dim('#3f7a4a')}'/>`
      for (let i = 0; i < 16; i++) {
        const y = horizon + h * 0.05 + r() * h * 0.4
        s += pine(r() * w, y, h * (0.12 + r() * 0.12), dim(pick(r, ['#24533a', '#2e6a44', '#1f4a33'])))
      }
      break
    }
    case 'desert': {
      s += `<path d='${rolling(r, w, h, horizon, h * 0.1, 2)}' fill='${dim('#e7b57a')}'/>`
      s += `<path d='${rolling(r, w, h, horizon + h * 0.15, h * 0.08, 3)}' fill='${dim('#d99a5b')}'/>`
      s += `<path d='${rolling(r, w, h, horizon + h * 0.28, h * 0.06, 2)}' fill='${dim('#c7834a')}'/>`
      break
    }
    case 'city': {
      const base = h * 0.9
      for (let layer = 0; layer < 2; layer++) {
        let x = -10
        const color = layer === 0 ? dim('#4a4f7a') : dim('#2a2d4a')
        while (x < w) {
          const bw = w * (0.06 + r() * 0.08)
          const bh = h * (layer === 0 ? 0.3 + r() * 0.3 : 0.2 + r() * 0.35)
          s += `<rect x='${x}' y='${base - bh}' width='${bw}' height='${bh}' fill='${color}'/>`
          if (layer === 1) {
            for (let wy = base - bh + 8; wy < base - 8; wy += 14) {
              for (let wx = x + 5; wx < x + bw - 6; wx += 10) {
                if (r() < (night ? 0.45 : 0.12)) s += `<rect x='${wx}' y='${wy}' width='4' height='6' fill='#ffd36e' fill-opacity='.85'/>`
              }
            }
          }
          x += bw + w * 0.005
        }
      }
      s += `<rect y='${base}' width='${w}' height='${h - base}' fill='${dim('#1d1f33')}'/>`
      break
    }
  }
  return s
}

/** A scene picture `w`×`h` for a destination kind; the same seed always draws the same scene. */
export function scene(kind: SceneKind, seed: number, w = 800, h = 900) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' preserveAspectRatio='xMidYMid slice'>${body(kind, rng(seed * 7919 + 13), w, h)}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
