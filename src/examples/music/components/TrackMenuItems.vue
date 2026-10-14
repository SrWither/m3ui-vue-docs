<script setup lang="ts">
/* The items of a song's menu, shared by the "more" button and the right-click menu. */
import { computed } from 'vue'
import { MMenuDivider, MMenuItem } from '@m3ui-vue/m3ui-vue'
import { trackById } from '../catalog'
import { useMusic } from '../useMusic'

const props = defineProps<{ trackId: string; playlistId?: string }>()

const { addToQueue, isLiked, toggleLike, playlists, addToPlaylist, removeFromPlaylist, playlistById, newPlaylist, go, nowPlayingOpen } = useMusic()
const track = computed(() => trackById.get(props.trackId)!)
const mine = computed(() => playlists.value.filter((p) => p.own))
const inOwnPlaylist = computed(() => (props.playlistId ? playlistById(props.playlistId)?.own : false))

function open(screen: Parameters<typeof go>[0]) {
  nowPlayingOpen.value = false
  go(screen)
}
</script>

<template>
  <MMenuItem icon="queue_music" @click="addToQueue(trackId)">Add to queue</MMenuItem>
  <MMenuItem icon="playlist_add">
    Add to playlist
    <template #children>
      <MMenuItem icon="add" @click="newPlaylist = { open: true, pendingTrack: trackId }">New playlist</MMenuItem>
      <MMenuDivider v-if="mine.length" />
      <MMenuItem v-for="p in mine" :key="p.id" icon="queue_music" @click="addToPlaylist(p.id, trackId)">{{ p.name }}</MMenuItem>
    </template>
  </MMenuItem>
  <MMenuItem v-if="inOwnPlaylist" icon="playlist_remove" @click="removeFromPlaylist(playlistId!, trackId)">Remove from this playlist</MMenuItem>
  <MMenuItem :icon="isLiked(trackId) ? 'heart_minus' : 'favorite'" @click="toggleLike(trackId)">
    {{ isLiked(trackId) ? 'Remove from Liked Songs' : 'Save to Liked Songs' }}
  </MMenuItem>
  <MMenuDivider />
  <MMenuItem icon="person" @click="open({ name: 'artist', id: track.artistId })">Go to artist</MMenuItem>
  <MMenuItem icon="album" @click="open({ name: 'album', id: track.albumId })">Go to album</MMenuItem>
</template>
