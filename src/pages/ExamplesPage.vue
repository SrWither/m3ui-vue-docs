<script setup lang="ts">
import { MButton, MIcon, MChip } from '@m3ui-vue/m3ui-vue'
import { examples, exampleSource } from '@/examples/registry'
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Examples</h1>
    <p class="mb-8 max-w-3xl text-body-large text-on-surface-variant">
      Complete apps built only with m3ui-vue, each opening full screen, outside these docs. Every example is
      a self-contained folder you can read on GitHub, from the layout down to each app.
    </p>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <article
        v-for="e in examples"
        :key="e.id"
        class="group flex flex-col overflow-hidden rounded-3xl bg-surface-container-low"
      >
        <RouterLink
          :to="`/examples/${e.id}`"
          class="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br from-primary-container via-secondary-container to-tertiary-container"
        >
          <!-- A tiny desktop: two windows and a taskbar -->
          <div class="absolute top-[18%] left-[12%] h-[46%] w-[42%] rounded-lg bg-surface shadow-elevation-1 transition-transform duration-300 group-hover:-translate-y-1">
            <div class="h-[14%] rounded-t-lg bg-surface-container" />
          </div>
          <div class="absolute top-[30%] left-[40%] h-[46%] w-[46%] rounded-lg bg-surface shadow-elevation-3 transition-transform duration-300 group-hover:translate-y-1">
            <div class="h-[14%] rounded-t-lg bg-surface-container-high" />
          </div>
          <div class="absolute bottom-[5%] left-1/2 flex h-[10%] w-[44%] -translate-x-1/2 items-center justify-center gap-[6%] rounded-full bg-surface-container-high/90">
            <span v-for="n in 4" :key="n" class="h-[44%] w-[8%] rounded-md" :class="n === 2 ? 'bg-primary' : 'bg-on-surface/20'" />
          </div>
          <MIcon :name="e.icon" :size="40" class="absolute top-4 left-4 text-on-primary-container/70" />
        </RouterLink>

        <div class="flex flex-1 flex-col gap-3 p-6">
          <h2 class="text-title-large text-on-surface">{{ e.title }}</h2>
          <p class="text-body-medium text-on-surface-variant">{{ e.description }}</p>
          <div class="flex flex-wrap gap-1.5">
            <MChip v-for="u in e.uses" :key="u">{{ u }}</MChip>
          </div>
          <div class="mt-auto flex flex-wrap gap-2 pt-2">
            <RouterLink :to="`/examples/${e.id}`" class="no-underline">
              <MButton icon="open_in_full">Open</MButton>
            </RouterLink>
            <a :href="exampleSource(e.id)" target="_blank" rel="noopener" class="no-underline">
              <MButton variant="outlined" icon="code">View source</MButton>
            </a>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
