<script setup lang="ts">
/* A label in its own color, readable on both themes (tinted fill, colored border and text). */
import { computed } from 'vue'
import { labelById } from '../data'

const props = defineProps<{ id: string }>()
const label = computed(() => labelById(props.id))
</script>

<template>
  <span
    v-if="label"
    class="inline-flex h-5 shrink-0 items-center rounded-full border px-2 text-label-small font-medium"
    :style="{ borderColor: `${label.color}99`, backgroundColor: `${label.color}2e`, color: `color-mix(in srgb, ${label.color} 70%, var(--color-on-surface))` }"
    :title="label.description"
  >{{ label.name }}</span>
</template>
