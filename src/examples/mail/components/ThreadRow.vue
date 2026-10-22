<script setup lang="ts">
/*
 * One conversation in the list.
 * - Wide screens: one line like a desktop mail client (checkbox, star, sender, subject and
 *   snippet, date), with archive / delete / read buttons in place of the date on hover.
 * - Phones: avatar, sender, subject and snippet. The avatar turns into a checkbox once
 *   something is selected; a long press selects, a swipe archives (or deletes, to the left) through
 *   MSwipeToDismiss.
 * No HTML comments next to the template's root (the wide row or the phone one): in dev Vue keeps them, making the
 * root a fragment that ThreadList's TransitionGroup can't animate (rows vanished and the rest jumped up).
 */
import { computed, onBeforeUnmount, ref } from 'vue'
import { MAvatar, MCheckbox, MIcon, MIconButton, MSwipeToDismiss, MTooltip } from '@m3ui-vue/m3ui-vue'
import type { SwipeToDismissValue } from '@m3ui-vue/m3ui-vue'
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

// Swiping is MSwipeToDismiss's (right archives, left deletes); a long press on touch selects. Any movement cancels
// the press, so a swipe or a scroll never selects.
let startX = 0
let startY = 0
let press: number | undefined
let suppressClick = false

function onPointerDown(e: PointerEvent) {
  if (e.pointerType !== 'touch') return
  suppressClick = false
  startX = e.clientX
  startY = e.clientY
  press = window.setTimeout(() => {
    press = undefined
    suppressClick = true
    navigator.vibrate?.(10)
    toggleSelect()
  }, 450)
}
function onPointerMove(e: PointerEvent) {
  if (press !== undefined && Math.hypot(e.clientX - startX, e.clientY - startY) > 10) cancelPress()
}
function cancelPress() {
  clearTimeout(press)
  press = undefined
}
const swipe = ref<InstanceType<typeof MSwipeToDismiss>>()
function onDismiss(direction: Exclude<SwipeToDismissValue, 'settled'>) {
  const id = props.thread.id
  if (direction === 'start-to-end') archive([id])
  else remove([id])
  // The row usually leaves the list, sliding out while the rows below move up (ThreadList's TransitionGroup); only a
  // row still here once that's over (a view that still shows it) comes back. Resetting right away slid the leaving
  // row back in over the gap, hiding the move
  resetTimer = window.setTimeout(() => swipe.value?.reset(), 400)
}
let resetTimer: number | undefined
onBeforeUnmount(() => clearTimeout(resetTimer))
</script>

<template>
  <div
    v-if="wide"
    role="button"
    tabindex="0"
    class="group relative flex h-11 cursor-pointer items-center gap-1 border-b border-outline-variant/40 pr-5 pl-3 outline-none transition-[background-color,box-shadow] duration-200 hover:z-10 hover:shadow-elevation-1 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
    :class="isSelected ? 'bg-secondary-container' : thread.unread ? 'bg-surface' : 'bg-surface-container-low'"
    @click="open(thread.id)"
    @keydown.enter.self="open(thread.id)"
    @keydown.x.self="toggleSelect"
  >
    <span class="flex shrink-0" @click.stop>
      <MCheckbox :model-value="isSelected" :aria-label="`Select ${thread.subject}`" @update:model-value="toggleSelect" />
    </span>
    <MIconButton icon="star" :label="thread.starred ? 'Unstar' : 'Star'" size="xs" class="shrink-0" :checked="thread.starred" :class="thread.starred ? 'text-[#f4b400]!' : ''" @click.stop="toggleStar(thread.id)" />
    <span class="flex w-5 shrink-0 justify-center">
      <MIcon v-if="thread.important" name="label_important" :size="18" filled class="text-tertiary" />
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

  <MSwipeToDismiss v-else ref="swipe" :disabled="selecting" @dismiss="onDismiss">
    <!-- Uncovered behind the row while swiping -->
    <template #background="{ direction }">
      <div
        v-if="direction !== 'settled'"
        class="flex flex-1 items-center px-6"
        :class="direction === 'start-to-end' ? 'justify-start bg-success-container text-on-success-container' : 'justify-end bg-error-container text-on-error-container'"
        aria-hidden="true"
      >
        <MIcon :name="direction === 'start-to-end' ? 'archive' : 'delete'" :size="24" />
      </div>
    </template>
    <div
      role="button"
      tabindex="0"
      class="group relative flex cursor-pointer gap-3 px-3 py-3 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
      :class="isSelected ? 'bg-secondary-container' : thread.unread ? 'bg-surface-container-low' : 'bg-surface'"
      @click="onClick"
      @keydown.enter.self="open(thread.id)"
      @keydown.x.self="toggleSelect"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="cancelPress"
      @pointercancel="cancelPress"
      @contextmenu="(press !== undefined || suppressClick) && $event.preventDefault()"
    >
      <!-- Avatar, or a check when selected -->
      <div class="relative h-10 w-10 shrink-0" @click.stop="toggleSelect">
        <MAvatar :name="sender.name" :size="40" class="transition-opacity duration-200" :class="{ 'opacity-0': isSelected }" />
        <!-- The check grows in over the avatar (M3's emphasized curve), and shrinks away -->
        <Transition
          enter-active-class="transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.05,0.7,0.1,1)]"
          leave-active-class="transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.3,0,0.8,0.15)]"
          enter-from-class="scale-50 opacity-0"
          leave-to-class="scale-50 opacity-0"
        >
          <div v-if="isSelected" class="absolute inset-0 flex items-center justify-center rounded-full bg-primary text-on-primary">
            <MIcon name="check" :size="22" />
          </div>
        </Transition>
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-baseline gap-2">
          <span class="min-w-0 flex-1 truncate text-body-large" :class="thread.unread ? 'font-bold text-on-surface' : 'text-on-surface'">{{ people }}</span>
          <span class="shrink-0 text-label-small" :class="thread.unread ? 'font-bold text-on-surface' : 'text-on-surface-variant'">{{ shortDate(last.date) }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="min-w-0 flex-1">
            <p class="truncate text-body-medium" :class="thread.unread ? 'font-bold text-on-surface' : 'text-on-surface'">
              <MIcon v-if="thread.important" name="label_important" :size="16" filled class="mr-0.5 align-[-3px] text-tertiary" />{{ thread.subject }}
            </p>
            <p class="truncate text-body-medium text-on-surface-variant">{{ plain(last.html) }}</p>
          </div>
          <MIconButton
            icon="star"
            :label="thread.starred ? 'Unstar' : 'Star'"
            size="xs"
            class="-mr-1 shrink-0"
            :checked="thread.starred"
            :class="thread.starred ? 'text-[#f4b400]!' : ''"
            @click.stop="toggleStar(thread.id)"
          />
        </div>
        <div v-if="thread.labels.length || attachments" class="mt-1 flex flex-wrap items-center gap-1">
          <MIcon v-if="attachments" name="attach_file" :size="16" class="text-on-surface-variant" />
          <LabelPill v-for="l in thread.labels" :key="l" :id="l" />
        </div>
      </div>
    </div>
  </MSwipeToDismiss>
</template>
