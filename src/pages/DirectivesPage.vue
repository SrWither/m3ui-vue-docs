<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const directives = [
  { name: 'v-ripple', description: 'The Material 3 press ripple on any element: cards, rows, tiles, your own buttons.' },
  { name: 'v-state-layer', description: 'The Material 3 hover, focus, pressed and dragged tint on any element.' },
  { name: 'v-tooltip', description: 'A plain tooltip on any element from a string, without wrapping it.' },
  { name: 'v-reveal', description: 'Elements fade or slide in as they scroll into view, cascading through a list.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Directives</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Attributes that add library behavior to your own elements, for when a whole component would be too much.
      <code>createM3UI()</code> registers them globally; without the plugin, import them by name and use them in
      <code>&lt;script setup&gt;</code> (<code>vRipple</code> becomes <code>v-ripple</code>).
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="d in directives"
        :key="d.name"
        :to="`/directives/${d.name.toLowerCase()}`"
        class="no-underline"
      >
        <MCard clickable class="flex h-full flex-col gap-2 p-4">
          <div class="flex items-center gap-2">
            <MIcon :name="iconMap[d.name] ?? 'code'" :size="22" class="text-primary" />
            <span class="text-title-medium font-medium">{{ d.name }}</span>
          </div>
          <p class="text-body-small text-on-surface-variant">{{ d.description }}</p>
        </MCard>
      </router-link>
    </div>
  </div>
</template>
