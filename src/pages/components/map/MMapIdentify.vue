<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import MapLayersDemo from '@/components/demos/MapLayersDemo.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const props: PropDef[] = [
  { name: 'enabled', type: 'boolean', default: 'true', description: 'Listen to clicks (pause it while another tool uses them).' },
  { name: 'popup', type: 'boolean', default: 'true', description: 'Show the results in a popup at the click. false to show them yourself from the identify event (with MMapFeatureInfo).' },
  { name: 'marker', type: 'boolean', default: 'true', description: 'Mark where the user clicked while there are results.' },
]
const events: EventDef[] = [
  { name: 'identify', payload: '(results: MapIdentifyResult[], lngLat: [number, number])', description: 'Every click, with what was found there.' },
]
const slots: SlotDef[] = [
  { name: 'default', description: 'Replaces the popup\'s content. Scope: results, lngLat, close.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMapIdentify</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Click a feature for its data: the properties the style's conventions mark to identify, with their names, prefixes,
      suffixes and number masks, from every identifiable layer under the click, in a popup with a marker. Or show them
      yourself from its identify event, with <RouterLink to="/components/map/mmapfeatureinfo" class="text-primary underline">MMapFeatureInfo</RouterLink>.
      It waits while another tool owns the map's clicks (<RouterLink to="/components/map/mmapmeasure" class="text-primary underline">MMapMeasure</RouterLink> measuring).
    </p>

    <ComponentDemo
      title="Click for the data"
      description="Click a district, a bike lane or a place of the sample style: its formatted properties open in a popup at the click."
      :code="`<MMap :map-style=&quot;style&quot; :adapter=&quot;orvianAdapter()&quot; fullscreen class=&quot;h-[32rem] rounded-xl&quot;>
  <MMapIdentify />
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
      <MapLayersDemo identify />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <ComponentPager current="MMapIdentify" />
  </div>
</template>
