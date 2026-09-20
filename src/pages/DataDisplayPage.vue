<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MCard', description: 'A flexible surface for grouping content — elevated, filled, or outlined.' },
  { name: 'MChip', description: 'Compact elements for filters, input, or actions.' },
  { name: 'MBadge', description: 'A small numeric or dot indicator overlaid on another element.' },
  { name: 'MAvatar', description: 'A circular initials avatar.' },
  { name: 'MIcon', description: 'Renders a Material Symbols Outlined glyph by name.' },
  { name: 'MDivider', description: 'A thin separator line, horizontal or vertical, with an optional label.' },
  { name: 'MStatCard', description: 'A compact metric card with a trend indicator and loading skeleton.' },
  { name: 'MTimeline', description: 'A vertical event timeline with icon dots and dates.' },
  { name: 'MSkeleton', description: 'A loading placeholder shape with pulse or wave animation.' },
  { name: 'MEmptyState', description: 'A placeholder for empty views with optional action buttons.' },
  { name: 'MResult', description: 'Pre-built result screens for success, errors, and HTTP status codes.' },
  { name: 'MTree', description: 'A hierarchical tree view with expand/collapse and selection.' },
  { name: 'MList', description: 'A list container with rich rows and optional section headers.' },
  { name: 'MEmoji', description: 'Renders a single emoji character at a fixed size.' },
  { name: 'MEmojiButton', description: 'A single emoji button that cycles a random pool on hover.' },
  { name: 'MEmojiSelector', description: 'A full emoji picker panel with categories and search.' },
  { name: 'MCarousel', description: 'A scroll-snap image carousel with hero, multi-browse, and uncontained layouts.' },
  { name: 'MLightbox', description: 'Auto-detects images to wire up a full-screen gallery viewer.' },
  { name: 'MChatBubble', description: 'A chat message bubble with sender, avatar, and read status.' },
  { name: 'MRelativeTime', description: 'A self-updating "5 minutes ago"-style relative timestamp.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Data Display</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Components for presenting content, status indicators, and visual elements.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/data-display/${c.name.toLowerCase()}`"
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
