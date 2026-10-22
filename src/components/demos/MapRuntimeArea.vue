<script setup lang="ts">
// A source and two layers added at runtime with plain MapLibre calls through useMap(): MMap's keepLayers carries
// them into the next style when mapStyle changes. Added only when missing, so a carried copy is left alone.
import { useMap } from '@m3ui-vue/m3ui-vue/map'
import { CORDOBA } from './mapShared'

const { onReady } = useMap()

const [lng, lat] = CORDOBA
const d = 0.012
const area = {
  type: 'Feature' as const,
  properties: {},
  geometry: {
    type: 'Polygon' as const,
    coordinates: [[[lng - d, lat - d], [lng + d, lat - d * 0.6], [lng + d * 1.2, lat + d], [lng - d * 0.8, lat + d * 1.1], [lng - d, lat - d]]],
  },
}

onReady((map) => {
  if (!map.getSource('my-area')) map.addSource('my-area', { type: 'geojson', data: area })
  if (!map.getLayer('my-area-fill')) map.addLayer({ id: 'my-area-fill', type: 'fill', source: 'my-area', paint: { 'fill-color': '#e91e63', 'fill-opacity': 0.25 } })
  if (!map.getLayer('my-area-line')) map.addLayer({ id: 'my-area-line', type: 'line', source: 'my-area', paint: { 'line-color': '#e91e63', 'line-width': 3 } })
})
</script>

<template>
  <span class="hidden" />
</template>
