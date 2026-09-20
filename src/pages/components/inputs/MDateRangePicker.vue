<script setup lang="ts">
import { ref } from 'vue'
import { MDateRangePicker } from '@m3ui-vue/m3ui-vue'
import type { DateRange } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const dateRange = ref<DateRange>({ start: null, end: null })

const dateRangeProps: PropDef[] = [
  { name: 'modelValue', type: 'DateRange', description: 'Selected date range (v-model) — see the type below' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'placeholder', type: 'string', description: "Placeholder shown when no range is selected — falls back to label, then the current locale's string" },
  { name: 'min', type: 'string', description: 'Minimum date (YYYY-MM-DD)' },
  { name: 'max', type: 'string', description: 'Maximum date (YYYY-MM-DD)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the picker' },
  { name: 'error', type: 'boolean', description: 'Error state' },
  { name: 'errorLabel', type: 'string', description: 'Error message shown when error is true' },
  { name: 'hint', type: 'string', description: 'Hint text below the field' },
  { name: 'locale', type: 'string', default: "'es-ES'", description: 'Locale for month/day names' },
  { name: 'fieldBg', type: 'string', description: 'Overrides the auto-detected background color used to cut the floating label out of the border' },
  { name: 'prevMonthLabel', type: 'string', description: "Aria label for the previous-month button — defaults to the current locale's string" },
  { name: 'nextMonthLabel', type: 'string', description: "Aria label for the next-month button — defaults to the current locale's string" },
  { name: 'pickStartText', type: 'string', description: "Header text shown while picking the start date — defaults to the current locale's string" },
  { name: 'pickEndText', type: 'string', description: "Header text shown while picking the end date — defaults to the current locale's string" },
]

const dateRangeTypes: TypeDef[] = [
  {
    name: 'DateRange',
    description: 'Also used by MDateRangePickerModal',
    fields: [
      { name: 'start', type: 'string | null', required: true, description: 'Start date in YYYY-MM-DD format, or null if unset' },
      { name: 'end', type: 'string | null', required: true, description: 'End date in YYYY-MM-DD format, or null if unset' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MDateRangePicker</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      An inline, dropdown-anchored calendar for selecting a start and end date, with range highlighting.
    </p>

    <ComponentDemo
      title="Date Range"
      description="Select a start and end date."
      :code="`<template>
  <MDateRangePicker v-model=&quot;range&quot; label=&quot;Period&quot; />
</template>`"
    >
      <div class="w-full max-w-sm">
        <MDateRangePicker v-model="dateRange" label="Period" locale="en-US" />
      </div>
      <p v-if="dateRange.start" class="mt-2 text-body-medium text-on-surface-variant">
        {{ dateRange.start }} — {{ dateRange.end ?? '...' }}
      </p>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="dateRangeProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="dateRangeTypes" />

    <ComponentPager current="MDateRangePicker" />
  </div>
</template>
