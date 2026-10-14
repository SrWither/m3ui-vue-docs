<script lang="ts">
// Module-level: the form survives going back to the shop and returning.
import { ref } from 'vue'

const step = ref(0)
const attempted = ref<boolean[]>([false, false, false])
const form = ref({
  name: '', email: '', phone: '', address: '', city: '', postcode: '', country: 'Argentina',
  notes: '',
  card: '', expiry: '', cvc: '', cardName: '',
})
/** The placed order: a snapshot of the cart and totals, since the cart is emptied right after. */
interface Placed { number: string; email: string; lines: { name: string; qty: number; price: number; img: string }[]; total: number; eta: string; delivery: string }
const placed = ref<Placed | null>(null)
const processing = ref(false)
const processingStep = ref(0)
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import { MButton, MIcon, MLoadingIndicator, MMaskField, MRadioGroup, MResult, MSelect, MStepper, MTextField } from '@m3ui-vue/m3ui-vue'
import type { StepItem } from '@m3ui-vue/m3ui-vue'
import { useStore, productById, picture, money, shippingOptions } from '../useStore'

const { cart, shipping, subtotal, discount, shippingCost, total, coupon, clearCart, go } = useStore()

const countries = ['Argentina', 'Chile', 'Mexico', 'Spain', 'United States', 'Uruguay'].map((c) => ({ label: c, value: c }))
const deliveryOptions = computed(() =>
  shippingOptions.map((o) => ({
    value: o.value,
    label: `${o.label}${o.value === 'standard' && subtotal.value - discount.value >= 50 ? ' · free over $50' : o.price ? ` · ${money(o.price)}` : ''}`,
  })),
)

// Validation: errors only show for a step after trying to leave it.
const f = form
const errors = computed(() => {
  const v = f.value
  const [month, year] = v.expiry.split('/').map(Number)
  const now = new Date()
  const expiryOk = !!month && month <= 12 && !!year && (2000 + year > now.getFullYear() || (2000 + year === now.getFullYear() && month >= now.getMonth() + 1))
  return [
    {
      name: !v.name.trim() && 'Enter your name',
      email: !/^\S+@\S+\.\S+$/.test(v.email) && 'Enter a valid email',
      address: !v.address.trim() && 'Enter your street address',
      city: !v.city.trim() && 'Enter your city',
      postcode: !v.postcode.trim() && 'Enter a postal code',
    },
    {},
    {
      card: v.card.replace(/\D/g, '').length !== 16 && 'Enter the 16 digits',
      expiry: !expiryOk && 'Use a future MM/YY date',
      cvc: v.cvc.length !== 3 && '3 digits',
      cardName: !v.cardName.trim() && 'Enter the name on the card',
    },
  ] as Record<string, string | false>[]
})
const err = (i: number, key: string) => (attempted.value[i] ? errors.value[i]?.[key] || '' : '')
const stepValid = (i: number) => !Object.values(errors.value[i] ?? {}).some(Boolean)

const steps = computed<StepItem[]>(() => [
  { label: 'Shipping', icon: 'home', error: attempted.value[0] && !stepValid(0) },
  { label: 'Delivery', icon: 'local_shipping' },
  { label: 'Payment', icon: 'credit_card', error: attempted.value[2] && !stepValid(2) },
  { label: 'Review', icon: 'fact_check' },
])

function next() {
  attempted.value[step.value] = true
  if (stepValid(step.value)) step.value++
}
// Only steps already passed can be revisited from the stepper.
function goTo(i: number) {
  if (i < step.value) step.value = i
}

function fillTestData() {
  form.value = {
    ...form.value,
    name: 'Alex Rivera', email: 'alex@mail.test', phone: '(011) 555-0199', address: 'Av. Siempre Viva 742', city: 'Buenos Aires', postcode: 'C1425',
    card: '4242 4242 4242 4242', expiry: '12/30', cvc: '123', cardName: 'ALEX RIVERA',
  }
}

const lastFour = computed(() => form.value.card.replace(/\D/g, '').slice(-4))
// "Paying": a few seconds of progress messages, then the receipt (nothing is charged).
const processingMessages = ['Contacting your bank…', 'Confirming payment…', 'Reserving your items…']
let timers: ReturnType<typeof setTimeout>[] = []
onBeforeUnmount(() => timers.forEach(clearTimeout))
function place() {
  processing.value = true
  processingStep.value = 0
  timers = [
    setTimeout(() => (processingStep.value = 1), 900),
    setTimeout(() => (processingStep.value = 2), 1800),
    setTimeout(() => {
      const option = shippingOptions.find((o) => o.value === shipping.value)!
      const eta = new Date()
      eta.setDate(eta.getDate() + (option.value === 'express' ? 1 : option.value === 'pickup' ? 0 : 4))
      placed.value = {
        number: `NK-${Math.floor(100000 + Math.random() * 900000)}`,
        email: form.value.email,
        lines: cart.value.map((l) => ({ name: productById(l.id).name, qty: l.qty, price: productById(l.id).price, img: picture(productById(l.id), l.color) })),
        total: total.value,
        eta: option.value === 'pickup' ? 'Ready for pickup today' : eta.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }),
        delivery: option.label,
      }
      processing.value = false
      clearCart()
      window.scrollTo({ top: 0 })
    }, 2700),
  ]
}

// Confetti in the palette's colors: pieces with random drift, spin and delay.
const confetti = Array.from({ length: 48 }, (_, i) => ({
  left: Math.random() * 100,
  delay: Math.random() * 0.6,
  duration: 1.8 + Math.random() * 1.4,
  drift: (Math.random() - 0.5) * 160,
  spin: (Math.random() - 0.5) * 900,
  color: ['bg-primary', 'bg-tertiary', 'bg-secondary', 'bg-primary-container', 'bg-tertiary-container'][i % 5],
  round: i % 3 === 0,
}))
function shopAgain() {
  placed.value = null
  step.value = 0
  attempted.value = [false, false, false]
  go({ name: 'shop' })
}
</script>

<template>
  <div>
    <!-- One root element: switching roots inside the store's page <Transition> left the new one stuck at opacity 0 -->
    <!-- Done: confetti, the result and the receipt -->
    <div v-if="placed" class="relative">
      <div class="pointer-events-none fixed inset-x-0 top-0 z-40 h-0" aria-hidden="true">
        <span
          v-for="(c, i) in confetti"
          :key="i"
          class="m3s-confetti absolute top-0 block"
          :class="[c.color, c.round ? 'h-2.5 w-2.5 rounded-full' : 'h-3 w-1.5 rounded-sm']"
          :style="{ left: `${c.left}%`, animationDelay: `${c.delay}s`, animationDuration: `${c.duration}s`, '--drift': `${c.drift}px`, '--spin': `${c.spin}deg` }"
        />
      </div>

      <MResult
        status="success"
        title="Thanks, your order is in!"
        :description="`We sent the receipt to ${placed.email}. Nothing was charged: this is a demo.`"
      >
        <template #actions>
          <MButton icon="storefront" @click="shopAgain">Keep shopping</MButton>
        </template>
      </MResult>

      <article class="m3s-receipt mx-auto max-w-md rounded-3xl bg-surface-container-low p-6">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-label-medium text-on-surface-variant">Order</p>
            <p class="text-title-medium tabular-nums text-on-surface">{{ placed.number }}</p>
          </div>
          <div class="text-right">
            <p class="text-label-medium text-on-surface-variant">{{ placed.eta.startsWith('Ready') ? 'Pickup' : 'Arrives' }}</p>
            <p class="text-title-small text-primary">{{ placed.eta }}</p>
          </div>
        </div>
        <ul class="flex flex-col gap-3 border-y border-outline-variant/60 py-4">
          <li v-for="l in placed.lines" :key="l.name + l.img" class="flex items-center gap-3">
            <img :src="l.img" alt="" class="h-12 w-14 rounded-lg object-cover" />
            <span class="flex-1 text-body-medium text-on-surface">{{ l.qty }} × {{ l.name }}</span>
            <span class="text-body-medium tabular-nums text-on-surface">{{ money(l.qty * l.price) }}</span>
          </li>
        </ul>
        <div class="flex items-center justify-between pt-4">
          <span class="flex items-center gap-2 text-body-medium text-on-surface-variant"><MIcon name="local_shipping" :size="20" /> {{ placed.delivery }}</span>
          <span class="text-title-medium tabular-nums text-on-surface">{{ money(placed.total) }}</span>
        </div>
      </article>
    </div>

    <!-- Empty cart -->
    <div v-else-if="!cart.length" class="flex flex-col items-center gap-3 py-20 text-center">
      <MIcon name="shopping_bag" :size="48" class="text-on-surface-variant" />
      <p class="text-title-medium text-on-surface">Your cart is empty</p>
      <MButton variant="tonal" @click="go({ name: 'shop' })">Browse products</MButton>
    </div>

    <div v-else class="flex flex-col gap-6">
      <div class="flex flex-wrap items-center gap-3">
        <MButton variant="text" icon="arrow_back" class="-ml-3" @click="go({ name: 'shop' })">Shop</MButton>
        <h1 class="flex-1 text-headline-small text-on-surface">Checkout</h1>
        <MButton variant="outlined" icon="auto_fix_high" @click="fillTestData">Fill with test data</MButton>
      </div>

      <MStepper :model-value="step" :steps="steps" :linear="false" @update:model-value="goTo" />

      <div class="grid gap-6 lg:grid-cols-3">
        <section class="rounded-3xl bg-surface-container-low p-5 sm:p-6 lg:col-span-2">
          <!-- 1. Shipping -->
          <div v-if="step === 0" class="grid gap-4 sm:grid-cols-2">
            <MTextField v-model="f.name" label="Full name" autocomplete="name" required :error="!!err(0, 'name')" :error-label="err(0, 'name')" class="sm:col-span-2" />
            <MTextField v-model="f.email" label="Email" type="email" autocomplete="email" required :error="!!err(0, 'email')" :error-label="err(0, 'email')" hint="For the receipt" />
            <MMaskField v-model="f.phone" label="Phone (optional)" mask="phone" />
            <MTextField v-model="f.address" label="Street address" autocomplete="street-address" required :error="!!err(0, 'address')" :error-label="err(0, 'address')" class="sm:col-span-2" />
            <MTextField v-model="f.city" label="City" autocomplete="address-level2" required :error="!!err(0, 'city')" :error-label="err(0, 'city')" />
            <MTextField v-model="f.postcode" label="Postal code" autocomplete="postal-code" required :error="!!err(0, 'postcode')" :error-label="err(0, 'postcode')" />
            <MSelect v-model="f.country" :options="countries" label="Country" class="sm:col-span-2" />
          </div>

          <!-- 2. Delivery -->
          <div v-else-if="step === 1" class="flex flex-col gap-5">
            <MRadioGroup v-model="shipping" :options="deliveryOptions" label="How should we get it to you?" />
            <MTextField v-model="f.notes" label="Notes for the courier (optional)" multiline :rows="3" />
          </div>

          <!-- 3. Payment -->
          <div v-else-if="step === 2" class="grid gap-4 sm:grid-cols-2">
            <p class="flex items-center gap-2 rounded-2xl bg-secondary-container px-4 py-3 text-body-medium text-on-secondary-container sm:col-span-2">
              <MIcon name="info" :size="20" /> Demo checkout: nothing is charged. Use 4242 4242 4242 4242 or "Fill with test data".
            </p>
            <MMaskField v-model="f.card" label="Card number" mask="credit-card" leading-icon="credit_card" required :error="!!err(2, 'card')" :error-label="err(2, 'card')" class="sm:col-span-2" />
            <MMaskField v-model="f.expiry" label="Expiry (MM/YY)" mask="##/##" required :error="!!err(2, 'expiry')" :error-label="err(2, 'expiry')" />
            <MMaskField v-model="f.cvc" label="CVC" mask="###" required :error="!!err(2, 'cvc')" :error-label="err(2, 'cvc')" />
            <MTextField v-model="f.cardName" label="Name on card" autocomplete="cc-name" required :error="!!err(2, 'cardName')" :error-label="err(2, 'cardName')" class="sm:col-span-2" />
          </div>

          <!-- 4. Review -->
          <div v-else class="flex flex-col gap-5">
            <div v-for="(block, i) in [
              { icon: 'home', title: 'Ship to', lines: [f.name, f.address, `${f.city} ${f.postcode}, ${f.country}`, f.email], step: 0 },
              { icon: 'local_shipping', title: 'Delivery', lines: [shippingOptions.find((o) => o.value === shipping)!.label, f.notes].filter(Boolean), step: 1 },
              { icon: 'credit_card', title: 'Payment', lines: [`Card ending in ${lastFour}`, f.cardName], step: 2 },
            ]" :key="i" class="flex items-start gap-3">
              <MIcon :name="block.icon" class="mt-0.5 text-primary" />
              <div class="flex-1">
                <p class="text-title-small text-on-surface">{{ block.title }}</p>
                <p v-for="line in block.lines" :key="line" class="text-body-medium text-on-surface-variant">{{ line }}</p>
              </div>
              <MButton variant="text" @click="step = block.step">Edit</MButton>
            </div>
          </div>

          <div class="mt-6 flex justify-between gap-3">
            <MButton v-if="step > 0" variant="outlined" icon="arrow_back" @click="step--">Back</MButton>
            <span v-else />
            <MButton v-if="step < 3" icon="arrow_forward" @click="next">Continue</MButton>
            <MButton v-else icon="lock" :loading="processing" :disabled="processing" @click="place">Place order · {{ money(total) }}</MButton>
          </div>
        </section>

        <!-- Summary -->
        <aside class="h-fit rounded-3xl bg-surface-container-low p-5 sm:p-6">
          <h2 class="mb-4 text-title-large text-on-surface">Order summary</h2>
          <ul class="mb-4 flex flex-col gap-3">
            <li v-for="l in cart" :key="l.key" class="flex items-center gap-3">
              <div class="relative shrink-0">
                <img :src="picture(productById(l.id), l.color)" alt="" class="h-14 w-16 rounded-lg object-cover" />
                <span class="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-on-surface-variant px-1 text-label-small text-surface">{{ l.qty }}</span>
              </div>
              <span class="min-w-0 flex-1 truncate text-body-medium text-on-surface">{{ productById(l.id).name }}</span>
              <span class="text-body-medium tabular-nums text-on-surface">{{ money(l.qty * productById(l.id).price) }}</span>
            </li>
          </ul>
          <dl class="flex flex-col gap-1 border-t border-outline-variant/60 pt-4 text-body-medium">
            <div class="flex justify-between"><dt class="text-on-surface-variant">Subtotal</dt><dd class="tabular-nums">{{ money(subtotal) }}</dd></div>
            <div v-if="discount" class="flex justify-between"><dt class="text-on-surface-variant">Discount ({{ coupon }})</dt><dd class="tabular-nums text-tertiary">−{{ money(discount) }}</dd></div>
            <div class="flex justify-between"><dt class="text-on-surface-variant">Shipping</dt><dd class="tabular-nums">{{ shippingCost ? money(shippingCost) : 'Free' }}</dd></div>
            <div class="mt-2 flex justify-between text-title-medium text-on-surface"><dt>Total</dt><dd class="tabular-nums">{{ money(total) }}</dd></div>
          </dl>
        </aside>
      </div>
  
      <!-- Paying -->
      <Transition name="m3s-processing">
        <div v-if="processing" class="fixed inset-0 z-50 flex items-center justify-center bg-scrim/32 p-6">
          <div class="flex w-full max-w-xs flex-col items-center gap-4 rounded-3xl bg-surface-container-high p-8 text-center shadow-elevation-3" role="status" aria-live="polite">
            <MLoadingIndicator contained :size="56" />
            <Transition name="m3s-message" mode="out-in">
              <p :key="processingStep" class="text-title-medium text-on-surface">{{ processingMessages[processingStep] }}</p>
            </Transition>
            <p class="text-body-small text-on-surface-variant">Please don't close this page</p>
          </div>
        </div>
      </Transition>
    </div>

  </div>
</template>

<style scoped>
.m3s-confetti {
  animation-name: m3s-fall;
  animation-timing-function: cubic-bezier(0.3, 0.4, 0.6, 1);
  animation-fill-mode: both;
}
@keyframes m3s-fall {
  from {
    transform: translate(0, -20px) rotate(0);
    opacity: 1;
  }
  to {
    transform: translate(var(--drift), 100vh) rotate(var(--spin));
    opacity: 0;
  }
}
.m3s-receipt {
  animation: m3s-rise 500ms 200ms cubic-bezier(0.05, 0.7, 0.1, 1) both;
}
@keyframes m3s-rise {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
}
.m3s-processing-enter-active,
.m3s-processing-leave-active {
  transition: opacity 200ms;
}
.m3s-processing-enter-from,
.m3s-processing-leave-to {
  opacity: 0;
}
.m3s-message-enter-active,
.m3s-message-leave-active {
  transition: opacity 150ms, transform 150ms;
}
.m3s-message-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.m3s-message-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
@media (prefers-reduced-motion: reduce) {
  .m3s-confetti {
    display: none;
  }
  .m3s-receipt {
    animation: none;
  }
}
</style>
