<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MContainer', description: 'Constrains content width with responsive horizontal padding.' },
  { name: 'MGrid', description: 'A responsive CSS grid with per-breakpoint column counts.' },
  { name: 'MStack', description: 'Flex stack with gap, alignment, and optional dividers between items.' },
  { name: 'MSplitter', description: 'Two resizable panels divided by a draggable handle.' },
  { name: 'MMasonry', description: 'Pinterest-style column layout that fills shortest-column-first.' },
  { name: 'MText', description: 'Renders any of the 15 Material 3 typography variants.' },
  { name: 'MTitle', description: 'Semantic heading component in three sizes.' },
  { name: 'MSubtitle', description: 'Secondary heading text, muted color by default.' },
  { name: 'MKbd', description: 'Displays a keyboard shortcut as styled key chips.' },
  { name: 'MFlex', description: 'A thin, prop-driven wrapper around CSS flexbox.' },
  { name: 'MSpacer', description: 'Pushes flex siblings apart (flex: 1).' },
  { name: 'MCenter', description: 'Centers its children both horizontally and vertically.' },
  { name: 'MBox', description: 'Generic surface box with padding, radius, elevation, and border.' },
  { name: 'MSection', description: 'A titled content section with optional subtitle, actions, and divider.' },
  { name: 'MResponsive', description: 'Shows or hides content at specific breakpoints.' },
  { name: 'MRelative', description: 'Sets position: relative — the positioning parent for MAbsolute.' },
  { name: 'MAbsolute', description: 'Declarative absolute positioning with placement shortcuts.' },
  { name: 'MFixed', description: 'Same API as MAbsolute, pinned to the viewport instead.' },
  { name: 'MSticky', description: 'Sticks content to the top of its scroll container.' },
  { name: 'MScrollable', description: 'A constrained scroll area — vertical, horizontal, or both.' },
  { name: 'MAspectRatio', description: 'Maintains a consistent aspect ratio for media or containers.' },
  { name: 'MAppLayout', description: 'Full app shell — drawer, header, content, footer, and fab slots.' },
  { name: 'MFooter', description: 'Page footer with brand, content, social, and bottom-bar slots.' },
  { name: 'MOverlay', description: 'Full-screen overlay with scrim and teleport to body.' },
  { name: 'MFullscreen', description: 'Fills the entire viewport or parent for splash/loading screens.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Layout</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Components for structuring page layouts, grids, and content containers.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/layout/${c.name.toLowerCase()}`"
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
