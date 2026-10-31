// The circuit being edited and its simulation. Module-level, so it survives going back to the docs.
// The structure (nodes, edges) is what MFlow edits and undoes; the signals live in the Simulator, outside Vue's
// reactivity, and `version` ticks once per frame when they've changed so the parts and wires redraw.
import { computed, ref, shallowRef, watch } from 'vue'
import type { FlowEdge } from '@m3ui-vue/m3ui-vue/flow'
import { presets, type Preset } from './presets'
import { pinsOf, Simulator, type PartData, type PartNode } from './sim'
import { partByKind } from './parts'
import { contains, setCircuitResolver, type CircuitDef } from './library'
import { cloneImage, decodeImage, encodeImage, hasImage, newImageId, setCells } from './memory'

// The circuit on the canvas: what MFlow edits
const nodes = shallowRef<PartNode[]>([])
const edges = shallowRef<FlowEdge[]>([])
const presetId = ref('cpu')
// Every circuit of the project; the one open keeps its nodes and edges in the refs above while it's open
const circuits = shallowRef<(CircuitDef & { state?: Record<string, { value: number }> })[]>([])
const currentId = ref('main')
const getCircuit = (id: string) => (id === currentId.value ? { id, name: current()?.name ?? '', nodes: nodes.value, edges: edges.value } : circuits.value.find((x) => x.id === id))
setCircuitResolver(getCircuit)
const current = () => circuits.value.find((x) => x.id === currentId.value)
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
  ownImages()
  sim.build(nodes.value, edges.value)
  changed()
})

// ROMs and RAMs name their image; a copied one gets its own copy of the image (else both would share it)
const imageOwner = new Map<string, string>()
function ownImages() {
  let patched = false
  const next = nodes.value.map((n) => {
    const k = n.data?.kind
    if (k !== 'rom' && k !== 'ram') return n
    const key = `${currentId.value}/${n.id}`
    const img = n.data!.params.image
    if (!img) {
      patched = true
      const id = newImageId()
      imageOwner.set(id, key)
      return { ...n, data: { ...n.data!, params: { ...n.data!.params, image: id } } }
    }
    const owner = imageOwner.get(img)
    if (!owner) imageOwner.set(img, key)
    else if (owner !== key && nodes.value.some((m) => `${currentId.value}/${m.id}` === owner && m.data?.params.image === img)) {
      patched = true
      const id = newImageId()
      cloneImage(img, id)
      imageOwner.set(id, key)
      return { ...n, data: { ...n.data!, params: { ...n.data!.params, image: id } } }
    }
    return n
  })
  if (patched) nodes.value = next
}
/** Inline `contents` (presets, old files) into images */
function withImages(list: PartNode[]): PartNode[] {
  return list.map((n) => {
    const p = n.data?.params
    if (!p || (n.data!.kind !== 'rom' && n.data!.kind !== 'ram') || (p.image && hasImage(p.image))) return n
    const id = p.image ?? newImageId()
    const def = partByKind.get(n.data!.kind)!
    const q = { ...def.params, ...p }
    setCells(id, p.contents ?? [], 2 ** (q.select ?? 4), q.addressing === 'byte' ? 8 : (q.width ?? 8))
    const { contents: _, ...rest } = p
    return { ...n, data: { ...n.data!, params: { ...rest, image: id } } }
  })
}

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
  const prep = (c: { nodes: PartNode[]; edges: FlowEdge[] }) => ({
    nodes: withImages(c.nodes.map((n) => ({ ...n, type: 'part', data: { ...n.data!, params: { ...n.data!.params } } }))),
    edges: c.edges.map((e) => ({ ...e, type: 'wire', pathType: 'smoothstep' as const, markerEnd: 'none' as const })),
  })
  const mainId = p.mainId ?? 'main'
  const main = { id: mainId, name: p.mainName ?? 'Main', ...prep(p), state: p.state }
  circuits.value = [main, ...(p.circuits ?? []).map((c) => ({ ...c, ...prep(c) }))]
  imageOwner.clear()
  show(p.open ?? mainId)
}
/** Puts a circuit on the canvas, simulated on its own (its input pins are yours to flip) */
function show(id: string) {
  const def = circuits.value.find((x) => x.id === id)!
  currentId.value = id
  nodes.value = def.nodes
  edges.value = def.edges
  sim.state.clear()
  sim.values.clear()
  sim.build(nodes.value, edges.value)
  if (def.state) sim.restore(def.state)
  changed()
}
/** What's on the canvas back into the project */
function stash() {
  circuits.value = circuits.value.map((x) => (x.id === currentId.value ? { ...x, nodes: nodes.value, edges: edges.value, state: sim.snapshot() } : x))
}
function openCircuit(id: string) {
  if (id === currentId.value || !circuits.value.some((x) => x.id === id)) return
  playing.value = false
  stash()
  show(id)
}
let made = 0
function addCircuit(name: string) {
  stash()
  const id = `c${Date.now().toString(36)}${made++}`
  circuits.value = [...circuits.value, { id, name, nodes: [], edges: [] }]
  presetId.value = ''
  playing.value = false
  show(id)
  return id
}
function renameCircuit(id: string, name: string) {
  circuits.value = circuits.value.map((x) => (x.id === id ? { ...x, name } : x))
}
/** The circuits that place `id` as a subcircuit */
function usersOf(id: string) {
  stash()
  return circuits.value.filter((x) => x.id !== id && x.nodes.some((n) => n.data?.kind === 'sub' && n.data.params.circuit === id))
}
function deleteCircuit(id: string) {
  if (circuits.value.length < 2 || usersOf(id).length) return false
  const rest = circuits.value.filter((x) => x.id !== id)
  circuits.value = rest
  if (id === currentId.value) show(rest[0]!.id)
  return true
}
/** Circuits that can go inside the open one (not itself, nor one that already holds it) */
const placeable = computed(() => circuits.value.filter((x) => x.id !== currentId.value && !contains(x.id, currentId.value)))
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
/** A new part; `sub:<circuit>` places that circuit as a subcircuit */
function makePart(kind: string, at: { x: number; y: number }): PartNode {
  const circuit = kind.startsWith('sub:') ? kind.slice(4) : undefined
  const k = circuit ? 'sub' : kind
  return {
    id: `${k}${Date.now().toString(36)}${added++}`,
    type: 'part',
    position: { x: Math.round(at.x / 20) * 20, y: Math.round(at.y / 20) * 20 },
    data: { kind: k, params: { ...partByKind.get(k)!.params, ...(circuit && { circuit }) }, ...(k === 'tunnel' && { label: 'net' }) },
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
// Version 2: every circuit of the project, and the memories' images (base64, trailing zeros left out)
interface SavedCircuit { id: string; name: string; nodes: PartNode[]; edges: FlowEdge[]; state?: Record<string, { value: number }> }
interface Saved {
  format: 'bitloom'
  version: 1 | 2
  nodes?: PartNode[]
  edges?: FlowEdge[]
  state?: Record<string, { value: number }>
  circuits?: SavedCircuit[]
  open?: string
  images?: Record<string, { n: number; bytes: number; data: string }>
}
const slim = (c: SavedCircuit): SavedCircuit => ({
  id: c.id,
  name: c.name,
  nodes: c.nodes.map(({ id, type, position, data }) => ({ id, type, position, data })),
  edges: c.edges.map(({ id, source, sourceHandle, target, targetHandle }) => ({ id, source, sourceHandle, target, targetHandle })),
  state: c.state,
})
function toJSON(): string {
  stash()
  const images: Saved['images'] = {}
  for (const c of circuits.value) for (const n of c.nodes) {
    const img = n.data?.params.image
    if (img && !images[img]) {
      const e = encodeImage(img)
      if (e) images[img] = e
    }
  }
  const saved: Saved = { format: 'bitloom', version: 2, circuits: circuits.value.map(slim), open: currentId.value, images }
  return JSON.stringify(saved, null, 2)
}
function fromJSON(text: string) {
  const s = JSON.parse(text) as Saved
  if (s.format !== 'bitloom') throw new Error('Not a Bitloom circuit')
  const list: SavedCircuit[] = s.circuits ?? [{ id: 'main', name: 'Main', nodes: s.nodes ?? [], edges: s.edges ?? [], state: s.state }]
  if (!list.length || list.some((c) => !Array.isArray(c.nodes) || !Array.isArray(c.edges))) throw new Error('Not a Bitloom circuit')
  if (list.some((c) => c.nodes.some((n) => !partByKind.has(n.data?.kind ?? '')))) throw new Error('Unknown part in the file')
  for (const [id, img] of Object.entries(s.images ?? {})) decodeImage(id, img)
  const [main, ...rest] = list
  load({
    id: '', name: '', description: '', mainId: main!.id, mainName: main!.name, nodes: main!.nodes, edges: main!.edges, state: main!.state,
    circuits: rest, open: s.open && list.some((c) => c.id === s.open) ? s.open : undefined,
  })
}

export function useCircuit() {
  return { nodes, edges, labelled, presetId, circuits, currentId, placeable, openCircuit, addCircuit, renameCircuit, deleteCircuit, usersOf, stash, sim, version, playing, hz, actualHz, ticks, oscillating, load, step, cycle, reset, poke, makePart, patchPart, toJSON, fromJSON, changed }
}
