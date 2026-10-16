<script setup lang="ts">
/* The top of each tab: the logo or a back button, the title, theme and the example's links. */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { MIcon, MIconButton, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { useTravel } from '../useTravel'

defineProps<{ title: string; subtitle?: string; back?: boolean; logo?: boolean }>()
const router = useRouter()
const { back: goBack } = useTravel()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const openSource = () => window.open(exampleSource('travel'), '_blank', 'noopener')
</script>

<template>
  <header class="sticky top-0 z-20 bg-surface/90 backdrop-blur-md">
    <div class="flex h-16 items-center gap-1 px-2 sm:px-4">
      <MTooltip v-if="back" text="Back"><MIconButton icon="arrow_back" label="Back" @click="goBack" /></MTooltip>
      <div v-if="logo" class="flex flex-1 items-center gap-2 pl-2">
        <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary"><MIcon name="travel_explore" :size="22" /></span>
        <span class="text-title-large font-medium text-on-surface">{{ title }}</span>
      </div>
      <div v-else class="min-w-0 flex-1 pl-2">
        <h1 class="truncate text-title-large text-on-surface">{{ title }}</h1>
        <p v-if="subtitle" class="truncate text-body-small text-on-surface-variant">{{ subtitle }}</p>
      </div>
      <slot name="actions" />
      <MTooltip :text="`Theme: ${theme}`" placement="bottom"><MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" /></MTooltip>
      <MTooltip text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
      <MTooltip text="View source on GitHub" placement="bottom"><MIconButton icon="code" label="View source on GitHub" @click="openSource" /></MTooltip>
    </div>
  </header>
</template>
