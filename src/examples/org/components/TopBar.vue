<script setup lang="ts">
/* Logo, search for a person (opens them on the chart), theme, docs and source. */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MAvatar, MIcon, MIconButton, MSearchField, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { useOrg } from '../useOrg'

defineProps<{ wide: boolean }>()
const emit = defineEmits<{ open: [id: string] }>()
const org = useOrg()
const router = useRouter()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const openSource = () => window.open(exampleSource('org'), '_blank', 'noopener')

const query = ref('')
const focused = ref(false)
const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const results = computed(() => {
  const q = fold(query.value.trim())
  if (!q) return []
  return org.people.value.filter((p) => fold(`${p.name} ${p.role} ${p.dept} ${p.location}`).includes(q)).slice(0, 6)
})
function open(id: string) {
  query.value = ''
  emit('open', id)
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter' && results.value[0]) open(results.value[0].id)
}
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 px-2 sm:px-4">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary"><MIcon name="groups" :size="22" filled /></span>
    <span v-if="wide" class="w-40 text-title-large font-medium">Crew</span>
    <div class="relative max-w-xl min-w-0 flex-1" @focusin="focused = true" @focusout="focused = false" @keydown="onKey">
      <MSearchField v-model="query" size="md" placeholder="Search people, roles, offices" />
      <div
        v-if="focused && results.length"
        class="absolute top-full right-0 left-0 z-40 mt-1 overflow-hidden rounded-lg bg-surface-container-high py-2 shadow-elevation-3"
        role="listbox"
      >
        <button
          v-for="p in results"
          :key="p.id"
          type="button"
          role="option"
          class="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left outline-none hover:bg-on-surface/8 focus-visible:bg-on-surface/12"
          @mousedown.prevent
          @click="open(p.id)"
        >
          <MAvatar :name="p.name" :size="32" />
          <span class="min-w-0">
            <span class="block truncate text-body-large text-on-surface">{{ p.name }}</span>
            <span class="block truncate text-body-small text-on-surface-variant">{{ p.role }} · {{ p.location }}</span>
          </span>
        </button>
      </div>
    </div>
    <span class="flex-1" />
    <MTooltip :text="`Theme: ${theme}`" placement="bottom"><MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" /></MTooltip>
    <MTooltip text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
    <MTooltip text="View source on GitHub" placement="bottom"><MIconButton icon="code" label="View source on GitHub" @click="openSource" /></MTooltip>
  </header>
</template>
