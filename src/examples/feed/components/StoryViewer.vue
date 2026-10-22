<script setup lang="ts">
/*
 * Stories full screen. Each frame fills its MProgressBar over 5 seconds; tap the left third to go
 * back and the rest to go forward, hold to pause. Moving to another person's story turns a cube,
 * like the big apps: the two faces rotate around their shared edge. Swiping sideways turns it
 * with your finger, and letting go finishes the turn or settles back.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { MIconButton } from '@m3ui-vue/m3ui-vue'
import { stories } from '../data'
import { usePlaza } from '../usePlaza'
import StoryFace from './StoryFace.vue'

const { storyViewer, seenStories, go } = usePlaza()
const DURATION = 5000
const TURN_MS = 450

const frame = ref(0)
const progress = ref(0)
const paused = ref(false)
const index = computed(() => storyViewer.value.index)
const story = computed(() => stories[index.value])

/** The cube turn in progress: to which neighbor (1 = next person, -1 = previous) and how far (0–1). */
const turn = ref<{ dir: 1 | -1; p: number } | null>(null)
const neighbor = computed(() => (turn.value ? stories[index.value + turn.value.dir] : undefined))

// --- Frame timer ------------------------------------------------------------------------------------

let raf = 0
let last = 0
function tick(t: number) {
  raf = requestAnimationFrame(tick)
  const dt = last ? t - last : 0
  last = t
  if (paused.value || turn.value) return
  progress.value += (dt / DURATION) * 100
  if (progress.value >= 100) next()
}
watch(
  () => storyViewer.value.open,
  (open) => {
    cancelAnimationFrame(raf)
    if (open) {
      frame.value = 0
      progress.value = 0
      turn.value = null
      last = 0
      raf = requestAnimationFrame(tick)
      document.addEventListener('keydown', onKey)
    } else document.removeEventListener('keydown', onKey)
  },
)
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  cancelAnimationFrame(turnRaf)
  document.removeEventListener('keydown', onKey)
})

function close() {
  storyViewer.value = { open: false, index: index.value }
}
function next() {
  progress.value = 0
  if (frame.value < story.value!.frames.length - 1) return frame.value++
  seenStories.add(story.value!.handle)
  if (index.value < stories.length - 1) animateTurn(1, 0, 1)
  else close()
}
function prev() {
  progress.value = 0
  if (frame.value > 0) return frame.value--
  if (index.value > 0) animateTurn(-1, 0, 1)
}

// --- The cube -----------------------------------------------------------------------------------------

let turnRaf = 0
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
/** Turns from `from` to `to` (0 = this face, 1 = the neighbor's), then lands on the neighbor or stays. */
function animateTurn(dir: 1 | -1, from: number, to: number) {
  cancelAnimationFrame(turnRaf)
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return finishTurn(dir, to === 1)
  turn.value = { dir, p: from }
  const duration = TURN_MS * Math.abs(to - from)
  const start = performance.now()
  const step = (t: number) => {
    const k = Math.min(1, (t - start) / Math.max(1, duration))
    turn.value = { dir, p: from + (to - from) * ease(k) }
    if (k < 1) turnRaf = requestAnimationFrame(step)
    else finishTurn(dir, to === 1)
  }
  turnRaf = requestAnimationFrame(step)
}
function finishTurn(dir: 1 | -1, landed: boolean) {
  turn.value = null
  if (!landed) return
  storyViewer.value = { open: true, index: index.value + dir }
  frame.value = 0
  progress.value = 0
}

// Face transforms: each one hinges on the edge it shares with the other.
const faceStyle = (which: 'current' | 'neighbor') => {
  if (!turn.value) return {}
  const { dir, p } = turn.value
  const angle = which === 'current' ? -dir * 90 * p : dir * 90 * (1 - p)
  const origin = (which === 'current') === dir > 0 ? 'right center' : 'left center'
  return { transform: `rotateY(${angle}deg)`, transformOrigin: origin }
}
const shade = (which: 'current' | 'neighbor') => (turn.value ? (which === 'current' ? turn.value.p : 1 - turn.value.p) * 0.6 : 0)

// --- Pointer: tap, hold, swipe ------------------------------------------------------------------------

const stage = ref<HTMLElement>()
let startX = 0
let startY = 0
let startT = 0
let dragging = false
let pressedAt = 0
let suppressClick = false

function onDown(e: PointerEvent) {
  startX = e.clientX
  startY = e.clientY
  startT = performance.now()
  pressedAt = Date.now()
  dragging = false
  suppressClick = false
  paused.value = true
}
function onMove(e: PointerEvent) {
  if (!pressedAt) return
  const dx = e.clientX - startX
  if (!dragging) {
    if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(e.clientY - startY)) return
    dragging = true
    suppressClick = true
    stage.value?.setPointerCapture(e.pointerId)
  }
  const dir: 1 | -1 = dx < 0 ? 1 : -1
  const width = stage.value?.offsetWidth ?? 400
  // No neighbor that way: a little resistance instead of a turn.
  const target = stories[index.value + dir]
  const p = Math.min(1, Math.abs(dx) / width) * (target ? 1 : 0.15)
  turn.value = { dir, p }
}
function onUp(e: PointerEvent) {
  if (!pressedAt) return
  pressedAt = Date.now() - pressedAt > 250 ? -1 : 0
  paused.value = false
  if (!dragging || !turn.value) return
  const { dir, p } = turn.value
  const fast = Math.abs(e.clientX - startX) / (performance.now() - startT) > 0.5
  const go = !!stories[index.value + dir] && (p > 0.35 || fast)
  if (go) progress.value = 0
  animateTurn(dir, p, go ? 1 : 0)
}
// A long press only pauses; letting go of it (or of a swipe) doesn't also skip ahead.
function tap(fn: () => void) {
  const longPress = pressedAt === -1
  pressedAt = 0
  if (suppressClick || longPress || turn.value) return
  fn()
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
}
function openProfile(handle: string) {
  close()
  go({ name: 'profile', handle })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="m3p-story">
      <div v-if="storyViewer.open && story" class="fixed inset-0 z-200 flex items-center justify-center bg-black" role="dialog" aria-label="Story">
        <div
          ref="stage"
          class="relative h-full w-full max-w-[min(28rem,calc(100dvh*9/16))] touch-pan-y select-none [perspective:1100px] sm:h-[92dvh]"
          @pointerdown="onDown"
          @pointermove="onMove"
          @pointerup="onUp"
          @pointercancel="onUp"
        >
          <div class="absolute inset-0 [transform-style:preserve-3d]">
            <StoryFace :key="story.handle" :story="story" :frame="frame" :progress="progress" class="[backface-visibility:hidden] sm:rounded-2xl" :style="faceStyle('current')" @profile="openProfile(story.handle)" />
            <div v-if="turn" class="pointer-events-none absolute inset-0 bg-black sm:rounded-2xl" :style="{ ...faceStyle('current'), opacity: shade('current') }" />
            <template v-if="neighbor">
              <StoryFace :key="neighbor.handle" :story="neighbor" :frame="0" :progress="0" class="[backface-visibility:hidden] sm:rounded-2xl" :style="faceStyle('neighbor')" />
              <div class="pointer-events-none absolute inset-0 bg-black sm:rounded-2xl" :style="{ ...faceStyle('neighbor'), opacity: shade('neighbor') }" />
            </template>
          </div>

          <!-- Tap zones: back on the left third, forward on the rest -->
          <div class="absolute inset-0 top-20 grid grid-cols-[1fr_2fr]">
            <button type="button" class="cursor-w-resize" aria-label="Previous" @click="tap(prev)" />
            <button type="button" class="cursor-e-resize" aria-label="Next" @click="tap(next)" />
          </div>

          <div class="absolute top-6 right-2 flex text-white" @pointerdown.stop>
            <MIconButton :icon="paused ? 'play_arrow' : 'pause'" :label="paused ? 'Play' : 'Pause'" color="#fff" @click="paused = !paused" />
            <MIconButton icon="close" label="Close" color="#fff" @click="close" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.m3p-story-enter-active,
.m3p-story-leave-active {
  transition: opacity 200ms ease, transform 250ms cubic-bezier(0.2, 0, 0, 1);
}
.m3p-story-enter-from,
.m3p-story-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
