<script setup lang="ts">
import { ref } from 'vue'
import { MTimePicker } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const timeVal = ref<string | null>(null)
const timeStep = ref<string | null>(null)

const timePickerProps: PropDef[] = [
  { name: 'modelValue', type: 'string | null', description: 'Selected time (HH:MM, v-model)' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'placeholder', type: 'string', description: "Placeholder shown when no time is selected — falls back to label, then the current locale's string" },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the picker' },
  { name: 'error', type: 'boolean', description: 'Error state' },
  { name: 'errorLabel', type: 'string', description: 'Error message shown when error is true' },
  { name: 'hint', type: 'string', description: 'Hint text below the field' },
  { name: 'minuteStep', type: 'number', default: '5', description: 'Minute increment step' },
  { name: 'use24h', type: 'boolean', default: 'true', description: 'Use 24-hour format' },
  { name: 'fieldBg', type: 'string', description: 'Overrides the auto-detected background color used to cut the floating label out of the border' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTimePicker</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      An inline, dropdown-anchored hour/minute picker with 12h/24h format support.
    </p>

    <ComponentDemo
      title="Time Picker"
      description="Hour and minute selection with 12/24h format."
      :code="`<template>
  <MTimePicker v-model=&quot;time&quot; label=&quot;Time&quot; />
  <MTimePicker v-model=&quot;time&quot; label=&quot;12h&quot; :use24h=&quot;false&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MTimePicker v-model="timeVal" label="Time (24h)" />
        <MTimePicker v-model="timeVal" label="Time (12h)" :use24h="false" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Minute step"
      description="minuteStep controls the increment offered when picking minutes."
      :code="`<MTimePicker v-model=&quot;time&quot; label=&quot;Appointment&quot; :minute-step=&quot;15&quot; />`"
    >
      <div class="w-full sm:w-64">
        <MTimePicker v-model="timeStep" label="Appointment" :minute-step="15" hint="15-minute increments" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="timePickerProps" />

    <ComponentPager current="MTimePicker" />
  </div>
</template>
