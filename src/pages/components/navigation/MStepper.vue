<script setup lang="ts">
import { ref } from 'vue'
import { MStepper, MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const stepperProps: PropDef[] = [
  { name: 'modelValue', type: 'number', description: 'Active step index (0-based), v-model' },
  { name: 'steps', type: 'StepItem[]', description: 'Step definitions (see the type below)' },
  { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction' },
  { name: 'linear', type: 'boolean', default: 'true', description: 'When true, steps are not clickable — only the active step changes via v-model from outside. When false, any non-active step can be clicked to jump to it.' },
]

const stepperSlots: SlotDef[] = [
  { name: '#step-{i}', description: "Vertical direction only: content shown below a step's label/description while that step (index i) is the active one, e.g. #step-0, #step-1." },
]

const stepperTypes: TypeDef[] = [
  {
    name: 'StepItem',
    fields: [
      { name: 'label', type: 'string', required: true, description: 'Step title' },
      { name: 'description', type: 'string', description: 'Secondary text below the label' },
      { name: 'icon', type: 'string', description: 'Material Symbol icon shown in the circle (inactive/active states only)' },
      { name: 'optional', type: 'boolean', description: 'Shows an "Optional" hint below the label' },
      { name: 'error', type: 'boolean', description: 'Renders the circle/label in the error color with a warning icon' },
    ],
  },
]

const stepperVal = ref(1)
const steps = [
  { label: 'Account', description: 'Create your account', icon: 'person' },
  { label: 'Profile', description: 'Set up your profile', icon: 'badge' },
  { label: 'Settings', description: 'Configure preferences', icon: 'settings' },
  { label: 'Done', description: 'All set!', icon: 'check_circle' },
]

const errorSteps = [
  { label: 'Cart', icon: 'shopping_cart' },
  { label: 'Payment', icon: 'credit_card', error: true },
  { label: 'Confirm', icon: 'check_circle', optional: true },
]
const errorStepVal = ref(1)

const verticalVal = ref(0)
const verticalSteps = [
  { label: 'Shipping address', description: 'Where should we send it?' },
  { label: 'Payment method', description: 'How would you like to pay?' },
  { label: 'Review', description: 'Confirm your order' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MStepper</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A multi-step wizard, horizontal or vertical, with icons, descriptions, and optional/error states.
    </p>

    <ComponentDemo
      title="Horizontal Stepper"
      description="Multi-step wizard with icons and descriptions."
      :code="`<MStepper v-model=&quot;step&quot; :steps=&quot;steps&quot; :linear=&quot;false&quot; />`"
      :script="`const step = ref(1)
const steps = [
  { label: 'Account', description: 'Create your account', icon: 'person' },
  { label: 'Profile', description: 'Set up your profile', icon: 'badge' },
  { label: 'Settings', description: 'Configure preferences', icon: 'settings' },
  { label: 'Done', description: 'All set!', icon: 'check_circle' },
]`"
    >
      <div class="w-full">
        <MStepper v-model="stepperVal" :steps="steps" :linear="false" />
        <div class="mt-4 flex justify-center gap-3">
          <MButton variant="outlined" :disabled="stepperVal === 0" @click="stepperVal--">Back</MButton>
          <MButton :disabled="stepperVal === steps.length - 1" @click="stepperVal++">Next</MButton>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Error and Optional Steps"
      description="A step with error: true shows in the error color with a warning icon; optional: true adds an 'Optional' hint below the label."
      :code="`<MStepper v-model=&quot;step&quot; :steps=&quot;steps&quot; :linear=&quot;false&quot; />`"
      :script="`const steps = [
  { label: 'Cart', icon: 'shopping_cart' },
  { label: 'Payment', icon: 'credit_card', error: true },
  { label: 'Confirm', icon: 'check_circle', optional: true },
]`"
    >
      <div class="w-full max-w-md">
        <MStepper v-model="errorStepVal" :steps="errorSteps" :linear="false" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Vertical Stepper"
      description="Vertical layout for longer step descriptions."
      :code="`<template>
  <MStepper v-model=&quot;step&quot; :steps=&quot;steps&quot; direction=&quot;vertical&quot; />
</template>`"
    >
      <div class="w-full max-w-md">
        <MStepper v-model="stepperVal" :steps="steps" direction="vertical" :linear="false" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Vertical with Step Content"
      description="Use the dynamic #step-{i} slot to render custom content (e.g. a form) below the active step only, in vertical direction."
      :code="`<MStepper v-model=&quot;step&quot; :steps=&quot;steps&quot; direction=&quot;vertical&quot;>
  <template #step-0>
    <MButton size=&quot;xs&quot; @click=&quot;step = 1&quot;>Continue</MButton>
  </template>
  <template #step-1>
    <MButton size=&quot;xs&quot; @click=&quot;step = 2&quot;>Continue</MButton>
  </template>
</MStepper>`"
    >
      <div class="w-full max-w-md">
        <MStepper v-model="verticalVal" :steps="verticalSteps" direction="vertical">
          <template #step-0>
            <MButton size="xs" @click="verticalVal = 1">Continue</MButton>
          </template>
          <template #step-1>
            <div class="flex gap-2">
              <MButton size="xs" variant="outlined" @click="verticalVal = 0">Back</MButton>
              <MButton size="xs" @click="verticalVal = 2">Continue</MButton>
            </div>
          </template>
          <template #step-2>
            <div class="flex gap-2">
              <MButton size="xs" variant="outlined" @click="verticalVal = 1">Back</MButton>
              <MButton size="xs" color="primary">Place order</MButton>
            </div>
          </template>
        </MStepper>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="stepperProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="stepperSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="stepperTypes" />

    <ComponentPager current="MStepper" />
  </div>
</template>
