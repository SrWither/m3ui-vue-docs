<script setup lang="ts">
/*
 * The player's timeline: an MSlider you scrub (the video follows the thumb live, and buffers
 * once you let go), with a preview frame and its time above the pointer while you hover it.
 */
import { computed, ref } from 'vue'
import { MSlider } from '@m3ui-vue/m3ui-vue'
import { fmt, thumbOf } from '../data'
import { useFlick } from '../useFlick'

const { video, position, seek } = useFlick()
const duration = computed(() => video.value?.duration ?? 1)

const scrubbing = ref(false)
const value = computed({
  get: () => position.value,
  set: (t: number) => seek(t, scrubbing.value),
})
function release() {
  if (!scrubbing.value) return
  scrubbing.value = false
  seek(position.value)
}

// Hover (or drag) preview: the frame at that point, rounded to 2s so frames get reused.
const root = ref<HTMLElement>()
const hover = ref<{ x: number; t: number } | null>(null)
function onMove(e: PointerEvent) {
  if (e.pointerType === 'touch' && !scrubbing.value) return
  const r = root.value!.getBoundingClientRect()
  const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
  hover.value = { x: Math.min(r.width - 80, Math.max(80, f * r.width)), t: f * duration.value }
}
const preview = computed(() => (hover.value && video.value ? thumbOf(video.value, Math.round(hover.value.t / 2) * 2) : ''))
</script>

<template>
  <div
    ref="root"
    class="relative"
    @pointerdown="scrubbing = true"
    @pointerup="release"
    @pointercancel="release"
    @lostpointercapture="release"
    @pointermove="onMove"
    @pointerleave="!scrubbing && (hover = null)"
  >
    <div
      v-if="hover && preview"
      class="pointer-events-none absolute bottom-full mb-3 w-40 -translate-x-1/2 overflow-hidden rounded-lg border-2 border-white/90 bg-black shadow-elevation-3"
      :style="{ left: `${hover.x}px` }"
    >
      <img :src="preview" alt="" class="aspect-video w-full object-cover" />
      <span class="absolute inset-x-0 bottom-1 text-center text-label-large text-white [text-shadow:0_1px_3px_#000]">{{ fmt(hover.t) }}</span>
    </div>
    <MSlider v-model="value" :min="0" :max="duration" :step="0.1" size="xs" class="w-full" />
  </div>
</template>
