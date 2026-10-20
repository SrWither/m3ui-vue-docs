<script setup lang="ts">
/*
 * The player's timeline: a thin MSeekBar line in the theme's primary. Scrubbing is live (the frame
 * follows the thumb) and buffers once you let go; hovering or dragging previews that frame and
 * its chapter above the pointer.
 */
import { computed } from 'vue'
import { MSeekBar } from '@m3ui-vue/m3ui-vue'
import { chaptersOf, thumbOf } from '../data'
import { useFlick } from '../useFlick'

const { video, position, playing, buffering, speed, seek } = useFlick()
const duration = computed(() => video.value?.duration ?? 0)
const chapters = computed(() => chaptersOf(duration.value))
// Made up: half a minute loaded ahead of the playhead, once it's done buffering
const buffered = computed(() => (buffering.value ? position.value : Math.min(duration.value, position.value + 30)))

// While scrubbing the v-model moves the frame quietly; the seek on release (or a tap) buffers
let scrubbing = false
const value = computed({
  get: () => position.value,
  set: (t: number) => { if (scrubbing) seek(t, true) },
})
function onSeek(t: number) {
  scrubbing = false
  seek(t)
}

// Rounded to 2s so frames get reused
const frame = (t: number) => (video.value ? thumbOf(video.value, Math.round(t / 2) * 2) : '')
</script>

<template>
  <MSeekBar
    v-model="value"
    :duration="duration"
    :buffered="buffered"
    :chapters="chapters"
    :playing="playing && !buffering"
    :playback-rate="speed"
    variant="line"
    size="xs"
    time="none"
    track-color="rgb(255 255 255 / 0.3)"
    live
    @scrub-start="scrubbing = true"
    @seek="onSeek"
  >
    <template #preview="{ time, formatted, chapter }">
      <div class="mb-2 w-40 overflow-hidden rounded-lg border-2 border-white/90 bg-black shadow-elevation-3">
        <img :src="frame(time)" alt="" class="aspect-video w-full object-cover" />
        <p class="truncate px-2 py-0.5 text-center text-label-large text-white">
          <template v-if="chapter">{{ chapter.title }} · </template>{{ formatted }}
        </p>
      </div>
    </template>
  </MSeekBar>
</template>
