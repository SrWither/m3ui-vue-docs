<script setup lang="ts">
// Message composer: text (Enter sends, Shift+Enter breaks the line), emoji, photos and a
// voice note recorder. The button shows a mic while the field is empty, send otherwise.
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { MEmojiSelector, MIcon, MIconButton } from '@m3ui-vue/m3ui-vue'
import { useChat, duration } from '../useChat'

const emit = defineEmits<{ sent: [] }>()
const { send } = useChat()

const text = ref('')
const field = ref<HTMLTextAreaElement>()
const emojiOpen = ref(false)
const fileInput = ref<HTMLInputElement>()

// Grow with the text, up to about 5 lines.
function resize() {
  const el = field.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 132)}px`
}

function submit() {
  const value = text.value.trim()
  if (!value) return
  send({ text: value })
  text.value = ''
  emojiOpen.value = false
  nextTick(resize)
  emit('sent')
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault()
    submit()
  }
}

function addEmoji(emoji: string) {
  const el = field.value
  const at = el?.selectionStart ?? text.value.length
  text.value = text.value.slice(0, at) + emoji + text.value.slice(el?.selectionEnd ?? at)
  nextTick(() => {
    el?.focus()
    el?.setSelectionRange(at + emoji.length, at + emoji.length)
    resize()
  })
}

// Real images from the device, shown through object URLs (they never leave the browser).
function onFiles(e: Event) {
  const files = [...((e.target as HTMLInputElement).files ?? [])].filter((f) => f.type.startsWith('image/'))
  for (const f of files) send({ image: URL.createObjectURL(f) })
  ;(e.target as HTMLInputElement).value = ''
  if (files.length) emit('sent')
}

// Voice notes: a fake recorder with a running timer.
const recording = ref(false)
const recordSeconds = ref(0)
let recordTimer: ReturnType<typeof setInterval> | undefined
function startRecording() {
  recording.value = true
  recordSeconds.value = 0
  recordTimer = setInterval(() => recordSeconds.value++, 1000)
}
function stopRecording(keep: boolean) {
  clearInterval(recordTimer)
  recording.value = false
  if (keep) {
    send({ audio: Math.max(1, recordSeconds.value) })
    emit('sent')
  }
}
onBeforeUnmount(() => clearInterval(recordTimer))

// Close the emoji panel on outside clicks.
const root = ref<HTMLElement>()
function onDocPointer(e: PointerEvent) {
  if (emojiOpen.value && !root.value?.contains(e.target as Node)) emojiOpen.value = false
}
onMounted(() => document.addEventListener('pointerdown', onDocPointer))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocPointer))
</script>

<template>
  <footer ref="root" class="relative shrink-0 px-3 pt-1 pb-3 sm:px-6">
    <div class="relative mx-auto flex max-w-3xl items-end gap-2">
      <!-- Anchored to the centered composer (not the footer), so it opens right above the emoji button -->
      <Transition name="m3c-emoji">
        <div v-if="emojiOpen" class="absolute bottom-full left-0 z-20 mb-2 w-[min(360px,100%)] rounded-xl shadow-elevation-3">
          <MEmojiSelector :columns="8" @select="addEmoji" />
        </div>
      </Transition>

      <!-- Recording a voice note -->
      <div v-if="recording" class="flex min-h-12 flex-1 items-center gap-3 rounded-3xl bg-surface-container-high px-2">
        <MIconButton icon="delete" label="Discard voice message" @click="stopRecording(false)" />
        <span class="m3c-rec h-2.5 w-2.5 rounded-full bg-error" />
        <span class="flex-1 text-body-large tabular-nums text-on-surface">{{ duration(recordSeconds) }}</span>
        <span class="hidden text-body-small text-on-surface-variant sm:inline">Recording…</span>
      </div>

      <!-- Writing -->
      <div v-else class="flex min-h-12 flex-1 items-end rounded-3xl bg-surface-container-high px-1">
        <MIconButton
          :icon="emojiOpen ? 'keyboard' : 'mood'"
          :label="emojiOpen ? 'Hide emoji' : 'Emoji'"
          class="mb-1"
          @click="emojiOpen = !emojiOpen"
        />
        <textarea
          ref="field"
          v-model="text"
          rows="1"
          placeholder="Message"
          aria-label="Message"
          class="max-h-[132px] min-w-0 flex-1 resize-none bg-transparent py-3 text-body-large text-on-surface outline-none placeholder:text-on-surface-variant"
          @input="resize"
          @keydown="onKeydown"
        />
        <MIconButton icon="photo_camera" label="Send a photo" class="mb-1" @click="fileInput?.click()" />
        <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="onFiles" />
      </div>

      <MIconButton
        v-if="recording"
        icon="send"
        variant="filled"
        class="mb-1"
        label="Send voice message"
        @click="stopRecording(true)"
      />
      <MIconButton
        v-else-if="text.trim()"
        icon="send"
        variant="filled"
        class="mb-1"
        label="Send"
        @click="submit"
      />
      <MIconButton v-else icon="mic" variant="filled" class="mb-1" label="Record a voice message" @click="startRecording" />
    </div>
  </footer>
</template>

<style scoped>
.m3c-rec {
  animation: m3c-rec 1s ease-in-out infinite alternate;
}
@keyframes m3c-rec {
  to {
    opacity: 0.25;
  }
}
.m3c-emoji-enter-active {
  transition: opacity 150ms linear, transform 250ms cubic-bezier(0.05, 0.7, 0.1, 1);
}
.m3c-emoji-leave-active {
  transition: opacity 120ms linear, transform 150ms cubic-bezier(0.3, 0, 0.8, 0.15);
}
.m3c-emoji-enter-from,
.m3c-emoji-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
@media (prefers-reduced-motion: reduce) {
  .m3c-rec {
    animation: none;
  }
}
</style>
