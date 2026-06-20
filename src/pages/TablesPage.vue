<script setup lang="ts">
import { ref } from 'vue'
import {
  MTable, MDataTable, MTreeTable, MVirtualTable, MButton, MIconButton, MChip, MIcon,
} from '@m3ui-vue/m3ui-vue'
import type { TreeTableColumn, TreeTableRow, VTableColumn, DataTableColumn, TableFetchParams, DataTableFetchParams } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'

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

const selectedRows = ref<Record<string, any>[]>([])
const dataTableSelected = ref<Record<string, any>[]>([])

/* ── Server-side demo ──────────────────────────────────────────────── */
const allUsers = Array.from({ length: 53 }, (_, i) => ({
  id: i + 1,
  name: ['Alice', 'Bob', 'Carol', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'][i % 10] + ' ' + ['Johnson', 'Smith', 'White', 'Brown', 'Martinez', 'Lee', 'Kim', 'Davis', 'Wilson', 'Moore'][i % 10],
  email: `user${i + 1}@example.com`,
  role: ['Admin', 'Editor', 'Viewer'][i % 3]!,
}))

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

const dataTableColumns = [
  { key: 'id', label: 'ID', sortable: true, width: 'w-16', pinned: 'left' },
  { key: 'name', label: 'Name', sortable: true, filterable: true, resizable: true },
  { key: 'email', label: 'Email', sortable: true, filterable: true, resizable: true },
  { key: 'role', label: 'Role', sortable: true, filterable: true },
  { key: 'status', label: 'Status', filterable: true },
] satisfies DataTableColumn[]

const tableProps: PropDef[] = [
  { name: 'columns', type: 'TableColumn[]', description: 'Column definitions: { key, label, sortable?, width?, align? }' },
  { name: 'rows', type: 'Record<string, any>[]', description: 'Table data rows' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show skeleton loading state' },
  { name: 'emptyText', type: 'string', default: "'Sin resultados'", description: 'Text when no rows' },
  { name: 'rowKey', type: 'string', default: "'id'", description: 'Unique key field in each row' },
  { name: 'selectable', type: 'boolean', default: 'false', description: 'Enable row selection with checkboxes' },
  { name: 'modelValue', type: 'Record<string, any>[]', default: '[]', description: 'Selected rows (v-model)' },
  { name: 'perPage', type: 'number', default: '10', description: 'Rows per page' },
  { name: 'searchable', type: 'boolean', default: 'true', description: 'Show search input' },
  { name: 'serverSide', type: 'boolean', default: 'false', description: 'Emit fetch instead of local filtering' },
  { name: 'total', type: 'number', default: '0', description: 'Total rows (for server-side pagination)' },
  { name: 'page', type: 'number', default: '1', description: 'Current page' },
]

const fetchParamsFields: PropDef[] = [
  { name: 'page', type: 'number', description: 'Current page number' },
  { name: 'perPage', type: 'number', description: 'Rows per page' },
  { name: 'search', type: 'string', description: 'Current search query (empty string if none)' },
  { name: 'sortKey', type: 'string', description: 'Column key being sorted (empty string if none)' },
  { name: 'sortDir', type: "'asc' | 'desc' | ''", description: 'Sort direction (empty string if no sort active)' },
]

const dataTableProps: PropDef[] = [
  { name: 'columns', type: 'DataTableColumn[]', description: 'Column definitions: { key, label, sortable?, filterable?, resizable?, width?, minWidth?, align?, pinned?, hidden? }' },
  { name: 'rows', type: 'Record<string, any>[]', description: 'Table data rows' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show skeleton loading state' },
  { name: 'emptyText', type: 'string', default: "'Sin resultados'", description: 'Text when no rows' },
  { name: 'rowKey', type: 'string', default: "'id'", description: 'Unique key field in each row' },
  { name: 'selectable', type: 'boolean', default: 'false', description: 'Enable row selection' },
  { name: 'modelValue', type: 'Record<string, any>[]', default: '[]', description: 'Selected rows (v-model)' },
  { name: 'perPage', type: 'number', default: '10', description: 'Rows per page' },
  { name: 'searchable', type: 'boolean', default: 'true', description: 'Show search input' },
  { name: 'expandable', type: 'boolean', default: 'false', description: 'Enable row expansion' },
  { name: 'striped', type: 'boolean', default: 'false', description: 'Alternate row colors' },
  { name: 'dense', type: 'boolean', default: 'false', description: 'Compact row height' },
  { name: 'stickyHeader', type: 'boolean', default: 'false', description: 'Sticky table header' },
  { name: 'groupBy', type: 'string', description: 'Group rows by this column key' },
  { name: 'columnToggle', type: 'boolean', default: 'false', description: 'Allow hiding/showing columns' },
  { name: 'exportable', type: 'boolean', default: 'false', description: 'Show export button' },
  { name: 'serverSide', type: 'boolean', default: 'false', description: 'Emit fetch instead of local filtering' },
  { name: 'total', type: 'number', default: '0', description: 'Total rows (for server-side pagination)' },
  { name: 'page', type: 'number', default: '1', description: 'Current page (v-model via update:page)' },
]

/* ── MDataTable Server-side demo ────────────────────────────────────── */
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

const treeTableColumns: TreeTableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type', width: 'w-24' },
  { key: 'size', label: 'Size', width: 'w-24', align: 'right' },
]

const treeTableRows: TreeTableRow[] = [
  {
    id: 'src', name: 'src', type: 'folder', size: '—',
    children: [
      {
        id: 'components', name: 'components', type: 'folder', size: '—',
        children: [
          { id: 'btn', name: 'MButton.vue', type: 'vue', size: '4.2 KB' },
          { id: 'card', name: 'MCard.vue', type: 'vue', size: '2.1 KB' },
          { id: 'dialog', name: 'MDialog.vue', type: 'vue', size: '3.8 KB' },
        ],
      },
      { id: 'index', name: 'index.ts', type: 'ts', size: '1.5 KB' },
    ],
  },
  { id: 'pkg', name: 'package.json', type: 'json', size: '0.8 KB' },
  { id: 'readme', name: 'README.md', type: 'md', size: '2.3 KB' },
]

const treeTableProps: PropDef[] = [
  { name: 'columns', type: 'TreeTableColumn[]', description: 'Column definitions: { key, label, width?, align? }' },
  { name: 'rows', type: 'TreeTableRow[]', description: 'Hierarchical rows with optional children' },
  { name: 'rowKey', type: 'string', default: "'id'", description: 'Unique key field' },
  { name: 'defaultExpanded', type: 'boolean', default: 'false', description: 'Expand all nodes by default' },
  { name: 'indent', type: 'number', default: '24', description: 'Indentation per level in px' },
  { name: 'dense', type: 'boolean', default: 'false', description: 'Compact row height' },
]

const virtualColumns: VTableColumn[] = [
  { key: 'id', label: 'ID', width: '80px', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'department', label: 'Department' },
]

const virtualRows = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  department: ['Engineering', 'Design', 'Marketing', 'Sales'][i % 4],
}))

const virtualTableProps: PropDef[] = [
  { name: 'columns', type: 'VTableColumn[]', description: 'Column definitions: { key, label, width?, align?, sortable? }' },
  { name: 'rows', type: 'Record<string, any>[]', description: 'All rows (virtualized rendering)' },
  { name: 'rowHeight', type: 'number', default: '44', description: 'Row height in px' },
  { name: 'rowKey', type: 'string', default: "'id'", description: 'Unique key field' },
  { name: 'overscan', type: 'number', default: '5', description: 'Extra rows rendered above/below viewport' },
  { name: 'maxHeight', type: 'string', default: "'500px'", description: 'Scrollable container height' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Tables</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Components for displaying tabular data with sorting, searching, and pagination.
    </p>

    <!-- ── MTable ──────────────────────────────────────────────────────── -->
    <h2 class="mb-4 text-headline-small font-medium">MTable</h2>

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

    <h3 class="mb-3 mt-6 text-title-large font-medium">TableFetchParams</h3>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      Object emitted by the <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">@fetch</code> event when <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">serverSide</code> is enabled.
    </p>
    <PropsTable :props="fetchParamsFields" />

    <!-- ── MDataTable ──────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MDataTable</h2>

    <ComponentDemo
      title="Feature-Rich Data Table"
      description="Advanced table with sorting, searching, and pagination."
      :code="`<MDataTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; :per-page=&quot;5&quot; />`"
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

    <!-- ── MTreeTable ──────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MTreeTable</h2>

    <ComponentDemo
      title="Tree Table"
      description="Hierarchical table with expandable rows for nested data like file systems."
      :code="`<MTreeTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; :default-expanded=&quot;true&quot; />`"
      :script="`const columns = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type', width: 'w-24' },
  { key: 'size', label: 'Size', width: 'w-24', align: 'right' },
]
const rows = [
  {
    id: 'src', name: 'src', type: 'folder', size: '—',
    children: [
      { id: 'btn', name: 'MButton.vue', type: 'vue', size: '4.2 KB' },
      { id: 'card', name: 'MCard.vue', type: 'vue', size: '2.1 KB' },
    ],
  },
  { id: 'pkg', name: 'package.json', type: 'json', size: '0.8 KB' },
]`"
    >
      <div class="w-full">
        <MTreeTable :columns="treeTableColumns" :rows="treeTableRows" :default-expanded="true" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="treeTableProps" />

    <!-- ── MVirtualTable ───────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MVirtualTable</h2>

    <ComponentDemo
      title="Virtual Table"
      description="Renders only visible rows for high-performance display of large datasets. This demo has 1,000 rows."
      :code="`<MVirtualTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; max-height=&quot;400px&quot; />`"
      :script="`const columns = [
  { key: 'id', label: 'ID', width: '80px', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'department', label: 'Department' },
]
const rows = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: \`User \${i + 1}\`,
  email: \`user\${i + 1}@example.com\`,
  department: ['Engineering', 'Design', 'Marketing', 'Sales'][i % 4],
}))`"
    >
      <div class="w-full">
        <MVirtualTable :columns="virtualColumns" :rows="virtualRows" max-height="400px" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="virtualTableProps" />
  </div>
</template>
