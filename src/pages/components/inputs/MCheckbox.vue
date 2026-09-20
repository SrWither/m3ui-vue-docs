<script setup lang="ts">
import { ref } from 'vue'
import { MCheckbox } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const checked = ref(false)
const indeterminate = ref(true)

const checkboxProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Checked state (v-model)' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Indeterminate state' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the checkbox' },
  { name: 'label', type: 'string', description: 'Label text — overridden by the default slot when present' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error'", default: "'primary'", description: 'Checked/indeterminate color' },
]

const checkboxSlots: SlotDef[] = [
  { name: 'default', description: 'Custom label content — overrides the label prop when provided' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCheckbox</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A checkbox with checked, indeterminate, and disabled states, and 4 semantic color options.
    </p>

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

    <ComponentDemo
      title="Checkbox Colors"
      description="color accepts any of the 4 M3 roles — tie a checkbox to a semantic meaning (e.g. error) without hardcoding a custom hex."
      :code="`<template>
  <MCheckbox :model-value=&quot;true&quot; color=&quot;primary&quot; label=&quot;Primary&quot; />
  <MCheckbox :model-value=&quot;true&quot; color=&quot;secondary&quot; label=&quot;Secondary&quot; />
  <MCheckbox :model-value=&quot;true&quot; color=&quot;tertiary&quot; label=&quot;Tertiary&quot; />
  <MCheckbox :model-value=&quot;true&quot; color=&quot;error&quot; label=&quot;Error&quot; />
</template>`"
    >
      <div class="flex flex-wrap items-center gap-4">
        <MCheckbox :model-value="true" color="primary" label="Primary" />
        <MCheckbox :model-value="true" color="secondary" label="Secondary" />
        <MCheckbox :model-value="true" color="tertiary" label="Tertiary" />
        <MCheckbox :model-value="true" color="error" label="Error" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom label content"
      description="The default slot overrides label with any markup — e.g. linking out to terms of service."
      :code="`<MCheckbox v-model=&quot;accepted&quot;>
  I agree to the <a href=&quot;#&quot;>Terms of Service</a>
</MCheckbox>`"
    >
      <MCheckbox :model-value="true">
        I agree to the <a href="#" class="text-primary underline" @click.prevent>Terms of Service</a>
      </MCheckbox>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="checkboxProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="checkboxSlots" />

    <ComponentPager current="MCheckbox" />
  </div>
</template>
