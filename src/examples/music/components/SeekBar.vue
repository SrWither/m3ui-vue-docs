<script setup lang="ts">
/*
 * Song position with elapsed and total time: an MSeekBar in the M3 slider look. Dragging only
 * moves the thumb, and the song seeks once you let go (seeking restarts the synth); while
 * playing it advances on its own between the engine's position reads.
 */
import { computed } from 'vue'
import { MSeekBar } from '@m3ui-vue/m3ui-vue'
import { formatTime } from '../catalog'
import { useMusic } from '../useMusic'

const { track, position, playing, seek } = useMusic()
const duration = computed(() => track.value?.duration ?? 0)
</script>

<template>
  <MSeekBar
    :model-value="position"
    :duration="duration"
    :playing="playing"
    :format="formatTime"
    variant="slider"
    time="sides"
    @seek="seek"
  />
</template>
