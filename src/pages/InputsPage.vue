<script setup lang="ts">
import { ref } from 'vue'
import {
  MTextField, MSelect, MMultiSelect, MCheckbox, MSwitch,
  MRadioGroup, MSlider, MRating, MDatePicker, MDateRangePicker,
  MTimePicker, MColorPicker,
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
const ratingVal = ref(3.5)

const dateVal = ref<string | null>(null)
const dateRange = ref<DateRange>({ start: null, end: null })
const timeVal = ref<string | null>(null)
const colorVal = ref('#6750a4')

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
]

const selectProps: PropDef[] = [
  { name: 'modelValue', type: 'unknown', description: 'Selected value (any type)' },
  { name: 'options', type: 'SelectOption[]', description: '{ label: string, value: unknown, disabled?: boolean }' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'placeholder', type: 'string', description: 'Placeholder when no value selected' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Visual style' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the select' },
  { name: 'error', type: 'string', description: 'Error message' },
]

const multiSelectProps: PropDef[] = [
  { name: 'modelValue', type: 'unknown[]', description: 'Selected values (any type)' },
  { name: 'options', type: 'MultiSelectOption[]', description: '{ label: string, value: unknown, disabled?: boolean }' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Visual style' },
  { name: 'searchable', type: 'boolean', default: 'true', description: 'Show search in dropdown' },
  { name: 'maxChips', type: 'number', default: '3', description: 'Max visible chips before "+N"' },
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
  { name: 'showValue', type: 'boolean', default: 'false', description: 'Show current value' },
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
]

const dateRangeProps: PropDef[] = [
  { name: 'modelValue', type: '{ start: string | null, end: string | null }', description: 'Selected date range' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'min', type: 'string', description: 'Minimum date' },
  { name: 'max', type: 'string', description: 'Maximum date' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the picker' },
  { name: 'locale', type: 'string', default: "'es-ES'", description: 'Locale for month/day names' },
]

const timePickerProps: PropDef[] = [
  { name: 'modelValue', type: 'string | null', description: 'Selected time (HH:MM)' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the picker' },
  { name: 'error', type: 'string', description: 'Error message' },
  { name: 'minuteStep', type: 'number', default: '5', description: 'Minute increment step' },
  { name: 'use24h', type: 'boolean', default: 'true', description: 'Use 24-hour format' },
]

const colorPickerProps: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'Selected color (hex)' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'presets', type: 'string[]', description: '18 preset color swatches' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the picker' },
  { name: 'error', type: 'string', description: 'Error message' },
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
      <MTextField v-model="textMultiline" label="Bio" :multiline="true" :rows="3" variant="outlined" class="mt-4 w-full" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="textFieldProps" />

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
        <MSelect v-model="selectVal" :options="selectOptions" label="Filled" />
        <MSelect v-model="selectVal" :options="selectOptions" label="Outlined" variant="outlined" />
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
        <MSelect v-model="objectSelectVal" :options="objectOptions" label="Country" variant="outlined" />
        <div v-if="objectSelectVal" class="flex items-center text-body-medium text-on-surface-variant">
          Selected: <code class="ml-2 rounded bg-surface-container-high px-2 py-1 text-primary">{{ JSON.stringify(objectSelectVal) }}</code>
        </div>
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
        <MMultiSelect v-model="multiVal" :options="multiOptions" label="Frameworks" />
        <MMultiSelect v-model="multiVal" :options="multiOptions" label="Outlined" variant="outlined" />
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
        <MMultiSelect v-model="multiObjectVal" :options="multiObjectOptions" label="Permissions" variant="outlined" />
        <div v-if="multiObjectVal.length" class="flex items-start text-body-medium text-on-surface-variant">
          <code class="rounded bg-surface-container-high px-2 py-1 text-primary text-body-small">{{ JSON.stringify(multiObjectVal, null, 2) }}</code>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="multiSelectProps" />

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
      title="Slider"
      description="Range slider with value display."
      :code="`<template>
  <MSlider v-model=&quot;val&quot; label=&quot;Volume&quot; :show-value=&quot;true&quot; />
  <MSlider v-model=&quot;val&quot; :min=&quot;0&quot; :max=&quot;50&quot; :step=&quot;5&quot; color=&quot;tertiary&quot; />
</template>`"
    >
      <div class="w-full space-y-6">
        <MSlider v-model="sliderVal" label="Volume" :show-value="true" />
        <MSlider v-model="sliderVal" label="Step 5" :min="0" :max="100" :step="5" :show-value="true" color="tertiary" />
        <MSlider :model-value="60" label="Disabled" :disabled="true" :show-value="true" />
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
  <MDatePicker v-model=&quot;date&quot; label=&quot;English&quot; locale=&quot;en-US&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MDatePicker v-model="dateVal" label="Fecha" />
        <MDatePicker v-model="dateVal" label="Date (en)" locale="en-US" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="datePickerProps" />

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
  </div>
</template>
