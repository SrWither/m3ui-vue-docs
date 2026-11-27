<script setup lang="ts">
import { computed, ref } from 'vue'
import { MTimezoneSelect } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const zone = ref<string | null>(null)
const meeting = ref<string | null>('Europe/Madrid')
const localTime = computed(() =>
  zone.value ? new Intl.DateTimeFormat(undefined, { timeZone: zone.value, dateStyle: 'full', timeStyle: 'short' }).format(new Date()) : '')

const selectProps: PropDef[] = [
  { name: 'modelValue', type: 'string | null', default: 'null', description: 'The IANA time zone name (v-model): \'America/Argentina/Buenos_Aires\'.' },
  { name: 'detect', type: 'boolean', default: 'false', description: 'Start on the user\'s own zone when the v-model is empty.' },
  { name: 'only', type: 'string[]', description: 'Only these zones, instead of every one the browser knows.' },
  { name: 'label', type: 'string', description: 'The locale\'s "Time zone" by default.' },
  { name: 'mode', type: "'docked' | 'modal'", default: "'docked'", description: 'A dropdown, or a dialog with search (phones).' },
  { name: 'variant / clearable / hint / error (boolean | string) / errorLabel / required / disabled', type: '…', description: 'As on MAutocomplete.' },
  { name: 'rules / validateOn / validateDebounce / name', type: '…', description: 'Validation, as on MTextField (see MForm).' },
]
const selectEvents: EventDef[] = [{ name: 'update:modelValue', payload: 'string | null', description: 'A zone was picked (its IANA name), or cleared.' }]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTimezoneSelect</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A time zone picker: every IANA zone the browser knows, labelled with its UTC offset and city ("UTC−03:00 ·
      Buenos Aires"), sorted by offset and searchable by city, region or offset (type −03 or Tokyo). The v-model is the
      IANA name, ready for Intl or your server. Offsets are today's, so they move with daylight saving. Built on
      <RouterLink to="/components/inputs/mautocomplete" class="text-primary underline">MAutocomplete</RouterLink>.
    </p>

    <ComponentDemo
      title="Your zone, and what time it is there"
      description="detect starts the first one on this browser's zone; the line below formats now in whichever zone is picked. The second is a plain one, with a hint."
      :code="`<MTimezoneSelect v-model=&quot;zone&quot; detect clearable />
<MTimezoneSelect v-model=&quot;meeting&quot; label=&quot;Meeting time zone&quot; variant=&quot;outlined&quot; hint=&quot;Invitations show it in everyone's own time&quot; />`"
      :script="`import { MTimezoneSelect } from '@m3ui-vue/m3ui-vue'

const zone = ref(null)
// Now, there
const localTime = computed(() => zone.value && new Intl.DateTimeFormat(undefined, { timeZone: zone.value, dateStyle: 'full', timeStyle: 'short' }).format(new Date()))`"
    >
      <div class="flex w-full max-w-sm flex-col gap-4">
        <MTimezoneSelect v-model="zone" detect clearable />
        <p v-if="localTime" class="text-body-medium text-on-surface-variant">Now there: {{ localTime }}</p>
        <MTimezoneSelect v-model="meeting" label="Meeting time zone" variant="outlined" hint="Invitations show it in everyone's own time" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="selectProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="selectEvents" />

    <ComponentPager current="MTimezoneSelect" />
  </div>
</template>
