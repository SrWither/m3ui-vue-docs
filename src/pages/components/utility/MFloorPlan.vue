<script setup lang="ts">
import { computed, ref } from 'vue'
import { MChip, MSwitch, useToast } from '@m3ui-vue/m3ui-vue'
import { MFloorPlan, type FloorMerge, type FloorStatus, type FloorTable } from '@m3ui-vue/m3ui-vue'
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

const toast = useToast()
const tables = ref<FloorTable[]>([
  { id: 1, label: '1', x: 120, y: 110, shape: 'round', seats: 4, status: 'occupied', badge: '35′' },
  { id: 2, label: '2', x: 300, y: 110, shape: 'round', seats: 4 },
  { id: 3, label: '3', x: 480, y: 110, shape: 'round', seats: 2, status: 'reserved' },
  { id: 4, label: '4', x: 140, y: 320, shape: 'rect', seats: 6, status: 'bill', badge: '$84' },
  { id: 5, label: '5', x: 380, y: 320, shape: 'square', seats: 4 },
  { id: 6, label: '6', x: 500, y: 320, shape: 'square', seats: 4, status: 'occupied', badge: '12′' },
  { id: 7, label: 'Bar', x: 800, y: 300, shape: 'rect', width: 260, height: 60, seats: 0 },
  { id: 8, label: '8', x: 760, y: 110, shape: 'square', seats: 2 },
  { id: 9, label: '9', x: 880, y: 110, shape: 'square', seats: 2, status: 'free' },
])
const merges = ref<FloorMerge[]>([{ id: 'm1', tables: [5, 6], label: '5 + 6' }])
const statuses: Record<string, FloorStatus> = {
  free: { label: 'Free', color: 'surface' },
  occupied: { label: 'Seated', color: 'primary', icon: 'restaurant' },
  bill: { label: 'Bill requested', color: 'tertiary', icon: 'receipt_long' },
  reserved: { label: 'Reserved', color: 'secondary', icon: 'event' },
}
const order = ['free', 'occupied', 'bill', 'reserved']
// Service: a tap moves a table to its next status
function open(t: FloorTable) {
  const next = order[(order.indexOf(t.status ?? 'free') + 1) % order.length]!
  tables.value = tables.value.map((x) => (x.id === t.id ? { ...x, status: next, badge: next === 'free' ? undefined : x.badge } : x))
}
const counts = computed(() => order.map((s) => ({ s, n: tables.value.filter((t) => (t.status ?? 'free') === s && t.seats).length })))

// Editing
const layout = ref<FloorTable[]>(tables.value.map(({ status: _, badge: __, ...t }) => t))
const selection = ref<(string | number)[]>([])
const grid = ref(true)

const props: PropDef[] = [
  { name: 'v-model:tables', type: 'FloorTable[]', default: '[]', description: 'The tables, in plan units' },
  { name: 'v-model:merges', type: 'FloorMerge[]', default: '[]', description: 'Tables joined together, drawn as one group with an outline and its label' },
  { name: 'v-model:selection', type: '(string | number)[]', default: '[]', description: 'Selected tables while editing (Shift or Ctrl adds)' },
  { name: 'statuses', type: 'Record<string, FloorStatus>', default: 'free, occupied, bill, reserved', description: 'Your statuses: a color (an M3 role like primary or tertiary, or any CSS color), an icon, a name' },
  { name: 'editable', type: 'boolean', default: 'false', description: 'Drag tables (several when selected) and nudge them with the arrows (Shift: 5 steps); otherwise a click opens one' },
  { name: 'width / height', type: 'number', default: '1000 / 600', description: "The plan's size in plan units; it scales to the component's width" },
  { name: 'grid', type: 'number', default: '10', description: 'Snapping step in plan units (0: none)' },
  { name: 'showGrid', type: 'boolean', default: 'true', description: 'Dots on the grid while editing' },
  { name: 'chairs', type: 'boolean', default: 'true', description: 'Draw chairs from seats' },
  { name: 'label', type: 'string', default: 'locale', description: 'Accessible name' },
]
const events: EventDef[] = [
  { name: 'table-click', payload: 'FloorTable, MouseEvent | KeyboardEvent', description: 'A table clicked or opened with Enter (not after a drag)' },
  { name: 'move', payload: '{ id, x, y }[]', description: 'Tables moved by a drag or the arrows: save their positions' },
]
const slots: SlotDef[] = [{ name: 'table', description: 'The inside of a table: { table, status, selected }' }]
const types: TypeDef[] = [
  { name: 'FloorTable', fields: [
    { name: 'id / label / x / y', type: 'string | number / string / number', required: true, description: 'x and y are its center, in plan units' },
    { name: 'shape', type: "'round' | 'square' | 'rect'", description: 'Default square' },
    { name: 'seats', type: 'number', description: 'Chairs drawn around it; also sizes it when width and height are absent' },
    { name: 'width / height / rotation', type: 'number', description: 'Its own size, and degrees' },
    { name: 'status / badge / data', type: 'string / string | number / object', description: 'A key of statuses, a small badge (minutes, the total), anything of yours' },
  ] },
  { name: 'FloorMerge', fields: [{ name: 'id / tables / label', type: 'string | number / ids / string', required: true, description: 'The tables joined' }] },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFloorPlan</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A floor plan of tables, for a restaurant, a bar or an event: arrange them, then run service with each table
      colored by its status (yours, by prop), a badge, chairs from its seats, and merged tables drawn as one group. The
      plan is in its own units and scales to its width, so it fits a phone and a wall screen. Not an M3 spec component.
    </p>

    <ComponentDemo
      title="Service"
      description="Tap a table to move it to the next status. Tables 5 and 6 are merged."
      flush
      :code="`<MFloorPlan v-model:tables=&quot;tables&quot; :merges=&quot;merges&quot; :statuses=&quot;statuses&quot; @table-click=&quot;open&quot; />

const statuses = {
  free: { label: 'Free', color: 'surface' },
  occupied: { label: 'Seated', color: 'primary', icon: 'restaurant' },
  bill: { label: 'Bill requested', color: 'tertiary', icon: 'receipt_long' },
  reserved: { label: 'Reserved', color: 'secondary', icon: 'event' },
}`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <div class="flex flex-wrap gap-2">
          <MChip v-for="c in counts" :key="c.s" :icon="statuses[c.s]!.icon ?? 'table_restaurant'">{{ statuses[c.s]!.label }} · {{ c.n }}</MChip>
        </div>
        <MFloorPlan v-model:tables="tables" :merges="merges" :statuses="statuses" @table-click="open" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Arranging the Room"
      description="editable: drag a table (or several: Shift-click to select them), nudge it with the arrows; move fires with the new positions to save."
      flush
      :code="`<MFloorPlan v-model:tables=&quot;tables&quot; v-model:selection=&quot;selection&quot; editable :grid=&quot;20&quot; @move=&quot;save&quot; />`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <MSwitch v-model="grid" label="Snap to a 20-unit grid" :icon="false" />
        <MFloorPlan v-model:tables="layout" v-model:selection="selection" editable :grid="grid ? 20 : 0" @move="toast.info(`Moved ${$event.map((m) => `#${m.id}`).join(', ')}`)" />
      </div>
    </ComponentDemo>

    <h3 class="mt-6 mb-3 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Types</h3>
    <TypesTable :types="types" />

    <ComponentPager current="MFloorPlan" />
  </div>
</template>
