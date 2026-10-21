<script setup lang="ts">
import { MIcon } from '@m3ui-vue/m3ui-vue'

defineProps<{ status: 'success' | 'failure' | 'running' | 'queued' | 'skipped'; size?: number }>()
const look = {
  success: { icon: 'check_circle', cls: 'text-success', filled: true },
  failure: { icon: 'cancel', cls: 'text-error', filled: true },
  running: { icon: 'progress_activity', cls: 'animate-spin text-tertiary' },
  queued: { icon: 'schedule', cls: 'text-tertiary' },
  skipped: { icon: 'block', cls: 'text-on-surface-variant' },
}
</script>

<template>
  <MIcon :name="look[status].icon" :size="size ?? 20" :filled="!!look[status].filled" class="shrink-0" :class="look[status].cls" :aria-label="status" />
</template>
