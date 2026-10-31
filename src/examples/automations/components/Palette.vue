<script setup lang="ts">
/*
 * Every kind of step, by category. With a mouse, drag one onto the canvas; a click (or a tap) adds it in the middle
 * of the view. Dragging draws a ghost that follows the pointer and reports where it was dropped.
 */
import { onBeforeUnmount, ref } from 'vue'
import { MIcon } from '@m3ui-vue/m3ui-vue'
import { categories, colorOf, kinds, type Kind } from '../catalog'

const emit = defineEmits<{ pick: [kind: string]; drop: [kind: string, at: { x: number; y: number }] }>()

const CONTAINER = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
}

const ghost = ref<{ kind: Kind; x: number; y: number } | null>(null)
let press: { kind: Kind; x: number; y: number; id: number } | null = null

function down(e: PointerEvent, kind: Kind) {
  if (e.pointerType === 'touch' || e.button !== 0) return
  press = { kind, x: e.clientX, y: e.clientY, id: e.pointerId }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
}
function move(e: PointerEvent) {
  if (!press || e.pointerId !== press.id) return
  if (!ghost.value && Math.hypot(e.clientX - press.x, e.clientY - press.y) < 6) return
  ghost.value = { kind: press.kind, x: e.clientX, y: e.clientY }
  document.body.style.userSelect = 'none'
}
function up(e: PointerEvent) {
  window.removeEventListener('pointermove', move)
  window.removeEventListener('pointerup', up)
  document.body.style.userSelect = ''
  if (ghost.value) emit('drop', ghost.value.kind.id, { x: e.clientX, y: e.clientY })
  ghost.value = null
  press = null
}
// A drag ends in pointerup, which clicks the item too: only a plain click adds it in the middle
let dragged = false
function click(kind: Kind) {
  if (dragged) return
  emit('pick', kind.id)
}
function trackDrag() {
  dragged = !!ghost.value
}
onBeforeUnmount(() => {
  window.removeEventListener('pointermove', move)
  window.removeEventListener('pointerup', up)
})
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
        @pointerup.capture="trackDrag"
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
    <Teleport to="body">
      <div
        v-if="ghost"
        class="pointer-events-none fixed z-50 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md border border-primary bg-surface px-3 py-2 shadow-elevation-4"
        :style="{ left: `${ghost.x}px`, top: `${ghost.y}px` }"
      >
        <MIcon :name="ghost.kind.icon" :size="20" class="text-primary" />
        <span class="text-title-small text-on-surface">{{ ghost.kind.label }}</span>
      </div>
    </Teleport>
  </div>
</template>
