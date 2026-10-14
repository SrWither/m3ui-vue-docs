<script setup lang="ts">
import { computed } from 'vue'
import { MIcon } from '@m3ui-vue/m3ui-vue'
import { albums, artistById, artists, curated } from '../catalog'
import { useMusic, type LibraryEntry } from '../useMusic'
import MediaCard from '../components/MediaCard.vue'
import Shelf from '../components/Shelf.vue'

const { recent, library, go, screenFor, togglePlayFrom, playingFrom, playlistById, playlistImage } = useMusic()

const hour = new Date().getHours()
const greeting = hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

// Quick picks: the last six things you played, drawn like library entries.
const picks = computed(() =>
  recent.value
    .map((r) => library.value.find((e) => e.type === r.type && e.id === r.id) ?? entryFor(r))
    .filter((e): e is LibraryEntry => !!e)
    .slice(0, 6),
)
function entryFor(r: { type: LibraryEntry['type']; id: string }): LibraryEntry | undefined {
  if (r.type === 'playlist') {
    const p = playlistById(r.id)
    return p && { type: 'playlist', id: p.id, title: p.name, subtitle: '', image: playlistImage(p) }
  }
  if (r.type === 'album') {
    const a = albums.find((x) => x.id === r.id)!
    return { type: 'album', id: a.id, title: a.title, subtitle: '', image: a.cover }
  }
  if (r.type === 'artist') {
    const a = artistById.get(r.id)!
    return { type: 'artist', id: a.id, title: a.name, subtitle: '', image: a.image }
  }
}

const newReleases = [...albums].sort((a, b) => b.year - a.year).slice(0, 8)
</script>

<template>
  <div class="px-2 pb-6">
    <h1 class="mt-2 mb-4 px-2 text-headline-medium text-on-surface">{{ greeting }}</h1>

    <div class="grid grid-cols-2 gap-2 px-2 lg:grid-cols-3">
      <div
        v-for="p in picks"
        :key="`${p.type}-${p.id}`"
        role="link"
        tabindex="0"
        class="group flex h-14 cursor-pointer items-center gap-3 overflow-hidden rounded-lg bg-surface-container-high pr-2 outline-none transition-colors hover:bg-surface-container-highest focus-visible:ring-2 focus-visible:ring-secondary sm:h-16"
        @click="go(screenFor(p))"
        @keydown.enter.self="go(screenFor(p))"
      >
        <img :src="p.image" alt="" class="h-full aspect-square shrink-0 object-cover" :class="{ 'rounded-full p-1.5': p.type === 'artist' }" />
        <span class="line-clamp-2 min-w-0 flex-1 text-label-large text-on-surface">{{ p.title }}</span>
        <button
          type="button"
          :aria-label="`Play ${p.title}`"
          class="m3m-fill hidden h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary opacity-0 shadow-elevation-2 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 md:flex"
          :class="{ 'opacity-100': playingFrom(p.type, p.id) }"
          @click.stop="togglePlayFrom(p.type, p.id)"
        >
          <MIcon :name="playingFrom(p.type, p.id) ? 'pause' : 'play_arrow'" :size="24" />
        </button>
      </div>
    </div>

    <Shelf title="Made for you">
      <MediaCard
        v-for="p in curated"
        :key="p.id"
        :image="p.cover"
        :title="p.name"
        :subtitle="p.description"
        :playing="playingFrom('playlist', p.id)"
        @open="go({ name: 'playlist', id: p.id })"
        @play="togglePlayFrom('playlist', p.id)"
      />
    </Shelf>

    <Shelf title="New releases">
      <MediaCard
        v-for="a in newReleases"
        :key="a.id"
        :image="a.cover"
        :title="a.title"
        :subtitle="`${a.year} · ${artistById.get(a.artistId)!.name}`"
        :playing="playingFrom('album', a.id)"
        @open="go({ name: 'album', id: a.id })"
        @play="togglePlayFrom('album', a.id)"
      />
    </Shelf>

    <Shelf title="Popular artists">
      <MediaCard
        v-for="a in artists"
        :key="a.id"
        :image="a.image"
        :title="a.name"
        subtitle="Artist"
        round
        :playing="playingFrom('artist', a.id)"
        @open="go({ name: 'artist', id: a.id })"
        @play="togglePlayFrom('artist', a.id)"
      />
    </Shelf>
  </div>
</template>
