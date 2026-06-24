<script setup lang="ts">
import { ref } from 'vue'
import {
  MTextField, MSelect, MMultiSelect, MAutocomplete, MMultiAutocomplete, MTagInput,
  MCheckbox, MSwitch, MRadioGroup, MSlider, MRating,
  MDatePicker, MDatePickerModal, MDateRangePicker, MDateRangePickerModal,
  MTimePicker, MTimePickerModal, MColorPicker, MColorPickerModal, MButton,
  MNumberField, MMaskField,
} from '@m3ui-vue/m3ui-vue'
import type { DateRange } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const textFilled = ref('')
const textOutlined = ref('')
const textPassword = ref('')
const textMultiline = ref('')
const textError = ref('bad value')
const textClearable = ref('Hello world')

const selectClearable = ref<unknown>('a')
const multiClearable = ref<unknown[]>(['vue', 'svelte'])
const multiHideVal = ref<unknown[]>([])

const autoVal = ref<unknown>(null)
const autoOptions = [
  { label: 'Argentina', value: 'ar' },
  { label: 'Australia', value: 'au' },
  { label: 'Brazil', value: 'br' },
  { label: 'Canada', value: 'ca' },
  { label: 'France', value: 'fr' },
  { label: 'Germany', value: 'de' },
  { label: 'Japan', value: 'jp' },
  { label: 'Mexico', value: 'mx' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'United States', value: 'us' },
]

const multiAutoVal = ref<unknown[]>([])
const multiAutoHideVal = ref<unknown[]>([])

const tags = ref<string[]>(['Vue', 'TypeScript'])

const numVal = ref<number | null>(25)
const numPrice = ref<number | null>(9.99)

const maskCard = ref('')
const maskPhone = ref('')
const maskDate = ref('')
const maskCustom = ref('')

const selectVal = ref<unknown>(null)
const selectOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
  { label: 'Disabled', value: 'd', disabled: true },
]

const multiVal = ref<unknown[]>([])
const multiOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
  { label: 'Solid', value: 'solid' },
]

const objectSelectVal = ref<unknown>(null)
const objectOptions = [
  { label: 'United States', value: { code: 'US', region: 'Americas' } },
  { label: 'Germany', value: { code: 'DE', region: 'Europe' } },
  { label: 'Japan', value: { code: 'JP', region: 'Asia' } },
  { label: 'Brazil', value: { code: 'BR', region: 'Americas' } },
]

const multiObjectVal = ref<unknown[]>([])
const multiObjectOptions = [
  { label: 'Read', value: { id: 1, scope: 'read' } },
  { label: 'Write', value: { id: 2, scope: 'write' } },
  { label: 'Delete', value: { id: 3, scope: 'delete' } },
  { label: 'Admin', value: { id: 4, scope: 'admin' } },
]

const checked = ref(false)
const indeterminate = ref(true)
const switchVal = ref(true)

const radioVal = ref('a')
const radioOptions = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
]

const sliderVal = ref(40)
const sliderCentered = ref(0)
const sliderRange = ref<[number, number]>([20, 70])
const musicVolume = ref(65)
const musicBass = ref(10)
const musicTreble = ref(-5)
const eqLow = ref(50)
const eqMid = ref(70)
const eqHigh = ref(40)
const vertCentered = ref(0)
const vertRange = ref<[number, number]>([30, 75])
const ratingVal = ref(3.5)

const dateVal = ref<string | null>(null)
const dateRange = ref<DateRange>({ start: null, end: null })
const timeVal = ref<string | null>(null)
const showTimePicker = ref(false)
const timeModalVal = ref<string | null>(null)
const showDatePicker = ref(false)
const dateModalVal = ref<string | null>(null)
const showDateRangePicker = ref(false)
const dateRangeModalVal = ref<DateRange>({ start: null, end: null })
const colorVal = ref('#6750a4')
const showColorPicker = ref(false)
const colorModalVal = ref('#6750a4')

const textFieldProps: PropDef[] = [
  { name: 'modelValue', type: 'string | number', description: 'Bound value' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'type', type: 'string', default: "'text'", description: 'HTML input type' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Visual style' },
  { name: 'error', type: 'string', description: 'Error message — shows below the field' },
  { name: 'hint', type: 'string', description: 'Hint text shown below the field' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required' },
  { name: 'multiline', type: 'boolean', default: 'false', description: 'Renders a textarea' },
  { name: 'rows', type: 'number', default: '3', description: 'Textarea rows (when multiline)' },
  { name: 'leadingIcon', type: 'string', description: 'Material Symbol shown before the input' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show a clear button when the field has a value' },
]

const numberFieldProps: PropDef[] = [
  { name: 'modelValue', type: 'number | null', description: 'Bound numeric value' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Visual style' },
  { name: 'min', type: 'number', description: 'Minimum allowed value' },
  { name: 'max', type: 'number', description: 'Maximum allowed value' },
  { name: 'step', type: 'number', default: '1', description: 'Increment/decrement step' },
  { name: 'stepper', type: 'boolean', default: 'true', description: 'Show +/- buttons' },
  { name: 'leadingIcon', type: 'string', description: 'Material Symbol icon' },
  { name: 'error', type: 'string', description: 'Error message' },
  { name: 'hint', type: 'string', description: 'Hint text' },
]

const maskFieldProps: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'Masked value (v-model)' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'mask', type: 'string | MaskPreset', description: "Mask pattern (# = digit) or preset: 'credit-card', 'phone', 'date', 'time', 'zip'" },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Visual style' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show clear button' },
  { name: 'leadingIcon', type: 'string', description: 'Material Symbol icon' },
  { name: 'error', type: 'string', description: 'Error message' },
  { name: 'hint', type: 'string', description: 'Hint text' },
]

const selectProps: PropDef[] = [
  { name: 'modelValue', type: 'unknown', description: 'Selected value (any type)' },
  { name: 'options', type: 'SelectOption[]', description: '{ label: string, value: unknown, disabled?: boolean }' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'placeholder', type: 'string', description: 'Placeholder when no value selected' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Visual style' },
  { name: 'mode', type: "'docked' | 'modal'", default: "'docked'", description: 'Dropdown mode: docked (inline) or modal (dialog)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the select' },
  { name: 'error', type: 'string', description: 'Error message' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show a clear button to reset the selection' },
]

const multiSelectProps: PropDef[] = [
  { name: 'modelValue', type: 'unknown[]', description: 'Selected values (any type)' },
  { name: 'options', type: 'MultiSelectOption[]', description: '{ label: string, value: unknown, disabled?: boolean }' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Visual style' },
  { name: 'mode', type: "'docked' | 'modal'", default: "'docked'", description: 'Dropdown mode: docked (inline) or modal (dialog)' },
  { name: 'searchable', type: 'boolean', default: 'true', description: 'Show search in dropdown' },
  { name: 'maxChips', type: 'number', default: '3', description: 'Max visible chips before "+N"' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show a clear button to reset all selections' },
  { name: 'searchPlaceholder', type: 'string', default: "'Search...'", description: 'Placeholder for search input in dropdown' },
  { name: 'noResultsText', type: 'string', default: "'No results'", description: 'Text when no options match search' },
  { name: 'hideSelected', type: 'boolean', default: 'false', description: 'Remove already-selected options from the dropdown' },
]

const autocompleteProps: PropDef[] = [
  { name: 'modelValue', type: 'unknown', description: 'Selected value (v-model)' },
  { name: 'options', type: 'SelectOption[]', description: 'Array of { label, value, disabled? }' },
  { name: 'label', type: 'string', description: 'Floating label text' },
  { name: 'placeholder', type: 'string', description: 'Input placeholder' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Field style' },
  { name: 'mode', type: "'docked' | 'modal'", default: "'docked'", description: 'Dropdown mode: docked (inline) or modal (dialog)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field' },
  { name: 'error', type: 'string', description: 'Error message' },
  { name: 'hint', type: 'string', description: 'Helper text below field' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show a clear button' },
  { name: 'leadingIcon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'noResultsText', type: 'string', default: "'No results'", description: 'Text when no options match' },
]

const multiAutocompleteProps: PropDef[] = [
  { name: 'modelValue', type: 'unknown[]', description: 'Selected values (v-model)' },
  { name: 'options', type: 'MultiSelectOption[]', description: 'Array of { label, value, disabled? }' },
  { name: 'label', type: 'string', description: 'Floating label text' },
  { name: 'placeholder', type: 'string', description: 'Input placeholder' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Field style' },
  { name: 'mode', type: "'docked' | 'modal'", default: "'docked'", description: 'Dropdown mode: docked (inline) or modal (dialog)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field' },
  { name: 'error', type: 'string', description: 'Error message' },
  { name: 'hint', type: 'string', description: 'Helper text below field' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show a clear-all button' },
  { name: 'leadingIcon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'maxChips', type: 'number', default: '3', description: 'Max visible chips before "+N"' },
  { name: 'noResultsText', type: 'string', default: "'No results'", description: 'Text when no options match' },
  { name: 'hideSelected', type: 'boolean', default: 'false', description: 'Remove already-selected options from the dropdown' },
]

const tagInputProps: PropDef[] = [
  { name: 'modelValue', type: 'string[]', description: 'Array of tags (v-model)' },
  { name: 'label', type: 'string', description: 'Floating label text' },
  { name: 'placeholder', type: 'string', description: 'Input placeholder' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Field style' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field' },
  { name: 'error', type: 'string', description: 'Error message' },
  { name: 'hint', type: 'string', description: 'Helper text below field' },
  { name: 'maxTags', type: 'number', description: 'Max number of tags allowed' },
  { name: 'duplicates', type: 'boolean', default: 'false', description: 'Allow duplicate tags' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show a clear-all button' },
  { name: 'leadingIcon', type: 'string', description: 'Material Symbol icon name' },
]

const checkboxProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Checked state' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Indeterminate state' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the checkbox' },
  { name: 'label', type: 'string', description: 'Label text' },
]

const switchProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Toggle state' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the switch' },
  { name: 'label', type: 'string', description: 'Label text' },
]

const radioGroupProps: PropDef[] = [
  { name: 'modelValue', type: 'unknown', description: 'Selected value' },
  { name: 'options', type: '{ label, value, disabled? }[]', description: 'Radio options' },
  { name: 'label', type: 'string', description: 'Group label' },
  { name: 'direction', type: "'column' | 'row'", default: "'column'", description: 'Layout direction' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all radios' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error'", default: "'primary'", description: 'Radio color' },
]

const sliderProps: PropDef[] = [
  { name: 'modelValue', type: 'number', description: 'Current value' },
  { name: 'min', type: 'number', default: '0', description: 'Minimum value' },
  { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
  { name: 'step', type: 'number', default: '1', description: 'Step increment' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the slider' },
  { name: 'label', type: 'string', description: 'Label text' },
  { name: 'showValue', type: 'boolean', default: 'false', description: 'Show current value beside label' },
  { name: 'showTooltip', type: 'boolean', default: 'false', description: 'Show value tooltip while dragging' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Slider orientation' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'xs'", description: 'Track and thumb size' },
  { name: 'variant', type: "'standard' | 'centered' | 'range'", default: "'standard'", description: 'Standard, centered (from middle), or range (two thumbs)' },
  { name: 'stops', type: 'boolean', default: 'false', description: 'Show stop dots at each step (max 30 visible)' },
  { name: 'icon', type: 'string', description: 'Material Symbol icon shown before the slider' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error'", default: "'primary'", description: 'Track color' },
]

const ratingProps: PropDef[] = [
  { name: 'modelValue', type: 'number', description: 'Current rating' },
  { name: 'max', type: 'number', default: '5', description: 'Maximum stars' },
  { name: 'size', type: 'number', default: '28', description: 'Star size in px' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Read-only mode' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'icon', type: 'string', default: "'star'", description: 'Material Symbol icon' },
  { name: 'halfIncrements', type: 'boolean', default: 'false', description: 'Allow half-star values' },
  { name: 'color', type: 'string', default: "'primary'", description: 'Star color' },
]

const datePickerProps: PropDef[] = [
  { name: 'modelValue', type: 'string | null', description: 'Selected date (YYYY-MM-DD)' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'min', type: 'string', description: 'Minimum date (YYYY-MM-DD)' },
  { name: 'max', type: 'string', description: 'Maximum date (YYYY-MM-DD)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the picker' },
  { name: 'error', type: 'string', description: 'Error message' },
  { name: 'locale', type: 'string', default: "'es-ES'", description: 'Locale for month/day names' },
  { name: 'placeholder', type: 'string', default: "'Select date'", description: 'Placeholder when no date selected' },
  { name: 'prevMonthLabel', type: 'string', default: "'Previous month'", description: 'Aria label for previous month button' },
  { name: 'nextMonthLabel', type: 'string', default: "'Next month'", description: 'Aria label for next month button' },
]

const datePickerModalProps: PropDef[] = [
  { name: 'modelValue', type: 'string | null', description: 'Selected date in YYYY-MM-DD format (v-model)' },
  { name: 'show', type: 'boolean', default: 'false', description: 'Controls dialog visibility (v-model:show)' },
  { name: 'min', type: 'string', description: 'Minimum selectable date (YYYY-MM-DD)' },
  { name: 'max', type: 'string', description: 'Maximum selectable date (YYYY-MM-DD)' },
  { name: 'locale', type: 'string', default: "'es-ES'", description: 'Locale for month/day names' },
  { name: 'title', type: 'string', default: "'Select date'", description: 'Dialog title' },
]

const dateRangeProps: PropDef[] = [
  { name: 'modelValue', type: '{ start: string | null, end: string | null }', description: 'Selected date range' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'min', type: 'string', description: 'Minimum date' },
  { name: 'max', type: 'string', description: 'Maximum date' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the picker' },
  { name: 'locale', type: 'string', default: "'es-ES'", description: 'Locale for month/day names' },
  { name: 'placeholder', type: 'string', default: "'Select range'", description: 'Placeholder when no range selected' },
  { name: 'prevMonthLabel', type: 'string', default: "'Previous'", description: 'Aria label for previous month button' },
  { name: 'nextMonthLabel', type: 'string', default: "'Next'", description: 'Aria label for next month button' },
  { name: 'pickStartText', type: 'string', default: "'Select start'", description: 'Text shown when picking start date' },
  { name: 'pickEndText', type: 'string', default: "'Select end'", description: 'Text shown when picking end date' },
]

const dateRangePickerModalProps: PropDef[] = [
  { name: 'modelValue', type: '{ start: string | null, end: string | null }', description: 'Selected date range (v-model)' },
  { name: 'show', type: 'boolean', default: 'false', description: 'Controls dialog visibility (v-model:show)' },
  { name: 'min', type: 'string', description: 'Minimum selectable date (YYYY-MM-DD)' },
  { name: 'max', type: 'string', description: 'Maximum selectable date (YYYY-MM-DD)' },
  { name: 'locale', type: 'string', default: "'es-ES'", description: 'Locale for month/day names' },
  { name: 'title', type: 'string', default: "'Select range'", description: 'Dialog title' },
]

const timePickerProps: PropDef[] = [
  { name: 'modelValue', type: 'string | null', description: 'Selected time (HH:MM)' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the picker' },
  { name: 'error', type: 'string', description: 'Error message' },
  { name: 'minuteStep', type: 'number', default: '5', description: 'Minute increment step' },
  { name: 'use24h', type: 'boolean', default: 'true', description: 'Use 24-hour format' },
  { name: 'placeholder', type: 'string', default: "'Select time'", description: 'Placeholder when no time selected' },
]

const timePickerModalProps: PropDef[] = [
  { name: 'modelValue', type: 'string | null', description: 'Selected time in HH:MM format (v-model)' },
  { name: 'show', type: 'boolean', default: 'false', description: 'Controls dialog visibility (v-model:show)' },
  { name: 'use24h', type: 'boolean', default: 'false', description: 'Use 24-hour format (shows inner ring 13-23)' },
  { name: 'minuteStep', type: 'number', default: '5', description: 'Minute increment step' },
  { name: 'title', type: 'string', default: "'Select time'", description: 'Dialog title' },
]

const colorPickerProps: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'Selected color (hex)' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'presets', type: 'string[]', description: '18 preset color swatches' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the picker' },
  { name: 'error', type: 'string', description: 'Error message' },
]

const colorPickerModalProps: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'Selected color in hex format (v-model)' },
  { name: 'show', type: 'boolean', default: 'false', description: 'Controls dialog visibility (v-model:show)' },
  { name: 'presets', type: 'string[]', description: '18 preset color swatches' },
  { name: 'title', type: 'string', default: "'Select color'", description: 'Dialog title' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Inputs</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Form controls for capturing user input.
    </p>

    <!-- ── MTextField ───────────────────────────────────────────────────── -->
    <h2 id="mtextfield" class="mb-4 text-headline-small font-medium">MTextField</h2>

    <ComponentDemo
      title="Variants"
      description="Filled and outlined styles."
      :code="`<template>
  <MTextField v-model=&quot;value&quot; label=&quot;Filled&quot; />
  <MTextField v-model=&quot;value&quot; label=&quot;Outlined&quot; variant=&quot;outlined&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MTextField v-model="textFilled" label="Filled" />
        <MTextField v-model="textOutlined" label="Outlined" variant="outlined" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Icons & Types"
      description="Leading icons and different input types."
      :code="`<template>
  <MTextField v-model=&quot;val&quot; label=&quot;Email&quot; type=&quot;email&quot; leading-icon=&quot;mail&quot; />
  <MTextField v-model=&quot;val&quot; label=&quot;Password&quot; type=&quot;password&quot; leading-icon=&quot;lock&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MTextField v-model="textFilled" label="Email" type="email" leading-icon="mail" hint="We'll never share your email" />
        <MTextField v-model="textPassword" label="Password" type="password" leading-icon="lock" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="States"
      description="Error, disabled, and multiline."
      :code="`<template>
  <MTextField v-model=&quot;val&quot; label=&quot;Username&quot; error=&quot;Already taken&quot; />
  <MTextField v-model=&quot;val&quot; label=&quot;Disabled&quot; :disabled=&quot;true&quot; />
  <MTextField v-model=&quot;val&quot; label=&quot;Bio&quot; :multiline=&quot;true&quot; :rows=&quot;3&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MTextField v-model="textError" label="Username" error="Already taken" />
        <MTextField model-value="Can't edit this" label="Disabled" :disabled="true" />
      </div>
      <div class="mt-4 grid w-full gap-4 sm:grid-cols-2">
        <MTextField v-model="textMultiline" label="Bio" :multiline="true" :rows="3" leading-icon="edit_note" />
        <MTextField v-model="textMultiline" label="Bio" :multiline="true" :rows="3" leading-icon="edit_note" variant="outlined" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Clearable"
      description="Add a clear button that appears when the field has a value."
      :code="`<MTextField v-model=&quot;text&quot; label=&quot;Search&quot; leading-icon=&quot;search&quot; :clearable=&quot;true&quot; />`"
      :script="`import { MTextField } from '@m3ui-vue/m3ui-vue'

const text = ref('Hello world')`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MTextField v-model="textClearable" label="Search" leading-icon="search" :clearable="true" />
        <MTextField v-model="textClearable" label="Outlined" leading-icon="search" :clearable="true" variant="outlined" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="textFieldProps" />

    <!-- ── MNumberField ────────────────────────────────────────────────── -->
    <h2 id="mnumberfield" class="mb-4 mt-14 text-headline-small font-medium">MNumberField</h2>

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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="numberFieldProps" />

    <!-- ── MMaskField ──────────────────────────────────────────────────── -->
    <h2 id="mmaskfield" class="mb-4 mt-14 text-headline-small font-medium">MMaskField</h2>

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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="maskFieldProps" />

    <!-- ── MSelect ──────────────────────────────────────────────────────── -->
    <h2 id="mselect" class="mb-4 mt-14 text-headline-small font-medium">MSelect</h2>

    <ComponentDemo
      title="Basic"
      description="Single-value dropdown select."
      :code="`<template>
  <MSelect
    v-model=&quot;value&quot;
    :options=&quot;[
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
    ]&quot;
    label=&quot;Choose one&quot;
  />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MSelect v-model="selectVal" :options="selectOptions" label="Filled" leading-icon="list" />
        <MSelect v-model="selectVal" :options="selectOptions" label="Outlined" variant="outlined" leading-icon="list" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Object Values"
      description="Values can be any type — objects, arrays, booleans, etc. Comparison uses strict equality (===)."
      :code="`<MSelect
  v-model=&quot;selected&quot;
  :options=&quot;[
    { label: 'United States', value: { code: 'US', region: 'Americas' } },
    { label: 'Germany', value: { code: 'DE', region: 'Europe' } },
    { label: 'Japan', value: { code: 'JP', region: 'Asia' } },
  ]&quot;
  label=&quot;Country&quot;
  variant=&quot;outlined&quot;
/>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MSelect v-model="objectSelectVal" :options="objectOptions" label="Country" variant="outlined" leading-icon="public" />
        <div v-if="objectSelectVal" class="flex items-center text-body-medium text-on-surface-variant">
          Selected: <code class="ml-2 rounded bg-surface-container-high px-2 py-1 text-primary">{{ JSON.stringify(objectSelectVal) }}</code>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Clearable"
      description="Add a clear button to reset the selection."
      :code="`<MSelect v-model=&quot;val&quot; :options=&quot;options&quot; label=&quot;Choice&quot; :clearable=&quot;true&quot; />`"
      :script="`import { MSelect } from '@m3ui-vue/m3ui-vue'

const val = ref('a')`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MSelect v-model="selectClearable" :options="selectOptions" label="Filled" :clearable="true" leading-icon="list" />
        <MSelect v-model="selectClearable" :options="selectOptions" label="Outlined" :clearable="true" variant="outlined" leading-icon="list" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Modal mode"
      description="Opens the options in a dialog instead of a dropdown. Useful for mobile or long option lists."
      :code='`<MSelect v-model="val" :options="options" label="Choice" mode="modal" />`'
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MSelect v-model="selectVal" :options="selectOptions" label="Modal Filled" mode="modal" leading-icon="list" />
        <MSelect v-model="selectVal" :options="selectOptions" label="Modal Outlined" mode="modal" variant="outlined" leading-icon="list" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="selectProps" />

    <!-- ── MMultiSelect ─────────────────────────────────────────────────── -->
    <h2 id="mmultiselect" class="mb-4 mt-14 text-headline-small font-medium">MMultiSelect</h2>

    <ComponentDemo
      title="Multi Select"
      description="Select multiple values with chips and search."
      :code="`<template>
  <MMultiSelect
    v-model=&quot;values&quot;
    :options=&quot;frameworks&quot;
    label=&quot;Frameworks&quot;
    :searchable=&quot;true&quot;
  />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MMultiSelect v-model="multiVal" :options="multiOptions" label="Frameworks" leading-icon="code" />
        <MMultiSelect v-model="multiVal" :options="multiOptions" label="Outlined" variant="outlined" leading-icon="code" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Object Values"
      description="Values can be any type — objects, booleans, etc. Useful for permissions, roles, or complex data."
      :code="`<MMultiSelect
  v-model=&quot;selected&quot;
  :options=&quot;[
    { label: 'Read', value: { id: 1, scope: 'read' } },
    { label: 'Write', value: { id: 2, scope: 'write' } },
    { label: 'Delete', value: { id: 3, scope: 'delete' } },
    { label: 'Admin', value: { id: 4, scope: 'admin' } },
  ]&quot;
  label=&quot;Permissions&quot;
  variant=&quot;outlined&quot;
/>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MMultiSelect v-model="multiObjectVal" :options="multiObjectOptions" label="Permissions" variant="outlined" leading-icon="shield" />
        <div v-if="multiObjectVal.length" class="flex items-start text-body-medium text-on-surface-variant">
          <code class="rounded bg-surface-container-high px-2 py-1 text-primary text-body-small">{{ JSON.stringify(multiObjectVal, null, 2) }}</code>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Clearable"
      description="Clear all selections at once."
      :code="`<MMultiSelect v-model=&quot;val&quot; :options=&quot;options&quot; label=&quot;Frameworks&quot; :clearable=&quot;true&quot; />`"
      :script="`import { MMultiSelect } from '@m3ui-vue/m3ui-vue'

const val = ref(['vue', 'svelte'])`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MMultiSelect v-model="multiClearable" :options="multiOptions" label="Filled" :clearable="true" leading-icon="code" />
        <MMultiSelect v-model="multiClearable" :options="multiOptions" label="Outlined" :clearable="true" variant="outlined" leading-icon="code" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Hide Selected"
      description="Already-picked options disappear from the dropdown."
      :code="`<MMultiSelect
  v-model=&quot;val&quot;
  :options=&quot;options&quot;
  label=&quot;Frameworks&quot;
  :hide-selected=&quot;true&quot;
  :clearable=&quot;true&quot;
/>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MMultiSelect v-model="multiHideVal" :options="multiOptions" label="Frameworks" leading-icon="code" :hide-selected="true" :clearable="true" />
        <MMultiSelect v-model="multiHideVal" :options="multiOptions" label="Outlined" leading-icon="code" variant="outlined" :hide-selected="true" :clearable="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Modal mode"
      description="Opens the options in a dialog instead of a dropdown."
      :code='`<MMultiSelect v-model="val" :options="options" label="Frameworks" mode="modal" />`'
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MMultiSelect v-model="multiVal" :options="multiOptions" label="Modal Filled" mode="modal" leading-icon="code" />
        <MMultiSelect v-model="multiVal" :options="multiOptions" label="Modal Outlined" mode="modal" variant="outlined" leading-icon="code" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="multiSelectProps" />

    <p class="mt-3 text-body-medium text-on-surface-variant">
      <strong>Slot:</strong> <code>no-results</code> — Custom content when no options match the search query.
    </p>

    <!-- ── MAutocomplete ──────────────────────────────────────────────────── -->
    <h2 id="mautocomplete" class="mb-4 mt-14 text-headline-small font-medium">MAutocomplete</h2>

    <ComponentDemo
      title="Searchable Select"
      description="Like MSelect but with a text input for filtering. Type to search, arrow keys to navigate, Enter to select."
      :code="`<MAutocomplete
  v-model=&quot;country&quot;
  :options=&quot;countries&quot;
  label=&quot;Country&quot;
  leading-icon=&quot;public&quot;
/>`"
      :script="`const country = ref(null)
const countries = [
  { label: 'Argentina', value: 'ar' },
  { label: 'Brazil', value: 'br' },
  { label: 'Canada', value: 'ca' },
  { label: 'France', value: 'fr' },
  { label: 'Germany', value: 'de' },
  { label: 'Japan', value: 'jp' },
  { label: 'United States', value: 'us' },
]`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MAutocomplete v-model="autoVal" :options="autoOptions" label="Country" leading-icon="public" />
        <MAutocomplete v-model="autoVal" :options="autoOptions" label="Country (outlined)" leading-icon="public" variant="outlined" :clearable="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Modal mode"
      description="Opens the options in a dialog with search."
      :code='`<MAutocomplete v-model="val" :options="options" label="Country" mode="modal" />`'
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MAutocomplete v-model="autoVal" :options="autoOptions" label="Modal Filled" mode="modal" leading-icon="public" />
        <MAutocomplete v-model="autoVal" :options="autoOptions" label="Modal Outlined" mode="modal" variant="outlined" leading-icon="public" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="autocompleteProps" />

    <!-- ── MMultiAutocomplete ──────────────────────────────────────────── -->
    <h2 id="mmultiautocomplete" class="mb-4 mt-14 text-headline-small font-medium">MMultiAutocomplete</h2>

    <ComponentDemo
      title="Searchable Multi Select"
      description="Multi-value autocomplete with inline search. Type to filter, Enter to toggle, Backspace to remove last chip."
      :code="`<MMultiAutocomplete
  v-model=&quot;selected&quot;
  :options=&quot;countries&quot;
  label=&quot;Countries&quot;
  leading-icon=&quot;public&quot;
  :clearable=&quot;true&quot;
/>`"
      :script="`const selected = ref([])
const countries = [
  { label: 'Argentina', value: 'ar' },
  { label: 'Brazil', value: 'br' },
  { label: 'Canada', value: 'ca' },
  { label: 'France', value: 'fr' },
  { label: 'Germany', value: 'de' },
  { label: 'Japan', value: 'jp' },
  { label: 'United States', value: 'us' },
]`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MMultiAutocomplete v-model="multiAutoVal" :options="autoOptions" label="Countries" leading-icon="public" />
        <MMultiAutocomplete v-model="multiAutoVal" :options="autoOptions" label="Countries (outlined)" leading-icon="public" variant="outlined" :clearable="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Hide Selected"
      description="With hideSelected, already-picked options disappear from the dropdown — useful when you don't want duplicates cluttering the list."
      :code="`<MMultiAutocomplete
  v-model=&quot;selected&quot;
  :options=&quot;countries&quot;
  label=&quot;Countries&quot;
  leading-icon=&quot;public&quot;
  :hide-selected=&quot;true&quot;
  :clearable=&quot;true&quot;
/>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MMultiAutocomplete v-model="multiAutoHideVal" :options="autoOptions" label="Countries" leading-icon="public" :hide-selected="true" :clearable="true" />
        <MMultiAutocomplete v-model="multiAutoHideVal" :options="autoOptions" label="Countries (outlined)" leading-icon="public" variant="outlined" :hide-selected="true" :clearable="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Modal mode"
      description="Opens the options in a dialog with search and checkboxes."
      :code='`<MMultiAutocomplete v-model="val" :options="options" label="Countries" mode="modal" />`'
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MMultiAutocomplete v-model="multiAutoVal" :options="autoOptions" label="Modal Filled" mode="modal" leading-icon="public" />
        <MMultiAutocomplete v-model="multiAutoVal" :options="autoOptions" label="Modal Outlined" mode="modal" variant="outlined" leading-icon="public" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="multiAutocompleteProps" />

    <!-- ── MTagInput ───────────────────────────────────────────────────── -->
    <h2 id="mtaginput" class="mb-4 mt-14 text-headline-small font-medium">MTagInput</h2>

    <ComponentDemo
      title="Tag Input"
      description="Type and press Enter or comma to add tags. Backspace removes the last tag."
      :code="`<MTagInput
  v-model=&quot;tags&quot;
  label=&quot;Skills&quot;
  leading-icon=&quot;sell&quot;
  placeholder=&quot;Add a skill...&quot;
/>`"
      :script="`const tags = ref(['Vue', 'TypeScript'])`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MTagInput v-model="tags" label="Skills" leading-icon="sell" placeholder="Add a skill..." />
        <MTagInput v-model="tags" label="Skills (outlined)" leading-icon="sell" variant="outlined" :clearable="true" placeholder="Add a skill..." />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="tagInputProps" />

    <!-- ── MCheckbox & MSwitch ──────────────────────────────────────────── -->
    <h2 id="mcheckbox" class="mb-4 mt-14 text-headline-small font-medium">MCheckbox &amp; MSwitch</h2>

    <ComponentDemo
      title="Checkbox"
      description="Standard, indeterminate, and disabled states."
      :code="`<template>
  <MCheckbox v-model=&quot;val&quot; label=&quot;Accept terms&quot; />
  <MCheckbox :model-value=&quot;true&quot; :indeterminate=&quot;true&quot; label=&quot;Indeterminate&quot; />
  <MCheckbox :model-value=&quot;false&quot; :disabled=&quot;true&quot; label=&quot;Disabled&quot; />
</template>`"
      :script="`import { MCheckbox } from '@m3ui-vue/m3ui-vue'

const val = ref(false)`"
    >
      <MCheckbox v-model="checked" label="Accept terms" />
      <MCheckbox v-model="indeterminate" :indeterminate="true" label="Indeterminate" />
      <MCheckbox :model-value="false" :disabled="true" label="Disabled" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Checkbox Props</h3>
    <PropsTable :props="checkboxProps" />

    <ComponentDemo
      title="Switch"
      description="Toggle switches with labels."
      :code="`<template>
  <MSwitch v-model=&quot;val&quot; label=&quot;Notifications&quot; />
  <MSwitch :model-value=&quot;false&quot; :disabled=&quot;true&quot; label=&quot;Disabled&quot; />
</template>`"
      :script="`import { MSwitch } from '@m3ui-vue/m3ui-vue'

const val = ref(true)`"
    >
      <MSwitch v-model="switchVal" label="Notifications" />
      <MSwitch :model-value="false" :disabled="true" label="Disabled" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Switch Props</h3>
    <PropsTable :props="switchProps" />

    <!-- ── MRadioGroup ──────────────────────────────────────────────────── -->
    <h2 id="mradiogroup" class="mb-4 mt-14 text-headline-small font-medium">MRadioGroup</h2>

    <ComponentDemo
      title="Radio Group"
      description="Grouped radio buttons with vertical or horizontal layout."
      :code="`<template>
  <MRadioGroup
    v-model=&quot;value&quot;
    :options=&quot;[
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' },
    ]&quot;
    label=&quot;Size&quot;
  />
</template>`"
    >
      <MRadioGroup v-model="radioVal" :options="radioOptions" label="Size (column)" />
      <MRadioGroup v-model="radioVal" :options="radioOptions" label="Size (row)" direction="row" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="radioGroupProps" />

    <!-- ── MSlider ──────────────────────────────────────────────────────── -->
    <h2 id="mslider" class="mb-4 mt-14 text-headline-small font-medium">MSlider</h2>

    <ComponentDemo
      title="Standard Slider"
      description="M3 slider with vertical bar thumb, rounded track with gap, and optional tooltip."
      :code="`<MSlider v-model=&quot;val&quot; label=&quot;Volume&quot; :show-value=&quot;true&quot; :show-tooltip=&quot;true&quot; />`"
    >
      <div class="w-full space-y-6">
        <MSlider v-model="sliderVal" label="Volume" :show-value="true" :show-tooltip="true" />
        <MSlider v-model="sliderVal" label="Tertiary" :show-value="true" color="tertiary" />
        <MSlider :model-value="60" label="Disabled" :disabled="true" :show-value="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="Five track sizes from XS (default) to XL."
      :code="`<MSlider v-model=&quot;val&quot; size=&quot;md&quot; />`"
    >
      <div class="w-full space-y-6">
        <MSlider v-model="sliderVal" label="XS" size="xs" :show-value="true" />
        <MSlider v-model="sliderVal" label="SM" size="sm" :show-value="true" />
        <MSlider v-model="sliderVal" label="MD" size="md" :show-value="true" :show-tooltip="true" />
        <MSlider v-model="sliderVal" label="LG" size="lg" :show-value="true" :show-tooltip="true" />
        <MSlider v-model="sliderVal" label="XL" size="xl" :show-value="true" :show-tooltip="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Stops"
      description="Discrete slider with visible stop dots at each step."
      :code="`<MSlider v-model=&quot;val&quot; :step=&quot;10&quot; :stops=&quot;true&quot; />`"
    >
      <div class="w-full space-y-6">
        <MSlider v-model="sliderVal" label="Step 10" :step="10" :stops="true" :show-value="true" size="sm" />
        <MSlider v-model="sliderVal" label="Step 20" :step="20" :stops="true" :show-value="true" size="md" color="secondary" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Vertical"
      description="Vertical orientation. Same design rotated — the thumb becomes horizontal. Supports icons, stops, and tooltip."
      :code="`<MSlider v-model=&quot;val&quot; orientation=&quot;vertical&quot; :show-tooltip=&quot;true&quot; />`"
    >
      <div class="flex items-stretch gap-8" style="height: 360px">
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="sliderVal" orientation="vertical" :show-tooltip="true" size="xs" />
          <span class="text-label-small text-on-surface-variant">XS</span>
        </div>
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="sliderVal" orientation="vertical" :show-tooltip="true" size="sm" icon="volume_up" />
          <span class="text-label-small text-on-surface-variant">Volume</span>
        </div>
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="sliderVal" orientation="vertical" :show-tooltip="true" size="md" icon="brightness_6" color="tertiary" />
          <span class="text-label-small text-on-surface-variant">Brightness</span>
        </div>
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="sliderVal" orientation="vertical" :show-tooltip="true" size="lg" icon="thermostat" color="secondary" :step="10" :stops="true" />
          <span class="text-label-small text-on-surface-variant">Temperature</span>
        </div>
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="sliderVal" orientation="vertical" :show-tooltip="true" size="xl" icon="speed" color="error" />
          <span class="text-label-small text-on-surface-variant">Speed</span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Centered"
      description="Starts from the middle — for values like -50 to 50. The active track extends from center toward the value."
      :code="`<MSlider v-model=&quot;val&quot; :min=&quot;-50&quot; :max=&quot;50&quot; variant=&quot;centered&quot; :show-tooltip=&quot;true&quot; />`"
    >
      <div class="w-full space-y-6">
        <MSlider v-model="sliderCentered" :min="-50" :max="50" variant="centered" :show-tooltip="true" :show-value="true" label="Balance" size="sm" />
        <MSlider v-model="sliderCentered" :min="-50" :max="50" variant="centered" :show-tooltip="true" :show-value="true" label="Pan" size="md" color="tertiary" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Range"
      description="Two thumbs to select a range. The active track spans between both values."
      :code="`<MSlider v-model=&quot;range&quot; variant=&quot;range&quot; :show-tooltip=&quot;true&quot; />`"
    >
      <div class="w-full space-y-6">
        <MSlider v-model="sliderRange" variant="range" :show-tooltip="true" :show-value="true" label="Price range" size="sm" />
        <MSlider v-model="sliderRange" variant="range" :show-tooltip="true" :show-value="true" label="Age range" size="md" color="secondary" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With Icon"
      description="Optional inset icon displayed before the slider."
      :code="`<MSlider v-model=&quot;val&quot; icon=&quot;volume_up&quot; :show-tooltip=&quot;true&quot; />`"
    >
      <div class="w-full space-y-6">
        <MSlider v-model="sliderVal" icon="volume_up" :show-tooltip="true" size="sm" />
        <MSlider v-model="sliderVal" icon="brightness_6" :show-tooltip="true" size="md" color="tertiary" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Vertical Centered & Range"
      description="Centered and range variants also work vertically."
      :code="`<MSlider v-model=&quot;val&quot; orientation=&quot;vertical&quot; variant=&quot;centered&quot; :min=&quot;-50&quot; :max=&quot;50&quot; />
<MSlider v-model=&quot;range&quot; orientation=&quot;vertical&quot; variant=&quot;range&quot; />`"
    >
      <div class="flex items-stretch gap-8" style="height: 300px">
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="vertCentered" orientation="vertical" variant="centered" :min="-50" :max="50" :show-tooltip="true" size="sm" />
          <span class="text-label-small text-on-surface-variant">Centered</span>
        </div>
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="vertCentered" orientation="vertical" variant="centered" :min="-50" :max="50" :show-tooltip="true" size="md" color="tertiary" icon="swap_vert" />
          <span class="text-label-small text-on-surface-variant">With icon</span>
        </div>
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="vertRange" orientation="vertical" variant="range" :show-tooltip="true" size="sm" color="secondary" />
          <span class="text-label-small text-on-surface-variant">Range</span>
        </div>
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="vertRange" orientation="vertical" variant="range" :show-tooltip="true" size="lg" color="error" />
          <span class="text-label-small text-on-surface-variant">Range LG</span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Audio Mixer"
      description="Practical example combining horizontal and vertical sliders with icons, centered variant, and different sizes."
      :code="`<!-- Horizontal controls -->
<MSlider v-model=&quot;volume&quot; icon=&quot;volume_up&quot; label=&quot;Volume&quot; size=&quot;md&quot; />
<MSlider v-model=&quot;bass&quot; :min=&quot;-20&quot; :max=&quot;20&quot; variant=&quot;centered&quot; label=&quot;Bass&quot; />

<!-- Vertical EQ -->
<MSlider v-model=&quot;low&quot; orientation=&quot;vertical&quot; icon=&quot;graphic_eq&quot; size=&quot;lg&quot; />`"
    >
      <div class="w-full rounded-xl bg-surface-container p-6">
        <p class="mb-4 text-title-medium font-medium text-on-surface">Audio Mixer</p>

        <div class="mb-6 space-y-4">
          <MSlider v-model="musicVolume" icon="volume_up" label="Master Volume" :show-value="true" :show-tooltip="true" size="md" />
          <MSlider v-model="musicBass" :min="-20" :max="20" variant="centered" label="Bass" :show-value="true" :show-tooltip="true" size="sm" color="secondary" />
          <MSlider v-model="musicTreble" :min="-20" :max="20" variant="centered" label="Treble" :show-value="true" :show-tooltip="true" size="sm" color="tertiary" />
        </div>

        <p class="mb-3 text-label-large text-on-surface-variant">Equalizer</p>
        <div class="flex items-stretch gap-6" style="height: 240px">
          <div class="flex flex-1 flex-col items-center gap-1">
            <MSlider v-model="eqLow" orientation="vertical" :show-tooltip="true" size="lg" icon="graphic_eq" color="secondary" />
            <span class="text-label-small text-on-surface-variant">Low</span>
          </div>
          <div class="flex flex-1 flex-col items-center gap-1">
            <MSlider v-model="eqMid" orientation="vertical" :show-tooltip="true" size="lg" icon="graphic_eq" />
            <span class="text-label-small text-on-surface-variant">Mid</span>
          </div>
          <div class="flex flex-1 flex-col items-center gap-1">
            <MSlider v-model="eqHigh" orientation="vertical" :show-tooltip="true" size="lg" icon="graphic_eq" color="tertiary" />
            <span class="text-label-small text-on-surface-variant">High</span>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="sliderProps" />

    <!-- ── MRating ──────────────────────────────────────────────────────── -->
    <h2 id="mrating" class="mb-4 mt-14 text-headline-small font-medium">MRating</h2>

    <ComponentDemo
      title="Rating"
      description="Star rating with half increments and custom icons."
      :code="`<template>
  <MRating v-model=&quot;val&quot; />
  <MRating v-model=&quot;val&quot; :half-increments=&quot;true&quot; />
  <MRating :model-value=&quot;4&quot; :readonly=&quot;true&quot; icon=&quot;favorite&quot; color=&quot;error&quot; />
</template>`"
      :script="`import { MRating } from '@m3ui-vue/m3ui-vue'

const val = ref(3.5)`"
    >
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex flex-col items-center gap-1">
          <MRating v-model="ratingVal" />
          <span class="text-label-medium text-on-surface-variant">{{ ratingVal }}</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <MRating v-model="ratingVal" :half-increments="true" />
          <span class="text-label-medium text-on-surface-variant">half: {{ ratingVal }}</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <MRating :model-value="4" :readonly="true" icon="favorite" color="error" />
          <span class="text-label-medium text-on-surface-variant">readonly</span>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="ratingProps" />

    <!-- ── MDatePicker ──────────────────────────────────────────────────── -->
    <h2 id="mdatepicker" class="mb-4 mt-14 text-headline-small font-medium">MDatePicker</h2>

    <ComponentDemo
      title="Date Picker"
      description="Calendar-based date selection with locale support."
      :code="`<template>
  <MDatePicker v-model=&quot;date&quot; label=&quot;Birthday&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MDatePicker v-model="dateVal" label="Fecha" />
        <MDatePicker v-model="dateVal" label="Date (en)" locale="en-US" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="datePickerProps" />

    <!-- ── MDatePickerModal ────────────────────────────────────────────── -->
    <h2 id="mdatepickermodal" class="mb-4 mt-14 text-headline-small font-medium">MDatePickerModal</h2>

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
      <MDatePickerModal v-model="dateModalVal" v-model:show="showDatePicker" locale="en-US" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="datePickerModalProps" />

    <!-- ── MDateRangePicker ─────────────────────────────────────────────── -->
    <h2 id="mdaterangepicker" class="mb-4 mt-14 text-headline-small font-medium">MDateRangePicker</h2>

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

    <!-- ── MDateRangePickerModal ────────────────────────────────────────── -->
    <h2 id="mdaterangepickermodal" class="mb-4 mt-14 text-headline-small font-medium">MDateRangePickerModal</h2>

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

    <!-- ── MTimePicker ──────────────────────────────────────────────────── -->
    <h2 id="mtimepicker" class="mb-4 mt-14 text-headline-small font-medium">MTimePicker</h2>

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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="timePickerProps" />

    <!-- ── MTimePickerModal ────────────────────────────────────────────── -->
    <h2 id="mtimepickermodal" class="mb-4 mt-14 text-headline-small font-medium">MTimePickerModal</h2>

    <ComponentDemo
      title="Time Picker Modal"
      description="Modal time picker with clock dial and keyboard input modes. Supports AM/PM toggle and 24h format."
      :code="`<template>
  <MButton @click=&quot;show = true&quot;>Pick time</MButton>
  <MTimePickerModal v-model=&quot;time&quot; v-model:show=&quot;show&quot; />
</template>`"
    >
      <div class="flex items-center gap-4">
        <MButton @click="showTimePicker = true">Pick time (12h)</MButton>
        <span v-if="timeModalVal" class="text-body-medium text-on-surface-variant">{{ timeModalVal }}</span>
      </div>
      <MTimePickerModal v-model="timeModalVal" v-model:show="showTimePicker" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="timePickerModalProps" />

    <!-- ── MColorPicker ─────────────────────────────────────────────────── -->
    <h2 id="mcolorpicker" class="mb-4 mt-14 text-headline-small font-medium">MColorPicker</h2>

    <ComponentDemo
      title="Color Picker"
      description="Hue slider with saturation/brightness area and preset swatches."
      :code="`<template>
  <MColorPicker v-model=&quot;color&quot; label=&quot;Brand color&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MColorPicker v-model="colorVal" label="Brand color" />
        <div class="flex items-center gap-3">
          <span
            class="h-10 w-10 rounded-full border border-outline-variant"
            :style="{ backgroundColor: colorVal }"
          />
          <span class="text-body-medium text-on-surface-variant">{{ colorVal }}</span>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="colorPickerProps" />

    <!-- ── MColorPickerModal ───────────────────────────────────────────── -->
    <h2 id="mcolorpickermodal" class="mb-4 mt-14 text-headline-small font-medium">MColorPickerModal</h2>

    <ComponentDemo
      title="Color Picker Modal"
      description="Modal color picker with saturation/brightness area, hue slider, hex input and preset swatches. Only emits on confirm."
      :code="`<template>
  <MButton @click=&quot;show = true&quot;>Pick color</MButton>
  <MColorPickerModal v-model=&quot;color&quot; v-model:show=&quot;show&quot; />
</template>`"
    >
      <div class="flex items-center gap-4">
        <MButton @click="showColorPicker = true">Pick color</MButton>
        <span
          class="h-10 w-10 rounded-full border border-outline-variant"
          :style="{ backgroundColor: colorModalVal }"
        />
        <span class="text-body-medium text-on-surface-variant">{{ colorModalVal }}</span>
      </div>
      <MColorPickerModal v-model="colorModalVal" v-model:show="showColorPicker" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="colorPickerModalProps" />
  </div>
</template>
