<script setup lang="ts">
import { ref } from 'vue'
import { MCreditCardInput, MButton } from '@m3ui-vue/m3ui-vue'
import type { CreditCardValue } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const card = ref<CreditCardValue>({ number: '', expiry: '', cvc: '' })
const brand = ref('unknown')

const card2 = ref<CreditCardValue>({ number: '', expiry: '', cvc: '', name: '' })
const form = ref<InstanceType<typeof MCreditCardInput> | null>(null)
const log = ref('')
const serverErrors = ref<Record<string, string>>({})
function pay() {
  serverErrors.value = {}
  if (!form.value?.validate()) {
    log.value = 'validate() → false'
    return
  }
  log.value = 'POST /api/payments { token: "tok_…" }'
  if (card2.value.number.endsWith('0002')) {
    setTimeout(() => {
      serverErrors.value = { number: 'Your card was declined' }
      log.value += ' → 402 declined'
    }, 600)
  }
}

const card3 = ref<CreditCardValue>({ number: '', expiry: '', cvc: '' })

const props: PropDef[] = [
  { name: 'modelValue', type: 'CreditCardValue', description: 'Card value (v-model): { number (digits only), expiry (MM/YY), cvc, name? }' },
  { name: 'preview', type: 'boolean', default: 'true', description: 'Shows the card preview above the fields' },
  { name: 'showName', type: 'boolean', default: 'false', description: 'Adds the "Name on card" field' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Visual style of the fields' },
  { name: 'autoAdvance', type: 'boolean', default: 'true', description: 'Moves focus to the next field once one is complete and valid' },
  { name: 'errors', type: "Partial<Record<'number' | 'expiry' | 'cvc' | 'name', string>>", description: 'Error messages shown regardless of the built-in checks, e.g. a decline from the server' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables every field' },
  { name: 'error', type: 'boolean | string', description: 'Error state. A string is also the message' },
  { name: 'errorLabel', type: 'string', description: 'Error message shown when error is true' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Inside an MForm or with rules, an empty card fails (an optional empty card passes; a half-typed one never does)' },
  { name: 'rules', type: 'ValidationRule | ValidationRule[]', description: "Validation rules: functions (value, ctx) => true | 'message' (may be async) or a Standard Schema. See MForm" },
  { name: 'validateOn', type: "'blur' | 'input' | 'submit'", default: "'blur'", description: 'When the rules are checked and shown' },
  { name: 'validateDebounce', type: 'number', description: "Wait this long (ms) after the value stops changing before re-checking: one request for an async rule, not one per key. Defaults to its MForm's" },
  { name: 'name', type: 'string', description: 'The key of this field in its MForm' },
]

const slots: SlotDef[] = [
  { name: 'brand', description: 'Replaces the network name on the preview (e.g. with your own logo)', scope: '{ brand, name }' },
]

const events: EventDef[] = [
  { name: 'blur', payload: '—', description: 'Focus left it (wire a validation library\'s touch here)' },
  { name: 'update:modelValue', payload: 'CreditCardValue', description: 'Emitted on every change' },
  { name: 'complete', payload: 'CreditCardValue', description: 'Emitted when every field becomes valid' },
  { name: 'brand', payload: 'CardBrand', description: 'Emitted when the detected network changes' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCreditCardInput</h1>
    <p class="mb-4 text-body-large text-on-surface-variant">
      Card payment fields: number, expiry, security code and optionally the cardholder's name, with a live card preview
      that turns over while the security code is typed. The number is grouped the way its network prints it (4-6-5 for
      American Express), the network is detected from the first digits, and every field is checked: length, Luhn
      checksum, a future expiry and the code's length for that network.
    </p>
    <p class="mb-8 text-body-large text-on-surface-variant">
      It only collects and checks what is typed: it doesn't tokenize or send anything. Hand the value to your payment
      provider's SDK. The checks are also exported on their own: <code>detectCardBrand</code>, <code>luhnCheck</code>,
      <code>formatCardNumber</code>, <code>isValidCardNumber</code>, <code>isValidExpiry</code>.
    </p>

    <ComponentDemo
      title="Card with preview"
      description="Try 4242 4242 4242 4242 (Visa), 3782 822463 10005 (American Express, 4-digit code) or 5555 5555 5555 4444 (Mastercard). Focus moves on by itself; the card turns over on the security code."
      :code="`<MCreditCardInput v-model=&quot;card&quot; @brand=&quot;brand = $event&quot; />`"
      :script="`import { MCreditCardInput, type CreditCardValue } from '@m3ui-vue/m3ui-vue'

const card = ref<CreditCardValue>({ number: '', expiry: '', cvc: '' })`"
    >
      <div class="flex w-full max-w-sm flex-col gap-3">
        <MCreditCardInput v-model="card" @brand="brand = $event" />
        <p class="text-body-small text-on-surface-variant">{{ JSON.stringify(card) }} · brand: {{ brand }}</p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Checkout form"
      description="validate() (through a template ref) shows every field's error and returns whether all are valid. errors shows messages from your server; a number ending in 0002 is &quot;declined&quot; here."
      :code="`<MCreditCardInput ref=&quot;form&quot; v-model=&quot;card&quot; show-name variant=&quot;outlined&quot; :preview=&quot;false&quot; :errors=&quot;serverErrors&quot; />
<MButton @click=&quot;pay&quot;>Pay $24.00</MButton>`"
      :script="`const form = ref<InstanceType<typeof MCreditCardInput> | null>(null)
const serverErrors = ref({})

async function pay() {
  if (!form.value?.validate()) return
  const res = await payments.charge(card.value)
  if (res.declined) serverErrors.value = { number: 'Your card was declined' }
}`"
    >
      <div class="flex w-full max-w-sm flex-col gap-4">
        <MCreditCardInput ref="form" v-model="card2" show-name variant="outlined" :preview="false" :errors="serverErrors" />
        <MButton icon="lock" @click="pay">Pay $24.00</MButton>
        <p v-if="log" class="font-mono text-body-small text-on-surface-variant">{{ log }}</p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Your own brand mark"
      description="The brand slot replaces the network name on the preview, e.g. with your own logos."
      :code="`<MCreditCardInput v-model=&quot;card&quot;>
  <template #brand=&quot;{ brand, name }&quot;>
    <img v-if=&quot;brand !== 'unknown'&quot; :src=&quot;\`/cards/\${brand}.svg\`&quot; :alt=&quot;name&quot; class=&quot;h-8&quot; />
  </template>
</MCreditCardInput>`"
    >
      <div class="w-full max-w-sm">
        <MCreditCardInput v-model="card3">
          <template #brand="{ brand: b, name }">
            <span v-if="b !== 'unknown'" class="rounded-full bg-on-primary px-3 py-1 text-label-large text-primary">{{ name }}</span>
          </template>
        </MCreditCardInput>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Exposed</h3>
    <p class="mb-6 text-body-medium text-on-surface-variant">
      Through a template ref: <code>validate()</code> (shows every error, returns a boolean), <code>valid</code>,
      <code>brand</code> and <code>focus(field?)</code>.
    </p>

    <ComponentPager current="MCreditCardInput" />
  </div>
</template>
