<script setup lang="ts">
/* Explore: search posts and people, or browse trending tags and a photo wall (MMasonry) that keeps loading. */
import { computed, onMounted, ref, watch } from 'vue'
import { MAvatar, MChip, MEmptyState, MIcon, MInfiniteScroll, MMasonry, MSkeleton, MTabs } from '@m3ui-vue/m3ui-vue'
import { compact, people, trends } from '../data'
import { usePlaza } from '../usePlaza'
import AppHeader from '../components/AppHeader.vue'
import PostCard from '../components/PostCard.vue'

const props = defineProps<{ q?: string }>()
const { go, post, postAt, timeline, mine } = usePlaza()

const query = ref(props.q ?? '')
watch(() => props.q, (q) => (query.value = q ?? ''))
const submit = () => go({ name: 'explore', q: query.value.trim() || undefined })

// The photo wall: generated posts with photos, a page at a time.
const wall = ref<string[]>([])
const loading = ref(false)
let n = 1000
function more() {
  loading.value = true
  setTimeout(() => {
    const ids: string[] = []
    while (ids.length < 12) {
      const id = postAt(n++)
      if (post(id).photos.length) ids.push(id)
    }
    wall.value = [...wall.value, ...ids]
    loading.value = false
  }, 500)
}
onMounted(more)

// Search across everything loaded so far plus a pool of older posts.
const tab = ref<'top' | 'people' | 'media'>('top')
const pool = computed(() => {
  const ids = new Set([...mine.value, ...timeline.value, ...wall.value])
  for (let i = 0; i < 80; i++) ids.add(postAt(i))
  return [...ids]
})
const q = computed(() => (props.q ?? '').toLowerCase())
const results = computed(() => (q.value ? pool.value.filter((id) => `${post(id).text} @${post(id).author}`.toLowerCase().includes(q.value)) : []))
const matchingPeople = computed(() => (q.value ? people.filter((p) => `${p.name} @${p.handle} ${p.bio}`.toLowerCase().includes(q.value.replace(/^[@#]/, ''))) : []))
const media = computed(() => results.value.filter((id) => post(id).photos.length))
</script>

<template>
  <div class="h-full overflow-y-auto">
    <AppHeader :title="q ? props.q! : 'Explore'" :back="!!q">
      <form class="px-4 pb-3" @submit.prevent="submit">
        <label class="flex h-11 items-center gap-2 rounded-full bg-surface-container-high px-4 focus-within:ring-2 focus-within:ring-secondary">
          <MIcon name="search" :size="20" class="text-on-surface-variant" />
          <input v-model="query" type="search" placeholder="Search posts, #tags and people" aria-label="Search" class="min-w-0 flex-1 bg-transparent text-body-medium text-on-surface outline-none placeholder:text-on-surface-variant" />
          <button v-if="query" type="button" class="flex cursor-pointer text-on-surface-variant" aria-label="Clear" @click="query = ''; go({ name: 'explore' })"><MIcon name="close" :size="18" /></button>
        </label>
      </form>
      <MTabs v-if="q" v-model="tab" :tabs="[{ value: 'top', label: 'Top' }, { value: 'people', label: 'People' }, { value: 'media', label: 'Media' }]" />
    </AppHeader>

    <!-- Search results -->
    <template v-if="q">
      <template v-if="tab === 'top'">
        <PostCard v-for="id in results" :key="id" :id="id" />
        <MEmptyState v-if="!results.length" icon="search_off" :title="`No results for “${props.q}”`" description="Try a different word or a trending tag." />
      </template>
      <template v-else-if="tab === 'people'">
        <button v-for="p in matchingPeople" :key="p.handle" type="button" class="flex w-full cursor-pointer gap-3 border-b border-outline-variant/60 px-4 py-3 text-left hover:bg-on-surface/[0.03]" @click="go({ name: 'profile', handle: p.handle })">
          <MAvatar :name="p.name" :size="44" />
          <span class="min-w-0">
            <span class="flex items-center gap-1 text-title-small text-on-surface">{{ p.name }}<MIcon v-if="p.verified" name="verified" :size="16" filled class="text-primary" /></span>
            <span class="block text-body-small text-on-surface-variant">@{{ p.handle }}</span>
            <span class="mt-1 block text-body-medium text-on-surface">{{ p.bio }}</span>
          </span>
        </button>
        <MEmptyState v-if="!matchingPeople.length" icon="person_search" title="No people found" />
      </template>
      <MMasonry v-else :cols="2" :md-cols="3" gap="xs" class="p-1">
        <button v-for="id in media" :key="id" type="button" class="block w-full cursor-pointer overflow-hidden rounded-lg" @click="go({ name: 'post', id })">
          <img :src="post(id).photos[0]!.src" :alt="post(id).photos[0]!.alt" class="w-full" :style="{ aspectRatio: String(post(id).photos[0]!.ratio) }" />
        </button>
      </MMasonry>
    </template>

    <!-- Browse -->
    <template v-else>
      <section class="border-b border-outline-variant/60 px-4 py-3">
        <h2 class="mb-2 text-title-medium text-on-surface">Trending</h2>
        <div class="flex flex-wrap gap-2">
          <MChip v-for="t in trends" :key="t.tag" clickable icon="trending_up" @click="go({ name: 'explore', q: `#${t.tag}` })">#{{ t.tag }} · {{ compact(t.posts) }}</MChip>
        </div>
      </section>
      <MInfiniteScroll :loading="loading" :threshold="500" @load="more">
        <MMasonry :cols="2" :md-cols="3" gap="xs" class="p-1">
          <button v-for="id in wall" :key="id" type="button" class="group relative block w-full cursor-pointer overflow-hidden rounded-lg" :aria-label="post(id).photos[0]!.alt" @click="go({ name: 'post', id })">
            <img :src="post(id).photos[0]!.src" :alt="post(id).photos[0]!.alt" class="w-full transition-transform duration-300 group-hover:scale-105" :style="{ aspectRatio: String(post(id).photos[0]!.ratio) }" />
            <span v-if="post(id).photos.length > 1" class="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white"><MIcon name="collections" :size="16" /></span>
            <span class="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-linear-to-t from-black/60 to-transparent px-2 pt-6 pb-1.5 text-label-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              <MIcon name="favorite" :size="14" filled />{{ compact(post(id).likes) }} · @{{ post(id).author }}
            </span>
          </button>
        </MMasonry>
        <template #loading>
          <div class="grid grid-cols-2 gap-1 p-1 md:grid-cols-3">
            <MSkeleton v-for="i in 6" :key="i" variant="rounded" :height="`${8 + (i % 3) * 3}rem`" />
          </div>
        </template>
      </MInfiniteScroll>
    </template>
  </div>
</template>
