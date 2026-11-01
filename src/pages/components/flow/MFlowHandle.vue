<script setup lang="ts">
import { ref } from 'vue'
import { MFlow, MFlowHandle, type FlowConnection, type FlowEdge, type FlowNode } from '@m3ui-vue/m3ui-vue/flow'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const nodes = ref<FlowNode[]>([
  { id: 'cam', type: 'device', position: { x: 0, y: 40 }, data: { label: 'Camera', outs: ['video', 'audio'], ins: [] } },
  { id: 'mic', type: 'device', position: { x: 0, y: 200 }, data: { label: 'Microphone', outs: ['audio'], ins: [] } },
  { id: 'mix', type: 'device', position: { x: 300, y: 80 }, data: { label: 'Mixer', ins: ['video', 'audio', 'audio'], outs: ['video', 'audio'] } },
  { id: 'rec', type: 'device', position: { x: 580, y: 100 }, data: { label: 'Recorder', ins: ['video', 'audio'], outs: [] } },
])
const edges = ref<FlowEdge[]>([
  { id: 'v1', source: 'cam', sourceHandle: 'out-0', target: 'mix', targetHandle: 'in-0', markerEnd: 'none' },
  { id: 'a1', source: 'mic', sourceHandle: 'out-0', target: 'mix', targetHandle: 'in-2', markerEnd: 'none' },
])
// Ports only connect to a port of the same kind
const kindOf = (nodeId: string, handle: string | null) => {
  const d = nodes.value.find((n) => n.id === nodeId)?.data as { ins: string[]; outs: string[] }
  const [side, i] = (handle ?? '').split('-')
  return (side === 'in' ? d.ins : d.outs)[Number(i)]
}
const isValidConnection = (c: FlowConnection) => kindOf(c.source, c.sourceHandle) === kindOf(c.target, c.targetHandle)

const props: PropDef[] = [
  { name: 'type', type: "'source' | 'target'", default: "'source'", description: 'Source: edges leave from it. Target: edges arrive' },
  { name: 'position', type: "'top' | 'right' | 'bottom' | 'left' | 'auto'", description: "The side it sits centered on, and the way edges leave it; default from MFlow's direction. 'auto' sits in the node's middle (or where you place it) and each edge leaves or arrives on the side facing its other end: a junction dot, a hub" },
  { name: 'id', type: 'string', description: 'Needed when a node has several of a type; edges name it in sourceHandle / targetHandle' },
  { name: 'connectable', type: 'boolean', default: 'true', description: "Off, it only anchors edges (and is drawn invisible), and a drag on it moves its node: turn it off while a handle-covered node is selected (a junction dot) to let it be moved. A tap on a connectable handle selects its node, a drag from it connects" },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFlowHandle</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A connection point for nodes of your own (inside a <code>#node-&lt;type&gt;</code> slot): drag from it to
      another node's handle to connect them. It sits centered on its node's side; move it anywhere with your own
      classes or style, since it's measured where it ends up. Give each one an <code>id</code> when a node has several.
      While a connection is dragged, the handle it would snap to turns primary, or error when
      <code>isValidConnection</code> refuses it. From <code>/flow</code>.
    </p>

    <ComponentDemo
      title="Typed Ports"
      description="Nodes with a port per signal, stacked along the sides with classes. isValidConnection only lets video meet video and audio meet audio: try connecting the camera's audio to the mixer's video input."
      flush
      :code="`<MFlow v-model:nodes=&quot;nodes&quot; v-model:edges=&quot;edges&quot; :is-valid-connection=&quot;isValidConnection&quot; fit-view>
  <template #node-device=&quot;{ data, selected }&quot;>
    <div class=&quot;w-40 rounded-md border bg-surface-container-low py-2&quot;
         :class=&quot;selected ? 'border-primary' : 'border-outline-variant'&quot;>
      <div class=&quot;px-3 pb-1 text-title-small&quot;>{{ data.label }}</div>
      <div v-for=&quot;(kind, i) in data.ins&quot; :key=&quot;'in' + i&quot; class=&quot;relative px-3 text-body-small&quot;>
        {{ kind }}
        <MFlowHandle :id=&quot;\`in-\${i}\`&quot; type=&quot;target&quot; position=&quot;left&quot; />
      </div>
      <div v-for=&quot;(kind, i) in data.outs&quot; :key=&quot;'out' + i&quot; class=&quot;relative px-3 text-right text-body-small&quot;>
        {{ kind }}
        <MFlowHandle :id=&quot;\`out-\${i}\`&quot; position=&quot;right&quot; />
      </div>
    </div>
  </template>
</MFlow>`"
      :script="`const isValidConnection = (c: FlowConnection) =>
  kindOf(c.source, c.sourceHandle) === kindOf(c.target, c.targetHandle)`"
    >
      <div class="p-4 sm:p-6">
        <MFlow v-model:nodes="nodes" v-model:edges="edges" :is-valid-connection="isValidConnection" fit-view class="h-[360px] rounded-xl border border-outline-variant">
          <template #node-device="{ data, selected }">
            <div class="w-40 rounded-md border bg-surface-container-low py-2" :class="selected ? 'border-primary' : 'border-outline-variant'">
              <div class="px-3 pb-1 text-title-small">{{ data.label }}</div>
              <div v-for="(kind, i) in data.ins" :key="'in' + i" class="relative px-3 text-body-small text-on-surface-variant">
                {{ kind }}
                <MFlowHandle :id="`in-${i}`" type="target" position="left" />
              </div>
              <div v-for="(kind, i) in data.outs" :key="'out' + i" class="relative px-3 text-right text-body-small text-on-surface-variant">
                {{ kind }}
                <MFlowHandle :id="`out-${i}`" position="right" />
              </div>
            </div>
          </template>
        </MFlow>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <ComponentPager current="MFlowHandle" />
  </div>
</template>
