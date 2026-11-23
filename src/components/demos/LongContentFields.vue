<script setup lang="ts">
// Regression demo: every field with a long value, label and placeholder, in a column as narrow as a phone's
// half (200px) or a whole small phone (360px). Nothing may run over the label, the border or the icons.
import { ref } from 'vue'
import {
  MAutocomplete, MColorPicker, MCreditCardInput, MDatePicker, MDateRangePicker, MEmojiSelector, MIcon,
  MIconButton, MMaskField, MMultiAutocomplete, MMultiSelect, MNumberField, MPhoneInput, MPinInput,
  MSearchBar, MSearchField, MSegmentedButton, MSelect, MSwitch, MTagInput, MTextField, MTimePicker,
} from '@m3ui-vue/m3ui-vue'

const width = ref<string | number>(200)
const variant = ref<string | number>('filled')
const disabled = ref(false)
const error = ref(false)

const LONG = 'No cumple, pendientes y en proceso (P, EP)'
const LABEL = 'Estado de cumplimiento del contrato vigente'
const options = [
  { value: 'nc', label: LONG },
  { value: 'ok', label: 'Cumple' },
  { value: 'p', label: 'Pendiente de revisión por el área de calidad y auditoría externa' },
]

const text = ref('Una descripción bastante más larga que el campo que la contiene')
const multiline = ref(`${LONG}. ${LONG}. ${LONG}.`)
const number = ref<number | null>(123456789012345)
const mask = ref('12345678901234567890')
const phone = ref('+5491155554444')
const pin = ref('123456')
const card = ref({ number: '4242424242424242', name: 'María Fernanda de los Ángeles Rodríguez', expiry: '12/29', cvc: '123' })
const search = ref(LONG)
const searchField = ref(LONG)
const select = ref<string | null>('nc')
const multi = ref(['nc', 'p', 'ok'])
const auto = ref<string | null>('p')
const multiAuto = ref(['nc', 'p'])
const tags = ref([LONG, 'corto', 'Otra etiqueta muy larga que no entra en una línea'])
const color = ref('#6750A4')
const date = ref<string | null>('2026-11-22')
const range = ref({ start: '2026-11-01', end: '2027-02-28' })
const time = ref<string | null>('23:45')
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <MSegmentedButton v-model="width" :options="[{ value: 200, label: '200px' }, { value: 360, label: '360px' }]" />
      <MSegmentedButton v-model="variant" :options="[{ value: 'filled', label: 'Filled' }, { value: 'outlined', label: 'Outlined' }]" />
      <label class="flex items-center gap-2 text-body-medium"><MSwitch v-model="disabled" />Disabled</label>
      <label class="flex items-center gap-2 text-body-medium"><MSwitch v-model="error" />Error</label>
    </div>

    <div class="flex flex-col gap-4 border-x border-dashed border-outline-variant" :style="{ width: `${width}px` }">
      <MTextField v-model="text" :label="LABEL" :variant="(variant as any)" leading-icon="description" clearable :disabled="disabled" :error="error" error-label="Hay un error en este campo con un mensaje largo" hint="Una ayuda larga que también tiene que caber debajo del campo" />
      <MTextField v-model="text" :label="LABEL" :variant="(variant as any)" leading-icon="link" :disabled="disabled" :error="error">
        <template #trailing>
          <MIconButton icon="content_copy" label="Copy" :size="40" />
        </template>
      </MTextField>
      <MTextField :model-value="''" :label="LABEL" :variant="(variant as any)" leading-icon="search" clearable :disabled="disabled" :error="error" />
      <MTextField v-model="multiline" :label="LABEL" :variant="(variant as any)" multiline auto-grow :max-rows="4" clearable :disabled="disabled" :error="error" />
      <MNumberField v-model="number" :label="LABEL" :variant="(variant as any)" leading-icon="tag" stepper :disabled="disabled" :error="error" />
      <MMaskField v-model="mask" :label="LABEL" mask="#### #### #### #### ####" :variant="(variant as any)" leading-icon="pin" clearable :disabled="disabled" :error="error" />
      <MPhoneInput v-model="phone" :label="LABEL" :variant="(variant as any)" :disabled="disabled" :error="error" />
      <MPinInput v-model="pin" :length="6" :label="LABEL" :variant="(variant as any)" :disabled="disabled" :error="error" />
      <MCreditCardInput v-model="card" :preview="false" show-name :variant="(variant as any)" :disabled="disabled" />
      <MSearchBar v-model="search" :placeholder="LABEL" clearable :disabled="disabled" />
      <MSearchField v-model="searchField" :placeholder="LABEL" clearable :disabled="disabled" />

      <MSelect v-model="select" :label="LABEL" :options="options" :variant="(variant as any)" leading-icon="rule" clearable :disabled="disabled" :error="error" />
      <MSelect :model-value="null" :label="LABEL" :options="options" :variant="(variant as any)" leading-icon="rule" clearable :disabled="disabled" :error="error" />
      <MMultiSelect v-model="multi" :label="LABEL" :options="options" :variant="(variant as any)" leading-icon="checklist" clearable :disabled="disabled" :error="error" />
      <MAutocomplete v-model="auto" :label="LABEL" :options="options" :variant="(variant as any)" leading-icon="search" clearable :disabled="disabled" :error="error" />
      <MMultiAutocomplete v-model="multiAuto" :label="LABEL" :options="options" :variant="(variant as any)" leading-icon="search" clearable :disabled="disabled" :error="error" />
      <MTagInput v-model="tags" :label="LABEL" :placeholder="LABEL" :variant="(variant as any)" leading-icon="sell" clearable :disabled="disabled" :error="error" />
      <MColorPicker v-model="color" :label="LABEL" :disabled="disabled" :error="error" />

      <MDatePicker v-model="date" :label="LABEL" :disabled="disabled" :error="error" />
      <MDatePicker :model-value="null" :label="LABEL" :placeholder="LABEL" :disabled="disabled" :error="error" />
      <MDateRangePicker v-model="range" :label="LABEL" :disabled="disabled" :error="error" />
      <MTimePicker v-model="time" :label="LABEL" :disabled="disabled" :error="error" />

      <div class="flex items-center gap-1 text-label-medium text-on-surface-variant"><MIcon name="mood" :size="16" />MEmojiSelector (its search)</div>
      <MEmojiSelector height="200px" />
    </div>
  </div>
</template>
