<script setup lang="ts">
import { ref } from 'vue'
import { MCarousel, MIconButton } from '@m3ui-vue/m3ui-vue'
import type { CarouselItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const carouselProps: PropDef[] = [
  { name: 'items', type: 'T[]', description: 'Items to render, required. CarouselItem by default; any type with an #item slot' },
  { name: 'modelValue', type: 'number', description: 'Index of the current item (v-model). Follows scrolling, and setting it scrolls there' },
  { name: 'variant', type: "'multi-browse' | 'uncontained' | 'hero' | 'full-screen'", default: "'multi-browse'", description: 'Carousel layout' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Scroll axis' },
  { name: 'itemSize', type: 'number', default: '186', description: 'Size of large items along the scroll axis, in px. Multi-browse and hero pick the arrangement closest to it; uncontained uses it as is. Hero without it fills the carousel minus its small items; full-screen ignores it' },
  { name: 'itemSpacing', type: 'number', default: '8', description: 'Space between items, in px' },
  { name: 'contentPadding', type: 'number', default: '0', description: 'Padding at both ends of the scroll axis, in px. Items scroll under it, so it suits a carousel that runs edge to edge' },
  { name: 'minSmallItemSize', type: 'number', default: '40', description: 'Smallest size a small item can take (multi-browse, hero)' },
  { name: 'maxSmallItemSize', type: 'number', default: '56', description: 'Largest size a small item can take (multi-browse, hero)' },
  { name: 'flingBehavior', type: "'single-advance' | 'multi-browse' | 'no-snap'", default: "'no-snap' (uncontained), 'single-advance' (others)", description: "What happens on release: move at most one item, fling freely and snap to an item, or fling freely without snapping" },
  { name: 'userScrollEnabled', type: 'boolean', default: 'true', description: 'Allow dragging, wheel and keyboard scrolling' },
  { name: 'height', type: 'string', default: "'205px' (horizontal)", description: 'Height of the carousel. Vertical and full-screen carousels have none by default: give one here or with a class' },
  { name: 'label', type: 'string', description: 'Accessible name of the carousel' },
]

const carouselEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'number', description: 'The current item changed' },
  { name: 'itemClick', payload: '(item: T, index: number)', description: 'An item was clicked (not dragged). A partly visible item also scrolls into focus' },
]

const carouselSlots: SlotDef[] = [
  { name: 'item', scope: '{ item: T, index: number }', description: 'Content of each item, filling its full (unmasked) box. Replaces the default image and label' },
]

const carouselTypes: TypeDef[] = [
  {
    name: 'CarouselItem',
    fields: [
      { name: 'src', type: 'string', required: true, description: 'Image URL' },
      { name: 'alt', type: 'string', description: 'Alt text (falls back to label)' },
      { name: 'label', type: 'string', description: 'Title at the bottom of the item. It follows the visible part and fades out as the item shrinks' },
    ],
  },
]

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&h=900&fit=crop`
const photos = [
  { src: photo('1506905925346-21bda4d32df4'), label: 'Mountain Vista' },
  { src: photo('1507525428034-b723cf961d3e'), label: 'Tropical Beach' },
  { src: photo('1519681393784-d120267933ba'), label: 'Starry Night' },
  { src: photo('1472214103451-9374bd1c798e'), label: 'Green Valley' },
  { src: photo('1518791841217-8f162f1e1131'), label: 'Curious Cat' },
  { src: photo('1501785888041-af3ef285b470'), label: 'Lake Morning' },
  { src: photo('1470071459604-3b5ec3a7fe05'), label: 'Misty Hills' },
  { src: photo('1441974231531-c6227db76b6e'), label: 'Forest Path' },
]
const copy = (): CarouselItem[] => photos.map((p) => ({ ...p }))

const multiBrowseItems = copy()
const uncontainedItems = copy()
const heroItems = copy()
const fullScreenItems = copy()

interface Place { src: string; city: string; country: string }
const places: Place[] = [
  { src: photo('1502602898657-3e91760cbb34'), city: 'Paris', country: 'France' },
  { src: photo('1540959733332-eab4deabeeaf'), city: 'Tokyo', country: 'Japan' },
  { src: photo('1518548419970-58e3b4079ab2'), city: 'Bali', country: 'Indonesia' },
  { src: photo('1533105079780-92b9be482077'), city: 'Santorini', country: 'Greece' },
  { src: photo('1496442226666-8d4d0e62e6e9'), city: 'New York', country: 'United States' },
]

const controlledItems = copy()
const current = ref(0)
const controlled = ref<InstanceType<typeof MCarousel> | null>(null)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCarousel</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The Material 3 carousel, with its four layouts. Items keep one size and are laid out side by
      side; as you scroll, each one is masked down to the space it has, so items grow as they reach
      the focal position and shrink as they leave. Drag it (touch or mouse), scroll it with a
      trackpad or a horizontal wheel, or focus it and use the arrow keys. For fixed-width slides
      with arrows and autoplay, see
      <router-link to="/components/data-display/msimplecarousel" class="text-primary underline">MSimpleCarousel</router-link>.
    </p>

    <ComponentDemo
      title="Multi-browse"
      description="Large, medium and small items at once, for browsing many items such as photos. The arrangement is chosen from the width and itemSize. contentPadding lets items scroll under the edges of a carousel that runs edge to edge."
      :code="`<MCarousel :items=&quot;items&quot; :content-padding=&quot;16&quot; label=&quot;Landscapes&quot; />`"
    >
      <div class="w-full max-w-xl">
        <MCarousel :items="multiBrowseItems" :content-padding="16" label="Landscapes" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Uncontained"
      description="Items keep their size and the last visible one is cut off at the edge. Scrolling is free, with no snapping."
      :code="`<MCarousel variant=&quot;uncontained&quot; :items=&quot;items&quot; :item-size=&quot;220&quot; :content-padding=&quot;16&quot; />`"
    >
      <div class="w-full max-w-xl">
        <MCarousel variant="uncontained" :items="uncontainedItems" :item-size="220" :content-padding="16" label="Landscapes" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Hero"
      description="One large item in the center with a small one on each side, to spotlight content. Without itemSize the large item takes all the space the small ones leave."
      :code="`<MCarousel variant=&quot;hero&quot; :items=&quot;items&quot; height=&quot;280px&quot; />`"
    >
      <div class="w-full max-w-xl">
        <MCarousel variant="hero" :items="heroItems" height="280px" label="Landscapes" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Full-screen"
      description="One item filling the carousel, usually scrolling vertically, for immersive content like stories or reels. Give it a height."
      :code="`<MCarousel variant=&quot;full-screen&quot; orientation=&quot;vertical&quot; :items=&quot;items&quot; height=&quot;480px&quot; />`"
    >
      <div class="w-full max-w-xs">
        <MCarousel variant="full-screen" orientation="vertical" :items="fullScreenItems" height="480px" label="Landscapes" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Content"
      description="The #item slot fills each item's full box, and the carousel masks it. --m3-carousel-mask-start and --m3-carousel-mask-size describe the visible part, so content can follow it, like this caption pinned to its left edge."
      :code="`<MCarousel :items=&quot;places&quot; :item-size=&quot;240&quot; height=&quot;260px&quot;>
  <template #item=&quot;{ item }&quot;>
    <img :src=&quot;item.src&quot; :alt=&quot;item.city&quot; class=&quot;size-full object-cover&quot; draggable=&quot;false&quot; />
    <div
      class=&quot;absolute top-3 rounded-lg bg-surface-container px-3 py-1.5&quot;
      style=&quot;inset-inline-start: calc(var(--m3-carousel-mask-start) + 12px)&quot;
    >
      <p class=&quot;text-title-small text-on-surface&quot;>{{ item.city }}</p>
      <p class=&quot;text-body-small text-on-surface-variant&quot;>{{ item.country }}</p>
    </div>
  </template>
</MCarousel>`"
    >
      <div class="w-full max-w-xl">
        <MCarousel :items="places" :item-size="240" height="260px" label="Destinations">
          <template #item="{ item }">
            <img :src="item.src" :alt="item.city" class="size-full object-cover" draggable="false" />
            <div
              class="absolute top-3 whitespace-nowrap rounded-lg bg-surface-container px-3 py-1.5"
              style="inset-inline-start: calc(var(--m3-carousel-mask-start) + 12px)"
            >
              <p class="text-title-small text-on-surface">{{ item.city }}</p>
              <p class="text-body-small text-on-surface-variant">{{ item.country }}</p>
            </div>
          </template>
        </MCarousel>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Controlled"
      description="v-model follows the current item as you scroll, and setting it scrolls there. next(), prev() and scrollToItem(index) are available through a template ref."
      :code="`<MIconButton icon=&quot;chevron_left&quot; label=&quot;Previous&quot; @click=&quot;carousel.prev()&quot; />
<span>{{ current + 1 }} / {{ items.length }}</span>
<MIconButton icon=&quot;chevron_right&quot; label=&quot;Next&quot; @click=&quot;carousel.next()&quot; />

<MCarousel ref=&quot;carousel&quot; v-model=&quot;current&quot; :items=&quot;items&quot; />`"
      :script="`const current = ref(0)
const carousel = ref()`"
    >
      <div class="flex w-full max-w-xl flex-col gap-3">
        <div class="flex items-center gap-2">
          <MIconButton icon="chevron_left" label="Previous" @click="controlled?.prev()" />
          <span class="min-w-14 text-center text-body-medium text-on-surface-variant">{{ current + 1 }} / {{ controlledItems.length }}</span>
          <MIconButton icon="chevron_right" label="Next" @click="controlled?.next()" />
        </div>
        <MCarousel ref="controlled" v-model="current" :items="controlledItems" label="Landscapes" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="carouselProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="carouselEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="carouselSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="carouselTypes" />

    <p class="mt-4 text-body-small text-on-surface-variant">
      Also exposes <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">next()</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">prev()</code> and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">scrollToItem(index, animate = true)</code>
      through a template ref.
    </p>

    <ComponentPager current="MCarousel" />
  </div>
</template>
