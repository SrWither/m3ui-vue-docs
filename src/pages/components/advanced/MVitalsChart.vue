<script setup lang="ts">
import { MVitalsChart } from '@m3ui-vue/m3ui-vue'
import type { VitalSeries } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

// A day on the ward: readings every 4 hours, with a fever spike in the afternoon
const start = new Date()
start.setHours(start.getHours() - 24, 0, 0, 0)
const at = (h: number) => start.getTime() + h * 3_600_000
const hours = [0, 4, 8, 12, 16, 20, 24]
const pick = (vals: number[]) => hours.map((h, i) => ({ time: at(h), value: vals[i]! }))

const series: VitalSeries[] = [
  { key: 'hr', label: 'Heart rate', unit: 'bpm', normal: [60, 100], data: pick([78, 74, 82, 96, 112, 104, 88]) },
  {
    key: 'bp',
    label: 'Blood pressure',
    unit: 'mmHg',
    normal: [[90, 120], [60, 80]],
    color: 'var(--color-tertiary)',
    data: hours.map((h, i) => ({ time: at(h), value: [[118, 76], [122, 78], [116, 74], [128, 84], [134, 88], [124, 80], [119, 77]][i] as [number, number] })),
  },
  { key: 'spo2', label: 'SpO₂', unit: '%', normal: [95, 100], domain: [85, 100], data: pick([98, 97, 97, 96, 93, 95, 97]) },
  { key: 'temp', label: 'Temperature', unit: '°C', decimals: 1, normal: [36.1, 37.2], color: 'var(--color-error)', data: pick([36.8, 36.6, 37.0, 37.9, 38.6, 38.1, 37.1]) },
  { key: 'rr', label: 'Resp. rate', unit: '/min', normal: [12, 20], data: pick([16, 15, 16, 18, 22, 20, 17]) },
]

const props: PropDef[] = [
  { name: 'series', type: 'VitalSeries[]', description: 'Required. { key, label, unit?, color?, decimals?, normal?, domain?, data: { time, value }[] }; a value pair like [120, 80] is a range reading' },
  { name: 'rowHeight', type: 'number', default: '64', description: "Height of each row's plot, in px" },
  { name: 'from', type: 'Date | string | number', description: 'Start of the time axis (defaults to the first reading)' },
  { name: 'to', type: 'Date | string | number', description: 'End of the time axis (defaults to the last reading)' },
]

const slots: SlotDef[] = [
  { name: 'label', description: "Replaces a row's label column", scope: '{ series, reading, status }' },
]

const events: EventDef[] = [
  { name: 'hover', payload: 'number | null', description: 'Time under the crosshair (epoch ms)' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MVitalsChart</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A vitals flowsheet: one row per vital sign over a shared time axis. Each row has its normal range as a green
      band, readings outside it in red, and the latest value with a High / Low tag. Blood pressure, or any pair reading,
      is drawn as a bar from the lower to the upper value with a range per value. Hover (or focus it and use the
      arrows) to move one crosshair over every row; the values beside them follow it. Plain SVG, no chart library.
    </p>

    <ComponentDemo
      title="24 hours on the ward"
      description="A fever in the afternoon pulls heart rate, temperature, blood pressure and breathing out of range and dips the SpO₂."
      :code="`<MVitalsChart :series=&quot;[
  { key: 'hr', label: 'Heart rate', unit: 'bpm', normal: [60, 100], data: [{ time, value: 78 }, …] },
  { key: 'bp', label: 'Blood pressure', unit: 'mmHg', normal: [[90, 120], [60, 80]], data: [{ time, value: [118, 76] }, …] },
  { key: 'spo2', label: 'SpO₂', unit: '%', normal: [95, 100], domain: [85, 100], data: […] },
  { key: 'temp', label: 'Temperature', unit: '°C', decimals: 1, normal: [36.1, 37.2], data: […] },
  { key: 'rr', label: 'Resp. rate', unit: '/min', normal: [12, 20], data: […] },
]&quot; />`"
    >
      <MVitalsChart class="w-full" :series="series" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <ComponentPager current="MVitalsChart" />
  </div>
</template>
