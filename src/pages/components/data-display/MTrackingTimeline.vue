<script setup lang="ts">
import { computed, ref } from 'vue'
import { MSegmentedButton, MSlider, MTrackingTimeline } from '@m3ui-vue/m3ui-vue'
import type { TrackingStatus } from '@m3ui-vue/m3ui-vue'
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

// A parcel: drag the sliders to move it along
const at = (h: number) => new Date(Date.now() - h * 3_600_000)
const parcel = [
  { label: 'Shipped', icon: 'inventory_2', time: at(30), description: 'Buenos Aires warehouse' },
  { label: 'In transit', icon: 'local_shipping', time: at(20), description: 'Rosario hub' },
  { label: 'Out for delivery', icon: 'pin_drop', time: at(2), description: 'Córdoba' },
  { label: 'Delivered', icon: 'where_to_vote' },
]
const current = ref(2)
const leg = ref(0.6)
const status = ref<TrackingStatus>('active')
const eta = computed(() => new Date(Date.now() + (1 - leg.value) * 95 * 60_000))
const statusOptions = [
  { value: 'active', label: 'On time' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'canceled', label: 'Canceled' },
]

const props: PropDef[] = [
  { name: 'steps', type: 'TrackingStep[]', description: 'The stages, in order' },
  { name: 'current', type: 'number', description: 'The stage it is at (0-based); earlier ones are done. steps.length − 1 at the last one means delivered' },
  { name: 'stepProgress', type: 'number', default: '0', description: "How far along the current stage's leg it is, 0–1 (e.g. MMapRoute's progress)" },
  { name: 'eta', type: 'string | number | Date', description: 'The expected arrival: the minutes left and the time, updated by itself' },
  { name: 'status', type: "'active' | 'delayed' | 'canceled'", default: "'active'", description: 'On time, running late (tertiary, a chip) or called off (error; nothing moves)' },
  { name: 'title', type: 'string', description: "The title, instead of the current stage's name" },
  { name: 'message', type: 'string', description: 'A line under the title' },
  { name: 'details', type: 'boolean', default: 'true', description: 'Offer the stages with their times in a list that opens below' },
  { name: 'expanded', type: 'boolean', description: 'Whether the details are open (v-model:expanded)' },
]
const events: EventDef[] = [
  { name: 'update:expanded', payload: 'boolean', description: 'The details opened or closed' },
]
const slots: SlotDef[] = [
  { name: 'title', description: 'Replaces the title. Scope: { step, index }' },
  { name: 'extra', description: 'Content between the bar and the details: the courier, a call button, a map' },
]
const types: TypeDef[] = [
  {
    name: 'TrackingStep',
    fields: [
      { name: 'label', type: 'string', required: true, description: 'Its name' },
      { name: 'description', type: 'string', description: 'A line under it in the details' },
      { name: 'icon', type: 'string', description: 'A Material Symbol for its dot' },
      { name: 'time', type: 'string | number | Date', description: 'When it happened (or is expected), shown in the details' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTrackingTimeline</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      An order's progress for deliveries, rides and shipments: the stage and the arrival time on top, a bar of stage
      icons whose current leg fills as it goes, delayed and canceled states, and the stages with their times below.
      Not an M3 spec component: built from <RouterLink to="/components/data-display/mtimeline" class="text-primary underline">MTimeline</RouterLink>,
      MCollapse and M3's color roles.
    </p>

    <ComponentDemo
      title="A parcel"
      description="Move the stage and the current leg; open the details for the times."
      :code="`<MTrackingTimeline :steps=&quot;steps&quot; :current=&quot;2&quot; :step-progress=&quot;0.6&quot; :eta=&quot;eta&quot; :status=&quot;status&quot; />`"
      :script="`const steps = [
  { label: 'Shipped', icon: 'inventory_2', time: shippedAt, description: 'Buenos Aires warehouse' },
  { label: 'In transit', icon: 'local_shipping', time: hubAt, description: 'Rosario hub' },
  { label: 'Out for delivery', icon: 'pin_drop', time: outAt, description: 'Córdoba' },
  { label: 'Delivered', icon: 'where_to_vote' },
]`"
    >
      <div class="flex w-full max-w-md flex-col gap-4">
        <MTrackingTimeline :steps="parcel" :current="current" :step-progress="leg" :eta="eta" :status="status" />
        <MSlider v-model="current" :min="0" :max="3" :step="1" label="Stage" show-value />
        <MSlider v-model="leg" :min="0" :max="1" :step="0.05" label="Current leg" show-value />
        <MSegmentedButton v-model="status" :options="statusOptions" density="compact" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With a map"
      description="MMapRoute's progress drives the current leg; the courier goes in #extra."
      flush
      :code="`<MTrackingTimeline :steps=&quot;steps&quot; :current=&quot;current&quot; :step-progress=&quot;progress&quot; :eta=&quot;eta&quot; :status=&quot;status&quot;>
  <template #extra><!-- the courier, a call button --></template>
</MTrackingTimeline>`"
    >
      <div class="p-4">
        <DeliveryTrackingDemo />
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

    <ComponentPager current="MTrackingTimeline" />
  </div>
</template>
