<script setup lang="ts">
/* A channel: its banner (a frame of its own scene), name, Subscribe, and tabs for Home, Videos, Shorts and About. */
import { computed, ref, watch } from 'vue'
import { MAvatar, MButton, MIcon, MTabs } from '@m3ui-vue/m3ui-vue'
import { ago, bannerOf, channelById, compact, shorts, videos } from '../data'
import { useFlick } from '../useFlick'
import VideoCard from '../components/VideoCard.vue'
import Thumb from '../components/Thumb.vue'

const props = defineProps<{ id: string }>()
const f = useFlick()
const channel = computed(() => channelById.get(props.id)!)
const own = computed(() => videos.filter((v) => v.channelId === props.id))
const ownShorts = computed(() => shorts.filter((v) => v.channelId === props.id))
const views = computed(() => own.value.reduce((n, v) => n + v.views, 0))

const tab = ref<'home' | 'videos' | 'shorts' | 'about'>('home')
watch(() => props.id, () => (tab.value = 'home'))
const tabs = [
  { value: 'home', label: 'Home' },
  { value: 'videos', label: 'Videos' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'about', label: 'About' },
]
const sort = ref<'new' | 'popular'>('new')
const sorted = computed(() => [...own.value].sort((a, b) => (sort.value === 'new' ? b.date - a.date : b.views - a.views)))
</script>

<template>
  <div class="mx-auto max-w-[1280px] pb-8">
    <div class="px-3 pt-3 sm:px-6">
      <img :src="bannerOf(channel)" alt="" class="aspect-[6/1] w-full rounded-2xl object-cover" />
    </div>

    <div class="flex flex-col gap-4 px-3 py-4 sm:flex-row sm:items-center sm:px-6">
      <MAvatar :name="channel.name" :size="96" class="hidden sm:flex" />
      <div class="flex min-w-0 flex-1 items-center gap-3 sm:block">
        <MAvatar :name="channel.name" :size="64" class="sm:hidden" />
        <div class="min-w-0">
          <h1 class="flex items-center gap-2 text-headline-small text-on-surface sm:text-headline-medium">
            <span class="truncate">{{ channel.name }}</span>
            <MIcon v-if="channel.verified" name="check_circle" :size="20" class="flk-fill text-on-surface-variant" />
          </h1>
          <p class="text-body-medium text-on-surface-variant">
            {{ channel.handle }} · {{ compact(f.subscriberCount(channel.id)) }} subscribers · {{ own.length }} videos
          </p>
          <p class="mt-1 hidden line-clamp-1 text-body-medium text-on-surface-variant sm:block">{{ channel.description }}</p>
        </div>
      </div>
      <MButton :variant="f.subscriptions.has(channel.id) ? 'tonal' : 'filled'" class="sm:self-center" @click="f.toggleSubscribe(channel.id)">
        {{ f.subscriptions.has(channel.id) ? 'Subscribed' : 'Subscribe' }}
      </MButton>
    </div>

    <div class="border-b border-outline-variant px-3 sm:px-6">
      <MTabs v-model="tab" :tabs="tabs" variant="secondary" scrollable class="-mb-px" />
    </div>

    <div class="px-3 pt-5 sm:px-6">
      <template v-if="tab === 'home'">
        <VideoCard v-if="own[0]" :video="own[0]" layout="row" class="mb-8" />
        <h2 class="mb-3 text-title-large text-on-surface">Popular</h2>
        <div class="flk-grid">
          <VideoCard v-for="v in [...own].sort((a, b) => b.views - a.views).slice(0, 4)" :key="v.id" :video="v" />
        </div>
      </template>

      <template v-else-if="tab === 'videos'">
        <div class="mb-4 flex gap-2">
          <MButton :variant="sort === 'new' ? 'filled' : 'tonal'" size="xs" @click="sort = 'new'">Latest</MButton>
          <MButton :variant="sort === 'popular' ? 'filled' : 'tonal'" size="xs" @click="sort = 'popular'">Popular</MButton>
        </div>
        <div class="flk-grid">
          <VideoCard v-for="v in sorted" :key="v.id" :video="v" />
        </div>
      </template>

      <div v-else-if="tab === 'shorts'" class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <button v-for="s in ownShorts" :key="s.id" type="button" class="cursor-pointer text-left" @click="f.go({ name: 'shorts', id: s.id })">
          <Thumb :video="s" />
          <p class="mt-2 line-clamp-2 text-title-small text-on-surface">{{ s.title }}</p>
          <p class="text-body-small text-on-surface-variant">{{ compact(s.views) }} views</p>
        </button>
      </div>

      <div v-else class="max-w-2xl">
        <h2 class="mb-2 text-title-large text-on-surface">Description</h2>
        <p class="mb-6 text-body-large text-on-surface">{{ channel.description }}</p>
        <h2 class="mb-2 text-title-large text-on-surface">Stats</h2>
        <ul class="flex flex-col gap-3 text-body-large text-on-surface">
          <li class="flex items-center gap-3"><MIcon name="calendar_month" class="text-on-surface-variant" /> Joined {{ ago(channel.joined) }}</li>
          <li class="flex items-center gap-3"><MIcon name="group" class="text-on-surface-variant" /> {{ compact(f.subscriberCount(channel.id)) }} subscribers</li>
          <li class="flex items-center gap-3"><MIcon name="trending_up" class="text-on-surface-variant" /> {{ views.toLocaleString('en') }} views</li>
          <li class="flex items-center gap-3"><MIcon name="category" class="text-on-surface-variant" /> {{ channel.category }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
