<script setup lang="ts">
import { ref } from 'vue'
import { MDragDropList, MIcon } from '@m3ui-vue/m3ui-vue'
import type { DragDropItem } from '@m3ui-vue/m3ui-vue'
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

const dragDropProps: PropDef[] = [
  { name: 'modelValue', type: 'DragDropItem[]', description: 'Array of items with a unique id (v-model)' },
  { name: 'handle', type: 'boolean', default: 'false', description: 'Require a dedicated drag handle instead of making the whole item draggable' },
]

const dragDropEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'DragDropItem[]', description: 'Emitted with the reordered array — powers v-model' },
  { name: 'reorder', payload: '{ from: number, to: number, items: DragDropItem[] }', description: 'Emitted alongside update:modelValue with the source/destination indices' },
]

const dragDropSlots: SlotDef[] = [
  { name: 'default', scope: '{ item, index }', description: 'Content for each row — falls back to item.id if not provided' },
]

const dragDropTypes: TypeDef[] = [
  {
    name: 'DragDropItem',
    fields: [
      { name: 'id', type: 'string | number', required: true, description: 'Unique identifier used as the render key' },
      { name: '[key: string]', type: 'any', description: 'Any extra data your #default slot needs' },
    ],
  },
]

const dragItems = ref<DragDropItem[]>([
  { id: '1', label: 'First item' },
  { id: '2', label: 'Second item' },
  { id: '3', label: 'Third item' },
  { id: '4', label: 'Fourth item' },
  { id: '5', label: 'Fifth item' },
])

const handleItems = ref<DragDropItem[]>([
  { id: 'a', label: 'Drag me by the handle' },
  { id: 'b', label: 'Not by the whole row' },
  { id: 'c', label: 'Only the icon works' },
])

const lastReorder = ref<{ from: number; to: number } | null>(null)
function onReorder(e: { from: number; to: number; items: DragDropItem[] }) {
  lastReorder.value = { from: e.from, to: e.to }
}
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MDragDropList</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A reorderable list backed by native HTML5 drag-and-drop — v-model the array, render each row with the
      #default slot.
    </p>

    <ComponentDemo
      title="Drag & Drop List"
      description="Reorder items by dragging. Each item needs a unique id. The whole row is draggable by default."
      :code="`<template>
  <MDragDropList v-model=&quot;items&quot;>
    <template #item=&quot;{ item }&quot;>
      {{ item.label }}
    </template>
  </MDragDropList>
</template>`"
      :script="`const items = ref([
  { id: '1', label: 'First item' },
  { id: '2', label: 'Second item' },
  { id: '3', label: 'Third item' },
])`"
    >
      <div class="w-full max-w-sm">
        <MDragDropList v-model="dragItems">
          <template #default="{ item }">
            <div class="flex items-center gap-2">
              <MIcon name="drag_indicator" :size="20" class="text-on-surface-variant" />
              <span>{{ (item as any).label }}</span>
            </div>
          </template>
        </MDragDropList>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Drag Handle"
      description="With handle, only the explicitly marked handle element starts a drag — the rest of the row is inert."
      :code="`<template>
  <MDragDropList v-model=&quot;items&quot; :handle=&quot;true&quot;>
    <template #item=&quot;{ item }&quot;>
      {{ item.label }}
    </template>
  </MDragDropList>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MDragDropList v-model="handleItems" :handle="true">
          <template #default="{ item }">
            <span>{{ (item as any).label }}</span>
          </template>
        </MDragDropList>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Reorder Event"
      description="reorder fires alongside update:modelValue with the from/to indices, useful for persisting order to a backend."
      :code="`<template>
  <MDragDropList v-model=&quot;items&quot; @reorder=&quot;onReorder&quot; />
</template>`"
      :script="`function onReorder({ from, to, items }) {
  console.log(\`moved index \${from} to \${to}\`)
}`"
    >
      <div class="flex w-full max-w-sm flex-col gap-2">
        <MDragDropList v-model="dragItems" @reorder="onReorder">
          <template #default="{ item }">
            <span>{{ (item as any).label }}</span>
          </template>
        </MDragDropList>
        <p class="text-body-small text-on-surface-variant">
          Last reorder: <strong v-if="lastReorder" class="text-on-surface">{{ lastReorder.from }} → {{ lastReorder.to }}</strong>
          <span v-else class="text-outline">none yet</span>
        </p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="dragDropProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="dragDropEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="dragDropSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="dragDropTypes" />

    <ComponentPager current="MDragDropList" />
  </div>
</template>
