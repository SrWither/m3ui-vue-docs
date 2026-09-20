<script setup lang="ts">
import { ref } from 'vue'
import { MTable } from '@m3ui-vue/m3ui-vue'
import type { TableFetchParams } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const tableProps: PropDef[] = [
  { name: 'columns', type: 'TableColumn[]', description: 'Column definitions: { key, label, sortable?, width?, align? }' },
  { name: 'rows', type: 'Record<string, any>[]', description: 'Table data rows' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show skeleton loading state' },
  { name: 'emptyText', type: 'string', description: 'Text when no rows (defaults to the locale string)' },
  { name: 'rowKey', type: 'string', default: "'id'", description: 'Unique key field in each row' },
  { name: 'selectable', type: 'boolean', default: 'false', description: 'Enable row selection with checkboxes' },
  { name: 'modelValue', type: 'Record<string, any>[]', default: '[]', description: 'Selected rows (v-model)' },
  { name: 'perPage', type: 'number', default: '10', description: 'Rows per page' },
  { name: 'searchable', type: 'boolean', default: 'true', description: 'Show search input' },
  { name: 'serverSide', type: 'boolean', default: 'false', description: 'Emit fetch instead of filtering/sorting/paginating locally. Requires :total.' },
  { name: 'total', type: 'number', default: '0', description: 'Total rows (for server-side pagination)' },
  { name: 'page', type: 'number', default: '1', description: 'Current page (v-model via update:page)' },
  { name: 'searchPlaceholder', type: 'string', description: 'Placeholder for search input (defaults to the locale string)' },
  { name: 'selectedText', type: 'string', description: "Text for selected count badge, pluralized with 's' (defaults to the locale string)" },
]

const tableEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'Record<string, any>[]', description: 'Emitted when the selection changes — powers v-model' },
  { name: 'update:page', payload: 'number', description: 'Emitted when the page changes — powers v-model:page' },
  { name: 'fetch', payload: 'TableFetchParams', description: 'Emitted instead of filtering locally when serverSide is true' },
]

const tableSlots: SlotDef[] = [
  { name: 'toolbar', description: 'Extra content in the toolbar next to the search input (filters, buttons, etc.)' },
  { name: 'empty', description: 'Custom empty-state content, replaces the default icon + text' },
  { name: 'cell-<key>', scope: '{ row, value, col }', description: 'Custom cell renderer for the column with that key' },
  { name: 'row-actions', scope: '{ row }', description: 'Per-row action buttons — rendering this slot adds a trailing actions column' },
]

const fetchParamsFields: PropDef[] = [
  { name: 'page', type: 'number', description: 'Current page number' },
  { name: 'perPage', type: 'number', description: 'Rows per page' },
  { name: 'search', type: 'string', description: 'Current search query (empty string if none)' },
  { name: 'sortKey', type: 'string', description: 'Column key being sorted (empty string if none)' },
  { name: 'sortDir', type: "'asc' | 'desc' | ''", description: 'Sort direction (empty string if no sort active)' },
]

const columns = [
  { key: 'id', label: 'ID', sortable: true, width: 'w-16' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Eva Martinez', email: 'eva@example.com', role: 'Admin', status: 'Active' },
  { id: 6, name: 'Frank Lee', email: 'frank@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 7, name: 'Grace Kim', email: 'grace@example.com', role: 'Editor', status: 'Active' },
  { id: 8, name: 'Henry Davis', email: 'henry@example.com', role: 'Viewer', status: 'Active' },
]

/* ── Server-side demo ──────────────────────────────────────────────── */
const allUsers = Array.from({ length: 53 }, (_, i) => ({
  id: i + 1,
  name: ['Alice', 'Bob', 'Carol', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'][i % 10] + ' ' + ['Johnson', 'Smith', 'White', 'Brown', 'Martinez', 'Lee', 'Kim', 'Davis', 'Wilson', 'Moore'][i % 10],
  email: `user${i + 1}@example.com`,
  role: ['Admin', 'Editor', 'Viewer'][i % 3]!,
}))

const selectedRows = ref<Record<string, any>[]>([])

const serverRows = ref<Record<string, any>[]>([])
const serverTotal = ref(0)
const serverPage = ref(1)
const serverLoading = ref(false)

function onFetch(params: TableFetchParams) {
  serverLoading.value = true
  setTimeout(() => {
    let filtered = allUsers
    if (params.search) {
      const q = params.search.toLowerCase()
      filtered = filtered.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    }
    if (params.sortKey && params.sortDir) {
      const key = params.sortKey as keyof typeof allUsers[0]
      const dir = params.sortDir === 'asc' ? 1 : -1
      filtered = [...filtered].sort((a, b) => String(a[key]).localeCompare(String(b[key]), undefined, { numeric: true }) * dir)
    }
    serverTotal.value = filtered.length
    const start = (params.page - 1) * params.perPage
    serverRows.value = filtered.slice(start, start + params.perPage)
    serverPage.value = params.page
    serverLoading.value = false
  }, 500)
}

/* ── Row actions demo ────────────────────────────────────────────────── */
const actionLog = ref<string[]>([])
function logAction(action: string, row: Record<string, any>) {
  actionLog.value = [`${action}: ${row.name}`, ...actionLog.value].slice(0, 3)
}
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTable</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A simple, general-purpose data table — sortable columns, built-in search, pagination, and optional row
      selection, with an escape hatch to delegate all three to your backend via serverSide.
    </p>

    <ComponentDemo
      title="Basic Table"
      description="A simple table with sortable columns and sample data."
      :code="`<MTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; />`"
      :script="`const columns = [
  { key: 'id', label: 'ID', sortable: true, width: 'w-16' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Eva Martinez', email: 'eva@example.com', role: 'Admin', status: 'Active' },
]`"
    >
      <div class="w-full">
        <MTable :columns="columns" :rows="rows" :searchable="false" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Sortable Columns"
      description="Click column headers to sort ascending or descending."
      :code="`<template>
  <MTable
    :columns=&quot;[
      { key: 'id', label: 'ID', sortable: true, width: 'w-16' },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'role', label: 'Role', sortable: true },
    ]&quot;
    :rows=&quot;rows&quot;
    :searchable=&quot;false&quot;
  />
</template>`"
    >
      <div class="w-full">
        <MTable
          :columns="[
            { key: 'id', label: 'ID', sortable: true, width: 'w-16' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            { key: 'role', label: 'Role', sortable: true },
          ]"
          :rows="rows"
          :searchable="false"
        />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With Search & Pagination"
      description="Built-in search filtering and paginated results."
      :code="`<template>
  <MTable
    :columns=&quot;columns&quot;
    :rows=&quot;rows&quot;
    :searchable=&quot;true&quot;
    :per-page=&quot;5&quot;
  />
</template>`"
    >
      <div class="w-full">
        <MTable
          :columns="columns"
          :rows="rows"
          :searchable="true"
          :per-page="5"
        />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Row Actions"
      description="Use the row-actions slot to render per-row buttons — this automatically adds a trailing actions column."
      :code="`<MTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; :searchable=&quot;false&quot;>
  <template #row-actions=&quot;{ row }&quot;>
    <MIconButton icon=&quot;edit&quot; label=&quot;Edit&quot; :size=&quot;28&quot; @click=&quot;logAction('Edited', row)&quot; />
    <MIconButton icon=&quot;delete&quot; label=&quot;Delete&quot; :size=&quot;28&quot; @click=&quot;logAction('Deleted', row)&quot; />
  </template>
</MTable>`"
      :script="`function logAction(action: string, row) {
  actionLog.value = [\`\${action}: \${row.name}\`, ...actionLog.value].slice(0, 3)
}`"
    >
      <div class="w-full space-y-3">
        <MTable :columns="columns.slice(0, 4)" :rows="rows.slice(0, 4)" :searchable="false">
          <template #row-actions="{ row }">
            <div class="flex justify-end gap-1">
              <button
                type="button"
                class="cursor-pointer rounded-full px-2 py-1 text-label-small text-primary transition-colors hover:bg-primary/8"
                @click="logAction('Edited', row)"
              >
                Edit
              </button>
              <button
                type="button"
                class="cursor-pointer rounded-full px-2 py-1 text-label-small text-error transition-colors hover:bg-error/8"
                @click="logAction('Deleted', row)"
              >
                Delete
              </button>
            </div>
          </template>
        </MTable>
        <p v-if="actionLog.length" class="text-body-small text-on-surface-variant">
          Last actions: {{ actionLog.join(' · ') }}
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Row Selection"
      description="Enable selectable to add checkboxes and drive selection via v-model."
      :code="`<MTable v-model=&quot;selected&quot; :columns=&quot;columns&quot; :rows=&quot;rows&quot; :selectable=&quot;true&quot; :searchable=&quot;false&quot; />
<p>Selected: {{ selected.length }}</p>`"
      :script="`const selected = ref([])`"
    >
      <div class="w-full space-y-3">
        <MTable
          v-model="selectedRows"
          :columns="columns.slice(0, 4)"
          :rows="rows.slice(0, 5)"
          :selectable="true"
          :searchable="false"
        />
        <p class="text-body-medium text-on-surface-variant">
          Selected: {{ selectedRows.length }} row(s)
          <span v-if="selectedRows.length > 0">— {{ selectedRows.map(r => r.name).join(', ') }}</span>
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Server-Side (Remote Data)"
      description="Set serverSide to delegate search, sort, and pagination to your backend. The table emits a fetch event with the current params — you handle the API call."
      :code="`<MTable
  :columns=&quot;columns&quot;
  :rows=&quot;rows&quot;
  :loading=&quot;loading&quot;
  :server-side=&quot;true&quot;
  :total=&quot;total&quot;
  :page=&quot;page&quot;
  :per-page=&quot;5&quot;
  @fetch=&quot;onFetch&quot;
  @update:page=&quot;page = $event&quot;
/>`"
      :script="`import { ref } from 'vue'
import type { TableFetchParams } from '@m3ui-vue/m3ui-vue'

const rows = ref([])
const total = ref(0)
const page = ref(1)
const loading = ref(false)

async function onFetch(params: TableFetchParams) {
  loading.value = true

  // Replace with your real API call:
  // const res = await fetch(\`/api/users?\${new URLSearchParams({
  //   page: String(params.page),
  //   per_page: String(params.perPage),
  //   search: params.search,
  //   sort: params.sortKey,
  //   order: params.sortDir,
  // })}\`)
  // const data = await res.json()

  rows.value = data.items
  total.value = data.total
  page.value = params.page
  loading.value = false
}`"
    >
      <div class="w-full">
        <MTable
          :columns="[
            { key: 'id', label: 'ID', sortable: true, width: 'w-16' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            { key: 'role', label: 'Role', sortable: true },
          ]"
          :rows="serverRows"
          :loading="serverLoading"
          :server-side="true"
          :total="serverTotal"
          :page="serverPage"
          :per-page="5"
          @fetch="onFetch"
          @update:page="serverPage = $event"
        />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="tableProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="tableEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="tableSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">TableFetchParams</h3>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      Object emitted by the <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">@fetch</code> event when <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">serverSide</code> is enabled.
    </p>
    <PropsTable :props="fetchParamsFields" />

    <ComponentPager current="MTable" />
  </div>
</template>
