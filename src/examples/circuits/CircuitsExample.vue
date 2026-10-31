<script setup lang="ts">
/*
 * Circuits example (Bitloom): a digital logic simulator in the spirit of Logisim, built only with m3ui-vue on MFlow.
 * Wire gates, plexers, an ALU, flip-flops, registers, a program counter, ROM and RAM (up to 16 MiB, loaded from .bin /
 * .hex files) into anything up to a CPU, build blocks once as subcircuits and place them many times, and watch it
 * run: every wire shows what it carries, live, as the clock ticks.
 * - parts.ts / logic.ts  every kind of part and the 0/1/Z/X bus logic they compute with
 * - sim.ts               the netlist and the event-driven propagation (unit delay, oscillation guard)
 * - useCircuit.ts        the circuit, its simulation and the clock; presets.ts the circuits to start from (Tiny8 CPU…)
 * - components/          PartView (a part on the canvas), Wire (a wire by its value), Palette, Inspector, TopBar
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { MButton, MIcon, MIconButton, MSideSheet, useToast, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import { MFlow, MFlowControls, MFlowMinimap, type FlowConnection, type FlowSelection } from '@m3ui-vue/m3ui-vue/flow'
import { useCircuit } from './useCircuit'
import { presets } from './presets'
import { geometry } from './geometry'
import { handleIndex, pinsOf, type PartNode } from './sim'
import PartView from './components/PartView.vue'
import Wire from './components/Wire.vue'
import Palette from './components/Palette.vue'
import Inspector from './components/Inspector.vue'
import TopBar from './components/TopBar.vue'

const c = useCircuit()
const toast = useToast()
const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')

const flow = ref<InstanceType<typeof MFlow>>()
const canvas = ref<HTMLElement>()
const palette = ref<InstanceType<typeof Palette>>()
const topBar = ref<InstanceType<typeof TopBar>>()
const selection = ref<FlowSelection>({ nodes: [], edges: [] })
const selectedNode = computed(() => (selection.value.nodes.length === 1 ? c.nodes.value.find((n) => n.id === selection.value.nodes[0]) : undefined))
const selectedEdge = computed(() => (!selectedNode.value && selection.value.edges.length === 1 ? c.edges.value.find((e) => e.id === selection.value.edges[0]) : undefined))
const paletteOpen = ref(false)
const inspectorOpen = ref(false)
const description = computed(() => presets.find((p) => p.id === c.presetId.value)?.description)
const main = computed(() => c.circuits.value[0])
const inSub = computed(() => main.value && c.currentId.value !== main.value.id)
const currentName = computed(() => c.circuits.value.find((x) => x.id === c.currentId.value)?.name)
watch(c.currentId, () => {
  selection.value = { nodes: [], edges: [] }
  setTimeout(() => flow.value?.fitView(), 60)
})
// Double-click a subcircuit to open it
// Double-click a subcircuit to look inside that instance, live
function onNodeDblclick(n: PartNode) {
  if (n.data?.kind === 'sub' && n.data.params.circuit) c.inspect(n.id)
}
watch(c.prefix, () => {
  selection.value = { nodes: [], edges: [] }
  setTimeout(() => flow.value?.fitView(), 60)
})

watch(c.presetId, (id) => {
  selection.value = { nodes: [], edges: [] }
  if (id) setTimeout(() => flow.value?.fitView(), 60)
})
watch(c.oscillating, (o) => { if (o) toast.error('Oscillation: the circuit never settles, so the clock stopped') })

// Only wires between pins of the same width
function isValidConnection(conn: FlowConnection) {
  const pins = (id: string) => {
    const n = c.nodes.value.find((x) => x.id === id)
    return n ? pinsOf(n.data!) : undefined
  }
  const from = pins(conn.source)?.outputs[handleIndex(conn.sourceHandle)]
  const to = pins(conn.target)?.inputs[handleIndex(conn.targetHandle)]
  return !!from && !!to && from.width === to.width
}
const edited = () => (c.presetId.value = '')

// ── Adding parts ────────────────────────────────────────────────────────────────────────────────────────
function centered(kind: string, at: { x: number; y: number }): PartNode {
  const n = c.makePart(kind, at)
  const g = geometry(n.data!)
  return { ...n, position: { x: Math.round((at.x - g.w / 2) / 20) * 20, y: Math.round((at.y - g.h / 2) / 20) * 20 } }
}
let offset = 0
function pick(kind: string) {
  if (c.inspecting.value) return toast.info('Inside an instance: edit its circuit to add parts')
  const s = flow.value!.size
  const v = flow.value!.viewport
  const n = centered(kind, { x: (s.width / 2 - v.x) / v.zoom + (offset % 5) * 20, y: (s.height / 2 - v.y) / v.zoom + (offset % 5) * 20 })
  offset++
  flow.value!.addNodes(n)
  selection.value = { nodes: [n.id], edges: [] }
  paletteOpen.value = false
  edited()
}
// A part pressed in the palette becomes a real one as soon as the pointer is over the canvas, and MFlow drags it
let grabbed: { kind: string; id: number } | null = null
function onGrab(kind: string, e: PointerEvent) {
  if (c.inspecting.value) return
  grabbed = { kind, id: e.pointerId }
  window.addEventListener('pointermove', onGrabMove)
  window.addEventListener('pointerup', endGrab)
  window.addEventListener('pointercancel', endGrab)
}
function onGrabMove(e: PointerEvent) {
  if (!grabbed || e.pointerId !== grabbed.id || !canvas.value) return
  const r = canvas.value.getBoundingClientRect()
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return
  const n = centered(grabbed.kind, flow.value!.screenToFlow({ x: e.clientX, y: e.clientY }))
  flow.value!.addNodes(n)
  selection.value = { nodes: [n.id], edges: [] }
  palette.value?.suppressClick()
  endGrab()
  edited()
  flow.value!.startDrag(n.id, e)
}
function endGrab() {
  grabbed = null
  window.removeEventListener('pointermove', onGrabMove)
  window.removeEventListener('pointerup', endGrab)
  window.removeEventListener('pointercancel', endGrab)
}
// Ctrl+S saves, Ctrl+O opens (Cmd on a Mac), wherever the focus is
function onKey(e: KeyboardEvent) {
  if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return
  const k = e.key.toLowerCase()
  if (k === 's') {
    e.preventDefault()
    save()
  } else if (k === 'o') {
    e.preventDefault()
    topBar.value?.pickFile()
  }
}
window.addEventListener('keydown', onKey)
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  endGrab()
  c.playing.value = false
})

function removeSelected() {
  flow.value?.remove({ nodes: selectedNode.value ? [selectedNode.value.id] : [], edges: selectedEdge.value ? [selectedEdge.value.id] : [] })
  inspectorOpen.value = false
}

// ── Saving ──────────────────────────────────────────────────────────────────────────────────────────────
function save() {
  const url = URL.createObjectURL(new Blob([c.toJSON()], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${c.presetId.value && c.presetId.value !== 'blank' ? c.presetId.value : 'circuit'}.json`
  a.click()
  URL.revokeObjectURL(url)
}
async function open(file: File) {
  try {
    c.fromJSON(await file.text())
    c.presetId.value = ''
    setTimeout(() => flow.value?.fitView(), 60)
    toast.success(`Opened ${file.name}`)
  } catch (err) {
    toast.error(`Couldn't open ${file.name}: ${(err as Error).message}`)
  }
}
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden text-on-surface" :class="wide ? 'bg-surface-container' : 'bg-surface'">
    <TopBar ref="topBar" :wide="wide" :can-inspect="!!(selectedNode || selectedEdge)" @save="save" @open="open" @palette="paletteOpen = true" @inspect="inspectorOpen = true" />
    <div class="flex min-h-0 flex-1">
      <aside v-if="wide" class="mb-2 ml-2 w-64 shrink-0 overflow-y-auto rounded-2xl bg-surface">
        <Palette ref="palette" @pick="pick" @grab="onGrab" />
      </aside>

      <main ref="canvas" class="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-surface" :class="wide && 'mx-2 mb-2 rounded-2xl'">
        <MFlow
          :key="c.currentId.value + c.prefix.value"
          :locked="!!c.inspecting.value"
          ref="flow"
          v-model:nodes="c.nodes.value"
          v-model:edges="c.edges.value"
          v-model:selection="selection"
          :default-edge-options="{ type: 'wire', pathType: 'smoothstep', markerEnd: 'none' }"
          edge-branching
          :is-valid-connection="isValidConnection"
          :zoom-on-double-click="false"
          :insert-on-edge="false"
          :min-zoom="0.15"
          background="dots"
          :grid-size="20"
          snap-to-grid
          history
          fit-view
          label="Circuit"
          class="absolute inset-0"
          @connect="edited"
          @delete="edited"
          @node-drag-stop="edited"
          @node-dblclick="onNodeDblclick"
        >
          <template #node-part="{ node, data, selected }">
            <PartView :id="c.prefix.value + node.id" :data="data" :selected="selected" />
          </template>
          <template #edge-wire="{ edge, selected, path, labelX, labelY }">
            <Wire v-bind="{ edge, selected, path, labelX, labelY }" />
          </template>

          <MFlowControls history />
          <MFlowMinimap v-if="wide" />
        </MFlow>

        <div v-if="c.inspecting.value && !c.oscillating.value" class="absolute top-3 left-3 flex flex-wrap items-center gap-1 rounded-full bg-secondary-container py-1 pr-1 pl-1 text-label-large text-on-secondary-container">
          <MIconButton icon="arrow_back" label="Back out of the instance" size="xs" @click="c.uninspect(c.inspecting.value.length - 1)" />
          <button type="button" class="hover:underline" @click="c.uninspect(0)">{{ currentName }}</button>
          <template v-for="(lvl, i) in c.inspecting.value" :key="i">
            <MIcon name="chevron_right" :size="16" />
            <button type="button" class="hover:underline" @click="c.uninspect(i + 1)">{{ lvl.name }}</button>
          </template>
          <span class="mx-1 text-label-medium opacity-70">live, read-only</span>
          <MButton variant="tonal" size="xs" icon="edit" @click="c.openCircuit(c.inspecting.value[c.inspecting.value.length - 1]!.circuit)">Edit circuit</MButton>
        </div>
        <div v-else-if="inSub && !c.oscillating.value" class="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-tertiary-container py-1 pr-3 pl-1 text-label-large text-on-tertiary-container">
          <MIconButton icon="arrow_back" :label="`Back to ${main!.name}`" size="xs" @click="c.openCircuit(main!.id)" />
          {{ main!.name }} <MIcon name="chevron_right" :size="16" /> {{ currentName }}
        </div>
        <div v-else-if="description && !c.oscillating.value" class="pointer-events-none absolute top-3 left-3 max-w-md rounded-lg bg-surface-container-high/90 px-3 py-2 text-body-small text-on-surface-variant backdrop-blur-sm">
          {{ description }}
        </div>
        <div v-if="c.oscillating.value" class="absolute top-3 left-3 flex max-w-md items-center gap-2 rounded-lg bg-error-container px-3 py-2 text-body-small text-on-error-container">
          Oscillation: a loop keeps flipping without settling. Break the loop, or press reset.
        </div>
      </main>

      <aside v-if="wide && (selectedNode || selectedEdge)" class="mr-2 mb-2 w-80 shrink-0 overflow-y-auto rounded-2xl bg-surface">
        <Inspector :key="selectedNode?.id ?? selectedEdge?.id" :node="selectedNode" :edge="selectedEdge" @remove="removeSelected" />
      </aside>
    </div>

    <template v-if="!wide">
      <MSideSheet v-model="paletteOpen" title="Parts">
        <Palette @pick="pick" @opened="paletteOpen = false" />
      </MSideSheet>
      <MSideSheet v-model="inspectorOpen" title="Settings">
        <Inspector v-if="selectedNode || selectedEdge" :node="selectedNode" :edge="selectedEdge" @remove="removeSelected" />
      </MSideSheet>
    </template>
  </div>
</template>
