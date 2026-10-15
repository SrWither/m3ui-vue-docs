<script setup lang="ts">
/* Notifications: likes, reposts, follows, replies and mentions, unread ones highlighted until you leave. */
import { computed, onBeforeUnmount, ref } from 'vue'
import { MAvatar, MEmptyState, MIcon, MRelativeTime, MTabs } from '@m3ui-vue/m3ui-vue'
import { person, type Notification } from '../data'
import { usePlaza } from '../usePlaza'
import AppHeader from '../components/AppHeader.vue'
import RichText from '../components/RichText.vue'

const { notifications, markAllRead, go, post } = usePlaza()
onBeforeUnmount(markAllRead)

const tab = ref<'all' | 'mentions'>('all')
const list = computed(() => notifications.value.filter((n) => tab.value === 'all' || n.kind === 'mention' || n.kind === 'reply'))

const look = {
  like: { icon: 'favorite', cls: 'text-error', verb: 'liked your post' },
  repost: { icon: 'repeat', cls: 'text-success', verb: 'reposted your post' },
  follow: { icon: 'person_add', cls: 'text-primary', verb: 'followed you' },
  reply: { icon: 'chat_bubble', cls: 'text-primary', verb: 'replied to you' },
  mention: { icon: 'alternate_email', cls: 'text-tertiary', verb: 'mentioned you' },
}
const names = (n: Notification) => {
  const first = person(n.who[0]!).name
  return n.who.length === 1 ? first : n.who.length === 2 ? `${first} and ${person(n.who[1]!).name}` : `${first} and ${n.who.length - 1} others`
}
function open(n: Notification) {
  n.read = true
  if (n.postId) go({ name: 'post', id: n.postId })
  else go({ name: 'profile', handle: n.who[0]! })
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <AppHeader title="Notifications">
      <MTabs v-model="tab" :tabs="[{ value: 'all', label: 'All' }, { value: 'mentions', label: 'Mentions' }]" />
    </AppHeader>
    <button
      v-for="n in list"
      :key="n.id"
      type="button"
      class="flex w-full cursor-pointer gap-3 border-b border-outline-variant/60 px-4 py-3 text-left transition-colors hover:bg-on-surface/[0.03]"
      :class="{ 'bg-primary-container/25': !n.read }"
      @click="open(n)"
    >
      <MIcon :name="look[n.kind].icon" :size="28" class="m3p-fill w-10 shrink-0 text-center" :class="look[n.kind].cls" />
      <div class="min-w-0 flex-1">
        <div class="mb-1.5 flex -space-x-1.5">
          <MAvatar v-for="w in n.who.slice(0, 5)" :key="w" :name="person(w).name" :size="32" class="ring-2 ring-surface" />
        </div>
        <p class="text-body-medium text-on-surface">
          <strong>{{ names(n) }}</strong> {{ look[n.kind].verb }} · <span class="text-on-surface-variant"><MRelativeTime :value="n.date" locale="en" /></span>
        </p>
        <RichText v-if="n.text" :text="n.text" class="mt-1 text-on-surface-variant" />
        <p v-else-if="n.postId" class="mt-1 line-clamp-2 text-body-medium text-on-surface-variant">{{ post(n.postId).text }}</p>
      </div>
      <span v-if="!n.read" class="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
    </button>
    <MEmptyState v-if="!list.length" icon="notifications_none" title="Nothing here yet" description="When someone mentions or replies to you, you’ll find it here." />
  </div>
</template>
