<script setup lang="ts">
/*
 * The open conversation, in place of the list: actions along the top (fewer on phones, the rest
 * in the menu), the subject with its labels, every message (older ones collapsed), and reply /
 * forward at the bottom. Photos open in MLightbox.
 */
import { computed, ref, watch } from 'vue'
import { MButton, MIconButton, MLightbox, MMenu, MMenuDivider, MMenuItem, MTooltip } from '@m3ui-vue/m3ui-vue'
import { labels, type Thread } from '../data'
import { formatWhen, laterOptions, useMail } from '../useMail'
import DateTimeDialog from './DateTimeDialog.vue'
import LabelMenu from './LabelMenu.vue'
import LabelPill from './LabelPill.vue'
import LaterMenu from './LaterMenu.vue'
import MessageCard from './MessageCard.vue'

const props = defineProps<{ thread: Thread; wide: boolean }>()
const emit = defineEmits<{ back: [] }>()

const { list, open, archive, remove, moveToInbox, markRead, snooze, spam, toggleStar, setLabel, reply, forward, view } = useMail()

// The last message and any unread ones start open; the rest are one-line previews.
const expanded = ref(new Set<string>())
watch(
  () => [props.thread.id, props.thread.messages.length],
  () => {
    expanded.value = new Set([props.thread.messages.at(-1)!.id])
  },
  { immediate: true },
)
function toggle(id: string) {
  const s = new Set(expanded.value)
  s.has(id) ? s.delete(id) : s.add(id)
  expanded.value = s
}

const ids = computed(() => [props.thread.id])
const folder = computed(() => props.thread.folder)
const position = computed(() => list.value.findIndex((t) => t.id === props.thread.id))
const step = (d: number) => {
  const t = list.value[position.value + d]
  if (t) open(t.id)
}

// Phones: snooze and labels live in the menu.
const picking = ref(false)
const hasLabel = (l: string) => props.thread.labels.includes(l)

function markUnread() {
  markRead(ids.value, false)
  emit('back')
}

// Every image in the conversation, for the lightbox.
const photos = computed(() => props.thread.messages.flatMap((m) => (m.attachments ?? []).filter((a) => a.kind === 'image' && a.src).map((a) => ({ src: a.src!, alt: a.name, caption: a.name }))))
const viewer = ref(false)
const index = ref(0)
function showPhoto(src: string) {
  index.value = Math.max(0, photos.value.findIndex((p) => p.src === src))
  viewer.value = true
}

defineExpose({ reply: () => reply(props.thread.id) })
</script>

<template>
  <div class="flex h-full flex-col bg-surface">
    <div class="flex h-14 shrink-0 items-center gap-0.5 px-2">
      <MTooltip text="Back"><MIconButton icon="arrow_back" label="Back" @click="emit('back')" /></MTooltip>
      <MTooltip v-if="folder === 'inbox'" text="Archive"><MIconButton icon="archive" label="Archive" @click="archive(ids)" /></MTooltip>
      <MTooltip v-else text="Move to Inbox"><MIconButton icon="move_to_inbox" label="Move to Inbox" @click="moveToInbox(ids)" /></MTooltip>
      <MTooltip :text="folder === 'trash' ? 'Delete forever' : 'Delete'">
        <MIconButton :icon="folder === 'trash' ? 'delete_forever' : 'delete'" :label="folder === 'trash' ? 'Delete forever' : 'Delete'" @click="remove(ids)" />
      </MTooltip>
      <MTooltip text="Mark as unread"><MIconButton icon="mark_email_unread" label="Mark as unread" @click="markUnread" /></MTooltip>
      <template v-if="wide">
        <LaterMenu v-if="folder !== 'trash' && folder !== 'spam'" icon="schedule" label="Snooze" title="Snooze until…" align="left" @choose="snooze(ids, $event)" />
        <LabelMenu :ids="ids" />
      </template>
      <span v-if="!wide" class="flex-1" />
      <MMenu :align="wide ? 'left' : 'right'" :submenu-mode="wide ? 'flyout' : 'push'">
        <template #trigger>
          <MIconButton icon="more_vert" label="More" />
        </template>
        <template v-if="!wide">
          <MMenuItem v-if="folder !== 'trash' && folder !== 'spam'" icon="schedule">
            Snooze
            <template #children>
              <MMenuItem v-for="o in laterOptions()" :key="o.label" :icon="o.icon" @click="snooze(ids, o.at)">{{ o.label }} · {{ formatWhen(o.at).replace(/^\w+, /, '') }}</MMenuItem>
              <MMenuItem icon="calendar_month" @click="picking = true">Pick date &amp; time</MMenuItem>
            </template>
          </MMenuItem>
          <MMenuItem icon="label">
            Label as
            <template #children>
              <MMenuItem v-for="l in labels" :key="l.id" :icon="hasLabel(l.id) ? 'check_box' : 'check_box_outline_blank'" keep-open @click="setLabel(ids, l.id, !hasLabel(l.id))">{{ l.name }}</MMenuItem>
            </template>
          </MMenuItem>
          <MMenuDivider />
        </template>
        <MMenuItem :icon="thread.starred ? 'star' : 'star_outline'" @click="toggleStar(thread.id)">{{ thread.starred ? 'Remove star' : 'Add star' }}</MMenuItem>
        <MMenuItem :icon="thread.important ? 'label_important_outline' : 'label_important'" @click="thread.important = !thread.important">
          {{ thread.important ? 'Mark as not important' : 'Mark as important' }}
        </MMenuItem>
        <MMenuItem v-if="folder !== 'spam'" icon="report" @click="spam(ids)">Report spam</MMenuItem>
        <MMenuItem v-else icon="report_off" @click="moveToInbox(ids)">Not spam</MMenuItem>
      </MMenu>

      <template v-if="wide && position >= 0">
        <span class="ml-auto pr-1 text-body-small text-on-surface-variant">{{ position + 1 }} of {{ list.length }}</span>
        <MTooltip text="Newer"><MIconButton icon="chevron_left" label="Newer" :disabled="position === 0" @click="step(-1)" /></MTooltip>
        <MTooltip text="Older"><MIconButton icon="chevron_right" label="Older" :disabled="position === list.length - 1" @click="step(1)" /></MTooltip>
      </template>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <header class="flex items-start gap-2 px-4 pt-2 pb-3 sm:px-6">
        <div class="min-w-0 flex-1">
          <h1 class="text-headline-small text-on-surface">{{ thread.subject }}</h1>
          <div v-if="thread.labels.length || folder !== 'inbox'" class="mt-2 flex flex-wrap gap-1.5">
            <span v-if="folder !== 'inbox' && view !== folder" class="inline-flex h-5 items-center rounded-sm bg-surface-container-highest px-1.5 text-label-small text-on-surface-variant capitalize">{{ folder }}</span>
            <span v-for="l in thread.labels" :key="l" class="group/label inline-flex items-center">
              <LabelPill :id="l" />
              <button type="button" class="ml-0.5 hidden cursor-pointer text-label-small text-on-surface-variant group-hover/label:inline" :aria-label="`Remove label`" @click="setLabel(ids, l, false)">✕</button>
            </span>
          </div>
        </div>
        <MIconButton icon="star" :label="thread.starred ? 'Unstar' : 'Star'" :class="thread.starred ? 'm3x-fill text-[#f4b400]!' : ''" @click="toggleStar(thread.id)" />
      </header>

      <div class="mx-2 mb-4 overflow-hidden rounded-2xl bg-surface-container-lowest sm:mx-4">
        <MessageCard
          v-for="m in thread.messages"
          :key="m.id"
          :message="m"
          :expanded="expanded.has(m.id)"
          @toggle="toggle(m.id)"
          @reply="reply(thread.id)"
          @reply-all="reply(thread.id, true)"
          @forward="forward(thread.id)"
          @view="showPhoto"
        />
      </div>

      <div class="flex flex-wrap gap-2 px-4 pb-8 sm:px-6">
        <MButton variant="outlined" icon="reply" @click="reply(thread.id)">Reply</MButton>
        <MButton v-if="thread.messages.some((m) => m.to.length + (m.cc?.length ?? 0) > 1)" variant="outlined" icon="reply_all" @click="reply(thread.id, true)">Reply all</MButton>
        <MButton variant="outlined" icon="forward" @click="forward(thread.id)">Forward</MButton>
      </div>
    </div>

    <MLightbox v-model="viewer" v-model:index="index" :items="photos" show-thumbnails />
    <DateTimeDialog v-model="picking" title="Snooze until…" @choose="snooze(ids, $event)" />
  </div>
</template>
