<script setup lang="ts">
/*
 * Writing a post or a reply: text with a character ring (MCircleProgressBar), up to four
 * photos from your device, or a poll, and an emoji button. Full screen on phones.
 */
import { computed, nextTick, ref, watch } from 'vue'
import { MAvatar, MButton, MCircleProgressBar, MDialog, MEmojiButton, MIcon, MIconButton, MTextField, MTooltip } from '@m3ui-vue/m3ui-vue'
import type { Photo } from '../art'
import { me, person } from '../data'
import { usePlaza } from '../usePlaza'

const props = defineProps<{ wide: boolean }>()
const { composer, publish, post } = usePlaza()

const LIMIT = 280
const text = ref('')
const photos = ref<Photo[]>([])
const poll = ref<string[] | null>(null)
const area = ref<HTMLTextAreaElement>()
const replyTo = computed(() => (composer.value.replyTo ? post(composer.value.replyTo) : null))

watch(
  () => composer.value.open,
  (open) => {
    if (!open) return
    text.value = ''
    photos.value = []
    poll.value = null
    nextTick(() => area.value?.focus())
  },
)

const length = computed(() => [...text.value].length)
const over = computed(() => length.value > LIMIT)
const valid = computed(() => !over.value && (text.value.trim() || photos.value.length) && (!poll.value || poll.value.filter((o) => o.trim()).length >= 2))

function grow() {
  const el = area.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

// Photos from your device: object URLs, never uploaded. Their real shape is read once loaded.
const fileInput = ref<HTMLInputElement>()
function onFiles(e: Event) {
  const input = e.target as HTMLInputElement
  for (const f of Array.from(input.files ?? []).slice(0, 4 - photos.value.length)) {
    const p = { src: URL.createObjectURL(f), alt: f.name, ratio: 4 / 3 }
    photos.value.push(p)
    const img = new Image()
    img.onload = () => (p.ratio = img.naturalWidth / img.naturalHeight)
    img.src = p.src
  }
  input.value = ''
  poll.value = null
}

function insert(emoji: string) {
  const el = area.value
  const at = el?.selectionStart ?? text.value.length
  text.value = text.value.slice(0, at) + emoji + text.value.slice(el?.selectionEnd ?? at)
  nextTick(() => {
    el?.focus()
    el?.setSelectionRange(at + emoji.length, at + emoji.length)
  })
}

function submit() {
  if (!valid.value) return
  publish(text.value.trim(), photos.value, poll.value ? poll.value.map((o) => o.trim()).filter(Boolean) : null, composer.value.replyTo)
  composer.value = { open: false }
}
</script>

<template>
  <MDialog
    :model-value="composer.open"
    :title="replyTo ? 'Reply' : 'New post'"
    :fullscreen="!wide"
    max-width="max-w-xl"
    @update:model-value="composer = { open: $event }"
  >
    <div v-if="replyTo" class="mb-3 flex gap-3">
      <div class="flex flex-col items-center">
        <MAvatar :name="person(replyTo.author).name" :size="40" />
        <span class="mt-1 w-0.5 flex-1 rounded-full bg-outline-variant" />
      </div>
      <div class="min-w-0 flex-1 pb-3">
        <p class="text-title-small text-on-surface">{{ person(replyTo.author).name }} <span class="font-normal text-on-surface-variant">@{{ replyTo.author }}</span></p>
        <p class="line-clamp-3 text-body-medium text-on-surface">{{ replyTo.text }}</p>
        <p class="mt-2 text-body-small text-on-surface-variant">Replying to <span class="text-primary">@{{ replyTo.author }}</span></p>
      </div>
    </div>

    <div class="flex gap-3">
      <MAvatar :name="me.name" :size="40" class="shrink-0" />
      <div class="min-w-0 flex-1">
        <textarea
          ref="area"
          v-model="text"
          rows="3"
          :placeholder="replyTo ? 'Post your reply' : poll ? 'Ask a question' : 'What’s happening?'"
          aria-label="Post text"
          class="block w-full resize-none bg-transparent pt-2 text-title-medium text-on-surface outline-none placeholder:text-on-surface-variant"
          @input="grow"
          @keydown.ctrl.enter="submit"
          @keydown.meta.enter="submit"
        />

        <div v-if="photos.length" class="mt-2 grid gap-2" :class="photos.length > 1 ? 'grid-cols-2' : ''">
          <div v-for="(p, i) in photos" :key="p.src" class="relative overflow-hidden rounded-xl">
            <img :src="p.src" :alt="p.alt" class="max-h-72 w-full object-cover" :class="{ 'aspect-square': photos.length > 1 }" />
            <button type="button" class="absolute top-1.5 right-1.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white" :aria-label="`Remove ${p.alt}`" @click="photos.splice(i, 1)">
              <MIcon name="close" :size="18" />
            </button>
          </div>
        </div>

        <div v-if="poll" class="mt-2 flex flex-col gap-2 rounded-xl border border-outline-variant p-3">
          <div v-for="(_, i) in poll" :key="i" class="flex items-center gap-1">
            <MTextField v-model="poll[i]!" :label="`Choice ${i + 1}${i > 1 ? ' (optional)' : ''}`" variant="outlined" class="flex-1" />
            <MIconButton v-if="poll.length > 2" icon="remove" :label="`Remove choice ${i + 1}`" size="xs" @click="poll.splice(i, 1)" />
          </div>
          <div class="flex justify-between">
            <MButton v-if="poll.length < 4" variant="text" icon="add" size="xs" @click="poll.push('')">Add a choice</MButton>
            <MButton variant="text" size="xs" class="ml-auto text-error!" @click="poll = null">Remove poll</MButton>
          </div>
        </div>
      </div>
    </div>

    <template #actions>
      <div class="flex w-full items-center gap-1">
        <MTooltip text="Photos"><MIconButton icon="image" label="Add photos" color="primary" :disabled="!!poll || photos.length >= 4" @click="fileInput?.click()" /></MTooltip>
        <MTooltip text="Poll"><MIconButton icon="ballot" label="Add a poll" color="primary" :disabled="!!poll || photos.length > 0 || !!replyTo" @click="poll = ['', '']" /></MTooltip>
        <MEmojiButton label="Add emoji" :size="24" @click="insert" />
        <span class="flex-1" />
        <!-- The ring alone, then the characters left inside it near the limit (the slot also hides
             MCircleProgressBar's own percentage label, unreadable at this size). -->
        <MCircleProgressBar
          v-if="length"
          :value="Math.min(100, (length / LIMIT) * 100)"
          variant="circle"
          :size="length > LIMIT - 20 ? 32 : 24"
          :thickness="3"
          :color="over ? 'error' : length > LIMIT - 20 ? 'tertiary' : 'primary'"
          class="transition-[width,height]"
        >
          <span v-if="length > LIMIT - 20" class="text-[11px] font-medium tabular-nums" :class="over ? 'text-error' : 'text-on-surface-variant'">{{ LIMIT - length }}</span>
          <span v-else />
        </MCircleProgressBar>
        <MButton class="ml-2" :disabled="!valid" @click="submit">{{ replyTo ? 'Reply' : 'Post' }}</MButton>
      </div>
      <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="onFiles" />
    </template>
  </MDialog>
</template>
