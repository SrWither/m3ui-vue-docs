<script setup lang="ts">
import { MCalendar } from '@m3ui-vue/m3ui-vue'
import type { CalendarEvent } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const calendarEvents: CalendarEvent[] = [
  { id: '1', title: 'Team Meeting', date: '2026-06-05', color: 'primary', icon: 'groups' },
  { id: '2', title: 'Release v2', date: '2026-06-12', color: 'success', icon: 'rocket_launch' },
  { id: '3', title: 'Code Review', date: '2026-06-18', color: 'tertiary', icon: 'code' },
  { id: '4', title: 'Bug Bash', date: '2026-06-25', color: 'error', icon: 'bug_report' },
]

const calendarProps: PropDef[] = [
  { name: 'events', type: 'CalendarEvent[]', default: '[]', description: 'Array of events to render on the grid (see the type below)' },
  { name: 'locale', type: 'string', default: "'es-ES'", description: 'Locale for month/weekday names, via Intl.DateTimeFormat' },
  { name: 'todayLabel', type: 'string', description: "Label for the Today button — falls back to the locale's own string when unset" },
  { name: 'prevMonthLabel', type: 'string', description: "Aria label for the previous-month button — falls back to the locale's own string when unset" },
  { name: 'nextMonthLabel', type: 'string', description: "Aria label for the next-month button — falls back to the locale's own string when unset" },
]

const calendarEventsTable: EventDef[] = [
  { name: 'dateClick', payload: 'string (YYYY-MM-DD)', description: 'Emitted when an empty part of a day cell is clicked' },
  { name: 'eventClick', payload: 'CalendarEvent', description: 'Emitted when an event pill is clicked' },
]

const calendarTypes: TypeDef[] = [
  {
    name: 'CalendarEvent',
    fields: [
      { name: 'id', type: 'string | number', required: true, description: 'Unique identifier' },
      { name: 'title', type: 'string', required: true, description: 'Event label' },
      { name: 'date', type: 'string', required: true, description: 'ISO date, YYYY-MM-DD' },
      { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error' | 'success'", description: 'Pill color — defaults to primary' },
      { name: 'icon', type: 'string', description: 'Material Symbol icon shown before the title' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCalendar</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A monthly calendar grid with color-coded, clickable events.
    </p>

    <ComponentDemo
      title="Calendar with Events"
      description="Monthly calendar view with color-coded events and icons."
      :code="`<MCalendar :events=&quot;events&quot; locale=&quot;en-US&quot; />`"
      :script="`import type { CalendarEvent } from '@m3ui-vue/m3ui-vue'

const events: CalendarEvent[] = [
  { id: '1', title: 'Team Meeting', date: '2026-06-05', color: 'primary', icon: 'groups' },
  { id: '2', title: 'Release v2', date: '2026-06-12', color: 'success', icon: 'rocket_launch' },
  { id: '3', title: 'Code Review', date: '2026-06-18', color: 'tertiary', icon: 'code' },
  { id: '4', title: 'Bug Bash', date: '2026-06-25', color: 'error', icon: 'bug_report' },
]`"
    >
      <div class="w-full">
        <MCalendar :events="calendarEvents" locale="en-US" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Labels"
      description="Override the Today button text and prev/next-month aria labels independently of the active locale."
      :code="`<MCalendar
  :events=&quot;events&quot;
  today-label=&quot;Jump to today&quot;
  prev-month-label=&quot;Go back a month&quot;
  next-month-label=&quot;Go forward a month&quot;
/>`"
    >
      <div class="w-full">
        <MCalendar
          :events="calendarEvents"
          locale="en-US"
          today-label="Jump to today"
          prev-month-label="Go back a month"
          next-month-label="Go forward a month"
        />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="calendarProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="calendarEventsTable" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="calendarTypes" />

    <ComponentPager current="MCalendar" />
  </div>
</template>
