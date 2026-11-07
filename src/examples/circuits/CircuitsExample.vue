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
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MButton, MDialog, MIcon, MIconButton, MSideSheet, MTextField, useToast, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import { MFlow, MFlowControls, MFlowMinimap, type FlowConnection, type FlowEdge, type FlowPosition, type FlowSelection, type FlowXY } from '@m3ui-vue/m3ui-vue/flow'
import { useCircuit } from './useCircuit'
import { presets } from './presets'
import { canTurn, placed, turned } from './geometry'
import { partByKind } from './parts'
import { handleIndex, pinsOf, type PartNode } from './sim'
import PartView from './components/PartView.vue'
import Wire from './components/Wire.vue'
import Palette from './components/Palette.vue'
import Inspector from './components/Inspector.vue'
import TopBar, { type EditAction } from './components/TopBar.vue'
import Gallery from './components/Gallery.vue'
import Tutorial from './components/Tutorial.vue'
import TruthTableDialog from './components/TruthTableDialog.vue'
import { resolvedColors, schematicSVG } from './schematic'
import { screenPixel, SIDE } from './geometry'
import type { ScreenState } from './devices'
import WatchPanel from './components/WatchPanel.vue'
import { format, known, widthOf } from './logic'

const c = useCircuit()
const toast = useToast()
const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')

const flow = ref<InstanceType<typeof MFlow>>()
const canvas = ref<HTMLElement>()
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

// A preset loaded: nothing selected, the whole circuit in view. (An edit clears presetId too, and mustn't drop the
// selection it just made, e.g. a part added from the palette)
watch(c.presetId, (id) => {
  if (!id) return
  selection.value = { nodes: [], edges: [] }
  setTimeout(() => flow.value?.fitView(), 60)
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
  const g = placed(n.data!)
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
// A part pressed in the palette: a ghost follows the pointer until it's over the canvas, where the part becomes a
// real one that MFlow drags on (startDrag)
const ghost = ref<{ kind: string; x: number; y: number } | null>(null)
let grabbed: { kind: string; id: number; x: number; y: number } | null = null
function onGrab(kind: string, e: PointerEvent) {
  if (c.inspecting.value) return
  grabbed = { kind, id: e.pointerId, x: e.clientX, y: e.clientY }
  window.addEventListener('pointermove', onGrabMove)
  window.addEventListener('pointerup', endGrab)
  window.addEventListener('pointercancel', endGrab)
  if (e.pointerType !== 'touch') return
  // A finger grabbed it (short press or sideways drag): the ghost shows at once and the sheet gets out of the way
  ghost.value = { kind, x: e.clientX, y: e.clientY }
  paletteOpen.value = false
  blockTouch(e)
}
// The finger's moves mustn't scroll the palette or the page until it's lifted (also while MFlow drags the part).
// Touchmoves go to where the touch began, even after the sheet closed and took that button away, so they're
// cancelled there as well as on window
let touchBlock: { id: number; targets: EventTarget[] } | null = null
const preventTouch = (e: Event) => e.cancelable && e.preventDefault()
function blockTouch(e: PointerEvent) {
  unblockTouch()
  touchBlock = { id: e.pointerId, targets: [e.target!, window] }
  for (const t of touchBlock.targets) t.addEventListener('touchmove', preventTouch, { passive: false })
  window.addEventListener('pointerup', onTouchEnd)
  window.addEventListener('pointercancel', onTouchEnd)
}
function onTouchEnd(e: PointerEvent) {
  if (touchBlock && e.pointerId === touchBlock.id) unblockTouch()
}
function unblockTouch() {
  for (const t of touchBlock?.targets ?? []) t.removeEventListener('touchmove', preventTouch)
  touchBlock = null
  window.removeEventListener('pointerup', onTouchEnd)
  window.removeEventListener('pointercancel', onTouchEnd)
}
function onGrabMove(e: PointerEvent) {
  if (!grabbed || e.pointerId !== grabbed.id || !canvas.value) return
  if (!ghost.value && Math.hypot(e.clientX - grabbed.x, e.clientY - grabbed.y) < 6) return
  document.body.style.userSelect = 'none'
  const r = canvas.value.getBoundingClientRect()
  if (e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) {
    const n = centered(grabbed.kind, flow.value!.screenToFlow({ x: e.clientX, y: e.clientY }))
    flow.value!.addNodes(n)
    selection.value = { nodes: [n.id], edges: [] }
    endGrab()
    edited()
    flow.value!.startDrag(n.id, e)
    return
  }
  ghost.value = { kind: grabbed.kind, x: e.clientX, y: e.clientY }
}
function endGrab() {
  grabbed = null
  ghost.value = null
  document.body.style.userSelect = ''
  window.removeEventListener('pointermove', onGrabMove)
  window.removeEventListener('pointerup', endGrab)
  window.removeEventListener('pointercancel', endGrab)
}
const ghostDef = computed(() => {
  const k = ghost.value?.kind
  if (!k) return null
  if (k.startsWith('sub:')) return { icon: 'developer_board', label: c.circuits.value.find((x) => x.id === k.slice(4))?.name ?? 'Subcircuit' }
  return partByKind.get(k) ?? null
})
// Ctrl+S saves, Ctrl+O opens (Cmd on a Mac), wherever the focus is
function onKey(e: KeyboardEvent) {
  const typing = (e.target as HTMLElement | null)?.closest?.('input, textarea, select, [contenteditable]')
  if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === 'r' && selection.value.nodes.length) {
    e.preventDefault()
    rotate(e.shiftKey)
    return
  }
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
  unblockTouch()
  c.playing.value = false
})

// ── Turning parts (R, Shift+R back, or the inspector) ───────────────────────────────────────────────────
// About their middle, snapped to the grid. Wires to them lose their own route, which was laid out for the old sides
function rotate(back = false, ids = selection.value.nodes) {
  if (c.inspecting.value) return
  const turn = new Set(ids.filter((id) => {
    const n = c.nodes.value.find((x) => x.id === id)
    return n?.data && canTurn(n.data)
  }))
  if (!turn.size || !flow.value) return
  flow.value.change({
    nodes: c.nodes.value.map((n) => {
      if (!turn.has(n.id)) return n
      const before = placed(n.data!)
      const data = { ...n.data!, facing: turned(n.data!.facing, back) }
      const after = placed(data)
      const snap = (v: number) => Math.round(v / 20) * 20
      return { ...n, data, position: { x: snap(n.position.x + (before.w - after.w) / 2), y: snap(n.position.y + (before.h - after.h) / 2) } }
    }),
    edges: c.edges.value.map((e) => (e.route && (turn.has(e.source) || turn.has(e.target)) ? unrouted(e) : e)),
  })
  edited()
}
const unrouted = ({ route: _, ...e }: FlowEdge): FlowEdge => e
function straighten(id: string) {
  flow.value?.updateEdge(id, unrouted)
  edited()
}

// ── A wire dropped on nothing leaves a loose end there (a wire point), to wire on from later ────────────
let made = 0
function onConnectEnd({ connection, position, from }: { connection: FlowConnection | null; position: FlowXY; from: { nodeId: string; handleId: string | null; type: 'source' | 'target' } }) {
  if (connection || c.inspecting.value || !flow.value) return
  // On a part (a pin it can't join, or where it started): nothing
  if (overPart(position)) return
  const n = c.nodes.value.find((x) => x.id === from.nodeId)
  if (!n) return
  const pins = pinsOf(n.data!)
  const pin = (from.type === 'source' ? pins.outputs : pins.inputs)[handleIndex(from.handleId)]
  if (!pin) return
  const x = Math.round(position.x / 20) * 20
  const y = Math.round(position.y / 20) * 20
  const point = wirePoint({ x, y }, pin.width)
  const ends = from.type === 'source'
    ? { source: from.nodeId, sourceHandle: from.handleId, target: point.id, targetHandle: 'i0' }
    : { source: point.id, sourceHandle: 'o0', target: from.nodeId, targetHandle: from.handleId }
  const wire: FlowEdge = { id: wireId(), type: 'wire', pathType: 'smoothstep', markerEnd: 'none', ...ends }
  flow.value.change({ nodes: [...c.nodes.value, point], edges: [...c.edges.value, wire] })
  edited()
}

// ── Branching off a wire, as in Logisim: the wire splits where it was grabbed, at a wire point (a junction), and
// the branch leaves from there (to the pin it was dropped on, or to a loose end) ──────────────────────────────────
const wireId = () => `w${Date.now().toString(36)}${made++}`
function wirePoint(at: FlowXY, width: number): PartNode {
  const base = c.makePart('point', at)
  return { ...base, position: { x: at.x - 10, y: at.y - 10 }, data: { ...base.data!, params: { ...base.data!.params, width } } }
}
const OPPOSITE = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const
const look = { type: 'wire', pathType: 'smoothstep' as const, markerEnd: 'none' as const }
/**
 * A wire cut in two at a wire point. It runs on straight through it, as it did (its way in and out pinned, and its own
 * route kept on each side); the half up to it keeps the wire's id, and a watch on it
 */
function splitWire(wire: FlowEdge, point: string, direction: FlowPosition, routes?: { before: number[]; after: number[] }) {
  const before: FlowEdge = { ...unrouted(wire), target: point, targetHandle: 'i0', targetPosition: OPPOSITE[direction], ...(routes && { route: routes.before }) }
  const after: FlowEdge = {
    ...look, id: wireId(), source: point, sourceHandle: 'o0', sourcePosition: direction, target: wire.target, targetHandle: wire.targetHandle,
    ...(wire.targetPosition && { targetPosition: wire.targetPosition }), ...(routes && { route: routes.after }),
  }
  return { before, after }
}
function onBranch({ edge, connection, position, direction, end, routes }: { edge: FlowEdge; connection: FlowConnection | null; position: FlowXY; direction: FlowPosition; end: FlowXY; routes?: { before: number[]; after: number[] } }) {
  if (c.inspecting.value || !flow.value) return
  const wire = c.edges.value.find((e) => e.id === edge.id)
  const src = c.nodes.value.find((n) => n.id === edge.source)
  if (!wire || !src) return
  // Dropped on a part, but not on a pin it can join: nothing
  if (!connection && overPart(end)) return
  const width = pinsOf(src.data!).outputs[handleIndex(edge.sourceHandle)]?.width ?? 1
  const junction = wirePoint(position, width)
  const { before, after } = splitWire(wire, junction.id, direction, routes)
  const nodes = [...c.nodes.value, junction]
  const added: FlowEdge[] = [after]
  if (connection) added.push({ ...look, id: wireId(), source: junction.id, sourceHandle: 'o0', target: connection.target, targetHandle: connection.targetHandle })
  else {
    const loose = wirePoint({ x: Math.round(end.x / 20) * 20, y: Math.round(end.y / 20) * 20 }, width)
    nodes.push(loose)
    added.push({ ...look, id: wireId(), source: junction.id, sourceHandle: 'o0', target: loose.id, targetHandle: 'i0' })
  }
  flow.value.change({ nodes, edges: [...c.edges.value.map((e) => (e.id === wire.id ? before : e)), ...added] })
  edited()
}
// ── A wire point dropped on another one joins it; dropped on a wire, it splits the wire there ──────────────
const pointWidth = (n: PartNode) => n.data!.params.width ?? 1
const centerOf = (n: PartNode) => {
  const g = placed(n.data!)
  return { x: n.position.x + g.w / 2, y: n.position.y + g.h / 2 }
}
// ── A part's pin on a wire point joins them, as in Logisim ─────────────────────────────────────────────
interface PinSpot { node: PartNode; input: boolean; i: number; x: number; y: number; width: number }
function pinSpots(n: PartNode): PinSpot[] {
  const g = placed(n.data!)
  const pins = pinsOf(n.data!)
  const at = (p: { x: number; y: number }) => ({ x: n.position.x + p.x, y: n.position.y + p.y })
  return [
    ...g.ins.map((p, i) => ({ node: n, input: true, i, ...at(p), width: pins.inputs[i]?.width ?? 1 })),
    ...g.outs.map((p, i) => ({ node: n, input: false, i, ...at(p), width: pins.outputs[i]?.width ?? 1 })),
  ]
}
const near = (a: FlowXY, b: FlowXY) => Math.hypot(a.x - b.x, a.y - b.y) < 6
/**
 * Joins a pin to a wire point at the same spot. A loose end (wires only into it, for an input pin; only out of it, for
 * an output) goes and its wires run to the pin itself; a point with wires both ways stays, wired to the pin
 */
function joinPin(pin: PinSpot, point: PartNode, nodes: PartNode[], edges: FlowEdge[]) {
  if (pin.width !== pointWidth(point)) {
    toast.error(`Can't join a ${pointWidth(point)}-bit wire to a ${pin.width}-bit pin`)
    return { nodes, edges }
  }
  const handle = `${pin.input ? 'i' : 'o'}${pin.i}`
  const into = edges.filter((e) => e.target === point.id)
  const outOf = edges.filter((e) => e.source === point.id)
  if (pin.input ? !outOf.length : !into.length) {
    const next = edges.map((e) => {
      if (pin.input && e.target === point.id) {
        const { targetPosition: _, route: __, ...rest } = e
        return { ...rest, target: pin.node.id, targetHandle: handle }
      }
      if (!pin.input && e.source === point.id) {
        const { sourcePosition: _, route: __, ...rest } = e
        return { ...rest, source: pin.node.id, sourceHandle: handle }
      }
      return e
    })
    return { nodes: nodes.filter((n) => n.id !== point.id), edges: next }
  }
  const wire: FlowEdge = pin.input
    ? { ...look, id: wireId(), source: point.id, sourceHandle: 'o0', target: pin.node.id, targetHandle: handle }
    : { ...look, id: wireId(), source: pin.node.id, sourceHandle: handle, target: point.id, targetHandle: 'i0' }
  const dup = edges.some((e) => e.source === wire.source && e.sourceHandle === wire.sourceHandle && e.target === wire.target && e.targetHandle === wire.targetHandle)
  return { nodes, edges: dup ? edges : [...edges, wire] }
}
/** Parts dropped with a pin on a wire point: joined */
function joinParts(ids: string[]) {
  let nodes = c.nodes.value
  let edges = c.edges.value
  for (const id of ids) {
    const n = nodes.find((x) => x.id === id)
    if (!n || n.data?.kind === 'point') continue
    for (const pin of pinSpots(n)) {
      const point = nodes.find((x) => x.data?.kind === 'point' && near(centerOf(x), pin))
      if (point) ({ nodes, edges } = joinPin(pin, point, nodes, edges))
    }
  }
  if (nodes !== c.nodes.value || edges !== c.edges.value) flow.value!.change({ nodes, edges })
}

function onDragStop({ nodes: dragged }: { nodes: PartNode[] }) {
  edited()
  if (!flow.value) return
  if (dragged.length !== 1 || dragged[0]!.data?.kind !== 'point') return joinParts(dragged.map((n) => n.id))
  const d = c.nodes.value.find((n) => n.id === dragged[0]!.id)
  if (!d) return
  const at = centerOf(d)
  const other = c.nodes.value.find((n) => n.id !== d.id && n.data?.kind === 'point' && Math.hypot(centerOf(n).x - at.x, centerOf(n).y - at.y) < 6)
  if (other) {
    if (pointWidth(other) !== pointWidth(d)) return toast.error(`Can't join a ${pointWidth(d)}-bit wire to a ${pointWidth(other)}-bit one`)
    // Its wires move over to the other point (one between the two goes, as does a second copy of the same wire)
    const seen = new Set<string>()
    const edges = c.edges.value
      .map((e) => (e.source === d.id ? { ...e, source: other.id } : e.target === d.id ? { ...e, target: other.id } : e))
      .filter((e) => {
        const k = `${e.source}:${e.sourceHandle}>${e.target}:${e.targetHandle}`
        if (e.source === e.target || seen.has(k)) return false
        seen.add(k)
        return true
      })
    flow.value.change({ nodes: c.nodes.value.filter((n) => n.id !== d.id), edges })
    selection.value = { nodes: [other.id], edges: [] }
    return
  }
  // On a part's pin: joined to it
  const pin = c.nodes.value.filter((n) => n.data?.kind !== 'point').flatMap(pinSpots).find((p) => near(p, at))
  if (pin) {
    const { nodes, edges } = joinPin(pin, d, c.nodes.value, c.edges.value)
    if (nodes !== c.nodes.value || edges !== c.edges.value) flow.value.change({ nodes, edges })
    return
  }
  const hit = flow.value.getEdgeAt(at, { radius: 14, ignore: (e) => e.source === d.id || e.target === d.id })
  if (!hit) return
  const wire = c.edges.value.find((e) => e.id === hit.edge.id)
  const src = wire && c.nodes.value.find((n) => n.id === wire.source)
  if (!wire || !src) return
  const width = pinsOf(src.data!).outputs[handleIndex(wire.sourceHandle)]?.width ?? 1
  if (width !== pointWidth(d)) return toast.error(`Can't join a ${pointWidth(d)}-bit wire to a ${width}-bit one`)
  const { before, after } = splitWire(wire, d.id, hit.direction, hit.routes)
  const g = placed(d.data!)
  flow.value.change({
    nodes: c.nodes.value.map((n) => (n.id === d.id ? { ...n, position: { x: hit.position.x - g.w / 2, y: hit.position.y - g.h / 2 } } : n)),
    edges: [...c.edges.value.map((e) => (e.id === wire.id ? before : e)), after],
  })
}
// Dropped on a part (a wire point only counts by its dot, so a wire can end a step from one)
const overPart = (p: FlowXY) => c.nodes.value.some((n) => {
  const g = placed(n.data!)
  const m = n.data?.kind === 'point' ? 0 : 8
  return p.x > n.position.x - m && p.x < n.position.x + g.w + m && p.y > n.position.y - m && p.y < n.position.y + g.h + m
})

// ── Hovering a wire shows what it carries, without selecting it ─────────────────────────────────────────
// Which wire is under the mouse comes from the wire itself (Wire.vue, MFlow's #edge-wire slot); here only where the
// pointer is, to place the readout
const hover = ref<{ id: string; x: number; y: number } | null>(null)
function onCanvasMove(e: PointerEvent) {
  const id = c.hoveredWire.value
  if (e.pointerType === 'touch' || e.buttons || !id) return (hover.value = null)
  const r = canvas.value!.getBoundingClientRect()
  hover.value = { id, x: e.clientX - r.left, y: e.clientY - r.top }
}
const hovered = computed(() => {
  c.version.value
  const h = hover.value
  const e = h && c.edges.value.find((x) => x.id === h.id)
  if (!h || !e) return null
  const s = c.sim.edgeSignal(e, c.prefix.value)
  const name = (id: string) => {
    const n = c.nodes.value.find((x) => x.id === id)
    return n?.data?.label || partByKind.get(n?.data?.kind ?? '')?.label || id
  }
  const route = `${name(e.source)} → ${name(e.target)}`
  if (!s) return { ...h, route, value: 'widths differ', tone: 'text-error' }
  const bits = widthOf(s)
  const value = !known(s) ? format(s) : bits > 1 ? `0x${format(s)} · ${format(s, 'dec')} · ${format(s, 'bin')}` : format(s)
  return { ...h, route, value: `${bits} bit${bits > 1 ? 's' : ''}: ${value}`, tone: known(s) ? '' : 'text-error' }
})
function selectWire(id: string) {
  selection.value = { nodes: [], edges: [id] }
}

function removeSelected() {
  flow.value?.remove({ nodes: selectedNode.value ? [selectedNode.value.id] : [], edges: selectedEdge.value ? [selectedEdge.value.id] : [] })
  inspectorOpen.value = false
}

// ── Saving ──────────────────────────────────────────────────────────────────────────────────────────────
// Ctrl+S or the menu asks for the file's name first: the name it was opened or last saved as, else the preset's
const saveOpen = ref(false)
const saveName = ref('')
const lastName = ref('')
// A preset just loaded names the file, and keeps naming it once edited
watch(c.presetId, (id) => id && (lastName.value = id === 'blank' ? '' : id), { immediate: true })
const nameField = ref<InstanceType<typeof MTextField>>()
const cleanName = (n: string) => n.trim().replace(/\.json$/i, '').replace(/[\\/:*?"<>|]+/g, '-')
function save() {
  saveName.value = lastName.value || 'circuit'
  saveOpen.value = true
  nextTick(() => {
    nameField.value?.focus()
    nameField.value?.select()
  })
}
function download() {
  const name = cleanName(saveName.value)
  if (!name) return
  const url = URL.createObjectURL(new Blob([c.toJSON()], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}.json`
  a.click()
  URL.revokeObjectURL(url)
  lastName.value = name
  saveOpen.value = false
  toast.success(`Saved ${name}.json`)
}
async function open(file: File) {
  try {
    c.fromJSON(await file.text())
    c.presetId.value = ''
    lastName.value = cleanName(file.name)
    setTimeout(() => flow.value?.fitView(), 60)
    toast.success(`Opened ${file.name}`)
  } catch (err) {
    toast.error(`Couldn't open ${file.name}: ${(err as Error).message}`)
  }
}

// ── The gallery: on a first visit (nothing saved, no shared link), and from the bar ──────────────────────
const route = useRoute()
const router = useRouter()
const galleryOpen = ref(!c.restored.value && !route.query.c)
/** Something to go back to: a project restored, or the gallery closed once */
const canContinue = ref(c.restored.value || !!route.query.c)
watch(galleryOpen, (o) => {
  if (!o) canContinue.value = true
})
function pickPreset(id: string) {
  tutorialOn.value = false
  c.load(presets.find((p) => p.id === id)!)
}

// ── A shared link (?c=…) opens its circuit, then the address goes back to plain ─────────────────────────
onMounted(async () => {
  const code = route.query.c
  if (typeof code !== 'string' || !code) return
  try {
    await c.openShared(code)
    lastName.value = ''
    setTimeout(() => flow.value?.fitView(), 60)
    toast.success('Opened a shared circuit')
  } catch {
    toast.error("Couldn't open the shared circuit: the link is incomplete or broken")
  }
  router.replace({ query: {} })
})
async function share() {
  try {
    const url = `${location.origin}${route.path}?c=${await c.shareCode()}`
    if (url.length > 1_500_000) return toast.error('Too big for a link (large memories): save it as a file instead')
    await navigator.clipboard.writeText(url)
    toast.success(url.length > 8000 ? 'Link copied (a long one: big memories travel inside it)' : 'Link copied: anyone who opens it gets this circuit')
  } catch {
    toast.error("Couldn't copy the link")
  }
}

// ── Export: the open circuit as a picture, colored by what its wires carry right now ────────────────────
function screenPicture(n: PartNode) {
  if (n.data?.kind !== 'screen') return undefined
  const st = c.sim.state.get(c.prefix.value + n.id) as ScreenState | undefined
  const p = { ...partByKind.get('screen')!.params, ...n.data.params }
  const cols = p.cols ?? 32
  const rows = p.rows ?? 32
  if (!st || st.front.length !== cols * rows) return undefined
  const cv = document.createElement('canvas')
  cv.width = cols
  cv.height = rows
  cv.getContext('2d')!.putImageData(new ImageData(new Uint8ClampedArray(st.front.buffer as ArrayBuffer, st.front.byteOffset, cols * rows * 4), cols, rows), 0, 0)
  const px = screenPixel(p)
  return { href: cv.toDataURL(), x: SIDE, y: 40, w: cols * px, h: rows * px }
}
function partValue(n: PartNode) {
  const id = c.prefix.value + n.id
  const k = n.data?.kind
  if (k === 'switch' || k === 'button' || k === 'clock') return String(c.sim.state.get(id)?.value ?? 0)
  if (k === 'pin') return format(c.sim.output(id, 0) ?? { v: 0, k: 0, e: 0, m: 1 })
  if (k === 'led' || k === 'probe' || k === 'outpin' || k === 'hex') {
    const s = c.sim.inputsOf(id)[0]
    return s ? format(s, k === 'probe' && n.data!.params.radix === 'dec' ? 'dec' : 'hex') : undefined
  }
  return undefined
}
async function exportImage(fmt: 'png' | 'svg') {
  const { svg, width, height } = schematicSVG(
    { nodes: c.nodes.value, edges: c.edges.value },
    {
      colors: resolvedColors(), detail: 'full', signal: (e) => c.sim.edgeSignal(e, c.prefix.value), value: partValue, picture: screenPicture,
      // The wires as drawn on the canvas (kept apart where they'd run on top of each other)
      path: (e) => flow.value?.getEdgePath(e.id) ?? undefined,
    },
  )
  const name = lastName.value || 'circuit'
  const download = (blob: Blob, file: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  if (fmt === 'svg') return download(blob, `${name}.svg`)
  // Twice the size, for sharp text; at most 8192 px a side
  const scale = Math.min(2, 8192 / Math.max(width, height))
  const img = new Image()
  img.src = URL.createObjectURL(blob)
  try {
    await img.decode()
    const cv = document.createElement('canvas')
    cv.width = Math.round(width * scale)
    cv.height = Math.round(height * scale)
    const ctx = cv.getContext('2d')!
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(img, 0, 0, cv.width, cv.height)
    cv.toBlob((png) => png && download(png, `${name}.png`), 'image/png')
  } catch {
    toast.error("Couldn't draw the picture")
  } finally {
    URL.revokeObjectURL(img.src)
  }
}

// ── Truth table and tutorial ────────────────────────────────────────────────────────────────────────────
const tableOpen = ref(false)
const tutorialOn = ref(false)
/** What the tutorial checks that happens off the canvas */
const did = reactive(new Set<string>())
watch(tableOpen, (o) => o && did.add('table'))
function startTutorial() {
  did.clear()
  c.load(presets.find((p) => p.id === 'blank')!)
  tutorialOn.value = true
}

// ── Edit menu: MFlow's own commands ─────────────────────────────────────────────────────────────────────
function edit(action: EditAction) {
  const f = flow.value
  if (!f) return
  if (c.inspecting.value && action !== 'copy' && action !== 'selectAll') return toast.info('Inside an instance: edit its circuit to change it')
  if (action === 'selectAll') return (selection.value = { nodes: c.nodes.value.map((n) => n.id), edges: c.edges.value.map((e) => e.id) })
  f[action]()
  if (action !== 'copy') edited()
}
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden text-on-surface" :class="wide ? 'bg-surface-container' : 'bg-surface'">
    <TopBar
      ref="topBar"
      :wide="wide"
      :can-inspect="!!(selectedNode || selectedEdge)"
      @save="save"
      @open="open"
      @palette="paletteOpen = true"
      @inspect="inspectorOpen = true"
      @gallery="galleryOpen = true"
      @table="tableOpen = true"
      @tutorial="startTutorial"
      @share="share"
      @export="exportImage"
      @edit="edit"
    />
    <div class="flex min-h-0 flex-1">
      <aside v-if="wide" class="mb-2 ml-2 w-64 shrink-0 overflow-y-auto rounded-2xl bg-surface">
        <Palette @pick="pick" @grab="onGrab" />
      </aside>

      <main ref="canvas" class="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-surface" :class="wide && 'mx-2 mb-2 rounded-2xl'" @pointermove="onCanvasMove" @pointerleave="hover = null">
        <div class="relative min-h-0 flex-1">
        <MFlow
          :key="c.currentId.value + c.prefix.value"
          :locked="!!c.inspecting.value"
          ref="flow"
          v-model:nodes="c.nodes.value"
          v-model:edges="c.edges.value"
          v-model:selection="selection"
          :default-edge-options="{ type: 'wire', pathType: 'smoothstep', markerEnd: 'none' }"
          edge-branching="junction"
          :is-valid-connection="isValidConnection"
          :zoom-on-double-click="false"
          :insert-on-edge="false"
          edges-reroutable
          :edge-spacing="10"
          :min-zoom="0.15"
          background="dots"
          :grid-size="20"
          snap-to-grid
          history
          fit-view
          label="Circuit"
          class="absolute inset-0"
          @connect="edited"
          @connect-end="onConnectEnd"
          @branch="onBranch"
          @reroute="edited"
          @delete="edited"
          @node-drag-stop="onDragStop"
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
        <div v-else-if="description && !tutorialOn && !c.oscillating.value" class="pointer-events-none absolute top-3 left-3 max-w-md rounded-lg bg-surface-container-high/90 px-3 py-2 text-body-small text-on-surface-variant backdrop-blur-sm">
          {{ description }}
        </div>
        <div v-if="c.oscillating.value" class="absolute top-3 left-3 flex max-w-md items-center gap-2 rounded-lg bg-error-container px-3 py-2 text-body-small text-on-error-container">
          Oscillation: a loop keeps flipping without settling. Break the loop, or press reset.
        </div>
        </div>
        <WatchPanel v-if="c.watches.value.length" @select="selectWire" />
        <!-- What the wire under the mouse carries -->
        <div
          v-if="hovered"
          class="pointer-events-none absolute z-20 max-w-xs rounded-md bg-inverse-surface px-2 py-1 text-inverse-on-surface shadow-elevation-2"
          :style="{ left: `${hovered.x + 14}px`, top: `${hovered.y + 14}px` }"
        >
          <div class="text-label-small opacity-80">{{ hovered.route }}</div>
          <div class="font-mono text-label-medium break-all" :class="hovered.tone && 'text-error-container'">{{ hovered.value }}</div>
        </div>
      </main>

      <aside v-if="wide && (selectedNode || selectedEdge)" class="mr-2 mb-2 w-80 shrink-0 overflow-y-auto rounded-2xl bg-surface">
        <Inspector :key="selectedNode?.id ?? selectedEdge?.id" :node="selectedNode" :edge="selectedEdge" @remove="removeSelected" @rotate="(back) => rotate(back, [selectedNode!.id])" @straighten="straighten" />
      </aside>
    </div>

    <!-- The part being dragged in, until it's over the canvas -->
    <div
      v-if="ghost && ghostDef"
      class="pointer-events-none fixed z-50 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg bg-surface-container-high px-3 py-2 shadow-elevation-3"
      :style="{ left: `${ghost.x}px`, top: `${ghost.y}px` }"
    >
      <MIcon :name="ghostDef.icon" :size="18" class="text-primary" />
      <span class="text-title-small">{{ ghostDef.label }}</span>
    </div>

    <Tutorial v-if="tutorialOn" :did="did" :hidden="galleryOpen || tableOpen || saveOpen || !!c.inspecting.value || c.oscillating.value" @close="tutorialOn = false" />
    <Gallery v-model="galleryOpen" :can-continue="canContinue" @pick="pickPreset" @tutorial="startTutorial" />
    <TruthTableDialog v-model="tableOpen" />

    <MDialog v-model="saveOpen" title="Save circuit" max-width="400px">
      <form id="circuit-save" @submit.prevent="download">
        <MTextField ref="nameField" v-model="saveName" label="File name" variant="outlined" hint="Saved as .json to your downloads" :error="!cleanName(saveName)" />
      </form>
      <template #actions>
        <MButton variant="text" @click="saveOpen = false">Cancel</MButton>
        <MButton type="submit" form="circuit-save" :disabled="!cleanName(saveName)">Save</MButton>
      </template>
    </MDialog>

    <template v-if="!wide">
      <MSideSheet v-model="paletteOpen" title="Parts">
        <Palette @pick="pick" @grab="onGrab" @opened="paletteOpen = false" />
      </MSideSheet>
      <MSideSheet v-model="inspectorOpen" title="Settings">
        <Inspector v-if="selectedNode || selectedEdge" :node="selectedNode" :edge="selectedEdge" @remove="removeSelected" @rotate="(back) => rotate(back, [selectedNode!.id])" @straighten="straighten" />
      </MSideSheet>
    </template>
  </div>
</template>
