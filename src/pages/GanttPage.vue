<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MGantt', description: 'A Gantt chart: tasks in a tree beside bars you drag, resize and link, with auto scheduling, the critical path and baselines.' },
  { name: 'MResourceTimeline', description: 'People, tables or rooms in rows with their bookings along the time: shifts, reservations, overlaps and conflicts.' },
  { name: 'MGanttControls', description: 'The scale, zoom, today, fold and undo toolbar for either.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Gantt</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Planning on a timeline that zooms from hours to years: a Gantt chart for tasks and the order they depend on,
      and a resource timeline for who or what is busy when. With scheduling, the critical path, and import and
      export to CSV, JSON and Microsoft Project. From the /gantt entry point, with no dependencies.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/gantt/${c.name.toLowerCase()}`"
        class="no-underline"
      >
        <MCard clickable class="flex h-full flex-col gap-2 p-4">
          <div class="flex items-center gap-2">
            <MIcon :name="iconMap[c.name] ?? 'code'" :size="22" class="text-primary" />
            <span class="text-title-medium font-medium">{{ c.name }}</span>
          </div>
          <p class="text-body-small text-on-surface-variant">{{ c.description }}</p>
        </MCard>
      </router-link>
    </div>
  </div>
</template>
