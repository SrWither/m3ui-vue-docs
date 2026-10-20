<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import MapLayersDemo from '@/components/demos/MapLayersDemo.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const props: PropDef[] = [
  { name: 'modelValue', type: 'boolean', default: 'false', description: 'On (v-model).' },
  { name: 'control', type: 'boolean | MapControlPosition', default: 'true', description: 'Its on/off button among the map\'s controls, or false.' },
]
const events: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Turned on or off with its button.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMapHover</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A summary of the features under the pointer (the fields the style's conventions mark for hover) in a small
      popup that follows it, with an on/off button among the map's controls. A mouse thing: touch screens have no
      hover, so pair it with <RouterLink to="/components/map/mmapidentify" class="text-primary underline">MMapIdentify</RouterLink>.
    </p>

    <ComponentDemo
      title="A summary under the pointer"
      description="Move the pointer over a district, a bike lane or a place of the sample style; its button (top right) turns it off."
      :code="`<MMap :map-style=&quot;style&quot; :adapter=&quot;orvianAdapter()&quot; fullscreen class=&quot;h-[32rem] rounded-xl&quot;>
  <MMapHover v-model=&quot;hover&quot; />
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
      <MapLayersDemo hover />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <ComponentPager current="MMapHover" />
  </div>
</template>
