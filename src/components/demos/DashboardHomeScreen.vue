<script setup lang="ts">
// MDashboardGrid as a home screen people make their own: widgets of different kinds that adapt to their size
// (container queries), controls inside widgets that don't start a drag, adding from a catalog, removing, and the
// layout saved in localStorage
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MAvatar, MButton, MCheckbox, MChip, MDashboardGrid, MIcon, MIconButton } from '@m3ui-vue/m3ui-vue'
import type { DashboardItem } from '@m3ui-vue/m3ui-vue'

type Kind = 'weather' | 'clock' | 'tasks' | 'notes' | 'team' | 'focus'
type Widget = DashboardItem & { kind: Kind; label: string }

const CATALOG: Record<Kind, { label: string; icon: string; w: number; h: number; minW?: number; minH?: number }> = {
  weather: { label: 'Weather', icon: 'partly_cloudy_day', w: 6, h: 2, minW: 3 },
  clock: { label: 'Clock', icon: 'schedule', w: 3, h: 2, minW: 2 },
  tasks: { label: 'Tasks', icon: 'checklist', w: 4, h: 3, minW: 3, minH: 2 },
  notes: { label: 'Notes', icon: 'sticky_note_2', w: 4, h: 3, minW: 3, minH: 2 },
  team: { label: 'Team', icon: 'groups', w: 4, h: 2, minW: 3 },
  focus: { label: 'Focus', icon: 'timer', w: 3, h: 2, minW: 2 },
}
const DEFAULT: Widget[] = [
  { id: 'weather', kind: 'weather', label: 'Weather', x: 0, y: 0, w: 6, h: 2, minW: 3 },
  { id: 'clock', kind: 'clock', label: 'Clock', x: 6, y: 0, w: 3, h: 2, minW: 2 },
  { id: 'focus', kind: 'focus', label: 'Focus', x: 9, y: 0, w: 3, h: 2, minW: 2 },
  { id: 'tasks', kind: 'tasks', label: 'Tasks', x: 0, y: 2, w: 4, h: 3, minW: 3, minH: 2 },
  { id: 'notes', kind: 'notes', label: 'Notes', x: 4, y: 2, w: 4, h: 3, minW: 3, minH: 2 },
  { id: 'team', kind: 'team', label: 'Team', x: 8, y: 2, w: 4, h: 2, minW: 3 },
]

const KEY = 'm3-docs-dashboard-home'
function load(): Widget[] {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '')
    return Array.isArray(saved) ? saved : DEFAULT.map((w) => ({ ...w }))
  } catch {
    return DEFAULT.map((w) => ({ ...w }))
  }
}
const layout = ref<Widget[]>(load())
watch(layout, (l) => localStorage.setItem(KEY, JSON.stringify(l)), { deep: true })
const reset = () => (layout.value = DEFAULT.map((w) => ({ ...w })))

const missing = computed(() => (Object.keys(CATALOG) as Kind[]).filter((k) => !layout.value.some((w) => w.kind === k)))
/** The first spot, reading order, where a w×h widget fits without overlapping any other */
function freeSpot(w: number, h: number) {
  const taken = (x: number, y: number) => layout.value.some((o) => x < o.x + o.w && o.x < x + w && y < o.y + o.h && o.y < y + h)
  for (let y = 0; ; y++) for (let x = 0; x + w <= 12; x++) if (!taken(x, y)) return { x, y }
}
function add(kind: Kind) {
  const c = CATALOG[kind]
  layout.value = [...layout.value, { id: `${kind}-${Date.now()}`, kind, label: c.label, ...freeSpot(c.w, c.h), w: c.w, h: c.h, minW: c.minW, minH: c.minH }]
}
const remove = (id: Widget['id']) => (layout.value = layout.value.filter((w) => w.id !== id))

// Widget state
const now = ref(new Date())
let tick: ReturnType<typeof setInterval> | undefined
onMounted(() => { tick = setInterval(() => (now.value = new Date()), 1000) })
onBeforeUnmount(() => clearInterval(tick))
const time = computed(() => now.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }))
const seconds = computed(() => String(now.value.getSeconds()).padStart(2, '0'))
const date = computed(() => now.value.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }))
const FORECAST = [{ d: 'Fri', i: 'sunny', t: 27 }, { d: 'Sat', i: 'partly_cloudy_day', t: 24 }, { d: 'Sun', i: 'rainy', t: 19 }, { d: 'Mon', i: 'cloud', t: 21 }]
const tasks = ref([{ t: 'Review the dashboard PR', d: true }, { t: 'Call the supplier', d: false }, { t: 'Order the windows', d: false }, { t: 'Plan next sprint', d: false }])
const newTask = ref('')
function addTask() {
  const t = newTask.value.trim()
  if (t) tasks.value.push({ t, d: false })
  newTask.value = ''
}
const note = ref('Pick up the samples on Friday.\nAsk Ana about the new icons.')
const TEAM = [{ n: 'Ana López', s: 'online' }, { n: 'Bruno Díaz', s: 'online' }, { n: 'Carla Ruiz', s: 'away' }, { n: 'Diego Peña', s: 'offline' }, { n: 'Eva Morales', s: 'online' }]
const focusDone = 18
const focusGoal = 25
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-label-large text-on-surface-variant">Add:</span>
      <MChip v-for="k in missing" :key="k" type="assist" @click="add(k)">
        <MIcon :name="CATALOG[k].icon" :size="18" class="mr-1" />{{ CATALOG[k].label }}
      </MChip>
      <span v-if="!missing.length" class="text-body-small text-on-surface-variant">every widget is on the board</span>
      <span class="flex-1" />
      <MButton variant="text" icon="restart_alt" @click="reset">Reset</MButton>
    </div>

    <MDashboardGrid v-model="layout" :row-height="88" :gap="12" class="w-full">
      <template #item="{ item }">
        <div class="@container relative flex h-full flex-col overflow-hidden rounded-lg bg-surface-container-high text-on-surface">
          <span class="absolute right-1 top-1 z-[1] opacity-60 hover:opacity-100">
            <MIconButton icon="close" label="Remove" size="sm" data-dashboard-action @click="remove(item.id)" />
          </span>

          <!-- Weather: the forecast shows when there's room -->
          <div v-if="(item as Widget).kind === 'weather'" class="flex h-full items-center gap-6 bg-gradient-to-br from-primary-container to-tertiary-container p-4 pr-12 text-on-primary-container">
            <div class="flex flex-col">
              <span class="text-label-large opacity-80">Córdoba</span>
              <span class="text-display-small font-medium">26°</span>
              <span class="text-body-medium">Partly cloudy</span>
            </div>
            <MIcon name="partly_cloudy_day" :size="56" class="hidden @[14rem]:block" />
            <div class="ml-auto hidden gap-4 @[28rem]:flex">
              <div v-for="f in FORECAST" :key="f.d" class="flex flex-col items-center gap-1">
                <span class="text-label-medium">{{ f.d }}</span>
                <MIcon :name="f.i" :size="24" />
                <span class="text-label-large">{{ f.t }}°</span>
              </div>
            </div>
          </div>

          <!-- Clock: seconds and the date when there's room -->
          <div v-else-if="(item as Widget).kind === 'clock'" class="flex h-full flex-col items-center justify-center p-3 text-center">
            <span class="font-mono text-headline-large font-medium tabular-nums">{{ time }}<span class="hidden text-title-medium text-on-surface-variant @[12rem]:inline">:{{ seconds }}</span></span>
            <span class="text-body-small text-on-surface-variant first-letter:uppercase">{{ date }}</span>
          </div>

          <!-- Focus: a progress ring -->
          <div v-else-if="(item as Widget).kind === 'focus'" class="flex h-full items-center justify-center gap-4 p-3">
            <svg viewBox="0 0 36 36" class="size-20 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" class="stroke-surface-container-highest" stroke-width="4" />
              <circle cx="18" cy="18" r="15" fill="none" class="stroke-primary" stroke-width="4" stroke-linecap="round" :stroke-dasharray="`${(focusDone / focusGoal) * 94.2} 94.2`" />
            </svg>
            <div class="hidden flex-col @[13rem]:flex">
              <span class="text-title-large">{{ focusDone }} / {{ focusGoal }} min</span>
              <span class="text-body-small text-on-surface-variant">Focus today</span>
            </div>
          </div>

          <!-- Tasks: a checklist that fills the widget, with progress and a field to add more -->
          <div v-else-if="(item as Widget).kind === 'tasks'" class="flex h-full flex-col p-3">
            <span class="flex items-center gap-2 pr-8 text-title-small"><MIcon name="checklist" :size="20" />Tasks<span class="ml-auto text-label-medium text-on-surface-variant">{{ tasks.filter((t) => t.d).length }}/{{ tasks.length }}</span></span>
            <div class="mb-1 mt-2 h-1 overflow-hidden rounded-full bg-surface-container-highest">
              <div class="h-full rounded-full bg-primary transition-[width] duration-300" :style="{ width: `${tasks.length ? (tasks.filter((t) => t.d).length / tasks.length) * 100 : 0}%` }" />
            </div>
            <ul class="min-h-0 flex-1 divide-y divide-outline-variant/50 overflow-y-auto">
              <li v-for="(t, i) in tasks" :key="i" class="flex items-center py-0.5">
                <MCheckbox v-model="t.d" :label="t.t" class="min-w-0 flex-1" :class="t.d ? 'line-through opacity-60' : ''" />
              </li>
            </ul>
            <input
              v-model="newTask"
              aria-label="Add a task"
              placeholder="+ Add a task"
              class="mt-1 w-full rounded-md bg-surface-container-highest px-3 py-2 text-body-medium outline-none placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary"
              @keydown.enter="addTask"
            >
          </div>

          <!-- Notes: a text field inside -->
          <div v-else-if="(item as Widget).kind === 'notes'" class="flex h-full flex-col gap-1 bg-tertiary-container/50 p-3 pr-10 text-on-tertiary-container">
            <span class="flex items-center gap-2 text-title-small"><MIcon name="sticky_note_2" :size="20" />Notes</span>
            <!-- A sticky note: the text fills the widget, whatever its size -->
            <textarea
              v-model="note"
              aria-label="Notes"
              class="min-h-0 w-full flex-1 resize-none bg-transparent text-body-large leading-7 outline-none placeholder:text-on-tertiary-container/60"
              placeholder="Write something…"
            />
          </div>

          <!-- Team: more people as it grows -->
          <div v-else-if="(item as Widget).kind === 'team'" class="flex h-full flex-col p-3 pr-10">
            <span class="mb-2 flex items-center gap-2 text-title-small"><MIcon name="groups" :size="20" />Team · {{ TEAM.filter((p) => p.s === 'online').length }} online</span>
            <div class="flex flex-wrap gap-3">
              <div v-for="p in TEAM" :key="p.n" class="flex items-center gap-2">
                <span class="relative">
                  <MAvatar :name="p.n" :size="32" />
                  <span class="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-surface-container-high" :class="p.s === 'online' ? 'bg-success' : p.s === 'away' ? 'bg-tertiary' : 'bg-outline'" />
                </span>
                <span class="hidden text-body-small @[22rem]:inline">{{ p.n.split(' ')[0] }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </MDashboardGrid>
  </div>
</template>
