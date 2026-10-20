<script setup lang="ts">
import { ref } from 'vue'
import { MCard } from '@m3ui-vue/m3ui-vue'
import { MMap, MMapBaseLayers, MMapControl, MMapHover, MMapIdentify, MMapLayers, orvianAdapter } from '@m3ui-vue/m3ui-vue/map'
import type { StyleSpecification } from 'maplibre-gl'

// Sample data around Córdoba (made up), in a style that uses the Orvian conventions in its metadata
const C = [-64.1888, -31.4201]
const box = (dx: number, dy: number, w: number, h: number) => [[
  [C[0]! + dx, C[1]! + dy], [C[0]! + dx + w, C[1]! + dy], [C[0]! + dx + w, C[1]! + dy + h], [C[0]! + dx, C[1]! + dy + h], [C[0]! + dx, C[1]! + dy],
]]
const districts = {
  type: 'FeatureCollection',
  features: [
    { name: 'North district', population: 48210, area: 6.4, dx: -0.03, dy: 0.008 },
    { name: 'South district', population: 61875, area: 7.9, dx: -0.03, dy: -0.034 },
    { name: 'East district', population: 35430, area: 5.2, dx: 0.004, dy: -0.013 },
    { name: 'West district', population: 52990, area: 6.8, dx: -0.066, dy: -0.013 },
  ].map(({ dx, dy, ...properties }) => ({ type: 'Feature', properties, geometry: { type: 'Polygon', coordinates: box(dx, dy, 0.032, 0.026) } })),
}
const bikeLanes = {
  type: 'FeatureCollection',
  features: [
    { name: 'Riverside lane', length: 4.2, line: [[-64.24, -31.405], [-64.2, -31.41], [-64.16, -31.408], [-64.13, -31.398]] },
    { name: 'University lane', length: 3.1, line: [[-64.19, -31.44], [-64.188, -31.425], [-64.186, -31.405]] },
  ].map(({ line, ...properties }) => ({ type: 'Feature', properties, geometry: { type: 'LineString', coordinates: line } })),
}
const places = {
  type: 'FeatureCollection',
  features: [
    { name: 'Central library', kind: 'Library', visitors: 1240, at: [-64.1836, -31.4167] },
    { name: 'Market', kind: 'Market', visitors: 3870, at: [-64.1856, -31.4093] },
    { name: 'Cultural center', kind: 'Culture', visitors: 920, at: [-64.1866, -31.4247] },
    { name: 'Sports center', kind: 'Sports', visitors: 2150, at: [-64.1736, -31.4296] },
  ].map(({ at, ...properties }) => ({ type: 'Feature', properties, geometry: { type: 'Point', coordinates: at } })),
}

// A tile of Córdoba from each base map, as its thumbnail
const tile = (url: string) => url.replace('{z}/{x}/{y}', '11/658/1212')
const OSM = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const TOPO = 'https://tile.opentopomap.org/{z}/{x}/{y}.png'

const style = {
  version: 8,
  name: 'Sample city',
  metadata: { groups: [{ name: 'urban', alias: 'Urban' }, { name: 'mobility', alias: 'Mobility' }] },
  sources: {
    osm: { type: 'raster', tiles: [OSM], tileSize: 256, attribution: '© OpenStreetMap contributors', maxzoom: 19 },
    topo: { type: 'raster', tiles: [TOPO], tileSize: 256, attribution: '© OpenStreetMap contributors, SRTM · © OpenTopoMap (CC-BY-SA)', maxzoom: 17 },
    districts: { type: 'geojson', data: districts },
    bikes: { type: 'geojson', data: bikeLanes },
    places: { type: 'geojson', data: places },
  },
  layers: [
    { id: 'osm', type: 'raster', source: 'osm', metadata: { isbaselayer: true, alias: 'OpenStreetMap', image: tile(OSM) } },
    { id: 'topo', type: 'raster', source: 'topo', layout: { visibility: 'none' }, metadata: { isbaselayer: true, alias: 'Topographic', image: tile(TOPO) } },
    {
      id: 'districts',
      type: 'fill',
      source: 'districts',
      paint: { 'fill-color': '#7c4dff', 'fill-opacity': 0.25 },
      metadata: {
        alias: 'Districts',
        group: 'urban',
        description: 'Sample districts with their population',
        identify: true,
        childs: ['districts-outline'],
        fields: { name: { alias: 'Name' }, population: { alias: 'Population', mask: '#,###' }, area: { alias: 'Area', suffix: 'km²', mask: '#.0' } },
        hover: { enable: true, fields: [{ name: { alias: 'District' } }, { population: { alias: 'Population', mask: '#,###' } }] },
      },
    },
    { id: 'districts-outline', type: 'line', source: 'districts', paint: { 'line-color': '#7c4dff', 'line-width': 2 }, metadata: { show_in_layerlist: false, group: 'urban' } },
    {
      id: 'bikes',
      type: 'line',
      source: 'bikes',
      paint: { 'line-color': '#00897b', 'line-width': 4 },
      metadata: { alias: 'Bike lanes', group: 'mobility', identify: true, fields: { name: { alias: 'Name' }, length: { alias: 'Length', suffix: 'km', mask: '#.0' } } },
    },
    {
      id: 'places',
      type: 'circle',
      source: 'places',
      paint: { 'circle-color': '#e65100', 'circle-radius': 7, 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2 },
      metadata: {
        alias: 'Places',
        description: 'Public buildings',
        identify: true,
        fields: { name: { alias: 'Name' }, kind: { alias: 'Kind' }, visitors: { alias: 'Visitors a day', mask: '#,###' } },
        hover: { enable: true, fields: [{ name: { alias: 'Place' } }, { kind: { alias: 'Kind' } }] },
      },
    },
  ],
} as unknown as StyleSpecification

const adapter = orvianAdapter()
const hover = ref(true)
</script>

<template>
  <div class="grid w-full gap-3 lg:grid-cols-[1fr_320px]">
    <MMap :map-style="style" :adapter="adapter" :center="[-64.19, -31.42]" :zoom="12" class="h-[32rem] w-full rounded-xl">
      <MMapIdentify />
      <MMapHover v-model="hover" />
      <MMapControl position="bottom-left" :group="false">
        <MCard variant="elevated" class="p-2">
          <MMapBaseLayers />
        </MCard>
      </MMapControl>
      <!-- Inside the map so it can use its layers; drawn beside it on wide screens -->
      <Teleport to="#map-layers-panel" defer>
        <MMapLayers />
      </Teleport>
    </MMap>
    <div id="map-layers-panel" class="max-h-[32rem] overflow-y-auto rounded-xl bg-surface-container-low p-3" />
  </div>
</template>
