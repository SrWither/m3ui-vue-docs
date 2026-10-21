<script setup lang="ts">
/* The player along the bottom on wide screens: song, controls with the seek bar, queue and volume. */
import { computed } from 'vue'
import { MIcon, MIconButton, MTooltip } from '@m3ui-vue/m3ui-vue'
import { albumById, artistById } from '../catalog'
import { useMusic } from '../useMusic'
import PlayerControls from './PlayerControls.vue'
import SeekBar from './SeekBar.vue'
import VolumeControl from './VolumeControl.vue'

const { track, go, isLiked, toggleLike, queueOpen, nowPlayingOpen } = useMusic()
const album = computed(() => (track.value ? albumById.get(track.value.albumId)! : null))
const artist = computed(() => (track.value ? artistById.get(track.value.artistId)! : null))
</script>

<template>
  <footer class="grid shrink-0 grid-cols-[1fr_minmax(0,40rem)_1fr] items-center gap-4 px-4 py-3">
    <div class="flex min-w-0 items-center gap-3">
      <template v-if="track && album && artist">
        <button type="button" class="group relative shrink-0 cursor-pointer" aria-label="Open Now Playing" @click="nowPlayingOpen = true">
          <img :src="album.cover" alt="" class="h-14 w-14 rounded-md shadow-elevation-1" />
          <span class="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"><MIcon name="expand_less" :size="18" /></span>
        </button>
        <div class="min-w-0">
          <button type="button" class="block max-w-full cursor-pointer truncate text-left text-body-large text-on-surface hover:underline" @click="go({ name: 'album', id: album.id })">{{ track.title }}</button>
          <button type="button" class="block max-w-full cursor-pointer truncate text-left text-body-small text-on-surface-variant hover:text-on-surface hover:underline" @click="go({ name: 'artist', id: artist.id })">{{ artist.name }}</button>
        </div>
        <MTooltip :text="isLiked(track.id) ? 'Remove from Liked Songs' : 'Save to Liked Songs'">
          <MIconButton icon="favorite" :label="isLiked(track.id) ? 'Remove from Liked Songs' : 'Save to Liked Songs'" :checked="isLiked(track.id)" @click="toggleLike(track.id)" />
        </MTooltip>
      </template>
    </div>

    <div class="flex flex-col gap-1.5">
      <PlayerControls />
      <SeekBar />
    </div>

    <div class="flex items-center justify-end gap-1">
      <MTooltip text="Now playing view">
        <MIconButton icon="fullscreen" label="Now playing view" :disabled="!track" @click="nowPlayingOpen = true" />
      </MTooltip>
      <MTooltip text="Queue">
        <MIconButton icon="queue_music" label="Queue" :class="{ 'text-primary!': queueOpen }" :aria-pressed="queueOpen" @click="queueOpen = !queueOpen" />
      </MTooltip>
      <VolumeControl />
    </div>
  </footer>
</template>
