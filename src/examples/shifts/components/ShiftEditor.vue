<script setup lang="ts">
/* A shift: its kind (which sets its name, color and usual hours), who works it, the day and the hours. */
import { computed } from 'vue'
import { MButton, MChip, MDatePicker, MSelect, MTimePicker } from '@m3ui-vue/m3ui-vue'
import type { TimelineEvent } from '@m3ui-vue/m3ui-vue/gantt'
import { kinds, shiftOf, staff, type ShiftKind } from '../useRota'

const props = defineProps<{ shift: TimelineEvent; conflict: boolean }>()
const emit = defineEmits<{ update: [shift: TimelineEvent]; delete: [] }>()

const date = computed(() => props.shift.start.slice(0, 10))
const from = computed(() => props.shift.start.slice(11, 16))
const to = computed(() => props.shift.end.slice(11, 16))
const kind = computed(() => (props.shift.data as { kind?: string } | undefined)?.kind)
const hours = computed(() => {
  const h = (new Date(props.shift.end).getTime() - new Date(props.shift.start).getTime()) / 3_600_000
  return Math.round(h * 10) / 10
})
const pad = (n: number) => String(n).padStart(2, '0')
// Hours that end before they start run past midnight
function withTimes(d: string, f: string, t: string) {
  const [y, m, dd] = d.split('-').map(Number)
  const next = new Date(y!, m! - 1, dd! + 1)
  const endDate = t <= f ? `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}` : d
  emit('update', { ...props.shift, start: `${d}T${f}`, end: `${endDate}T${t}` })
}
function pick(k: ShiftKind) {
  const s = shiftOf(k, date.value, props.shift.resourceId, props.shift.id)
  emit('update', { ...props.shift, ...s })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-2">
      <MChip v-for="k in kinds" :key="k.id" type="filter" :icon="k.icon" :selected="kind === k.id" @click="pick(k)">{{ k.label }}</MChip>
    </div>
    <MSelect
      :model-value="shift.resourceId"
      :options="staff.map((s) => ({ label: `${s.name} · ${s.subtitle}`, value: s.id }))"
      label="Who"
      leading-icon="person"
      @update:model-value="emit('update', { ...shift, resourceId: $event as string })"
    />
    <MDatePicker :model-value="date" label="Day" @update:model-value="$event && withTimes($event, from, to)" />
    <div class="grid grid-cols-2 gap-3">
      <MTimePicker :model-value="from" label="From" :minute-step="15" @update:model-value="$event && withTimes(date, $event, to)" />
      <MTimePicker :model-value="to" label="To" :minute-step="15" @update:model-value="$event && withTimes(date, from, $event)" />
    </div>
    <p class="text-body-medium" :class="conflict ? 'text-error' : 'text-on-surface-variant'">
      {{ hours }} hours<template v-if="conflict"> · overlaps another shift of theirs</template>
    </p>
    <MButton variant="text" icon="delete" class="self-start" @click="emit('delete')">Delete shift</MButton>
  </div>
</template>
