<script setup lang="ts">
/* Logo, the document's title (editable), its paper, export, theme, docs and source; on phones, the documents. */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { MIcon, MIconButton, MMenu, MMenuDivider, MMenuItem, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { useNotebooks, type Doc } from '../useNotebooks'

defineProps<{ wide: boolean }>()
const emit = defineEmits<{ docs: []; export: [kind: 'png' | 'svg' | 'json'] }>()
const n = useNotebooks()
const router = useRouter()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const openSource = () => window.open(exampleSource('sketchbook'), '_blank', 'noopener')
const PAPERS: { value: Doc['background']; label: string; icon: string }[] = [
  { value: 'none', label: 'Plain', icon: 'crop_portrait' },
  { value: 'lines', label: 'Lined', icon: 'format_align_justify' },
  { value: 'grid', label: 'Squared', icon: 'grid_on' },
  { value: 'dots', label: 'Dotted', icon: 'grid_goldenratio' },
]
function rename(e: Event) {
  const t = (e.target as HTMLInputElement).value.trim()
  if (t && t !== n.current.value.title) n.update({ title: t })
  else (e.target as HTMLInputElement).value = n.current.value.title
}
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-1 px-2 sm:gap-2 sm:px-4">
    <MTooltip v-if="!wide" text="Documents" placement="bottom"><MIconButton icon="menu" label="Documents" @click="emit('docs')" /></MTooltip>
    <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-tertiary text-on-tertiary"><MIcon name="draw" :size="22" /></span>
    <span v-if="wide" class="mr-2 text-title-large font-medium">Quill</span>
    <input
      :key="n.current.value.id"
      :value="n.current.value.title"
      aria-label="Title"
      class="h-10 min-w-0 flex-1 rounded-lg bg-transparent px-2 text-title-medium outline-none hover:bg-on-surface/5 focus:bg-surface-container-highest sm:max-w-80"
      @change="rename"
      @keydown.enter="($event.target as HTMLInputElement).blur()"
    />
    <span class="flex-1" />
    <MMenu align="right">
      <template #trigger>
        <MTooltip text="Paper" placement="bottom"><MIconButton icon="texture" label="Paper" /></MTooltip>
      </template>
      <MMenuItem v-for="p in PAPERS" :key="p.value" :icon="p.icon" :selected="n.current.value.background === p.value" @click="n.update({ background: p.value })">{{ p.label }}</MMenuItem>
    </MMenu>
    <MMenu align="right">
      <template #trigger>
        <MTooltip text="Export" placement="bottom"><MIconButton icon="ios_share" label="Export" /></MTooltip>
      </template>
      <MMenuItem icon="image" @click="emit('export', 'png')">PNG{{ n.current.value.mode === 'pages' ? ' (this page)' : '' }}</MMenuItem>
      <MMenuItem icon="draw" @click="emit('export', 'svg')">SVG{{ n.current.value.mode === 'pages' ? ' (this page)' : '' }}</MMenuItem>
      <MMenuDivider />
      <MMenuItem icon="data_object" @click="emit('export', 'json')">The drawing as JSON</MMenuItem>
    </MMenu>
    <MTooltip :text="`Theme: ${theme}`" placement="bottom"><MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" /></MTooltip>
    <MTooltip v-if="wide" text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
    <MTooltip v-if="wide" text="View source on GitHub" placement="bottom"><MIconButton icon="code" label="View source on GitHub" @click="openSource" /></MTooltip>
  </header>
</template>
