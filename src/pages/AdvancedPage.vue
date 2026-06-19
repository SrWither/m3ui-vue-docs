<script setup lang="ts">
import { ref } from 'vue'
import {
  MCalendar, MScheduler, MKanban, MCommandPalette, MSpotlightSearch,
  MButton, MCard, MChip,
} from '@m3ui-vue/m3ui-vue'
import { MChart } from '@m3ui-vue/m3ui-vue/chart'
import type { CalendarEvent, SchedulerEvent, KanbanColumn, CommandItem, SpotlightResult } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'

/* ── MCalendar ────────────────────────────────────────────────────────── */

const calendarEvents: CalendarEvent[] = [
  { id: '1', title: 'Team Meeting', date: '2026-06-05', color: 'primary', icon: 'groups' },
  { id: '2', title: 'Release v2', date: '2026-06-12', color: 'success', icon: 'rocket_launch' },
  { id: '3', title: 'Code Review', date: '2026-06-18', color: 'tertiary', icon: 'code' },
  { id: '4', title: 'Bug Bash', date: '2026-06-25', color: 'error', icon: 'bug_report' },
]

const calendarProps: PropDef[] = [
  { name: 'events', type: 'CalendarEvent[]', default: '[]', description: 'Array of { id, title, date (YYYY-MM-DD), color?, icon? }' },
  { name: 'locale', type: 'string', default: "'es-ES'", description: 'Locale for month/day names' },
]

/* ── MScheduler ───────────────────────────────────────────────────────── */

function getWeekDate(dayOffset: number, hour: number, min = 0) {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff + dayOffset)
  d.setHours(hour, min, 0, 0)
  return d.toISOString()
}

const schedulerEvents: SchedulerEvent[] = [
  { id: '1', title: 'Standup', start: getWeekDate(0, 9), end: getWeekDate(0, 9, 30), color: 'primary' },
  { id: '2', title: 'Design Review', start: getWeekDate(1, 14), end: getWeekDate(1, 15, 30), color: 'tertiary' },
  { id: '3', title: 'Sprint Planning', start: getWeekDate(3, 10), end: getWeekDate(3, 12), color: 'secondary' },
]

const schedulerProps: PropDef[] = [
  { name: 'events', type: 'SchedulerEvent[]', default: '[]', description: 'Array of { id, title, start (ISO datetime), end (ISO datetime), color? }' },
  { name: 'view', type: "'week' | 'day'", default: "'week'", description: 'View mode' },
  { name: 'startHour', type: 'number', default: '7', description: 'First visible hour' },
  { name: 'endHour', type: 'number', default: '22', description: 'Last visible hour' },
  { name: 'locale', type: 'string', default: "'es-ES'", description: 'Locale for date formatting' },
]

/* ── MKanban ──────────────────────────────────────────────────────────── */

const kanbanColumns = ref<KanbanColumn[]>([
  {
    id: 'todo', title: 'To Do', color: 'primary',
    cards: [
      { id: '1', title: 'Design system tokens', tag: 'Design' },
      { id: '2', title: 'Write unit tests', tag: 'Dev' },
    ],
  },
  {
    id: 'progress', title: 'In Progress', color: 'tertiary',
    cards: [
      { id: '3', title: 'Build components', tag: 'Dev' },
    ],
  },
  {
    id: 'done', title: 'Done', color: 'success',
    cards: [
      { id: '4', title: 'Project setup', tag: 'Ops' },
      { id: '5', title: 'CI pipeline', tag: 'Ops' },
    ],
  },
])

const kanbanProps: PropDef[] = [
  { name: 'modelValue', type: 'KanbanColumn[]', description: 'Array of columns with cards (v-model)' },
]

/* ── MCommandPalette ──────────────────────────────────────────────────── */

const paletteOpen = ref(false)

const commandItems: CommandItem[] = [
  { id: 'new', label: 'New File', icon: 'add', shortcut: 'Ctrl+N', group: 'File' },
  { id: 'open', label: 'Open File', icon: 'folder_open', shortcut: 'Ctrl+O', group: 'File' },
  { id: 'save', label: 'Save', icon: 'save', shortcut: 'Ctrl+S', group: 'File' },
  { id: 'theme', label: 'Toggle Theme', icon: 'dark_mode', group: 'Preferences' },
  { id: 'search', label: 'Search', icon: 'search', shortcut: 'Ctrl+F', group: 'Edit' },
  { id: 'replace', label: 'Find & Replace', icon: 'find_replace', shortcut: 'Ctrl+H', group: 'Edit' },
]

const commandPaletteProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model)' },
  { name: 'items', type: 'CommandItem[]', description: 'Array of { id, label, icon?, shortcut?, group?, disabled?, onSelect? }' },
  { name: 'placeholder', type: 'string', default: "'Buscar comando...'", description: 'Search placeholder' },
  { name: 'noResultsText', type: 'string', default: "'Sin resultados'", description: 'Empty state text' },
  { name: 'hotkey', type: 'string', default: "'k'", description: 'Keyboard shortcut key (with Cmd/Ctrl)' },
]

/* ── MSpotlightSearch ─────────────────────────────────────────────────── */

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

/* ── MChart ──────────────────────────────────────────────────────────── */

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [12, 19, 8, 15, 22, 17],
      backgroundColor: 'rgba(103, 80, 164, 0.6)',
      borderColor: 'rgb(103, 80, 164)',
      borderWidth: 2,
    },
    {
      label: 'Expenses',
      data: [8, 12, 6, 10, 14, 11],
      backgroundColor: 'rgba(0, 150, 136, 0.6)',
      borderColor: 'rgb(0, 150, 136)',
      borderWidth: 2,
    },
    {
      label: 'Profit',
      data: [4, 7, 2, 5, 8, 6],
      backgroundColor: 'rgba(255, 152, 0, 0.6)',
      borderColor: 'rgb(255, 152, 0)',
      borderWidth: 2,
    },
  ],
}

const pieData = {
  labels: ['Vue', 'React', 'Angular', 'Svelte', 'Solid'],
  datasets: [{
    data: [35, 28, 18, 12, 7],
    backgroundColor: [
      'rgb(103, 80, 164)',
      'rgb(0, 150, 136)',
      'rgb(233, 30, 99)',
      'rgb(255, 152, 0)',
      'rgb(33, 150, 243)',
    ],
  }],
}

const radarData = {
  labels: ['Speed', 'DX', 'Ecosystem', 'Bundle Size', 'Learning Curve', 'Community'],
  datasets: [
    {
      label: 'Vue',
      data: [90, 95, 80, 85, 90, 85],
      backgroundColor: 'rgba(103, 80, 164, 0.2)',
      borderColor: 'rgb(103, 80, 164)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(103, 80, 164)',
    },
    {
      label: 'React',
      data: [85, 80, 95, 70, 75, 95],
      backgroundColor: 'rgba(0, 150, 136, 0.2)',
      borderColor: 'rgb(0, 150, 136)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(0, 150, 136)',
    },
  ],
}

const chartProps: PropDef[] = [
  { name: 'type', type: "'line' | 'bar' | 'pie' | 'doughnut' | 'radar'", description: 'Chart type' },
  { name: 'data', type: 'Record<string, any>', description: 'Chart.js data object with labels and datasets' },
  { name: 'options', type: 'Record<string, any>', description: 'Chart.js options' },
  { name: 'height', type: 'string', default: "'300px'", description: 'Chart height' },
]

const spotlightSearchProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model)' },
  { name: 'results', type: 'SpotlightResult[]', default: '[]', description: 'Search results to display' },
  { name: 'placeholder', type: 'string', default: "'Buscar...'", description: 'Search placeholder' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading spinner' },
  { name: 'noResultsText', type: 'string', default: "'No se encontraron resultados'", description: 'Empty state text' },
  { name: 'hotkey', type: 'string', default: "'/'", description: 'Keyboard shortcut' },
  { name: 'debounce', type: 'number', default: '0', description: 'Debounce delay in ms for search event' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Advanced</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Complex interactive components for calendars, kanban boards, schedulers, and search.
    </p>

    <!-- ── MCalendar ──────────────────────────────────────────────────────── -->
    <h2 class="mb-4 text-headline-small font-medium">MCalendar</h2>

    <ComponentDemo
      title="Calendar with Events"
      description="Monthly calendar view with color-coded events and icons."
      :code="`<script setup>
import type { CalendarEvent } from '@m3ui-vue/m3ui-vue'

const events: CalendarEvent[] = [
  { id: '1', title: 'Team Meeting', date: '2026-06-05', color: 'primary', icon: 'groups' },
  { id: '2', title: 'Release v2', date: '2026-06-12', color: 'success', icon: 'rocket_launch' },
  { id: '3', title: 'Code Review', date: '2026-06-18', color: 'tertiary', icon: 'code' },
  { id: '4', title: 'Bug Bash', date: '2026-06-25', color: 'error', icon: 'bug_report' },
]
<\/script>

<template>
  <MCalendar :events=&quot;events&quot; locale=&quot;en-US&quot; />
</template>`"
    >
      <div class="w-full">
        <MCalendar :events="calendarEvents" locale="en-US" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="calendarProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <MCard variant="outlined" class="overflow-x-auto p-4">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant text-left">
            <th class="pb-2 pr-4 font-medium">Event</th>
            <th class="pb-2 font-medium">Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-outline-variant/50">
            <td class="py-2 pr-4 font-mono text-body-small">dateClick</td>
            <td class="py-2 text-on-surface-variant">string (YYYY-MM-DD)</td>
          </tr>
          <tr>
            <td class="py-2 pr-4 font-mono text-body-small">eventClick</td>
            <td class="py-2 text-on-surface-variant">CalendarEvent</td>
          </tr>
        </tbody>
      </table>
    </MCard>

    <!-- ── MScheduler ─────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MScheduler</h2>

    <ComponentDemo
      title="Weekly Scheduler"
      description="Week view scheduler with time-based events. Events are placed on the grid based on their start/end ISO datetimes."
      :code="`<script setup>
import type { SchedulerEvent } from '@m3ui-vue/m3ui-vue'

function getWeekDate(dayOffset: number, hour: number, min = 0) {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff + dayOffset)
  d.setHours(hour, min, 0, 0)
  return d.toISOString()
}

const events: SchedulerEvent[] = [
  { id: '1', title: 'Standup', start: getWeekDate(0, 9), end: getWeekDate(0, 9, 30), color: 'primary' },
  { id: '2', title: 'Design Review', start: getWeekDate(1, 14), end: getWeekDate(1, 15, 30), color: 'tertiary' },
  { id: '3', title: 'Sprint Planning', start: getWeekDate(3, 10), end: getWeekDate(3, 12), color: 'secondary' },
]
<\/script>

<template>
  <MScheduler :events=&quot;events&quot; view=&quot;week&quot; :start-hour=&quot;8&quot; :end-hour=&quot;18&quot; locale=&quot;en-US&quot; />
</template>`"
    >
      <div class="w-full">
        <MScheduler :events="schedulerEvents" view="week" :start-hour="8" :end-hour="18" locale="en-US" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="schedulerProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <MCard variant="outlined" class="overflow-x-auto p-4">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant text-left">
            <th class="pb-2 pr-4 font-medium">Event</th>
            <th class="pb-2 font-medium">Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-outline-variant/50">
            <td class="py-2 pr-4 font-mono text-body-small">eventClick</td>
            <td class="py-2 text-on-surface-variant">SchedulerEvent</td>
          </tr>
          <tr>
            <td class="py-2 pr-4 font-mono text-body-small">slotClick</td>
            <td class="py-2 text-on-surface-variant">{ date, hour }</td>
          </tr>
        </tbody>
      </table>
    </MCard>

    <!-- ── MKanban ────────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MKanban</h2>

    <ComponentDemo
      title="Kanban Board"
      description="Drag-and-drop kanban board with customizable card rendering via the #card slot."
      :code="`<script setup>
import { ref } from 'vue'
import type { KanbanColumn } from '@m3ui-vue/m3ui-vue'

const columns = ref&lt;KanbanColumn[]&gt;([
  {
    id: 'todo', title: 'To Do', color: 'primary',
    cards: [
      { id: '1', title: 'Design system tokens', tag: 'Design' },
      { id: '2', title: 'Write unit tests', tag: 'Dev' },
    ],
  },
  {
    id: 'progress', title: 'In Progress', color: 'tertiary',
    cards: [
      { id: '3', title: 'Build components', tag: 'Dev' },
    ],
  },
  {
    id: 'done', title: 'Done', color: 'success',
    cards: [
      { id: '4', title: 'Project setup', tag: 'Ops' },
      { id: '5', title: 'CI pipeline', tag: 'Ops' },
    ],
  },
])
<\/script>

<template>
  <MKanban v-model=&quot;columns&quot;>
    <template #card=&quot;{ card }&quot;>
      <p class=&quot;text-body-medium&quot;>{{ card.title }}</p>
      <MChip tone=&quot;primary&quot; class=&quot;mt-1&quot;>{{ card.tag }}</MChip>
    </template>
  </MKanban>
</template>`"
    >
      <div class="w-full">
        <MKanban v-model="kanbanColumns">
          <template #card="{ card }">
            <p class="text-body-medium">{{ card.title }}</p>
            <MChip tone="primary" class="mt-1">{{ card.tag }}</MChip>
          </template>
        </MKanban>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="kanbanProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <MCard variant="outlined" class="overflow-x-auto p-4">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant text-left">
            <th class="pb-2 pr-4 font-medium">Event</th>
            <th class="pb-2 font-medium">Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-outline-variant/50">
            <td class="py-2 pr-4 font-mono text-body-small">cardMove</td>
            <td class="py-2 text-on-surface-variant">{ cardId, fromColumn, toColumn, toIndex }</td>
          </tr>
          <tr>
            <td class="py-2 pr-4 font-mono text-body-small">cardClick</td>
            <td class="py-2 text-on-surface-variant">{ card, columnId }</td>
          </tr>
        </tbody>
      </table>
    </MCard>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <MCard variant="outlined" class="overflow-x-auto p-4">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant text-left">
            <th class="pb-2 pr-4 font-medium">Slot</th>
            <th class="pb-2 font-medium">Props</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="py-2 pr-4 font-mono text-body-small">#card</td>
            <td class="py-2 text-on-surface-variant">{ card, columnId }</td>
          </tr>
        </tbody>
      </table>
    </MCard>

    <!-- ── MCommandPalette ────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MCommandPalette</h2>

    <ComponentDemo
      title="Command Palette"
      description="A searchable command palette with keyboard shortcut support. Press Ctrl+K to open, or use the button below."
      :code="`<script setup>
import { ref } from 'vue'
import type { CommandItem } from '@m3ui-vue/m3ui-vue'

const open = ref(false)

const items: CommandItem[] = [
  { id: 'new', label: 'New File', icon: 'add', shortcut: 'Ctrl+N', group: 'File' },
  { id: 'open', label: 'Open File', icon: 'folder_open', shortcut: 'Ctrl+O', group: 'File' },
  { id: 'save', label: 'Save', icon: 'save', shortcut: 'Ctrl+S', group: 'File' },
  { id: 'theme', label: 'Toggle Theme', icon: 'dark_mode', group: 'Preferences' },
  { id: 'search', label: 'Search', icon: 'search', shortcut: 'Ctrl+F', group: 'Edit' },
  { id: 'replace', label: 'Find &amp; Replace', icon: 'find_replace', shortcut: 'Ctrl+H', group: 'Edit' },
]
<\/script>

<template>
  <MButton @click=&quot;open = true&quot;>Open Command Palette</MButton>
  <MCommandPalette v-model=&quot;open&quot; :items=&quot;items&quot; />
</template>`"
    >
      <MButton @click="paletteOpen = true">Open Command Palette</MButton>
      <MCommandPalette v-model="paletteOpen" :items="commandItems" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="commandPaletteProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <MCard variant="outlined" class="overflow-x-auto p-4">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant text-left">
            <th class="pb-2 pr-4 font-medium">Event</th>
            <th class="pb-2 font-medium">Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="py-2 pr-4 font-mono text-body-small">select</td>
            <td class="py-2 text-on-surface-variant">CommandItem</td>
          </tr>
        </tbody>
      </table>
    </MCard>

    <!-- ── MSpotlightSearch ───────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MSpotlightSearch</h2>

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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="spotlightSearchProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <MCard variant="outlined" class="overflow-x-auto p-4">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant text-left">
            <th class="pb-2 pr-4 font-medium">Event</th>
            <th class="pb-2 font-medium">Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-outline-variant/50">
            <td class="py-2 pr-4 font-mono text-body-small">search</td>
            <td class="py-2 text-on-surface-variant">string (search query)</td>
          </tr>
          <tr>
            <td class="py-2 pr-4 font-mono text-body-small">select</td>
            <td class="py-2 text-on-surface-variant">SpotlightResult</td>
          </tr>
        </tbody>
      </table>
    </MCard>

    <!-- ── MChart ──────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MChart</h2>

    <ComponentDemo
      title="Bar & Line"
      description="Multi-dataset charts with custom colors per series."
      :code="`<script setup>
const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    { label: 'Revenue', data: [12, 19, 8, 15, 22, 17], backgroundColor: 'rgba(103, 80, 164, 0.6)', borderColor: 'rgb(103, 80, 164)' },
    { label: 'Expenses', data: [8, 12, 6, 10, 14, 11], backgroundColor: 'rgba(0, 150, 136, 0.6)', borderColor: 'rgb(0, 150, 136)' },
    { label: 'Profit', data: [4, 7, 2, 5, 8, 6], backgroundColor: 'rgba(255, 152, 0, 0.6)', borderColor: 'rgb(255, 152, 0)' },
  ],
}
<\/script>

<template>
  <MChart type=&quot;bar&quot; :data=&quot;data&quot; height=&quot;280px&quot; />
  <MChart type=&quot;line&quot; :data=&quot;data&quot; height=&quot;280px&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard variant="outlined" class="p-4">
          <p class="mb-2 text-label-medium font-medium text-on-surface-variant">Bar</p>
          <MChart type="bar" :data="chartData" height="260px" />
        </MCard>
        <MCard variant="outlined" class="p-4">
          <p class="mb-2 text-label-medium font-medium text-on-surface-variant">Line</p>
          <MChart type="line" :data="chartData" height="260px" />
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Pie & Doughnut"
      description="Circular charts with distinct colors per segment."
      :code="`<script setup>
const data = {
  labels: ['Vue', 'React', 'Angular', 'Svelte', 'Solid'],
  datasets: [{
    data: [35, 28, 18, 12, 7],
    backgroundColor: ['rgb(103,80,164)', 'rgb(0,150,136)', 'rgb(233,30,99)', 'rgb(255,152,0)', 'rgb(33,150,243)'],
  }],
}
<\/script>

<template>
  <MChart type=&quot;pie&quot; :data=&quot;data&quot; height=&quot;280px&quot; />
  <MChart type=&quot;doughnut&quot; :data=&quot;data&quot; height=&quot;280px&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard variant="outlined" class="p-4">
          <p class="mb-2 text-label-medium font-medium text-on-surface-variant">Pie</p>
          <MChart type="pie" :data="pieData" height="260px" />
        </MCard>
        <MCard variant="outlined" class="p-4">
          <p class="mb-2 text-label-medium font-medium text-on-surface-variant">Doughnut</p>
          <MChart type="doughnut" :data="pieData" height="260px" />
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Radar"
      description="Multi-axis comparison chart, ideal for comparing feature sets."
      :code="`<script setup>
const data = {
  labels: ['Speed', 'DX', 'Ecosystem', 'Bundle Size', 'Learning Curve', 'Community'],
  datasets: [
    { label: 'Vue', data: [90, 95, 80, 85, 90, 85], backgroundColor: 'rgba(103,80,164,0.2)', borderColor: 'rgb(103,80,164)' },
    { label: 'React', data: [85, 80, 95, 70, 75, 95], backgroundColor: 'rgba(0,150,136,0.2)', borderColor: 'rgb(0,150,136)' },
  ],
}
<\/script>

<template>
  <MChart type=&quot;radar&quot; :data=&quot;data&quot; height=&quot;350px&quot; />
</template>`"
    >
      <div class="mx-auto w-full max-w-lg">
        <MCard variant="outlined" class="p-4">
          <p class="mb-2 text-label-medium font-medium text-on-surface-variant">Radar</p>
          <MChart type="radar" :data="radarData" height="320px" />
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="chartProps" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Peer Dependencies</p>
      <pre class="rounded-lg bg-surface-container p-3 text-body-small"><code>chart.js  vue-chartjs</code></pre>
    </MCard>
  </div>
</template>
