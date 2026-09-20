<script setup lang="ts">
import { ref } from 'vue'
import { MNumberField } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const numVal = ref<number | null>(25)
const numPrice = ref<number | null>(9.99)
const numDebounce = ref<number | null>(50)
const numDebounceLog = ref('')
function onNumDebounced(v: number | null) { numDebounceLog.value = `@debounced: ${v}` }
const numRequired = ref<number | null>(null)

const numberFieldProps: PropDef[] = [
  { name: 'modelValue', type: 'number | null', description: 'Bound numeric value (v-model)' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Visual style' },
  { name: 'min', type: 'number', description: 'Minimum allowed value' },
  { name: 'max', type: 'number', description: 'Maximum allowed value' },
  { name: 'step', type: 'number', default: '1', description: 'Increment/decrement step' },
  { name: 'error', type: 'boolean', description: 'Error state' },
  { name: 'errorLabel', type: 'string', description: 'Error message shown when error is true' },
  { name: 'hint', type: 'string', description: 'Hint text' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required — adds a red asterisk after the label' },
  { name: 'leadingIcon', type: 'string', description: 'Material Symbol icon' },
  { name: 'stepper', type: 'boolean', default: 'true', description: 'Show +/- buttons' },
  { name: 'fieldBg', type: 'string', description: 'Overrides the auto-detected background color used to cut the floating label out of the outlined border' },
  { name: 'debounce', type: 'number', default: '0', description: 'Delay (ms) before firing the @debounced event' },
]

const numberFieldEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'number | null', description: 'Emitted on every change — typing, stepper clicks, or arrow keys — powers v-model' },
  { name: 'debounced', payload: 'number | null', description: 'Emitted debounce ms after the user stops typing (only when debounce > 0). Stepper clicks/arrow keys still emit instantly' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MNumberField</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A numeric text field with +/- stepper buttons, min/max clamping, and keyboard arrow support.
    </p>

    <ComponentDemo
      title="Number Input"
      description="Numeric input with +/- stepper buttons, min/max clamping, and keyboard arrows."
      :code="`<MNumberField v-model=&quot;quantity&quot; label=&quot;Quantity&quot; :min=&quot;0&quot; :max=&quot;100&quot; />`"
      :script="`import { MNumberField } from '@m3ui-vue/m3ui-vue'

const quantity = ref(25)`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MNumberField v-model="numVal" label="Quantity" :min="0" :max="100" />
        <MNumberField v-model="numPrice" label="Price" :step="0.5" :min="0" leading-icon="attach_money" variant="outlined" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Without Stepper"
      description="Disable the +/- buttons for a plain numeric input."
      :code="`<MNumberField v-model=&quot;val&quot; label=&quot;Amount&quot; :stepper=&quot;false&quot; />`"
      :script="`import { MNumberField } from '@m3ui-vue/m3ui-vue'

const val = ref(25)`"
    >
      <div class="w-full sm:w-64">
        <MNumberField v-model="numVal" label="Amount" :stepper="false" variant="outlined" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Required"
      description="Marks the field as required — adds a red asterisk after the label."
      :code="`<MNumberField v-model=&quot;val&quot; label=&quot;Attendees&quot; :required=&quot;true&quot; :min=&quot;1&quot; />`"
    >
      <div class="w-full sm:w-64">
        <MNumberField v-model="numRequired" label="Attendees" :required="true" :min="1" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Debounce"
      description="Fires @debounced after the user stops typing. Stepper buttons emit instantly."
      :code='`<MNumberField v-model=&quot;qty&quot; label=&quot;Quantity&quot; :debounce=&quot;400&quot; @debounced=&quot;onDebounced&quot; />`'
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MNumberField v-model="numDebounce" label="Quantity (400ms)" :debounce="400" @debounced="onNumDebounced" />
        <div class="flex items-center">
          <p class="text-body-medium text-on-surface-variant">{{ numDebounceLog || 'Type a number — @debounced fires after 400ms' }}</p>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="numberFieldProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="numberFieldEvents" />

    <ComponentPager current="MNumberField" />
  </div>
</template>
