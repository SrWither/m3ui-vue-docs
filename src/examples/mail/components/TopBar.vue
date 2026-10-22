<script setup lang="ts">
/* Wide screens: menu, logo, search across all mail, shortcuts, theme, and the example's links. */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MAvatar, MIcon, MIconButton, MSearchField, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { me } from '../data'
import { useMail } from '../useMail'

defineEmits<{ menu: []; shortcuts: [] }>()
const field = ref<InstanceType<typeof MSearchField>>()
defineExpose({ focus: () => field.value?.focus() })

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
      <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary">
        <MIcon name="mail" :size="22" filled />
      </span>
      <span class="text-title-large font-medium text-on-surface">Postbox</span>
    </div>

    <MSearchField ref="field" v-model="query" size="md" placeholder="Search mail" class="max-w-2xl flex-1 focus-within:bg-surface-container-highest" />

    <span class="flex-1" />
    <MTooltip text="Keyboard shortcuts (?)" placement="bottom"><MIconButton icon="keyboard" label="Keyboard shortcuts" @click="$emit('shortcuts')" /></MTooltip>
    <MTooltip :text="`Theme: ${theme}`" placement="bottom"><MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" /></MTooltip>
    <MTooltip text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
    <MTooltip text="View source on GitHub" placement="bottom"><MIconButton icon="code" label="View source on GitHub" @click="openSource" /></MTooltip>
    <MAvatar :name="me.name" :size="36" class="mx-1" />
  </header>
</template>
