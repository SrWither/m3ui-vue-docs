<script setup lang="ts">
/* The organization's page: who it is, pinned repos, and every repo with search and sorting. */
import { computed, ref } from 'vue'
import { MChip, MIcon, MMenu, MMenuItem } from '@m3ui-vue/m3ui-vue'
import { langInfo, repos, type Lang } from '../repos'
import { useForge } from '../useForge'
import { ago } from '../time'

const { openRepo, data, stars, starred } = useForge()

const query = ref('')
const lang = ref<Lang | null>(null)
const sort = ref<'updated' | 'stars' | 'name'>('updated')
const sorts = { updated: 'Last updated', stars: 'Stars', name: 'Name' }
const updated = (id: string) => data(id).commits[0]!.date
const shown = computed(() =>
  repos
    .filter((r) => (!query.value || `${r.name} ${r.description}`.toLowerCase().includes(query.value.toLowerCase())) && (!lang.value || r.languages[0]?.lang === lang.value))
    .sort((a, b) => (sort.value === 'stars' ? stars(b) - stars(a) : sort.value === 'name' ? a.name.localeCompare(b.name) : updated(b.id) - updated(a.id))),
)
const pinned = computed(() => [...repos].sort((a, b) => stars(b) - stars(a)).slice(0, 4))
const total = computed(() => repos.reduce((s, r) => s + stars(r), 0))
</script>

<template>
  <div class="mx-auto max-w-6xl p-4 sm:p-6">
    <header class="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <span class="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-primary text-on-primary sm:h-24 sm:w-24">
        <MIcon name="deployed_code" :size="48" />
      </span>
      <div>
        <h1 class="text-headline-medium text-on-surface">m3ui</h1>
        <p class="text-body-large text-on-surface-variant">Material 3 apps built with m3ui-vue. Every repository here is the real source of an example on m3ui.dev.</p>
        <p class="mt-1 flex flex-wrap gap-4 text-body-medium text-on-surface-variant">
          <span class="flex items-center gap-1"><MIcon name="link" :size="18" />m3ui.dev</span>
          <span class="flex items-center gap-1"><MIcon name="book" :size="18" />{{ repos.length }} repositories</span>
          <span class="flex items-center gap-1"><MIcon name="star" :size="18" />{{ total }} stars</span>
        </p>
      </div>
    </header>

    <h2 class="mb-3 text-title-medium text-on-surface">Popular repositories</h2>
    <div class="mb-8 grid gap-3 sm:grid-cols-2">
      <button
        v-for="r in pinned"
        :key="r.id"
        type="button"
        class="flex cursor-pointer flex-col gap-2 rounded-xl border border-outline-variant p-4 text-left transition-colors hover:bg-on-surface/5"
        @click="openRepo(r.id)"
      >
        <span class="flex items-center gap-2"><MIcon name="book" :size="18" class="text-on-surface-variant" /><span class="text-title-small text-primary">{{ r.name }}</span><span class="rounded-full border border-outline-variant px-2 text-label-small text-on-surface-variant">Public</span></span>
        <span class="line-clamp-2 text-body-small text-on-surface-variant">{{ r.description }}</span>
        <span class="mt-auto flex items-center gap-4 text-label-medium text-on-surface-variant">
          <span class="flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: langInfo[r.languages[0]!.lang].color }" />{{ langInfo[r.languages[0]!.lang].label }}</span>
          <span class="flex items-center gap-1"><MIcon name="star" :size="16" />{{ stars(r) }}</span>
          <span class="flex items-center gap-1"><MIcon name="fork_right" :size="16" />{{ r.forks }}</span>
        </span>
      </button>
    </div>

    <div class="mb-3 flex flex-wrap items-center gap-2 border-b border-outline-variant pb-3">
      <label class="flex h-10 min-w-0 flex-1 basis-60 items-center gap-2 rounded-full bg-surface-container-high px-4 focus-within:ring-2 focus-within:ring-secondary">
        <MIcon name="search" :size="20" class="text-on-surface-variant" />
        <input v-model="query" type="search" placeholder="Find a repository…" class="min-w-0 flex-1 bg-transparent text-body-medium text-on-surface outline-none placeholder:text-on-surface-variant" />
      </label>
      <MChip v-for="l in (['vue', 'typescript'] as Lang[])" :key="l" clickable :selected="lang === l" @click="lang = lang === l ? null : l">{{ langInfo[l].label }}</MChip>
      <MMenu align="right">
        <template #trigger>
          <MChip clickable icon="sort">Sort: {{ sorts[sort] }}</MChip>
        </template>
        <MMenuItem v-for="(label, k) in sorts" :key="k" :icon="sort === k ? 'check' : undefined" @click="sort = k">{{ label }}</MMenuItem>
      </MMenu>
    </div>

    <ul>
      <li v-for="r in shown" :key="r.id" class="border-b border-outline-variant py-5">
        <div class="flex items-start gap-3">
          <div class="min-w-0 flex-1">
            <button type="button" class="cursor-pointer text-title-medium text-primary hover:underline" @click="openRepo(r.id)">{{ r.name }}</button>
            <span class="ml-2 rounded-full border border-outline-variant px-2 align-[2px] text-label-small text-on-surface-variant">Public</span>
            <p class="mt-1 max-w-3xl text-body-medium text-on-surface-variant">{{ r.description }}</p>
            <div class="mt-2 flex flex-wrap gap-1.5">
              <MChip v-for="t in r.topics" :key="t" tone="primary">{{ t }}</MChip>
            </div>
            <p class="mt-3 flex flex-wrap items-center gap-4 text-label-medium text-on-surface-variant">
              <span class="flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: langInfo[r.languages[0]!.lang].color }" />{{ langInfo[r.languages[0]!.lang].label }}</span>
              <span class="flex items-center gap-1"><MIcon name="star" :size="16" :filled="starred.includes(r.id)" :class="{ 'text-[#f4b400]': starred.includes(r.id) }" />{{ stars(r) }}</span>
              <span class="flex items-center gap-1"><MIcon name="fork_right" :size="16" />{{ r.forks }}</span>
              <span class="flex items-center gap-1"><MIcon name="adjust" :size="16" />{{ data(r.id).issues.filter((i) => i.state === 'open').length }} issues</span>
              <span>Updated {{ ago(updated(r.id)) }}</span>
            </p>
          </div>
          <!-- Commit activity of the last weeks -->
          <svg viewBox="0 0 100 30" class="hidden h-8 w-28 shrink-0 text-success sm:block" aria-hidden="true">
            <polyline fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" :points="data(r.id).commits.slice(0, 10).reverse().map((c, i) => `${i * 11},${28 - ((c.date / 3_600_000) % 24)}`).join(' ')" />
          </svg>
        </div>
      </li>
    </ul>
  </div>
</template>
