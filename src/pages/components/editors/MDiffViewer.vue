<script setup lang="ts">
import { ref } from 'vue'
import { MDiffViewer, MTextField } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const original = ref(`import { ref } from 'vue'

export function useCart() {
  const items = ref([])
  const total = ref(0)

  function add(item) {
    items.value.push(item)
    total.value += item.price
  }

  function remove(id) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function clear() {
    items.value = []
  }

  return { items, total, add, remove, clear }
}`)
const modified = ref(`import { computed, ref } from 'vue'

export function useCart() {
  const items = ref([])
  const total = computed(() => items.value.reduce((sum, i) => sum + i.price * i.qty, 0))

  function add(item, qty = 1) {
    items.value.push({ ...item, qty })
  }

  function remove(id) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function clear() {
    items.value = []
  }

  return { items, total, add, remove, clear }
}`)
const v1 = ref('The quick brown fox jumps over the lazy dog.')
const v2 = ref('The quick red fox leaps over the sleepy dog.')

const diffProps: PropDef[] = [
  { name: 'original / modified', type: 'string', description: 'The texts before and after. Required.' },
  { name: 'mode', type: "'split' | 'unified'", default: "'split'", description: 'Side by side or unified (v-model:mode with the toggle).' },
  { name: 'toggle', type: 'boolean', default: 'true', description: 'The split / unified toggle in the header.' },
  { name: 'originalLabel / modifiedLabel', type: 'string', description: 'Names in the header (file names, versions).' },
  { name: 'context', type: 'number', default: '3', description: 'Unchanged lines kept around each change; longer stretches fold behind "Show N unchanged lines" (-1: never fold).' },
  { name: 'wordDiff', type: 'boolean', default: 'true', description: 'Highlight the changed words inside changed lines.' },
  { name: 'lineNumbers / wrap', type: 'boolean', default: 'true / false', description: 'Line numbers; wrap long lines instead of scrolling.' },
  { name: 'breakpoint', type: 'number', default: '640', description: 'Below this width (its own) side by side shows unified.' },
  { name: 'maxHeight', type: 'string', description: 'Limit the height, scrolling inside.' },
]
const diffEvents: EventDef[] = [{ name: 'update:mode', payload: "'split' | 'unified'", description: 'The view changed from the toggle.' }]
const diffSlots: SlotDef[] = [{ name: 'header', scope: '{ added, removed }', description: 'The header\'s title area instead of the labels.' }]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MDiffViewer</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      What changed between two texts: side by side or unified, changed words highlighted inside changed lines, line
      numbers, counts, and long unchanged stretches folded. It has its own line and word diff, so it needs no editor or
      extra dependency and renders on the server; diffLines() and diffWords() are exported too.
    </p>

    <ComponentDemo
      title="A code review"
      description="A composable before and after: the folded rows open on click. Narrow, it switches to unified."
      :code="`<MDiffViewer :original=&quot;before&quot; :modified=&quot;after&quot; original-label=&quot;useCart.js (main)&quot; modified-label=&quot;useCart.js (feature/qty)&quot; />`"
      :script="`import { MDiffViewer } from '@m3ui-vue/m3ui-vue'`"
    >
      <MDiffViewer :original="original" :modified="modified" original-label="useCart.js (main)" modified-label="useCart.js (feature/qty)" class="w-full" />
    </ComponentDemo>

    <ComponentDemo
      title="Prose, live"
      description="Edit either version: the diff follows as you type. Unified, wrapped, without line numbers."
      :code="`<MDiffViewer :original=&quot;v1&quot; :modified=&quot;v2&quot; mode=&quot;unified&quot; :toggle=&quot;false&quot; :line-numbers=&quot;false&quot; wrap />`"
    >
      <div class="flex w-full flex-col gap-3">
        <div class="grid gap-3 md:grid-cols-2">
          <MTextField v-model="v1" label="Before" multiline :rows="2" />
          <MTextField v-model="v2" label="After" multiline :rows="2" />
        </div>
        <MDiffViewer :original="v1" :modified="v2" mode="unified" :toggle="false" :line-numbers="false" wrap />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="diffProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="diffEvents" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="diffSlots" />

    <ComponentPager current="MDiffViewer" />
  </div>
</template>
