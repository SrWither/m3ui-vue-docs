<script setup lang="ts">
/*
 * The top of the app: ☰ (wide screens), the logo, search (a docked MSearchBar on wide screens, an icon that opens
 * it full screen on phones) with your recent searches and title suggestions, the theme, and the
 * example's links back to the docs and to its source.
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MIcon, MIconButton, MList, MListItem, MSearchBar, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { videos } from '../data'
import { useFlick } from '../useFlick'

const props = defineProps<{ wide: boolean }>()
const emit = defineEmits<{ menu: [] }>()
const router = useRouter()
const { go, search, recentSearches, screen } = useFlick()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])

const query = ref(screen.value.name === 'search' ? screen.value.q : '')
const expanded = ref(false)
const suggestions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return recentSearches.value.map((s) => ({ text: s, recent: true }))
  const titles = [...new Set(videos.map((v) => v.title.toLowerCase()))].filter((t) => t.includes(q))
  return titles.slice(0, 8).map((text) => ({ text, recent: recentSearches.value.includes(text) }))
})
function submit(q = query.value) {
  if (!q.trim()) return
  query.value = q
  expanded.value = false
  search(q)
}
const removeRecent = (s: string) => (recentSearches.value = recentSearches.value.filter((r) => r !== s))
const openSource = () => window.open(exampleSource('flick'), '_blank', 'noopener')
</script>

<template>
  <header class="flex h-14 shrink-0 items-center gap-1 bg-surface px-2 sm:gap-2 sm:px-4">
    <MIconButton v-if="props.wide" icon="menu" label="Menu" class="-ml-1" @click="emit('menu')" />
    <button type="button" class="flex cursor-pointer items-center gap-1.5 rounded-full py-1 pr-2 pl-1" aria-label="Flick home" @click="go({ name: 'home' })">
      <span class="flex h-7 w-10 items-center justify-center rounded-lg bg-primary text-on-primary"><MIcon name="play_arrow" :size="22" class="flk-fill" /></span>
      <span class="text-title-large font-bold tracking-tight text-on-surface">Flick</span>
    </button>

    <div class="flex min-w-0 flex-1 justify-center">
      <MSearchBar
        v-model="query"
        v-model:expanded="expanded"
        :variant="props.wide ? 'docked' : 'fullscreen'"
        placeholder="Search"
        :class="props.wide ? 'w-full max-w-xl' : 'hidden'"
        @search="submit()"
      >
        <MList>
          <MListItem
            v-for="s in suggestions"
            :key="s.text"
            :icon="s.recent ? 'history' : 'search'"
            :title="s.text"
            clickable
            @click="submit(s.text)"
          >
            <template v-if="s.recent && !query" #trailing>
              <MIconButton icon="close" :label="`Remove ${s.text}`" size="xs" @click.stop="removeRecent(s.text)" />
            </template>
          </MListItem>
        </MList>
      </MSearchBar>
    </div>

    <MTooltip v-if="!props.wide" text="Search" placement="bottom"><MIconButton icon="search" label="Search" @click="expanded = true" /></MTooltip>
    <MTooltip :text="`Theme: ${theme}`" placement="bottom"><MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" /></MTooltip>
    <MTooltip text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
    <MTooltip text="View source on GitHub" placement="bottom"><MIconButton icon="code" label="View source on GitHub" @click="openSource" /></MTooltip>
  </header>
</template>
