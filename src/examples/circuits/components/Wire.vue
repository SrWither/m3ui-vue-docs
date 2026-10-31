<script setup lang="ts">
/*
 * A wire (MFlow's `#edge-wire` slot), routed in right angles (`pathType: 'smoothstep'`) and colored by what it carries, as in Logisim:
 * 1 bright, 0 dim, a bus thicker with its value in hex, Z (nothing drives it) dashed, X (unknown or a clash) red.
 * Ends of different widths are an error too.
 */
import { computed } from 'vue'
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
  const s = c.sim.edgeSignal(props.edge)
  if (!s) {
    const { from, to } = c.sim.widthsOf(props.edge)
    return { stroke: 'var(--color-error)', width: 3, dash: '6 4', label: from && to ? `${from}≠${to} bits` : '' }
  }
  const bus = widthOf(s) > 1
  if (isZ(s)) return { stroke: 'var(--color-secondary)', width: bus ? 4 : 2, dash: '2 4', label: bus ? 'Z' : '' }
  if (!known(s) && s.e) return { stroke: 'var(--color-error)', width: bus ? 4 : 3, dash: '', label: bus ? format(s) : '' }
  if (bus) return { stroke: 'var(--color-tertiary)', width: 4, dash: '', label: format(s) }
  return s.v ? { stroke: 'var(--color-primary)', width: 3, dash: '', label: '' } : { stroke: 'color-mix(in srgb, var(--color-primary) 30%, var(--color-outline-variant))', width: 2, dash: '', label: '' }
})
</script>

<template>
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
  <text
    v-if="look.label && c.labelled.value.has(edge.id)"
    :x="labelX"
    :y="labelY - 6"
    text-anchor="middle"
    class="pointer-events-none fill-on-surface font-mono text-[11px] [paint-order:stroke] stroke-surface stroke-[3px]"
  >{{ look.label }}</text>
</template>
