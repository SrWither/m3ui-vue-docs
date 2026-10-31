<script setup lang="ts">
/*
 * One part on the canvas (MFlow's `#node-part` slot): gates as their IEEE shapes, everything else as a box with
 * named pins, and the inputs and outputs you play with (switches, buttons, input pins, LEDs, displays) live.
 * Each pin is an MFlowHandle with an id (`i0`…, `o0`…) on the 20px pitch from geometry.ts.
 */
import { computed } from 'vue'
import { MIcon, MSwitch } from '@m3ui-vue/m3ui-vue'
import { MFlowHandle } from '@m3ui-vue/m3ui-vue/flow'
import { partByKind, disassemble } from '../parts'
import { format, known, mask, widthOf, type Sig } from '../logic'
import { geometry } from '../geometry'
import DeviceView from './DeviceView.vue'
import { useCircuit } from '../useCircuit'
import type { PartData } from '../sim'

const props = defineProps<{ id: string; data: PartData; selected: boolean }>()
const c = useCircuit()
const def = computed(() => partByKind.get(props.data.kind)!)
const params = computed(() => ({ ...def.value.params, ...props.data.params }))
const pins = computed(() => def.value.pins(params.value))
const g = computed(() => geometry(props.data))

// Signals, redrawn when the simulation moved (c.version)
const ins = computed<Sig[]>(() => (c.version.value, c.sim.inputsOf(props.id)))
// A shallow copy: the simulator changes its state object in place, and the same object wouldn't redraw
const state = computed(() => (c.version.value, { ...c.sim.state.get(props.id) }))
const out0 = computed(() => (c.version.value, c.sim.output(props.id, 0)))
const isOne = (s?: Sig) => !!s && known(s) && s.v !== 0
const tone = (s?: Sig) => (!s || (!s.k && !s.e) ? 'text-secondary' : s.e ? 'text-error' : '')

// ── Interaction ─────────────────────────────────────────────────────────────────────────────────────────
const setValue = (v: number) => c.poke(props.id, (st) => (st.value = v >>> 0))
const flipBit = (i: number) => setValue((state.value.value ?? 0) ^ (2 ** i))
function press(on: boolean) {
  if ((state.value.value ?? 0) !== +on) setValue(+on)
}

// ── Gate bodies, in the part's own px ───────────────────────────────────────────────────────────────────
const body = computed(() => {
  const { w, h } = g.value
  const x0 = 14
  const bw = w - 28 - (def.value.inverted ? 8 : 0)
  const x1 = x0 + bw
  const t = 4
  const b = h - 4
  const mid = h / 2
  switch (def.value.gate) {
    case 'and':
      return { d: `M${x0} ${t} H${x0 + bw / 2} A${bw / 2} ${(b - t) / 2} 0 0 1 ${x0 + bw / 2} ${b} H${x0} Z`, x1 }
    case 'or':
      return { d: `M${x0} ${t} Q${x0 + bw * 0.6} ${t} ${x1} ${mid} Q${x0 + bw * 0.6} ${b} ${x0} ${b} Q${x0 + bw * 0.3} ${mid} ${x0} ${t} Z`, x1 }
    case 'xor':
      return {
        d: `M${x0 + 6} ${t} Q${x0 + bw * 0.6} ${t} ${x1} ${mid} Q${x0 + bw * 0.6} ${b} ${x0 + 6} ${b} Q${x0 + 6 + bw * 0.3} ${mid} ${x0 + 6} ${t} Z`,
        extra: `M${x0} ${t} Q${x0 + bw * 0.3} ${mid} ${x0} ${b}`,
        x1,
      }
    default:
      return { d: `M${x0} ${t + 4} L${x1} ${mid} L${x0} ${b - 4} Z`, x1 }
  }
})

// ── Displays ────────────────────────────────────────────────────────────────────────────────────────────
// Segments a–g per hex digit
const DIGITS = [0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07, 0x7f, 0x6f, 0x77, 0x7c, 0x39, 0x5e, 0x79, 0x71]
// Each segment as a polygon in a 40×64 cell
const SEGMENTS = [
  'M8 4 H32 L28 8 H12 Z', // a
  'M33 5 V30 L29 27 V9 Z', // b
  'M33 34 V59 L29 55 V37 Z', // c
  'M8 60 H32 L28 56 H12 Z', // d
  'M7 34 V59 L11 55 V37 Z', // e
  'M7 5 V30 L11 27 V9 Z', // f
  'M9 32 L12 29.5 H28 L31 32 L28 34.5 H12 Z', // g
]
const segments = computed<(boolean | null)[]>(() => {
  if (props.data.kind === 'seg7') return ins.value.map((s) => (known(s) ? s.v === 1 : null))
  const s = ins.value[0]
  if (!s || !known(s)) return SEGMENTS.map(() => null)
  return SEGMENTS.map((_, i) => !!(DIGITS[s.v]! & (1 << i)))
})
const LED = { primary: 'bg-primary shadow-[0_0_12px_var(--color-primary)]', tertiary: 'bg-tertiary shadow-[0_0_12px_var(--color-tertiary)]', error: 'bg-error shadow-[0_0_12px_var(--color-error)]', secondary: 'bg-secondary shadow-[0_0_12px_var(--color-secondary)]' }

// What a stateful box shows at its foot
const stored = computed(() => {
  const st = state.value
  const k = props.data.kind
  if (k === 'ram') {
    const a = ins.value[0]
    return a && known(a) ? `[${a.v}] = ${format(out0.value!)}` : 'address X'
  }
  if (k === 'rom') {
    const a = ins.value[0]
    if (!a || !known(a)) return 'address X'
    const word = params.value.contents?.[a.v] ?? 0
    return `[${a.v}] = ${format(out0.value!)}${params.value.asm ? ` · ${disassemble(word)}` : ''}`
  }
  if (['register', 'counter', 'pc'].includes(k)) return format(out0.value!)
  if (['dff', 'tff', 'jkff'].includes(k)) return `Q = ${st.q ?? 0}`
  return ''
})
const title = computed(() => props.data.label || def.value.label)
const bits = computed(() => params.value.width ?? 1)
const pinValue = computed(() => (state.value.value ?? 0) & mask(bits.value))
</script>

<template>
  <div
    class="relative text-on-surface"
    :style="{ width: `${g.w}px`, height: `${g.h}px` }"
  >
    <!-- A label of your own over gates and I/O -->
    <div
      v-if="data.label && g.look !== 'box'"
      class="pointer-events-none absolute bottom-full left-1/2 mb-0.5 -translate-x-1/2 text-label-small whitespace-nowrap text-on-surface-variant"
    >{{ data.label }}</div>

    <!-- Gate -->
    <svg v-if="g.look === 'gate'" :width="g.w" :height="g.h" class="absolute inset-0 overflow-visible">
      <line v-for="(y, i) in g.inY" :key="i" x1="0" :y1="y" x2="20" :y2="y" class="stroke-outline" stroke-width="2" />
      <line :x1="body.x1" :y1="g.outY[0]" :x2="g.w" :y2="g.outY[0]" class="stroke-outline" stroke-width="2" />
      <path
        :d="body.d"
        stroke-width="2"
        stroke-linejoin="round"
        class="transition-[stroke,fill] duration-200"
        :class="[selected ? 'stroke-primary' : 'stroke-on-surface-variant', isOne(out0) !== def.inverted ? 'fill-primary-container' : 'fill-surface-container-high']"
      />
      <path v-if="body.extra" :d="body.extra" fill="none" stroke-width="2" :class="selected ? 'stroke-primary' : 'stroke-on-surface-variant'" />
      <circle v-if="def.inverted" :cx="body.x1 + 4" :cy="g.outY[0]" r="4" stroke-width="2" class="fill-surface" :class="selected ? 'stroke-primary' : 'stroke-on-surface-variant'" />
      <text v-if="bits > 1" :x="g.w / 2 - 6" :y="g.h - 8" text-anchor="middle" class="fill-on-surface-variant text-[9px]">{{ bits }}b</text>
      <text v-if="data.kind === 'tristate'" x="16" :y="g.inY[1]! + 3" class="fill-on-surface-variant text-[9px]">en</text>
    </svg>

    <!-- Box -->
    <div
      v-else-if="g.look === 'box'"
      class="absolute inset-0 rounded-md border bg-surface-container-low transition-[border-color,box-shadow] duration-200"
      :class="selected ? 'border-primary ring-1 ring-primary' : 'border-outline-variant'"
    >
      <div class="flex h-8 items-center gap-1.5 border-b border-outline-variant px-2">
        <MIcon :name="def.icon" :size="16" class="text-primary" />
        <span class="truncate text-label-large">{{ title }}</span>
      </div>
      <div
        v-for="(pin, i) in pins.inputs"
        :key="`i${i}`"
        class="pointer-events-none absolute left-2 -translate-y-1/2 text-label-small text-on-surface-variant"
        :style="{ top: `${g.inY[i]}px` }"
      >{{ pin.name }}<span v-if="pin.width > 1" class="opacity-60">[{{ pin.width }}]</span></div>
      <div
        v-for="(pin, i) in pins.outputs"
        :key="`o${i}`"
        class="pointer-events-none absolute right-2 -translate-y-1/2 text-label-small text-on-surface-variant"
        :style="{ top: `${g.outY[i]}px` }"
      >{{ pin.name }}<span v-if="pin.width > 1" class="opacity-60">[{{ pin.width }}]</span></div>
      <div
        v-if="stored"
        class="absolute inset-x-1.5 bottom-1.5 truncate rounded-sm bg-surface-container-highest px-1.5 py-0.5 text-center font-mono text-label-medium"
        :class="tone(out0)"
      >{{ stored }}</div>
      <DeviceView v-if="data.kind === 'screen' || data.kind === 'tty' || data.kind === 'keyboard'" :id="id" :data="data" />
    </div>

    <!-- I/O -->
    <div
      v-else
      class="absolute inset-0 flex items-center justify-center rounded-md border bg-surface-container-low transition-[border-color] duration-200"
      :class="[selected ? 'border-primary ring-1 ring-primary' : 'border-outline-variant', data.kind === 'led' && 'rounded-full']"
    >
      <MSwitch
        v-if="data.kind === 'switch'"
        :model-value="!!state.value"
        :icon="false"
        :aria-label="title"
        @update:model-value="setValue($event ? 1 : 0)"
      />
      <button
        v-else-if="data.kind === 'button'"
        type="button"
        class="flex size-8 items-center justify-center rounded-full outline-none transition-[background-color,scale] duration-100 focus-visible:ring-2 focus-visible:ring-secondary"
        :class="state.value ? 'scale-90 bg-primary text-on-primary' : 'bg-secondary-container text-on-secondary-container'"
        :aria-label="title"
        :aria-pressed="!!state.value"
        @pointerdown.prevent="press(true)"
        @pointerup="press(false)"
        @pointerleave="press(false)"
        @pointercancel="press(false)"
        @keydown.space.prevent="press(true)"
        @keyup.space="press(false)"
        @contextmenu.prevent
      >
        <MIcon name="touch_app" :size="18" />
      </button>
      <div v-else-if="data.kind === 'pin'" class="flex flex-col items-center gap-1">
        <div class="flex flex-wrap-reverse justify-center gap-0.5" :style="{ width: `${Math.min(bits, 8) * 18}px` }" dir="rtl">
          <button
            v-for="i in bits"
            :key="i"
            type="button"
            class="h-5 w-4 rounded-xs font-mono text-label-medium transition-colors"
            :class="pinValue & (2 ** (i - 1)) ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'"
            :aria-label="`Bit ${i - 1}`"
            @click="flipBit(i - 1)"
          >{{ pinValue & (2 ** (i - 1)) ? 1 : 0 }}</button>
        </div>
        <span class="font-mono text-label-small text-on-surface-variant">0x{{ format(out0!) }}</span>
      </div>
      <span v-else-if="data.kind === 'const'" class="font-mono text-label-large">{{ bits > 1 ? `0x${format(out0!)}` : format(out0!) }}</span>
      <div v-else-if="data.kind === 'clock'" class="flex items-center gap-1">
        <MIcon name="schedule" :size="18" class="text-on-surface-variant" />
        <svg width="22" height="16" class="overflow-visible">
          <path d="M0 14 H5 V2 H11 V14 H17 V2 H22" fill="none" stroke-width="2" class="stroke-outline" />
          <circle :cx="state.value ? 8 : 14" :cy="state.value ? 2 : 14" r="3" class="fill-primary transition-all duration-100" />
        </svg>
      </div>
      <span
        v-else-if="data.kind === 'led'"
        class="size-6 rounded-full transition-[background-color,box-shadow] duration-100"
        :class="isOne(ins[0]) ? LED[params.color ?? 'primary'] : ins[0] && ins[0].e ? 'bg-error-container' : 'bg-surface-container-highest'"
      />
      <div v-else-if="data.kind === 'probe'" class="flex w-full flex-col items-stretch px-2 font-mono">
        <span class="truncate text-center text-title-medium" :class="tone(ins[0])">{{ format(ins[0]!, widthOf(ins[0]!) > 1 ? 'hex' : 'bin') }}<span v-if="widthOf(ins[0]!) > 1 && known(ins[0]!)" class="text-label-medium text-on-surface-variant"> = {{ format(ins[0]!, 'dec') }}</span></span>
        <span class="truncate text-center text-[10px] text-on-surface-variant">{{ format(ins[0]!, 'bin') }}</span>
      </div>
      <svg v-else-if="data.kind === 'hex' || data.kind === 'seg7'" width="40" height="64" viewBox="0 0 40 64" :class="data.kind === 'seg7' && 'ml-6'">
        <path
          v-for="(d, i) in SEGMENTS"
          :key="i"
          :d="d"
          class="transition-[fill] duration-100"
          :class="segments[i] === null ? 'fill-error/25' : segments[i] ? 'fill-primary' : 'fill-on-surface/8'"
        />
      </svg>
      <DeviceView v-else-if="data.kind === 'joypad'" :id="id" :data="data" />
      <template v-if="data.kind === 'seg7' || (data.kind === 'joypad' && params.serial)">
        <span
          v-for="(pin, i) in pins.inputs"
          :key="i"
          class="pointer-events-none absolute left-2 -translate-y-1/2 text-label-small text-on-surface-variant"
          :style="{ top: `${g.inY[i]}px` }"
        >{{ pin.name }}</span>
        <span
          v-for="(pin, i) in pins.outputs"
          :key="`o${i}`"
          class="pointer-events-none absolute right-1 -translate-y-1/2 text-label-small text-on-surface-variant"
          :style="{ top: `${g.outY[i]}px` }"
        >{{ pin.name }}</span>
      </template>
    </div>

    <MFlowHandle v-for="(y, i) in g.inY" :id="`i${i}`" :key="`i${i}`" type="target" position="left" :style="{ top: `${y}px` }" />
    <MFlowHandle v-for="(y, i) in g.outY" :id="`o${i}`" :key="`o${i}`" type="source" position="right" :style="{ top: `${y}px` }" />
  </div>
</template>
