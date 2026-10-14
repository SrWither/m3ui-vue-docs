<script setup lang="ts">
import { computed, ref } from 'vue'
import { MAvatar, MButton, MIcon, MLightbox, MNumberField, MRating, MSegmentedButton, useToast } from '@m3ui-vue/m3ui-vue'
import { useStore, productById, picture, money, products } from '../useStore'
import ProductCard from '../components/ProductCard.vue'

const props = defineProps<{ id: string }>()
const product = computed(() => productById(props.id))
const { go, addToCart, cartOpen } = useStore()
const toast = useToast()

const color = ref(0)
const size = ref<string | number | (string | number)[]>(product.value.sizes?.[0] ?? '')
const qty = ref<number | null>(1)
const view = ref(0)

// Three views of the selected color, browsable in the lightbox.
const gallery = computed(() => [0, 1, 2].map((v) => ({ src: picture(product.value, color.value, v), alt: `${product.value.name}, view ${v + 1}` })))
const lightbox = ref(false)

const related = computed(() => products.filter((p) => p.id !== product.value.id && p.category === product.value.category).concat(products.filter((p) => p.category !== product.value.category)).slice(0, 4))

function add() {
  addToCart(product.value.id, color.value, product.value.sizes ? String(size.value) : undefined, qty.value ?? 1)
  toast.success(`${qty.value} × ${product.value.name} added to your cart`, { action: { label: 'View cart', onClick: () => (cartOpen.value = true) } })
}
</script>

<template>
  <div class="flex flex-col gap-10">
    <div>
      <MButton variant="text" icon="arrow_back" class="-ml-3 mb-2" @click="go({ name: 'shop' })">All products</MButton>

      <div class="grid gap-8 md:grid-cols-2">
        <!-- Gallery -->
        <div class="flex flex-col gap-3">
          <button type="button" class="relative cursor-zoom-in overflow-hidden rounded-3xl" aria-label="Open the gallery" @click="lightbox = true">
            <img :src="gallery[view]!.src" :alt="gallery[view]!.alt" class="aspect-[400/330] w-full object-cover" />
            <span class="absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface/80 text-on-surface">
              <MIcon name="zoom_in" />
            </span>
          </button>
          <div class="flex gap-3">
            <button
              v-for="(g, i) in gallery"
              :key="i"
              type="button"
              class="w-20 overflow-hidden rounded-xl outline-none ring-offset-2 ring-offset-surface transition-shadow focus-visible:ring-2 focus-visible:ring-secondary"
              :class="view === i && 'ring-2 ring-primary'"
              :aria-label="`View ${i + 1}`"
              @click="view = i"
            >
              <img :src="g.src" alt="" class="aspect-[400/330] w-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Details -->
        <div class="flex flex-col gap-5">
          <div>
            <p class="text-label-large text-primary">{{ product.category }}</p>
            <h1 class="text-headline-medium text-on-surface">{{ product.name }}</h1>
            <div class="mt-1 flex items-center gap-2">
              <MRating :model-value="product.rating" readonly :size="20" />
              <span class="text-body-medium text-on-surface-variant">{{ product.rating.toFixed(1) }} · {{ product.reviews.length }} reviews</span>
            </div>
          </div>

          <p class="flex items-baseline gap-3">
            <span class="text-headline-small text-on-surface">{{ money(product.price) }}</span>
            <span v-if="product.was" class="text-title-medium text-on-surface-variant line-through">{{ money(product.was) }}</span>
          </p>

          <p class="text-body-large text-on-surface-variant">{{ product.description }}</p>

          <div>
            <p class="mb-2 text-title-small text-on-surface">Color · {{ product.colors[color]!.name }}</p>
            <div class="flex gap-3">
              <button
                v-for="(c, i) in product.colors"
                :key="c.name"
                type="button"
                class="h-10 w-10 cursor-pointer rounded-full outline-none ring-offset-2 ring-offset-surface transition-shadow focus-visible:ring-2 focus-visible:ring-secondary"
                :class="color === i ? 'ring-2 ring-on-surface' : 'ring-1 ring-outline-variant'"
                :style="{ background: c.hex }"
                :aria-label="c.name"
                :aria-pressed="color === i"
                @click="color = i"
              />
            </div>
          </div>

          <div v-if="product.sizes">
            <p class="mb-2 text-title-small text-on-surface">Size</p>
            <MSegmentedButton v-model="size" :options="product.sizes.map((s) => ({ value: s, label: s }))" />
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <MNumberField v-model="qty" label="Quantity" :min="1" :max="Math.max(1, product.stock)" stepper :disabled="!product.stock" class="w-40" />
            <MButton icon="add_shopping_cart" size="md" :disabled="!product.stock" class="flex-1" @click="add">
              {{ product.stock ? 'Add to cart' : 'Out of stock' }}
            </MButton>
          </div>

          <ul class="flex flex-col gap-2 text-body-medium text-on-surface-variant">
            <li class="flex items-center gap-2"><MIcon name="local_shipping" :size="20" /> Free standard shipping over $50</li>
            <li class="flex items-center gap-2"><MIcon name="replay" :size="20" /> 30-day returns</li>
            <li v-if="product.stock && product.stock < 10" class="flex items-center gap-2 text-error"><MIcon name="inventory_2" :size="20" /> Only {{ product.stock }} left</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Reviews -->
    <section>
      <h2 class="mb-4 text-title-large text-on-surface">Reviews</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <article v-for="r in product.reviews" :key="r.name + r.text" class="rounded-3xl bg-surface-container-low p-5">
          <div class="mb-2 flex items-center gap-3">
            <MAvatar :name="r.name" :size="36" />
            <div class="flex-1">
              <p class="text-title-small text-on-surface">{{ r.name }}</p>
              <p class="text-body-small text-on-surface-variant">{{ r.date }}</p>
            </div>
            <MRating :model-value="r.rating" readonly :size="16" />
          </div>
          <p class="text-body-medium text-on-surface">{{ r.text }}</p>
        </article>
      </div>
    </section>

    <section>
      <h2 class="mb-4 text-title-large text-on-surface">You may also like</h2>
      <div class="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        <ProductCard v-for="p in related" :key="p.id" :product="p" />
      </div>
    </section>

    <MLightbox v-model="lightbox" v-model:index="view" :items="gallery" />
  </div>
</template>
