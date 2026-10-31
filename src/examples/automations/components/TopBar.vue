<script setup lang="ts">
/* Logo, the workflow's name (editable), tidy up, test run, theme, docs and source. */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { MButton, MIcon, MIconButton, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { useWorkflow } from '../useWorkflow'

defineProps<{ wide: boolean }>()
const emit = defineEmits<{ run: []; tidy: [] }>()
const w = useWorkflow()
const router = useRouter()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const openSource = () => window.open(exampleSource('automations'), '_blank', 'noopener')
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 px-2 sm:px-4">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary"><MIcon name="cable" :size="22" /></span>
    <span v-if="wide" class="text-title-large font-medium">Relay</span>
    <MIcon v-if="wide" name="chevron_right" :size="20" class="text-outline" />
    <input
      v-model="w.name.value"
      aria-label="Workflow name"
      class="min-w-0 flex-1 truncate rounded-sm bg-transparent px-2 py-1 text-title-medium text-on-surface outline-none hover:bg-on-surface/8 focus:bg-surface-container-highest sm:max-w-80"
    />
    <span v-if="wide" class="flex-1" />
    <MTooltip text="Tidy up" placement="bottom"><MIconButton icon="account_tree" label="Tidy up" @click="emit('tidy')" /></MTooltip>
    <MButton :loading="w.running.value" icon="play_arrow" @click="emit('run')">{{ wide ? 'Test run' : 'Run' }}</MButton>
    <MTooltip :text="`Theme: ${theme}`" placement="bottom"><MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" /></MTooltip>
    <MTooltip text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
    <MTooltip text="View source on GitHub" placement="bottom"><MIconButton icon="code" label="View source on GitHub" @click="openSource" /></MTooltip>
  </header>
</template>
