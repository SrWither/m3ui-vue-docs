<script setup lang="ts">
/* Phones: the song that's playing above the navigation bar. Tap it for the full player. */
import { computed } from 'vue'
import { MIcon, MIconButton } from '@m3ui-vue/m3ui-vue'
import { albumById, artistById } from '../catalog'
import { useMusic } from '../useMusic'

const { track, playing, position, toggle, isLiked, toggleLike, nowPlayingOpen } = useMusic()
const album = computed(() => (track.value ? albumById.get(track.value.albumId)! : null))
const progress = computed(() => (track.value ? (position.value / track.value.duration) * 100 : 0))
</script>

<template>
  <div v-if="track && album" class="relative mx-2 mb-1 overflow-hidden rounded-xl bg-surface-container-highest shadow-elevation-2">
    <div class="flex items-center gap-1 p-1.5 pr-1">
      <button type="button" class="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left" aria-label="Open Now Playing" @click="nowPlayingOpen = true">
        <img :src="album.cover" alt="" class="h-11 w-11 shrink-0 rounded-md" />
        <span class="min-w-0">
          <span class="block truncate text-body-large text-on-surface">{{ track.title }}</span>
          <span class="block truncate text-body-small text-on-surface-variant">{{ artistById.get(track.artistId)!.name }}</span>
        </span>
      </button>
      <MIconButton icon="favorite" :label="isLiked(track.id) ? 'Remove from Liked Songs' : 'Save to Liked Songs'" :class="{ 'm3m-fill text-primary!': isLiked(track.id) }" @click="toggleLike(track.id)" />
      <button type="button" class="m3m-fill flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-on-surface" :aria-label="playing ? 'Pause' : 'Play'" @click="toggle">
        <MIcon :name="playing ? 'pause' : 'play_arrow'" :size="30" />
      </button>
    </div>
    <div class="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-on-surface/15">
      <div class="h-full rounded-full bg-on-surface transition-[width] duration-200 ease-linear" :style="{ width: `${progress}%` }" />
    </div>
  </div>
</template>
