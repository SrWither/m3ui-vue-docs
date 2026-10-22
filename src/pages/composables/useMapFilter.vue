<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { MMap, MMapControl, MMapHover, orvianAdapter } from '@m3ui-vue/m3ui-vue/map'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import MapPopulationFilter from '@/components/demos/MapPopulationFilter.vue'
import { sampleStyle } from '@/components/demos/mapSampleStyle'
import type { TypeDef } from '@/components/TypesTable.vue'

const adapter = orvianAdapter()

const types: TypeDef[] = [
  {
    name: 'useMapFilter(map?)',
    description: 'Outside an MMap (a side panel), pass it the map: its template ref, or a getter for it (() => props.map). Inside one, call it with nothing',
    fields: [
      { name: 'map', type: 'MaybeRefOrGetter<MapSource>', description: 'The MMap (its template ref) or its context; until it mounts the result is empty and onReady waits' },
    ],
  },
  {
    name: 'useMapFilter() returns',
    description: 'Inside an <MMap>. MMapFilter is built on it',
    fields: [
      { name: 'setFilter', type: '(layerId, filter | null) => void', description: 'Filters a layer with a MapLibre filter expression, on top of the filter its style already has (both apply); null brings the style\'s back' },
      { name: 'valuesOf', type: '(layerId, property) => (string | number)[]', description: 'The distinct values of a property among the layer\'s features loaded in the map (for vector tiles, the ones in view), sorted' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useMapFilter</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Filters for an MMap's layers that keep the filters their style already has: a layer that only draws parks keeps
      doing so, whatever you filter on top. MMapFilter (chips for a property's values) is built on it; use it for any
      other filter: a range, a date, a search, several properties at once. Available from the
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">/map</code> entry point.
    </p>

    <ComponentDemo
      title="A range filter of your own"
      description="An MSlider in range mode over the sample districts' population: only those within it stay on the map (hover them for their numbers)."
      :code="`<MMap :map-style=&quot;style&quot; :adapter=&quot;orvianAdapter()&quot; class=&quot;h-96 rounded-xl&quot;>
  <MMapHover :model-value=&quot;true&quot; />
  <MMapControl position=&quot;top-left&quot; :group=&quot;false&quot;>
    <PopulationFilter />
  </MMapControl>
</MMap>`"
      :script="`// PopulationFilter.vue
import { ref, watch } from 'vue'
import { useMap, useMapFilter } from '@m3ui-vue/m3ui-vue/map'

const { setFilter } = useMapFilter()
const { onReady } = useMap()
const range = ref([30000, 70000])

function apply() {
  const [min, max] = range.value
  for (const layer of ['districts', 'districts-outline']) {
    setFilter(layer, ['all', ['>=', ['get', 'population'], min], ['<=', ['get', 'population'], max]])
  }
}
onReady(apply)
watch(range, apply)

// <MSlider v-model=&quot;range&quot; variant=&quot;range&quot; :min=&quot;30000&quot; :max=&quot;70000&quot; :step=&quot;1000&quot; show-value />`"
    >
      <MMap :map-style="sampleStyle" :adapter="adapter" :center="[-64.19, -31.42]" :zoom="12" class="h-96 w-full rounded-xl">
        <MMapHover :model-value="true" />
        <MMapControl position="top-left" :group="false">
          <MapPopulationFilter />
        </MMapControl>
      </MMap>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <ComponentPager current="useMapFilter" />
  </div>
</template>
