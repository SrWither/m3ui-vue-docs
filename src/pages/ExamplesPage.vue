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
          <!-- A tiny shop: a product grid and a cart badge -->
          <div v-if="e.id === 'store'" class="absolute inset-[12%] grid grid-cols-3 gap-[5%] rounded-2xl bg-surface p-[4%] shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <div v-for="n in 6" :key="n" class="flex flex-col gap-[8%]">
              <span class="flex-1 rounded-lg" :class="['bg-primary-container', 'bg-tertiary-container', 'bg-secondary-container'][n % 3]" />
              <span class="h-[10%] w-3/4 rounded-full bg-on-surface/15" />
            </div>
            <span class="absolute -top-[6%] -right-[4%] flex h-[16%] w-[11%] items-center justify-center rounded-full bg-primary text-[10px] font-medium text-on-primary shadow-elevation-1">3</span>
          </div>
          <!-- A tiny dashboard: stat cards over a bar chart -->
          <div v-else-if="e.id === 'dashboard'" class="absolute inset-[12%] flex flex-col gap-[6%] rounded-2xl bg-surface p-[4%] shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <div class="flex h-[22%] gap-[4%]">
              <span v-for="n in 3" :key="n" class="flex-1 rounded-lg" :class="['bg-primary-container', 'bg-secondary-container', 'bg-tertiary-container'][n - 1]" />
            </div>
            <div class="flex flex-1 items-end gap-[3%] rounded-lg bg-surface-container-low p-[3%]">
              <span v-for="(h, i) in [40, 65, 50, 80, 60, 95, 75]" :key="i" class="flex-1 rounded-t-sm" :class="i === 5 ? 'bg-primary' : 'bg-primary/40'" :style="{ height: `${h}%` }" />
            </div>
          </div>
          <!-- A tiny music player: a cover, frequency bars, a seek bar and a play button -->
          <div v-else-if="e.id === 'music'" class="absolute inset-y-[12%] left-1/2 flex w-[40%] -translate-x-1/2 flex-col gap-[5%] rounded-2xl bg-surface p-[4%] shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <span class="relative flex-1 overflow-hidden rounded-lg bg-tertiary-container">
              <span class="absolute -right-[10%] -bottom-[25%] h-[80%] w-[60%] rounded-full bg-primary/50" />
              <span class="absolute top-[15%] left-[15%] h-[35%] w-[30%] rounded-full bg-on-tertiary-container/30" />
            </span>
            <span class="flex h-[12%] items-end gap-[4%]">
              <span v-for="(h, i) in [50, 90, 70, 100, 60, 80, 40, 65, 30]" :key="i" class="flex-1 rounded-t-sm bg-primary/70" :style="{ height: `${h}%` }" />
            </span>
            <span class="relative h-1 rounded-full bg-on-surface/15"><span class="absolute inset-y-0 left-0 w-[40%] rounded-full bg-primary" /></span>
            <span class="flex items-center justify-center gap-[10%]">
              <span class="h-2 w-2 rounded-full bg-on-surface/30" />
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-on-primary"><MIcon name="play_arrow" :size="18" /></span>
              <span class="h-2 w-2 rounded-full bg-on-surface/30" />
            </span>
          </div>
          <!-- A tiny chat: incoming and outgoing bubbles, one still typing -->
          <div v-else-if="e.id === 'chat'" class="absolute inset-y-[12%] left-1/2 flex w-[46%] -translate-x-1/2 flex-col justify-end gap-[5%] rounded-2xl bg-surface p-[4%] shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <span class="h-[12%] w-[60%] rounded-2xl rounded-bl-sm bg-surface-container-high" />
            <span class="h-[12%] w-[45%] self-end rounded-2xl rounded-br-sm bg-primary" />
            <span class="h-[18%] w-[70%] rounded-2xl rounded-bl-sm bg-surface-container-high" />
            <span class="flex h-[12%] w-[24%] items-center justify-center gap-[12%] rounded-2xl rounded-bl-sm bg-surface-container-high">
              <span v-for="n in 3" :key="n" class="h-1.5 w-1.5 rounded-full bg-on-surface-variant/60" />
            </span>
          </div>
          <!-- A tiny desktop: two windows and a taskbar -->
          <template v-else>
          <div class="absolute top-[18%] left-[12%] h-[46%] w-[42%] rounded-lg bg-surface shadow-elevation-1 transition-transform duration-300 group-hover:-translate-y-1">
            <div class="h-[14%] rounded-t-lg bg-surface-container" />
          </div>
          <div class="absolute top-[30%] left-[40%] h-[46%] w-[46%] rounded-lg bg-surface shadow-elevation-3 transition-transform duration-300 group-hover:translate-y-1">
            <div class="h-[14%] rounded-t-lg bg-surface-container-high" />
          </div>
          <div class="absolute bottom-[5%] left-1/2 flex h-[10%] w-[44%] -translate-x-1/2 items-center justify-center gap-[6%] rounded-full bg-surface-container-high/90">
            <span v-for="n in 4" :key="n" class="h-[44%] w-[8%] rounded-md" :class="n === 2 ? 'bg-primary' : 'bg-on-surface/20'" />
          </div>
          </template>
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
