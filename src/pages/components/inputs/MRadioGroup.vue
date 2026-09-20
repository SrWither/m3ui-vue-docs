<script setup lang="ts">
import { ref } from 'vue'
import { MRadioGroup } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const radioVal = ref('a')
const radioOptions = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
]

const radioColorVal = ref('error')

const radioGroupProps: PropDef[] = [
  { name: 'modelValue', type: 'unknown', description: 'Selected value (v-model)' },
  { name: 'options', type: '{ label: string, value: unknown, disabled?: boolean }[]', description: 'Radio options' },
  { name: 'label', type: 'string', description: 'Group label' },
  { name: 'direction', type: "'column' | 'row'", default: "'column'", description: 'Layout direction' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all radios' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error'", default: "'primary'", description: 'Radio color' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MRadioGroup</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A group of radio buttons sharing a single selection, column or row layout.
    </p>

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

    <ComponentDemo
      title="Colors"
      description="color accepts any of the 4 M3 roles, same set as MCheckbox/MSwitch."
      :code="`<MRadioGroup v-model=&quot;value&quot; :options=&quot;options&quot; color=&quot;error&quot; label=&quot;Priority&quot; />`"
    >
      <MRadioGroup
        v-model="radioColorVal"
        :options="[{ label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' }, { label: 'High', value: 'error' }]"
        color="error"
        label="Priority"
        direction="row"
      />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="radioGroupProps" />

    <ComponentPager current="MRadioGroup" />
  </div>
</template>
