<script setup lang="ts">
/* Logo, the week shown (previous, this week, next), theme, docs and source. */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { MButton, MIcon, MIconButton, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'

const props = defineProps<{ wide: boolean; week: string }>()
const emit = defineEmits<{ prev: []; next: []; today: [] }>()
const router = useRouter()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const openSource = () => window.open(exampleSource('shifts'), '_blank', 'noopener')
const label = computed(() => {
  const d = new Date(`${props.week}T00:00`)
  const end = new Date(d)
  end.setDate(d.getDate() + 6)
  const f = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' })
  return `${f.format(d)} – ${f.format(end)}`
})
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-1 px-2 sm:gap-2 sm:px-4">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-tertiary text-on-tertiary"><MIcon name="badge" :size="22" /></span>
    <span v-if="wide" class="mr-2 text-title-large font-medium">Rota</span>
    <MIconButton icon="chevron_left" label="Previous week" @click="emit('prev')" />
    <span class="min-w-0 truncate text-title-medium">{{ label }}</span>
    <MIconButton icon="chevron_right" label="Next week" @click="emit('next')" />
    <MButton v-if="wide" variant="text" @click="emit('today')">This week</MButton>
    <span class="flex-1" />
    <MTooltip :text="`Theme: ${theme}`" placement="bottom"><MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" /></MTooltip>
    <MTooltip v-if="wide" text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
    <MTooltip v-if="wide" text="View source on GitHub" placement="bottom"><MIconButton icon="code" label="View source on GitHub" @click="openSource" /></MTooltip>
  </header>
</template>
