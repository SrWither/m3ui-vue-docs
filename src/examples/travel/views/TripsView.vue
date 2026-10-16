<script setup lang="ts">
/* Your trips: upcoming and past, each opening its itinerary. */
import { computed, ref } from 'vue'
import { MButton, MEmptyState, MIcon, MSegmentedButton } from '@m3ui-vue/m3ui-vue'
import { daysBetween, destination, isoDate, photo } from '../data'
import { useTravel } from '../useTravel'
import AppHeader from '../components/AppHeader.vue'

const { trips, go } = useTravel()
const today = isoDate(new Date())
const which = ref<'upcoming' | 'past'>('upcoming')
const list = computed(() => {
  const all = trips.value.map((t) => ({ t, d: destination(t.destinationId) }))
  return which.value === 'upcoming'
    ? all.filter(({ t }) => t.end >= today).sort((a, b) => a.t.start.localeCompare(b.t.start))
    : all.filter(({ t }) => t.end < today).sort((a, b) => b.t.start.localeCompare(a.t.start))
})
const fmt = (iso: string) => new Date(`${iso}T00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
function when(start: string, end: string) {
  const until = daysBetween(today, start)
  if (end < today) return `${daysBetween(start, end)} nights`
  if (until <= 0) return 'Happening now'
  return until === 1 ? 'Tomorrow' : `In ${until} days`
}
</script>

<template>
  <div class="pb-28">
    <AppHeader title="Trips" />
    <div class="mx-auto max-w-5xl px-4 pt-2">
      <MSegmentedButton
        v-model="which"
        :options="[{ value: 'upcoming', label: 'Upcoming', icon: 'flight_takeoff' }, { value: 'past', label: 'Past', icon: 'history' }]"
        class="mb-5"
      />

      <div v-if="list.length" class="grid gap-4 sm:grid-cols-2">
        <button
          v-for="{ t, d } in list"
          :key="t.id"
          type="button"
          class="group flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-surface-container text-left transition-colors hover:bg-surface-container-high focus-visible:outline-3 focus-visible:outline-secondary"
          @click="go({ name: 'trip', id: t.id })"
        >
          <div class="relative h-40 overflow-hidden">
            <img :src="photo(d, 3, 800, 400)" :alt="d.name" class="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <span class="absolute top-3 left-3 rounded-full bg-surface/90 px-3 py-1 text-label-large text-on-surface">{{ when(t.start, t.end) }}</span>
          </div>
          <div class="p-4">
            <p class="text-title-large text-on-surface">{{ d.name }}</p>
            <p class="text-body-medium text-on-surface-variant">{{ fmt(t.start) }} – {{ fmt(t.end) }}</p>
            <p class="mt-2 flex items-center gap-3 text-body-small text-on-surface-variant">
              <span class="flex items-center gap-1"><MIcon name="group" :size="16" /> {{ t.travelers }}</span>
              <span class="flex items-center gap-1"><MIcon name="event" :size="16" /> {{ t.activities.length }} activities</span>
              <span v-if="t.flight.checkedIn" class="flex items-center gap-1 text-primary"><MIcon name="check_circle" :size="16" /> Checked in</span>
            </p>
          </div>
        </button>
      </div>

      <MEmptyState
        v-else
        icon="luggage"
        :title="which === 'upcoming' ? 'No trips planned' : 'No past trips yet'"
        :description="which === 'upcoming' ? 'Pick a place you love and plan your next getaway.' : 'Trips you take will show up here.'"
      >
        <template v-if="which === 'upcoming'" #actions>
          <MButton icon="edit_calendar" @click="go({ name: 'plan' })">Plan a trip</MButton>
        </template>
      </MEmptyState>
    </div>
  </div>
</template>
