<script setup lang="ts">
import { ref } from 'vue'
import { MFlow, MFlowMinimap, type FlowEdge, type FlowNode } from '@m3ui-vue/m3ui-vue/flow'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

// A long chain of stages, wider than the canvas
const stages = ['Source', 'Lint', 'Test', 'Build', 'Scan', 'Package', 'Stage', 'Smoke', 'Approve', 'Deploy', 'Verify', 'Notify']
const icons = ['code', 'rule', 'science', 'build', 'security', 'inventory_2', 'cloud_upload', 'local_fire_department', 'how_to_reg', 'rocket_launch', 'verified', 'notifications']
const nodes = ref<FlowNode[]>(stages.map((label, i) => ({
  id: `s${i}`,
  position: { x: i * 240, y: (i % 3) * 70 },
  data: { label, icon: icons[i], status: i < 4 ? 'done' : i < 6 ? 'running' : 'waiting' },
})))
const edges = ref<FlowEdge[]>(stages.slice(1).map((_, i) => ({ id: `e${i}`, source: `s${i}`, target: `s${i + 1}`, animated: i === 4 })))
const statusColor = (n: FlowNode) => ({ done: 'var(--color-primary)', running: 'var(--color-tertiary)', waiting: 'var(--color-outline-variant)' })[(n.data as { status: string }).status]

const props: PropDef[] = [
  { name: 'position', type: 'FlowPanelPosition', default: "'bottom-right'", description: 'Where it sits over the canvas' },
  { name: 'width / height', type: 'number', default: '200 / 140', description: 'Its size, px' },
  { name: 'nodeColor', type: '(node) => string | undefined', description: "A node's fill, any CSS color; default outline-variant, primary when selected" },
  { name: 'pannable', type: 'boolean', default: 'true', description: 'Click or drag in it to move the view' },
  { name: 'zoomable', type: 'boolean', default: 'true', description: 'The wheel over it zooms' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFlowMinimap</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A small overview of an MFlow: every node as a block, the part in view outlined. Click or drag in it to move the
      view there; the wheel over it zooms. Put it in MFlow's default slot. From <code>/flow</code>.
    </p>

    <ComponentDemo
      title="Colored by Status"
      description="A pipeline longer than the canvas: the minimap colors each stage by its status with nodeColor (done, running, waiting)."
      flush
      :code="`<MFlow v-model:nodes=&quot;nodes&quot; v-model:edges=&quot;edges&quot;>
  <MFlowMinimap position=&quot;top-right&quot; :node-color=&quot;statusColor&quot; />
</MFlow>`"
      :script="`const statusColor = (n: FlowNode) => ({
  done: 'var(--color-primary)',
  running: 'var(--color-tertiary)',
  waiting: 'var(--color-outline-variant)',
})[n.data.status]`"
    >
      <div class="p-4 sm:p-6">
        <MFlow v-model:nodes="nodes" v-model:edges="edges" :viewport="{ x: 24, y: 120, zoom: 0.9 }" class="h-[360px] rounded-xl border border-outline-variant">
          <MFlowMinimap position="top-right" :node-color="statusColor" />
        </MFlow>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <ComponentPager current="MFlowMinimap" />
  </div>
</template>
