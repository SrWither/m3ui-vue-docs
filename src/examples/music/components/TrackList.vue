<script setup lang="ts">
/*
 * A list of songs: number (or the playing bars), cover, title and artist, album on wide screens,
 * like, length and a menu. Clicking a row plays the collection from that song; right-click opens
 * the same menu as the "more" button.
 */
import { MContextMenu, MIcon, MIconButton, MMenu } from '@m3ui-vue/m3ui-vue'
import { albumById, artistById, formatTime, trackById } from '../catalog'
import { useMusic, type Source } from '../useMusic'
import Equalizer from './Equalizer.vue'
import TrackMenuItems from './TrackMenuItems.vue'

const props = defineProps<{
  trackIds: string[]
  /** What clicking a row plays. */
  source: { type: Source['type']; id: string }
  /** Show each song's cover instead of relying on the page's (playlists, artists, search). */
  covers?: boolean
  album?: boolean
  /** Lets "Remove from this playlist" show up in the menu. */
  playlistId?: string
}>()

const { current, playing, isSource, playFrom, toggle, isLiked, toggleLike } = useMusic()

// Search results play just the song you picked, so each row is its own source there.
const sourceOf = (id: string) => (props.source.type === 'search' ? { type: 'search' as const, id } : props.source)
const isCurrent = (id: string) => current.value === id && isSource(sourceOf(id).type, sourceOf(id).id)

function play(id: string) {
  const src = sourceOf(id)
  if (isCurrent(id)) toggle()
  else playFrom(src.type, src.id, id)
}
</script>

<template>
  <ol class="flex flex-col">
    <li v-for="(id, i) in trackIds" :key="id">
      <MContextMenu>
        <template #trigger>
          <div
            role="button"
            tabindex="0"
            class="group grid cursor-pointer items-center gap-3 rounded-lg py-1.5 pr-1 pl-2 outline-none transition-colors hover:bg-on-surface/8 focus-visible:ring-2 focus-visible:ring-secondary"
            :class="album ? 'grid-cols-[2rem_1fr_auto] md:grid-cols-[2rem_1fr_minmax(0,14rem)_auto]' : 'grid-cols-[2rem_1fr_auto]'"
            @click="play(id)"
            @keydown.enter.self="play(id)"
          >
            <span class="flex h-8 w-8 items-center justify-center text-body-medium text-on-surface-variant tabular-nums">
              <template v-if="isCurrent(id)">
                <MIcon :name="playing ? 'pause' : 'play_arrow'" :size="22" class="m3m-fill hidden text-on-surface group-hover:inline" />
                <Equalizer :paused="!playing" class="group-hover:hidden" />
              </template>
              <template v-else>
                <span class="group-hover:hidden">{{ i + 1 }}</span>
                <MIcon name="play_arrow" :size="22" class="m3m-fill hidden text-on-surface group-hover:inline" />
              </template>
            </span>

            <span class="flex min-w-0 items-center gap-3">
              <img v-if="covers" :src="albumById.get(trackById.get(id)!.albumId)!.cover" alt="" class="h-10 w-10 shrink-0 rounded-sm" />
              <span class="min-w-0">
                <span class="block truncate text-body-large" :class="current === id ? 'text-primary' : 'text-on-surface'">{{ trackById.get(id)!.title }}</span>
                <span class="flex items-center gap-1 truncate text-body-medium text-on-surface-variant">
                  <MIcon v-if="isLiked(id)" name="favorite" :size="14" class="m3m-fill shrink-0 text-primary sm:hidden" />
                  {{ artistById.get(trackById.get(id)!.artistId)!.name }}
                </span>
              </span>
            </span>

            <span v-if="album" class="hidden truncate text-body-medium text-on-surface-variant md:block">{{ albumById.get(trackById.get(id)!.albumId)!.title }}</span>

            <span class="flex items-center" @click.stop>
              <MIconButton
                icon="favorite"
                :label="isLiked(id) ? 'Remove from Liked Songs' : 'Save to Liked Songs'"
                size="xs"
                class="hidden sm:inline-flex"
                :class="isLiked(id) ? 'm3m-fill text-primary!' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'"
                @click="toggleLike(id)"
              />
              <span class="hidden w-12 text-right text-body-medium text-on-surface-variant tabular-nums sm:inline">{{ formatTime(trackById.get(id)!.duration) }}</span>
              <MMenu align="right">
                <template #trigger>
                  <MIconButton icon="more_vert" label="More" size="xs" />
                </template>
                <TrackMenuItems :track-id="id" :playlist-id="playlistId" />
              </MMenu>
            </span>
          </div>
        </template>
        <TrackMenuItems :track-id="id" :playlist-id="playlistId" />
      </MContextMenu>
    </li>
  </ol>
</template>
