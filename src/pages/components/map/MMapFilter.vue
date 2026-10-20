<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { ref } from 'vue'
import { MCard } from '@m3ui-vue/m3ui-vue'
import { MMap, MMapControl, MMapFilter, MMapGeoJson } from '@m3ui-vue/m3ui-vue/map'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import { CORDOBA, STYLE, spots } from '@/components/demos/mapShared'

const kinds = ref<string[]>([])

const filterProps: PropDef[] = [
  { name: 'layer', type: 'string', description: 'The layer\'s id. Required.' },
  { name: 'property', type: 'string', description: 'The property to filter by. Required.' },
  { name: 'values', type: '(string | number)[]', description: 'The values to offer; by default the ones in the layer\'s loaded features.' },
  { name: 'labels', type: 'Record<string, string>', description: 'Labels for the values.' },
  { name: 'modelValue', type: '(string | number)[]', description: 'The selected values (v-model). None selected: no filter.' },
]
const filterEvents: EventDef[] = [
  { name: 'update:modelValue', payload: '(string | number)[]', description: 'A chip was toggled.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMapFilter</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A simple filter for one layer: chips for the values of one property (given, or read from the loaded features),
      on top of the filter the style already has. Put it in a card, a sheet, a toolbar.
      <RouterLink to="/composables/usemapfilter" class="text-primary underline">useMapFilter()</RouterLink> is what it's
      built on, for filters of your own (a range, a date, a search).
    </p>

    <ComponentDemo
      title="Filter by kind"
      description="Sample places drawn with MMapGeoJson (its circle layer is spots-circle), filtered by their kind from a card in a bare MMapControl. None selected shows them all."
      :code="`<MMap map-style=&quot;https://tiles.openfreemap.org/styles/liberty&quot; :center=&quot;[-64.1888, -31.4201]&quot; :zoom=&quot;13&quot; class=&quot;h-96 rounded-xl&quot;>
  <MMapGeoJson id=&quot;spots&quot; :data=&quot;spots&quot; />
  <MMapControl position=&quot;bottom-left&quot; :group=&quot;false&quot;>
    <MCard variant=&quot;elevated&quot; class=&quot;p-3&quot;>
      <MMapFilter v-model=&quot;kinds&quot; layer=&quot;spots-circle&quot; property=&quot;kind&quot; :values=&quot;['Church', 'Museum', 'Park', 'Market']&quot; />
    </MCard>
  </MMapControl>
</MMap>`"
      :script="`import { MMap, MMapControl, MMapFilter, MMapGeoJson } from '@m3ui-vue/m3ui-vue/map'

const kinds = ref([])
const spots = { type: 'FeatureCollection', features: [/* points with a kind */] }`"
    >
      <MMap :map-style="STYLE" :center="CORDOBA" :zoom="13" class="h-96 w-full rounded-xl">
        <MMapGeoJson id="spots" :data="spots" />
        <MMapControl position="bottom-left" :group="false">
          <MCard variant="elevated" class="max-w-[calc(100vw-5rem)] p-3">
            <MMapFilter v-model="kinds" layer="spots-circle" property="kind" :values="['Church', 'Museum', 'Park', 'Market']" />
          </MCard>
        </MMapControl>
      </MMap>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="filterProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="filterEvents" />

    <ComponentPager current="MMapFilter" />
  </div>
</template>
