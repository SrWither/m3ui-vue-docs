<script setup lang="ts">
/*
 * Max flow example (Flowlab): maximum flow, step by step, built only with m3ui-vue on MFlow. Edit a network (double
 * click to add a vertex, drag from one to connect, set capacities, pick the source and the sink) or start from a
 * preset, then watch Edmonds–Karp, Dinic or the wave algorithm solve it: augmenting paths light up as flow is pushed,
 * Dinic and wave show each phase's levels, wave its excess and blocked vertices, and the end marks a minimum cut.
 * Everything is drawn by MFlow itself: `circle` nodes and edges restyled declaratively (color, width, label tone,
 * animated, dashed) for each step.
 * - components/TopBar.vue     logo, presets, algorithm, theme, docs and source
 * - components/StepPanel.vue  the step controls and explanations, or the editing tools
 * - maxflow.ts                Edmonds–Karp, Dinic and wave, each recording a frame per step
 * - useNetwork.ts / presets.ts  the network, the run, how each step looks, and the networks to start from
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MSideSheet, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import { MFlow, MFlowControls, type FlowConnection, type FlowEdge, type FlowNode, type FlowSelection, type FlowXY } from '@m3ui-vue/m3ui-vue/flow'
import { useNetwork, type EdgeData, type VertexData } from './useNetwork'
import TopBar from './components/TopBar.vue'
import StepPanel from './components/StepPanel.vue'

const n = useNetwork()
const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')

const flow = ref<InstanceType<typeof MFlow>>()
const selection = ref<FlowSelection>({ nodes: [], edges: [] })
const selectedNode = computed(() => (selection.value.nodes.length === 1 ? n.nodes.value.find((x) => x.id === selection.value.nodes[0]) : undefined))
const selectedEdge = computed(() => (!selectedNode.value && selection.value.edges.length === 1 ? n.edges.value.find((x) => x.id === selection.value.edges[0]) : undefined))
const sheetOpen = ref(false)

watch(() => n.presetId.value, (id) => { if (id) setTimeout(() => flow.value?.fitView(), 50) })
watch(n.running, (r) => {
  if (r) selection.value = { nodes: [], edges: [] }
  playing.value = false
})

// ── Playing ─────────────────────────────────────────────────────────────────────────────────────────────
const playing = ref(false)
const speed = ref(1)
let timer: ReturnType<typeof setInterval> | undefined
watch([playing, speed], ([on]) => {
  clearInterval(timer)
  if (!on) return
  if (n.index.value >= n.frames.value.length - 1) n.index.value = 0
  timer = setInterval(() => {
    if (n.index.value >= n.frames.value.length - 1) playing.value = false
    else n.step(1)
  }, 1400 / speed.value)
})
onBeforeUnmount(() => clearInterval(timer))

// ── MFlow draws n.shownNodes / n.shownEdges (dressed for the step); edits come back stripped to the network ──
function onNodes(next: FlowNode[]) {
  n.nodes.value = next.map((x) => ({ id: x.id, type: 'circle', position: x.position, data: { label: x.data.label, kind: x.data.kind } as VertexData }))
}
function onEdges(next: FlowEdge[]) {
  n.edges.value = next.map((e) => ({ id: e.id, source: e.source, target: e.target, data: { capacity: (e.data as EdgeData | undefined)?.capacity ?? 5 } }))
}

// ── Editing ─────────────────────────────────────────────────────────────────────────────────────────────
const edited = () => (n.presetId.value = '')
function isValidConnection(c: FlowConnection) {
  // Nothing flows into the source or out of the sink
  const kind = (id: string) => n.nodes.value.find((x) => x.id === id)?.data?.kind
  return kind(c.target) !== 'source' && kind(c.source) !== 'sink'
}
let added = 0
function vertexAt(at: FlowXY): FlowNode<VertexData> {
  return { id: `x${Date.now().toString(36)}${added}`, type: 'circle', position: { x: at.x - 28, y: at.y - 28 }, data: { label: `u${++added}`, kind: 'inner' } }
}
// A double click on the canvas adds a vertex there
function addAt(at: FlowXY) {
  if (n.running.value) return
  const v = vertexAt(at)
  flow.value!.addNodes(v)
  selection.value = { nodes: [v.id], edges: [] }
  edited()
}
function addVertex() {
  const s = flow.value!.size
  const v = flow.value!.viewport
  addAt({ x: (s.width / 2 - v.x) / v.zoom + (added % 4) * 16, y: (s.height / 2 - v.y) / v.zoom })
}
// An edge dragged into empty space ends at a new vertex
function onConnectEnd(e: { connection: FlowConnection | null; position: FlowXY; from: { nodeId: string; type: 'source' | 'target' } }) {
  if (e.connection || e.from.type !== 'source' || n.nodes.value.find((x) => x.id === e.from.nodeId)?.data?.kind === 'sink') return
  const v = vertexAt(e.position)
  // Both in the same tick: MFlow's history takes them as one step
  n.nodes.value = [...n.nodes.value, v]
  n.edges.value = [...n.edges.value, { id: `e${v.id}`, source: e.from.nodeId, target: v.id, data: { capacity: 5 } }]
  selection.value = { nodes: [v.id], edges: [] }
  edited()
}
function patchVertex(patch: Partial<VertexData>) {
  const id = selectedNode.value!.id
  n.nodes.value = n.nodes.value.map((x) => {
    // Only one source and one sink: the old one becomes an ordinary vertex
    if (patch.kind && patch.kind !== 'inner' && x.id !== id && x.data!.kind === patch.kind) return { ...x, data: { ...x.data!, kind: 'inner' } }
    return x.id === id ? { ...x, data: { ...x.data!, ...patch } } : x
  })
  edited()
}
function setCapacity(value: number) {
  const id = selectedEdge.value!.id
  n.edges.value = n.edges.value.map((e) => (e.id === id ? { ...e, data: { capacity: Math.max(0, Math.round(value)) } } : e))
  edited()
}
function removeSelected() {
  flow.value?.remove({ nodes: selectedNode.value ? [selectedNode.value.id] : [], edges: selectedEdge.value ? [selectedEdge.value.id] : [] })
}

// On phones the panel is a sheet; selecting something while editing opens it
watch(selection, (s) => { if (!wide.value && !n.running.value && (s.nodes.length || s.edges.length)) sheetOpen.value = true })

// Space plays or pauses, ← → step (outside the canvas and fields)
const canvas = ref<HTMLElement>()
function onKey(e: KeyboardEvent) {
  const t = e.target as HTMLElement
  if (!n.running.value || canvas.value?.contains(t) || t.closest('input, textarea, [contenteditable]')) return
  if (e.key === ' ') { e.preventDefault(); playing.value = !playing.value }
  else if (e.key === 'ArrowRight') n.step(1)
  else if (e.key === 'ArrowLeft') n.step(-1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

const panel = { 'onVertex': patchVertex, 'onCapacity': setCapacity, 'onRemove': removeSelected, 'onAdd': addVertex }
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden text-on-surface" :class="wide ? 'bg-surface-container' : 'bg-surface'">
    <TopBar :wide="wide" />
    <div class="flex min-h-0 flex-1" :class="!wide && 'flex-col'">
      <main ref="canvas" class="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-surface" :class="wide && 'mb-2 ml-2 rounded-2xl'">
        <MFlow
          ref="flow"
          :nodes="n.shownNodes.value"
          :edges="n.shownEdges.value"
          v-model:selection="selection"
          :locked="n.running.value"
          :history="!n.running.value"
          :default-edge-options="{ data: { capacity: 5 } }"
          :is-valid-connection="isValidConnection"
          :edges-reconnectable="false"
          :zoom-on-double-click="false"
          fit-view
          label="Flow network"
          class="absolute inset-0"
          @update:nodes="onNodes"
          @update:edges="onEdges"
          @pane-dblclick="addAt"
          @connect="edited"
          @connect-end="onConnectEnd"
          @delete="edited"
        >
          <MFlowControls :lock="false" history />
        </MFlow>
      </main>

      <aside v-if="wide" class="mr-2 mb-2 ml-2 w-96 shrink-0 overflow-y-auto rounded-2xl bg-surface">
        <StepPanel v-model:playing="playing" v-model:speed="speed" :selected-node="selectedNode" :selected-edge="selectedEdge" v-bind="panel" />
      </aside>
      <section v-else class="max-h-[45%] shrink-0 overflow-y-auto border-t border-outline-variant">
        <StepPanel v-model:playing="playing" v-model:speed="speed" v-bind="panel" />
      </section>
    </div>

    <MSideSheet v-if="!wide" v-model="sheetOpen">
      <StepPanel v-if="selectedNode || selectedEdge" v-model:playing="playing" v-model:speed="speed" :selected-node="selectedNode" :selected-edge="selectedEdge" v-bind="panel" />
    </MSideSheet>
  </div>
</template>
