<script setup lang="ts">
/*
 * The queue: what's playing, the songs you added ("Next in queue") and the rest of the album or
 * playlist ("Next from …"). Both lists reorder by dragging the grip (MDragDropList), with the
 * keyboard too. Click a song to jump to it.
 */
import { computed } from 'vue'
import { MDragDropList, MEmptyState, MIconButton } from '@m3ui-vue/m3ui-vue'
import { albumById, artistById, trackById } from '../catalog'
import { useMusic } from '../useMusic'
import Equalizer from './Equalizer.vue'

const { track, playing, source, manual, upNext, setUpNext, removeUpNext, skipTo, playQueued, removeQueued } = useMusic()

const queued = computed({ get: () => manual.value, set: (v) => (manual.value = v as typeof manual.value) })
const next = computed({ get: () => upNext.value, set: (v) => setUpNext(v as Array<{ trackId: string }>) })

const info = (id: string) => {
  const t = trackById.get(id)!
  return { title: t.title, artist: artistById.get(t.artistId)!.name, cover: albumById.get(t.albumId)!.cover }
}
</script>

<template>
  <div>
    <MEmptyState v-if="!track" icon="queue_music" title="Nothing playing" description="Play something and it shows up here, with what comes next." compact />

    <template v-else>
      <h3 class="mb-2 text-title-small text-on-surface">Now playing</h3>
      <div class="mb-5 flex items-center gap-3 rounded-lg p-2">
        <img :src="info(track.id).cover" alt="" class="h-12 w-12 shrink-0 rounded-md" />
        <div class="min-w-0 flex-1">
          <p class="truncate text-body-large text-primary">{{ track.title }}</p>
          <p class="truncate text-body-small text-on-surface-variant">{{ info(track.id).artist }}</p>
        </div>
        <Equalizer :paused="!playing" class="mr-2" />
      </div>

      <template v-if="queued.length">
        <div class="mb-1 flex items-center">
          <h3 class="flex-1 text-title-small text-on-surface">Next in queue</h3>
          <button type="button" class="cursor-pointer text-label-large text-primary hover:underline" @click="manual = []">Clear</button>
        </div>
        <MDragDropList v-model="queued" handle class="mb-5">
          <template #default="{ item }">
            <div class="flex items-center gap-3">
              <button type="button" class="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left" @click="playQueued(item.id as string)">
                <img :src="info(item.trackId).cover" alt="" class="h-10 w-10 shrink-0 rounded-sm" />
                <span class="min-w-0">
                  <span class="block truncate text-body-large text-on-surface">{{ info(item.trackId).title }}</span>
                  <span class="block truncate text-body-small text-on-surface-variant">{{ info(item.trackId).artist }}</span>
                </span>
              </button>
              <MIconButton icon="close" label="Remove from queue" size="xs" @click="removeQueued(item.id as string)" />
            </div>
          </template>
        </MDragDropList>
      </template>

      <template v-if="next.length">
        <h3 class="mb-1 text-title-small text-on-surface">Next from: {{ source?.name }}</h3>
        <MDragDropList v-model="next" handle>
          <template #default="{ item }">
            <div class="flex items-center gap-3">
              <button type="button" class="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left" @click="skipTo(item.trackId)">
                <img :src="info(item.trackId).cover" alt="" class="h-10 w-10 shrink-0 rounded-sm" />
                <span class="min-w-0">
                  <span class="block truncate text-body-large text-on-surface">{{ info(item.trackId).title }}</span>
                  <span class="block truncate text-body-small text-on-surface-variant">{{ info(item.trackId).artist }}</span>
                </span>
              </button>
              <MIconButton icon="close" label="Remove from queue" size="xs" @click="removeUpNext(item.trackId)" />
            </div>
          </template>
        </MDragDropList>
      </template>
      <p v-else-if="!queued.length" class="text-body-medium text-on-surface-variant">That's the last song. Turn on repeat to start over.</p>
    </template>
  </div>
</template>
