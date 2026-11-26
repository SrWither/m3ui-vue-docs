<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import MapLayersDemo from '@/components/demos/MapLayersDemo.vue'
import MapGenericBaseDemo from '@/components/demos/MapGenericBaseDemo.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const props: PropDef[] = [
  { name: 'imageBase', type: 'string', default: "''", description: 'Prefix for the thumbnails\' paths (e.g. /images/); full URLs stay as they are.' },
  { name: 'none', type: 'boolean', default: 'true', description: 'Offer "no base layer".' },
  { name: 'vertical', type: 'boolean', default: 'false', description: 'Lay them out in a column.' },
  { name: 'map', type: 'MapSource', description: 'The map, when the switcher is outside it (a side panel): the MMap\'s template ref. Not needed inside the MMap.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMapBaseLayers</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A switcher for the style's base layers (the ones its conventions mark as base maps, with a thumbnail each), one at
      a time or none, from <RouterLink to="/components/map/mmap" class="text-primary underline">MMap</RouterLink>'s
      adapter: <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">genericAdapter</code> with
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">metadata: { base: true, image }</code> on any
      style, <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">orvianAdapter()</code> with
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">isbaselayer</code>, or your own. Where
      to get base maps from: <RouterLink to="/components/map/mmap#base-maps" class="text-primary underline">Base maps</RouterLink>. Its state is shared with <RouterLink to="/components/map/mmaplayers" class="text-primary underline">MMapLayers</RouterLink>
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

    <ComponentDemo
      title="Any style, with genericAdapter"
      description="A plain style with three raster base maps (OpenStreetMap, OpenTopoMap and Esri's satellite imagery): each layer's metadata says base: true, plus a title and a thumbnail image. Base layers stay out of MMapLayers' list; children (a list of layer ids) puts a vector base map's many layers under one entry."
      :code="`<MMap :map-style=&quot;style&quot; :adapter=&quot;genericAdapter&quot; class=&quot;h-[32rem] rounded-xl&quot;>
  <MMapControl position=&quot;bottom-left&quot; :group=&quot;false&quot;>
    <MCard variant=&quot;elevated&quot; class=&quot;p-2&quot;>
      <MMapBaseLayers />
    </MCard>
  </MMapControl>
</MMap>`"
      :script="`import { MMap, MMapBaseLayers, MMapControl, genericAdapter } from '@m3ui-vue/m3ui-vue/map'

const style = {
  version: 8,
  sources: {
    osm: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '© OpenStreetMap contributors' },
    sat: { type: 'raster', tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, attribution: 'Imagery © Esri' },
  },
  layers: [
    { id: 'osm', type: 'raster', source: 'osm', metadata: { base: true, title: 'Streets', image: '/thumbs/osm.png' } },
    // Hidden at first: MMapBaseLayers shows one at a time
    { id: 'sat', type: 'raster', source: 'sat', layout: { visibility: 'none' }, metadata: { base: true, title: 'Satellite', image: '/thumbs/sat.png' } },
    // A vector base map: one entry, its layers toggled together
    // { id: 'land', type: 'fill', …, metadata: { base: true, image: '…', children: ['roads', 'labels'] } },
  ],
}`"
    >
      <MapGenericBaseDemo />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <ComponentPager current="MMapBaseLayers" />
  </div>
</template>
