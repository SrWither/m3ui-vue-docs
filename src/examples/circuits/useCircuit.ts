// The circuit being edited and its simulation. Module-level, so it survives going back to the docs.
// The structure (nodes, edges) is what MFlow edits and undoes; the signals live in the Simulator, outside Vue's
// reactivity, and `version` ticks once per frame when they've changed so the parts and wires redraw.
import { computed, ref, shallowRef, watch } from 'vue'
import type { FlowEdge } from '@m3ui-vue/m3ui-vue/flow'
import { presets, type Preset } from './presets'
import { X, type Sig } from './logic'
import { pinsOf, Simulator, type PartData, type PartNode } from './sim'
import { partByKind } from './parts'
import { setMuted } from './audio'
import { applyOp, type PokeOp } from './ops'
import { contains, setCircuitResolver, type CircuitDef } from './library'
import { cloneImage, decodeImage, encodeImage, hasImage, newImageId, setCells } from './memory'

/** A wire point snaps by its middle (its dot) */
const pointGrid = (kind: string) => (kind === 'point' ? { gridOffset: { x: 10, y: 10 } } : {})

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
/** Looking inside subcircuit instances, outermost first: the canvas shows the innermost one's circuit, live */
const inspecting = ref<{ id: string; name: string; circuit: string }[] | null>(null)
/** Ids on the canvas are this prefix plus the node's id in the simulation */
const prefix = computed(() => (inspecting.value ? inspecting.value.map((x) => x.id).join('/') + '/' : ''))
function inspect(nodeId: string) {
  const n = nodes.value.find((x) => x.id === nodeId)
  const def = circuits.value.find((x) => x.id === n?.data?.params.circuit)
  if (!n || !def) return
  if (!inspecting.value) stash()
  inspecting.value = [...(inspecting.value ?? []), { id: nodeId, name: n.data!.label || def.name, circuit: def.id }]
  nodes.value = def.nodes
  edges.value = def.edges
  version.value++
}
/** Back out to `depth` levels of instances (0: the circuit itself) */
function uninspect(depth = 0) {
  if (!inspecting.value) return
  const path = inspecting.value.slice(0, depth)
  if (path.length) {
    const def = circuits.value.find((x) => x.id === path[path.length - 1]!.circuit)!
    inspecting.value = path
    nodes.value = def.nodes
    edges.value = def.edges
    version.value++
    return
  }
  inspecting.value = null
  const def = circuits.value.find((x) => x.id === currentId.value)!
  nodes.value = def.nodes
  edges.value = def.edges
}
const sim = new Simulator()
/** The simulation's Worker while a fast clock runs there (see Turbo below); declared early, load() runs at import */
let worker: Worker | null = null
let gen = 0
let redraw = 0
const version = ref(0)
const playing = ref(false)
/** Clock frequency: full periods per second */
const hz = ref(2)
const ticks = ref(0)
const oscillating = ref(false)
/** Sound off (the sound parts keep simulating) */
const muted = ref(false)
watch(muted, (m) => setMuted(m))

// Only what changes the netlist rebuilds it: moving a part doesn't
const structure = computed(() =>
  // (turning a part doesn't either: its facing is left out)
  JSON.stringify([nodes.value.map((n) => [n.id, n.data && { ...n.data, facing: undefined }]), edges.value.map((e) => [e.source, e.sourceHandle, e.target, e.targetHandle])]),
)
watch(structure, async () => {
  // Looking inside an instance shows its circuit's nodes, but the simulation stays the whole circuit's
  if (inspecting.value) return
  // An edit while the Worker runs: take its state back, rebuild here, and hand it over again
  const turbo = !!worker
  if (turbo) await stopTurbo()
  ownImages()
  sim.build(nodes.value, edges.value)
  changed()
  if (turbo && wantTurbo()) startTurbo()
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

// ── Watched wires: a timing diagram of what they carried, one sample per half period ──────────────────────
// Kept outside Vue (a ring of samples per wire); `version` redraws the panel with the rest
export const TRACE_LEN = 96
const watches = shallowRef<string[]>([])
const traces = new Map<string, Sig[]>()
function watchWire(id: string, on = !watches.value.includes(id)) {
  if (on === watches.value.includes(id)) return
  watches.value = on ? [...watches.value, id] : watches.value.filter((x) => x !== id)
  if (on) traces.set(id, [])
  else traces.delete(id)
}
function clearTraces() {
  for (const id of watches.value) traces.set(id, [])
  version.value++
}
/** One sample of every watched wire */
function sample() {
  if (!watches.value.length) return
  for (const id of watches.value) {
    const e = edges.value.find((x) => x.id === id)
    const t = traces.get(id)
    if (!e || !t) continue
    t.push(sim.edgeSignal(e, prefix.value) ?? X(1))
    if (t.length > TRACE_LEN) t.splice(0, t.length - TRACE_LEN)
  }
}
const traceOf = (id: string) => traces.get(id) ?? []
// Another circuit (or a level of an instance) on the canvas: its wires aren't these
watch([currentId, prefix], () => {
  watches.value = []
  traces.clear()
})
// A watched wire deleted goes from the panel
watch(edges, (list) => {
  const ids = new Set(list.map((e) => e.id))
  if (watches.value.some((id) => !ids.has(id))) watches.value = watches.value.filter((id) => ids.has(id))
})

function changed() {
  oscillating.value = sim.oscillating
  if (sim.oscillating) playing.value = false
  version.value++
}

function load(p: Preset) {
  inspecting.value = null
  playing.value = false
  presetId.value = p.id
  ticks.value = 0
  if (p.hz) hz.value = p.hz
  const prep = (c: { nodes: PartNode[]; edges: FlowEdge[] }) => ({
    nodes: withImages(c.nodes.map((n) => ({ ...n, type: 'part', ...pointGrid(n.data!.kind), data: { ...n.data!, params: { ...n.data!.params } } }))),
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
  stopTurbo(false)
  const def = circuits.value.find((x) => x.id === id)!
  currentId.value = id
  nodes.value = def.nodes
  edges.value = def.edges
  sim.clear()
  sim.build(nodes.value, edges.value)
  if (def.state) sim.restore(def.state)
  changed()
}
/** What's on the canvas back into the project */
function stash() {
  circuits.value = circuits.value.map((x) => (x.id === currentId.value ? { ...x, nodes: nodes.value, edges: edges.value, state: sim.snapshot() } : x))
}
function openCircuit(id: string) {
  uninspect()
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
    sample()
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
// ── Turbo: fast clocks run in a Worker ──────────────────────────────────────────────────────────────────
// From TURBO_HZ (or Max) the simulation moves to simWorker.ts, so it runs all the time instead of 12 ms a frame and
// the page stays smooth. Each slice it sends the signals and the parts' light state; they're taken in as they come
// (so no screen update or sound sample is lost) and drawn once a frame. Pausing brings the whole state back.
const TURBO_HZ = 1000
const wantTurbo = () => playing.value && hz.value >= TURBO_HZ && typeof Worker !== 'undefined'
/** The circuit the simulation runs: the open one, even while looking inside an instance */
const runNodes = () => (inspecting.value ? circuits.value.find((x) => x.id === currentId.value)!.nodes : nodes.value)
const runEdges = () => (inspecting.value ? circuits.value.find((x) => x.id === currentId.value)!.edges : edges.value)
const plain = <T>(v: T): T => JSON.parse(JSON.stringify(v))
function startTurbo() {
  const g = ++gen
  const w = new Worker(new URL('./simWorker.ts', import.meta.url), { type: 'module' })
  worker = w
  window0 = performance.now()
  windowTicks = 0
  w.onmessage = (e) => {
    if (g !== gen) return
    const m = e.data
    if (m.type !== 'frame') return
    // PCM samples pile up until the speaker plays them; everything else is the Worker's latest
    for (const [id, st] of Object.entries(m.states as Record<string, any>)) {
      const mine = sim.state.get(id)
      if (mine && 'level' in mine && st.queue) st.queue = [...mine.queue, ...st.queue]
    }
    sim.importState(m)
    // At these speeds a sample per slice, not per tick
    sample()
    ticks.value += m.ticks
    windowTicks += m.ticks
    const now = performance.now()
    if (now - window0 >= 1000) {
      actualHz.value = (windowTicks / 2) * (1000 / (now - window0))
      window0 = now
      windowTicks = 0
    }
    if (sim.oscillating) playing.value = false
    if (!redraw) redraw = requestAnimationFrame(() => {
      redraw = 0
      changed()
    })
  }
  // The open circuit as it is now (not stashed: while looking inside an instance the canvas shows another one)
  const all = circuits.value.map((x) => (x.id === currentId.value && !inspecting.value ? { ...x, nodes: nodes.value, edges: edges.value } : x))
  w.postMessage({
    type: 'start',
    nodes: plain(runNodes()),
    edges: plain(runEdges().map(({ id, source, sourceHandle, target, targetHandle }) => ({ id, source, sourceHandle, target, targetHandle }))),
    circuits: plain(all.map(({ id, name, nodes, edges }) => ({ id, name, nodes, edges: edges.map(({ id, source, sourceHandle, target, targetHandle }) => ({ id, source, sourceHandle, target, targetHandle })) }))),
    state: sim.exportState(true),
    hz: hz.value,
  })
}
/** Stops the Worker; with `sync`, waits for its whole state (RAM included) first */
function stopTurbo(sync = true): Promise<void> {
  const w = worker
  worker = null
  if (!w) return Promise.resolve()
  const g = ++gen
  if (!sync) {
    w.terminate()
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    w.onmessage = (e) => {
      if (e.data.type !== 'final') return
      w.terminate()
      if (g === gen) {
        sim.importState(e.data)
        changed()
      }
      resolve()
    }
    w.postMessage({ type: 'stop' })
  })
}
watch([playing, hz], async () => {
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  actualHz.value = 0
  if (wantTurbo()) {
    if (worker) worker.postMessage({ type: 'hz', hz: hz.value })
    else startTurbo()
    return
  }
  if (worker) await stopTurbo()
  if (!playing.value || wantTurbo()) return
  last = window0 = performance.now()
  windowTicks = 0
  // The first half period right away, so a slow clock answers the button at once
  owed = 1
  frame = requestAnimationFrame(loop)
})

function step() {
  if (worker) return
  sim.tick()
  sample()
  ticks.value++
  changed()
}
/** A full period: up and down, so a rising edge happened */
function cycle() {
  step()
  step()
}
function reset() {
  const turbo = !!worker
  stopTurbo(false)
  sim.reset()
  for (const id of watches.value) traces.set(id, [])
  if (turbo && wantTurbo()) startTurbo()
  ticks.value = 0
  changed()
}
function poke(id: string, op: PokeOp) {
  if (worker) {
    // Shown at once here, simulated there
    applyOp(sim.state.get(id), op)
    worker.postMessage({ type: 'poke', id, op })
  } else sim.poke(id, op)
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
    ...pointGrid(k),
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
  edges: c.edges.map(({ id, source, sourceHandle, target, targetHandle, route, sourcePosition, targetPosition }) =>
    ({ id, source, sourceHandle, target, targetHandle, ...(route && { route }), ...(sourcePosition && { sourcePosition }), ...(targetPosition && { targetPosition }) })),
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
  return { watches, watchWire, traceOf, clearTraces, inspecting, prefix, inspect, uninspect, muted, nodes, edges, labelled, presetId, circuits, currentId, placeable, openCircuit, addCircuit, renameCircuit, deleteCircuit, usersOf, stash, sim, version, playing, hz, actualHz, ticks, oscillating, load, step, cycle, reset, poke, makePart, patchPart, toJSON, fromJSON, changed }
}
