<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { ref } from 'vue'
import { MButton, MIcon } from '@m3ui-vue/m3ui-vue'
import { MMap, MMapMarker } from '@m3ui-vue/m3ui-vue/map'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import { CORDOBA, STYLE } from '@/components/demos/mapShared'

const places = [
  { name: 'Plaza San Martín', icon: 'account_balance', lngLat: [-64.1836, -31.4167] as [number, number], note: 'The historic center, with the Cathedral and the Cabildo.' },
  { name: 'Mercado Norte', icon: 'storefront', lngLat: [-64.1856, -31.4093] as [number, number], note: 'Food stalls since 1928.' },
  { name: 'Buen Pastor', icon: 'water', lngLat: [-64.1866, -31.4247] as [number, number], note: 'A cultural center with dancing fountains.' },
  { name: 'Parque Sarmiento', icon: 'park', lngLat: [-64.1736, -31.4296] as [number, number], note: 'The city\'s largest park.' },
]
const pins = ref<[number, number][]>([])
function addPin(e: { lngLat: { lng: number; lat: number } }) {
  pins.value.push([e.lngLat.lng, e.lngLat.lat])
}

const markerProps: PropDef[] = [
  { name: 'lngLat', type: '[number, number]', description: 'Position (v-model with draggable). Required.' },
  { name: 'color', type: 'string', description: 'The pin\'s color, a plain color value (MapLibre writes it as an SVG attribute, where var() doesn\'t work). Defaults to the theme\'s primary; ignored with custom content.' },
  { name: 'draggable', type: 'boolean', default: 'false', description: 'Let the user drag it.' },
  { name: 'anchor', type: 'PositionAnchor', description: 'Which part sits on lngLat. By default the pin\'s tip (MapLibre\'s own placement), and the center of custom content.' },
  { name: 'offset', type: '[number, number]', description: 'Offset in pixels. The pin\'s default, MapLibre\'s [0, -14], is what puts its tip on lngLat.' },
  { name: 'rotation', type: 'number', default: '0', description: 'Rotation in degrees.' },
]
const markerEvents: EventDef[] = [
  { name: 'update:lngLat', payload: '[number, number]', description: 'Dragged to a new position (draggable): powers v-model:lng-lat.' },
  { name: 'click', payload: 'MouseEvent', description: 'The marker was clicked.' },
]
const markerSlots: SlotDef[] = [
  { name: 'default', description: 'The marker itself, instead of the pin (any element, anchored by anchor).' },
  { name: 'popup', description: 'Content of a popup that opens when the marker is clicked.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMapMarker</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A point on an <RouterLink to="/components/map/mmap" class="text-primary underline">MMap</RouterLink>: a pin in
      the theme's primary or your own content, draggable with its position as a v-model, and a popup of your own that
      opens on click.
    </p>

    <ComponentDemo
      title="Markers and pins"
      description="Markers with your own content and a popup each, and pins added by clicking the map (drag them around: their position is a v-model)."
      :code="`<MMap
  map-style=&quot;https://tiles.openfreemap.org/styles/liberty&quot;
  :center=&quot;[-64.1888, -31.4201]&quot;
  :zoom=&quot;13&quot;
  class=&quot;h-96 rounded-xl&quot;
  @click=&quot;(e) => pins.push([e.lngLat.lng, e.lngLat.lat])&quot;
>
  <MMapMarker v-for=&quot;p in places&quot; :key=&quot;p.name&quot; :lng-lat=&quot;p.lngLat&quot;>
    <div class=&quot;flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-on-primary shadow-elevation-2&quot;>
      <MIcon :name=&quot;p.icon&quot; :size=&quot;16&quot; />
      <span class=&quot;text-label-medium&quot;>{{ p.name }}</span>
    </div>
    <template #popup>
      <p class=&quot;text-title-small&quot;>{{ p.name }}</p>
      <p class=&quot;text-on-surface-variant&quot;>{{ p.note }}</p>
    </template>
  </MMapMarker>

  <!-- Pins in the theme's primary, draggable -->
  <MMapMarker v-for=&quot;(pin, i) in pins&quot; :key=&quot;i&quot; v-model:lng-lat=&quot;pins[i]&quot; draggable />
</MMap>`"
      :script="`import { MMap, MMapMarker } from '@m3ui-vue/m3ui-vue/map'

const pins = ref([])
const places = [
  { name: 'Plaza San Martín', icon: 'account_balance', lngLat: [-64.1836, -31.4167], note: 'The historic center…' },
  // …
]`"
    >
      <div class="flex w-full flex-col gap-3">
        <MMap :map-style="STYLE" :center="CORDOBA" :zoom="13" class="h-96 w-full rounded-xl" @click="addPin">
          <MMapMarker v-for="p in places" :key="p.name" :lng-lat="p.lngLat">
            <div class="flex cursor-pointer items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-on-primary shadow-elevation-2">
              <MIcon :name="p.icon" :size="16" />
              <span class="text-label-medium">{{ p.name }}</span>
            </div>
            <template #popup>
              <p class="text-title-small">{{ p.name }}</p>
              <p class="text-on-surface-variant">{{ p.note }}</p>
            </template>
          </MMapMarker>
          <MMapMarker v-for="(pin, i) in pins" :key="i" v-model:lng-lat="pins[i]!" draggable />
        </MMap>
        <div class="flex justify-end">
          <MButton variant="text" icon="delete_sweep" :disabled="!pins.length" @click="pins = []">Clear {{ pins.length }} pins</MButton>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="markerProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="markerEvents" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="markerSlots" />

    <ComponentPager current="MMapMarker" />
  </div>
</template>
