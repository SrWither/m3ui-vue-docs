<script setup lang="ts">
/*
 * Watched wires as a timing diagram, like Logisim Evolution's: one row per wire, its name and value now, and what
 * it carried over the last half periods (a 1-bit wire as a line high or low, a bus as cells with its value, Z dashed,
 * X red). Samples come from useCircuit, one per half period (one per slice of the Worker at fast clocks).
 */
import { computed } from 'vue'
import { MIconButton } from '@m3ui-vue/m3ui-vue'
import { format, isZ, known, widthOf, type Sig } from '../logic'
import { partByKind } from '../parts'
import { useCircuit, TRACE_LEN } from '../useCircuit'

const emit = defineEmits<{ select: [id: string] }>()
const c = useCircuit()
const STEP = 12
const ROW = 28

const name = (id: string) => {
  const n = c.nodes.value.find((x) => x.id === id)
  return n?.data?.label || partByKind.get(n?.data?.kind ?? '')?.label || id
}
const rows = computed(() => {
  c.version.value
  return c.watches.value.flatMap((id) => {
    const e = c.edges.value.find((x) => x.id === id)
    if (!e) return []
    const trace = [...c.traceOf(id)]
    const now = c.sim.edgeSignal(e, c.prefix.value)
    const pin = (nodeId: string, handle: string | null | undefined, outputs: boolean) => {
      const n = c.nodes.value.find((x) => x.id === nodeId)
      const d = n && partByKind.get(n.data!.kind)
      const list = d?.pins({ ...d.params, ...n!.data!.params })[outputs ? 'outputs' : 'inputs']
      const p = list?.[Number(handle?.slice(1) ?? 0)]
      return p && list!.length > 1 ? `.${p.name}` : ''
    }
    return [{ id, label: `${name(e.source)}${pin(e.source, e.sourceHandle, true)} → ${name(e.target)}${pin(e.target, e.targetHandle, false)}`, now, w: wave(trace) }]
  })
})

// The waveform of one row, right-aligned so the newest sample is at the right edge
function wave(trace: Sig[]) {
  const n = trace.length
  const x0 = (TRACE_LEN - n) * STEP
  const hi = 6
  const lo = ROW - 6
  const one = !trace.length || widthOf(trace[trace.length - 1]!) === 1
  if (one) {
    let d = ''
    let broken = true
    const odd: string[] = []
    trace.forEach((s, i) => {
      const x = x0 + i * STEP
      if (!known(s)) {
        odd.push(`M${x} ${ROW / 2} H${x + STEP}`)
        broken = true
        return
      }
      const y = s.v ? hi : lo
      d += broken ? ` M${x} ${y} H${x + STEP}` : ` V${y} H${x + STEP}`
      broken = false
    })
    return { one, d, odd: odd.join(' '), cells: [] as { x: number; w: number; text: string; tone: string }[] }
  }
  // A bus: a cell per run of the same value
  const cells: { x: number; w: number; text: string; tone: string }[] = []
  let i = 0
  while (i < n) {
    const s = trace[i]!
    let j = i + 1
    while (j < n && trace[j]!.v === s.v && trace[j]!.k === s.k && trace[j]!.e === s.e) j++
    cells.push({ x: x0 + i * STEP, w: (j - i) * STEP, text: format(s), tone: isZ(s) ? 'z' : known(s) ? '' : 'x' })
    i = j
  }
  return { one, d: '', odd: '', cells }
}
const width = TRACE_LEN * STEP
</script>

<template>
  <div class="flex max-h-[40%] flex-col border-t border-outline-variant bg-surface-container-low">
    <div class="flex items-center gap-2 py-1 pr-1 pl-3">
      <span class="text-title-small">Watched wires</span>
      <span class="text-label-small text-on-surface-variant">one sample per half period</span>
      <span class="flex-1" />
      <MIconButton icon="restart_alt" label="Clear the traces" size="xs" @click="c.clearTraces()" />
      <MIconButton icon="close" label="Stop watching every wire" size="xs" @click="c.watches.value = []" />
    </div>
    <div class="min-h-0 overflow-y-auto pb-1">
      <div v-for="r in rows" :key="r.id" class="flex items-center gap-2 px-2">
        <button type="button" class="w-44 shrink-0 truncate text-left text-label-medium hover:underline" :title="r.label" @click="emit('select', r.id)">{{ r.label }}</button>
        <span class="w-20 shrink-0 truncate text-right font-mono text-label-medium" :class="!r.now ? 'text-error' : !known(r.now) ? (isZ(r.now) ? 'text-secondary' : 'text-error') : ''">
          {{ r.now ? (widthOf(r.now) > 1 ? `0x${format(r.now)}` : format(r.now)) : '≠' }}
        </span>
        <!-- The newest sample at the right edge; older ones run off the left -->
        <div class="flex min-w-0 flex-1 justify-end overflow-hidden">
          <svg :width="width" :height="ROW" class="block shrink-0">
            <template v-if="r.w.one">
              <path :d="r.w.d" fill="none" stroke-width="2" class="stroke-primary" stroke-linejoin="round" />
              <path :d="r.w.odd" fill="none" stroke-width="2" stroke-dasharray="2 3" class="stroke-error" />
            </template>
            <template v-else><g v-for="(cell, i) in r.w.cells" :key="i">
              <path
                :d="`M${cell.x + 3} 5 H${cell.x + cell.w - 3} L${cell.x + cell.w} ${ROW / 2} L${cell.x + cell.w - 3} ${ROW - 5} H${cell.x + 3} L${cell.x} ${ROW / 2} Z`"
                stroke-width="1.5"
                :stroke-dasharray="cell.tone === 'z' ? '2 3' : undefined"
                :class="cell.tone === 'x' ? 'fill-error-container stroke-error' : cell.tone === 'z' ? 'fill-none stroke-secondary' : 'fill-tertiary-container stroke-tertiary'"
              />
              <text v-if="cell.w >= 24" :x="cell.x + cell.w / 2" :y="ROW / 2 + 4" text-anchor="middle" class="fill-on-surface font-mono text-[10px]">{{ cell.text }}</text>
            </g></template>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
