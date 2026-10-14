<script setup lang="ts">
import { computed } from 'vue'
import { MIconButton, MSlider } from '@m3ui-vue/m3ui-vue'
import { useMusic } from '../useMusic'

const { volume, muted } = useMusic()
const icon = computed(() => (muted.value || volume.value === 0 ? 'volume_off' : volume.value < 0.5 ? 'volume_down' : 'volume_up'))
const level = computed({
  get: () => (muted.value ? 0 : Math.round(volume.value * 100)),
  set: (v: number) => {
    volume.value = v / 100
    muted.value = false
  },
})
</script>

<template>
  <div class="flex items-center gap-1">
    <MIconButton :icon="icon" :label="muted ? 'Unmute' : 'Mute'" @click="muted = !muted" />
    <MSlider v-model="level" :min="0" :max="100" class="w-24 lg:w-28" />
  </div>
</template>
