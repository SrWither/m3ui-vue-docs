<script setup lang="ts">
/* One post, big, with the post it answers above it (if any), a reply prompt and the replies. */
import { computed } from 'vue'
import { MAvatar } from '@m3ui-vue/m3ui-vue'
import { me } from '../data'
import { usePlaza } from '../usePlaza'
import AppHeader from '../components/AppHeader.vue'
import PostCard from '../components/PostCard.vue'

const props = defineProps<{ id: string }>()
const { post, repliesOf, composer } = usePlaza()
const parent = computed(() => post(props.id).replyTo)
const replies = computed(() => repliesOf(props.id))
</script>

<template>
  <div class="h-full overflow-y-auto">
    <AppHeader title="Post" back />
    <PostCard v-if="parent" :id="parent" thread />
    <PostCard :id="id" detail class="border-b border-outline-variant/60" />
    <button type="button" class="flex w-full cursor-text items-center gap-3 border-b border-outline-variant/60 px-4 py-3 text-left" @click="composer = { open: true, replyTo: id }">
      <MAvatar :name="me.name" :size="40" />
      <span class="flex-1 text-body-large text-on-surface-variant">Post your reply</span>
      <span class="rounded-full bg-primary px-4 py-2 text-label-large text-on-primary">Reply</span>
    </button>
    <PostCard v-for="r in replies" :key="r" :id="r" />
    <div class="h-24" />
  </div>
</template>
