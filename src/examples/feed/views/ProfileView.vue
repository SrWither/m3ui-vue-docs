<script setup lang="ts">
/* A profile: banner, bio, follow counts and Follow (MToggleButton), then Posts / Media / Likes. */
import { computed, ref, watch } from 'vue'
import { MAvatar, MButton, MEmptyState, MIcon, MMasonry, MTabs, MToggleButton, useToast } from '@m3ui-vue/m3ui-vue'
import { compact, me, person } from '../data'
import { usePlaza } from '../usePlaza'
import AppHeader from '../components/AppHeader.vue'
import PostCard from '../components/PostCard.vue'

const props = defineProps<{ handle: string }>()
const { following, toggleFollow, followers, mine, postAt, post, liked, go } = usePlaza()
const toast = useToast()

const p = computed(() => person(props.handle))
const isMe = computed(() => props.handle === me.handle)
const tab = ref<'posts' | 'media' | 'likes'>('posts')
watch(() => props.handle, () => (tab.value = 'posts'))

// Someone else's posts: generated for them, newest first.
const seed = computed(() => [...props.handle].reduce((h, c) => h * 31 + c.charCodeAt(0), 7) % 1000)
const postsOf = computed(() => (isMe.value ? mine.value.filter((id) => !post(id).replyTo) : [...Array(12)].map((_, i) => postAt(20_000 + seed.value * 50 + i, props.handle))))
const media = computed(() => postsOf.value.filter((id) => post(id).photos.length))
const likes = computed(() => [...liked].reverse())
const tabs = computed(() => [
  { value: 'posts', label: 'Posts' },
  { value: 'media', label: 'Media' },
  ...(isMe.value ? [{ value: 'likes', label: 'Likes' }] : []),
])
</script>

<template>
  <div class="h-full overflow-y-auto">
    <AppHeader :title="p.name" :subtitle="`${postsOf.length} posts`" back />
    <img :src="p.banner" alt="" class="aspect-[3/1] w-full object-cover" />
    <div class="px-4">
      <div class="-mt-10 flex items-end justify-between gap-3 sm:-mt-14">
        <span class="rounded-full bg-surface p-1"><MAvatar :name="p.name" :size="88" class="sm:hidden" /><MAvatar :name="p.name" :size="120" class="hidden sm:inline-flex" /></span>
        <MButton v-if="isMe" variant="outlined" size="sm" @click="toast.info('Editing your profile isn’t part of this demo', { icon: 'edit' })">Edit profile</MButton>
        <MToggleButton v-else :checked="following.has(handle)" variant="filled" size="sm" @update:checked="toggleFollow(handle)">
          {{ following.has(handle) ? 'Following' : 'Follow' }}
        </MToggleButton>
      </div>
      <h2 class="mt-2 flex items-center gap-1 text-headline-small text-on-surface">{{ p.name }}<MIcon v-if="p.verified" name="verified" :size="22" filled class="text-primary" /></h2>
      <p class="text-body-medium text-on-surface-variant">@{{ p.handle }}</p>
      <p class="mt-3 text-body-large text-on-surface">{{ p.bio }}</p>
      <p class="mt-2 flex flex-wrap gap-4 text-body-medium text-on-surface-variant">
        <span class="flex items-center gap-1"><MIcon name="location_on" :size="18" />{{ p.location }}</span>
        <span class="flex items-center gap-1"><MIcon name="calendar_month" :size="18" />Joined March 2024</span>
      </p>
      <p class="mt-2 flex gap-4 text-body-medium text-on-surface-variant">
        <span><strong class="text-on-surface">{{ compact(p.following) }}</strong> Following</span>
        <span><strong class="text-on-surface">{{ compact(followers(handle)) }}</strong> Followers</span>
      </p>
    </div>
    <MTabs v-model="tab" :tabs="tabs" class="mt-3" />

    <template v-if="tab === 'posts'">
      <PostCard v-for="id in postsOf" :key="id" :id="id" />
      <MEmptyState v-if="!postsOf.length" icon="edit_note" title="No posts yet" />
    </template>
    <template v-else-if="tab === 'media'">
      <MMasonry v-if="media.length" :cols="2" :md-cols="3" gap="xs" class="p-1">
        <button v-for="id in media" :key="id" type="button" class="block w-full cursor-pointer overflow-hidden rounded-lg" :aria-label="post(id).photos[0]!.alt" @click="go({ name: 'post', id })">
          <img :src="post(id).photos[0]!.src" :alt="post(id).photos[0]!.alt" class="w-full" :style="{ aspectRatio: String(post(id).photos[0]!.ratio) }" />
        </button>
      </MMasonry>
      <MEmptyState v-else icon="photo_library" title="No photos yet" />
    </template>
    <template v-else>
      <PostCard v-for="id in likes" :key="id" :id="id" />
      <MEmptyState v-if="!likes.length" icon="favorite" title="No likes yet" description="Tap the heart on any post to show it some love." />
    </template>
  </div>
</template>
