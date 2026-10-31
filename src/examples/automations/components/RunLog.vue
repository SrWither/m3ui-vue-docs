<script setup lang="ts">
/* The last test run, step by step, over the canvas's top right corner (a panel in MFlow's default slot). */
import { nextTick, ref, watch } from 'vue'
import { MIcon, MIconButton } from '@m3ui-vue/m3ui-vue'
import { useWorkflow } from '../useWorkflow'

const emit = defineEmits<{ close: [] }>()
const w = useWorkflow()
const open = ref(true)
const list = ref<HTMLElement>()
watch(() => w.log.value.length, async () => {
  open.value = true
  await nextTick()
  list.value?.scrollTo({ top: list.value.scrollHeight })
})
const TONE = { info: 'text-on-surface-variant', ok: 'text-primary', error: 'text-error' }
</script>

<template>
  <div data-flow-panel class="absolute top-4 right-4 z-20 w-72 max-w-[calc(100%-2rem)] overflow-hidden rounded-lg bg-surface-container-high shadow-elevation-3">
    <div class="flex items-center gap-2 py-1 pr-1 pl-3">
      <MIcon :name="w.running.value ? 'progress_activity' : 'receipt_long'" :size="20" :class="w.running.value && 'animate-spin'" />
      <span class="flex-1 text-title-small">{{ w.running.value ? 'Running…' : 'Last run' }}</span>
      <MIconButton :icon="open ? 'expand_less' : 'expand_more'" :label="open ? 'Collapse' : 'Expand'" size="xs" @click="open = !open" />
      <MIconButton icon="close" label="Clear the run" size="xs" :disabled="w.running.value" @click="emit('close')" />
    </div>
    <div v-show="open" ref="list" class="max-h-56 overflow-y-auto px-3 pb-3 font-mono text-body-small" data-flow-nowheel>
      <p v-for="(l, i) in w.log.value" :key="i" class="flex gap-2">
        <span class="w-10 shrink-0 text-right text-outline">{{ (l.at / 1000).toFixed(1) }}s</span>
        <span :class="TONE[l.tone]">{{ l.text }}</span>
      </p>
    </div>
  </div>
</template>
