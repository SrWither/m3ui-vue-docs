<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MDrawCanvas', description: 'A drawing surface: pens with stylus pressure, an eraser that cuts strokes, shapes, text, lasso selection, layers, undo; infinite or in pages.' },
  { name: 'MDrawToolbar', description: 'The floating toolbar: tools, colors, sizes, undo and redo.' },
  { name: 'MDrawLayers', description: 'The layers panel: pick, show, lock, rename, reorder, add and delete.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Drawing</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Sketching and handwriting: pens that follow a stylus' pressure (and its eraser end), shapes, text, layers and a
      lasso, on an endless canvas or on pages. The drawing is plain data you keep with v-model and export as SVG or
      PNG. From the /draw entry point, with no dependencies.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/draw/${c.name.toLowerCase()}`"
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
