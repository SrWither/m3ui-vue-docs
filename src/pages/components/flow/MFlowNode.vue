<script setup lang="ts">
import { ref } from 'vue'
import { MChip, MIconButton } from '@m3ui-vue/m3ui-vue'
import { MFlow, MFlowNode, type FlowEdge, type FlowNode } from '@m3ui-vue/m3ui-vue/flow'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const nodes = ref<FlowNode[]>([
  { id: 'a', type: 'card', position: { x: 0, y: 0 }, data: { label: 'Outlined', subtitle: 'variant="outlined"', icon: 'crop_square', variant: 'outlined', color: 'primary' } },
  { id: 'b', type: 'card', position: { x: 280, y: 0 }, data: { label: 'Filled', subtitle: 'variant="filled"', icon: 'square', variant: 'filled', color: 'secondary' } },
  { id: 'c', type: 'card', position: { x: 560, y: 0 }, data: { label: 'Elevated', subtitle: 'variant="elevated"', icon: 'layers', variant: 'elevated', color: 'tertiary' } },
  { id: 'd', type: 'status', position: { x: 280, y: 140 }, data: { label: 'Deploy', subtitle: 'main → production', icon: 'rocket_launch', status: 'Running' } },
])
const edges = ref<FlowEdge[]>([
  { id: 'e1', source: 'a', target: 'b' },
  { id: 'e2', source: 'b', target: 'c' },
  { id: 'e3', source: 'b', target: 'd', type: 'smoothstep' },
])

const props: PropDef[] = [
  { name: 'label', type: 'string', description: 'The title' },
  { name: 'subtitle', type: 'string', description: 'A second line' },
  { name: 'icon', type: 'string', description: 'A Material Symbol, in a colored square' },
  { name: 'variant', type: "'outlined' | 'filled' | 'elevated'", default: "'outlined'", description: 'The M3 card style' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error' | 'neutral'", default: "'primary'", description: "The icon square's color role" },
  { name: 'handles', type: "'both' | 'source' | 'target' | 'none'", default: "'both'", description: 'Which handles it draws' },
  { name: 'sourcePosition / targetPosition', type: "'top' | 'right' | 'bottom' | 'left'", description: "The handles' sides; default the node's, then MFlow's direction" },
]
const slots: SlotDef[] = [
  { name: 'default', description: 'Below the header, inside the card' },
  { name: 'icon', description: 'Instead of the icon square' },
  { name: 'trailing', description: "At the header's end (a status, a menu button); controls in it don't start a drag" },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFlowNode</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      MFlow's default node, and a starting point for your own: an M3 card with an icon, a label and a subtitle, plus a
      handle on each side edges run through (where they arrive and where they leave). It gets a primary outline when
      selected and lifts while dragged. Use it inside a <code>#node-&lt;type&gt;</code> slot to keep the look and the
      handles and add your own content. From <code>/flow</code>.
    </p>

    <ComponentDemo
      title="Variants and Content"
      description="The three card variants, icon colors, and a node of your own with a chip in the trailing slot and a button in the body."
      flush
      :code="`<MFlow v-model:nodes=&quot;nodes&quot; v-model:edges=&quot;edges&quot; fit-view>
  <template #node-card=&quot;{ data }&quot;>
    <MFlowNode v-bind=&quot;data&quot; />
  </template>
  <template #node-status=&quot;{ data }&quot;>
    <MFlowNode :label=&quot;data.label&quot; :subtitle=&quot;data.subtitle&quot; :icon=&quot;data.icon&quot; variant=&quot;filled&quot; handles=&quot;target&quot;>
      <template #trailing><MChip>{{ data.status }}</MChip></template>
      <div class=&quot;flex justify-end&quot;>
        <MIconButton icon=&quot;stop_circle&quot; label=&quot;Stop&quot; size=&quot;xs&quot; />
      </div>
    </MFlowNode>
  </template>
</MFlow>`"
    >
      <div class="p-4 sm:p-6">
        <MFlow v-model:nodes="nodes" v-model:edges="edges" fit-view class="h-[360px] rounded-xl border border-outline-variant">
          <template #node-card="{ data }">
            <MFlowNode v-bind="data" />
          </template>
          <template #node-status="{ data }">
            <MFlowNode :label="data.label" :subtitle="data.subtitle" :icon="data.icon" variant="filled" handles="target">
              <template #trailing><MChip>{{ data.status }}</MChip></template>
              <div class="flex justify-end">
                <MIconButton icon="stop_circle" label="Stop" size="xs" />
              </div>
            </MFlowNode>
          </template>
        </MFlow>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <ComponentPager current="MFlowNode" />
  </div>
</template>
