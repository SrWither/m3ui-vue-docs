<script setup lang="ts">
/* An album, a playlist or Liked Songs: header, actions and the songs. */
import { computed, ref } from 'vue'
import { MButton, MDialog, MEmptyState, MIconButton, MMenu, MMenuItem, MTextField, MTooltip, useToast } from '@m3ui-vue/m3ui-vue'
import { albumById, artistById, artistAlbums, formatTime, trackById } from '../catalog'
import { likedCover } from '../art'
import { useMusic, type Source } from '../useMusic'
import CollectionHeader from '../components/CollectionHeader.vue'
import PlayButton from '../components/PlayButton.vue'
import TrackList from '../components/TrackList.vue'
import MediaCard from '../components/MediaCard.vue'
import Shelf from '../components/Shelf.vue'

const props = defineProps<{ type: 'album' | 'playlist' | 'liked'; id: string }>()

const m = useMusic()
const { go, shuffle, playingFrom, togglePlayFrom, liked } = m
const toast = useToast()

const album = computed(() => (props.type === 'album' ? albumById.get(props.id)! : null))
const playlist = computed(() => (props.type === 'playlist' ? m.playlistById(props.id) : null))
const artist = computed(() => (album.value ? artistById.get(album.value.artistId)! : null))

const trackIds = computed(() => m.collection(props.type, props.id).tracks)
const total = computed(() => trackIds.value.reduce((s, id) => s + trackById.get(id)!.duration, 0))
const length = computed(() => {
  const min = Math.round(total.value / 60)
  return min >= 60 ? `${Math.floor(min / 60)} hr ${min % 60} min` : `${min} min`
})

const header = computed(() => {
  if (album.value) return { kind: album.value.type, title: album.value.title, image: album.value.cover }
  if (playlist.value) return { kind: playlist.value.own ? 'Your playlist' : 'Playlist', title: playlist.value.name, image: m.playlistImage(playlist.value) }
  return { kind: 'Playlist', title: 'Liked Songs', image: likedCover }
})

const saved = computed(() => {
  if (album.value) return m.savedAlbums.value.includes(props.id)
  if (playlist.value && !playlist.value.own) return m.savedPlaylists.value.includes(props.id)
  return null
})
function toggleSaved() {
  if (album.value) m.toggleSaveAlbum(props.id)
  else m.toggleSavePlaylist(props.id)
}

const source = computed<{ type: Source['type']; id: string }>(() => ({ type: props.type, id: props.id }))
const more = computed(() => (album.value ? artistAlbums(album.value.artistId).filter((a) => a.id !== props.id) : []))

function share() {
  void navigator.clipboard?.writeText(`${location.origin}/examples/music`)
  toast.success('Link copied to clipboard', { icon: 'link' })
}

// Renaming your own playlists.
const renaming = ref(false)
const newName = ref('')
function startRename() {
  newName.value = playlist.value!.name
  renaming.value = true
}
function rename() {
  if (!newName.value.trim()) return
  playlist.value!.name = newName.value.trim()
  renaming.value = false
}
</script>

<template>
  <div>
    <CollectionHeader :image="header.image" :kind="header.kind" :title="header.title">
      <template v-if="album && artist">
        <button type="button" class="inline-flex cursor-pointer items-center gap-1.5 align-middle font-medium text-on-surface hover:underline" @click="go({ name: 'artist', id: artist.id })">
          <img :src="artist.image" alt="" class="h-6 w-6 rounded-full" />{{ artist.name }}
        </button>
        · {{ album.year }} · {{ trackIds.length }} songs, {{ length }}
      </template>
      <template v-else-if="playlist">
        <p v-if="playlist.description" class="mb-1 line-clamp-2">{{ playlist.description }}</p>
        <span class="font-medium text-on-surface">{{ playlist.own ? 'You' : 'Tempo' }}</span> · {{ trackIds.length }} songs<template v-if="trackIds.length">, {{ length }}</template>
      </template>
      <template v-else>
        <span class="font-medium text-on-surface">You</span> · {{ liked.length }} songs
      </template>
    </CollectionHeader>

    <div class="flex items-center gap-2 px-4 py-4 sm:px-6">
      <PlayButton v-if="trackIds.length" :playing="playingFrom(type, id)" :label="header.title" @click="togglePlayFrom(type, id)" />
      <MTooltip :text="shuffle ? 'Shuffle is on' : 'Shuffle'">
        <MIconButton icon="shuffle" label="Shuffle" size="md" :color="shuffle ? 'primary' : undefined" :aria-pressed="shuffle" @click="shuffle = !shuffle" />
      </MTooltip>
      <MTooltip v-if="saved !== null" :text="saved ? 'Remove from Your Library' : 'Save to Your Library'">
        <MIconButton
          :icon="saved ? 'check_circle' : 'add_circle'"
          :label="saved ? 'Remove from Your Library' : 'Save to Your Library'"
          size="md"
          :checked="saved"
          @click="toggleSaved"
        />
      </MTooltip>
      <MMenu align="left">
        <template #trigger>
          <MIconButton icon="more_horiz" label="More options" size="md" />
        </template>
        <MMenuItem v-if="artist" icon="person" @click="go({ name: 'artist', id: artist.id })">Go to artist</MMenuItem>
        <template v-if="playlist?.own">
          <MMenuItem icon="edit" @click="startRename">Rename</MMenuItem>
          <MMenuItem icon="delete" danger @click="m.deletePlaylist(id)">Delete</MMenuItem>
        </template>
        <MMenuItem icon="link" @click="share">Copy link</MMenuItem>
      </MMenu>
    </div>

    <div class="px-2 pb-6 sm:px-4">
      <TrackList v-if="trackIds.length" :track-ids="trackIds" :source="source" :covers="type !== 'album'" :album="type !== 'album'" :playlist-id="playlist?.id" />
      <MEmptyState
        v-else
        :icon="type === 'liked' ? 'favorite' : 'queue_music'"
        :title="type === 'liked' ? 'Songs you like will appear here' : 'Let’s find something for your playlist'"
        :description="type === 'liked' ? 'Save songs by tapping the heart.' : 'Add songs from any song’s menu, under Add to playlist.'"
      >
        <template #actions>
          <MButton variant="tonal" icon="search" @click="go({ name: 'search' })">Find songs</MButton>
        </template>
      </MEmptyState>

      <p v-if="album" class="mt-4 px-2 text-body-small text-on-surface-variant">
        Released {{ album.year }} · {{ formatTime(total) }} · ℗ {{ album.year }} {{ artist!.name }}, a generated recording
      </p>

      <Shelf v-if="more.length" :title="`More by ${artist!.name}`">
        <MediaCard
          v-for="a in more"
          :key="a.id"
          :image="a.cover"
          :title="a.title"
          :subtitle="`${a.year} · ${a.type}`"
          :playing="playingFrom('album', a.id)"
          @open="go({ name: 'album', id: a.id })"
          @play="togglePlayFrom('album', a.id)"
        />
      </Shelf>
    </div>

    <MDialog v-model="renaming" title="Rename playlist" max-width="max-w-sm">
      <form id="m3m-rename" @submit.prevent="rename">
        <MTextField v-model="newName" label="Name" />
      </form>
      <template #actions>
        <MButton variant="text" @click="renaming = false">Cancel</MButton>
        <MButton type="submit" form="m3m-rename" :disabled="!newName.trim()">Save</MButton>
      </template>
    </MDialog>
  </div>
</template>
