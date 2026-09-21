<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MTabs', description: 'Switches between views with an animated sliding indicator.' },
  { name: 'MMenu', description: 'A trigger-based dropdown menu with items, dividers, and submenus.' },
  { name: 'MContextMenu', description: 'A right-click context menu using the same item building blocks as MMenu.' },
  { name: 'MBreadcrumbs', description: 'A navigation trail showing the current page\'s hierarchy.' },
  { name: 'MStepper', description: 'A horizontal or vertical multi-step wizard.' },
  { name: 'MPagination', description: 'Previous/next page navigation with a computed range label.' },
  { name: 'MNavigationBar', description: 'A mobile bottom navigation bar with a pill indicator and badges.' },
  { name: 'MShortNavigationBar', description: "M3 Expressive's shorter (64dp) navigation bar, with equal/centered arrangement and top/start icon position." },
  { name: 'MNavigationDrawer', description: 'A slide-out or inline drawer of grouped, nestable navigation items.' },
  { name: 'MNavigationRail', description: 'Compact vertical navigation with expanded and modal flyout variants.' },
  { name: 'MToolbar', description: 'Docked or floating container for grouping icon buttons, with an optional FAB.' },
  { name: 'MTopAppBar', description: 'A top app bar in center, small, medium, and large M3 layouts.' },
  { name: 'MSearchBar', description: 'A search field that expands into a docked panel or fullscreen overlay.' },
  { name: 'MAppBar', description: 'A simple, generic slot-based app bar.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Navigation</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Components for navigating between views, sections, and pages.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/navigation/${c.name.toLowerCase()}`"
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
