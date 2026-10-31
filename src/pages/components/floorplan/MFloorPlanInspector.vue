<script setup lang="ts">
import { ref } from 'vue'
import { MFloorPlan, MFloorPlanInspector, MFloorPlanToolbar, MSwitch, type FloorArea, type FloorDecor, type FloorTable, type FloorWall } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const plan = ref<InstanceType<typeof MFloorPlan>>()
const tables = ref<FloorTable[]>([
  { id: 1, label: '1', x: 220, y: 220, shape: 'round', seats: 4, data: { accessible: true } },
  { id: 2, label: '2', x: 420, y: 220, shape: 'square', seats: 4 },
  { id: 3, label: '3', x: 320, y: 420, shape: 'rect', seats: 6 },
])
const areas = ref<FloorArea[]>([{ id: 'z', label: 'Terrace', x: 100, y: 100, width: 460, height: 420, color: 'tertiary' }])
const walls = ref<FloorWall[]>([{ id: 'w', points: [[40, 40], [960, 40], [960, 560]] }])
const decor = ref<FloorDecor[]>([{ id: 'l', kind: 'label', x: 800, y: 300, label: 'Bar' }])

const props: PropDef[] = [
  { name: 'plan', type: 'MFloorPlan ref | FloorPlanContext', default: '—', description: "The plan, when the inspector isn't inside its #overlay slot" },
  { name: 'zoneColors', type: 'string[]', default: 'secondary, tertiary, primary, success, error', description: 'Colors offered for zones: M3 roles or CSS colors' },
  { name: 'merging', type: 'boolean', default: 'true', description: 'Merge (several tables) and split (a merged table) buttons' },
]
const slots: SlotDef[] = [
  { name: 'table', description: "Below a table's fields: { table, update } (update(patch) is an undo step)" },
  { name: 'tables', description: 'Below several picked tables: { ids }' },
  { name: 'area', description: "Below a zone's fields: { area, update }" },
  { name: 'wall', description: "Below a wall's fields: { wall, update }" },
  { name: 'decor', description: "Below a decor item's fields: { item, kind, update }" },
  { name: 'empty', description: 'When nothing is picked' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFloorPlanInspector</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Edits what's picked on an MFloorPlan: a table (name, seats, shape, angle; split its merge), several tables (merge
      them), a zone (name, color, size), a wall (thickness, a corner to delete) or decor (text, size, angle). A slot per
      kind adds fields of your own, with an <code>update</code> that goes into the plan's undo history.
    </p>

    <ComponentDemo
      title="A Field of Your Own"
      description="Pick a table: the #table slot adds a Wheelchair access switch, kept in table.data. Shift-click two tables to merge them."
      flush
      :code="`<MFloorPlanInspector :plan=&quot;plan&quot;>
  <template #table=&quot;{ table, update }&quot;>
    <MSwitch
      :model-value=&quot;!!table.data?.accessible&quot;
      label=&quot;Wheelchair access&quot;
      @update:model-value=&quot;update({ data: { ...table.data, accessible: $event } })&quot;
    />
  </template>
</MFloorPlanInspector>`"
    >
      <div class="flex flex-col gap-4 p-4 sm:p-6">
        <div class="flex min-w-0 flex-1 flex-col gap-3">
          <MFloorPlanToolbar :plan="plan" class="self-start" />
          <MFloorPlan ref="plan" v-model:tables="tables" v-model:areas="areas" v-model:walls="walls" v-model:decor="decor" editable :grid="20" />
        </div>
        <MFloorPlanInspector :plan="plan" class="rounded-xl bg-surface-container-low p-4">
          <template #table="{ table, update }">
            <MSwitch :model-value="!!table.data?.accessible" label="Wheelchair access" :icon="false" @update:model-value="update({ data: { ...table.data, accessible: $event } })" />
          </template>
        </MFloorPlanInspector>
      </div>
    </ComponentDemo>

    <h3 class="mt-6 mb-3 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <ComponentPager current="MFloorPlanInspector" />
  </div>
</template>
