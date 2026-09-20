<script setup lang="ts">
import { ref } from 'vue'
import { MSearchBar, MTopAppBar, MAvatar, MCard } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const searchBarProps: PropDef[] = [
  { name: 'modelValue', type: 'string', default: "''", description: 'Search query (v-model)' },
  { name: 'expanded', type: 'boolean', description: 'Controls the expanded/collapsed state (v-model:expanded) — also works uncontrolled if omitted' },
  { name: 'placeholder', type: 'string', description: "Defaults to the locale's \"Search...\"" },
  { name: 'variant', type: "'docked' | 'fullscreen'", default: "'docked'", description: "'docked' grows into a rounded panel anchored below the bar; 'fullscreen' takes over the viewport (the mobile M3 pattern). The leading icon becomes a back button either way once expanded." },
  { name: 'leadingIcon', type: 'string', default: "'search'", description: 'Icon shown in the collapsed bar' },
  { name: 'iconPosition', type: "'start' | 'end'", default: "'start'", description: "Which side of the collapsed bar the leading icon sits on. The expanded panel's back button always stays at the start" },
  { name: 'textAlign', type: "'start' | 'center'", default: "'start'", description: 'Centers the input/placeholder text (an iOS-style look) instead of the M3-standard start alignment' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner in the expanded header instead of the clear button' },
  { name: 'clearable', type: 'boolean', default: 'true', description: 'Shows a clear (×) button once there is a query' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the collapsed bar' },
]

const searchBarEvents = [
  { name: 'update:modelValue', payload: 'string', description: 'Emitted on every input change — powers v-model' },
  { name: 'update:expanded', payload: 'boolean', description: 'Emitted when the expanded state changes — powers v-model:expanded' },
  { name: 'search', payload: 'string', description: 'Emitted when Enter is pressed in the input, with the current query' },
]

const searchBarSlots: SlotDef[] = [
  { name: '#leading', description: "Overrides the collapsed bar's leading icon" },
  { name: '#trailing', description: 'Trailing content in both the collapsed bar and the expanded header (e.g. an avatar)' },
  { name: '#default', description: 'Results/suggestions content, shown below the input while expanded' },
]

const searchBarQuery = ref('')
const searchBarResults = ['Apple pie', 'Apple juice', 'Apple watch', 'Applesauce']
const submittedQuery = ref('')
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSearchBar</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A collapsed search field that expands into a docked panel or a fullscreen overlay, with results shown
      below the input.
    </p>

    <ComponentDemo
      title="Docked (default)"
      description="Click to expand into a rounded panel anchored below the bar, with results shown underneath. Escape, clicking outside, or scrolling away collapses it."
      :code="`<template>
  <MSearchBar v-model=&quot;query&quot;>
    <div v-for=&quot;result in results&quot; :key=&quot;result&quot; class=&quot;px-4 py-3 text-body-large text-on-surface hover:bg-on-surface/8 cursor-pointer&quot;>
      {{ result }}
    </div>
  </MSearchBar>
</template>`"
      :script="`const query = ref('')
const results = ['Apple pie', 'Apple juice', 'Apple watch', 'Applesauce']`"
    >
      <div class="w-full max-w-md">
        <MSearchBar v-model="searchBarQuery">
          <div
            v-for="result in searchBarResults.filter(r => r.toLowerCase().includes(searchBarQuery.toLowerCase()))"
            :key="result"
            class="cursor-pointer px-4 py-3 text-body-large text-on-surface hover:bg-on-surface/8"
          >
            {{ result }}
          </div>
        </MSearchBar>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Search Event"
      description="Pressing Enter emits search with the current query — use it to submit rather than reacting to every keystroke via v-model."
      :code="`<MSearchBar v-model=&quot;query&quot; @search=&quot;submitted = $event&quot; />`"
    >
      <div class="w-full max-w-md space-y-2">
        <MSearchBar v-model="searchBarQuery" @search="submittedQuery = $event" />
        <p class="text-body-small text-on-surface-variant">Last submitted: {{ submittedQuery || '(none yet — press Enter in the field)' }}</p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Icon position and text alignment"
      description="iconPosition moves the leading icon to the end of the collapsed bar; textAlign centers the input/placeholder text (an iOS-style look) instead of the M3-standard start alignment."
      :code="`<template>
  <MSearchBar v-model=&quot;query&quot; icon-position=&quot;end&quot; text-align=&quot;center&quot; placeholder=&quot;Search&quot; />
</template>`"
    >
      <div class="w-full max-w-md">
        <MSearchBar v-model="searchBarQuery" icon-position="end" text-align="center" placeholder="Search" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Fullscreen"
      description="variant=&quot;fullscreen&quot; takes over the whole viewport when expanded, matching M3's mobile search pattern — a taller header with a back button instead of a docked dropdown."
      :code="`<template>
  <MSearchBar v-model=&quot;query&quot; variant=&quot;fullscreen&quot; />
</template>`"
    >
      <div class="w-full max-w-md">
        <MSearchBar v-model="searchBarQuery" variant="fullscreen">
          <div
            v-for="result in searchBarResults.filter(r => r.toLowerCase().includes(searchBarQuery.toLowerCase()))"
            :key="result"
            class="cursor-pointer px-4 py-3 text-body-large text-on-surface hover:bg-on-surface/8"
          >
            {{ result }}
          </div>
        </MSearchBar>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Inside a top app bar"
      description="MSearchBar is a plain standalone component — drop it in MTopAppBar's #title slot to get the common 'search bar embedded in the app bar' layout, no special integration needed."
      :code="`<template>
  <MTopAppBar navigation-icon=&quot;menu&quot;>
    <template #title>
      <MSearchBar v-model=&quot;query&quot; class=&quot;max-w-md&quot;>
        <div v-for=&quot;result in results&quot; :key=&quot;result&quot;>{{ result }}</div>
      </MSearchBar>
    </template>
  </MTopAppBar>
</template>`"
    >
      <div class="w-full">
        <MCard variant="outlined">
          <MTopAppBar navigation-icon="menu">
            <template #title>
              <MSearchBar v-model="searchBarQuery" class="max-w-md">
                <div
                  v-for="result in searchBarResults.filter(r => r.toLowerCase().includes(searchBarQuery.toLowerCase()))"
                  :key="result"
                  class="cursor-pointer px-4 py-3 text-body-large text-on-surface hover:bg-on-surface/8"
                >
                  {{ result }}
                </div>
              </MSearchBar>
            </template>
            <template #actions>
              <MAvatar fallback="AL" :size="32" />
            </template>
          </MTopAppBar>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="searchBarProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="searchBarEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="searchBarSlots" />

    <ComponentPager current="MSearchBar" />
  </div>
</template>
