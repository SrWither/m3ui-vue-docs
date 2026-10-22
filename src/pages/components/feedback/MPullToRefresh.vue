<script setup lang="ts">
import { ref } from 'vue'
import { MPullToRefresh, MCard, MIcon, MList, MListItem, MSwitch, MButton, MSegmentedButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const ptrItems = ref(Array.from({ length: 14 }, (_, i) => `Item ${i + 1}`))
const ptrRefreshing = ref(false)
function handlePullRefresh() {
  ptrRefreshing.value = true
  setTimeout(() => {
    ptrItems.value = [`New item · ${new Date().toLocaleTimeString()}`, ...ptrItems.value]
    ptrRefreshing.value = false
  }, 1500)
}

// Inbox demo
const senders = ['Ana Torres', 'Luis Gómez', 'Marta Ruiz', 'Diego Pérez', 'Sofía Lima', 'Pablo Ortiz', 'Carla Vidal', 'Jorge Molina']
const subjects = ['Weekly sync notes', 'Invoice #2048', 'Design review', 'Lunch on Friday?', 'Release checklist', 'Re: API changes', 'Trip photos', 'Contract draft']
let mailSeq = 0
function makeMail() {
  const i = mailSeq++
  return { id: i, from: senders[i % senders.length]!, subject: subjects[(i * 3) % subjects.length]! }
}
const inbox = ref(Array.from({ length: 8 }, makeMail))
const inboxRefreshing = ref(false)
function refreshInbox() {
  inboxRefreshing.value = true
  setTimeout(() => {
    inbox.value = [makeMail(), makeMail(), ...inbox.value]
    inboxRefreshing.value = false
  }, 1200)
}

// Color / size / threshold demo
const tunedItems = Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`)
const tunedRefreshing = ref(false)
const tunedCount = ref(0)
function refreshTuned() {
  tunedRefreshing.value = true
  setTimeout(() => {
    tunedCount.value++
    tunedRefreshing.value = false
  }, 1200)
}

// Disabled toggle demo
const ptrEnabled = ref(true)
const toggledRefreshing = ref(false)
const toggledLast = ref<string | null>(null)
function refreshToggled() {
  toggledRefreshing.value = true
  setTimeout(() => {
    toggledLast.value = new Date().toLocaleTimeString()
    toggledRefreshing.value = false
  }, 1000)
}

// Short content demo
const shortItems = ref(['Only item'])
const shortRefreshing = ref(false)
function refreshShort() {
  shortRefreshing.value = true
  setTimeout(() => {
    shortItems.value = [...shortItems.value, `Item ${shortItems.value.length + 1}`]
    shortRefreshing.value = false
  }, 1000)
}

// Programmatic demo
const progItems = ref(Array.from({ length: 10 }, (_, i) => `Row ${i + 1}`))
const progRefreshing = ref(false)
function refreshProg() {
  if (progRefreshing.value) return
  progRefreshing.value = true
  setTimeout(() => {
    progItems.value = [`Synced · ${new Date().toLocaleTimeString()}`, ...progItems.value]
    progRefreshing.value = false
  }, 1500)
}

// Scroll from code + KeepAlive demo
const feedTab = ref<'news' | 'saved'>('news')
const feedTabs = [{ value: 'news', label: 'News' }, { value: 'saved', label: 'Saved' }]
const feedPull = ref<InstanceType<typeof MPullToRefresh>>()
const feedRefreshing = ref(false)
function refreshFeed() {
  feedRefreshing.value = true
  setTimeout(() => (feedRefreshing.value = false), 1000)
}

const pullToRefreshProps: PropDef[] = [
  { name: 'refreshing', type: 'boolean', default: 'false', description: "Controlled loading state — set it to true in your @refresh handler and back to false once the fetch resolves; the indicator settles and releases accordingly, same pattern as MInfiniteScroll's loading prop" },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the pull gesture' },
  { name: 'threshold', type: 'number', default: '64', description: 'Pull distance in px required to trigger a refresh on release' },
  { name: 'size', type: 'number', default: '36', description: 'Indicator size in px' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error'", default: "'primary'", description: 'Indicator color' },
]

const pullToRefreshEvents: EventDef[] = [
  { name: 'refresh', description: 'Emitted when the user drags past threshold and releases. Set refreshing to true in the handler, then back to false once the fetch resolves.' },
]

const pullToRefreshSlots: SlotDef[] = [
  { name: 'default', description: 'The scrollable content. A pull starts only when it\'s scrolled to the top; otherwise touch scrolls it normally' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MPullToRefresh</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Wraps its own scrollable container and fires a refresh event when the user pulls past a threshold at
      the very top of the scroll.
    </p>

    <MCard class="mb-6 flex items-start gap-3 p-4">
      <MIcon name="info" :size="22" class="mt-0.5 shrink-0 text-primary" />
      <p class="text-body-medium text-on-surface">
        Only worth reaching for on a container that scrolls <em>on its own</em> — a panel, a list inside a
        fixed-height card, a chat pane. Mobile browsers already give you pull-to-refresh for free when the
        <strong>page itself</strong> is scrolled to the top; that native gesture only fires on the outermost
        window scroll, never inside a nested <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">overflow-y: auto</code>
        element, so this fills that gap.
      </p>
    </MCard>

    <MCard class="mb-6 flex items-start gap-3 p-4">
      <MIcon name="touch_app" :size="22" class="mt-0.5 shrink-0 text-tertiary" />
      <p class="text-body-medium text-on-surface">
        The pull is a drag at the top of the list: touch on mobile, click-and-drag with a mouse or pen.
        The mouse wheel, trackpad and scrollbar only scroll and never trigger it. On touch, the first
        movement decides the gesture: dragging down while the list is at the top becomes a pull (and the
        browser's own scroll is blocked until the finger lifts), while anything else stays a normal scroll.
      </p>
    </MCard>

    <ComponentDemo
      title="Pull to refresh"
      description="Wraps its own scrollable container. With the list at the top, drag down past the threshold and release to fire @refresh. Try it below."
      :code="`<template>
  <MPullToRefresh :refreshing=&quot;refreshing&quot; @refresh=&quot;handleRefresh&quot; class=&quot;h-64 w-full max-w-sm rounded-lg border border-outline-variant&quot;>
    <ul class=&quot;divide-y divide-outline-variant&quot;>
      <li v-for=&quot;item in items&quot; :key=&quot;item&quot; class=&quot;px-4 py-3 text-body-medium&quot;>{{ item }}</li>
    </ul>
  </MPullToRefresh>
</template>

<script setup>
const items = ref([...])
const refreshing = ref(false)
function handleRefresh() {
  refreshing.value = true
  fetchLatest().then((newItems) => {
    items.value = newItems
    refreshing.value = false
  })
}
<\/script>`"
      :script="`import { MPullToRefresh } from '@m3ui-vue/m3ui-vue'`"
    >
      <MPullToRefresh
        :refreshing="ptrRefreshing"
        @refresh="handlePullRefresh"
        class="h-64 w-full max-w-sm rounded-lg border border-outline-variant"
      >
        <ul class="divide-y divide-outline-variant">
          <li v-for="item in ptrItems" :key="item" class="px-4 py-3 text-body-medium">{{ item }}</li>
        </ul>
      </MPullToRefresh>
    </ComponentDemo>

    <ComponentDemo
      title="Inbox"
      description="A typical use: a list of MListItem inside a fixed-height pane. Each refresh prepends two new messages."
      :code="`<MPullToRefresh :refreshing=&quot;refreshing&quot; @refresh=&quot;refreshInbox&quot; class=&quot;h-80 w-full max-w-md rounded-xl bg-surface-container-low&quot;>
  <MList>
    <MListItem
      v-for=&quot;mail in inbox&quot;
      :key=&quot;mail.id&quot;
      leading=&quot;avatar&quot;
      :avatar-name=&quot;mail.from&quot;
      :title=&quot;mail.from&quot;
      :subtitle=&quot;mail.subject&quot;
    />
  </MList>
</MPullToRefresh>`"
      :script="`import { MPullToRefresh, MList, MListItem } from '@m3ui-vue/m3ui-vue'

const inbox = ref([...])
const refreshing = ref(false)
async function refreshInbox() {
  refreshing.value = true
  const fresh = await fetchNewMail()
  inbox.value = [...fresh, ...inbox.value]
  refreshing.value = false
}`"
    >
      <MPullToRefresh
        :refreshing="inboxRefreshing"
        @refresh="refreshInbox"
        class="h-80 w-full max-w-md rounded-xl bg-surface-container-low"
      >
        <MList>
          <MListItem
            v-for="mail in inbox"
            :key="mail.id"
            leading="avatar"
            :avatar-name="mail.from"
            :title="mail.from"
            :subtitle="mail.subject"
          />
        </MList>
      </MPullToRefresh>
    </ComponentDemo>

    <ComponentDemo
      title="Color, size and threshold"
      description="color picks the indicator's M3 role, size its diameter, and threshold how far you have to pull. This one needs a longer 120px pull and shows a larger tertiary indicator."
      :code="`<MPullToRefresh
  :refreshing=&quot;refreshing&quot;
  color=&quot;tertiary&quot;
  :size=&quot;48&quot;
  :threshold=&quot;120&quot;
  @refresh=&quot;onRefresh&quot;
  class=&quot;h-64 w-full max-w-sm rounded-lg border border-outline-variant&quot;
>
  ...
</MPullToRefresh>`"
    >
      <div class="flex w-full flex-col gap-2">
        <MPullToRefresh
          :refreshing="tunedRefreshing"
          color="tertiary"
          :size="48"
          :threshold="120"
          @refresh="refreshTuned"
          class="h-64 w-full max-w-sm rounded-lg border border-outline-variant"
        >
          <ul class="divide-y divide-outline-variant">
            <li v-for="item in tunedItems" :key="item" class="px-4 py-3 text-body-medium">{{ item }}</li>
          </ul>
        </MPullToRefresh>
        <span class="text-label-medium text-on-surface-variant">Refreshed {{ tunedCount }} times</span>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Disabled"
      description="disabled turns the gesture off and the container keeps scrolling normally. Toggle it and try pulling."
      :code="`<MSwitch v-model=&quot;enabled&quot; label=&quot;Pull to refresh&quot; />
<MPullToRefresh :disabled=&quot;!enabled&quot; :refreshing=&quot;refreshing&quot; @refresh=&quot;onRefresh&quot; class=&quot;h-48 ...&quot;>
  ...
</MPullToRefresh>`"
    >
      <div class="flex w-full flex-col gap-3">
        <div class="flex flex-wrap items-center gap-4">
          <MSwitch v-model="ptrEnabled" label="Pull to refresh" />
          <span class="text-label-medium text-on-surface-variant">
            {{ toggledLast ? `Last refresh: ${toggledLast}` : 'Not refreshed yet' }}
          </span>
        </div>
        <MPullToRefresh
          :disabled="!ptrEnabled"
          :refreshing="toggledRefreshing"
          @refresh="refreshToggled"
          class="h-48 w-full max-w-sm rounded-lg border border-outline-variant"
        >
          <ul class="divide-y divide-outline-variant">
            <li v-for="n in 10" :key="n" class="px-4 py-3 text-body-medium">Item {{ n }}</li>
          </ul>
        </MPullToRefresh>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Short content"
      description="The pull still works when the content doesn't fill the container and there's nothing to scroll, such as an empty or nearly empty list. Each refresh adds one item."
      :code="`<MPullToRefresh :refreshing=&quot;refreshing&quot; @refresh=&quot;onRefresh&quot; class=&quot;h-56 ...&quot;>
  <ul>...one item...</ul>
</MPullToRefresh>`"
    >
      <MPullToRefresh
        :refreshing="shortRefreshing"
        @refresh="refreshShort"
        class="h-56 w-full max-w-sm rounded-lg border border-outline-variant"
      >
        <ul class="divide-y divide-outline-variant">
          <li v-for="item in shortItems" :key="item" class="px-4 py-3 text-body-medium">{{ item }}</li>
        </ul>
      </MPullToRefresh>
    </ComponentDemo>

    <ComponentDemo
      title="Programmatic refresh"
      description="Setting refreshing to true without a drag also shows the indicator, so a refresh button and the pull gesture can share the same state. Pulling is ignored while a refresh is in progress."
      :code="`<MButton variant=&quot;tonal&quot; icon=&quot;refresh&quot; :disabled=&quot;refreshing&quot; @click=&quot;onRefresh&quot;>Sync</MButton>
<MPullToRefresh :refreshing=&quot;refreshing&quot; @refresh=&quot;onRefresh&quot; class=&quot;h-64 ...&quot;>
  ...
</MPullToRefresh>`"
    >
      <div class="flex w-full flex-col items-start gap-3">
        <MButton variant="tonal" icon="refresh" :disabled="progRefreshing" @click="refreshProg">Sync</MButton>
        <MPullToRefresh
          :refreshing="progRefreshing"
          @refresh="refreshProg"
          class="h-64 w-full max-w-sm rounded-lg border border-outline-variant"
        >
          <ul class="divide-y divide-outline-variant">
            <li v-for="item in progItems" :key="item" class="px-4 py-3 text-body-medium">{{ item }}</li>
          </ul>
        </MPullToRefresh>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Scrolling from code and KeepAlive"
      description="A template ref exposes scrollEl (the element that scrolls) and scrollTo(), e.g. for a back-to-top button or a 'new posts' pill. Inside a KeepAlive it keeps its scroll position on its own: scroll News down, switch to Saved and back."
      :code="`<MSegmentedButton v-model=&quot;tab&quot; :options=&quot;tabs&quot; />
<MButton variant=&quot;tonal&quot; icon=&quot;vertical_align_top&quot; @click=&quot;pull?.scrollTo({ top: 0, behavior: 'smooth' })&quot;>
  Back to top
</MButton>
<KeepAlive>
  <MPullToRefresh v-if=&quot;tab === 'news'&quot; key=&quot;news&quot; ref=&quot;pull&quot; ...>...</MPullToRefresh>
  <MPullToRefresh v-else key=&quot;saved&quot; ...>...</MPullToRefresh>
</KeepAlive>`"
      :script="`const pull = ref<InstanceType<typeof MPullToRefresh>>()`"
    >
      <div class="flex w-full flex-col items-start gap-3">
        <div class="flex flex-wrap items-center gap-3">
          <MSegmentedButton v-model="feedTab" :options="feedTabs" />
          <MButton
            variant="tonal"
            icon="vertical_align_top"
            :disabled="feedTab !== 'news'"
            @click="feedPull?.scrollTo({ top: 0, behavior: 'smooth' })"
          >
            Back to top
          </MButton>
        </div>
        <KeepAlive>
          <MPullToRefresh
            v-if="feedTab === 'news'"
            key="news"
            ref="feedPull"
            :refreshing="feedRefreshing"
            @refresh="refreshFeed"
            class="h-64 w-full max-w-sm rounded-lg border border-outline-variant"
          >
            <ul class="divide-y divide-outline-variant">
              <li v-for="n in 40" :key="n" class="px-4 py-3 text-body-medium">Story {{ n }}</li>
            </ul>
          </MPullToRefresh>
          <MPullToRefresh
            v-else
            key="saved"
            :refreshing="feedRefreshing"
            @refresh="refreshFeed"
            class="h-64 w-full max-w-sm rounded-lg border border-outline-variant"
          >
            <ul class="divide-y divide-outline-variant">
              <li v-for="n in 20" :key="n" class="px-4 py-3 text-body-medium">Saved {{ n }}</li>
            </ul>
          </MPullToRefresh>
        </KeepAlive>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="pullToRefreshProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="pullToRefreshEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="pullToRefreshSlots" />

    <MCard class="mt-4 border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Exposed (via template ref)</p>
      <pre class="overflow-x-auto rounded-lg bg-surface-container p-3 text-body-small"><code>scrollEl: HTMLElement           — The element that scrolls the slot's content
scrollTo(options: ScrollToOptions) — Scrolls it, like Element.scrollTo()</code></pre>
    </MCard>

    <ComponentPager current="MPullToRefresh" />
  </div>
</template>
