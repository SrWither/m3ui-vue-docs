<script setup lang="ts">
import { computed, ref } from 'vue'
import { MAvatar, MButton, MDateRangePickerModal, MDialog, MScheduler, MSegmentedButton, MSelect, MTextField } from '@m3ui-vue/m3ui-vue'
import type { DateRange, SchedulerEvent } from '@m3ui-vue/m3ui-vue'
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

// Dates relative to this week, so every demo shows something whenever you open the page.
const pad = (n: number) => String(n).padStart(2, '0')
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const monday = (() => {
  const d = new Date()
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return d
})()
/** Day `offset` of this week (0 = Monday), as a date or a date-time. */
function day(offset: number, time?: string) {
  const d = new Date(monday)
  d.setDate(d.getDate() + offset)
  return time ? `${iso(d)}T${time}` : iso(d)
}

// ── Team week ─────────────────────────────────────────────────────────────────────────────────
const teamEvents: SchedulerEvent[] = [
  { id: 'offsite', title: 'Design offsite', start: day(1, '09:00'), end: day(3, '17:00'), color: 'tertiary' },
  { id: 'holiday', title: 'Public holiday', start: day(4), end: day(4), allDay: true, color: 'success' },
  { id: 'oncall', title: 'On call: Sam', start: day(0), end: day(6), allDay: true, color: 'secondary' },
  { id: 'standup-0', title: 'Standup', start: day(0, '09:30'), end: day(0, '09:45') },
  { id: 'standup-1', title: 'Standup', start: day(1, '09:30'), end: day(1, '09:45') },
  { id: 'standup-3', title: 'Standup', start: day(3, '09:30'), end: day(3, '09:45') },
  { id: 'planning', title: 'Sprint planning', start: day(0, '10:00'), end: day(0, '11:30') },
  { id: 'review', title: 'Design review', start: day(0, '11:00'), end: day(0, '12:00'), color: 'tertiary' },
  { id: 'lunch', title: 'Team lunch', start: day(0, '12:30'), end: day(0, '13:30'), color: 'success' },
  { id: 'interview', title: 'Interview', start: day(2, '15:00'), end: day(2, '16:00'), color: 'error' },
  { id: 'oneone', title: '1:1 with Alex', start: day(2, '15:30'), end: day(2, '16:00'), color: 'secondary' },
  { id: 'focus', title: 'Focus time', start: day(2, '10:00'), end: day(2, '12:30'), color: 'secondary' },
  { id: 'demo', title: 'Demo day', start: day(5, '16:00'), end: day(5, '17:30') },
]

// ── Controlled ────────────────────────────────────────────────────────────────────────────────
const controlledDate = ref(day(0))
const controlledView = ref<'week' | 'day'>('week')
const sprintStarts = [0, 14, 28].map((n) => ({ label: `Sprint ${n / 14 + 1}`, value: day(n) }))
const controlledLabel = computed(() =>
  new Date(`${controlledDate.value}T00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
)
const sprintEvents: SchedulerEvent[] = [0, 14, 28].flatMap((n, i) => [
  { id: `sprint-${i}`, title: `Sprint ${i + 1}`, start: day(n), end: day(n + 11), allDay: true, color: (['primary', 'tertiary', 'secondary'] as const)[i] },
  { id: `plan-${i}`, title: 'Planning', start: day(n, '10:00'), end: day(n, '11:00') },
  { id: `retro-${i}`, title: 'Retro', start: day(n + 11, '15:00'), end: day(n + 11, '16:00'), color: 'tertiary' },
])

// ── Multi-day ─────────────────────────────────────────────────────────────────────────────────
const longEvents = ref<SchedulerEvent[]>([
  { id: 'trip', title: 'Trip to Lisbon', start: day(4), end: day(8), allDay: true, color: 'tertiary' },
  { id: 'hackathon', title: 'Hackathon', start: day(1, '18:00'), end: day(2, '14:00'), color: 'error' },
])
const longTitle = ref('Conference')
const longRange = ref<DateRange>({ start: day(2), end: day(4) })
const pickingRange = ref(false)
const longKind = ref<'allDay' | 'timed'>('allDay')
const hourOptions = Array.from({ length: 15 }, (_, i) => ({ label: `${pad(i + 7)}:00`, value: i + 7 }))
const longFrom = ref(9)
const longTo = ref(17)
const longDate = ref(day(0))
const rangeLabel = computed(() => {
  const f = (d: string | null) => (d ? new Date(`${d}T00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '…')
  return `${f(longRange.value.start)} – ${f(longRange.value.end)}`
})
const canAddLong = computed(() => !!longRange.value.start && !!longRange.value.end)
function addLong() {
  const { start, end } = longRange.value
  if (!start || !end) return
  const event: SchedulerEvent =
    longKind.value === 'allDay'
      ? { id: `long-${Date.now()}`, title: longTitle.value || 'Untitled', start, end, allDay: true, color: 'secondary' }
      : { id: `long-${Date.now()}`, title: longTitle.value || 'Untitled', start: `${start}T${pad(longFrom.value)}:00`, end: `${end}T${pad(longTo.value)}:00`, color: 'primary' }
  longEvents.value = [...longEvents.value, event]
  longDate.value = start
}

// ── Booking ───────────────────────────────────────────────────────────────────────────────────
const bookings = ref<SchedulerEvent[]>([
  { id: 'b1', title: 'Room A · Ana', start: day(1, '10:00'), end: day(1, '11:00') },
  { id: 'b2', title: 'Room A · Luis', start: day(3, '14:00'), end: day(3, '15:30'), color: 'tertiary' },
])
const draft = ref({ open: false, date: '', hour: 9, title: '', duration: 60 })
const durations = [30, 60, 90, 120].map((m) => ({ label: `${m} min`, value: m }))
function onSlot(slot: { date: string; hour: number }) {
  draft.value = { open: true, date: slot.date, hour: slot.hour, title: '', duration: 60 }
}
function book() {
  const { date, hour, title, duration } = draft.value
  const end = new Date(`${date}T${pad(hour)}:00`)
  end.setMinutes(end.getMinutes() + duration)
  bookings.value = [...bookings.value, { id: `b${Date.now()}`, title: title || 'Room A', start: `${date}T${pad(hour)}:00`, end: `${iso(end)}T${pad(end.getHours())}:${pad(end.getMinutes())}`, color: 'secondary' }]
  draft.value.open = false
}
const removing = ref<SchedulerEvent | null>(null)
const removingOpen = computed({ get: () => !!removing.value, set: (v) => { if (!v) removing.value = null } })
function remove() {
  bookings.value = bookings.value.filter((b) => b.id !== removing.value?.id)
  removing.value = null
}

// ── Custom content ────────────────────────────────────────────────────────────────────────────
const classes: (SchedulerEvent & { coach: string; room: string })[] = [
  { id: 'c1', title: 'Yoga', coach: 'Maya Lin', room: 'Studio 1', start: day(0, '07:00'), end: day(0, '08:00'), color: 'success' },
  { id: 'c2', title: 'Spin', coach: 'Diego Ruiz', room: 'Bike room', start: day(1, '18:00'), end: day(1, '19:00'), color: 'error' },
  { id: 'c3', title: 'Pilates', coach: 'Ana Costa', room: 'Studio 2', start: day(2, '08:00'), end: day(2, '09:00'), color: 'tertiary' },
  { id: 'c4', title: 'HIIT', coach: 'Diego Ruiz', room: 'Main floor', start: day(3, '18:30'), end: day(3, '19:15'), color: 'error' },
  { id: 'c5', title: 'Yoga', coach: 'Maya Lin', room: 'Studio 1', start: day(5, '09:00'), end: day(5, '10:30'), color: 'success' },
  { id: 'c6', title: 'Open gym', coach: 'Staff', room: 'Main floor', start: day(6, '10:00'), end: day(6, '13:00'), color: 'secondary' },
]
const classOf = (e: SchedulerEvent) => classes.find((c) => c.id === e.id)!

// ── Tables ────────────────────────────────────────────────────────────────────────────────────
const schedulerProps: PropDef[] = [
  { name: 'events', type: 'SchedulerEvent[]', default: '[]', description: 'Events to show (see the type below)' },
  { name: 'view', type: "'week' | 'day'", default: "'week'", description: 'View mode. Use v-model:view to follow the Day/Week toggle' },
  { name: 'date', type: 'string', default: 'today', description: 'The date shown, YYYY-MM-DD. Use v-model:date to follow navigation, or set it to jump to a date' },
  { name: 'startHour', type: 'number', default: '7', description: 'First visible hour' },
  { name: 'endHour', type: 'number', default: '22', description: 'Hour the grid ends at' },
  { name: 'weekStartsOn', type: '0 | 1', default: '1', description: 'First day of the week: 0 = Sunday, 1 = Monday' },
  { name: 'hourHeight', type: 'number', default: '56', description: 'Height of one hour, in px' },
  { name: 'nowIndicator', type: 'boolean', default: 'true', description: "A line across today's column at the current time" },
  { name: 'locale', type: 'string', description: "Locale for dates and times (Intl). Falls back to the app's configured locale" },
  { name: 'prevLabel', type: 'string', description: 'Aria label of the previous button (defaults to the locale string)' },
  { name: 'nextLabel', type: 'string', description: 'Aria label of the next button (defaults to the locale string)' },
  { name: 'todayLabel', type: 'string', description: 'Label of the Today button (defaults to the locale string)' },
  { name: 'dayViewLabel', type: 'string', description: 'Label of the Day toggle (defaults to the locale string)' },
  { name: 'weekViewLabel', type: 'string', description: 'Label of the Week toggle (defaults to the locale string)' },
  { name: 'allDayLabel', type: 'string', description: 'Label of the all-day row (defaults to the locale string)' },
]

const schedulerEventsTable: EventDef[] = [
  { name: 'eventClick', payload: 'SchedulerEvent', description: 'An event (in the grid or the all-day row) was clicked' },
  { name: 'slotClick', payload: '{ date: string; hour: number }', description: 'An empty spot in the grid was clicked' },
  { name: 'update:date', payload: 'string', description: 'Navigation changed the date shown (YYYY-MM-DD)' },
  { name: 'update:view', payload: "'week' | 'day'", description: 'The Day/Week toggle (or a day header) changed the view' },
]

const schedulerSlots: SlotDef[] = [
  { name: 'event', scope: '{ event: SchedulerEvent, allDay: boolean }', description: 'Content of each event block; allDay is true in the all-day row' },
]

const schedulerTypes: TypeDef[] = [
  {
    name: 'SchedulerEvent',
    fields: [
      { name: 'id', type: 'string | number', required: true, description: 'Unique identifier' },
      { name: 'title', type: 'string', required: true, description: 'Event label' },
      { name: 'start', type: 'string', required: true, description: "A date-time ('2026-10-17T09:30'); a date ('2026-10-17') for all-day events" },
      { name: 'end', type: 'string', required: true, description: 'A date-time (exclusive); for all-day events, the last day (inclusive)' },
      { name: 'allDay', type: 'boolean', description: 'Shown in the all-day row. Events that span more than one day go there too' },
      { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error' | 'success'", description: 'Block color, primary by default' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MScheduler</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A week or day calendar grid. Events sit at their exact times, overlapping ones share the width, and anything that
      lasts all day or spans several days runs across the all-day row. Click a day header to open that day. Dates and
      times follow the app's locale.
    </p>

    <ComponentDemo
      title="A Team's Week"
      description="Overlapping meetings side by side, a three-day offsite and an on-call week in the all-day row, a holiday, and a line at the current time."
      :code="`<MScheduler :events=&quot;events&quot; :start-hour=&quot;8&quot; :end-hour=&quot;19&quot; class=&quot;h-[620px]&quot; />`"
      :script="`const events: SchedulerEvent[] = [
  { id: 'offsite', title: 'Design offsite', start: '2026-10-13T09:00', end: '2026-10-15T17:00', color: 'tertiary' },
  { id: 'holiday', title: 'Public holiday', start: '2026-10-16', end: '2026-10-16', allDay: true, color: 'success' },
  { id: 'planning', title: 'Sprint planning', start: '2026-10-12T10:00', end: '2026-10-12T11:30' },
  { id: 'review', title: 'Design review', start: '2026-10-12T11:00', end: '2026-10-12T12:00', color: 'tertiary' },
  // …
]`"
    >
      <MScheduler :events="teamEvents" :start-hour="8" :end-hour="19" class="h-[620px] w-full" />
    </ComponentDemo>

    <ComponentDemo
      title="Controlled Date and View"
      description="v-model:date and v-model:view keep your own controls in sync with the scheduler's: jump to a sprint, and the label follows the arrows and the Day/Week toggle."
      :code="`<MSegmentedButton v-model=&quot;date&quot; :options=&quot;sprints&quot; />
<p>{{ date }} · {{ view }}</p>
<MScheduler v-model:date=&quot;date&quot; v-model:view=&quot;view&quot; :events=&quot;events&quot; />`"
      :script="`const date = ref('2026-10-12')
const view = ref<'week' | 'day'>('week')
const sprints = [
  { label: 'Sprint 1', value: '2026-10-12' },
  { label: 'Sprint 2', value: '2026-10-26' },
  { label: 'Sprint 3', value: '2026-11-09' },
]`"
    >
      <div class="flex w-full flex-col gap-3">
        <div class="flex flex-wrap items-center gap-3">
          <MSegmentedButton v-model="controlledDate" :options="sprintStarts" />
          <span class="text-body-medium text-on-surface-variant">{{ controlledLabel }} · {{ controlledView }} view</span>
        </div>
        <MScheduler v-model:date="controlledDate" v-model:view="controlledView" :events="sprintEvents" :start-hour="9" :end-hour="17" :hour-height="44" class="h-[520px]" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Adding Multi-day Events"
      description="Anything that lasts more than a day runs across the all-day row: an all-day event (start and end are dates, the end inclusive) or a timed one that crosses midnight (start and end are date-times). Pick dates and add one; the scheduler jumps to its week. Events that continue past the week show an arrow."
      :code="`<MTextField v-model=&quot;title&quot; label=&quot;Title&quot; />
<MButton variant=&quot;outlined&quot; icon=&quot;date_range&quot; @click=&quot;picking = true&quot;>{{ rangeLabel }}</MButton>
<MDateRangePickerModal v-model=&quot;range&quot; v-model:show=&quot;picking&quot; />
<MButton @click=&quot;add&quot;>Add</MButton>

<MScheduler v-model:date=&quot;date&quot; :events=&quot;events&quot; />`"
      :script="`function add() {
  const { start, end } = range.value
  events.value.push(
    allDay
      // All day: dates, end inclusive
      ? { id: crypto.randomUUID(), title: title.value, start, end, allDay: true }
      // Timed across days: date-times
      : { id: crypto.randomUUID(), title: title.value, start: \`\${start}T09:00\`, end: \`\${end}T17:00\` },
  )
  date.value = start // show its week
}`"
    >
      <div class="flex w-full flex-col gap-4">
        <div class="flex flex-wrap items-end gap-3">
          <MTextField v-model="longTitle" label="Title" class="w-48" />
          <MButton variant="outlined" icon="date_range" @click="pickingRange = true">{{ rangeLabel }}</MButton>
          <MDateRangePickerModal v-model="longRange" v-model:show="pickingRange" title="Event dates" />
          <MSegmentedButton v-model="longKind" :options="[{ value: 'allDay', label: 'All day' }, { value: 'timed', label: 'Timed' }]" density="compact" />
          <template v-if="longKind === 'timed'">
            <MSelect v-model="longFrom" :options="hourOptions" label="Starts" class="w-28" />
            <MSelect v-model="longTo" :options="hourOptions" label="Ends" class="w-28" />
          </template>
          <MButton icon="add" :disabled="!canAddLong" @click="addLong">Add</MButton>
        </div>
        <MScheduler v-model:date="longDate" :events="longEvents" :start-hour="8" :end-hour="20" :hour-height="40" class="h-[480px]" @event-click="(e) => (longEvents = longEvents.filter((x) => x.id !== e.id))" />
        <p class="text-body-small text-on-surface-variant">Click an event to remove it.</p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Booking"
      description="slotClick and eventClick are all an editor needs: click an empty hour to book the room, click a booking to cancel it. Sunday-first weeks with weekStartsOn."
      :code="`<MScheduler
  :events=&quot;bookings&quot;
  :week-starts-on=&quot;0&quot;
  @slot-click=&quot;openDraft&quot;
  @event-click=&quot;(e) => (removing = e)&quot;
/>`"
      :script="`function openDraft({ date, hour }) {
  draft.value = { open: true, date, hour, title: '', duration: 60 }
}`"
    >
      <div class="w-full">
        <MScheduler :events="bookings" :week-starts-on="0" :start-hour="8" :end-hour="18" class="h-[560px]" @slot-click="onSlot" @event-click="(e) => (removing = e)" />
        <MDialog v-model="draft.open" title="Book Room A" max-width="400px">
          <div class="flex flex-col gap-4 pt-2">
            <p class="text-body-medium text-on-surface-variant">
              {{ new Date(`${draft.date}T00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) }} at {{ pad(draft.hour) }}:00
            </p>
            <MTextField v-model="draft.title" label="Who's booking?" />
            <MSelect v-model="draft.duration" :options="durations" label="Duration" />
          </div>
          <template #actions>
            <MButton variant="text" @click="draft.open = false">Cancel</MButton>
            <MButton @click="book">Book</MButton>
          </template>
        </MDialog>
        <MDialog v-model="removingOpen" title="Cancel this booking?" max-width="360px">
          <p class="text-body-medium text-on-surface-variant">{{ removing?.title }}</p>
          <template #actions>
            <MButton variant="text" @click="removing = null">Keep</MButton>
            <MButton color="error" @click="remove">Cancel booking</MButton>
          </template>
        </MDialog>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Event Content"
      description="The #event slot replaces each block's content, here a gym timetable with the coach and the room. The events can carry extra fields of your own."
      :code="`<MScheduler :events=&quot;classes&quot; :start-hour=&quot;6&quot; :end-hour=&quot;21&quot; :hour-height=&quot;64&quot;>
  <template #event=&quot;{ event }&quot;>
    <div class=&quot;flex items-center gap-1.5&quot;>
      <MAvatar :name=&quot;event.coach&quot; :size=&quot;20&quot; />
      <span class=&quot;truncate text-label-medium font-medium&quot;>{{ event.title }}</span>
    </div>
    <p class=&quot;truncate text-label-small opacity-80&quot;>{{ event.room }}</p>
  </template>
</MScheduler>`"
    >
      <MScheduler :events="classes" :start-hour="6" :end-hour="21" :hour-height="64" class="h-[600px] w-full">
        <template #event="{ event }">
          <div class="flex items-center gap-1.5">
            <MAvatar :name="classOf(event).coach" :size="20" />
            <span class="truncate text-label-medium font-medium">{{ event.title }}</span>
          </div>
          <p class="truncate text-label-small opacity-80">{{ classOf(event).room }} · {{ classOf(event).coach }}</p>
        </template>
      </MScheduler>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="schedulerProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="schedulerEventsTable" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="schedulerSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="schedulerTypes" />

    <ComponentPager current="MScheduler" />
  </div>
</template>
