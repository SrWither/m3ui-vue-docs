<script setup lang="ts">
/* "You": your channel's header, recent history in a row, and your playlists (Watch later, Liked videos and your own). */
import { computed, ref } from 'vue'
import { MAvatar, MButton, MDialog, MIcon, MTextField } from '@m3ui-vue/m3ui-vue'
import { me, thumbOf, videoById } from '../data'
import { useFlick } from '../useFlick'
import VideoCard from '../components/VideoCard.vue'

const f = useFlick()
const recent = computed(() => f.watched.value.slice(0, 8).map((w) => videoById.get(w.id)!))
const lists = computed(() => [f.playlistById('watch-later')!, f.playlistById('liked')!, ...f.playlists.value.filter((p) => !p.builtIn)])
const iconOf = (id: string) => (id === 'watch-later' ? 'schedule' : id === 'liked' ? 'thumb_up' : 'playlist_play')

const naming = ref(false)
const name = ref('')
function create() {
  if (!name.value.trim()) return
  f.createPlaylist(name.value.trim())
  name.value = ''
  naming.value = false
}
</script>

<template>
  <div class="mx-auto flex max-w-[1280px] flex-col gap-8 px-3 py-5 sm:px-6">
    <div class="flex items-center gap-4">
      <MAvatar :name="me.name" :size="72" />
      <div>
        <h1 class="text-headline-small text-on-surface">{{ me.name }}</h1>
        <p class="text-body-medium text-on-surface-variant">{{ me.handle }} · {{ f.subscriptions.size }} subscriptions</p>
      </div>
    </div>

    <section>
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-title-large text-on-surface">History</h2>
        <MButton variant="text" @click="f.go({ name: 'playlist', id: 'history' })">View all</MButton>
      </div>
      <p v-if="!recent.length" class="text-body-medium text-on-surface-variant">Videos you watch show up here.</p>
      <div class="flk-noscroll -mx-3 flex gap-3 overflow-x-auto px-3 sm:-mx-6 sm:px-6">
        <VideoCard v-for="v in recent" :key="v.id" :video="v" class="w-56 shrink-0 sm:w-64" />
      </div>
    </section>

    <section>
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-title-large text-on-surface">Playlists</h2>
        <MButton variant="text" icon="add" @click="naming = true">New playlist</MButton>
      </div>
      <div class="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
        <button v-for="p in lists" :key="p.id" type="button" class="cursor-pointer text-left" @click="f.go({ name: 'playlist', id: p.id })">
          <div class="relative aspect-video overflow-hidden rounded-xl bg-surface-container-highest">
            <img v-if="p.ids[0]" :src="thumbOf(videoById.get(p.ids[0])!)" alt="" class="h-full w-full object-cover" />
            <span class="absolute right-1.5 bottom-1.5 flex items-center gap-1 rounded-md bg-black/75 px-1.5 text-label-medium text-white">
              <MIcon :name="iconOf(p.id)" :size="16" /> {{ p.ids.length }}
            </span>
          </div>
          <p class="mt-2 truncate text-title-small text-on-surface">{{ p.name }}</p>
          <p class="text-body-small text-on-surface-variant">{{ p.builtIn ? 'Private' : 'Playlist' }} · {{ p.ids.length }} videos</p>
        </button>
      </div>
    </section>

    <MDialog v-model="naming" title="New playlist" max-width="360px">
      <form id="flk-new-playlist" @submit.prevent="create">
        <MTextField v-model="name" label="Name" autocomplete="off" />
      </form>
      <template #actions>
        <MButton variant="text" @click="naming = false">Cancel</MButton>
        <MButton type="submit" form="flk-new-playlist" :disabled="!name.trim()">Create</MButton>
      </template>
    </MDialog>
  </div>
</template>
