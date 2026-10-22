<script setup lang="ts">
import { useRouter } from 'vue-router'
import { MAvatar, MChip, MIcon, MIconButton, MMenu, MMenuDivider, MMenuItem, MSearchField, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { useChat, shortTime, duration, type Chat } from '../useChat'

defineProps<{ twoPane: boolean }>()

const router = useRouter()
const { visibleChats, selectedId, query, filter, unreadTotal, lastMessage, open } = useChat()
const { theme, cycle } = useTheme()

const filters = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'groups', label: 'Groups' },
] as const

function preview(c: Chat) {
  if (c.activity) return c.activity.kind === 'audio' ? `${c.group ? `${c.activity.who} is ` : ''}recording audio…` : `${c.group ? `${c.activity.who} is ` : ''}typing…`
  const last = lastMessage(c)
  if (!last) return 'No messages yet'
  const who = last.from === 'me' ? 'You: ' : c.group ? `${last.from}: ` : ''
  const body = last.image ? '📷 Photo' : last.audio ? `🎤 Voice message (${duration(last.audio)})` : last.text
  return who + body
}
</script>

<template>
  <div class="flex h-full flex-col bg-surface">
    <!-- Header -->
    <header class="flex h-16 shrink-0 items-center gap-1 px-4">
      <h1 class="flex-1 text-title-large text-on-surface">Chats</h1>
      <MTooltip text="Back to the docs" placement="bottom">
        <MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" />
      </MTooltip>
      <MMenu align="right">
        <template #trigger>
          <MIconButton icon="more_vert" label="More" />
        </template>
        <MMenuItem :icon="theme === 'dark' ? 'light_mode' : 'dark_mode'" @click="cycle">Theme: {{ theme }}</MMenuItem>
        <MMenuDivider />
        <a :href="exampleSource('chat')" target="_blank" rel="noopener" class="block no-underline">
          <MMenuItem icon="code">View source</MMenuItem>
        </a>
        <MMenuItem icon="menu_book" @click="router.push('/examples')">Back to the docs</MMenuItem>
      </MMenu>
    </header>

    <!-- Search -->
    <div class="px-4 pb-2">
      <MSearchField v-model="query" size="md" placeholder="Search chats and messages" />
    </div>

    <!-- Filters -->
    <div class="flex gap-2 px-4 pb-2">
      <MChip v-for="f in filters" :key="f.id" :selected="filter === f.id" @click="filter = f.id">
        {{ f.label }}<template v-if="f.id === 'unread' && unreadTotal"> · {{ unreadTotal }}</template>
      </MChip>
    </div>

    <!-- Chats -->
    <div class="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
      <button
        v-for="c in visibleChats"
        :key="c.id"
        type="button"
        class="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors"
        :class="twoPane && c.id === selectedId ? 'bg-secondary-container' : 'hover:bg-on-surface/8'"
        @click="open(c.id)"
      >
        <div class="relative shrink-0">
          <MAvatar :name="c.name" :size="48" />
          <span v-if="c.group" class="absolute -right-0.5 -bottom-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-tertiary text-on-tertiary ring-2 ring-surface">
            <MIcon name="group" :size="12" />
          </span>
          <span v-else-if="c.online" class="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full bg-success ring-2 ring-surface" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-baseline gap-2">
            <span class="flex-1 truncate text-body-large" :class="c.unread ? 'font-semibold text-on-surface' : 'text-on-surface'">{{ c.name }}</span>
            <span v-if="lastMessage(c)" class="shrink-0 text-label-small" :class="c.unread && !c.muted ? 'text-primary' : 'text-on-surface-variant'">
              {{ shortTime(lastMessage(c)!.at) }}
            </span>
          </div>
          <div class="flex items-center gap-1.5">
            <MIcon
              v-if="!c.activity && lastMessage(c)?.from === 'me'"
              :name="lastMessage(c)!.status === 'sent' ? 'check' : 'done_all'"
              :size="16"
              class="shrink-0"
              :class="lastMessage(c)!.status === 'read' ? 'text-primary' : 'text-on-surface-variant'"
            />
            <span class="flex-1 truncate text-body-medium" :class="c.activity ? 'text-primary' : 'text-on-surface-variant'">{{ preview(c) }}</span>
            <MIcon v-if="c.muted" name="notifications_off" :size="16" class="shrink-0 text-on-surface-variant" />
            <MIcon v-if="c.pinned" name="keep" :size="16" class="shrink-0 text-on-surface-variant" />
            <span
              v-if="c.unread"
              class="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-label-small font-medium"
              :class="c.muted ? 'bg-on-surface-variant/40 text-surface' : 'bg-primary text-on-primary'"
            >{{ c.unread }}</span>
          </div>
        </div>
      </button>

      <div v-if="!visibleChats.length" class="flex flex-col items-center gap-2 py-12 text-center text-on-surface-variant">
        <MIcon name="search_off" :size="36" />
        <p class="text-body-medium">No chats match</p>
      </div>
    </div>
  </div>
</template>
