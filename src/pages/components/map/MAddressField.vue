<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { ref } from 'vue'
import { MButton, MTextField } from '@m3ui-vue/m3ui-vue'
import { MAddressField, MMap, MMapMarker, nominatimProvider } from '@m3ui-vue/m3ui-vue/map'
import type { MapSearchResult } from '@m3ui-vue/m3ui-vue/map'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import { CORDOBA, STYLE } from '@/components/demos/mapShared'

// First demo: a delivery form
const name = ref('')
const address = ref<MapSearchResult | null>(null)
const unit = ref('')
const sent = ref(false)
function reset() {
  name.value = ''
  address.value = null
  unit.value = ''
  sent.value = false
}

// Second demo: the field drives a map, searching around Córdoba first
const around = nominatimProvider({ countryCodes: ['ar'], viewbox: [-64.32, -31.52, -64.06, -31.3] })
const place = ref<MapSearchResult | null>(null)
const mapRef = ref<{ map?: { flyTo: (o: object) => void; fitBounds: (b: [[number, number], [number, number]], o?: object) => void } }>()
function go(p: MapSearchResult) {
  const map = mapRef.value?.map
  if (!map) return
  if (p.bbox && p.bbox[0] !== p.bbox[2]) map.fitBounds([[p.bbox[0], p.bbox[1]], [p.bbox[2], p.bbox[3]]], { padding: 48, maxZoom: 17 })
  else map.flyTo({ center: p.lngLat, zoom: 17 })
}

const fieldProps: PropDef[] = [
  { name: 'modelValue', type: 'MapSearchResult | null', default: 'null', description: 'The picked place (v-model): { label, lngLat, bbox?, type? }. Editing the text after picking sets it back to null.' },
  { name: 'provider', type: 'MapSearchProvider', default: 'nominatimProvider()', description: 'Where to search: nominatimProvider({ url, limit, language, countryCodes, viewbox, bounded }) or a function of yours (query, signal) => Promise<MapSearchResult[]>, the same as MMapSearch\'s.' },
  { name: 'instant', type: 'boolean', default: 'false', description: 'Search while typing, debounced, for providers that allow it. Nominatim\'s public server doesn\'t: by default Enter searches.' },
  { name: 'debounce', type: 'number', default: '400', description: 'The delay before an instant search, in ms.' },
  { name: 'minLength', type: 'number', default: '3', description: 'Characters needed before searching.' },
  { name: 'label', type: 'string', description: 'The field\'s label; the locale\'s "Address" by default.' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Field style.' },
  { name: 'leadingIcon', type: 'string', default: "'location_on'", description: 'Material Symbol on the left.' },
  { name: 'hint / error (boolean | string) / errorLabel / required / disabled', type: '…', description: 'As on MTextField.' },
  { name: 'rules / validateOn / name', type: '…', description: 'Validation, as on MTextField (see MForm). On MAddressField they check the picked place, so required needs a place picked.' },
]
const fieldEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'MapSearchResult | null', description: 'A place was picked, or the text changed after picking one (null).' },
  { name: 'select', payload: 'MapSearchResult', description: 'A place was picked.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MAddressField</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      An address field for any form: it looks places up and lists them under the field to pick one, and the picked
      place, with its coordinates, is the v-model. It needs no map. By default it asks OpenStreetMap's Nominatim, whose
      public server allows no search-as-you-type, so Enter searches (the field says so); with your own geocoder,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">instant</code> searches while typing.
      It shares its <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">provider</code> with
      <RouterLink to="/components/map/mmapsearch" class="text-primary underline">MMapSearch</RouterLink>.
    </p>

    <ComponentDemo
      title="In a form"
      description="A delivery form: type a street and press Enter, then pick it with the arrows and Enter or with a click. What the form gets is the place below, coordinates included. Editing the address afterwards clears it."
      :code="`<form class=&quot;flex flex-col gap-4&quot; @submit.prevent=&quot;send&quot;>
  <MTextField v-model=&quot;name&quot; label=&quot;Name&quot; />
  <MAddressField v-model=&quot;address&quot; required hint=&quot;Street and number&quot; />
  <MTextField v-model=&quot;unit&quot; label=&quot;Floor, apartment&quot; />
  <MButton type=&quot;submit&quot; :disabled=&quot;!address&quot;>Order</MButton>
</form>`"
      :script="`import { MAddressField } from '@m3ui-vue/m3ui-vue/map'

// { label, lngLat: [lng, lat], bbox?, type? } once picked
const address = ref(null)`"
    >
      <form class="flex w-full max-w-md flex-col gap-4" @submit.prevent="sent = true">
        <MTextField v-model="name" label="Name" />
        <MAddressField v-model="address" required hint="Street and number" />
        <MTextField v-model="unit" label="Floor, apartment" />
        <div class="flex gap-2">
          <MButton type="submit" :disabled="!address">Order</MButton>
          <MButton type="button" variant="text" @click="reset">Reset</MButton>
        </div>
        <pre class="overflow-auto rounded-xl bg-surface-container-high p-3 font-mono text-body-small text-on-surface-variant">{{ sent ? 'Sent: ' : '' }}{{ address ? JSON.stringify({ label: address.label, lngLat: address.lngLat, type: address.type }, null, 2) : 'address: null' }}</pre>
      </form>
    </ComponentDemo>

    <ComponentDemo
      title="With a map"
      description="The same field over an MMap: picking a place flies there and marks it. Its provider searches Argentina and prefers the Córdoba area (countryCodes and viewbox). Outlined, this time."
      :code="`<MAddressField v-model=&quot;place&quot; :provider=&quot;around&quot; variant=&quot;outlined&quot; label=&quot;Find an address&quot; @select=&quot;go&quot; />
<MMap ref=&quot;mapRef&quot; map-style=&quot;https://tiles.openfreemap.org/styles/liberty&quot; :center=&quot;[-64.1888, -31.4201]&quot; :zoom=&quot;12&quot; class=&quot;h-80 rounded-xl&quot;>
  <MMapMarker v-if=&quot;place&quot; :lng-lat=&quot;place.lngLat&quot; />
</MMap>`"
      :script="`import { MAddressField, MMap, MMapMarker, nominatimProvider } from '@m3ui-vue/m3ui-vue/map'

// Argentina only, the Córdoba area first: [west, south, east, north]
const around = nominatimProvider({ countryCodes: ['ar'], viewbox: [-64.32, -31.52, -64.06, -31.3] })

// Fit its extent when it has one (a city, a park), else fly to the point
function go(p) {
  const map = mapRef.value.map
  if (p.bbox && p.bbox[0] !== p.bbox[2]) map.fitBounds([[p.bbox[0], p.bbox[1]], [p.bbox[2], p.bbox[3]]], { padding: 48, maxZoom: 17 })
  else map.flyTo({ center: p.lngLat, zoom: 17 })
}`"
    >
      <div class="flex w-full flex-col gap-3">
        <MAddressField v-model="place" :provider="around" variant="outlined" label="Find an address" class="max-w-md" @select="go" />
        <MMap ref="mapRef" :map-style="STYLE" :center="CORDOBA" :zoom="12" class="h-80 w-full rounded-xl">
          <MMapMarker v-if="place" :lng-lat="place.lngLat" />
        </MMap>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="fieldProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="fieldEvents" />
    <p class="mt-4 text-body-medium text-on-surface-variant">
      A template ref exposes <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">search()</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">clear()</code> and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">focus()</code>. Mind
      <a href="https://operations.osmfoundation.org/policies/nominatim/" class="text-primary underline">Nominatim's usage policy</a>
      (one search per second, no autocomplete, an identifying referrer) or point <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">url</code> at your own.
    </p>

    <ComponentPager current="MAddressField" />
  </div>
</template>
