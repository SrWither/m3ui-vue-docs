<script setup lang="ts">
/* Logo, search across every file, theme, docs and source. On phones: the menu button opens the drawer. */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MIcon, MIconButton, MSearchField, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { useFiles } from '../useFiles'

defineProps<{ wide: boolean }>()
defineEmits<{ menu: [] }>()
const field = ref<InstanceType<typeof MSearchField>>()
defineExpose({ focus: () => field.value?.focus() })

const router = useRouter()
const { query } = useFiles()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const openSource = () => window.open(exampleSource('files'), '_blank', 'noopener')
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 px-2 sm:px-4">
    <MIconButton v-if="!wide" icon="menu" label="Menu" @click="$emit('menu')" />
    <div v-else class="flex w-56 shrink-0 items-center gap-2 pl-2">
      <span class="flex size-9 items-center justify-center rounded-xl bg-primary text-on-primary"><MIcon name="folder_open" :size="22" filled /></span>
      <span class="text-title-large font-medium">Folio</span>
    </div>
    <MSearchField ref="field" v-model="query" size="md" placeholder="Search in Folio" class="max-w-2xl min-w-0 flex-1" />
    <span v-if="wide" class="flex-1" />
    <MTooltip :text="`Theme: ${theme}`" placement="bottom"><MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" /></MTooltip>
    <MTooltip text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
    <MTooltip text="View source on GitHub" placement="bottom"><MIconButton icon="code" label="View source on GitHub" @click="openSource" /></MTooltip>
  </header>
</template>
