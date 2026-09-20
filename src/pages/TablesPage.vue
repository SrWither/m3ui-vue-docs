<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MTable', description: 'A simple table — sortable columns, search, pagination, optional selection.' },
  { name: 'MDataTable', description: 'Feature-rich table: resize/pin/toggle columns, grouping, density, expandable rows, CSV export.' },
  { name: 'MTreeTable', description: 'Hierarchical table with expandable rows for nested data like file systems.' },
  { name: 'MVirtualTable', description: 'Virtualized rendering for smooth scrolling through thousands of rows.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Tables</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Components for displaying tabular data with sorting, searching, and pagination.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/tables/${c.name.toLowerCase()}`"
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
