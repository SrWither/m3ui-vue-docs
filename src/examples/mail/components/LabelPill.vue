<script setup lang="ts">
import { computed } from 'vue'
import { labels } from '../data'

const props = defineProps<{ id: string }>()
const label = computed(() => labels.find((l) => l.id === props.id))
const tones = {
  primary: 'bg-primary-container text-on-primary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
  success: 'bg-success-container text-on-success-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
}
</script>

<template>
  <span v-if="label" class="inline-flex h-5 shrink-0 items-center rounded-sm px-1.5 text-label-small" :class="tones[label.tone]">{{ label.name }}</span>
</template>
