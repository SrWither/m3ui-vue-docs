<script setup lang="ts">
/*
 * The sound parts inside their PartView: a buzzer's and a synthesizer's voice follows what the part wants (its
 * `state.tone`, applied once per frame when the simulation moved), a PCM speaker streams the samples it collected,
 * and a piano draws its keys. The piano also takes the keyboard while it has focus, like a DAW: Z S X D C V G B H N J M
 * for the lower octave, Q 2 W 3 E R 5 T 6 Y 7 U for the upper one.
 */
import { computed, onBeforeUnmount, watch } from 'vue'
import { MIcon } from '@m3ui-vue/m3ui-vue'
import { createStream, createVoice, DUTIES, type Tone } from '../audio'
import { partByKind } from '../parts'
import { useCircuit } from '../useCircuit'
import type { PartData } from '../sim'

const props = defineProps<{ id: string; data: PartData }>()
const c = useCircuit()
const params = computed(() => ({ ...partByKind.get(props.data.kind)!.params, ...props.data.params }))
const state = computed(() => (c.version.value, { ...c.sim.state.get(props.id) }))

// ── Voices ──────────────────────────────────────────────────────────────────────────────────────────────
// Made on the first sound, so a circuit that never beeps never opens an audio context
let voice: ReturnType<typeof createVoice> | null = null
let stream: ReturnType<typeof createStream> | null = null
const tone = computed<Tone | null>(() => state.value.tone ?? null)
if (props.data.kind === 'buzzer' || props.data.kind === 'synth') {
  watch(tone, (t) => {
    if (!t?.on && !voice) return
    voice ??= createVoice()
    // No tone yet (just reset): silent
    voice.set(t ?? { on: false, hz: 440, volume: 0, wave: 'square', duty: 0.5 })
  }, { immediate: true })
}
if (props.data.kind === 'pcm') {
  watch(c.version, () => {
    const q = c.sim.state.get(props.id)?.queue as number[] | undefined
    if (!q?.length) return
    stream ??= createStream()
    stream.push(q.splice(0), params.value.rate ?? 8000)
  })
}
onBeforeUnmount(() => voice?.stop())

const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
const noteName = (n: number) => `${NAMES[n % 12]}${Math.floor(n / 12) - 1}`
const synthText = computed(() => {
  const t = tone.value
  if (!t?.on) return 'silent'
  const pitch = params.value.pitch === 'hz' ? `${Math.round(t.hz)} Hz` : noteName(Math.round(12 * Math.log2(t.hz / 440) + 69))
  const wave = t.wave === 'square' ? `▭ ${DUTIES.indexOf(t.duty) >= 0 ? t.duty * 100 : 50}%` : t.wave === 'triangle' ? '△' : t.wave === 'sawtooth' ? '⩘' : 'noise'
  return `${pitch} · ${wave} · ${Math.round((t.volume / 0.6) * 15)}`
})

// ── Piano ───────────────────────────────────────────────────────────────────────────────────────────────
const low = computed(() => params.value.value ?? 60)
const WHITE = [0, 2, 4, 5, 7, 9, 11]
const BLACK = [1, 3, -1, 6, 8, 10, -1]
const keys = computed(() => {
  const white: { note: number; x: number }[] = []
  const black: { note: number; x: number }[] = []
  for (let o = 0; o < 2; o++) {
    WHITE.forEach((s, i) => white.push({ note: low.value + o * 12 + s, x: (o * 7 + i) * 14 }))
    BLACK.forEach((s, i) => s >= 0 && black.push({ note: low.value + o * 12 + s, x: (o * 7 + i) * 14 + 9 }))
  }
  return { white, black }
})
const held = computed(() => (state.value.gate ? state.value.note : -1))
// A click presses and releases within one frame, before the voice (applied once per frame) ever sees the key down:
// a note lasts at least MIN_NOTE ms
const MIN_NOTE = 140
let pressedAt = 0
let release = 0
function play(note: number | null) {
  clearTimeout(release)
  if (note === null) {
    const left = MIN_NOTE - (performance.now() - pressedAt)
    if (left > 0) {
      release = window.setTimeout(() => play(null), left)
      return
    }
    if (c.sim.state.get(props.id)?.gate) c.poke(props.id, { set: { gate: 0 } })
    return
  }
  pressedAt = performance.now()
  c.poke(props.id, { set: { note, gate: 1 } })
}
onBeforeUnmount(() => clearTimeout(release))
const KEYMAP = 'zsxdcvgbhnjmq2w3er5t6y7u'
let keyDown = ''
function key(e: KeyboardEvent, down: boolean) {
  const k = e.key.toLowerCase()
  const i = KEYMAP.indexOf(k)
  if (i < 0 || e.ctrlKey || e.metaKey) return
  e.preventDefault()
  e.stopPropagation()
  if (e.repeat) return
  if (down) {
    keyDown = k
    play(low.value + i)
  } else if (k === keyDown) play(null)
}
const press = (note: number) => ({
  onPointerdown: (e: PointerEvent) => {
    e.preventDefault()
    const key = e.currentTarget as HTMLElement
    play(note)
    key.closest<HTMLElement>('[data-piano]')?.focus()
    // Let go of the implicit touch capture so sliding along plays each key (throws if there's none)
    try {
      if (key.hasPointerCapture(e.pointerId)) key.releasePointerCapture(e.pointerId)
    } catch {}
  },
  // Sliding across the keys plays each one
  onPointerenter: (e: PointerEvent) => e.buttons & 1 && play(note),
  onPointerup: () => play(null),
  onPointercancel: () => play(null),
  onContextmenu: (e: Event) => e.preventDefault(),
})
</script>

<template>
  <div
    v-if="data.kind === 'piano'"
    data-piano
    data-flow-nodrag
    tabindex="0"
    class="relative h-[52px] w-[196px] rounded-xs outline-none focus:ring-2 focus:ring-primary/60"
    aria-label="Piano: focus it to play with the keyboard"
    @keydown="key($event, true)"
    @keyup="key($event, false)"
    @pointerleave="held >= 0 && play(null)"
    @blur="held >= 0 && play(null)"
  >
    <button
      v-for="k in keys.white"
      :key="k.note"
      type="button"
      tabindex="-1"
      class="absolute top-0 h-full w-[13px] rounded-b-xs border border-outline-variant transition-colors"
      :class="held === k.note ? 'bg-primary' : 'bg-white'"
      :style="{ left: `${k.x}px` }"
      :aria-label="noteName(k.note)"
      v-bind="press(k.note)"
    />
    <button
      v-for="k in keys.black"
      :key="k.note"
      type="button"
      tabindex="-1"
      class="absolute top-0 h-[32px] w-[9px] rounded-b-xs transition-colors"
      :class="held === k.note ? 'bg-primary' : 'bg-neutral-900'"
      :style="{ left: `${k.x}px` }"
      :aria-label="noteName(k.note)"
      v-bind="press(k.note)"
    />
  </div>
  <MIcon
    v-else-if="data.kind === 'buzzer'"
    :name="tone?.on ? 'volume_up' : 'volume_mute'"
    :size="22"
    class="ml-3 transition-colors"
    :class="tone?.on ? 'text-primary' : 'text-on-surface-variant'"
  />
  <div
    v-else-if="data.kind === 'synth'"
    class="absolute inset-x-1.5 bottom-1.5 truncate rounded-sm bg-surface-container-highest px-1.5 py-0.5 text-center font-mono text-label-medium"
    :class="tone?.on ? 'text-primary' : 'text-on-surface-variant'"
  >{{ synthText }}</div>
  <div v-else-if="data.kind === 'pcm'" class="absolute inset-x-1.5 bottom-1.5 flex h-6 items-center gap-1.5 rounded-sm bg-surface-container-highest px-1.5">
    <MIcon name="speaker" :size="16" class="text-on-surface-variant" />
    <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-on-surface/10">
      <div class="h-full rounded-full bg-primary transition-[width] duration-75" :style="{ width: `${Math.round((state.level ?? 0) * 100)}%` }" />
    </div>
    <span class="font-mono text-label-small text-on-surface-variant">{{ (params.rate ?? 8000) / 1000 }} kHz</span>
  </div>
</template>
