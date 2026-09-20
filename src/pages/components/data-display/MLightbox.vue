<script setup lang="ts">
import { ref } from 'vue'
import { MLightbox, MButton } from '@m3ui-vue/m3ui-vue'
import type { LightboxItem } from '@m3ui-vue/m3ui-vue'
import { MMarkdown } from '@m3ui-vue/m3ui-vue/markdown'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const lightboxProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', default: 'false', description: 'v-model — open/closed state' },
  { name: 'items', type: 'LightboxItem[]', description: 'Explicit gallery — omit it to auto-detect <img> elements rendered in the default slot instead (opt an image out with data-lightbox="false")' },
  { name: 'index', type: 'number', default: '0', description: 'v-model:index — current image index' },
  { name: 'loop', type: 'boolean', default: 'true', description: 'Wrap around when navigating past the first/last image' },
  { name: 'closeLabel', type: 'string', description: 'Overrides the close button aria-label (defaults to the active locale)' },
  { name: 'showThumbnails', type: 'boolean', default: 'false', description: 'Show a row of clickable thumbnails at the bottom for jumping directly to an image' },
  { name: 'rounded', type: 'boolean', default: 'true', description: 'Round the corners of the main opened image (the thumbnail strip keeps its own fixed rounding)' },
]

const lightboxEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Fires when the lightbox opens or closes' },
  { name: 'update:index', payload: 'number', description: 'Fires whenever the current index changes (next/prev/goTo/auto-detected image click)' },
  { name: 'change', payload: 'number', description: 'Fires alongside update:index with the new index' },
]

const lightboxTypes: TypeDef[] = [
  {
    name: 'LightboxItem',
    fields: [
      { name: 'src', type: 'string', required: true, description: 'Image URL' },
      { name: 'alt', type: 'string', description: 'Alt text' },
      { name: 'caption', type: 'string', description: 'Caption shown below the image while open' },
    ],
  },
]

const lightboxItems: LightboxItem[] = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop', alt: 'Mountain Vista', caption: 'Swiss Alps at sunrise' },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop', alt: 'Tropical Beach', caption: 'Crystal clear waters' },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=800&fit=crop', alt: 'Starry Night', caption: 'Milky way over the mountains' },
]

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const lightboxThumbsOpen = ref(false)
const lightboxThumbsIndex = ref(0)

const lightboxMarkdown = `# Trip report

Some photos from the trip:

![Mountain Vista](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop)
![Tropical Beach](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop)

Click any image above to view it full-screen.`
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MLightbox</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Wrap content in MLightbox and it auto-scans for rendered &lt;img&gt; elements to wire up a
      full-screen gallery with prev/next, swipe, and thumbnails — no items array required unless you
      want explicit control.
    </p>

    <ComponentDemo
      title="Auto-detected gallery"
      description="Wrap arbitrary content and MLightbox scans it for <img> elements, wiring click-to-open + prev/next navigation automatically — no items array needed. Clicking a thumbnail expands it Discord-style from its on-screen position."
      :code="`<MLightbox>\n  <img v-for=&quot;p in photos&quot; :key=&quot;p.src&quot; :src=&quot;p.src&quot; :alt=&quot;p.alt&quot; />\n</MLightbox>`"
    >
      <MLightbox>
        <div class="flex flex-wrap gap-3">
          <img
            v-for="p in lightboxItems"
            :key="p.src"
            :src="p.src"
            :alt="p.alt"
            class="h-24 w-36 rounded-lg object-cover"
          />
        </div>
      </MLightbox>
    </ComponentDemo>

    <ComponentDemo
      title="Wraps MMarkdown output too"
      description="Since it just scans for rendered <img> tags, wrapping MMarkdown makes every image in the markdown clickable for free."
      :code="`<MLightbox>\n  <MMarkdown :source=&quot;content&quot; />\n</MLightbox>`"
    >
      <MLightbox>
        <MMarkdown :source="lightboxMarkdown" />
      </MLightbox>
    </ComponentDemo>

    <ComponentDemo
      title="Explicit items + v-model"
      description="Pass items directly and control open state / current index yourself — useful when you're not rendering plain <img> tags."
      :code="`<MLightbox v-model=&quot;open&quot; v-model:index=&quot;index&quot; :items=&quot;items&quot; />`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MButton @click="lightboxIndex = 0; lightboxOpen = true">Open gallery</MButton>
        <MLightbox v-model="lightboxOpen" v-model:index="lightboxIndex" :items="lightboxItems" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With thumbnails"
      description="Optional thumbnail strip (showThumbnails) for jumping straight to an image instead of stepping through with the arrows."
      :code="`<MLightbox v-model=&quot;open&quot; :items=&quot;items&quot; show-thumbnails />`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MButton @click="lightboxThumbsIndex = 0; lightboxThumbsOpen = true">Open gallery</MButton>
        <MLightbox v-model="lightboxThumbsOpen" v-model:index="lightboxThumbsIndex" :items="lightboxItems" show-thumbnails />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="lightboxProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="lightboxEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="lightboxTypes" />

    <p class="mt-4 text-body-small text-on-surface-variant">
      Also exposes <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">open(index?, sourceEl?)</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">close()</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">next()</code>, and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">prev()</code>
      via <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">defineExpose</code>. Passing the clicked
      element as <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">sourceEl</code> to
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">open()</code> is what drives the
      Discord-style expand-from-thumbnail transition — the auto-detected mode does this internally for you.
    </p>

    <ComponentPager current="MLightbox" />
  </div>
</template>
