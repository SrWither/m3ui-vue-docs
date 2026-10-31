<script setup lang="ts">
import { ref } from 'vue'
import { MFlow, MFlowControls, type FlowEdge, type FlowNode } from '@m3ui-vue/m3ui-vue/flow'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import FlowStatusBar from '@/components/demos/FlowStatusBar.vue'

const nodes = ref<FlowNode[]>([
  { id: 'a', type: 'input', position: { x: 0, y: 60 }, data: { label: 'Upload', icon: 'upload' } },
  { id: 'b', position: { x: 260, y: 0 }, data: { label: 'Resize', icon: 'photo_size_select_large' } },
  { id: 'c', position: { x: 260, y: 120 }, data: { label: 'Compress', icon: 'compress' } },
  { id: 'd', type: 'output', position: { x: 520, y: 60 }, data: { label: 'Store', icon: 'cloud_done' } },
])
const edges = ref<FlowEdge[]>([
  { id: 'e1', source: 'a', target: 'b' }, { id: 'e2', source: 'a', target: 'c' },
  { id: 'e3', source: 'b', target: 'd' }, { id: 'e4', source: 'c', target: 'd' },
])

const api: PropDef[] = [
  { name: 'nodes / edges / selection', type: 'ComputedRef', description: 'The current state' },
  { name: 'viewport / size', type: 'Ref', description: 'The view ({ x, y, zoom }) and the canvas size in px' },
  { name: 'locked', type: 'Ref<boolean>', description: 'Writable: the lock' },
  { name: 'getNode(id) / getSize(id) / getAbsolutePosition(id)', type: 'function', description: "A node, its measured size, its corner in flow coordinates (parents added)" },
  { name: 'getIntersectingNodes(node | rect)', type: 'function', description: 'Nodes overlapping a node or a flow rectangle (to drop one node onto another)' },
  { name: 'screenToFlow(p) / flowToScreen(p)', type: 'function', description: 'Between page coordinates and flow coordinates (e.g. to drop a dragged palette item)' },
  { name: 'setViewport(v, opts?) / setCenter(x, y, opts?)', type: 'function', description: 'Move the view, animated by default' },
  { name: 'fitView(opts?) / zoomIn() / zoomOut() / zoomTo(z)', type: 'function', description: 'Fit (padding, nodes, maxZoom…) and zoom' },
  { name: 'addNodes / addEdges / updateNode / updateEdge / remove', type: 'function', description: 'Edit, as undoable steps' },
  { name: 'setSelection({ nodes?, edges? })', type: 'function', description: 'Select' },
  { name: "layout(fn?, options?)", type: '(\'tree\' | \'layered\' | FlowLayout) => Promise', description: 'Lay out now, animated and undoable' },
  { name: 'undo() / redo() / canUndo / canRedo', type: 'function / ComputedRef', description: 'History' },
  { name: 'copy() / cut() / paste(at?)', type: 'function', description: 'The clipboard (shared by every MFlow on the page)' },
  { name: 'startDrag(id, event)', type: '(id: string, e: PointerEvent) => void', description: 'Drags a node with a pointer that\'s already down: add a node from a palette outside the canvas, then hand it the event, and it follows the pointer (guides, splicing into an edge) until let go' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useFlow</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The enclosing MFlow's state and controls, from any component rendered inside it: a panel in its default slot, a
      node of yours in a <code>#node-&lt;type&gt;</code> slot. Outside the canvas, MFlow's template ref exposes the
      same, with one difference Vue makes: through a template ref the refs come unwrapped
      (<code>flow.value.viewport.zoom</code>, <code>flow.value.canUndo</code>), while <code>useFlow()</code> returns them as refs
      (<code>flow.viewport.value.zoom</code>). <code>useFlowNode()</code> gives a node's own component its <code>node</code>, <code>selected</code> and
      <code>dragging</code>. From <code>/flow</code>.
    </p>

    <ComponentDemo
      title="A Status Bar of Your Own"
      description="A component in MFlow's default slot reads the zoom and the selection, and selects, centers and deletes through useFlow."
      flush
      :code="`<MFlow v-model:nodes=&quot;nodes&quot; v-model:edges=&quot;edges&quot; fit-view>
  <FlowStatusBar />
</MFlow>`"
      :script="`// FlowStatusBar.vue
import { computed } from 'vue'
import { useFlow } from '@m3ui-vue/m3ui-vue/flow'

const flow = useFlow()
const zoom = computed(() => Math.round(flow.viewport.value.zoom * 100))
const selected = computed(() => flow.selection.value.nodes)
function focusFirst() {
  const id = flow.nodes.value[0].id
  const p = flow.getAbsolutePosition(id)
  const s = flow.getSize(id)
  flow.setSelection({ nodes: [id] })
  flow.setCenter(p.x + s.width / 2, p.y + s.height / 2, { zoom: 1.5 })
}`"
    >
      <div class="p-4 sm:p-6">
        <MFlow v-model:nodes="nodes" v-model:edges="edges" fit-view class="h-[340px] rounded-xl border border-outline-variant">
          <FlowStatusBar />
          <MFlowControls position="top-left" />
        </MFlow>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Returns</h3>
    <PropsTable :props="api" />

    <ComponentPager current="useFlow" />
  </div>
</template>
