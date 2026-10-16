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
          <!-- A tiny social feed: stories, then a post with a photo -->
          <div v-else-if="e.id === 'feed'" class="absolute inset-y-[12%] left-1/2 flex w-[42%] -translate-x-1/2 flex-col gap-[5%] rounded-2xl bg-surface p-[4%] shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <span class="flex gap-[6%]">
              <span v-for="n in 4" :key="n" class="aspect-square flex-1 rounded-full bg-linear-to-tr from-tertiary to-primary p-[6%]"><span class="block h-full w-full rounded-full border-2 border-surface bg-secondary-container" /></span>
            </span>
            <span class="flex items-center gap-[5%]">
              <span class="aspect-square w-[14%] rounded-full bg-primary-container" />
              <span class="h-1.5 w-[40%] rounded-full bg-on-surface/30" />
            </span>
            <span class="flex-1 rounded-lg bg-linear-to-br from-tertiary-container via-primary-container to-secondary-container" />
            <span class="flex justify-between px-[4%]">
              <span v-for="n in 4" :key="n" class="h-2 w-2 rounded-full" :class="n === 3 ? 'bg-error' : 'bg-on-surface/25'" />
            </span>
          </div>
          <!-- A tiny code host: a file tree beside code lines -->
          <div v-else-if="e.id === 'forge'" class="absolute inset-[12%] flex flex-col gap-[4%] rounded-2xl bg-surface p-[3%] shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <div class="flex h-[10%] items-center gap-[3%]">
              <span class="aspect-square h-full rounded-md bg-primary" />
              <span class="h-[50%] w-[30%] rounded-full bg-on-surface/30" />
              <span class="ml-auto h-[60%] w-[14%] rounded-full bg-tertiary-container" />
            </div>
            <div class="flex min-h-0 flex-1 gap-[3%]">
              <div class="flex w-[26%] flex-col gap-[7%] rounded-lg bg-surface-container-low p-[4%]">
                <span v-for="n in 6" :key="n" class="h-[7%] rounded-full" :class="n === 3 ? 'bg-primary/60' : 'bg-on-surface/15'" :style="{ marginLeft: n > 1 && n < 5 ? '18%' : '0' }" />
              </div>
              <div class="flex flex-1 flex-col gap-[5%] rounded-lg bg-surface-container-lowest p-[4%]">
                <span v-for="(w, n) in [60, 80, 45, 70, 30, 55]" :key="n" class="flex h-[7%] gap-[3%]">
                  <span class="w-[6%] rounded-full bg-on-surface/10" />
                  <span class="rounded-full" :class="['bg-primary/50', 'bg-tertiary/50', 'bg-on-surface/25'][n % 3]" :style="{ width: `${w}%`, marginLeft: n % 3 ? '6%' : '0' }" />
                </span>
              </div>
            </div>
          </div>
          <!-- A tiny mail client: folders, a list with unread rows, an open message -->
          <div v-else-if="e.id === 'mail'" class="absolute inset-[12%] flex gap-[3%] rounded-2xl bg-surface p-[3%] shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <div class="flex w-[18%] flex-col gap-[8%]">
              <span class="h-[14%] rounded-lg bg-primary-container" />
              <span v-for="n in 4" :key="n" class="h-[6%] rounded-full" :class="n === 1 ? 'bg-secondary-container' : 'bg-on-surface/10'" />
            </div>
            <div class="flex w-[34%] flex-col gap-[4%]">
              <span v-for="n in 5" :key="n" class="flex flex-1 items-center gap-[8%] rounded-md px-[6%]" :class="n === 2 ? 'bg-secondary-container' : 'bg-surface-container-low'">
                <span class="aspect-square h-[45%] rounded-full" :class="n < 3 ? 'bg-primary' : 'bg-on-surface/20'" />
                <span class="h-[18%] flex-1 rounded-full" :class="n < 3 ? 'bg-on-surface/40' : 'bg-on-surface/15'" />
              </span>
            </div>
            <div class="flex flex-1 flex-col gap-[5%] rounded-lg bg-surface-container-lowest p-[4%]">
              <span class="h-[7%] w-3/4 rounded-full bg-on-surface/40" />
              <span v-for="n in 4" :key="n" class="h-[4%] rounded-full bg-on-surface/15" :class="{ 'w-2/3': n === 4 }" />
              <span class="mt-auto h-[16%] w-[40%] rounded-md bg-tertiary-container" />
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
          <!-- A tiny travel app: a hero carousel over a multi-browse row -->
          <div v-else-if="e.id === 'travel'" class="absolute inset-y-[12%] left-1/2 flex w-[44%] -translate-x-1/2 flex-col gap-[5%] overflow-hidden rounded-2xl bg-surface p-[4%] shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <span class="flex h-[9%] gap-[5%]">
              <span v-for="n in 5" :key="n" class="aspect-square h-full rounded-full bg-gradient-to-tr from-primary to-tertiary" />
            </span>
            <span class="flex h-[44%] gap-[3%]">
              <span class="w-[9%] rounded-lg bg-tertiary/50" />
              <span class="relative flex-1 overflow-hidden rounded-xl bg-gradient-to-b from-secondary-container to-primary/60">
                <span class="absolute bottom-0 left-[12%] h-[45%] w-[76%] bg-primary/50 [clip-path:polygon(0_100%,35%_20%,55%_60%,75%_0,100%_100%)]" />
              </span>
              <span class="w-[9%] rounded-lg bg-tertiary/50" />
            </span>
            <span class="h-[6%] w-[50%] rounded-full bg-on-surface/15" />
            <span class="flex flex-1 gap-[3%]">
              <span class="w-[48%] rounded-xl bg-primary/40" />
              <span class="w-[30%] rounded-xl bg-secondary/40" />
              <span class="w-[14%] rounded-xl bg-tertiary/40" />
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
