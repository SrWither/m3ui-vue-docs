<script setup lang="ts">
/* One message of a conversation: collapsed to a one-line preview, or open with its body and attachments. */
import { computed } from 'vue'
import { MAvatar, MIconButton, MMenu, MMenuItem, MRelativeTime, MTooltip } from '@m3ui-vue/m3ui-vue'
import type { Message } from '../data'
import { firstName, isMe, person, plain, shortDate } from '../useMail'
import AttachmentCard from './AttachmentCard.vue'

const props = defineProps<{ message: Message; expanded: boolean }>()
const emit = defineEmits<{ toggle: []; reply: []; replyAll: []; forward: []; view: [src: string] }>()

const from = computed(() => person(props.message.from))
const recipients = computed(() => [...props.message.to, ...(props.message.cc ?? [])].map(firstName).join(', '))
const many = computed(() => props.message.to.length + (props.message.cc?.length ?? 0) > 1)
</script>

<template>
  <article class="border-b border-outline-variant/60 last:border-b-0">
    <!-- Header (the whole thing toggles when collapsed) -->
    <div
      class="flex items-start gap-3 px-4 pt-4 sm:px-6"
      :class="expanded ? 'pb-2' : 'cursor-pointer pb-4 hover:bg-surface-container-low'"
      :role="expanded ? undefined : 'button'"
      :tabindex="expanded ? undefined : 0"
      @click="!expanded && emit('toggle')"
      @keydown.enter.self="!expanded && emit('toggle')"
    >
      <MAvatar :name="from.name" :size="40" class="shrink-0" />
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline gap-2">
          <p class="min-w-0 truncate text-title-small text-on-surface" :class="{ 'cursor-pointer': expanded }" @click="expanded && emit('toggle')">
            {{ isMe(message.from) ? 'Me' : from.name }}
            <span v-if="expanded && !isMe(message.from)" class="hidden font-normal text-on-surface-variant sm:inline">&lt;{{ from.email }}&gt;</span>
          </p>
          <span class="ml-auto shrink-0 text-label-small text-on-surface-variant">
            <span class="hidden sm:inline">{{ new Date(message.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) }} (<MRelativeTime :value="message.date" locale="en" />)</span>
            <span class="sm:hidden">{{ shortDate(message.date) }}</span>
          </span>
        </div>
        <p v-if="expanded" class="truncate text-body-small text-on-surface-variant">to {{ recipients }}</p>
        <p v-else class="truncate text-body-medium text-on-surface-variant">{{ plain(message.html) }}</p>
      </div>
      <div v-if="expanded" class="-mt-1 -mr-2 flex shrink-0">
        <MTooltip text="Reply"><MIconButton icon="reply" label="Reply" size="xs" @click="emit('reply')" /></MTooltip>
        <MMenu align="right">
          <template #trigger>
            <MIconButton icon="more_vert" label="More" size="xs" />
          </template>
          <MMenuItem icon="reply" @click="emit('reply')">Reply</MMenuItem>
          <MMenuItem v-if="many" icon="reply_all" @click="emit('replyAll')">Reply all</MMenuItem>
          <MMenuItem icon="forward" @click="emit('forward')">Forward</MMenuItem>
        </MMenu>
      </div>
    </div>

    <div v-if="expanded" class="px-4 pb-5 sm:pr-6 sm:pl-[4.5rem]">
      <div class="m3x-body text-body-large text-on-surface" v-html="message.html" />
      <div v-if="message.attachments?.length" class="mt-4">
        <p class="mb-2 text-label-medium text-on-surface-variant">{{ message.attachments.length }} attachment{{ message.attachments.length > 1 ? 's' : '' }}</p>
        <div class="flex flex-wrap gap-2">
          <AttachmentCard v-for="a in message.attachments" :key="a.name" :file="a" @view="a.src && emit('view', a.src)" />
        </div>
      </div>
    </div>
  </article>
</template>
