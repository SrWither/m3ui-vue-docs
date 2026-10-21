<script setup lang="ts">
/*
 * A post's photos: one at its own shape, two side by side, three as one big and two small,
 * four in a grid. Tap opens MLightbox; double-tap likes, with a heart that pops.
 */
import { computed, ref } from 'vue'
import { MIcon, MLightbox } from '@m3ui-vue/m3ui-vue'
import type { Photo } from '../art'

const props = defineProps<{ photos: Photo[] }>()
const emit = defineEmits<{ like: [] }>()

const open = ref(false)
const index = ref(0)
const items = computed(() => props.photos.map((p) => ({ src: p.src, alt: p.alt, caption: p.alt })))
const heart = ref(0)

// A single tap opens the photo, two quick taps like the post instead.
let timer: number | undefined
function tap(i: number) {
  if (timer) {
    clearTimeout(timer)
    timer = undefined
    heart.value++
    emit('like')
    return
  }
  timer = window.setTimeout(() => {
    timer = undefined
    index.value = i
    open.value = true
  }, 250)
}
const single = computed(() => props.photos.length === 1)
</script>

<template>
  <div class="relative mt-3 overflow-hidden rounded-2xl border border-outline-variant/60" @click.stop>
    <button v-if="single" type="button" class="block w-full cursor-zoom-in" :aria-label="`View photo: ${photos[0]!.alt}`" @click="tap(0)">
      <img :src="photos[0]!.src" :alt="photos[0]!.alt" class="max-h-[32rem] w-full object-cover" :style="{ aspectRatio: String(Math.max(photos[0]!.ratio, 0.8)) }" />
    </button>
    <div v-else class="grid aspect-[16/10] gap-0.5" :class="photos.length === 2 ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2'">
      <button
        v-for="(p, i) in photos"
        :key="i"
        type="button"
        class="block min-h-0 cursor-zoom-in"
        :class="{ 'row-span-2': photos.length === 3 && i === 0 }"
        :aria-label="`View photo ${i + 1}: ${p.alt}`"
        @click="tap(i)"
      >
        <img :src="p.src" :alt="p.alt" class="h-full w-full object-cover" />
      </button>
    </div>
    <span v-if="heart" :key="heart" class="m3p-heart pointer-events-none absolute inset-0 flex items-center justify-center text-white" aria-hidden="true">
      <MIcon name="favorite" :size="96" filled class="drop-shadow-lg" />
    </span>
    <MLightbox v-model="open" v-model:index="index" :items="items" show-thumbnails />
  </div>
</template>

<style scoped>
.m3p-heart {
  animation: m3p-pop 800ms cubic-bezier(0.2, 0, 0, 1) forwards;
}
@keyframes m3p-pop {
  0% { opacity: 0; transform: scale(0.4); }
  25% { opacity: 1; transform: scale(1.1); }
  45% { transform: scale(0.95); }
  70% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.1); }
}
@media (prefers-reduced-motion: reduce) {
  .m3p-heart { animation-duration: 1ms; }
}
</style>
