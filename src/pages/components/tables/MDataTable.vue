<script setup lang="ts">
import { ref } from 'vue'
import { MDataTable, MIconButton, MChip } from '@m3ui-vue/m3ui-vue'
import type { DataTableColumn, DataTableFetchParams } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const dataTableProps: PropDef[] = [
  { name: 'columns', type: 'DataTableColumn[]', description: 'Column definitions — see the type below' },
  { name: 'rows', type: 'Record<string, any>[]', description: 'Table data rows' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show skeleton loading state' },
  { name: 'emptyText', type: 'string', description: 'Text when no rows (defaults to the locale string)' },
  { name: 'rowKey', type: 'string', default: "'id'", description: 'Unique key field in each row' },
  { name: 'selectable', type: 'boolean', default: 'false', description: 'Enable row selection with checkboxes' },
  { name: 'modelValue', type: 'Record<string, any>[]', default: '[]', description: 'Selected rows (v-model)' },
  { name: 'perPage', type: 'number', default: '10', description: 'Rows per page' },
  { name: 'searchable', type: 'boolean', default: 'true', description: 'Show search input' },
  { name: 'expandable', type: 'boolean', default: 'false', description: 'Enable row expansion (requires the row-expand slot)' },
  { name: 'striped', type: 'boolean', default: 'false', description: 'Alternate row colors' },
  { name: 'dense', type: 'boolean', default: 'false', description: 'Compact row height' },
  { name: 'stickyHeader', type: 'boolean', default: 'false', description: 'Sticky table header' },
  { name: 'groupBy', type: 'string', description: 'Group rows by this column key' },
  { name: 'columnToggle', type: 'boolean', default: 'false', description: 'Allow hiding/showing columns from a menu' },
  { name: 'exportable', type: 'boolean', default: 'false', description: 'Show an export-to-CSV button' },
  { name: 'serverSide', type: 'boolean', default: 'false', description: 'Emit fetch instead of local filtering. Requires :total.' },
  { name: 'total', type: 'number', default: '0', description: 'Total rows (for server-side pagination)' },
  { name: 'page', type: 'number', default: '1', description: 'Current page (v-model via update:page)' },
  { name: 'searchPlaceholder', type: 'string', description: 'Placeholder for search input (defaults to the locale string)' },
  { name: 'selectedText', type: 'string', description: 'Text for selected count badge (defaults to the locale string)' },
  { name: 'recordsText', type: 'string', description: 'Text for total records count (defaults to the locale string)' },
  { name: 'expandLabel', type: 'string', description: 'Aria label for the expand button (defaults to the locale string)' },
  { name: 'columnsLabel', type: 'string', description: 'Label for the column-toggle button (defaults to the locale string)' },
  { name: 'exportLabel', type: 'string', description: 'Label for the export button (defaults to the locale string)' },
  { name: 'noGroupText', type: 'string', description: 'Text for the ungrouped-rows bucket (defaults to the locale string)' },
  { name: 'minHeight', type: 'string', description: "Reserves a fixed min-height for the table area (any valid CSS min-height value) so switching between loading/empty/loaded doesn't visibly resize the table. Off by default." },
]

const dataTableEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'Record<string, any>[]', description: 'Emitted when the selection changes — powers v-model' },
  { name: 'update:page', payload: 'number', description: 'Emitted when the page changes — powers v-model:page' },
  { name: 'row-click', payload: 'Record<string, any>', description: 'Emitted when a row is clicked, only when selectable is false' },
  { name: 'fetch', payload: 'DataTableFetchParams', description: 'Emitted instead of filtering locally when serverSide is true' },
]

const dataTableSlots: SlotDef[] = [
  { name: 'toolbar', description: 'Extra content in the toolbar next to the search input (filters, buttons, etc.)' },
  { name: 'empty', description: 'Custom empty-state content, replaces the default icon + text' },
  { name: 'cell-<key>', scope: '{ row, value, col }', description: 'Custom cell renderer for the column with that key' },
  { name: 'row-actions', scope: '{ row }', description: 'Per-row action buttons — rendering this slot adds a trailing actions column' },
  { name: 'row-expand', scope: '{ row }', description: 'Expanded-row detail content, shown when expandable is true and the row is toggled open' },
]

const dataTableTypes: TypeDef[] = [
  {
    name: 'DataTableColumn',
    fields: [
      { name: 'key', type: 'string', required: true, description: 'Field name in each row object' },
      { name: 'label', type: 'string', required: true, description: 'Column header text' },
      { name: 'sortable', type: 'boolean', description: 'Allow sorting by this column' },
      { name: 'filterable', type: 'boolean', description: 'Include this column when matching the search query' },
      { name: 'resizable', type: 'boolean', description: 'Show a drag handle to resize the column width' },
      { name: 'width', type: 'string', description: 'Initial column width (any valid CSS width)' },
      { name: 'minWidth', type: 'string', description: 'Minimum column width when resizing' },
      { name: 'align', type: "'left' | 'center' | 'right'", description: 'Text alignment for header and cells' },
      { name: 'pinned', type: "'left' | 'right'", description: 'Pin the column to an edge of the table' },
      { name: 'hidden', type: 'boolean', description: 'Hide the column by default (still toggleable via columnToggle)' },
    ],
  },
  {
    name: 'DataTableFetchParams',
    description: 'Object emitted by the @fetch event when serverSide is enabled.',
    fields: [
      { name: 'page', type: 'number', required: true, description: 'Current page number' },
      { name: 'perPage', type: 'number', required: true, description: 'Rows per page' },
      { name: 'search', type: 'string', required: true, description: 'Current search query (empty string if none)' },
      { name: 'sortKey', type: 'string', required: true, description: 'Column key being sorted (empty string if none)' },
      { name: 'sortDir', type: "'asc' | 'desc' | ''", required: true, description: 'Sort direction (empty string if no sort active)' },
    ],
  },
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

const dataTableColumns = [
  { key: 'id', label: 'ID', sortable: true, width: 'w-16', pinned: 'left' },
  { key: 'name', label: 'Name', sortable: true, filterable: true, resizable: true },
  { key: 'email', label: 'Email', sortable: true, filterable: true, resizable: true },
  { key: 'role', label: 'Role', sortable: true, filterable: true },
  { key: 'status', label: 'Status', filterable: true },
] satisfies DataTableColumn[]

const dataTableSelected = ref<Record<string, any>[]>([])

const expandRows = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', phone: '+1 555-0101', department: 'Engineering', joined: '2022-03-15', bio: 'Full-stack developer with 8 years of experience. Leads the platform team and mentors junior developers.' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active', phone: '+1 555-0102', department: 'Design', joined: '2023-01-10', bio: 'UI/UX designer focused on design systems and component libraries. Previously worked at a fintech startup.' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive', phone: '+1 555-0103', department: 'Marketing', joined: '2023-06-22', bio: 'Content strategist specializing in developer documentation and technical writing.' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Editor', status: 'Active', phone: '+1 555-0104', department: 'Engineering', joined: '2022-11-05', bio: 'Backend engineer working on APIs and microservices. Passionate about performance optimization.' },
]

const expandColumns = [
  { key: 'id', label: 'ID', sortable: true, width: 'w-16' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
]

/* ── groupBy demo ─────────────────────────────────────────────────────── */
const groupColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'department', label: 'Department' },
  { key: 'role', label: 'Role', sortable: true },
]
const groupRows = [
  { id: 1, name: 'Alice Johnson', department: 'Engineering', role: 'Admin' },
  { id: 2, name: 'David Brown', department: 'Engineering', role: 'Editor' },
  { id: 3, name: 'Bob Smith', department: 'Design', role: 'Editor' },
  { id: 4, name: 'Carol White', department: 'Marketing', role: 'Viewer' },
  { id: 5, name: 'Grace Kim', department: 'Engineering', role: 'Editor' },
  { id: 6, name: 'Henry Davis', department: 'Design', role: 'Viewer' },
]

/* ── row-click demo ───────────────────────────────────────────────────── */
const lastClickedRow = ref<string | null>(null)

/* ── Server-side demo ─────────────────────────────────────────────────── */
const allUsers = Array.from({ length: 53 }, (_, i) => ({
  id: i + 1,
  name: ['Alice', 'Bob', 'Carol', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'][i % 10] + ' ' + ['Johnson', 'Smith', 'White', 'Brown', 'Martinez', 'Lee', 'Kim', 'Davis', 'Wilson', 'Moore'][i % 10],
  email: `user${i + 1}@example.com`,
  role: ['Admin', 'Editor', 'Viewer'][i % 3]!,
}))

const dtServerRows = ref<Record<string, any>[]>([])
const dtServerTotal = ref(0)
const dtServerPage = ref(1)
const dtServerLoading = ref(false)

function onDtFetch(params: DataTableFetchParams) {
  dtServerLoading.value = true
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
    dtServerTotal.value = filtered.length
    const start = (params.page - 1) * params.perPage
    dtServerRows.value = filtered.slice(start, start + params.perPage)
    dtServerPage.value = params.page
    dtServerLoading.value = false
  }, 500)
}
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MDataTable</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A feature-rich data table — everything MTable has, plus column resize/pin/toggle, row grouping, striped/dense
      density, sticky header, expandable rows, and CSV export.
    </p>

    <ComponentDemo
      title="Feature-Rich Data Table"
      description="Advanced table with sorting, searching, and pagination."
      :code="`<MDataTable
  :columns=&quot;columns&quot;
  :rows=&quot;rows&quot;
  :per-page=&quot;5&quot;
/>`"
      :script="`const columns = [
  { key: 'id', label: 'ID', sortable: true, width: 'w-16', pinned: 'left' },
  { key: 'name', label: 'Name', sortable: true, filterable: true, resizable: true },
  { key: 'email', label: 'Email', sortable: true, filterable: true, resizable: true },
  { key: 'role', label: 'Role', sortable: true, filterable: true },
  { key: 'status', label: 'Status', filterable: true },
]

const rows = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  // ... more rows
]`"
    >
      <div class="w-full">
        <MDataTable
          :columns="dataTableColumns"
          :rows="rows"
          :per-page="5"
        />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Striped & Dense"
      description="Alternate row colors and compact row height for data-heavy views."
      :code="`<template>
  <MDataTable
    :columns=&quot;columns&quot;
    :rows=&quot;rows&quot;
    :striped=&quot;true&quot;
    :dense=&quot;true&quot;
    :per-page=&quot;5&quot;
  />
</template>`"
      :script="`import { MDataTable } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="w-full">
        <MDataTable
          :columns="dataTableColumns"
          :rows="rows"
          :striped="true"
          :dense="true"
          :per-page="5"
        />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With Row Actions"
      description="Custom action buttons per row using the row-actions slot."
      :code="`<template>
  <MDataTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; :per-page=&quot;5&quot;>
    <template #row-actions=&quot;{ row }&quot;>
      <MIconButton icon=&quot;edit&quot; label=&quot;Edit&quot; size=&quot;small&quot; />
      <MIconButton icon=&quot;delete&quot; label=&quot;Delete&quot; size=&quot;small&quot; />
    </template>
  </MDataTable>
</template>`"
      :script="`import { MDataTable, MIconButton } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="w-full">
        <MDataTable :columns="dataTableColumns" :rows="rows" :per-page="5">
          <template #row-actions="{ row }">
            <MIconButton icon="edit" label="Edit" :size="32" />
            <MIconButton icon="delete" label="Delete" :size="32" />
          </template>
        </MDataTable>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Selectable Rows"
      description="Enable row selection with checkboxes using v-model."
      :code="`<MDataTable
    v-model=&quot;selected&quot;
    :columns=&quot;columns&quot;
    :rows=&quot;rows&quot;
    :selectable=&quot;true&quot;
    :per-page=&quot;5&quot;
  />
  <p>Selected: {{ selected.length }} rows</p>`"
      :script="`const selected = ref([])`"
    >
      <div class="w-full space-y-4">
        <MDataTable
          v-model="dataTableSelected"
          :columns="dataTableColumns"
          :rows="rows"
          :selectable="true"
          :per-page="5"
        />
        <p class="text-body-medium text-on-surface-variant">
          Selected: {{ dataTableSelected.length }} row(s)
          <span v-if="dataTableSelected.length > 0">
            — {{ dataTableSelected.map(r => r.name).join(', ') }}
          </span>
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Row Click"
      description="When selectable is false, clicking a row emits row-click instead of toggling selection."
      :code="`<MDataTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; :per-page=&quot;5&quot; @row-click=&quot;onRowClick&quot; />`"
      :script="`function onRowClick(row) {
  lastClickedRow.value = row.name
}`"
    >
      <div class="w-full space-y-3">
        <MDataTable :columns="dataTableColumns" :rows="rows" :per-page="5" @row-click="lastClickedRow = $event.name" />
        <p class="text-body-medium text-on-surface-variant">
          Last clicked: <strong v-if="lastClickedRow" class="text-on-surface">{{ lastClickedRow }}</strong>
          <span v-else class="text-outline">none yet</span>
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Expandable Rows"
      description="Click the arrow to expand a row and reveal extra detail. Use the expandable prop and #row-expand slot."
      :code="`<MDataTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; :expandable=&quot;true&quot; :per-page=&quot;5&quot;>
    <template #cell-status=&quot;{ value }&quot;>
      <MChip :tone=&quot;value === 'Active' ? 'success' : 'neutral'&quot;>{{ value }}</MChip>
    </template>
    <template #row-expand=&quot;{ row }&quot;>
      <div class=&quot;grid grid-cols-2 gap-4 text-body-medium&quot;>
        <div>
          <p class=&quot;text-label-medium text-on-surface-variant&quot;>Phone</p>
          <p>{{ row.phone }}</p>
        </div>
        <div>
          <p class=&quot;text-label-medium text-on-surface-variant&quot;>Department</p>
          <p>{{ row.department }}</p>
        </div>
        <div class=&quot;col-span-2&quot;>
          <p class=&quot;text-label-medium text-on-surface-variant&quot;>Bio</p>
          <p>{{ row.bio }}</p>
        </div>
      </div>
    </template>
  </MDataTable>`"
      :script="`const columns = [
  { key: 'id', label: 'ID', width: 'w-16' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
]`"
    >
      <div class="w-full">
        <MDataTable :columns="expandColumns" :rows="expandRows" :expandable="true" :per-page="5">
          <template #cell-status="{ value }">
            <MChip :tone="value === 'Active' ? 'success' : 'neutral'">{{ value }}</MChip>
          </template>
          <template #row-expand="{ row }">
            <div class="grid grid-cols-2 gap-x-8 gap-y-3 text-body-medium">
              <div>
                <p class="text-label-medium text-on-surface-variant">Phone</p>
                <p>{{ row.phone }}</p>
              </div>
              <div>
                <p class="text-label-medium text-on-surface-variant">Department</p>
                <p>{{ row.department }}</p>
              </div>
              <div>
                <p class="text-label-medium text-on-surface-variant">Joined</p>
                <p>{{ row.joined }}</p>
              </div>
              <div>
                <p class="text-label-medium text-on-surface-variant">Role</p>
                <MChip :tone="row.role === 'Admin' ? 'error' : row.role === 'Editor' ? 'primary' : 'neutral'" class="mt-1">{{ row.role }}</MChip>
              </div>
              <div class="col-span-2">
                <p class="text-label-medium text-on-surface-variant">Bio</p>
                <p class="text-on-surface-variant">{{ row.bio }}</p>
              </div>
            </div>
          </template>
        </MDataTable>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Grouped Rows"
      description="Set groupBy to a column key to bucket rows under group headers."
      :code="`<MDataTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; group-by=&quot;department&quot; :searchable=&quot;false&quot; />`"
      :script="`const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'department', label: 'Department' },
  { key: 'role', label: 'Role', sortable: true },
]`"
    >
      <div class="w-full">
        <MDataTable :columns="groupColumns" :rows="groupRows" group-by="department" :searchable="false" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Column Toggle & Export"
      description="columnToggle lets users hide/show columns from a menu; exportable adds a CSV download button reflecting the current filtered/sorted data."
      :code="`<MDataTable
  :columns=&quot;columns&quot;
  :rows=&quot;rows&quot;
  :column-toggle=&quot;true&quot;
  :exportable=&quot;true&quot;
  :per-page=&quot;5&quot;
/>`"
    >
      <div class="w-full">
        <MDataTable
          :columns="dataTableColumns"
          :rows="rows"
          :column-toggle="true"
          :exportable="true"
          :per-page="5"
        />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Server-Side (Remote Data)"
      description="Same server-side support as MTable — set serverSide to delegate search, sort, and pagination to your backend."
      :code="`<MDataTable
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
      :script="`import type { DataTableFetchParams } from '@m3ui-vue/m3ui-vue'

async function onFetch(params: DataTableFetchParams) {
  loading.value = true
  const res = await fetch(\`/api/users?page=\${params.page}&per_page=\${params.perPage}&search=\${params.search}&sort=\${params.sortKey}&order=\${params.sortDir}\`)
  const data = await res.json()
  rows.value = data.items
  total.value = data.total
  loading.value = false
}`"
    >
      <div class="w-full">
        <MDataTable
          :columns="[
            { key: 'id', label: 'ID', sortable: true, width: '80px' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            { key: 'role', label: 'Role', sortable: true },
          ]"
          :rows="dtServerRows"
          :loading="dtServerLoading"
          :server-side="true"
          :total="dtServerTotal"
          :page="dtServerPage"
          :per-page="5"
          @fetch="onDtFetch"
          @update:page="dtServerPage = $event"
        />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="dataTableProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="dataTableEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="dataTableSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="dataTableTypes" />

    <ComponentPager current="MDataTable" />
  </div>
</template>
