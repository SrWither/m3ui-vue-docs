<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { ref } from 'vue'
import { MButton } from '@m3ui-vue/m3ui-vue'
import { MMap, MMapPopup } from '@m3ui-vue/m3ui-vue/map'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import { CORDOBA, STYLE } from '@/components/demos/mapShared'

const at = ref<[number, number]>([...CORDOBA])
const open = ref(true)
function place(e: { lngLat: { lng: number; lat: number } }) {
  at.value = [e.lngLat.lng, e.lngLat.lat]
  open.value = true
}
const copied = ref(false)
function copy() {
  void navigator.clipboard?.writeText(`${at.value[1].toFixed(5)}, ${at.value[0].toFixed(5)}`)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

const popupProps: PropDef[] = [
  { name: 'lngLat', type: '[number, number]', description: 'Position. Required.' },
  { name: 'open', type: 'boolean', default: 'true', description: 'Shown (v-model): false when the user closes it.' },
  { name: 'closeButton', type: 'boolean', default: 'true', description: 'Show a close button.' },
  { name: 'closeOnClick', type: 'boolean', default: 'true', description: 'Close it when the map is clicked.' },
  { name: 'anchor', type: 'PositionAnchor', description: 'Its side of lngLat; by default the side with room.' },
  { name: 'offset', type: 'Offset', description: 'Offset from lngLat: pixels, [x, y], or one per side ({ bottom: [0, -38], … }). By default none: its tip touches the point.' },
  { name: 'maxWidth', type: 'string', default: '\'320px\'', description: 'Maximum width.' },
]
const popupEvents: EventDef[] = [
  { name: 'update:open', payload: 'boolean', description: 'Closed by its close button or a click on the map (closeOnClick): powers v-model:open.' },
]
const popupSlots: SlotDef[] = [
  { name: 'default', description: 'The popup\'s content: anything, library components included.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMapPopup</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A popup with your own content at a point of an <RouterLink to="/components/map/mmap" class="text-primary underline">MMap</RouterLink>,
      in the theme's surface, opened and closed through a v-model. A marker's popup is its #popup slot; this one is
      for anything else: a click on the map, a search result, a feature.
    </p>

    <ComponentDemo
      title="A popup where you click"
      description="Click anywhere on the map: the popup moves there with the point's coordinates and a button to copy them. Its close button (or another click) closes it."
      :code="`<MMap
  map-style=&quot;https://tiles.openfreemap.org/styles/liberty&quot;
  :center=&quot;[-64.1888, -31.4201]&quot;
  :zoom=&quot;13&quot;
  class=&quot;h-96 rounded-xl&quot;
  @click=&quot;(e) => { at = [e.lngLat.lng, e.lngLat.lat]; open = true }&quot;
>
  <MMapPopup v-model:open=&quot;open&quot; :lng-lat=&quot;at&quot; :close-on-click=&quot;false&quot;>
    <p class=&quot;text-title-small&quot;>{{ at[1].toFixed(5) }}, {{ at[0].toFixed(5) }}</p>
    <MButton variant=&quot;text&quot; icon=&quot;content_copy&quot; @click=&quot;copy&quot;>Copy</MButton>
  </MMapPopup>
</MMap>`"
      :script="`import { MMap, MMapPopup } from '@m3ui-vue/m3ui-vue/map'

const at = ref([-64.1888, -31.4201])
const open = ref(true)`"
    >
      <MMap :map-style="STYLE" :center="CORDOBA" :zoom="13" class="h-96 w-full rounded-xl" @click="place">
        <MMapPopup v-model:open="open" :lng-lat="at" :close-on-click="false">
          <p class="text-title-small">{{ at[1].toFixed(5) }}, {{ at[0].toFixed(5) }}</p>
          <MButton variant="text" :icon="copied ? 'check' : 'content_copy'" @click="copy">{{ copied ? 'Copied' : 'Copy' }}</MButton>
        </MMapPopup>
      </MMap>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="popupProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="popupEvents" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="popupSlots" />

    <ComponentPager current="MMapPopup" />
  </div>
</template>
