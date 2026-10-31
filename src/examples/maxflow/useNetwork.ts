// The network being edited and the run being watched. Module-level, so it survives going back to the docs.
import { computed, ref, shallowRef } from 'vue'
import type { FlowEdge, FlowNode } from '@m3ui-vue/m3ui-vue/flow'
import { presets, type Preset } from './presets'
import { run, type Algorithm, type Frame, type Net } from './maxflow'

export interface VertexData { label: string; kind: 'source' | 'sink' | 'inner' }
export interface EdgeData { capacity: number }

const nodes = shallowRef<FlowNode<VertexData>[]>([])
const edges = shallowRef<FlowEdge<EdgeData>[]>([])
const presetId = ref('clrs')
const algorithm = ref<Algorithm>('edmonds-karp')
const frames = shallowRef<Frame[]>([])
const index = ref(0)

function load(p: Preset) {
  presetId.value = p.id
  frames.value = []
  nodes.value = p.nodes.map((n) => ({
    id: n.id,
    type: 'vertex',
    position: { x: n.x, y: n.y },
    data: { label: n.label, kind: n.id === 's' ? 'source' : n.id === 't' ? 'sink' : 'inner' },
  }))
  edges.value = p.edges.map(([source, target, capacity]) => ({ id: `${source}-${target}`, type: 'net', source, target, data: { capacity } }))
}
load(presets[0]!)

const net = computed<Net | null>(() => {
  const source = nodes.value.find((n) => n.data?.kind === 'source')
  const sink = nodes.value.find((n) => n.data?.kind === 'sink')
  if (!source || !sink) return null
  return {
    nodes: nodes.value.map((n) => ({ id: n.id, label: n.data!.label })),
    edges: edges.value.map((e) => ({ id: e.id, source: e.source, target: e.target, capacity: e.data?.capacity ?? 0 })),
    source: source.id,
    sink: sink.id,
  }
})
const running = computed(() => frames.value.length > 0)
const frame = computed(() => frames.value[index.value] ?? null)

function start() {
  if (!net.value) return
  frames.value = run(algorithm.value, net.value)
  index.value = 0
}
function stop() {
  frames.value = []
  index.value = 0
}
const step = (d: number) => (index.value = Math.max(0, Math.min(frames.value.length - 1, index.value + d)))

export function useNetwork() {
  return { nodes, edges, presetId, algorithm, frames, index, net, running, frame, load, start, stop, step }
}
