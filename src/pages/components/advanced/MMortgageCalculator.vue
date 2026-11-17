<script setup lang="ts">
import { ref } from 'vue'
import { MMortgageCalculator, MSegmentedButton, amortize } from '@m3ui-vue/m3ui-vue'
import type { MortgageInput } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const loan = ref<MortgageInput>({ price: 420_000, down: 84_000, rate: 6.25, years: 30 })
const system = ref<'french' | 'german'>('french')

const quote: MortgageInput = { price: 180_000, down: 36_000, rate: 4.9, years: 20 }
const helper = amortize({ principal: 144_000, rate: 4.9, years: 20 })

const props: PropDef[] = [
  { name: 'modelValue', type: 'MortgageInput', description: 'Required. { price, down, rate, years } (v-model); rate is yearly %' },
  { name: 'system', type: "'french' | 'german'", default: "'french'", description: 'Fixed payment, or fixed principal with falling payments' },
  { name: 'terms', type: 'number[]', default: '[10, 15, 20, 25, 30]', description: 'Terms offered, in years' },
  { name: 'extras', type: '{ label, amount }[]', default: '[]', description: 'Monthly costs on top of the payment: tax, insurance, HOA' },
  { name: 'currency', type: 'string', description: 'ISO 4217 code to format amounts' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'outlined'", description: 'Field style' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Only the results, no inputs (a read-only quote)' },
  { name: 'scheduleOpen', type: 'boolean', default: 'false', description: 'Starts with the yearly schedule open' },
]

const slots: SlotDef[] = [
  { name: 'summary', description: 'Replaces the result panel', scope: '{ loan, monthly, schedule }' },
]

const events: EventDef[] = [
  { name: 'update:modelValue', payload: 'MortgageInput', description: 'An input changed' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMortgageCalculator</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A mortgage or loan calculator for a property listing or a bank: price, down payment, rate and term in; the
      monthly payment, the split between principal and interest, and the yearly amortization schedule out. It does the
      french system (the same payment every month) and the german one (the same principal every month, so payments
      fall). The math is exported on its own as <code>amortize()</code>.
    </p>

    <ComponentDemo
      title="Listing calculator"
      description="Type the price, drag the down payment, pick a term. Monthly extras are added to the payment. Switch the system to see the german schedule's falling payments."
      :code="`<MMortgageCalculator
  v-model=&quot;loan&quot;
  :system=&quot;system&quot;
  currency=&quot;USD&quot;
  :extras=&quot;[{ label: 'Property tax', amount: 310 }, { label: 'Insurance', amount: 95 }]&quot;
/>`"
      :script="`const loan = ref<MortgageInput>({ price: 420000, down: 84000, rate: 6.25, years: 30 })`"
    >
      <div class="flex w-full flex-col gap-4">
        <MSegmentedButton
          v-model="system"
          class="self-start"
          density="compact"
          :options="[{ value: 'french', label: 'Fixed payment' }, { value: 'german', label: 'Fixed principal' }]"
        />
        <MMortgageCalculator
          v-model="loan"
          :system="system"
          currency="USD"
          :extras="[{ label: 'Property tax', amount: 310 }, { label: 'Insurance', amount: 95 }]"
        />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Read-only quote and the bare math"
      description="readonly shows only the results, e.g. on a pre-approved offer. amortize() returns the whole schedule for your own UI."
      :code="`<MMortgageCalculator :model-value=&quot;quote&quot; readonly currency=&quot;EUR&quot; />

import { amortize } from '@m3ui-vue/m3ui-vue'
const { firstPayment, totalInterest, payments } = amortize({ principal: 144000, rate: 4.9, years: 20 })`"
    >
      <div class="flex w-full flex-col gap-4">
        <MMortgageCalculator :model-value="quote" readonly currency="EUR" class="w-full max-w-md" />
        <p class="font-mono text-body-small text-on-surface-variant">
          amortize() → firstPayment {{ helper.firstPayment }} · totalInterest {{ helper.totalInterest }} · {{ helper.payments.length }} payments
        </p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <ComponentPager current="MMortgageCalculator" />
  </div>
</template>
