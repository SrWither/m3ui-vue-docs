<script setup lang="ts">
/*
 * Sketchbook example (Quill): boards and notebooks to draw and write in, built only with m3ui-vue on MDrawCanvas
 * from the library's /draw entry point. A stylus draws with its pressure and erases with its eraser end; fingers pan
 * and pinch once a stylus has been used. Layers, a photo to trace, PNG / SVG / JSON export; kept in this browser.
 * - components/TopBar.vue   logo, the title, paper, export, theme, docs and source
 * - components/DocList.vue  the documents with their thumbnails (toDrawSvg), new board or notebook
 * - useNotebooks.ts         the documents, three samples, saved in localStorage
 */
import { computed, ref, watch } from 'vue'
import { MSideSheet, MIconButton, MTooltip, useToast, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import { MDrawCanvas, MDrawLayers, MDrawToolbar, type DrawItem, type DrawLayer, type DrawTool } from '@m3ui-vue/m3ui-vue/draw'
import TopBar from './components/TopBar.vue'
import DocList from './components/DocList.vue'
import { PAGE, PAPER, useNotebooks } from './useNotebooks'

const n = useNotebooks()
const toast = useToast()
const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')
const docsOpen = ref(false)
const showLayers = ref(false)

// The pen stays the same from one document to the next
const tool = ref<DrawTool>('pen')
const color = ref('#1d1b20')
const size = ref(3)
const canvas = ref<InstanceType<typeof MDrawCanvas>>()
const viewport = ref({ x: 0, y: 0, zoom: 1 })
const doc = computed(() => n.current.value)
// Each document opens fitted (the canvas fits itself when the viewport is the default)
watch(() => doc.value.id, () => (viewport.value = { x: 0, y: 0, zoom: 1 }))
const items = computed({ get: () => doc.value.items, set: (v: DrawItem[]) => n.update({ items: v }) })
const layers = computed({ get: () => doc.value.layers, set: (v: DrawLayer[]) => n.update({ layers: v }) })
const pages = computed({ get: () => doc.value.pages, set: (v: number) => n.update({ pages: v }) })

// The page in the middle of the view (export and the page counter use it)
const canvasHeight = ref(600)
const page = computed(() => {
  if (doc.value.mode !== 'pages') return 0
  const mid = (canvasHeight.value / 2 - viewport.value.y) / viewport.value.zoom
  return Math.max(0, Math.min(doc.value.pages - 1, Math.floor(mid / (PAGE.height + 24))))
})
function measure(el: Element | null) {
  if (el) canvasHeight.value = (el as HTMLElement).clientHeight
}
function addPage() {
  pages.value = pages.value + 1
  toast.info(`Page ${pages.value} added`)
}

// ── Export ──────────────────────────────────────────────────────────────────────────────────────────────
function download(blob: Blob, name: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}
async function exportAs(kind: 'png' | 'svg' | 'json') {
  const base = doc.value.title.replace(/[^\w-]+/g, '-').toLowerCase() || 'drawing'
  const suffix = doc.value.mode === 'pages' ? `-p${page.value + 1}` : ''
  if (kind === 'json') return download(new Blob([JSON.stringify(doc.value, null, 2)], { type: 'application/json' }), `${base}.json`)
  if (kind === 'svg') return download(new Blob([canvas.value!.exportSvg({ page: page.value })], { type: 'image/svg+xml' }), `${base}${suffix}.svg`)
  try {
    download(await canvas.value!.exportPng({ page: page.value, scale: 2 }), `${base}${suffix}.png`)
  } catch {
    toast.error("Couldn't make the PNG")
  }
}
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden text-on-surface" :class="wide ? 'bg-surface-container' : 'bg-surface'">
    <TopBar :wide="wide" @docs="docsOpen = true" @export="exportAs" />
    <div class="flex min-h-0 flex-1">
      <aside v-if="wide" class="mb-2 ml-2 w-72 shrink-0 overflow-y-auto rounded-2xl bg-surface">
        <DocList />
      </aside>
      <main :ref="(el) => measure(el as Element | null)" class="relative min-h-0 min-w-0 flex-1 overflow-hidden" :class="wide && 'mx-2 mb-2 rounded-2xl'">
        <MDrawCanvas
          :key="doc.id"
          ref="canvas"
          v-model="items"
          v-model:layers="layers"
          v-model:pages="pages"
          v-model:tool="tool"
          v-model:color="color"
          v-model:size="size"
          v-model:viewport="viewport"
          :mode="doc.mode"
          :page-size="PAGE"
          :paper="PAPER"
          :background="doc.background"
          :background-image="doc.image"
          :background-image-box="doc.imageBox"
          :label="doc.title"
          class="absolute inset-0"
        >
          <MDrawToolbar :sizes="[2, 3, 6, 12]">
            <template #end>
              <span class="mx-1 h-6 w-px shrink-0 bg-outline-variant" />
              <MTooltip text="Layers" placement="top"><MIconButton icon="layers" label="Layers" :variant="showLayers ? 'tonal' : 'standard'" @click="showLayers = !showLayers" /></MTooltip>
              <MTooltip v-if="doc.mode === 'pages'" text="Add a page" placement="top"><MIconButton icon="note_add" label="Add a page" @click="addPage" /></MTooltip>
              <MTooltip text="Fit to the view" placement="top"><MIconButton icon="fit_screen" label="Fit to the view" @click="canvas?.fitView()" /></MTooltip>
            </template>
          </MDrawToolbar>
          <MDrawLayers v-if="showLayers" />
        </MDrawCanvas>
        <span
          v-if="doc.mode === 'pages'"
          class="pointer-events-none absolute top-3 left-3 rounded-full bg-surface-container-high/90 px-3 py-1 text-label-large text-on-surface-variant backdrop-blur-sm"
        >Page {{ page + 1 }} of {{ doc.pages }}</span>
      </main>
    </div>

    <MSideSheet v-if="!wide" v-model="docsOpen" title="Documents">
      <DocList @picked="docsOpen = false" />
    </MSideSheet>
  </div>
</template>
