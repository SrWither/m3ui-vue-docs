<script setup lang="ts">
import { ref } from 'vue'
import { MProductConfigurator, MCard, useToast } from '@m3ui-vue/m3ui-vue'
import type { ProductOptionGroup, ProductSelection, ProductOption } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const toast = useToast()

const burgerGroups: ProductOptionGroup[] = [
  { key: 'doneness', label: 'Doneness', required: true, options: [
    { value: 'rare', label: 'Rare' }, { value: 'medium', label: 'Medium' }, { value: 'well', label: 'Well done' },
  ] },
  { key: 'side', label: 'Side', required: true, display: 'chips', options: [
    { value: 'fries', label: 'Fries' }, { value: 'salad', label: 'Salad' }, { value: 'sweet', label: 'Sweet potato', price: 1.5 },
  ] },
  { key: 'extras', label: 'Extras', type: 'multiple', max: 3, options: [
    { value: 'bacon', label: 'Bacon', price: 2 },
    { value: 'cheese', label: 'Cheddar', price: 1.2 },
    { value: 'egg', label: 'Fried egg', price: 1.5 },
    { value: 'jalapenos', label: 'Jalapeños', price: 0.8, description: 'Spicy' },
    { value: 'truffle', label: 'Truffle mayo', price: 2.5, disabled: true },
  ] },
  { key: 'sauces', label: 'Dips', type: 'quantity', max: 3, options: [
    { value: 'bbq', label: 'BBQ' }, { value: 'aioli', label: 'Garlic aioli', price: 0.5 }, { value: 'ketchup', label: 'Ketchup' },
  ] },
]
const burger = ref<ProductSelection>({})
const burgerQty = ref(1)

const colors: Record<string, string> = { black: '#1d1b20', sand: '#d8c3a5', forest: '#2f5d3a', sky: '#7fb3d5' }
const shirtGroups: ProductOptionGroup[] = [
  { key: 'color', label: 'Color', required: true, display: 'swatches', options: Object.entries(colors).map(([value, color]) => ({ value, label: value[0]!.toUpperCase() + value.slice(1), color })) },
  { key: 'size', label: 'Size', required: true, display: 'chips', options: ['XS', 'S', 'M', 'L', 'XL'].map((s) => ({ value: s, label: s, price: s === 'XL' ? 3 : undefined })) },
]
// Stock: which sizes exist in each color
const stock: Record<string, string[]> = { black: ['S', 'M', 'L', 'XL'], sand: ['XS', 'S', 'M'], forest: ['M', 'L'], sky: ['XS', 'S', 'M', 'L', 'XL'] }
function isAvailable(group: ProductOptionGroup, option: ProductOption, sel: ProductSelection) {
  if (group.key === 'size' && typeof sel.color === 'string') return stock[sel.color]!.includes(option.value)
  if (group.key === 'color' && typeof sel.size === 'string') return stock[option.value]!.includes(sel.size)
  return true
}
const shirt = ref<ProductSelection>({ color: 'black' })

const props: PropDef[] = [
  { name: 'groups', type: 'ProductOptionGroup[]', description: 'Required. { key, label, type?: single | multiple | quantity, display?: list | chips | swatches, required?, min?, max?, options }' },
  { name: 'modelValue', type: 'ProductSelection', default: '{}', description: 'Selection by group key: a string (single), string[] (multiple) or { option: count } (quantity)' },
  { name: 'basePrice', type: 'number', default: '0', description: 'Price before options' },
  { name: 'quantity', type: 'number | null', default: '1', description: 'Units (v-model:quantity); null hides the stepper' },
  { name: 'maxQuantity', type: 'number', default: '99', description: 'Most units' },
  { name: 'currency', type: 'string', description: 'ISO 4217 code to format prices' },
  { name: 'actionLabel', type: 'string', description: 'Label of the add button, which shows the total; without it there is no button' },
  { name: 'isAvailable', type: '(group, option, selection) => boolean', description: "Crosses out options that don't exist with the rest of the selection" },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables everything' },
]

const slots: SlotDef[] = [
  { name: 'header', description: "Above the groups: the product's photo, name, description" },
  { name: 'option', description: "Replaces an option's label in list display", scope: '{ group, option, selected, available }' },
  { name: 'action', description: 'Replaces the add button', scope: '{ valid, total, quantity, add }' },
]

const events: EventDef[] = [
  { name: 'update:modelValue', payload: 'ProductSelection', description: 'The selection changed' },
  { name: 'update:quantity', payload: 'number', description: 'Units changed' },
  { name: 'add', payload: '{ selection, quantity, unitPrice, total }', description: 'The add button was pressed with a valid selection' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MProductConfigurator</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Picks the variant and extras of a product with the price updating live: the doneness, side and extras of a dish,
      the size and color of a shirt, the drinks of a combo. A group is single choice, multiple choice with a min/max,
      or a count per option, drawn as a list, chips or color swatches. <code>isAvailable</code> crosses out combinations
      that don't exist, and the add button stays disabled until every group's rule is met.
    </p>

    <ComponentDemo
      title="Restaurant dish"
      description="Required single choices, a side as chips with a surcharge, up to 3 extras (one sold out), and up to 3 dips counted per option."
      :code="`<MProductConfigurator
  v-model=&quot;selection&quot;
  v-model:quantity=&quot;qty&quot;
  :groups=&quot;[
    { key: 'doneness', label: 'Doneness', required: true, options: [...] },
    { key: 'side', label: 'Side', required: true, display: 'chips', options: [..., { value: 'sweet', label: 'Sweet potato', price: 1.5 }] },
    { key: 'extras', label: 'Extras', type: 'multiple', max: 3, options: [{ value: 'bacon', label: 'Bacon', price: 2 }, ...] },
    { key: 'sauces', label: 'Dips', type: 'quantity', max: 3, options: [...] },
  ]&quot;
  :base-price=&quot;11.9&quot;
  currency=&quot;USD&quot;
  action-label=&quot;Add to order&quot;
  @add=&quot;addToCart&quot;
/>`"
    >
      <div class="flex w-full justify-center">
        <MCard variant="outlined" class="w-full max-w-md overflow-hidden">
          <MProductConfigurator
            v-model="burger"
            v-model:quantity="burgerQty"
            class="p-4"
            :groups="burgerGroups"
            :base-price="11.9"
            currency="USD"
            action-label="Add to order"
            @add="(e) => toast.show(`Added ${e.quantity} × Smash burger · $${e.total.toFixed(2)}`)"
          >
            <template #header>
              <div class="mb-2">
                <h2 class="text-headline-small">Smash burger</h2>
                <p class="text-body-medium text-on-surface-variant">Two beef patties, pickles, onion, house sauce · $11.90</p>
              </div>
            </template>
          </MProductConfigurator>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Store variants with stock"
      description="Swatches for color and chips for size. isAvailable checks a stock table: picking Forest leaves only M and L, and picking XS crosses out the colors without it."
      :code="`<MProductConfigurator
  v-model=&quot;selection&quot;
  :groups=&quot;[
    { key: 'color', label: 'Color', required: true, display: 'swatches', options: [{ value: 'black', label: 'Black', color: '#1d1b20' }, ...] },
    { key: 'size', label: 'Size', required: true, display: 'chips', options: [...] },
  ]&quot;
  :is-available=&quot;(group, option, sel) =>
    group.key === 'size' && sel.color ? stock[sel.color].includes(option.value)
    : group.key === 'color' && sel.size ? stock[option.value].includes(sel.size)
    : true&quot;
  :base-price=&quot;24&quot;
  :quantity=&quot;null&quot;
  currency=&quot;EUR&quot;
  action-label=&quot;Add to bag&quot;
/>`"
    >
      <div class="flex w-full justify-center">
        <MProductConfigurator
          v-model="shirt"
          class="w-full max-w-md"
          :groups="shirtGroups"
          :is-available="isAvailable"
          :base-price="24"
          :quantity="null"
          currency="EUR"
          action-label="Add to bag"
          @add="(e) => toast.show(`${e.selection.color} / ${e.selection.size} added`)"
        />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <ComponentPager current="MProductConfigurator" />
  </div>
</template>
