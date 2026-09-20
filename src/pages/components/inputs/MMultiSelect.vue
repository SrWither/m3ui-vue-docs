<script setup lang="ts">
import { ref } from 'vue'
import { MMultiSelect } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const multiVal = ref<unknown[]>([])
const multiOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
  { label: 'Solid', value: 'solid' },
]

const multiObjectVal = ref<unknown[]>([])
const multiObjectOptions = [
  { label: 'Read', value: { id: 1, scope: 'read' } },
  { label: 'Write', value: { id: 2, scope: 'write' } },
  { label: 'Delete', value: { id: 3, scope: 'delete' } },
  { label: 'Admin', value: { id: 4, scope: 'admin' } },
]

const multiClearable = ref<unknown[]>(['vue', 'svelte'])
const multiHideVal = ref<unknown[]>([])
const multiRequired = ref<unknown[]>([])

const multiSelectProps: PropDef[] = [
  { name: 'modelValue', type: 'unknown[]', description: 'Selected values (any type — v-model)' },
  { name: 'options', type: 'MultiSelectOption[]', description: 'See the type below' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'placeholder', type: 'string', description: 'Placeholder when nothing selected' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Visual style' },
  { name: 'mode', type: "'docked' | 'modal'", default: "'docked'", description: 'Dropdown mode: docked (inline) or modal (dialog)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field' },
  { name: 'error', type: 'boolean', description: 'Error state' },
  { name: 'errorLabel', type: 'string', description: 'Error message shown when error is true' },
  { name: 'hint', type: 'string', description: 'Hint text below the field' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required — adds a red asterisk after the label' },
  { name: 'leadingIcon', type: 'string', description: 'Material Symbol shown before the trigger' },
  { name: 'fieldBg', type: 'string', description: 'Overrides the auto-detected background color used to cut the floating label out of the outlined border' },
  { name: 'searchable', type: 'boolean', default: 'true', description: 'Show search in dropdown' },
  { name: 'maxChips', type: 'number', default: '3', description: 'Max visible chips before "+N"' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show a clear button to reset all selections' },
  { name: 'searchPlaceholder', type: 'string', description: "Placeholder for search input in dropdown — defaults to the current locale's string" },
  { name: 'noResultsText', type: 'string', description: "Text when no options match search — defaults to the current locale's string" },
  { name: 'hideSelected', type: 'boolean', default: 'false', description: 'Remove already-selected options from the dropdown' },
]

const multiSelectSlots: SlotDef[] = [
  { name: 'no-results', description: 'Custom content shown in the dropdown when no options match the search query' },
]

const multiSelectTypes: TypeDef[] = [
  {
    name: 'MultiSelectOption',
    description: 'Also used by MMultiAutocomplete',
    fields: [
      { name: 'label', type: 'string', required: true, description: 'Text shown in the chip and the list' },
      { name: 'value', type: 'unknown', required: true, description: 'Any type — comparison uses deep equality (JSON.stringify) for objects, === otherwise' },
      { name: 'disabled', type: 'boolean', description: 'Disables the option' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMultiSelect</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Select multiple values with removable chips and an optional in-dropdown search.
    </p>

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
      title="Clearable & Required"
      description="clearable resets all selections at once; required adds an asterisk to the label."
      :code="`<MMultiSelect v-model=&quot;val&quot; :options=&quot;options&quot; label=&quot;Frameworks&quot; :clearable=&quot;true&quot; />`"
      :script="`import { MMultiSelect } from '@m3ui-vue/m3ui-vue'

const val = ref(['vue', 'svelte'])`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MMultiSelect v-model="multiClearable" :options="multiOptions" label="Filled" :clearable="true" leading-icon="code" />
        <MMultiSelect v-model="multiRequired" :options="multiOptions" label="Required" :required="true" variant="outlined" leading-icon="code" />
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="multiSelectSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="multiSelectTypes" />

    <ComponentPager current="MMultiSelect" />
  </div>
</template>
