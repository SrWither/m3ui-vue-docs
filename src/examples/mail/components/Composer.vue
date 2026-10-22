<script setup lang="ts">
/*
 * Writing an email. On wide screens a window docked at the bottom right (minimize, maximize,
 * close), on phones the whole screen. Recipients come from your contacts (MMultiAutocomplete),
 * the body is MRichTextEditor, and Send's arrow (MSplitButton) schedules it for later.
 * Everything is saved to the draft as you type; closing keeps it in Drafts.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MIcon, MIconButton, MMultiAutocomplete, MSplitButton, MTooltip, useToast } from '@m3ui-vue/m3ui-vue'
import type { MultiSelectOption, SplitButtonItem } from '@m3ui-vue/m3ui-vue'
import { MRichTextEditor } from '@m3ui-vue/m3ui-vue/rich-text-editor'
import { contacts, type Attachment } from '../data'
import { fileSize, formatWhen, laterOptions, useMail } from '../useMail'
import DateTimeDialog from './DateTimeDialog.vue'

const props = defineProps<{ wide: boolean }>()
const { composer, draft, closeComposer, discard, send, schedule } = useMail()
const toast = useToast()

const d = computed(() => (composer.value ? draft(composer.value.draftId) : undefined))
const people: MultiSelectOption[] = contacts.filter((c) => c.id !== 'deals').map((c) => ({ label: c.name, value: c.email }))

const showCc = ref(false)
watch(() => composer.value?.draftId, () => (showCc.value = !!d.value?.cc.length), { immediate: true })

// "Saved" shows a moment after you stop typing.
const saved = ref(false)
let saveTimer: number | undefined
watch(
  () => d.value && [d.value.to, d.value.cc, d.value.subject, d.value.html, d.value.attachments.length],
  (now, before) => {
    if (!d.value || !before) return
    d.value.updated = Date.now()
    saved.value = false
    clearTimeout(saveTimer)
    saveTimer = window.setTimeout(() => (saved.value = true), 700)
  },
  { deep: true },
)

const title = computed(() => d.value?.subject.trim() || 'New message')
const fullscreen = computed(() => !props.wide || composer.value?.maximized)

function trySend() {
  if (!d.value) return
  if (!d.value.to.length && !d.value.cc.length) return toast.error('Add at least one recipient', { icon: 'person_add' })
  send(d.value.id)
}

const picking = ref(false)
const later = computed<SplitButtonItem[]>(() => [
  ...laterOptions()
    .filter((o) => o.label !== 'Later today')
    .map((o) => ({ label: `${o.label}, ${formatWhen(o.at).replace(/^\w+, /, '')}`, icon: 'schedule_send', onClick: () => scheduleAt(o.at) })),
  { label: 'Pick date & time', icon: 'calendar_month', onClick: () => (picking.value = true) },
])
function scheduleAt(at: number) {
  if (!d.value) return
  if (!d.value.to.length && !d.value.cc.length) return toast.error('Add at least one recipient', { icon: 'person_add' })
  schedule(d.value.id, at)
}

// Attachments: real files from your device; images get an object URL so they can be previewed.
const fileInput = ref<HTMLInputElement>()
function onFiles(e: Event) {
  const input = e.target as HTMLInputElement
  for (const f of Array.from(input.files ?? [])) {
    const kind: Attachment['kind'] = f.type.startsWith('image/') ? 'image' : f.type === 'application/pdf' ? 'pdf' : /zip/.test(f.type) ? 'zip' : /sheet|excel|csv/.test(f.type) ? 'sheet' : 'doc'
    d.value!.attachments.push({ name: f.name, size: f.size, kind, src: kind === 'image' ? URL.createObjectURL(f) : undefined })
  }
  input.value = ''
}
const removeFile = (i: number) => d.value!.attachments.splice(i, 1)

function onKey(e: KeyboardEvent) {
  if (!composer.value) return
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    trySend()
  }
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="m3x-compose">
      <div v-if="composer && d" class="fixed z-150" :class="fullscreen ? 'inset-0 flex items-center justify-center' : 'right-6 bottom-0'" @keydown.esc.stop="closeComposer">
        <div v-if="wide && composer.maximized" class="absolute inset-0 bg-scrim/32" @click="composer.maximized = false" />
        <section
          role="dialog"
          :aria-label="title"
          class="relative flex flex-col overflow-hidden bg-surface-container-high shadow-elevation-3"
          :class="[
            !wide ? 'h-full w-full' : composer.maximized ? 'h-[90vh] w-[min(64rem,92vw)] rounded-2xl' : composer.minimized ? 'w-72 rounded-t-xl' : 'h-[min(38rem,88vh)] w-[36rem] rounded-t-xl',
          ]"
        >
          <!-- Title bar -->
          <header
            class="flex h-12 shrink-0 items-center gap-1 pr-1 pl-4"
            :class="[wide ? 'cursor-pointer bg-surface-container-highest' : '', !wide ? 'h-14 pl-1' : '']"
            @click="wide && !composer.maximized && (composer.minimized = !composer.minimized)"
          >
            <MIconButton v-if="!wide" icon="close" label="Close" @click.stop="closeComposer" />
            <h2 class="min-w-0 flex-1 truncate text-title-small text-on-surface">{{ title }}</h2>
            <template v-if="wide">
              <MIconButton :icon="composer.minimized ? 'expand_less' : 'minimize'" :label="composer.minimized ? 'Expand' : 'Minimize'" size="xs" @click.stop="composer.minimized = !composer.minimized; composer.maximized = false" />
              <MIconButton :icon="composer.maximized ? 'close_fullscreen' : 'open_in_full'" :label="composer.maximized ? 'Exit full screen' : 'Full screen'" size="xs" @click.stop="composer.maximized = !composer.maximized; composer.minimized = false" />
              <MIconButton icon="close" label="Save & close" size="xs" @click.stop="closeComposer" />
            </template>
            <template v-else>
              <MIconButton icon="attach_file" label="Attach files" @click="fileInput?.click()" />
              <MIconButton icon="send" label="Send" class="text-primary!" @click="trySend" />
            </template>
          </header>

          <template v-if="!composer.minimized || !wide">
            <div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <div class="flex items-start gap-1 border-b border-outline-variant/60 px-2 pt-1">
                <MMultiAutocomplete v-model="d.to" :options="people" label="To" class="min-w-0 flex-1" :mode="wide ? 'docked' : 'modal'" />
                <button v-if="!showCc" type="button" class="mt-4 cursor-pointer px-2 text-label-large text-on-surface-variant hover:text-on-surface" @click="showCc = true">Cc</button>
              </div>
              <div v-if="showCc" class="border-b border-outline-variant/60 px-2 pt-1">
                <MMultiAutocomplete v-model="d.cc" :options="people" label="Cc" :mode="wide ? 'docked' : 'modal'" />
              </div>
              <input
                v-model="d.subject"
                type="text"
                placeholder="Subject"
                aria-label="Subject"
                class="h-12 shrink-0 border-b border-outline-variant/60 bg-transparent px-4 text-body-large text-on-surface outline-none placeholder:text-on-surface-variant"
              />
              <div class="flex min-h-0 flex-1 flex-col p-2">
                <MRichTextEditor v-model="d.html" placeholder="Write your message…" fill class="min-h-45 flex-1" />
              </div>
              <ul v-if="d.attachments.length" class="flex flex-wrap gap-2 px-3 pb-2">
                <li v-for="(a, i) in d.attachments" :key="a.name + i" class="flex h-9 items-center gap-2 rounded-lg bg-surface-container-highest pr-1 pl-2">
                  <img v-if="a.src" :src="a.src" alt="" class="h-6 w-6 rounded-sm object-cover" />
                  <MIcon v-else name="attach_file" :size="18" class="text-on-surface-variant" />
                  <span class="max-w-40 truncate text-label-large text-on-surface">{{ a.name }}</span>
                  <span class="text-label-small text-on-surface-variant">{{ fileSize(a.size) }}</span>
                  <MIconButton icon="close" :label="`Remove ${a.name}`" size="xs" @click="removeFile(i)" />
                </li>
              </ul>
            </div>

            <footer class="flex shrink-0 items-center gap-1 px-3 py-3">
              <MSplitButton v-if="wide" label="Send" icon="send" :items="later" @click="trySend" />
              <MTooltip v-if="wide" text="Attach files">
                <MIconButton icon="attach_file" label="Attach files" class="ml-1" @click="fileInput?.click()" />
              </MTooltip>
              <MSplitButton v-if="!wide" label="Send" icon="send" size="xs" :items="later" variant="tonal" @click="trySend" />
              <span class="ml-auto text-label-small text-on-surface-variant" aria-live="polite">{{ saved ? 'Draft saved' : '' }}</span>
              <MTooltip text="Discard draft">
                <MIconButton icon="delete" label="Discard draft" @click="discard(d.id)" />
              </MTooltip>
            </footer>
          </template>
          <input ref="fileInput" type="file" multiple class="hidden" @change="onFiles" />
        </section>
        <DateTimeDialog v-model="picking" title="Schedule send" @choose="scheduleAt" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.m3x-compose-enter-active {
  transition: transform 300ms cubic-bezier(0.05, 0.7, 0.1, 1), opacity 150ms;
}
.m3x-compose-leave-active {
  transition: transform 200ms cubic-bezier(0.3, 0, 0.8, 0.15), opacity 200ms;
}
.m3x-compose-enter-from,
.m3x-compose-leave-to {
  transform: translateY(40px);
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .m3x-compose-enter-active,
  .m3x-compose-leave-active {
    transition: opacity 150ms;
  }
  .m3x-compose-enter-from,
  .m3x-compose-leave-to {
    transform: none;
  }
}
</style>
