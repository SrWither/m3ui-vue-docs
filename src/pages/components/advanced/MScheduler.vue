<script setup lang="ts">
import { MScheduler } from '@m3ui-vue/m3ui-vue'
import type { SchedulerEvent } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

function getWeekDate(dayOffset: number, hour: number, min = 0) {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff + dayOffset)
  d.setHours(hour, min, 0, 0)
  return d.toISOString()
}

const schedulerEvents: SchedulerEvent[] = [
  { id: '1', title: 'Standup', start: getWeekDate(0, 9), end: getWeekDate(0, 9, 30), color: 'primary' },
  { id: '2', title: 'Design Review', start: getWeekDate(1, 14), end: getWeekDate(1, 15, 30), color: 'tertiary' },
  { id: '3', title: 'Sprint Planning', start: getWeekDate(3, 10), end: getWeekDate(3, 12), color: 'secondary' },
]

const todayEvents: SchedulerEvent[] = [
  { id: '1', title: 'Standup', start: getWeekDate(0, 9), end: getWeekDate(0, 9, 30), color: 'primary' },
  { id: '2', title: 'Focus Block', start: getWeekDate(0, 11), end: getWeekDate(0, 13), color: 'tertiary' },
]

const schedulerProps: PropDef[] = [
  { name: 'events', type: 'SchedulerEvent[]', default: '[]', description: 'Array of time-based events (see the type below)' },
  { name: 'view', type: "'week' | 'day'", default: "'week'", description: 'View mode' },
  { name: 'startHour', type: 'number', default: '7', description: 'First visible hour on the grid' },
  { name: 'endHour', type: 'number', default: '22', description: 'Last visible hour on the grid' },
  { name: 'locale', type: 'string', default: "'es-ES'", description: 'Locale for date/time formatting, via Intl.DateTimeFormat' },
  { name: 'prevLabel', type: 'string', description: "Aria label for the previous-navigation button — falls back to the locale's own string when unset" },
  { name: 'nextLabel', type: 'string', description: "Aria label for the next-navigation button — falls back to the locale's own string when unset" },
  { name: 'todayLabel', type: 'string', description: "Label for the Today button — falls back to the locale's own string when unset" },
  { name: 'dayViewLabel', type: 'string', description: "Label for the Day view toggle — falls back to the locale's own string when unset" },
  { name: 'weekViewLabel', type: 'string', description: "Label for the Week view toggle — falls back to the locale's own string when unset" },
]

const schedulerEventsTable: EventDef[] = [
  { name: 'eventClick', payload: 'SchedulerEvent', description: 'Emitted when an event block is clicked' },
  { name: 'slotClick', payload: '{ date: string; hour: number }', description: 'Emitted when an empty grid cell is clicked' },
]

const schedulerTypes: TypeDef[] = [
  {
    name: 'SchedulerEvent',
    fields: [
      { name: 'id', type: 'string | number', required: true, description: 'Unique identifier' },
      { name: 'title', type: 'string', required: true, description: 'Event label' },
      { name: 'start', type: 'string', required: true, description: 'ISO datetime' },
      { name: 'end', type: 'string', required: true, description: 'ISO datetime' },
      { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error' | 'success'", description: 'Block color — defaults to primary' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MScheduler</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A week or day time-grid scheduler, placing events by their start/end ISO datetimes.
    </p>

    <ComponentDemo
      title="Weekly Scheduler"
      description="Week view scheduler with time-based events. Events are placed on the grid based on their start/end ISO datetimes."
      :code="`<MScheduler :events=&quot;events&quot; view=&quot;week&quot; :start-hour=&quot;8&quot; :end-hour=&quot;18&quot; locale=&quot;en-US&quot; />`"
      :script="`import type { SchedulerEvent } from '@m3ui-vue/m3ui-vue'

function getWeekDate(dayOffset: number, hour: number, min = 0) {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff + dayOffset)
  d.setHours(hour, min, 0, 0)
  return d.toISOString()
}

const events: SchedulerEvent[] = [
  { id: '1', title: 'Standup', start: getWeekDate(0, 9), end: getWeekDate(0, 9, 30), color: 'primary' },
  { id: '2', title: 'Design Review', start: getWeekDate(1, 14), end: getWeekDate(1, 15, 30), color: 'tertiary' },
  { id: '3', title: 'Sprint Planning', start: getWeekDate(3, 10), end: getWeekDate(3, 12), color: 'secondary' },
]`"
    >
      <div class="w-full">
        <MScheduler :events="schedulerEvents" view="week" :start-hour="8" :end-hour="18" locale="en-US" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Day View"
      description="view='day' collapses the grid to a single column for the current day — the Day/Week toggle in the header lets the user switch at runtime too."
      :code="`<MScheduler :events=&quot;events&quot; view=&quot;day&quot; :start-hour=&quot;8&quot; :end-hour=&quot;18&quot; locale=&quot;en-US&quot; />`"
    >
      <div class="w-full">
        <MScheduler :events="todayEvents" view="day" :start-hour="8" :end-hour="18" locale="en-US" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="schedulerProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="schedulerEventsTable" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="schedulerTypes" />

    <ComponentPager current="MScheduler" />
  </div>
</template>
