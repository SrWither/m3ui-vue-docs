<script setup lang="ts">
/*
 * The canvas area: renders the document, pans and zooms (wheel, Ctrl + wheel, pinch, Space +
 * drag), runs the pointer tools (brush, eraser, text, color picker, moving text), draws the
 * crop frame, takes dropped image files, and has the right-click menu.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MContextMenu, MIcon, MMenuDivider, MMenuItem } from '@m3ui-vue/m3ui-vue'
import { ctx2d, histogram, rgbToHex } from '../imaging'
import { usePhoto, type Rect, type TextLayer } from '../usePhoto'

const p = usePhoto()
const { doc, view, tool, brush, cropDraft, selectedId, selectedText, dialogs } = p

const stageEl = ref<HTMLElement>()
const canvasEl = ref<HTMLCanvasElement>()

// ─── Rendering ──────────────────────────────────────────────────────────────

const region = computed(() => p.viewRect())
const previewScale = computed(() => Math.min(1, 1400 / Math.max(p.docSize.value.w, p.docSize.value.h)))
let queued = false
function schedule() {
  if (queued) return
  queued = true
  requestAnimationFrame(draw)
}
function draw() {
  queued = false
  const c = canvasEl.value
  if (!c) return
  p.renderDoc(previewScale.value, region.value, { original: p.showOriginal.value }, c)
  if (!p.live.value) p.histo.value = histogram(c)
}
watch(doc, schedule, { deep: true })
watch([p.pixelTick, p.showOriginal, () => !!cropDraft.value], schedule)

const canvasStyle = computed(() => ({
  left: `${view.panX}px`,
  top: `${view.panY}px`,
  width: `${region.value.w * view.zoom}px`,
  height: `${region.value.h * view.zoom}px`,
}))

/** Document pixels → stage pixels. */
function toScreen(x: number, y: number) {
  return { x: view.panX + (x - region.value.x) * view.zoom, y: view.panY + (y - region.value.y) * view.zoom }
}
function toDoc(e: { clientX: number; clientY: number }) {
  const r = stageEl.value!.getBoundingClientRect()
  return {
    x: (e.clientX - r.left - view.panX) / view.zoom + region.value.x,
    y: (e.clientY - r.top - view.panY) / view.zoom + region.value.y,
  }
}

function hitText(x: number, y: number): TextLayer | null {
  const layers = doc.value.layers
  for (let i = layers.length - 1; i >= 0; i--) {
    const l = layers[i]!
    if (l.kind !== 'text' || !l.visible) continue
    const b = p.textBounds(l)
    const pad = 12 / view.zoom
    if (x >= b.x - pad && x <= b.x + b.w + pad && y >= b.y - pad && y <= b.y + b.h + pad) return l
  }
  return null
}

const selectionBox = computed(() => {
  const l = selectedText.value
  if (!l || !l.visible || cropDraft.value || (tool.value !== 'move' && tool.value !== 'text')) return null
  const b = p.textBounds(l)
  const a = toScreen(b.x, b.y)
  return { left: `${a.x - 6}px`, top: `${a.y - 6}px`, width: `${b.w * view.zoom + 12}px`, height: `${b.h * view.zoom + 12}px` }
})

// ─── Pointer tools ──────────────────────────────────────────────────────────

const pointers = new Map<number, { x: number; y: number }>()
type Drag =
  | { kind: 'pan'; x: number; y: number; panX: number; panY: number; moved: boolean }
  | { kind: 'paint' }
  | { kind: 'text'; id: string; dx: number; dy: number; moved: boolean }
  | { kind: 'pinch'; dist: number; mx: number; my: number }
  | null
let drag: Drag = null
const spaceDown = ref(false)
const panning = ref(false)
const cursorAt = ref<{ x: number; y: number } | null>(null)

function stagePoint(e: { clientX: number; clientY: number }) {
  const r = stageEl.value!.getBoundingClientRect()
  return { x: e.clientX - r.left, y: e.clientY - r.top }
}

function startPinch() {
  if (drag?.kind === 'paint') p.strokeEnd()
  const [a, b] = [...pointers.values()]
  drag = { kind: 'pinch', dist: Math.hypot(a!.x - b!.x, a!.y - b!.y), mx: (a!.x + b!.x) / 2, my: (a!.y + b!.y) / 2 }
}

function onPointerDown(e: PointerEvent) {
  if (e.button === 2) return
  stageEl.value!.setPointerCapture(e.pointerId)
  pointers.set(e.pointerId, stagePoint(e))
  if (pointers.size === 2) return startPinch()
  if (pointers.size > 2) return

  const pt = toDoc(e)
  const sp = stagePoint(e)
  const pan = () => {
    drag = { kind: 'pan', x: sp.x, y: sp.y, panX: view.panX, panY: view.panY, moved: false }
    panning.value = true
  }
  if (e.button === 1 || spaceDown.value) return pan()

  switch (tool.value) {
    case 'brush':
    case 'eraser':
      if (p.strokeStart(pt.x, pt.y, tool.value === 'eraser')) drag = { kind: 'paint' }
      return
    case 'eyedropper':
      return pickColor(e)
    case 'crop':
      return pan()
    case 'move':
    case 'text': {
      const hit = hitText(pt.x, pt.y)
      if (hit) {
        selectedId.value = hit.id
        drag = { kind: 'text', id: hit.id, dx: pt.x - hit.x, dy: pt.y - hit.y, moved: false }
      } else if (tool.value === 'text') {
        p.addText({ x: Math.round(pt.x), y: Math.round(pt.y) })
        dialogs.editText = true
      } else {
        pan()
      }
    }
  }
}

function onPointerMove(e: PointerEvent) {
  const sp = stagePoint(e)
  cursorAt.value = sp
  const pt = toDoc(e)
  p.pointer.value = { x: Math.round(pt.x), y: Math.round(pt.y) }
  if (!pointers.has(e.pointerId)) return
  pointers.set(e.pointerId, sp)

  if (drag?.kind === 'pinch' && pointers.size === 2) {
    const [a, b] = [...pointers.values()]
    const dist = Math.hypot(a!.x - b!.x, a!.y - b!.y)
    const mx = (a!.x + b!.x) / 2, my = (a!.y + b!.y) / 2
    view.panX += mx - drag.mx
    view.panY += my - drag.my
    p.zoomAt(dist / drag.dist, mx, my)
    Object.assign(drag, { dist, mx, my })
  } else if (drag?.kind === 'pan') {
    view.panX = drag.panX + sp.x - drag.x
    view.panY = drag.panY + sp.y - drag.y
    if (Math.abs(sp.x - drag.x) + Math.abs(sp.y - drag.y) > 3) drag.moved = true
  } else if (drag?.kind === 'paint') {
    // Every sample the browser grouped into this event, so fast strokes stay smooth curves.
    const events = e.getCoalescedEvents?.() ?? []
    for (const ev of events.length ? events : [e]) {
      const q = toDoc(ev)
      p.strokeTo(q.x, q.y)
    }
  } else if (drag?.kind === 'text') {
    const l = p.layerById(drag.id)
    if (l?.kind === 'text') {
      l.x = Math.round(pt.x - drag.dx)
      l.y = Math.round(pt.y - drag.dy)
      drag.moved = true
    }
  }
}

function onPointerUp(e: PointerEvent) {
  pointers.delete(e.pointerId)
  if (drag?.kind === 'pinch') {
    // Lifting one finger of a pinch shouldn't turn into a pan or a stroke.
    if (pointers.size === 0) drag = null
    return
  }
  if (drag?.kind === 'paint') p.strokeEnd()
  if (drag?.kind === 'text' && drag.moved) p.commit('Move text', 'open_with')
  if (drag?.kind === 'pan' && !drag.moved && tool.value === 'move') selectedId.value = null
  drag = null
  panning.value = false
}

function onLeave() {
  cursorAt.value = null
  p.pointer.value = null
}

function onDblClick(e: MouseEvent) {
  const pt = toDoc(e)
  const hit = hitText(pt.x, pt.y)
  if (hit && (tool.value === 'move' || tool.value === 'text')) {
    selectedId.value = hit.id
    dialogs.editText = true
  }
}

function pickColor(e: PointerEvent) {
  const c = canvasEl.value!
  const r = c.getBoundingClientRect()
  const x = Math.floor(((e.clientX - r.left) / r.width) * c.width)
  const y = Math.floor(((e.clientY - r.top) / r.height) * c.height)
  if (x < 0 || y < 0 || x >= c.width || y >= c.height) return
  const [R, G, B] = ctx2d(c).getImageData(x, y, 1, 1).data
  const hex = rgbToHex(R!, G!, B!)
  brush.color = hex
  if (selectedText.value) {
    selectedText.value.color = hex
    p.commit('Text color', 'format_color_text')
  }
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  if (e.ctrlKey || e.metaKey) {
    const sp = stagePoint(e)
    p.zoomAt(Math.exp(-e.deltaY * 0.01), sp.x, sp.y)
  } else {
    view.panX -= e.shiftKey ? e.deltaY : e.deltaX
    view.panY -= e.shiftKey ? 0 : e.deltaY
  }
}

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement
  return t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable
}
function onKeyDown(e: KeyboardEvent) {
  if (e.code === 'Space' && !isTyping(e)) {
    spaceDown.value = true
    if ((e.target as HTMLElement).tagName !== 'BUTTON') e.preventDefault()
  }
}
const onKeyUp = (e: KeyboardEvent) => { if (e.code === 'Space') spaceDown.value = false }

let ro: ResizeObserver | null = null
onMounted(() => {
  const el = stageEl.value!
  el.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  ro = new ResizeObserver(() => {
    const first = !view.stageW
    view.stageW = el.clientWidth
    view.stageH = el.clientHeight
    if (first || !p.hasEdits.value) p.fit()
  })
  ro.observe(el)
  schedule()
})
onBeforeUnmount(() => {
  stageEl.value?.removeEventListener('wheel', onWheel)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  ro?.disconnect()
})

// ─── Crop frame ─────────────────────────────────────────────────────────────

type Handle = 'move' | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
const handles: Handle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
const handleCursor: Record<Handle, string> = {
  move: 'move', n: 'ns-resize', s: 'ns-resize', e: 'ew-resize', w: 'ew-resize',
  ne: 'nesw-resize', sw: 'nesw-resize', nw: 'nwse-resize', se: 'nwse-resize',
}
const cropBox = computed(() => {
  const c = cropDraft.value
  if (!c) return null
  const a = toScreen(c.x, c.y)
  return { left: `${a.x}px`, top: `${a.y}px`, width: `${c.w * view.zoom}px`, height: `${c.h * view.zoom}px` }
})
function handleStyle(h: Handle) {
  const x = h.includes('w') ? '0%' : h.includes('e') ? '100%' : '50%'
  const y = h.includes('n') ? '0%' : h.includes('s') ? '100%' : '50%'
  return { left: x, top: y, cursor: handleCursor[h] }
}

let cropDrag: { handle: Handle; start: Rect; x: number; y: number } | null = null
function onCropDown(e: PointerEvent, handle: Handle) {
  e.stopPropagation()
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  cropDrag = { handle, start: { ...cropDraft.value! }, ...toDoc(e) }
}
function onCropMove(e: PointerEvent) {
  if (!cropDrag) return
  const pt = toDoc(e)
  cropDraft.value = resizeCrop(cropDrag.start, cropDrag.handle, pt.x - cropDrag.x, pt.y - cropDrag.y)
}
const onCropUp = () => { cropDrag = null }

const MIN = 24
function resizeCrop(s: Rect, h: Handle, dx: number, dy: number): Rect {
  const { w: W, h: H } = p.docSize.value
  if (h === 'move') {
    return { ...s, x: Math.min(Math.max(0, s.x + dx), W - s.w), y: Math.min(Math.max(0, s.y + dy), H - s.h) }
  }
  const ratio = p.ratioValue()
  let x0 = s.x, y0 = s.y, x1 = s.x + s.w, y1 = s.y + s.h
  if (h.includes('w')) x0 = Math.min(Math.max(0, x0 + dx), x1 - MIN)
  if (h.includes('e')) x1 = Math.max(Math.min(W, x1 + dx), x0 + MIN)
  if (h.includes('n')) y0 = Math.min(Math.max(0, y0 + dy), y1 - MIN)
  if (h.includes('s')) y1 = Math.max(Math.min(H, y1 + dy), y0 + MIN)
  if (!ratio) return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }

  // Keep the ratio: anchor the opposite corner (or the opposite edge's center) and fit inside the photo.
  const corner = h.length === 2
  const horizontal = h === 'e' || h === 'w'
  let w = x1 - x0, ht = y1 - y0
  if (corner) {
    if (w / ht > ratio) ht = w / ratio
    else w = ht * ratio
    const ax = h.includes('w') ? s.x + s.w : s.x, ay = h.includes('n') ? s.y + s.h : s.y
    const maxW = h.includes('w') ? ax : W - ax, maxH = h.includes('n') ? ay : H - ay
    w = Math.min(w, maxW, maxH * ratio); ht = w / ratio
    return { x: h.includes('w') ? ax - w : ax, y: h.includes('n') ? ay - ht : ay, w, h: ht }
  }
  if (horizontal) {
    const cy = s.y + s.h / 2, ax = h === 'w' ? s.x + s.w : s.x
    w = Math.min(w, (h === 'w' ? ax : W - ax), 2 * Math.min(cy, H - cy) * ratio); ht = w / ratio
    return { x: h === 'w' ? ax - w : ax, y: cy - ht / 2, w, h: ht }
  }
  const cx = s.x + s.w / 2, ay = h === 'n' ? s.y + s.h : s.y
  ht = Math.min(ht, (h === 'n' ? ay : H - ay), (2 * Math.min(cx, W - cx)) / ratio); w = ht * ratio
  return { x: cx - w / 2, y: h === 'n' ? ay - ht : ay, w, h: ht }
}

// ─── Context menu and dropped files ────────────────────────────────────────

const ctxText = ref<TextLayer | null>(null)
const ctxPoint = ref({ x: 0, y: 0 })
function onContextMenu(e: MouseEvent) {
  const pt = toDoc(e)
  ctxPoint.value = { x: Math.round(pt.x), y: Math.round(pt.y) }
  ctxText.value = cropDraft.value ? null : hitText(pt.x, pt.y)
  if (ctxText.value) selectedId.value = ctxText.value.id
}
function textHere() {
  p.addText(ctxPoint.value)
  dialogs.editText = true
}

const dropping = ref(false)
function onDrop(e: DragEvent) {
  dropping.value = false
  const file = [...(e.dataTransfer?.files ?? [])].find((f) => f.type.startsWith('image/'))
  if (file) p.openFile(file)
}

const cursorClass = computed(() => {
  if (panning.value) return 'cursor-grabbing'
  if (spaceDown.value) return 'cursor-grab'
  return { move: 'cursor-grab', crop: 'cursor-grab', brush: 'cursor-none', eraser: 'cursor-none', text: 'cursor-text', eyedropper: 'cursor-crosshair' }[tool.value]
})
const showBrushCursor = computed(() => cursorAt.value && (tool.value === 'brush' || tool.value === 'eraser') && !spaceDown.value)
</script>

<template>
  <MContextMenu class="relative min-h-0 min-w-0 flex-1">
    <template #trigger>
      <div
        ref="stageEl"
        data-photo-stage
        class="lb-stage absolute inset-0 touch-none overflow-hidden bg-surface-container-highest/60 select-none dark:bg-surface-container-lowest"
        :class="cursorClass"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @pointerleave="onLeave"
        @dblclick="onDblClick"
        @contextmenu="onContextMenu"
        @dragover.prevent="dropping = true"
        @dragleave="dropping = false"
        @drop.prevent="onDrop"
      >
        <canvas ref="canvasEl" class="absolute shadow-elevation-3" :style="canvasStyle" />

        <div v-if="selectionBox" class="pointer-events-none absolute rounded-sm border-2 border-dashed border-primary" :style="selectionBox" />

        <div
          v-if="showBrushCursor"
          class="pointer-events-none absolute rounded-full border border-white shadow-[0_0_0_1px_rgb(0_0_0/0.6)]"
          :style="{
            left: `${cursorAt!.x}px`,
            top: `${cursorAt!.y}px`,
            width: `${Math.max(4, brush.size * view.zoom)}px`,
            height: `${Math.max(4, brush.size * view.zoom)}px`,
            transform: 'translate(-50%, -50%)',
          }"
        />

        <!-- Crop frame: the dark outside is the box's own huge shadow, clipped by the stage. -->
        <div
          v-if="cropBox"
          class="absolute shadow-[0_0_0_9999px_rgb(0_0_0/0.55)] outline-2 outline-white"
          :style="cropBox"
          @pointerdown="onCropDown($event, 'move')"
          @pointermove="onCropMove"
          @pointerup="onCropUp"
          @pointercancel="onCropUp"
        >
          <div class="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
            <span v-for="n in 9" :key="n" class="border-white/40" :class="[n % 3 ? 'border-r' : '', n <= 6 ? 'border-b' : '']" />
          </div>
          <span
            v-for="h in handles"
            :key="h"
            class="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            :style="handleStyle(h)"
            @pointerdown="onCropDown($event, h)"
            @pointermove="onCropMove"
            @pointerup="onCropUp"
            @pointercancel="onCropUp"
          >
            <span class="block rounded-full bg-white shadow-elevation-1" :class="h.length === 2 ? 'h-3.5 w-3.5' : h === 'n' || h === 's' ? 'h-1.5 w-6' : 'h-6 w-1.5'" />
          </span>
          <span class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-inverse-surface px-2 py-0.5 text-label-small text-inverse-on-surface tabular-nums">
            {{ Math.round(cropDraft!.w) }} × {{ Math.round(cropDraft!.h) }}
          </span>
        </div>

        <div v-if="dropping" class="pointer-events-none absolute inset-3 flex items-center justify-center rounded-3xl border-2 border-dashed border-primary bg-primary/10">
          <span class="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-label-large text-on-primary"><MIcon name="upload" :size="20" /> Drop to open</span>
        </div>

        <slot />
      </div>
    </template>

    <template v-if="ctxText">
      <MMenuItem icon="edit" shortcut="Double-click" @click="dialogs.editText = true">Edit text</MMenuItem>
      <MMenuItem icon="flip_to_front" @click="p.moveLayer(ctxText.id, 'top')">Bring to front</MMenuItem>
      <MMenuItem icon="flip_to_back" @click="p.moveLayer(ctxText.id, 'bottom')">Send to back</MMenuItem>
      <MMenuItem icon="content_copy" @click="p.duplicateLayer(ctxText.id)">Duplicate</MMenuItem>
      <MMenuItem icon="delete" danger shortcut="Del" @click="p.deleteLayer(ctxText.id)">Delete</MMenuItem>
      <MMenuDivider />
    </template>
    <MMenuItem icon="undo" shortcut="Ctrl+Z" :disabled="!p.canUndo.value" @click="p.undo">Undo</MMenuItem>
    <MMenuItem icon="redo" shortcut="Ctrl+Shift+Z" :disabled="!p.canRedo.value" @click="p.redo">Redo</MMenuItem>
    <MMenuDivider />
    <MMenuItem icon="add">
      Add
      <template #children>
        <MMenuItem icon="title" @click="textHere">Text here</MMenuItem>
        <MMenuItem icon="add_reaction" @click="dialogs.sticker = true">Sticker…</MMenuItem>
        <MMenuItem icon="brush" @click="p.addPaintLayer()">Paint layer</MMenuItem>
      </template>
    </MMenuItem>
    <MMenuItem icon="rotate_90_degrees_cw">
      Rotate &amp; flip
      <template #children>
        <MMenuItem icon="rotate_left" @click="p.transformDoc('ccw')">Rotate left</MMenuItem>
        <MMenuItem icon="rotate_right" @click="p.transformDoc('cw')">Rotate right</MMenuItem>
        <MMenuItem icon="flip" @click="p.transformDoc('h')">Flip horizontal</MMenuItem>
        <MMenuItem icon="flip" class="[&_.material-symbols-outlined]:rotate-90" @click="p.transformDoc('v')">Flip vertical</MMenuItem>
      </template>
    </MMenuItem>
    <MMenuItem icon="crop" shortcut="C" @click="p.setTool('crop')">Crop…</MMenuItem>
    <MMenuItem icon="zoom_in">
      Zoom
      <template #children>
        <MMenuItem icon="fit_screen" shortcut="Ctrl+0" @click="p.fit">Fit on screen</MMenuItem>
        <MMenuItem icon="1x_mobiledata" shortcut="Ctrl+1" @click="p.zoomTo(1)">Actual size</MMenuItem>
        <MMenuItem icon="zoom_in" @click="p.zoomTo(2)">200%</MMenuItem>
      </template>
    </MMenuItem>
    <MMenuDivider />
    <MMenuItem icon="content_copy" @click="p.copyToClipboard">Copy image</MMenuItem>
    <MMenuItem icon="download" shortcut="Ctrl+E" @click="dialogs.export = true">Export…</MMenuItem>
  </MContextMenu>
</template>

<style scoped>
.lb-stage {
  background-image: radial-gradient(circle, color-mix(in srgb, var(--color-on-surface) 9%, transparent) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
