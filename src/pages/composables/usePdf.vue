<script setup lang="ts">
import { ref, watch } from 'vue'
import { MSearchField } from '@m3ui-vue/m3ui-vue'
import { usePdf, type PdfSearchMatch } from '@m3ui-vue/m3ui-vue/pdf'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const pdf = usePdf('/pdf/pocket-gardens.pdf')

// A thumbnail grid
const thumbs = ref<string[]>([])
watch(pdf.doc, async (d) => {
  if (!d) return
  thumbs.value = await Promise.all(Array.from({ length: d.numPages }, (_, i) => pdf.thumbnail(i + 1, 110)))
}, { immediate: true })

// A search over the whole document
const query = ref('basil')
const results = ref<PdfSearchMatch[]>([])
let ac: AbortController | null = null
watch([query, pdf.doc], async ([q]) => {
  ac?.abort()
  ac = new AbortController()
  const found = await pdf.search(q, { signal: ac.signal })
  if (!ac.signal.aborted) results.value = found
}, { immediate: true })

const types: TypeDef[] = [
  {
    name: 'usePdf(src, options?)',
    fields: [
      { name: 'src', type: 'MaybeRefOrGetter<string | URL | Uint8Array | ArrayBuffer | Blob | null>', description: 'The PDF; a new one replaces the document' },
      { name: 'options.password', type: 'MaybeRefOrGetter<string>', description: 'A password to try first (needsPassword handles the rest)' },
      { name: 'options.withCredentials', type: 'boolean', description: 'Send cookies with a cross-origin URL' },
      { name: 'options.workerSrc', type: 'string', description: "pdf.js's worker URL, or setPdfWorker() once for the app" },
    ],
  },
  {
    name: 'usePdf() returns',
    fields: [
      { name: 'doc / pdfjs', type: 'ShallowRef', description: "pdf.js's document proxy, and the pdfjs-dist module, once loaded" },
      { name: 'loading / progress / error', type: 'Ref', description: 'Loading state, download progress (0 to 1), and the failure' },
      { name: 'needsPassword / wrongPassword / submitPassword(pw)', type: '…', description: 'The password flow of an encrypted file' },
      { name: 'numPages / pageSizes', type: 'Ref', description: "Page count, and each page's size in points (filled in the background)" },
      { name: 'outline / metadata', type: 'Ref', description: 'The bookmarks, resolved to pages; title, author, dates…' },
      { name: 'search(query, { caseSensitive?, signal? })', type: 'Promise<PdfSearchMatch[]>', description: 'Every match in every page, with its context (case and accent insensitive by default)' },
      { name: 'thumbnail(page, width?)', type: 'Promise<string>', description: 'A picture of a page as an object URL, cached' },
      { name: 'pageText(page) / getPage(page)', type: 'Promise', description: "A page's indexed text, or pdf.js's page proxy" },
      { name: 'resolveDest(dest)', type: 'Promise<{ page, top? } | null>', description: 'A link destination to a page' },
      { name: 'getData() / download(name?) / print()', type: 'Promise', description: "The file's bytes; save it; print it" },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">usePdf</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Loads a PDF with pdf.js and exposes what a viewer needs: its pages and their sizes, the outline, metadata, a
      text search over every page, thumbnails, download and print, and the password flow. MPdfViewer is built on
      it; use it for a thumbnail grid, a search, or a viewer of your own. Available from the
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">/pdf</code> entry point, with
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">pdfjs-dist</code> installed.
    </p>

    <ComponentDemo
      title="Thumbnails and Search"
      description="Every page as a picture, and a search through the whole document with each match in context."
      :code="`<img v-for=&quot;(url, i) in thumbs&quot; :key=&quot;i&quot; :src=&quot;url&quot; />
<MSearchField v-model=&quot;query&quot; />
<p v-for=&quot;m in results&quot;>Page {{ m.page }}: {{ m.context }}</p>`"
      :script="`import { usePdf } from '@m3ui-vue/m3ui-vue/pdf'

const pdf = usePdf('/pdf/pocket-gardens.pdf')

const thumbs = ref<string[]>([])
watch(pdf.doc, async (d) => {
  if (d) thumbs.value = await Promise.all(Array.from({ length: d.numPages }, (_, i) => pdf.thumbnail(i + 1, 110)))
})

const query = ref('basil')
const results = ref([])
watch([query, pdf.doc], async ([q]) => (results.value = await pdf.search(q)))`"
    >
      <div class="flex w-full flex-col gap-4">
        <p class="text-title-medium">{{ pdf.metadata.value.title }} · {{ pdf.numPages.value }} pages</p>
        <div class="flex gap-3 overflow-x-auto pb-2">
          <img v-for="(url, i) in thumbs" :key="i" :src="url" :alt="`Page ${i + 1}`" class="w-[110px] shrink-0 rounded-sm bg-white shadow-elevation-1" />
        </div>
        <MSearchField v-model="query" placeholder="Search the guide" class="max-w-sm" />
        <ol class="flex flex-col gap-2">
          <li v-for="m in results.slice(0, 8)" :key="`${m.page}-${m.index}`" class="rounded-lg bg-surface-container px-3 py-2 text-body-medium">
            <span class="mr-2 text-label-large text-primary">Page {{ m.page }}</span>{{ m.context }}
          </li>
          <li v-if="!results.length && query" class="text-body-medium text-on-surface-variant">No matches</li>
        </ol>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <ComponentPager current="usePdf" />
  </div>
</template>
