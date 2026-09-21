<script setup lang="ts">
import { ref } from 'vue'
import { MDatePicker } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const dateVal = ref<string | null>(null)
const dateMinMax = ref<string | null>(null)

const datePickerProps: PropDef[] = [
  { name: 'modelValue', type: 'string | null', description: 'Selected date (YYYY-MM-DD, v-model)' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'placeholder', type: 'string', description: "Placeholder shown when no date is selected — falls back to label, then the current locale's string" },
  { name: 'min', type: 'string', description: 'Minimum selectable date (YYYY-MM-DD)' },
  { name: 'max', type: 'string', description: 'Maximum selectable date (YYYY-MM-DD)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the picker' },
  { name: 'error', type: 'boolean', description: 'Error state' },
  { name: 'errorLabel', type: 'string', description: 'Error message shown when error is true' },
  { name: 'hint', type: 'string', description: 'Hint text below the field' },
  { name: 'locale', type: 'string', description: "Locale for month/day names. Falls back to the app's configured locale (createM3UI({ locale })) — same pattern as MRelativeTime" },
  { name: 'fieldBg', type: 'string', description: 'Overrides the auto-detected background color used to cut the floating label out of the border' },
  { name: 'prevMonthLabel', type: 'string', description: "Aria label for the previous-month button — defaults to the current locale's string" },
  { name: 'nextMonthLabel', type: 'string', description: "Aria label for the next-month button — defaults to the current locale's string" },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MDatePicker</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      An inline, dropdown-anchored calendar date picker with locale support and min/max range clamping.
    </p>

    <ComponentDemo
      title="Date Picker"
      description="Calendar-based date selection. Month/day names follow the app's configured locale by default (left), or pass locale to override it independently (right)."
      :code="`<template>
  <MDatePicker v-model=&quot;date&quot; label=&quot;Birthday&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MDatePicker v-model="dateVal" label="Date" />
        <MDatePicker v-model="dateVal" label="Date (en)" locale="en-US" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Min/Max range"
      description="Dates outside min/max are shown disabled in the calendar grid."
      :code="`<MDatePicker v-model=&quot;date&quot; label=&quot;Appointment&quot; min=&quot;2026-01-01&quot; max=&quot;2026-12-31&quot; />`"
    >
      <div class="w-full sm:w-80">
        <MDatePicker v-model="dateMinMax" label="Appointment" min="2026-01-01" max="2026-12-31" hint="Only 2026 dates are selectable" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="datePickerProps" />

    <ComponentPager current="MDatePicker" />
  </div>
</template>
