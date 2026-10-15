<script setup lang="ts">
/*
 * One post: author, text, photos or a poll, and the actions (reply, repost, like with a pop,
 * views, bookmark, share). Clicking it opens the post; `detail` shows it bigger, with the full date.
 */
import { computed, ref } from 'vue'
import { MAvatar, MIcon, MMenu, MMenuDivider, MMenuItem, MRelativeTime, MTooltip, useToast } from '@m3ui-vue/m3ui-vue'
import { compact, me, person } from '../data'
import { usePlaza } from '../usePlaza'
import RichText from './RichText.vue'
import PostPhotos from './PostPhotos.vue'
import PollView from './PollView.vue'

const props = defineProps<{ id: string; detail?: boolean; thread?: boolean }>()
const emit = defineEmits<{ hide: [] }>()
const { post, go, liked, reposted, bookmarked, toggleLike, toggleRepost, toggleBookmark, count, composer, following, toggleFollow } = usePlaza()
const toast = useToast()

const p = computed(() => post(props.id))
const author = computed(() => person(p.value.author))
const isLiked = computed(() => liked.has(props.id))
const pop = ref(0)
function like() {
  if (!isLiked.value) pop.value++
  toggleLike(props.id)
}
const likeFromPhoto = () => !isLiked.value && like()
const open = () => !props.detail && go({ name: 'post', id: props.id })
const profile = () => go({ name: 'profile', handle: p.value.author })
const share = () => {
  void navigator.clipboard?.writeText(`${location.origin}/examples/feed`)
  toast.success('Link copied to clipboard', { icon: 'link' })
}
const fullDate = computed(() => new Date(p.value.date).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric' }))
</script>

<template>
  <article
    class="flex gap-3 px-4 pt-3 outline-none"
    :class="[detail ? 'pb-1' : 'cursor-pointer pb-2 transition-colors hover:bg-on-surface/[0.03] focus-visible:bg-on-surface/[0.05]', { 'border-b border-outline-variant/60': !thread }]"
    :tabindex="detail ? undefined : 0"
    @click="open"
    @keydown.enter.self="open"
  >
    <div v-if="!detail" class="flex shrink-0 flex-col items-center">
      <button type="button" class="cursor-pointer rounded-full" :aria-label="author.name" @click.stop="profile"><MAvatar :name="author.name" :size="44" /></button>
      <span v-if="thread" class="mt-1 w-0.5 flex-1 rounded-full bg-outline-variant" />
    </div>

    <div class="min-w-0 flex-1">
      <header class="flex items-center gap-1">
        <button v-if="detail" type="button" class="mr-2 cursor-pointer rounded-full" :aria-label="author.name" @click.stop="profile"><MAvatar :name="author.name" :size="44" /></button>
        <div class="flex min-w-0 flex-1 gap-1" :class="detail ? 'flex-col gap-0' : 'items-baseline'">
          <button type="button" class="flex min-w-0 cursor-pointer items-center gap-1 text-title-small text-on-surface hover:underline" @click.stop="profile">
            <span class="truncate">{{ author.name }}</span>
            <MIcon v-if="author.verified" name="verified" :size="16" class="m3p-fill shrink-0 text-primary" />
          </button>
          <span class="truncate text-body-medium text-on-surface-variant">@{{ author.handle }}<template v-if="!detail"> · <MRelativeTime :value="p.date" locale="en" /></template></span>
        </div>
        <span class="flex" @click.stop>
        <MMenu align="right">
          <template #trigger>
            <button type="button" class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-on-surface-variant hover:bg-primary/10 hover:text-primary" aria-label="More">
              <MIcon name="more_horiz" :size="20" />
            </button>
          </template>
          <template v-if="p.author !== me.handle">
            <MMenuItem :icon="following.has(p.author) ? 'person_remove' : 'person_add'" @click="toggleFollow(p.author)">{{ following.has(p.author) ? 'Unfollow' : 'Follow' }} @{{ p.author }}</MMenuItem>
            <MMenuItem icon="sentiment_dissatisfied" @click="emit('hide'); toast.info('Got it, you’ll see fewer posts like this', { icon: 'visibility_off' })">Not interested</MMenuItem>
            <MMenuDivider />
          </template>
          <MMenuItem icon="link" @click="share">Copy link</MMenuItem>
          <MMenuItem v-if="p.author !== me.handle" icon="flag" danger @click="toast.info('Thanks, we’ll take a look', { icon: 'flag' })">Report post</MMenuItem>
        </MMenu>
        </span>
      </header>

      <p v-if="p.replyTo && !thread" class="text-body-medium text-on-surface-variant">
        Replying to <button type="button" class="cursor-pointer text-primary hover:underline" @click.stop="go({ name: 'post', id: p.replyTo })">@{{ post(p.replyTo).author }}</button>
      </p>
      <RichText :text="p.text" :class="{ 'mt-3 text-[1.0625rem]': detail }" />
      <PostPhotos v-if="p.photos.length" :photos="p.photos" @like="likeFromPhoto" />
      <PollView v-if="p.poll" :id="id" />

      <p v-if="detail" class="mt-3 border-b border-outline-variant/60 pb-3 text-body-medium text-on-surface-variant">
        {{ fullDate }} · <strong class="text-on-surface">{{ compact(p.views) }}</strong> views
      </p>

      <!-- Actions -->
      <div class="-ml-2 flex items-center justify-between py-1 text-label-medium text-on-surface-variant" :class="{ 'max-w-md': !detail }" @click.stop>
        <MTooltip text="Reply">
          <button type="button" class="m3p-action hover:text-primary" aria-label="Reply" @click="composer = { open: true, replyTo: id }">
            <span class="m3p-dot hover:bg-primary/10"><MIcon name="chat_bubble" :size="18" /></span>{{ count(id, 'replies') ? compact(count(id, 'replies')) : '' }}
          </button>
        </MTooltip>
        <MTooltip :text="reposted.has(id) ? 'Undo repost' : 'Repost'">
          <button type="button" class="m3p-action hover:text-success" :class="{ 'text-success': reposted.has(id) }" :aria-pressed="reposted.has(id)" aria-label="Repost" @click="toggleRepost(id)">
            <span class="m3p-dot hover:bg-success/10"><MIcon name="repeat" :size="18" /></span>{{ count(id, 'reposts') ? compact(count(id, 'reposts')) : '' }}
          </button>
        </MTooltip>
        <MTooltip :text="isLiked ? 'Unlike' : 'Like'">
          <button type="button" class="m3p-action hover:text-error" :class="{ 'text-error': isLiked }" :aria-pressed="isLiked" aria-label="Like" @click="like">
            <span class="m3p-dot hover:bg-error/10"><MIcon :key="pop" name="favorite" :size="18" :class="{ 'm3p-fill m3p-like': isLiked }" /></span>{{ count(id, 'likes') ? compact(count(id, 'likes')) : '' }}
          </button>
        </MTooltip>
        <span v-if="!detail" class="m3p-action cursor-default" :title="`${p.views} views`"><span class="m3p-dot"><MIcon name="bar_chart" :size="18" /></span>{{ compact(p.views) }}</span>
        <span class="flex">
          <MTooltip :text="bookmarked.has(id) ? 'Remove bookmark' : 'Bookmark'">
            <button type="button" class="m3p-action hover:text-primary" :class="{ 'text-primary': bookmarked.has(id) }" :aria-pressed="bookmarked.has(id)" aria-label="Bookmark" @click="toggleBookmark(id)">
              <span class="m3p-dot hover:bg-primary/10"><MIcon name="bookmark" :size="18" :class="{ 'm3p-fill': bookmarked.has(id) }" /></span>
            </button>
          </MTooltip>
          <MTooltip text="Share">
            <button type="button" class="m3p-action hover:text-primary" aria-label="Share" @click="share"><span class="m3p-dot hover:bg-primary/10"><MIcon name="ios_share" :size="18" /></span></button>
          </MTooltip>
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.m3p-action {
  display: inline-flex;
  min-width: 3.5rem;
  cursor: pointer;
  align-items: center;
  gap: 0.125rem;
  transition: color 150ms;
}
.m3p-dot {
  display: inline-flex;
  height: 2.25rem;
  width: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  transition: background-color 150ms;
}
.m3p-like {
  animation: m3p-like 450ms cubic-bezier(0.2, 0, 0, 1);
}
@keyframes m3p-like {
  0% { transform: scale(0.6); }
  50% { transform: scale(1.35); }
  100% { transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .m3p-like { animation: none; }
}
</style>
