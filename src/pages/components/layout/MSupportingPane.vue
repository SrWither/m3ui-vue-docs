<script setup lang="ts">
import { computed, ref } from 'vue'
import { MSupportingPane, MIcon, MIconButton, MButton, MChip, MDivider, MProgressBar } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import AdaptiveFrame from '@/components/demos/AdaptiveFrame.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const spProps: PropDef[] = [
  { name: 'singlePane', type: "'below' | 'sheet'", default: "'below'", description: "Where the supporting pane goes when only one pane fits: under the main one (M3's default reflow), or in a bottom sheet you open with v-model:open" },
  { name: 'open', type: 'boolean', default: 'false', description: "With singlePane='sheet': whether the sheet is open (v-model:open). Closes itself once both panes fit" },
  { name: 'sheetTitle', type: 'string', description: "With singlePane='sheet': the sheet's title" },
  { name: 'supportingWidth', type: 'string', description: "Supporting pane width with two panes. Defaults to M3's 360px, 412px from the large width class (1200px)" },
]
const spEvents: EventDef[] = [
  { name: 'update:open', payload: 'boolean', description: 'Emitted when the sheet is dismissed, or closed because both panes fit again' },
]
const spSlots: SlotDef[] = [
  { name: 'main', scope: '{ twoPane }', description: 'The main content' },
  { name: 'supporting', scope: '{ twoPane }', description: 'Content that supports the main pane: related items, a summary, details, tools' },
]

// Course lesson
const lessons = [
  { title: 'Why adaptive layouts', min: 6, done: true },
  { title: 'Window size classes', min: 9, done: true },
  { title: 'Navigation that adapts', min: 12, done: false },
  { title: 'List-detail in practice', min: 14, done: false },
  { title: 'Supporting panes', min: 8, done: false },
  { title: 'Foldables and large screens', min: 11, done: false },
]
const lesson = ref(2)
const progress = computed(() => Math.round((lessons.filter((l) => l.done).length / lessons.length) * 100))

const lessonCode = `<MSupportingPane class="h-dvh">
  <template #main>
    <VideoPlayer :src="lesson.video" />
    <h2>{{ lesson.title }}</h2>
    <p>{{ lesson.summary }}</p>
  </template>

  <!-- Beside the video on wide screens, under it on phones -->
  <template #supporting>
    <h3>Up next</h3>
    <LessonRow v-for="l in lessons" :key="l.id" :lesson="l" @click="play(l)" />
  </template>
</MSupportingPane>`

// Shop with a cart sheet
const product = { name: 'Trail running shoe', price: 129, colors: ['Moss', 'Sand', 'Night'] }
const color = ref('Moss')
const cart = ref([
  { name: 'Merino running socks', qty: 2, price: 18 },
  { name: 'Water bottle 600 ml', qty: 1, price: 24 },
])
const cartOpen = ref(false)
const cartCount = computed(() => cart.value.reduce((n, i) => n + i.qty, 0))
const subtotal = computed(() => cart.value.reduce((n, i) => n + i.qty * i.price, 0))
function addToCart() {
  const name = `${product.name} · ${color.value}`
  const line = cart.value.find((i) => i.name === name)
  if (line) line.qty++
  else cart.value.push({ name, qty: 1, price: product.price })
}

const shopCode = `<MSupportingPane v-model:open="cartOpen" single-pane="sheet" sheet-title="Your cart">
  <template #main="{ twoPane }">
    <ProductDetails />
    <MButton @click="addToCart">Add to cart</MButton>
    <!-- On phones the cart lives in a sheet: give it a way in -->
    <MButton v-if="!twoPane" variant="tonal" icon="shopping_cart" @click="cartOpen = true">
      View cart ({{ cartCount }})
    </MButton>
  </template>
  <template #supporting>
    <CartSummary :items="cart" />
  </template>
</MSupportingPane>`
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSupportingPane</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Material 3's supporting pane layout: main content plus a narrower pane that supports it, like related
      videos next to a player, a cart next to a product or comments next to a document. With room for two panes
      (840px and up) the supporting pane sits beside the main one; on smaller screens it moves under it, or into
      a bottom sheet with <code>single-pane="sheet"</code>. It measures its own width, not the window's.
    </p>

    <ComponentDemo
      title="Lesson with up next"
      description="A course player. On Desktop the lesson list sits beside the video; on Phone it flows under the lesson, and the whole page scrolls as one column. Pick a lesson to play it."
      :code="lessonCode"
    >
      <AdaptiveFrame height="540px" initial="desktop">
        <MSupportingPane class="h-full p-4">
          <template #main>
            <div
              class="relative mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-tertiary"
            >
              <MIcon name="play_circle" :size="64" class="text-on-primary" />
              <span class="absolute right-3 bottom-3 rounded-md bg-scrim/60 px-2 py-0.5 text-label-medium text-on-primary">
                {{ lessons[lesson]!.min }}:00
              </span>
            </div>
            <MChip class="mb-2">Lesson {{ lesson + 1 }} of {{ lessons.length }}</MChip>
            <h2 class="mb-2 text-headline-small text-on-surface">{{ lessons[lesson]!.title }}</h2>
            <p class="text-body-large text-on-surface-variant">
              How to pick the right navigation for each screen size, and swap it without losing the user's place.
              We go from a bottom bar on phones to a rail on tablets, and look at what changes in landscape.
            </p>
          </template>
          <template #supporting>
            <div class="rounded-2xl bg-surface-container p-2">
              <div class="px-3 pt-2 pb-3">
                <p class="mb-2 text-title-medium text-on-surface">Up next</p>
                <MProgressBar :value="progress" />
                <p class="mt-1 text-label-medium text-on-surface-variant">{{ progress }}% complete</p>
              </div>
              <div
                v-for="(l, i) in lessons"
                :key="l.title"
                class="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
                :class="i === lesson ? 'bg-secondary-container' : 'hover:bg-surface-container-high'"
                @click="lesson = i"
              >
                <MIcon
                  :name="l.done ? 'check_circle' : i === lesson ? 'play_circle' : 'radio_button_unchecked'"
                  :class="l.done ? 'text-primary' : 'text-on-surface-variant'"
                />
                <span class="min-w-0 flex-1 truncate text-body-medium text-on-surface">{{ l.title }}</span>
                <span class="text-label-small text-on-surface-variant">{{ l.min }} min</span>
              </div>
            </div>
          </template>
        </MSupportingPane>
      </AdaptiveFrame>
    </ComponentDemo>

    <ComponentDemo
      title="Product with a cart sheet"
      description="A shop page. On Desktop the cart is always visible beside the product; on Phone it moves into a bottom sheet behind a View cart button, so the product gets the whole screen."
      :code="shopCode"
    >
      <AdaptiveFrame height="520px" initial="phone">
        <MSupportingPane v-model:open="cartOpen" single-pane="sheet" sheet-title="Your cart" class="h-full p-4">
          <template #main="{ twoPane }">
            <div class="mb-4 flex aspect-[4/3] items-center justify-center rounded-2xl bg-secondary-container">
              <MIcon name="steps" :size="72" class="text-on-secondary-container" />
            </div>
            <p class="text-label-large text-primary">New season</p>
            <h2 class="mb-1 text-headline-small text-on-surface">{{ product.name }}</h2>
            <p class="mb-4 text-title-large text-on-surface">${{ product.price }}</p>
            <div class="mb-4 flex flex-wrap gap-2">
              <MChip v-for="c in product.colors" :key="c" :selected="c === color" @click="color = c">{{ c }}</MChip>
            </div>
            <div class="flex flex-wrap gap-2">
              <MButton icon="add_shopping_cart" @click="addToCart">Add to cart</MButton>
              <MButton v-if="!twoPane" variant="tonal" icon="shopping_cart" @click="cartOpen = true">
                View cart ({{ cartCount }})
              </MButton>
            </div>
          </template>
          <template #supporting="{ twoPane }">
            <div :class="twoPane ? 'rounded-2xl bg-surface-container p-4' : 'pb-4'">
              <p v-if="twoPane" class="mb-3 text-title-medium text-on-surface">Your cart</p>
              <div v-for="i in cart" :key="i.name" class="flex items-center gap-3 py-2">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-highest">
                  <MIcon name="inventory_2" :size="20" class="text-on-surface-variant" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-body-medium text-on-surface">{{ i.name }}</p>
                  <p class="text-body-small text-on-surface-variant">{{ i.qty }} × ${{ i.price }}</p>
                </div>
                <MIconButton icon="remove" size="xs" label="Remove one" @click="i.qty > 1 ? i.qty-- : cart.splice(cart.indexOf(i), 1)" />
              </div>
              <MDivider class="my-3" />
              <div class="mb-4 flex items-center justify-between">
                <span class="text-body-large text-on-surface-variant">Subtotal</span>
                <span class="text-title-medium tabular-nums text-on-surface">${{ subtotal }}</span>
              </div>
              <MButton class="w-full" :disabled="!cart.length">Checkout</MButton>
            </div>
          </template>
        </MSupportingPane>
      </AdaptiveFrame>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="spProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="spEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="spSlots" />

    <ComponentPager current="MSupportingPane" />
  </div>
</template>
