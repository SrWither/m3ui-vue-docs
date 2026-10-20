<script setup lang="ts">
/*
 * The app's name on a cookie-shaped badge, then theme, docs and source links.
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { MIcon, MIconButton, MShape, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'

defineProps<{ title?: string }>()

const router = useRouter()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const openSource = () => window.open(exampleSource('recipes'), '_blank', 'noopener')
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-1 px-3 sm:px-5">
    <slot name="leading">
      <div class="flex items-center gap-2">
        <span class="relative grid h-10 w-10 place-items-center text-on-tertiary-container">
          <MShape shape="Cookie9Sided" class="absolute inset-0 text-tertiary-container" />
          <MIcon name="skillet" :size="22" filled class="relative" />
        </span>
        <span class="sim-display text-title-large font-semibold tracking-tight text-on-surface">Simmer</span>
      </div>
    </slot>

    <span class="flex-1" />

    <slot name="actions" />
    <MTooltip :text="`Theme: ${theme}`" placement="bottom">
      <MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" />
    </MTooltip>
    <MTooltip text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
    <MTooltip text="View source on GitHub" placement="bottom"><MIconButton icon="code" label="View source on GitHub" @click="openSource" /></MTooltip>
  </header>
</template>
