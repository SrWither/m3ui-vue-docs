<script setup lang="ts">
import { computed, ref } from 'vue'
import { MButton, MConfirmDialog, MSegmentedButton } from '@m3ui-vue/m3ui-vue'
import { MFlow, MFlowControls, MFlowHandle, MFlowMinimap, type FlowConnection, type FlowEdge, type FlowNode, type FlowXY } from '@m3ui-vue/m3ui-vue/flow'
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

// ── Basic ───────────────────────────────────────────────────────────────────────────────────────────────
const nodes = ref<FlowNode[]>([
  { id: 'order', type: 'input', position: { x: 0, y: 80 }, data: { label: 'New order', subtitle: 'Webhook', icon: 'shopping_cart' } },
  { id: 'stock', position: { x: 260, y: 0 }, data: { label: 'Check stock', subtitle: 'Inventory', icon: 'inventory_2' } },
  { id: 'pay', position: { x: 260, y: 160 }, data: { label: 'Charge card', subtitle: 'Payments', icon: 'credit_card' } },
  { id: 'ship', position: { x: 520, y: 80 }, data: { label: 'Ship', subtitle: 'Carrier API', icon: 'local_shipping' } },
  { id: 'mail', type: 'output', position: { x: 780, y: 80 }, data: { label: 'Email customer', subtitle: 'Mail', icon: 'mail' } },
])
const edges = ref<FlowEdge[]>([
  { id: 'e1', source: 'order', target: 'stock' },
  { id: 'e2', source: 'order', target: 'pay' },
  { id: 'e3', source: 'stock', target: 'ship' },
  { id: 'e4', source: 'pay', target: 'ship', animated: true },
  { id: 'e5', source: 'ship', target: 'mail', label: 'tracking' },
])

const newEdges = ref<'solid' | 'animated'>('solid')

// ── Events ──────────────────────────────────────────────────────────────────────────────────────────────
const eventNodes = ref<FlowNode[]>([
  { id: 'cart', type: 'input', position: { x: 0, y: 60 }, data: { label: 'Cart', icon: 'shopping_cart' } },
  { id: 'checkout', position: { x: 260, y: 0 }, data: { label: 'Checkout', icon: 'payments' } },
  { id: 'invoice', type: 'output', position: { x: 520, y: 60 }, data: { label: 'Invoice', icon: 'receipt' } },
  { id: 'refund', type: 'output', position: { x: 260, y: 140 }, data: { label: 'Refund', icon: 'undo' } },
])
const eventEdges = ref<FlowEdge[]>([
  { id: 'x1', source: 'cart', target: 'checkout' },
  { id: 'x2', source: 'checkout', target: 'invoice' },
])
const events = ref<string[]>([])
const logEvent = (line: string) => (events.value = [line, ...events.value].slice(0, 6))
const names = (ns: FlowNode[]) => ns.map((n) => n.data.label).join(', ')
// Deleting nodes asks first, in a dialog (edges go right away)
const asking = ref<{ text: string; answer: (yes: boolean) => void } | null>(null)
const askOpen = computed({ get: () => !!asking.value, set: (v) => { if (!v) answer(false) } })
function beforeDelete({ nodes }: { nodes: FlowNode[] }) {
  if (!nodes.length) return true
  return new Promise<boolean>((resolve) => (asking.value = { text: `Delete ${names(nodes)} and its connections?`, answer: resolve }))
}
function answer(yes: boolean) {
  asking.value?.answer(yes)
  asking.value = null
}

// ── Splice into an edge ─────────────────────────────────────────────────────────────────────────────────
const spliceNodes = ref<FlowNode[]>([
  { id: 'fetch', type: 'input', position: { x: 0, y: 40 }, data: { label: 'Fetch orders', icon: 'download' } },
  { id: 'save', position: { x: 300, y: 40 }, data: { label: 'Save report', icon: 'save' } },
  { id: 'notify', type: 'output', position: { x: 580, y: 40 }, data: { label: 'Notify team', icon: 'notifications' } },
  { id: 'clean', position: { x: 150, y: 220 }, data: { label: 'Clean up data', icon: 'cleaning_services' } },
])
const spliceEdges = ref<FlowEdge[]>([
  { id: 's1', source: 'fetch', target: 'save', animated: true },
  { id: 's2', source: 'save', target: 'notify' },
])

// ── Custom nodes ────────────────────────────────────────────────────────────────────────────────────────
const customNodes = ref<FlowNode[]>([
  { id: 'in', type: 'input', position: { x: 0, y: 100 }, data: { label: 'Form submitted', icon: 'description' } },
  { id: 'if', type: 'condition', position: { x: 260, y: 92 }, data: { label: 'Budget over $10k?' } },
  { id: 'sales', type: 'output', position: { x: 540, y: 0 }, data: { label: 'Assign to sales', icon: 'support_agent' } },
  { id: 'nurture', type: 'output', position: { x: 540, y: 200 }, data: { label: 'Nurture sequence', icon: 'schedule_send' } },
])
const customEdges = ref<FlowEdge[]>([
  { id: 'c1', source: 'in', target: 'if' },
  { id: 'c2', source: 'if', sourceHandle: 'yes', target: 'sales', label: 'Yes', type: 'smoothstep' },
  { id: 'c3', source: 'if', sourceHandle: 'no', target: 'nurture', label: 'No', type: 'smoothstep' },
])

// ── Layout ──────────────────────────────────────────────────────────────────────────────────────────────
const team = (id: string, label: string, subtitle: string): FlowNode => ({ id, position: { x: 0, y: 0 }, data: { label, subtitle, icon: 'person' } })
const layoutNodes = ref<FlowNode[]>([
  team('ceo', 'Ada', 'CEO'), team('cto', 'Linus', 'CTO'), team('cfo', 'Grace', 'CFO'),
  team('fe', 'Evan', 'Frontend'), team('be', 'Rasmus', 'Backend'), team('acc', 'Luca', 'Accounting'),
])
const layoutEdges = ref<FlowEdge[]>([
  { id: 'l1', source: 'ceo', target: 'cto', type: 'smoothstep', markerEnd: 'none' },
  { id: 'l2', source: 'ceo', target: 'cfo', type: 'smoothstep', markerEnd: 'none' },
  { id: 'l3', source: 'cto', target: 'fe', type: 'smoothstep', markerEnd: 'none' },
  { id: 'l4', source: 'cto', target: 'be', type: 'smoothstep', markerEnd: 'none' },
  { id: 'l5', source: 'cfo', target: 'acc', type: 'smoothstep', markerEnd: 'none' },
])
const layoutMode = ref<'tree' | 'layered'>('tree')
const layoutDir = ref<'vertical' | 'horizontal'>('vertical')
let hires = 0
function hire() {
  const id = `new${++hires}`
  const parent = ['cto', 'cfo', 'fe', 'be'][hires % 4]!
  // Starts where its manager is, then springs to its place in the new layout
  const from = layoutNodes.value.find((n) => n.id === parent)!.position
  layoutNodes.value = [...layoutNodes.value, { ...team(id, `Hire ${hires}`, 'New'), position: { ...from } }]
  layoutEdges.value = [...layoutEdges.value, { id: `l-${id}`, source: parent, target: id, type: 'smoothstep', markerEnd: 'none' }]
}

// ── Groups ──────────────────────────────────────────────────────────────────────────────────────────────
const groupNodes = ref<FlowNode[]>([
  { id: 'vpc', type: 'group', position: { x: 0, y: 0 }, data: { label: 'Private network', icon: 'lan' } },
  { id: 'api', parentId: 'vpc', position: { x: 24, y: 52 }, data: { label: 'API', icon: 'api' } },
  { id: 'db', parentId: 'vpc', position: { x: 24, y: 152 }, data: { label: 'Database', icon: 'database' } },
  { id: 'web', position: { x: -300, y: 60 }, data: { label: 'Web app', icon: 'web' } },
  { id: 'cdn', position: { x: -300, y: 200 }, data: { label: 'CDN', icon: 'public' } },
])
const groupEdges = ref<FlowEdge[]>([
  { id: 'g1', source: 'api', target: 'db', type: 'smoothstep' },
  { id: 'g2', source: 'web', target: 'api', type: 'smoothstep' },
])

// ── Add on drop ─────────────────────────────────────────────────────────────────────────────────────────
const dropNodes = ref<FlowNode[]>([
  { id: 'start', type: 'input', position: { x: 0, y: 80 }, data: { label: 'Start', icon: 'play_arrow' } },
])
const dropEdges = ref<FlowEdge[]>([])
let steps = 0
function onConnectEnd(e: { connection: FlowConnection | null; position: FlowXY; from: { nodeId: string; type: 'source' | 'target' } }) {
  if (e.connection || e.from.type !== 'source') return
  const id = `step${++steps}`
  dropNodes.value = [...dropNodes.value, { id, position: { x: e.position.x, y: e.position.y - 32 }, data: { label: `Step ${steps}`, icon: 'bolt' } }]
  dropEdges.value = [...dropEdges.value, { id: `d-${id}`, source: e.from.nodeId, target: id }]
}

const flowProps: PropDef[] = [
  { name: 'nodes', type: 'FlowNode[]', default: '[]', description: 'The nodes (v-model:nodes). Treated as immutable: changes come back as new arrays' },
  { name: 'edges', type: 'FlowEdge[]', default: '[]', description: 'The edges (v-model:edges)' },
  { name: 'viewport', type: '{ x, y, zoom }', description: 'The view (v-model:viewport)' },
  { name: 'selection', type: '{ nodes: string[], edges: string[] }', description: 'Selected ids (v-model:selection)' },
  { name: 'locked', type: 'boolean', default: 'false', description: 'No moving, connecting, selecting or deleting; the view still pans and zooms (v-model:locked)' },
  { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: "Where the default node's handles go, and the layout's direction" },
  { name: 'background', type: "'dots' | 'grid' | 'none'", default: "'dots'", description: 'The canvas background' },
  { name: 'gridSize', type: 'number', default: '20', description: 'Background spacing and snapping grid, px' },
  { name: 'snapToGrid', type: 'boolean', default: 'false', description: 'Dragged nodes snap to the grid' },
  { name: 'minZoom / maxZoom', type: 'number', default: '0.2 / 4', description: 'Zoom limits' },
  { name: 'fitView', type: 'boolean', default: 'false', description: 'Fits the nodes in view once measured' },
  { name: 'wheel', type: "'pan' | 'zoom'", default: "'pan'", description: 'What the plain wheel does; Ctrl + wheel always zooms' },
  { name: 'zoomOnDoubleClick', type: 'boolean', default: 'true', description: 'A double click on the background zooms in' },
  { name: 'panOnDrag', type: 'boolean', default: 'true', description: 'Dragging the background pans; off, it draws a selection box' },
  { name: 'selectionOnDrag', type: 'boolean', default: 'false', description: 'Dragging the background draws a selection box (Shift + drag always does)' },
  { name: 'nodesDraggable / nodesConnectable / elementsSelectable', type: 'boolean', default: 'true', description: 'Switch those interactions off' },
  { name: 'edgesReconnectable', type: 'boolean', default: 'true', description: "Edges can be pulled off a connected input, or by a selected edge's ends, and dropped on another handle (or on nothing, to disconnect)" },
  { name: 'defaultEdgeOptions', type: 'Partial<FlowEdge>', description: 'Merged into edges made by connecting (type, animated, markerEnd…)' },
  { name: 'autoConnect', type: 'boolean', default: 'true', description: 'Adds the edge when a connection is made; off, only connect fires' },
  { name: 'isValidConnection', type: '(c: FlowConnection) => boolean', description: 'Whether a connection may be made (duplicates and loops on one node never are)' },
  { name: 'connectionRadius', type: 'number', default: '24', description: 'How close to a handle a connection snaps, px' },
  { name: 'beforeDelete', type: '({ nodes, edges }) => boolean | Promise<boolean>', description: 'Asked before anything is deleted (keyboard, an edge\'s ×, an edge dropped on nothing, remove()): false keeps it; a Promise (a confirm dialog) decides later' },
  { name: 'deleteKeys', type: 'string[] | null', default: "['Delete', 'Backspace']", description: 'Keys that delete the selection; null turns deleting off' },
  { name: 'history', type: 'boolean', default: 'true', description: 'Undo and redo over every change to nodes and edges (yours or the canvas\'s)' },
  { name: 'historySize', type: 'number', default: '100', description: 'Undo steps kept' },
  { name: 'guides', type: 'boolean', default: 'true', description: 'Alignment guides (and snapping to them) while dragging one node' },
  { name: 'layout', type: "'tree' | 'layered' | FlowLayout | null", default: 'null', description: "Lays the nodes out whenever the graph's shape changes" },
  { name: 'layoutOptions', type: 'FlowLayoutOptions', description: '{ direction, gap, levelGap }' },
  { name: 'insertOnEdge', type: 'boolean', default: 'true', description: 'A node with no connections dropped onto an edge splices into it (A → C becomes A → B → C); the edge lights up while it\'s over one, and without room the next nodes move along' },
  { name: 'dropIntoGroups', type: 'boolean', default: 'false', description: 'Nodes dropped on a group join it, and leave it when dropped outside' },
  { name: 'animate', type: 'boolean', default: 'true', description: 'Positions spring to their new place when changed from outside' },
  { name: 'getId', type: "(kind: 'node' | 'edge') => string", description: 'Ids for pasted nodes and new edges' },
  { name: 'label', type: 'string', description: "The canvas's accessible name" },
]

const flowEvents: EventDef[] = [
  { name: 'update:nodes / edges / viewport / selection / locked', payload: '…', description: 'The v-models' },
  { name: 'connect', payload: 'FlowConnection', description: 'A connection was made' },
  { name: 'connect-start', payload: '{ nodeId, handleId, type }', description: 'A connection drag started' },
  { name: 'connect-end', payload: '{ connection, position, from }', description: 'It ended: connection is null when dropped on nothing, position is where (to add a node there)' },
  { name: 'reconnect', payload: '{ edge, connection }', description: "An edge's end moved to another handle" },
  { name: 'insert', payload: '{ node, edge, connections }', description: 'A lone node was dropped onto an edge and spliced in (with autoConnect the edge becomes the two connections, keeping its look)' },
  { name: 'node-click / node-dblclick / node-contextmenu', payload: '(node, event)', description: 'On a node' },
  { name: 'node-drag-start / node-drag', payload: '(nodes, event)', description: 'While dragging' },
  { name: 'node-drag-stop', payload: '{ nodes, intersecting, event }', description: 'Dropped; intersecting are the nodes under the dragged one' },
  { name: 'edge-click / edge-dblclick / edge-contextmenu', payload: '(edge, event)', description: 'On an edge' },
  { name: 'pane-click / pane-contextmenu', payload: '(position, event)', description: 'On the background, with the flow position' },
  { name: 'delete', payload: '{ nodes, edges }', description: 'Deleted by the keyboard or remove()' },
  { name: 'init', payload: 'FlowContext', description: 'Measured, laid out and fitted' },
]

const flowSlots: SlotDef[] = [
  { name: 'default', description: 'Over the canvas: MFlowControls, MFlowMinimap, panels of yours. The canvas\'s gestures and wheel leave what\'s here alone, and useFlow() works inside. Props: { flow }' },
  { name: 'node-<type>', description: 'Nodes of that type. Props: { node, data, selected, dragging }' },
  { name: 'edge-<type>', description: 'Edges of that type, as SVG inside a <g>. Props: { edge, path, labelX, labelY, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, sourceAngle, targetAngle, sourceInset, targetInset, selected, highlighted }: the angles are the directions the path leaves and arrives in (for arrowPath), the insets how far an end sits inside a handle, highlighted that a dragged node would splice in' },
  { name: 'edge-label', description: "An edge's label instead of the chip. Props: { edge, selected }" },
  { name: 'empty', description: 'Shown while there are no nodes' },
]

const types: TypeDef[] = [
  {
    name: 'FlowNode',
    fields: [
      { name: 'id', type: 'string', description: 'Unique id' },
      { name: 'type', type: 'string', description: "'default', 'input' (source only), 'output' (target only), 'group', or a #node-<type> slot" },
      { name: 'position', type: '{ x, y }', description: 'Top left corner; relative to the parent with parentId' },
      { name: 'data', type: 'any', description: 'Yours; the default node shows label, subtitle and icon' },
      { name: 'width / height', type: 'number', description: 'A fixed size; otherwise measured (a group wraps its children)' },
      { name: 'parentId / extent', type: "string / 'parent'", description: 'The group it moves with; extent keeps it inside' },
      { name: 'sourcePosition / targetPosition', type: "'top' | 'right' | 'bottom' | 'left'", description: "The default node's handle sides" },
      { name: 'hidden, draggable, selectable, connectable, deletable, class', type: '…', description: 'Per node' },
    ],
  },
  {
    name: 'FlowEdge',
    fields: [
      { name: 'id / source / target', type: 'string', description: 'Ids' },
      { name: 'sourceHandle / targetHandle', type: 'string | null', description: "Handle ids, when a node has several" },
      { name: 'type', type: 'string', description: "'bezier' (default), 'smoothstep', 'step', 'straight', or an #edge-<type> slot" },
      { name: 'label', type: 'string', description: 'A chip on the middle' },
      { name: 'animated', type: 'boolean', description: 'Dashes flowing toward the target' },
      { name: 'markerEnd / markerStart', type: "'arrow' | 'arrow-closed' | 'none'", description: "Arrowheads (end defaults to 'arrow-closed')" },
      { name: 'data, hidden, selectable, deletable, reconnectable, class', type: '…', description: 'Per edge' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFlow</h1>
    <p class="mb-4 text-body-large text-on-surface-variant">
      A node editor: nodes you drag around a canvas that pans and zooms, joined by edges you draw from one handle to
      another. For workflows, automations, pipelines, org charts and diagrams. Nodes and edges are plain objects in
      <code>v-model</code>s; selection, undo and redo, copy and paste, groups and automatic layouts are built in.
      Available from the <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">/flow</code>
      entry point, with no dependencies. Not an M3 spec component: it's made of M3 parts (cards, a floating toolbar)
      with the shape of Vue Flow's API.
    </p>
    <p class="mb-8 text-body-medium text-on-surface-variant">
      Drag the background to pan, Ctrl + wheel or pinch to zoom, Shift + drag to select several. Drag from a handle to
      another node to connect. To disconnect, click the edge and its ×, or drag a connected input (or a selected
      edge's end) away and drop it on nothing; dropped on another node, the edge moves there. Drop a node that isn't
      connected onto an edge to put it in between. Delete removes the selection; Ctrl+Z / Ctrl+Shift+Z undo and redo; Ctrl+C, X, V and A
      copy, cut, paste and select all; the arrows move the selected nodes. On touch (finger or stylus) the same works
      with one finger, two to pinch, and a long press on the background for the selection box.
    </p>

    <ComponentDemo
      title="Basic"
      description="Default nodes (input, default and output types), edges with a label and an animated one, the controls and the minimap. Connect, move, delete and undo. default-edge-options sets what new connections look like: switch them to animated."
      flush
      :code="`<MFlow
  v-model:nodes=&quot;nodes&quot;
  v-model:edges=&quot;edges&quot;
  :default-edge-options=&quot;{ animated: newEdges === 'animated' }&quot;
  fit-view
  class=&quot;h-[420px] rounded-xl&quot;
>
  <MFlowControls history />
  <MFlowMinimap />
</MFlow>`"
      :script="`import { MFlow, MFlowControls, MFlowMinimap, type FlowNode, type FlowEdge } from '@m3ui-vue/m3ui-vue/flow'

const nodes = ref<FlowNode[]>([
  { id: 'order', type: 'input', position: { x: 0, y: 80 }, data: { label: 'New order', subtitle: 'Webhook', icon: 'shopping_cart' } },
  { id: 'stock', position: { x: 260, y: 0 }, data: { label: 'Check stock', subtitle: 'Inventory', icon: 'inventory_2' } },
  { id: 'pay', position: { x: 260, y: 160 }, data: { label: 'Charge card', subtitle: 'Payments', icon: 'credit_card' } },
  { id: 'ship', position: { x: 520, y: 80 }, data: { label: 'Ship', subtitle: 'Carrier API', icon: 'local_shipping' } },
  { id: 'mail', type: 'output', position: { x: 780, y: 80 }, data: { label: 'Email customer', subtitle: 'Mail', icon: 'mail' } },
])
const edges = ref<FlowEdge[]>([
  { id: 'e1', source: 'order', target: 'stock' },
  { id: 'e2', source: 'order', target: 'pay' },
  { id: 'e3', source: 'stock', target: 'ship' },
  { id: 'e4', source: 'pay', target: 'ship', animated: true },
  { id: 'e5', source: 'ship', target: 'mail', label: 'tracking' },
])`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-label-large text-on-surface-variant">New connections</span>
          <MSegmentedButton v-model="newEdges" :options="[{ value: 'solid', label: 'Solid' }, { value: 'animated', label: 'Animated' }]" />
        </div>
        <MFlow v-model:nodes="nodes" v-model:edges="edges" :default-edge-options="{ animated: newEdges === 'animated' }" fit-view class="h-[420px] rounded-xl border border-outline-variant">
          <MFlowControls history />
          <MFlowMinimap />
        </MFlow>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Splice Into an Edge"
      description="Drag Clean up data onto the edge between Fetch orders and Save report: it lights up, and dropped there the node goes in between, keeping the edge's look. There's no room, so Save report and what comes after it move along. One Ctrl+Z puts everything back."
      flush
      :code="`<MFlow v-model:nodes=&quot;nodes&quot; v-model:edges=&quot;edges&quot; fit-view @insert=&quot;({ node, edge }) => save(node, edge)&quot; />`"
    >
      <div class="p-4 sm:p-6">
        <MFlow v-model:nodes="spliceNodes" v-model:edges="spliceEdges" fit-view class="h-[300px] rounded-xl border border-outline-variant" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Nodes"
      description="A #node-condition slot draws its own node with two source handles (yes, no); edges pick one with sourceHandle. Handles are measured where they end up, so place them with classes."
      flush
      :code="`<MFlow v-model:nodes=&quot;nodes&quot; v-model:edges=&quot;edges&quot; fit-view>
  <template #node-condition=&quot;{ data, selected }&quot;>
    <div class=&quot;relative flex size-36 items-center justify-center&quot;>
      <div class=&quot;absolute inset-5 rotate-45 rounded-md bg-tertiary-container&quot;
           :class=&quot;selected && 'ring-2 ring-tertiary'&quot; />
      <span class=&quot;relative px-6 text-center text-label-large text-on-tertiary-container&quot;>{{ data.label }}</span>
      <MFlowHandle type=&quot;target&quot; position=&quot;left&quot; />
      <MFlowHandle id=&quot;yes&quot; position=&quot;top&quot; />
      <MFlowHandle id=&quot;no&quot; position=&quot;bottom&quot; />
    </div>
  </template>
</MFlow>`"
      :script="`const nodes = ref<FlowNode[]>([
  { id: 'in', type: 'input', position: { x: 0, y: 100 }, data: { label: 'Form submitted', icon: 'description' } },
  { id: 'if', type: 'condition', position: { x: 260, y: 92 }, data: { label: 'Budget over $10k?' } },
  { id: 'sales', type: 'output', position: { x: 540, y: 0 }, data: { label: 'Assign to sales', icon: 'support_agent' } },
  { id: 'nurture', type: 'output', position: { x: 540, y: 200 }, data: { label: 'Nurture sequence', icon: 'schedule_send' } },
])
const edges = ref<FlowEdge[]>([
  { id: 'c1', source: 'in', target: 'if' },
  { id: 'c2', source: 'if', sourceHandle: 'yes', target: 'sales', label: 'Yes', type: 'smoothstep' },
  { id: 'c3', source: 'if', sourceHandle: 'no', target: 'nurture', label: 'No', type: 'smoothstep' },
])`"
    >
      <div class="p-4 sm:p-6">
        <MFlow v-model:nodes="customNodes" v-model:edges="customEdges" fit-view class="h-[380px] rounded-xl border border-outline-variant">
          <template #node-condition="{ data, selected }">
            <div class="relative flex size-36 items-center justify-center">
              <div class="absolute inset-5 rotate-45 rounded-md bg-tertiary-container transition-shadow" :class="selected && 'ring-2 ring-tertiary'" />
              <span class="relative px-6 text-center text-label-large text-on-tertiary-container">{{ data.label }}</span>
              <MFlowHandle type="target" position="left" />
              <MFlowHandle id="yes" position="top" />
              <MFlowHandle id="no" position="bottom" />
            </div>
          </template>
          <MFlowControls />
        </MFlow>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Automatic Layout"
      description="layout lays the nodes out whenever the graph's shape changes: a tidy tree, or layers for directed graphs. New nodes spring into place. Pass a function to use dagre or elkjs instead."
      flush
      :code="`<MFlow
  v-model:nodes=&quot;nodes&quot;
  v-model:edges=&quot;edges&quot;
  :layout=&quot;mode&quot;
  :direction=&quot;direction&quot;
  fit-view
/>`"
      :script="`const mode = ref<'tree' | 'layered'>('tree')
const direction = ref<'vertical' | 'horizontal'>('vertical')

// Or any layout function: (nodes, edges, { sizes, direction }) => ({ [id]: { x, y } })
import dagre from '@dagrejs/dagre'
function dagreLayout(nodes, edges, { sizes, direction }) {
  const g = new dagre.graphlib.Graph().setGraph({ rankdir: direction }).setDefaultEdgeLabel(() => ({}))
  for (const n of nodes) g.setNode(n.id, sizes.get(n.id))
  for (const e of edges) g.setEdge(e.source, e.target)
  dagre.layout(g)
  return Object.fromEntries(nodes.map((n) => {
    const p = g.node(n.id)
    return [n.id, { x: p.x - p.width / 2, y: p.y - p.height / 2 }]
  }))
}`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <div class="flex flex-wrap items-center gap-3">
          <MSegmentedButton v-model="layoutMode" :options="[{ value: 'tree', label: 'Tree' }, { value: 'layered', label: 'Layered' }]" />
          <MSegmentedButton v-model="layoutDir" :options="[{ value: 'vertical', label: 'Vertical' }, { value: 'horizontal', label: 'Horizontal' }]" />
          <MButton variant="tonal" icon="person_add" @click="hire">Add a hire</MButton>
        </div>
        <MFlow
          :key="`${layoutMode}-${layoutDir}`"
          v-model:nodes="layoutNodes"
          v-model:edges="layoutEdges"
          :layout="layoutMode"
          :direction="layoutDir"
          fit-view
          class="h-[420px] rounded-xl border border-outline-variant"
        >
          <MFlowControls />
        </MFlow>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Groups"
      description="A node of type group holds the nodes whose parentId is it: they move with it, and the group grows around them. With drop-into-groups, drop the Web app or the CDN inside to make it join."
      flush
      :code="`<MFlow v-model:nodes=&quot;nodes&quot; v-model:edges=&quot;edges&quot; drop-into-groups fit-view />`"
      :script="`const nodes = ref<FlowNode[]>([
  { id: 'vpc', type: 'group', position: { x: 0, y: 0 }, data: { label: 'Private network', icon: 'lan' } },
  { id: 'api', parentId: 'vpc', position: { x: 24, y: 52 }, data: { label: 'API', icon: 'api' } },
  { id: 'db', parentId: 'vpc', position: { x: 24, y: 152 }, data: { label: 'Database', icon: 'database' } },
  { id: 'web', position: { x: -300, y: 60 }, data: { label: 'Web app', icon: 'web' } },
  { id: 'cdn', position: { x: -300, y: 200 }, data: { label: 'CDN', icon: 'public' } },
])`"
    >
      <div class="p-4 sm:p-6">
        <MFlow v-model:nodes="groupNodes" v-model:edges="groupEdges" drop-into-groups fit-view class="h-[380px] rounded-xl border border-outline-variant" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Add on Drop"
      description="A connection dropped on nothing fires connect-end with the spot in flow coordinates: drag from Start's handle into the empty canvas to add a step there, already connected."
      flush
      :code="`<MFlow v-model:nodes=&quot;nodes&quot; v-model:edges=&quot;edges&quot; @connect-end=&quot;onConnectEnd&quot; />`"
      :script="`function onConnectEnd({ connection, position, from }) {
  if (connection || from.type !== 'source') return
  const id = crypto.randomUUID()
  nodes.value = [...nodes.value, { id, position: { x: position.x, y: position.y - 32 }, data: { label: 'Step', icon: 'bolt' } }]
  edges.value = [...edges.value, { id: \`e-\${id}\`, source: from.nodeId, target: id }]
}`"
    >
      <div class="p-4 sm:p-6">
        <MFlow v-model:nodes="dropNodes" v-model:edges="dropEdges" class="h-[340px] rounded-xl border border-outline-variant" @connect-end="onConnectEnd" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Events"
      description="Everything that happens comes out as an event, to save or react: move a node, connect, pull an edge off an input, click an edge and its × to disconnect, delete a node (it asks first, with beforeDelete)."
      flush
      :code="`<MFlow
  v-model:nodes=&quot;nodes&quot;
  v-model:edges=&quot;edges&quot;
  :before-delete=&quot;beforeDelete&quot;
  @node-drag-stop=&quot;({ nodes }) => api.patch('/positions', nodes)&quot;
  @connect=&quot;(c) => api.post('/links', c)&quot;
  @reconnect=&quot;({ edge, connection }) => api.put(\`/links/\${edge.id}\`, connection)&quot;
  @delete=&quot;({ nodes, edges }) => api.delete('/items', { nodes, edges })&quot;
/>`"
      :script="`// Deleting nodes asks first, in a dialog; edges go right away
const asking = ref(null)
function beforeDelete({ nodes }) {
  if (!nodes.length) return true
  return new Promise((resolve) => (asking.value = { resolve }))
}
// <MConfirmDialog :model-value=&quot;!!asking&quot; @confirm=&quot;asking.resolve(true); asking = null&quot; ... />`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <MFlow
          v-model:nodes="eventNodes"
          v-model:edges="eventEdges"
          :before-delete="beforeDelete"
          fit-view
          class="h-[320px] rounded-xl border border-outline-variant"
          @node-drag-stop="({ nodes }) => logEvent(`PATCH /positions  ${names(nodes)}`)"
          @connect="(c) => logEvent(`POST /links  ${c.source} → ${c.target}`)"
          @reconnect="({ edge, connection }) => logEvent(`PUT /links/${edge.id}  ${connection.source} → ${connection.target}`)"
          @delete="({ nodes, edges }) => logEvent(`DELETE /items  ${[...nodes.map((n) => n.id), ...edges.map((e) => e.id)].join(', ')}`)"
        />
        <MConfirmDialog v-model="askOpen" title="Delete node?" :message="asking?.text ?? ''" confirm-label="Delete" danger @confirm="answer(true)" />
        <div class="rounded-lg bg-surface-container p-3 font-mono text-body-small text-on-surface-variant">
          <p v-if="!events.length">Changes show here.</p>
          <p v-for="(l, i) in events" :key="i">{{ l }}</p>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Content inside nodes</h3>
    <p class="mb-4 text-body-medium text-on-surface-variant">
      Buttons, inputs, selects and links inside a node work as usual and never start a drag. For anything else that
      shouldn't drag the node (a slider, a canvas), add <code>data-flow-nodrag</code>; for an area inside a node that
      scrolls on its own, add <code>data-flow-nowheel</code> so the wheel scrolls it instead of moving the view.
      Panels in MFlow's default slot need neither.
    </p>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="flowProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="flowEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="flowSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="types" />

    <ComponentPager current="MFlow" />
  </div>
</template>
