<script setup lang="ts">
import { ref } from 'vue'
import { MFloorPlan, type FloorTable } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import FloorStats from '@/components/demos/FloorStats.vue'

const tables = ref<FloorTable[]>([
  { id: 1, label: '1', x: 300, y: 300, shape: 'round', seats: 4 },
  { id: 2, label: '2', x: 520, y: 300, shape: 'rect', seats: 6 },
])

const api: PropDef[] = [
  { name: 'tables / areas / walls / decor / merges', type: 'Ref', description: "The plan's v-models (writing them is not an undo step; use update)" },
  { name: 'selection / picked / tool', type: 'Ref', description: 'Selected tables, the picked zone / wall / decor, the editing tool' },
  { name: 'editable / kinds / statuses / size', type: 'ComputedRef', description: 'Whether it edits, the decor kinds (built-in + yours), the statuses, its size in plan units' },
  { name: 'addTable(t?) / addDecor(kind, d?)', type: 'function', description: "Add one (at the plan's middle unless placed), selected or picked" },
  { name: "update(kind, id, patch)", type: 'function', description: "Change a table, area, wall or decor item: an undo step (quick consecutive changes to the same thing are one)" },
  { name: 'removeSelected() / removeTables(ids) / duplicate()', type: 'function', description: 'Delete and Ctrl+D' },
  { name: 'merge(ids?, label?) / split(idOrTable)', type: 'function', description: 'Join tables (canMerge may refuse) and split them' },
  { name: 'undo() / redo() / canUndo / canRedo', type: 'function / ComputedRef', description: 'History' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useFloorPlan</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The enclosing MFloorPlan's state and actions, from a component in its <code>#overlay</code> slot. Outside it, the
      plan's template ref has the same as <code>plan.context</code> (that's how MFloorPlanToolbar and MFloorPlanInspector
      work anywhere). Every change made through it is a step of the plan's undo history.
    </p>

    <ComponentDemo
      title="A Strip of Your Own"
      description="Counts tables and seats, and adds a two-top through the plan (then undo takes it back)."
      flush
      :code="`<MFloorPlan v-model:tables=&quot;tables&quot; editable>
  <template #overlay><FloorStats /></template>
</MFloorPlan>`"
      :script="`// FloorStats.vue
import { computed } from 'vue'
import { useFloorPlan } from '@m3ui-vue/m3ui-vue'

const plan = useFloorPlan()
const seats = computed(() => plan.tables.value.reduce((a, t) => a + (t.seats ?? 0), 0))
// plan.addTable({ shape: 'round', seats: 2 }), plan.undo(), plan.merge(ids)…`"
    >
      <div class="p-4 sm:p-6">
        <MFloorPlan v-model:tables="tables" editable :grid="20">
          <template #overlay><FloorStats /></template>
        </MFloorPlan>
      </div>
    </ComponentDemo>

    <h3 class="mt-6 mb-3 text-title-large font-medium">Returns</h3>
    <PropsTable :props="api" />

    <ComponentPager current="useFloorPlan" />
  </div>
</template>
