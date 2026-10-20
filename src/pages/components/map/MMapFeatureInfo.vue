<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import MapLayersDemo from '@/components/demos/MapLayersDemo.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const props: PropDef[] = [
  { name: 'results', type: 'MapIdentifyResult[]', description: 'What MMapIdentify\'s identify event (or identifyFeatures()) found. Required.' },
]
const slots: SlotDef[] = [
  { name: 'value', description: 'Draws a property\'s value your way, e.g. a URL as a link. Scope: field, result.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMapFeatureInfo</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Identify results as cards (a header with the layer's name, then its formatted fields), anywhere: inside
      <RouterLink to="/components/map/mmapidentify" class="text-primary underline">MMapIdentify</RouterLink>'s popup by
      default, or in a panel of your own fed by its identify event (or by useMapLayers().identifyFeatures()).
    </p>

    <ComponentDemo
      title="Results in a panel of your own"
      description="MMapIdentify without its popup: its identify event fills a card in the top-right corner. Click a district, a bike lane or a place."
      :code="`<MMap :map-style=&quot;style&quot; :adapter=&quot;orvianAdapter()&quot; fullscreen class=&quot;h-[32rem] rounded-xl&quot;>
  <MMapIdentify :popup=&quot;false&quot; @identify=&quot;(r) => (results = r)&quot; />

  <MMapControl position=&quot;top-right&quot; :group=&quot;false&quot;>
    <MCard variant=&quot;elevated&quot; class=&quot;max-h-80 w-64 overflow-y-auto p-3&quot;>
      <MMapFeatureInfo v-if=&quot;results.length&quot; :results=&quot;results&quot; />
      <p v-else>Click a district, a bike lane or a place.</p>
    </MCard>
  </MMapControl>
</MMap>`"
      :script="`import { MMap, orvianAdapter } from '@m3ui-vue/m3ui-vue/map'

// In the style's metadata: alias, group, identify, fields, hover, isbaselayer…
const style = {
  version: 8,
  metadata: { groups: [{ name: 'urban', alias: 'Urban' }, { name: 'mobility', alias: 'Mobility' }] },
  sources: { /* … */ },
  layers: [
    { id: 'osm', type: 'raster', source: 'osm', metadata: { isbaselayer: true, alias: 'OpenStreetMap', image: '…' } },
    {
      id: 'districts', type: 'fill', source: 'districts',
      metadata: {
        alias: 'Districts', group: 'urban', identify: true,
        fields: { population: { alias: 'Population', mask: '#,###' } },
        hover: { enable: true, fields: [{ name: { alias: 'District' } }] },
      },
    },
    // …
  ],
}`"
    >
      <MapLayersDemo panel />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <ComponentPager current="MMapFeatureInfo" />
  </div>
</template>
