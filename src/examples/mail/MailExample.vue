<script lang="ts">
let welcomed = false
</script>

<script setup lang="ts">
/*
 * Mail example: an email client built only with m3ui-vue.
 * - MailDrawer.vue       folders and labels (MNavigationDrawer: inline rail on wide screens, modal on phones)
 * - the list, or the open conversation in its place (full width, like a desktop mail client)
 * - ThreadList.vue       toolbar, bulk actions, filters, MPullToRefresh; ThreadRow.vue one line or swipeable card
 * - Reader.vue           the conversation: MessageCard.vue per message, attachments in MLightbox
 * - Composer.vue         MRichTextEditor, recipients from contacts, attachments, schedule send
 * - useMail.ts           mailbox state, actions with undo, drafts, simulated replies and new mail
 * - data.ts              contacts, labels and the starting threads
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import { useMail } from './useMail'
import TopBar from './components/TopBar.vue'
import MailDrawer from './components/MailDrawer.vue'
import ThreadList from './components/ThreadList.vue'
import Reader from './components/Reader.vue'
import Composer from './components/Composer.vue'
import ShortcutsDialog from './components/ShortcutsDialog.vue'

const mail = useMail()
const { openThread, list, composer, selected } = mail

// Top bar, inline drawer and one-line rows from 840px wide; phone layout below.
const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')

const drawerOpen = ref(wide.value)
const collapsed = ref(false)
watch(wide, (w) => (drawerOpen.value = w))

const shortcuts = ref(false)
const topBar = ref<InstanceType<typeof TopBar>>()

function back() {
  mail.showDetail.value = false
  mail.openId.value = null
}

// Gmail-style keyboard shortcuts (press ? for the list).
function onKey(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return
  const t = e.target as HTMLElement
  if (t.closest('input, textarea, select, [contenteditable], [role="dialog"]') || composer.value && !composer.value.minimized) return
  const open = openThread.value
  const ids = selected.value.length ? [...selected.value] : open ? [open.id] : []
  const at = open ? list.value.findIndex((x) => x.id === open.id) : -1
  const run: Record<string, () => void> = {
    c: () => mail.compose(),
    '/': () => topBar.value?.focus(),
    '?': () => (shortcuts.value = true),
    j: () => list.value[at + 1] && mail.open(list.value[at + 1]!.id),
    k: () => at > 0 && mail.open(list.value[at - 1]!.id),
    u: back,
    U: () => ids.length && (mail.markRead(ids, false), back()),
    e: () => ids.length && mail.archive(ids),
    '#': () => ids.length && mail.remove(ids),
    s: () => open && mail.toggleStar(open.id),
    r: () => open && mail.reply(open.id),
    a: () => open && mail.reply(open.id, true),
    f: () => open && mail.forward(open.id),
  }
  const fn = run[e.key]
  if (!fn) return
  e.preventDefault()
  fn()
}

// A first new email shows up on its own a little after you arrive (once per visit to the site).
let welcome: number | undefined
onMounted(() => {
  document.addEventListener('keydown', onKey)
  if (!welcomed) welcome = window.setTimeout(() => (welcomed = mail.deliver()), 20_000)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  clearTimeout(welcome)
})
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden text-on-surface" :class="wide ? 'bg-surface-container' : 'bg-surface'">
    <TopBar v-if="wide" ref="topBar" @menu="collapsed = !collapsed" @shortcuts="shortcuts = true" />
    <div class="flex min-h-0 flex-1">
      <MailDrawer v-model="drawerOpen" :wide="wide" :collapsed="collapsed" />
      <!-- The list stays mounted under the open conversation, so its scroll and selection survive -->
      <main class="relative min-w-0 flex-1 bg-surface" :class="{ 'mr-2 mb-2 overflow-hidden rounded-2xl': wide }">
        <ThreadList :two-pane="false" :wide="wide" class="absolute inset-0" :class="{ invisible: openThread }" :inert="!!openThread" @menu="drawerOpen = true" />
        <Transition name="m3x-open">
          <Reader v-if="openThread" :key="openThread.id" :thread="openThread" :wide="wide" class="absolute inset-0" @back="back" />
        </Transition>
      </main>
    </div>

    <Composer :wide="wide" />
    <ShortcutsDialog v-model="shortcuts" />
  </div>
</template>

<style scoped>
.m3x-open-enter-active {
  transition: opacity 200ms ease, transform 300ms cubic-bezier(0.05, 0.7, 0.1, 1);
}
.m3x-open-leave-active {
  transition: opacity 150ms ease;
}
.m3x-open-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.m3x-open-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .m3x-open-enter-active {
    transition: opacity 150ms ease;
  }
  .m3x-open-enter-from {
    transform: none;
  }
}
</style>

<style>
/* Email bodies: the same typography MRichTextEditor writes them with. */
.m3x-body > :first-child { margin-top: 0; }
.m3x-body p { margin: 0.5em 0; }
.m3x-body h1, .m3x-body h2, .m3x-body h3 { font-weight: 600; margin: 0.75em 0 0.25em; }
.m3x-body h1 { font-size: var(--text-headline-medium); line-height: var(--text-headline-medium--line-height); }
.m3x-body h2 { font-size: var(--text-headline-small); line-height: var(--text-headline-small--line-height); }
.m3x-body h3 { font-size: var(--text-title-large); line-height: var(--text-title-large--line-height); }
.m3x-body ul { list-style-type: disc; padding-left: 1.5em; margin: 0.5em 0; }
.m3x-body ol { list-style-type: decimal; padding-left: 1.5em; margin: 0.5em 0; }
.m3x-body blockquote { border-left: 3px solid var(--color-outline-variant); padding-left: 1em; margin: 0.75em 0; color: var(--color-on-surface-variant); }
.m3x-body code { background: var(--color-surface-container-highest); padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.875em; }
.m3x-body a { color: var(--color-primary); text-decoration: underline; }
.m3x-body mark { background: var(--color-tertiary-container); color: var(--color-on-tertiary-container); padding: 0.1em 0.2em; border-radius: 2px; }
.m3x-body img { max-width: 100%; height: auto; border-radius: 8px; }
</style>
