<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { MAvatar, MIcon, MIconButton, MKbd, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { useDashboard } from '../useDashboard'

defineEmits<{ search: [] }>()

const router = useRouter()
const { view } = useDashboard()
const { theme, cycle } = useTheme()
const titles = { overview: 'Overview', orders: 'Orders', customers: 'Customers' }
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
</script>

<template>
  <header class="sticky top-0 z-20 bg-surface/90 backdrop-blur">
    <div class="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 sm:px-6">
      <div class="min-w-0 flex-1">
        <p class="text-label-medium text-on-surface-variant">Brew &amp; Co. · Store analytics</p>
        <h1 class="truncate text-title-large text-on-surface">{{ titles[view] }}</h1>
      </div>

      <!-- Search opens the command palette (also Ctrl/⌘ K) -->
      <button
        type="button"
        class="hidden h-10 w-72 cursor-pointer items-center gap-2 rounded-full bg-surface-container-high px-4 text-left text-body-medium text-on-surface-variant transition-colors hover:bg-surface-container-highest md:flex"
        @click="$emit('search')"
      >
        <MIcon name="search" :size="20" />
        <span class="flex-1 truncate whitespace-nowrap">Search or jump to…</span>
        <MKbd :keys="['Ctrl', 'K']" />
      </button>
      <MIconButton icon="search" label="Search" class="md:hidden" @click="$emit('search')" />

      <MTooltip :text="`Theme: ${theme}`" placement="bottom">
        <MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" />
      </MTooltip>
      <MTooltip text="Back to the docs" placement="bottom">
        <MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" />
      </MTooltip>
      <MAvatar name="Alex Rivera" :size="36" class="ml-1 hidden sm:inline-flex" />
    </div>
  </header>
</template>
