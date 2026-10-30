<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MPdfViewer', description: 'A PDF viewer on pdf.js: continuous pages, zoom and pinch, search, thumbnails, outline, and annotations as JSON.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">PDF</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A PDF viewer with search, thumbnails, the outline and annotations, and usePdf for a viewer of your own. From
      the /pdf entry point, with pdfjs-dist as an optional peer dependency.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/pdf/${c.name.toLowerCase()}`"
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
