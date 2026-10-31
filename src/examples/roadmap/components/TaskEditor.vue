<script setup lang="ts">
/* The selected task: name, owner, dates (or a milestone's day), progress, color, what it waits for; duplicate and delete. */
import { computed } from 'vue'
import { MButton, MChip, MDatePicker, MIconButton, MSelect, MSlider, MSwitch, MTextField } from '@m3ui-vue/m3ui-vue'
import type { GanttDependency, GanttTask } from '@m3ui-vue/m3ui-vue/gantt'
import { people, tasks, type TaskData } from '../useProject'

const props = defineProps<{ task: GanttTask<TaskData>; summary: boolean }>()
const emit = defineEmits<{ update: [patch: Partial<GanttTask<TaskData>>]; duplicate: []; delete: []; close: [] }>()

const COLORS = ['primary', 'secondary', 'tertiary', 'success', 'error'] as const
const SWATCH = { primary: 'bg-primary', secondary: 'bg-secondary', tertiary: 'bg-tertiary', success: 'bg-success', error: 'bg-error' }
const milestone = computed(() => props.task.type === 'milestone' || (!props.task.end && !props.summary))
const deps = computed(() => (props.task.dependencies ?? []).map((d) => (typeof d === 'string' ? { id: d, type: 'FS' as const } : d)))
const nameOf = (id: string) => tasks.value.find((t) => t.id === id)?.name ?? id
const TYPE: Record<string, string> = { FS: 'after it ends', SS: 'when it starts', FF: 'ends with it', SF: 'ends after it starts' }
// Anything but itself and what already waits on it
const candidates = computed(() => tasks.value
  .filter((t) => t.id !== props.task.id && !deps.value.some((d) => d.id === t.id) && t.parentId !== props.task.id)
  .map((t) => ({ label: t.name, value: t.id })))
function addDep(id: unknown) {
  if (typeof id === 'string') emit('update', { dependencies: [...(props.task.dependencies ?? []), id] })
}
function removeDep(id: string) {
  emit('update', { dependencies: (props.task.dependencies ?? []).filter((d: string | GanttDependency) => (typeof d === 'string' ? d : d.id) !== id) })
}
function setMilestone(on: boolean) {
  emit('update', on ? { type: 'milestone', end: undefined } : { type: 'task', end: props.task.start })
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center gap-2 px-4 pt-4 pb-2">
      <h2 class="flex-1 text-title-large">{{ summary ? 'Phase' : milestone ? 'Milestone' : 'Task' }}</h2>
      <MIconButton icon="content_copy" label="Duplicate" @click="emit('duplicate')" />
      <MIconButton icon="delete" label="Delete" @click="emit('delete')" />
      <MIconButton icon="close" label="Close" @click="emit('close')" />
    </div>
    <div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-6">
      <MTextField :model-value="task.name" label="Name" @update:model-value="emit('update', { name: String($event) })" />
      <template v-if="summary">
        <p class="text-body-medium text-on-surface-variant">A phase takes its dates and progress from its tasks: move them, or drag the phase to move them all.</p>
      </template>
      <template v-else>
        <MSelect
          :model-value="task.data?.owner ?? null"
          :options="people.map((p) => ({ label: p.name, value: p.id }))"
          label="Owner"
          clearable
          @update:model-value="emit('update', { data: { ...task.data, owner: ($event as string) || undefined } })"
        />
        <label class="flex items-center justify-between text-body-large">Milestone <MSwitch :model-value="milestone" @update:model-value="setMilestone" /></label>
        <div class="grid grid-cols-2 gap-3">
          <MDatePicker :model-value="task.start" :label="milestone ? 'Day' : 'Start'" @update:model-value="$event && emit('update', { start: $event })" />
          <MDatePicker v-if="!milestone" :model-value="task.end ?? task.start" label="End" :min="task.start" @update:model-value="$event && emit('update', { end: $event })" />
        </div>
        <div v-if="!milestone">
          <div class="mb-1 flex justify-between text-body-medium"><span>Progress</span><span class="text-on-surface-variant">{{ task.progress ?? 0 }}%</span></div>
          <MSlider :model-value="task.progress ?? 0" :min="0" :max="100" :step="5" label="Progress" @update:model-value="emit('update', { progress: $event as number })" />
        </div>
        <div>
          <div class="mb-2 text-body-medium">Color</div>
          <div class="flex gap-2">
            <button
              v-for="c in COLORS"
              :key="c"
              type="button"
              class="size-8 rounded-full outline-offset-2"
              :class="[SWATCH[c], (task.color ?? 'primary') === c ? 'outline-2 outline-on-surface' : '']"
              :aria-label="c"
              :aria-pressed="(task.color ?? 'primary') === c"
              @click="emit('update', { color: c })"
            />
          </div>
        </div>
      </template>
      <div>
        <div class="mb-2 text-body-medium">Waits for</div>
        <div class="flex flex-wrap gap-2">
          <MChip v-for="d in deps" :key="d.id" removable type="input" @remove="removeDep(d.id)">
            {{ nameOf(d.id) }}<span class="ml-1 text-on-surface-variant">· {{ TYPE[d.type ?? 'FS'] }}</span>
          </MChip>
          <span v-if="!deps.length" class="text-body-medium text-on-surface-variant">Nothing. Drag from a bar's end dot onto another bar, or pick one:</span>
        </div>
        <MSelect class="mt-3" :model-value="null" :options="candidates" label="Add a predecessor" @update:model-value="addDep" />
      </div>
      <MButton variant="text" icon="delete" class="self-start" @click="emit('delete')">Delete {{ summary ? 'phase and its tasks' : milestone ? 'milestone' : 'task' }}</MButton>
    </div>
  </div>
</template>
