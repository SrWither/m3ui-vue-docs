<script setup lang="ts">
import { ref } from 'vue'
import { MScrollField } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const hour = ref(12)
const minute = ref(30)

const minYear = 2000
const yearIndex = ref(26)

const amount = ref(26)
const unit = ref(0)
const units = ['L', 'oz']

const scrollFieldProps: PropDef[] = [
  { name: 'modelValue', type: 'number', description: 'Index of the selected item, 0 to count - 1 (v-model)' },
  { name: 'count', type: 'number', description: 'Number of items; the wheel wraps around after the last one' },
  { name: 'label', type: 'string', description: 'Accessible name. Include the range when it isn\'t obvious, since the wheel wraps' },
  { name: 'format', type: '(index: number) => string', default: 'two-digit index', description: 'Text for each item, also what screen readers announce' },
  { name: 'height', type: 'number', default: '200', description: 'Height in px; three items fit in the default' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field' },
]

const scrollFieldEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'number', description: 'The centered item\'s index, as it changes while scrolling' },
]

const scrollFieldSlots: SlotDef[] = [
  { name: '#item', description: 'Custom content for each item instead of the formatted text. Receives { index, selected }. Give the field a width when you use it' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MScrollField</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Material 3 Expressive's scroll field: an endless wheel where the centered item is the selected one, shown
      larger and bolder. Drag it, flick it, use the mouse wheel or the arrow keys, or click an item to bring it to
      the center. It wraps around after the last item, so 59 is followed by 00.
    </p>

    <ComponentDemo
      title="Time"
      description="Two fields side by side for hours and minutes."
      :code="`<template>
  <div class=&quot;flex items-center gap-2 rounded-[28px] bg-surface-container-highest p-3&quot;>
    <MScrollField v-model=&quot;hour&quot; :count=&quot;24&quot; :height=&quot;120&quot; label=&quot;Hour&quot; />
    <span class=&quot;text-display-large text-on-surface-variant&quot; aria-hidden=&quot;true&quot;>:</span>
    <MScrollField v-model=&quot;minute&quot; :count=&quot;60&quot; :height=&quot;120&quot; label=&quot;Minute&quot; />
  </div>
</template>`"
      :script="`const hour = ref(12)
const minute = ref(30)`"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="flex items-center gap-2 rounded-[28px] bg-surface-container-highest p-3">
          <MScrollField v-model="hour" :count="24" :height="120" label="Hour" />
          <span class="-mt-1 text-display-large text-on-surface-variant" aria-hidden="true">:</span>
          <MScrollField v-model="minute" :count="60" :height="120" label="Minute" />
        </div>
        <span class="text-body-medium text-on-surface-variant">{{ String(hour).padStart(2, '0') }}:{{ String(minute).padStart(2, '0') }}</span>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Range"
      description="The value is an index; map it to your own range with format. Say the range in label, since the wheel never ends."
      :code="`<template>
  <MScrollField
    v-model=&quot;yearIndex&quot;
    :count=&quot;51&quot;
    :format=&quot;(i) => String(2000 + i)&quot;
    label=&quot;Year, from 2000 to 2050&quot;
  />
</template>`"
      :script="`const yearIndex = ref(26) // 2026`"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="rounded-[28px] bg-surface-container-highest p-3">
          <MScrollField v-model="yearIndex" :count="51" :format="(i: number) => String(minYear + i)" label="Year, from 2000 to 2050" />
        </div>
        <span class="text-body-medium text-on-surface-variant">{{ minYear + yearIndex }}</span>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Amount and Unit"
      description="Any list of options works: here a decimal amount and a unit."
      :code="`<template>
  <div class=&quot;flex items-center gap-2 rounded-[28px] bg-surface-container-highest p-3&quot;>
    <MScrollField v-model=&quot;amount&quot; :count=&quot;100&quot; :height=&quot;160&quot; :format=&quot;(i) => ((i + 1) / 10).toFixed(1)&quot; label=&quot;Amount&quot; />
    <MScrollField v-model=&quot;unit&quot; :count=&quot;2&quot; :height=&quot;160&quot; :format=&quot;(i) => units[i]&quot; label=&quot;Unit&quot; />
  </div>
</template>`"
      :script="`const amount = ref(26) // 2.7
const unit = ref(0)
const units = ['L', 'oz']`"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="flex items-center gap-2 rounded-[28px] bg-surface-container-highest p-3">
          <MScrollField v-model="amount" :count="100" :height="160" :format="(i: number) => ((i + 1) / 10).toFixed(1)" label="Amount" />
          <MScrollField v-model="unit" :count="2" :height="160" :format="(i: number) => units[i]!" label="Unit" />
        </div>
        <span class="text-body-medium text-on-surface-variant">{{ ((amount + 1) / 10).toFixed(1) }} {{ units[unit] }}</span>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="scrollFieldProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="scrollFieldEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="scrollFieldSlots" />

    <ComponentPager current="MScrollField" />
  </div>
</template>
