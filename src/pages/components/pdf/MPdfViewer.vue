<script setup lang="ts">
import { computed, ref } from 'vue'
import { MButton } from '@m3ui-vue/m3ui-vue'
import { MPdfViewer, type PdfAnnotation } from '@m3ui-vue/m3ui-vue/pdf'
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

const guide = '/pdf/pocket-gardens.pdf'

// Annotations, kept as JSON (here, also shown as a save log)
const annotations = ref<PdfAnnotation[]>([
  {
    id: 'welcome',
    type: 'note',
    page: 3,
    color: '#FFE14D',
    at: [470, 760],
    text: 'Start here: three pots teach more than twelve.',
    createdAt: '2026-10-30T12:00:00.000Z',
  },
])
const log = ref<string[]>([])
function onAnnotations(next: PdfAnnotation[]) {
  const before = annotations.value.length
  annotations.value = next
  const verb = next.length > before ? 'POST' : next.length < before ? 'DELETE' : 'PATCH'
  log.value = [`${verb} /api/files/pocket-gardens/annotations (${next.length})`, ...log.value].slice(0, 4)
}

// Your own file
const file = ref<File | null>(null)
const input = ref<HTMLInputElement>()
function pick(e: Event) {
  file.value = (e.target as HTMLInputElement).files?.[0] ?? null
}

const page = ref(1)
const zoomLabel = computed(() => page.value)

const viewerProps: PropDef[] = [
  { name: 'src', type: 'string | URL | Uint8Array | ArrayBuffer | Blob', description: 'The PDF: a URL (CORS applies), its bytes, or a File from an input' },
  { name: 'title', type: 'string', description: "Shown in the top bar; default the document's own title" },
  { name: 'page', type: 'number', description: 'Current page, 1-based (v-model:page)' },
  { name: 'zoom', type: "number | 'fit-width' | 'fit-page'", default: "'fit-width'", description: 'Zoom, 1 being 100% (v-model:zoom)' },
  { name: 'rotation', type: 'number', default: '0', description: 'Extra rotation in degrees, a multiple of 90 (v-model:rotation)' },
  { name: 'annotations', type: 'PdfAnnotation[]', default: '[]', description: 'Annotations to draw (v-model:annotations)' },
  { name: 'annotate', type: 'boolean', default: 'false', description: 'Shows the edit button and the annotation toolbar' },
  { name: 'tool', type: "'select' | 'highlight' | 'note' | 'ink' | 'eraser'", default: "'select'", description: 'The active tool (v-model:tool)' },
  { name: 'colors', type: 'string[]', description: 'Colors offered for annotations' },
  { name: 'inkWidths', type: 'number[]', default: '[1, 2, 4, 8]', description: "The pen's widths in PDF points, offered in the toolbar while drawing (the second is the default)" },
  { name: 'author', type: 'string', description: "Written into new annotations' author" },
  { name: 'sidebar', type: "'thumbnails' | 'outline' | null", default: 'null', description: 'The side panel (v-model:sidebar)' },
  { name: 'toolbar', type: 'boolean', default: 'true', description: 'Shows the top bar' },
  { name: 'downloadable', type: 'boolean', default: 'true', description: 'Shows download and print' },
  { name: 'fileName', type: 'string', description: "File name for downloads; default the URL's, or the document's title" },
  { name: 'password', type: 'string', description: 'A password to try first; otherwise the viewer asks for it' },
  { name: 'workerSrc', type: 'string', description: "The pdf.js worker's URL (or setPdfWorker() once for the app)" },
  { name: 'minZoom / maxZoom', type: 'number', default: '0.25 / 8', description: 'Zoom limits' },
]

const viewerEvents: EventDef[] = [
  { name: 'update:page / zoom / rotation / annotations / tool / sidebar', payload: '…', description: 'The v-models' },
  { name: 'loaded', payload: 'PDFDocumentProxy', description: 'The document loaded' },
  { name: 'error', payload: 'Error', description: 'The document failed to load' },
  { name: 'link', payload: '{ url?, page? }', description: 'A link was followed: external (opens in a new tab) or inside the document' },
  { name: 'annotation-click', payload: 'PdfAnnotation', description: 'An annotation was clicked with the select tool' },
]

const viewerSlots: SlotDef[] = [
  { name: 'actions', description: 'Extra buttons at the end of the top bar. Props: { pdf } (usePdf\'s state)' },
  { name: 'empty', description: 'Shown without a src' },
]

const types: TypeDef[] = [
  {
    name: 'PdfAnnotation',
    description: 'Positions are in PDF points from the page\'s bottom left, so they survive zoom and rotation',
    fields: [
      { name: 'id', type: 'string', description: 'Unique id' },
      { name: 'type', type: "'highlight' | 'note' | 'ink'", description: 'What it is' },
      { name: 'page', type: 'number', description: '1-based page' },
      { name: 'color', type: 'string', description: 'Any CSS color' },
      { name: 'rects / quote', type: '[x1, y1, x2, y2][] / string', description: 'highlight: the lines it covers, and their text' },
      { name: 'at', type: '[x, y]', description: 'note: where its icon sits' },
      { name: 'paths / width', type: '[x, y][][] / number', description: 'ink: the strokes and their width in points' },
      { name: 'text', type: 'string', description: "A note's text, or a comment on a highlight or drawing" },
      { name: 'author / createdAt', type: 'string', description: 'Who and when (ISO date)' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MPdfViewer</h1>
    <p class="mb-4 text-body-large text-on-surface-variant">
      A PDF viewer on pdf.js, after Android's PdfViewer and Google Drive's: pages that scroll continuously, rendered
      only near the view, with selectable text and working links. Zoom to the width, the page or a percentage, with
      Ctrl + wheel, a trackpad or touch pinch, or a double click. Search marks every match in the text; a side panel
      shows thumbnails and the outline; a page indicator follows the scroll. With <code>annotate</code>, highlight
      text, add notes and draw, kept as JSON in <code>v-model:annotations</code>. Available from the
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">/pdf</code> entry point, with
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">pdfjs-dist</code> installed.
    </p>
    <p class="mb-8 text-body-medium text-on-surface-variant">
      Set pdf.js's worker once, so documents parse off the main thread:
      <code class="rounded bg-surface-container-high px-1.5 py-0.5">import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'</code>
      then <code class="rounded bg-surface-container-high px-1.5 py-0.5">setPdfWorker(workerSrc)</code> (Vite; other bundlers have their own
      asset URL import). Without it, pdf.js still works, on the main thread.
    </p>

    <ComponentDemo
      title="Basic"
      description="A ten-page guide with an outline and links: try the table of contents, the search (Ctrl+F), the thumbnails and the zoom."
      flush
      :code="`<MPdfViewer v-model:page=&quot;page&quot; src=&quot;/pdf/pocket-gardens.pdf&quot; class=&quot;h-[640px] rounded-xl&quot; />`"
      :script="`import { MPdfViewer, setPdfWorker } from '@m3ui-vue/m3ui-vue/pdf'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

setPdfWorker(workerSrc) // once, e.g. in main.ts
const page = ref(1)`"
    >
      <div class="flex flex-col gap-2 p-4 sm:p-6">
        <MPdfViewer v-model:page="page" :src="guide" class="h-[640px] rounded-xl" />
        <p class="text-center text-body-small text-on-surface-variant">Page {{ zoomLabel }}</p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Annotations"
      description="The edit button opens the toolbar: highlight text, place notes, draw in four widths, erase, undo. Selecting text with the select tool offers Copy and Highlight; a click or a tap on an annotation (a highlight too) opens it for a comment, another color or deleting it."
      flush
      :code="`<MPdfViewer
  :src=&quot;file.url&quot;
  v-model:annotations=&quot;annotations&quot;
  annotate
  author=&quot;Mara&quot;
/>`"
      :script="`const annotations = ref<PdfAnnotation[]>(await api.get('/files/pocket-gardens/annotations'))
watch(annotations, (list) => api.put('/files/pocket-gardens/annotations', list))`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <MPdfViewer :src="guide" :annotations="annotations" annotate author="Mara" :page="3" class="h-[640px] rounded-xl" @update:annotations="onAnnotations" />
        <div class="rounded-lg bg-surface-container p-3 font-mono text-body-small text-on-surface-variant">
          <p v-if="!log.length">{{ annotations.length }} annotation(s). Changes show here.</p>
          <p v-for="(l, i) in log" :key="i">{{ l }}</p>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Password Protected"
      description="An encrypted file asks for its password (it's m3ui). Pass password to try one first."
      flush
      :code="`<MPdfViewer src=&quot;/pdf/lease-protected.pdf&quot; />`"
    >
      <div class="p-4 sm:p-6">
        <MPdfViewer src="/pdf/lease-protected.pdf" class="h-[520px] rounded-xl" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Your Own File"
      description="src takes a File straight from an input (or bytes, or a Blob): nothing is uploaded."
      flush
      :code="`<input type=&quot;file&quot; accept=&quot;application/pdf&quot; @change=&quot;file = $event.target.files[0]&quot; />
<MPdfViewer :src=&quot;file&quot;>
  <template #empty>Pick a PDF to read it here</template>
</MPdfViewer>`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <input ref="input" type="file" accept="application/pdf" class="hidden" @change="pick" />
        <MButton icon="upload_file" variant="tonal" class="self-start" @click="input?.click()">Open a PDF</MButton>
        <MPdfViewer :src="file" :title="file?.name" class="h-[520px] rounded-xl">
          <template #empty>
            <p class="text-body-large text-on-surface-variant">Pick a PDF to read it here</p>
          </template>
        </MPdfViewer>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="viewerProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="viewerEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="viewerSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="types" />

    <ComponentPager current="MPdfViewer" />
  </div>
</template>
