<script setup lang="ts">
import { ref } from 'vue'
import { MSelect } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const selectVal = ref<unknown>(null)
const selectOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
  { label: 'Disabled', value: 'd', disabled: true },
]

const objectSelectVal = ref<unknown>(null)
const objectOptions = [
  { label: 'United States', value: { code: 'US', region: 'Americas' } },
  { label: 'Germany', value: { code: 'DE', region: 'Europe' } },
  { label: 'Japan', value: { code: 'JP', region: 'Asia' } },
  { label: 'Brazil', value: { code: 'BR', region: 'Americas' } },
]

const selectClearable = ref<unknown>('a')
const selectRequired = ref<unknown>(null)

const selectProps: PropDef[] = [
  { name: 'modelValue', type: 'unknown', description: 'Selected value (any type — v-model)' },
  { name: 'options', type: 'SelectOption[]', description: 'See the type below' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'placeholder', type: 'string', description: 'Placeholder when no value selected' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Visual style' },
  { name: 'mode', type: "'docked' | 'modal'", default: "'docked'", description: 'Dropdown mode: docked (inline) or modal (dialog)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the select' },
  { name: 'error', type: 'boolean', description: 'Error state' },
  { name: 'errorLabel', type: 'string', description: 'Error message shown when error is true' },
  { name: 'hint', type: 'string', description: 'Hint text below the field' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required — adds a red asterisk after the label' },
  { name: 'leadingIcon', type: 'string', description: 'Material Symbol shown before the trigger' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show a clear button to reset the selection' },
  { name: 'fieldBg', type: 'string', description: 'Overrides the auto-detected background color used to cut the floating label out of the outlined border' },
  { name: 'noResultsText', type: 'string', description: "Text shown when options is empty — defaults to the current locale's string" },
]

const selectTypes: TypeDef[] = [
  {
    name: 'SelectOption',
    description: 'Also used by MAutocomplete',
    fields: [
      { name: 'label', type: 'string', required: true, description: 'Text shown in the trigger and the list' },
      { name: 'value', type: 'unknown', required: true, description: 'Any type — comparison uses deep equality (JSON.stringify) for objects, === otherwise' },
      { name: 'disabled', type: 'boolean', description: 'Disables the option' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSelect</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A single-value dropdown select, docked or as a modal dialog on smaller screens.
    </p>

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
      description="Values can be any type — objects, arrays, booleans, etc."
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
      title="Clearable & Required"
      description="clearable adds a reset button; required adds an asterisk to the label."
      :code="`<MSelect v-model=&quot;val&quot; :options=&quot;options&quot; label=&quot;Choice&quot; :clearable=&quot;true&quot; />
<MSelect v-model=&quot;val&quot; :options=&quot;options&quot; label=&quot;Choice&quot; :required=&quot;true&quot; />`"
      :script="`import { MSelect } from '@m3ui-vue/m3ui-vue'

const val = ref('a')`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MSelect v-model="selectClearable" :options="selectOptions" label="Filled" :clearable="true" leading-icon="list" />
        <MSelect v-model="selectRequired" :options="selectOptions" label="Required" :required="true" variant="outlined" leading-icon="list" />
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="selectTypes" />

    <ComponentPager current="MSelect" />
  </div>
</template>
