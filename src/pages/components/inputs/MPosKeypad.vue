<script setup lang="ts">
import { ref } from 'vue'
import { MPosKeypad, MCard } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const cash = ref('')
const cashLog = ref('')

const shiftAmount = ref('')

const pin = ref('')
const pinMsg = ref('Enter your 4-digit waiter PIN (try 1234)')
function checkPin(v: string) {
  pinMsg.value = v === '1234' ? 'Welcome back, Sam' : 'Wrong PIN'
  setTimeout(() => (pin.value = ''), 500)
}

const qty = ref('1')

const props: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'Value (v-model): a decimal string like "12.50", or the digits of a PIN' },
  { name: 'mode', type: "'amount' | 'integer' | 'pin'", default: "'amount'", description: 'Amount with decimals and currency, a whole quantity, or a PIN shown as dots' },
  { name: 'decimals', type: 'number', default: '2', description: 'Decimal places of an amount' },
  { name: 'entry', type: "'free' | 'shift'", default: "'free'", description: 'free: a decimal-point key. shift: cash register style, digits shift in from the right, with a 00 key' },
  { name: 'currency', type: 'string', description: 'ISO 4217 code (e.g. "USD") to format the amount as money' },
  { name: 'max', type: 'number', description: 'Largest amount accepted; keys that would pass it are ignored' },
  { name: 'maxLength', type: 'number', description: 'Most digits accepted. In pin mode, filling it emits submit on its own' },
  { name: 'quickAmounts', type: 'number[]', description: 'Chips with preset amounts above the keys' },
  { name: 'quickMode', type: "'set' | 'add'", default: "'set'", description: 'Whether a quick amount replaces the value or adds to it' },
  { name: 'due', type: 'number', description: 'Amount due: shows what remains, or the change once it is covered' },
  { name: 'actionLabel', type: 'string', description: 'Label of the submit button; without it there is no button' },
  { name: 'actionIcon', type: 'string', description: 'Material Symbol on the submit button' },
  { name: 'actionDisabled', type: 'boolean', description: "Disables the submit button. By default it's disabled while empty or not covering due" },
  { name: 'hideDisplay', type: 'boolean', default: 'false', description: 'Hides the value display' },
  { name: 'keyboard', type: "'focus' | 'global' | 'none'", default: "'focus'", description: 'Physical keyboard: while the keypad is focused, always (never stealing from text fields), or never' },
  { name: 'haptics', type: 'boolean', default: 'false', description: 'A short vibration on every key, where supported' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables every key' },
]

const slots: SlotDef[] = [
  { name: 'display', description: 'Replaces the value display', scope: '{ value, formatted, amount }' },
  { name: 'action', description: 'Replaces the submit button', scope: '{ value, amount, submit }' },
]

const events: EventDef[] = [
  { name: 'update:modelValue', payload: 'string', description: 'Emitted on every key' },
  { name: 'submit', payload: 'string', description: 'Emitted by the action button or Enter (and by a full PIN)' },
  { name: 'key', payload: 'string', description: "Every key press: '0'–'9', '00', '.', 'backspace', 'clear'" },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MPosKeypad</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A large touch keypad for a point of sale, a kiosk or a cash drawer: amounts, quantities, a waiter's PIN. It shows
      the value formatted (with a currency when one is given), can enter amounts cash-register style, offers quick-amount
      chips and, given the amount due, shows what's left to pay or the change to give back. Holding delete clears
      everything, and with the keypad focused the physical keyboard works too (digits, <code>.</code>/<code>,</code>,
      Backspace, Escape, Enter).
    </p>

    <ComponentDemo
      title="Cash payment"
      description="With due, the display shows what's still missing and, once covered, the change. Quick amounts set the value in one tap; Charge stays disabled until the amount covers the total."
      :code="`<MPosKeypad
  v-model=&quot;received&quot;
  currency=&quot;USD&quot;
  :due=&quot;37.40&quot;
  :quick-amounts=&quot;[40, 50, 100]&quot;
  action-label=&quot;Charge&quot;
  action-icon=&quot;payments&quot;
  @submit=&quot;charge&quot;
/>`"
      :script="`const received = ref('')`"
    >
      <div class="flex w-full justify-center">
      <MCard variant="outlined" class="w-full max-w-xs p-4">
        <p class="mb-2 text-title-small text-on-surface-variant">Table 7 · Total $37.40</p>
        <MPosKeypad
          v-model="cash"
          currency="USD"
          :due="37.4"
          :quick-amounts="[40, 50, 100]"
          action-label="Charge"
          action-icon="payments"
          @submit="cashLog = `POST /api/tables/7/pay { cash: ${$event} }`"
        />
        <p v-if="cashLog" class="mt-3 font-mono text-body-small text-on-surface-variant">{{ cashLog }}</p>
      </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Cash register entry"
      description="entry=&quot;shift&quot; fills from the right like a register: 1, 2, 5, 0 is 12.50, and the bottom-left key is 00."
      :code="`<MPosKeypad v-model=&quot;amount&quot; entry=&quot;shift&quot; currency=&quot;EUR&quot; :max=&quot;9999&quot; />`"
    >
      <div class="mx-auto w-full max-w-xs">
        <MPosKeypad v-model="shiftAmount" entry="shift" currency="EUR" :max="9999" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="PIN and quantity"
      description="mode=&quot;pin&quot; shows dots and keeps leading zeros; with maxLength it submits on its own when full. mode=&quot;integer&quot; is for quantities, here with a custom display."
      :code="`<MPosKeypad v-model=&quot;pin&quot; mode=&quot;pin&quot; :max-length=&quot;4&quot; @submit=&quot;checkPin&quot; />

<MPosKeypad v-model=&quot;qty&quot; mode=&quot;integer&quot; :max=&quot;99&quot;>
  <template #display=&quot;{ amount }&quot;>
    <span class=&quot;text-display-small&quot;>× {{ amount }}</span>
  </template>
</MPosKeypad>`"
    >
      <div class="grid w-full gap-8 sm:grid-cols-2">
        <div class="flex flex-col items-center gap-2">
          <p class="text-body-medium text-on-surface-variant">{{ pinMsg }}</p>
          <MPosKeypad v-model="pin" mode="pin" :max-length="4" class="w-full max-w-xs" @submit="checkPin" />
        </div>
        <div class="flex flex-col items-center gap-2">
          <p class="text-body-medium text-on-surface-variant">Quantity of Margherita pizza</p>
          <MPosKeypad v-model="qty" mode="integer" :max="99" class="w-full max-w-xs">
            <template #display="{ amount }">
              <span class="text-display-small text-on-surface">× {{ amount }}</span>
            </template>
          </MPosKeypad>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <ComponentPager current="MPosKeypad" />
  </div>
</template>
