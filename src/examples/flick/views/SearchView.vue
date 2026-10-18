<script setup lang="ts">
/* Search results: a channel whose name matches comes first, then the videos, sortable by relevance, date or views. */
import { computed, ref } from 'vue'
import { MAvatar, MButton, MChip, MEmptyState, MSkeleton } from '@m3ui-vue/m3ui-vue'
import { channels, compact } from '../data'
import { useFlick } from '../useFlick'
import VideoCard from '../components/VideoCard.vue'

const props = defineProps<{ q: string }>()
const f = useFlick()
const sort = ref<'relevance' | 'date' | 'views'>('relevance')
const sorts = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'date', label: 'Upload date' },
  { value: 'views', label: 'View count' },
] as const
const channel = computed(() => channels.find((c) => props.q.toLowerCase().split(/\s+/).some((w) => w.length > 2 && c.name.toLowerCase().includes(w))))
const list = computed(() => {
  const found = f.results(props.q)
  if (sort.value === 'date') return [...found].sort((a, b) => b.date - a.date)
  if (sort.value === 'views') return [...found].sort((a, b) => b.views - a.views)
  return found
})
</script>

<template>
  <div class="mx-auto flex max-w-[1100px] flex-col gap-4 px-3 py-4 sm:px-6">
    <div class="flk-noscroll flex gap-2 overflow-x-auto">
      <MChip v-for="s in sorts" :key="s.value" type="filter" :selected="sort === s.value" class="shrink-0" @click="sort = s.value">{{ s.label }}</MChip>
    </div>

    <template v-if="f.loading.value">
      <div v-for="n in 4" :key="n" class="flex gap-4">
        <MSkeleton variant="rounded" height="auto" class="aspect-video w-40 shrink-0 rounded-xl! sm:w-60 lg:w-[360px]" />
        <div class="flex-1"><MSkeleton :lines="3" /></div>
      </div>
    </template>

    <template v-else>
      <div v-if="channel" class="flex items-center gap-4 border-b border-outline-variant pb-4 sm:gap-8 sm:px-10">
        <button type="button" class="cursor-pointer rounded-full" :aria-label="channel.name" @click="f.go({ name: 'channel', id: channel.id })">
          <MAvatar :name="channel.name" :size="96" class="hidden sm:flex" />
          <MAvatar :name="channel.name" :size="56" class="sm:hidden" />
        </button>
        <div class="min-w-0 flex-1">
          <button type="button" class="cursor-pointer text-left text-title-large text-on-surface" @click="f.go({ name: 'channel', id: channel.id })">{{ channel.name }}</button>
          <p class="text-body-small text-on-surface-variant">{{ channel.handle }} · {{ compact(f.subscriberCount(channel.id)) }} subscribers</p>
          <p class="mt-1 hidden line-clamp-2 text-body-small text-on-surface-variant sm:block">{{ channel.description }}</p>
        </div>
        <MButton :variant="f.subscriptions.has(channel.id) ? 'tonal' : 'filled'" @click="f.toggleSubscribe(channel.id)">
          {{ f.subscriptions.has(channel.id) ? 'Subscribed' : 'Subscribe' }}
        </MButton>
      </div>

      <MEmptyState v-if="!list.length && !channel" icon="search_off" title="No results" :description="`Nothing matches “${q}”. Try other words, like “synthwave” or “aurora”.`" class="py-16" />
      <VideoCard v-for="v in list" :key="v.id" :video="v" layout="row" />
    </template>
  </div>
</template>
