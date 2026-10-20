<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import MapLayersDemo from '@/components/demos/MapLayersDemo.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const props: PropDef[] = [
  { name: 'imageBase', type: 'string', default: "''", description: 'Prefix for the thumbnails\' paths (e.g. /images/); full URLs stay as they are.' },
  { name: 'none', type: 'boolean', default: 'true', description: 'Offer "no base layer".' },
  { name: 'vertical', type: 'boolean', default: 'false', description: 'Lay them out in a column.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMapBaseLayers</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A switcher for the style's base layers (the ones its conventions mark as base maps, with a thumbnail each), one at
      a time or none, from <RouterLink to="/components/map/mmap" class="text-primary underline">MMap</RouterLink>'s
      adapter. Its state is shared with <RouterLink to="/components/map/mmaplayers" class="text-primary underline">MMapLayers</RouterLink>
      and <RouterLink to="/composables/usemaplayers" class="text-primary underline">useMapLayers()</RouterLink>.
    </p>

    <ComponentDemo
      title="Base maps in a corner"
      description="The sample style's base maps as thumbnails in a card, in a bare MMapControl: pick one, or none."
      :code="`<MMap :map-style=&quot;style&quot; :adapter=&quot;orvianAdapter()&quot; fullscreen class=&quot;h-[32rem] rounded-xl&quot;>
  <MMapControl position=&quot;bottom-left&quot; :group=&quot;false&quot;>
    <MCard variant=&quot;elevated&quot; class=&quot;p-2&quot;>
      <MMapBaseLayers />
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
      <MapLayersDemo base />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <ComponentPager current="MMapBaseLayers" />
  </div>
</template>
