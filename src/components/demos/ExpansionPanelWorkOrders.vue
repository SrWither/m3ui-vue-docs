<script setup lang="ts">
// MExpansionPanel with everything custom: a searchable list of work orders, highlighted titles, status icons,
// a progress ring that follows the ticked tasks, edge-to-edge task lists, one open at a time
import { computed, ref } from 'vue'
import { MCircleProgressBar, MExpansionPanel, MIcon, MListItem, MTextField } from '@m3ui-vue/m3ui-vue'

type Status = 'late' | 'active' | 'done' | 'paused'
interface Order {
  id: string
  name: string
  client: string
  due: string
  status: Status
  tags: string[]
  tasks: { label: string; done: boolean }[]
}

const orders = ref<Order[]>([
  { id: 'n', name: 'Obra Norte — Torre A', client: 'Constructora Andes', due: '2026-11-30', status: 'late', tags: ['Structure', 'Urgent'],
    tasks: [{ label: 'Pour the 4th floor slab', done: true }, { label: 'Scaffolding inspection', done: false }, { label: 'Order the windows', done: false }] },
  { id: 's', name: 'Obra Sur — Casa Paz', client: 'Familia Paz', due: '2026-12-12', status: 'active', tags: ['Finishes'],
    tasks: [{ label: 'Kitchen tiles', done: true }, { label: 'Paint the facade', done: true }, { label: 'Install the boiler', done: false }, { label: 'Final cleaning', done: false }] },
  { id: 'c', name: 'Oficinas Centro — Piso 3', client: 'Estudio Lumen', due: '2026-11-20', status: 'done', tags: ['Interiors'],
    tasks: [{ label: 'Partition walls', done: true }, { label: 'Lighting', done: true }] },
  { id: 'g', name: 'Galpón Oeste — Tablero', client: 'Logística Río', due: '2026-12-20', status: 'paused', tags: ['Electrical'],
    tasks: [{ label: 'Wait for the permit', done: false }, { label: 'Replace the main panel', done: false }] },
  { id: 'p', name: 'Plaza Belgrano — Bancos', client: 'Municipalidad', due: '2027-01-15', status: 'active', tags: ['Public'], tasks: [] },
])

// Each status tints its whole panel: a container-colored background and an accent stripe on the left. Theme roles
// (error, primary, success) follow the palette and dark mode; Paused uses a color of its own, outside the theme
const STATUS: Record<Status, { icon: string; label: string; bubble: string; ring: string; panel: string; style?: Record<string, string> }> = {
  late: { icon: 'warning', label: 'Late', bubble: 'bg-error text-on-error', ring: 'error', panel: 'bg-error-container/35 border-l-4 border-l-error' },
  active: { icon: 'construction', label: 'In progress', bubble: 'bg-primary text-on-primary', ring: 'primary', panel: 'bg-primary-container/30 border-l-4 border-l-primary' },
  done: { icon: 'task_alt', label: 'Done', bubble: 'bg-success text-on-success', ring: 'var(--color-success)', panel: 'bg-success-container/35 border-l-4 border-l-success' },
  paused: {
    icon: 'pause_circle', label: 'Paused', bubble: 'text-[#fff]', ring: '#7c4dff', panel: 'border-l-4',
    style: { background: 'color-mix(in srgb, #7c4dff 16%, transparent)', borderLeftColor: '#7c4dff' },
  },
}
const PAUSED_BUBBLE = { background: '#7c4dff' }

// Tags in colors of their own, any CSS color
const TAG_COLORS: Record<string, string> = {
  Structure: '#1e88e5', Urgent: '#e53935', Finishes: '#ab47bc', Interiors: '#00897b', Public: '#43a047', Electrical: '#f9a825',
}
const tagStyle = (t: string) => {
  const c = TAG_COLORS[t] ?? '#78909c'
  return { color: c, borderColor: c, background: `color-mix(in srgb, ${c} 14%, transparent)` }
}

const query = ref('')
const open = ref<string | null>('n')

const fold = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const shown = computed(() => {
  const q = fold(query.value.trim())
  return q ? orders.value.filter((o) => fold(`${o.name} ${o.client}`).includes(q)) : orders.value
})

/** The title split around the search match, to highlight it */
function parts(text: string) {
  const q = fold(query.value.trim())
  const i = q ? fold(text).indexOf(q) : -1
  if (i < 0) return [{ text, hit: false }]
  return [
    { text: text.slice(0, i), hit: false },
    { text: text.slice(i, i + q.length), hit: true },
    { text: text.slice(i + q.length), hit: false },
  ].filter((p) => p.text)
}

const progress = (o: Order) => (o.tasks.length ? Math.round((o.tasks.filter((t) => t.done).length / o.tasks.length) * 100) : 0)
const left = (o: Order) => o.tasks.filter((t) => !t.done).length
const dateFmt = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' })
const dueText = (o: Order) => dateFmt.format(new Date(`${o.due}T12:00:00`))
</script>

<template>
  <div class="flex w-full max-w-2xl flex-col gap-3">
    <MTextField v-model="query" label="Search orders or clients" leading-icon="search" clearable variant="outlined" />

    <MExpansionPanel
      v-for="o in shown"
      :key="o.id"
      :model-value="open === o.id"
      :expandable="o.tasks.length > 0"
      :class="STATUS[o.status].panel"
      :style="STATUS[o.status].style"
      flush
      @update:model-value="(v: boolean) => (open = v ? o.id : null)"
    >
      <!-- Status, as a colored icon -->
      <template #leading>
        <span class="grid size-10 shrink-0 place-items-center rounded-full" :class="STATUS[o.status].bubble" :style="o.status === 'paused' ? PAUSED_BUBBLE : undefined" :title="STATUS[o.status].label">
          <MIcon :name="STATUS[o.status].icon" :size="22" />
        </span>
      </template>

      <!-- The search match, highlighted -->
      <template #title>
        <span class="block truncate">
          <template v-for="(p, i) in parts(o.name)" :key="i">
            <mark v-if="p.hit" class="rounded-xs bg-tertiary-container px-0.5 text-on-tertiary-container">{{ p.text }}</mark>
            <template v-else>{{ p.text }}</template>
          </template>
        </span>
      </template>

      <!-- Client, due date, tags -->
      <template #subtitle>
        <span class="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span class="inline-flex items-center gap-1"><MIcon name="apartment" :size="14" />{{ o.client }}</span>
          <span class="inline-flex items-center gap-1" :class="o.status === 'late' ? 'text-error' : ''"><MIcon name="event" :size="14" />{{ dueText(o) }}</span>
          <span v-for="t in o.tags" :key="t" class="rounded-sm border px-1.5 text-label-small font-medium" :style="tagStyle(t)">{{ t }}</span>
          <span v-if="!o.tasks.length" class="italic">No tasks yet</span>
        </span>
      </template>

      <!-- Progress, following the ticked tasks -->
      <template #trailing>
        <span v-if="o.tasks.length" class="flex shrink-0 items-center gap-2">
          <span class="hidden text-label-medium text-on-surface-variant sm:inline">{{ left(o) ? `${left(o)} left` : 'All done' }}</span>
          <MCircleProgressBar :value="progress(o)" :size="40" :thickness="3" variant="circle" :color="STATUS[o.status].ring">
            <span class="text-label-small text-on-surface">{{ o.tasks.length - left(o) }}/{{ o.tasks.length }}</span>
          </MCircleProgressBar>
        </span>
      </template>

      <!-- Edge to edge: a checklist -->
      <MListItem
        v-for="(t, i) in o.tasks"
        :key="i"
        :title="t.label"
        trailing="checkbox"
        :trailing-value="t.done"
        :class="t.done ? 'text-on-surface-variant line-through' : ''"
        @update:trailing-value="(v: boolean) => (t.done = v)"
      />
    </MExpansionPanel>

    <p v-if="!shown.length" class="px-1 text-body-medium text-on-surface-variant">No orders match “{{ query }}”.</p>
  </div>
</template>
