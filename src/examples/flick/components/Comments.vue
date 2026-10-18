<script setup lang="ts">
/*
 * The comments under a video (and in the Shorts sheet): Top or Newest first, a box to add yours,
 * replies that fold out, and a reply box under the comment you answer.
 */
import { computed, ref } from 'vue'
import { MAvatar, MButton, MMenu, MMenuItem, MTextField } from '@m3ui-vue/m3ui-vue'
import { compact, me, type Comment } from '../data'
import { useFlick } from '../useFlick'
import CommentRow from './CommentRow.vue'

const props = defineProps<{ videoId: string; header?: boolean }>()
const { commentsOf, commentCount, addComment, deleteComment } = useFlick()

const sort = ref<'top' | 'new'>('top')
// Re-read after writing (commentsOf builds a new array from the reactive map).
const list = computed(() => {
  const all = commentsOf(props.videoId)
  return sort.value === 'top' ? all : [...all].sort((a, b) => b.date - a.date)
})

const draft = ref('')
const focused = ref(false)
function send() {
  if (!draft.value.trim()) return
  addComment(props.videoId, draft.value.trim())
  draft.value = ''
  focused.value = false
}

const open = ref(new Set<string>())
const toggleReplies = (id: string) => (open.value.has(id) ? open.value.delete(id) : open.value.add(id))
const replyingTo = ref<Comment | null>(null)
const replyDraft = ref('')
function startReply(c: Comment, to?: Comment) {
  replyingTo.value = c
  replyDraft.value = to ? `@${to.author.replace(/\s+/g, '')} ` : ''
}
function sendReply() {
  const c = replyingTo.value
  if (!c || !replyDraft.value.trim()) return
  addComment(props.videoId, replyDraft.value.trim(), c)
  open.value.add(c.id)
  replyingTo.value = null
  replyDraft.value = ''
}
</script>

<template>
  <section>
    <div v-if="header !== false" class="mb-4 flex items-center gap-6">
      <h2 class="text-title-large text-on-surface">{{ compact(commentCount(videoId)) }} Comments</h2>
      <MMenu align="left">
        <template #trigger><MButton variant="text" icon="sort">Sort by</MButton></template>
        <MMenuItem :selected="sort === 'top'" @click="sort = 'top'">Top comments</MMenuItem>
        <MMenuItem :selected="sort === 'new'" @click="sort = 'new'">Newest first</MMenuItem>
      </MMenu>
    </div>

    <div class="mb-6 flex gap-3">
      <MAvatar :name="me.name" :size="40" class="shrink-0" />
      <div class="min-w-0 flex-1" @focusin="focused = true">
        <MTextField v-model="draft" label="Add a comment…" multiline :rows="1" @keydown.ctrl.enter="send" />
        <div v-if="focused || draft" class="mt-2 flex justify-end gap-2">
          <MButton variant="text" @click="(draft = ''), (focused = false)">Cancel</MButton>
          <MButton :disabled="!draft.trim()" @click="send">Comment</MButton>
        </div>
      </div>
    </div>

    <ul class="flex flex-col gap-5">
      <li v-for="c in list" :key="c.id">
        <CommentRow :comment="c" :video-id="videoId" @reply="startReply(c)" @delete="deleteComment(videoId, c)" />
        <div class="ml-13">
          <div v-if="replyingTo === c" class="mt-2 flex gap-3">
            <MAvatar :name="me.name" :size="24" class="mt-3 shrink-0" />
            <div class="min-w-0 flex-1">
              <MTextField v-model="replyDraft" label="Add a reply…" multiline :rows="1" @keydown.ctrl.enter="sendReply" />
              <div class="mt-2 flex justify-end gap-2">
                <MButton variant="text" @click="replyingTo = null">Cancel</MButton>
                <MButton :disabled="!replyDraft.trim()" @click="sendReply">Reply</MButton>
              </div>
            </div>
          </div>
          <template v-if="c.replies.length">
            <MButton variant="text" :icon="open.has(c.id) ? 'expand_less' : 'expand_more'" class="mt-1 -ml-3" @click="toggleReplies(c.id)">
              {{ c.replies.length }} {{ c.replies.length === 1 ? 'reply' : 'replies' }}
            </MButton>
            <ul v-if="open.has(c.id)" class="mt-2 flex flex-col gap-4">
              <li v-for="r in c.replies" :key="r.id">
                <CommentRow :comment="r" :video-id="videoId" small @reply="startReply(c, r)" @delete="deleteComment(videoId, r, c)" />
              </li>
            </ul>
          </template>
        </div>
      </li>
    </ul>
  </section>
</template>
