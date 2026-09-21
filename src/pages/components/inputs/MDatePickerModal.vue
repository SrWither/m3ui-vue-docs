<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MDatePickerModal } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const showDatePicker = ref(false)
const dateModalVal = ref<string | null>(null)

const datePickerModalProps: PropDef[] = [
  { name: 'modelValue', type: 'string | null', description: 'Selected date in YYYY-MM-DD format (v-model)' },
  { name: 'show', type: 'boolean', default: 'false', description: 'Controls dialog visibility (v-model:show)' },
  { name: 'min', type: 'string', description: 'Minimum selectable date (YYYY-MM-DD)' },
  { name: 'max', type: 'string', description: 'Maximum selectable date (YYYY-MM-DD)' },
  { name: 'locale', type: 'string', description: "Locale for month/day names. Falls back to the app's configured locale (createM3UI({ locale })) — same pattern as MRelativeTime" },
  { name: 'title', type: 'string', default: "'Select date'", description: 'Dialog title' },
]

const datePickerModalEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'string | null', description: 'Emitted when a date is confirmed — powers v-model' },
  { name: 'update:show', payload: 'boolean', description: 'Emitted when the dialog opens or closes — powers v-model:show' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MDatePickerModal</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A modal, centered date picker with calendar and keyboard input modes — the sibling of MDatePicker, a fully
      separate component rather than a shared internal (see the component docs' "inline vs. Modal" note).
    </p>

    <ComponentDemo
      title="Date Picker Modal"
      description="Modal date picker with calendar and keyboard input modes. Toggle between calendar view and text input with the edit icon."
      :code="`<template>
  <MButton @click=&quot;show = true&quot;>Pick date</MButton>
  <MDatePickerModal v-model=&quot;date&quot; v-model:show=&quot;show&quot; />
</template>`"
    >
      <div class="flex items-center gap-4">
        <MButton @click="showDatePicker = true">Pick date</MButton>
        <span v-if="dateModalVal" class="text-body-medium text-on-surface-variant">{{ dateModalVal }}</span>
      </div>
      <MDatePickerModal v-model="dateModalVal" v-model:show="showDatePicker" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="datePickerModalProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="datePickerModalEvents" />

    <ComponentPager current="MDatePickerModal" />
  </div>
</template>
