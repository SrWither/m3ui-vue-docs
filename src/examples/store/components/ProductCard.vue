<script setup lang="ts">
import { MIcon, MIconButton, useToast } from '@m3ui-vue/m3ui-vue'
import { useStore, picture, money, type Product } from '../useStore'

const props = defineProps<{ product: Product }>()
const { go, addToCart, cartOpen } = useStore()
const toast = useToast()

function quickAdd() {
  addToCart(props.product.id, 0, props.product.sizes?.[0], 1)
  toast.success(`${props.product.name} added to your cart`, { action: { label: 'View cart', onClick: () => (cartOpen.value = true) } })
}
</script>

<template>
  <article class="group flex flex-col">
    <button
      type="button"
      class="relative aspect-[400/330] cursor-pointer overflow-hidden rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-secondary"
      :aria-label="product.name"
      @click="go({ name: 'product', id: product.id })"
    >
      <img :src="picture(product)" :alt="product.name" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <span v-if="product.was" class="absolute top-3 left-3 rounded-full bg-error px-2.5 py-1 text-label-medium font-medium text-on-error">
        −{{ Math.round((1 - product.price / product.was) * 100) }}%
      </span>
      <span v-else-if="product.isNew" class="absolute top-3 left-3 rounded-full bg-tertiary px-2.5 py-1 text-label-medium font-medium text-on-tertiary">New</span>
      <span v-if="!product.stock" class="absolute inset-x-3 bottom-3 rounded-full bg-inverse-surface/85 py-1 text-center text-label-medium text-inverse-on-surface">Out of stock</span>
    </button>

    <div class="flex items-start gap-2 px-1 pt-3">
      <div class="min-w-0 flex-1">
        <p class="text-label-medium text-on-surface-variant">{{ product.category }}</p>
        <h3 class="truncate text-title-medium text-on-surface">{{ product.name }}</h3>
        <p class="flex items-center gap-1 text-body-small text-on-surface-variant">
          <MIcon name="star" :size="16" class="text-tertiary" style="font-variation-settings: 'FILL' 1" />
          {{ product.rating.toFixed(1) }} · {{ product.reviews.length }} reviews
        </p>
        <p class="mt-1 flex items-baseline gap-2">
          <span class="text-title-medium text-on-surface">{{ money(product.price) }}</span>
          <span v-if="product.was" class="text-body-small text-on-surface-variant line-through">{{ money(product.was) }}</span>
        </p>
      </div>
      <MIconButton
        icon="add_shopping_cart"
        variant="tonal"
        :label="`Add ${product.name} to cart`"
        :disabled="!product.stock"
        @click="quickAdd"
      />
    </div>
  </article>
</template>
