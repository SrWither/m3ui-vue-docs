<script setup lang="ts">
import { ref } from 'vue'
import { MFloorPlan, MFloorPlanToolbar, MIconButton, MTooltip, type FloorArea, type FloorDecor, type FloorTable, type FloorWall } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const plan = ref<InstanceType<typeof MFloorPlan>>()
const tables = ref<FloorTable[]>([
  { id: 1, label: '1', x: 200, y: 200, shape: 'round', seats: 4 },
  { id: 2, label: '2', x: 420, y: 200, shape: 'square', seats: 4 },
])
const areas = ref<FloorArea[]>([{ id: 'z', label: 'Hall', x: 80, y: 80, width: 500, height: 300 }])
const walls = ref<FloorWall[]>([{ id: 'w', points: [[40, 40], [960, 40], [960, 560]] }])
const decor = ref<FloorDecor[]>([{ id: 'p', kind: 'plant', x: 700, y: 400 }])

const props: PropDef[] = [
  { name: 'plan', type: 'MFloorPlan ref | FloorPlanContext', default: '—', description: "The plan, when the toolbar isn't inside its #overlay slot" },
  { name: 'tables', type: 'FloorTablePreset[]', default: 'round 2, round 4, square 4, long 6', description: 'What Add a table offers: { name?, shape, seats, width, height… }' },
  { name: 'decor', type: 'string[]', default: 'every kind', description: 'Decor kinds offered (yours from decorKinds included)' },
  { name: 'tools', type: 'boolean', default: 'true', description: 'Move / wall / zone' },
  { name: 'history', type: 'boolean', default: 'true', description: 'Undo and redo' },
]
const slots: SlotDef[] = [
  { name: 'default', description: 'Controls of yours at the start' },
  { name: 'end', description: 'Controls of yours at the end' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFloorPlanToolbar</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The toolbar to arrange an MFloorPlan: move, draw a wall, drag out a zone, add a table from your presets or decor
      of any kind, duplicate, delete, undo and redo. Give it the plan's template ref, or put it in the plan's
      <code>#overlay</code> slot. A toolbar of your own is a few lines with <code>useFloorPlan()</code>.
    </p>

    <ComponentDemo
      title="Presets of Your Own"
      description="A stool and a booth next to the usual tables, only some decor, and a Fit button of your own in the end slot."
      flush
      :code="`<MFloorPlanToolbar
  :plan=&quot;plan&quot;
  :tables=&quot;[
    { shape: 'round', seats: 4 },
    { name: 'Stool', shape: 'round', seats: 1, width: 40 },
    { name: 'Booth', shape: 'rect', seats: 4, width: 140, height: 70 },
  ]&quot;
  :decor=&quot;['door', 'window', 'plant', 'label']&quot;
/>
<MFloorPlan ref=&quot;plan&quot; v-model:tables=&quot;tables&quot; v-model:areas=&quot;areas&quot; v-model:walls=&quot;walls&quot; v-model:decor=&quot;decor&quot; editable />`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <MFloorPlanToolbar
          :plan="plan"
          :tables="[{ shape: 'round', seats: 4 }, { name: 'Stool', shape: 'round', seats: 1, width: 40 }, { name: 'Booth', shape: 'rect', seats: 4, width: 140, height: 70 }]"
          :decor="['door', 'window', 'plant', 'label']"
          class="self-start"
        >
          <template #end>
            <MTooltip text="Clear the selection" placement="top"><MIconButton icon="deselect" label="Clear the selection" @click="plan && (plan.context.selection.value = [], plan.context.picked.value = null)" /></MTooltip>
          </template>
        </MFloorPlanToolbar>
        <MFloorPlan ref="plan" v-model:tables="tables" v-model:areas="areas" v-model:walls="walls" v-model:decor="decor" editable :grid="20" />
      </div>
    </ComponentDemo>

    <h3 class="mt-6 mb-3 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <ComponentPager current="MFloorPlanToolbar" />
  </div>
</template>
