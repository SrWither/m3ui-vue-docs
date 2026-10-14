<script setup lang="ts">
/*
 * Song position with elapsed and total time. While you drag, the slider shows where you're
 * going and the song only seeks once you stop moving (seeking restarts the synth).
 */
import { computed, ref } from 'vue'
import { MSlider } from '@m3ui-vue/m3ui-vue'
import { formatTime } from '../catalog'
import { useMusic } from '../useMusic'

defineProps<{ size?: 'xs' | 'sm' }>()
const { track, position, seek } = useMusic()

const scrub = ref<number | null>(null)
let timer: number | undefined
const value = computed({
  get: () => scrub.value ?? position.value,
  set: (v: number) => {
    scrub.value = v
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      seek(v)
      scrub.value = null
    }, 120)
  },
})
const duration = computed(() => track.value?.duration ?? 0)
</script>

<template>
  <div class="flex items-center gap-2 text-label-small text-on-surface-variant tabular-nums">
    <span class="w-9 text-right">{{ formatTime(value) }}</span>
    <MSlider v-model="value" :min="0" :max="Math.max(1, duration)" :step="0.1" :size="size ?? 'xs'" :disabled="!track" class="min-w-0 flex-1" />
    <span class="w-9">{{ formatTime(duration) }}</span>
  </div>
</template>
