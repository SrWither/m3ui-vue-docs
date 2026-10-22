<script setup lang="ts">
/*
 * Destination stories: a full-screen, vertical MCarousel. Swipe or scroll up and down (or use the
 * arrow keys); each story moves on by itself after a few seconds, and the last one closes.
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { MButton, MCarousel, MIcon, MIconButton, MOverlay } from '@m3ui-vue/m3ui-vue'
import { destinations, photo, type Destination } from '../data'
import { useTravel } from '../useTravel'

const STORY_MS = 6000
const { stories, go } = useTravel()
const list = destinations.slice(0, 10)
const items = list.map((d) => ({ d, src: photo(d, 1, 720, 1280) }))

const index = ref(0)
// MCarousel is generic, so InstanceType<typeof MCarousel> doesn't work: type what's exposed.
const carousel = ref<{ next(): void; prev(): void; scrollToItem(index: number, animate?: boolean): void; focus(): void } | null>(null)
const progress = ref(0)

let timer = 0
let startedAt = 0
function tick(now: number) {
  progress.value = Math.min((now - startedAt) / STORY_MS, 1)
  if (progress.value >= 1) {
    if (index.value >= items.length - 1) close()
    else carousel.value?.next()
    return
  }
  timer = requestAnimationFrame(tick)
}
function restart() {
  cancelAnimationFrame(timer)
  startedAt = performance.now()
  progress.value = 0
  timer = requestAnimationFrame(tick)
}

function close() {
  cancelAnimationFrame(timer)
  stories.value = { ...stories.value, open: false }
}

function view(d: Destination) {
  close()
  go({ name: 'destination', id: d.id })
}

watch(
  () => stories.value.open,
  async (open) => {
    if (open) {
      index.value = stories.value.index
      await nextTick()
      carousel.value?.scrollToItem(index.value, false)
      carousel.value?.focus()
      restart()
    }
  },
)
watch(index, () => stories.value.open && restart())

onBeforeUnmount(() => cancelAnimationFrame(timer))

const segment = (i: number) => (i < index.value ? 1 : i === index.value ? progress.value : 0)
const current = computed(() => items[index.value]!.d)
</script>

<template>
  <!-- MOverlay: Escape (through the library's stack), scroll lock and the transition -->
  <MOverlay
    :model-value="stories.open"
    :scrim="false"
    :z-index="400"
    close-on-escape
    lock-scroll
    transition="dw-stories"
    class="flex justify-center bg-black"
    role="dialog"
    aria-modal="true"
    :aria-label="`Stories: ${current.name}`"
    @update:model-value="close"
  >
    <div class="relative h-dvh w-full max-w-[min(100vw,calc(100dvh*9/16))]">
      <MCarousel
        ref="carousel"
        v-model="index"
        variant="full-screen"
        orientation="vertical"
        :items="items"
        :item-spacing="4"
        height="100dvh"
        label="Destination stories"
      >
        <template #item="{ item }">
          <img :src="item.src" :alt="`${item.d.name}, ${item.d.country}`" class="size-full object-cover" draggable="false" />
          <div class="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 to-transparent" />
          <div class="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 pb-8 text-white">
            <p class="text-headline-small font-medium">{{ item.d.name }}</p>
            <p class="text-body-large opacity-90">{{ item.d.blurb }}</p>
            <MButton variant="filled" icon="travel_explore" class="self-start" @click="view(item.d)">View destination</MButton>
          </div>
        </template>
      </MCarousel>

      <!-- Progress segments and header, above the carousel -->
      <div class="pointer-events-none absolute inset-x-0 top-0 z-[200] bg-gradient-to-b from-black/60 to-transparent px-3 pt-3 pb-8">
        <div class="flex gap-1">
          <span v-for="(s, i) in items" :key="s.d.id" class="h-[3px] flex-1 overflow-hidden rounded-full bg-white/35">
            <span class="block h-full rounded-full bg-white" :style="{ width: `${segment(i) * 100}%` }" />
          </span>
        </div>
        <div class="mt-3 flex items-center gap-2 text-white">
          <img :src="photo(current, 1, 120, 120)" alt="" class="size-9 rounded-full border-2 border-white/80 object-cover" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-title-small">{{ current.name }}</p>
            <p class="flex items-center gap-1 truncate text-body-small opacity-80"><MIcon name="location_on" :size="14" /> {{ current.country }}</p>
          </div>
          <MIconButton icon="close" label="Close stories" color="#fff" class="pointer-events-auto" @click="close" />
        </div>
      </div>
    </div>
  </MOverlay>
</template>

<style scoped>
/* Global: MOverlay plays it on its teleported container, out of this component's scope */
:global(.dw-stories-enter-active),
:global(.dw-stories-leave-active) {
  transition: opacity 200ms ease, transform 250ms cubic-bezier(0.2, 0, 0, 1);
}
:global(.dw-stories-enter-from),
:global(.dw-stories-leave-to) {
  opacity: 0;
  transform: scale(0.96);
}
</style>
