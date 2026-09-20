<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MFileUpload', description: 'Drag-and-drop file upload zone with previews and progress tracking.' },
  { name: 'MDragDropList', description: 'Reorder a list of items via native HTML5 drag-and-drop.' },
  { name: 'MTransferList', description: 'Move items between two panels with optional per-panel search.' },
  { name: 'MHotkeys', description: 'Registers global keyboard shortcuts, with an optional on-screen overlay.' },
  { name: 'MInfiniteScroll', description: 'Emits an event to load more content as the user scrolls near the bottom.' },
  { name: 'MTour', description: 'A guided, step-by-step walkthrough that highlights elements on the page.' },
  { name: 'useDevice', description: 'Reactive composable for detecting a mobile-sized viewport.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Utility</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Interactive utilities for file handling, drag-and-drop, keyboard shortcuts, and more.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/utility/${c.name.toLowerCase()}`"
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
