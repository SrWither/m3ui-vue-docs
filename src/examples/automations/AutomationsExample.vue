<script setup lang="ts">
/*
 * Automations example (Relay): a workflow builder in the style of n8n or Zapier, built only with m3ui-vue. Drag
 * steps from the palette onto the canvas (or tap to add), connect them, set them up in the inspector, and test run
 * the workflow: each step lights up in turn, down the branch its condition takes, with a log of the run.
 * - components/TopBar.vue     logo, the workflow's name, tidy up, test run, theme, docs and source
 * - components/Palette.vue    the kinds of steps, to drag onto the canvas (they become nodes on the way, startDrag) or tap
 * - components/StepNode.vue   a step on the canvas, with its run status
 * - components/Inspector.vue  the selected step's settings
 * - components/RunLog.vue     the last run, over the canvas
 * - components/AddMenu.vue    what to add where a connection was dropped on nothing
 * - useWorkflow.ts / catalog.ts  the workflow, the test run, and the kinds of steps
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MBottomSheet, MFab, MIcon, MSideSheet, useToast, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import { MFlow, MFlowControls, MFlowMinimap, arrowPath, type FlowConnection, type FlowEdge, type FlowNode, type FlowSelection, type FlowXY } from '@m3ui-vue/m3ui-vue/flow'
import { kindById } from './catalog'
import { makeStep, newId, useWorkflow, type StepData } from './useWorkflow'
import TopBar from './components/TopBar.vue'
import Palette from './components/Palette.vue'
import StepNode from './components/StepNode.vue'
import Inspector from './components/Inspector.vue'
import RunLog from './components/RunLog.vue'
import AddMenu from './components/AddMenu.vue'

const w = useWorkflow()
const toast = useToast()
const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')
const compact = computed(() => widthClass.value === 'compact')

const flow = ref<InstanceType<typeof MFlow>>()
const canvas = ref<HTMLElement>()
const selection = ref<FlowSelection>({ nodes: [], edges: [] })
const selectedStep = computed(() => {
  const ids = selection.value.nodes
  return ids.length === 1 ? w.nodes.value.find((n) => n.id === ids[0]) : undefined
})
const inspectorOpen = computed({
  get: () => !!selectedStep.value,
  set: (v) => { if (!v) selection.value = { nodes: [], edges: [] } },
})
const paletteOpen = ref(false)

// Any edit after a run clears its colors
watch([w.nodes, w.edges], () => {
  w.edited.value = true
  if (!w.running.value) w.clearRun()
})

// ── Adding steps ────────────────────────────────────────────────────────────────────────────────────────
function add(kind: string, at: FlowXY, from?: { nodeId: string; handleId: string | null }) {
  const step = makeStep(kind, { x: at.x - 120, y: at.y - 36 })
  w.nodes.value = [...w.nodes.value, step]
  if (from) w.edges.value = [...w.edges.value, { id: newId('e'), type: 'flow', source: from.nodeId, sourceHandle: from.handleId, target: step.id }]
  selection.value = { nodes: [step.id], edges: [] }
}
function viewCenter(): FlowXY {
  const r = canvas.value!.getBoundingClientRect()
  return flow.value!.screenToFlow({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
}
function pick(kind: string) {
  paletteOpen.value = false
  // A little apart each time, so taps don't stack them
  const c = viewCenter()
  const n = w.nodes.value.length % 5
  add(kind, { x: c.x + n * 16, y: c.y + n * 16 })
}
// Dragging a step out of the palette: a ghost follows the pointer until it's over the canvas, where the step
// becomes a real node that MFlow drags on (startDrag), so it can be dropped straight onto an edge
const ghost = ref<{ kind: string; x: number; y: number } | null>(null)
let grabbed: { kind: string; id: number; x: number; y: number } | null = null
function onGrab(kind: string, e: PointerEvent) {
  grabbed = { kind, id: e.pointerId, x: e.clientX, y: e.clientY }
  window.addEventListener('pointermove', onGrabMove)
  window.addEventListener('pointerup', endGrab)
  window.addEventListener('pointercancel', endGrab)
}
function onGrabMove(e: PointerEvent) {
  if (!grabbed || e.pointerId !== grabbed.id) return
  if (!ghost.value && Math.hypot(e.clientX - grabbed.x, e.clientY - grabbed.y) < 6) return
  document.body.style.userSelect = 'none'
  const r = canvas.value!.getBoundingClientRect()
  if (e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) {
    const at = flow.value!.screenToFlow({ x: e.clientX, y: e.clientY })
    const step = makeStep(grabbed.kind, { x: at.x - 120, y: at.y - 36 })
    flow.value!.addNodes(step)
    flow.value!.startDrag(step.id, e)
    endGrab()
    return
  }
  ghost.value = { kind: grabbed.kind, x: e.clientX, y: e.clientY }
}
function endGrab() {
  window.removeEventListener('pointermove', onGrabMove)
  window.removeEventListener('pointerup', endGrab)
  window.removeEventListener('pointercancel', endGrab)
  document.body.style.userSelect = ''
  grabbed = null
  ghost.value = null
}
onBeforeUnmount(endGrab)

// A connection dropped on nothing offers a step there
const addMenu = ref<{ x: number; y: number; at: FlowXY; from: { nodeId: string; handleId: string | null } } | null>(null)
function onConnectEnd(e: { connection: FlowConnection | null; position: FlowXY; from: { nodeId: string; handleId: string | null; type: 'source' | 'target' } }) {
  if (e.connection || e.from.type !== 'source') return
  const p = flow.value!.flowToScreen(e.position)
  const r = canvas.value!.getBoundingClientRect()
  addMenu.value = { x: p.x - r.left, y: p.y - r.top, at: e.position, from: e.from }
}
function addFromMenu(kind: string) {
  const m = addMenu.value!
  addMenu.value = null
  add(kind, { x: m.at.x + 120, y: m.at.y }, m.from)
}

// Triggers have no input; a step can't feed itself back into a trigger
const isValidConnection = (c: FlowConnection) => kindById.get(w.nodes.value.find((n) => n.id === c.target)?.data?.kind ?? '')?.category !== 'trigger'

// ── Editing the selected step ───────────────────────────────────────────────────────────────────────────
function update(data: StepData) {
  const id = selectedStep.value!.id
  w.nodes.value = w.nodes.value.map((n) => (n.id === id ? { ...n, data } : n))
}
function duplicate() {
  const s = selectedStep.value!
  const copy: FlowNode<StepData> = { ...s, id: newId(), position: { x: s.position.x + 32, y: s.position.y + 96 }, data: { ...s.data!, label: `${s.data!.label} copy`, config: { ...s.data!.config } } }
  w.nodes.value = [...w.nodes.value, copy]
  selection.value = { nodes: [copy.id], edges: [] }
}
function remove() {
  flow.value!.remove({ nodes: [selectedStep.value!.id] })
}

// ── Running ─────────────────────────────────────────────────────────────────────────────────────────────
const showLog = ref(false)
async function run() {
  showLog.value = true
  const r = await w.run()
  if (!r) return
  if (r.ok) toast.success(`Test run finished in ${r.seconds.toFixed(1)} s`)
  else toast.error('The test run stopped: check the steps in red')
}
function closeLog() {
  showLog.value = false
  w.clearRun()
}

async function tidy() {
  await flow.value!.layout('layered', { direction: 'LR', gap: 48, levelGap: 72 })
  flow.value!.fitView()
}

// Ctrl+Enter runs, Ctrl+S "saves"
function onKey(e: KeyboardEvent) {
  if (!(e.ctrlKey || e.metaKey)) return
  if (e.key === 'Enter') {
    e.preventDefault()
    run()
  } else if (e.key.toLowerCase() === 's') {
    e.preventDefault()
    w.edited.value = false
    toast.info('Workflow saved')
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

// Edges: the default path, lit up while a run goes through them
const statusOf = (id: string) => w.status.get(id)
const edgeTone = (e: FlowEdge, selected: boolean) => w.activeEdges.has(e.id) ? 'stroke-primary relay-flowing' : selected ? 'stroke-primary' : 'stroke-outline'
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden text-on-surface" :class="wide ? 'bg-surface-container' : 'bg-surface'">
    <TopBar :wide="wide" @run="run" @tidy="tidy" />
    <div class="flex min-h-0 flex-1">
      <aside v-if="wide" class="mb-2 ml-2 w-64 shrink-0 overflow-y-auto rounded-2xl bg-surface">
        <Palette @pick="pick" @grab="onGrab" />
      </aside>

      <main ref="canvas" class="relative min-w-0 flex-1 overflow-hidden bg-surface" :class="wide && 'mx-2 mb-2 rounded-2xl'">
        <MFlow
          ref="flow"
          v-model:nodes="w.nodes.value"
          v-model:edges="w.edges.value"
          v-model:selection="selection"
          :default-edge-options="{ type: 'flow' }"
          :is-valid-connection="isValidConnection"
          fit-view
          label="Workflow"
          class="absolute inset-0"
          @connect-end="onConnectEnd"
        >
          <template #node-step="{ data, node }">
            <StepNode :data="data" :status="statusOf(node.id)" />
          </template>
          <template #node-branch="{ data, node }">
            <StepNode :data="data" :status="statusOf(node.id)" />
          </template>
          <template #edge-flow="{ edge, path, targetX, targetY, targetAngle, targetInset, selected }">
            <path :d="path" fill="none" stroke-width="2" stroke-linecap="round" class="transition-[stroke] duration-200" :class="edgeTone(edge, selected)" />
            <path
              :d="arrowPath(targetX - targetInset * Math.cos(targetAngle), targetY - targetInset * Math.sin(targetAngle), targetAngle, 9, true)"
              stroke-width="2"
              stroke-linejoin="round"
              class="transition-[stroke,fill] duration-200"
              :class="w.activeEdges.has(edge.id) || selected ? 'fill-primary stroke-primary' : 'fill-outline stroke-outline'"
            />
          </template>

          <MFlowControls history />
          <MFlowMinimap v-if="!compact" :node-color="(n) => statusOf(n.id) === 'done' ? 'var(--color-primary)' : statusOf(n.id) === 'failed' ? 'var(--color-error)' : undefined" />
          <RunLog v-if="showLog && w.log.value.length" @close="closeLog" />
          <AddMenu
            v-if="addMenu"
            :x="addMenu.x"
            :y="addMenu.y"
            :width="canvas?.clientWidth ?? 0"
            :height="canvas?.clientHeight ?? 0"
            @pick="addFromMenu"
            @close="addMenu = null"
          />
        </MFlow>

        <div v-if="!wide" class="absolute right-4 bottom-4 z-20">
          <MFab icon="add" label="Add a step" @click="paletteOpen = true" />
        </div>
      </main>

      <aside v-if="wide && selectedStep" class="mr-2 mb-2 w-80 shrink-0 overflow-hidden rounded-2xl bg-surface">
        <Inspector :key="selectedStep.id" :node="selectedStep" @update="update" @duplicate="duplicate" @delete="remove" @close="inspectorOpen = false" />
      </aside>
    </div>

    <MSideSheet v-if="!wide" v-model="inspectorOpen">
      <Inspector v-if="selectedStep" :key="selectedStep.id" :node="selectedStep" @update="update" @duplicate="duplicate" @delete="remove" @close="inspectorOpen = false" />
    </MSideSheet>
    <MBottomSheet v-if="!wide" v-model="paletteOpen" title="Add a step">
      <Palette @pick="pick" />
    </MBottomSheet>

    <Teleport to="body">
      <div
        v-if="ghost"
        class="pointer-events-none fixed z-50 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md border border-primary bg-surface px-3 py-2 shadow-elevation-4"
        :style="{ left: `${ghost.x}px`, top: `${ghost.y}px` }"
      >
        <MIcon :name="kindById.get(ghost.kind)!.icon" :size="20" class="text-primary" />
        <span class="text-title-small text-on-surface">{{ kindById.get(ghost.kind)!.label }}</span>
      </div>
    </Teleport>
  </div>
</template>

<style>
.relay-flowing {
  stroke-dasharray: 8 6;
  animation: relay-flow 500ms linear infinite;
}
@keyframes relay-flow {
  from { stroke-dashoffset: 14; }
  to { stroke-dashoffset: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .relay-flowing { animation: none; }
}
</style>
