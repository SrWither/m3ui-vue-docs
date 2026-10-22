<script setup lang="ts">
/* Subscriptions: a row of your channels (tap one to filter), then their latest videos, newest first. */
import { computed, ref } from 'vue'
import { MAvatar, MButton, MEmptyState, MSkeleton } from '@m3ui-vue/m3ui-vue'
import { channelById, videos } from '../data'
import { useFlick } from '../useFlick'
import VideoCard from '../components/VideoCard.vue'

const { subscriptions, go, loading } = useFlick()
const mine = computed(() => [...subscriptions].map((id) => channelById.get(id)!))
const only = ref<string | null>(null)
const list = computed(() => videos.filter((v) => (only.value ? v.channelId === only.value : subscriptions.has(v.channelId))))
</script>

<template>
  <div class="pb-8">
    <MEmptyState
      v-if="!mine.length"
      icon="subscriptions"
      title="Don't miss new videos"
      description="Subscribe to channels you like and their latest videos show up here."
      class="py-20"
    >
      <template #actions><MButton @click="go({ name: 'home' })">Find channels</MButton></template>
    </MEmptyState>

    <template v-else>
      <div class="flk-noscroll flex items-start gap-4 overflow-x-auto px-3 py-4 sm:px-6">
        <button
          v-for="c in mine"
          :key="c.id"
          type="button"
          class="flex w-18 shrink-0 cursor-pointer flex-col items-center gap-1.5 transition-opacity"
          :class="{ 'opacity-40': only && only !== c.id }"
          :aria-pressed="only === c.id"
          @click="only = only === c.id ? null : c.id"
        >
          <MAvatar :name="c.name" :size="56" />
          <span class="w-full truncate text-center text-label-medium text-on-surface">{{ c.name }}</span>
        </button>
        <MButton v-if="only" variant="text" class="ml-auto shrink-0 self-center" @click="go({ name: 'channel', id: only })">View channel</MButton>
      </div>

      <div v-if="loading" class="flk-grid px-3 sm:px-6">
        <MSkeleton v-for="n in 8" :key="n" variant="rounded" radius="xl" height="auto" class="aspect-video" />
      </div>
      <div v-else class="flk-grid px-3 sm:px-6">
        <VideoCard v-for="v in list" :key="v.id" :video="v" />
      </div>
    </template>
  </div>
</template>
