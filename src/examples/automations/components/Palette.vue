<script setup lang="ts">
/*
 * Every kind of step, by category. A click (or a tap) adds one in the middle of the view; pressing one with a mouse
 * or a stylus, or with a finger a short press or a sideways drag (an up/down swipe still scrolls the list), emits `grab` so the page can drag
 * it onto the canvas (AutomationsExample turns it into a real node as soon as it's over the canvas, so it can be
 * dropped straight onto an edge).
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

const LONG_PRESS = 200
// A press that turned into a drag doesn't also add the step with its click
let start: { id: number; x: number; y: number; touch: boolean; kind: string } | null = null
let moved = false
let timer: ReturnType<typeof setTimeout> | undefined
function track(e: PointerEvent) {
  if (!start || e.pointerId !== start.id) return
  const dx = e.clientX - start.x
  const dy = e.clientY - start.y
  if (Math.hypot(dx, dy) <= (start.touch ? 8 : 6)) return
  if (start.touch && timer) {
    // Before the press is long enough: sideways grabs it at once (the list only scrolls up and down), else it's a scroll
    if (Math.abs(dx) > Math.abs(dy)) grab(start.kind, e)
    else release()
  } else moved = true
}
function release() {
  clearTimeout(timer)
  timer = undefined
  window.removeEventListener('pointermove', track)
  window.removeEventListener('pointerup', release)
  window.removeEventListener('pointercancel', release)
  start = null
}
function down(e: PointerEvent, kind: Kind) {
  release()
  moved = false
  if (e.button !== 0) return
  const touch = e.pointerType === 'touch'
  start = { id: e.pointerId, x: e.clientX, y: e.clientY, touch, kind: kind.id }
  window.addEventListener('pointermove', track)
  window.addEventListener('pointerup', release)
  window.addEventListener('pointercancel', release)
  if (!touch) return emit('grab', kind.id, e)
  timer = setTimeout(() => grab(kind.id, e), LONG_PRESS)
}
function grab(kind: string, e: PointerEvent) {
  clearTimeout(timer)
  timer = undefined
  moved = true
  navigator.vibrate?.(10)
  emit('grab', kind, e)
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
        class="flex w-full cursor-grab items-center gap-3 rounded-md px-2 py-2 text-left transition-colors outline-none touch-pan-y select-none [-webkit-touch-callout:none] hover:bg-on-surface/8 focus-visible:ring-2 focus-visible:ring-secondary active:cursor-grabbing"
        @pointerdown="down($event, k)"
        @contextmenu.prevent
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
