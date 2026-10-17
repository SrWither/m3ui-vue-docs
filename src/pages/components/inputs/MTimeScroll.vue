<script setup lang="ts">
import { ref } from 'vue'
import { MCard, MTimeScroll } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const time = ref('09:30')
const time24 = ref('18:45')
const stepped = ref('14:15')

const props: PropDef[] = [
  { name: 'modelValue', type: 'string | null', description: 'Selected time in HH:MM, 24-hour (v-model); null shows 12:00 AM (00:00 in 24-hour mode)' },
  { name: 'use24h', type: 'boolean', default: 'false', description: '24-hour wheel (00–23) instead of 1–12 with AM/PM' },
  { name: 'minuteStep', type: 'number', default: '1', description: 'Minute increment; the minute wheel shows only multiples of it' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the wheels and the AM/PM toggle' },
]
const events: EventDef[] = [
  { name: 'update:modelValue', payload: 'string', description: 'The time as HH:MM (24-hour), whenever a wheel or AM/PM changes' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTimeScroll</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Material 3 Expressive's scrolling time picker: an hour wheel and a minute wheel side by side, plus an AM/PM
      toggle in 12-hour mode. Drag, flick, use the mouse wheel or the arrow keys. It updates as the wheels turn,
      so put it in a dialog or a form for the confirm step.
    </p>

    <ComponentDemo
      title="12-hour"
      description="The value is always 24-hour HH:MM, whatever the wheels show. AM and PM come in the app's language."
      :code="`<MTimeScroll v-model=&quot;time&quot; />`"
      :script="`import { ref } from 'vue'

const time = ref('09:30')`"
    >
      <MCard variant="filled" class="flex flex-col items-center gap-4 p-6">
        <MTimeScroll v-model="time" />
        <p class="text-body-medium text-on-surface-variant">Value: <strong class="text-on-surface">{{ time }}</strong></p>
      </MCard>
    </ComponentDemo>

    <ComponentDemo
      title="24-hour"
      description="use24h shows 00–23 and drops the AM/PM toggle."
      :code="`<MTimeScroll v-model=&quot;time&quot; use24h />`"
    >
      <div class="flex flex-col items-center gap-4">
        <MTimeScroll v-model="time24" use24h />
        <p class="text-body-medium text-on-surface-variant">Value: <strong class="text-on-surface">{{ time24 }}</strong></p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Minute step"
      description="minuteStep keeps the minute wheel to multiples of it, e.g. quarter hours for a booking."
      :code="`<MTimeScroll v-model=&quot;time&quot; :minute-step=&quot;15&quot; />`"
    >
      <div class="flex flex-col items-center gap-4">
        <MTimeScroll v-model="stepped" :minute-step="15" />
        <p class="text-body-medium text-on-surface-variant">Value: <strong class="text-on-surface">{{ stepped }}</strong></p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <ComponentPager current="MTimeScroll" />
  </div>
</template>
