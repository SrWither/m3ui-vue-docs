<script setup lang="ts">
/*
 * The full player: big cover over its own blurred colors, the visualizer, seek bar and controls.
 * Covers the whole app on phones (opened from the mini player) and on wide screens alike.
 */
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { MIconButton, MMenu, MTooltip, useToast, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import { albumById, artistById } from '../catalog'
import { useMusic } from '../useMusic'
import PlayerControls from './PlayerControls.vue'
import SeekBar from './SeekBar.vue'
import TrackMenuItems from './TrackMenuItems.vue'
import Visualizer from './Visualizer.vue'
import VolumeControl from './VolumeControl.vue'

const { track, source, nowPlayingOpen, queueOpen, isLiked, toggleLike, go } = useMusic()
const toast = useToast()
const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')

const album = computed(() => (track.value ? albumById.get(track.value.albumId)! : null))
const artist = computed(() => (track.value ? artistById.get(track.value.artistId)! : null))
const from = computed(() => (source.value ? { album: 'album', playlist: 'playlist', artist: 'artist', liked: 'your library', search: 'search' }[source.value.type] : ''))

const close = () => (nowPlayingOpen.value = false)
function openQueue() {
  // Wide screens show the queue beside the page, so go back to it; phones get a sheet on top.
  if (wide.value) close()
  queueOpen.value = true
}
function openArtist() {
  close()
  go({ name: 'artist', id: artist.value!.id })
}
function share() {
  void navigator.clipboard?.writeText(`${location.origin}/examples/music`)
  toast.success('Link copied to clipboard', { icon: 'link' })
}

const onKey = (e: KeyboardEvent) => e.key === 'Escape' && nowPlayingOpen.value && !queueOpen.value && close()
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <Transition name="m3m-sheet">
    <div v-if="nowPlayingOpen && track && album && artist" class="fixed inset-0 z-100 flex flex-col overflow-hidden bg-surface-container text-on-surface" role="dialog" aria-label="Now playing">
      <img :src="album.cover" alt="" aria-hidden="true" class="absolute inset-0 h-full w-full scale-125 object-cover opacity-50 blur-3xl" />
      <div class="absolute inset-0 bg-linear-to-b from-surface-container/30 via-surface-container/70 to-surface-container" />

      <header class="relative flex shrink-0 items-center gap-2 px-2 pt-2 sm:px-4">
        <MIconButton icon="keyboard_arrow_down" label="Close" size="md" @click="close" />
        <div class="min-w-0 flex-1 text-center">
          <p class="text-label-small tracking-wider text-on-surface-variant uppercase">Playing from {{ from }}</p>
          <p class="truncate text-title-small text-on-surface">{{ source?.name }}</p>
        </div>
        <MMenu align="right">
          <template #trigger>
            <MIconButton icon="more_vert" label="More" size="md" />
          </template>
          <TrackMenuItems :track-id="track.id" />
        </MMenu>
      </header>

      <main class="relative mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col justify-center gap-6 px-6 pb-6 lg:flex-row lg:items-center lg:gap-16">
        <!-- The cover takes what the info and controls leave (a size container), so a short phone shrinks it
             instead of pushing it over the header -->
        <div class="m3m-cover flex min-h-0 flex-1 items-center justify-center lg:size-[min(60vh,28rem)] lg:flex-none">
          <img :src="album.cover" alt="" class="aspect-square w-[min(100cqw,100cqh,24rem)] rounded-2xl object-cover shadow-elevation-4 lg:w-full" />
        </div>

        <div class="mx-auto w-full max-w-sm shrink-0 lg:mx-0 lg:max-w-md lg:flex-1">
          <div class="mb-3 flex items-center gap-2">
            <div class="min-w-0 flex-1">
              <h2 class="truncate text-headline-small font-bold text-on-surface">{{ track.title }}</h2>
              <button type="button" class="max-w-full cursor-pointer truncate text-body-large text-on-surface-variant hover:underline" @click="openArtist">{{ artist.name }}</button>
            </div>
            <MIconButton icon="favorite" :label="isLiked(track.id) ? 'Remove from Liked Songs' : 'Save to Liked Songs'" size="md" :class="{ 'm3m-fill text-primary!': isLiked(track.id) }" @click="toggleLike(track.id)" />
          </div>
          <Visualizer class="mb-2" />
          <SeekBar />
          <PlayerControls large class="mt-3" />
          <div class="mt-6 flex items-center justify-between">
            <MTooltip text="Copy link">
              <MIconButton icon="share" label="Copy link" @click="share" />
            </MTooltip>
            <VolumeControl v-if="wide" />
            <MTooltip text="Queue">
              <MIconButton icon="queue_music" label="Queue" @click="openQueue" />
            </MTooltip>
          </div>
        </div>
      </main>
    </div>
  </Transition>
</template>

<style scoped>
.m3m-cover {
  container-type: size;
}
.m3m-sheet-enter-active {
  transition: transform 400ms cubic-bezier(0.05, 0.7, 0.1, 1), opacity 200ms;
}
.m3m-sheet-leave-active {
  transition: transform 200ms cubic-bezier(0.3, 0, 0.8, 0.15), opacity 200ms 50ms;
}
.m3m-sheet-enter-from,
.m3m-sheet-leave-to {
  transform: translateY(100%);
  opacity: 0.6;
}
@media (prefers-reduced-motion: reduce) {
  .m3m-sheet-enter-active,
  .m3m-sheet-leave-active {
    transition: opacity 150ms;
  }
  .m3m-sheet-enter-from,
  .m3m-sheet-leave-to {
    transform: none;
  }
}
</style>
