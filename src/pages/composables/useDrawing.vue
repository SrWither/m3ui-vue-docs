<script setup lang="ts">
import { ref } from 'vue'
import { MDrawCanvas, type DrawItem } from '@m3ui-vue/m3ui-vue/draw'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import DrawSideRail from '@/components/demos/DrawSideRail.vue'

const items = ref<DrawItem[]>([])

const api: PropDef[] = [
  { name: 'tool / color / size / fill', type: 'Ref', description: 'Writable: the canvas follows (and its v-models update)' },
  { name: 'items / selection', type: 'ComputedRef / Ref', description: 'The drawing, and the selected ids' },
  { name: 'layers / setLayers(layers) / layer', type: 'ComputedRef / function / Ref', description: 'Layers, bottom first, and the one new items go on' },
  { name: 'mode / pages / addPage()', type: 'ComputedRef / Ref / function', description: 'Pages mode' },
  { name: 'zoom / zoomIn() / zoomOut() / fitView()', type: 'ComputedRef / function', description: 'View' },
  { name: 'undo() / redo() / canUndo / canRedo / clear() / deleteSelection()', type: 'function / ComputedRef', description: 'Editing' },
  { name: 'exportSvg(opts?) / exportPng(opts?)', type: 'function', description: 'The drawing or a page as SVG text or a PNG blob' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useDrawing</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The enclosing MDrawCanvas' state and actions, from a component in its default slot: the toolbar and the layers
      panel are built on it, and so can your own. Outside it, the canvas' template ref exposes the actions. From
      <code>/draw</code>.
    </p>

    <ComponentDemo
      title="A Side Rail of Your Own"
      description="A vertical rail with a few tools, a size slider and a page counter, instead of MDrawToolbar."
      flush
      :code="`<MDrawCanvas v-model=&quot;items&quot; mode=&quot;pages&quot; :page-size=&quot;{ width: 420, height: 594 }&quot;>
  <DrawSideRail />
</MDrawCanvas>`"
      :script="`// DrawSideRail.vue
import { useDrawing } from '@m3ui-vue/m3ui-vue/draw'

const draw = useDrawing()
// draw.tool.value = 'brush', draw.size.value = 12, draw.addPage(), draw.undo()…`"
    >
      <div class="p-4 sm:p-6">
        <MDrawCanvas v-model="items" mode="pages" :page-size="{ width: 420, height: 594 }" background="grid" class="h-[460px] rounded-xl">
          <DrawSideRail />
        </MDrawCanvas>
      </div>
    </ComponentDemo>

    <h3 class="mt-6 mb-3 text-title-large font-medium">Returns</h3>
    <PropsTable :props="api" />

    <ComponentPager current="useDrawing" />
  </div>
</template>
