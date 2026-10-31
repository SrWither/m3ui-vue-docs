<script setup lang="ts">
import { ref } from 'vue'
import { MIconButton } from '@m3ui-vue/m3ui-vue'
import { MFlow, MFlowControls, type FlowEdge, type FlowNode } from '@m3ui-vue/m3ui-vue/flow'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const nodes = ref<FlowNode[]>([
  { id: 'a', type: 'input', position: { x: 0, y: 40 }, data: { label: 'Draft', icon: 'edit_note' } },
  { id: 'b', position: { x: 260, y: 40 }, data: { label: 'Review', icon: 'rate_review' } },
  { id: 'c', type: 'output', position: { x: 520, y: 40 }, data: { label: 'Publish', icon: 'publish' } },
])
const edges = ref<FlowEdge[]>([{ id: 'e1', source: 'a', target: 'b' }, { id: 'e2', source: 'b', target: 'c' }])
const flow = ref<InstanceType<typeof MFlow>>()

const props: PropDef[] = [
  { name: 'position', type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center-left' | 'center-right'", default: "'bottom-left'", description: 'Where it sits over the canvas' },
  { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Button direction' },
  { name: 'zoom', type: 'boolean', default: 'true', description: 'Zoom in and out buttons' },
  { name: 'fit', type: 'boolean', default: 'true', description: 'Fit view button' },
  { name: 'lock', type: 'boolean', default: 'true', description: "Lock button (MFlow's v-model:locked)" },
  { name: 'history', type: 'boolean', default: 'false', description: 'Undo and redo buttons' },
  { name: 'delete', type: 'boolean', default: 'true', description: 'A delete button that grows in while something deletable is selected (touch has no Delete key); it respects deletable and beforeDelete' },
]
const slots: SlotDef[] = [{ name: 'default', description: 'More buttons at the end' }]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFlowControls</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Zoom, fit, lock, optionally undo and redo, and a delete button while something is selected, as an M3 floating toolbar over an MFlow. Put it in MFlow's default
      slot. Add buttons of your own in its slot; <code>useFlow()</code> (or MFlow's template ref) gives them the same
      controls. From <code>/flow</code>.
    </p>

    <ComponentDemo
      title="Horizontal, With History and a Button of Your Own"
      description="The lock switches off moving, connecting and deleting; the view still pans and zooms."
      flush
      :code="`<MFlow ref=&quot;flow&quot; v-model:nodes=&quot;nodes&quot; v-model:edges=&quot;edges&quot; fit-view>
  <MFlowControls position=&quot;bottom-center&quot; orientation=&quot;horizontal&quot; history>
    <MIconButton icon=&quot;account_tree&quot; label=&quot;Tidy up&quot; @click=&quot;flow.layout('layered')&quot; />
  </MFlowControls>
</MFlow>`"
    >
      <div class="p-4 sm:p-6">
        <MFlow ref="flow" v-model:nodes="nodes" v-model:edges="edges" fit-view class="h-[320px] rounded-xl border border-outline-variant">
          <MFlowControls position="bottom-center" orientation="horizontal" history>
            <MIconButton icon="account_tree" label="Tidy up" @click="flow?.layout('layered')" />
          </MFlowControls>
        </MFlow>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <ComponentPager current="MFlowControls" />
  </div>
</template>
