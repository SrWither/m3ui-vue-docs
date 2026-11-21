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
const showBirth = ref(false)
const birthVal = ref<string | null>('1990-05-14')
const todayIso = new Date().toISOString().slice(0, 10)

const datePickerModalProps: PropDef[] = [
  { name: 'modelValue', type: 'string | null', description: 'Selected date in YYYY-MM-DD format (v-model)' },
  { name: 'show', type: 'boolean', default: 'false', description: 'Controls dialog visibility (v-model:show)' },
  { name: 'min', type: 'string', description: 'Minimum selectable date (YYYY-MM-DD)' },
  { name: 'max', type: 'string', description: 'Maximum selectable date (YYYY-MM-DD)' },
  { name: 'locale', type: 'string', description: "Locale for month/day names. Falls back to the app's configured locale (createM3UI({ locale })) — same pattern as MRelativeTime" },
  { name: 'title', type: 'string', default: "'Select date'", description: 'Dialog title' },
  { name: 'yearRange', type: '[number, number]', default: '[1900, 2100]', description: 'First and last year the year grid (opened from the month title) offers; years with no day inside min/max are disabled' },
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
      description="Modal date picker with calendar and keyboard input modes. Toggle between calendar view and text input with the edit icon. Tap the month title to jump to another year."
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

    <ComponentDemo
      title="Year Selection"
      description="The month title (with ▾) opens a grid of years, as in M3: pick one to jump there keeping the month, then choose the day. Arrow keys move through the grid. Here, a birth date: yearRange lists 1920 to 2100 and max (today) disables the years after this one, as Compose does with its selectable dates."
      :code="`<script setup lang=&quot;ts&quot;>
import { ref } from 'vue'

const show = ref(false)
const birth = ref<string | null>('1990-05-14')
// max disables the days, and the years in the grid, after today
const today = new Date().toISOString().slice(0, 10)
</script>

<template>
  <MButton @click=&quot;show = true&quot;>Birth date</MButton>
  <MDatePickerModal
    v-model=&quot;birth&quot;
    v-model:show=&quot;show&quot;
    title=&quot;Birth date&quot;
    :max=&quot;today&quot;
    :year-range=&quot;[1920, 2100]&quot;
  />
</template>`"
    >
      <div class="flex items-center gap-4">
        <MButton @click="showBirth = true">Birth date</MButton>
        <span v-if="birthVal" class="text-body-medium text-on-surface-variant">{{ birthVal }}</span>
      </div>
      <MDatePickerModal v-model="birthVal" v-model:show="showBirth" title="Birth date" :max="todayIso" :year-range="[1920, 2100]" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="datePickerModalProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="datePickerModalEvents" />

    <ComponentPager current="MDatePickerModal" />
  </div>
</template>
