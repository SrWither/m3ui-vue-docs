<script setup lang="ts">
/*
 * A step's timer: the wavy progress ring counting down, with the time and a play/pause button
 * inside. Timers live in useRecipes, so they keep running if you leave cook mode.
 */
import { computed } from 'vue'
import { MCircleProgressBar, MIconButton } from '@m3ui-vue/m3ui-vue'
import { useRecipes } from '../useRecipes'

const props = withDefaults(defineProps<{ recipe: string; step: number; minutes: number; size?: number }>(), { size: 168 })
const { timerFor, remaining, toggleTimer, resetTimer } = useRecipes()

const timer = computed(() => timerFor(props.recipe, props.step))
const left = computed(() => (timer.value ? remaining(timer.value) : props.minutes * 60))
const running = computed(() => timer.value?.since != null)
const done = computed(() => !!timer.value && left.value <= 0)
const value = computed(() => (timer.value ? (1 - left.value / timer.value.total) * 100 : 0))
const clock = computed(() => {
  const s = Math.ceil(left.value)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
})
</script>

<template>
  <div class="flex items-center gap-3">
    <MCircleProgressBar :value="value" :size="size" :thickness="5" color="tertiary" class="shrink-0">
      <div class="flex flex-col items-center">
        <span class="sim-display text-headline-large tabular-nums" :class="done ? 'text-tertiary' : 'text-on-surface'">{{ done ? 'Done' : clock }}</span>
        <span class="text-label-medium text-on-surface-variant">{{ running ? 'running' : done ? 'ring ring' : `${minutes} min` }}</span>
      </div>
    </MCircleProgressBar>
    <div class="flex flex-col gap-2">
      <MIconButton
        :icon="running ? 'pause' : done ? 'replay' : 'play_arrow'"
        :label="running ? 'Pause timer' : 'Start timer'"
        variant="filled"
        size="md"
        shape="squared"
        @click="toggleTimer(recipe, step, minutes)"
      />
      <MIconButton v-if="timer" icon="restart_alt" label="Reset timer" variant="tonal" size="md" @click="resetTimer(recipe, step)" />
    </div>
  </div>
</template>
