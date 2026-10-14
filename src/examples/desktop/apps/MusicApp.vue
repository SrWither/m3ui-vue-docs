<script lang="ts">
// Module-level state and timer: the song keeps "playing" while the window is minimized.
import { computed, ref, watch } from 'vue'

const tracks = [
  { title: 'Midnight City', artist: 'M83', length: 243 },
  { title: 'Digital Love', artist: 'Daft Punk', length: 298 },
  { title: 'Intro', artist: 'The xx', length: 127 },
  { title: 'Retrograde', artist: 'James Blake', length: 223 },
  { title: 'Breathe', artist: 'Télépopmusik', length: 280 },
]
const index = ref(0)
const position = ref(42)
const playing = ref(false)
const volume = ref(70)
const track = computed(() => tracks[index.value]!)

let timer: ReturnType<typeof setInterval> | undefined
watch(playing, (on) => {
  clearInterval(timer)
  if (on) timer = setInterval(() => {
    position.value += 1
    if (position.value >= track.value.length) next()
  }, 1000)
})

function next() {
  index.value = (index.value + 1) % tracks.length
  position.value = 0
}
function prev() {
  if (position.value > 3) position.value = 0
  else index.value = (index.value - 1 + tracks.length) % tracks.length
}
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
</script>

<script setup lang="ts">
import { MIcon, MIconButton, MSlider } from '@m3ui-vue/m3ui-vue'

function pick(i: number) {
  index.value = i
  position.value = 0
  playing.value = true
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="bg-gradient-to-br from-primary-container via-tertiary-container to-secondary-container px-5 pt-5 pb-3">
      <div class="flex items-center gap-4">
        <div class="flex h-20 w-20 shrink-0 items-end justify-center gap-1 overflow-hidden rounded-2xl bg-primary p-3 shadow-elevation-2">
          <span
            v-for="n in 4"
            :key="n"
            class="m3d-bar w-2 rounded-full bg-on-primary"
            :class="playing ? 'm3d-bar-on' : ''"
            :style="{ animationDelay: `${n * 0.13}s`, height: `${20 + n * 8}%` }"
          />
        </div>
        <div class="min-w-0">
          <p class="truncate text-title-large text-on-primary-container">{{ track.title }}</p>
          <p class="text-body-medium text-on-primary-container/80">{{ track.artist }}</p>
        </div>
      </div>

      <MSlider v-model="position" :min="0" :max="track.length" size="xs" class="mt-4" aria-label="Position" />
      <div class="flex justify-between text-label-small tabular-nums text-on-primary-container/80">
        <span>{{ fmt(position) }}</span>
        <span>{{ fmt(track.length) }}</span>
      </div>

      <div class="flex items-center justify-center gap-2">
        <MIconButton icon="skip_previous" label="Previous" @click="prev" />
        <MIconButton :icon="playing ? 'pause' : 'play_arrow'" variant="filled" size="md" :label="playing ? 'Pause' : 'Play'" @click="playing = !playing" />
        <MIconButton icon="skip_next" label="Next" @click="next" />
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-auto p-2">
      <button
        v-for="(t, i) in tracks"
        :key="t.title"
        type="button"
        class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left"
        :class="i === index ? 'bg-secondary-container' : 'hover:bg-on-surface/8'"
        @click="pick(i)"
      >
        <MIcon :name="i === index && playing ? 'equalizer' : 'music_note'" :size="20" :class="i === index ? 'text-on-secondary-container' : 'text-on-surface-variant'" />
        <span class="min-w-0 flex-1">
          <span class="block truncate text-body-medium" :class="i === index ? 'text-on-secondary-container' : 'text-on-surface'">{{ t.title }}</span>
          <span class="block text-label-small text-on-surface-variant">{{ t.artist }}</span>
        </span>
        <span class="text-label-small tabular-nums text-on-surface-variant">{{ fmt(t.length) }}</span>
      </button>
    </div>

    <div class="flex items-center gap-2 border-t border-outline-variant/60 px-4 py-2">
      <MIcon name="volume_down" :size="20" class="text-on-surface-variant" />
      <MSlider v-model="volume" :min="0" :max="100" size="xs" class="flex-1" aria-label="Volume" />
      <MIcon name="volume_up" :size="20" class="text-on-surface-variant" />
    </div>
  </div>
</template>

<style scoped>
.m3d-bar {
  transform-origin: bottom;
  transform: scaleY(0.35);
  transition: transform 300ms;
}
.m3d-bar-on {
  animation: m3d-eq 0.9s ease-in-out infinite alternate;
}
@keyframes m3d-eq {
  from { transform: scaleY(0.3); }
  to { transform: scaleY(1.6); }
}
@media (prefers-reduced-motion: reduce) {
  .m3d-bar-on {
    animation: none;
    transform: scaleY(1);
  }
}
</style>
