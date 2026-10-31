<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MSegmentedButton, MSwitch, MTextField } from '@m3ui-vue/m3ui-vue'
import {
  MGantt,
  MGanttControls,
  parseGanttCsv,
  parseGanttJson,
  parseMsProjectXml,
  toGanttCsv,
  toGanttJson,
  toMsProjectXml,
  type GanttColumn,
  type GanttTask,
} from '@m3ui-vue/m3ui-vue/gantt'
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
import { at, dayFrom, launchPlan } from '@/components/demos/ganttSamples'

// ── Basic ───────────────────────────────────────────────────────────────────────────────────────────────
const tasks = ref<GanttTask[]>(launchPlan())
const scale = ref<'day' | 'week' | 'month' | 'quarter'>('day')

// ── Scheduling ──────────────────────────────────────────────────────────────────────────────────────────
const planTasks = ref<GanttTask[]>(launchPlan())
const auto = ref(true)
const critical = ref(true)
const baselines = ref(true)

// ── Columns and slots ───────────────────────────────────────────────────────────────────────────────────
const people: Record<string, string> = { design: 'Ada', api: 'Linus', app: 'Grace', qa: 'Evan', docs: 'Luca' }
const teamTasks = ref<GanttTask[]>(launchPlan().filter((t) => t.parentId === 'build' || t.id === 'build' || t.id === 'docs').map((t) => ({ ...t, data: { owner: people[t.id] } })))
const columns: GanttColumn[] = [
  { key: 'name', label: 'Task' },
  { key: 'owner', label: 'Owner', width: 80 },
  { key: 'progress', label: 'Done', width: 64, align: 'end' },
]

// ── Hours ───────────────────────────────────────────────────────────────────────────────────────────────
const dayTasks = ref<GanttTask[]>([
  { id: 'h1', name: 'Doors open', start: at(0, '08:00'), type: 'milestone' },
  { id: 'h2', name: 'Keynote', start: at(0, '09:00'), end: at(0, '10:30'), progress: 100 },
  { id: 'h3', name: 'Workshops', start: at(0, '10:45'), end: at(0, '13:00'), dependencies: ['h2'], color: 'tertiary' },
  { id: 'h4', name: 'Lunch', start: at(0, '13:00'), end: at(0, '14:00'), dependencies: ['h3'], color: 'secondary' },
  { id: 'h5', name: 'Talks', start: at(0, '14:00'), end: at(0, '17:30'), dependencies: ['h4'] },
])

// ── Import and export ───────────────────────────────────────────────────────────────────────────────────
const fileTasks = ref<GanttTask[]>(launchPlan().slice(0, 4))
const format = ref<'csv' | 'json' | 'xml'>('csv')
const text = ref(toGanttCsv(fileTasks.value))
const fileError = ref('')
function write() {
  text.value = format.value === 'csv' ? toGanttCsv(fileTasks.value) : format.value === 'json' ? toGanttJson(fileTasks.value) : toMsProjectXml(fileTasks.value, { name: 'Launch' })
  fileError.value = ''
}
function read() {
  try {
    fileTasks.value = format.value === 'csv' ? parseGanttCsv(text.value) : format.value === 'json' ? parseGanttJson(text.value) : parseMsProjectXml(text.value).tasks
    fileError.value = ''
  } catch (e) {
    fileError.value = (e as Error).message
  }
}
function pickFormat(f: 'csv' | 'json' | 'xml') {
  format.value = f
  write()
}
function download() {
  const ext = format.value === 'xml' ? 'xml' : format.value
  const url = URL.createObjectURL(new Blob([text.value], { type: format.value === 'json' ? 'application/json' : format.value === 'xml' ? 'application/xml' : 'text/csv' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `plan.${ext}`
  a.click()
  URL.revokeObjectURL(url)
}

const props: PropDef[] = [
  { name: 'tasks', type: 'GanttTask[]', default: '[]', description: 'The tasks (v-model:tasks): edits come back as new arrays with new objects for what changed' },
  { name: 'scale', type: "'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'", default: "'day'", description: 'The zoom as a named level (v-model:scale follows Ctrl + wheel, pinches and MGanttControls)' },
  { name: 'pxPerDay', type: 'number', description: "A starting zoom between the named levels" },
  { name: 'selection', type: 'string[]', description: 'Selected task ids (v-model:selection)' },
  { name: 'collapsed', type: 'string[]', description: 'Summaries whose tasks are hidden (v-model:collapsed)' },
  { name: 'columns', type: 'GanttColumn[]', default: 'name, start, duration', description: "The task list's columns: name, start, end, duration and progress are built in, anything else reads data[key]; [] hides the list" },
  { name: 'gridWidth', type: 'number', default: '320', description: "The task list's width (v-model:grid-width; drag its edge)" },
  { name: 'rowHeight', type: 'number', default: '40', description: 'Row height in px' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'No dragging, resizing, linking, reordering, renaming or deleting' },
  { name: 'schedule', type: "'manual' | 'auto'", default: "'manual'", description: 'auto: the tasks that depend on a moved one follow it' },
  { name: 'calendar', type: 'GanttCalendar', description: '{ workingDays, holidays }: days off are shaded, and auto scheduling counts working days' },
  { name: 'criticalPath', type: 'boolean', default: 'false', description: 'Highlights the tasks and dependencies whose delay delays the end' },
  { name: 'baselines', type: 'boolean', default: 'false', description: "Draws each task's baselineStart/baselineEnd under it" },
  { name: 'today', type: 'string | null', default: 'now', description: "The today line's date; null hides it" },
  { name: 'snap', type: 'number', default: 'by zoom', description: 'Minutes a datetime task snaps to; date-only tasks snap to days' },
  { name: 'weekStartsOn', type: '0 | 1', default: '1', description: 'First day of the week' },
  { name: 'minPxPerDay / maxPxPerDay', type: 'number', default: '0.15 / 2400', description: 'Zoom bounds' },
  { name: 'locale', type: 'string', description: "Dates' locale (Intl); default the app's" },
  { name: 'label', type: 'string', description: 'Accessible name' },
  { name: 'beforeDelete', type: '(tasks) => boolean | Promise<boolean>', description: 'Asked before deleting' },
]
const events: EventDef[] = [
  { name: 'update:tasks / scale / selection / collapsed / gridWidth', payload: '…', description: 'v-model updates' },
  { name: 'task-click / task-dblclick / task-contextmenu', payload: '(task, event)', description: 'On a bar or a row (Enter on a row is a dblclick: open your editor there)' },
  { name: 'link', payload: '{ from, to, type }', description: 'A dependency was drawn' },
  { name: 'unlink', payload: '{ from, to }', description: 'A dependency was removed' },
  { name: 'change', payload: "{ tasks, kind: 'move' | 'resize' | 'progress' | 'reorder' | 'rename' }", description: 'What a drag or a key changed' },
  { name: 'delete', payload: '{ tasks }', description: 'Tasks were deleted (with their children)' },
]
const slots: SlotDef[] = [
  { name: 'default', scope: '{ gantt }', description: 'Above the chart: MGanttControls, filters of yours' },
  { name: 'bar', scope: '{ task, selected, critical }', description: "A bar's content instead of its label" },
  { name: 'cell-<key>', scope: '{ task, value }', description: 'A cell of that column' },
  { name: 'tooltip', scope: '{ task, slack }', description: 'The card over a hovered or dragged bar' },
  { name: 'empty', description: 'Shown while there are no tasks' },
]
const types: TypeDef[] = [
  {
    name: 'GanttTask',
    fields: [
      { name: 'id / name', type: 'string', required: true, description: 'Its id and label' },
      { name: 'start', type: 'string', required: true, description: 'YYYY-MM-DD (whole days) or a datetime (YYYY-MM-DDTHH:mm, local, or ISO with a zone)' },
      { name: 'end', type: 'string', description: 'A date is the last day (inclusive), a datetime when it ends. Milestones need none' },
      { name: 'progress', type: 'number', description: '0 to 100' },
      { name: 'type', type: "'task' | 'milestone' | 'summary'", description: 'summary is implied for a task with children; its dates and progress roll up' },
      { name: 'parentId', type: 'string', description: 'The summary it belongs to' },
      { name: 'dependencies', type: '(string | { id, type?, lag? })[]', description: "Predecessors: ids (finish-to-start) or { id, type: 'FS' | 'SS' | 'FF' | 'SF', lag } with lag in days" },
      { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'neutral'", description: 'Its bar' },
      { name: 'baselineStart / baselineEnd', type: 'string', description: 'The plan it is compared with' },
      { name: 'draggable, resizable, linkable, deletable, selectable, class, data', type: '…', description: 'Per task' },
    ],
  },
  {
    name: 'Functions',
    description: 'Pure, from /gantt, for tasks outside the chart too',
    fields: [
      { name: 'scheduleTasks(tasks, { mode, calendar })', type: 'GanttTask[]', description: "Moves tasks so every dependency holds: 'push' (only later) or 'asap'; durations and lags in working days with a calendar. A link onto a summary applies to each of its tasks" },
      { name: 'criticalPath(tasks)', type: '{ tasks, dependencies, slack, finish }', description: 'The chain that sets the end, and every task\'s slack in days' },
      { name: 'rollupSummaries(tasks)', type: 'GanttTask[]', description: 'Summaries take their children\'s span and weighted progress' },
      { name: 'workingDays(start, end, cal?) / addWorkingDays(date, n, cal?)', type: 'number / string', description: 'Counting and adding working days' },
      { name: 'toGanttCsv / parseGanttCsv', type: 'string ↔ GanttTask[]', description: "CSV with a header row; reading takes other tools' names too (Task Name, Finish, % Complete, Predecessors as 'a; b SS+2'), ; or tabs, day/month dates" },
      { name: 'toGanttJson / parseGanttJson', type: 'string ↔ GanttTask[]', description: 'Everything, data included; reading takes a bare array too' },
      { name: 'toMsProjectXml / parseMsProjectXml', type: 'string ↔ GanttTask[]', description: 'Microsoft Project XML (MSPDI): outline, dates, progress, milestones, predecessors with type and lag, baseline. Project, ProjectLibre and GanttProject open it' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MGantt</h1>
    <p class="mb-4 text-body-large text-on-surface-variant">
      A Gantt chart: a task list (a tree, with columns) beside a timeline of bars. Drag a bar to move it, its ends
      to resize it, the triangle under it to set its progress, and the dots at its ends onto another bar to make a
      dependency; click or tap a dependency's arrow for a × that removes it (or press Delete). Summaries roll up from their tasks and move with them; rows reorder by dragging them in the list.
      Every edit is undoable. Not an M3 spec component. From <code>/gantt</code>, with no dependencies.
    </p>
    <p class="mb-8 text-body-medium text-on-surface-variant">
      On touch, a short press on a bar picks it up (a swipe scrolls), and a pinch zooms. In the list:
      arrows move and fold, Alt + ←/→ moves the task, Alt + Shift + ←/→ changes its end, Alt + ↑/↓ reorders it,
      Ctrl + ] / [ indents and outdents, F2 renames, Delete deletes.
    </p>

    <ComponentDemo
      title="Basic"
      description="A launch plan with summaries, milestones and dependencies, and MGanttControls in the default slot. Ctrl + wheel zooms; dragging the empty timeline pans."
      flush
      :code="`<MGantt v-model:tasks=&quot;tasks&quot; v-model:scale=&quot;scale&quot; class=&quot;h-[460px]&quot;>
  <MGanttControls />
</MGantt>`"
      :script="`const tasks = ref<GanttTask[]>([
  { id: 'plan', name: 'Planning', start: '2026-03-02', end: '2026-03-13' },
  { id: 'brief', name: 'Brief and goals', start: '2026-03-02', end: '2026-03-05', parentId: 'plan', progress: 100 },
  { id: 'research', name: 'User research', start: '2026-03-06', end: '2026-03-11', parentId: 'plan', dependencies: ['brief'] },
  { id: 'scope', name: 'Scope signed off', start: '2026-03-12', type: 'milestone', parentId: 'plan', dependencies: ['research'] },
  { id: 'api', name: 'API', start: '2026-03-16', end: '2026-03-26', dependencies: [{ id: 'scope', type: 'FS', lag: 1 }] },
  // …
])
const scale = ref('day')`"
    >
      <div class="p-4 sm:p-6">
        <MGantt v-model:tasks="tasks" v-model:scale="scale" class="h-[460px] border border-outline-variant">
          <MGanttControls />
        </MGantt>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Scheduling, Critical Path and Baselines"
      description="With schedule auto, the tasks that depend on one follow it as you drag it (try Design or API). The critical path shows what sets the launch date; the thin bars under each task are its baseline. Hover a bar for its slack."
      flush
      :code="`<MGantt
  v-model:tasks=&quot;tasks&quot;
  :schedule=&quot;auto ? 'auto' : 'manual'&quot;
  :critical-path=&quot;critical&quot;
  :baselines=&quot;baselines&quot;
  :calendar=&quot;{ workingDays: [1, 2, 3, 4, 5], holidays: ['2026-12-25'] }&quot;
>
  <MGanttControls :scales=&quot;['day', 'week']&quot; />
</MGantt>`"
      :script="`import { scheduleTasks, criticalPath } from '@m3ui-vue/m3ui-vue/gantt'

// The same, without the chart
const scheduled = scheduleTasks(tasks.value, { mode: 'push', calendar: { workingDays: [1, 2, 3, 4, 5] } })
const { tasks: onPath, slack, finish } = criticalPath(scheduled)`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-body-medium">
          <label class="flex items-center gap-2"><MSwitch v-model="auto" /> Auto schedule</label>
          <label class="flex items-center gap-2"><MSwitch v-model="critical" /> Critical path</label>
          <label class="flex items-center gap-2"><MSwitch v-model="baselines" /> Baselines</label>
        </div>
        <MGantt
          v-model:tasks="planTasks"
          :schedule="auto ? 'auto' : 'manual'"
          :critical-path="critical"
          :baselines="baselines"
          :calendar="{ workingDays: [1, 2, 3, 4, 5] }"
          class="h-[460px] border border-outline-variant"
        >
          <MGanttControls :scales="['day', 'week']" />
        </MGantt>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Columns and Slots"
      description="Columns of your own read task.data; #cell-<key> draws a cell and #bar a bar's content. Double click a name to rename it."
      flush
      :code="`<MGantt v-model:tasks=&quot;tasks&quot; :columns=&quot;columns&quot; :grid-width=&quot;300&quot;>
  <template #cell-progress=&quot;{ task }&quot;>
    <span :class=&quot;task.progress === 100 ? 'text-success' : ''&quot;>{{ task.progress ?? 0 }}%</span>
  </template>
  <template #bar=&quot;{ task }&quot;>
    <span class=&quot;truncate&quot;>{{ task.data?.owner }} · {{ task.name }}</span>
  </template>
</MGantt>`"
      :script="`const columns: GanttColumn[] = [
  { key: 'name', label: 'Task' },
  { key: 'owner', label: 'Owner', width: 80 },
  { key: 'progress', label: 'Done', width: 64, align: 'end' },
]
// tasks: { ..., data: { owner: 'Ada' } }`"
    >
      <div class="p-4 sm:p-6">
        <MGantt v-model:tasks="teamTasks" :columns="columns" :grid-width="300" scale="week" class="h-[300px] border border-outline-variant">
          <template #cell-progress="{ task }">
            <span :class="task.progress === 100 ? 'text-success' : ''">{{ task.progress ?? 0 }}%</span>
          </template>
          <template #bar="{ task }">
            <span class="truncate">{{ task.data?.owner ? `${task.data.owner} · ` : '' }}{{ task.name }}</span>
          </template>
        </MGantt>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Hours"
      description="Datetime tasks snap to minutes by zoom (or snap); here a conference day at the hour scale."
      flush
      :code="`<MGantt v-model:tasks=&quot;tasks&quot; scale=&quot;hour&quot; :snap=&quot;15&quot; />`"
      :script="`const tasks = ref<GanttTask[]>([
  { id: 'h1', name: 'Doors open', start: '2026-05-14T08:00', type: 'milestone' },
  { id: 'h2', name: 'Keynote', start: '2026-05-14T09:00', end: '2026-05-14T10:30' },
  { id: 'h3', name: 'Workshops', start: '2026-05-14T10:45', end: '2026-05-14T13:00', dependencies: ['h2'] },
])`"
    >
      <div class="p-4 sm:p-6">
        <MGantt v-model:tasks="dayTasks" scale="hour" :px-per-day="1440" :snap="15" :today="null" :columns="[{ key: 'name', label: 'Session' }]" :grid-width="200" class="h-[260px] border border-outline-variant" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Import and Export"
      description="CSV, JSON and Microsoft Project XML, both ways: edit the chart and Write it out, or paste a file (an export from Project, ProjectLibre, GanttProject or a spreadsheet) and Read it."
      flush
      :code="`<MGantt v-model:tasks=&quot;tasks&quot; />`"
      :script="`import { toGanttCsv, parseGanttCsv, toGanttJson, parseGanttJson, toMsProjectXml, parseMsProjectXml } from '@m3ui-vue/m3ui-vue/gantt'

const csv = toGanttCsv(tasks.value)
tasks.value = parseGanttCsv(csv) // throws a SyntaxError on what it can't read

const xml = toMsProjectXml(tasks.value, { name: 'Launch' })
const { name, tasks: imported } = parseMsProjectXml(await file.text())`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <div class="flex flex-wrap items-center gap-3">
          <MSegmentedButton :model-value="format" :options="[{ value: 'csv', label: 'CSV' }, { value: 'json', label: 'JSON' }, { value: 'xml', label: 'MS Project' }]" @update:model-value="pickFormat($event as 'csv' | 'json' | 'xml')" />
          <MButton variant="tonal" icon="arrow_downward" @click="read">Read</MButton>
          <MButton variant="outlined" icon="arrow_upward" @click="write">Write</MButton>
          <MButton variant="text" icon="download" @click="download">Download</MButton>
        </div>
        <MGantt v-model:tasks="fileTasks" scale="week" :today="dayFrom(0)" class="h-[240px] border border-outline-variant" />
        <MTextField v-model="text" multiline :rows="10" :label="format.toUpperCase()" :error="!!fileError" :error-label="fileError" class="font-mono text-body-small" />
      </div>
    </ComponentDemo>

    <h3 class="mt-6 mb-3 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Types and functions</h3>
    <TypesTable :types="types" />
    <p class="mt-4 text-body-medium text-on-surface-variant">
      The template ref, and <code>useGantt()</code> inside it, give its state and controls: see
      <RouterLink to="/composables/usegantt" class="text-primary">useGantt</RouterLink>.
    </p>

    <ComponentPager current="MGantt" />
  </div>
</template>
