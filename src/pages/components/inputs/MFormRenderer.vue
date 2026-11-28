<script setup lang="ts">
import { ref } from 'vue'
import { MFormRenderer } from '@m3ui-vue/m3ui-vue'
import type { FormSchema } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

// A restaurant's booking form, as a backend could send it
const booking: FormSchema = {
  title: 'Book a table',
  description: 'We confirm by email within the hour.',
  submitLabel: 'Book',
  resetLabel: 'Clear',
  fields: [
    { type: 'text', name: 'name', label: 'Name', required: true, width: 'half', icon: 'person' },
    { type: 'phone', name: 'phone', label: 'Phone', required: true, width: 'half' },
    { type: 'email', name: 'email', label: 'Email', required: true },
    { type: 'date', name: 'date', label: 'Day', required: true, width: 'third' },
    { type: 'time', name: 'time', label: 'Time', required: true, width: 'third' },
    { type: 'number', name: 'guests', label: 'Guests', min: 1, max: 12, default: 2, width: 'third' },
    { type: 'radio', name: 'zone', label: 'Where', options: [{ label: 'Inside', value: 'in' }, { label: 'Terrace', value: 'out' }], default: 'in' },
    { type: 'heading', label: 'Anything special?' },
    { type: 'checkbox', name: 'birthday', label: 'It’s a birthday' },
    { type: 'text', name: 'cake', label: 'Message on the cake', maxLength: 30, hint: 'Up to 30 letters', visibleWhen: { field: 'birthday', equals: true } },
    { type: 'select', name: 'diet', label: 'Dietary needs', options: ['None', 'Vegetarian', 'Vegan', 'Gluten-free'], default: 'None' },
    { type: 'textarea', name: 'notes', label: 'Notes', rows: 2 },
  ],
}
const values = ref<Record<string, unknown>>({})
const sent = ref<Record<string, unknown> | null>(null)

const props: PropDef[] = [
  { name: 'schema', type: 'FormSchema', description: 'The form: its fields in order, title, description and buttons\' text' },
  { name: 'modelValue', type: 'Record<string, unknown>', description: 'The values by field name (v-model). Missing ones start from each field\'s default' },
  { name: 'validateOn', type: "'blur' | 'input' | 'submit'", default: "'blur'", description: 'When fields check their rules (MForm\'s)' },
  { name: 'validateDebounce', type: 'number', description: 'Wait this long (ms) after typing stops before re-checking' },
  { name: 'errors', type: 'Record<string, string | string[]>', description: 'Errors from outside (a server\'s), by field name' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables every field and the buttons' },
  { name: 'actions', type: 'boolean', default: 'true', description: 'Show the submit (and reset) buttons' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'The submit button shows a spinner' },
]
const events: EventDef[] = [
  { name: 'update:modelValue', payload: 'Record<string, unknown>', description: 'A field changed' },
  { name: 'submit', payload: 'Record<string, unknown>', description: 'The form passed its checks: the values of the fields on show' },
  { name: 'invalid', payload: 'Record<string, string>', description: 'Submit was blocked: the messages by field name' },
]
const slots: SlotDef[] = [
  { name: 'field-{name}', description: 'Replaces one field. Scope: { field, value, update }' },
  { name: 'actions', description: 'Replaces the buttons. Scope: { reset }' },
]
const types: TypeDef[] = [
  {
    name: 'FormFieldSchema',
    fields: [
      { name: 'type', type: 'FormFieldType', required: true, description: 'text, email, password, tel, url, textarea, number, select, autocomplete, radio, checkbox, switch, date, time, slider, rating, phone, heading, divider' },
      { name: 'name', type: 'string', description: 'The value\'s key (every type but heading and divider)' },
      { name: 'label, placeholder, hint', type: 'string', description: 'Texts; a heading\'s label is its title and description the line under it' },
      { name: 'required, disabled', type: 'boolean', description: '' },
      { name: 'default', type: 'unknown', description: 'Its value before the user changes it' },
      { name: 'options', type: '(string | { label, value })[]', description: 'select, autocomplete, radio' },
      { name: 'min, max, step', type: 'number', description: 'number, slider, rating (max). date: min/max as YYYY-MM-DD' },
      { name: 'minLength, maxLength, pattern, patternMessage', type: 'number / string', description: 'Rules for text-like fields; email and url check their format by type' },
      { name: 'width', type: "'full' | 'half' | 'third' | 'two-thirds'", description: 'Its share of the row on a wide form (stacked on a narrow one, by the form\'s own width)' },
      { name: 'icon', type: 'string', description: 'A Material Symbol at the start of text-like fields' },
      { name: 'visibleWhen', type: 'FormFieldCondition | FormFieldCondition[]', description: '{ field, equals?, notEquals?, in?, filled? }: shown only while it holds (all of them); hidden fields aren\'t checked or submitted' },
      { name: 'rules', type: 'ValidationRule[]', description: 'More rules in code (not JSON): validators, zod/valibot schemas, functions' },
    ],
  },
  {
    name: 'FormSchema',
    fields: [
      { name: 'fields', type: 'FormFieldSchema[]', required: true, description: 'In order' },
      { name: 'title, description', type: 'string', description: 'Above the fields' },
      { name: 'submitLabel, resetLabel', type: 'string', description: 'The buttons\' text; a reset button only with resetLabel' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFormRenderer</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Renders a form from a JSON schema: the library's own fields laid out in rows, their rules checked by
      <RouterLink to="/components/inputs/mform" class="text-primary underline">MForm</RouterLink>, and fields that show only
      when another field has some value. Write schemas by hand, send them from a backend, or design them with
      <RouterLink to="/components/inputs/mformbuilder" class="text-primary underline">MFormBuilder</RouterLink>.
    </p>

    <ComponentDemo
      title="From a schema"
      description="Tick the birthday box: a field appears. Submit with something missing to see the rules."
      :code="`<MFormRenderer v-model=&quot;values&quot; :schema=&quot;schema&quot; @submit=&quot;send&quot; />`"
      :script="`const schema = {
  title: 'Book a table',
  submitLabel: 'Book',
  fields: [
    { type: 'text', name: 'name', label: 'Name', required: true, width: 'half', icon: 'person' },
    { type: 'phone', name: 'phone', label: 'Phone', required: true, width: 'half' },
    { type: 'email', name: 'email', label: 'Email', required: true },
    { type: 'date', name: 'date', label: 'Day', required: true, width: 'third' },
    // …
    { type: 'checkbox', name: 'birthday', label: 'It’s a birthday' },
    { type: 'text', name: 'cake', label: 'Message on the cake', maxLength: 30, visibleWhen: { field: 'birthday', equals: true } },
  ],
}`"
    >
      <div class="flex w-full flex-col gap-4">
        <MFormRenderer v-model="values" :schema="booking" class="w-full" @submit="sent = $event" />
        <pre v-if="sent" class="overflow-auto rounded-lg bg-surface-container p-3 font-mono text-body-small">{{ JSON.stringify(sent, null, 2) }}</pre>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="types" />

    <ComponentPager current="MFormRenderer" />
  </div>
</template>
