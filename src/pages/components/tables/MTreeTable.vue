<script setup lang="ts">
import { ref } from 'vue'
import { MTreeTable, MButton, MIcon } from '@m3ui-vue/m3ui-vue'
import type { TreeTableColumn, TreeTableRow } from '@m3ui-vue/m3ui-vue'
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

const treeTableProps: PropDef[] = [
  { name: 'columns', type: 'TreeTableColumn[]', description: 'Column definitions — see the type below' },
  { name: 'rows', type: 'TreeTableRow[]', description: 'Hierarchical rows with an optional children array — see the type below' },
  { name: 'rowKey', type: 'string', default: "'id'", description: 'Unique key field' },
  { name: 'defaultExpanded', type: 'boolean', default: 'false', description: 'Expand all nodes with children by default' },
  { name: 'indent', type: 'number', default: '24', description: 'Indentation per depth level, in px' },
  { name: 'dense', type: 'boolean', default: 'false', description: 'Compact row height' },
  { name: 'emptyText', type: 'string', description: "Text shown when rows is empty. Falls back to the app's configured locale's noResults string" },
]

const treeTableEvents: EventDef[] = [
  { name: 'row-click', payload: 'TreeTableRow', description: 'Emitted when any row is clicked (the expand-toggle button stops this from firing)' },
]

const treeTableSlots: SlotDef[] = [
  { name: 'toolbar', scope: '{ expandAll, collapseAll }', description: 'Toolbar content above the table, only rendered when this slot is used — gets expandAll()/collapseAll() helpers' },
  { name: 'cell-<key>', scope: '{ row, value, depth }', description: 'Custom cell renderer for the column with that key (the first column still gets the indent + expand toggle around it)' },
]

const treeTableTypes: TypeDef[] = [
  {
    name: 'TreeTableColumn',
    fields: [
      { name: 'key', type: 'string', required: true, description: 'Field name in each row object' },
      { name: 'label', type: 'string', required: true, description: 'Column header text' },
      { name: 'width', type: 'string', description: 'Column width (any valid CSS width)' },
      { name: 'align', type: "'left' | 'center' | 'right'", description: 'Text alignment for cells' },
    ],
  },
  {
    name: 'TreeTableRow',
    description: 'Any object shape, plus an optional children array of nested rows.',
    fields: [
      { name: 'children', type: 'TreeTableRow[]', description: 'Nested child rows — presence of a non-empty array makes the row expandable' },
    ],
  },
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

/* ── Toolbar (expandAll/collapseAll) + row-click demo ────────────────── */
const lastClickedNode = ref<string | null>(null)

/* ── Custom cell slot demo ───────────────────────────────────────────── */
const typeIcon: Record<string, string> = {
  folder: 'folder', vue: 'code', ts: 'code', json: 'data_object', md: 'description',
}
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTreeTable</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A hierarchical table for nested data like file systems or org charts — rows can carry a
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">children</code> array, and the first
      column renders the indent and expand/collapse toggle automatically.
    </p>

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

    <ComponentDemo
      title="Collapsed by Default, with Expand/Collapse All"
      description="Without defaultExpanded, folders start collapsed. The toolbar slot exposes expandAll/collapseAll helpers for a whole-tree toggle."
      :code="`<MTreeTable :columns=&quot;columns&quot; :rows=&quot;rows&quot;>
  <template #toolbar=&quot;{ expandAll, collapseAll }&quot;>
    <MButton variant=&quot;text&quot; size=&quot;sm&quot; @click=&quot;expandAll()&quot;>Expand all</MButton>
    <MButton variant=&quot;text&quot; size=&quot;sm&quot; @click=&quot;collapseAll()&quot;>Collapse all</MButton>
  </template>
</MTreeTable>`"
    >
      <div class="w-full">
        <MTreeTable :columns="treeTableColumns" :rows="treeTableRows">
          <template #toolbar="{ expandAll, collapseAll }">
            <MButton variant="text" size="sm" @click="expandAll()">Expand all</MButton>
            <MButton variant="text" size="sm" @click="collapseAll()">Collapse all</MButton>
          </template>
        </MTreeTable>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Cell & Row Click"
      description="Use cell-<key> to customize a column's rendering (icons here, keyed off the type column) and listen for row-click on any row."
      :code="`<MTreeTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; :default-expanded=&quot;true&quot; @row-click=&quot;onRowClick&quot;>
  <template #cell-type=&quot;{ value }&quot;>
    <span class=&quot;inline-flex items-center gap-1&quot;>
      <MIcon :name=&quot;typeIcon[value] ?? 'description'&quot; :size=&quot;16&quot; />
      {{ value }}
    </span>
  </template>
</MTreeTable>`"
      :script="`const typeIcon = {
  folder: 'folder', vue: 'code', ts: 'code', json: 'data_object', md: 'description',
}
function onRowClick(row) {
  lastClickedNode.value = row.name
}`"
    >
      <div class="w-full space-y-3">
        <MTreeTable :columns="treeTableColumns" :rows="treeTableRows" :default-expanded="true" @row-click="lastClickedNode = $event.name">
          <template #cell-type="{ value }">
            <span class="inline-flex items-center gap-1">
              <MIcon :name="typeIcon[value] ?? 'description'" :size="16" />
              {{ value }}
            </span>
          </template>
        </MTreeTable>
        <p class="text-body-medium text-on-surface-variant">
          Last clicked: <strong v-if="lastClickedNode" class="text-on-surface">{{ lastClickedNode }}</strong>
          <span v-else class="text-outline">none yet</span>
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Dense"
      description="Compact row height for data-heavy trees."
      :code="`<MTreeTable :columns=&quot;columns&quot; :rows=&quot;rows&quot; :default-expanded=&quot;true&quot; :dense=&quot;true&quot; />`"
    >
      <div class="w-full">
        <MTreeTable :columns="treeTableColumns" :rows="treeTableRows" :default-expanded="true" :dense="true" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="treeTableProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="treeTableEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="treeTableSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="treeTableTypes" />

    <ComponentPager current="MTreeTable" />
  </div>
</template>
