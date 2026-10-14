<script setup lang="ts">
/* Your Library: filter chips and everything you saved. The sidebar on wide screens, a tab on phones. */
import { computed } from 'vue'
import { MChip, MIcon, MIconButton, MList, MListItem, MTooltip } from '@m3ui-vue/m3ui-vue'
import { useMusic, type LibraryEntry } from '../useMusic'

const { library, libraryFilter, screen, go, screenFor, playingFrom, newPlaylist } = useMusic()

const filters = [
  { id: 'playlist', label: 'Playlists' },
  { id: 'album', label: 'Albums' },
  { id: 'artist', label: 'Artists' },
] as const

const active = (e: LibraryEntry) => {
  const s = screen.value
  return e.type === 'liked' ? s.name === 'liked' : s.name === e.type && s.id === e.id
}
const count = computed(() => library.value.length)
</script>

<template>
  <div class="flex min-h-0 flex-col">
    <div class="flex items-center gap-2 px-4 pt-3 pb-2">
      <MIcon name="library_music" :size="24" class="text-on-surface-variant" />
      <h2 class="flex-1 text-title-medium text-on-surface">Your Library</h2>
      <MTooltip text="Create playlist">
        <MIconButton icon="add" label="Create playlist" @click="newPlaylist = { open: true }" />
      </MTooltip>
    </div>
    <div class="flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
      <MChip v-if="libraryFilter !== 'all'" clickable icon="close" @click="libraryFilter = 'all'"><span class="sr-only">Show all</span></MChip>
      <template v-for="f in filters" :key="f.id">
        <MChip v-if="libraryFilter === 'all' || libraryFilter === f.id" clickable :selected="libraryFilter === f.id" @click="libraryFilter = libraryFilter === f.id ? 'all' : f.id">
          {{ f.label }}
        </MChip>
      </template>
    </div>

    <MList nav :lines="2" class="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
      <MListItem
        v-for="e in library"
        :key="`${e.type}-${e.id}`"
        :title="e.title"
        :subtitle="e.subtitle"
        clickable
        :active="active(e)"
        @click="go(screenFor(e))"
      >
        <template #leading>
          <img :src="e.image" alt="" class="h-12 w-12 shrink-0 object-cover" :class="e.type === 'artist' ? 'rounded-full' : 'rounded-md'" />
        </template>
        <template #trailing>
          <MIcon v-if="playingFrom(e.type, e.id)" name="volume_up" :size="20" class="shrink-0 text-primary" />
        </template>
      </MListItem>
    </MList>
    <p v-if="!count" class="px-4 text-body-medium text-on-surface-variant">Nothing here yet.</p>
  </div>
</template>
