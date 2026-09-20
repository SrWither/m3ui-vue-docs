<script setup lang="ts">
import { ref } from 'vue'
import { MMultiAutocomplete } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

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
const multiAutoDebounceLog = ref('')
function onMultiAutoDebounced(v: string) { multiAutoDebounceLog.value = `@debounced: "${v}"` }
const multiAutoRequired = ref<unknown[]>([])

const multiAutocompleteProps: PropDef[] = [
  { name: 'modelValue', type: 'unknown[]', description: 'Selected values (v-model)' },
  { name: 'options', type: 'MultiSelectOption[]', description: 'See the type below' },
  { name: 'label', type: 'string', description: 'Floating label text' },
  { name: 'placeholder', type: 'string', description: 'Input placeholder' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Field style' },
  { name: 'mode', type: "'docked' | 'modal'", default: "'docked'", description: 'Dropdown mode: docked (inline) or modal (dialog)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field' },
  { name: 'error', type: 'boolean', description: 'Error state' },
  { name: 'errorLabel', type: 'string', description: 'Error message shown when error is true' },
  { name: 'hint', type: 'string', description: 'Helper text below field' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required — adds a red asterisk after the label' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show a clear-all button' },
  { name: 'leadingIcon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'fieldBg', type: 'string', description: 'Overrides the auto-detected background color used to cut the floating label out of the outlined border' },
  { name: 'maxChips', type: 'number', default: '3', description: 'Max visible chips before "+N"' },
  { name: 'noResultsText', type: 'string', default: "'No results'", description: 'Text when no options match' },
  { name: 'hideSelected', type: 'boolean', default: 'false', description: 'Remove already-selected options from the dropdown' },
  { name: 'debounce', type: 'number', default: '0', description: 'Delay (ms) before filtering and firing @debounced. Selection is always instant' },
]

const multiAutocompleteEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'unknown[]', description: 'Emitted on selection change — powers v-model' },
  { name: 'debounced', payload: 'string', description: 'Emitted debounce ms after the user stops typing the search query (only when debounce > 0)' },
]

const multiAutocompleteTypes: TypeDef[] = [
  {
    name: 'MultiSelectOption',
    description: 'Also used by MMultiSelect',
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
    <h1 class="mb-2 text-headline-large font-medium">MMultiAutocomplete</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Multi-value autocomplete with inline search. Type to filter, Enter to toggle, Backspace to remove last chip.
    </p>

    <ComponentDemo
      title="Searchable Multi Select"
      description="Type to filter, Enter to toggle, Backspace to remove last chip."
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
      title="Required"
      description="Marks the field as required — adds a red asterisk after the label."
      :code="`<MMultiAutocomplete v-model=&quot;val&quot; :options=&quot;options&quot; label=&quot;Countries&quot; :required=&quot;true&quot; />`"
    >
      <div class="w-full sm:w-80">
        <MMultiAutocomplete v-model="multiAutoRequired" :options="autoOptions" label="Countries" leading-icon="public" :required="true" />
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

    <ComponentDemo
      title="Debounce"
      description="Debounce the search filtering. Selections are always instant."
      :code='`<MMultiAutocomplete
  v-model=&quot;selected&quot;
  :options=&quot;options&quot;
  label=&quot;Countries&quot;
  :debounce=&quot;400&quot;
  @debounced=&quot;fetchCountries&quot;
/>`'
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MMultiAutocomplete v-model="multiAutoVal" :options="autoOptions" label="Countries (400ms)" leading-icon="public" :debounce="400" @debounced="onMultiAutoDebounced" />
        <div class="flex items-center">
          <p class="text-body-medium text-on-surface-variant">{{ multiAutoDebounceLog || 'Type to search — filtering and @debounced fire after 400ms' }}</p>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="multiAutocompleteProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="multiAutocompleteEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="multiAutocompleteTypes" />

    <ComponentPager current="MMultiAutocomplete" />
  </div>
</template>
