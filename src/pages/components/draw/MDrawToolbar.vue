<script setup lang="ts">
import { ref } from 'vue'
import { MIconButton } from '@m3ui-vue/m3ui-vue'
import { MDrawCanvas, MDrawToolbar, type DrawItem } from '@m3ui-vue/m3ui-vue/draw'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const items = ref<DrawItem[]>([])
const canvas = ref<InstanceType<typeof MDrawCanvas>>()

const props: PropDef[] = [
  { name: 'tools', type: 'DrawTool[]', default: 'all of them', description: 'The tools offered. Pens, erasers and shapes each share one button (it remembers the last one picked) with a menu for the rest' },
  { name: 'colors', type: 'string[]', default: '8 swatches', description: 'Color swatches' },
  { name: 'sizes', type: 'number[]', default: '[2, 4, 8, 16]', description: 'Sizes offered' },
  { name: 'history', type: 'boolean', default: 'true', description: 'Undo and redo' },
  { name: 'customColor', type: 'boolean', default: 'true', description: 'A button that opens MColorPickerModal for any color; it shows the color while it is not one of the swatches' },
]
const slots: SlotDef[] = [
  { name: 'default', description: 'Controls of yours at the start' },
  { name: 'end', description: 'Controls of yours at the end' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MDrawToolbar</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A floating toolbar for an MDrawCanvas: select and pan, pens, erasers, shapes (with a fill toggle), text, colors
      (swatches and a color picker for any other),
      sizes, undo and redo, and delete while something is selected. Put it in the canvas' default slot; it sits at the
      bottom center (style its root to move it). From <code>/draw</code>.
    </p>

    <ComponentDemo
      title="Your Own Tools and Colors"
      description="Fewer tools, a palette of your own, and a Fit button in the end slot calling the canvas' fitView()."
      flush
      :code="`<MDrawCanvas ref=&quot;canvas&quot; v-model=&quot;items&quot; background=&quot;grid&quot;>
  <MDrawToolbar
    :tools=&quot;['pen', 'highlighter', 'eraser', 'arrow', 'text']&quot;
    :colors=&quot;['#263238', '#d81b60', '#00897b']&quot;
    :sizes=&quot;[3, 6]&quot;
  >
    <template #end>
      <MIconButton icon=&quot;fit_screen&quot; label=&quot;Fit&quot; @click=&quot;canvas.fitView()&quot; />
    </template>
  </MDrawToolbar>
</MDrawCanvas>`"
    >
      <div class="p-4 sm:p-6">
        <MDrawCanvas ref="canvas" v-model="items" background="grid" class="h-[380px] rounded-xl">
          <MDrawToolbar :tools="['pen', 'highlighter', 'eraser', 'arrow', 'text']" :colors="['#263238', '#d81b60', '#00897b']" :sizes="[3, 6]">
            <template #end>
              <MIconButton icon="fit_screen" label="Fit" @click="canvas?.fitView()" />
            </template>
          </MDrawToolbar>
        </MDrawCanvas>
      </div>
    </ComponentDemo>

    <h3 class="mt-6 mb-3 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <ComponentPager current="MDrawToolbar" />
  </div>
</template>
