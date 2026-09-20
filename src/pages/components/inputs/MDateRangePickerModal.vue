<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MDateRangePickerModal } from '@m3ui-vue/m3ui-vue'
import type { DateRange } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const showDateRangePicker = ref(false)
const dateRangeModalVal = ref<DateRange>({ start: null, end: null })

const dateRangePickerModalProps: PropDef[] = [
  { name: 'modelValue', type: 'DateRange', description: 'Selected date range (v-model) — see the DateRange type on the MDateRangePicker page' },
  { name: 'show', type: 'boolean', default: 'false', description: 'Controls dialog visibility (v-model:show)' },
  { name: 'min', type: 'string', description: 'Minimum selectable date (YYYY-MM-DD)' },
  { name: 'max', type: 'string', description: 'Maximum selectable date (YYYY-MM-DD)' },
  { name: 'locale', type: 'string', default: "'es-ES'", description: 'Locale for month/day names' },
  { name: 'title', type: 'string', default: "'Select range'", description: 'Dialog title' },
]

const dateRangePickerModalEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'DateRange', description: 'Emitted when the end date is confirmed — powers v-model' },
  { name: 'update:show', payload: 'boolean', description: 'Emitted when the dialog opens or closes — powers v-model:show' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MDateRangePickerModal</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A modal, centered date range picker with range highlighting — the sibling of MDateRangePicker, a fully
      separate component rather than a shared internal.
    </p>

    <ComponentDemo
      title="Date Range Picker Modal"
      description="Modal date range picker. Select start and end dates within a dialog with range highlighting."
      :code="`<template>
  <MButton @click=&quot;show = true&quot;>Pick range</MButton>
  <MDateRangePickerModal v-model=&quot;range&quot; v-model:show=&quot;show&quot; />
</template>`"
    >
      <div class="flex items-center gap-4">
        <MButton @click="showDateRangePicker = true">Pick range</MButton>
        <span v-if="dateRangeModalVal.start" class="text-body-medium text-on-surface-variant">
          {{ dateRangeModalVal.start }} → {{ dateRangeModalVal.end ?? '...' }}
        </span>
      </div>
      <MDateRangePickerModal v-model="dateRangeModalVal" v-model:show="showDateRangePicker" locale="en-US" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="dateRangePickerModalProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="dateRangePickerModalEvents" />

    <ComponentPager current="MDateRangePickerModal" />
  </div>
</template>
