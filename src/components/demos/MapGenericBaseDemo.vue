<script setup lang="ts">
// Base maps from a plain style with genericAdapter: neutral `base` / `image` keys in each layer's metadata, no Orvian
import { MCard } from '@m3ui-vue/m3ui-vue'
import { MMap, MMapBaseLayers, MMapControl, genericAdapter } from '@m3ui-vue/m3ui-vue/map'
import type { StyleSpecification } from 'maplibre-gl'

// A tile of Córdoba from each base map, as its thumbnail
const OSM = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const TOPO = 'https://tile.opentopomap.org/{z}/{x}/{y}.png'
const SAT = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
const tile = (url: string) => url.replace('{z}', '11').replace('{x}', '658').replace('{y}', '1212')

const style = {
  version: 8,
  sources: {
    osm: { type: 'raster', tiles: [OSM], tileSize: 256, attribution: '© OpenStreetMap contributors', maxzoom: 19 },
    topo: { type: 'raster', tiles: [TOPO], tileSize: 256, attribution: '© OpenStreetMap contributors, SRTM · © OpenTopoMap (CC-BY-SA)', maxzoom: 17 },
    sat: { type: 'raster', tiles: [SAT], tileSize: 256, attribution: 'Imagery © Esri, Maxar, Earthstar Geographics', maxzoom: 19 },
  },
  layers: [
    { id: 'osm', type: 'raster', source: 'osm', metadata: { base: true, title: 'Streets', image: tile(OSM) } },
    { id: 'topo', type: 'raster', source: 'topo', layout: { visibility: 'none' }, metadata: { base: true, title: 'Topographic', image: tile(TOPO) } },
    { id: 'sat', type: 'raster', source: 'sat', layout: { visibility: 'none' }, metadata: { base: true, title: 'Satellite', image: tile(SAT) } },
  ],
} as StyleSpecification
</script>

<template>
  <MMap :map-style="style" :adapter="genericAdapter" :center="[-64.19, -31.42]" :zoom="12" fullscreen class="h-[32rem] w-full rounded-xl">
    <MMapControl position="bottom-left" :group="false">
      <MCard variant="elevated" class="p-2">
        <MMapBaseLayers />
      </MCard>
    </MMapControl>
  </MMap>
</template>
