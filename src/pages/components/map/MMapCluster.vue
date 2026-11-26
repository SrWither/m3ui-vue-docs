<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { ref, shallowRef } from 'vue'
import { MButtonGroup, MCard, MIcon, MIconButton } from '@m3ui-vue/m3ui-vue'
import { MMap, MMapCluster, MMapControl } from '@m3ui-vue/m3ui-vue/map'
import type { MapCluster } from '@m3ui-vue/m3ui-vue/map'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import { CORDOBA, STYLE } from '@/components/demos/mapShared'

// 2,000 made-up cafés around Córdoba: denser near the center, from a seeded random so every visit is the same
let seed = 7
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
const KINDS = ['Café', 'Bakery', 'Bar', 'Bookshop café'] as const
const cafes = {
  type: 'FeatureCollection' as const,
  features: Array.from({ length: 2000 }, (_, i) => {
    const r = 0.12 * Math.sqrt(-2 * Math.log(rand() || 1e-9)) * 0.5
    const a = rand() * 2 * Math.PI
    return {
      type: 'Feature' as const,
      properties: { name: `${KINDS[i % 4]} #${i + 1}`, kind: KINDS[i % 4], rating: Math.round((3 + rand() * 2) * 10) / 10 },
      geometry: { type: 'Point' as const, coordinates: [CORDOBA[0] + r * Math.cos(a), CORDOBA[1] + r * Math.sin(a) * 0.85] },
    }
  }),
}

const color = ref<'primary' | 'secondary' | 'tertiary'>('primary')
const colorOptions = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'tertiary', label: 'Tertiary' },
]

// Second demo: a cluster's points in a card instead of zooming in
type Leaf = { properties?: Record<string, unknown> | null }
const picked = shallowRef<{ cluster: MapCluster; leaves: Leaf[] } | null>(null)
async function showLeaves(cluster: MapCluster) {
  picked.value = { cluster, leaves: (await cluster.leaves(50)) as Leaf[] }
}

const clusterProps: PropDef[] = [
  { name: 'data', type: 'GeoJSON | string', description: 'A FeatureCollection of points, or its URL. Replace the object to update it. Required.' },
  { name: 'id', type: 'string', description: 'The source id (and its layers\' prefix: id-point-0…). Generated when left out.' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary'", default: "'primary'", description: 'The theme color of the bubbles and the single points; follows palette and dark mode.' },
  { name: 'radius', type: 'number', default: '50', description: 'How close points must be to be grouped, in pixels (MapLibre\'s clusterRadius).' },
  { name: 'maxZoom', type: 'number', default: '14', description: 'Above this zoom nothing is grouped (clusterMaxZoom).' },
  { name: 'zoomOnClick', type: 'boolean', default: 'true', description: 'Zoom in on a bubble when it\'s clicked, until it splits. Set it to false to do something else in cluster-click.' },
  { name: 'pointLayers', type: 'MapGeoJsonLayer[]', description: "How to draw the single points: MapLibre layers without source (filter out the clusters: ['!', ['has', 'point_count']]). A circle in color by default." },
  { name: 'before', type: 'string', description: 'Insert the point layers below this layer of the style.' },
  { name: 'interactive', type: 'boolean', default: 'false', description: 'Show a pointer over the single points.' },
  { name: 'sourceOptions', type: 'Partial<GeoJSONSourceSpecification>', description: 'clusterProperties (sums, maxima… per cluster), clusterMinPoints, promoteId…' },
]
const clusterEvents: EventDef[] = [
  { name: 'click', payload: 'MapLayerMouseEvent', description: 'A click on a single point: e.features holds it.' },
  { name: 'cluster-click', payload: 'MapCluster', description: '{ id, count, lngLat, zoomIn(), leaves(limit?) }: a click on a bubble.' },
]
const clusterSlots: SlotDef[] = [
  { name: 'cluster', scope: '{ id, count, label, lngLat, zoomIn, leaves }', description: 'A bubble\'s content instead of the default button (label is the count, compact: 1.2K). Call zoomIn() from your own button.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMapCluster</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Many points on an <RouterLink to="/components/map/mmap" class="text-primary underline">MMap</RouterLink>, grouped
      into count bubbles that grow with their count and split as you zoom in; a click (or Enter, they're buttons) zooms in
      until one splits. The bubbles are HTML in the theme's colors and type scale, so a raster style without fonts
      works too; the points left on their own are circles in the same color. It's re-added after a style change.
    </p>

    <ComponentDemo
      title="2,000 places"
      description="Made-up cafés around Córdoba. Zoom with the wheel or click a bubble; switch the color, the palette or dark mode."
      :code="`<MButtonGroup v-model=&quot;color&quot; :options=&quot;colorOptions&quot; />

<MMap map-style=&quot;https://tiles.openfreemap.org/styles/liberty&quot; :center=&quot;[-64.1888, -31.4201]&quot; :zoom=&quot;10&quot; class=&quot;h-[28rem] rounded-xl&quot;>
  <MMapCluster :data=&quot;cafes&quot; :color=&quot;color&quot; />
</MMap>`"
      :script="`import { MMap, MMapCluster } from '@m3ui-vue/m3ui-vue/map'

// A FeatureCollection of points (or the URL of one)
const cafes = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { name: 'Café #1' }, geometry: { type: 'Point', coordinates: [-64.18, -31.42] } },
    // …
  ],
}`"
    >
      <div class="flex w-full flex-col gap-3">
        <MButtonGroup v-model="color" :options="colorOptions" />
        <MMap :map-style="STYLE" :center="CORDOBA" :zoom="10" class="h-[28rem] w-full rounded-xl">
          <MMapCluster :data="cafes" :color="color" />
        </MMap>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Your own bubbles, and what's inside"
      description="A #cluster slot draws each bubble (a pill with its count and a zoom icon), and zoomOnClick off turns a click into a list of the cluster's places, from leaves(). The icon on the pill still zooms in, with zoomIn()."
      :code="`<MMap map-style=&quot;https://tiles.openfreemap.org/styles/liberty&quot; :center=&quot;[-64.1888, -31.4201]&quot; :zoom=&quot;11&quot; class=&quot;h-[28rem] rounded-xl&quot;>
  <MMapCluster :data=&quot;cafes&quot; color=&quot;tertiary&quot; :radius=&quot;90&quot; :zoom-on-click=&quot;false&quot; @cluster-click=&quot;showLeaves&quot;>
    <template #cluster=&quot;{ id, label, zoomIn, leaves, count, lngLat }&quot;>
      <div class=&quot;flex items-center gap-1 rounded-full bg-tertiary-container py-1 pl-2.5 pr-0.5 text-label-large text-on-tertiary-container shadow-elevation-2&quot;>
        <button type=&quot;button&quot; @click=&quot;showLeaves({ id, count, lngLat, zoomIn, leaves })&quot;>{{ label }}</button>
        <button type=&quot;button&quot; aria-label=&quot;Zoom in&quot; class=&quot;grid size-6 place-items-center rounded-full&quot; @click=&quot;zoomIn()&quot;>
          <MIcon name=&quot;zoom_in&quot; :size=&quot;16&quot; />
        </button>
      </div>
    </template>
  </MMapCluster>

  <MMapControl v-if=&quot;picked&quot; position=&quot;top-right&quot; :group=&quot;false&quot;>
    <MCard variant=&quot;elevated&quot; class=&quot;w-64&quot;>
      <!-- picked.cluster.count places, picked.leaves[].properties.name -->
    </MCard>
  </MMapControl>
</MMap>`"
      :script="`const picked = shallowRef(null)

// The first 50 of its points
async function showLeaves(cluster) {
  picked.value = { cluster, leaves: await cluster.leaves(50) }
}`"
    >
      <MMap :map-style="STYLE" :center="CORDOBA" :zoom="11" class="h-[28rem] w-full rounded-xl">
        <MMapCluster :data="cafes" color="tertiary" :radius="90" :zoom-on-click="false" @cluster-click="showLeaves">
          <template #cluster="{ id, label, zoomIn, leaves, count, lngLat }">
            <div class="flex items-center gap-1 rounded-full bg-tertiary-container py-1 pl-2.5 pr-0.5 text-label-large text-on-tertiary-container shadow-elevation-2">
              <button type="button" class="cursor-pointer" @click="showLeaves({ id, count, lngLat, zoomIn, leaves })">{{ label }}</button>
              <button type="button" aria-label="Zoom in" class="grid size-6 cursor-pointer place-items-center rounded-full hover:bg-on-tertiary-container/8" @click="zoomIn()">
                <MIcon name="zoom_in" :size="16" />
              </button>
            </div>
          </template>
        </MMapCluster>
        <MMapControl v-if="picked" position="top-right" :group="false">
          <MCard variant="elevated" class="flex max-h-80 w-64 flex-col overflow-hidden">
            <div class="flex items-center gap-2 py-1 pl-4 pr-1">
              <span class="flex-1 text-title-small">{{ picked.cluster.count }} places</span>
              <MIconButton icon="close" label="Close" :size="36" @click="picked = null" />
            </div>
            <ul class="overflow-y-auto pb-2">
              <li v-for="(leaf, i) in picked.leaves" :key="i" class="flex items-center justify-between gap-2 px-4 py-1.5 text-body-medium">
                <span class="truncate">{{ leaf.properties?.name }}</span>
                <span class="shrink-0 text-on-surface-variant">★ {{ leaf.properties?.rating }}</span>
              </li>
              <li v-if="picked.cluster.count > picked.leaves.length" class="px-4 py-1.5 text-body-small text-on-surface-variant">
                and {{ picked.cluster.count - picked.leaves.length }} more
              </li>
            </ul>
          </MCard>
        </MMapControl>
      </MMap>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="clusterProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="clusterEvents" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="clusterSlots" />

    <ComponentPager current="MMapCluster" />
  </div>
</template>
