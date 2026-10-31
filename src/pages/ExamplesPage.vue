<script setup lang="ts">
import { MButton, MIcon, MChip, MShape } from '@m3ui-vue/m3ui-vue'
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
          <!-- A tiny photo editor: menu bar, tool rail, a picture, a side panel of sliders -->
          <div v-else-if="e.id === 'photo'" class="absolute inset-[12%] flex flex-col gap-[3%] rounded-2xl bg-surface p-[3%] shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <span class="flex h-[8%] items-center gap-[3%]">
              <span class="aspect-square h-full rounded-md bg-gradient-to-br from-primary to-tertiary" />
              <span v-for="n in 4" :key="n" class="h-[45%] w-[9%] rounded-full bg-on-surface/20" />
            </span>
            <span class="flex flex-1 gap-[3%]">
              <span class="flex w-[7%] flex-col items-center gap-[12%] rounded-full bg-surface-container py-[4%]">
                <span v-for="n in 4" :key="n" class="aspect-square w-[60%] rounded-full" :class="n === 2 ? 'bg-primary' : 'bg-on-surface/20'" />
              </span>
              <span class="relative flex-1 overflow-hidden rounded-lg bg-gradient-to-b from-tertiary/60 via-primary/40 to-secondary-container">
                <span class="absolute top-[22%] right-[24%] aspect-square w-[14%] rounded-full bg-surface/80" />
                <span class="absolute bottom-0 left-0 h-[48%] w-full bg-primary/50 [clip-path:polygon(0_100%,0_55%,22%_15%,45%_60%,68%_5%,100%_50%,100%_100%)]" />
                <span class="absolute bottom-[8%] left-1/2 h-[12%] w-[46%] -translate-x-1/2 rounded-full bg-surface-container shadow-elevation-2" />
              </span>
              <span class="flex w-[26%] flex-col gap-[7%] rounded-lg bg-surface-container-low p-[4%]">
                <span class="h-[18%] rounded-md bg-on-surface/80" />
                <span v-for="n in 5" :key="n" class="relative h-[3%] rounded-full bg-on-surface/15"><span class="absolute inset-y-0 left-0 rounded-full bg-primary" :style="{ width: `${[60, 35, 75, 50, 20][n - 1]}%` }" /></span>
              </span>
            </span>
          </div>
          <!-- Three dishes, each cut into a shape and wearing its own color -->
          <div v-else-if="e.id === 'files'" class="absolute inset-[12%] flex overflow-hidden rounded-2xl bg-surface-container shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <!-- The drive: a sidebar, folders, and file cards with a PDF page, a photo and a film -->
            <span class="flex w-[24%] flex-col gap-[6%] p-[4%]">
              <span class="h-[12%] w-[70%] rounded-lg bg-primary-container" />
              <span v-for="n in 4" :key="n" class="h-[6%] rounded-full" :class="n === 1 ? 'bg-secondary-container' : 'bg-on-surface/10'" />
            </span>
            <span class="m-[3%] ml-0 flex flex-1 flex-col gap-[5%] rounded-xl bg-surface p-[4%]">
              <span class="flex h-[14%] gap-[4%]">
                <span v-for="c in ['#4CAF50', '#FFB300', '#29B6F6']" :key="c" class="flex flex-1 items-center gap-[8%] rounded-lg bg-surface-container px-[5%]"><span class="aspect-square h-1/2 rounded-sm" :style="{ background: c }" /><span class="h-[14%] flex-1 rounded-full bg-on-surface/15" /></span>
              </span>
              <span class="flex flex-1 gap-[4%]">
                <span class="flex flex-1 flex-col rounded-lg bg-surface-container p-[4%] transition-transform duration-300 group-hover:-translate-y-0.5">
                  <span class="flex flex-1 flex-col gap-[6%] rounded bg-white p-[8%]"><span class="h-[10%] w-3/4 rounded-sm bg-[#24502f]" /><span v-for="n in 4" :key="n" class="h-[5%] rounded-sm bg-black/15" /><span class="h-[5%] w-1/2 rounded-sm bg-[#FFE14D]" /></span>
                </span>
                <span class="flex flex-1 flex-col rounded-lg bg-surface-container p-[4%]"><span class="flex-1 rounded bg-gradient-to-b from-[#9fd3ff] to-[#4f9a5a]" /></span>
                <span class="flex flex-1 flex-col rounded-lg bg-surface-container p-[4%]"><span class="flex flex-1 items-center justify-center rounded bg-gradient-to-br from-[#5b3d7a] to-[#1d1b2e]"><span class="aspect-square w-1/3 rounded-full bg-white/40" /></span></span>
              </span>
            </span>
          </div>
          <div v-else-if="e.id === 'automations'" class="absolute inset-[12%] overflow-hidden rounded-2xl bg-surface shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <!-- A workflow: a trigger, a condition splitting in two, and the steps after it, joined by curves -->
            <span class="absolute inset-0 bg-[radial-gradient(var(--color-outline-variant)_1px,transparent_1px)] [background-size:10px_10px] opacity-60" />
            <svg viewBox="0 0 100 60" class="absolute inset-0 size-full" preserveAspectRatio="none" fill="none">
              <path d="M24 30 C30 30 30 30 36 30" class="stroke-outline" stroke-width="0.8" />
              <path d="M58 30 C64 30 62 16 68 16" class="stroke-primary" stroke-width="0.8" stroke-dasharray="2 1.5" />
              <path d="M58 30 C64 30 62 44 68 44" class="stroke-outline" stroke-width="0.8" />
            </svg>
            <span class="absolute top-[42%] left-[6%] h-[16%] w-[18%] rounded-md border border-outline-variant bg-surface p-[1.5%]"><span class="block aspect-square h-full rounded-sm bg-tertiary-container" /></span>
            <span class="absolute top-[42%] left-[36%] h-[16%] w-[22%] rounded-md border border-outline-variant bg-surface p-[1.5%]"><span class="block aspect-square h-full rounded-sm bg-secondary-container" /></span>
            <span class="absolute top-[19%] left-[68%] h-[16%] w-[24%] rounded-md border border-primary bg-surface p-[1.5%] transition-transform duration-300 group-hover:-translate-y-0.5"><span class="block aspect-square h-full rounded-sm bg-primary-container" /></span>
            <span class="absolute top-[65%] left-[68%] h-[16%] w-[24%] rounded-md border border-outline-variant bg-surface p-[1.5%] opacity-50"><span class="block aspect-square h-full rounded-sm bg-primary-container" /></span>
          </div>
          <div v-else-if="e.id === 'org'" class="absolute inset-[12%] overflow-hidden rounded-2xl bg-surface shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <!-- A tree of people: one at the top, three below, a few under them, joined by right-angled lines -->
            <svg viewBox="0 0 100 60" class="absolute inset-0 size-full" preserveAspectRatio="none" fill="none">
              <path d="M50 16 V22 M18 22 H82 M18 22 V28 M50 22 V28 M82 22 V28 M50 38 V42 M38 42 H62 M38 42 V46 M62 42 V46" class="stroke-outline" stroke-width="0.6" />
            </svg>
            <span class="absolute top-[8%] left-[38%] flex h-[18%] w-[24%] items-center gap-[6%] rounded-md border border-primary bg-surface px-[2%]"><span class="aspect-square h-[60%] rounded-full bg-primary" /><span class="h-[14%] flex-1 rounded-full bg-on-surface/20" /></span>
            <span v-for="(x, i) in [6, 38, 70]" :key="x" class="absolute top-[46%] flex h-[18%] w-[24%] items-center gap-[6%] rounded-md border border-outline-variant bg-surface px-[2%] transition-transform duration-300" :class="i === 1 && 'group-hover:-translate-y-0.5'" :style="{ left: `${x}%` }"><span class="aspect-square h-[60%] rounded-full" :class="['bg-tertiary', 'bg-secondary', 'bg-error'][i]" /><span class="h-[14%] flex-1 rounded-full bg-on-surface/15" /></span>
            <span v-for="x in [28, 52]" :key="x" class="absolute top-[76%] flex h-[16%] w-[20%] items-center gap-[6%] rounded-md border border-outline-variant bg-surface px-[2%]" :style="{ left: `${x}%` }"><span class="aspect-square h-[55%] rounded-full bg-secondary/60" /><span class="h-[14%] flex-1 rounded-full bg-on-surface/15" /></span>
          </div>
          <div v-else-if="e.id === 'maxflow'" class="absolute inset-[12%] overflow-hidden rounded-2xl bg-surface shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <!-- A small network: source, two middle vertices, sink; one path lit up, the cut dashed -->
            <svg viewBox="0 0 100 60" class="absolute inset-0 size-full">
              <g stroke-width="1.6" stroke-linecap="round">
                <line x1="18" y1="30" x2="46" y2="14" class="stroke-primary" stroke-dasharray="3 2" />
                <line x1="18" y1="30" x2="46" y2="46" class="stroke-outline" />
                <line x1="54" y1="14" x2="82" y2="30" class="stroke-primary" stroke-dasharray="3 2" />
                <line x1="54" y1="46" x2="82" y2="30" class="stroke-tertiary" />
                <line x1="50" y1="18" x2="50" y2="42" class="stroke-outline" />
              </g>
              <circle cx="14" cy="30" r="6" class="fill-tertiary-container" />
              <circle cx="50" cy="12" r="6" class="fill-secondary-container transition-transform duration-300 group-hover:-translate-y-0.5" />
              <circle cx="50" cy="48" r="6" class="fill-surface-container-highest" />
              <circle cx="86" cy="30" r="6" class="fill-primary-container" />
              <rect x="27" y="17" width="10" height="5" rx="2.5" class="fill-primary-container" />
              <rect x="63" y="17" width="10" height="5" rx="2.5" class="fill-primary-container" />
            </svg>
          </div>
          <div v-else-if="e.id === 'circuits'" class="absolute inset-[12%] overflow-hidden rounded-2xl bg-surface shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <!-- Two switches into an AND gate lighting an LED, one wire on -->
            <svg viewBox="0 0 100 60" class="absolute inset-0 size-full">
              <rect x="8" y="14" width="16" height="9" rx="4.5" class="fill-primary" />
              <circle cx="19.5" cy="18.5" r="3" class="fill-on-primary" />
              <rect x="8" y="37" width="16" height="9" rx="4.5" class="fill-surface-container-highest" />
              <circle cx="12.5" cy="41.5" r="3" class="fill-outline" />
              <path d="M24 18.5 H34 V24 H42" fill="none" stroke-width="1.6" class="stroke-primary" />
              <path d="M24 41.5 H34 V36 H42" fill="none" stroke-width="1.2" class="stroke-outline-variant" />
              <path d="M42 18 H52 A12 12 0 0 1 52 42 H42 Z" stroke-width="1.4" class="fill-surface-container-high stroke-on-surface-variant" />
              <path d="M64 30 H80" fill="none" stroke-width="1.2" class="stroke-outline-variant" />
              <circle cx="86" cy="30" r="6" class="fill-surface-container-highest transition-colors duration-300 group-hover:fill-primary" />
            </svg>
          </div>
          <div v-else-if="e.id === 'roadmap'" class="absolute inset-[12%] overflow-hidden rounded-2xl bg-surface shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <!-- A Gantt chart: a list on the left, bars stepping down to a milestone, today's line -->
            <span class="absolute inset-y-0 left-0 w-[24%] border-r border-outline-variant bg-surface-container-low" />
            <span v-for="i in 6" :key="i" class="absolute left-[4%] h-[3%] rounded-full bg-on-surface/20" :style="{ top: `${12 + i * 13}%`, width: `${10 + (i % 3) * 4}%` }" />
            <span class="absolute top-0 bottom-0 left-[52%] w-[0.6%] bg-primary" />
            <span class="absolute top-[22%] left-[28%] h-[7%] w-[22%] rounded-sm bg-tertiary-container" />
            <span class="absolute top-[35%] left-[42%] h-[7%] w-[26%] rounded-sm bg-error/80 transition-transform duration-300 group-hover:translate-x-1" />
            <span class="absolute top-[48%] left-[46%] h-[7%] w-[16%] rounded-sm bg-primary-container" />
            <span class="absolute top-[61%] left-[66%] h-[7%] w-[18%] rounded-sm bg-error/80 transition-transform duration-300 group-hover:translate-x-1" />
            <span class="absolute top-[73%] left-[86%] size-[5%] rotate-45 rounded-[1px] bg-error" />
          </div>
          <div v-else-if="e.id === 'shifts'" class="absolute inset-[12%] overflow-hidden rounded-2xl bg-surface shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <!-- A rota: people in rows with avatars, shifts as blocks along the week, one double booking -->
            <span class="absolute inset-y-0 left-0 w-[22%] border-r border-outline-variant bg-surface-container-low" />
            <span v-for="i in 5" :key="i" class="absolute left-[4%] flex h-[12%] w-[15%] items-center gap-[10%]" :style="{ top: `${4 + i * 17}%` }"><span class="aspect-square h-full rounded-full bg-secondary-container" /><span class="h-[25%] flex-1 rounded-full bg-on-surface/20" /></span>
            <span
              v-for="(b, i) in [[1, 26, 14, 'bg-tertiary-container'], [1, 58, 14, 'bg-tertiary-container'], [2, 40, 16, 'bg-primary-container'], [2, 74, 16, 'bg-primary-container'], [3, 30, 10, 'bg-secondary-container'], [3, 62, 10, 'bg-secondary-container'], [4, 48, 18, 'bg-primary-container'], [5, 66, 20, 'bg-surface-container-highest']]"
              :key="i"
              class="absolute h-[10%] rounded-sm"
              :class="[b[3], i === 6 ? 'outline-2 outline-error transition-transform duration-300 group-hover:translate-x-1' : '']"
              :style="{ top: `${5 + (b[0] as number) * 17}%`, left: `${b[1]}%`, width: `${b[2]}%` }"
            />
          </div>
          <div v-else-if="e.id === 'recipes'" class="absolute inset-[12%] flex items-center justify-center gap-[4%] rounded-2xl bg-surface p-[5%] shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <span v-for="(d, i) in [{ s: 'Cookie9Sided', c: '#c8432b', b: '#ffdad3' }, { s: 'Clover4Leaf', c: '#e5b92c', b: '#ffefc2' }, { s: 'Sunny', c: '#3b4ca0', b: '#dee0ff' }] as const" :key="i" class="relative flex aspect-[3/4] flex-1 flex-col items-center gap-[8%] rounded-xl p-[6%]" :style="{ background: d.b }">
              <MShape :shape="d.s" class="aspect-square w-full transition-transform duration-500 group-hover:rotate-12" :fill="d.c" />
              <span class="h-[6%] w-3/4 rounded-full" :style="{ background: d.c, opacity: 0.6 }" />
              <span class="h-[5%] w-1/2 rounded-full" :style="{ background: d.c, opacity: 0.3 }" />
            </span>
          </div>
          <div v-else-if="e.id === 'orvian'" class="absolute inset-[12%] overflow-hidden rounded-2xl bg-surface shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <!-- A town's blocks with a few lots in color, a layer card and the FABs -->
            <span class="absolute inset-0 grid grid-cols-6 gap-[3%] bg-surface-container p-[6%]">
              <span v-for="n in 24" :key="n" class="rounded-[2px]" :class="[3, 8, 9, 15].includes(n) ? 'bg-primary/45' : n === 14 ? 'bg-tertiary/50' : 'bg-on-surface/10'" />
            </span>
            <span class="absolute top-[8%] left-[6%] flex w-[38%] flex-col gap-[6%] rounded-lg bg-surface p-[3%] shadow-elevation-2">
              <span v-for="n in 4" :key="n" class="flex items-center gap-[8%]"><span class="aspect-square w-[14%] rounded-full" :class="n < 3 ? 'bg-primary' : 'bg-on-surface/20'" /><span class="h-[3px] flex-1 rounded-full bg-on-surface/20" /></span>
            </span>
            <span class="absolute bottom-[8%] left-[6%] flex gap-[4%]">
              <span class="aspect-square w-6 rounded-lg bg-primary-container shadow-elevation-2" />
              <span class="aspect-square w-6 rounded-lg bg-surface-container-high shadow-elevation-2" />
            </span>
          </div>
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
          <!-- A tiny video site: a player with its timeline over a row of thumbnails -->
          <div v-else-if="e.id === 'flick'" class="absolute inset-[12%] flex flex-col gap-[5%] rounded-2xl bg-surface p-[4%] shadow-elevation-2 transition-transform duration-300 group-hover:-translate-y-1">
            <span class="relative flex flex-[3] items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-primary/80 via-tertiary/60 to-secondary-container">
              <span class="flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white"><MIcon name="play_arrow" :size="20" /></span>
              <span class="absolute inset-x-[4%] bottom-[8%] h-1 rounded-full bg-white/40"><span class="absolute inset-y-0 left-0 w-[35%] rounded-full bg-primary" /></span>
            </span>
            <span class="flex flex-1 gap-[4%]">
              <span v-for="n in 3" :key="n" class="flex-1 rounded-md" :class="['bg-primary-container', 'bg-tertiary-container', 'bg-secondary-container'][n - 1]" />
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
