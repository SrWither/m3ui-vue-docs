<script setup lang="ts">
/*
 * A wire (MFlow's `#edge-wire` slot), routed in right angles (`pathType: 'smoothstep'`) and colored by what it carries, as in Logisim:
 * 1 bright, 0 dim, a bus thicker with its value in hex, Z (nothing drives it) dashed, X (unknown or a clash) red.
 * Ends of different widths are an error too. With the wire animation on, current flows along a 1-bit wire that
 * carries a 1, from its source to its target, and a change runs along it as a pulse (slow clocks only:
 * at speed every wire would be pulsing all the time).
 */
import { computed, ref, watch } from 'vue'
import type { FlowEdge } from '@m3ui-vue/m3ui-vue/flow'
import { format, isZ, known, widthOf } from '../logic'
import { useCircuit } from '../useCircuit'

const props = defineProps<{
  edge: FlowEdge
  selected: boolean
  /** The route MFlow made for it (`pathType: 'smoothstep'`), which is also where it's hit */
  path: string
  labelX: number
  labelY: number
}>()
const c = useCircuit()
const look = computed(() => {
  c.version.value
  const s = c.sim.edgeSignal(props.edge, c.prefix.value)
  if (!s) {
    const { from, to } = c.sim.widthsOf(props.edge, c.prefix.value)
    return { stroke: 'var(--color-error)', width: 3, dash: '6 4', label: from && to ? `${from}≠${to} bits` : '' }
  }
  const bus = widthOf(s) > 1
  if (isZ(s)) return { stroke: 'var(--color-secondary)', width: bus ? 4 : 2, dash: '2 4', label: bus ? 'Z' : '' }
  if (!known(s) && s.e) return { stroke: 'var(--color-error)', width: bus ? 4 : 3, dash: '', label: bus ? format(s) : '' }
  if (bus) return { stroke: 'var(--color-tertiary)', width: 4, dash: '', label: format(s) }
  return s.v ? { stroke: 'var(--color-primary)', width: 3, dash: '', label: '' } : { stroke: 'color-mix(in srgb, var(--color-primary) 30%, var(--color-outline-variant))', width: 2, dash: '', label: '' }
})

// ── Current ─────────────────────────────────────────────────────────────────────────────────────────────
const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const signal = computed(() => (c.version.value, c.sim.edgeSignal(props.edge, c.prefix.value)))
/** Current flows while a 1-bit wire carries a 1 (a bus always holds some value: it only pulses when that changes) */
const flowing = computed(() => {
  const s = signal.value
  return c.wireFx.value && !reduced && !!s && known(s) && widthOf(s) === 1 && s.v !== 0
})
const pulseEl = ref<SVGPathElement>()
const key = (s: ReturnType<typeof c.sim.edgeSignal>) => (s ? `${s.v}:${s.k}:${s.e}` : '')
watch(() => key(signal.value), (now, before) => {
  const el = pulseEl.value
  if (!el || !before || now === before || !c.wireFx.value || reduced) return
  // At speed it would be every wire, every frame
  if (c.playing.value && c.hz.value > 20) return
  const length = el.getTotalLength()
  if (!length) return
  el.style.strokeDasharray = `18 ${length + 18}`
  el.animate(
    [{ strokeDashoffset: 18, opacity: 1 }, { strokeDashoffset: -length, opacity: 0.35 }],
    { duration: Math.min(700, 180 + length * 1.2), easing: 'cubic-bezier(0.2, 0, 0, 1)' },
  )
})
</script>

<template>
  <!-- Its own hit area, to know when the mouse is over it (the readout); a press still reaches MFlow's gestures -->
  <path
    :d="path"
    fill="none"
    stroke="transparent"
    stroke-width="14"
    style="pointer-events: stroke"
    @pointerenter="c.hoveredWire.value = edge.id"
    @pointerleave="c.hoveredWire.value === edge.id && (c.hoveredWire.value = null)"
  />
  <path v-if="selected" :d="path" fill="none" stroke-width="10" stroke-linecap="round" class="stroke-primary/20" />
  <path
    :d="path"
    fill="none"
    :stroke="look.stroke"
    :stroke-width="look.width"
    :stroke-dasharray="look.dash || undefined"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="transition-[stroke,stroke-width] duration-100"
  />
  <path v-if="flowing" :d="path" fill="none" :stroke-width="Math.max(1.5, look.width - 1.5)" stroke-linecap="round" class="wire-current" />
  <path ref="pulseEl" :d="path" fill="none" :stroke-width="look.width + 2" stroke-linecap="round" class="wire-pulse" />
  <text
    v-if="look.label && c.labelled.value.has(edge.id)"
    :x="labelX"
    :y="labelY - 6"
    text-anchor="middle"
    class="pointer-events-none fill-on-surface font-mono text-[11px] [paint-order:stroke] stroke-surface stroke-[3px]"
  >{{ look.label }}</text>
</template>

<style scoped>
/* Dashes of light moving from the source to the target */
.wire-current {
  stroke: color-mix(in srgb, var(--color-on-primary) 70%, transparent);
  stroke-dasharray: 2 14;
  animation: wire-current 0.9s linear infinite;
  pointer-events: none;
}
@keyframes wire-current {
  to { stroke-dashoffset: -16; }
}
/* Hidden until a change plays it (Web Animations, Wire's script) */
.wire-pulse {
  stroke: color-mix(in srgb, var(--color-primary) 55%, white);
  opacity: 0;
  pointer-events: none;
}
</style>
