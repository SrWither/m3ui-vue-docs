<script setup lang="ts">
/*
 * Above the page: back/forward on wide screens (like a browser), the app's name or a back
 * arrow on phones, and theme, docs and source links.
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { MIcon, MIconButton, MMenu, MMenuItem, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { useMusic } from '../useMusic'

defineProps<{ wide: boolean }>()

const router = useRouter()
const { screen, back, forward, canBack, canForward } = useMusic()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const openSource = () => window.open(exampleSource('music'), '_blank', 'noopener')
const isTab = computed(() => ['home', 'search', 'library'].includes(screen.value.name))
</script>

<template>
  <header class="flex h-14 shrink-0 items-center gap-1 px-2 sm:px-3">
    <template v-if="wide">
      <MTooltip text="Go back">
        <MIconButton icon="chevron_left" label="Go back" variant="tonal" size="xs" :disabled="!canBack" @click="back" />
      </MTooltip>
      <MTooltip text="Go forward">
        <MIconButton icon="chevron_right" label="Go forward" variant="tonal" size="xs" :disabled="!canForward" @click="forward" />
      </MTooltip>
    </template>
    <MIconButton v-else-if="!isTab && canBack" icon="arrow_back" label="Go back" @click="back" />
    <div v-if="!wide && (isTab || !canBack)" class="flex items-center gap-2 pl-2">
      <span class="m3m-fill flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary">
        <MIcon name="graphic_eq" :size="20" />
      </span>
      <span class="text-title-large font-bold text-on-surface">Tempo</span>
    </div>

    <span class="flex-1" />

    <MTooltip :text="`Theme: ${theme}`" placement="bottom">
      <MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" />
    </MTooltip>
    <MMenu align="right">
      <template #trigger>
        <MIconButton icon="more_vert" label="About this example" />
      </template>
      <MMenuItem icon="code" @click="openSource">View source on GitHub</MMenuItem>
      <MMenuItem icon="menu_book" @click="router.push('/examples')">Back to the docs</MMenuItem>
    </MMenu>
  </header>
</template>
