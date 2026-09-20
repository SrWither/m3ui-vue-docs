<script setup lang="ts">
import { ref } from 'vue'
import { MVirtualTable, MChip } from '@m3ui-vue/m3ui-vue'
import type { VTableColumn } from '@m3ui-vue/m3ui-vue'
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

const virtualTableProps: PropDef[] = [
  { name: 'columns', type: 'VTableColumn[]', description: 'Column definitions — see the type below' },
  { name: 'rows', type: 'Record<string, any>[]', description: 'All rows — the full array is held in memory, only visible rows are rendered to the DOM' },
  { name: 'rowHeight', type: 'number', default: '44', description: 'Fixed row height in px, used for the virtualization math' },
  { name: 'rowKey', type: 'string', default: "'id'", description: 'Unique key field' },
  { name: 'overscan', type: 'number', default: '5', description: 'Extra rows rendered above/below the visible viewport, to reduce blank flashes on fast scroll' },
  { name: 'maxHeight', type: 'string', default: "'500px'", description: 'Scrollable container height (any valid CSS height)' },
]

const virtualTableEvents: EventDef[] = [
  { name: 'row-click', payload: 'Record<string, any>', description: 'Emitted when a row is clicked' },
]

const virtualTableSlots: SlotDef[] = [
  { name: 'cell-<key>', scope: '{ row, value }', description: 'Custom cell renderer for the column with that key' },
]

const virtualTableTypes: TypeDef[] = [
  {
    name: 'VTableColumn',
    fields: [
      { name: 'key', type: 'string', required: true, description: 'Field name in each row object' },
      { name: 'label', type: 'string', required: true, description: 'Column header text' },
      { name: 'width', type: 'string', description: 'Column width (any valid CSS width) — unset columns share remaining space equally' },
      { name: 'align', type: "'left' | 'center' | 'right'", description: 'Text alignment for header and cells' },
      { name: 'sortable', type: 'boolean', description: 'Allow sorting by this column (client-side, sorts the full row set)' },
    ],
  },
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

/* ── row-click demo ──────────────────────────────────────────────────── */
const lastClickedUser = ref<string | null>(null)

/* ── custom cell slot demo ───────────────────────────────────────────── */
const deptTone: Record<string, 'primary' | 'secondary' | 'success' | 'neutral'> = {
  Engineering: 'primary', Design: 'secondary', Marketing: 'success', Sales: 'neutral',
}

/* ── row height / compact demo ───────────────────────────────────────── */
const compactColumns: VTableColumn[] = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'name', label: 'Name' },
  { key: 'department', label: 'Department' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MVirtualTable</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Renders only the rows currently in (or near) the viewport, so a table with thousands of rows stays smooth —
      no pagination needed. Trade-off: no built-in search/filtering, sort is a client-side full-array sort.
    </p>

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

    <ComponentDemo
      title="Sortable Columns"
      description="Click a sortable column header to sort the full 1,000-row array client-side."
      :code="`<MVirtualTable
  :columns=&quot;[{ key: 'name', label: 'Name', sortable: true }, { key: 'department', label: 'Department', sortable: true }]&quot;
  :rows=&quot;rows&quot;
  max-height=&quot;300px&quot;
/>`"
    >
      <div class="w-full">
        <MVirtualTable
          :columns="[
            { key: 'name', label: 'Name', sortable: true },
            { key: 'department', label: 'Department', sortable: true },
          ]"
          :rows="virtualRows"
          max-height="300px"
        />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Cell & Row Click"
      description="Use cell-<key> to render a column's value as something richer (chips here), and listen for row-click."
      :code="`<MVirtualTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; max-height=&quot;300px&quot; @row-click=&quot;onRowClick&quot;>
  <template #cell-department=&quot;{ value }&quot;>
    <MChip :tone=&quot;deptTone[value]&quot;>{{ value }}</MChip>
  </template>
</MVirtualTable>`"
      :script="`const deptTone = {
  Engineering: 'primary', Design: 'secondary', Marketing: 'success', Sales: 'neutral',
}
function onRowClick(row) {
  lastClickedUser.value = row.name
}`"
    >
      <div class="w-full space-y-3">
        <MVirtualTable :columns="virtualColumns" :rows="virtualRows" max-height="300px" @row-click="lastClickedUser = $event.name">
          <template #cell-department="{ value }">
            <MChip :tone="deptTone[value]">{{ value }}</MChip>
          </template>
        </MVirtualTable>
        <p class="text-body-medium text-on-surface-variant">
          Last clicked: <strong v-if="lastClickedUser" class="text-on-surface">{{ lastClickedUser }}</strong>
          <span v-else class="text-outline">none yet</span>
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Row Height & Overscan"
      description="Tune rowHeight to match custom cell content, and overscan to render extra rows beyond the viewport (helps avoid blank flashes on fast scrolling)."
      :code="`<MVirtualTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; :row-height=&quot;32&quot; :overscan=&quot;10&quot; max-height=&quot;260px&quot; />`"
    >
      <div class="w-full">
        <MVirtualTable :columns="compactColumns" :rows="virtualRows" :row-height="32" :overscan="10" max-height="260px" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="virtualTableProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="virtualTableEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="virtualTableSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="virtualTableTypes" />

    <ComponentPager current="MVirtualTable" />
  </div>
</template>
