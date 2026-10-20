<script setup lang="ts">
/*
 * Music example: a streaming app built only with m3ui-vue, whose songs really play.
 * - Sidebar / LibraryList     Home, Search and Your Library (a tab of its own on phones)
 * - views/*.vue               Home shelves, Search, albums/playlists/Liked Songs, artists
 * - PlayerBar / MiniPlayer    the player: a bar on wide screens, a card over the tabs on phones
 * - NowPlaying.vue            the full player with a live visualizer
 * - QueuePanel.vue            the queue, reordered by dragging (MDragDropList)
 * - useMusic.ts               navigation, library and player state
 * - engine.ts                 the songs: generated live with the Web Audio API
 * - catalog.ts / art.ts       the fake catalog and its covers, drawn as SVG
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { MBottomSheet, MIconButton, MShortNavigationBar, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import type { ShortNavBarItem } from '@m3ui-vue/m3ui-vue'
import { useMusic } from './useMusic'
import TopBar from './components/TopBar.vue'
import Sidebar from './components/Sidebar.vue'
import PlayerBar from './components/PlayerBar.vue'
import MiniPlayer from './components/MiniPlayer.vue'
import NowPlaying from './components/NowPlaying.vue'
import QueuePanel from './components/QueuePanel.vue'
import NewPlaylistDialog from './components/NewPlaylistDialog.vue'
import HomeView from './views/HomeView.vue'
import SearchView from './views/SearchView.vue'
import LibraryView from './views/LibraryView.vue'
import CollectionView from './views/CollectionView.vue'
import ArtistView from './views/ArtistView.vue'

const { screen, go, playing, toggle, queueOpen } = useMusic()

// Sidebar + player bar from 840px wide; tabs + mini player below.
const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')

const view = computed(() => {
  const s = screen.value
  switch (s.name) {
    case 'home':
      return { is: HomeView, props: {} }
    case 'search':
      return { is: SearchView, props: {} }
    case 'library':
      return { is: LibraryView, props: {} }
    case 'liked':
      return { is: CollectionView, props: { type: 'liked', id: 'liked' } }
    case 'artist':
      return { is: ArtistView, props: { id: s.id } }
    default:
      return { is: CollectionView, props: { type: s.name, id: s.id } }
  }
})
const viewKey = computed(() => `${screen.value.name}-${'id' in screen.value ? screen.value.id : ''}`)

// Phones: the tab follows the page (an album opened from Search keeps Search highlighted).
const tabs: ShortNavBarItem[] = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'search', label: 'Search', icon: 'search' },
  { value: 'library', label: 'Your Library', icon: 'library_music' },
]
const lastTab = ref('home')
const tab = computed({
  get: () => {
    const n = screen.value.name
    if (n === 'home' || n === 'search' || n === 'library') lastTab.value = n
    return lastTab.value
  },
  set: (v: string | number) => go({ name: v as 'home' | 'search' | 'library' }),
})

// A new page starts at the top.
const scroller = ref<HTMLElement>()
const toTop = () => scroller.value?.scrollTo({ top: 0 })

// Space plays/pauses, unless you're typing or on a control that uses it.
function onKey(e: KeyboardEvent) {
  if (e.code !== 'Space' || e.repeat) return
  const t = e.target as HTMLElement
  if (t.closest('input, textarea, button, a, [role="button"], [role="link"], [contenteditable], [data-drag-handle]')) return
  e.preventDefault()
  toggle()
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  // Leaving the example stops the music (it would keep playing over the docs otherwise).
  if (playing.value) toggle()
})
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-surface text-on-surface">
    <div class="flex min-h-0 flex-1" :class="{ 'gap-2 p-2 pb-0': wide }">
      <Sidebar v-if="wide" class="w-72 shrink-0 xl:w-80" />

      <section class="flex min-w-0 flex-1 flex-col overflow-hidden bg-surface-container-low" :class="{ 'rounded-2xl': wide }">
        <TopBar :wide="wide" />
        <div ref="scroller" class="min-h-0 flex-1 overflow-y-auto">
          <!-- Same page transition as the docs -->
          <Transition name="m3m-page" mode="out-in" @after-leave="toTop">
            <component :is="view.is" :key="viewKey" v-bind="view.props" />
          </Transition>
        </div>
      </section>

      <aside v-if="wide && queueOpen" class="flex w-80 shrink-0 flex-col overflow-hidden rounded-2xl bg-surface-container-low" aria-label="Queue">
        <div class="flex items-center px-4 pt-3 pb-1">
          <h2 class="flex-1 text-title-medium text-on-surface">Queue</h2>
          <MIconButton icon="close" label="Close queue" @click="queueOpen = false" />
        </div>
        <QueuePanel class="min-h-0 flex-1 overflow-y-auto px-4 pb-4" />
      </aside>
    </div>

    <PlayerBar v-if="wide" />
    <div v-else class="shrink-0 bg-surface-container-low">
      <MiniPlayer />
      <MShortNavigationBar v-model="tab" :items="tabs" />
    </div>

    <NowPlaying />
    <MBottomSheet v-if="!wide" v-model="queueOpen" title="Queue" partial>
      <QueuePanel />
    </MBottomSheet>
    <NewPlaylistDialog />
  </div>
</template>

<style scoped>
.m3m-page-enter-active,
.m3m-page-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.m3m-page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.m3m-page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
@media (prefers-reduced-motion: reduce) {
  .m3m-page-enter-active,
  .m3m-page-leave-active {
    transition: none;
  }
}
</style>

<style>
/* Filled Material Symbols (play, like, skip…) anywhere inside an element with this class. */
.m3m-fill.material-symbols-outlined,
.m3m-fill .material-symbols-outlined {
  font-variation-settings: 'FILL' 1;
}
</style>
