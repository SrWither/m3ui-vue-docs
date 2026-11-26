<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { computed, ref } from 'vue'
import { MCard, MIconButton, MTextField } from '@m3ui-vue/m3ui-vue'
import { MMap, MMapControl, MMapDraw } from '@m3ui-vue/m3ui-vue/map'
import type { MapDrawCollection, MapDrawFeature } from '@m3ui-vue/m3ui-vue/map'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import { CORDOBA, useMapTheme } from '@/components/demos/mapShared'

// A basemap that follows light and dark mode, so the theme-colored shapes keep their contrast
const theme = useMapTheme()
const baseStyle = computed(() => `https://tiles.openfreemap.org/styles/${theme.value.dark ? 'dark' : 'positron'}`)

// First demo: draw freely, the v-model shown as it changes
const drawn = ref<MapDrawCollection>({ type: 'FeatureCollection', features: [] })
const drawnJson = computed(() => JSON.stringify(drawn.value, (_k, v) => (typeof v === 'number' ? Math.round(v * 1e5) / 1e5 : v), 2))

// Second demo: shapes that come with data, renamed from a card
const plan = ref<MapDrawCollection>({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature', id: 'park',
      properties: { name: 'Sarmiento park' },
      geometry: { type: 'Polygon', coordinates: [[[-64.1835, -31.4275], [-64.1735, -31.4275], [-64.1735, -31.4355], [-64.1835, -31.4355], [-64.1835, -31.4275]]] },
    },
    {
      type: 'Feature', id: 'route',
      properties: { name: 'Bike route' },
      geometry: { type: 'LineString', coordinates: [[-64.195, -31.415], [-64.188, -31.42], [-64.18, -31.425]] },
    },
    { type: 'Feature', id: 'stop', properties: { name: 'Meeting point' }, geometry: { type: 'Point', coordinates: [-64.1866, -31.4166] } },
  ],
})
const selectedId = ref<string | number | null>(null)
const selected = computed(() => plan.value.features.find((f) => f.id === selectedId.value))
function onSelect(feature: MapDrawFeature | null) {
  selectedId.value = feature?.id ?? null
}
function rename(name: string) {
  plan.value = {
    ...plan.value,
    features: plan.value.features.map((f) => (f.id === selectedId.value ? { ...f, properties: { ...f.properties, name } } : f)),
  }
}
const KIND: Record<string, string> = { Point: 'Point', LineString: 'Line', Polygon: 'Polygon' }

const drawProps: PropDef[] = [
  { name: 'modelValue', type: 'MapDrawCollection', description: 'The shapes (v-model): a GeoJSON FeatureCollection of points, lines and polygons. Features keep their properties; ones without an id get one (shape-1…). Multi-geometries are shown and can be deleted, not reshaped.' },
  { name: 'mode', type: "'point' | 'line' | 'polygon' | null", default: 'null', description: 'The drawing mode (v-model:mode). Set it to start drawing from your own buttons.' },
  { name: 'modes', type: 'MapDrawMode[]', default: "['point', 'line', 'polygon']", description: 'Which shapes its control offers, in order.' },
  { name: 'control', type: 'boolean | MapControlPosition', default: 'true', description: 'Its buttons: false (drive it with v-model:mode), or a corner (true is top-right).' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary'", default: "'primary'", description: 'The theme color of the shapes; follows palette and dark mode.' },
  { name: 'editable', type: 'boolean', default: 'true', description: 'Let the user select, reshape and delete shapes. false: draw only.' },
]
const drawEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'MapDrawCollection', description: 'The shapes changed: drawn, reshaped or deleted.' },
  { name: 'update:mode', payload: "'point' | 'line' | 'polygon' | null", description: 'Drawing started or finished.' },
  { name: 'select', payload: 'MapDrawFeature | null', description: 'A shape was selected, or the selection was cleared.' },
]
const gestures = [
  ['Draw', 'Pick a shape in the control, then click to add points (a preview follows the pointer). A point takes one click.'],
  ['Finish', 'Double-click, Enter or Escape; click the first point to close a polygon. Backspace takes back the last point.'],
  ['Select', 'Click a shape: its vertices and midpoints show. Escape or a click on empty map deselects.'],
  ['Reshape', 'Drag a vertex; drag a midpoint to add a vertex; double-click a vertex to remove it.'],
  ['Delete', 'The control\'s delete button, or Delete / Backspace with a shape selected.'],
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMapDraw</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Drawing and editing points, lines and polygons on an
      <RouterLink to="/components/map/mmap" class="text-primary underline">MMap</RouterLink>, as GeoJSON in a v-model,
      with its own control in a corner. Shapes are drawn in the theme's colors, keep their properties when reshaped,
      and the map's clicks belong to it while drawing (<RouterLink to="/components/map/mmapidentify" class="text-primary underline">MMapIdentify</RouterLink>
      waits). It shares its gestures with <RouterLink to="/components/map/mmapmeasure" class="text-primary underline">MMapMeasure</RouterLink>.
    </p>

    <div class="mb-8 overflow-x-auto rounded-xl border border-outline-variant">
      <table class="w-full text-left text-body-medium">
        <tbody>
          <tr v-for="[what, how] in gestures" :key="what" class="border-b border-outline-variant last:border-b-0">
            <td class="whitespace-nowrap px-4 py-2 font-medium text-on-surface">{{ what }}</td>
            <td class="px-4 py-2 text-on-surface-variant">{{ how }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ComponentDemo
      title="Draw, and see the GeoJSON"
      description="The control in the top-right corner draws points, lines and polygons; the v-model below updates as you draw, reshape and delete."
      :code="`<MMap :map-style=&quot;dark ? 'https://tiles.openfreemap.org/styles/dark' : 'https://tiles.openfreemap.org/styles/positron'&quot; :center=&quot;[-64.1888, -31.4201]&quot; :zoom=&quot;13&quot; class=&quot;h-96 rounded-xl&quot;>
  <MMapDraw v-model=&quot;shapes&quot; />
</MMap>

<pre>{{ shapes }}</pre>`"
      :script="`import { MMap, MMapDraw } from '@m3ui-vue/m3ui-vue/map'

const shapes = ref({ type: 'FeatureCollection', features: [] })`"
    >
      <div class="flex w-full flex-col gap-3">
        <MMap :map-style="baseStyle" :center="CORDOBA" :zoom="13" class="h-96 w-full rounded-xl">
          <MMapDraw v-model="drawn" />
        </MMap>
        <pre class="max-h-56 overflow-auto rounded-xl bg-surface-container-high p-3 font-mono text-body-small text-on-surface-variant">{{ drawnJson }}</pre>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Shapes with data"
      description="A plan that comes with its shapes and their names. Select one to rename it in the card (written back into the v-model), reshape it on the map, or delete it. The shapes are in the theme's tertiary."
      :code="`<MMap :map-style=&quot;dark ? 'https://tiles.openfreemap.org/styles/dark' : 'https://tiles.openfreemap.org/styles/positron'&quot; :center=&quot;[-64.1842, -31.4253]&quot; :zoom=&quot;13.4&quot; class=&quot;h-[28rem] rounded-xl&quot;>
  <MMapDraw v-model=&quot;plan&quot; color=&quot;tertiary&quot; @select=&quot;(f) => (selectedId = f?.id ?? null)&quot; />
  <MMapControl v-if=&quot;selected&quot; position=&quot;top-left&quot; :group=&quot;false&quot;>
    <MCard variant=&quot;elevated&quot; class=&quot;w-64 p-4&quot;>
      <MTextField :model-value=&quot;selected.properties.name&quot; label=&quot;Name&quot; @update:model-value=&quot;rename&quot; />
    </MCard>
  </MMapControl>
</MMap>`"
      :script="`const plan = ref({
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', id: 'park', properties: { name: 'Sarmiento park' }, geometry: { type: 'Polygon', coordinates: [/* … */] } },
    { type: 'Feature', id: 'route', properties: { name: 'Bike route' }, geometry: { type: 'LineString', coordinates: [/* … */] } },
    { type: 'Feature', id: 'stop', properties: { name: 'Meeting point' }, geometry: { type: 'Point', coordinates: [-64.1866, -31.4166] } },
  ],
})
const selectedId = ref(null)
const selected = computed(() => plan.value.features.find((f) => f.id === selectedId.value))

// A new collection with the name changed: MMapDraw picks it up
function rename(name) {
  plan.value = { ...plan.value, features: plan.value.features.map((f) => (f.id === selectedId.value ? { ...f, properties: { ...f.properties, name } } : f)) }
}`"
    >
      <MMap :map-style="baseStyle" :center="[-64.1842, -31.4253]" :zoom="13.4" class="h-[28rem] w-full rounded-xl">
        <MMapDraw v-model="plan" color="tertiary" @select="onSelect" />
        <MMapControl v-if="selected" position="top-left" :group="false">
          <MCard variant="elevated" class="flex w-64 flex-col gap-3 p-4">
            <div class="flex items-center gap-2">
              <span class="flex-1 text-label-large text-on-surface-variant">{{ KIND[selected.geometry.type] ?? selected.geometry.type }}</span>
              <MIconButton icon="close" label="Close" :size="32" @click="selectedId = null" />
            </div>
            <MTextField :model-value="String(selected.properties?.name ?? '')" label="Name" @update:model-value="rename(String($event))" />
          </MCard>
        </MMapControl>
      </MMap>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="drawProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="drawEvents" />
    <p class="mt-4 text-body-medium text-on-surface-variant">
      A template ref exposes <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">start(mode)</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">finish()</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">select(id)</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">remove(id?)</code> and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">clear()</code>.
    </p>

    <ComponentPager current="MMapDraw" />
  </div>
</template>
