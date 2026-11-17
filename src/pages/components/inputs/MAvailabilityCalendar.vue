<script setup lang="ts">
import { ref } from 'vue'
import { MAvailabilityCalendar, MButton, MCard } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const pad = (n: number) => String(n).padStart(2, '0')
const key = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const inDays = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return key(d)
}

// Weekends cost more; a few stays already booked
function price(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  const day = new Date(y!, m! - 1, d!).getDay()
  const base = day === 5 || day === 6 ? 145 : 110
  return base + ((d! * 7) % 4) * 5
}
const booked = [5, 6, 7, 12, 13, 21, 22, 23, 24, 33, 34].map(inDays)

const stay = ref<[string | null, string | null]>([null, null])

const minStay = ref<[string | null, string | null]>([null, null])

const props: PropDef[] = [
  { name: 'modelValue', type: '[string | null, string | null]', default: '[null, null]', description: '[checkIn, checkOut] as YYYY-MM-DD (v-model)' },
  { name: 'prices', type: 'Record<string, number> | (date) => number | undefined', description: 'Price of the night starting on each date' },
  { name: 'unavailable', type: 'string[] | (date) => boolean', description: 'Nights already booked or closed' },
  { name: 'minNights', type: 'number', default: '1', description: 'Shortest stay' },
  { name: 'maxNights', type: 'number', description: 'Longest stay' },
  { name: 'min', type: 'string', default: 'today', description: 'First bookable date' },
  { name: 'max', type: 'string', description: 'Last bookable night' },
  { name: 'months', type: 'number', default: '2', description: 'Months side by side (they wrap when narrow)' },
  { name: 'firstDayOfWeek', type: 'number', default: "the locale's", description: '0 = Sunday … 6 = Saturday' },
  { name: 'currency', type: 'string', description: 'ISO 4217 code to format prices' },
  { name: 'highlightDeals', type: 'boolean', default: 'false', description: 'Colors the cheapest quarter of the nights shown' },
  { name: 'hideFooter', type: 'boolean', default: 'false', description: 'Hides the summary under the months' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables picking' },
]

const slots: SlotDef[] = [
  { name: 'day', description: "Replaces a day's content", scope: '{ date, day, price, state }' },
  { name: 'footer', description: 'Replaces the summary', scope: '{ start, end, nights, total, clear }' },
]

const events: EventDef[] = [
  { name: 'update:modelValue', payload: '[string | null, string | null]', description: 'Check-in and check-out' },
  { name: 'change', payload: '{ start, end, nights, total }', description: 'A stay was completed' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MAvailabilityCalendar</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A booking calendar for stays and rentals: the price of each night under its day, booked nights crossed out, a
      minimum and maximum stay. Once a check-in is picked only valid check-outs stay enabled. A stay can't run over a
      booked night, but it can check out the morning one starts (those days get a dot). Arrow keys move between days,
      Page Up/Down between months, Escape drops a half-picked stay.
    </p>

    <ComponentDemo
      title="Cabin rental"
      description="Weekend nights cost more; highlightDeals marks the cheapest ones. Hover after picking a check-in to preview the stay."
      :code="`<MAvailabilityCalendar
  v-model=&quot;stay&quot;
  :prices=&quot;priceOfNight&quot;
  :unavailable=&quot;booked&quot;
  currency=&quot;USD&quot;
  highlight-deals
/>`"
      :script="`const stay = ref<[string | null, string | null]>([null, null])
const booked = ['2026-11-22', '2026-11-23', …]
function priceOfNight(date: string) {
  return isWeekend(date) ? 145 : 110
}`"
    >
      <MAvailabilityCalendar
        v-model="stay"
        class="w-full"
        :prices="price"
        :unavailable="booked"
        currency="USD"
        highlight-deals
      />
    </ComponentDemo>

    <ComponentDemo
      title="Minimum stay and a custom summary"
      description="minNights=&quot;3&quot; disables check-ins that can't fit three nights before the next booking, and check-outs closer than that. The footer slot draws a reserve bar."
      :code="`<MAvailabilityCalendar v-model=&quot;stay&quot; :months=&quot;1&quot; :min-nights=&quot;3&quot; :max-nights=&quot;14&quot; :prices=&quot;priceOfNight&quot; :unavailable=&quot;booked&quot; currency=&quot;EUR&quot;>
  <template #footer=&quot;{ nights, total, clear }&quot;>
    <span class=&quot;flex-1&quot;>{{ nights ? nights + ' nights · €' + total : 'Min. 3 nights' }}</span>
    <MButton variant=&quot;text&quot; @click=&quot;clear&quot;>Clear</MButton>
    <MButton :disabled=&quot;!nights&quot;>Reserve</MButton>
  </template>
</MAvailabilityCalendar>`"
    >
      <div class="flex w-full justify-center">
        <MCard variant="outlined" class="w-full max-w-sm p-4">
          <MAvailabilityCalendar
            v-model="minStay"
            :months="1"
            :min-nights="3"
            :max-nights="14"
            :prices="price"
            :unavailable="booked"
            currency="EUR"
          >
            <template #footer="{ nights, total, clear }">
              <span class="flex-1 text-body-large">
                <template v-if="nights">{{ nights }} nights · <strong>€{{ total }}</strong></template>
                <span v-else class="text-on-surface-variant">Min. 3 nights</span>
              </span>
              <MButton variant="text" @click="clear">Clear</MButton>
              <MButton :disabled="!nights">Reserve</MButton>
            </template>
          </MAvailabilityCalendar>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <ComponentPager current="MAvailabilityCalendar" />
  </div>
</template>
