<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { MAvatar, MChatBubble, MIcon, MIconButton, MLightbox, MMenu, MMenuItem, MRelativeTime, useToast } from '@m3ui-vue/m3ui-vue'
import { useChat, clock, type Message } from '../useChat'
import Composer from './Composer.vue'
import VoiceNote from './VoiceNote.vue'

defineProps<{ twoPane: boolean }>()
defineEmits<{ back: [] }>()

const { selected, clearChat } = useChat()
const chat = computed(() => selected.value!)
const toast = useToast()

// Status line: what they're doing, else online / last seen.
const status = computed(() => {
  const a = chat.value.activity
  if (a) return `${chat.value.group ? `${a.who} is ` : ''}${a.kind === 'audio' ? 'recording audio…' : 'typing…'}`
  if (chat.value.group) return chat.value.members!.join(', ')
  return chat.value.online ? 'online' : null
})

// Day separators between messages from different days.
function dayLabel(at: number) {
  const d = new Date(at).toDateString()
  const today = new Date()
  const yesterday = new Date(today.getTime() - 86_400_000)
  if (d === today.toDateString()) return 'Today'
  if (d === yesterday.toDateString()) return 'Yesterday'
  return new Date(at).toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })
}
const rows = computed(() => {
  const out: ({ kind: 'day'; label: string; key: string } | { kind: 'msg'; msg: Message; key: number; first: boolean })[] = []
  let lastDay = ''
  let lastFrom = ''
  for (const msg of chat.value.messages) {
    const day = new Date(msg.at).toDateString()
    if (day !== lastDay) {
      out.push({ kind: 'day', label: dayLabel(msg.at), key: day })
      lastDay = day
      lastFrom = ''
    }
    // Only the first bubble of a run from the same person gets the tail, avatar and name.
    out.push({ kind: 'msg', msg, key: msg.id, first: msg.from !== lastFrom })
    lastFrom = msg.from
  }
  return out
})

// Photos open in the lightbox, browsing every photo in the chat.
const photos = computed(() => chat.value.messages.filter((x) => x.image))
const lightbox = ref(false)
const lightboxIndex = ref(0)
function openPhoto(msg: Message) {
  lightboxIndex.value = photos.value.indexOf(msg)
  lightbox.value = true
}

// Stick to the bottom as messages arrive, unless the user scrolled up to read.
const scroller = ref<HTMLElement>()
let pinned = true
function onScroll() {
  const el = scroller.value!
  pinned = el.scrollHeight - el.scrollTop - el.clientHeight < 80
}
async function toBottom(smooth = true) {
  await nextTick()
  scroller.value?.scrollTo({ top: scroller.value.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
}
watch(() => [chat.value.messages.length, chat.value.activity], () => pinned && toBottom())
onMounted(() => toBottom(false))
function onSent() {
  pinned = true
  toBottom()
}
</script>

<template>
  <section class="flex h-full flex-col overflow-hidden bg-surface-container-low" :class="twoPane && 'my-3 mr-3 h-[calc(100%-1.5rem)] rounded-3xl'">
    <!-- Header -->
    <header class="flex h-16 shrink-0 items-center gap-2 bg-surface-container px-2">
      <MIconButton v-if="!twoPane" icon="arrow_back" label="Back to chats" @click="$emit('back')" />
      <div class="relative ml-1 shrink-0">
        <MAvatar :name="chat.name" :size="40" />
        <span v-if="chat.online && !chat.group" class="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-success ring-2 ring-surface-container" />
      </div>
      <div class="min-w-0 flex-1 leading-tight">
        <p class="truncate text-title-medium text-on-surface">{{ chat.name }}</p>
        <p class="truncate text-body-small" :class="chat.activity ? 'text-primary' : 'text-on-surface-variant'">
          <template v-if="status">{{ status }}</template>
          <template v-else-if="chat.lastSeen">last seen <MRelativeTime :value="chat.lastSeen" /></template>
        </p>
      </div>
      <MIconButton icon="videocam" label="Video call" @click="toast.info('Calls aren’t part of this demo')" />
      <MIconButton icon="call" label="Call" @click="toast.info('Calls aren’t part of this demo')" />
      <MMenu align="right">
        <template #trigger>
          <MIconButton icon="more_vert" label="More" />
        </template>
        <MMenuItem :icon="chat.muted ? 'notifications' : 'notifications_off'" @click="chat.muted = !chat.muted">
          {{ chat.muted ? 'Unmute' : 'Mute' }}
        </MMenuItem>
        <MMenuItem :icon="chat.pinned ? 'keep_off' : 'keep'" @click="chat.pinned = !chat.pinned">
          {{ chat.pinned ? 'Unpin' : 'Pin to top' }}
        </MMenuItem>
        <MMenuItem icon="delete_sweep" danger @click="clearChat(chat.id)">Clear messages</MMenuItem>
      </MMenu>
    </header>

    <!-- Messages -->
    <div ref="scroller" class="m3c-wallpaper min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6" @scroll="onScroll">
      <div class="mx-auto flex max-w-3xl flex-col gap-1">
        <p v-if="!chat.messages.length" class="mx-auto my-8 rounded-full bg-surface-container px-4 py-1.5 text-label-medium text-on-surface-variant">
          No messages here yet. Say hi 👋
        </p>
        <template v-for="row in rows" :key="row.key">
          <div v-if="row.kind === 'day'" class="sticky top-0 z-10 my-2 flex justify-center">
            <span class="rounded-full bg-surface-container-high px-3 py-1 text-label-medium text-on-surface-variant shadow-elevation-1">{{ row.label }}</span>
          </div>
          <MChatBubble
            v-else
            :side="row.msg.from === 'me' ? 'right' : 'left'"
            :text="row.msg.text"
            :time="clock(row.msg.at)"
            :status="row.msg.status"
            :sender="chat.group && row.msg.from !== 'me' && row.first ? row.msg.from : undefined"
            :avatar="chat.group && row.msg.from !== 'me' && row.first ? row.msg.from : undefined"
            :tail="row.first"
            max-width="75%"
            :class="[row.first && 'mt-2', chat.group && row.msg.from !== 'me' && !row.first && 'ml-10']"
          >
            <button v-if="row.msg.image" type="button" class="-mx-1 -mt-1 block overflow-hidden rounded-xl" @click="openPhoto(row.msg)">
              <img :src="row.msg.image" alt="Photo" class="max-h-64 w-64 max-w-full object-cover" />
            </button>
            <VoiceNote v-else-if="row.msg.audio" :seconds="row.msg.audio" :mine="row.msg.from === 'me'" />
          </MChatBubble>
        </template>

        <!-- They're typing or recording: the bubble's own live indicator -->
        <MChatBubble
          v-if="chat.activity"
          side="left"
          :typing="chat.activity.kind"
          :sender="chat.group ? chat.activity.who : undefined"
          :avatar="chat.group ? chat.activity.who : undefined"
          class="mt-2"
        />
      </div>
    </div>

    <Composer @sent="onSent" />

    <MLightbox v-model="lightbox" v-model:index="lightboxIndex" :items="photos.map((p) => ({ src: p.image!, alt: 'Photo', caption: `${p.from === 'me' ? 'You' : p.from} · ${clock(p.at)}` }))" />
  </section>
</template>

<style scoped>
/* A faint dot pattern behind the messages, from the theme's own colors. */
.m3c-wallpaper {
  background-image: radial-gradient(color-mix(in srgb, var(--color-on-surface) 7%, transparent) 1px, transparent 1px);
  background-size: 18px 18px;
}
</style>
