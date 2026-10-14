<script setup lang="ts">
/*
 * Store example: a small home-goods shop built only with m3ui-vue.
 * - ShopView.vue       hero MCarousel, product grid, filters in MSupportingPane (a bottom sheet on phones)
 * - ProductView.vue    gallery + MLightbox, variants, quantity, reviews with MRating
 * - CartSheet.vue      MSideSheet cart with quantities and coupons
 * - CheckoutView.vue   MStepper checkout: shipping, delivery, payment (MMaskField), review, MResult
 * - useStore.ts        catalog, filters, cart, totals;  art.ts  product pictures drawn as SVG
 */
import { useRouter } from 'vue-router'
import { MBadge, MIcon, MIconButton, MTooltip } from '@m3ui-vue/m3ui-vue'
import { useStore } from './useStore'
import ShopView from './views/ShopView.vue'
import ProductView from './views/ProductView.vue'
import CheckoutView from './views/CheckoutView.vue'
import CartSheet from './components/CartSheet.vue'

const router = useRouter()
const { screen, go, filters, count, cartOpen } = useStore()

// Searching from a product page goes back to the results.
function onSearch(value: string) {
  filters.value.query = value
  if (screen.value.name !== 'shop') go({ name: 'shop' })
}
</script>

<template>
  <div class="min-h-dvh bg-surface text-on-surface">
    <header class="sticky top-0 z-30 border-b border-outline-variant/50 bg-surface/90 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <button type="button" class="flex shrink-0 cursor-pointer items-center gap-2" @click="go({ name: 'shop' })">
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary">
            <MIcon name="chair" :size="22" />
          </span>
          <span class="hidden text-title-large font-medium text-on-surface sm:inline">Nook</span>
        </button>

        <label class="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full bg-surface-container-high px-4 focus-within:ring-2 focus-within:ring-secondary sm:max-w-md sm:mx-auto">
          <MIcon name="search" :size="20" class="text-on-surface-variant" />
          <input
            :value="filters.query"
            type="search"
            placeholder="Search products"
            class="min-w-0 flex-1 bg-transparent text-body-large text-on-surface outline-none placeholder:text-on-surface-variant [&::-webkit-search-cancel-button]:hidden"
            @input="onSearch(($event.target as HTMLInputElement).value)"
          />
        </label>

        <MTooltip text="Back to the docs" placement="bottom">
          <MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" />
        </MTooltip>
        <MBadge v-if="count" :count="count">
          <MIconButton icon="shopping_bag" label="Cart" variant="tonal" @click="cartOpen = true" />
        </MBadge>
        <MIconButton v-else icon="shopping_bag" label="Cart" variant="tonal" @click="cartOpen = true" />
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 pt-4 pb-16 sm:px-6">
      <!-- Same page transition as the docs -->
      <Transition name="m3s-page" mode="out-in">
        <ShopView v-if="screen.name === 'shop'" />
        <ProductView v-else-if="screen.name === 'product'" :id="screen.id" :key="screen.id" />
        <CheckoutView v-else />
      </Transition>
    </main>

    <CartSheet />
  </div>
</template>

<style scoped>
.m3s-page-enter-active,
.m3s-page-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.m3s-page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.m3s-page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
@media (prefers-reduced-motion: reduce) {
  .m3s-page-enter-active,
  .m3s-page-leave-active {
    transition: none;
  }
}
</style>
