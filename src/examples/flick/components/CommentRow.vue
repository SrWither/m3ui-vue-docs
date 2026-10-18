<script setup lang="ts">
/* One comment: who and when, the text, likes, a heart from the creator, Reply and, if it's yours, Delete. */
import { computed } from 'vue'
import { MAvatar, MButton, MIcon, MIconButton, MMenu, MMenuItem } from '@m3ui-vue/m3ui-vue'
import { ago, channelById, compact, videoById, type Comment } from '../data'
import { useFlick } from '../useFlick'

const props = defineProps<{ comment: Comment; videoId: string; small?: boolean }>()
defineEmits<{ reply: []; delete: [] }>()
const { likedComments } = useFlick()
const liked = computed(() => likedComments.has(props.comment.id))
const creator = computed(() => channelById.get(videoById.get(props.videoId)!.channelId)!)
const toggleLike = () => (liked.value ? likedComments.delete(props.comment.id) : likedComments.add(props.comment.id))
</script>

<template>
  <div class="flex gap-3">
    <MAvatar :name="comment.author" :size="small ? 24 : 40" class="shrink-0" />
    <div class="min-w-0 flex-1">
      <p class="text-label-large text-on-surface">
        {{ comment.mine ? 'You' : comment.author }}
        <span class="font-normal text-on-surface-variant">· {{ ago(comment.date) }}</span>
      </p>
      <p class="mt-0.5 text-body-medium whitespace-pre-line text-on-surface">{{ comment.text }}</p>
      <div class="-ml-2 flex items-center">
        <MIconButton icon="thumb_up" :label="liked ? 'Remove like' : 'Like'" size="xs" :checked="liked" @click="toggleLike" />
        <span class="mr-1 min-w-4 text-label-medium text-on-surface-variant tabular-nums">{{ comment.likes + (liked ? 1 : 0) ? compact(comment.likes + (liked ? 1 : 0)) : '' }}</span>
        <MIconButton icon="thumb_down" label="Dislike" size="xs" />
        <span v-if="comment.hearted" class="relative mx-1.5 inline-flex" :title="`Hearted by ${creator.name}`">
          <MAvatar :name="creator.name" :size="20" />
          <MIcon name="favorite" :size="14" class="flk-fill absolute -right-1.5 -bottom-1 text-error" />
        </span>
        <MButton variant="text" size="xs" @click="$emit('reply')">Reply</MButton>
        <MMenu v-if="comment.mine" align="right" class="ml-auto">
          <template #trigger><MIconButton icon="more_vert" label="Comment actions" size="xs" /></template>
          <MMenuItem icon="delete" danger @click="$emit('delete')">Delete</MMenuItem>
        </MMenu>
      </div>
    </div>
  </div>
</template>
