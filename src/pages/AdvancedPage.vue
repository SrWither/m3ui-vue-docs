<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MCalendar', description: 'A monthly calendar grid with color-coded, clickable events.' },
  { name: 'MScheduler', description: 'A week or day time-grid scheduler for start/end-time events.' },
  { name: 'MKanban', description: 'A drag-and-drop kanban board with customizable card rendering.' },
  { name: 'MCommandPalette', description: 'A searchable, keyboard-driven command palette with a global hotkey.' },
  { name: 'MSpotlightSearch', description: 'A spotlight-style search overlay for consumer-driven async results.' },
  { name: 'MChart', description: 'A theme-aware Chart.js wrapper — line, bar, pie, doughnut, and radar.' },
  { name: 'MShader', description: 'A canvas container for hand-written GLSL/WGSL shaders.' },
  { name: 'MQRCode', description: 'Generates a scannable QR code as inline SVG.' },
  { name: 'MBarcode', description: 'Generates a barcode as inline SVG in several symbologies.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Advanced</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Complex interactive components for calendars, kanban boards, schedulers, search, charts, shaders, and codes.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/advanced/${c.name.toLowerCase()}`"
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
