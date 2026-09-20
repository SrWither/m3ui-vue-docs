<script setup lang="ts">
import { MButton, MSegmentedButton, MSlider, usePageProgress } from '@m3ui-vue/m3ui-vue'
import { pageProgressPosition, pageProgressThickness, pageProgressColor } from '@/composables/usePageProgressDemo'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const pageProgress = usePageProgress()
let pageProgressAutoTimer: ReturnType<typeof setTimeout> | null = null

function demoPageProgressAuto() {
  pageProgress.start()
  if (pageProgressAutoTimer) clearTimeout(pageProgressAutoTimer)
  pageProgressAutoTimer = setTimeout(() => pageProgress.done(), 1500)
}

const pageProgressProps: PropDef[] = [
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error'", default: "'primary'", description: 'Bar color' },
  { name: 'thickness', type: 'number', default: '3', description: 'Bar height in px' },
  { name: 'position', type: "'top' | 'bottom'", default: "'top'", description: 'Which edge of the viewport the bar is pinned to' },
  { name: 'auto', type: 'boolean', default: 'true', description: "Auto-wire to vue-router's beforeEach/afterEach/onError when a router is detected on the app instance. Set to false to drive it entirely through usePageProgress()." },
]

const pageProgressApiTypes: TypeDef[] = [
  {
    name: 'usePageProgress()',
    description: 'Returned object — module-level shared state, so MPageProgress and every call site stay in sync',
    fields: [
      { name: 'progress', type: 'Ref<number>', description: 'Current percentage (0–100), read-only in practice' },
      { name: 'isActive', type: 'Ref<boolean>', description: 'Whether the bar is currently visible/animating' },
      { name: 'start', type: '() => void', description: "Starts (or restarts) the bar at 5% and trickles it toward 90% while real work finishes" },
      { name: 'set', type: '(pct: number) => void', description: 'Sets an explicit percentage, for callers that know real progress (e.g. an upload)' },
      { name: 'done', type: '() => void', description: 'Completes the bar to 100% and fades it out' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MPageProgress</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A thin bar pinned to the top or bottom edge of the viewport, for page/route-level loading state —
      auto-wired to vue-router by default, or driven entirely by hand via usePageProgress().
    </p>

    <ComponentDemo
      title="Auto-wired to this site's router"
      description="Mounted once in App.vue with the default auto prop. Navigate anywhere in these docs — including with the button below — and the bar animates on its own via vue-router's beforeEach/afterEach hooks. No wiring needed beyond dropping the component in your root layout. Toggle position below to move the real bar between the top and bottom edges of the page."
      :code="`<!-- App.vue — mounted once, persists across route changes -->
<template>
  <MPageProgress position=&quot;top&quot; :thickness=&quot;3&quot; />
  <RouterView />
</template>`"
      :script="`import { MPageProgress } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MButton variant="tonal" icon="menu_book" to="/components/data-display">Navigate to Data Display</MButton>
        <MSegmentedButton
          v-model="pageProgressPosition"
          :options="[{ value: 'top', label: 'Top' }, { value: 'bottom', label: 'Bottom' }]"
        />
        <MSegmentedButton
          v-model="pageProgressColor"
          :options="[{ value: 'primary', label: 'Primary' }, { value: 'secondary', label: 'Secondary' }, { value: 'tertiary', label: 'Tertiary' }, { value: 'error', label: 'Error' }]"
        />
      </div>
      <div class="mt-4 w-full">
        <MSlider v-model="pageProgressThickness" :min="1" :max="12" :step="1" label="Thickness" show-value />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Manual control via usePageProgress()"
      description="Same shared state MPageProgress reads internally — call start() when work begins, done() when it finishes, or set(pct) if you know real progress (e.g. an upload). Useful without vue-router, or alongside it for non-navigation loading (a fetch, a background job)."
      :code="`<MButton @click=&quot;start()&quot;>Start</MButton>
<MButton @click=&quot;set(50)&quot;>Set 50%</MButton>
<MButton @click=&quot;done()&quot;>Done</MButton>`"
      :script="`import { usePageProgress } from '@m3ui-vue/m3ui-vue'

const { start, set, done } = usePageProgress()`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MButton variant="tonal" icon="play_arrow" @click="pageProgress.start()">start()</MButton>
        <MButton variant="tonal" icon="percent" @click="pageProgress.set(50)">set(50)</MButton>
        <MButton variant="tonal" icon="check" @click="pageProgress.done()">done()</MButton>
        <MButton variant="text" icon="bolt" @click="demoPageProgressAuto()">Simulate a 1.5s load</MButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="pageProgressProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="pageProgressApiTypes" />

    <ComponentPager current="MPageProgress" />
  </div>
</template>
