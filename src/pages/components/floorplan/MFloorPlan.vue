<script setup lang="ts">
import { computed, ref } from 'vue'
import { MAvatar, MButton, MChip, MIcon, MSegmentedButton, MSwitch, useToast } from '@m3ui-vue/m3ui-vue'
import { MFloorPlan, MFloorPlanToolbar, type FloorArea, type FloorDecor, type FloorMerge, type FloorStatus, type FloorTable, type FloorWall } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const toast = useToast()
const tables = ref<FloorTable[]>([
  { id: 1, label: '1', x: 120, y: 110, shape: 'round', seats: 4, status: 'occupied', badge: '35′' },
  { id: 2, label: '2', x: 300, y: 110, shape: 'round', seats: 4 },
  { id: 3, label: '3', x: 480, y: 110, shape: 'round', seats: 2, status: 'reserved' },
  { id: 4, label: '4', x: 140, y: 320, shape: 'rect', seats: 6, status: 'bill', badge: '$84' },
  { id: 5, label: '5', x: 380, y: 320, shape: 'square', seats: 4 },
  { id: 6, label: '6', x: 500, y: 320, shape: 'square', seats: 4, status: 'occupied', badge: '12′' },
  { id: 7, label: 'Bar', x: 800, y: 300, shape: 'rect', width: 260, height: 60, seats: 0 },
  { id: 8, label: '8', x: 760, y: 110, shape: 'square', seats: 2 },
  { id: 9, label: '9', x: 880, y: 110, shape: 'square', seats: 2, status: 'free' },
])
const merges = ref<FloorMerge[]>([{ id: 'm1', tables: [5, 6], label: '5 + 6' }])
const statuses: Record<string, FloorStatus> = {
  free: { label: 'Free', color: 'surface' },
  occupied: { label: 'Seated', color: 'primary', icon: 'restaurant' },
  bill: { label: 'Bill requested', color: 'tertiary', icon: 'receipt_long' },
  reserved: { label: 'Reserved', color: 'secondary', icon: 'event' },
}
const order = ['free', 'occupied', 'bill', 'reserved']
// Service: a tap moves a table to its next status
function open(t: FloorTable) {
  const next = order[(order.indexOf(t.status ?? 'free') + 1) % order.length]!
  tables.value = tables.value.map((x) => (x.id === t.id ? { ...x, status: next, badge: next === 'free' ? undefined : x.badge } : x))
}
// ── Service: carrying a party to another table, and seats ──
const party = ref<FloorTable[]>([
  { id: 'a', label: 'A', x: 140, y: 150, shape: 'rect', seats: 6, status: 'occupied', badge: '$48', activeSeats: [1, 2, 4] },
  { id: 'b', label: 'B', x: 400, y: 150, shape: 'round', seats: 4 },
  { id: 'c', label: 'C', x: 620, y: 150, shape: 'round', seats: 4, status: 'reserved' },
  { id: 'd', label: 'D', x: 860, y: 150, shape: 'square', seats: 4 },
])
function onTransfer(from: FloorTable, to: FloorTable) {
  party.value = party.value.map((t) =>
    t.id === to.id ? { ...t, status: from.status, badge: from.badge, activeSeats: from.activeSeats?.filter((n) => n <= (t.seats ?? 0)) }
    : t.id === from.id ? { ...t, status: undefined, badge: undefined, activeSeats: [] } : t)
  toast.success(`Table ${from.label}'s party moved to ${to.label}`)
}
function onSeat(t: FloorTable, seat: number) {
  party.value = party.value.map((x) => (x.id === t.id ? { ...x, activeSeats: x.activeSeats?.includes(seat) ? x.activeSeats.filter((n) => n !== seat) : [...(x.activeSeats ?? []), seat] } : x))
}
const canTransfer = (_: FloorTable, to: FloorTable) => (to.status ? `Table ${to.label} isn't free` : true)

// ── Zoom, shapes, measures and export ──
const bigPlan = ref<InstanceType<typeof MFloorPlan>>()
const bigTables = ref<FloorTable[]>([
  { id: 1, label: '1', x: 200, y: 200, shape: 'round', seats: 4 },
  { id: 2, label: '2', x: 380, y: 200, shape: 'round', seats: 4 },
  { id: 3, label: '3', x: 230, y: 470, shape: 'rect', seats: 6 },
  { id: 4, label: '4', x: 300, y: 500, shape: 'square', seats: 4 },
  { id: 5, label: '5', x: 1000, y: 260, shape: 'square', seats: 2 },
])
// An L-shaped dining room and a terrace, in centimeters
const bigAreas = ref<FloorArea[]>([
  { id: 'hall', label: 'Dining', x: 80, y: 80, width: 700, height: 600, color: 'secondary', points: [[80, 80], [780, 80], [780, 340], [480, 340], [480, 680], [80, 680]] },
  { id: 'terrace', label: 'Terrace', x: 860, y: 80, width: 340, height: 360, color: 'tertiary' },
])
const bigWalls = ref<FloorWall[]>([{ id: 'w', points: [[60, 60], [800, 60], [800, 360], [500, 360], [500, 700], [60, 700], [60, 60]] }])
const bigDecor = ref<FloorDecor[]>([{ id: 'd', kind: 'door', x: 280, y: 700 }, { id: 'v', kind: 'window', x: 60, y: 300, rotation: 90, width: 120 }])
const bigTool = ref<'select' | 'wall' | 'area' | 'polygon'>('select')
const bigZoom = ref(1)
// A faint blueprint to trace over (any image URL works)
const blueprint = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><g fill="none" stroke="#3b6ea5" stroke-width="2"><path d="M60 60H800V360H500V700H60Z"/><path d="M840 60H1180V460H840Z" stroke-dasharray="10 6"/><path d="M60 300h-30M60 420h-30" /></g><g fill="#3b6ea5" font-family="sans-serif" font-size="22"><text x="120" y="120">DINING 7.4 × 6.4 m</text><text x="880" y="110">TERRACE</text></g></svg>')}`
const showBlueprint = ref(true)
function download(name: string, blob: Blob) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}
const exportSvg = () => download('floor-plan.svg', new Blob([bigPlan.value!.toSVG()], { type: 'image/svg+xml' }))
const exportPng = async () => download('floor-plan.png', await bigPlan.value!.toPNG(2))

// ── Your units: tables kept as cells ──
const cellsTables = ref<FloorTable[]>([
  { id: 'x', label: 'X', x: 0, y: 0, shape: 'square', seats: 0, width: 60, height: 60 },
  { id: 'y', label: 'Y', x: 3, y: 1, shape: 'round', seats: 0, width: 60, height: 60 },
])

const counts = computed(() => order.map((s) => ({ s, n: tables.value.filter((t) => (t.status ?? 'free') === s && t.seats).length })))

// Editing
const layout = ref<FloorTable[]>(tables.value.map(({ status: _, badge: __, ...t }) => t))
const selection = ref<(string | number)[]>([])
const grid = ref(true)

// ── A plan of cells: snapping and picking, to play with ──────────────────────────────────────────────────
const cellPlan = ref<InstanceType<typeof MFloorPlan>>()
const cellSize = ref(60)
const cellSnap = ref<'point' | 'cell'>('cell')
const cellPick = ref<'none' | 'multiple'>('multiple')
const cellDots = ref(true)
const cellSub = ref(1)
const cellResize = ref<'grid' | 'subgrid' | 'free'>('grid')
const cellSelection = ref<(string | number)[]>([])
const cellMerges = ref<FloorMerge[]>([])
const cellWalls = ref<FloorWall[]>([{ id: 'w', points: [[0, 240], [240, 240], [240, 360]], thickness: 6 }])
// Tables start in the middle of the cells of a 60 grid; change the grid or the snap and drag them to see where they land
const cellTables = ref<FloorTable[]>([
  { id: 'A', label: 'A', x: 90, y: 90, shape: 'square', seats: 0, width: 48, height: 48 },
  { id: 'B', label: 'B', x: 210, y: 90, shape: 'square', seats: 0, width: 48, height: 48 },
  { id: 'C', label: 'C', x: 390, y: 150, shape: 'square', seats: 0, width: 48, height: 48 },
  { id: 'D', label: 'D', x: 510, y: 270, shape: 'round', seats: 0, width: 48, height: 48 },
])
function mergeCells() {
  const m = cellPlan.value?.merge(cellSelection.value)
  if (m) cellSelection.value = []
}
const cellCode = computed(() => `<MFloorPlan
  v-model:tables="tables"
  v-model:selection="selection"
  v-model:merges="merges"
  editable
  :grid="${cellSize.value}"${cellSnap.value === 'cell' ? '\n  table-snap="cell"' : ''}${cellSub.value > 1 ? `\n  :subgrid="${cellSub.value}"` : ''}${cellResize.value !== 'free' ? `\n  resize-snap="${cellResize.value}"` : ''}${cellPick.value === 'multiple' ? '\n  selectable="multiple"' : ''}${cellDots.value ? '' : '\n  :show-grid="false"'}
/>`)

// The whole room: zones, walls and decor
const room = ref<FloorTable[]>([
  { id: 1, label: '1', x: 160, y: 170, shape: 'round', seats: 4, status: 'occupied' },
  { id: 2, label: '2', x: 330, y: 170, shape: 'round', seats: 4 },
  { id: 3, label: '3', x: 250, y: 420, shape: 'rect', seats: 6, status: 'reserved' },
  { id: 4, label: '4', x: 720, y: 170, shape: 'square', seats: 2 },
  { id: 5, label: '5', x: 860, y: 170, shape: 'square', seats: 2, status: 'bill' },
])
const areas = ref<FloorArea[]>([
  { id: 'hall', label: 'Main hall', x: 40, y: 60, width: 520, height: 480, color: 'secondary' },
  { id: 'terrace', label: 'Terrace', x: 620, y: 60, width: 340, height: 260, color: 'tertiary' },
])
const walls = ref<FloorWall[]>([
  { id: 'w1', points: [[30, 30], [580, 30], [580, 560], [30, 560], [30, 30]] },
  { id: 'w2', points: [[580, 340], [980, 340]], thickness: 4 },
])
const decor = ref<FloorDecor[]>([
  { id: 'door', kind: 'door', x: 300, y: 560 },
  { id: 'win', kind: 'window', x: 300, y: 30 },
  { id: 'win2', kind: 'window', x: 30, y: 300, rotation: 90 },
  { id: 'door2', kind: 'door', x: 580, y: 450, rotation: 90, flip: true },
  { id: 'p1', kind: 'plant', x: 520, y: 100 },
  { id: 'col', kind: 'column', x: 400, y: 300 },
  { id: 'reg', kind: 'register', x: 700, y: 460 },
  { id: 'wc', kind: 'restroom', x: 880, y: 460 },
  { id: 'kit', kind: 'kitchen', x: 790, y: 460 },
  { id: 'lbl', kind: 'label', x: 790, y: 520, label: 'Back of house' },
])
const tool = ref<'select' | 'wall' | 'area'>('select')
const editRoom = ref(true)

// Your own decor kinds, slots and merging
const custom = ref<InstanceType<typeof MFloorPlan>>()
const customTables = ref<FloorTable[]>([
  { id: 1, label: '1', x: 200, y: 200, shape: 'round', seats: 4 },
  { id: 2, label: '2', x: 380, y: 200, shape: 'round', seats: 4 },
  { id: 3, label: '3', x: 560, y: 200, shape: 'round', seats: 4, status: 'reserved' },
  { id: 4, label: '4', x: 290, y: 420, shape: 'rect', seats: 6 },
])
const customDecor = ref<FloorDecor[]>([
  { id: 'tv', kind: 'tv', x: 500, y: 20 },
  { id: 'aq', kind: 'aquarium', x: 800, y: 300 },
  { id: 'door', kind: 'door', x: 500, y: 580 },
])
const customMerges = ref<FloorMerge[]>([])
const customSelection = ref<(string | number)[]>([])
const customKinds = {
  tv: { label: 'TV', icon: 'tv', width: 90, height: 14, shape: 'bar' as const, color: '#263238' },
  aquarium: { label: 'Aquarium', width: 120, height: 50 },
}
const refuse3 = (ids: (string | number)[]) => (ids.includes(3) ? 'Table 3 is booked' : true)
const customWalls = [{ id: 'w', points: [[20, 20], [980, 20], [980, 580], [20, 580], [20, 20]] as [number, number][] }]

const props: PropDef[] = [
  { name: 'v-model:tables', type: 'FloorTable[]', default: '[]', description: 'The tables, in plan units' },
  { name: 'v-model:merges', type: 'FloorMerge[]', default: '[]', description: 'Tables joined together, drawn as one group with an outline and its label' },
  { name: 'v-model:selection', type: '(string | number)[]', default: '[]', description: 'Selected tables: while editing (Shift or Ctrl adds), or in service with selectable' },
  { name: 'v-model:picked', type: 'FloorPick', default: 'null', description: 'Editing: the zone, wall (and its corner) or decor picked ({ kind, id, vertex? }), for an inspector of your own' },
  { name: 'selectable', type: "'none' | 'single' | 'multiple'", default: "'none'", description: "Outside editing, what a click on a table selects (multiple toggles; then merge() joins them). While editing, 'multiple' keeps a click toggling tables in the selection and a drag moves the table pressed on its own, to bring the tables being merged together" },
  { name: 'canMerge', type: '(ids) => boolean | string', default: '—', description: 'Refuses a merge with false or a reason (merge-refused carries it)' },
  { name: 'dragMerged', type: 'boolean', default: 'false', description: 'Dragging or nudging a merged table moves its whole merge with it' },
  { name: 'rotatable', type: "boolean | ('table' | 'decor')[]", default: 'true', description: "What the turning handle turns: everything, nothing, or only these kinds (['decor'] when your app keeps no tables' angles)" },
  { name: 'resizable', type: 'boolean', default: 'true', description: "The handle at the selected table's corner that resizes it, about its middle (a circle stays a circle; Shift lets a round table become an oval)" },
  { name: 'resizeSnap', type: "'grid' | 'subgrid' | 'free'", default: "'free'", description: "How the resize handles of tables and decor step: whole grid squares, the subgrid's step, or not at all. The change steps, not the size, so a table a little smaller than its square keeps that margin" },
  { name: 'cellSize', type: 'number', default: '—', description: "Tables by cell: their x / y are a column and a row (whole numbers from 0), each cell this many plan units; drawn in the middle of their cell (one bigger than a cell starts at its cell's corner and covers the next ones), stepping a cell at a time, and given back in cells everywhere" },
  { name: 'tableOrigin', type: "'center' | 'corner'", default: "'center'", description: "Which point of a table x / y name: its middle, or its top-left corner (unturned)" },
  { name: 'zoomable / maxZoom / zoomControls', type: 'boolean / number / boolean', default: 'false / 4 / true', description: 'Zoom and pan: Ctrl + wheel or a pinch zooms, the wheel, two fingers, a middle-button drag or (outside editing, or with a finger) a drag on empty floor pans; + / − / whole plan buttons. v-model:zoom holds the level' },
  { name: 'backgroundImage / backgroundBox / backgroundOpacity', type: 'string / { x, y, width, height } / number', default: '— / the whole plan / 0.5', description: 'An image under everything (a scanned floor plan to trace over), in plan units' },
  { name: 'transferable / canTransfer', type: 'boolean / (from, to) => boolean | string', default: 'false / —', description: "In service, a table carried onto another emits transfer (a mouse drags; a finger holds it down first); canTransfer refuses with false or a reason (transfer-refused)" },
  { name: 'overlap', type: "'allow' | 'warn' | 'prevent'", default: "'warn'", description: 'Tables on top of each other while editing: outlined, also refused (a move or resize that would cause it is undone), or ignored' },
  { name: 'seatNumbers', type: 'boolean', default: 'false', description: 'Numbers the chairs (from the top-left, clockwise); in service a click on one emits seat-click' },
  { name: 'measure', type: '{ unit, per, decimals? }', default: '—', description: "Real lengths: per plan units make one unit. While editing, the picked wall's or zone's sides, the wall being drawn and the picked table's or decor's size are labeled; the inspector's sizes are in the unit" },
  { name: 'decorKinds', type: 'Record<string, FloorDecorKind>', default: '—', description: "Decor kinds of yours ({ label, icon, width, height, shape: 'box' | 'round' | 'bar' | 'door' | 'window' | 'text', color }), or the built-in ones restyled. door draws an opening with its leaf and swing, window a framed pane; both cut the wall under them" },
  { name: 'v-model:areas', type: 'FloorArea[]', default: '[]', description: 'Zones behind the tables (hall, terrace, VIP): { id, label?, x, y, width, height, color? }. Editing: drag to move, any corner to resize' },
  { name: 'v-model:walls', type: 'FloorWall[]', default: '[]', description: 'Walls through their points ({ id, points, thickness? }). Editing: drag a wall or, once picked, a corner; double-click adds a corner, Delete removes the picked one' },
  { name: 'v-model:decor', type: 'FloorDecor[]', default: '[]', description: 'Doors, windows, plants, columns, restroom, kitchen, register, stairs, text, and kinds of yours; editing drags, resizes (by the corner, along the item\'s own axes when turned, the opposite corner staying put) and turns them (handle)' },
  { name: 'v-model:tool', type: "'select' | 'wall' | 'area' | 'polygon'", default: "'select'", description: 'Editing: select moves things (a drag on empty floor selects tables; Delete removes a picked zone, wall or decor); wall draws one corner per click (double-click or Enter ends, Escape cancels), joining other walls\' corners nearby; area drags out a zone; polygon draws a zone of any shape (click its first corner, double-click or Enter to close it)' },
  { name: 'statuses', type: 'Record<string, FloorStatus>', default: 'free, occupied, bill, reserved', description: 'Your statuses: a color (an M3 role like primary or tertiary, or any CSS color), an icon, a name' },
  { name: 'editable', type: 'boolean', default: 'false', description: 'Drag tables (several when selected; by touch, hold one down to add it), turn them by the handle, nudge with the arrows (Shift: 5 steps); Delete, Ctrl+D duplicates, Ctrl+Z / Ctrl+Shift+Z undo and redo' },
  { name: 'width / height', type: 'number', default: '1000 / 600', description: "The plan's size in plan units; it scales to the component's width" },
  { name: 'grid', type: 'number', default: '10', description: 'Snapping step in plan units (0: none)' },
  { name: 'showGrid', type: 'boolean', default: 'true', description: 'Dots on the grid points while editing' },
  { name: 'subgrid', type: 'number', default: '1', description: 'Snapping steps per grid square for walls, zones and decor: 2 puts them on the points and halfway between them, drawn as smaller dots (tables keep to the grid; arrows on a picked zone, wall or decor move by this step)' },
  { name: 'tableSnap', type: "'point' | 'cell'", default: "'point'", description: "Where a table's middle snaps: a grid point, or with 'cell' the middle of a grid square, so tables sit in the squares between the points and step a square at a time while walls, zones and decor snap to the points (a plan of cells)" },
  { name: 'chairs', type: 'boolean', default: 'true', description: 'Draw chairs from seats' },
  { name: 'label', type: 'string', default: 'locale', description: 'Accessible name' },
]
const events: EventDef[] = [
  { name: 'table-click', payload: 'FloorTable, MouseEvent | KeyboardEvent', description: 'A table clicked or opened with Enter (not after a drag)' },
  { name: 'move', payload: '{ id, x, y }[]', description: 'Tables moved by a drag or the arrows: save their positions (in your units: cells with cellSize)' },
  { name: 'transfer / transfer-refused', payload: 'from, to (, reason)', description: "A table carried onto another in service (transferable): move its party; or canTransfer said no" },
  { name: 'seat-click', payload: 'FloorTable, seat, MouseEvent', description: 'A chair clicked in service, with seatNumbers (seats count from 1)' },
  { name: 'merge / split', payload: 'FloorMerge', description: 'Tables merged or a merge split, by merge() / split() (call your API here)' },
  { name: 'merge-refused', payload: 'ids, reason', description: 'canMerge said no' },
]
const exposed: PropDef[] = [
  { name: 'context', type: 'FloorPlanContext', description: "Everything useFloorPlan() returns: pass the plan's ref to MFloorPlanToolbar / MFloorPlanInspector outside it" },
  { name: 'merge(ids?, label?) / split(idOrTable)', type: 'function', description: 'Merge tables (default: the selection, plus what they are merged with) / split a merge' },
  { name: 'addTable(t?) / addDecor(kind, d?) / update(kind, id, patch)', type: 'function', description: 'Add and change items, each an undo step' },
  { name: 'removeSelected() / removeTables(ids) / duplicate()', type: 'function', description: 'What Delete and Ctrl+D do' },
  { name: 'undo() / redo() / canUndo / canRedo', type: 'function / ComputedRef', description: "The history of the plan's own edits" },
  { name: 'zoomTo(z, px?, py?) / centerOn(x, y, z?)', type: 'function', description: 'Zoom to a level keeping a point of the view in place; center the view on a plan point' },
  { name: 'toSVG() / toPNG(pixelRatio?)', type: 'function', description: 'The plan as a standalone SVG string (theme colors resolved; icons left out) or a PNG Blob' },
]
const slots: SlotDef[] = [
  { name: 'table', description: 'The inside of a table: { table, status, selected } (it stays upright when the table turns)' },
  { name: 'decor', description: 'The inside of a decor item: { item, kind, picked, scale }' },
  { name: 'area', description: 'The inside of a zone (its label by default): { area, picked, scale }' },
  { name: 'merge', description: "A merge's label: { merge, tables }" },
  { name: 'overlay', description: 'Anything over the plan, positioned with toPx (plan units to pixels): { scale, toPx }' },
]
const types: TypeDef[] = [
  { name: 'FloorTable', fields: [
    { name: 'id / label / x / y', type: 'string | number / string / number', required: true, description: 'x and y are its center, in plan units' },
    { name: 'shape', type: "'round' | 'square' | 'rect'", description: 'Default square' },
    { name: 'seats', type: 'number', description: 'Chairs drawn around it; also sizes it when width and height are absent' },
    { name: 'width / height / rotation', type: 'number', description: 'Its own size, and degrees' },
    { name: 'status / badge / data', type: 'string / string | number / object', description: 'A key of statuses, a small badge (minutes, the total), anything of yours' },
    { name: 'activeSeats', type: 'number[]', description: 'Seats taken (from 1), drawn in the status color' },
  ] },
  { name: 'FloorDecor', fields: [
    { name: 'kind', type: "'door' | 'window' | 'plant' | 'column' | 'restroom' | 'kitchen' | 'register' | 'stairs' | 'label' | string", required: true, description: 'A built-in kind or one of decorKinds' },
    { name: 'id / x / y', type: 'string | number / number', required: true, description: 'Its center' },
    { name: 'width / height / rotation / label', type: 'number / string', description: 'Its size (a default per kind), degrees, a label\'s text' },
    { name: 'flip', type: 'boolean', description: 'Mirrored across its length: a door hinged on the other side (the inspector\'s Flip)' },
  ] },
  { name: 'FloorArea', fields: [
    { name: 'id / x / y / width / height', type: 'string | number / number', required: true, description: 'A rectangle; with points, the box around them (kept up to date)' },
    { name: 'points', type: '[number, number][]', description: 'A zone of any shape: its corners (an L-shaped room)' },
    { name: 'label / color', type: 'string', description: 'Its name, an M3 role or a CSS color' },
  ] },
  { name: 'FloorMerge', fields: [{ name: 'id / tables / label', type: 'string | number / ids / string', required: true, description: 'The tables joined' }] },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFloorPlan</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A floor plan of tables, for a restaurant, a bar or an event: arrange them, then run service with each table
      colored by its status (yours, by prop), a badge, chairs from its seats, and merged tables drawn as one group. The
      plan is in its own units and scales to its width, so it fits a phone and a wall screen. Not an M3 spec component.
    </p>

    <ComponentDemo
      title="Service"
      description="Tap a table to move it to the next status. Tables 5 and 6 are merged."
      flush
      :code="`<MFloorPlan v-model:tables=&quot;tables&quot; :merges=&quot;merges&quot; :statuses=&quot;statuses&quot; @table-click=&quot;open&quot; />

const statuses = {
  free: { label: 'Free', color: 'surface' },
  occupied: { label: 'Seated', color: 'primary', icon: 'restaurant' },
  bill: { label: 'Bill requested', color: 'tertiary', icon: 'receipt_long' },
  reserved: { label: 'Reserved', color: 'secondary', icon: 'event' },
}`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <div class="flex flex-wrap gap-2">
          <MChip v-for="c in counts" :key="c.s" :icon="statuses[c.s]!.icon ?? 'table_restaurant'">{{ statuses[c.s]!.label }} · {{ c.n }}</MChip>
        </div>
        <MFloorPlan v-model:tables="tables" :merges="merges" :statuses="statuses" @table-click="open" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Arranging the Room"
      description="editable: drag a table (or several: Shift-click to select them), nudge it with the arrows; move fires with the new positions to save."
      flush
      :code="`<MFloorPlan v-model:tables=&quot;tables&quot; v-model:selection=&quot;selection&quot; editable :grid=&quot;20&quot; @move=&quot;save&quot; />`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <MSwitch v-model="grid" label="Snap to a 20-unit grid" :icon="false" />
        <MFloorPlan v-model:tables="layout" v-model:selection="selection" editable :grid="grid ? 20 : 0" @move="toast.info(`Moved ${$event.map((m) => `#${m.id}`).join(', ')}`)" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="A Plan of Cells"
      description="Play with how tables snap and how they're picked while editing. tableSnap cell puts a table's middle in the middle of a grid square (the wall still snaps to the points), so tables step a square at a time; point puts it on a point. subgrid 2 lets the wall (and zones and decor) also stop halfway between the points, drawn as smaller dots, while tables keep to the grid. resizeSnap makes a table's corner handle (pick one table with selectable none) step by grid squares, subgrid steps, or freely. selectable multiple keeps a click toggling tables in and out of the selection while editing, and a drag moves the table pressed on its own: tap a few, bring them together, then Merge."
      flush
      :code="cellCode"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div class="flex items-center gap-2">
            <span class="text-label-large text-on-surface-variant">Grid</span>
            <MSegmentedButton v-model="cellSize" :options="[{ value: 30, label: '30' }, { value: 60, label: '60' }, { value: 120, label: '120' }]" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-label-large text-on-surface-variant">tableSnap</span>
            <MSegmentedButton v-model="cellSnap" :options="[{ value: 'point', label: 'point' }, { value: 'cell', label: 'cell' }]" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-label-large text-on-surface-variant">selectable</span>
            <MSegmentedButton v-model="cellPick" :options="[{ value: 'none', label: 'none' }, { value: 'multiple', label: 'multiple' }]" @update:model-value="cellSelection = []" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-label-large text-on-surface-variant">subgrid</span>
            <MSegmentedButton v-model="cellSub" :options="[{ value: 1, label: '1' }, { value: 2, label: '2' }]" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-label-large text-on-surface-variant">resizeSnap</span>
            <MSegmentedButton v-model="cellResize" :options="[{ value: 'grid', label: 'grid' }, { value: 'subgrid', label: 'subgrid' }, { value: 'free', label: 'free' }]" />
          </div>
          <MSwitch v-model="cellDots" label="Grid dots" :icon="false" />
          <MButton variant="tonal" size="sm" icon="link" :disabled="cellSelection.length < 2" @click="mergeCells">Merge {{ cellSelection.length || '' }}</MButton>
        </div>
        <MFloorPlan
          ref="cellPlan"
          v-model:tables="cellTables"
          v-model:selection="cellSelection"
          v-model:merges="cellMerges"
          v-model:walls="cellWalls"
          :width="600"
          :height="360"
          editable
          :grid="cellSize"
          :table-snap="cellSnap"
          :subgrid="cellSub"
          :resize-snap="cellResize"
          :selectable="cellPick"
          :show-grid="cellDots"
          :rotatable="false"
          label="A plan of cells"
          class="border border-outline-variant"
        />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Moving a Party, Seat by Seat"
      description="In service, carry a table onto another to move its party there (with a mouse drag it; with a finger hold it down first): transfer hands you both tables, canTransfer refuses a table that isn't free. seatNumbers numbers the chairs from the top-left, clockwise; activeSeats colors the taken ones, and a click on a chair emits seat-click."
      flush
      :code="`<MFloorPlan
  v-model:tables=&quot;tables&quot;
  transferable
  :can-transfer=&quot;(from, to) => (to.status ? 'That table is busy' : true)&quot;
  seat-numbers
  @transfer=&quot;moveParty&quot;
  @transfer-refused=&quot;(from, to, reason) => toast.error(reason)&quot;
  @seat-click=&quot;toggleSeat&quot;
/>`"
    >
      <div class="p-4 sm:p-6">
        <MFloorPlan v-model:tables="party" :height="320" :statuses="statuses" transferable :can-transfer="canTransfer" seat-numbers @transfer="onTransfer" @transfer-refused="(_f, _t, reason) => toast.error(reason)" @seat-click="onSeat" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Zoom, Shapes, Measures and Export"
      description="A 12 × 8 m room in centimeters (measure: 100 units a meter), over a blueprint to trace. Ctrl + wheel or a pinch zooms, the wheel or two fingers pan, and so do the buttons. The dining room is a zone of any shape: draw one with the shape tool (click its corners, then its first corner), or double-click a zone's edge for a new corner; corners join walls' corners nearby. Pick a wall or a zone to see its sides measured, drag on empty floor to select tables, and resize a table by its corner. Tables 3 and 4 overlap, so they're outlined. Then download it as SVG or PNG."
      flush
      :code="`<MFloorPlanToolbar :plan=&quot;plan&quot; :tables=&quot;[]&quot; />
<MFloorPlan
  ref=&quot;plan&quot;
  v-model:tables=&quot;tables&quot;
  v-model:areas=&quot;areas&quot;
  v-model:walls=&quot;walls&quot;
  v-model:zoom=&quot;zoom&quot;
  :width=&quot;1200&quot;
  :height=&quot;800&quot;
  :grid=&quot;20&quot;
  editable
  zoomable
  :measure=&quot;{ unit: 'm', per: 100 }&quot;
  background-image=&quot;/blueprint.png&quot;
  :background-opacity=&quot;0.35&quot;
/>

plan.value.toSVG()   // a string
await plan.value.toPNG(2)   // a Blob`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <div class="flex flex-wrap items-center gap-3">
          <MFloorPlanToolbar :plan="bigPlan" :tables="[]" />
          <MSwitch v-model="showBlueprint" label="Blueprint" :icon="false" />
          <span class="text-label-large text-on-surface-variant">Zoom {{ bigZoom.toFixed(1) }}×</span>
          <span class="flex-1" />
          <MButton variant="tonal" size="sm" icon="download" @click="exportSvg">SVG</MButton>
          <MButton variant="tonal" size="sm" icon="image" @click="exportPng">PNG</MButton>
        </div>
        <MFloorPlan
          ref="bigPlan"
          v-model:tables="bigTables"
          v-model:areas="bigAreas"
          v-model:walls="bigWalls"
          v-model:decor="bigDecor"
          v-model:tool="bigTool"
          v-model:zoom="bigZoom"
          :width="1200"
          :height="800"
          :grid="20"
          editable
          zoomable
          :measure="{ unit: 'm', per: 100 }"
          :background-image="showBlueprint ? blueprint : undefined"
          :background-opacity="0.35"
          label="A room in meters"
          class="border border-outline-variant"
        />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="In Your Own Units"
      description="Many systems keep a table as a cell of a grid, not as a point. With cellSize the tables you hand in and get back are a column and a row (whole numbers from 0): the plan draws each in the middle of its cell, a drag steps a cell at a time, and move, update:tables, the events and the slots all speak cells. tableOrigin corner is the other common case, a table's top-left corner. Drag the tables and watch the data."
      flush
      :code="`<MFloorPlan
  v-model:tables=&quot;tables&quot;
  :cell-size=&quot;80&quot;
  :grid=&quot;80&quot;
  :width=&quot;480&quot;
  :height=&quot;240&quot;
  editable
/>

// tables: [{ id: 'x', label: 'X', x: 0, y: 0 }, { id: 'y', label: 'Y', x: 3, y: 1 }]`"
    >
      <div class="flex flex-col gap-3 p-4 sm:flex-row sm:p-6">
        <MFloorPlan v-model:tables="cellsTables" :cell-size="80" :grid="80" :width="480" :height="240" editable :rotatable="false" class="max-w-120 border border-outline-variant" label="Tables by cell" />
        <pre class="flex-1 overflow-auto rounded-md bg-surface-container-highest p-3 font-mono text-body-small">{{ cellsTables.map((t) => ({ id: t.id, x: t.x, y: t.y })) }}</pre>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="The Whole Room"
      description="Zones, walls and decor around the tables. A door is drawn with its leaf and swing, a window with its pane, and both cut the wall they sit on; a turned one resizes along its own length. Editing: pick the wall tool and click corners (double-click ends), or the zone tool and drag; arrows move a picked zone, wall corner or decor, Delete removes it."
      flush
      :code="`<MFloorPlan
  v-model:tables=&quot;tables&quot;
  v-model:areas=&quot;areas&quot;
  v-model:walls=&quot;walls&quot;
  v-model:decor=&quot;decor&quot;
  v-model:tool=&quot;tool&quot;
  :editable=&quot;editing&quot;
/>`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <div class="flex flex-wrap items-center gap-3">
          <MSwitch v-model="editRoom" label="Edit" :icon="false" />
          <MSegmentedButton v-if="editRoom" v-model="tool" :options="[{ value: 'select', label: 'Select', icon: 'arrow_selector_tool' }, { value: 'wall', label: 'Wall', icon: 'timeline' }, { value: 'area', label: 'Zone', icon: 'crop_square' }]" density="compact" />
        </div>
        <MFloorPlan v-model:tables="room" v-model:areas="areas" v-model:walls="walls" v-model:decor="decor" v-model:tool="tool" :editable="editRoom" :statuses="statuses" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Your Own Decor, Slots and Merging"
      description="Two decor kinds of yours (a TV, and an aquarium drawn by the #decor slot), a waiter on #overlay, the walls restyled by a custom property. Pick tables (selectable multiple) and Merge: canMerge refuses table 3."
      flush
      :code="`<MFloorPlan
  ref=&quot;plan&quot;
  v-model:tables=&quot;tables&quot;
  v-model:decor=&quot;decor&quot;
  v-model:merges=&quot;merges&quot;
  v-model:selection=&quot;selection&quot;
  :decor-kinds=&quot;{
    tv: { label: 'TV', icon: 'tv', width: 90, height: 14, shape: 'bar', color: '#263238' },
    aquarium: { label: 'Aquarium', width: 120, height: 50 },
  }&quot;
  selectable=&quot;multiple&quot;
  :can-merge=&quot;(ids) => (ids.includes(3) ? 'Table 3 is booked' : true)&quot;
  style=&quot;--m3-floor-wall: var(--color-primary)&quot;
  @merge-refused=&quot;(ids, reason) => toast.error(reason)&quot;
>
  <template #decor=&quot;{ item, kind }&quot;>
    <span v-if=&quot;item.kind === 'aquarium'&quot; class=&quot;… bg-gradient-to-b from-sky-300 to-blue-600&quot;>🐟</span>
    <MIcon v-else-if=&quot;kind.icon&quot; :name=&quot;kind.icon&quot; />
  </template>
  <template #overlay=&quot;{ toPx }&quot;>
    <MAvatar name=&quot;Ana&quot; class=&quot;absolute&quot; :style=&quot;{ left: \`\${toPx(560)}px\`, top: \`\${toPx(80)}px\` }&quot; />
  </template>
</MFloorPlan>
<MButton @click=&quot;plan.merge()&quot;>Merge</MButton>`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <div class="flex flex-wrap items-center gap-2">
          <MButton icon="join" :disabled="customSelection.length < 2" @click="custom?.merge()">Merge{{ customSelection.length ? ` ${customSelection.length}` : '' }}</MButton>
          <MButton variant="text" icon="call_split" :disabled="!customMerges.length" @click="customMerges.forEach((m) => custom?.split(m.id))">Split all</MButton>
        </div>
        <MFloorPlan
          ref="custom"
          v-model:tables="customTables"
          v-model:decor="customDecor"
          v-model:merges="customMerges"
          v-model:selection="customSelection"
          :decor-kinds="customKinds"
          :walls="customWalls"
          selectable="multiple"
          :can-merge="refuse3"
          style="--m3-floor-wall: var(--color-primary)"
          @merge-refused="(_ids, reason) => toast.error(reason)"
        >
          <template #decor="{ item, kind }">
            <span v-if="item.kind === 'aquarium'" class="flex size-full items-center justify-center rounded-lg bg-gradient-to-b from-sky-300 to-blue-600 text-xl">🐟</span>
            <MIcon v-else-if="kind.icon" :name="kind.icon" />
          </template>
          <template #overlay="{ toPx }">
            <MAvatar name="Ana" :size="28" class="absolute shadow-elevation-2" :style="{ left: `${toPx(560)}px`, top: `${toPx(80)}px` }" />
          </template>
        </MFloorPlan>
      </div>
    </ComponentDemo>

    <h3 class="mt-6 mb-3 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Exposed</h3>
    <PropsTable :props="exposed" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Restyling</h3>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      Custom properties on the plan (or any parent): <code>--m3-floor-wall</code>, <code>--m3-floor-wall-picked</code>,
      <code>--m3-floor-chair</code>, <code>--m3-floor-merge</code>, <code>--m3-floor-merge-label</code>. Its own
      background, corners and size are plain CSS on the root; your classes win.
    </p>
    <h3 class="mt-6 mb-3 text-title-large font-medium">Types</h3>
    <TypesTable :types="types" />

    <ComponentPager current="MFloorPlan" />
  </div>
</template>
