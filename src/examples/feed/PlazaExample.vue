<script setup lang="ts">
/*
 * Feed example ("Plaza"): a social feed built only with m3ui-vue.
 * - MNavigationSuite       bottom bar on phones, rail on tablets, expanded rail on large screens
 * - views/HomeView         For you / Following, stories, MPullToRefresh + MInfiniteScroll timeline
 * - views/ExploreView      search, trending tags, an endless MMasonry photo wall
 * - views/Notifications…   likes, reposts, follows, replies, mentions
 * - views/ProfileView      banner, bio, follow (MToggleButton), posts / media / likes
 * - views/PostView         a post with its replies
 * - components/PostCard    text with #tags and @mentions, photos (MLightbox, double-tap to like), polls
 * - components/Composer    MDialog with a character ring (MCircleProgressBar), photos, polls, emoji
 * - components/StoryViewer full-screen stories with MProgressBar segments
 * - usePlaza.ts / data.ts / art.ts   state, generated people and posts, SVG photos
 */
import { computed } from 'vue'
import { MFab, MNavigationSuite, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import type { NavigationSuiteItem } from '@m3ui-vue/m3ui-vue'
import { me } from './data'
import { usePlaza } from './usePlaza'
import Composer from './components/Composer.vue'
import SidePanel from './components/SidePanel.vue'
import StoryViewer from './components/StoryViewer.vue'
import HomeView from './views/HomeView.vue'
import ExploreView from './views/ExploreView.vue'
import NotificationsView from './views/NotificationsView.vue'
import BookmarksView from './views/BookmarksView.vue'
import ProfileView from './views/ProfileView.vue'
import PostView from './views/PostView.vue'

const { screen, go, unread, composer } = usePlaza()

const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact')
const large = computed(() => widthClass.value === 'large' || widthClass.value === 'extra-large')
const layout = computed(() => (large.value ? 'rail-expanded' : 'auto'))

const items = computed<NavigationSuiteItem[]>(() => [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'explore', label: 'Explore', icon: 'search' },
  { value: 'notifications', label: 'Notifications', icon: 'notifications', badge: unread.value || undefined },
  { value: 'bookmarks', label: 'Bookmarks', icon: 'bookmark' },
  { value: 'profile', label: 'Profile', icon: 'person' },
])
// The nav item follows the page; profile is only "Profile" when it's yours.
const current = computed({
  get: () => {
    const s = screen.value
    if (s.name === 'profile') return s.handle === me.handle ? 'profile' : ''
    return s.name === 'post' ? '' : s.name
  },
  set: (v: string | number) => go(v === 'profile' ? { name: 'profile', handle: me.handle } : ({ name: v } as never)),
})

const view = computed(() => {
  const s = screen.value
  if (s.name === 'explore') return { is: ExploreView, props: { q: s.q } }
  if (s.name === 'notifications') return { is: NotificationsView, props: {} }
  if (s.name === 'bookmarks') return { is: BookmarksView, props: {} }
  if (s.name === 'profile') return { is: ProfileView, props: { handle: s.handle } }
  if (s.name === 'post') return { is: PostView, props: { id: s.id } }
  return { is: HomeView, props: { wide: wide.value } }
})
const key = computed(() => JSON.stringify(screen.value))
</script>

<template>
  <MNavigationSuite v-model="current" :items="items" :layout="layout" class="h-dvh bg-surface text-on-surface">
    <template #fab>
      <MFab icon="edit" :label="large ? 'Post' : undefined" color="primary" @click="composer = { open: true }" />
    </template>
    <div class="flex h-full justify-center">
      <main class="h-full w-full max-w-[640px] min-w-0" :class="{ 'border-x border-outline-variant/60': wide }">
        <KeepAlive :max="3" include="HomeView">
          <component :is="view.is" :key="key" v-bind="view.props" />
        </KeepAlive>
      </main>
      <SidePanel v-if="large" class="hidden h-full w-80 shrink-0 overflow-y-auto px-6 xl:flex" />
    </div>
    <Composer :wide="wide" />
    <StoryViewer />
  </MNavigationSuite>
</template>
