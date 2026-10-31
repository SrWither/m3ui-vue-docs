<script setup lang="ts">
/*
 * The live part of a device inside its PartView: a screen's pixels on a canvas (repainted only when they changed,
 * at most once per frame), a terminal's text, a keyboard's field and queue, a joypad's buttons. The joypad also
 * takes the keyboard while it has focus: arrows or WASD, X/K for A, Z/J for B, Shift for Select, Enter for Start.
 */
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { PAD_BUTTONS, type ScreenState, type TtyState } from '../devices'
import { CHAR_W, LINE_H, SIDE, screenPixel } from '../geometry'
import { partByKind } from '../parts'
import { useCircuit } from '../useCircuit'
import type { PartData } from '../sim'

const props = defineProps<{ id: string; data: PartData }>()
const c = useCircuit()
const params = computed(() => ({ ...partByKind.get(props.data.kind)!.params, ...props.data.params }))
// A shallow copy: the simulator changes its state object in place, and the same object wouldn't redraw
const state = computed(() => (c.version.value, { ...c.sim.state.get(props.id) }))

// ── Screen ──────────────────────────────────────────────────────────────────────────────────────────────
const canvas = ref<HTMLCanvasElement>()
const px = computed(() => screenPixel(params.value))
function paint(force = false) {
  const st = c.sim.state.get(props.id) as ScreenState | undefined
  const cv = canvas.value
  if (!st || !cv || (!st.dirty && !force)) return
  st.dirty = false
  const { cols = 32, rows = 32 } = params.value
  if (st.front.length !== cols * rows) return
  cv.getContext('2d')!.putImageData(new ImageData(new Uint8ClampedArray(st.front.buffer, st.front.byteOffset, cols * rows * 4), cols, rows), 0, 0)
}
if (props.data.kind === 'screen') {
  watch(c.version, () => paint())
  watch(() => [params.value.cols, params.value.rows, params.value.mode, params.value.buffered], () => nextTick(() => paint(true)))
  onMounted(() => paint(true))
}

// ── Terminal ────────────────────────────────────────────────────────────────────────────────────────────
// Copies: the simulator changes these arrays in place, so the same reference wouldn't redraw
const lines = computed(() => [...((state.value as TtyState | undefined)?.lines ?? [''])])

// ── Keyboard ────────────────────────────────────────────────────────────────────────────────────────────
const queue = computed(() => [...((state.value?.queue as number[] | undefined) ?? [])])
const shown = computed(() => queue.value.map((k) => (k === 10 ? '⏎' : k === 8 ? '⌫' : k === 9 ? '⇥' : String.fromCharCode(k))).join(''))
function type(e: KeyboardEvent) {
  e.stopPropagation()
  const code = e.key === 'Enter' ? 10 : e.key === 'Backspace' ? 8 : e.key === 'Tab' ? 9 : e.key === 'Escape' ? 27 : e.key.length === 1 ? e.key.charCodeAt(0) : -1
  if (code < 0 || code > 127 || e.ctrlKey || e.metaKey) return
  e.preventDefault()
  c.poke(props.id, (st) => st.queue.push(code))
}

// ── Joypad ──────────────────────────────────────────────────────────────────────────────────────────────
const buttons = computed(() => (state.value?.buttons as number | undefined) ?? 0)
const bit = (name: (typeof PAD_BUTTONS)[number]) => 1 << PAD_BUTTONS.indexOf(name)
function hold(name: (typeof PAD_BUTTONS)[number], down: boolean) {
  const b = bit(name)
  const now = buttons.value
  const next = down ? now | b : now & ~b
  if (next !== now) c.poke(props.id, (st) => (st.buttons = next))
}
const KEYS: Record<string, (typeof PAD_BUTTONS)[number]> = {
  ArrowUp: 'Up', ArrowDown: 'Down', ArrowLeft: 'Left', ArrowRight: 'Right',
  w: 'Up', s: 'Down', a: 'Left', d: 'Right',
  x: 'A', k: 'A', z: 'B', j: 'B', Shift: 'Select', Enter: 'Start',
}
function key(e: KeyboardEvent, down: boolean) {
  const name = KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key]
  if (!name) return
  // Keys meant for the pad don't move or delete parts on the canvas
  e.preventDefault()
  e.stopPropagation()
  if (!e.repeat) hold(name, down)
}
function releaseAll() {
  if (buttons.value) c.poke(props.id, (st) => (st.buttons = 0))
}
const DPAD = [
  { name: 'Up', icon: 'arrow_drop_up', cls: 'col-start-2 row-start-1' },
  { name: 'Left', icon: 'arrow_left', cls: 'col-start-1 row-start-2' },
  { name: 'Right', icon: 'arrow_right', cls: 'col-start-3 row-start-2' },
  { name: 'Down', icon: 'arrow_drop_down', cls: 'col-start-2 row-start-3' },
] as const
const pressHandlers = (name: (typeof PAD_BUTTONS)[number]) => ({
  onPointerdown: (e: PointerEvent) => {
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).closest<HTMLElement>('[data-pad]')?.focus()
    hold(name, true)
  },
  onPointerup: () => hold(name, false),
  onPointerleave: () => hold(name, false),
  onPointercancel: () => hold(name, false),
  onContextmenu: (e: Event) => e.preventDefault(),
})
</script>

<template>
  <!-- Screen -->
  <canvas
    v-if="data.kind === 'screen'"
    ref="canvas"
    :width="params.cols"
    :height="params.rows"
    class="absolute top-10 rounded-xs bg-black [image-rendering:pixelated]"
    :style="{ left: `${SIDE}px`, width: `${(params.cols ?? 32) * px}px`, height: `${(params.rows ?? 32) * px}px` }"
    role="img"
    :aria-label="`Screen, ${params.cols} by ${params.rows} pixels`"
  />

  <!-- Terminal -->
  <div
    v-else-if="data.kind === 'tty'"
    class="absolute top-10 right-3 bottom-3 overflow-hidden rounded-xs bg-black px-1.5 py-1 font-mono text-[12px] text-white/90"
    :style="{ left: `${SIDE}px`, lineHeight: `${LINE_H}px` }"
    role="log"
    aria-live="polite"
  >
    <div v-for="(l, i) in lines" :key="i" class="whitespace-pre" :style="{ width: `${(params.cols ?? 32) * CHAR_W}px` }">{{ l }}<span v-if="i === lines.length - 1" class="inline-block h-3 w-[7px] translate-y-0.5 animate-pulse bg-white/70" /></div>
  </div>

  <!-- Keyboard -->
  <div v-else-if="data.kind === 'keyboard'" class="absolute inset-x-2 bottom-2 flex flex-col gap-1">
    <input
      class="h-7 w-full rounded-xs bg-surface-container-highest px-2 text-body-small outline-none placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary"
      placeholder="Type here…"
      aria-label="Type into the keyboard"
      @keydown="type"
    />
    <div class="h-4 truncate font-mono text-label-small text-on-surface-variant">{{ queue.length ? `queue: ${shown}` : 'queue empty' }}</div>
  </div>

  <!-- Joypad -->
  <div
    v-else-if="data.kind === 'joypad'"
    data-pad
    data-flow-nodrag
    tabindex="0"
    class="flex size-full items-center justify-between gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus:ring-2 focus:ring-primary/60"
    :class="params.serial ? 'pr-12 pl-14' : 'pr-6 pl-3'"
    aria-label="Joypad: focus it to play with the keyboard"
    @keydown="key($event, true)"
    @keyup="key($event, false)"
    @blur="releaseAll"
  >
    <div class="grid size-[66px] shrink-0 grid-cols-3 grid-rows-3">
      <button
        v-for="d in DPAD"
        :key="d.name"
        type="button"
        tabindex="-1"
        class="flex items-center justify-center rounded-xs transition-colors"
        :class="[d.cls, buttons & bit(d.name) ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant']"
        :aria-label="d.name"
        v-bind="pressHandlers(d.name)"
      >
        <span class="material-symbols-outlined text-[20px]" aria-hidden="true">{{ d.icon }}</span>
      </button>
      <span class="col-start-2 row-start-2 bg-surface-container-highest" />
    </div>
    <div class="flex flex-col gap-1.5">
      <button
        v-for="b in (['Select', 'Start'] as const)"
        :key="b"
        type="button"
        tabindex="-1"
        class="h-3.5 w-9 rounded-full text-[8px] leading-none font-medium tracking-wide uppercase transition-colors"
        :class="buttons & bit(b) ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'"
        :aria-label="b"
        v-bind="pressHandlers(b)"
      >{{ b }}</button>
    </div>
    <div class="flex items-center gap-1.5">
      <button
        v-for="b in (['B', 'A'] as const)"
        :key="b"
        type="button"
        tabindex="-1"
        class="flex size-7 items-center justify-center rounded-full text-label-large transition-colors"
        :class="[b === 'A' && '-translate-y-2', buttons & bit(b) ? 'bg-primary text-on-primary' : 'bg-tertiary-container text-on-tertiary-container']"
        :aria-label="b"
        v-bind="pressHandlers(b)"
      >{{ b }}</button>
    </div>
  </div>
</template>
