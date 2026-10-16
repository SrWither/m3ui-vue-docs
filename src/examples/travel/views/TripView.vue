<script setup lang="ts">
/*
 * A trip: the boarding pass (check in by typing the booking reference into MPinInput), the
 * itinerary in MScheduler (click an empty hour to add an activity, an activity to remove it) and
 * deleting the trip with MConfirmDialog.
 */
import { computed, ref } from 'vue'
import { MButton, MConfirmDialog, MDialog, MIcon, MList, MListItem, MPinInput, MScheduler, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import type { SchedulerEvent } from '@m3ui-vue/m3ui-vue'
import { daysBetween, destination, isoDate, photo, type Experience } from '../data'
import { useTravel } from '../useTravel'
import AppHeader from '../components/AppHeader.vue'
import BoardingPass from '../components/BoardingPass.vue'

const props = defineProps<{ id: string }>()
const { trip: findTrip, updateTrip, addActivity, removeActivity, deleteTrip, go } = useTravel()
const { widthClass } = useWindowSizeClass()
const compact = computed(() => widthClass.value === 'compact')

const t = computed(() => findTrip(props.id))
const d = computed(() => (t.value ? destination(t.value.destinationId) : null))
const today = isoDate(new Date())
const pad = (n: number) => String(n).padStart(2, '0')
const past = computed(() => !!t.value && t.value.end < today)

const fmt = (iso: string) => new Date(`${iso}T00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const subtitle = computed(() => {
  if (!t.value) return ''
  const range = `${fmt(t.value.start)} – ${fmt(t.value.end)}`
  const until = daysBetween(today, t.value.start)
  if (past.value) return `${range} · Past trip`
  if (until <= 0) return `${range} · Happening now`
  return `${range} · in ${until} ${until === 1 ? 'day' : 'days'}`
})

// ── Itinerary ──────────────────────────────────────────────────────────────────────────────────
const colors = ['primary', 'secondary', 'tertiary', 'success'] as const
const events = computed<SchedulerEvent[]>(() => {
  if (!t.value || !d.value) return []
  const trip = t.value
  const [h, m] = trip.flight.boards.split(':').map(Number)
  const landMin = h! * 60 + m! + d.value.flightHours * 60
  const landDay = new Date(`${trip.start}T00:00`)
  landDay.setMinutes(landMin)
  const lands = `${isoDate(landDay)}T${pad(landDay.getHours())}:${pad(landDay.getMinutes())}`
  return [
    // The stay spans the whole trip and the flight may land the next day: both go to the all-day row.
    { id: 'stay', title: `Stay in ${d.value.name}`, start: trip.start, end: trip.end, allDay: true, color: 'secondary' as const },
    { id: 'flight-out', title: `Flight ${trip.flight.number} to ${d.value.airport}`, start: `${trip.start}T${trip.flight.boards}`, end: lands, color: 'error' as const },
    { id: 'flight-back', title: `Flight home from ${d.value.airport}`, start: `${trip.end}T18:00`, end: `${trip.end}T21:00`, color: 'error' as const },
    ...trip.activities.map((a, i) => ({ id: a.id, title: a.title, start: a.start, end: a.end, color: colors[i % colors.length] })),
  ]
})
const isActivity = (e: SchedulerEvent | null) => !!e && !['stay', 'flight-out', 'flight-back'].includes(String(e.id))

const adding = ref<{ open: boolean; date: string; hour: number }>({ open: false, date: '', hour: 9 })
function onSlot(slot: { date: string; hour: number }) {
  if (!t.value || past.value) return
  adding.value = { open: true, date: slot.date, hour: slot.hour }
}
function add(e: Experience) {
  if (!t.value) return
  const { date, hour } = adding.value
  const end = Math.min(hour + e.duration, 23)
  addActivity(t.value.id, { id: `${date}-${hour}-${e.id}-${Date.now()}`, title: e.title, icon: e.icon, start: `${date}T${pad(hour)}:00`, end: `${date}T${pad(end)}:00` })
  adding.value.open = false
}
const addingLabel = computed(() =>
  adding.value.date ? `${new Date(`${adding.value.date}T00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}, ${pad(adding.value.hour)}:00` : '',
)

const selected = ref<SchedulerEvent | null>(null)
const selectedOpen = computed({ get: () => !!selected.value, set: (v) => { if (!v) selected.value = null } })
function removeSelected() {
  if (t.value && selected.value) removeActivity(t.value.id, String(selected.value.id))
  selected.value = null
}
const time = (s: string) => s.slice(11, 16)

// ── Check-in ───────────────────────────────────────────────────────────────────────────────────
const checkingIn = ref(false)
const code = ref('')
const codeError = ref(false)
function onCode(value: string) {
  if (!t.value) return
  if (value.toUpperCase() === t.value.flight.reference) {
    updateTrip(t.value.id, { flight: { ...t.value.flight, checkedIn: true } })
    checkingIn.value = false
  } else {
    codeError.value = true
  }
}
function openCheckIn() {
  code.value = ''
  codeError.value = false
  checkingIn.value = true
}

const confirmDelete = ref(false)
</script>

<template>
  <div class="pb-28">
    <template v-if="t && d">
      <AppHeader :title="`Trip to ${d.name}`" :subtitle="subtitle" back />

      <div class="mx-auto max-w-5xl px-4 pt-2">
        <div class="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div class="relative overflow-hidden rounded-3xl">
            <img :src="photo(d, 3, 1200, 600)" :alt="d.name" class="h-48 w-full object-cover sm:h-56" />
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-12 text-white">
              <p class="text-headline-small font-medium">{{ d.name }}, {{ d.country }}</p>
              <p class="text-body-medium opacity-90">{{ t.travelers }} {{ t.travelers === 1 ? 'traveler' : 'travelers' }} · {{ t.activities.length }} activities planned</p>
            </div>
          </div>
          <BoardingPass :trip="t" :destination="d" :past="past" @check-in="openCheckIn" />
        </div>

        <div class="mt-8 mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 class="text-title-large text-on-surface">Itinerary</h2>
            <p class="text-body-medium text-on-surface-variant">
              {{ past ? 'What you did on this trip.' : 'Click an empty hour to add an activity, or an activity to remove it. Your stay and flights are already in.' }}
            </p>
          </div>
          <MButton variant="text" icon="travel_explore" @click="go({ name: 'destination', id: d.id })">About {{ d.name }}</MButton>
        </div>
        <MScheduler
          :key="compact ? 'day' : 'week'"
          :events="events"
          :date="t.start"
          :view="compact ? 'day' : 'week'"
          :start-hour="7"
          :end-hour="23"
          locale="en-US"
          class="max-h-[560px]"
          @slot-click="onSlot"
          @event-click="(e) => (selected = e)"
        />

        <div class="mt-8 flex justify-end">
          <MButton variant="text" icon="delete" color="error" @click="confirmDelete = true">Delete trip</MButton>
        </div>
      </div>

      <!-- Add an activity -->
      <MDialog v-model="adding.open" :title="`Add to ${addingLabel}`" max-width="max-w-[440px]">
        <MList>
          <MListItem
            v-for="e in d.experiences"
            :key="e.id"
            :title="e.title"
            :subtitle="`${e.duration} h · $${e.price} per person`"
            :icon="e.icon"
            leading="icon-container"
            icon-container-color="secondary"
            clickable
            @click="add(e)"
          />
        </MList>
      </MDialog>

      <!-- An activity -->
      <MDialog v-model="selectedOpen" :title="selected?.title" max-width="max-w-[400px]">
        <p v-if="selected" class="flex items-center gap-2 text-body-large text-on-surface-variant">
          <MIcon name="schedule" :size="20" />
          <template v-if="selected.allDay">{{ fmt(selected.start) }} – {{ fmt(selected.end) }}</template>
          <template v-else>
            {{ new Date(selected.start).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) }},
            {{ time(selected.start) }} – {{ time(selected.end) }}
          </template>
        </p>
        <template #actions>
          <MButton variant="text" @click="selected = null">Close</MButton>
          <MButton v-if="!past && isActivity(selected)" variant="tonal" icon="event_busy" @click="removeSelected">Remove</MButton>
        </template>
      </MDialog>

      <!-- Check-in -->
      <MDialog v-model="checkingIn" title="Online check-in" max-width="max-w-[420px]">
        <p class="mb-4 text-body-medium text-on-surface-variant">
          Type the 6-character booking reference from your pass to check in for {{ t.flight.number }} to {{ d.airport }}.
        </p>
        <MPinInput
          v-model="code"
          :length="6"
          :groups="[3, 3]"
          separator="-"
          type="alphanumeric"
          label="Booking reference"
          :error="codeError"
          error-label="That reference doesn’t match this booking"
          :hint="`It’s on your pass: ${t.flight.reference}`"
          auto-focus
          @update:model-value="codeError = false"
          @complete="onCode"
        />
        <template #actions>
          <MButton variant="text" @click="checkingIn = false">Cancel</MButton>
        </template>
      </MDialog>

      <MConfirmDialog
        v-model="confirmDelete"
        title="Delete this trip?"
        :message="`Your plans for ${d.name} will be removed. You can undo it for a few seconds.`"
        confirm-label="Delete"
        danger
        @confirm="deleteTrip(t.id)"
      />
    </template>

    <template v-else>
      <AppHeader title="Trip not found" back />
      <p class="px-6 pt-6 text-body-large text-on-surface-variant">This trip was deleted.</p>
    </template>
  </div>
</template>
