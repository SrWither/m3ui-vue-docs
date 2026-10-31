<script setup lang="ts">
/*
 * The picked table during service: who's there and for how long, the bill, and what to do next: seat someone
 * (from the waitlist or walk-ins), take the bill, clear it, mark it clean, reserve it, join it with a neighbor or
 * split it again.
 */
import { computed, ref, watch } from 'vue'
import { MButton, MChip, MIcon, MNumberField } from '@m3ui-vue/m3ui-vue'
import { STATUSES, useFloor } from '../useFloor'

const props = defineProps<{ id: string | number }>()
const emit = defineEmits<{ join: []; split: []; close: [] }>()
const f = useFloor()
const table = computed(() => f.room.value.tables.find((t) => t.id === props.id))
const s = computed(() => f.serviceOf(props.id))
const group = computed(() => f.groupOf(props.id))
const merged = computed(() => group.value.length > 1)
const seats = computed(() => f.seatsOf(props.id))
const minutes = computed(() => (s.value.since ? Math.round((f.now.value - s.value.since) / 60_000) : 0))
const label = computed(() => group.value.map((id) => f.room.value.tables.find((t) => t.id === id)?.label).join(' + '))

/** The whole group changes together */
function setAll(next: Parameters<typeof f.setService>[1]) {
  group.value.forEach((id, i) => f.setService(id, i === 0 ? next : { ...next, guests: 0, total: undefined }))
}
function seat(name: string | undefined, guests: number, partyId?: string) {
  setAll({ status: 'seated', party: name, guests, since: Date.now(), total: 0 })
  if (partyId) f.waitlist.value = f.waitlist.value.filter((p) => p.id !== partyId)
}
const walkIn = ref<number | null>(2)
watch(() => props.id, () => (walkIn.value = Math.min(2, seats.value)), { immediate: true })
const fits = computed(() => f.waitlist.value.filter((p) => p.size <= seats.value))
function addToBill(amount: number) {
  f.setService(group.value[0]!, { ...f.serviceOf(group.value[0]!), total: (f.serviceOf(group.value[0]!).total ?? 0) + amount })
}
// Splitting goes through the plan (its split(), the page calls it)
const split = () => emit('split')
</script>

<template>
  <div v-if="table" class="flex flex-col gap-4 p-4">
    <div class="flex items-start gap-3">
      <span class="flex size-12 shrink-0 items-center justify-center rounded-xl text-title-medium" :class="table.shape === 'round' && 'rounded-full'" :style="{ background: `var(--color-${STATUSES[s.status].color === 'surface' ? 'surface-container-highest' : STATUSES[s.status].color + '-container'})` }">{{ table.label }}</span>
      <div class="min-w-0 flex-1">
        <div class="text-title-medium">Table {{ label }}</div>
        <div class="text-body-small text-on-surface-variant">{{ seats }} seats · {{ STATUSES[s.status].label }}</div>
      </div>
      <MButton variant="text" size="xs" icon="close" @click="emit('close')">Close</MButton>
    </div>

    <template v-if="s.status === 'seated' || s.status === 'bill'">
      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="rounded-lg bg-surface-container-high p-2"><div class="text-title-large">{{ s.guests ?? '–' }}</div><div class="text-label-small text-on-surface-variant">guests</div></div>
        <div class="rounded-lg bg-surface-container-high p-2"><div class="text-title-large">{{ minutes }}′</div><div class="text-label-small text-on-surface-variant">seated</div></div>
        <div class="rounded-lg bg-surface-container-high p-2"><div class="text-title-large">${{ f.serviceOf(group[0]!).total ?? 0 }}</div><div class="text-label-small text-on-surface-variant">bill</div></div>
      </div>
      <div v-if="s.party" class="flex items-center gap-2 text-body-medium"><MIcon name="person" :size="18" class="text-on-surface-variant" />{{ s.party }}</div>
      <div v-if="s.status === 'seated'" class="flex flex-wrap gap-2">
        <MChip v-for="a in [8, 15, 30]" :key="a" clickable icon="add" @click="addToBill(a)">${{ a }}</MChip>
      </div>
      <MButton v-if="s.status === 'seated'" variant="tonal" icon="receipt_long" @click="setAll({ ...s, status: 'bill' })">Bill requested</MButton>
      <MButton icon="payments" @click="setAll({ status: 'cleaning' })">Paid · clear the table</MButton>
    </template>

    <template v-else-if="s.status === 'cleaning'">
      <p class="text-body-medium text-on-surface-variant">Waiting for a wipe and a fresh setting.</p>
      <MButton icon="check" @click="setAll({ status: 'free' })">Clean · ready</MButton>
    </template>

    <template v-else>
      <p v-if="s.status === 'reserved'" class="flex items-center gap-2 text-body-medium"><MIcon name="event" :size="18" class="text-secondary" />{{ s.reservedFor }}</p>
      <div>
        <div class="mb-2 text-title-small">Seat from the waitlist</div>
        <p v-if="!fits.length" class="text-body-small text-on-surface-variant">Nobody waiting fits {{ seats }} seats.</p>
        <div v-for="p in fits" :key="p.id" class="flex items-center gap-2 py-1">
          <span class="min-w-0 flex-1 truncate text-body-medium">{{ p.name }} · {{ p.size }}<span v-if="p.note" class="text-on-surface-variant"> · {{ p.note }}</span></span>
          <MButton size="xs" variant="tonal" @click="seat(p.name, p.size, p.id)">Seat</MButton>
        </div>
      </div>
      <div class="flex items-end gap-2">
        <MNumberField v-model="walkIn" label="Walk-in guests" variant="outlined" :min="1" :max="seats" class="flex-1" />
        <MButton icon="chair" @click="seat(undefined, walkIn ?? 2)">Seat walk-in</MButton>
      </div>
      <MButton v-if="s.status !== 'reserved'" variant="text" icon="event" @click="setAll({ status: 'reserved', reservedFor: 'Phone booking' })">Reserve</MButton>
      <MButton v-else variant="text" icon="event_busy" @click="setAll({ status: 'free' })">Cancel the reservation</MButton>
    </template>

    <div class="flex flex-wrap gap-2 border-t border-outline-variant pt-3">
      <MButton variant="outlined" icon="join" @click="emit('join')">Join tables</MButton>
      <MButton v-if="merged" variant="outlined" icon="call_split" @click="split">Split {{ label }}</MButton>
    </div>
  </div>
</template>
