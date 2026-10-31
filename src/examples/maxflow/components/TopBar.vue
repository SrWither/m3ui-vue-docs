<script setup lang="ts">
/* Logo, the network to start from, the algorithm, theme, docs and source. */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { MIcon, MIconButton, MSegmentedButton, MSelect, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { presets } from '../presets'
import { useNetwork } from '../useNetwork'
import type { Algorithm } from '../maxflow'

defineProps<{ wide: boolean }>()
const n = useNetwork()
const router = useRouter()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const openSource = () => window.open(exampleSource('maxflow'), '_blank', 'noopener')

const preset = computed({
  get: () => n.presetId.value,
  set: (id: string) => n.load(presets.find((p) => p.id === id)!),
})
function setAlgorithm(a: Algorithm) {
  n.algorithm.value = a
  // A run in progress starts over with the other algorithm
  if (n.running.value) n.start()
}
</script>

<template>
  <header class="flex min-h-16 shrink-0 flex-wrap items-center gap-2 px-2 py-2 sm:px-4">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary"><MIcon name="valve" :size="22" /></span>
    <span v-if="wide" class="mr-2 text-title-large font-medium">Flowlab</span>
    <MSelect v-model="preset" :options="presets.map((p) => ({ value: p.id, label: p.name }))" label="Network" variant="outlined" class="w-48" />
    <MSegmentedButton
      :model-value="n.algorithm.value"
      :options="[{ value: 'edmonds-karp', label: 'Edmonds–Karp' }, { value: 'dinic', label: 'Dinic' }]"
      @update:model-value="setAlgorithm($event as Algorithm)"
    />
    <span class="flex-1" />
    <MTooltip :text="`Theme: ${theme}`" placement="bottom"><MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" /></MTooltip>
    <MTooltip text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
    <MTooltip text="View source on GitHub" placement="bottom"><MIconButton icon="code" label="View source on GitHub" @click="openSource" /></MTooltip>
  </header>
</template>
