<script setup lang="ts">
/* A boarding pass for the trip's outbound flight, with its check-in state. */
import { computed } from 'vue'
import { MButton, MIcon } from '@m3ui-vue/m3ui-vue'
import type { Destination, Trip } from '../data'

const props = defineProps<{ trip: Trip; destination: Destination; past: boolean }>()
defineEmits<{ checkIn: [] }>()

const date = computed(() => new Date(`${props.trip.start}T00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }))
const arrives = computed(() => {
  const [h, m] = props.trip.flight.boards.split(':').map(Number)
  const total = h! * 60 + m! + 30 + props.destination.flightHours * 60
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
})
</script>

<template>
  <div class="flex flex-col overflow-hidden rounded-3xl bg-primary-container text-on-primary-container">
    <div class="flex items-center justify-between px-5 pt-4">
      <span class="flex items-center gap-2 text-label-large"><MIcon name="airplane_ticket" :size="20" /> Boarding pass</span>
      <span class="text-label-large">{{ trip.flight.number }}</span>
    </div>

    <div class="flex items-center gap-3 px-5 pt-3">
      <div>
        <p class="text-headline-medium font-medium">HOM</p>
        <p class="text-body-small opacity-80">{{ trip.flight.boards }}</p>
      </div>
      <div class="flex flex-1 items-center gap-1 opacity-70">
        <span class="h-px flex-1 border-t border-dashed border-current" />
        <MIcon name="flight" :size="20" class="rotate-90" />
        <span class="h-px flex-1 border-t border-dashed border-current" />
      </div>
      <div class="text-right">
        <p class="text-headline-medium font-medium">{{ destination.airport }}</p>
        <p class="text-body-small opacity-80">{{ arrives }}</p>
      </div>
    </div>

    <dl class="grid grid-cols-4 gap-2 px-5 pt-4 pb-4 text-body-small">
      <div><dt class="opacity-70">Date</dt><dd class="text-label-large">{{ date }}</dd></div>
      <div><dt class="opacity-70">Gate</dt><dd class="text-label-large">{{ trip.flight.gate }}</dd></div>
      <div><dt class="opacity-70">Seat</dt><dd class="text-label-large">{{ trip.flight.seat }}</dd></div>
      <div><dt class="opacity-70">Ref</dt><dd class="font-mono text-label-large">{{ trip.flight.reference }}</dd></div>
    </dl>

    <!-- Perforation -->
    <div class="relative h-0 border-t-2 border-dashed border-on-primary-container/25">
      <span class="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-surface" />
      <span class="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-surface" />
    </div>

    <div class="flex min-h-16 items-center justify-between gap-3 px-5 py-3">
      <span v-if="trip.flight.checkedIn" class="flex items-center gap-2 text-label-large"><MIcon name="check_circle" :size="20" /> Checked in</span>
      <span v-else-if="past" class="text-label-large opacity-80">Flight completed</span>
      <span v-else class="text-body-medium opacity-80">Check-in is open</span>
      <MButton v-if="!trip.flight.checkedIn && !past" variant="filled" icon="how_to_reg" @click="$emit('checkIn')">Check in</MButton>
    </div>
  </div>
</template>
