// The circuit being edited and its simulation. Module-level, so it survives going back to the docs.
// The structure (nodes, edges) is what MFlow edits and undoes; the signals live in the Simulator, outside Vue's
// reactivity, and `version` ticks once per frame when they've changed so the parts and wires redraw.
import { computed, ref, shallowRef, watch } from 'vue'
import type { FlowEdge } from '@m3ui-vue/m3ui-vue/flow'
import { presets, type Preset } from './presets'
import { pinsOf, Simulator, type PartData, type PartNode } from './sim'
import { partByKind } from './parts'

const nodes = shallowRef<PartNode[]>([])
const edges = shallowRef<FlowEdge[]>([])
const presetId = ref('cpu')
const sim = new Simulator()
const version = ref(0)
const playing = ref(false)
/** Clock frequency: full periods per second */
const hz = ref(2)
const ticks = ref(0)
const oscillating = ref(false)

// Only what changes the netlist rebuilds it: moving a part doesn't
const structure = computed(() =>
  JSON.stringify([nodes.value.map((n) => [n.id, n.data]), edges.value.map((e) => [e.source, e.sourceHandle, e.target, e.targetHandle])]),
)
watch(structure, () => {
  sim.build(nodes.value, edges.value)
  changed()
})

// Wires leaving the same output carry the same value: only the first one shows it
const labelled = computed(() => {
  const seen = new Set<string>()
  const ids = new Set<string>()
  for (const e of edges.value) {
    const k = `${e.source}:${e.sourceHandle}`
    if (!seen.has(k)) ids.add(e.id)
    seen.add(k)
  }
  return ids
})

function changed() {
  oscillating.value = sim.oscillating
  if (sim.oscillating) playing.value = false
  version.value++
}

function load(p: Preset) {
  playing.value = false
  presetId.value = p.id
  ticks.value = 0
  if (p.hz) hz.value = p.hz
  nodes.value = p.nodes.map((n) => ({ ...n, data: { ...n.data!, params: { ...n.data!.params } } }))
  edges.value = p.edges.map((e) => ({ ...e, type: 'wire', pathType: 'smoothstep', markerEnd: 'none' }))
  sim.state.clear()
  sim.values.clear()
  sim.build(nodes.value, edges.value)
  if (p.state) sim.restore(p.state)
  changed()
}
load(presets[0]!)

// ── The clock ───────────────────────────────────────────────────────────────────────────────────────────
// Each frame runs the half periods due since the last one, but never for more than FRAME_BUDGET ms, so the page
// stays responsive; when the circuit can't keep up the backlog is dropped and `actualHz` says how fast it really
// went. `hz` Infinity runs as fast as it can.
const FRAME_BUDGET = 12
/** The frequency the clock really reached over the last second */
const actualHz = ref(0)
let frame = 0
let last = 0
let owed = 0
let window0 = 0
let windowTicks = 0
function loop(t: number) {
  if (!playing.value) return
  owed += hz.value === Infinity ? Infinity : ((t - last) / 1000) * hz.value * 2
  last = t
  const start = performance.now()
  let done = 0
  while (done < Math.floor(owed) && !sim.oscillating) {
    sim.tick()
    done++
    if ((done & 63) === 0 && performance.now() - start > FRAME_BUDGET) break
  }
  // Whatever didn't fit is dropped rather than piling up
  owed = hz.value === Infinity ? 0 : Math.min(owed - done, 1)
  if (done) {
    ticks.value += done
    changed()
  }
  windowTicks += done
  if (t - window0 >= 1000) {
    actualHz.value = (windowTicks / 2) * (1000 / (t - window0))
    window0 = t
    windowTicks = 0
  }
  frame = requestAnimationFrame(loop)
}
watch(playing, (on) => {
  cancelAnimationFrame(frame)
  actualHz.value = 0
  if (!on) return
  last = window0 = performance.now()
  windowTicks = 0
  // The first half period right away, so a slow clock answers the button at once
  owed = 1
  frame = requestAnimationFrame(loop)
})

function step() {
  sim.tick()
  ticks.value++
  changed()
}
/** A full period: up and down, so a rising edge happened */
function cycle() {
  step()
  step()
}
function reset() {
  sim.reset()
  ticks.value = 0
  changed()
}
function poke(id: string, change: (state: any) => void) {
  sim.poke(id, change)
  changed()
}

// ── Editing ─────────────────────────────────────────────────────────────────────────────────────────────
let added = 0
function makePart(kind: string, at: { x: number; y: number }): PartNode {
  return {
    id: `${kind}${Date.now().toString(36)}${added++}`,
    type: 'part',
    position: { x: Math.round(at.x / 20) * 20, y: Math.round(at.y / 20) * 20 },
    data: { kind, params: { ...partByKind.get(kind)!.params } },
  }
}
/** Changes a part's label or parameters; wires to pins that no longer exist go */
function patchPart(id: string, patch: { label?: string; params?: Partial<PartData['params']> }) {
  const next = nodes.value.map((n) =>
    n.id === id ? { ...n, data: { ...n.data!, ...(patch.label !== undefined && { label: patch.label }), params: { ...n.data!.params, ...patch.params } } } : n,
  )
  const node = next.find((n) => n.id === id)!
  const pins = pinsOf(node.data!)
  const ok = (e: FlowEdge) =>
    (e.source !== id || Number(e.sourceHandle?.slice(1)) < pins.outputs.length) && (e.target !== id || Number(e.targetHandle?.slice(1)) < pins.inputs.length)
  nodes.value = next
  if (!edges.value.every(ok)) edges.value = edges.value.filter(ok)
  presetId.value = ''
}

// ── Saving ──────────────────────────────────────────────────────────────────────────────────────────────
interface Saved { format: 'bitloom'; version: 1; nodes: PartNode[]; edges: FlowEdge[]; state: Record<string, { value: number }> }
function toJSON(): string {
  const saved: Saved = {
    format: 'bitloom',
    version: 1,
    nodes: nodes.value.map(({ id, type, position, data }) => ({ id, type, position, data })),
    edges: edges.value.map(({ id, source, sourceHandle, target, targetHandle }) => ({ id, source, sourceHandle, target, targetHandle })),
    state: sim.snapshot(),
  }
  return JSON.stringify(saved, null, 2)
}
function fromJSON(text: string) {
  const s = JSON.parse(text) as Saved
  if (s.format !== 'bitloom' || !Array.isArray(s.nodes) || !Array.isArray(s.edges)) throw new Error('Not a Bitloom circuit')
  if (s.nodes.some((n) => !partByKind.has(n.data?.kind))) throw new Error('Unknown part in the file')
  load({ id: '', name: '', description: '', nodes: s.nodes.map((n) => ({ ...n, type: 'part' })), edges: s.edges, state: s.state })
}

export function useCircuit() {
  return { nodes, edges, labelled, presetId, sim, version, playing, hz, actualHz, ticks, oscillating, load, step, cycle, reset, poke, makePart, patchPart, toJSON, fromJSON, changed }
}
