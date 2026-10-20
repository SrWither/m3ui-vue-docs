<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { ref } from 'vue'
import { MCard } from '@m3ui-vue/m3ui-vue'
import { MMap } from '@m3ui-vue/m3ui-vue/map'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import { CORDOBA, STYLE } from '@/components/demos/mapShared'

const center = ref<[number, number]>([...CORDOBA])
const zoom = ref(13)
const bearing = ref(0)
const pitch = ref(0)

const insideMap = [
  ['MMapMarker', 'pins or your own content at a point, with popups'],
  ['MMapPopup', 'a popup anywhere'],
  ['MMapGeoJson', 'GeoJSON in the theme\'s colors'],
  ['MMapControl', 'your own controls in a corner, including buttons that expand into panels'],
  ['MMapLayers', 'the style\'s layer list'],
  ['MMapBaseLayers', 'its base maps'],
  ['MMapIdentify', 'click for a feature\'s data'],
  ['MMapFeatureInfo', 'those results anywhere'],
  ['MMapHover', 'a summary under the pointer'],
  ['MMapMeasure', 'distances and areas'],
  ['MMapFilter', 'filter a layer by a property'],
  ['MMapSearch', 'search places'],
]

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
  { name: 'attribution', type: 'boolean | MapControlPosition', default: 'true', description: 'The credits of the style\'s sources, as an M3 info button that opens into a pill (true is bottom-right; open on load, folded once the map is dragged). Most tile providers require it.' },
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
  fullscreen
  class=&quot;h-80 rounded-xl&quot;
/>`"
      :script="`import 'maplibre-gl/dist/maplibre-gl.css'
import { MMap } from '@m3ui-vue/m3ui-vue/map'`"
    >
      <MMap :map-style="STYLE" :center="CORDOBA" :zoom="12" fullscreen class="h-80 w-full rounded-xl" />
    </ComponentDemo>

    <ComponentDemo
      title="The view"
      description="Center, zoom, rotation and tilt as v-models (they update when a move ends), remembered between visits with persist, plus the geolocate and fullscreen controls. Rotate or tilt with the right mouse button, Ctrl + drag or two fingers."
      :code="`<MMap
  map-style=&quot;https://tiles.openfreemap.org/styles/liberty&quot;
  v-model:center=&quot;center&quot;
  v-model:zoom=&quot;zoom&quot;
  v-model:bearing=&quot;bearing&quot;
  v-model:pitch=&quot;pitch&quot;
  persist=&quot;my-map&quot;
  geolocate
  fullscreen
  class=&quot;h-96 rounded-xl&quot;
/>

<p>{{ center[1].toFixed(4) }}, {{ center[0].toFixed(4) }} · zoom {{ zoom.toFixed(1) }} · {{ bearing }}° · tilt {{ pitch }}°</p>`"
      :script="`const center = ref([-64.1888, -31.4201])
const zoom = ref(13)
const bearing = ref(0)
const pitch = ref(0)`"
    >
      <div class="flex w-full flex-col gap-3">
        <MMap
          v-model:center="center"
          v-model:zoom="zoom"
          v-model:bearing="bearing"
          v-model:pitch="pitch"
          :map-style="STYLE"
          persist="m3-docs-map-view"
          geolocate
          fullscreen
          class="h-96 w-full rounded-xl"
        />
        <p class="font-mono text-body-medium text-on-surface-variant">
          {{ center[1].toFixed(4) }}, {{ center[0].toFixed(4) }} · zoom {{ zoom.toFixed(1) }} · {{ Math.round(bearing) }}° · tilt {{ Math.round(pitch) }}°
        </p>
      </div>
    </ComponentDemo>

    <h2 class="mb-2 mt-10 text-headline-small font-medium">Inside the map</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">The map's slot takes these, each with its own page:</p>
    <ul class="mb-8 flex list-disc flex-col gap-1.5 pl-6 text-body-medium text-on-surface-variant">
      <li v-for="[name, what] in insideMap" :key="name">
        <RouterLink :to="`/components/map/${name.toLowerCase()}`" class="text-primary underline">{{ name }}</RouterLink>: {{ what }}
      </li>
    </ul>

    <h2 class="mb-2 mt-10 text-headline-small font-medium">Layers from the style</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      A map server's styles carry more than drawing rules: names for the layers, groups, which ones are base maps,
      which properties to show on click or on hover. An <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">adapter</code>
      reads those conventions, and four components build the UI from them:
      <RouterLink to="/components/map/mmaplayers" class="text-primary underline">MMapLayers</RouterLink>,
      <RouterLink to="/components/map/mmapbaselayers" class="text-primary underline">MMapBaseLayers</RouterLink>,
      <RouterLink to="/components/map/mmapidentify" class="text-primary underline">MMapIdentify</RouterLink> and
      <RouterLink to="/components/map/mmaphover" class="text-primary underline">MMapHover</RouterLink>.
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">genericAdapter</code> works with any
      style; <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">orvianAdapter()</code> reads the
      conventions of the Orvian map viewers (built on <a href="https://github.com/mvt-proj/mvt-rs" class="text-primary underline">mvt-rs</a>),
      and writing your own is a function.
    </p>
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

    <h2 class="mb-2 mt-10 text-headline-small font-medium">Build your own</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      The map components are built on public pieces, so controls, panels, filters and tools of your own work the same
      way, with library components inside:
    </p>
    <ul class="mb-4 flex list-disc flex-col gap-1.5 pl-6 text-body-medium text-on-surface-variant">
      <li><RouterLink to="/composables/usemap" class="text-primary underline">useMap()</RouterLink>: MapLibre's map, listeners that clean up after themselves (on, onLayer), styleVersion to re-add your layers after a style change, and activeTool to own the map's clicks while your tool works.</li>
      <li><RouterLink to="/composables/usemaplayers" class="text-primary underline">useMapLayers()</RouterLink>: the adapter's layers with their visibility, opacity, groups and base maps, shared with MMapLayers and MMapBaseLayers; plus identifyFeatures() and formatFieldValue() for an identify of your own.</li>
      <li><RouterLink to="/composables/usemapfilter" class="text-primary underline">useMapFilter()</RouterLink>: filters on top of the style's own (a range, a date, a search).</li>
      <li><RouterLink to="/components/map/mmapcontrol" class="text-primary underline">MMapControl</RouterLink>: anything in a corner of the map, as an M3 control group, bare, or a button that expands into a panel.</li>
      <li>nominatimProvider() or a function of yours as MMapSearch's provider; your own adapter for another server's conventions.</li>
    </ul>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      What MapLibre paints needs plain colors rather than CSS variables (a marker's color too): read the theme's tokens
      as <RouterLink to="/composables/usemap" class="text-primary underline">useMap's page</RouterLink> shows. The smallest custom piece looks like this:
    </p>
    <MCodeEditor :model-value="useMapCode" language="vue" :readonly="true" :line-numbers="false" min-height="50px" max-height="320px" class="mb-10" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="mapProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="mapEvents" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="mapSlots" />

    <ComponentPager current="MMap" />
  </div>
</template>
