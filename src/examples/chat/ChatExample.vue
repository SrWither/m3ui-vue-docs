<script setup lang="ts">
/*
 * Chat example: a messaging app built only with m3ui-vue.
 * - MListDetail          chats and conversation side by side from 840px, one at a time below
 * - ChatList.vue         search, filters, chats with unread counts and "typing…"
 * - Conversation.vue     header, messages (MChatBubble, typing indicator), images in MLightbox
 * - Composer.vue         text, emoji (MEmojiSelector), photos, voice notes
 * - useChat.ts           shared state and the simulated replies
 */
import { MListDetail } from '@m3ui-vue/m3ui-vue'
import { useChat } from './useChat'
import ChatList from './components/ChatList.vue'
import Conversation from './components/Conversation.vue'
import EmptyConversation from './components/EmptyConversation.vue'

const { selected, showDetail } = useChat()
</script>

<template>
  <MListDetail v-model:show-detail="showDetail" class="h-dvh bg-surface text-on-surface">
    <template #list="{ twoPane }">
      <ChatList :two-pane="twoPane" />
    </template>
    <template #detail="{ twoPane, back }">
      <Conversation v-if="selected" :key="selected.id" :two-pane="twoPane" @back="back" />
      <EmptyConversation v-else />
    </template>
  </MListDetail>
</template>
