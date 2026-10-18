<script setup lang="ts">
/*
 * A video in a list: `grid` (thumbnail over the details, with the channel's avatar), `row`
 * (thumbnail beside the details, for search, playlists and history) or `compact` (the small rows
 * of "Up next"). The ⋮ menu saves it, shares it or, in history, removes it.
 */
import { computed } from 'vue'
import { MAvatar, MIcon, MIconButton, MMenu, MMenuItem } from '@m3ui-vue/m3ui-vue'
import { ago, channelById, compact, type Video } from '../data'
import { useFlick } from '../useFlick'
import Thumb from './Thumb.vue'

const props = withDefaults(defineProps<{ video: Video; layout?: 'grid' | 'row' | 'compact'; removable?: string }>(), { layout: 'grid' })
const emit = defineEmits<{ remove: [] }>()
const { play, go, watchLater, inPlaylist, saving, sharing } = useFlick()
const channel = computed(() => channelById.get(props.video.channelId)!)
const meta = computed(() => `${compact(props.video.views)} views · ${ago(props.video.date)}`)
</script>

<template>
  <article
    class="group relative flex"
    :class="{
      'flex-col gap-3': layout === 'grid',
      'gap-3 sm:gap-4': layout === 'row',
      'gap-2': layout === 'compact',
    }"
  >
    <button
      type="button"
      class="shrink-0 cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      :class="{ 'w-40 sm:w-60 lg:w-[360px]': layout === 'row', 'w-40': layout === 'compact' }"
      :aria-label="`Play ${video.title}`"
      @click="play(video.id)"
    >
      <Thumb :video="video" :preview="layout !== 'compact'" />
    </button>

    <div class="relative flex min-w-0 flex-1 gap-3">
      <button v-if="layout === 'grid'" type="button" class="h-9 shrink-0 cursor-pointer rounded-full" :aria-label="channel.name" @click="go({ name: 'channel', id: channel.id })">
        <MAvatar :name="channel.name" :size="36" />
      </button>
      <div class="min-w-0 flex-1 pr-6">
        <button type="button" class="block cursor-pointer text-left" @click="play(video.id)">
          <h3 class="line-clamp-2 text-on-surface" :class="layout === 'compact' ? 'text-title-small' : layout === 'row' ? 'text-title-medium sm:text-title-large' : 'text-title-medium'">
            {{ video.title }}
          </h3>
        </button>
        <p v-if="layout === 'row'" class="mt-1 text-body-small text-on-surface-variant">{{ meta }}</p>
        <button type="button" class="mt-0.5 flex cursor-pointer items-center gap-1 text-body-medium text-on-surface-variant hover:text-on-surface" :class="{ 'mt-2 sm:mt-3': layout === 'row' }" @click="go({ name: 'channel', id: channel.id })">
          <MAvatar v-if="layout === 'row'" :name="channel.name" :size="24" class="mr-1 hidden sm:flex" />
          <span class="truncate">{{ channel.name }}</span>
          <MIcon v-if="channel.verified" name="check_circle" :size="14" class="flk-fill shrink-0" />
        </button>
        <p v-if="layout !== 'row'" class="text-body-medium text-on-surface-variant">{{ meta }}</p>
        <p v-if="layout === 'row'" class="mt-2 hidden line-clamp-2 text-body-small text-on-surface-variant sm:block">{{ video.description.split('\n')[0] }}</p>
      </div>
      <div class="absolute -top-1 -right-2">
        <MMenu align="right">
          <template #trigger>
            <MIconButton icon="more_vert" label="More actions" size="xs" />
          </template>
          <MMenuItem icon="schedule" :disabled="inPlaylist('watch-later', video.id)" @click="watchLater(video.id)">Save to Watch later</MMenuItem>
          <MMenuItem icon="playlist_add" @click="saving = video.id">Save to playlist</MMenuItem>
          <MMenuItem icon="share" @click="sharing = { id: video.id }">Share</MMenuItem>
          <MMenuItem v-if="removable" icon="delete" @click="emit('remove')">{{ removable }}</MMenuItem>
        </MMenu>
      </div>
    </div>
  </article>
</template>
