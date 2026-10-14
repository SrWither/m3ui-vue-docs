<script setup lang="ts">
import { MCalendar } from '@m3ui-vue/m3ui-vue'
import type { CalendarEvent } from '@m3ui-vue/m3ui-vue'

// Events around today, so the month always has something in it.
const day = (offset: number) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}
const events: CalendarEvent[] = [
  { id: 1, title: 'Design review', date: day(0), color: 'primary', icon: 'groups' },
  { id: 2, title: 'Release', date: day(2), color: 'tertiary', icon: 'rocket_launch' },
  { id: 3, title: 'Dinner', date: day(4), color: 'secondary', icon: 'restaurant' },
  { id: 4, title: 'Flight to Lisbon', date: day(9), color: 'error', icon: 'flight' },
  { id: 5, title: 'Sprint planning', date: day(-3), color: 'success', icon: 'event' },
]
</script>

<template>
  <div class="h-full overflow-auto p-3">
    <MCalendar :events="events" />
  </div>
</template>
