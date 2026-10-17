<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MCard, MProgressBar, usePageProgress } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const pageProgress = usePageProgress()

const uploading = ref(false)
function fakeUpload() {
  uploading.value = true
  let pct = 0
  const timer = setInterval(() => {
    pct += 10
    pageProgress.set(pct)
    if (pct >= 100) {
      clearInterval(timer)
      pageProgress.done()
      uploading.value = false
    }
  }, 250)
}

function fakeFetch() {
  pageProgress.start()
  setTimeout(() => pageProgress.done(), 1800)
}

const types: TypeDef[] = [
  {
    name: 'usePageProgress()',
    description: 'Returned object — module-level state, so MPageProgress and every call site stay in sync',
    fields: [
      { name: 'progress', type: 'Ref<number>', description: 'Current percentage, 0–100' },
      { name: 'isActive', type: 'Ref<boolean>', description: 'Whether the bar is showing' },
      { name: 'start', type: '() => void', description: 'Shows the bar at 5% and trickles it toward 90% while the work runs' },
      { name: 'set', type: '(pct: number) => void', description: 'Sets a real percentage (clamped to 0–100), for work that reports progress' },
      { name: 'done', type: '() => void', description: 'Fills the bar and hides it 200ms later' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">usePageProgress</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The state behind <RouterLink to="/components/feedback/mpageprogress" class="text-primary underline">MPageProgress</RouterLink>,
      the thin loading bar at the top of the page. MPageProgress follows vue-router navigations by itself; call this
      to show it for anything else: a fetch, a save, an upload.
    </p>

    <ComponentDemo
      title="Around async work"
      description="start() when the work begins and done() when it ends. Watch the top of this page."
      :code="`<MPageProgress />  <!-- once, e.g. in App.vue -->`"
      :script="`import { usePageProgress } from '@m3ui-vue/m3ui-vue'

const progress = usePageProgress()

async function load() {
  progress.start()
  try {
    await fetch('/api/orders')
  } finally {
    progress.done()
  }
}`"
    >
      <MButton icon="refresh" @click="fakeFetch">Load orders</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="Real progress"
      description="When the work reports how far it got, set() the percentage instead of letting it trickle. progress and isActive are refs, so you can show the same value elsewhere."
      :code="`<MProgressBar :value=&quot;progress.progress.value&quot; />`"
      :script="`import { usePageProgress } from '@m3ui-vue/m3ui-vue'

const progress = usePageProgress()

upload.onProgress = (pct) => progress.set(pct)
upload.onDone = () => progress.done()`"
    >
      <MCard variant="outlined" class="flex w-full max-w-md flex-col gap-3 p-4">
        <div class="flex items-center justify-between">
          <span class="text-body-large">report.pdf</span>
          <span class="text-body-medium text-on-surface-variant">{{ Math.round(pageProgress.progress.value) }}%</span>
        </div>
        <MProgressBar :value="pageProgress.progress.value" />
        <MButton variant="tonal" icon="upload" :disabled="uploading" class="self-start" @click="fakeUpload">Upload</MButton>
      </MCard>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>There is one bar for the whole app: overlapping <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">start()</code> calls restart it, and the first <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">done()</code> completes it</li>
        <li>It works without any component mounted, but nothing shows unless an <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">MPageProgress</code> (or your own bar reading <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">progress</code>) is on the page</li>
        <li>To drive MPageProgress only by hand, turn off its router wiring with <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">:auto="false"</code></li>
      </ul>
    </MCard>

    <ComponentPager current="usePageProgress" />
  </div>
</template>
