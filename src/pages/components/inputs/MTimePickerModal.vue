<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MTimePickerModal } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const showTimePicker = ref(false)
const timeModalVal = ref<string | null>(null)
const showTimePicker24h = ref(false)
const timeModalVal24h = ref<string | null>(null)

const timePickerModalProps: PropDef[] = [
  { name: 'modelValue', type: 'string | null', description: 'Selected time in HH:MM format (v-model)' },
  { name: 'show', type: 'boolean', default: 'false', description: 'Controls dialog visibility (v-model:show)' },
  { name: 'use24h', type: 'boolean', default: 'false', description: 'Use 24-hour format (shows inner ring 13-23)' },
  { name: 'minuteStep', type: 'number', default: '5', description: 'Minute increment step' },
  { name: 'title', type: 'string', default: "'Select time'", description: 'Dialog title' },
]

const timePickerModalEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'string | null', description: 'Emitted when a time is confirmed — powers v-model' },
  { name: 'update:show', payload: 'boolean', description: 'Emitted when the dialog opens or closes — powers v-model:show' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTimePickerModal</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A modal, centered time picker with a clock dial and a keyboard input mode. Supports AM/PM toggle and 24h
      format — the sibling of MTimePicker, a fully separate component rather than a shared internal.
    </p>

    <ComponentDemo
      title="Time Picker Modal"
      description="Modal time picker with clock dial and keyboard input modes. Supports AM/PM toggle and 24h format."
      :code="`<template>
  <MButton @click=&quot;show = true&quot;>Pick time</MButton>
  <MTimePickerModal v-model=&quot;time&quot; v-model:show=&quot;show&quot; />

  <MButton @click=&quot;show24 = true&quot;>Pick time</MButton>
  <MTimePickerModal v-model=&quot;time24&quot; v-model:show=&quot;show24&quot; use24h />
</template>`"
    >
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-4">
          <MButton @click="showTimePicker = true">Pick time (12h)</MButton>
          <span v-if="timeModalVal" class="text-body-medium text-on-surface-variant">{{ timeModalVal }}</span>
        </div>
        <div class="flex items-center gap-4">
          <MButton @click="showTimePicker24h = true">Pick time (24h)</MButton>
          <span v-if="timeModalVal24h" class="text-body-medium text-on-surface-variant">{{ timeModalVal24h }}</span>
        </div>
      </div>
      <MTimePickerModal v-model="timeModalVal" v-model:show="showTimePicker" />
      <MTimePickerModal v-model="timeModalVal24h" v-model:show="showTimePicker24h" use24h />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="timePickerModalProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="timePickerModalEvents" />

    <ComponentPager current="MTimePickerModal" />
  </div>
</template>
