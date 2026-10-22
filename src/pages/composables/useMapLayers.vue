<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { MMap, MMapControl, orvianAdapter } from '@m3ui-vue/m3ui-vue/map'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import MapLayerChips from '@/components/demos/MapLayerChips.vue'
import { sampleStyle } from '@/components/demos/mapSampleStyle'
import type { TypeDef } from '@/components/TypesTable.vue'

const adapter = orvianAdapter()

const types: TypeDef[] = [
  {
    name: 'useMapLayers(map?)',
    description: 'Outside an MMap (a side panel), pass it the map: its template ref, or a getter for it (() => props.map). Inside one, call it with nothing',
    fields: [
      { name: 'map', type: 'MaybeRefOrGetter<MapSource>', description: 'The MMap (its template ref) or its context; until it mounts the result is empty and onReady waits' },
    ],
  },
  {
    name: 'useMapLayers() returns',
    description: 'Inside an <MMap> with an adapter. The state is shared: MMapLayers, MMapBaseLayers and your UI stay in sync',
    fields: [
      { name: 'model', type: 'ComputedRef<MapLayerModel | undefined>', description: 'The adapter\'s model of the style: title, groups, layers' },
      { name: 'layers', type: 'ComputedRef<MapLayerInfo[]>', description: 'Its layers (id, title, description, group, listed, base, children, identify, hover, legend, download)' },
      { name: 'isVisible / setVisible / toggle', type: '(id) => boolean / (id, visible) / (id)', description: 'A layer\'s visibility; its children follow it' },
      { name: 'opacityOf / setOpacity', type: '(id) => number / (id, opacity)', description: 'A layer\'s opacity, on the paint properties of its type; its children follow it' },
      { name: 'layersOf', type: '(group | null) => MapLayerInfo[]', description: 'The listed layers of a group, or the ungrouped ones with null' },
      { name: 'groupState / setGroupVisible', type: "(group) => 'visible' | 'hidden' | 'partial' / (group, visible)", description: 'A whole group at once' },
      { name: 'baseLayers / baseLayer / setBaseLayer', type: 'ComputedRef<MapLayerInfo[]> / ComputedRef<string | null> / (id | null)', description: 'The base maps, the one shown, and switching (null: none)' },
    ],
  },
  {
    name: 'identifyFeatures(map, point, model)',
    description: 'What MMapIdentify lists on click, for a UI of your own: the identify layers\' features at a point, topmost first',
    fields: [
      { name: 'returns', type: 'MapIdentifyResult[]', description: '{ layer, feature, fields: [{ key, label, value }] }, values formatted by the layer\'s fields' },
    ],
  },
  {
    name: 'formatFieldValue(raw, format) / fieldLabel(key, format)',
    description: 'The formatting the components use: a mask (#,###.00: grouping and decimals, in the page\'s <html lang>), then prefix and suffix',
    fields: [
      { name: 'format', type: 'MapFieldFormat', description: '{ label?, prefix?, suffix?, mask?, hidden? }' },
    ],
  },
]

const identifyCode = `<script setup>
// Click-to-identify with a UI of your own (a side sheet, a table…), without MMapIdentify
import { ref } from 'vue'
import { useMap, useMapLayers, identifyFeatures } from '@m3ui-vue/m3ui-vue/map'

const { on, activeTool } = useMap()
const { model } = useMapLayers()
const results = ref([])

on('click', (e) => {
  if (activeTool.value) return // another tool owns the clicks
  results.value = identifyFeatures(e.target, e.point, model.value)
})
<\/script>`
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useMapLayers</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The layers of an MMap's style as its adapter describes them, with their visibility and opacity: for a layer panel
      or a base map switcher of your own. It's the state MMapLayers and MMapBaseLayers use, shared, so everything stays
      in sync. Available from the <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">/map</code> entry point.
    </p>

    <ComponentDemo
      title="A layer panel of your own"
      description="Filter chips for the sample style's layers, an opacity slider and the base map as a segmented button, built from library components on useMapLayers. Hiding Districts also hides its outline: children follow their layer."
      :code="`<MMap :map-style=&quot;style&quot; :adapter=&quot;orvianAdapter()&quot; class=&quot;h-96 rounded-xl&quot;>
  <MMapControl position=&quot;top-left&quot; :group=&quot;false&quot;>
    <MyLayerPanel />
  </MMapControl>
</MMap>`"
      :script="`// MyLayerPanel.vue
import { computed } from 'vue'
import { useMapLayers } from '@m3ui-vue/m3ui-vue/map'

const { layers, isVisible, toggle, opacityOf, setOpacity, baseLayers, baseLayer, setBaseLayer } = useMapLayers()
const listed = computed(() => layers.value.filter((l) => l.listed))

// <MChip v-for=&quot;layer in listed&quot; type=&quot;filter&quot; :selected=&quot;isVisible(layer.id)&quot; @click=&quot;toggle(layer.id)&quot;>{{ layer.title }}</MChip>
// <MSlider :model-value=&quot;opacityOf('districts')&quot; :min=&quot;0&quot; :max=&quot;1&quot; :step=&quot;0.05&quot; @update:model-value=&quot;setOpacity('districts', $event)&quot; />
// <MSegmentedButton :model-value=&quot;baseLayer ?? 'none'&quot; :options=&quot;…&quot; @update:model-value=&quot;setBaseLayer&quot; />`"
    >
      <MMap :map-style="sampleStyle" :adapter="adapter" :center="[-64.19, -31.42]" :zoom="12" class="h-96 w-full rounded-xl">
        <MMapControl position="top-left" :group="false">
          <MapLayerChips />
        </MMapControl>
      </MMap>
    </ComponentDemo>

    <h2 class="mb-2 mt-10 text-headline-small font-medium">Identify with a UI of your own</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      identifyFeatures() does what MMapIdentify does on click, and returns the results: show them wherever you like
      (MMapFeatureInfo draws them as cards).
    </p>
    <MCodeEditor :model-value="identifyCode" language="vue" :readonly="true" :line-numbers="false" min-height="50px" max-height="360px" class="mb-10" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <ComponentPager current="useMapLayers" />
  </div>
</template>
