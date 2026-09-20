<script setup lang="ts">
import { ref } from 'vue'
import { MPullToRefresh, MCard, MIcon, MChip } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
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
</script>

<template>
  <div>
    <h1 class="mb-2 flex items-center gap-2 text-headline-large font-medium">
      MPullToRefresh
      <MChip tone="error">Beta</MChip>
    </h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Wraps its own scrollable container and fires a refresh event when the user pulls past a threshold at
      the very top of the scroll.
    </p>

    <MCard class="mb-6 flex items-start gap-3 p-4">
      <MIcon name="science" :size="22" class="mt-0.5 shrink-0 text-error" />
      <p class="text-body-medium text-on-surface">
        <strong>This component is in beta.</strong> The gesture-detection approach it's built on is a known
        hard problem on the open mobile web (see below) and hasn't been battle-tested across devices/browsers
        yet — treat the API and behavior as subject to change, and test thoroughly on your actual target
        devices before relying on it in production.
      </p>
    </MCard>

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
      <MIcon name="warning" :size="22" class="mt-0.5 shrink-0 text-tertiary" />
      <p class="text-body-medium text-on-surface">
        The drag is implemented with Pointer Events, which works great with a mouse, in
        Electron/Capacitor-style app shells, or anywhere else there's no competing gesture layer.
        In an actual mobile browser tab, a touch drag can occasionally lose the race against the
        browser's own scroll/overscroll gesture recognition and release early — a known limitation
        of drag-based pull-to-refresh on the open mobile web, not something fully solvable from
        userspace JS. It's most reliable in a wrapped app shell or on desktop.
      </p>
    </MCard>

    <ComponentDemo
      title="Pull to refresh"
      description="Wraps its own scrollable container — scroll up past the very top (touch drag, trackpad, mouse wheel, or the scrollbar thumb all work, since it rides the container's own native scroll instead of a hand-rolled drag gesture) to fire @refresh. Try it below."
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="pullToRefreshProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="pullToRefreshEvents" />

    <ComponentPager current="MPullToRefresh" />
  </div>
</template>
