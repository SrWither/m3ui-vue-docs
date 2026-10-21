<script setup lang="ts">
/*
 * Video example ("Flick"): a video site built only with m3ui-vue, whose videos really play.
 * - MNavigationDrawer        inline on wide screens (collapsed below 1200px, the ☰ button toggles it),
 *                            modal on a video's page; MShortNavigationBar on phones
 * - components/TopBar        logo, MSearchBar with suggestions, theme, docs and source links
 * - views/HomeView           topic chips, the video grid with skeletons, a Shorts shelf
 * - views/WatchView          the player, channel and like/dislike, description with chapters, comments, Up next
 * - components/Player        MShader as the picture: seek with preview, speed, quality, theater, full screen, shortcuts
 * - components/MiniPlayer    keeps playing while you browse; swipe it away (MSwipeToDismiss)
 * - views/ShortsView         vertical full-screen MCarousel
 * - views/Subscriptions… / ChannelView / SearchView / YouView / PlaylistView
 * - useFlick.ts / data.ts    state, and the generated channels, videos and comments
 * - shaders.ts / thumbs.ts   the videos (GLSL scenes) and their thumbnails (frames of the same scenes)
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { MIcon, MIconButton, MNavigationDrawer, MShortNavigationBar, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import type { DrawerSection, ShortNavBarItem } from '@m3ui-vue/m3ui-vue'
import { channelById, videoById } from './data'
import { useFlick } from './useFlick'
import TopBar from './components/TopBar.vue'
import MiniPlayer from './components/MiniPlayer.vue'
import SaveSheet from './components/SaveSheet.vue'
import ShareDialog from './components/ShareDialog.vue'
import HomeView from './views/HomeView.vue'
import WatchView from './views/WatchView.vue'
import ShortsView from './views/ShortsView.vue'
import SubscriptionsView from './views/SubscriptionsView.vue'
import ChannelView from './views/ChannelView.vue'
import SearchView from './views/SearchView.vue'
import YouView from './views/YouView.vue'
import PlaylistView from './views/PlaylistView.vue'

const route = useRoute()
const { screen, go, current, play, stop, subscriptions, playlists } = useFlick()

const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')
const large = computed(() => widthClass.value === 'large' || widthClass.value === 'extra-large')

// --- Navigation -----------------------------------------------------------------------------------

const main = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'shorts', label: 'Shorts', icon: 'smart_display' },
  { value: 'subscriptions', label: 'Subscriptions', icon: 'subscriptions' },
]
const tabs: ShortNavBarItem[] = [...main, { value: 'you', label: 'You', icon: 'account_circle' }]

// Wide screens: an inline drawer, full from 1200px and collapsed below, unless ☰ says otherwise.
// A video's page wants the room, so there it's a modal drawer that ☰ opens.
const watching = computed(() => screen.value.name === 'watch')
const expandedChoice = ref<boolean | null>(null)
const collapsed = computed(() => !(expandedChoice.value ?? large.value))
const drawerOpen = ref(false)
function onMenu() {
  if (watching.value) drawerOpen.value = true
  else expandedChoice.value = collapsed.value
}

const sections = computed<DrawerSection[]>(() => {
  // Collapsed, it's YouTube's mini guide: the main destinations and You.
  if (collapsed.value && !watching.value) return [{ items: tabs }]
  return [
    { items: main },
    {
      title: 'You',
      items: [
        { value: 'you', label: 'Your channel', icon: 'account_circle' },
        { value: 'pl:history', label: 'History', icon: 'history' },
        { value: 'pl:watch-later', label: 'Watch later', icon: 'schedule' },
        { value: 'pl:liked', label: 'Liked videos', icon: 'thumb_up' },
        ...playlists.value.filter((p) => !p.builtIn).map((p) => ({ value: `pl:${p.id}`, label: p.name, icon: 'playlist_play' })),
      ],
    },
    {
      title: 'Subscriptions',
      items: [...subscriptions].map((id) => ({ value: `ch:${id}`, label: channelById.get(id)!.name, icon: 'account_circle' })),
    },
  ]
})
const selected = computed(() => {
  const s = screen.value
  if (s.name === 'playlist') return `pl:${s.id}`
  if (s.name === 'channel') return `ch:${s.id}`
  return s.name
})
function select(v: string | number) {
  const value = String(v)
  if (value.startsWith('pl:')) go({ name: 'playlist', id: value.slice(3) })
  else if (value.startsWith('ch:')) go({ name: 'channel', id: value.slice(3) })
  else go({ name: value } as never)
  drawerOpen.value = false
}
// Phones: the tab follows the page; a playlist belongs to You.
const tab = computed({
  get: () => {
    const n = screen.value.name
    return n === 'playlist' ? 'you' : ['home', 'shorts', 'subscriptions', 'you'].includes(n) ? n : ''
  },
  set: (v: string | number) => select(v),
})

const view = computed(() => {
  const s = screen.value
  switch (s.name) {
    case 'watch': return { is: WatchView, props: { id: s.id, wide: wide.value } }
    case 'shorts': return { is: ShortsView, props: { id: s.id, wide: wide.value } }
    case 'subscriptions': return { is: SubscriptionsView, props: {} }
    case 'channel': return { is: ChannelView, props: { id: s.id } }
    case 'search': return { is: SearchView, props: { q: s.q } }
    case 'you': return { is: YouView, props: {} }
    case 'playlist': return { is: PlaylistView, props: { id: s.id } }
    default: return { is: HomeView, props: {} }
  }
})
// Watch pages share one key, so going from one video to the next keeps the player mounted.
const viewKey = computed(() => (screen.value.name === 'watch' ? 'watch' : JSON.stringify(screen.value)))
const miniPlayer = computed(() => !!current.value && screen.value.name !== 'watch' && screen.value.name !== 'shorts')

const scroller = ref<HTMLElement>()
const toTop = () => scroller.value?.scrollTo({ top: 0 })
watch(() => screen.value.name === 'watch' && screen.value.id, (id) => id && toTop())

onMounted(() => {
  // A shared link: /examples/flick?v=v12&t=90
  const v = route.query.v
  if (typeof v === 'string' && videoById.has(v)) {
    const t = Number(route.query.t)
    if (videoById.get(v)!.short) go({ name: 'shorts', id: v }, true)
    else play(v, { at: Number.isFinite(t) ? t : undefined })
  }
})
// Leaving the example stops the video.
onBeforeUnmount(stop)
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-surface text-on-surface">
    <TopBar :wide="wide" @menu="onMenu" />
    <div class="flex min-h-0 flex-1">
      <MNavigationDrawer
        v-if="wide && !watching"
        :model-value="true"
        :modal="false"
        :collapsed="collapsed"
        :sections="sections"
        :selected="selected"
        :width="collapsed ? undefined : '240px'"
        @select="select"
      />
      <div class="flex min-w-0 flex-1 flex-col">
        <div ref="scroller" class="min-h-0 flex-1" :class="screen.name === 'shorts' ? 'overflow-hidden' : 'overflow-y-auto'">
          <Transition name="flk-page" mode="out-in" @after-leave="toTop">
            <component :is="view.is" :key="viewKey" v-bind="view.props" />
          </Transition>
        </div>
        <MiniPlayer v-if="miniPlayer" :wide="wide" class="shrink-0" />
      </div>
    </div>
    <MShortNavigationBar v-if="!wide" v-model="tab" :items="tabs" />

    <MNavigationDrawer v-if="wide && watching" v-model="drawerOpen" :sections="sections" :selected="selected" width="280px" @select="select">
      <template #header>
        <div class="flex h-14 items-center gap-1 px-2">
          <MIconButton icon="menu" label="Close menu" @click="drawerOpen = false" />
          <span class="flex items-center gap-1.5 pl-1">
            <span class="flex h-7 w-10 items-center justify-center rounded-lg bg-primary text-on-primary"><MIcon name="play_arrow" :size="22" filled /></span>
            <span class="text-title-large font-bold tracking-tight text-on-surface">Flick</span>
          </span>
        </div>
      </template>
    </MNavigationDrawer>
    <SaveSheet :wide="wide" />
    <ShareDialog />
  </div>
</template>

<style scoped>
.flk-page-enter-active,
.flk-page-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.flk-page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.flk-page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
@media (prefers-reduced-motion: reduce) {
  .flk-page-enter-active,
  .flk-page-leave-active {
    transition: none;
  }
}
</style>

<style>
/* The video grid: as many ~300px columns as fit, one full-width column on phones. */
.flk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 40px 16px;
}
.flk-noscroll {
  scrollbar-width: none;
}
.flk-noscroll::-webkit-scrollbar {
  display: none;
}
</style>
