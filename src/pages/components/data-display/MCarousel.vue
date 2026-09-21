<script setup lang="ts">
import { MCarousel } from '@m3ui-vue/m3ui-vue'
import type { CarouselItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const carouselProps: PropDef[] = [
  { name: 'items', type: 'CarouselItem[]', description: 'Items to render — required' },
  { name: 'itemWidth', type: 'number', default: '280', description: "Target width of the large, fully-visible focal item, in px (preferredItemWidth)" },
  { name: 'itemSpacing', type: 'number', default: '0', description: 'Spacing between item slots, in px — matches the real default (CarouselDefaults.ItemSpacing)' },
  { name: 'minSmallItemWidth', type: 'number', default: '40', description: 'Matches the real default (CarouselDefaults.MinSmallItemSize)' },
  { name: 'maxSmallItemWidth', type: 'number', default: '56', description: 'Matches the real default (CarouselDefaults.MaxSmallItemSize)' },
  { name: 'height', type: 'string', default: "'220px'", description: 'Track height' },
  { name: 'showArrows', type: 'boolean', default: 'true', description: 'Show prev/next arrow buttons (fade in on hover)' },
  { name: 'autoplay', type: 'boolean', default: 'false', description: 'Auto-advance items — pauses while the pointer is over the carousel' },
  { name: 'interval', type: 'number', default: '5000', description: 'Autoplay interval in ms' },
]

const carouselEvents: EventDef[] = [
  { name: 'change', payload: 'number', description: 'Fires with the new focal item index whenever the track scrolls to a different one' },
]

const carouselTypes: TypeDef[] = [
  {
    name: 'CarouselItem',
    fields: [
      { name: 'src', type: 'string', required: true, description: 'Image URL' },
      { name: 'alt', type: 'string', description: 'Alt text (falls back to label)' },
      { name: 'label', type: 'string', description: 'Overlay title shown at the bottom of the item' },
    ],
  },
]

// More items than a typical container width can show at once — the whole point of this demo
// is to actually overflow and let you feel items continuously mask/resize while scrolling.
const carouselItems: CarouselItem[] = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop', label: 'Mountain Vista' },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=450&fit=crop', label: 'Tropical Beach' },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=450&fit=crop', label: 'Starry Night' },
  { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=450&fit=crop', label: 'Green Valley' },
  { src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=450&fit=crop', label: 'Autumn Forest' },
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop', label: 'Mountain Vista II' },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=450&fit=crop', label: 'Tropical Beach II' },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=450&fit=crop', label: 'Starry Night II' },
  { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=450&fit=crop', label: 'Green Valley II' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCarousel</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Material 3's real multi-browse carousel, ported from <code>HorizontalMultiBrowseCarousel</code>
      (<code>Carousel.kt</code>/<code>Keylines.kt</code>). One large focal item at rest, with
      neighboring items continuously masked and resized toward a small "peek" size the further they
      scroll from the focal position — items grow and shrink live as you scroll, not fixed-size
      slides. For a simpler fixed-width slide deck, see
      <router-link to="/components/data-display/msimplecarousel" class="text-primary underline">MSimpleCarousel</router-link>.
    </p>

    <ComponentDemo
      title="Multi-Browse"
      description="Scroll to feel items continuously grow toward the focal position and shrink away from it — nothing snaps between fixed sizes."
      :code="`<MCarousel :items=&quot;items&quot; :item-width=&quot;280&quot; />`"
    >
      <div class="w-full max-w-xl">
        <MCarousel :items="carouselItems" :item-width="280" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Wider Focal Item"
      description="itemWidth controls the target size of the large, fully-visible item — small items still clamp to 40-56px regardless."
      :code="`<MCarousel :items=&quot;items&quot; :item-width=&quot;400&quot; height=&quot;280px&quot; />`"
    >
      <div class="w-full max-w-xl">
        <MCarousel :items="carouselItems" :item-width="400" height="280px" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Autoplay"
      description="Auto-advance one item at a time. Pauses on hover."
      :code="`<MCarousel :items=&quot;items&quot; :autoplay=&quot;true&quot; :interval=&quot;3000&quot; />`"
    >
      <div class="w-full max-w-xl">
        <MCarousel :items="carouselItems" :autoplay="true" :interval="3000" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="carouselProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="carouselEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="carouselTypes" />

    <p class="mt-4 text-body-small text-on-surface-variant">
      Also exposes <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">next()</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">prev()</code>, and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">scrollToItem(index)</code>
      via <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">defineExpose</code>, reachable through a template ref for imperative control.
    </p>

    <ComponentPager current="MCarousel" />
  </div>
</template>
