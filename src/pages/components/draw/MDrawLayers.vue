<script setup lang="ts">
import { ref } from 'vue'
import { MDrawCanvas, MDrawLayers, MDrawToolbar, type DrawItem, type DrawLayer } from '@m3ui-vue/m3ui-vue/draw'
import ComponentDemo from '@/components/ComponentDemo.vue'
import ComponentPager from '@/components/ComponentPager.vue'

const sky: DrawItem = { id: 'sky', type: 'shape', shape: 'rect', from: [0, 0], to: [480, 160], color: '#90caf9', size: 1, fill: '#bbdefb', layer: 'back' }
const ground: DrawItem = { id: 'ground', type: 'shape', shape: 'rect', from: [0, 160], to: [480, 260], color: '#a5d6a7', size: 1, fill: '#c8e6c9', layer: 'back' }
const tree: DrawItem = { id: 'tree', type: 'shape', shape: 'ellipse', from: [200, 60], to: [280, 150], color: '#2e7d32', size: 3, fill: '#43a047', layer: 'front' }
const trunk: DrawItem = { id: 'trunk', type: 'shape', shape: 'line', from: [240, 150], to: [240, 200], color: '#6d4c41', size: 10, layer: 'front' }
const items = ref<DrawItem[]>([sky, ground, tree, trunk])
const layers = ref<DrawLayer[]>([
  { id: 'back', name: 'Background', locked: true },
  { id: 'front', name: 'Tree' },
  { id: 'ink', name: 'Ink' },
])
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MDrawLayers</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The layers of an MDrawCanvas, top first: tap one to draw on it, show or hide it, lock it (what's on it can't be
      erased, selected or moved), double-click to rename, reorder with the arrows, add or delete (deleting takes what's
      on it). It edits the canvas' <code>v-model:layers</code>. Sits at the top right by default. From <code>/draw</code>.
    </p>

    <ComponentDemo
      title="A Locked Background"
      description="The background layer is locked: draw on Ink over it, erase freely, and the sky stays. Hide Tree to see behind it."
      flush
      :code="`<MDrawCanvas v-model=&quot;items&quot; v-model:layers=&quot;layers&quot;>
  <MDrawToolbar />
  <MDrawLayers />
</MDrawCanvas>

const layers = ref([
  { id: 'back', name: 'Background', locked: true },
  { id: 'front', name: 'Tree' },
  { id: 'ink', name: 'Ink' },
])`"
    >
      <div class="p-4 sm:p-6">
        <MDrawCanvas v-model="items" v-model:layers="layers" class="h-[420px] rounded-xl">
          <MDrawToolbar />
          <MDrawLayers />
        </MDrawCanvas>
      </div>
    </ComponentDemo>

    <ComponentPager current="MDrawLayers" />
  </div>
</template>
