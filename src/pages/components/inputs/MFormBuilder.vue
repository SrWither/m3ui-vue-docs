<script setup lang="ts">
import { ref } from 'vue'
import { MFormBuilder } from '@m3ui-vue/m3ui-vue'
import type { FormSchema } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const schema = ref<FormSchema>({
  title: 'Job application',
  submitLabel: 'Apply',
  fields: [
    { type: 'text', name: 'fullName', label: 'Full name', required: true, width: 'half' },
    { type: 'email', name: 'email', label: 'Email', required: true, width: 'half' },
    { type: 'select', name: 'role', label: 'Role', required: true, options: ['Cook', 'Waiter', 'Courier'] },
    { type: 'switch', name: 'license', label: 'I have a motorbike license', visibleWhen: { field: 'role', equals: 'Courier' } },
    { type: 'rating', name: 'english', label: 'English level', max: 5 },
    { type: 'textarea', name: 'about', label: 'About you', maxLength: 500 },
  ],
})

const props: PropDef[] = [
  { name: 'modelValue', type: 'FormSchema', default: '{ fields: [] }', description: 'The form being built (v-model): plain JSON, what MFormRenderer draws' },
  { name: 'types', type: 'FormFieldType[]', description: 'The field types in the palette, in order. All by default' },
]
const events: EventDef[] = [
  { name: 'update:modelValue', payload: 'FormSchema', description: 'The schema changed' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFormBuilder</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Design a form without code: add fields from the palette, drag them into order, set each one's label, name,
      rules, width, choices and when it shows, then try it in the preview. The result is a JSON schema that
      <RouterLink to="/components/inputs/mformrenderer" class="text-primary underline">MFormRenderer</RouterLink>
      draws anywhere: surveys, sign-up and order forms your users set up themselves. Not an M3 spec component.
    </p>

    <ComponentDemo
      title="Build a form"
      description="Pick a field to edit it on the right; drag the cards to reorder. Preview tries the form; JSON is what v-model holds."
      flush
      :code="`<MFormBuilder v-model=&quot;schema&quot; class=&quot;h-[40rem]&quot; />
<MFormRenderer :schema=&quot;schema&quot; @submit=&quot;send&quot; />`"
    >
      <MFormBuilder v-model="schema" class="h-[40rem] w-full rounded-none border-0" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <ComponentPager current="MFormBuilder" />
  </div>
</template>
