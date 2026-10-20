<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { MButton, MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { MMap, MMapControl, MMapGeoJson, MMapMarker, MMapPopup } from '@m3ui-vue/m3ui-vue/map'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import MapLayersDemo from '@/components/demos/MapLayersDemo.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const STYLE = 'https://tiles.openfreemap.org/styles/liberty'
const CORDOBA: [number, number] = [-64.1888, -31.4201]

// ── Markers, popups and the view ──
const places = [
  { name: 'Plaza San Martín', icon: 'account_balance', lngLat: [-64.1836, -31.4167] as [number, number], note: 'The historic center, with the Cathedral and the Cabildo.' },
  { name: 'Mercado Norte', icon: 'storefront', lngLat: [-64.1856, -31.4093] as [number, number], note: 'Food stalls since 1928.' },
  { name: 'Buen Pastor', icon: 'water', lngLat: [-64.1866, -31.4247] as [number, number], note: 'A cultural center with dancing fountains.' },
  { name: 'Parque Sarmiento', icon: 'park', lngLat: [-64.1736, -31.4296] as [number, number], note: 'The city\'s largest park.' },
]
const center = ref<[number, number]>([...CORDOBA])
const zoom = ref(13)
const pins = ref<[number, number][]>([])
function addPin(e: { lngLat: { lng: number; lat: number } }) {
  pins.value.push([e.lngLat.lng, e.lngLat.lat])
}

// ── Delivery zones ──
// Theme colors as plain strings for MapLibre (it can't use var()), and the docs' dark mode for the basemap
function readTheme() {
  const s = getComputedStyle(document.documentElement)
  const get = (n: string) => s.getPropertyValue(`--color-${n}`).trim()
  return {
    primary: get('primary'), secondary: get('secondary'), tertiary: get('tertiary'),
    dark: document.documentElement.classList.contains('dark'),
  }
}
const theme = ref({ primary: '', secondary: '', tertiary: '', dark: false })
let observer: MutationObserver | undefined
let settle: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  theme.value = readTheme()
  observer = new MutationObserver(() => {
    theme.value = readTheme()
    clearTimeout(settle)
    settle = setTimeout(() => (theme.value = readTheme()), 300)
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-palette'] })
})
onBeforeUnmount(() => {
  observer?.disconnect()
  clearTimeout(settle)
})

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

const useMapCode = `<script setup>
// A control of your own, in a component placed inside <MMap>
import { useMap } from '@m3ui-vue/m3ui-vue/map'

const { map, onReady, onLayer } = useMap()

// Runs once the map exists (MapLibre's own Map: anything it can do)
onReady((map) => map.setMaxZoom(18))

// Features under the pointer of one layer of the style; removed on unmount
onLayer('click', 'parcels-fill', (e) => console.log(e.features?.[0]?.properties))
<\/script>`

const adapterCode = `import { MMap, MMapLayers, orvianAdapter, genericAdapter } from '@m3ui-vue/m3ui-vue/map'

// The Orvian conventions (alias, group, identify, hover, isbaselayer…), with legends from mvt-rs
<MMap :map-style=&quot;'https://tiles.example/services/styles/public:city'&quot; :adapter=&quot;orvianAdapter()&quot;>

// Or your own: the style in, a model of its layers out
const myAdapter = (style) => ({
  title: style.name,
  groups: [{ name: 'base', title: 'Base' }],
  layers: style.layers.map((l) => ({
    id: l.id,
    title: l.metadata?.label ?? l.id,
    group: l.metadata?.section,
    listed: !l.id.startsWith('_'),
    children: [],
    identify: l.type === 'fill' ? { format: {}, exclude: [] } : false,
    hover: false,
  })),
})`

const conventions = [
  ['alias', 'The layer\'s name in the list, the identify cards and the hover popup'],
  ['description', 'Shown under its name'],
  ['group', 'The name of one of the style\'s metadata.groups ({ name, alias })'],
  ['show_in_layerlist', 'false leaves it out of the list (e.g. an outline that follows its fill)'],
  ['childs', 'Layer ids shown, hidden and faded along with it'],
  ['isbaselayer + image', 'A raster base layer for MMapBaseLayers, with its thumbnail'],
  ['identify', 'true: MMapIdentify lists its properties on click'],
  ['fields', 'Per property: alias, prefix, suffix, mask (#,###.00), show: false; plus exclude: [keys]'],
  ['hover', '{ enable, fields: [{ key: { alias, prefix, suffix, mask } }] }: what MMapHover shows'],
  ['legend', '{ show: false } for none, or { wmslegend: url }; by default mvt-rs\'s /services/legends'],
  ['download', 'A link to its data in the list'],
]

const layersProps: PropDef[] = [
  { name: 'search', type: 'boolean', default: 'true', description: 'Show the search field.' },
  { name: 'collapsed', type: 'boolean', default: 'false', description: 'Groups start collapsed.' },
]
const baseLayersProps: PropDef[] = [
  { name: 'imageBase', type: 'string', default: "''", description: 'Prefix for the thumbnails\' paths (e.g. /images/); full URLs stay as they are.' },
  { name: 'none', type: 'boolean', default: 'true', description: 'Offer "no base layer".' },
  { name: 'vertical', type: 'boolean', default: 'false', description: 'Lay them out in a column.' },
]
const identifyProps: PropDef[] = [
  { name: 'enabled', type: 'boolean', default: 'true', description: 'Listen to clicks (pause it while another tool uses them).' },
  { name: 'popup', type: 'boolean', default: 'true', description: 'Show the results in a popup at the click. false to show them yourself from the identify event (with MMapFeatureInfo).' },
  { name: 'marker', type: 'boolean', default: 'true', description: 'Mark where the user clicked while there are results.' },
]
const hoverProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', default: 'false', description: 'On (v-model).' },
  { name: 'control', type: 'boolean | MapControlPosition', default: 'true', description: 'Its on/off button among the map\'s controls, or false.' },
]

const mapProps: PropDef[] = [
  { name: 'mapStyle', type: 'string | StyleSpecification', description: 'The style: a style JSON URL (an MVT server like mvt-rs, OpenFreeMap, MapTiler…) or a style object. Changing it reloads the style. Required.' },
  { name: 'center', type: '[number, number]', description: '[lng, lat] (v-model). When left out, the style\'s, or the remembered view\'s.' },
  { name: 'zoom', type: 'number', description: 'Zoom level (v-model).' },
  { name: 'bearing', type: 'number', description: 'Rotation in degrees (v-model).' },
  { name: 'pitch', type: 'number', description: 'Tilt in degrees (v-model).' },
  { name: 'persist', type: 'boolean | string', default: 'false', description: 'Remember the view in localStorage and start from it next time: true (key m3-map-view) or your own key.' },
  { name: 'navigation', type: 'boolean | MapControlPosition', default: 'true', description: 'Zoom and compass buttons, or the corner for them (true is top-right).' },
  { name: 'geolocate', type: 'boolean | MapControlPosition', default: 'false', description: 'A button that centers the map on the user and follows them.' },
  { name: 'fullscreen', type: 'boolean | MapControlPosition', default: 'false', description: 'A fullscreen button.' },
  { name: 'scale', type: 'boolean | MapControlPosition', default: 'true', description: 'A metric scale bar (true is bottom-left).' },
  { name: 'attribution', type: 'boolean | MapControlPosition', default: 'true', description: 'The style\'s attribution, compact (true is bottom-right). Most tile providers require it.' },
  { name: 'options', type: 'Partial<MapOptions>', description: 'Anything else for MapLibre\'s Map: maxZoom, maxBounds, cooperativeGestures…' },
  { name: 'adapter', type: 'MapAdapter', description: 'Reads the style\'s conventions for MMapLayers, MMapBaseLayers, MMapIdentify and MMapHover: genericAdapter, orvianAdapter() or your own.' },
]
const mapEvents: EventDef[] = [
  { name: 'ready', payload: 'Map', description: 'The map and its style loaded: MapLibre\'s Map, for anything the components don\'t cover.' },
  { name: 'click', payload: 'MapMouseEvent', description: 'A click on the map (lngLat, point).' },
  { name: 'update:center / zoom / bearing / pitch', payload: '[lng, lat] / number', description: 'The view changed (on moveend).' },
]
const mapSlots: SlotDef[] = [
  { name: 'default', description: 'Map components (markers, popups, GeoJSON, controls) and anything to show over the map. Rendered once the map exists.' },
]
const markerProps: PropDef[] = [
  { name: 'lngLat', type: '[number, number]', description: 'Position (v-model with draggable). Required.' },
  { name: 'color', type: 'string', description: 'The pin\'s color. Defaults to the theme\'s primary; ignored with custom content.' },
  { name: 'draggable', type: 'boolean', default: 'false', description: 'Let the user drag it.' },
  { name: 'anchor', type: 'PositionAnchor', description: 'Which part sits on lngLat: bottom for the pin, center for custom content by default.' },
  { name: 'offset', type: '[number, number]', description: 'Offset in pixels.' },
  { name: 'rotation', type: 'number', default: '0', description: 'Rotation in degrees.' },
]
const popupProps: PropDef[] = [
  { name: 'lngLat', type: '[number, number]', description: 'Position. Required.' },
  { name: 'open', type: 'boolean', default: 'true', description: 'Shown (v-model): false when the user closes it.' },
  { name: 'closeButton', type: 'boolean', default: 'true', description: 'Show a close button.' },
  { name: 'closeOnClick', type: 'boolean', default: 'true', description: 'Close it when the map is clicked.' },
  { name: 'anchor', type: 'PositionAnchor', description: 'Its side of lngLat; by default the side with room.' },
  { name: 'offset', type: 'number', default: '8', description: 'Offset in pixels.' },
  { name: 'maxWidth', type: 'string', default: '\'320px\'', description: 'Maximum width.' },
]
const geoJsonProps: PropDef[] = [
  { name: 'data', type: 'GeoJSON | string', description: 'A GeoJSON object or URL. Replace the object to update it. Required.' },
  { name: 'id', type: 'string', description: 'The source id (and its layers\' prefix). Generated when left out.' },
  { name: 'layers', type: 'MapGeoJsonLayer[]', description: 'MapLibre layers without source. By default: fill, outline, line and circle layers in the theme\'s primary, following palette and dark mode.' },
  { name: 'before', type: 'string', description: 'Insert its layers below this layer of the style (e.g. its labels).' },
  { name: 'interactive', type: 'boolean', default: 'false', description: 'Show a pointer over its features.' },
  { name: 'sourceOptions', type: 'Partial<GeoJSONSourceSpecification>', description: 'cluster, promoteId, tolerance…' },
]
const controlProps: PropDef[] = [
  { name: 'position', type: 'MapControlPosition', default: '\'top-right\'', description: 'The corner, stacked with MapLibre\'s controls.' },
  { name: 'group', type: 'boolean', default: 'true', description: 'A control group like the zoom buttons: buttons inside get the same M3 look. false for anything else (an MFab, a search bar).' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMap</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A MapLibre GL map for any style (an MVT server, OpenFreeMap, MapTiler…). Its controls and popups take the M3
      look and follow the theme, its view can be a v-model and be remembered, and markers, popups, GeoJSON and your
      own controls go inside it as components. MapLibre's own map is always one step away. Available from the
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">/map</code> entry point.
    </p>

    <MCard variant="outlined" class="mb-6 p-4">
      <div class="flex items-start gap-3">
        <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container text-label-small font-medium">!</span>
        <div>
          <p class="text-body-medium font-medium">Peer dependency required</p>
          <p class="mt-1 text-body-medium text-on-surface-variant">
            Install MapLibre with <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">pnpm add maplibre-gl</code>
            and import its CSS once: <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">import 'maplibre-gl/dist/maplibre-gl.css'</code>.
            Give the map a height. With server-side rendering it renders an empty box: MapLibre loads in the browser.
          </p>
        </div>
      </div>
    </MCard>

    <ComponentDemo
      title="A map"
      description="A style URL, a center and a zoom. The zoom buttons, scale and attribution are on by default, in the theme's colors."
      :code="`<MMap
  map-style=&quot;https://tiles.openfreemap.org/styles/liberty&quot;
  :center=&quot;[-64.1888, -31.4201]&quot;
  :zoom=&quot;12&quot;
  class=&quot;h-80 rounded-xl&quot;
/>`"
      :script="`import 'maplibre-gl/dist/maplibre-gl.css'
import { MMap } from '@m3ui-vue/m3ui-vue/map'`"
    >
      <MMap :map-style="STYLE" :center="CORDOBA" :zoom="12" class="h-80 w-full rounded-xl" />
    </ComponentDemo>

    <ComponentDemo
      title="Markers, popups and the view"
      description="Markers with your own content and a popup each, pins added by clicking the map (drag them around), the view as a v-model, and the geolocate and fullscreen controls."
      :code="`<MMap
  map-style=&quot;https://tiles.openfreemap.org/styles/liberty&quot;
  v-model:center=&quot;center&quot;
  v-model:zoom=&quot;zoom&quot;
  geolocate
  fullscreen
  class=&quot;h-96 rounded-xl&quot;
  @click=&quot;(e) => pins.push([e.lngLat.lng, e.lngLat.lat])&quot;
>
  <MMapMarker v-for=&quot;p in places&quot; :key=&quot;p.name&quot; :lng-lat=&quot;p.lngLat&quot;>
    <div class=&quot;flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-on-primary shadow-elevation-2&quot;>
      <MIcon :name=&quot;p.icon&quot; :size=&quot;16&quot; />
      <span class=&quot;text-label-medium&quot;>{{ p.name }}</span>
    </div>
    <template #popup>
      <p class=&quot;text-title-small&quot;>{{ p.name }}</p>
      <p class=&quot;text-on-surface-variant&quot;>{{ p.note }}</p>
    </template>
  </MMapMarker>

  <!-- Pins in the theme's primary, draggable: their position is a v-model -->
  <MMapMarker v-for=&quot;(pin, i) in pins&quot; :key=&quot;i&quot; v-model:lng-lat=&quot;pins[i]&quot; draggable />
</MMap>

<p>{{ center[1].toFixed(4) }}, {{ center[0].toFixed(4) }} · zoom {{ zoom.toFixed(1) }}</p>`"
      :script="`const center = ref([-64.1888, -31.4201])
const zoom = ref(13)
const pins = ref([])
const places = [
  { name: 'Plaza San Martín', icon: 'account_balance', lngLat: [-64.1836, -31.4167], note: 'The historic center…' },
  // …
]`"
    >
      <div class="flex w-full flex-col gap-3">
        <MMap
          v-model:center="center"
          v-model:zoom="zoom"
          :map-style="STYLE"
          geolocate
          fullscreen
          class="h-96 w-full rounded-xl"
          @click="addPin"
        >
          <MMapMarker v-for="p in places" :key="p.name" :lng-lat="p.lngLat">
            <div class="flex cursor-pointer items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-on-primary shadow-elevation-2">
              <MIcon :name="p.icon" :size="16" />
              <span class="text-label-medium">{{ p.name }}</span>
            </div>
            <template #popup>
              <p class="text-title-small">{{ p.name }}</p>
              <p class="text-on-surface-variant">{{ p.note }}</p>
            </template>
          </MMapMarker>
          <MMapMarker v-for="(pin, i) in pins" :key="i" v-model:lng-lat="pins[i]!" draggable />
        </MMap>
        <div class="flex flex-wrap items-center justify-between gap-2 text-body-medium text-on-surface-variant">
          <span class="font-mono">{{ center[1].toFixed(4) }}, {{ center[0].toFixed(4) }} · zoom {{ zoom.toFixed(1) }}</span>
          <MButton variant="text" icon="delete_sweep" :disabled="!pins.length" @click="pins = []">Clear {{ pins.length }} pins</MButton>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Delivery zones, in the theme"
      description="Three delivery rings drawn from GeoJSON in the theme's primary, secondary and tertiary, over a basemap that follows light and dark mode (switch them, or the palette). Click a zone for its fee. The buttons on the left are an MMapControl of your own, and the view is remembered between visits with persist."
      :code="`<MMap
  ref=&quot;zoneMap&quot;
  :map-style=&quot;dark ? 'https://tiles.openfreemap.org/styles/dark' : 'https://tiles.openfreemap.org/styles/positron'&quot;
  :center=&quot;[-64.189, -31.418]&quot;
  :zoom=&quot;11.5&quot;
  persist=&quot;delivery-zones&quot;
  class=&quot;h-96 rounded-xl&quot;
>
  <MMapGeoJson v-if=&quot;showZones&quot; :data=&quot;zones&quot; :layers=&quot;zoneLayers&quot; interactive @click=&quot;pickZone&quot; />
  <MMapMarker :lng-lat=&quot;[-64.189, -31.418]&quot;>
    <div class=&quot;grid size-10 place-items-center rounded-full bg-primary-container text-on-primary-container shadow-elevation-2&quot;>
      <MIcon name=&quot;restaurant&quot; :size=&quot;20&quot; />
    </div>
  </MMapMarker>

  <MMapControl position=&quot;top-left&quot;>
    <button type=&quot;button&quot; title=&quot;Delivery zones&quot; @click=&quot;showZones = !showZones&quot;>
      <MIcon :name=&quot;showZones ? 'layers' : 'layers_clear'&quot; :size=&quot;20&quot; />
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
        class="h-96 w-full rounded-xl"
      >
        <MMapGeoJson v-if="showZones" id="zones" :data="zonesData" :layers="zoneLayers" interactive @click="pickZone" />
        <MMapMarker :lng-lat="KITCHEN">
          <div class="grid size-10 place-items-center rounded-full bg-primary-container text-on-primary-container shadow-elevation-2">
            <MIcon name="restaurant" :size="20" />
          </div>
        </MMapMarker>
        <MMapControl position="top-left">
          <button type="button" class="grid place-items-center" :title="showZones ? 'Hide the zones' : 'Show the zones'" @click="showZones = !showZones">
            <MIcon :name="showZones ? 'layers' : 'layers_clear'" :size="20" />
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

    <h2 class="mb-2 mt-10 text-headline-small font-medium">Layers from the style</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      A map server's styles carry more than drawing rules: names for the layers, groups, which ones are base maps,
      which properties to show on click or on hover. An <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">adapter</code>
      reads those conventions, and four components build the UI from them:
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MMapLayers</code> (the layer list),
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MMapBaseLayers</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MMapIdentify</code> and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MMapHover</code>.
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">genericAdapter</code> works with any
      style; <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">orvianAdapter()</code> reads the
      conventions of the Orvian map viewers (built on <a href="https://github.com/mvt-proj/mvt-rs" class="text-primary underline">mvt-rs</a>),
      and writing your own is a function.
    </p>

    <ComponentDemo
      title="Layer list, base maps, identify and hover"
      description="A sample style using the Orvian conventions: switch base maps with the thumbnails, show, hide and fade layers and groups in the list, click a district, a bike lane or a place for its data, and hover them for a summary (its button turns it off)."
      :code="`<MMap :map-style=&quot;style&quot; :adapter=&quot;orvianAdapter()&quot; class=&quot;h-[32rem] rounded-xl&quot;>
  <MMapIdentify />
  <MMapHover v-model=&quot;hover&quot; />
  <MMapControl position=&quot;bottom-left&quot; :group=&quot;false&quot;>
    <MCard variant=&quot;elevated&quot; class=&quot;p-2&quot;>
      <MMapBaseLayers />
    </MCard>
  </MMapControl>
  <!-- Inside the map (it uses its layers), drawn wherever you like -->
  <Teleport to=&quot;#layers-panel&quot; defer>
    <MMapLayers />
  </Teleport>
</MMap>
<div id=&quot;layers-panel&quot; />`"
      :script="`// In the style's metadata: alias, group, identify, fields, hover, isbaselayer…
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
      <MapLayersDemo />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Adapters</h3>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      The Orvian conventions <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">orvianAdapter()</code> reads from each layer's metadata:
    </p>
    <div class="mb-4 overflow-x-auto rounded-xl border border-outline-variant">
      <table class="w-full text-left text-body-medium">
        <tbody>
          <tr v-for="[key, what] in conventions" :key="key" class="border-b border-outline-variant last:border-b-0">
            <td class="whitespace-nowrap px-4 py-2 font-mono text-primary">{{ key }}</td>
            <td class="px-4 py-2 text-on-surface-variant">{{ what }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <MCodeEditor :model-value="adapterCode" language="typescript" :readonly="true" :line-numbers="false" min-height="50px" max-height="420px" class="mb-10" />

    <h2 class="mb-2 mt-10 text-headline-small font-medium">Your own controls and layers</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      In a component inside <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MMap</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">useMap()</code> gives you the map:
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">onReady</code> runs once it exists,
      and <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">on</code> /
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">onLayer</code> add listeners that are
      removed when the component unmounts. That's how the map components are built, and how you add what they don't
      cover: a layer of the style that reacts to clicks, a drawing tool, a control with its own logic.
    </p>
    <MCodeEditor :model-value="useMapCode" language="vue" :readonly="true" :line-numbers="false" min-height="50px" max-height="320px" class="mb-10" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MMap Props</h3>
    <PropsTable :props="mapProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="mapEvents" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="mapSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MMapMarker Props</h3>
    <p class="mb-3 text-body-medium text-on-surface-variant">Its default slot replaces the pin; its #popup slot opens on click. Emits update:lngLat after a drag, and click.</p>
    <PropsTable :props="markerProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MMapPopup Props</h3>
    <PropsTable :props="popupProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MMapGeoJson Props</h3>
    <p class="mb-3 text-body-medium text-on-surface-variant">Emits click with MapLibre's MapLayerMouseEvent (e.features holds the clicked features).</p>
    <PropsTable :props="geoJsonProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MMapControl Props</h3>
    <PropsTable :props="controlProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MMapLayers Props</h3>
    <p class="mb-3 text-body-medium text-on-surface-variant">Its #actions slot adds buttons to an expanded layer (scope: layer, visible). useMapLayers() gives the same state for a list of your own.</p>
    <PropsTable :props="layersProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MMapBaseLayers Props</h3>
    <PropsTable :props="baseLayersProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MMapIdentify Props</h3>
    <p class="mb-3 text-body-medium text-on-surface-variant">Emits identify (results, [lng, lat]) on every click; its default slot replaces the popup's content (scope: results, lngLat, close). MMapFeatureInfo draws results anywhere, with a #value slot per property.</p>
    <PropsTable :props="identifyProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MMapHover Props</h3>
    <PropsTable :props="hoverProps" />


    <ComponentPager current="MMap" />
  </div>
</template>
