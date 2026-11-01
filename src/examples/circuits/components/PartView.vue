<script setup lang="ts">
/*
 * One part on the canvas (MFlow's `#node-part` slot): gates as their IEEE shapes, everything else as a box with
 * named pins, and the inputs and outputs you play with (switches, buttons, input pins, LEDs, displays) live.
 * Each pin is an MFlowHandle with an id (`i0`…, `o0`…) on the 20px pitch from geometry.ts.
 */
import { computed } from 'vue'
import { MIcon, MSwitch } from '@m3ui-vue/m3ui-vue'
import { MFlowHandle, useFlow, useFlowNode } from '@m3ui-vue/m3ui-vue/flow'
import { partByKind, disassemble } from '../parts'
import { getCircuit } from '../library'
import { format, known, mask, widthOf, type Sig } from '../logic'
import { geometry, placed } from '../geometry'
import DeviceView from './DeviceView.vue'
import SoundView from './SoundView.vue'
import { useCircuit } from '../useCircuit'
import type { PartData } from '../sim'

const props = defineProps<{ id: string; data: PartData; selected: boolean }>()
const c = useCircuit()
const def = computed(() => partByKind.get(props.data.kind)!)
const params = computed(() => ({ ...def.value.params, ...props.data.params }))
const pins = computed(() => def.value.pins(params.value))
const g = computed(() => geometry(props.data))
/** As turned (data.facing): its size on the canvas and where its pins sit */
const at = computed(() => placed(props.data))
const vertical = computed(() => at.value.facing === 'south' || at.value.facing === 'north')
const west = computed(() => at.value.facing === 'west')
// A gate turns whole: its shape, drawn facing east, rotated about its corner and moved back in place
const turn = computed(() => {
  const { w, h } = g.value
  switch (at.value.facing) {
    case 'south': return `translate(${h} 0) rotate(90)`
    case 'west': return `translate(${w} ${h}) rotate(180)`
    case 'north': return `translate(0 ${w}) rotate(270)`
    default: return undefined
  }
})
const pointTone = computed(() => {
  const s = out0.value
  if (!s || (!s.k && !s.e)) return 'bg-secondary'
  if (s.e && !known(s)) return 'bg-error'
  if (widthOf(s) > 1) return 'bg-tertiary'
  return s.v ? 'bg-primary' : 'bg-outline-variant'
})
// A wire point's pins both sit at its dot; other parts' pins on their side, moved along it
// A wire point moves when it or one of its wires is selected; with nothing of it selected, a drag extends it
const flowNode = useFlowNode()
const flow = flowNode ? useFlow() : null
const movable = computed(() => {
  if (props.data.kind !== 'point') return false
  if (props.selected) return true
  const id = flowNode?.id
  const picked = flow?.selection.value.edges ?? []
  return !!id && picked.length > 0 && c.edges.value.some((e) => picked.includes(e.id) && (e.source === id || e.target === id))
})
const handleStyle = (p: { x: number; y: number; side: string }) =>
  props.data.kind === 'point'
    ? {}
    : p.side === 'top' || p.side === 'bottom' ? { left: `${p.x}px` } : { top: `${p.y}px` }

// Signals, redrawn when the simulation moved (c.version)
const ins = computed<Sig[]>(() => (c.version.value, c.sim.inputsOf(props.id)))
// A shallow copy: the simulator changes its state object in place, and the same object wouldn't redraw
const state = computed(() => (c.version.value, { ...c.sim.state.get(props.id) }))
const out0 = computed(() => (c.version.value, c.sim.output(props.id, 0)))
const isOne = (s?: Sig) => !!s && known(s) && s.v !== 0
const tone = (s?: Sig) => (!s || (!s.k && !s.e) ? 'text-secondary' : s.e ? 'text-error' : '')

// ── Interaction ─────────────────────────────────────────────────────────────────────────────────────────
const setValue = (v: number) => c.poke(props.id, { set: { value: v >>> 0 } })
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

// A plexer's trapezoid, facing east: wide on the side of its many pins, the narrow side's corners `slant` in
const trapezoid = computed(() => {
  const { w, h, slant = 12, wide } = g.value
  const l = 16
  const r = w - 16
  const t = 4
  const b = h - 4
  const pts = wide === 'left'
    ? [[l, t], [r, t + slant], [r, b - slant], [l, b]]
    : [[l, t + slant], [r, t], [r, b], [l, b - slant]]
  // Where the bottom and top edges cross the middle (sel and en come in there)
  return { d: `M${pts.map((q) => q.join(' ')).join(' L')} Z`, bottom: b - slant / 2, top: t + slant / 2 }
})
/** Text inside a turned part stays upright: turned back about its own anchor */
const DEG = { east: 0, south: 90, west: 180, north: 270 } as const
const upright = (x: number, y: number) => (DEG[at.value.facing] ? `rotate(${-DEG[at.value.facing]} ${x} ${y})` : undefined)
/** Turned upright again after half a turn, text runs the other way from its point: its anchor swaps to stay inside */
const anchor = (a: 'start' | 'end' | 'middle') => (at.value.facing === 'west' && a !== 'middle' ? (a === 'start' ? 'end' : 'start') : a)
/** The many-pins side's numbers (a mux's inputs, a demux's or decoder's outputs) */
const plexLabels = computed(() => {
  const pins = g.value.pins
  if (!pins) return []
  const left = g.value.wide === 'left'
  const list = left ? pins.ins.filter((q) => q.side === 'left') : pins.outs
  return list.map((q, i) => ({ x: left ? 21 : g.value.w - 21, y: q.y, text: String(i), anchor: left ? 'start' : 'end' }))
})
const negated = (i: number) => !!((params.value.negate ?? 0) & (1 << i))

// ── Probe ──
const probeText = (s: Sig) => {
  const r = params.value.radix ?? 'auto'
  if (r === 'auto') return format(s, widthOf(s) > 1 ? 'hex' : 'bin')
  if (!known(s)) return format(s, r === 'oct' ? 'hex' : r)
  if (r === 'oct') return s.v.toString(8)
  if (r === 'dec') return String(params.value.signed ? signedDec(s) : s.v)
  return format(s, r)
}

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
    const o = out0.value!
    return `[${a.v}] = ${format(o)}${params.value.asm && known(o) ? ` · ${disassemble(o.v)}` : ''}`
  }
  if (['register', 'counter', 'pc', 'shiftreg', 'random'].includes(k)) return format(out0.value!)
  if (['dff', 'tff', 'jkff'].includes(k)) return `Q = ${st.q ?? 0}`
  return ''
})
const title = computed(() => props.data.label || (props.data.kind === 'sub' ? getCircuit(params.value.circuit)?.name ?? 'Missing circuit' : def.value.label))
// A probe's value as signed decimal
const signedDec = (s: Sig) => (s.v >= 2 ** (widthOf(s) - 1) ? s.v - 2 ** widthOf(s) : s.v)
const bits = computed(() => params.value.width ?? 1)
// Inside a subcircuit instance an input pin has no state of its own: it shows what reaches it
const pinValue = computed(() => (state.value.value ?? (out0.value && known(out0.value) ? out0.value.v : 0)) & mask(bits.value))
</script>

<template>
  <div
    class="relative text-on-surface"
    :style="{ width: `${at.w}px`, height: `${at.h}px` }"
  >
    <!-- A label of your own over gates and I/O -->
    <div
      v-if="data.label && g.look !== 'box' && data.kind !== 'tunnel' && data.kind !== 'text'"
      class="pointer-events-none absolute bottom-full left-1/2 mb-0.5 -translate-x-1/2 text-label-small whitespace-nowrap text-on-surface-variant"
    >{{ data.label }}</div>

    <!-- Gate -->
    <svg v-if="g.look === 'gate'" :width="at.w" :height="at.h" class="absolute inset-0 overflow-visible"><g :transform="turn">
      <template v-for="(y, i) in g.inY" :key="i">
        <line x1="0" :y1="y" :x2="negated(i) ? 6 : 20" :y2="y" class="stroke-outline" stroke-width="2" />
        <circle v-if="negated(i)" cx="10" :cy="y" r="4" stroke-width="2" class="fill-surface" :class="selected ? 'stroke-primary' : 'stroke-on-surface-variant'" />
      </template>
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
    </g></svg>

    <!-- Plexer: a trapezoid, sel from the bottom, en from the top, turned whole like a gate -->
    <svg v-else-if="g.look === 'plexer'" :width="at.w" :height="at.h" class="absolute inset-0 overflow-visible"><g :transform="turn">
      <line v-for="(q, i) in g.pins!.ins.filter((q) => q.side === 'left')" :key="`l${i}`" x1="0" :y1="q.y" x2="18" :y2="q.y" class="stroke-outline" stroke-width="2" />
      <line v-for="(q, i) in g.pins!.outs" :key="`r${i}`" :x1="g.w - 18" :y1="q.y" :x2="g.w" :y2="q.y" class="stroke-outline" stroke-width="2" />
      <line x1="40" :y1="trapezoid.bottom" x2="40" :y2="g.h" class="stroke-outline" stroke-width="2" />
      <line v-if="params.enable" x1="40" y1="0" x2="40" :y2="trapezoid.top" class="stroke-outline" stroke-width="2" />
      <path
        :d="trapezoid.d"
        stroke-width="2"
        stroke-linejoin="round"
        class="fill-surface-container-high transition-[stroke] duration-200"
        :class="selected ? 'stroke-primary' : 'stroke-on-surface-variant'"
      />
      <text
        v-for="l in plexLabels"
        :key="l.y"
        :x="l.x"
        :y="l.y"
        :text-anchor="anchor(l.anchor as 'start' | 'end')"
        dominant-baseline="central"
        :transform="upright(l.x, l.y)"
        class="fill-on-surface-variant font-mono text-[10px]"
      >{{ l.text }}</text>
      <text x="40" :y="g.h / 2" text-anchor="middle" dominant-baseline="central" :transform="upright(40, g.h / 2)" class="fill-on-surface-variant text-[9px] font-medium tracking-wide">{{ data.kind === 'mux' ? 'MUX' : data.kind === 'demux' ? 'DMX' : 'DEC' }}</text>
      <text v-if="params.enable" x="44" :y="trapezoid.top + 7" :text-anchor="anchor('start')" dominant-baseline="central" :transform="upright(44, trapezoid.top + 7)" class="fill-on-surface-variant text-[8px]">en</text>
    </g></svg>

    <!-- A note: its label, nothing else -->
    <div
      v-else-if="data.kind === 'text'"
      class="absolute inset-0 flex items-center justify-center rounded-md px-2 text-center text-body-medium whitespace-pre text-on-surface"
      :class="selected ? 'ring-1 ring-primary' : 'ring-1 ring-transparent hover:ring-outline-variant'"
    ><span :class="!data.label && 'italic text-on-surface-variant'">{{ data.label || 'Text' }}</span></div>

    <!-- A box stood up (south or north): pins along the top and bottom, names written down them, the title across -->
    <div
      v-else-if="g.look === 'box' && vertical"
      class="absolute inset-0 rounded-md border bg-surface-container-low transition-[border-color,box-shadow] duration-200"
      :class="[selected ? 'border-primary ring-1 ring-primary' : 'border-outline-variant', data.kind === 'sub' && 'bg-tertiary-container/40']"
    >
      <div
        v-for="(pin, i) in pins.inputs"
        :key="`i${i}`"
        class="pointer-events-none absolute max-h-9 -translate-x-1/2 overflow-hidden text-label-small leading-none text-on-surface-variant [writing-mode:vertical-rl]"
        :style="{ left: `${at.ins[i]!.x}px`, [at.facing === 'south' ? 'top' : 'bottom']: '5px' }"
      >{{ pin.name }}</div>
      <div
        v-for="(pin, i) in pins.outputs"
        :key="`o${i}`"
        class="pointer-events-none absolute max-h-9 -translate-x-1/2 overflow-hidden text-label-small leading-none text-on-surface-variant [writing-mode:vertical-rl]"
        :style="{ left: `${at.outs[i]!.x}px`, [at.facing === 'south' ? 'bottom' : 'top']: '5px' }"
      >{{ pin.name }}</div>
      <div class="absolute inset-x-1.5 top-1/2 flex -translate-y-1/2 flex-col items-stretch gap-1">
        <div class="flex min-w-0 items-center justify-center gap-1.5" :class="data.kind === 'sub' && 'text-on-tertiary-container'">
          <MIcon :name="def.icon" :size="16" class="shrink-0 text-primary" />
          <span class="truncate text-label-large">{{ title }}</span>
        </div>
        <div v-if="stored" class="truncate rounded-sm bg-surface-container-highest px-1.5 py-0.5 text-center font-mono text-label-medium" :class="tone(out0)">{{ stored }}</div>
      </div>
    </div>

    <!-- Box -->
    <div
      v-else-if="g.look === 'box'"
      class="absolute inset-0 rounded-md border bg-surface-container-low transition-[border-color,box-shadow] duration-200"
      :class="selected ? 'border-primary ring-1 ring-primary' : 'border-outline-variant'"
    >
      <div class="flex h-8 items-center gap-1.5 border-b border-outline-variant px-2" :class="data.kind === 'sub' && 'bg-tertiary-container/60 text-on-tertiary-container rounded-t-md'">
        <MIcon :name="def.icon" :size="16" class="text-primary" />
        <span class="truncate text-label-large">{{ title }}</span>
      </div>
      <div
        v-for="(pin, i) in pins.inputs"
        :key="`i${i}`"
        class="pointer-events-none absolute -translate-y-1/2 text-label-small text-on-surface-variant"
        :class="west ? 'right-2' : 'left-2'"
        :style="{ top: `${g.inY[i]}px` }"
      >{{ pin.name }}<span v-if="pin.width > 1" class="opacity-60">[{{ pin.width }}]</span></div>
      <div
        v-for="(pin, i) in pins.outputs"
        :key="`o${i}`"
        class="pointer-events-none absolute -translate-y-1/2 text-label-small text-on-surface-variant"
        :class="west ? 'left-2' : 'right-2'"
        :style="{ top: `${g.outY[i]}px` }"
      >{{ pin.name }}<span v-if="pin.width > 1" class="opacity-60">[{{ pin.width }}]</span></div>
      <div
        v-if="stored"
        class="absolute inset-x-1.5 bottom-1.5 truncate rounded-sm bg-surface-container-highest px-1.5 py-0.5 text-center font-mono text-label-medium"
        :class="tone(out0)"
      >{{ stored }}</div>
      <DeviceView v-if="data.kind === 'screen' || data.kind === 'tty' || data.kind === 'keyboard'" :id="id" :data="data" />
      <SoundView v-else-if="data.kind === 'synth' || data.kind === 'pcm'" :id="id" :data="data" />
    </div>

    <!-- A wire point: a dot colored like the wire it ends -->
    <span
      v-else-if="data.kind === 'point'"
      class="absolute top-1/2 left-1/2 size-2.5 -translate-1/2 rounded-full transition-[background-color,box-shadow] duration-100"
      :class="[pointTone, selected && 'ring-2 ring-primary ring-offset-2 ring-offset-surface']"
    />

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
        <span class="truncate text-center text-title-medium" :class="tone(ins[0])">{{ probeText(ins[0]!) }}<span v-if="widthOf(ins[0]!) > 1 && known(ins[0]!) && (params.radix ?? 'auto') !== 'dec'" class="text-label-medium text-on-surface-variant"> = {{ params.signed ? signedDec(ins[0]!) : format(ins[0]!, 'dec') }}</span></span>
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
      <div v-else-if="data.kind === 'outpin'" class="ml-3 flex flex-col items-center font-mono">
        <span v-if="bits === 1" class="flex size-6 items-center justify-center rounded-full text-label-large" :class="isOne(ins[0]) ? 'bg-primary text-on-primary' : 'bg-surface-container-highest'">{{ format(ins[0]!) }}</span>
        <template v-else>
          <span class="text-title-small" :class="tone(ins[0])">0x{{ format(ins[0]!) }}</span>
          <span class="text-[10px] text-on-surface-variant">{{ format(ins[0]!, 'bin') }}</span>
        </template>
      </div>
      <div v-else-if="data.kind === 'pull'" class="flex items-center gap-0.5 font-mono text-label-large" :class="tone(out0)">
        <MIcon :name="params.pull ? 'vertical_align_top' : 'vertical_align_bottom'" :size="16" class="text-on-surface-variant" />{{ params.pull ? 1 : 0 }}
      </div>
      <div v-else-if="data.kind === 'tunnel'" class="flex min-w-0 items-center gap-1 px-4">
        <MIcon name="sell" :size="14" class="shrink-0 text-tertiary" />
        <span class="truncate font-mono text-label-large" :class="tone(out0)">{{ data.label || '…' }}</span>
      </div>
      <DeviceView v-else-if="data.kind === 'joypad'" :id="id" :data="data" />
      <SoundView v-else-if="data.kind === 'buzzer'" :id="id" :data="data" />
      <div v-else-if="data.kind === 'piano'" class="mr-10"><SoundView :id="id" :data="data" /></div>
      <template v-if="data.kind === 'seg7' || data.kind === 'piano' || (data.kind === 'joypad' && params.serial)">
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

    <!-- Keyed by the facing so a turned part's handles are measured again -->
    <!-- A selected wire point is moved by its dot, so its pins step aside; unselected, a drag from it extends it -->
    <MFlowHandle v-for="(p, i) in at.ins" :id="`i${i}`" :key="`i${i}${at.facing}`" type="target" :position="p.side" :style="handleStyle(p)" :connectable="!movable" />
    <MFlowHandle v-for="(p, i) in at.outs" :id="`o${i}`" :key="`o${i}${at.facing}`" type="source" :position="p.side" :style="handleStyle(p)" :connectable="!movable" />
  </div>
</template>
