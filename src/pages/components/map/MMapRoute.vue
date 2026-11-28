<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { computed, onBeforeUnmount, ref } from 'vue'
import { MButton, MSegmentedButton, MSlider } from '@m3ui-vue/m3ui-vue'
import { MMap, MMapRoute, osrmRouteProvider } from '@m3ui-vue/m3ui-vue/map'
import type { MapRouteStop, MapRouteResult } from '@m3ui-vue/m3ui-vue/map'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import DeliveryTrackingDemo from '@/components/demos/DeliveryTrackingDemo.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'
import { STYLE, useMapTheme } from '@/components/demos/mapShared'
import { roundabout, costanera, roundTrip } from '@/components/demos/osrmRoutes'

// ── Real streets: three OSRM routes, fetched once (curves, a roundabout, diagonals, one-way streets)
const shapes = {
  roundabout: { path: roundabout, stops: [{ lngLat: roundabout[0]!, label: 'Patio Olmos' }, { lngLat: roundabout.at(-1)!, label: 'Parque Sarmiento' }] },
  costanera: { path: costanera, stops: [{ lngLat: costanera[0]!, label: 'Start' }, { lngLat: costanera.at(-1)!, label: 'End' }] },
  roundTrip: { path: roundTrip, stops: [{ lngLat: roundTrip[0]!, label: 'Depot', icon: 'warehouse' }, { lngLat: roundTrip[43]!, label: 'Drop' }, { lngLat: roundTrip.at(-1)!, label: 'Back at the depot', icon: 'warehouse' }] },
}
const shape = ref<keyof typeof shapes>('roundabout')
const shapeOptions = [
  { value: 'roundabout', label: 'Roundabout' },
  { value: 'costanera', label: 'Riverside curves' },
  { value: 'roundTrip', label: 'Out and back' },
]
const along = ref(0.35)
const carAlong = ref(0.2)
// MapLibre paints the line: it needs a plain color, not var(--color-…)
const mapTheme = useMapTheme()
const carColor = computed(() => mapTheme.value.tertiary || undefined)
const carStops: MapRouteStop[] = [{ lngLat: costanera[0]!, label: 'Start' }, { lngLat: costanera.at(-1)!, label: 'End', icon: 'local_parking' }]

// ── Live GPS on the out-and-back route: fixes ~10 m off the road, every 1.2 s. The way back shares part of the way
// out; forward snapping keeps the van on the way back there
const tripStops = shapes.roundTrip.stops
const gps = ref<[number, number] | null>(null)
const snap = ref<'forward' | 'nearest'>('forward')
let i = 0
let timer: ReturnType<typeof setInterval> | undefined
function startGps() {
  clearInterval(timer)
  i = 0
  timer = setInterval(() => {
    i = Math.min(roundTrip.length - 1, i + 2)
    const [lng, lat] = roundTrip[i]!
    gps.value = [lng + (Math.random() - 0.5) * 0.0002, lat + (Math.random() - 0.5) * 0.0002]
    if (i >= roundTrip.length - 1) clearInterval(timer)
  }, 1200)
}
onBeforeUnmount(() => clearInterval(timer))

// ── Routing on demand: OSRM's public demo server (light use only; run your own in production)
const provider = osrmRouteProvider()
const from: [number, number] = [-64.1890, -31.4199]
const to = ref<[number, number]>([-64.1752, -31.4330])
const routeStops = computed<MapRouteStop[]>(() => [{ lngLat: from, label: 'Start' }, { lngLat: to.value, label: 'Destination' }])
const routeInfo = ref<MapRouteResult | null>(null)
const routeError = ref(false)
const onMapClick = (e: { lngLat: { lng: number; lat: number } }) => {
  to.value = [e.lngLat.lng, e.lngLat.lat]
  routeError.value = false
}
const km = (m: number) => `${(m / 1000).toFixed(1)} km`
const mins = (s: number) => `${Math.round(s / 60)} min`

const props: PropDef[] = [
  { name: 'stops', type: 'MapRouteStop[]', description: 'The stops in order: the start, any in between, the destination' },
  { name: 'path', type: '[lng, lat][]', description: "The road to follow, e.g. OSRM's or Mapbox's route geometry. Straight lines between the stops when left out" },
  { name: 'progress', type: 'number', description: 'How far the vehicle is, 0–1 of the route. Ignored when vehicle is set' },
  { name: 'vehicle', type: '[lng, lat] | null', description: 'A live position (GPS): placed on the nearest point of the route' },
  { name: 'vehicleIcon', type: 'string', default: "'navigation'", description: 'The default arrow turns with the road; other icons (two_wheeler, local_shipping) face the way it goes' },
  { name: 'rotateVehicle', type: 'boolean', description: 'Turn the vehicle with the road (and the map\'s rotation): on for the default arrow, off for other icons (mirrored when heading west). Set it for #vehicle content drawn pointing up' },
  { name: 'showVehicle', type: 'boolean', default: 'true', description: 'Show the vehicle (when there is a progress or vehicle)' },
  { name: 'duration', type: "number | 'auto'", default: "'auto'", description: 'How long the vehicle takes to move to a new position (ms), along the road. auto takes the time between the last two positions, so a vehicle fed every few seconds keeps an even pace instead of stopping between fixes. 0 jumps; reduced motion jumps' },
  { name: 'fit', type: 'boolean', default: 'true', description: 'Fit the map to the route when it shows and when it changes' },
  { name: 'follow', type: 'boolean', default: 'false', description: 'Keep the vehicle in the middle of the map' },
  { name: 'padding', type: 'number', default: '64', description: 'Room around the route when fitting it (px)' },
  { name: 'color', type: 'string', description: "The route's color: one MapLibre reads (hex, rgb()…), not var(). Defaults to the theme's primary, following palette and dark mode" },
  { name: 'flow', type: 'boolean', default: 'true', description: 'The dots of the route ahead flow toward the destination (off with reduced motion)' },
  { name: 'width', type: 'number', default: '5', description: 'Line width (px)' },
  { name: 'before', type: 'string', description: "Insert the lines below this layer id (e.g. under the style's labels)" },
  { name: 'id', type: 'string', description: 'The source id and prefix of its layers. Generated when left out' },
  { name: 'provider', type: 'MapRouteProvider', description: 'Fetches the road between the stops when there is no path (again when they change): osrmRouteProvider() or your own. Straight lines meanwhile and on failure' },
  { name: 'snap', type: "'forward' | 'nearest'", default: "'forward'", description: 'How a vehicle position lands on the route: forward only moves ahead, so out-and-back routes, loops and close parallel streets do not jump to the other pass; nearest takes the closest point every time' },
]
const events: EventDef[] = [
  { name: 'stop-click', payload: 'stop, index', description: 'A stop was clicked' },
  { name: 'arrive', payload: '—', description: 'The vehicle reached the end of the route' },
  { name: 'route', payload: '{ path, distance, duration }', description: 'provider returned a road (meters, seconds)' },
  { name: 'error', payload: 'unknown', description: 'provider failed; the stops stay joined by straight lines' },
]
const slots: SlotDef[] = [
  { name: 'stop', description: "A stop's marker instead of the round one. Scope: { stop, index, done }" },
  { name: 'stop-popup', description: 'A popup that opens when a stop is clicked. Scope: { stop, index, done }' },
  { name: 'vehicle', description: 'The vehicle instead of the round one (an image, a top-down car…). Scope: { bearing, west }: the heading in degrees and whether it heads west (to mirror art facing right). With rotateVehicle the marker turns it' },
]
const types: TypeDef[] = [
  {
    name: 'MapRouteStop',
    fields: [
      { name: 'lngLat', type: '[lng, lat]', required: true, description: 'Where it is' },
      { name: 'label', type: 'string', description: "Its name: the marker's accessible name and tooltip" },
      { name: 'icon', type: 'string', description: 'A Material Symbol in its marker. Defaults to a dot for the start, numbers in between, a flag at the end' },
      { name: 'done', type: 'boolean', description: 'Mark it reached yourself, instead of by where the vehicle is' },
    ],
  },
  {
    name: 'osrmRouteProvider(options?)',
    description: 'From /map. Routes through OSRM (OpenStreetMap data): the real shape of the streets, one-way streets and turn restrictions respected by the car profile',
    fields: [
      { name: 'url', type: 'string', description: "The server. Defaults to OSRM's public demo server, for light use only: run your own (osrm-backend in Docker) or a hosted one in production" },
      { name: 'profile', type: 'string', description: 'driving (default; the only one on the demo server), cycling, walking, or your server\'s' },
      { name: 'params', type: 'Record<string, string>', description: 'More OSRM query parameters (exclude=toll…)' },
    ],
  },
  {
    name: 'MapRouteProvider',
    description: '(waypoints, { signal }) => Promise<{ path, distance, duration }>: any routing service fits (GraphHopper, Valhalla, OpenRouteService, Mapbox Directions, your backend)',
    fields: [],
  },
  {
    name: 'Exposed',
    fields: [
      { name: 'fit()', type: 'function', description: 'Fits the map to the route' },
      { name: 'length / travelled', type: 'number (m)', description: "The route's length, and how far the vehicle is" },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMapRoute</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A route for deliveries and trips: the path, the part travelled solid and the rest dotted, a marker per stop that
      fills once reached, and a vehicle that moves along the road, not across it. Drive it with <code>progress</code> or
      a live <code>vehicle</code> position. It draws the road you give it: a routing service's geometry (or
      <code>provider</code>, e.g. <code>osrmRouteProvider()</code>) brings the streets' real shape, curves and roundabouts,
      and one-way streets. Pair it with <RouterLink to="/components/data-display/mtrackingtimeline" class="text-primary underline">MTrackingTimeline</RouterLink>
      for the order's stages. From <code>@m3ui-vue/m3ui-vue/map</code>.
    </p>

    <ComponentDemo
      title="Delivery tracking"
      description="The kitchen prepares the order, then the courier rides to you. The route's progress fills the timeline's current leg; switch to Delayed or Canceled, or follow the courier."
      flush
      :code="`<template>
  <MMap :map-style=&quot;style&quot; class=&quot;h-[26rem] rounded-xl&quot;>
    <MMapRoute :stops=&quot;stops&quot; :path=&quot;path&quot; :progress=&quot;progress&quot; vehicle-icon=&quot;two_wheeler&quot; :follow=&quot;follow&quot; @arrive=&quot;delivered&quot; />
  </MMap>
  <MTrackingTimeline :steps=&quot;steps&quot; :current=&quot;current&quot; :step-progress=&quot;progress&quot; :eta=&quot;eta&quot; :status=&quot;status&quot; :message=&quot;message&quot;>
    <template #extra><!-- the courier --></template>
  </MTrackingTimeline>
</template>`"
      :script="`import { MMap, MMapRoute } from '@m3ui-vue/m3ui-vue/map'
import { MTrackingTimeline } from '@m3ui-vue/m3ui-vue'

// The road, as OSRM or Mapbox Directions returns it
const path = [[-64.1839, -31.4167], [-64.1839, -31.4188], [-64.1872, -31.4188], /* … */]
const stops = [
  { lngLat: path[0], label: 'La Esquina', icon: 'restaurant' },
  { lngLat: path.at(-1), label: 'Your home', icon: 'home' },
]
const progress = ref(0) // from your backend: 0–1 of the ride`"
    >
      <div class="p-4">
        <DeliveryTrackingDemo />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Real streets"
      description="Routes from a routing service follow the streets as they are: diagonals, a boulevard's curves, a roundabout. The way back of the out-and-back trip takes other streets where the way out is one-way. Drag to move along."
      :code="`<MMapRoute :stops=&quot;stops&quot; :path=&quot;path&quot; :progress=&quot;along&quot; :duration=&quot;0&quot; />`"
      :script="`// path: the route geometry of OSRM, GraphHopper, Mapbox… (hundreds of points along the streets)
const { path } = await osrmRouteProvider()([from, to], {})`"
    >
      <div class="flex w-full flex-col gap-3">
        <MSegmentedButton v-model="shape" :options="shapeOptions" density="compact" class="self-start" />
        <MMap :map-style="STYLE" :center="[-64.185, -31.42]" :zoom="13" class="h-96 w-full rounded-xl">
          <MMapRoute :key="shape" :stops="shapes[shape].stops" :path="shapes[shape].path" :progress="along" :duration="0" vehicle-icon="local_shipping" />
        </MMap>
        <MSlider v-model="along" :min="0" :max="1" :step="0.005" label="Along the route" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Your own vehicle"
      description="#vehicle takes anything: here a top-down car drawn pointing up, turned with the road by rotateVehicle (it follows the map's rotation too: right-drag to rotate the map). The route takes a color and a width."
      :code="`<MMapRoute :stops=&quot;stops&quot; :path=&quot;path&quot; :progress=&quot;along&quot; rotate-vehicle :color=&quot;tertiary&quot; :width=&quot;6&quot;>
  <template #vehicle>
    <svg viewBox=&quot;0 0 24 40&quot; width=&quot;24&quot; height=&quot;40&quot;><!-- a car, pointing up --></svg>
  </template>
</MMapRoute>`"
    >
      <div class="flex w-full flex-col gap-3">
        <MMap :map-style="STYLE" :center="[-64.187, -31.408]" :zoom="13.5" class="h-80 w-full rounded-xl">
          <MMapRoute :stops="carStops" :path="costanera" :progress="carAlong" :duration="0" rotate-vehicle :color="carColor" :width="6">
            <template #vehicle>
              <svg viewBox="0 0 24 40" width="24" height="40" aria-hidden="true" class="drop-shadow-md">
                <rect x="2" y="2" width="20" height="36" rx="7" class="fill-tertiary" />
                <rect x="5" y="9" width="14" height="8" rx="2" class="fill-on-tertiary" opacity=".85" />
                <rect x="5" y="27" width="14" height="6" rx="2" class="fill-on-tertiary" opacity=".6" />
                <rect x="4" y="1" width="4" height="3" rx="1" fill="#fff7c2" />
                <rect x="16" y="1" width="4" height="3" rx="1" fill="#fff7c2" />
              </svg>
            </template>
          </MMapRoute>
        </MMap>
        <MSlider v-model="carAlong" :min="0" :max="1" :step="0.005" label="Along the riverside" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Live GPS on an out-and-back route"
      description="Each fix lands ~10 m off the road. Where the way back runs over the way out, forward snapping keeps the van on the way back; switch to nearest to see it jump to the way out there."
      :code="`<MMapRoute :stops=&quot;stops&quot; :path=&quot;path&quot; :vehicle=&quot;gps&quot; :snap=&quot;snap&quot; vehicle-icon=&quot;local_shipping&quot; />`"
    >
      <div class="flex w-full flex-col gap-3">
        <MMap :map-style="STYLE" :center="[-64.191, -31.418]" :zoom="14" class="h-96 w-full rounded-xl">
          <MMapRoute :stops="tripStops" :path="roundTrip" :vehicle="gps" :snap="snap" vehicle-icon="local_shipping" />
        </MMap>
        <div class="flex flex-wrap items-center gap-2">
          <MButton variant="tonal" icon="play_arrow" @click="startGps">{{ gps ? 'Restart the van' : 'Start the van' }}</MButton>
          <MSegmentedButton v-model="snap" :options="[{ value: 'forward', label: 'snap: forward' }, { value: 'nearest', label: 'snap: nearest' }]" density="compact" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Routing on demand"
      description="Click the map to set the destination: osrmRouteProvider fetches the road from OSRM's public demo server (light use only) and the route event gives its distance and time."
      :code="`<MMap @click=&quot;(e) => (to = [e.lngLat.lng, e.lngLat.lat])&quot;>
  <MMapRoute :stops=&quot;[{ lngLat: from }, { lngLat: to }]&quot; :provider=&quot;provider&quot; @route=&quot;(r) => (info = r)&quot; />
</MMap>`"
      :script="`import { osrmRouteProvider } from '@m3ui-vue/m3ui-vue/map'

// Your own OSRM in production: osrmRouteProvider({ url: 'https://osrm.example.org' })
const provider = osrmRouteProvider()`"
    >
      <div class="flex w-full flex-col gap-3">
        <MMap :map-style="STYLE" :center="[-64.182, -31.426]" :zoom="13.5" class="h-96 w-full rounded-xl" @click="onMapClick">
          <MMapRoute :stops="routeStops" :provider="provider" :fit="false" @route="(r: MapRouteResult) => (routeInfo = r)" @error="routeError = true" />
        </MMap>
        <p class="text-body-medium text-on-surface-variant">
          <template v-if="routeError">The routing server didn't answer: straight line meanwhile.</template>
          <template v-else-if="routeInfo">{{ km(routeInfo.distance) }} · {{ mins(routeInfo.duration) }} by car · {{ routeInfo.path.length }} points along the streets</template>
          <template v-else>Routing…</template>
        </p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="types" />

    <ComponentPager current="MMapRoute" />
  </div>
</template>
