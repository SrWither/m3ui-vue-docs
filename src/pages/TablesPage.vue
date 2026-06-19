<script setup lang="ts">
import { ref } from 'vue'
import {
  MTable, MDataTable, MTreeTable, MVirtualTable, MButton, MIconButton, MChip, MIcon,
} from '@m3ui-vue/m3ui-vue'
import type { TreeTableColumn, TreeTableRow, VTableColumn, DataTableColumn } from '@m3ui-vue/m3ui-vue'
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
]

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
      :code="`<script setup>
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
]
<\/script>

<template>
  <MTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; />
</template>`"
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="tableProps" />

    <!-- ── MDataTable ──────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MDataTable</h2>

    <ComponentDemo
      title="Feature-Rich Data Table"
      description="Advanced table with sorting, searching, and pagination."
      :code="`<script setup>
const columns = [
  { key: 'id', label: 'ID', sortable: true, width: 'w-16', pinned: 'left' },
  { key: 'name', label: 'Name', sortable: true, filterable: true, resizable: true },
  { key: 'email', label: 'Email', sortable: true, filterable: true, resizable: true },
  { key: 'role', label: 'Role', sortable: true, filterable: true },
  { key: 'status', label: 'Status', filterable: true },
]

const rows = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  // ... more rows
]
<\/script>

<template>
  <MDataTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; :per-page=&quot;5&quot; />
</template>`"
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
      :code="`<script setup>
const selected = ref([])
<\/script>

<template>
  <MDataTable
    v-model=&quot;selected&quot;
    :columns=&quot;columns&quot;
    :rows=&quot;rows&quot;
    :selectable=&quot;true&quot;
    :per-page=&quot;5&quot;
  />
  <p>Selected: {{ selected.length }} rows</p>
</template>`"
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
      :code="`<script setup>
const columns = [
  { key: 'id', label: 'ID', width: 'w-16' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
]
<\/script>

<template>
  <MDataTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; :expandable=&quot;true&quot; :per-page=&quot;5&quot;>
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
  </MDataTable>
</template>`"
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="dataTableProps" />

    <!-- ── MTreeTable ──────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MTreeTable</h2>

    <ComponentDemo
      title="Tree Table"
      description="Hierarchical table with expandable rows for nested data like file systems."
      :code="`<script setup>
const columns = [
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
]
<\/script>

<template>
  <MTreeTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; :default-expanded=&quot;true&quot; />
</template>`"
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
      :code="`<script setup>
const columns = [
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
}))
<\/script>

<template>
  <MVirtualTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; max-height=&quot;400px&quot; />
</template>`"
    >
      <div class="w-full">
        <MVirtualTable :columns="virtualColumns" :rows="virtualRows" max-height="400px" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="virtualTableProps" />
  </div>
</template>
