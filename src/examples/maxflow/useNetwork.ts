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
    type: 'circle',
    position: { x: n.x, y: n.y },
    data: { label: n.label, kind: n.id === 's' ? 'source' : n.id === 't' ? 'sink' : 'inner' },
  }))
  edges.value = p.edges.map(([source, target, capacity]) => ({ id: `${source}-${target}`, source, target, data: { capacity } }))
}
load(presets.find((p) => p.id === 'clrs')!)

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
// What MFlow draws: the network dressed for the current step, with MFlow's own circle nodes and edge styles
const shownNodes = computed<FlowNode[]>(() => {
  const f = frame.value
  const visited = new Set(f && !f.done ? f.visited ?? [] : [])
  const blocked = new Set(f?.blocked ?? [])
  const side = new Set(f?.cut?.side ?? [])
  return nodes.value.map((n) => {
    const kind = n.data!.kind
    const badge = f?.excess ? f.excess[n.id] : f?.levels?.[n.id]
    return {
      ...n,
      data: {
        ...n.data,
        color: kind === 'source' ? 'tertiary' : kind === 'sink' ? 'primary' : side.has(n.id) ? 'secondary' : 'neutral',
        badge,
        ring: blocked.has(n.id) ? 'error' : visited.has(n.id) ? 'tertiary' : undefined,
      },
    }
  })
})
const shownEdges = computed<FlowEdge[]>(() => {
  const f = frame.value
  const path = new Map((f?.path ?? []).map((a) => [a.edge, a.dir]))
  const cut = new Set(f?.cut?.edges ?? [])
  return edges.value.map((e) => {
    const c = e.data?.capacity ?? 0
    if (!f) return { ...e, label: String(c) }
    const flow = f.flow[e.id] ?? 0
    const dir = path.get(e.id)
    const onCut = cut.has(e.id)
    const color = onCut ? 'error' : dir ? 'primary' : c > 0 && flow >= c ? 'tertiary' : flow > 0 ? 'color-mix(in srgb, var(--color-primary) 70%, transparent)' : 'outline'
    return {
      ...e,
      label: `${flow}/${c}`,
      labelTone: onCut ? 'error' : dir ? 'primary' : 'neutral',
      color,
      width: 2 + 5 * (c > 0 ? flow / c : 0),
      animated: dir === 'back' ? 'reverse' : !!dir,
      dashed: onCut,
    }
  })
})

const step = (d: number) => (index.value = Math.max(0, Math.min(frames.value.length - 1, index.value + d)))

export function useNetwork() {
  return { nodes, edges, shownNodes, shownEdges, presetId, algorithm, frames, index, net, running, frame, load, start, stop, step }
}
