<script setup lang="ts">
import { ref } from 'vue'
import { MMaskField } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const maskCard = ref('')
const maskPhone = ref('')
const maskDate = ref('')
const maskCustom = ref('')
const maskDoc = ref('')
const maskDebounce = ref('')
const maskDebounceLog = ref('')
function onMaskDebounced(v: string) { maskDebounceLog.value = `@debounced: "${v}"` }

const maskFieldProps: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'Masked value (v-model)' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'mask', type: 'string | MaskPreset', description: "Mask pattern (# = digit) or a built-in preset name (see the type below)" },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Visual style' },
  { name: 'error', type: 'boolean', description: 'Error state' },
  { name: 'errorLabel', type: 'string', description: 'Error message shown when error is true' },
  { name: 'hint', type: 'string', description: 'Hint text' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required — adds a red asterisk after the label' },
  { name: 'leadingIcon', type: 'string', description: 'Material Symbol icon' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show clear button' },
  { name: 'fieldBg', type: 'string', description: 'Overrides the auto-detected background color used to cut the floating label out of the outlined border' },
  { name: 'debounce', type: 'number', default: '0', description: 'Delay (ms) before firing the @debounced event' },
]

const maskFieldEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'string', description: 'Emitted on every keystroke — powers v-model' },
  { name: 'debounced', payload: 'string', description: 'Emitted debounce ms after the user stops typing (only when debounce > 0)' },
]

const maskFieldTypes: TypeDef[] = [
  {
    name: 'MaskPreset',
    description: "Built-in patterns accepted by the mask prop — pass any other string to define a custom pattern",
    fields: [
      { name: "'credit-card'", type: '#### #### #### ####', description: '16-digit card number' },
      { name: "'phone'", type: '(###) ###-####', description: 'US-style phone number' },
      { name: "'date'", type: '##/##/####', description: 'MM/DD/YYYY' },
      { name: "'time'", type: '##:##', description: 'HH:MM' },
      { name: "'cpf'", type: '###.###.###-##', description: 'Brazilian CPF document number' },
      { name: "'cnpj'", type: '##.###.###/####-##', description: 'Brazilian CNPJ document number' },
      { name: "'zip'", type: '#####-####', description: 'US ZIP+4 postal code' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMaskField</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A text field with a formatting mask — built-in presets or a custom pattern where <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">#</code> stands for a digit.
    </p>

    <ComponentDemo
      title="Masked Inputs"
      description="Input with formatting masks. Use presets like 'credit-card', 'phone', 'date', or custom patterns where # = digit."
      :code="`<MMaskField v-model=&quot;card&quot; label=&quot;Card Number&quot; mask=&quot;credit-card&quot; leading-icon=&quot;credit_card&quot; />
<MMaskField v-model=&quot;phone&quot; label=&quot;Phone&quot; mask=&quot;phone&quot; leading-icon=&quot;phone&quot; />
<MMaskField v-model=&quot;date&quot; label=&quot;Date&quot; mask=&quot;date&quot; leading-icon=&quot;calendar_today&quot; />
<MMaskField v-model=&quot;custom&quot; label=&quot;Custom&quot; mask=&quot;##-###-####&quot; />`"
      :script="`import { MMaskField } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MMaskField v-model="maskCard" label="Card Number" mask="credit-card" leading-icon="credit_card" :clearable="true" />
        <MMaskField v-model="maskPhone" label="Phone" mask="phone" leading-icon="phone" :clearable="true" variant="outlined" />
        <MMaskField v-model="maskDate" label="Birthday" mask="date" leading-icon="calendar_today" hint="MM/DD/YYYY" />
        <MMaskField v-model="maskCustom" label="Custom Code" mask="##-###-####" variant="outlined" hint="Pattern: ##-###-####" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="CPF/CNPJ presets"
      description="Two additional presets for Brazilian document numbers."
      :code="`<MMaskField v-model=&quot;doc&quot; label=&quot;CPF&quot; mask=&quot;cpf&quot; />`"
    >
      <div class="w-full sm:w-64">
        <MMaskField v-model="maskDoc" label="CPF" mask="cpf" variant="outlined" hint="Pattern: ###.###.###-##" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Debounce"
      description="Debounce the masked value. Useful for validating card numbers or phone lookups."
      :code='`<MMaskField v-model=&quot;phone&quot; label=&quot;Phone&quot; mask=&quot;phone&quot; :debounce=&quot;500&quot; @debounced=&quot;validatePhone&quot; />`'
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MMaskField v-model="maskDebounce" label="Phone (500ms)" mask="phone" leading-icon="phone" :debounce="500" @debounced="onMaskDebounced" />
        <div class="flex items-center">
          <p class="text-body-medium text-on-surface-variant">{{ maskDebounceLog || 'Type a phone number — @debounced fires after 500ms' }}</p>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="maskFieldProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="maskFieldEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="maskFieldTypes" />

    <ComponentPager current="MMaskField" />
  </div>
</template>
