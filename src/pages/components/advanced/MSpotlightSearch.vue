<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MSpotlightSearch } from '@m3ui-vue/m3ui-vue'
import type { SpotlightResult } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const spotlightOpen = ref(false)
const spotlightResults = ref<SpotlightResult[]>([])

const allResults: SpotlightResult[] = [
  { id: '1', title: 'MButton', description: 'Action buttons with variants', icon: 'smart_button', category: 'Components' },
  { id: '2', title: 'MCard', description: 'Content containers', icon: 'dashboard', category: 'Components' },
  { id: '3', title: 'MDialog', description: 'Modal dialogs', icon: 'web_asset', category: 'Components' },
  { id: '4', title: 'Setup Guide', description: 'Getting started', icon: 'book', category: 'Docs' },
  { id: '5', title: 'Color Palettes', description: 'Theme colors', icon: 'palette', category: 'Styles' },
]

function onSearch(q: string) {
  if (!q.trim()) { spotlightResults.value = []; return }
  const lower = q.toLowerCase()
  spotlightResults.value = allResults.filter(r => r.title.toLowerCase().includes(lower) || r.description?.toLowerCase().includes(lower))
}

const loadingOpen = ref(false)
const loading = ref(false)
let loadingTimer: ReturnType<typeof setTimeout> | null = null
function onDebouncedSearch(q: string) {
  if (!q.trim()) { loading.value = false; return }
  loading.value = true
  if (loadingTimer) clearTimeout(loadingTimer)
  loadingTimer = setTimeout(() => { loading.value = false }, 500)
}

const spotlightSearchProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model). Required — there is no default.' },
  { name: 'results', type: 'SpotlightResult[]', default: '[]', description: 'Results to render — the component does no filtering itself, it just displays whatever you pass via the search event handler' },
  { name: 'placeholder', type: 'string', description: "Search input placeholder — falls back to the locale's own string when unset" },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner in place of the clear button, e.g. while an async search is in flight' },
  { name: 'noResultsText', type: 'string', description: "Empty-state text — falls back to the locale's own string when unset" },
  { name: 'hotkey', type: 'string', default: "'/'", description: 'Global keyboard shortcut key (no modifier) to open the search — ignored while focus is in a text input/textarea/contenteditable' },
  { name: 'debounce', type: 'number', default: '0', description: 'Delay in ms before the search event fires after the query changes; 0 fires immediately on every keystroke' },
  { name: 'navigateHint', type: 'string', description: "Footer hint text for the arrow keys — falls back to the locale's own string when unset" },
  { name: 'openHint', type: 'string', description: "Footer hint text for Enter — falls back to the locale's own string when unset" },
  { name: 'closeHint', type: 'string', description: "Footer hint text for Escape — falls back to the locale's own string when unset" },
]

const spotlightSearchEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted on open/close — powers v-model' },
  { name: 'search', payload: 'string', description: 'Emitted as the query changes (debounced by the debounce prop) — drive your own filtering and update results in response' },
  { name: 'select', payload: 'SpotlightResult', description: 'Emitted when a result is chosen (click, or Enter)' },
]

const spotlightSearchTypes: TypeDef[] = [
  {
    name: 'SpotlightResult',
    fields: [
      { name: 'id', type: 'string | number', required: true, description: 'Unique identifier' },
      { name: 'title', type: 'string', required: true, description: 'Primary label' },
      { name: 'description', type: 'string', description: 'Secondary line shown under the title' },
      { name: 'icon', type: 'string', description: 'Material Symbol icon name, shown in a circular badge' },
      { name: 'category', type: 'string', description: 'Group heading the result is listed under' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSpotlightSearch</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A spotlight-style search overlay. Unlike MCommandPalette, it doesn't filter internally — you own the
      results array and update it from the search event, which makes it a natural fit for async/remote search.
    </p>

    <ComponentDemo
      title="Spotlight Search"
      description="A spotlight-style search overlay with filtered results. Press / to open, or use the button below."
      :code="`<script setup>
import { ref } from 'vue'
import type { SpotlightResult } from '@m3ui-vue/m3ui-vue'

const open = ref(false)
const results = ref&lt;SpotlightResult[]&gt;([])

const allResults: SpotlightResult[] = [
  { id: '1', title: 'MButton', description: 'Action buttons with variants', icon: 'smart_button', category: 'Components' },
  { id: '2', title: 'MCard', description: 'Content containers', icon: 'dashboard', category: 'Components' },
  { id: '3', title: 'MDialog', description: 'Modal dialogs', icon: 'web_asset', category: 'Components' },
  { id: '4', title: 'Setup Guide', description: 'Getting started', icon: 'book', category: 'Docs' },
  { id: '5', title: 'Color Palettes', description: 'Theme colors', icon: 'palette', category: 'Styles' },
]

function onSearch(q: string) {
  if (!q.trim()) { results.value = []; return }
  const lower = q.toLowerCase()
  results.value = allResults.filter(r =&gt;
    r.title.toLowerCase().includes(lower) || r.description?.toLowerCase().includes(lower)
  )
}
<\/script>

<template>
  <MButton @click=&quot;open = true&quot;>Open Spotlight</MButton>
  <MSpotlightSearch
    v-model=&quot;open&quot;
    :results=&quot;results&quot;
    placeholder=&quot;Search components...&quot;
    @search=&quot;onSearch&quot;
  />
</template>`"
    >
      <MButton @click="spotlightOpen = true">Open Spotlight</MButton>
      <MSpotlightSearch
        v-model="spotlightOpen"
        :results="spotlightResults"
        placeholder="Search components..."
        @search="onSearch"
      />
    </ComponentDemo>

    <ComponentDemo
      title="Loading State &amp; Debounce"
      description="loading shows a spinner in place of the clear button while an async lookup is in flight; debounce delays the search event so you're not re-querying on every keystroke. Here the 'search' fires 500ms after typing stops and loading tracks that same window."
      :code="`<MSpotlightSearch
  v-model=&quot;open&quot;
  :results=&quot;results&quot;
  :loading=&quot;loading&quot;
  :debounce=&quot;300&quot;
  @search=&quot;onSearch&quot;
/>`"
    >
      <MButton @click="loadingOpen = true">Open (loading + debounce)</MButton>
      <MSpotlightSearch
        v-model="loadingOpen"
        :results="[]"
        :loading="loading"
        :debounce="300"
        @search="onDebouncedSearch"
      />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="spotlightSearchProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="spotlightSearchEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="spotlightSearchTypes" />

    <ComponentPager current="MSpotlightSearch" />
  </div>
</template>
