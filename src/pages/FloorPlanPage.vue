<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MFloorPlan', description: 'Tables (with chairs, statuses, badges, merges), zones, walls and decor, scaled to its width; arrange it or run service on it.' },
  { name: 'MFloorPlanToolbar', description: 'Move, draw walls and zones, add tables and decor, duplicate, delete, undo and redo.' },
  { name: 'MFloorPlanInspector', description: 'Edits what is picked, with a slot per kind for fields of your own.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Floor plan</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Rooms of tables for restaurants, bars and events: arrange them with a toolbar and an inspector, draw walls and
      zones, place decor (built-in kinds or your own), then run service with each table colored by a status of yours,
      merged tables and anything else you lay over it. Undo and redo built in. From the main entry point, with no
      dependencies; useFloorPlan() builds controls of your own.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/floorplan/${c.name.toLowerCase()}`"
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
