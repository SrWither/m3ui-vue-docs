<script setup lang="ts">
/*
 * Shifts example (Rota): a restaurant's staff rota on MResourceTimeline, built only with m3ui-vue. The team in
 * rows by section, their shifts along the week: drag a shift to another hour or another person, pull its ends,
 * drag across empty time to add one of the picked kind, and see double bookings and who's over their hours.
 * - components/TopBar.vue       logo, the week shown, theme, docs and source
 * - components/ShiftEditor.vue  a shift's kind, person, day and hours
 * - useRota.ts                  the staff, the kinds of shift, two weeks of shifts
 */
import { computed, ref } from 'vue'
import { MAvatar, MBottomSheet, MChip, MDialog, MSwitch, useToast, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import { MGanttControls, MResourceTimeline, type TimelineEvent, type TimelineResource } from '@m3ui-vue/m3ui-vue/gantt'
import TopBar from './components/TopBar.vue'
import ShiftEditor from './components/ShiftEditor.vue'
import { day, kindById, kinds, newId, shifts, staff, type StaffData } from './useRota'

const toast = useToast()
const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')
const compact = computed(() => widthClass.value === 'compact')

const timeline = ref<InstanceType<typeof MResourceTimeline>>()
const week = ref(0)
const weekStart = computed(() => day(week.value * 7))
function goWeek(w: number) {
  week.value = w
  timeline.value?.scrollToDate(`${weekStart.value}T00:00`, { align: 'start' })
}

// ── Hours per person this week, and overlaps ────────────────────────────────────────────────────────────
const weekHours = computed(() => {
  const from = new Date(`${weekStart.value}T00:00`).getTime()
  const to = from + 7 * 86_400_000
  const m = new Map<string, number>()
  for (const s of shifts.value) {
    const a = Math.max(from, new Date(s.start).getTime())
    const b = Math.min(to, new Date(s.end).getTime())
    if (b > a) m.set(s.resourceId, (m.get(s.resourceId) ?? 0) + (b - a) / 3_600_000)
  }
  return m
})
const conflicts = computed(() => timeline.value?.conflicts ?? new Set<string>())
const prevent = ref(false)
function showConflict() {
  const id = [...conflicts.value][0]
  if (id) timeline.value?.scrollToEvent(id)
}

// ── Adding and editing ──────────────────────────────────────────────────────────────────────────────────
const addKind = ref('dinner')
function create(e: { resourceId: string; start: string; end: string }) {
  const k = kindById.get(addKind.value)!
  const s: TimelineEvent = { id: newId(), resourceId: e.resourceId, start: e.start, end: e.end, title: k.label, color: k.color, data: { kind: k.id } }
  timeline.value?.addEvents(s)
  timeline.value?.setSelection([s.id])
}
const editing = ref<string | null>(null)
const editingShift = computed(() => shifts.value.find((s) => s.id === editing.value))
function update(next: TimelineEvent) {
  timeline.value?.updateEvent(next.id, next)
}
function remove() {
  if (!editing.value) return
  timeline.value?.removeEvents([editing.value])
  editing.value = null
}
function onDelete(e: { events: TimelineEvent[] }) {
  toast.info(e.events.length === 1 ? 'Shift deleted' : `${e.events.length} shifts deleted`, { action: { label: 'Undo', onClick: () => timeline.value?.undo() } })
}
function onConflict(e: { event: TimelineEvent }) {
  const who = staff.find((s) => s.id === e.event.resourceId)?.name
  toast.warning(`${who} already works then`)
}
const contract = (r: TimelineResource) => (r.data as StaffData | undefined)?.contract ?? 40
</script>

<template>
  <div class="flex h-dvh flex-col bg-surface-container text-on-surface">
    <TopBar :wide="wide" :week="weekStart" @prev="goWeek(week - 1)" @next="goWeek(week + 1)" @today="goWeek(0)" />

    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 pb-3">
      <span class="text-label-large text-on-surface-variant">{{ compact ? 'New' : 'Drag across empty time to add' }}</span>
      <div class="flex flex-wrap gap-2">
        <MChip v-for="k in kinds" :key="k.id" type="filter" :icon="k.icon" :selected="addKind === k.id" @click="addKind = k.id">{{ k.label }}</MChip>
      </div>
      <span class="flex-1" />
      <MChip v-if="conflicts.size" icon="warning" tone="error" clickable @click="showConflict">{{ conflicts.size / 2 === 1 ? '1 double booking' : `${Math.ceil(conflicts.size / 2)} double bookings` }}</MChip>
      <label class="flex items-center gap-2 text-body-medium">Prevent overlaps <MSwitch v-model="prevent" /></label>
    </div>

    <main class="mx-2 mb-2 min-h-0 flex-1 overflow-hidden rounded-2xl bg-surface">
      <MResourceTimeline
        ref="timeline"
        v-model:events="shifts"
        :resources="staff"
        :px-per-day="compact ? 120 : 240"
        :list-width="compact ? 132 : 240"
        :overlap="prevent ? 'prevent' : 'stack'"
        :work-hours="[7, 24]"
        :start="`${weekStart}T00:00`"
        creatable
        label="Staff"
        class="size-full rounded-none"
        @create="create"
        @event-dblclick="editing = $event.id"
        @delete="onDelete"
        @conflict="onConflict"
      >
        <MGanttControls :scales="['hour', 'day']" :fold="!compact" />
        <template #resource="{ resource }">
          <MAvatar v-if="!compact" :name="resource.name" :size="36" />
          <span class="min-w-0 flex-1">
            <span class="block truncate text-body-large">{{ compact ? resource.name.split(' ')[0] : resource.name }}</span>
            <span class="block truncate text-body-small" :class="(weekHours.get(resource.id) ?? 0) > contract(resource) ? 'text-error' : 'text-on-surface-variant'">
              {{ Math.round((weekHours.get(resource.id) ?? 0) * 10) / 10 }} / {{ contract(resource) }} h
            </span>
            <span class="mt-1 block h-1 overflow-hidden rounded-full bg-surface-container-highest">
              <span
                class="block h-full rounded-full transition-[width] duration-300"
                :class="(weekHours.get(resource.id) ?? 0) > contract(resource) ? 'bg-error' : 'bg-primary'"
                :style="{ width: `${Math.min(100, ((weekHours.get(resource.id) ?? 0) / contract(resource)) * 100)}%` }"
              />
            </span>
          </span>
        </template>
      </MResourceTimeline>
    </main>

    <MDialog v-if="wide" :model-value="!!editingShift" title="Shift" max-width="max-w-md" @update:model-value="!$event && (editing = null)">
      <ShiftEditor v-if="editingShift" :shift="editingShift" :conflict="conflicts.has(editingShift.id)" @update="update" @delete="remove" />
    </MDialog>
    <MBottomSheet v-else :model-value="!!editingShift" title="Shift" @update:model-value="!$event && (editing = null)">
      <div class="px-4 pb-6">
        <ShiftEditor v-if="editingShift" :shift="editingShift" :conflict="conflicts.has(editingShift.id)" @update="update" @delete="remove" />
      </div>
    </MBottomSheet>
  </div>
</template>
