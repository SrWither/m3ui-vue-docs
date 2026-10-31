<script setup lang="ts">
/*
 * An edge of the network, drawn by MFlow's #edge-flow slot: a straight line between the vertices' centers, trimmed
 * at their circles, as thick as the share of its capacity in use, with "flow/capacity" on it. The augmenting path
 * lights up and its dashes run the way the flow is pushed (against the edge when the path uses it backwards); at the
 * end the minimum cut's edges turn red. Opposite edges between the same two vertices sit side by side.
 */
import { computed } from 'vue'
import { arrowPath } from '@m3ui-vue/m3ui-vue/flow'

const props = defineProps<{
  /** The source vertex's center and the target's */
  from: { x: number; y: number }
  to: { x: number; y: number }
  capacity: number
  flow: number
  state: 'fwd' | 'back' | 'cut' | null
  selected: boolean
  /** Shifted sideways, px (when the opposite edge exists too) */
  offset: number
}>()

const R = 30
const geo = computed(() => {
  const dx = props.to.x - props.from.x
  const dy = props.to.y - props.from.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  // Perpendicular, for the side-by-side offset and the label
  const nx = -uy
  const ny = ux
  const o = props.offset
  const x1 = props.from.x + ux * R + nx * o
  const y1 = props.from.y + uy * R + ny * o
  const x2 = props.to.x - ux * (R + 2) + nx * o
  const y2 = props.to.y - uy * (R + 2) + ny * o
  const side = o === 0 ? 14 : Math.sign(o) * 16
  return { x1, y1, x2, y2, angle: Math.atan2(dy, dx), lx: (x1 + x2) / 2 + nx * side, ly: (y1 + y2) / 2 + ny * side }
})
const share = computed(() => (props.capacity > 0 ? props.flow / props.capacity : 0))
const tone = computed(() => {
  if (props.state === 'cut') return 'stroke-error'
  if (props.state) return 'stroke-primary'
  if (props.selected) return 'stroke-primary'
  if (props.capacity > 0 && props.flow >= props.capacity) return 'stroke-tertiary'
  return props.flow > 0 ? 'stroke-primary/70' : 'stroke-outline'
})
const fill = computed(() => tone.value.replace('stroke-', 'fill-'))
const text = computed(() => `${props.flow}/${props.capacity}`)
// The label's chip follows the state: one fill class each (two would fight over which comes last in the CSS)
const chip = computed(() => {
  if (props.state === 'cut') return { bg: 'fill-error-container', fg: 'fill-on-error-container' }
  if (props.state) return { bg: 'fill-primary-container', fg: 'fill-on-primary-container' }
  return { bg: 'fill-surface-container-high', fg: 'fill-on-surface-variant' }
})
</script>

<template>
  <g>
    <!-- Clicks on the line select the edge (the slot sits inside the edge's own group) -->
    <line :x1="geo.x1" :y1="geo.y1" :x2="geo.x2" :y2="geo.y2" stroke="transparent" stroke-width="16" :style="{ pointerEvents: 'stroke' }" class="cursor-pointer" />
    <line
      v-if="state === 'fwd' || state === 'back'"
      :x1="geo.x1" :y1="geo.y1" :x2="geo.x2" :y2="geo.y2"
      stroke-width="12" stroke-linecap="round" class="stroke-primary/20"
    />
    <line
      :x1="geo.x1" :y1="geo.y1" :x2="geo.x2" :y2="geo.y2"
      :stroke-width="2 + 5 * share"
      stroke-linecap="round"
      class="transition-[stroke,stroke-width] duration-300"
      :class="[tone, state === 'fwd' && 'flowlab-run', state === 'back' && 'flowlab-run-back', state === 'cut' && 'flowlab-cut']"
    />
    <path :d="arrowPath(geo.x2, geo.y2, geo.angle, 10, true)" stroke-width="1.5" stroke-linejoin="round" class="transition-[fill,stroke] duration-300" :class="[tone, fill]" />
    <g :transform="`translate(${geo.lx}, ${geo.ly})`">
      <rect :x="-(text.length * 4 + 8)" y="-10" :width="text.length * 8 + 16" height="20" rx="10" class="transition-[fill] duration-300" :class="chip.bg" />
      <text text-anchor="middle" dominant-baseline="central" class="font-mono text-label-medium" :class="chip.fg">{{ text }}</text>
    </g>
  </g>
</template>

<style>
.flowlab-run { stroke-dasharray: 10 6; animation: flowlab-run 450ms linear infinite; }
.flowlab-run-back { stroke-dasharray: 10 6; animation: flowlab-run 450ms linear infinite reverse; }
.flowlab-cut { stroke-dasharray: 6 4; }
@keyframes flowlab-run { from { stroke-dashoffset: 16; } to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) {
  .flowlab-run, .flowlab-run-back { animation: none; }
}
</style>
