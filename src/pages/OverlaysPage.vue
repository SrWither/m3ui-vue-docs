<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MBottomSheet', description: 'A sheet that slides up from the bottom, with drag-to-dismiss.' },
  { name: 'MSideSheet', description: 'A panel that slides in from the right edge of the screen.' },
  { name: 'MLoadingOverlay', description: 'A spinner overlay layered on content, or covering the whole viewport.' },
  { name: 'MWindow', description: 'A floating, draggable, resizable window for desktop-style multi-window UIs.' },
  { name: 'MBar', description: 'A draggable Electron title bar for frameless windows.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Overlays</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Panels, sheets, and overlays that appear above the main content.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/overlays/${c.name.toLowerCase()}`"
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
