<script setup lang="ts">
import { ref, computed } from 'vue'
import { MAppBarWithSearch, MAvatar, MIconButton, MListItem, MSegmentedButton } from '@m3ui-vue/m3ui-vue'
import type { SegmentedOption } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const props: PropDef[] = [
  { name: 'modelValue', type: 'string', default: "''", description: 'Search query (v-model)' },
  { name: 'expanded', type: 'boolean', description: 'Whether the search is expanded (v-model:expanded); works uncontrolled if omitted' },
  { name: 'placeholder', type: 'string', description: 'Defaults to the locale\'s "Search..."' },
  { name: 'searchVariant', type: "'fullscreen' | 'fullscreen-contained' | 'docked'", default: "'fullscreen'", description: 'How the search expands: full screen, full screen keeping the pill input, or a docked panel (see MSearchBar\'s variant)' },
  { name: 'leadingIcon', type: 'string', default: "'search'", description: 'Icon shown in the collapsed search bar' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner in the expanded header instead of the clear button' },
  { name: 'clearable', type: 'boolean', default: 'true', description: 'Shows a clear (×) button once there is a query' },
  { name: 'navigationIcon', type: 'string', description: 'Leading icon outside the search bar (e.g. menu, arrow_back)' },
  { name: 'navigationLabel', type: 'string', description: 'Accessible label for the navigation icon button; defaults to the locale\'s "Menu"' },
  { name: 'transparent', type: 'boolean', default: 'false', description: 'No app bar container, only the search bar (M3\'s top search bar)' },
  { name: 'scrollBehavior', type: "'pinned' | 'enter-always'", description: 'pinned stays and changes color once content is under it; enter-always also hides while scrolling down and returns on any scroll up (sticky: put the bar at the top of the scrolling element)' },
  { name: 'scrollTarget', type: 'HTMLElement | string | null', default: 'null (the window)', description: 'What scrollBehavior follows: an element or a CSS selector for it' },
]

const events = [
  { name: 'update:modelValue', payload: 'string', description: 'Emitted on every input change — powers v-model' },
  { name: 'update:expanded', payload: 'boolean', description: 'Emitted when the search expands or collapses — powers v-model:expanded' },
  { name: 'search', payload: 'string', description: 'Emitted when Enter is pressed in the input, with the current query' },
  { name: 'navigation', description: 'Emitted when the default navigation icon button is clicked' },
]

const slots: SlotDef[] = [
  { name: '#navigation', description: 'Custom leading area (default: an MIconButton built from navigationIcon)' },
  { name: '#actions', description: 'Trailing action buttons' },
  { name: '#leading', description: "Overrides the search bar's leading icon" },
  { name: '#trailing', description: 'Trailing content inside the search bar (e.g. an avatar)' },
  { name: '#default', description: 'Results/suggestions, shown below the input while the search is expanded' },
]

const query = ref('')
const recipes = ['Apple pie', 'Banana bread', 'Carrot cake', 'Chocolate chip cookies', 'Lemon tart', 'Pumpkin soup', 'Ratatouille', 'Tiramisu']
const results = computed(() => recipes.filter((r) => r.toLowerCase().includes(query.value.toLowerCase())))

type Behavior = 'pinned' | 'enter-always'
const behavior = ref<Behavior>('enter-always')
const behaviorOptions: SegmentedOption[] = [
  { value: 'pinned', label: 'Pinned' },
  { value: 'enter-always', label: 'Enter always' },
]
const barStyle = ref<'app' | 'top'>('app')
const transparent = computed(() => barStyle.value === 'top')
const styleOptions: SegmentedOption[] = [
  { value: 'app', label: 'App bar' },
  { value: 'top', label: 'Top search bar' },
]
const scrollEl = ref<HTMLElement | null>(null)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MAppBarWithSearch</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Material 3's top app bar with a search bar in place of the title: a navigation icon, the search bar and
      actions in one row. The search expands like
      <RouterLink to="/components/navigation/msearchbar" class="text-primary underline">MSearchBar</RouterLink>
      (full screen by default). With <code>transparent</code> it's the top search bar, only the search field
      over the content. It can darken as content scrolls under it, and hide while you scroll down.
    </p>

    <ComponentDemo
      title="App Bar with Search"
      description="Tap the search bar: it expands to a full screen search, here the contained one. Results filter as you type."
      :code="`<MAppBarWithSearch v-model=&quot;query&quot; navigation-icon=&quot;menu&quot; search-variant=&quot;fullscreen-contained&quot; placeholder=&quot;Search recipes&quot;>
  <template #actions>
    <MAvatar fallback=&quot;AL&quot; :size=&quot;32&quot; />
  </template>
  <MListItem v-for=&quot;r in results&quot; :key=&quot;r&quot; :title=&quot;r&quot; icon=&quot;restaurant&quot; />
</MAppBarWithSearch>`"
    >
      <div class="w-full max-w-md overflow-hidden rounded-xl border border-outline-variant">
        <MAppBarWithSearch v-model="query" navigation-icon="menu" search-variant="fullscreen-contained" placeholder="Search recipes">
          <template #actions>
            <MAvatar fallback="AL" :size="32" />
          </template>
          <MListItem v-for="r in results" :key="r" :title="r" icon="restaurant" />
        </MAppBarWithSearch>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Scrolling"
      description="Scroll the list. The app bar turns surface-container and the search bar darker once content is under them; with enter-always the bar hides while you scroll down and comes back on any scroll up. The top search bar has no container of its own, so only the field floats over the list."
      :code="`<div ref=&quot;scrollEl&quot; class=&quot;h-[420px] overflow-y-auto&quot;>
  <MAppBarWithSearch
    navigation-icon=&quot;menu&quot;
    scroll-behavior=&quot;${behavior}&quot;
    :scroll-target=&quot;scrollEl&quot;${transparent ? '\n    transparent' : ''}
  />
  <!-- the list -->
</div>`"
      :script="`const scrollEl = ref<HTMLElement | null>(null)`"
    >
      <div class="flex w-full max-w-md flex-col gap-3">
        <MSegmentedButton v-model="behavior" :options="behaviorOptions" density="compact" />
        <MSegmentedButton v-model="barStyle" :options="styleOptions" density="compact" />
        <div ref="scrollEl" class="h-[420px] overflow-y-auto rounded-xl border border-outline-variant bg-surface">
          <MAppBarWithSearch
            :key="`${behavior}-${transparent}`"
            navigation-icon="menu"
            :scroll-behavior="behavior"
            :scroll-target="scrollEl"
            :transparent="transparent"
          >
            <template #actions>
              <MIconButton icon="mic" label="Voice search" />
            </template>
          </MAppBarWithSearch>
          <MListItem v-for="n in 30" :key="n" :title="`Recipe ${n}`" subtitle="30 min" icon="restaurant" />
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <ComponentPager current="MAppBarWithSearch" />
  </div>
</template>
