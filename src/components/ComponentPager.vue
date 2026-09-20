<script setup lang="ts">
import { computed } from 'vue'
import { MIcon } from '@m3ui-vue/m3ui-vue'
import { componentPageOrder } from '@/nav/sections'

const props = defineProps<{ current: string }>()

const index = computed(() => componentPageOrder.findIndex((c) => c.name === props.current))
const prev = computed(() => (index.value > 0 ? componentPageOrder[index.value - 1] : null))
const next = computed(() =>
  index.value >= 0 && index.value < componentPageOrder.length - 1
    ? componentPageOrder[index.value + 1]
    : null,
)
</script>

<template>
  <nav
    v-if="prev || next"
    class="mt-10 flex items-stretch gap-3 border-t border-outline-variant pt-6"
  >
    <RouterLink
      v-if="prev"
      :to="prev.to"
      class="group flex flex-1 flex-col items-start gap-0.5 rounded-xl border border-outline-variant p-4 transition-colors hover:bg-surface-container"
    >
      <span class="flex items-center gap-1 text-body-small text-on-surface-variant">
        <MIcon name="arrow_back" :size="16" />
        {{ prev.section }}
      </span>
      <span class="text-title-medium font-medium text-primary group-hover:underline">{{ prev.name }}</span>
    </RouterLink>
    <div v-else class="flex-1" />

    <RouterLink
      v-if="next"
      :to="next.to"
      class="group flex flex-1 flex-col items-end gap-0.5 rounded-xl border border-outline-variant p-4 text-right transition-colors hover:bg-surface-container"
    >
      <span class="flex items-center gap-1 text-body-small text-on-surface-variant">
        {{ next.section }}
        <MIcon name="arrow_forward" :size="16" />
      </span>
      <span class="text-title-medium font-medium text-primary group-hover:underline">{{ next.name }}</span>
    </RouterLink>
    <div v-else class="flex-1" />
  </nav>
</template>
