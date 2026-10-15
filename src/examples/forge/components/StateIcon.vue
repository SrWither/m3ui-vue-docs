<script setup lang="ts">
/* Open / closed / merged / draft, as an icon in the state's color, or as a pill with `pill`. */
import { computed } from 'vue'
import { MIcon } from '@m3ui-vue/m3ui-vue'

const props = defineProps<{ state: 'open' | 'closed' | 'merged'; pull?: boolean; pill?: boolean }>()
const look = computed(() => {
  if (props.state === 'merged') return { icon: 'merge', text: 'Merged', fg: 'text-tertiary', bg: 'bg-tertiary text-on-tertiary' }
  if (props.state === 'closed') return props.pull ? { icon: 'close', text: 'Closed', fg: 'text-error', bg: 'bg-error text-on-error' } : { icon: 'check_circle', text: 'Closed', fg: 'text-tertiary', bg: 'bg-tertiary text-on-tertiary' }
  return { icon: props.pull ? 'call_split' : 'adjust', text: 'Open', fg: 'text-success', bg: 'bg-success text-on-success' }
})
</script>

<template>
  <span v-if="pill" class="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full pr-3.5 pl-2.5 text-label-large" :class="look.bg">
    <MIcon :name="look.icon" :size="18" />{{ look.text }}
  </span>
  <MIcon v-else :name="look.icon" :size="20" class="shrink-0" :class="look.fg" />
</template>
