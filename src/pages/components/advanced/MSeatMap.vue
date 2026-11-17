<script setup lang="ts">
import { computed, ref } from 'vue'
import { MSeatMap, MButton, useToast } from '@m3ui-vue/m3ui-vue'
import type { SeatCategory } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const cinema = [
  'ss_ssssssss_ss',
  'ss_ssssssss_ss',
  'ss_ssssssss_ss',
  'ss_ssssssss_ss',
  '',
  'pp_pppppppp_pp',
  'pp_pppppppp_pp',
  '',
  '___ww____ww___',
]
const cinemaCategories: SeatCategory[] = [
  { key: 's', label: 'Standard', price: 9.5 },
  { key: 'p', label: 'Premium', price: 14, color: 'tertiary' },
  { key: 'w', label: 'Wheelchair', price: 9.5, color: 'secondary' },
]
const taken = ['A5', 'A6', 'B6', 'B7', 'B8', 'C1', 'C2', 'D9', 'D10', 'E5', 'E6', 'F7', 'F8']
const seats = ref<string[]>([])
const toast = useToast()
const total = computed(() =>
  seats.value.reduce((sum, id) => {
    const row = id[0]
    const cat = row === 'E' || row === 'F' ? 14 : 9.5
    return sum + cat
  }, 0),
)

const plane = [
  '_bb_bb_',
  '_bb_bb_',
  '',
  'eee_eee',
  'eee_eee',
  'eee_eee',
  'eee_eee',
  'eee_eee',
  'eee_eee',
]
const planeCategories: SeatCategory[] = [
  { key: 'b', label: 'Business', color: 'primary' },
  { key: 'e', label: 'Economy', color: 'secondary' },
]
const planeSeat = ref<string[]>([])

const bus = ['sssss', 'ss_ss', 'ss_ss', 'ss_ss', 'ss_ss', 'ss_ss']
const busSeats = ref<string[]>([])

const props: PropDef[] = [
  { name: 'modelValue', type: 'string[]', default: '[]', description: 'Ids of the selected seats (v-model)' },
  { name: 'layout', type: 'string[]', description: 'Required. Rows of the hall, top to bottom. Each character is a seat of the category with that key; _ or a space is a gap; a blank line is an empty row' },
  { name: 'categories', type: 'SeatCategory[]', default: '[]', description: '{ key, label, color?, price? } per layout character. color is a role (primary, secondary, tertiary, error, success) or any CSS color' },
  { name: 'occupied', type: 'string[]', default: '[]', description: 'Ids of seats already taken' },
  { name: 'blocked', type: 'string[]', default: '[]', description: "Ids of seats that can't be picked (out of service, kept free)" },
  { name: 'naming', type: "'theater' | 'plane'", default: "'theater'", description: 'Row letters + seat numbers ("F12"), or row numbers + seat letters ("12C")' },
  { name: 'rowLabels', type: 'string[]', description: 'Custom row labels, one per seat row (blank rows not counted)' },
  { name: 'numbering', type: "'ltr' | 'rtl'", default: "'ltr'", description: 'Seats are numbered from the left or the right of each row' },
  { name: 'max', type: 'number', description: 'Most seats that can be selected. With 1, picking another seat moves the selection' },
  { name: 'stage', type: 'string | false', default: "locale 'Screen'", description: 'Label of the screen or stage; false hides it' },
  { name: 'stagePosition', type: "'top' | 'bottom'", default: "'top'", description: 'Side the screen/stage is drawn on' },
  { name: 'seatSize', type: 'number', default: '32', description: 'Seat size in px' },
  { name: 'showRowLabels', type: 'boolean', default: 'true', description: 'Row labels at both ends of each row' },
  { name: 'legend', type: 'boolean', default: 'true', description: 'Shows the legend' },
  { name: 'currency', type: 'string', description: 'ISO 4217 code to format prices' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables picking' },
]

const slots: SlotDef[] = [
  { name: 'seat', description: "Replaces a seat's content (the button stays)", scope: '{ seat, state, category }' },
  { name: 'legend', description: 'Replaces the legend', scope: '{ categories }' },
]

const events: EventDef[] = [
  { name: 'update:modelValue', payload: 'string[]', description: 'Ids of the selected seats' },
  { name: 'select', payload: '(seat: SeatInfo, selected: boolean)', description: 'A seat was picked or released' },
  { name: 'limit', payload: '—', description: 'A seat was picked while max seats were already selected' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSeatMap</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Seat picker for a cinema, theater, stadium, bus or plane. The hall is drawn from rows of characters: each character
      is a seat of the category with that key, and <code>_</code> or a space leaves a gap. Seats are named theater style
      ("F12") or plane style ("12C"), and those names are the ids in v-model, <code>occupied</code> and
      <code>blocked</code>. Arrow keys move between seats; Enter or Space picks one.
    </p>

    <ComponentDemo
      title="Cinema"
      description="Categories give each seat type a color and a price (in the legend and each seat's label). max caps the selection and fires limit."
      :code="`<MSeatMap
  v-model=&quot;seats&quot;
  :layout=&quot;[
    'ss_ssssssss_ss',
    'ss_ssssssss_ss',
    …,
    '',
    'pp_pppppppp_pp',
    'pp_pppppppp_pp',
    '',
    '___ww____ww___',
  ]&quot;
  :categories=&quot;[
    { key: 's', label: 'Standard', price: 9.5 },
    { key: 'p', label: 'Premium', price: 14, color: 'tertiary' },
    { key: 'w', label: 'Wheelchair', price: 9.5, color: 'secondary' },
  ]&quot;
  :occupied=&quot;taken&quot;
  :max=&quot;6&quot;
  currency=&quot;USD&quot;
  @limit=&quot;toast.show('You can pick up to 6 seats')&quot;
/>`"
      :script="`const seats = ref<string[]>([])
const taken = ['A5', 'A6', 'B6', 'B7', 'B8', 'C1', 'C2', …]`"
    >
      <div class="flex w-full flex-col items-center gap-4">
        <MSeatMap
          v-model="seats"
          class="w-full"
          :layout="cinema"
          :categories="cinemaCategories"
          :occupied="taken"
          :max="6"
          currency="USD"
          @limit="toast.show('You can pick up to 6 seats')"
        />
        <div class="flex w-full max-w-md items-center justify-between gap-3">
          <p class="text-body-large">
            <template v-if="seats.length">{{ seats.join(', ') }} · <strong>${{ total.toFixed(2) }}</strong></template>
            <span v-else class="text-on-surface-variant">Pick up to 6 seats</span>
          </p>
          <MButton :disabled="!seats.length">Continue</MButton>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Plane"
      description="naming=&quot;plane&quot; numbers the rows and letters the seats (no I, as airlines do). With max 1, picking another seat moves the selection. Blocked seats can't be picked."
      :code="`<MSeatMap
  v-model=&quot;seat&quot;
  :layout=&quot;['_bb_bb_', '_bb_bb_', '', 'eee_eee', …]&quot;
  :categories=&quot;[{ key: 'b', label: 'Business' }, { key: 'e', label: 'Economy', color: 'secondary' }]&quot;
  naming=&quot;plane&quot;
  :max=&quot;1&quot;
  :stage=&quot;false&quot;
  :occupied=&quot;['1A', '4C', '4D', '6B']&quot;
  :blocked=&quot;['8C', '8D']&quot;
  :seat-size=&quot;28&quot;
/>`"
    >
      <div class="flex w-full flex-col items-center gap-2">
        <MSeatMap
          v-model="planeSeat"
          :layout="plane"
          :categories="planeCategories"
          naming="plane"
          :max="1"
          :stage="false"
          :occupied="['1A', '4C', '4D', '6B']"
          :blocked="['8C', '8D']"
          :seat-size="28"
        />
        <p class="text-body-medium text-on-surface-variant">Seat: {{ planeSeat[0] ?? '—' }}</p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Bus, custom seats"
      description="The seat slot draws what's inside each seat; here, its number. stagePosition puts the driver's end at the bottom."
      :code="`<MSeatMap v-model=&quot;seats&quot; :layout=&quot;bus&quot; stage=&quot;Driver&quot; stage-position=&quot;bottom&quot; :show-row-labels=&quot;false&quot; :seat-size=&quot;36&quot;>
  <template #seat=&quot;{ seat, state }&quot;>
    <span class=&quot;text-label-medium&quot;>{{ seat.id }}</span>
  </template>
</MSeatMap>`"
    >
      <div class="flex w-full justify-center">
      <MSeatMap
        v-model="busSeats"
        :layout="bus"
        stage="Driver"
        stage-position="bottom"
        :show-row-labels="false"
        :seat-size="36"
        :occupied="['B1', 'D4']"
      >
        <template #seat="{ seat }">
          <span class="text-label-medium">{{ seat.id }}</span>
        </template>
      </MSeatMap>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <ComponentPager current="MSeatMap" />
  </div>
</template>
