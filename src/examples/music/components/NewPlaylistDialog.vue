<script setup lang="ts">
import { ref, watch } from 'vue'
import { MButton, MDialog, MTextField } from '@m3ui-vue/m3ui-vue'
import { trackById } from '../catalog'
import { useMusic } from '../useMusic'

const { newPlaylist, createPlaylist, playlists, go } = useMusic()
const name = ref('')

watch(
  () => newPlaylist.value.open,
  (open) => {
    if (open) name.value = `My Playlist #${playlists.value.filter((p) => p.own).length + 1}`
  },
)

function create() {
  if (!name.value.trim()) return
  const track = newPlaylist.value.pendingTrack
  const id = createPlaylist(name.value.trim(), track)
  newPlaylist.value = { open: false }
  go({ name: 'playlist', id })
}
</script>

<template>
  <MDialog
    :model-value="newPlaylist.open"
    title="New playlist"
    max-width="max-w-sm"
    @update:model-value="newPlaylist = { open: $event }"
  >
    <form id="m3m-new-playlist" @submit.prevent="create">
      <MTextField v-model="name" label="Name" />
      <p v-if="newPlaylist.pendingTrack" class="mt-3 text-body-medium text-on-surface-variant">
        “{{ trackById.get(newPlaylist.pendingTrack)!.title }}” will be its first song.
      </p>
    </form>
    <template #actions>
      <MButton variant="text" @click="newPlaylist = { open: false }">Cancel</MButton>
      <MButton type="submit" form="m3m-new-playlist" :disabled="!name.trim()">Create</MButton>
    </template>
  </MDialog>
</template>
