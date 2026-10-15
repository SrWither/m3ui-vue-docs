<script setup lang="ts">
/* Logo, where you are (m3ui / repo), file search, theme, and the example's links. */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { MAvatar, MIcon, MIconButton, MMenu, MMenuItem, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { me } from '../data'
import { useForge } from '../useForge'

defineProps<{ wide: boolean }>()
const router = useRouter()
const { go, repo, back, screen, finderOpen } = useForge()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const openSource = () => window.open(exampleSource('forge'), '_blank', 'noopener')
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 border-b border-outline-variant bg-surface-container-low px-2 sm:px-4">
    <MIconButton v-if="!wide && screen.name !== 'home'" icon="arrow_back" label="Back" @click="back" />
    <button type="button" class="flex shrink-0 cursor-pointer items-center gap-2" aria-label="Forge home" @click="go({ name: 'home' })">
      <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary"><MIcon name="deployed_code" :size="22" /></span>
      <span v-if="wide || !repo" class="text-title-large font-medium text-on-surface">Forge</span>
    </button>
    <nav v-if="repo" class="flex min-w-0 items-center gap-1 text-title-medium" aria-label="Location">
      <span class="text-on-surface-variant">/</span>
      <button type="button" class="cursor-pointer rounded-sm px-1 text-on-surface hover:bg-on-surface/8" @click="go({ name: 'home' })">m3ui</button>
      <span class="text-on-surface-variant">/</span>
      <span class="truncate px-1 font-medium text-on-surface">{{ repo.name }}</span>
    </nav>

    <span class="flex-1" />
    <button
      v-if="wide"
      type="button"
      class="flex h-10 w-64 cursor-pointer items-center gap-2 rounded-full bg-surface-container-high px-4 text-left text-body-medium text-on-surface-variant hover:bg-surface-container-highest"
      @click="finderOpen = true"
    >
      <MIcon name="search" :size="20" /><span class="flex-1">Type <kbd class="rounded-sm border border-outline-variant px-1 text-label-small">t</kbd> to search files</span>
    </button>
    <MIconButton v-else icon="search" label="Search files" @click="finderOpen = true" />
    <MTooltip :text="`Theme: ${theme}`" placement="bottom"><MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" /></MTooltip>
    <MMenu align="right">
      <template #trigger>
        <MIconButton icon="more_vert" label="About this example" />
      </template>
      <MMenuItem icon="code" @click="openSource">View source on GitHub</MMenuItem>
      <MMenuItem icon="menu_book" @click="router.push('/examples')">Back to the docs</MMenuItem>
    </MMenu>
    <MAvatar :name="me.name" :size="32" class="ml-1 hidden sm:inline-flex" />
  </header>
</template>
