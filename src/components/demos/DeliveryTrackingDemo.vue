<script setup lang="ts">
// A made-up delivery in Córdoba: the kitchen prepares the order, then a courier rides to the customer.
// MMapRoute shows the ride; MTrackingTimeline the stages, its current leg filled by the route's progress.
import 'maplibre-gl/dist/maplibre-gl.css'
import { computed, onBeforeUnmount, ref } from 'vue'
import { MAvatar, MButton, MIconButton, MSegmentedButton, MTrackingTimeline } from '@m3ui-vue/m3ui-vue'
import type { TrackingStatus } from '@m3ui-vue/m3ui-vue'
import { MMap, MMapRoute } from '@m3ui-vue/m3ui-vue/map'
import type { MapRouteStop } from '@m3ui-vue/m3ui-vue/map'
import { STYLE } from './mapShared'
import { roundabout } from './osrmRoutes'

// Real streets (OSRM, fetched once): from Patio Olmos through Plaza España's roundabout to Parque Sarmiento
const path = roundabout
const stops: MapRouteStop[] = [
  { lngLat: path[0]!, label: 'La Esquina, the restaurant', icon: 'restaurant' },
  { lngLat: path.at(-1)!, label: 'Your home', icon: 'home' },
]

const RIDE_MIN = 14 // how long the ride "takes" in the story
const steps = computed(() => [
  { label: 'Order placed', icon: 'receipt_long', time: startedAt.value, description: '2 empanadas, 1 lemonade' },
  { label: 'Preparing', icon: 'skillet', time: new Date(startedAt.value.getTime() + 60_000), description: 'La Esquina' },
  { label: 'On the way', icon: 'two_wheeler', time: rideStart.value ?? undefined, description: 'Martina is riding to you' },
  { label: 'Delivered', icon: 'home', time: deliveredAt.value ?? undefined },
])

const startedAt = ref(new Date())
const rideStart = ref<Date | null>(null)
const deliveredAt = ref<Date | null>(null)
const current = ref(1)
const kitchen = ref(0) // the kitchen's progress, 0–1
const progress = ref(0) // the ride's, 0–1
const status = ref<TrackingStatus>('active')
const follow = ref(false)
const playing = ref(true)

// The story runs fast: a tick every 1.5 s
let timer: ReturnType<typeof setInterval> | undefined
function tick() {
  if (!playing.value || status.value === 'canceled') return
  const speed = status.value === 'delayed' ? 0.4 : 1
  if (current.value === 1) {
    kitchen.value = Math.min(1, kitchen.value + 0.25 * speed)
    if (kitchen.value >= 1) {
      current.value = 2
      rideStart.value = new Date()
    }
  } else if (current.value === 2) {
    progress.value = Math.min(1, progress.value + 0.06 * speed)
  }
}
timer = setInterval(tick, 1500)
onBeforeUnmount(() => clearInterval(timer))

function onArrive() {
  current.value = 3
  deliveredAt.value = new Date()
}
function restart() {
  startedAt.value = new Date()
  rideStart.value = null
  deliveredAt.value = null
  current.value = 1
  kitchen.value = 0
  progress.value = 0
  status.value = 'active'
  playing.value = true
}

const stepProgress = computed(() => (current.value === 1 ? kitchen.value : progress.value))
// Minutes left: the rest of the kitchen time plus the ride, longer while late
const eta = computed(() => {
  const late = status.value === 'delayed' ? 1.6 : 1
  const left = current.value === 1 ? (1 - kitchen.value) * 6 + RIDE_MIN : (1 - progress.value) * RIDE_MIN
  return new Date(Date.now() + left * late * 60_000)
})
const message = computed(() =>
  status.value === 'canceled' ? 'The restaurant canceled the order. You won\'t be charged.'
  : status.value === 'delayed' ? 'Heavy traffic on the way: it\'s taking a little longer.'
  : current.value === 1 ? 'The kitchen is on it.'
  : current.value === 2 && progress.value > 0.8 ? 'Martina is around the corner.'
  : current.value === 2 ? 'Martina picked up your order.'
  : 'Enjoy your meal!',
)

const statusOptions = [
  { value: 'active', label: 'On time' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'canceled', label: 'Canceled' },
]
</script>

<template>
  <div class="grid w-full gap-4 lg:grid-cols-[1fr_22rem]">
    <MMap :map-style="STYLE" :center="[-64.182, -31.4265]" :zoom="14" class="h-[26rem] w-full rounded-xl">
      <MMapRoute
        :stops="stops"
        :path="path"
        :progress="current >= 2 ? progress : undefined"
        vehicle-icon="two_wheeler"
        :duration="1400"
        :follow="follow"
        @arrive="onArrive"
      />
    </MMap>

    <div class="flex flex-col gap-3">
      <MTrackingTimeline
        :steps="steps"
        :current="current"
        :step-progress="stepProgress"
        :eta="eta"
        :status="status"
        :message="message"
      >
        <template #extra>
          <div v-if="current === 2 && status !== 'canceled'" class="flex items-center gap-3 rounded-lg bg-surface-container p-3">
            <MAvatar name="Martina Ruiz" :size="40" />
            <div class="min-w-0 flex-1">
              <p class="text-title-small text-on-surface">Martina</p>
              <p class="text-body-small text-on-surface-variant">Motorbike · AB 123 CD</p>
            </div>
            <MIconButton icon="chat" label="Message the courier" variant="tonal" />
            <MIconButton icon="call" label="Call the courier" variant="tonal" />
          </div>
        </template>
      </MTrackingTimeline>

      <div class="flex flex-wrap items-center gap-2">
        <MSegmentedButton v-model="status" :options="statusOptions" density="compact" />
        <MButton variant="text" size="sm" :icon="playing ? 'pause' : 'play_arrow'" @click="playing = !playing">{{ playing ? 'Pause' : 'Play' }}</MButton>
        <MButton variant="text" size="sm" icon="restart_alt" @click="restart">Restart</MButton>
        <MButton variant="text" size="sm" :icon="follow ? 'my_location' : 'location_searching'" @click="follow = !follow">{{ follow ? 'Following' : 'Follow' }}</MButton>
      </div>
    </div>
  </div>
</template>
