<script setup lang="ts">
// A voice note: play/pause and a waveform that fills as it "plays" (no real audio).
import { computed, onBeforeUnmount, ref } from 'vue'
import { MIcon } from '@m3ui-vue/m3ui-vue'
import { duration } from '../useChat'

const props = defineProps<{ seconds: number; mine: boolean }>()

// A stable waveform per length, so every note doesn't look the same.
const bars = computed(() => Array.from({ length: 28 }, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7 + props.seconds))))
const elapsed = ref(0)
const playing = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

function toggle() {
  playing.value = !playing.value
  clearInterval(timer)
  if (!playing.value) return
  if (elapsed.value >= props.seconds) elapsed.value = 0
  timer = setInterval(() => {
    elapsed.value = Math.min(props.seconds, elapsed.value + 0.1)
    if (elapsed.value >= props.seconds) {
      playing.value = false
      clearInterval(timer)
    }
  }, 100)
}
onBeforeUnmount(() => clearInterval(timer))
const progress = computed(() => elapsed.value / props.seconds)
</script>

<template>
  <div class="flex w-56 max-w-full items-center gap-2 py-0.5">
    <button
      type="button"
      class="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full"
      :class="mine ? 'bg-on-primary text-primary' : 'bg-primary text-on-primary'"
      :aria-label="playing ? 'Pause voice message' : 'Play voice message'"
      @click="toggle"
    >
      <MIcon :name="playing ? 'pause' : 'play_arrow'" :size="22" style="font-variation-settings: 'FILL' 1" />
    </button>
    <div class="flex min-w-0 flex-1 flex-col gap-0.5">
      <div class="flex h-6 items-center gap-[2px]" aria-hidden="true">
        <span
          v-for="(h, i) in bars"
          :key="i"
          class="w-[3px] shrink-0 rounded-full bg-current transition-opacity"
          :class="i / bars.length < progress ? 'opacity-100' : 'opacity-40'"
          :style="{ height: `${h * 100}%` }"
        />
      </div>
      <span class="text-label-small tabular-nums opacity-80">{{ duration(Math.ceil(playing || elapsed ? seconds - elapsed : seconds)) }}</span>
    </div>
  </div>
</template>
