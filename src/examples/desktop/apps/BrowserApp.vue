<script lang="ts">
// Module-level state: survives the window being minimized (its content unmounts while hidden),
// and starts over when the browser is closed (quit), like a real one.
import { ref, watch } from 'vue'
import { useDesktop } from '../useDesktop'

export interface Tab {
  id: number
  /** Back / forward list; 'home' is the start page, everything else an absolute URL. */
  entries: string[]
  index: number
  /** What the iframe loads; kept apart from the current entry (see load()). */
  src: string
  /** Bumped to remount the iframe for each navigation the browser starts. */
  loadId: number
  loading: boolean
  title: string
}

let nextId = 1
const newTab = (): Tab => ({ id: nextId++, entries: ['home'], index: 0, src: '', loadId: 0, loading: false, title: 'New tab' })

const tabs = ref<Tab[]>([newTab()])
const activeId = ref(tabs.value[0]!.id)

watch(useDesktop().running, (list) => {
  if (list.includes('browser')) return
  tabs.value = [newTab()]
  activeId.value = tabs.value[0]!.id
})
</script>

<script setup lang="ts">
/*
 * A web browser: one iframe per tab plus the chrome around it. What an iframe can and can't do
 * sets the rules here:
 * - Most big sites (Google, GitHub, YouTube pages…) forbid being framed (X-Frame-Options /
 *   frame-ancestors). The browser can't detect that from outside, so known ones get an
 *   explanation page with "Open in new tab" instead of a blank frame.
 * - Links clicked inside a cross-origin page can't be seen from here, so the address bar and the
 *   tab title only follow pages of this same site (the docs and the other examples).
 * - Back / forward walk each tab's own list, not the frame's history (which belongs to the whole
 *   browser tab and would also move the docs' router).
 * - Background tabs keep their iframe (hidden), so switching tabs doesn't reload them.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MButton, MIcon, MIconButton, MProgressBar, MResult } from '@m3ui-vue/m3ui-vue'

const { open, quit } = useDesktop()

const bookmarks = [
  { label: 'm3ui docs', icon: 'menu_book', url: '/' },
  { label: 'Components', icon: 'widgets', url: '/components/buttons' },
  { label: 'Plaza', icon: 'forum', url: '/examples/feed' },
  { label: 'Forge', icon: 'code', url: '/examples/forge' },
  { label: 'This desktop', icon: 'desktop_windows', url: '/examples/desktop' },
  { label: 'Wikipedia', icon: 'public', url: 'https://en.wikipedia.org/wiki/Material_Design' },
  { label: 'Map', icon: 'map', url: 'https://www.openstreetmap.org/export/embed.html?bbox=-9.2%2C38.69%2C-9.1%2C38.75&layer=mapnik' },
  { label: 'Internet Archive', icon: 'account_balance', url: 'https://archive.org' },
]

/** Sites known to refuse being shown in a frame. */
const blocked = /(^|\.)(google\.[a-z.]+|github\.com|youtube\.com|x\.com|twitter\.com|facebook\.com|instagram\.com|reddit\.com|linkedin\.com|amazon\.[a-z.]+|bing\.com|duckduckgo\.com|stackoverflow\.com|developer\.mozilla\.org|vuejs\.org)$/

const entryOf = (t: Tab) => t.entries[t.index]!
const urlOf = (e: string) => (e === 'home' ? null : new URL(e))
const isSameOrigin = (e: string) => urlOf(e)?.origin === location.origin
function isRefused(e: string) {
  const u = urlOf(e)
  if (!u || u.origin === location.origin) return false
  return blocked.test(u.hostname) && !u.pathname.startsWith('/embed/')
}
const hostOf = (e: string) => urlOf(e)!.hostname.replace(/^www\./, '')

const tab = computed(() => tabs.value.find((t) => t.id === activeId.value) ?? tabs.value[0]!)
const current = computed(() => entryOf(tab.value))
const url = computed(() => urlOf(current.value))
const sameOrigin = computed(() => isSameOrigin(current.value))
const refused = computed(() => isRefused(current.value))

/** What the address bar shows: the URL without its protocol. */
const display = (u: string) => (u === 'home' ? '' : u.replace(/^https?:\/\//, '').replace(/\/$/, ''))
const address = ref(display(current.value))
const editing = ref(false)
watch(current, (u) => {
  if (!editing.value) address.value = display(u)
})

/** Typed text → URL: a path on this site, an address, or a Wikipedia search. */
function resolve(input: string) {
  const text = input.trim()
  if (!text) return null
  if (text.startsWith('/')) return location.origin + text
  if (/^https?:\/\//i.test(text)) return text
  if (!/\s/.test(text) && /\.[a-z]{2,}(\/|$|:|\?)/i.test(text)) return 'https://' + text
  return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(text)}`
}

/** YouTube pages refuse frames, but the same video plays through its embed URL. */
function embeddable(u: string) {
  const m = u.match(/youtube\.com\/watch\?v=([\w-]+)/) ?? u.match(/youtu\.be\/([\w-]+)/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : u
}

/** Starts loading the tab's current entry. Following a link inside a same-origin page updates
 *  the entry without calling this, so the frame isn't reloaded. */
function load(t: Tab) {
  const e = entryOf(t)
  t.title = e === 'home' ? 'New tab' : hostOf(e)
  if (e === 'home' || isRefused(e)) {
    t.loading = false
    return
  }
  t.src = e
  t.loadId++
  t.loading = true
}

function push(t: Tab, entry: string) {
  t.entries = [...t.entries.slice(0, t.index + 1), entry]
  t.index++
}

function go(input: string) {
  const u = input === 'home' ? 'home' : resolve(input)
  if (!u) return
  const target = u === 'home' ? u : embeddable(u)
  const t = tab.value
  push(t, target)
  editing.value = false
  address.value = display(target)
  load(t)
}

function step(by: number) {
  tab.value.index += by
  load(tab.value)
}

function submit(e: Event) {
  go(address.value)
  ;(e.target as HTMLFormElement).querySelector('input')?.blur()
}

function openTab() {
  window.open(current.value, '_blank', 'noopener')
}

// ---- Tabs ----
const search = ref<HTMLInputElement>()
const query = ref('')

async function addTab() {
  const t = newTab()
  tabs.value.push(t)
  activeId.value = t.id
  query.value = ''
  await nextTick()
  search.value?.focus()
}

function closeTab(id: number) {
  const i = tabs.value.findIndex((t) => t.id === id)
  if (tabs.value.length === 1) return quit('browser')
  tabs.value.splice(i, 1)
  if (activeId.value === id) activeId.value = tabs.value[Math.min(i, tabs.value.length - 1)]!.id
}

const tabIcon = (t: Tab) => {
  const e = entryOf(t)
  return e === 'home' ? 'travel_explore' : isSameOrigin(e) ? 'menu_book' : isRefused(e) ? 'block' : 'public'
}

// ---- Frames ----
const frames = new Map<number, HTMLIFrameElement>()

// Same-origin pages are readable: follow their own navigation (the docs and examples are SPAs,
// so it happens with pushState, without a load event) into the back list and the tab title.
let poll = 0
function follow() {
  for (const t of tabs.value) {
    const frame = frames.get(t.id)
    if (!frame || !isSameOrigin(entryOf(t))) continue
    try {
      const href = frame.contentWindow?.location.href
      if (!href || href === 'about:blank') continue
      if (href !== entryOf(t)) push(t, href)
      t.title = frame.contentDocument?.title || hostOf(href)
    } catch {
      // Navigated away to another origin: no longer readable.
    }
  }
}

// Clicks inside a frame never reach this page, so bring the window to the front when a frame
// takes focus. And while the pointer is down on this page (dragging or resizing a window), the
// frames must not swallow the pointer events.
const shield = ref(false)
function onBlur() {
  setTimeout(() => {
    if ([...frames.values()].includes(document.activeElement as HTMLIFrameElement)) open('browser')
  })
}
const shieldOn = () => (shield.value = true)
const shieldOff = () => (shield.value = false)

onMounted(() => {
  // The window was hidden (its content unmounted): reload the open pages.
  for (const t of tabs.value) load(t)
  poll = window.setInterval(follow, 400)
  window.addEventListener('blur', onBlur)
  window.addEventListener('pointerdown', shieldOn, true)
  window.addEventListener('pointerup', shieldOff, true)
  window.addEventListener('pointercancel', shieldOff, true)
})
onBeforeUnmount(() => {
  clearInterval(poll)
  window.removeEventListener('blur', onBlur)
  window.removeEventListener('pointerdown', shieldOn, true)
  window.removeEventListener('pointerup', shieldOff, true)
  window.removeEventListener('pointercancel', shieldOff, true)
})
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Tab strip -->
    <div class="flex items-end gap-1 overflow-x-auto bg-surface-container px-2 pt-1.5">
      <div
        v-for="t in tabs"
        :key="t.id"
        class="group flex h-9 max-w-48 min-w-28 flex-1 cursor-default items-center gap-2 rounded-t-xl pr-2 pl-3"
        :class="t.id === activeId ? 'bg-surface text-on-surface' : 'text-on-surface-variant hover:bg-on-surface/8'"
        role="tab"
        :aria-selected="t.id === activeId"
        :title="t.title"
        @pointerdown="activeId = t.id"
        @auxclick.prevent="(e: MouseEvent) => e.button === 1 && closeTab(t.id)"
      >
        <MIcon :name="tabIcon(t)" :size="16" class="shrink-0" :class="t.loading && 'animate-pulse text-primary'" />
        <span class="min-w-0 flex-1 truncate text-label-large">{{ t.title }}</span>
        <MIconButton icon="close" size="xs" label="Close tab" class="shrink-0" @click.stop="closeTab(t.id)" />
      </div>
      <!-- Same height as a tab, so + lines up with the tabs' close buttons -->
      <div class="flex h-9 shrink-0 items-center">
        <MIconButton icon="add" size="xs" label="New tab" @click="addTab" />
      </div>
    </div>

    <!-- Toolbar -->
    <div class="relative flex items-center gap-1 border-b border-outline-variant/60 px-2 py-1.5">
      <MIconButton icon="arrow_back" size="xs" label="Back" :disabled="tab.index === 0" @click="step(-1)" />
      <MIconButton icon="arrow_forward" size="xs" label="Forward" :disabled="tab.index === tab.entries.length - 1" @click="step(1)" />
      <MIconButton icon="refresh" size="xs" label="Reload" :disabled="current === 'home'" @click="load(tab)" />
      <MIconButton icon="home" size="xs" label="Start page" @click="go('home')" />

      <form class="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-surface-container-high px-3" @submit.prevent="submit">
        <MIcon :name="current === 'home' ? 'search' : sameOrigin || url?.protocol === 'https:' ? 'lock' : 'public'" :size="16" class="shrink-0 text-on-surface-variant" />
        <input
          v-model="address"
          aria-label="Address"
          placeholder="Search Wikipedia or type an address"
          spellcheck="false"
          class="h-8 min-w-0 flex-1 bg-transparent text-body-medium text-on-surface outline-none placeholder:text-on-surface-variant"
          @focus="editing = true; ($event.target as HTMLInputElement).select()"
          @blur="editing = false; address = display(current)"
          @keydown.esc="($event.target as HTMLInputElement).blur()"
        />
      </form>

      <MIconButton icon="open_in_new" size="xs" label="Open in a new tab" :disabled="current === 'home'" @click="openTab" />

      <MProgressBar v-if="tab.loading" indeterminate :thickness="2" class="absolute inset-x-0 -bottom-px" />
    </div>

    <div class="relative min-h-0 flex-1">
      <!-- One frame per tab; background tabs stay loaded -->
      <template v-for="t in tabs" :key="t.id">
        <iframe
          v-if="t.src && entryOf(t) !== 'home' && !isRefused(entryOf(t))"
          v-show="t.id === activeId"
          :key="`${t.id}-${t.loadId}`"
          :ref="(el) => (el ? frames.set(t.id, el as HTMLIFrameElement) : frames.delete(t.id))"
          :src="t.src"
          title="Web page"
          allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
          class="absolute inset-0 h-full w-full bg-white"
          :class="shield && 'pointer-events-none'"
          @load="t.loading = false"
        />
      </template>

      <!-- Start page -->
      <div v-if="current === 'home'" class="absolute inset-0 flex flex-col items-center gap-6 overflow-auto px-4 py-8">
        <div class="flex items-center gap-2 text-primary">
          <MIcon name="travel_explore" :size="36" />
          <span class="text-headline-medium text-on-surface">Wander</span>
        </div>
        <form class="flex w-full max-w-md items-center gap-2 rounded-full bg-surface-container-high px-4" @submit.prevent="go(query)">
          <MIcon name="search" :size="20" class="text-on-surface-variant" />
          <input
            ref="search"
            v-model="query"
            aria-label="Search"
            placeholder="Search Wikipedia or type an address"
            class="h-11 min-w-0 flex-1 bg-transparent text-body-large text-on-surface outline-none placeholder:text-on-surface-variant"
          />
        </form>
        <div class="grid w-full max-w-md grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2">
          <button
            v-for="b in bookmarks"
            :key="b.label"
            type="button"
            class="flex flex-col items-center gap-2 rounded-2xl p-3 hover:bg-on-surface/8"
            @click="go(b.url)"
          >
            <span class="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
              <MIcon :name="b.icon" :size="22" />
            </span>
            <span class="text-center text-label-medium text-on-surface">{{ b.label }}</span>
          </button>
        </div>
        <p class="max-w-md text-center text-body-small text-on-surface-variant">
          Pages open in an iframe. Many big sites don't allow that; those open in a new tab instead.
        </p>
      </div>

      <!-- A site that refuses frames -->
      <div v-else-if="refused" class="absolute inset-0 flex items-center justify-center overflow-auto p-6">
        <MResult
          status="403"
          :title="`${hostOf(current)} won't open here`"
          description="This site doesn't allow being shown inside another page. You can still open it in a new tab."
        >
          <template #actions>
            <MButton variant="filled" icon="open_in_new" @click="openTab">Open in new tab</MButton>
            <MButton variant="text" @click="go('home')">Start page</MButton>
          </template>
        </MResult>
      </div>
    </div>
  </div>
</template>
