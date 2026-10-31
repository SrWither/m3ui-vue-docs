<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MSegmentedButton } from '@m3ui-vue/m3ui-vue'
import { MDrawCanvas, MDrawLayers, MDrawToolbar, type DrawItem, type DrawLayer, type DrawTool } from '@m3ui-vue/m3ui-vue/draw'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

// A little drawing to start from: a sun, a hill and a label
const sun: DrawItem = { id: 'sun', type: 'shape', shape: 'ellipse', from: [40, 30], to: [110, 100], color: '#fb8c00', size: 3, fill: '#fdd835' }
const hill: DrawItem = {
  id: 'hill', type: 'stroke', pen: 'brush', color: '#43a047', size: 10,
  points: Array.from({ length: 40 }, (_, i) => [i * 12, 220 - Math.sin((i / 39) * Math.PI) * 80, 0.4 + 0.6 * Math.sin((i / 39) * Math.PI)]),
}
const label: DrawItem = { id: 'label', type: 'text', at: [300, 40], text: 'Draw here!', size: 28, color: '#1e88e5' }
const sketch = ref<DrawItem[]>([sun, hill, label])
const tool = ref<DrawTool>('pen')

// Pages, ruled, with layers
const notes = ref<DrawItem[]>([])
const layers = ref<DrawLayer[]>([{ id: 'paper', name: 'Notes' }, { id: 'ink', name: 'Ink' }])
const ruling = ref<'lines' | 'grid' | 'dots' | 'none'>('lines')

// Export
const canvas = ref<InstanceType<typeof MDrawCanvas>>()
const exported = ref<DrawItem[]>([sun, label])
function download(blob: Blob, name: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}
const saveSvg = () => download(new Blob([canvas.value!.exportSvg()], { type: 'image/svg+xml' }), 'drawing.svg')
const savePng = async () => download(await canvas.value!.exportPng({ scale: 2 }), 'drawing.png')
const saveJson = () => download(new Blob([JSON.stringify(exported.value, null, 2)], { type: 'application/json' }), 'drawing.json')

const props: PropDef[] = [
  { name: 'v-model', type: 'DrawItem[]', default: '[]', description: 'The drawing: strokes, shapes and texts (see the types below)' },
  { name: 'v-model:tool', type: 'DrawTool', default: "'pen'", description: "pen, brush, marker, highlighter, eraser (cuts strokes), stroke-eraser (whole items), line, arrow, rect, ellipse, text, select, pan" },
  { name: 'v-model:color', type: 'string', default: "'#1d1b20'", description: 'Color of new items' },
  { name: 'v-model:size', type: 'number', default: '4', description: "A pen's width at full pressure, a shape's line; text is 4× it" },
  { name: 'v-model:fill', type: 'boolean', default: 'false', description: 'New rectangles and ellipses are filled with the color' },
  { name: 'v-model:layers', type: 'DrawLayer[]', default: '[]', description: 'Layers, bottom first ({ id, name, visible?, locked? }); none means one implicit layer' },
  { name: 'v-model:layer', type: 'string', default: 'the top one', description: 'The layer new items go on' },
  { name: 'v-model:selection', type: 'string[]', default: '[]', description: 'Selected item ids (select tool)' },
  { name: 'v-model:viewport', type: '{ x, y, zoom }', default: 'fitted', description: 'Pan and zoom: screen = drawing × zoom + (x, y)' },
  { name: 'mode', type: "'infinite' | 'pages'", default: "'infinite'", description: 'An endless canvas, or pages stacked one under another (items then have a page and coordinates relative to it)' },
  { name: 'v-model:pages', type: 'number', default: '1', description: 'How many pages' },
  { name: 'pageSize', type: '{ width, height }', default: '794 × 1123 (A4)', description: 'A page in drawing units' },
  { name: 'paper', type: 'string', default: "'#ffffff'", description: 'The paper color (also in dark mode, like a real sheet)' },
  { name: 'background', type: "'none' | 'grid' | 'dots' | 'lines'", default: "'none'", description: 'A ruling on the paper' },
  { name: 'backgroundSize', type: 'number', default: '24', description: "The ruling's spacing" },
  { name: 'backgroundImage', type: 'string', default: '—', description: 'An image under the drawing to trace or annotate: fills each page, or sits at (0, 0)' },
  { name: 'backgroundImageBox', type: '{ x, y, width, height }', default: '—', description: 'Infinite canvas: where the background image sits and its size; fitView takes it in' },
  { name: 'penOnly', type: "boolean | 'auto'", default: "'auto'", description: "Fingers only pan and zoom (palm rejection). 'auto': once a stylus has touched the canvas" },
  { name: 'pressure', type: 'boolean', default: 'true', description: "Follow a stylus' pressure; without one, speed thins the line" },
  { name: 'smoothing', type: 'number', default: '0.5', description: 'How much strokes are smoothed, 0–1' },
  { name: 'eraserSize', type: 'number', default: '12', description: "The eraser's radius, in screen pixels" },
  { name: 'history / historySize', type: 'boolean / number', default: 'true / 100', description: 'Undo and redo' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Pan and zoom only' },
  { name: 'minZoom / maxZoom', type: 'number', default: '0.1 / 8', description: 'Zoom limits' },
  { name: 'label', type: 'string', default: 'locale', description: 'Accessible name' },
]
const events: EventDef[] = [
  { name: 'change', payload: 'DrawItem[]', description: 'After every edit (stroke, erase, move, undo…), with the new items' },
]
const slots: SlotDef[] = [
  { name: 'default', description: 'Overlays: MDrawToolbar, MDrawLayers, or your own built with useDrawing()' },
]
const types: TypeDef[] = [
  { name: 'DrawStroke', description: "type: 'stroke'", fields: [
    { name: 'pen', type: "'pen' | 'brush' | 'marker' | 'highlighter'", required: true, description: 'How pressure thins it and its ends taper; the highlighter is translucent' },
    { name: 'points', type: '[x, y, pressure][]', required: true, description: 'Smoothed points, pressure 0–1' },
    { name: 'size / color', type: 'number / string', required: true, description: 'Width at full pressure, and color' },
  ] },
  { name: 'DrawShape', description: "type: 'shape'", fields: [
    { name: 'shape', type: "'line' | 'arrow' | 'rect' | 'ellipse'", required: true, description: 'Hold Shift while drawing: 45° lines, squares, circles' },
    { name: 'from / to', type: '[x, y]', required: true, description: 'The drag that drew it' },
    { name: 'size / color / fill', type: 'number / string / string | null', description: 'Line width, line color, fill (rect and ellipse)' },
  ] },
  { name: 'DrawText', description: "type: 'text'", fields: [
    { name: 'at / text / size / color', type: '[x, y] / string / number / string', required: true, description: 'Top-left corner, the text (lines split by \\n), font size' },
  ] },
  { name: 'Every item', fields: [
    { name: 'id', type: 'string', required: true, description: 'Unique' },
    { name: 'layer', type: 'string', description: 'Its layer (absent: the first one)' },
    { name: 'page', type: 'number', description: 'Its page in pages mode' },
  ] },
  { name: 'Functions (/draw)', fields: [
    { name: 'toDrawSvg(items, opts)', type: 'string', description: 'A drawing (or one page) as an SVG document, without the canvas' },
    { name: 'svgToPng(svg, scale)', type: 'Promise<Blob>', description: 'An SVG rendered to PNG' },
    { name: 'strokePath / shapePath / itemBox / hitItem / eraseAt / inLasso / transformItem', type: 'function', description: 'The geometry the canvas uses, to render or process drawings yourself' },
  ] },
]
const exposed: PropDef[] = [
  { name: 'undo() / redo() / clear()', type: 'function', description: 'History; clear removes what is on unlocked, visible layers' },
  { name: 'deleteSelection()', type: 'function', description: 'Removes the selected items' },
  { name: 'fitView() / zoomIn() / zoomOut()', type: 'function', description: 'View' },
  { name: 'exportSvg({ page?, background? })', type: 'string', description: 'The drawing or a page as SVG' },
  { name: 'exportPng({ page?, scale?, background? })', type: 'Promise<Blob>', description: 'As PNG' },
  { name: 'toContent({ clientX, clientY })', type: '{ x, y }', description: 'A page point in drawing units' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MDrawCanvas</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A drawing surface. Pens follow a stylus' pressure (with a mouse or a finger, speed thins the line), the eraser
      cuts strokes where it passes and the pen's eraser end erases whatever tool is picked. Shapes, text, a lasso to
      move, scale or delete, layers, undo and redo; two fingers or the wheel pan, pinch or Ctrl + wheel zoom. Once a
      stylus has touched it, fingers only navigate, so a resting palm doesn't draw. From <code>/draw</code>.
    </p>

    <ComponentDemo
      title="Sketch"
      description="An infinite canvas with the toolbar. Hold Shift while drawing a shape to snap it; the select tool's lasso picks items to move, scale (corners) or delete."
      flush
      :code="`<MDrawCanvas v-model=&quot;items&quot; v-model:tool=&quot;tool&quot; background=&quot;dots&quot;>
  <MDrawToolbar />
</MDrawCanvas>`"
    >
      <div class="p-4 sm:p-6">
        <MDrawCanvas v-model="sketch" v-model:tool="tool" background="dots" class="h-[460px] rounded-xl">
          <MDrawToolbar />
        </MDrawCanvas>
        <p class="mt-2 text-body-small text-on-surface-variant">{{ sketch.length }} items · tool: {{ tool }}</p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Pages and Layers"
      description="Ruled A5-sized pages stacked down the canvas, with a layers panel: hide or lock one and the others stay editable. Items keep their page and page coordinates."
      flush
      :code="`<MDrawCanvas
  v-model=&quot;items&quot;
  v-model:layers=&quot;layers&quot;
  v-model:pages=&quot;pages&quot;
  mode=&quot;pages&quot;
  :page-size=&quot;{ width: 560, height: 794 }&quot;
  :background=&quot;ruling&quot;
>
  <MDrawToolbar />
  <MDrawLayers />
</MDrawCanvas>`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <MSegmentedButton v-model="ruling" :options="(['lines', 'grid', 'dots', 'none'] as const).map((v) => ({ value: v, label: v[0]!.toUpperCase() + v.slice(1) }))" density="compact" />
        <MDrawCanvas v-model="notes" v-model:layers="layers" mode="pages" :pages="2" :page-size="{ width: 560, height: 794 }" :background="ruling" class="h-[560px] rounded-xl">
          <MDrawToolbar :tools="['select', 'pen', 'highlighter', 'eraser', 'text']" />
          <MDrawLayers />
        </MDrawCanvas>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Export"
      description="exportSvg() and exportPng() through a template ref; the items themselves are the JSON to save."
      flush
      :code="`<MDrawCanvas ref=&quot;canvas&quot; v-model=&quot;items&quot; />

const svg = canvas.value.exportSvg()
const png = await canvas.value.exportPng({ scale: 2 })
const json = JSON.stringify(items.value)`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <div class="flex flex-wrap gap-2">
          <MButton variant="tonal" icon="download" @click="saveSvg">SVG</MButton>
          <MButton variant="tonal" icon="image" @click="savePng">PNG</MButton>
          <MButton variant="tonal" icon="data_object" @click="saveJson">JSON</MButton>
        </div>
        <MDrawCanvas ref="canvas" v-model="exported" class="h-[320px] rounded-xl">
          <MDrawToolbar :tools="['pen', 'brush', 'eraser', 'rect', 'ellipse']" :history="false" />
        </MDrawCanvas>
      </div>
    </ComponentDemo>

    <h3 class="mt-6 mb-3 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Exposed</h3>
    <PropsTable :props="exposed" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Types and functions</h3>
    <TypesTable :types="types" />

    <ComponentPager current="MDrawCanvas" />
  </div>
</template>
