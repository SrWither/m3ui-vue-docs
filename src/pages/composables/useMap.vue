<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { MMap, MMapIdentify, orvianAdapter } from '@m3ui-vue/m3ui-vue/map'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import MapPinTool from '@/components/demos/MapPinTool.vue'
import { sampleStyle } from '@/components/demos/mapSampleStyle'
import type { TypeDef } from '@/components/TypesTable.vue'

const adapter = orvianAdapter()

const types: TypeDef[] = [
  {
    name: 'useMap() returns',
    description: 'Call it in a component placed inside <MMap> (it throws elsewhere); its listeners go when that component unmounts',
    fields: [
      { name: 'map', type: 'ComputedRef<Map | undefined>', description: 'MapLibre\'s Map, once its style loaded (undefined before, and on the server)' },
      { name: 'maplibre', type: 'ComputedRef<typeof maplibregl | undefined>', description: 'The maplibre-gl module MMap loaded: its classes (Marker, Popup, LngLatBounds…) without importing it yourself' },
      { name: 'onReady', type: '(fn: (map, maplibre) => void) => void', description: 'Runs fn once the map exists (right away if it does), not before the component is mounted, so template refs are there' },
      { name: 'on', type: '(type, listener) => void', description: 'A map event listener (click, moveend, style.load…)' },
      { name: 'onLayer', type: '(type, layerId, listener) => void', description: 'A listener for one layer\'s features (click, mouseenter, mousemove…; e.features holds them). Keyed by layer id, it survives style changes' },
      { name: 'styleVersion', type: 'ComputedRef<number>', description: 'Bumped on every style load: watch it to add your sources and layers again after the style changes' },
      { name: 'activeTool', type: 'Ref<string | null>', description: 'The tool that owns the map\'s clicks (MMapMeasure sets \'measure\'). Set it while yours does, and back to null after: MMapIdentify waits meanwhile' },
    ],
  },
]

const layerCode = `<script setup>
// Your own layer: added once the map exists, and again after a style change
import { watch } from 'vue'
import { useMap } from '@m3ui-vue/m3ui-vue/map'

const { onReady, styleVersion, onLayer } = useMap()

function addHeatmap(map) {
  if (!map.getSource('incidents')) map.addSource('incidents', { type: 'geojson', data: '/incidents.geojson' })
  if (!map.getLayer('incidents-heat')) map.addLayer({ id: 'incidents-heat', type: 'heatmap', source: 'incidents' })
}

onReady((map) => {
  addHeatmap(map)
  watch(styleVersion, () => addHeatmap(map))
})

// Any layer of the style, by id: e.features holds what's under the pointer
onLayer('click', 'parcels', (e) => console.log(e.features?.[0]?.properties))
<\/script>`

const themeCode = `// MapLibre paints need plain colors, not var(--color-primary): read the theme's tokens, and again when it changes
// (dark mode toggles a class on <html>, a palette sets data-palette)
function themeColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(\`--color-\${name}\`).trim()
}

onReady((map) => {
  const paint = () => map.setPaintProperty('incidents-line', 'line-color', themeColor('primary'))
  paint()
  // Chromium animates the tokens for 250ms on a theme switch: read them again once it settles
  new MutationObserver(() => setTimeout(paint, 300))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-palette', 'data-contrast'] })
})`
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useMap</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The map of the enclosing MMap, for controls, layers and tools of your own: MapLibre's Map and module, listeners
      that clean up after themselves, a way to re-add your layers after a style change, and a shared flag for whichever
      tool owns the map's clicks. The map components are built on it. Available from the
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">/map</code> entry point.
    </p>

    <ComponentDemo
      title="A tool of your own"
      description="A drop-pins tool in the map's controls (it gets the M3 look and tooltips like the built-in ones). While it's on it owns the clicks through activeTool, so the identify of the sample layers waits; turn it off and clicking a district shows its data again."
      :code="`<MMap :map-style=&quot;style&quot; :adapter=&quot;orvianAdapter()&quot; class=&quot;h-96 rounded-xl&quot;>
  <MMapIdentify />
  <PinTool />
</MMap>`"
      :script="`// PinTool.vue
import { ref } from 'vue'
import { MMapControl, MMapMarker, useMap } from '@m3ui-vue/m3ui-vue/map'

const { on, activeTool, map } = useMap()
const pins = ref([])
const active = () => activeTool.value === 'pins'

function toggle() {
  activeTool.value = active() ? null : 'pins'
  map.value.getCanvas().style.cursor = active() ? 'crosshair' : ''
}

on('click', (e) => {
  if (active()) pins.value.push([e.lngLat.lng, e.lngLat.lat])
})

// <MMapControl position=&quot;top-left&quot;>
//   <button title=&quot;Drop pins&quot; :aria-pressed=&quot;active()&quot; @click=&quot;toggle&quot;><MIcon name=&quot;add_location_alt&quot; /></button>
// </MMapControl>
// <MMapMarker v-for=&quot;(pin, i) in pins&quot; :key=&quot;i&quot; v-model:lng-lat=&quot;pins[i]&quot; draggable />`"
    >
      <MMap :map-style="sampleStyle" :adapter="adapter" :center="[-64.19, -31.42]" :zoom="12" class="h-96 w-full rounded-xl">
        <MMapIdentify />
        <MapPinTool />
      </MMap>
    </ComponentDemo>

    <h2 class="mb-2 mt-10 text-headline-small font-medium">Your own layers</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      A style change (MMap's mapStyle) drops every source and layer the style didn't bring: add yours in onReady and
      again when styleVersion changes, as MMapGeoJson does.
    </p>
    <MCodeEditor :model-value="layerCode" language="vue" :readonly="true" :line-numbers="false" min-height="50px" max-height="420px" class="mb-8" />

    <h2 class="mb-2 mt-10 text-headline-small font-medium">Theme colors in your layers</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      Controls, popups and anything in HTML take the theme through CSS. What MapLibre paints on its canvas needs plain
      color values: read them from the theme's tokens, and again when the theme, the palette or the contrast changes.
      MMapGeoJson's default layers and MMapMeasure do exactly this.
    </p>
    <MCodeEditor :model-value="themeCode" language="typescript" :readonly="true" :line-numbers="false" min-height="50px" max-height="360px" class="mb-10" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <ComponentPager current="useMap" />
  </div>
</template>
