<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MButton', description: 'The standard M3 button — five variants, five expressive size tiers.' },
  { name: 'MIconButton', description: 'A button that shows only an icon, same sizing system as MButton.' },
  { name: 'MFab', description: 'Floating Action Button — extended, speed-dial, or a fully custom panel.' },
  { name: 'MFabMenu', description: 'A FAB that expands into a labeled action list.' },
  { name: 'MSplitButton', description: 'A main action plus a dropdown of alternatives.' },
  { name: 'MButtonGroup', description: 'A set of buttons sharing selection state, standard or connected.' },
  { name: 'MSegmentedButton', description: 'Joined segments for choosing between a small set of options.' },
  { name: 'MToggleButton', description: 'A standalone toggle button that morphs shape and color on check.' },
  { name: 'MCopyButton', description: 'Copies a value to the clipboard, swaps to a checkmark on success.' },
  { name: 'MExportButton', description: 'Serializes data and triggers a real CSV/JSON download.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Buttons</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Buttons let users take actions and make choices with a single tap.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/buttons/${c.name.toLowerCase()}`"
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
