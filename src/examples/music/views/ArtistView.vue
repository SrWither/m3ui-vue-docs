<script setup lang="ts">
/* An artist: banner, follow, popular songs, discography and an about card. */
import { computed, ref } from 'vue'
import { MButton, MIcon, MIconButton, MTooltip } from '@m3ui-vue/m3ui-vue'
import { artistAlbums, artistById, artists, formatCount, popularTracks } from '../catalog'
import { useMusic } from '../useMusic'
import PlayButton from '../components/PlayButton.vue'
import TrackList from '../components/TrackList.vue'
import MediaCard from '../components/MediaCard.vue'
import Shelf from '../components/Shelf.vue'

const props = defineProps<{ id: string }>()
const { go, followed, toggleFollow, shuffle, playingFrom, togglePlayFrom } = useMusic()

const artist = computed(() => artistById.get(props.id)!)
const popular = computed(() => popularTracks(props.id))
const discography = computed(() => artistAlbums(props.id))
const similar = computed(() => artists.filter((a) => a.id !== props.id && a.genre === artist.value.genre).concat(artists.filter((a) => a.genre !== artist.value.genre)).slice(0, 6))
const following = computed(() => followed.value.includes(props.id))
const showAll = ref(false)
</script>

<template>
  <div>
    <header class="relative h-64 overflow-hidden sm:h-80">
      <img :src="artist.image" alt="" class="absolute inset-0 h-full w-full object-cover object-[50%_30%]" />
      <div class="absolute inset-0 bg-linear-to-b from-black/0 via-black/10 to-black/70" />
      <div class="absolute inset-x-0 bottom-0 px-4 pb-5 text-white sm:px-6">
        <p class="flex items-center gap-1 text-label-large"><MIcon name="verified" :size="20" filled class="text-sky-300" />Verified artist</p>
        <h1 class="text-display-small font-bold sm:text-display-large">{{ artist.name }}</h1>
        <p class="text-body-medium opacity-90">{{ formatCount(artist.listeners) }} monthly listeners</p>
      </div>
    </header>

    <div class="flex items-center gap-3 px-4 py-4 sm:px-6">
      <PlayButton :playing="playingFrom('artist', id)" :label="artist.name" @click="togglePlayFrom('artist', id)" />
      <MTooltip :text="shuffle ? 'Shuffle is on' : 'Shuffle'">
        <MIconButton icon="shuffle" label="Shuffle" size="md" :color="shuffle ? 'primary' : undefined" :aria-pressed="shuffle" @click="shuffle = !shuffle" />
      </MTooltip>
      <MButton :variant="following ? 'tonal' : 'outlined'" size="sm" @click="toggleFollow(id)">{{ following ? 'Following' : 'Follow' }}</MButton>
    </div>

    <div class="px-2 pb-6 sm:px-4">
      <h2 class="mb-2 px-2 text-title-large text-on-surface">Popular</h2>
      <TrackList :track-ids="showAll ? popular : popular.slice(0, 3)" :source="{ type: 'artist', id }" covers />
      <MButton variant="text" size="sm" class="mt-1 ml-1" @click="showAll = !showAll">{{ showAll ? 'Show less' : 'See more' }}</MButton>

      <Shelf title="Discography">
        <MediaCard
          v-for="a in discography"
          :key="a.id"
          :image="a.cover"
          :title="a.title"
          :subtitle="`${a.year} · ${a.type}`"
          :playing="playingFrom('album', a.id)"
          @open="go({ name: 'album', id: a.id })"
          @play="togglePlayFrom('album', a.id)"
        />
      </Shelf>

      <section class="mt-6 px-2">
        <h2 class="mb-3 text-title-large text-on-surface">About</h2>
        <div class="flex max-w-2xl flex-col overflow-hidden rounded-xl bg-surface-container-high sm:flex-row">
          <img :src="artist.image" alt="" class="h-40 w-full object-cover sm:h-auto sm:w-48" />
          <div class="p-4">
            <p class="text-title-medium text-on-surface">{{ formatCount(artist.listeners) }} monthly listeners</p>
            <p class="mt-2 text-body-medium text-on-surface-variant">{{ artist.bio }}</p>
          </div>
        </div>
      </section>

      <Shelf title="Fans also like">
        <MediaCard
          v-for="a in similar"
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
  </div>
</template>
