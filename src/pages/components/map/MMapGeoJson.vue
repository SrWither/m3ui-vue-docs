<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { computed, ref } from 'vue'
import { MIcon } from '@m3ui-vue/m3ui-vue'
import { MMap, MMapControl, MMapGeoJson, MMapMarker, MMapPopup } from '@m3ui-vue/m3ui-vue/map'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import { CORDOBA, STYLE, spots, useMapTheme } from '@/components/demos/mapShared'

const theme = useMapTheme()
const zonesStyle = computed(() => `https://tiles.openfreemap.org/styles/${theme.value.dark ? 'dark' : 'positron'}`)
const KITCHEN: [number, number] = [-64.1890, -31.4180]

/** A circle around the kitchen, `km` wide, as a ring of [lng, lat]. */
function circle(km: number, steps = 64): [number, number][] {
  const [lng, lat] = KITCHEN
  const ring: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * 2 * Math.PI
    ring.push([lng + (km / (111.32 * Math.cos((lat * Math.PI) / 180))) * Math.cos(a), lat + (km / 110.57) * Math.sin(a)])
  }
  return ring
}
const zones = [
  { zone: 1, km: 1.5, fee: 'Free', eta: '15–25 min' },
  { zone: 2, km: 3, fee: '$800', eta: '25–35 min' },
  { zone: 3, km: 5, fee: '$1,500', eta: '35–50 min' },
]
const zonesData = {
  type: 'FeatureCollection' as const,
  // Each zone is a ring: its circle, minus the previous one as a hole
  features: zones.map((z, i) => ({
    type: 'Feature' as const,
    properties: { zone: z.zone, fee: z.fee, eta: z.eta },
    geometry: { type: 'Polygon' as const, coordinates: i ? [circle(z.km), circle(zones[i - 1]!.km).reverse()] : [circle(z.km)] },
  })),
}
const zoneColor = computed(() => ['match', ['get', 'zone'], 1, theme.value.primary, 2, theme.value.secondary, theme.value.tertiary])
const zoneLayers = computed(() => [
  { type: 'fill', paint: { 'fill-color': zoneColor.value, 'fill-opacity': 0.22 } },
  { type: 'line', paint: { 'line-color': zoneColor.value, 'line-width': 2 } },
] as never)

const showZones = ref(true)
const zoneMap = ref<{ map?: { fitBounds: (b: [[number, number], [number, number]], o?: object) => void } }>()
function fitZones() {
  const outer = circle(5)
  const lngs = outer.map((p) => p[0])
  const lats = outer.map((p) => p[1])
  zoneMap.value?.map?.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], { padding: 32 })
}
const picked = ref<{ lngLat: [number, number]; zone: number; fee: string; eta: string } | null>(null)
const pickedOpen = ref(false)
function pickZone(e: { lngLat: { lng: number; lat: number }; features?: { properties: Record<string, unknown> }[] }) {
  const p = e.features?.[0]?.properties
  if (!p) return
  picked.value = { lngLat: [e.lngLat.lng, e.lngLat.lat], zone: Number(p.zone), fee: String(p.fee), eta: String(p.eta) }
  pickedOpen.value = true
}

const geoJsonProps: PropDef[] = [
  { name: 'data', type: 'GeoJSON | string', description: 'A GeoJSON object or URL. Replace the object to update it. Required.' },
  { name: 'id', type: 'string', description: 'The source id (and its layers\' prefix: id-fill, id-line, id-circle…). Generated when left out.' },
  { name: 'layers', type: 'MapGeoJsonLayer[]', description: 'MapLibre layers without source. By default: fill, outline, line and circle layers in the theme\'s primary, following palette and dark mode.' },
  { name: 'before', type: 'string', description: 'Insert its layers below this layer of the style (e.g. its labels).' },
  { name: 'interactive', type: 'boolean', default: 'false', description: 'Show a pointer over its features.' },
  { name: 'sourceOptions', type: 'Partial<GeoJSONSourceSpecification>', description: 'cluster, promoteId, tolerance…' },
]
const geoJsonEvents: EventDef[] = [
  { name: 'click', payload: 'MapLayerMouseEvent', description: 'A click on one of its features: e.features holds them, e.lngLat where.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMapGeoJson</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      GeoJSON on an <RouterLink to="/components/map/mmap" class="text-primary underline">MMap</RouterLink>, from an
      object or a URL. Without layers of your own it's drawn in the theme's primary (fills, outlines, lines and points),
      redrawn when the palette or dark mode changes; it's re-added after a style change, and its features can be clicked.
    </p>

    <ComponentDemo
      title="Points in the theme"
      description="A FeatureCollection of points, with nothing else: the default layers draw it in the theme's primary. Switch the palette or dark mode to see it follow."
      :code="`<MMap map-style=&quot;https://tiles.openfreemap.org/styles/liberty&quot; :center=&quot;[-64.1888, -31.4201]&quot; :zoom=&quot;13&quot; class=&quot;h-80 rounded-xl&quot;>
  <MMapGeoJson :data=&quot;spots&quot; />
</MMap>`"
      :script="`import { MMap, MMapGeoJson } from '@m3ui-vue/m3ui-vue/map'

const spots = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { name: 'Cathedral' }, geometry: { type: 'Point', coordinates: [-64.1843, -31.4163] } },
    // …
  ],
}`"
    >
      <MMap :map-style="STYLE" :center="CORDOBA" :zoom="13" class="h-80 w-full rounded-xl">
        <MMapGeoJson :data="spots" />
      </MMap>
    </ComponentDemo>

    <ComponentDemo
      title="Delivery zones, in the theme"
      description="Three delivery rings with layers of your own in the theme's primary, secondary and tertiary, over a basemap that follows light and dark mode. Click a zone for its fee. The buttons on the left are an MMapControl, and the view is remembered between visits with persist."
      :code="`<MMap
  ref=&quot;zoneMap&quot;
  :map-style=&quot;dark ? 'https://tiles.openfreemap.org/styles/dark' : 'https://tiles.openfreemap.org/styles/positron'&quot;
  :center=&quot;[-64.189, -31.418]&quot;
  :zoom=&quot;11.5&quot;
  persist=&quot;delivery-zones&quot;
  fullscreen
  class=&quot;h-96 rounded-xl&quot;
>
  <MMapGeoJson v-if=&quot;showZones&quot; :data=&quot;zones&quot; :layers=&quot;zoneLayers&quot; interactive @click=&quot;pickZone&quot; />
  <MMapMarker :lng-lat=&quot;[-64.189, -31.418]&quot;>
    <div class=&quot;grid size-10 place-items-center rounded-full bg-primary-container text-on-primary-container shadow-elevation-2&quot;>
      <MIcon name=&quot;restaurant&quot; :size=&quot;20&quot; />
    </div>
  </MMapMarker>

  <MMapControl position=&quot;top-left&quot;>
    <button type=&quot;button&quot; title=&quot;Delivery zones&quot; :aria-pressed=&quot;showZones&quot; @click=&quot;showZones = !showZones&quot;>
      <MIcon name=&quot;layers&quot; :size=&quot;20&quot; />
    </button>
    <button type=&quot;button&quot; title=&quot;Fit the zones&quot; @click=&quot;fitZones&quot;>
      <MIcon name=&quot;fit_screen&quot; :size=&quot;20&quot; />
    </button>
  </MMapControl>

  <MMapPopup v-if=&quot;picked&quot; v-model:open=&quot;pickedOpen&quot; :lng-lat=&quot;picked.lngLat&quot;>
    <p class=&quot;text-title-small&quot;>Zone {{ picked.zone }}</p>
    <p>Delivery {{ picked.fee }} · {{ picked.eta }}</p>
  </MMapPopup>
</MMap>`"
      :script="`// Theme colors as strings (MapLibre can't use var()), re-read when the theme changes
const zoneColor = computed(() => ['match', ['get', 'zone'], 1, colors.primary, 2, colors.secondary, colors.tertiary])
const zoneLayers = computed(() => [
  { type: 'fill', paint: { 'fill-color': zoneColor.value, 'fill-opacity': 0.22 } },
  { type: 'line', paint: { 'line-color': zoneColor.value, 'line-width': 2 } },
])

function pickZone(e) {
  const p = e.features[0].properties
  picked.value = { lngLat: [e.lngLat.lng, e.lngLat.lat], zone: p.zone, fee: p.fee, eta: p.eta }
  pickedOpen.value = true
}

// MapLibre's map, from the MMap ref
const fitZones = () => zoneMap.value.map.fitBounds(bounds, { padding: 32 })`"
    >
      <MMap
        ref="zoneMap"
        :map-style="zonesStyle"
        :center="KITCHEN"
        :zoom="11.5"
        persist="m3-docs-delivery-zones"
        fullscreen
        class="h-96 w-full rounded-xl"
      >
        <MMapGeoJson v-if="showZones" id="zones" :data="zonesData" :layers="zoneLayers" interactive @click="pickZone" />
        <MMapMarker :lng-lat="KITCHEN">
          <div class="grid size-10 place-items-center rounded-full bg-primary-container text-on-primary-container shadow-elevation-2">
            <MIcon name="restaurant" :size="20" />
          </div>
        </MMapMarker>
        <MMapControl position="top-left">
          <button type="button" class="grid place-items-center" :title="showZones ? 'Hide the zones' : 'Show the zones'" :aria-pressed="showZones" @click="showZones = !showZones">
            <MIcon name="layers" :size="20" />
          </button>
          <button type="button" class="grid place-items-center" title="Fit the zones" @click="fitZones">
            <MIcon name="fit_screen" :size="20" />
          </button>
        </MMapControl>
        <MMapPopup v-if="picked" v-model:open="pickedOpen" :lng-lat="picked.lngLat">
          <p class="text-title-small">Zone {{ picked.zone }}</p>
          <p class="text-on-surface-variant">Delivery {{ picked.fee }} · {{ picked.eta }}</p>
        </MMapPopup>
      </MMap>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="geoJsonProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="geoJsonEvents" />

    <ComponentPager current="MMapGeoJson" />
  </div>
</template>
