<script setup lang="ts">
/* Home: topic chips, the video grid (skeletons while it "loads") and a row of Shorts after the first videos. */
import { computed, ref } from 'vue'
import { MChip, MIcon, MSkeleton } from '@m3ui-vue/m3ui-vue'
import { categories, compact, shorts, videos, type Category } from '../data'
import { useFlick } from '../useFlick'
import VideoCard from '../components/VideoCard.vue'
import Thumb from '../components/Thumb.vue'

const { go, loading, resume } = useFlick()
type Filter = 'All' | Category | 'New to you' | 'Watched'
const filters: Filter[] = ['All', ...categories, 'New to you', 'Watched']
const filter = ref<Filter>('All')

const list = computed(() => {
  const f = filter.value
  if (f === 'All') return videos
  if (f === 'New to you') return videos.filter((v) => !resume.has(v.id))
  if (f === 'Watched') return videos.filter((v) => resume.has(v.id))
  return videos.filter((v) => v.category === f)
})
// "All" breaks the grid after two rows for the Shorts shelf.
const firstRows = computed(() => (filter.value === 'All' ? list.value.slice(0, 8) : list.value))
const rest = computed(() => (filter.value === 'All' ? list.value.slice(8) : []))

function pickFilter(f: Filter) {
  filter.value = f
  loading.value = true
  setTimeout(() => (loading.value = false), 300)
}
</script>

<template>
  <div class="pb-8">
    <div class="sticky top-0 z-10 bg-surface">
      <div class="flk-noscroll flex gap-2 overflow-x-auto px-3 py-3 sm:px-6" role="toolbar" aria-label="Topics">
        <MChip v-for="f in filters" :key="f" clickable :selected="filter === f" class="shrink-0" @click="pickFilter(f)">{{ f }}</MChip>
      </div>
    </div>

    <div v-if="loading" class="flk-grid px-3 sm:px-6">
      <div v-for="n in 8" :key="n" class="flex flex-col gap-3">
        <MSkeleton variant="rounded" height="auto" class="aspect-video rounded-xl!" />
        <div class="flex gap-3">
          <MSkeleton variant="circular" width="36px" height="36px" />
          <div class="flex-1"><MSkeleton :lines="2" /></div>
        </div>
      </div>
    </div>

    <template v-else>
      <div v-if="!list.length" class="flex flex-col items-center gap-2 py-20 text-on-surface-variant">
        <MIcon name="video_library" :size="48" />
        <p class="text-body-large">Nothing here yet</p>
      </div>
      <div class="flk-grid px-3 sm:px-6">
        <VideoCard v-for="v in firstRows" :key="v.id" :video="v" />
      </div>

      <section v-if="filter === 'All'" class="my-8 px-3 sm:px-6" aria-label="Shorts">
        <h2 class="mb-3 flex items-center gap-2 text-title-large text-on-surface">
          <MIcon name="smart_display" class="flk-fill text-primary" /> Shorts
        </h2>
        <div class="flk-noscroll -mx-3 flex gap-3 overflow-x-auto px-3 sm:-mx-6 sm:px-6">
          <button
            v-for="s in shorts.slice(0, 10)"
            :key="s.id"
            type="button"
            class="w-40 shrink-0 cursor-pointer text-left sm:w-48"
            @click="go({ name: 'shorts', id: s.id })"
          >
            <Thumb :video="s" />
            <p class="mt-2 line-clamp-2 text-title-small text-on-surface">{{ s.title }}</p>
            <p class="text-body-small text-on-surface-variant">{{ compact(s.views) }} views</p>
          </button>
        </div>
      </section>

      <div class="flk-grid px-3 sm:px-6">
        <VideoCard v-for="v in rest" :key="v.id" :video="v" />
      </div>
    </template>
  </div>
</template>
