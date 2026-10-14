<script setup lang="ts">
/* Wide screens: menu, logo, search across all mail, shortcuts, theme, and the example's links. */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MAvatar, MIcon, MIconButton, MMenu, MMenuItem, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { me } from '../data'
import { useMail } from '../useMail'

defineEmits<{ menu: []; shortcuts: [] }>()
const input = ref<HTMLInputElement>()
defineExpose({ focus: () => input.value?.focus() })

const router = useRouter()
const { query } = useMail()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const openSource = () => window.open(exampleSource('mail'), '_blank', 'noopener')
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 px-2">
    <MTooltip text="Main menu"><MIconButton icon="menu" label="Main menu" @click="$emit('menu')" /></MTooltip>
    <div class="flex w-[13.5rem] shrink-0 items-center gap-2">
      <span class="m3x-fill flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary">
        <MIcon name="mail" :size="22" />
      </span>
      <span class="text-title-large font-medium text-on-surface">Postbox</span>
    </div>

    <label class="flex h-12 max-w-2xl min-w-0 flex-1 items-center gap-2 rounded-full bg-surface-container-high px-4 focus-within:bg-surface-container-highest focus-within:ring-2 focus-within:ring-secondary">
      <MIcon name="search" :size="22" class="text-on-surface-variant" />
      <input
        ref="input"
        v-model="query"
        type="search"
        placeholder="Search mail"
        aria-label="Search mail"
        class="min-w-0 flex-1 bg-transparent text-body-large text-on-surface outline-none placeholder:text-on-surface-variant [&::-webkit-search-cancel-button]:hidden"
        @keydown.esc="query = ''; ($event.target as HTMLInputElement).blur()"
      />
      <button v-if="query" type="button" class="flex cursor-pointer text-on-surface-variant" aria-label="Clear search" @click="query = ''">
        <MIcon name="close" :size="20" />
      </button>
    </label>

    <span class="flex-1" />
    <MTooltip text="Keyboard shortcuts (?)" placement="bottom"><MIconButton icon="keyboard" label="Keyboard shortcuts" @click="$emit('shortcuts')" /></MTooltip>
    <MTooltip :text="`Theme: ${theme}`" placement="bottom"><MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" /></MTooltip>
    <MMenu align="right">
      <template #trigger>
        <MIconButton icon="more_vert" label="About this example" />
      </template>
      <MMenuItem icon="code" @click="openSource">View source on GitHub</MMenuItem>
      <MMenuItem icon="menu_book" @click="router.push('/examples')">Back to the docs</MMenuItem>
    </MMenu>
    <MAvatar :name="me.name" :size="36" class="mx-1" />
  </header>
</template>
