<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { ref } from 'vue'
import { MMap, MMapMeasure } from '@m3ui-vue/m3ui-vue/map'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import { CORDOBA, STYLE } from '@/components/demos/mapShared'

type Measurement = { mode: 'distance' | 'area'; closed: boolean; length: number; area?: number }
const measurements = ref<Measurement[]>([])
const km = (m: number) => (m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`)
const ha = (m2: number) => (m2 >= 1e6 ? `${(m2 / 1e6).toFixed(2)} km²` : `${(m2 / 1e4).toFixed(2)} ha`)

const measureProps: PropDef[] = [
  { name: 'modelValue', type: "'distance' | 'area' | null", default: 'null', description: 'The measuring mode (v-model): set it to start measuring from your own UI.' },
  { name: 'control', type: 'boolean | MapControlPosition', default: 'true', description: 'Its buttons (distance, area, clear), or false.' },
]
const measureEvents: EventDef[] = [
  { name: 'update:modelValue', payload: "'distance' | 'area' | null", description: 'The mode changed (its buttons, or a measurement finished).' },
  { name: 'change', payload: '{ mode, points, closed, length, area? }[]', description: 'Every measurement, after each change: length in meters, area in m².' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMapMeasure</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Distance and area measuring on an <RouterLink to="/components/map/mmap" class="text-primary underline">MMap</RouterLink>,
      with its own control (distance, area, clear). Click to add points; double-click, Enter, the first point or the
      active button again finishes. Finished measurements stay editable (drag a vertex, or a midpoint to add one), and
      each total or area label, an M3 chip, has a ✕ that deletes it. Geodesic numbers, in the page's language. While
      measuring it owns the map's clicks: <RouterLink to="/components/map/mmapidentify" class="text-primary underline">MMapIdentify</RouterLink> waits.
    </p>

    <ComponentDemo
      title="Distances and areas"
      description="Pick distance or area in its control (top right) and click the map to add points. Every change comes out of the change event, listed below."
      :code="`<MMap map-style=&quot;https://tiles.openfreemap.org/styles/liberty&quot; :center=&quot;[-64.1888, -31.4201]&quot; :zoom=&quot;14&quot; fullscreen class=&quot;h-96 rounded-xl&quot;>
  <MMapMeasure @change=&quot;(m) => (measurements = m)&quot; />
</MMap>

<p v-for=&quot;m in measurements&quot;>
  {{ m.mode === 'area' ? 'Area ' + m.area + ' m²' : 'Distance ' + m.length + ' m' }}
</p>`"
      :script="`import { MMap, MMapMeasure } from '@m3ui-vue/m3ui-vue/map'

const measurements = ref([])`"
    >
      <div class="flex w-full flex-col gap-3">
        <MMap :map-style="STYLE" :center="CORDOBA" :zoom="14" fullscreen class="h-96 w-full rounded-xl">
          <MMapMeasure @change="(m) => (measurements = m)" />
        </MMap>
        <ul v-if="measurements.length" class="flex flex-col gap-1 text-body-medium text-on-surface-variant">
          <li v-for="(m, i) in measurements" :key="i">
            {{ i + 1 }}. {{ m.mode === 'area' ? `Area ${ha(m.area ?? 0)} (perimeter ${km(m.length)})` : `Distance ${km(m.length)}` }}
          </li>
        </ul>
        <p v-else class="text-body-medium text-on-surface-variant">No measurements yet.</p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="measureProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="measureEvents" />
    <p class="mt-4 text-body-medium text-on-surface-variant">
      Exposes start(mode), finish(), clear() and remove(index). In fullscreen, Escape finishes a measurement where the
      browser allows it (Chromium; holding Escape leaves fullscreen).
    </p>

    <ComponentPager current="MMapMeasure" />
  </div>
</template>
