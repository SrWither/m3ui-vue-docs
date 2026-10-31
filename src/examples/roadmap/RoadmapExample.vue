<script setup lang="ts">
/*
 * Roadmap example (Tempo): a project planner on MGantt, built only with m3ui-vue. Phases and tasks in a tree,
 * milestones and dependencies; drag to reschedule (what depends on a task follows it), see the critical path and
 * the baseline, edit a task in a side panel, and import or export CSV, JSON or Microsoft Project XML.
 * - components/TopBar.vue      logo, the project's name, view switches, import and export, theme, docs and source
 * - components/TaskEditor.vue  the selected task's details
 * - useProject.ts              the tasks, the people, the view's switches
 */
import { computed, ref } from 'vue'
import { MAvatar, MButton, MIcon, MIconButton, MProgressBar, MSideSheet, useToast, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import {
  MGantt,
  MGanttControls,
  criticalPath,
  parseGanttCsv,
  parseGanttJson,
  parseMsProjectXml,
  rollupSummaries,
  taskSpan,
  toGanttCsv,
  toGanttJson,
  toMsProjectXml,
  type GanttColumn,
  type GanttTask,
} from '@m3ui-vue/m3ui-vue/gantt'
import TopBar from './components/TopBar.vue'
import TaskEditor from './components/TaskEditor.vue'
import { autoSchedule, newId, personById, projectName, showBaselines, showCritical, tasks, type TaskData } from './useProject'

const toast = useToast()
const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')
const compact = computed(() => widthClass.value === 'compact')

const gantt = ref<InstanceType<typeof MGantt>>()
const selection = ref<string[]>([])
const editing = ref<string | null>(null)
const parents = computed(() => new Set(tasks.value.map((t) => t.parentId).filter(Boolean)))
const editingTask = computed(() => rollupSummaries(tasks.value).find((t) => t.id === editing.value))

const columns = computed<GanttColumn[]>(() => (compact.value
  ? [{ key: 'name', label: 'Task' }]
  : [{ key: 'name', label: 'Task' }, { key: 'owner', label: '', width: 48, align: 'center' }, { key: 'start', label: 'Start', width: 84 }, { key: 'duration', label: 'Days', width: 64, align: 'end' }]))

// ── The header's figures ────────────────────────────────────────────────────────────────────────────────
const rolled = computed(() => rollupSummaries(tasks.value))
const progress = computed(() => {
  let work = 0
  let done = 0
  for (const t of rolled.value) {
    if (parents.value.has(t.id) || !t.end) continue
    const s = taskSpan(t)
    work += s.end - s.start
    done += (s.end - s.start) * (t.progress ?? 0)
  }
  return work ? Math.round(done / work) : 0
})
const finish = computed(() => criticalPath(rolled.value, { calendar: {} }).finish)
const launch = computed(() => rolled.value.find((t) => t.id === 'launch'))
// Days the plan slipped against the baseline's last end
const slip = computed(() => {
  let base = -Infinity
  let now = -Infinity
  for (const t of rolled.value) {
    if (!t.baselineEnd) continue
    base = Math.max(base, taskSpan({ start: t.baselineStart!, end: t.baselineEnd }).end)
    now = Math.max(now, taskSpan(t).end)
  }
  return Number.isFinite(base) ? Math.round((now - base) / 86_400_000) : 0
})
const fmt = (s?: string) => (s ? new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(`${s}T00:00`)) : '')

// ── Editing ─────────────────────────────────────────────────────────────────────────────────────────────
function open(t: GanttTask) {
  editing.value = t.id
  selection.value = [t.id]
}
function update(patch: Partial<GanttTask<TaskData>>) {
  const id = editing.value
  if (!id) return
  gantt.value?.updateTask(id, (t) => {
    const next = { ...t, ...patch }
    for (const k of Object.keys(patch) as (keyof GanttTask)[]) if (patch[k] === undefined) delete next[k]
    return next
  })
}
function add() {
  const sel = rolled.value.find((t) => t.id === selection.value[0])
  // Into a selected phase, else after the selected task, else at the end
  const parentId = sel ? (parents.value.has(sel.id) ? sel.id : sel.parentId) : undefined
  const start = sel ? (sel.end ?? sel.start) : rolled.value.at(-1)?.end ?? rolled.value.at(-1)?.start
  const t: GanttTask<TaskData> = { id: newId(), name: 'New task', start: start!, end: start!, progress: 0, ...(parentId ? { parentId } : {}) }
  gantt.value?.addTasks(t, { after: sel?.id })
  open(t)
  gantt.value?.scrollToTask(t.id)
}
function duplicate() {
  const t = tasks.value.find((x) => x.id === editing.value)
  if (!t) return
  const copy = { ...t, id: newId(), name: `${t.name} (copy)`, dependencies: undefined }
  delete copy.dependencies
  gantt.value?.addTasks(copy, { after: t.id })
  open(copy)
}
function remove() {
  if (!editing.value) return
  gantt.value?.removeTasks([editing.value])
  editing.value = null
}
function onDelete(e: { tasks: GanttTask[] }) {
  toast.info(`${e.tasks.length === 1 ? `"${e.tasks[0]!.name}"` : `${e.tasks.length} tasks`} deleted`, { action: { label: 'Undo', onClick: () => gantt.value?.undo() } })
}

// ── Import and export ───────────────────────────────────────────────────────────────────────────────────
function download(format: 'csv' | 'json' | 'xml') {
  const text = format === 'csv' ? toGanttCsv(tasks.value) : format === 'json' ? toGanttJson(tasks.value) : toMsProjectXml(tasks.value, { name: projectName.value })
  const type = format === 'csv' ? 'text/csv' : format === 'json' ? 'application/json' : 'application/xml'
  const url = URL.createObjectURL(new Blob([text], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${projectName.value.replace(/[^\w-]+/g, '-').toLowerCase() || 'project'}.${format}`
  a.click()
  URL.revokeObjectURL(url)
}
async function load(file: File) {
  try {
    const text = await file.text()
    const ext = file.name.split('.').pop()?.toLowerCase()
    let next: GanttTask[]
    if (ext === 'xml' || text.trimStart().startsWith('<')) {
      const p = parseMsProjectXml(text)
      next = p.tasks
      if (p.name) projectName.value = p.name
    } else if (ext === 'json' || text.trimStart().startsWith('{') || text.trimStart().startsWith('[')) next = parseGanttJson(text)
    else next = parseGanttCsv(text)
    tasks.value = next
    selection.value = []
    editing.value = null
    toast.success(`Imported ${next.length} tasks from ${file.name}`)
    setTimeout(() => gantt.value?.scrollToDate(next[0]?.start, { align: 'start' }))
  } catch (e) {
    toast.error(`Couldn't read ${file.name}: ${(e as Error).message}`)
  }
}
</script>

<template>
  <div class="flex h-dvh flex-col bg-surface-container text-on-surface">
    <TopBar :wide="wide" @export="download" @import="load" />

    <div class="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 pb-3 text-body-medium">
      <div class="flex min-w-48 items-center gap-3">
        <span class="text-on-surface-variant">Done</span>
        <MProgressBar :value="progress" class="w-28" />
        <span class="text-title-small">{{ progress }}%</span>
      </div>
      <div class="flex items-center gap-2">
        <MIcon name="flag" :size="18" class="text-success" />
        <span class="text-on-surface-variant">Launch</span>
        <span class="text-title-small">{{ fmt(launch?.start ?? finish) }}</span>
      </div>
      <div v-if="slip" class="flex items-center gap-2" :class="slip > 0 ? 'text-error' : 'text-success'">
        <MIcon :name="slip > 0 ? 'trending_down' : 'trending_up'" :size="18" />
        {{ Math.abs(slip) }} {{ Math.abs(slip) === 1 ? 'day' : 'days' }} {{ slip > 0 ? 'behind' : 'ahead of' }} the baseline
      </div>
    </div>

    <div class="flex min-h-0 flex-1 gap-2 px-2 pb-2">
      <main class="min-w-0 flex-1 overflow-hidden rounded-2xl bg-surface">
        <MGantt
          ref="gantt"
          v-model:tasks="tasks"
          v-model:selection="selection"
          :columns="columns"
          :grid-width="compact ? 150 : 400"
          :schedule="autoSchedule ? 'auto' : 'manual'"
          :critical-path="showCritical"
          :baselines="showBaselines"
          :calendar="{ workingDays: [1, 2, 3, 4, 5] }"
          :row-height="compact ? 44 : 40"
          label="Project plan"
          class="size-full rounded-none"
          @task-dblclick="open"
          @delete="onDelete"
        >
          <MGanttControls :scales="compact ? ['day', 'week', 'month'] : ['day', 'week', 'month', 'quarter']">
            <template #end>
              <MIconButton v-if="selection.length === 1 && editing !== selection[0]" icon="edit" label="Edit the task" @click="open(rolled.find((t) => t.id === selection[0])!)" />
              <MButton icon="add" @click="add">{{ compact ? 'Task' : 'Add task' }}</MButton>
            </template>
          </MGanttControls>
          <template #cell-owner="{ task }">
            <MAvatar v-if="task.data?.owner" :name="personById.get(task.data.owner)?.name" :size="24" :title="personById.get(task.data.owner)?.name" />
          </template>
          <template #tooltip="{ task, slack }">
            <div class="text-title-small">{{ task.name }}</div>
            <div class="text-body-small text-on-surface-variant">
              {{ fmt(task.start) }}<template v-if="task.end"> – {{ fmt(task.end) }}</template>
              <template v-if="task.data?.owner"> · {{ personById.get(task.data.owner)?.name }}</template>
            </div>
            <div v-if="task.progress !== undefined && task.end" class="text-body-small text-on-surface-variant">{{ task.progress }}% done</div>
            <div v-if="showCritical && slack !== undefined" class="text-body-small" :class="slack === 0 ? 'text-error' : 'text-on-surface-variant'">
              {{ slack === 0 ? 'On the critical path' : `Can slip ${Math.round(slack)} days` }}
            </div>
          </template>
        </MGantt>
      </main>

      <aside v-if="wide && editingTask" class="w-96 shrink-0 overflow-hidden rounded-2xl bg-surface">
        <TaskEditor :key="editingTask.id" :task="editingTask" :summary="parents.has(editingTask.id)" @update="update" @duplicate="duplicate" @delete="remove" @close="editing = null" />
      </aside>
    </div>

    <MSideSheet v-if="!wide" :model-value="!!editingTask" @update:model-value="!$event && (editing = null)">
      <TaskEditor v-if="editingTask" :key="editingTask.id" :task="editingTask" :summary="parents.has(editingTask.id)" @update="update" @duplicate="duplicate" @delete="remove" @close="editing = null" />
    </MSideSheet>
  </div>
</template>
