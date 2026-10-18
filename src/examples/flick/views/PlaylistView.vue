<script setup lang="ts">
/*
 * A playlist (Watch later, Liked videos or one of yours) or your watch history, grouped by day.
 * Your own playlists can be renamed and deleted; any video can be removed with undo.
 */
import { computed, ref } from 'vue'
import { MButton, MDialog, MEmptyState, MIconButton, MMenu, MMenuItem, MTextField } from '@m3ui-vue/m3ui-vue'
import { thumbOf, videoById, type Video } from '../data'
import { useFlick } from '../useFlick'
import VideoCard from '../components/VideoCard.vue'

const props = defineProps<{ id: string }>()
const f = useFlick()
const history = computed(() => props.id === 'history')
const playlist = computed(() => (history.value ? undefined : f.playlistById(props.id)))
const title = computed(() => (history.value ? 'Watch history' : (playlist.value?.name ?? 'Playlist')))
const items = computed<Video[]>(() => (history.value ? f.watched.value.map((w) => w.id) : (playlist.value?.ids ?? [])).map((id) => videoById.get(id)!))

const dayLabel = (at: number) => {
  const days = Math.floor((new Date().setHours(24, 0, 0, 0) - at) / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return new Date(at).toLocaleDateString('en', { weekday: 'long' })
  return new Date(at).toLocaleDateString('en', { month: 'long', day: 'numeric' })
}
const groups = computed(() => {
  if (!history.value) return [{ label: '', videos: items.value }]
  const out: Array<{ label: string; videos: Video[] }> = []
  for (const w of f.watched.value) {
    const label = dayLabel(w.at)
    if (out.at(-1)?.label !== label) out.push({ label, videos: [] })
    out.at(-1)!.videos.push(videoById.get(w.id)!)
  }
  return out
})

function remove(v: Video) {
  if (history.value) f.removeFromHistory(v.id)
  else if (props.id === 'liked') f.rateVideo(v.id, 'like')
  else f.toggleInPlaylist(props.id, v.id)
}
const removeLabel = computed(() => (history.value ? 'Remove from watch history' : `Remove from ${title.value}`))

const renaming = ref(false)
const name = ref('')
function rename() {
  if (playlist.value && name.value.trim()) {
    const p = f.playlists.value.find((l) => l.id === props.id)!
    p.name = name.value.trim()
  }
  renaming.value = false
}
function remove_() {
  f.deletePlaylist(props.id)
  f.go({ name: 'you' }, true)
}
</script>

<template>
  <div class="mx-auto flex max-w-[1280px] flex-col gap-6 px-3 py-5 sm:px-6 lg:flex-row lg:items-start">
    <!-- Header card -->
    <div class="flex shrink-0 flex-col gap-3 rounded-2xl bg-surface-container p-4 lg:sticky lg:top-4 lg:w-80">
      <img v-if="items[0]" :src="thumbOf(items[0])" alt="" class="aspect-video w-full rounded-xl object-cover" />
      <div class="flex items-start gap-2">
        <div class="min-w-0 flex-1">
          <h1 class="text-headline-small text-on-surface">{{ title }}</h1>
          <p class="text-body-medium text-on-surface-variant">{{ items.length }} videos{{ playlist?.builtIn || history ? ' · Private' : '' }}</p>
        </div>
        <MMenu v-if="playlist && !playlist.builtIn" align="right">
          <template #trigger><MIconButton icon="more_vert" label="Playlist actions" /></template>
          <MMenuItem icon="edit" @click="(name = playlist.name), (renaming = true)">Rename</MMenuItem>
          <MMenuItem icon="delete" danger @click="remove_">Delete playlist</MMenuItem>
        </MMenu>
      </div>
      <MButton v-if="items.length" icon="play_arrow" class="flk-fill" @click="f.play(items[0]!.id)">Play all</MButton>
    </div>

    <div class="min-w-0 flex-1">
      <MEmptyState v-if="!items.length" :icon="history ? 'history' : 'playlist_play'" :title="history ? 'No history yet' : 'No videos in this playlist yet'" class="py-16" />
      <section v-for="g in groups" :key="g.label" class="mb-6">
        <h2 v-if="g.label" class="mb-3 text-title-medium text-on-surface">{{ g.label }}</h2>
        <div class="flex flex-col gap-4">
          <VideoCard v-for="v in g.videos" :key="v.id" :video="v" layout="row" :removable="removeLabel" @remove="remove(v)" />
        </div>
      </section>
    </div>

    <MDialog v-model="renaming" title="Rename playlist" max-width="360px">
      <form id="flk-rename" @submit.prevent="rename"><MTextField v-model="name" label="Name" autocomplete="off" /></form>
      <template #actions>
        <MButton variant="text" @click="renaming = false">Cancel</MButton>
        <MButton type="submit" form="flk-rename" :disabled="!name.trim()">Save</MButton>
      </template>
    </MDialog>
  </div>
</template>
