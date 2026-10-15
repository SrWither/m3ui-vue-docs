<script setup lang="ts">
/* The top of each page: back (or your avatar on phones), the title, theme and the example's links. */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { MAvatar, MIcon, MIconButton, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { me } from '../data'
import { usePlaza } from '../usePlaza'

defineProps<{ title: string; subtitle?: string; back?: boolean; logo?: boolean }>()
const router = useRouter()
const { back: goBack, go } = usePlaza()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const openSource = () => window.open(exampleSource('feed'), '_blank', 'noopener')
</script>

<template>
  <!-- Tabs in the slot bring their own divider -->
  <header class="sticky top-0 z-20 bg-surface/85 backdrop-blur-md" :class="{ 'border-b border-outline-variant/60': !$slots.default }">
    <div class="flex h-14 items-center gap-2 px-2">
      <MTooltip v-if="back" text="Back"><MIconButton icon="arrow_back" label="Back" @click="goBack" /></MTooltip>
      <button v-else type="button" class="cursor-pointer rounded-full p-1 sm:hidden" aria-label="Your profile" @click="go({ name: 'profile', handle: me.handle })">
        <MAvatar :name="me.name" :size="32" />
      </button>
      <div v-if="logo" class="flex flex-1 items-center justify-center gap-2 sm:justify-start sm:pl-2">
        <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-on-primary"><MIcon name="forum" :size="20" class="m3p-fill" /></span>
        <span class="text-title-large font-bold text-on-surface">{{ title }}</span>
      </div>
      <div v-else class="min-w-0 flex-1 pl-2">
        <h1 class="truncate text-title-large text-on-surface">{{ title }}</h1>
        <p v-if="subtitle" class="truncate text-body-small text-on-surface-variant">{{ subtitle }}</p>
      </div>
      <MTooltip :text="`Theme: ${theme}`" placement="bottom"><MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" /></MTooltip>
      <MTooltip text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
      <MTooltip text="View source on GitHub" placement="bottom"><MIconButton icon="code" label="View source on GitHub" @click="openSource" /></MTooltip>
    </div>
    <slot />
  </header>
</template>
