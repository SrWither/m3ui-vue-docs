<script setup lang="ts">
/*
 * Home: For you / Following, stories, and the timeline. Pull down (MPullToRefresh) for new
 * posts, scroll down (MInfiniteScroll) for older ones; posts that arrive while you read wait
 * behind the "new posts" pill.
 */
import { computed, onMounted, ref } from 'vue'
import { MAvatar, MIcon, MInfiniteScroll, MPullToRefresh, MSkeleton, MTabs } from '@m3ui-vue/m3ui-vue'
import { me, person } from '../data'
import { usePlaza } from '../usePlaza'
import AppHeader from '../components/AppHeader.vue'
import PostCard from '../components/PostCard.vue'
import StoriesRow from '../components/StoriesRow.vue'

defineProps<{ wide: boolean }>()
const { feed, feedTab, loading, loadMore, incoming, showIncoming, refreshing, refresh, composer, post, timeline } = usePlaza()

onMounted(() => !timeline.value.length && loadMore())

// "Not interested" hides a post for this visit.
const hidden = ref(new Set<string>())
const shown = computed(() => feed.value.filter((id) => !hidden.value.has(id)))
const hide = (id: string) => (hidden.value = new Set([...hidden.value, id]))

const pull = ref<InstanceType<typeof MPullToRefresh>>()
function showNew() {
  showIncoming()
  pull.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

const newAuthors = computed(() => [...new Set(incoming.value.map((id) => post(id).author))].slice(0, 3))
</script>

<template>
  <MPullToRefresh ref="pull" :refreshing="refreshing" class="h-full" @refresh="refresh">
    <AppHeader title="Plaza" logo>
      <MTabs v-model="feedTab" :tabs="[{ value: 'for-you', label: 'For you' }, { value: 'following', label: 'Following' }]" />
    </AppHeader>

    <!-- New posts waiting -->
    <div class="pointer-events-none sticky top-30 z-10 flex h-0 justify-center">
      <Transition name="m3p-pill">
        <button
          v-if="incoming.length"
          type="button"
          class="pointer-events-auto mt-2 flex h-10 cursor-pointer items-center gap-2 rounded-full bg-primary pr-4 pl-1.5 text-label-large text-on-primary shadow-elevation-3"
          @click="showNew"
        >
          <span class="flex -space-x-2">
            <MAvatar v-for="a in newAuthors" :key="a" :name="person(a).name" :size="28" class="ring-2 ring-primary" />
          </span>
          <MIcon name="arrow_upward" :size="18" />{{ incoming.length }} new post{{ incoming.length > 1 ? 's' : '' }}
        </button>
      </Transition>
    </div>

    <StoriesRow class="border-b border-outline-variant/60" />

    <button v-if="wide" type="button" class="flex w-full cursor-text items-center gap-3 border-b border-outline-variant/60 px-4 py-3 text-left" @click="composer = { open: true }">
      <MAvatar :name="me.name" :size="44" />
      <span class="flex-1 text-title-medium text-on-surface-variant">What’s happening?</span>
      <span class="rounded-full bg-primary px-4 py-2 text-label-large text-on-primary">Post</span>
    </button>

    <MInfiniteScroll :loading="loading" :threshold="600" @load="loadMore">
      <TransitionGroup name="m3p-post">
        <PostCard v-for="id in shown" :key="id" :id="id" @hide="hide(id)" />
      </TransitionGroup>
      <template #loading>
        <div v-for="n in timeline.length ? 2 : 4" :key="n" class="flex gap-3 border-b border-outline-variant/60 px-4 py-4">
          <MSkeleton variant="circular" width="44px" height="44px" />
          <div class="flex-1">
            <MSkeleton variant="text" width="40%" />
            <MSkeleton variant="text" :lines="2" class="mt-2" />
            <MSkeleton v-if="n % 2" variant="rounded" height="12rem" class="mt-3" />
          </div>
        </div>
      </template>
    </MInfiniteScroll>
    <p v-if="feedTab === 'following' && !loading && shown.length < 3" class="px-4 py-6 text-center text-body-medium text-on-surface-variant">
      That’s everyone you follow for now. Keep scrolling, or follow more people from For you.
    </p>
  </MPullToRefresh>
</template>

<style scoped>
.m3p-pill-enter-active,
.m3p-pill-leave-active {
  transition: opacity 200ms ease, transform 300ms cubic-bezier(0.2, 0, 0, 1);
}
.m3p-pill-enter-from,
.m3p-pill-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
.m3p-post-enter-active {
  transition: opacity 300ms ease, transform 300ms cubic-bezier(0.2, 0, 0, 1);
}
.m3p-post-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
