<script setup lang="ts">
/* The big round play/pause button of a page. */
import { MIcon } from '@m3ui-vue/m3ui-vue'

defineProps<{ playing: boolean; label: string }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <button
    type="button"
    :aria-label="playing ? `Pause ${label}` : `Play ${label}`"
    class="m3m-fill flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary shadow-elevation-1 transition-[transform,box-shadow] hover:scale-105 hover:shadow-elevation-2 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
    @click="$emit('click')"
  >
    <MIcon :name="playing ? 'pause' : 'play_arrow'" :size="32" />
  </button>
</template>
