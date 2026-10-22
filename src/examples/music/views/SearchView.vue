<script setup lang="ts">
/* Search: genre tiles while empty, then a top result, songs, artists, albums and playlists. */
import { computed, onMounted, ref } from 'vue'
import { MChip, MEmptyState, MIcon, MSearchField } from '@m3ui-vue/m3ui-vue'
import { albums, artistById, artists, genres, tracks, albumById, type Genre } from '../catalog'
import { useMusic } from '../useMusic'
import MediaCard from '../components/MediaCard.vue'
import Shelf from '../components/Shelf.vue'
import TrackList from '../components/TrackList.vue'

const { query, go, playlists, playlistImage, playingFrom, togglePlayFrom } = useMusic()

const field = ref<InstanceType<typeof MSearchField>>()
onMounted(() => {
  // Focus the field on devices with a keyboard; on phones it would pop the keyboard up uninvited.
  if (matchMedia('(pointer: fine)').matches) field.value?.focus()
})

const filter = ref<'all' | 'songs' | 'artists' | 'albums' | 'playlists'>('all')
const filters = [
  { id: 'all', label: 'All' },
  { id: 'songs', label: 'Songs' },
  { id: 'artists', label: 'Artists' },
  { id: 'albums', label: 'Albums' },
  { id: 'playlists', label: 'Playlists' },
] as const

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const q = computed(() => norm(query.value.trim()))
const has = (...fields: string[]) => fields.some((f) => norm(f).includes(q.value))

const results = computed(() => {
  if (!q.value) return null
  const songs = tracks
    .filter((t) => has(t.title, artistById.get(t.artistId)!.name, albumById.get(t.albumId)!.title, genres[t.genre].label))
    .sort((a, b) => b.plays - a.plays)
  return {
    songs: songs.map((t) => t.id),
    artists: artists.filter((a) => has(a.name, genres[a.genre].label)),
    albums: albums.filter((a) => has(a.title, artistById.get(a.artistId)!.name, genres[artistById.get(a.artistId)!.genre].label)),
    playlists: playlists.value.filter((p) => has(p.name, p.description)),
  }
})
const empty = computed(() => results.value && !results.value.songs.length && !results.value.artists.length && !results.value.albums.length && !results.value.playlists.length)

// The best match: an artist whose name starts with the query, else the most played song.
const top = computed(() => {
  const r = results.value
  if (!r) return null
  const artist = r.artists.find((a) => norm(a.name).startsWith(q.value)) ?? (r.songs.length ? null : r.artists[0])
  if (artist) return { kind: 'Artist', title: artist.name, image: artist.image, round: true, open: () => go({ name: 'artist', id: artist.id }), play: () => togglePlayFrom('artist', artist.id), playing: playingFrom('artist', artist.id) }
  const album = r.albums.find((a) => norm(a.title).startsWith(q.value))
  if (album) return { kind: `${album.type} · ${artistById.get(album.artistId)!.name}`, title: album.title, image: album.cover, round: false, open: () => go({ name: 'album', id: album.id }), play: () => togglePlayFrom('album', album.id), playing: playingFrom('album', album.id) }
  const song = r.songs[0] && tracks.find((t) => t.id === r.songs[0])!
  if (song) return { kind: `Song · ${artistById.get(song.artistId)!.name}`, title: song.title, image: albumById.get(song.albumId)!.cover, round: false, open: () => go({ name: 'album', id: song.albumId }), play: () => togglePlayFrom('search', song.id), playing: playingFrom('search', song.id) }
  return null
})

const browse = (Object.keys(genres) as Genre[]).map((g) => ({ id: g, ...genres[g], cover: albums.find((a) => artistById.get(a.artistId)!.genre === g)!.cover }))
</script>

<template>
  <div class="px-2 pb-6 sm:px-4">
    <div class="sticky top-0 z-10 -mx-2 bg-surface-container-low px-4 pt-2 pb-3 sm:-mx-4 sm:px-6">
      <MSearchField ref="field" v-model="query" size="md" placeholder="What do you want to listen to?" label="Search" class="bg-surface-container-highest" />
      <div v-if="results && !empty" class="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none]">
        <MChip v-for="f in filters" :key="f.id" clickable :selected="filter === f.id" @click="filter = f.id">{{ f.label }}</MChip>
      </div>
    </div>

    <!-- Nothing typed yet: browse by genre -->
    <section v-if="!results" class="px-2">
      <h2 class="mt-2 mb-3 text-title-large text-on-surface">Browse all</h2>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <button
          v-for="g in browse"
          :key="g.id"
          type="button"
          class="relative aspect-[5/3] cursor-pointer overflow-hidden rounded-xl p-3 text-left outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          :style="{ backgroundColor: g.color }"
          @click="query = g.label"
        >
          <span class="text-title-large font-bold text-white">{{ g.label }}</span>
          <img :src="g.cover" alt="" class="absolute -right-4 -bottom-2 h-20 w-20 rotate-25 rounded-md shadow-elevation-3" />
        </button>
      </div>
    </section>

    <MEmptyState v-else-if="empty" icon="search_off" :title="`No results for “${query}”`" description="Check the spelling, or try fewer words." />

    <template v-else-if="results">
      <div v-if="filter === 'all'" class="grid gap-6 px-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section v-if="top">
          <h2 class="mb-3 text-title-large text-on-surface">Top result</h2>
          <div
            role="link"
            tabindex="0"
            class="group relative cursor-pointer rounded-xl bg-surface-container-high p-5 outline-none transition-colors hover:bg-surface-container-highest focus-visible:ring-2 focus-visible:ring-secondary"
            @click="top.open()"
            @keydown.enter.self="top.open()"
          >
            <img :src="top.image" alt="" class="mb-4 h-24 w-24 shadow-elevation-2" :class="top.round ? 'rounded-full' : 'rounded-lg'" />
            <p class="truncate text-headline-small font-bold text-on-surface">{{ top.title }}</p>
            <p class="text-body-medium text-on-surface-variant">{{ top.kind }}</p>
            <button
              type="button"
              :aria-label="`Play ${top.title}`"
              class="absolute right-4 bottom-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary shadow-elevation-3 transition-[opacity,translate] focus-visible:opacity-100"
              :class="top.playing ? 'opacity-100' : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'"
              @click.stop="top.play()"
            >
              <MIcon :name="top.playing ? 'pause' : 'play_arrow'" :size="28" filled />
            </button>
          </div>
        </section>
        <section v-if="results.songs.length" class="-mx-2">
          <h2 class="mb-1 px-2 text-title-large text-on-surface">Songs</h2>
          <TrackList :track-ids="results.songs.slice(0, 4)" :source="{ type: 'search', id: '' }" covers />
        </section>
      </div>

      <section v-if="filter === 'songs'" class="-mx-0">
        <TrackList :track-ids="results.songs" :source="{ type: 'search', id: '' }" covers album />
      </section>

      <Shelf v-if="(filter === 'all' || filter === 'artists') && results.artists.length" title="Artists">
        <MediaCard
          v-for="a in results.artists"
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
      <Shelf v-if="(filter === 'all' || filter === 'albums') && results.albums.length" title="Albums">
        <MediaCard
          v-for="a in results.albums"
          :key="a.id"
          :image="a.cover"
          :title="a.title"
          :subtitle="`${a.year} · ${artistById.get(a.artistId)!.name}`"
          :playing="playingFrom('album', a.id)"
          @open="go({ name: 'album', id: a.id })"
          @play="togglePlayFrom('album', a.id)"
        />
      </Shelf>
      <Shelf v-if="(filter === 'all' || filter === 'playlists') && results.playlists.length" title="Playlists">
        <MediaCard
          v-for="p in results.playlists"
          :key="p.id"
          :image="playlistImage(p)"
          :title="p.name"
          :subtitle="p.own ? 'By you' : 'By Tempo'"
          :playing="playingFrom('playlist', p.id)"
          @open="go({ name: 'playlist', id: p.id })"
          @play="togglePlayFrom('playlist', p.id)"
        />
      </Shelf>
      <MEmptyState
        v-if="filter !== 'all' && !(filter === 'songs' ? results.songs : results[filter]).length"
        icon="search_off"
        :title="`No ${filter} match “${query}”`"
      />
    </template>
  </div>
</template>
