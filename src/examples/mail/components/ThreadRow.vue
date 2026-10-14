<script setup lang="ts">
/*
 * One conversation in the list.
 * - Wide screens: one line like a desktop mail client (checkbox, star, sender, subject and
 *   snippet, date), with archive / delete / read buttons in place of the date on hover.
 * - Phones: avatar, sender, subject and snippet. The avatar turns into a checkbox once
 *   something is selected; a long press selects, a swipe archives (or deletes, to the left).
 */
import { computed, ref } from 'vue'
import { MAvatar, MCheckbox, MIcon, MIconButton, MTooltip } from '@m3ui-vue/m3ui-vue'
import type { Thread } from '../data'
import { firstName, isMe, person, plain, shortDate, useMail } from '../useMail'
import LabelPill from './LabelPill.vue'

const props = defineProps<{ thread: Thread; wide: boolean }>()
const { selected, open, toggleStar, archive, remove, markRead } = useMail()

const isSelected = computed(() => selected.value.includes(props.thread.id))
const selecting = computed(() => selected.value.length > 0)
const last = computed(() => props.thread.messages.at(-1)!)
const sender = computed(() => person(props.thread.messages.find((m) => !isMe(m.from))?.from ?? last.value.from))
const people = computed(() => {
  const names = [...new Set(props.thread.messages.map((m) => m.from))].map(firstName)
  const s = names.length > 2 ? `${names[0]} … ${names.slice(-2).join(', ')}` : names.join(', ')
  return props.thread.messages.length > 1 ? `${s} ${props.thread.messages.length}` : s
})
const attachments = computed(() => props.thread.messages.some((m) => m.attachments?.length))

function toggleSelect() {
  const id = props.thread.id
  selected.value = isSelected.value ? selected.value.filter((x) => x !== id) : [...selected.value, id]
}
function onClick() {
  if (suppressClick) return
  if (selecting.value && !props.wide) toggleSelect()
  else open(props.thread.id)
}

// Touch gestures: horizontal swipe to archive/delete, long press to select.
const dx = ref(0)
let startX = 0
let startY = 0
let swiping = false
let tracking = false
let press: number | undefined
let suppressClick = false

function onPointerDown(e: PointerEvent) {
  if (e.pointerType !== 'touch') return
  tracking = true
  swiping = false
  suppressClick = false
  startX = e.clientX
  startY = e.clientY
  press = window.setTimeout(() => {
    tracking = false
    suppressClick = true
    navigator.vibrate?.(10)
    toggleSelect()
  }, 450)
}
function onPointerMove(e: PointerEvent) {
  if (!tracking) return
  const x = e.clientX - startX
  const y = e.clientY - startY
  if (!swiping) {
    if (Math.abs(y) > 10) return cancel()
    if (Math.abs(x) > 12) {
      swiping = true
      clearTimeout(press)
    }
  }
  if (swiping) dx.value = x
}
function onPointerUp() {
  clearTimeout(press)
  if (swiping) {
    suppressClick = true
    const w = (row.value?.offsetWidth ?? 320) * 0.35
    if (Math.abs(dx.value) > w) {
      const id = props.thread.id
      dx.value = Math.sign(dx.value) * (row.value?.offsetWidth ?? 320)
      setTimeout(() => (dx.value > 0 ? archive([id]) : remove([id])), 160)
      return
    }
  }
  cancel()
}
function cancel() {
  clearTimeout(press)
  tracking = false
  swiping = false
  dx.value = 0
}
const row = ref<HTMLElement>()
</script>

<template>
  <!-- Wide screens: a single line -->
  <div
    v-if="wide"
    role="button"
    tabindex="0"
    class="group relative flex h-11 cursor-pointer items-center gap-1 border-b border-outline-variant/40 pr-5 pl-3 outline-none hover:z-10 hover:shadow-elevation-1 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
    :class="isSelected ? 'bg-secondary-container' : thread.unread ? 'bg-surface' : 'bg-surface-container-low'"
    @click="open(thread.id)"
    @keydown.enter.self="open(thread.id)"
    @keydown.x.self="toggleSelect"
  >
    <span class="flex shrink-0" @click.stop>
      <MCheckbox :model-value="isSelected" :aria-label="`Select ${thread.subject}`" @update:model-value="toggleSelect" />
    </span>
    <MIconButton icon="star" :label="thread.starred ? 'Unstar' : 'Star'" size="xs" class="shrink-0" :class="thread.starred ? 'm3x-fill text-[#f4b400]!' : ''" @click.stop="toggleStar(thread.id)" />
    <span class="flex w-5 shrink-0 justify-center">
      <MIcon v-if="thread.important" name="label_important" :size="18" class="m3x-fill text-tertiary" />
    </span>
    <span class="w-44 shrink-0 truncate pl-1 text-body-medium text-on-surface xl:w-56" :class="{ 'font-bold': thread.unread }">{{ people }}</span>
    <span class="flex min-w-0 flex-1 items-center gap-1.5 pl-2">
      <LabelPill v-for="l in thread.labels" :key="l" :id="l" />
      <span class="min-w-0 truncate text-body-medium">
        <span class="text-on-surface" :class="{ 'font-bold': thread.unread }">{{ thread.subject }}</span>
        <span class="text-on-surface-variant"> – {{ plain(last.html) }}</span>
      </span>
    </span>
    <MIcon v-if="attachments" name="attach_file" :size="18" class="shrink-0 text-on-surface-variant" />
    <span class="w-20 shrink-0 text-right text-label-medium group-hover:hidden group-focus-within:hidden" :class="thread.unread ? 'font-bold text-on-surface' : 'text-on-surface-variant'">{{ shortDate(last.date) }}</span>
    <span class="hidden shrink-0 items-center group-hover:flex group-focus-within:flex" @click.stop>
      <template v-if="thread.folder === 'inbox'">
        <MTooltip text="Archive"><MIconButton icon="archive" label="Archive" size="xs" @click="archive([thread.id])" /></MTooltip>
      </template>
      <MTooltip text="Delete"><MIconButton icon="delete" label="Delete" size="xs" @click="remove([thread.id])" /></MTooltip>
      <MTooltip :text="thread.unread ? 'Mark as read' : 'Mark as unread'">
        <MIconButton :icon="thread.unread ? 'drafts' : 'mark_email_unread'" :label="thread.unread ? 'Mark as read' : 'Mark as unread'" size="xs" @click="markRead([thread.id], thread.unread)" />
      </MTooltip>
    </span>
  </div>

  <!-- Phones -->
  <div v-else class="relative touch-pan-y overflow-hidden">
    <!-- Revealed behind the row while swiping -->
    <div
      v-if="dx !== 0"
      class="absolute inset-0 flex items-center px-6"
      :class="dx > 0 ? 'justify-start bg-success-container text-on-success-container' : 'justify-end bg-error-container text-on-error-container'"
      aria-hidden="true"
    >
      <MIcon :name="dx > 0 ? 'archive' : 'delete'" :size="24" />
    </div>
    <div
      ref="row"
      role="button"
      tabindex="0"
      class="group relative flex cursor-pointer gap-3 px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
      :class="[
        isSelected ? 'bg-secondary-container' : thread.unread ? 'bg-surface-container-low' : 'bg-surface',
        dx === 0 ? 'transition-[transform,background-color] duration-200' : '',
      ]"
      :style="{ transform: dx ? `translateX(${dx}px)` : undefined }"
      @click="onClick"
      @keydown.enter.self="open(thread.id)"
      @keydown.x.self="toggleSelect"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="cancel"
      @contextmenu="tracking && $event.preventDefault()"
    >
      <!-- Avatar, or a check when selected -->
      <div class="relative h-10 w-10 shrink-0" @click.stop="toggleSelect">
        <MAvatar :name="sender.name" :size="40" class="transition-opacity" :class="{ 'opacity-0': isSelected }" />
        <div v-if="isSelected" class="absolute inset-0 flex items-center justify-center rounded-full bg-primary text-on-primary">
          <MIcon name="check" :size="22" />
        </div>
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-baseline gap-2">
          <span class="min-w-0 flex-1 truncate text-body-large" :class="thread.unread ? 'font-bold text-on-surface' : 'text-on-surface'">{{ people }}</span>
          <span class="shrink-0 text-label-small" :class="thread.unread ? 'font-bold text-on-surface' : 'text-on-surface-variant'">{{ shortDate(last.date) }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="min-w-0 flex-1">
            <p class="truncate text-body-medium" :class="thread.unread ? 'font-bold text-on-surface' : 'text-on-surface'">
              <MIcon v-if="thread.important" name="label_important" :size="16" class="m3x-fill mr-0.5 align-[-3px] text-tertiary" />{{ thread.subject }}
            </p>
            <p class="truncate text-body-medium text-on-surface-variant">{{ plain(last.html) }}</p>
          </div>
          <MIconButton
            icon="star"
            :label="thread.starred ? 'Unstar' : 'Star'"
            size="xs"
            class="-mr-1 shrink-0"
            :class="thread.starred ? 'm3x-fill text-[#f4b400]!' : ''"
            @click.stop="toggleStar(thread.id)"
          />
        </div>
        <div v-if="thread.labels.length || attachments" class="mt-1 flex flex-wrap items-center gap-1">
          <MIcon v-if="attachments" name="attach_file" :size="16" class="text-on-surface-variant" />
          <LabelPill v-for="l in thread.labels" :key="l" :id="l" />
        </div>
      </div>
    </div>
  </div>
</template>
