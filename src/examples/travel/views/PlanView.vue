<script setup lang="ts">
/*
 * Plan a trip: where (MSelect), when (MDateRangePickerModal), who (MNumberField) and what you're
 * into (MTagInput). Creating it builds a day-by-day itinerary from the destination's activities.
 */
import { computed, ref, watch } from 'vue'
import { MButton, MDateRangePickerModal, MIcon, MNumberField, MSelect, MTagInput } from '@m3ui-vue/m3ui-vue'
import type { DateRange } from '@m3ui-vue/m3ui-vue'
import { addDays, daysBetween, destination, destinations, isoDate, photo } from '../data'
import { useTravel } from '../useTravel'
import AppHeader from '../components/AppHeader.vue'

const props = defineProps<{ destinationId?: string }>()
const { go, createTrip } = useTravel()

const where = ref<string | null>(props.destinationId ?? null)
const today = isoDate(new Date())
// Default to next weekend: Friday to Monday.
const friday = addDays(today, ((5 - new Date().getDay() + 7) % 7) || 7)
const dates = ref<DateRange>({ start: friday, end: addDays(friday, 3) })
const pickingDates = ref(false)
const travelers = ref<number | null>(2)
const interests = ref<string[]>([])

const options = destinations.map((d) => ({ label: `${d.name}, ${d.country}`, value: d.id }))
const picked = computed(() => (where.value ? destination(where.value) : null))
// Start from the destination's own tags; you can add your own.
watch(picked, (d) => (interests.value = d ? [...d.tags] : []), { immediate: true })

const fmt = (iso: string) => new Date(`${iso}T00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
const nights = computed(() => (dates.value.start && dates.value.end ? daysBetween(dates.value.start, dates.value.end) : 0))
const datesLabel = computed(() =>
  dates.value.start && dates.value.end ? `${fmt(dates.value.start)} – ${fmt(dates.value.end)}` : 'Choose dates',
)
const valid = computed(() => !!picked.value && nights.value > 0 && !!travelers.value)
const estimate = computed(() => (picked.value && travelers.value ? picked.value.priceFrom * travelers.value + nights.value * 90 * Math.ceil(travelers.value / 2) : 0))

function create() {
  if (!valid.value || !picked.value) return
  const t = createTrip(picked.value.id, dates.value.start!, dates.value.end!, travelers.value!, interests.value)
  go({ name: 'trip', id: t.id })
}
</script>

<template>
  <div class="pb-28">
    <AppHeader title="Plan a trip" back />

    <div class="mx-auto grid max-w-5xl gap-6 px-4 pt-2 lg:grid-cols-[1fr_340px]">
      <div class="flex flex-col gap-5">
        <MSelect v-model="where" :options="options" label="Where to?" leading-icon="location_on" variant="outlined" />

        <div>
          <p class="mb-1.5 text-label-large text-on-surface-variant">When</p>
          <MButton variant="outlined" icon="date_range" size="md" class="w-full justify-start" @click="pickingDates = true">
            {{ datesLabel }}<span v-if="nights" class="ml-auto pl-3 text-on-surface-variant">{{ nights }} {{ nights === 1 ? 'night' : 'nights' }}</span>
          </MButton>
          <MDateRangePickerModal v-model="dates" v-model:show="pickingDates" :min="today" title="Trip dates" />
        </div>

        <MNumberField v-model="travelers" label="Travelers" leading-icon="group" :min="1" :max="8" stepper variant="outlined" />

        <MTagInput
          v-model="interests"
          label="Interests"
          leading-icon="interests"
          placeholder="Add an interest and press Enter"
          hint="We use these to suggest activities"
          variant="outlined"
          :max-tags="8"
          clearable
        />

        <MButton icon="check" size="md" :disabled="!valid" class="self-start" @click="create">Create trip</MButton>
      </div>

      <!-- Summary -->
      <aside class="self-start overflow-hidden rounded-3xl bg-surface-container">
        <img v-if="picked" :src="photo(picked, 0, 680, 400)" :alt="picked.name" class="h-44 w-full object-cover" />
        <div v-else class="flex h-44 items-center justify-center bg-surface-container-high text-on-surface-variant">
          <MIcon name="travel_explore" :size="40" />
        </div>
        <div class="p-5">
          <p class="text-title-large text-on-surface">{{ picked ? picked.name : 'Pick a destination' }}</p>
          <p class="text-body-medium text-on-surface-variant">{{ picked ? picked.country : 'Anywhere you like' }}</p>
          <dl class="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-body-medium">
            <dt class="text-on-surface-variant">Dates</dt><dd class="text-on-surface">{{ datesLabel }}</dd>
            <dt class="text-on-surface-variant">Travelers</dt><dd class="text-on-surface">{{ travelers ?? '–' }}</dd>
            <dt class="text-on-surface-variant">Estimate</dt><dd class="text-on-surface">{{ estimate ? `$${estimate.toLocaleString('en-US')}` : '–' }}</dd>
          </dl>
        </div>
      </aside>
    </div>
  </div>
</template>
