<script setup lang="ts">
/* Drag the ball; let go and it springs home on the chosen scheme (the docs' Motion page) */
import { ref } from 'vue'
import { motionSprings, useSpring } from '@m3ui-vue/m3ui-vue'

const props = defineProps<{ scheme: 'standard' | 'expressive' }>()

const ball = ref<HTMLElement | null>(null)
const offset = ref<[number, number]>([0, 0])
let drag: { id: number; x: number; y: number } | null = null

// While dragging the target follows the finger and snap() jumps there; on release the target goes home
// and the spring takes it back (the spec is read once: the page re-creates this per scheme)
const { snap } = useSpring(
  () => offset.value,
  ([x, y]) => { if (ball.value) ball.value.style.transform = `translate(${x}px, ${y}px)` },
  motionSprings[props.scheme].defaultSpatial,
)

function down(e: PointerEvent) {
  ball.value?.setPointerCapture(e.pointerId)
  drag = { id: e.pointerId, x: e.clientX - offset.value[0], y: e.clientY - offset.value[1] }
}
function move(e: PointerEvent) {
  if (!drag || e.pointerId !== drag.id) return
  offset.value = [e.clientX - drag.x, e.clientY - drag.y]
  snap()
}
function up(e: PointerEvent) {
  if (!drag || e.pointerId !== drag.id) return
  drag = null
  offset.value = [0, 0]
}
</script>

<template>
  <div class="relative flex h-56 items-center justify-center overflow-hidden rounded-xl bg-surface-container-low">
    <div class="absolute h-16 w-16 rounded-full border-2 border-dashed border-outline-variant" />
    <div
      ref="ball"
      class="relative z-10 h-16 w-16 cursor-grab touch-none rounded-full bg-tertiary shadow-elevation-2 active:cursor-grabbing"
      @pointerdown="down"
      @pointermove="move"
      @pointerup="up"
      @pointercancel="up"
    />
  </div>
</template>
