<script setup lang="ts">
import { ref } from 'vue'
import { MIconButton } from '@m3ui-vue/m3ui-vue'
import { MGantt, MGanttControls, type GanttTask } from '@m3ui-vue/m3ui-vue/gantt'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import { launchPlan } from '@/components/demos/ganttSamples'

const tasks = ref<GanttTask[]>(launchPlan())
const gantt = ref<InstanceType<typeof MGantt>>()
let n = 0
function add() {
  const last = tasks.value.at(-1)!
  gantt.value?.addTasks({ id: `n${++n}`, name: `New task ${n}`, start: last.end ?? last.start, end: last.end ?? last.start })
}

const props: PropDef[] = [
  { name: 'scales', type: 'GanttScale[]', default: "['day', 'week', 'month', 'quarter']", description: 'The scales offered as a segmented button; [] hides it' },
  { name: 'zoom', type: 'boolean', default: 'true', description: 'Zoom out and in buttons' },
  { name: 'today', type: 'boolean', default: 'true', description: 'Scroll to today' },
  { name: 'fold', type: 'boolean', default: 'true', description: 'Expand all / collapse all, when anything folds' },
  { name: 'history', type: 'boolean', default: 'true', description: 'Undo and redo (not when readonly)' },
]
const slots: SlotDef[] = [
  { name: 'default', description: 'Controls of yours at the start' },
  { name: 'end', description: 'Controls of yours at the end' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MGanttControls</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A toolbar for an MGantt or an MResourceTimeline: the zoom as named scales, zoom in and out, today, fold and
      unfold, undo and redo. Put it in their default slot. From <code>/gantt</code>.
    </p>

    <ComponentDemo
      title="With Controls of Your Own"
      description="The end slot holds an Add button calling the chart's addTasks()."
      flush
      :code="`<MGantt ref=&quot;gantt&quot; v-model:tasks=&quot;tasks&quot;>
  <MGanttControls :scales=&quot;['week', 'month']&quot;>
    <template #end>
      <MIconButton icon=&quot;add&quot; label=&quot;Add a task&quot; variant=&quot;filled&quot; @click=&quot;add&quot; />
    </template>
  </MGanttControls>
</MGantt>`"
    >
      <div class="p-4 sm:p-6">
        <MGantt ref="gantt" v-model:tasks="tasks" scale="week" class="h-[380px] border border-outline-variant">
          <MGanttControls :scales="['week', 'month']">
            <template #end>
              <MIconButton icon="add" label="Add a task" variant="filled" @click="add" />
            </template>
          </MGanttControls>
        </MGantt>
      </div>
    </ComponentDemo>

    <h3 class="mt-6 mb-3 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <ComponentPager current="MGanttControls" />
  </div>
</template>
