<script setup lang="ts">
import { ref } from 'vue'
import { MInfiniteScroll } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const infiniteScrollProps: PropDef[] = [
  { name: 'loading', type: 'boolean', default: 'false', description: 'Currently loading more items — shows the loading slot' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the load trigger entirely (no observer attached)' },
  { name: 'threshold', type: 'number', default: '100', description: 'Distance in px from the sentinel before it triggers load' },
  { name: 'loadingText', type: 'string', description: "Text shown while loading (defaults to the locale string, 'Loading...')" },
  { name: 'endText', type: 'string', description: "Text shown when ended (defaults to the locale string, 'No more items')" },
  { name: 'ended', type: 'boolean', default: 'false', description: 'No more items to load — shows the end slot and stops observing' },
]

const infiniteScrollEvents: EventDef[] = [
  { name: 'load', description: 'Emitted when the sentinel scrolls into view and more items should be fetched' },
]

const infiniteScrollSlots: SlotDef[] = [
  { name: 'default', description: 'The content list itself' },
  { name: 'loading', description: 'Custom loading indicator, shown when loading is true' },
  { name: 'end', description: 'Custom end-of-list content, shown when ended is true' },
  { name: 'idle', description: 'Content shown when neither loading nor ended (empty by default)' },
]

const infiniteItems = ref(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`))
const infiniteLoading = ref(false)
const infiniteEnded = ref(false)
function loadMore() {
  infiniteLoading.value = true
  setTimeout(() => {
    const start = infiniteItems.value.length
    if (start >= 60) {
      infiniteEnded.value = true
    } else {
      for (let i = 1; i <= 10; i++) infiniteItems.value.push(`Item ${start + i}`)
    }
    infiniteLoading.value = false
  }, 800)
}

const disabledItems = Array.from({ length: 8 }, (_, i) => `Fixed item ${i + 1}`)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MInfiniteScroll</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Wraps a scrollable list and emits load when an IntersectionObserver sentinel at the bottom becomes visible —
      hand it your own fetch-more logic.
    </p>

    <ComponentDemo
      title="Infinite Scroll"
      description="Automatically loads more content when scrolling near the bottom (scroll the box below)."
      :code="`<template>
  <MInfiniteScroll :loading=&quot;loading&quot; :ended=&quot;ended&quot; @load=&quot;loadMore&quot;>
    <div v-for=&quot;item in items&quot; :key=&quot;item&quot;>{{ item }}</div>
  </MInfiniteScroll>
</template>`"
      :script="`const items = ref([...])
const loading = ref(false)
const ended = ref(false)

function loadMore() {
  loading.value = true
  // fetch more items...
  loading.value = false
}`"
    >
      <div class="h-64 w-full max-w-md overflow-y-auto rounded-xl border border-outline-variant">
        <MInfiniteScroll :loading="infiniteLoading" :ended="infiniteEnded" @load="loadMore">
          <div
            v-for="item in infiniteItems"
            :key="item"
            class="border-b border-outline-variant px-4 py-3 text-body-medium"
          >
            {{ item }}
          </div>
        </MInfiniteScroll>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Disabled"
      description="With disabled, no observer is attached and load never fires — useful for a list that's already complete without showing the 'ended' messaging."
      :code="`<template>
  <MInfiniteScroll :disabled=&quot;true&quot;>
    <div v-for=&quot;item in items&quot; :key=&quot;item&quot;>{{ item }}</div>
  </MInfiniteScroll>
</template>`"
    >
      <div class="h-40 w-full max-w-md overflow-y-auto rounded-xl border border-outline-variant">
        <MInfiniteScroll :disabled="true">
          <div
            v-for="item in disabledItems"
            :key="item"
            class="border-b border-outline-variant px-4 py-3 text-body-medium"
          >
            {{ item }}
          </div>
        </MInfiniteScroll>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="infiniteScrollProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="infiniteScrollEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="infiniteScrollSlots" />

    <ComponentPager current="MInfiniteScroll" />
  </div>
</template>
