<script setup lang="ts">
import { ref } from 'vue'
import { MAutocomplete } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

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
const autoDebounceLog = ref('')
function onAutoDebounced(v: string) { autoDebounceLog.value = `@debounced: "${v}"` }
const autoRequired = ref<unknown>(null)

const autocompleteProps: PropDef[] = [
  { name: 'modelValue', type: 'unknown', description: 'Selected value (v-model)' },
  { name: 'options', type: 'SelectOption[]', description: 'See the type below' },
  { name: 'label', type: 'string', description: 'Floating label text' },
  { name: 'placeholder', type: 'string', description: 'Input placeholder' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Field style' },
  { name: 'mode', type: "'docked' | 'modal'", default: "'docked'", description: 'Dropdown mode: docked (inline) or modal (dialog)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field' },
  { name: 'error', type: 'boolean', description: 'Error state' },
  { name: 'errorLabel', type: 'string', description: 'Error message shown when error is true' },
  { name: 'hint', type: 'string', description: 'Helper text below field' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required — adds a red asterisk after the label' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show a clear button' },
  { name: 'leadingIcon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'fieldBg', type: 'string', description: 'Overrides the auto-detected background color used to cut the floating label out of the outlined border' },
  { name: 'noResultsText', type: 'string', default: "'No results'", description: 'Text when no options match' },
  { name: 'debounce', type: 'number', default: '0', description: 'Delay (ms) before filtering and firing @debounced. Selection is always instant' },
]

const autocompleteEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'unknown', description: 'Emitted on selection — powers v-model' },
  { name: 'debounced', payload: 'string', description: 'Emitted debounce ms after the user stops typing the search query (only when debounce > 0)' },
]

const autocompleteTypes: TypeDef[] = [
  {
    name: 'SelectOption',
    description: 'Also used by MSelect',
    fields: [
      { name: 'label', type: 'string', required: true, description: 'Text shown in the input and the list' },
      { name: 'value', type: 'unknown', required: true, description: 'Any type — comparison uses deep equality (JSON.stringify) for objects, === otherwise' },
      { name: 'disabled', type: 'boolean', description: 'Disables the option' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MAutocomplete</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Like MSelect but with a text input for filtering. Type to search, arrow keys to navigate, Enter to select.
    </p>

    <ComponentDemo
      title="Searchable Select"
      description="Type to search, arrow keys to navigate, Enter to select."
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
      title="Required"
      description="Marks the field as required — adds a red asterisk after the label."
      :code="`<MAutocomplete v-model=&quot;val&quot; :options=&quot;options&quot; label=&quot;Country&quot; :required=&quot;true&quot; />`"
    >
      <div class="w-full sm:w-80">
        <MAutocomplete v-model="autoRequired" :options="autoOptions" label="Country" leading-icon="public" :required="true" />
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

    <ComponentDemo
      title="Debounce"
      description="Debounce the search filtering. Use @debounced to fetch options from an API after the user pauses typing."
      :code='`<MAutocomplete
  v-model=&quot;country&quot;
  :options=&quot;options&quot;
  label=&quot;Search country&quot;
  :debounce=&quot;400&quot;
  @debounced=&quot;fetchCountries&quot;
/>`'
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MAutocomplete v-model="autoVal" :options="autoOptions" label="Country (400ms)" leading-icon="public" :debounce="400" @debounced="onAutoDebounced" />
        <div class="flex items-center">
          <p class="text-body-medium text-on-surface-variant">{{ autoDebounceLog || 'Type to search — filtering and @debounced fire after 400ms' }}</p>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="autocompleteProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="autocompleteEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="autocompleteTypes" />

    <ComponentPager current="MAutocomplete" />
  </div>
</template>
