<script setup lang="ts">
import { ref } from 'vue'
import { MDragHandle } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const dragHandleProps: PropDef[] = [
  { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'vertical is a tall capsule, for dragging sideways (between side-by-side panes); horizontal is a wide one, for dragging up and down' },
  { name: 'dragging', type: 'boolean', default: 'false', description: 'Show the dragged look while the parent is dragging' },
]

// A side panel resized with the handle
const panelWidth = ref(180)
const dragging = ref(false)
let startX = 0
let startWidth = 0
function onDown(e: PointerEvent) {
  dragging.value = true
  startX = e.clientX
  startWidth = panelWidth.value
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}
function onMove(e: PointerEvent) {
  if (!dragging.value) return
  panelWidth.value = Math.min(320, Math.max(120, startWidth + e.clientX - startX))
}
function onUp() {
  dragging.value = false
}
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MDragHandle</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Material 3's drag handle: the small capsule people drag to resize or move something, most often the divider
      between two panes. At rest it's a thin outline-colored pill; while held or dragged it grows and turns
      on-surface. It only draws the handle: the dragging is yours to implement (MSplitter uses it for its divider).
    </p>

    <ComponentDemo
      title="Orientations"
      description="Press and hold a handle to see its pressed look."
      :code="`<template>
  <MDragHandle />
  <MDragHandle orientation=&quot;horizontal&quot; />
</template>`"
    >
      <div class="flex items-center gap-12">
        <MDragHandle />
        <MDragHandle orientation="horizontal" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Resizing a Pane"
      description="Put the handle in the 24px space between two panes and pass dragging while the pointer is down."
      :code="`<template>
  <div class=&quot;flex h-56&quot;>
    <aside :style=&quot;{ width: width + 'px' }&quot;>Folders</aside>
    <div
      class=&quot;flex w-6 cursor-col-resize items-center justify-center&quot;
      style=&quot;touch-action: none&quot;
      @pointerdown=&quot;onDown&quot;
      @pointermove=&quot;onMove&quot;
      @pointerup=&quot;onUp&quot;
    >
      <MDragHandle :dragging=&quot;dragging&quot; />
    </div>
    <main class=&quot;flex-1&quot;>Messages</main>
  </div>
</template>`"
      :script="`const width = ref(180)
const dragging = ref(false)
let startX = 0
let startWidth = 0

function onDown(e: PointerEvent) {
  dragging.value = true
  startX = e.clientX
  startWidth = width.value
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}
function onMove(e: PointerEvent) {
  if (dragging.value) width.value = Math.min(320, Math.max(120, startWidth + e.clientX - startX))
}
function onUp() {
  dragging.value = false
}`"
    >
      <div class="flex h-56 w-full overflow-hidden rounded-xl bg-surface-container p-2">
        <aside class="shrink-0 rounded-lg bg-surface p-4 text-body-medium" :style="{ width: `${panelWidth}px` }">
          <p class="mb-2 text-title-small">Folders</p>
          <p class="text-on-surface-variant">Inbox</p>
          <p class="text-on-surface-variant">Archive</p>
          <p class="text-on-surface-variant">Trash</p>
        </aside>
        <div
          class="flex w-6 shrink-0 cursor-col-resize items-center justify-center"
          style="touch-action: none"
          @pointerdown="onDown"
          @pointermove="onMove"
          @pointerup="onUp"
          @pointercancel="onUp"
        >
          <MDragHandle :dragging="dragging" />
        </div>
        <main class="min-w-0 flex-1 rounded-lg bg-surface p-4 text-body-medium text-on-surface-variant">
          <p class="mb-2 text-title-small text-on-surface">Messages</p>
          Drag the handle to resize the folder pane ({{ panelWidth }}px).
        </main>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="dragHandleProps" />

    <ComponentPager current="MDragHandle" />
  </div>
</template>
