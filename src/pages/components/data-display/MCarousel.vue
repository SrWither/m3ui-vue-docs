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
  { name: 'items', type: 'CarouselItem[]', description: 'Slides to render — required' },
  { name: 'layout', type: "'hero' | 'multi-browse' | 'uncontained'", default: "'hero'", description: 'Carousel layout style' },
  { name: 'height', type: 'string', default: "'320px'", description: 'Track height' },
  { name: 'showArrows', type: 'boolean', default: 'true', description: 'Show prev/next arrow buttons (fade in on hover)' },
  { name: 'showIndicators', type: 'boolean', default: 'true', description: 'Show dot indicators below the track' },
  { name: 'autoplay', type: 'boolean', default: 'false', description: 'Auto-advance slides — pauses while the pointer is over the carousel' },
  { name: 'interval', type: 'number', default: '5000', description: 'Autoplay interval in ms' },
  { name: 'gap', type: 'number', default: '8', description: 'Gap between items in pixels' },
  { name: 'visibleItems', type: 'number', default: '3', description: 'Number of visible items (multi-browse layout only)' },
  { name: 'animated', type: 'boolean', default: 'false', description: 'Dynamically grow the centered item and shrink the others while scrolling (uncontained layout only)' },
]

const carouselEvents: EventDef[] = [
  { name: 'change', payload: 'number', description: 'Fires with the new active item index whenever the track scrolls to a different closest item' },
]

const carouselTypes: TypeDef[] = [
  {
    name: 'CarouselItem',
    fields: [
      { name: 'src', type: 'string', required: true, description: 'Image URL' },
      { name: 'alt', type: 'string', description: 'Alt text (falls back to label)' },
      { name: 'label', type: 'string', description: 'Overlay title shown at the bottom of the slide' },
      { name: 'supportingText', type: 'string', description: 'Overlay supporting text below the label' },
      { name: 'ratio', type: 'number', description: 'Width-to-height ratio, used to size the item in the uncontained layout' },
    ],
  },
]

const carouselItems: CarouselItem[] = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop', label: 'Mountain Vista', supportingText: 'Swiss Alps at sunrise' },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=450&fit=crop', label: 'Tropical Beach', supportingText: 'Crystal clear waters' },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=450&fit=crop', label: 'Starry Night', supportingText: 'Milky way over the mountains' },
  { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=450&fit=crop', label: 'Green Valley', supportingText: 'Rolling hills in summer' },
  { src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=450&fit=crop', label: 'Autumn Forest', supportingText: 'Golden canopy' },
]

const carouselMultiRatio: CarouselItem[] = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', label: 'Wide', ratio: 1.5 },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500&fit=crop', label: 'Tall', ratio: 0.8 },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&h=500&fit=crop', label: 'Square', ratio: 1 },
  { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=700&h=350&fit=crop', label: 'Panoramic', ratio: 2 },
  { src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=600&fit=crop', label: 'Portrait', ratio: 0.7 },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCarousel</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A scroll-snap image carousel with three M3 layouts — hero (one protagonist item with peeking
      neighbors), multi-browse (several items at once), and uncontained (variable-width items, optionally
      animated by scroll position).
    </p>

    <ComponentDemo
      title="Hero"
      description="One prominent item with adjacent items peeking from the sides. Items scale and parallax as you scroll. Default layout."
      :code="`<MCarousel :items=&quot;items&quot; layout=&quot;hero&quot; />`"
    >
      <div class="w-full">
        <MCarousel :items="carouselItems" layout="hero" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Multi-browse"
      description="Multiple items visible at once. Configure how many with visibleItems."
      :code="`<MCarousel :items=&quot;items&quot; layout=&quot;multi-browse&quot; :visible-items=&quot;3&quot; />`"
    >
      <div class="w-full">
        <MCarousel :items="carouselItems" layout="multi-browse" :visible-items="3" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Uncontained Multi-Aspect Ratio"
      description="Items with different widths based on their ratio property. Static widths."
      :code="`<MCarousel :items=&quot;items&quot; layout=&quot;uncontained&quot; />`"
    >
      <div class="w-full">
        <MCarousel :items="carouselMultiRatio" layout="uncontained" height="260px" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Uncontained Animated"
      description="With animated prop, items smoothly grow as they approach the center and shrink as they move away. The protagonist item expands while others contract."
      :code="`<MCarousel :items=&quot;items&quot; layout=&quot;uncontained&quot; :animated=&quot;true&quot; />`"
    >
      <div class="w-full">
        <MCarousel :items="carouselMultiRatio" layout="uncontained" height="260px" :animated="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Autoplay"
      description="Auto-advance with hero layout. Pauses on hover."
      :code="`<MCarousel :items=&quot;items&quot; :autoplay=&quot;true&quot; :interval=&quot;3000&quot; />`"
    >
      <div class="w-full">
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
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">prev()</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">scrollToItem(index)</code>, and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">scrollToPage(page)</code>
      via <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">defineExpose</code>, reachable through a template ref for imperative control.
    </p>

    <ComponentPager current="MCarousel" />
  </div>
</template>
