<script setup lang="ts">
/*
 * Explore: search, destination stories, a hero carousel of featured places, multi-browse rows per
 * collection and an uncontained row of things to do.
 */
import { computed, ref } from 'vue'
import { MCarousel, MIcon, MList, MListItem, MSearchBar, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import { collections, destinations, featured, photo, type Destination, type Experience } from '../data'
import { useTravel } from '../useTravel'
import AppHeader from '../components/AppHeader.vue'

const { go, openStories } = useTravel()
const { widthClass } = useWindowSizeClass()
const compact = computed(() => widthClass.value === 'compact')

// ── Search ─────────────────────────────────────────────────────────────────────────────────────
const query = ref('')
const searching = ref(false)
const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return destinations.slice(0, 6)
  return destinations.filter((d) => [d.name, d.country, ...d.tags].some((s) => s.toLowerCase().includes(q)))
})
function open(d: Destination) {
  searching.value = false
  go({ name: 'destination', id: d.id })
}

// ── Carousels ──────────────────────────────────────────────────────────────────────────────────
const hero = featured.map((d) => ({ src: photo(d, 0, 1200, 900), alt: `${d.name}, ${d.country}`, d }))
const rows = collections.map((c) => ({
  ...c,
  items: destinations.filter((d) => c.kinds.includes(d.kind)).map((d) => ({ src: photo(d), label: d.name, d })),
}))
const things = destinations.slice(0, 10).map((d, i) => ({ d, e: d.experiences[i % d.experiences.length]! as Experience, src: photo(d, 2, 600, 400) }))
</script>

<template>
  <div class="pb-28">
    <AppHeader title="Driftway" logo />

    <div class="mx-auto max-w-5xl">
      <div class="px-4 pt-2 pb-4">
        <MSearchBar
          id="dw-search"
          v-model="query"
          v-model:expanded="searching"
          :variant="compact ? 'fullscreen' : 'docked'"
          placeholder="Where to next?"
          clearable
        >
          <MList>
            <p class="px-4 pt-3 pb-1 text-label-large text-on-surface-variant">{{ query ? `${results.length} destinations` : 'Popular right now' }}</p>
            <MListItem
              v-for="d in results"
              :key="d.id"
              :title="d.name"
              :subtitle="`${d.country} · ${d.tags.join(', ')}`"
              leading="image"
              :image="photo(d, 0, 120, 120)"
              clickable
              @click="open(d)"
            />
            <p v-if="!results.length" class="px-4 py-6 text-body-medium text-on-surface-variant">No destinations match “{{ query }}”.</p>
          </MList>
        </MSearchBar>
      </div>

      <!-- Stories -->
      <section id="dw-stories" class="mb-6">
        <div class="flex gap-4 overflow-x-auto px-4 pb-1" style="scrollbar-width: none">
          <button
            v-for="(d, i) in destinations.slice(0, 10)"
            :key="d.id"
            type="button"
            class="flex w-16 shrink-0 cursor-pointer flex-col items-center gap-1.5"
            @click="openStories(i)"
          >
            <span class="rounded-full bg-gradient-to-tr from-primary to-tertiary p-[3px]">
              <img :src="photo(d, 1, 160, 160)" :alt="d.name" class="size-14 rounded-full border-2 border-surface object-cover" />
            </span>
            <span class="w-full truncate text-center text-label-medium text-on-surface">{{ d.name }}</span>
          </button>
        </div>
      </section>

      <!-- Featured: hero -->
      <section id="dw-featured" class="mb-8">
        <h2 class="mb-3 px-4 text-title-large text-on-surface">Featured this season</h2>
        <MCarousel variant="hero" :items="hero" :height="compact ? '300px' : '380px'" :content-padding="16" label="Featured destinations" @item-click="(item) => go({ name: 'destination', id: item.d.id })">
          <template #item="{ item }">
            <img :src="item.src" :alt="item.alt" class="size-full object-cover" draggable="false" />
            <div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
            <div
              class="pointer-events-none absolute bottom-5 overflow-hidden whitespace-nowrap text-white"
              style="inset-inline-start: calc(var(--m3-carousel-mask-start) + 20px); max-width: calc(var(--m3-carousel-mask-size) - 40px)"
            >
              <p class="text-label-large opacity-90">{{ item.d.country }}</p>
              <p class="text-headline-small font-medium">{{ item.d.name }}</p>
              <p class="mt-1 flex items-center gap-1 text-body-medium opacity-90">
                <MIcon name="star" :size="16" /> {{ item.d.rating }} · from ${{ item.d.priceFrom }}
              </p>
            </div>
          </template>
        </MCarousel>
      </section>

      <!-- Collections: multi-browse -->
      <section v-for="row in rows" :key="row.title" class="mb-8">
        <div class="mb-3 px-4">
          <h2 class="text-title-large text-on-surface">{{ row.title }}</h2>
          <p class="text-body-medium text-on-surface-variant">{{ row.subtitle }}</p>
        </div>
        <MCarousel :items="row.items" :item-size="compact ? 186 : 240" :content-padding="16" :label="row.title" @item-click="(item) => go({ name: 'destination', id: item.d.id })" />
      </section>

      <!-- Things to do: uncontained -->
      <section class="mb-8">
        <div class="mb-3 px-4">
          <h2 class="text-title-large text-on-surface">Things to do</h2>
          <p class="text-body-medium text-on-surface-variant">Tours and activities people loved this month</p>
        </div>
        <MCarousel variant="uncontained" :items="things" :item-size="220" height="250px" :content-padding="16" label="Things to do" @item-click="(item) => go({ name: 'destination', id: item.d.id })">
          <template #item="{ item }">
            <div class="flex size-full flex-col bg-surface-container">
              <div class="relative h-32 shrink-0">
                <img :src="item.src" :alt="item.d.name" class="size-full object-cover" draggable="false" />
                <span class="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-primary">
                  <MIcon :name="item.e.icon" :size="20" />
                </span>
              </div>
              <div class="flex flex-1 flex-col p-3">
                <p class="text-title-small text-on-surface">{{ item.e.title }}</p>
                <p class="text-body-small text-on-surface-variant">{{ item.d.name }}, {{ item.d.country }}</p>
                <p class="mt-auto text-label-large text-on-surface">${{ item.e.price }} <span class="text-body-small text-on-surface-variant">· {{ item.e.duration }} h</span></p>
              </div>
            </div>
          </template>
        </MCarousel>
      </section>
    </div>
  </div>
</template>
