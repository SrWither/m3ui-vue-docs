<script setup lang="ts">
import { computed, ref } from 'vue'
import { MButton, MDataTable, MDialog, MFilterBuilder, countRules, createFilter, filterRows } from '@m3ui-vue/m3ui-vue'
import type { DataTableColumn, FilterField, FilterGroup } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

// Made-up tasks
const PEOPLE = ['Ana', 'Bruno', 'Carla', 'Diego']
const AREAS = ['Web', 'Mobile', 'API', 'Docs']
const tasks = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  title: ['Fix', 'Write', 'Review', 'Design', 'Test'][i % 5] + ' ' + ['login', 'invoices', 'search', 'onboarding', 'reports', 'settings', 'export', 'billing'][i % 8],
  assignee: PEOPLE[(i * 3) % 4]!,
  area: AREAS[(i * 7) % 4]!,
  estimate: [1, 2, 3, 5, 8, 13][(i * 5) % 6]!,
  due: `2026-${String(11 + Math.floor(i / 20)).padStart(2, '0')}-${String(((i * 7) % 28) + 1).padStart(2, '0')}`,
  done: i % 3 === 0,
}))

const fields: FilterField[] = [
  { key: 'title', label: 'Title' },
  { key: 'assignee', label: 'Assignee', type: 'select', options: PEOPLE.map((p) => ({ label: p, value: p })) },
  { key: 'area', label: 'Area', type: 'select', options: AREAS.map((a) => ({ label: a, value: a })) },
  { key: 'estimate', label: 'Estimate (points)', type: 'number' },
  { key: 'due', label: 'Due', type: 'date' },
  { key: 'done', label: 'Done', type: 'boolean' },
]
const columns: DataTableColumn[] = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'assignee', label: 'Assignee', sortable: true },
  { key: 'area', label: 'Area', sortable: true },
  { key: 'estimate', label: 'Points', sortable: true, align: 'right' },
  { key: 'due', label: 'Due', sortable: true },
  { key: 'done', label: 'Done' },
]
const rowsFor = (filter: FilterGroup | null) => filterRows(tasks, filter, fields).map((t) => ({ ...t, done: t.done ? 'Yes' : 'No' }))

// First demo: starts with "not done AND (Ana OR more than 5 points)"
const filter = ref<FilterGroup | null>({
  ...createFilter([{ field: 'done', operator: 'isFalse' }]),
  rules: [
    ...createFilter([{ field: 'done', operator: 'isFalse' }]).rules,
    createFilter([{ field: 'assignee', operator: 'in', value: ['Ana'] }, { field: 'estimate', operator: 'gt', value: 5 }], 'or'),
  ],
})
const rows = computed(() => rowsFor(filter.value))

// Second demo: the builder in a dialog, applied on "Apply"
const applied = ref<FilterGroup | null>(null)
const draft = ref<FilterGroup | null>(null)
const dialogOpen = ref(false)
const count = computed(() => countRules(applied.value))
const dialogRows = computed(() => rowsFor(applied.value))
function openFilters() {
  draft.value = applied.value ? JSON.parse(JSON.stringify(applied.value)) : null
  dialogOpen.value = true
}
function apply() {
  applied.value = draft.value
  dialogOpen.value = false
}

const builderProps: PropDef[] = [
  { name: 'modelValue', type: 'FilterGroup | null', default: 'null', description: 'The filter (v-model): { combinator: \'and\' | \'or\', rules: (FilterRule | FilterGroup)[] }, plain JSON you can save or send to a server.' },
  { name: 'fields', type: 'FilterField[]', description: 'What can be filtered: { key (a dotted path works), label, type?: text | number | date | select | boolean, options? (select), operators?, accessor? }. Required.' },
  { name: 'maxDepth', type: 'number', default: '1', description: 'How deep groups nest. 0: conditions only, no groups.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Read-only.' },
]
const builderEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'FilterGroup', description: 'The filter changed.' },
]
const helpers = [
  ['filterRows(rows, filter, fields)', 'The rows that pass. Rules still being filled in match everything, so a half-built filter never empties the table.'],
  ['matchesFilter(row, filter, fields)', 'Whether one row passes.'],
  ['countRules(filter)', 'How many complete conditions it has, for a "Filters (3)" button.'],
  ['createFilter(rules?, combinator?)', 'A filter to start from: createFilter([{ field: \'done\', operator: \'isFalse\' }]).'],
  ['operatorsFor(field) / FILTER_OPERATORS', 'The operators a field offers: text (contains, is, starts with…), number (=, >, between…), date (is, after, before, between), select (is any of, is none of), boolean (is yes / no), and is empty / not empty.'],
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFilterBuilder</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A visual filter: conditions of field · operator · value, combined so all or any of them match, with groups for
      mixes like "not done AND (Ana OR more than 5 points)". Each field's type picks its operators and its input (a
      text field, a number, a date picker, a multi-select). The filter is plain JSON in a v-model;
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">filterRows()</code> applies it to any
      table's rows, or send it to your server. It lays out by its own width: conditions wrap when it's narrow.
    </p>

    <ComponentDemo
      title="Over a table"
      description="40 made-up tasks in an MDataTable, filtered as you build. It starts with not done AND (assigned to Ana OR more than 5 points): change a condition, add one, or a group."
      :code="`<MFilterBuilder v-model=&quot;filter&quot; :fields=&quot;fields&quot; />
<MDataTable :columns=&quot;columns&quot; :rows=&quot;filterRows(tasks, filter, fields)&quot; :per-page=&quot;5&quot; :searchable=&quot;false&quot; />`"
      :script="`import { MDataTable, MFilterBuilder, filterRows } from '@m3ui-vue/m3ui-vue'

const fields = [
  { key: 'title', label: 'Title' },
  { key: 'assignee', label: 'Assignee', type: 'select', options: [{ label: 'Ana', value: 'Ana' }, /* … */] },
  { key: 'estimate', label: 'Estimate (points)', type: 'number' },
  { key: 'due', label: 'Due', type: 'date' },
  { key: 'done', label: 'Done', type: 'boolean' },
]
const filter = ref(null)`"
    >
      <div class="flex w-full flex-col gap-4">
        <MFilterBuilder v-model="filter" :fields="fields" />
        <p class="text-label-large text-on-surface-variant">{{ rows.length }} of {{ tasks.length }} tasks</p>
        <MDataTable :columns="columns" :rows="rows" :per-page="5" :searchable="false" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="In a dialog, with a count"
      description="A Filters button that says how many conditions are on, opening the builder in an MDialog. Edits go into a copy, applied on Apply, so cancelling leaves the table alone."
      :code="`<MButton variant=&quot;tonal&quot; icon=&quot;filter_list&quot; @click=&quot;openFilters&quot;>Filters{{ count ? \` (\${count})\` : '' }}</MButton>
<MDataTable :columns=&quot;columns&quot; :rows=&quot;filterRows(tasks, applied, fields)&quot; />

<MDialog v-model=&quot;dialogOpen&quot; title=&quot;Filters&quot; max-width=&quot;720px&quot;>
  <MFilterBuilder v-model=&quot;draft&quot; :fields=&quot;fields&quot; />
  <template #actions>
    <MButton variant=&quot;text&quot; @click=&quot;draft = null&quot;>Clear</MButton>
    <MButton variant=&quot;text&quot; @click=&quot;dialogOpen = false&quot;>Cancel</MButton>
    <MButton @click=&quot;apply&quot;>Apply</MButton>
  </template>
</MDialog>`"
      :script="`import { countRules, filterRows } from '@m3ui-vue/m3ui-vue'

const applied = ref(null)
const draft = ref(null)
const count = computed(() => countRules(applied.value))

function openFilters() {
  draft.value = structuredClone(toRaw(applied.value))
  dialogOpen.value = true
}
function apply() {
  applied.value = draft.value
  dialogOpen.value = false
}`"
    >
      <div class="flex w-full flex-col gap-3">
        <div class="flex items-center gap-3">
          <MButton variant="tonal" icon="filter_list" @click="openFilters">Filters{{ count ? ` (${count})` : '' }}</MButton>
          <span class="text-label-large text-on-surface-variant">{{ dialogRows.length }} of {{ tasks.length }} tasks</span>
        </div>
        <MDataTable :columns="columns" :rows="dialogRows" :per-page="5" :searchable="false" />
        <MDialog v-model="dialogOpen" title="Filters" max-width="720px">
          <MFilterBuilder v-model="draft" :fields="fields" />
          <template #actions>
            <MButton variant="text" @click="draft = null">Clear</MButton>
            <MButton variant="text" @click="dialogOpen = false">Cancel</MButton>
            <MButton @click="apply">Apply</MButton>
          </template>
        </MDialog>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="builderProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="builderEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Helpers</h3>
    <div class="mb-8 overflow-x-auto rounded-xl border border-outline-variant">
      <table class="w-full text-left text-body-medium">
        <tbody>
          <tr v-for="[fn, what] in helpers" :key="fn" class="border-b border-outline-variant last:border-b-0">
            <td class="whitespace-nowrap px-4 py-2 font-mono text-primary">{{ fn }}</td>
            <td class="px-4 py-2 text-on-surface-variant">{{ what }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ComponentPager current="MFilterBuilder" />
  </div>
</template>
