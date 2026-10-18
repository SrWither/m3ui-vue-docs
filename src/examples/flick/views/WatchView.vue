<script setup lang="ts">
/*
 * A video's page. Wide screens: the player and its details on the left, "Up next" on the right
 * (theater mode puts the player across both). Phones: the player stays at the top while the rest
 * scrolls, and the comments open in a bottom sheet, like the apps do.
 */
import { computed, ref, watch } from 'vue'
import { MAvatar, MBottomSheet, MButton, MButtonGroup, MIcon, MMenu, MMenuItem, MSwitch } from '@m3ui-vue/m3ui-vue'
import type { ButtonGroupOption } from '@m3ui-vue/m3ui-vue'
import { ago, channelById, compact, videoById } from '../data'
import { useFlick } from '../useFlick'
import Player from '../components/Player.vue'
import VideoCard from '../components/VideoCard.vue'
import Comments from '../components/Comments.vue'
import CommentRow from '../components/CommentRow.vue'

const props = defineProps<{ id: string; wide: boolean }>()
const f = useFlick()
const { current, theater, subscriptions, bell, liked, disliked, position, autoplay, sharing, saving } = f

const video = computed(() => videoById.get(props.id)!)
const channel = computed(() => channelById.get(video.value.channelId)!)
const next = computed(() => f.upNext(props.id))

// Coming back to this page (history) for a video that isn't the one loaded starts it.
watch(() => props.id, (id) => current.value !== id && f.play(id, { page: false }), { immediate: true })

const rating = computed({
  get: () => (liked.has(props.id) ? 'like' : disliked.has(props.id) ? 'dislike' : null),
  set: (v: string | null) => {
    if (v) f.rateVideo(props.id, v as 'like' | 'dislike')
    else f.rateVideo(props.id, liked.has(props.id) ? 'like' : 'dislike')
  },
})
const ratingOptions = computed<ButtonGroupOption[]>(() => [
  { value: 'like', icon: 'thumb_up', label: compact(f.likeCount(video.value)) },
  { value: 'dislike', icon: 'thumb_down' },
])

// The description folds to three lines; "0:00 Intro" lines become chapter links.
const more = ref(false)
watch(() => props.id, () => (more.value = false))
const parts = computed(() =>
  video.value.description.split('\n').map((line) => {
    const m = line.match(/^(\d+):(\d{2}) (.+)$/)
    return m ? { at: Number(m[1]) * 60 + Number(m[2]), stamp: `${m[1]}:${m[2]}`, text: m[3]! } : { text: line }
  }),
)

const commentsOpen = ref(false)
const topComment = computed(() => f.commentsOf(props.id)[0])

function minimize() {
  if (f.canBack.value) f.back()
  else f.go({ name: 'home' })
}
</script>

<template>
  <div class="mx-auto w-full" :class="{ 'max-w-[1720px] px-6 pt-4': wide }">
    <!-- Theater: the player across the top, on black -->
    <div v-if="wide && theater" class="-mx-6 -mt-4 mb-4 bg-black">
      <Player :wide="wide" :next="next[0]?.id" @minimize="minimize" />
    </div>

    <div class="flex flex-col gap-6 lg:flex-row">
      <div class="min-w-0 flex-1">
        <div v-if="!(wide && theater)" class="bg-black" :class="wide ? 'overflow-hidden rounded-xl' : 'sticky top-0 z-10'">
          <Player :wide="wide" :next="next[0]?.id" @minimize="minimize" />
        </div>

        <div :class="{ 'px-3': !wide }">
          <h1 class="mt-3 text-title-large text-on-surface sm:text-headline-small">{{ video.title }}</h1>

          <div class="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div class="flex min-w-0 items-center gap-3">
              <button type="button" class="cursor-pointer rounded-full" :aria-label="channel.name" @click="f.go({ name: 'channel', id: channel.id })">
                <MAvatar :name="channel.name" :size="40" />
              </button>
              <div class="min-w-0">
                <button type="button" class="flex cursor-pointer items-center gap-1 text-title-medium text-on-surface" @click="f.go({ name: 'channel', id: channel.id })">
                  <span class="truncate">{{ channel.name }}</span>
                  <MIcon v-if="channel.verified" name="check_circle" :size="16" class="flk-fill text-on-surface-variant" />
                </button>
                <p class="text-body-small text-on-surface-variant">{{ compact(f.subscriberCount(channel.id)) }} subscribers</p>
              </div>
              <MButton v-if="!subscriptions.has(channel.id)" class="ml-2" @click="f.toggleSubscribe(channel.id)">Subscribe</MButton>
              <MMenu v-else align="left" class="ml-2">
                <template #trigger>
                  <MButton variant="tonal" :icon="bell.has(channel.id) ? 'notifications_active' : 'notifications'" icon-pos="leading">Subscribed</MButton>
                </template>
                <MMenuItem icon="notifications_active" :selected="bell.has(channel.id)" @click="bell.add(channel.id)">All</MMenuItem>
                <MMenuItem icon="notifications_off" :selected="!bell.has(channel.id)" @click="bell.delete(channel.id)">None</MMenuItem>
                <MMenuItem icon="person_remove" @click="f.toggleSubscribe(channel.id)">Unsubscribe</MMenuItem>
              </MMenu>
            </div>

            <div class="flk-noscroll -mx-3 flex items-center gap-2 overflow-x-auto px-3 sm:mx-0 sm:ml-auto sm:px-0">
              <MButtonGroup v-model="rating" :options="ratingOptions" variant="connected" color="secondary" />
              <MButton variant="tonal" icon="share" class="shrink-0" @click="sharing = { id, at: position }">Share</MButton>
              <MButton variant="tonal" icon="playlist_add" class="shrink-0" @click="saving = id">Save</MButton>
            </div>
          </div>

          <!-- Description -->
          <div
            class="mt-4 rounded-xl bg-surface-container p-3 text-body-medium text-on-surface"
            :class="{ 'cursor-pointer hover:bg-surface-container-high': !more }"
            @click="more = true"
          >
            <p class="text-label-large">{{ compact(video.views) }} views · {{ ago(video.date) }}</p>
            <div class="mt-1" :class="{ 'line-clamp-3': !more }">
              <p v-for="(p, i) in parts" :key="i" class="min-h-[1lh]">
                <button v-if="p.stamp" type="button" class="mr-1 cursor-pointer text-primary hover:underline" @click.stop="f.seek(p.at!)">{{ p.stamp }}</button>{{ p.text }}
              </p>
            </div>
            <button type="button" class="mt-1 cursor-pointer text-label-large" @click.stop="more = !more">{{ more ? 'Show less' : '…more' }}</button>
          </div>

          <!-- Comments: inline on wide screens, a teaser that opens a sheet on phones -->
          <Comments v-if="wide" :video-id="id" class="mt-6" />
          <button
            v-else
            type="button"
            class="mt-4 w-full cursor-pointer rounded-xl bg-surface-container p-3 text-left hover:bg-surface-container-high"
            @click="commentsOpen = true"
          >
            <p class="text-title-small text-on-surface">Comments <span class="font-normal text-on-surface-variant">{{ compact(f.commentCount(id)) }}</span></p>
            <div v-if="topComment" class="pointer-events-none mt-2 line-clamp-2">
              <CommentRow :comment="topComment" :video-id="id" small />
            </div>
          </button>
        </div>
      </div>

      <!-- Up next -->
      <aside class="flex shrink-0 flex-col gap-3 lg:w-[402px]" :class="{ 'px-3 pb-6': !wide }" aria-label="Up next">
        <div class="flex items-center justify-between">
          <h2 class="text-title-medium text-on-surface">Up next</h2>
          <MSwitch v-model="autoplay" label="Autoplay" :icon="false" />
        </div>
        <VideoCard v-for="v in next" :key="v.id" :video="v" :layout="wide ? 'compact' : 'row'" />
      </aside>
    </div>

    <MBottomSheet v-if="!wide" v-model="commentsOpen" :title="`Comments · ${compact(f.commentCount(id))}`" full-height>
      <Comments :video-id="id" :header="false" />
    </MBottomSheet>
  </div>
</template>
