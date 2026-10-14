<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MIcon, MIconButton, MSideSheet, MTextField } from '@m3ui-vue/m3ui-vue'
import { useStore, productById, picture, money } from '../useStore'

const { cart, cartOpen, coupon, setQty, applyCoupon, count, subtotal, discount, go } = useStore()

const code = ref('')
const codeError = ref(false)
function apply() {
  codeError.value = !applyCoupon(code.value)
  if (!codeError.value) code.value = ''
}
function checkout() {
  cartOpen.value = false
  go({ name: 'checkout' })
}
const toFree = () => Math.max(0, 50 - (subtotal.value - discount.value))
</script>

<template>
  <MSideSheet v-model="cartOpen" :title="`Your cart${count ? ` (${count})` : ''}`" width="w-[26rem]">
    <div v-if="!cart.length" class="flex flex-col items-center gap-3 py-16 text-center">
      <MIcon name="shopping_bag" :size="48" class="text-on-surface-variant" />
      <p class="text-title-medium text-on-surface">Your cart is empty</p>
      <MButton variant="tonal" @click="cartOpen = false; go({ name: 'shop' })">Browse products</MButton>
    </div>

    <div v-else class="flex flex-col gap-5">
      <!-- Free shipping progress -->
      <div class="rounded-2xl bg-surface-container p-3 text-body-medium text-on-surface">
        <template v-if="toFree() > 0">Add <strong>{{ money(toFree()) }}</strong> more for free standard shipping</template>
        <template v-else><MIcon name="local_shipping" :size="18" class="mr-1 align-[-3px] text-primary" />You get free standard shipping</template>
        <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container-highest">
          <div class="h-full rounded-full bg-primary transition-[width] duration-300" :style="{ width: `${Math.min(100, ((subtotal - discount) / 50) * 100)}%` }" />
        </div>
      </div>

      <ul class="flex flex-col gap-4">
        <li v-for="l in cart" :key="l.key" class="flex gap-3">
          <img :src="picture(productById(l.id), l.color)" alt="" class="h-20 w-24 shrink-0 rounded-xl object-cover" />
          <div class="flex min-w-0 flex-1 flex-col">
            <p class="truncate text-title-small text-on-surface">{{ productById(l.id).name }}</p>
            <p class="text-body-small text-on-surface-variant">
              {{ productById(l.id).colors[l.color]!.name }}<template v-if="l.size"> · {{ l.size }}</template>
            </p>
            <div class="mt-auto flex items-center gap-1">
              <MIconButton :icon="l.qty === 1 ? 'delete' : 'remove'" size="xs" variant="outlined" :label="l.qty === 1 ? 'Remove' : 'One less'" @click="setQty(l.key, l.qty - 1)" />
              <span class="w-7 text-center text-label-large tabular-nums text-on-surface">{{ l.qty }}</span>
              <MIconButton icon="add" size="xs" variant="outlined" label="One more" @click="setQty(l.key, l.qty + 1)" />
              <span class="ml-auto text-title-small tabular-nums text-on-surface">{{ money(l.qty * productById(l.id).price) }}</span>
            </div>
          </div>
        </li>
      </ul>

      <!-- Coupon -->
      <div v-if="!coupon" class="flex items-start gap-2">
        <MTextField
          v-model="code"
          label="Coupon code"
          hint="Try M3UI or WELCOME"
          :error="codeError"
          error-label="That code isn't valid"
          class="flex-1"
          @keydown.enter="apply"
        />
        <MButton variant="tonal" class="mt-1" :disabled="!code.trim()" @click="apply">Apply</MButton>
      </div>
      <div v-else class="flex items-center gap-2 rounded-2xl bg-tertiary-container px-4 py-3 text-on-tertiary-container">
        <MIcon name="sell" :size="20" />
        <span class="flex-1 text-body-medium"><strong>{{ coupon }}</strong> applied</span>
        <MIconButton icon="close" size="xs" label="Remove coupon" @click="coupon = null" />
      </div>

      <dl class="flex flex-col gap-1 text-body-medium">
        <div class="flex justify-between"><dt class="text-on-surface-variant">Subtotal</dt><dd class="tabular-nums text-on-surface">{{ money(subtotal) }}</dd></div>
        <div v-if="discount" class="flex justify-between"><dt class="text-on-surface-variant">Discount</dt><dd class="tabular-nums text-tertiary">−{{ money(discount) }}</dd></div>
        <div class="flex justify-between"><dt class="text-on-surface-variant">Shipping</dt><dd class="text-on-surface-variant">At checkout</dd></div>
      </dl>
    </div>

    <template v-if="cart.length" #actions>
      <MButton icon="lock" class="w-full" @click="checkout">Checkout · {{ money(subtotal - discount) }}</MButton>
    </template>
  </MSideSheet>
</template>
