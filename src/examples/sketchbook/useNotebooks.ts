// Quill's documents: boards (an endless canvas) and notebooks (pages), each a list of MDrawCanvas items with its
// layers and paper. Kept in this browser's localStorage, so a sketch survives a reload; three samples to start.
import { computed, ref, watch } from 'vue'
import { drawId, type DrawItem, type DrawLayer, type DrawPoint } from '@m3ui-vue/m3ui-vue/draw'

export interface Doc {
  id: string
  title: string
  mode: 'infinite' | 'pages'
  background: 'none' | 'grid' | 'dots' | 'lines'
  pages: number
  items: DrawItem[]
  layers: DrawLayer[]
  /** A picture under the drawing, to trace, and where it sits on a board */
  image?: string
  imageBox?: { x: number; y: number; width: number; height: number }
  updated: number
}

export const PAGE = { width: 560, height: 794 }
export const PAPER = '#fffdf8'

// ── Samples ─────────────────────────────────────────────────────────────────────────────────────────────
/** A wobbly line of "handwriting" from (x, y), `w` long */
function scribble(x: number, y: number, w: number, color = '#1d1b20', size = 2.2, seed = 1): DrawItem {
  const points: DrawPoint[] = []
  for (let i = 0; i <= w / 3; i++) {
    const t = i * 3
    const wave = Math.sin((t + seed * 13) / 4.5) * 5 + Math.sin((t + seed * 7) / 1.7) * 2.2
    points.push([x + t, y + wave, 0.45 + 0.4 * Math.abs(Math.sin((t + seed) / 9))])
  }
  return { id: drawId(), type: 'stroke', pen: 'pen', color, size, points }
}
const curve = (pts: [number, number][], pen: 'brush' | 'marker' | 'pen', color: string, size: number): DrawItem => ({
  id: drawId(),
  type: 'stroke',
  pen,
  color,
  size,
  points: pts.map(([x, y], i) => [x, y, 0.5 + 0.5 * Math.sin((i / Math.max(1, pts.length - 1)) * Math.PI)]),
})
const arc = (cx: number, cy: number, r: number, from: number, to: number, n = 40) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = from + ((to - from) * i) / n
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as [number, number]
  })

function welcome(): Doc {
  const items: DrawItem[] = [
    { id: drawId(), type: 'text', at: [40, 30], text: 'Welcome to Quill', size: 34, color: '#6750a4' },
    { id: drawId(), type: 'text', at: [42, 82], text: 'Draw with a pen, a finger or the mouse.\nA stylus draws with its pressure; its eraser end erases.', size: 16, color: '#49454f' },
    { id: drawId(), type: 'shape', shape: 'ellipse', from: [470, 40], to: [560, 130], color: '#f9a825', size: 3, fill: '#fff176' },
    curve(arc(515, 85, 62, 0, Math.PI * 2, 24).map(([x, y], i) => (i % 2 ? [x, y] : [515 + (x - 515) * 1.18, 85 + (y - 85) * 1.18])), 'marker', '#f9a825', 3),
    curve([[40, 260], [140, 190], [240, 240], [340, 180], [440, 230], [560, 200]], 'brush', '#43a047', 16),
    { id: drawId(), type: 'shape', shape: 'arrow', from: [330, 330], to: [430, 260], color: '#e53935', size: 3 },
    { id: drawId(), type: 'text', at: [180, 320], text: 'try the lasso →', size: 18, color: '#e53935' },
    { id: drawId(), type: 'shape', shape: 'rect', from: [60, 360], to: [170, 430], color: '#1e88e5', size: 3, fill: '#bbdefb' },
  ]
  return { id: 'welcome', title: 'Welcome', mode: 'infinite', background: 'dots', pages: 1, items, layers: [], updated: Date.now() }
}
function notes(): Doc {
  const items: DrawItem[] = [{ id: drawId(), type: 'text', at: [40, 36], text: 'Physics · Waves', size: 26, color: '#1d1b20', page: 0 }]
  let seed = 1
  for (let line = 0; line < 9; line++) {
    const y = 120 + line * 30 + (line > 4 ? 40 : 0)
    items.push({ ...scribble(48, y, 180 + ((line * 97) % 260), '#1d1b20', 2.2, seed++), page: 0 })
  }
  items.push({ id: drawId(), type: 'stroke', pen: 'highlighter', color: '#fdd835', size: 18, points: [[44, 180, 1], [300, 180, 1]], page: 0 })
  // A sine wave sketch on the second page
  items.push({ id: drawId(), type: 'text', at: [40, 36], text: 'y = A sin(kx − ωt)', size: 22, color: '#1e88e5', page: 1 })
  items.push({ id: drawId(), type: 'shape', shape: 'arrow', from: [40, 260], to: [520, 260], color: '#49454f', size: 2, page: 1 })
  items.push({ id: drawId(), type: 'shape', shape: 'arrow', from: [60, 400], to: [60, 110], color: '#49454f', size: 2, page: 1 })
  items.push({ ...curve(Array.from({ length: 60 }, (_, i) => [60 + i * 7.5, 260 - Math.sin(i / 4.7) * 90] as [number, number]), 'pen', '#e53935', 3), page: 1 })
  return { id: 'notes', title: 'Lecture notes', mode: 'pages', background: 'lines', pages: 2, items, layers: [], updated: Date.now() - 3_600_000 }
}
function trace(): Doc {
  return {
    id: 'trace',
    title: 'Trace a photo',
    mode: 'infinite',
    background: 'none',
    pages: 1,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=70',
    imageBox: { x: 0, y: 0, width: 900, height: 600 },
    items: [{ id: drawId(), type: 'text', at: [24, 24], text: 'Trace the ridges on the Ink layer', size: 22, color: '#ffffff', layer: 'ink' }],
    layers: [{ id: 'ink', name: 'Ink' }],
    updated: Date.now() - 86_400_000,
  }
}

// ── State ───────────────────────────────────────────────────────────────────────────────────────────────
const KEY = 'm3-example-quill'
function read(): Doc[] | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Doc[]) : null
  } catch {
    return null
  }
}
const docs = ref<Doc[]>(read() ?? [welcome(), notes(), trace()])
const currentId = ref(docs.value[0]!.id)
let timer = 0
watch(docs, (d) => {
  clearTimeout(timer)
  timer = window.setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(d))
    } catch {
      /* full or blocked: the drawing just isn't kept */
    }
  }, 400)
}, { deep: true })

export function useNotebooks() {
  const current = computed(() => docs.value.find((d) => d.id === currentId.value) ?? docs.value[0]!)
  const sorted = computed(() => [...docs.value].sort((a, b) => b.updated - a.updated))
  function update(patch: Partial<Doc>) {
    docs.value = docs.value.map((d) => (d.id === current.value.id ? { ...d, ...patch, updated: Date.now() } : d))
  }
  function create(mode: Doc['mode']) {
    const d: Doc = { id: drawId(), title: mode === 'pages' ? 'Notebook' : 'Board', mode, background: mode === 'pages' ? 'lines' : 'dots', pages: 1, items: [], layers: [], updated: Date.now() }
    docs.value = [d, ...docs.value]
    currentId.value = d.id
  }
  function remove(id: string) {
    if (docs.value.length < 2) return
    docs.value = docs.value.filter((d) => d.id !== id)
    if (currentId.value === id) currentId.value = sorted.value[0]!.id
  }
  function restoreSamples() {
    docs.value = [welcome(), notes(), trace(), ...docs.value.filter((d) => !['welcome', 'notes', 'trace'].includes(d.id))]
    currentId.value = 'welcome'
  }
  return { docs, sorted, currentId, current, update, create, remove, restoreSamples }
}
