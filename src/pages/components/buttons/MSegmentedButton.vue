<script setup lang="ts">
import { ref } from 'vue'
import { MSegmentedButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const segmentedProps: PropDef[] = [
  { name: 'modelValue', type: 'string | number | (string | number)[]', description: 'Selected value(s)' },
  { name: 'options', type: 'SegmentedOption[]', description: 'See the type below' },
  { name: 'multiSelect', type: 'boolean', default: 'false', description: 'Allow multiple selections' },
  { name: 'density', type: "'default' | 'comfortable' | 'compact'", default: "'default'", description: 'Button density' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary'", default: "'primary'", description: 'Selected segment color' },
]

const segmentedEvents = [
  { name: 'update:modelValue', payload: 'string | number | (string | number)[]', description: 'Emitted on selection change — powers v-model' },
]

const segmentedTypes: TypeDef[] = [
  {
    name: 'SegmentedOption',
    fields: [
      { name: 'value', type: 'string | number', required: true, description: 'Option value' },
      { name: 'label', type: 'string', required: true, description: 'Segment text' },
      { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
      { name: 'disabled', type: 'boolean', description: 'Disables the segment' },
    ],
  },
]

const segmentedValue = ref('day')
const segmentedMulti = ref<string[]>(['bold'])
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSegmentedButton</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A row of joined segments for choosing between a small set of related options — single or multi select.
    </p>

    <ComponentDemo
      title="Single Select"
      description="Only one segment can be active at a time."
      :code="`<template>
  <MSegmentedButton
    v-model=&quot;value&quot;
    :options=&quot;[
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ]&quot;
  />
</template>`"
    >
      <MSegmentedButton
        v-model="segmentedValue"
        :options="[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ]"
      />
      <span class="text-body-medium text-on-surface-variant">Selected: {{ segmentedValue }}</span>
    </ComponentDemo>

    <ComponentDemo
      title="Multi Select"
      description="Multiple segments can be active simultaneously."
      :code="`<template>
  <MSegmentedButton
    v-model=&quot;values&quot;
    :options=&quot;[
      { value: 'bold', label: 'Bold', icon: 'format_bold' },
      { value: 'italic', label: 'Italic', icon: 'format_italic' },
      { value: 'underline', label: 'Underline', icon: 'format_underlined' },
    ]&quot;
    :multi-select=&quot;true&quot;
  />
</template>`"
    >
      <MSegmentedButton
        v-model="segmentedMulti"
        :options="[
          { value: 'bold', label: 'Bold', icon: 'format_bold' },
          { value: 'italic', label: 'Italic', icon: 'format_italic' },
          { value: 'underline', label: 'Underline', icon: 'format_underlined' },
        ]"
        :multi-select="true"
      />
      <span class="text-body-medium text-on-surface-variant">Selected: {{ segmentedMulti.join(', ') }}</span>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="segmentedProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="segmentedEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="segmentedTypes" />

    <ComponentPager current="MSegmentedButton" />
  </div>
</template>
