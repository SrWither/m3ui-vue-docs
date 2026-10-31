<script setup lang="ts">
import { ref } from 'vue'
import { MGantt, MGanttControls, type GanttTask } from '@m3ui-vue/m3ui-vue/gantt'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import GanttStatusBar from '@/components/demos/GanttStatusBar.vue'
import { launchPlan } from '@/components/demos/ganttSamples'

const tasks = ref<GanttTask[]>(launchPlan())

const api: PropDef[] = [
  { name: 'tasks / selection / collapsed', type: 'ComputedRef', description: 'The tasks as drawn (summaries rolled up), the selection, the folded summaries' },
  { name: 'scale / pxPerDay', type: 'ComputedRef / Ref', description: 'The nearest named scale and the zoom' },
  { name: 'zoomIn() / zoomOut() / setScale(s)', type: 'function', description: 'Zoom, sprung, around the middle of the view' },
  { name: 'scrollToDate(date?, opts?) / scrollToTask(id)', type: 'function', description: 'Scroll to a date (default now) or a task (unfolding what hides it)' },
  { name: 'toggle(id, expanded?) / expandAll() / collapseAll()', type: 'function', description: 'Fold summaries' },
  { name: 'setSelection(ids)', type: 'function', description: 'Select' },
  { name: 'addTasks(tasks, { after? }) / updateTask(id, patch) / removeTasks(ids)', type: 'function', description: 'Edit, as undoable steps (removing takes children and dependencies on them)' },
  { name: 'link(from, to, type?, lag?) / unlink(from, to)', type: 'function', description: 'Dependencies (link refuses circles and duplicates)' },
  { name: 'schedule(options?)', type: 'function', description: "scheduleTasks over the tasks with MGantt's calendar, undoable" },
  { name: 'criticalPath', type: 'ComputedRef<GanttCriticalPath>', description: '{ tasks, dependencies, slack, finish }, whether or not the chart highlights it' },
  { name: 'undo() / redo() / canUndo / canRedo', type: 'function / ComputedRef', description: 'History' },
  { name: 'dateAt(clientX)', type: 'string', description: 'The day under a page x (to drop something there)' },
]
const timelineApi: PropDef[] = [
  { name: 'events / selection / conflicts', type: 'ComputedRef', description: 'Bookings, the selection, and the ids that overlap past their capacity' },
  { name: 'zoomIn / zoomOut / setScale / scrollToDate / scrollToEvent(id)', type: 'function', description: 'View' },
  { name: 'addEvents / updateEvent / removeEvents / setSelection', type: 'function', description: 'Edit, undoable' },
  { name: 'dateAt(clientX) / resourceAt(clientY)', type: 'function', description: 'The time and the resource under a page point' },
  { name: 'undo / redo / canUndo / canRedo', type: 'function / ComputedRef', description: 'History' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useGantt</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The enclosing MGantt's state and controls, from a component in its default slot. Outside it, MGantt's template
      ref exposes the same (with its refs unwrapped). <code>useResourceTimeline()</code> does the same for an
      MResourceTimeline. From <code>/gantt</code>.
    </p>

    <ComponentDemo
      title="A Status Bar of Your Own"
      description="Reads the critical path's end and the selected task's slack; Pull in schedules everything as soon as it can start."
      flush
      :code="`<MGantt v-model:tasks=&quot;tasks&quot;>
  <MGanttControls />
  <GanttStatusBar />
</MGantt>`"
      :script="`// GanttStatusBar.vue
import { computed } from 'vue'
import { useGantt } from '@m3ui-vue/m3ui-vue/gantt'

const gantt = useGantt()
const selected = computed(() => gantt.tasks.value.find((t) => t.id === gantt.selection.value[0]))
const slack = computed(() => selected.value && gantt.criticalPath.value.slack[selected.value.id])
// gantt.schedule({ mode: 'asap' }), gantt.scrollToTask(id)…`"
    >
      <div class="p-4 sm:p-6">
        <MGantt v-model:tasks="tasks" class="h-[420px] border border-outline-variant">
          <MGanttControls />
          <GanttStatusBar />
        </MGantt>
      </div>
    </ComponentDemo>

    <h3 class="mt-6 mb-3 text-title-large font-medium">useGantt()</h3>
    <PropsTable :props="api" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">useResourceTimeline()</h3>
    <PropsTable :props="timelineApi" />

    <ComponentPager current="useGantt" />
  </div>
</template>
