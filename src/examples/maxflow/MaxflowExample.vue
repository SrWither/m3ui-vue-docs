<script setup lang="ts">
/*
 * Max flow example (Flowlab): maximum flow, step by step, built only with m3ui-vue on MFlow. Edit a network (move
 * vertices, draw edges, set capacities, pick the source and the sink) or start from a preset, then watch
 * Edmonds–Karp or Dinic solve it: every augmenting path lights up as flow is pushed, Dinic shows each phase's levels,
 * and the end marks a minimum cut. Step back and forth, or play it.
 * - components/TopBar.vue     logo, presets, algorithm, theme, docs and source
 * - components/Vertex.vue     a vertex (#node-vertex): source, sink, reached, level, side of the cut
 * - components/NetEdge.vue    an edge (#edge-net): flow/capacity, the path, the cut
 * - components/StepPanel.vue  the step controls and explanations, or the editing tools
 * - maxflow.ts                Edmonds–Karp and Dinic, each recording a frame per step
 * - useNetwork.ts / presets.ts  the network, the run, and the networks to start from
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MSideSheet, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import { MFlow, MFlowControls, type FlowConnection, type FlowEdge, type FlowNode, type FlowSelection } from '@m3ui-vue/m3ui-vue/flow'
import { useNetwork, type EdgeData, type VertexData } from './useNetwork'
import TopBar from './components/TopBar.vue'
import Vertex from './components/Vertex.vue'
import NetEdge from './components/NetEdge.vue'
import StepPanel from './components/StepPanel.vue'

const n = useNetwork()
const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')

const flow = ref<InstanceType<typeof MFlow>>()
const canvas = ref<HTMLElement>()
const selection = ref<FlowSelection>({ nodes: [], edges: [] })
const selectedNode = computed(() => (selection.value.nodes.length === 1 ? n.nodes.value.find((x) => x.id === selection.value.nodes[0]) : undefined))
const selectedEdge = computed(() => (!selectedNode.value && selection.value.edges.length === 1 ? n.edges.value.find((x) => x.id === selection.value.edges[0]) : undefined))
const sheetOpen = ref(false)

// A new network, or a run that starts, refits the view; a run clears the selection
watch(() => n.presetId.value, () => setTimeout(() => flow.value?.fitView(), 50))
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

// ── What the current step shows ─────────────────────────────────────────────────────────────────────────
const flowOf = (id: string) => n.frame.value?.flow[id] ?? 0
const pathDir = computed(() => new Map((n.frame.value?.path ?? []).map((a) => [a.edge, a.dir])))
const cut = computed(() => new Set(n.frame.value?.cut?.edges ?? []))
const cutSide = computed(() => new Set(n.frame.value?.cut?.side ?? []))
const visited = computed(() => new Set(n.frame.value?.visited ?? []))
function edgeState(id: string) {
  if (cut.value.has(id)) return 'cut' as const
  return pathDir.value.get(id) ?? null
}
// Opposite edges between the same two vertices sit side by side
const pairs = computed(() => new Set(n.edges.value.map((e) => `${e.source}>${e.target}`)))
const offsetOf = (e: FlowEdge) => (pairs.value.has(`${e.target}>${e.source}`) ? 7 : 0)

// ── Editing ─────────────────────────────────────────────────────────────────────────────────────────────
// Nothing flows into the source or out of the sink
function isValidConnection(c: FlowConnection) {
  const kind = (id: string) => n.nodes.value.find((x) => x.id === id)?.data?.kind
  return kind(c.target) !== 'source' && kind(c.source) !== 'sink'
}
function patchVertex(patch: Partial<VertexData>) {
  const id = selectedNode.value!.id
  n.nodes.value = n.nodes.value.map((x) => {
    // Only one source and one sink: the old one becomes an ordinary vertex
    if (patch.kind && patch.kind !== 'inner' && x.id !== id && x.data!.kind === patch.kind) return { ...x, data: { ...x.data!, kind: 'inner' } }
    return x.id === id ? { ...x, data: { ...x.data!, ...patch } } : x
  })
  n.presetId.value = ''
}
function setCapacity(value: number) {
  const id = selectedEdge.value!.id
  n.edges.value = n.edges.value.map((e) => (e.id === id ? { ...e, data: { capacity: Math.max(0, Math.round(value)) } } : e))
  n.presetId.value = ''
}
function removeSelected() {
  flow.value?.remove({ nodes: selectedNode.value ? [selectedNode.value.id] : [], edges: selectedEdge.value ? [selectedEdge.value.id] : [] })
}
let added = 0
function addVertex() {
  const r = canvas.value!.getBoundingClientRect()
  const c = flow.value!.screenToFlow({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
  const id = `x${Date.now().toString(36)}`
  const node: FlowNode<VertexData> = { id, type: 'vertex', position: { x: c.x - 28 + (added % 4) * 16, y: c.y - 28 + (added % 4) * 16 }, data: { label: `u${++added}`, kind: 'inner' } }
  flow.value!.addNodes(node)
  selection.value = { nodes: [id], edges: [] }
  n.presetId.value = ''
}
// Any edit makes it a network of your own
const edited = () => (n.presetId.value = '')

// On phones the panel is a sheet; selecting something while editing opens it
watch(selection, (s) => { if (!wide.value && !n.running.value && (s.nodes.length || s.edges.length)) sheetOpen.value = true })

// Space plays or pauses, ← → step (outside the canvas and fields)
function onKey(e: KeyboardEvent) {
  const t = e.target as HTMLElement
  if (!n.running.value || canvas.value?.contains(t) || t.closest('input, textarea, [contenteditable]')) return
  if (e.key === ' ') { e.preventDefault(); playing.value = !playing.value }
  else if (e.key === 'ArrowRight') n.step(1)
  else if (e.key === 'ArrowLeft') n.step(-1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden text-on-surface" :class="wide ? 'bg-surface-container' : 'bg-surface'">
    <TopBar :wide="wide" />
    <div class="flex min-h-0 flex-1" :class="!wide && 'flex-col'">
      <main ref="canvas" class="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-surface" :class="wide && 'mb-2 ml-2 rounded-2xl'">
        <MFlow
          ref="flow"
          v-model:nodes="n.nodes.value"
          v-model:edges="n.edges.value"
          v-model:selection="selection"
          :locked="n.running.value"
          :default-edge-options="{ type: 'net', data: { capacity: 5 } }"
          :is-valid-connection="isValidConnection"
          :edges-reconnectable="false"
          :insert-on-edge="false"
          :zoom-on-double-click="false"
          fit-view
          label="Flow network"
          class="absolute inset-0"
          @connect="edited"
          @delete="edited"
        >
          <template #node-vertex="{ node, selected }">
            <Vertex
              :label="node.data.label"
              :kind="node.data.kind"
              :selected="selected"
              :editing="!n.running.value"
              :visited="visited.has(node.id) && !n.frame.value?.done"
              :level="n.frame.value?.levels?.[node.id]"
              :cut-side="cutSide.has(node.id)"
            />
          </template>
          <template #edge-net="{ edge, sourceX, sourceY, targetX, targetY, selected }">
            <!-- The source handle sits on the vertex's right edge, 28px from its center; the target handle at the center -->
            <NetEdge
              :from="{ x: sourceX - 28, y: sourceY }"
              :to="{ x: targetX, y: targetY }"
              :capacity="(edge.data as EdgeData).capacity"
              :flow="flowOf(edge.id)"
              :state="edgeState(edge.id)"
              :selected="selected"
              :offset="offsetOf(edge)"
            />
          </template>
          <MFlowControls :lock="false" history />
        </MFlow>
      </main>

      <aside v-if="wide" class="mr-2 mb-2 ml-2 w-96 shrink-0 overflow-y-auto rounded-2xl bg-surface">
        <StepPanel
          v-model:playing="playing"
          v-model:speed="speed"
          :selected-node="selectedNode"
          :selected-edge="selectedEdge"
          @vertex="patchVertex"
          @capacity="setCapacity"
          @remove="removeSelected"
          @add="addVertex"
        />
      </aside>
      <section v-else class="max-h-[45%] shrink-0 overflow-y-auto border-t border-outline-variant">
        <StepPanel
          v-model:playing="playing"
          v-model:speed="speed"
          @vertex="patchVertex"
          @capacity="setCapacity"
          @remove="removeSelected"
          @add="addVertex"
        />
      </section>
    </div>

    <MSideSheet v-if="!wide" v-model="sheetOpen">
      <StepPanel
        v-if="selectedNode || selectedEdge"
        v-model:playing="playing"
        v-model:speed="speed"
        :selected-node="selectedNode"
        :selected-edge="selectedEdge"
        @vertex="patchVertex"
        @capacity="setCapacity"
        @remove="removeSelected"
        @add="addVertex"
      />
    </MSideSheet>
  </div>
</template>
