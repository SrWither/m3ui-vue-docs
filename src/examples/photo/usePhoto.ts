/*
 * The editor's state, shared by every component (module level, one editor per page):
 * the document (photo, look, straighten angle, crop and layers), the tools, the view, and
 * an undo history of snapshots.
 *
 * Canvases are marked raw: Vue must not proxy them (methods called on a proxy throw), and
 * they are copy-on-write, so a snapshot can keep pointing at an old one cheaply.
 */
import { computed, markRaw, reactive, ref, shallowRef } from 'vue'
import { useToast } from '@m3ui-vue/m3ui-vue'
import {
  autoAdjust, cloneCanvas, ctx2d, makeCanvas, neutral, presetById, renderPhoto,
  type AdjustKey, type Adjustments, type Histogram, type Look,
} from './imaging'
import { sampleCanvas, samples } from './samples'

export type Blend = 'source-over' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'color' | 'difference'
export const blends: { value: Blend; label: string }[] = [
  { value: 'source-over', label: 'Normal' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'screen', label: 'Screen' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'soft-light', label: 'Soft light' },
  { value: 'color', label: 'Color' },
  { value: 'difference', label: 'Difference' },
]

export type FontId = 'sans' | 'serif' | 'mono' | 'hand'
export const fonts: { id: FontId; label: string; css: string }[] = [
  { id: 'sans', label: 'Sans', css: 'system-ui, sans-serif' },
  { id: 'serif', label: 'Serif', css: 'Georgia, "Times New Roman", serif' },
  { id: 'mono', label: 'Mono', css: 'ui-monospace, Menlo, monospace' },
  { id: 'hand', label: 'Hand', css: '"Comic Sans MS", "Segoe Print", cursive' },
]

interface LayerBase { id: string; name: string; visible: boolean; opacity: number; blend: Blend }
export interface PaintLayer extends LayerBase { kind: 'paint'; canvas: HTMLCanvasElement }
export interface TextLayer extends LayerBase {
  kind: 'text'
  text: string
  /** Center of the text block, in document pixels. */
  x: number
  y: number
  size: number
  color: string
  font: FontId
  bold: boolean
  shadow: boolean
  sticker: boolean
}
export type Layer = PaintLayer | TextLayer

export interface Rect { x: number; y: number; w: number; h: number }

export interface Doc {
  name: string
  source: HTMLCanvasElement
  look: Look
  /** Straighten, in degrees (-45..45). */
  angle: number
  crop: Rect | null
  /** Bottom to top; the photo is always under all of them. */
  layers: Layer[]
}

export type Tool = 'move' | 'crop' | 'brush' | 'eraser' | 'text' | 'eyedropper'
export const tools: { id: Tool; label: string; icon: string; key: string; hint: string }[] = [
  { id: 'move', label: 'Move', icon: 'pan_tool', key: 'V', hint: 'Drag to pan, drag text to move it. Ctrl + wheel or pinch to zoom.' },
  { id: 'crop', label: 'Crop & rotate', icon: 'crop_rotate', key: 'C', hint: 'Drag the corners or the frame. Enter applies, Esc cancels.' },
  { id: 'brush', label: 'Brush', icon: 'brush', key: 'B', hint: 'Paint on a paint layer. [ and ] change the size.' },
  { id: 'eraser', label: 'Eraser', icon: 'ink_eraser', key: 'E', hint: 'Erase from the selected paint layer.' },
  { id: 'text', label: 'Text', icon: 'title', key: 'T', hint: 'Click the photo to add text; double-click text to edit it.' },
  { id: 'eyedropper', label: 'Color picker', icon: 'colorize', key: 'I', hint: 'Click the photo to pick a color for the brush and text.' },
]

const MAX_SIDE = 1600
const HISTORY_LIMIT = 40
let uid = 0
const newId = () => `l${++uid}`

// ─── State ──────────────────────────────────────────────────────────────────

const doc = ref<Doc>(blankDoc(sampleCanvas('lake'), samples[0]!.name))
const selectedId = ref<string | null>(null)
const tool = ref<Tool>('move')
const brush = reactive({ size: 24, opacity: 100, hardness: 80, color: '#ffd166' })
const showOriginal = ref(false)
/** Crop draft while the crop tool is open, in document pixels. */
const cropDraft = ref<Rect | null>(null)
const cropRatio = ref<string>('free')
/** Bumped whenever pixels change without a reactive change (painting). */
const pixelTick = ref(0)
const view = reactive({ zoom: 1, panX: 0, panY: 0, stageW: 0, stageH: 0 })
const pointer = ref<{ x: number; y: number } | null>(null)
/** Of what's on screen, updated by the stage after each render. */
const histo = shallowRef<Histogram | null>(null)
const dialogs = reactive({ open: false, export: false, shortcuts: false, editText: false, sticker: false, revert: false, about: false, history: false })
/** The layer being renamed (the rename dialog is open while set). */
const renameId = ref<string | null>(null)
const panelTab = ref<'adjust' | 'filters' | 'layers' | 'history'>('adjust')

function blankDoc(source: HTMLCanvasElement, name: string): Doc {
  return { name, source: markRaw(source), look: { adjust: neutral(), preset: 'none', intensity: 100 }, angle: 0, crop: null, layers: [] }
}

// ─── History ────────────────────────────────────────────────────────────────

interface Entry { label: string; icon: string; state: Doc }
const history = shallowRef<Entry[]>([])
const index = ref(-1)

function snapshot(d: Doc): Doc {
  return {
    name: d.name,
    source: d.source,
    look: { adjust: { ...d.look.adjust }, preset: d.look.preset, intensity: d.look.intensity },
    angle: d.angle,
    crop: d.crop ? { ...d.crop } : null,
    layers: d.layers.map((l) => ({ ...l })),
  }
}
function restore(s: Doc) {
  const d = snapshot(s)
  d.layers.forEach((l) => l.kind === 'paint' && markRaw(l.canvas))
  doc.value = d
  if (selectedId.value && !d.layers.some((l) => l.id === selectedId.value)) selectedId.value = null
  pixelTick.value++
}

let pending: { label: string; icon: string; timer: ReturnType<typeof setTimeout> } | null = null

function commit(label: string, icon: string) {
  if (pending) { clearTimeout(pending.timer); pending = null }
  const list = history.value.slice(0, index.value + 1)
  list.push({ label, icon, state: snapshot(doc.value) })
  while (list.length > HISTORY_LIMIT) list.splice(1, 1) // keep the opened photo as the first step
  history.value = list
  index.value = list.length - 1
}
/** For sliders and typing: one history step once the value settles. */
function commitSoon(label: string, icon: string) {
  if (pending && pending.label !== label) flush()
  if (pending) clearTimeout(pending.timer)
  pending = { label, icon, timer: setTimeout(() => commit(label, icon), 500) }
}
function flush() {
  if (pending) commit(pending.label, pending.icon)
}

const canUndo = computed(() => index.value > 0 || !!pending)
const canRedo = computed(() => index.value < history.value.length - 1)

function undo() {
  flush()
  if (index.value <= 0) return
  index.value--
  restore(history.value[index.value]!.state)
}
function redo() {
  if (!canRedo.value) return
  index.value++
  restore(history.value[index.value]!.state)
}
function jumpTo(i: number) {
  flush()
  if (i < 0 || i >= history.value.length) return
  index.value = i
  restore(history.value[i]!.state)
}

// ─── Opening ────────────────────────────────────────────────────────────────

function openCanvas(c: HTMLCanvasElement, name: string) {
  cancelCrop()
  tool.value = 'move'
  doc.value = blankDoc(c, name)
  selectedId.value = null
  history.value = [{ label: 'Open', icon: 'image', state: snapshot(doc.value) }]
  index.value = 0
  pixelTick.value++
  fitSoon()
}

function openSample(id: string) {
  const s = samples.find((x) => x.id === id) ?? samples[0]!
  openCanvas(sampleCanvas(s.id), s.name)
}

async function openFile(file: File) {
  try {
    const bmp = await createImageBitmap(file)
    const k = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height))
    const c = makeCanvas(bmp.width * k, bmp.height * k)
    const ctx = ctx2d(c)
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(bmp, 0, 0, c.width, c.height)
    openCanvas(c, file.name.replace(/\.[^.]+$/, ''))
    toast.success(k < 1 ? `Opened, scaled to ${c.width} × ${c.height}` : 'Photo opened', { icon: 'image' })
  } catch {
    toast.error("That file couldn't be opened as an image")
  }
}

// ─── Looks ──────────────────────────────────────────────────────────────────

const toast = useToast()

function setAdjust(key: AdjustKey, value: number, label: string) {
  doc.value.look.adjust[key] = value
  commitSoon(label, 'tune')
}
function resetAdjustments() {
  doc.value.look = { adjust: neutral(), preset: 'none', intensity: 100 }
  doc.value.angle = 0
  commit('Reset adjustments', 'restart_alt')
}
function setPreset(id: string) {
  if (doc.value.look.preset === id) return
  doc.value.look.preset = id
  doc.value.look.intensity = 100
  commit(`Filter: ${presetById(id).name}`, 'filter_vintage')
}
function autoEnhance() {
  const small = renderPhoto(doc.value.source, 0, null, 400 / Math.max(doc.value.source.width, doc.value.source.height))
  Object.assign(doc.value.look.adjust, neutral(), autoAdjust(small) as Partial<Adjustments>)
  commit('Auto enhance', 'auto_fix_high')
  toast.success('Auto enhanced', { icon: 'auto_fix_high', action: { label: 'Undo', onClick: undo } })
}
function revert() {
  doc.value = blankDoc(doc.value.source, doc.value.name)
  selectedId.value = null
  commit('Revert to original', 'history')
}

// ─── Geometry: rotate and flip the whole document ──────────────────────────

function transformCanvas(src: HTMLCanvasElement, op: 'cw' | 'ccw' | 'h' | 'v') {
  const turn = op === 'cw' || op === 'ccw'
  const c = makeCanvas(turn ? src.height : src.width, turn ? src.width : src.height)
  const ctx = ctx2d(c)
  if (op === 'cw') { ctx.translate(c.width, 0); ctx.rotate(Math.PI / 2) }
  if (op === 'ccw') { ctx.translate(0, c.height); ctx.rotate(-Math.PI / 2) }
  if (op === 'h') { ctx.translate(c.width, 0); ctx.scale(-1, 1) }
  if (op === 'v') { ctx.translate(0, c.height); ctx.scale(1, -1) }
  ctx.drawImage(src, 0, 0)
  return markRaw(c)
}
function transformPoint(x: number, y: number, W: number, H: number, op: 'cw' | 'ccw' | 'h' | 'v') {
  if (op === 'cw') return { x: H - y, y: x }
  if (op === 'ccw') return { x: y, y: W - x }
  if (op === 'h') return { x: W - x, y }
  return { x, y: H - y }
}
function transformRect(r: Rect, W: number, H: number, op: 'cw' | 'ccw' | 'h' | 'v'): Rect {
  const a = transformPoint(r.x, r.y, W, H, op)
  const b = transformPoint(r.x + r.w, r.y + r.h, W, H, op)
  return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) }
}

const opLabels = { cw: ['Rotate right', 'rotate_right'], ccw: ['Rotate left', 'rotate_left'], h: ['Flip horizontal', 'flip'], v: ['Flip vertical', 'flip'] } as const

function transformDoc(op: 'cw' | 'ccw' | 'h' | 'v') {
  const d = doc.value
  const W = d.source.width, H = d.source.height
  d.source = transformCanvas(d.source, op)
  if (op === 'h' || op === 'v') d.angle = -d.angle
  if (d.crop) d.crop = transformRect(d.crop, W, H, op)
  if (cropDraft.value) cropDraft.value = transformRect(cropDraft.value, W, H, op)
  for (const l of d.layers) {
    if (l.kind === 'paint') l.canvas = transformCanvas(l.canvas, op)
    else Object.assign(l, transformPoint(l.x, l.y, W, H, op))
  }
  commit(...opLabels[op])
  fitSoon()
}

// ─── Crop ───────────────────────────────────────────────────────────────────

const docSize = computed(() => ({ w: doc.value.source.width, h: doc.value.source.height }))

export const ratios = [
  { value: 'free', label: 'Free' },
  { value: 'original', label: 'Original' },
  { value: '1:1', label: 'Square' },
  { value: '4:5', label: '4:5' },
  { value: '3:2', label: '3:2' },
  { value: '16:9', label: '16:9' },
]
function ratioValue(r = cropRatio.value): number | null {
  if (r === 'free') return null
  if (r === 'original') return docSize.value.w / docSize.value.h
  const [a, b] = r.split(':').map(Number)
  return a! / b!
}
/** The largest rect of the current ratio centered on the draft. */
function setRatio(r: string) {
  cropRatio.value = r
  const k = ratioValue(r)
  if (!k || !cropDraft.value) return
  const { w: W, h: H } = docSize.value
  const c = cropDraft.value
  const cx = c.x + c.w / 2, cy = c.y + c.h / 2
  let w = Math.min(W, H * k), h = w / k
  if (h > H) { h = H; w = h * k }
  cropDraft.value = {
    x: Math.min(Math.max(0, cx - w / 2), W - w),
    y: Math.min(Math.max(0, cy - h / 2), H - h),
    w, h,
  }
}
function startCrop() {
  flush()
  cropDraft.value = doc.value.crop ? { ...doc.value.crop } : { x: 0, y: 0, ...docSize.value }
  tool.value = 'crop'
  fitSoon()
}
function applyCrop() {
  const c = cropDraft.value
  if (!c) return
  const { w: W, h: H } = docSize.value
  const r = { x: Math.round(c.x), y: Math.round(c.y), w: Math.round(c.w), h: Math.round(c.h) }
  const full = r.x <= 0 && r.y <= 0 && r.w >= W && r.h >= H
  const before = JSON.stringify(doc.value.crop)
  doc.value.crop = full ? null : r
  cropDraft.value = null
  tool.value = 'move'
  if (JSON.stringify(doc.value.crop) !== before) commit('Crop', 'crop')
  fitSoon()
}
function cancelCrop() {
  if (!cropDraft.value) return
  cropDraft.value = null
  if (tool.value === 'crop') tool.value = 'move'
  fitSoon()
}
function setTool(t: Tool) {
  if (t === tool.value) return
  if (tool.value === 'crop') applyCrop()
  if (t === 'crop') return startCrop()
  tool.value = t
}

// ─── Layers ─────────────────────────────────────────────────────────────────

const selected = computed(() => doc.value.layers.find((l) => l.id === selectedId.value) ?? null)
const selectedText = computed(() => (selected.value?.kind === 'text' ? selected.value : null))

function countOf(kind: Layer['kind'], sticker = false) {
  return doc.value.layers.filter((l) => l.kind === kind && (l.kind !== 'text' || l.sticker === sticker)).length + 1
}

function addPaintLayer(silent = false) {
  const { w, h } = docSize.value
  const l: PaintLayer = { id: newId(), kind: 'paint', name: `Paint ${countOf('paint')}`, visible: true, opacity: 100, blend: 'source-over', canvas: markRaw(makeCanvas(w, h)) }
  insertAboveSelected(l)
  if (!silent) commit('New paint layer', 'brush')
  return l
}

/** The view's center, in document pixels: where new text and stickers go. */
function viewCenter() {
  const o = viewOrigin.value
  return {
    x: Math.round((view.stageW / 2 - view.panX) / view.zoom + o.x),
    y: Math.round((view.stageH / 2 - view.panY) / view.zoom + o.y),
  }
}

function addText(at?: { x: number; y: number }, text = 'Your text') {
  const p = at ?? viewCenter()
  const l: TextLayer = {
    id: newId(), kind: 'text', name: text, visible: true, opacity: 100, blend: 'source-over',
    text, x: p.x, y: p.y, size: Math.round(Math.max(docSize.value.w, docSize.value.h) / 14),
    color: '#ffffff', font: 'sans', bold: true, shadow: true, sticker: false,
  }
  insertAboveSelected(l)
  commit('Add text', 'title')
  return l
}
function addSticker(emoji: string) {
  const p = viewCenter()
  const l: TextLayer = {
    id: newId(), kind: 'text', name: `Sticker ${countOf('text', true)}`, visible: true, opacity: 100, blend: 'source-over',
    text: emoji, x: p.x, y: p.y, size: Math.round(Math.max(docSize.value.w, docSize.value.h) / 7),
    color: '#ffffff', font: 'sans', bold: false, shadow: true, sticker: true,
  }
  insertAboveSelected(l)
  if (tool.value !== 'move' && tool.value !== 'text') tool.value = 'move'
  commit('Add sticker', 'add_reaction')
}

function insertAboveSelected(l: Layer) {
  const layers = doc.value.layers
  const i = layers.findIndex((x) => x.id === selectedId.value)
  layers.splice(i < 0 ? layers.length : i + 1, 0, l)
  selectedId.value = l.id
}

function layerById(id: string) {
  return doc.value.layers.find((l) => l.id === id)
}
function duplicateLayer(id: string) {
  const l = layerById(id)
  if (!l) return
  const copy: Layer = l.kind === 'paint'
    ? { ...l, id: newId(), name: `${l.name} copy`, canvas: markRaw(cloneCanvas(l.canvas)) }
    : { ...l, id: newId(), name: `${l.name} copy`, x: l.x + 30, y: l.y + 30 }
  selectedId.value = id
  insertAboveSelected(copy)
  commit('Duplicate layer', 'content_copy')
}
function deleteLayer(id: string) {
  const layers = doc.value.layers
  const i = layers.findIndex((l) => l.id === id)
  if (i < 0) return
  const [l] = layers.splice(i, 1)
  if (selectedId.value === id) selectedId.value = layers[Math.min(i, layers.length - 1)]?.id ?? null
  commit('Delete layer', 'delete')
  toast.info(`Deleted “${l!.name}”`, { icon: 'delete', action: { label: 'Undo', onClick: undo } })
}
function toggleVisible(id: string) {
  const l = layerById(id)
  if (!l) return
  l.visible = !l.visible
  commit(l.visible ? 'Show layer' : 'Hide layer', l.visible ? 'visibility' : 'visibility_off')
}
/** Moves a layer up (toward the top) or down the stack. */
function moveLayer(id: string, dir: 1 | -1 | 'top' | 'bottom') {
  const layers = doc.value.layers
  const i = layers.findIndex((l) => l.id === id)
  if (i < 0) return
  const to = dir === 'top' ? layers.length - 1 : dir === 'bottom' ? 0 : i + dir
  if (to < 0 || to >= layers.length || to === i) return
  const [l] = layers.splice(i, 1)
  layers.splice(to, 0, l!)
  commit(to > i ? 'Bring forward' : 'Send backward', to > i ? 'flip_to_front' : 'flip_to_back')
}
/** For the drag-and-drop list, which shows the top layer first. */
function setLayerOrder(topFirst: string[]) {
  const layers = topFirst.map((id) => layerById(id)!).reverse()
  doc.value.layers = layers
  commit('Reorder layers', 'swap_vert')
}
function setBlend(id: string, blend: Blend) {
  const l = layerById(id)
  if (!l || l.blend === blend) return
  l.blend = blend
  commit(`Blend: ${blends.find((b) => b.value === blend)!.label}`, 'layers')
}
function renameLayer(id: string, name: string) {
  const l = layerById(id)
  if (!l || !name.trim() || l.name === name) return
  l.name = name.trim()
  commit('Rename layer', 'edit')
}
function mergeDown(id: string) {
  const layers = doc.value.layers
  const i = layers.findIndex((l) => l.id === id)
  const top = layers[i], below = layers[i - 1]
  if (!top || !below || below.kind !== 'paint') return
  const c = cloneCanvas(below.canvas)
  const ctx = ctx2d(c)
  ctx.globalAlpha = top.opacity / 100
  ctx.globalCompositeOperation = top.blend
  drawLayerContent(ctx, top)
  below.canvas = markRaw(c)
  layers.splice(i, 1)
  selectedId.value = below.id
  commit('Merge down', 'vertical_align_bottom')
}

// ─── Painting ───────────────────────────────────────────────────────────────

/** The stroke in progress, drawn on its own canvas so overlapping segments don't build up opacity. */
const live = shallowRef<{ layerId: string; canvas: HTMLCanvasElement; erase: boolean; opacity: number; blur: number } | null>(null)
let last: { x: number; y: number } | null = null

function strokeStart(x: number, y: number, erase: boolean) {
  let target = selected.value
  if (!target || target.kind !== 'paint') {
    if (erase) {
      toast.info('Select a paint layer to erase from', { icon: 'ink_eraser' })
      return false
    }
    target = addPaintLayer(true)
  }
  if (!target.visible) target.visible = true
  // Copy-on-write: history snapshots keep the canvas as it was.
  target.canvas = markRaw(cloneCanvas(target.canvas))
  const c = makeCanvas(target.canvas.width, target.canvas.height)
  live.value = { layerId: target.id, canvas: markRaw(c), erase, opacity: erase ? 1 : brush.opacity / 100, blur: (brush.size * (100 - brush.hardness)) / 400 }
  last = { x, y }
  strokeTo(x, y)
  return true
}
function strokeTo(x: number, y: number) {
  if (!live.value || !last) return
  const ctx = ctx2d(live.value.canvas)
  ctx.strokeStyle = live.value.erase ? '#000' : brush.color
  ctx.lineWidth = brush.size
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(last.x, last.y)
  ctx.lineTo(x + (x === last.x && y === last.y ? 0.01 : 0), y)
  ctx.stroke()
  last = { x, y }
  pixelTick.value++
}
function strokeEnd() {
  const s = live.value
  if (!s) return
  const l = layerById(s.layerId)
  if (l?.kind === 'paint') {
    const ctx = ctx2d(l.canvas)
    applyStroke(ctx, s, l.canvas.width, l.canvas.height)
  }
  live.value = null
  last = null
  pixelTick.value++
  commit(s.erase ? 'Eraser' : 'Brush', s.erase ? 'ink_eraser' : 'brush')
}
function applyStroke(ctx: CanvasRenderingContext2D, s: NonNullable<typeof live.value>, w: number, h: number) {
  ctx.save()
  ctx.globalAlpha = s.opacity
  ctx.globalCompositeOperation = s.erase ? 'destination-out' : 'source-over'
  if (s.blur > 0.5) ctx.filter = `blur(${s.blur * (w / s.canvas.width)}px)`
  ctx.drawImage(s.canvas, 0, 0, w, h)
  ctx.restore()
}

// ─── Rendering ──────────────────────────────────────────────────────────────

const measureCtx = ctx2d(makeCanvas(1, 1))
const fontCss = (l: TextLayer) => `${l.bold ? 700 : 400} ${l.size}px ${fonts.find((f) => f.id === l.font)!.css}`

/** The text block's box in document pixels. */
function textBounds(l: TextLayer): Rect {
  measureCtx.font = fontCss(l)
  const lines = l.text.split('\n')
  const w = Math.max(...lines.map((s) => measureCtx.measureText(s).width), l.size * 0.5)
  const h = lines.length * l.size * 1.2
  return { x: l.x - w / 2, y: l.y - h / 2, w, h }
}

function drawLayerContent(ctx: CanvasRenderingContext2D, l: Layer) {
  if (l.kind === 'paint') {
    ctx.drawImage(l.canvas, 0, 0)
    return
  }
  ctx.save()
  ctx.font = fontCss(l)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = l.color
  if (l.shadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.45)'
    ctx.shadowBlur = l.size * 0.12
    ctx.shadowOffsetY = l.size * 0.04
  }
  const lines = l.text.split('\n')
  const lh = l.size * 1.2
  lines.forEach((s, i) => ctx.fillText(s, l.x, l.y + (i - (lines.length - 1) / 2) * lh))
  ctx.restore()
}

const photoCache = new WeakMap<HTMLCanvasElement, { key: string; canvas: HTMLCanvasElement }>()
let scratch: HTMLCanvasElement | null = null

/**
 * Draws the document into a new canvas at `scale` (1 = full size). `region` is the part of the
 * document to draw (the crop, or everything while cropping). The processed photo is cached per
 * look, so painting and moving text only recomposite.
 */
function renderDoc(scale: number, region: Rect, opts: { original?: boolean; layers?: boolean } = {}, target?: HTMLCanvasElement) {
  const d = doc.value
  const look = opts.original ? null : d.look
  const key = JSON.stringify([look, d.angle, scale])
  let cached = photoCache.get(d.source)
  if (!cached || cached.key !== key) {
    cached = { key, canvas: renderPhoto(d.source, d.angle, look, scale) }
    photoCache.set(d.source, cached)
  }
  // Drawing into the screen canvas directly: allocating a new one per frame was most of a brush frame.
  const w = Math.max(1, Math.round(region.w * scale)), h = Math.max(1, Math.round(region.h * scale))
  const out = target ?? makeCanvas(w, h)
  if (out.width !== w || out.height !== h) {
    out.width = w
    out.height = h
  }
  const ctx = ctx2d(out)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'
  ctx.clearRect(0, 0, w, h)
  ctx.setTransform(scale, 0, 0, scale, -region.x * scale, -region.y * scale)
  ctx.drawImage(cached.canvas, 0, 0, d.source.width, d.source.height)
  if (opts.layers === false) return out
  for (const l of d.layers) {
    if (!l.visible) continue
    ctx.save()
    ctx.globalAlpha = l.opacity / 100
    ctx.globalCompositeOperation = l.blend
    if (live.value && live.value.layerId === l.id && l.kind === 'paint') {
      // The layer with the stroke in progress, put together at screen size first.
      const w = Math.ceil(d.source.width * scale), h = Math.ceil(d.source.height * scale)
      if (!scratch || scratch.width !== w || scratch.height !== h) scratch = makeCanvas(w, h)
      const s = ctx2d(scratch)
      s.clearRect(0, 0, w, h)
      s.drawImage(l.canvas, 0, 0, w, h)
      applyStroke(s, live.value, w, h)
      ctx.drawImage(scratch, 0, 0, d.source.width, d.source.height)
    } else {
      drawLayerContent(ctx, l)
    }
    ctx.restore()
  }
  return out
}

/** Exports at full size (or scaled), cropped, as a Blob. */
function exportBlob(type: string, quality: number, scale: number): Promise<Blob | null> {
  flush()
  const c = renderDoc(1, viewRect(false))
  let out = c
  if (scale !== 1) {
    out = makeCanvas(c.width * scale, c.height * scale)
    const ctx = ctx2d(out)
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(c, 0, 0, out.width, out.height)
  }
  if (type === 'image/jpeg') {
    // JPEG has no transparency: put it on white.
    const flat = makeCanvas(out.width, out.height)
    const ctx = ctx2d(flat)
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, flat.width, flat.height)
    ctx.drawImage(out, 0, 0)
    out = flat
  }
  return new Promise((resolve) => out.toBlob(resolve, type, quality))
}

async function copyToClipboard() {
  try {
    const blob = await exportBlob('image/png', 1, 1)
    if (!blob) throw new Error()
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    toast.success('Copied to the clipboard', { icon: 'content_copy' })
  } catch {
    toast.error("Your browser didn't allow copying images")
  }
}

// ─── View ───────────────────────────────────────────────────────────────────

/** The part of the document on screen: everything while cropping, the crop otherwise. */
function viewRect(cropping = !!cropDraft.value): Rect {
  const { w, h } = docSize.value
  return !cropping && doc.value.crop ? doc.value.crop : { x: 0, y: 0, w, h }
}
const viewOrigin = computed(() => viewRect())
const zoomPct = computed(() => Math.round(view.zoom * 100))

function fit() {
  const r = viewRect()
  if (!view.stageW || !view.stageH) return
  const pad = cropDraft.value ? 56 : 32
  view.zoom = Math.min((view.stageW - pad * 2) / r.w, (view.stageH - pad * 2) / r.h)
  view.panX = (view.stageW - r.w * view.zoom) / 2
  view.panY = (view.stageH - r.h * view.zoom) / 2
}
let fitQueued = false
function fitSoon() {
  if (fitQueued) return
  fitQueued = true
  requestAnimationFrame(() => { fitQueued = false; fit() })
}
function zoomAt(factor: number, sx = view.stageW / 2, sy = view.stageH / 2) {
  const z = Math.min(16, Math.max(0.05, view.zoom * factor))
  view.panX = sx - ((sx - view.panX) * z) / view.zoom
  view.panY = sy - ((sy - view.panY) * z) / view.zoom
  view.zoom = z
}
const zoomTo = (z: number) => zoomAt(z / view.zoom)

const hasEdits = computed(() => index.value > 0)

// Start with the first sample.
history.value = [{ label: 'Open', icon: 'image', state: snapshot(doc.value) }]
index.value = 0

export function usePhoto() {
  return {
    doc, histo, selectedId, selected, selectedText, tool, brush, showOriginal, cropDraft, cropRatio, pixelTick, view, pointer,
    dialogs, panelTab, renameId, history, index, canUndo, canRedo, hasEdits, docSize, viewOrigin, zoomPct, live,
    commit, commitSoon, flush, undo, redo, jumpTo,
    openSample, openFile, setAdjust, resetAdjustments, setPreset, autoEnhance, revert,
    transformDoc, setRatio, ratioValue, startCrop, applyCrop, cancelCrop, setTool,
    addPaintLayer, addText, addSticker, duplicateLayer, deleteLayer, toggleVisible, moveLayer, setLayerOrder,
    setBlend, renameLayer, mergeDown, layerById, textBounds,
    strokeStart, strokeTo, strokeEnd,
    renderDoc, viewRect, exportBlob, copyToClipboard,
    fit, fitSoon, zoomAt, zoomTo,
  }
}
