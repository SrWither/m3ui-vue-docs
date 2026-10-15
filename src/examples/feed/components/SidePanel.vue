<script setup lang="ts">
/* Wide screens, beside the feed: search, what's trending, and who to follow. */
import { computed, ref } from 'vue'
import { MAvatar, MIcon, MToggleButton } from '@m3ui-vue/m3ui-vue'
import { compact, me, people, trends } from '../data'
import { usePlaza } from '../usePlaza'

const { go, following, toggleFollow } = usePlaza()
const q = ref('')
const suggestions = computed(() => people.filter((p) => p.handle !== me.handle && !['luciafdz', 'mayachen'].includes(p.handle)).slice(0, 4))
function search() {
  if (q.value.trim()) go({ name: 'explore', q: q.value.trim() })
}
</script>

<template>
  <aside class="flex flex-col gap-4">
    <form class="sticky top-0 z-10 bg-surface pt-3 pb-1" @submit.prevent="search">
      <label class="flex h-11 items-center gap-2 rounded-full bg-surface-container-high px-4 focus-within:ring-2 focus-within:ring-secondary">
        <MIcon name="search" :size="20" class="text-on-surface-variant" />
        <input v-model="q" type="search" placeholder="Search Plaza" class="min-w-0 flex-1 bg-transparent text-body-medium text-on-surface outline-none placeholder:text-on-surface-variant" />
      </label>
    </form>

    <section class="overflow-hidden rounded-2xl bg-surface-container-low">
      <h2 class="px-4 pt-3 pb-1 text-title-medium text-on-surface">Trending</h2>
      <button v-for="(t, i) in trends.slice(0, 5)" :key="t.tag" type="button" class="block w-full cursor-pointer px-4 py-2.5 text-left hover:bg-on-surface/5" @click="go({ name: 'explore', q: `#${t.tag}` })">
        <p class="text-label-small text-on-surface-variant">{{ i + 1 }} · Trending</p>
        <p class="text-title-small text-on-surface">#{{ t.tag }}</p>
        <p class="text-label-small text-on-surface-variant">{{ compact(t.posts) }} posts</p>
      </button>
      <button type="button" class="w-full cursor-pointer px-4 py-3 text-left text-label-large text-primary hover:bg-on-surface/5" @click="go({ name: 'explore' })">Show more</button>
    </section>

    <section class="overflow-hidden rounded-2xl bg-surface-container-low">
      <h2 class="px-4 pt-3 pb-1 text-title-medium text-on-surface">Who to follow</h2>
      <div v-for="p in suggestions" :key="p.handle" class="flex items-center gap-3 px-4 py-2.5">
        <button type="button" class="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left" @click="go({ name: 'profile', handle: p.handle })">
          <MAvatar :name="p.name" :size="40" />
          <span class="min-w-0">
            <span class="flex items-center gap-1 text-title-small text-on-surface"><span class="truncate">{{ p.name }}</span><MIcon v-if="p.verified" name="verified" :size="16" class="m3p-fill shrink-0 text-primary" /></span>
            <span class="block truncate text-body-small text-on-surface-variant">@{{ p.handle }}</span>
          </span>
        </button>
        <MToggleButton :checked="following.has(p.handle)" size="xs" variant="tonal" @update:checked="toggleFollow(p.handle)">
          {{ following.has(p.handle) ? 'Following' : 'Follow' }}
        </MToggleButton>
      </div>
    </section>

    <p class="px-2 pb-6 text-label-small text-on-surface-variant">An m3ui-vue example. Everything here is made up, nothing leaves your browser.</p>
  </aside>
</template>
