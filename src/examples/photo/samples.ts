/*
 * The sample photos, painted on a canvas from a seed (no image hosting). Each one is meant to
 * give the tools something to do: a dusk lake for warmth and highlights, a bright meadow for
 * color, and a harbor at night for shadows.
 */
import { ctx2d, makeCanvas } from './imaging'

export interface Sample {
  id: string
  name: string
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number) => void
}

export const SAMPLE_W = 1600
export const SAMPLE_H = 1067

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function vgrad(ctx: CanvasRenderingContext2D, y0: number, y1: number, stops: [number, string][]) {
  const g = ctx.createLinearGradient(0, y0, 0, y1)
  for (const [o, c] of stops) g.addColorStop(o, c)
  return g
}

/** A ridge line from left to right, filled down to `bottom`. */
function ridge(ctx: CanvasRenderingContext2D, w: number, base: number, amp: number, bottom: number, rand: () => number, fill: string | CanvasGradient) {
  const freqs = [1 + rand() * 2, 3 + rand() * 3, 9 + rand() * 6]
  const phases = freqs.map(() => rand() * Math.PI * 2)
  ctx.beginPath()
  ctx.moveTo(0, bottom)
  for (let x = 0; x <= w; x += 8) {
    const t = x / w
    const y = base - amp * (0.6 * Math.sin(t * freqs[0]! * Math.PI + phases[0]!) + 0.3 * Math.sin(t * freqs[1]! * Math.PI + phases[1]!) + 0.1 * Math.sin(t * freqs[2]! * Math.PI + phases[2]!))
    ctx.lineTo(x, y)
  }
  ctx.lineTo(w, bottom)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
}

/** Fine noise over everything, so the pictures read more like photos than flat vectors. */
function noise(ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number, amount: number) {
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (rand() - 0.5) * amount
    d[i] = d[i]! + n
    d[i + 1] = d[i + 1]! + n
    d[i + 2] = d[i + 2]! + n
  }
  ctx.putImageData(img, 0, 0)
}

export const samples: Sample[] = [
  {
    id: 'lake',
    name: 'Lake at dusk',
    draw(ctx, w, h, rand) {
      const horizon = h * 0.6
      ctx.fillStyle = vgrad(ctx, 0, horizon, [[0, '#1c2a4a'], [0.45, '#7a5a8c'], [0.8, '#f08a5d'], [1, '#ffd29a']])
      ctx.fillRect(0, 0, w, horizon)
      // Sun with a glow.
      const sx = w * 0.62, sy = horizon - h * 0.07
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, h * 0.45)
      glow.addColorStop(0, 'rgba(255,240,200,0.9)')
      glow.addColorStop(0.1, 'rgba(255,200,140,0.5)')
      glow.addColorStop(1, 'rgba(255,160,120,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, horizon)
      ctx.fillStyle = '#fff6df'
      ctx.beginPath(); ctx.arc(sx, sy, h * 0.045, 0, Math.PI * 2); ctx.fill()
      // Thin clouds.
      for (let i = 0; i < 9; i++) {
        ctx.fillStyle = `rgba(255,${170 + rand() * 60},${150 + rand() * 50},${0.15 + rand() * 0.2})`
        ctx.beginPath()
        ctx.ellipse(rand() * w, h * (0.1 + rand() * 0.3), w * (0.08 + rand() * 0.15), h * (0.006 + rand() * 0.012), 0, 0, Math.PI * 2)
        ctx.fill()
      }
      ridge(ctx, w, horizon - h * 0.16, h * 0.12, horizon, rand, '#5a4a78')
      ridge(ctx, w, horizon - h * 0.08, h * 0.08, horizon, rand, '#3b3458')
      ridge(ctx, w, horizon - h * 0.02, h * 0.04, horizon, rand, '#252440')
      // The lake mirrors the sky, darker and with ripples.
      ctx.save()
      ctx.translate(0, horizon * 2)
      ctx.scale(1, -1)
      ctx.globalAlpha = 0.75
      ctx.drawImage(ctx.canvas, 0, 0, w, horizon, 0, 0, w, horizon)
      ctx.restore()
      ctx.fillStyle = vgrad(ctx, horizon, h, [[0, 'rgba(20,24,48,0.25)'], [1, 'rgba(10,12,28,0.85)']])
      ctx.fillRect(0, horizon, w, h - horizon)
      for (let i = 0; i < 260; i++) {
        const y = horizon + Math.pow(rand(), 1.6) * (h - horizon)
        const near = Math.abs(rand() * w - sx) < w * 0.12
        ctx.fillStyle = near ? `rgba(255,220,170,${0.2 + rand() * 0.4})` : `rgba(200,180,220,${0.05 + rand() * 0.1})`
        ctx.fillRect(near ? sx - w * 0.1 + rand() * w * 0.2 : rand() * w, y, 20 + rand() * 90, 1.5 + (y - horizon) / 160)
      }
      // A pine shore in front.
      ctx.fillStyle = '#0d0f1c'
      for (let x = -20; x < w * 0.35; x += 18 + rand() * 20) {
        const th = h * (0.12 + rand() * 0.2), base = h * 0.9 + rand() * 20
        ctx.beginPath(); ctx.moveTo(x, base - th); ctx.lineTo(x - th * 0.22, base); ctx.lineTo(x + th * 0.22, base); ctx.fill()
      }
      ctx.fillRect(0, h * 0.9, w * 0.4, h * 0.1)
      ridge(ctx, w, h * 0.97, h * 0.02, h, rand, '#0b0c17')
      noise(ctx, w, h, rand, 14)
    },
  },
  {
    id: 'meadow',
    name: 'Spring meadow',
    draw(ctx, w, h, rand) {
      const horizon = h * 0.48
      ctx.fillStyle = vgrad(ctx, 0, horizon, [[0, '#3b7fd1'], [0.7, '#8cc2f0'], [1, '#d7ecfa']])
      ctx.fillRect(0, 0, w, horizon + 4)
      for (let i = 0; i < 7; i++) {
        const cx = rand() * w, cy = h * (0.08 + rand() * 0.25), s = w * (0.04 + rand() * 0.05)
        for (let j = 0; j < 7; j++) {
          ctx.fillStyle = `rgba(255,255,255,${0.55 + rand() * 0.35})`
          ctx.beginPath(); ctx.arc(cx + (rand() - 0.5) * s * 3, cy + (rand() - 0.5) * s * 0.6, s * (0.5 + rand() * 0.6), 0, Math.PI * 2); ctx.fill()
        }
      }
      ridge(ctx, w, horizon - h * 0.04, h * 0.05, h, rand, '#7fa6a8')
      ridge(ctx, w, horizon + h * 0.02, h * 0.05, h, rand, vgrad(ctx, horizon, h, [[0, '#6aa84f'], [1, '#2f6b26']]))
      ridge(ctx, w, horizon + h * 0.14, h * 0.06, h, rand, vgrad(ctx, horizon, h, [[0, '#7cc252'], [1, '#3c7d2a']]))
      // A tree on the hill.
      const tx = w * 0.72, ty = horizon + h * 0.06
      ctx.fillStyle = '#4a3322'
      ctx.fillRect(tx - 8, ty - h * 0.02, 16, h * 0.12)
      for (let i = 0; i < 26; i++) {
        ctx.fillStyle = `hsl(${100 + rand() * 30} ${40 + rand() * 20}% ${22 + rand() * 18}%)`
        ctx.beginPath(); ctx.arc(tx + (rand() - 0.5) * 150, ty - h * 0.06 + (rand() - 0.5) * 90, 30 + rand() * 30, 0, Math.PI * 2); ctx.fill()
      }
      // Flowers, denser and bigger toward the front.
      const hues = [350, 45, 280, 10, 55, 200]
      for (let i = 0; i < 1800; i++) {
        const t = Math.pow(rand(), 0.7)
        const y = horizon + h * 0.12 + t * (h * 0.9 - horizon)
        const x = rand() * w, r = 1.5 + t * 9
        ctx.fillStyle = `hsl(${hues[Math.floor(rand() * hues.length)]} ${70 + rand() * 25}% ${55 + rand() * 20}%)`
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
      }
      for (let i = 0; i < 900; i++) {
        const x = rand() * w, y = h * 0.75 + rand() * h * 0.25
        ctx.strokeStyle = `hsl(${95 + rand() * 30} 55% ${25 + rand() * 20}%)`
        ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(x, y + 30); ctx.quadraticCurveTo(x + (rand() - 0.5) * 30, y, x + (rand() - 0.5) * 20, y - 20 - rand() * 40); ctx.stroke()
      }
      noise(ctx, w, h, rand, 10)
    },
  },
  {
    id: 'harbor',
    name: 'Harbor at night',
    draw(ctx, w, h, rand) {
      const water = h * 0.68
      ctx.fillStyle = vgrad(ctx, 0, water, [[0, '#05070f'], [0.6, '#13203c'], [1, '#2c3a5e']])
      ctx.fillRect(0, 0, w, water)
      for (let i = 0; i < 260; i++) {
        ctx.fillStyle = `rgba(255,255,255,${rand() * 0.7})`
        ctx.fillRect(rand() * w, rand() * water * 0.6, 1.5, 1.5)
      }
      ctx.fillStyle = '#f4f1e2'
      ctx.beginPath(); ctx.arc(w * 0.18, h * 0.16, h * 0.035, 0, Math.PI * 2); ctx.fill()
      // Two rows of buildings with lit windows.
      const lights: [number, number, string][] = []
      for (const [shade, top, minW] of [['#121a2e', 0.32, 60], ['#0a0f1d', 0.42, 80]] as const) {
        for (let x = -10; x < w;) {
          const bw = minW + rand() * 90, bh = h * (0.12 + rand() * (water / h - top))
          const y = water - bh
          ctx.fillStyle = shade
          ctx.fillRect(x, y, bw, bh)
          for (let wy = y + 12; wy < water - 14; wy += 18) {
            for (let wx = x + 8; wx < x + bw - 10; wx += 16) {
              if (rand() < 0.35) {
                const c = rand() < 0.8 ? `hsl(${38 + rand() * 12} 95% ${62 + rand() * 20}%)` : '#bfe3ff'
                ctx.fillStyle = c
                ctx.fillRect(wx, wy, 8, 10)
                if (rand() < 0.3) lights.push([wx + 4, wy, c])
              }
            }
          }
          x += bw + rand() * 6
        }
      }
      // Water: dark, with streaks of the city lights.
      ctx.fillStyle = vgrad(ctx, water, h, [[0, '#101a30'], [1, '#03050b']])
      ctx.fillRect(0, water, w, h - water)
      for (const [x, y, c] of lights) {
        ctx.fillStyle = c
        const len = (water - y) * 0.6
        for (let k = 0; k < 6; k++) {
          ctx.globalAlpha = 0.5 - k * 0.07
          ctx.fillRect(x - 6 + (rand() - 0.5) * 10, water + 6 + k * (len / 6), 6 + rand() * 14, 2)
        }
      }
      ctx.globalAlpha = 1
      // A pier with lamps.
      ctx.fillStyle = '#05060b'
      ctx.fillRect(0, h * 0.86, w * 0.55, h * 0.03)
      for (let x = 40; x < w * 0.55; x += 150) {
        ctx.fillRect(x, h * 0.86, 8, h * 0.14)
        ctx.fillRect(x + 2, h * 0.72, 4, h * 0.14)
        const g = ctx.createRadialGradient(x + 4, h * 0.72, 0, x + 4, h * 0.72, 70)
        g.addColorStop(0, 'rgba(255,214,140,0.95)')
        g.addColorStop(1, 'rgba(255,190,110,0)')
        ctx.fillStyle = g
        ctx.fillRect(x - 70, h * 0.72 - 70, 148, 140)
        ctx.fillStyle = '#05060b'
      }
      noise(ctx, w, h, rand, 16)
    },
  },
]

const cache = new Map<string, HTMLCanvasElement>()

export function sampleCanvas(id: string) {
  const s = samples.find((x) => x.id === id) ?? samples[0]!
  let c = cache.get(s.id)
  if (!c) {
    c = makeCanvas(SAMPLE_W, SAMPLE_H)
    s.draw(ctx2d(c, true), SAMPLE_W, SAMPLE_H, rng(s.id.length * 7919 + s.id.charCodeAt(0)))
    cache.set(s.id, c)
  }
  return c
}

/** A small preview of a sample, as a data URL for the open dialog. */
export function sampleThumb(id: string, width = 240) {
  const src = sampleCanvas(id)
  const c = makeCanvas(width, (width * src.height) / src.width)
  ctx2d(c).drawImage(src, 0, 0, c.width, c.height)
  return c.toDataURL('image/jpeg', 0.8)
}
