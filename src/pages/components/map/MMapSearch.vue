<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { ref } from 'vue'
import { MMap, MMapSearch, nominatimProvider } from '@m3ui-vue/m3ui-vue/map'
import type { MapSearchResult } from '@m3ui-vue/m3ui-vue/map'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import { CORDOBA, STYLE } from '@/components/demos/mapShared'

const search = nominatimProvider({ countryCodes: ['ar'] })
const picked = ref<MapSearchResult | null>(null)

const searchProps: PropDef[] = [
  { name: 'provider', type: 'MapSearchProvider', default: 'nominatimProvider()', description: 'Where to search: a function (query, signal) returning places ({ label, lngLat, bbox?, type? }). nominatimProvider({ url, limit, language, countryCodes, viewbox, bounded }) or your own (your server, the style\'s search services).' },
  { name: 'position', type: 'MapControlPosition', default: "'top-left'", description: 'The corner.' },
  { name: 'placeholder', type: 'string', description: 'The field\'s placeholder ("Search places" by default).' },
  { name: 'zoom', type: 'number', default: '17', description: 'The zoom for a result without an extent.' },
  { name: 'marker', type: 'boolean', default: 'true', description: 'Mark the picked place.' },
  { name: 'instant', type: 'boolean', default: 'false', description: 'Search while typing (debounced), for providers that allow it.' },
]
const searchEvents: EventDef[] = [
  { name: 'select', payload: 'MapSearchResult', description: 'A result was picked (the map has flown there).' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMapSearch</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A place search card in a corner of an <RouterLink to="/components/map/mmap" class="text-primary underline">MMap</RouterLink>,
      through a provider: Nominatim by default (it searches on Enter, as Nominatim's usage policy requires) or any
      function of yours. Picking a place flies there, or fits its extent, and marks it.
    </p>

    <ComponentDemo
      title="Search places"
      description="Search a place in Argentina and press Enter; pick a result to fly there."
      :code="`<MMap map-style=&quot;https://tiles.openfreemap.org/styles/liberty&quot; :center=&quot;[-64.1888, -31.4201]&quot; :zoom=&quot;13&quot; class=&quot;h-96 rounded-xl&quot;>
  <MMapSearch :provider=&quot;nominatimProvider({ countryCodes: ['ar'] })&quot; @select=&quot;(place) => (picked = place)&quot; />
</MMap>`"
      :script="`import { MMap, MMapSearch, nominatimProvider } from '@m3ui-vue/m3ui-vue/map'

const picked = ref(null)`"
    >
      <div class="flex w-full flex-col gap-3">
        <MMap :map-style="STYLE" :center="CORDOBA" :zoom="13" class="h-96 w-full rounded-xl">
          <MMapSearch :provider="search" @select="(place) => (picked = place)" />
        </MMap>
        <p class="text-body-medium text-on-surface-variant">{{ picked ? `Picked: ${picked.label}` : 'Nothing picked yet.' }}</p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="searchProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="searchEvents" />

    <ComponentPager current="MMapSearch" />
  </div>
</template>
