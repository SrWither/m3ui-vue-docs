<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import MapLayersDemo from '@/components/demos/MapLayersDemo.vue'
import MapLayersBeside from '@/components/demos/MapLayersBeside.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const props: PropDef[] = [
  { name: 'search', type: 'boolean', default: 'true', description: 'Show the search field.' },
  { name: 'collapsed', type: 'boolean', default: 'false', description: 'Groups start collapsed.' },
  { name: 'map', type: 'MapSource', description: 'The map, when the list is outside it (a side panel): the MMap\'s template ref. Not needed inside the MMap.' },
]
const slots: SlotDef[] = [
  { name: 'actions', description: 'Extra buttons in an expanded layer. Scope: layer, visible.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMapLayers</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A layer list built from the style's conventions, read by <RouterLink to="/components/map/mmap" class="text-primary underline">MMap</RouterLink>'s
      adapter: collapsible groups with partial visibility and a count, each layer's visibility, opacity, description,
      legend and download, and a search. Put it wherever you like: in an expanding
      <RouterLink to="/components/map/mmapcontrol" class="text-primary underline">MMapControl</RouterLink> as here, a
      side sheet, a drawer, or a panel beside the map through <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">map</code>. <RouterLink to="/composables/usemaplayers" class="text-primary underline">useMapLayers()</RouterLink>
      gives the same state for a list of your own.
    </p>

    <ComponentDemo
      title="A layer list in a control"
      description="A sample style with the Orvian conventions: the layers button expands into the list. Show, hide and fade layers and groups, open one for its legend and opacity. Try it in fullscreen."
      :code="`<MMap :map-style=&quot;style&quot; :adapter=&quot;orvianAdapter()&quot; fullscreen class=&quot;h-[32rem] rounded-xl&quot;>
  <MMapControl v-model:expanded=&quot;open&quot; position=&quot;top-left&quot;>
    <template #default=&quot;{ toggle }&quot;>
      <button type=&quot;button&quot; title=&quot;Layers&quot; @click=&quot;toggle&quot;>
        <MIcon name=&quot;layers&quot; :size=&quot;20&quot; />
      </button>
    </template>
    <template #panel=&quot;{ close }&quot;>
      <div class=&quot;flex max-h-96 w-72 flex-col&quot;>
        <div class=&quot;flex items-center py-1 pr-1 pl-4&quot;>
          <span class=&quot;flex-1 text-title-small&quot;>Layers</span>
          <MIconButton icon=&quot;close&quot; label=&quot;Close&quot; size=&quot;xs&quot; @click=&quot;close&quot; />
        </div>
        <div class=&quot;overflow-y-auto px-3 pb-3&quot;>
          <MMapLayers />
        </div>
      </div>
    </template>
  </MMapControl>
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
      <MapLayersDemo layers />
    </ComponentDemo>

    <ComponentDemo
      title="Beside the map"
      description="Outside the MMap, give the list (and MMapBaseLayers) the map through its template ref. Until the map mounts they show nothing."
      :code="`<aside>
  <MMapBaseLayers :map=&quot;map&quot; />
  <MMapLayers :map=&quot;map&quot; :search=&quot;false&quot; />
</aside>
<MMap ref=&quot;map&quot; :map-style=&quot;style&quot; :adapter=&quot;orvianAdapter()&quot; />`"
      :script="`import { ref } from 'vue'
import { MMap, MMapBaseLayers, MMapLayers, orvianAdapter } from '@m3ui-vue/m3ui-vue/map'

const map = ref()`"
    >
      <MapLayersBeside />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <ComponentPager current="MMapLayers" />
  </div>
</template>
