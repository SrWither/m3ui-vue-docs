/*
 * The pixel side of the editor: adjustments, filter presets, straightening, the histogram and
 * "auto". Everything works on plain canvases and ImageData, without any library.
 */

export interface Adjustments {
  exposure: number
  contrast: number
  highlights: number
  shadows: number
  temperature: number
  tint: number
  vibrance: number
  saturation: number
  fade: number
  vignette: number
  grain: number
}
export type AdjustKey = keyof Adjustments

export interface AdjustDef {
  key: AdjustKey
  label: string
  icon: string
  group: 'Light' | 'Color' | 'Effects'
  min: number
}

export const adjustDefs: AdjustDef[] = [
  { key: 'exposure', label: 'Exposure', icon: 'exposure', group: 'Light', min: -100 },
  { key: 'contrast', label: 'Contrast', icon: 'contrast', group: 'Light', min: -100 },
  { key: 'highlights', label: 'Highlights', icon: 'wb_sunny', group: 'Light', min: -100 },
  { key: 'shadows', label: 'Shadows', icon: 'nights_stay', group: 'Light', min: -100 },
  { key: 'temperature', label: 'Warmth', icon: 'thermostat', group: 'Color', min: -100 },
  { key: 'tint', label: 'Tint', icon: 'colorize', group: 'Color', min: -100 },
  { key: 'vibrance', label: 'Vibrance', icon: 'palette', group: 'Color', min: -100 },
  { key: 'saturation', label: 'Saturation', icon: 'invert_colors', group: 'Color', min: -100 },
  { key: 'fade', label: 'Fade', icon: 'gradient', group: 'Effects', min: 0 },
  { key: 'vignette', label: 'Vignette', icon: 'vignette', group: 'Effects', min: -100 },
  { key: 'grain', label: 'Grain', icon: 'grain', group: 'Effects', min: 0 },
]

export const neutral = (): Adjustments => ({
  exposure: 0, contrast: 0, highlights: 0, shadows: 0, temperature: 0, tint: 0,
  vibrance: 0, saturation: 0, fade: 0, vignette: 0, grain: 0,
})

type RGB = [number, number, number]
export interface Preset {
  id: string
  name: string
  adjust: Partial<Adjustments>
  /** 0..1, how much the picture turns black and white. */
  mono?: number
  /** Split toning: shadows and highlights pushed toward two colors. */
  split?: { shadows: RGB; highlights: RGB; amount: number }
}

export const presets: Preset[] = [
  { id: 'none', name: 'Original', adjust: {} },
  { id: 'vivid', name: 'Vivid', adjust: { contrast: 15, vibrance: 45, saturation: 10 } },
  { id: 'golden', name: 'Golden', adjust: { temperature: 35, exposure: 5, vibrance: 15, fade: 5 } },
  { id: 'nordic', name: 'Nordic', adjust: { temperature: -30, tint: 5, saturation: -15, contrast: 10 } },
  { id: 'mono', name: 'Mono', adjust: { contrast: 10 }, mono: 1 },
  { id: 'noir', name: 'Noir', adjust: { contrast: 45, shadows: -25, vignette: 40 }, mono: 1 },
  { id: 'haze', name: 'Haze', adjust: { fade: 35, contrast: -15, saturation: -10, exposure: 5 } },
  {
    id: 'vintage', name: 'Vintage', adjust: { fade: 20, temperature: 20, saturation: -25, vignette: 30, grain: 25 },
    split: { shadows: [40, 60, 90], highlights: [255, 220, 170], amount: 0.25 },
  },
  {
    id: 'film', name: 'Film', adjust: { contrast: 12, fade: 12, grain: 35, vibrance: 10 },
    split: { shadows: [30, 70, 80], highlights: [255, 200, 150], amount: 0.2 },
  },
  {
    id: 'teal', name: 'Teal & orange', adjust: { contrast: 15, vibrance: 20 },
    split: { shadows: [0, 110, 130], highlights: [255, 160, 80], amount: 0.35 },
  },
  { id: 'drama', name: 'Dramatic', adjust: { contrast: 35, highlights: -35, shadows: 25, saturation: -20, vignette: 35 } },
  { id: 'matte', name: 'Matte', adjust: { fade: 25, contrast: -10, highlights: -20, saturation: -5 } },
]
export const presetById = (id: string) => presets.find((p) => p.id === id) ?? presets[0]!

/** Everything that changes how the photo itself looks. */
export interface Look {
  adjust: Adjustments
  preset: string
  /** 0..100, how strongly the preset applies. */
  intensity: number
}

export const isNeutral = (look: Look) =>
  look.preset === 'none' && Object.values(look.adjust).every((v) => v === 0)

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v)

/** Applies a look to pixels in place. Vignette and grain need the pixel's position, so they use the image size. */
export function processImageData(img: ImageData, look: Look) {
  const p = presetById(look.preset)
  const k = look.intensity / 100
  const a = { ...look.adjust }
  for (const key of Object.keys(p.adjust) as AdjustKey[]) a[key] += (p.adjust[key] ?? 0) * k
  const mono = (p.mono ?? 0) * k
  const split = p.split ? { ...p.split, amount: p.split.amount * k } : null

  const exp = Math.pow(2, a.exposure / 50)
  const c = clamp(a.contrast, -100, 100) * 1.28
  const cf = (259 * (c + 255)) / (255 * (259 - c))
  const hl = a.highlights / 100
  const sh = a.shadows / 100
  const warm = a.temperature * 0.3
  const tint = a.tint * 0.3
  const sat = 1 + a.saturation / 100
  const vib = a.vibrance / 100
  const fade = clamp(a.fade, 0, 100) / 100
  const vig = a.vignette / 100
  const grain = clamp(a.grain, 0, 100) * 0.45

  const { data, width: w, height: h } = img
  const diag = Math.hypot(w / 2, h / 2)
  for (let y = 0, i = 0; y < h; y++) {
    const dy = y - h / 2
    for (let x = 0; x < w; x++, i += 4) {
      let r = data[i]! * exp
      let g = data[i + 1]! * exp
      let b = data[i + 2]! * exp

      r += warm + tint * 0.5
      g -= tint
      b += -warm + tint * 0.5

      if (sh || hl) {
        const l = clamp((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255, 0, 1)
        const d = sh * 90 * (1 - l) * (1 - l) + hl * 90 * l * l
        r += d; g += d; b += d
      }

      if (c) {
        r = (r - 128) * cf + 128
        g = (g - 128) * cf + 128
        b = (b - 128) * cf + 128
      }

      if (sat !== 1 || vib) {
        const l = 0.2126 * r + 0.7152 * g + 0.0722 * b
        const s = (Math.max(r, g, b) - Math.min(r, g, b)) / 255
        const f = Math.max(0, sat * (1 + vib * (1 - clamp(s, 0, 1))))
        r = l + (r - l) * f
        g = l + (g - l) * f
        b = l + (b - l) * f
      }

      if (mono) {
        const l = 0.2126 * r + 0.7152 * g + 0.0722 * b
        r += (l - r) * mono
        g += (l - g) * mono
        b += (l - b) * mono
      }

      if (split && split.amount) {
        const l = clamp((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255, 0, 1)
        const t = split.amount * 0.6
        r += (split.shadows[0] + (split.highlights[0] - split.shadows[0]) * l - 128) * t
        g += (split.shadows[1] + (split.highlights[1] - split.shadows[1]) * l - 128) * t
        b += (split.shadows[2] + (split.highlights[2] - split.shadows[2]) * l - 128) * t
      }

      if (fade) {
        r = fade * 55 + r * (1 - fade * 0.3)
        g = fade * 55 + g * (1 - fade * 0.3)
        b = fade * 55 + b * (1 - fade * 0.3)
      }

      if (vig) {
        const d = Math.hypot(x - w / 2, dy) / diag
        const t = clamp((d - 0.35) / 0.65, 0, 1)
        const f = 1 - vig * t * t * (3 - 2 * t) * 0.85
        r *= f; g *= f; b *= f
      }

      if (grain) {
        // A position hash, so the grain stays put while you move sliders.
        let n = (x * 73856093) ^ (y * 19349663)
        n = Math.imul(n ^ (n >>> 16), 0x45d9f3b)
        n = Math.imul(n ^ (n >>> 16), 0x45d9f3b)
        const v = (((n ^ (n >>> 16)) >>> 0) / 4294967296 - 0.5) * grain
        r += v; g += v; b += v
      }

      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
    }
  }
}

export function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = Math.max(1, Math.round(w))
  c.height = Math.max(1, Math.round(h))
  return c
}

/**
 * `read` asks for a canvas kept in memory for getImageData. Only canvases whose pixels are read
 * should use it: it turns off GPU drawing, which made every brush frame slow when it was the default.
 * A canvas keeps the mode of its first getContext call.
 */
export const ctx2d = (c: HTMLCanvasElement, read = false) =>
  c.getContext('2d', read ? { willReadFrequently: true } : undefined)!

export function cloneCanvas(src: HTMLCanvasElement) {
  const c = makeCanvas(src.width, src.height)
  ctx2d(c).drawImage(src, 0, 0)
  return c
}

/** How much a W×H picture rotated by `deg` must grow so it still covers its own frame. */
export function coverScale(w: number, h: number, deg: number) {
  const t = Math.abs((deg * Math.PI) / 180)
  const cos = Math.cos(t), sin = Math.sin(t)
  return Math.max((w * cos + h * sin) / w, (w * sin + h * cos) / h)
}

/** The photo at `scale`, straightened by `angle` degrees, with the look applied. */
export function renderPhoto(src: HTMLCanvasElement, angle: number, look: Look | null, scale: number) {
  const out = makeCanvas(src.width * scale, src.height * scale)
  const ctx = ctx2d(out, true)
  ctx.imageSmoothingQuality = 'high'
  if (angle) {
    const k = coverScale(out.width, out.height, angle)
    ctx.translate(out.width / 2, out.height / 2)
    ctx.rotate((angle * Math.PI) / 180)
    ctx.scale(k, k)
    ctx.drawImage(src, -out.width / 2, -out.height / 2, out.width, out.height)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  } else {
    ctx.drawImage(src, 0, 0, out.width, out.height)
  }
  if (look && !isNeutral(look)) {
    const img = ctx.getImageData(0, 0, out.width, out.height)
    processImageData(img, look)
    ctx.putImageData(img, 0, 0)
  }
  // Hand back a GPU copy: the result is drawn every frame, this read-friendly canvas only once.
  const gpu = makeCanvas(out.width, out.height)
  ctx2d(gpu).drawImage(out, 0, 0)
  return gpu
}

export interface Histogram { r: Uint32Array; g: Uint32Array; b: Uint32Array; l: Uint32Array; max: number }

const histoCanvas = makeCanvas(320, 320)

export function histogram(c: HTMLCanvasElement): Histogram {
  // Read a small copy: reading a GPU canvas back is the slow part, and 320px is plenty for 256 bins.
  const k = Math.min(1, 320 / Math.max(c.width, c.height))
  const w = Math.max(1, Math.round(c.width * k)), h = Math.max(1, Math.round(c.height * k))
  const hctx = ctx2d(histoCanvas, true)
  hctx.clearRect(0, 0, 320, 320)
  hctx.drawImage(c, 0, 0, w, h)
  const { data } = hctx.getImageData(0, 0, w, h)
  const r = new Uint32Array(256), g = new Uint32Array(256), b = new Uint32Array(256), l = new Uint32Array(256)
  const step = 4
  for (let i = 0; i < data.length; i += step) {
    r[data[i]!]!++
    g[data[i + 1]!]!++
    b[data[i + 2]!]!++
    l[Math.round(0.2126 * data[i]! + 0.7152 * data[i + 1]! + 0.0722 * data[i + 2]!)]!++
  }
  // Ignore the clipped ends when scaling, or one pure-black area flattens the rest.
  let max = 1
  for (let i = 2; i < 254; i++) max = Math.max(max, r[i]!, g[i]!, b[i]!)
  return { r, g, b, l, max }
}

/** A starting point like a phone's "auto": spread the tones and center the exposure. */
export function autoAdjust(c: HTMLCanvasElement): Partial<Adjustments> {
  const { l } = histogram(c)
  let total = 0, sum = 0
  for (let i = 0; i < 256; i++) { total += l[i]!; sum += l[i]! * i }
  const pct = (p: number) => {
    let acc = 0
    for (let i = 0; i < 256; i++) { acc += l[i]!; if (acc >= total * p) return i / 255 }
    return 1
  }
  const lo = pct(0.02), hi = pct(0.98), mean = sum / total / 255
  return {
    exposure: Math.round(clamp(Math.log2(0.48 / Math.max(mean, 0.05)) * 50, -60, 60)),
    contrast: Math.round(clamp((0.85 - (hi - lo)) * 70, -15, 40)),
    shadows: Math.round(clamp((0.06 - lo) * 300, -10, 30)),
    highlights: Math.round(clamp((0.94 - hi) * 300, -30, 10)),
    vibrance: 20,
  }
}

export function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}
