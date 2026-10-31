<script setup lang="ts">
/*
 * Every kind of step, by category. A click (or a tap) adds one in the middle of the view; with a mouse or a stylus,
 * pressing one emits `grab` so the page can drag it onto the canvas (AutomationsExample turns it into a real node
 * as soon as it's over the canvas, so it can be dropped straight onto an edge).
 */
import { onBeforeUnmount } from 'vue'
import { MIcon } from '@m3ui-vue/m3ui-vue'
import { categories, colorOf, kinds, type Kind } from '../catalog'

const emit = defineEmits<{ pick: [kind: string]; grab: [kind: string, event: PointerEvent] }>()

const CONTAINER = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
}

// A press that turned into a drag doesn't also add the step with its click
let start: { x: number; y: number } | null = null
let moved = false
function track(e: PointerEvent) {
  if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 6) moved = true
}
function release() {
  window.removeEventListener('pointermove', track)
  start = null
}
function down(e: PointerEvent, kind: Kind) {
  moved = false
  if (e.pointerType === 'touch' || e.button !== 0) return
  start = { x: e.clientX, y: e.clientY }
  window.addEventListener('pointermove', track)
  window.addEventListener('pointerup', release, { once: true })
  emit('grab', kind.id, e)
}
function click(kind: Kind) {
  if (!moved) emit('pick', kind.id)
  moved = false
}
onBeforeUnmount(release)
</script>

<template>
  <div class="flex flex-col gap-4 p-3">
    <section v-for="c in categories" :key="c.id">
      <h3 class="px-2 pb-1 text-label-large text-on-surface-variant">{{ c.label }}</h3>
      <button
        v-for="k in kinds.filter((x) => x.category === c.id)"
        :key="k.id"
        type="button"
        class="flex w-full cursor-grab items-center gap-3 rounded-md px-2 py-2 text-left transition-colors outline-none hover:bg-on-surface/8 focus-visible:ring-2 focus-visible:ring-secondary active:cursor-grabbing"
        @pointerdown="down($event, k)"
        @click="click(k)"
      >
        <span class="flex size-9 shrink-0 items-center justify-center rounded-sm" :class="CONTAINER[colorOf(k.category)]">
          <MIcon :name="k.icon" :size="20" />
        </span>
        <span class="min-w-0">
          <span class="block text-title-small">{{ k.label }}</span>
          <span class="block truncate text-body-small text-on-surface-variant">{{ k.description }}</span>
        </span>
      </button>
    </section>
  </div>
</template>
