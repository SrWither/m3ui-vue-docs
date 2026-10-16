<script setup lang="ts">
import { ref } from 'vue'
import { MLightbox, MButton, MCard, MIcon, MIconButton, useToast } from '@m3ui-vue/m3ui-vue'
import type { LightboxItem } from '@m3ui-vue/m3ui-vue'
import { MMarkdown } from '@m3ui-vue/m3ui-vue/markdown'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const lightboxProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', default: 'false', description: 'v-model — open/closed state' },
  { name: 'items', type: 'LightboxItem[]', description: 'Explicit gallery — omit it to auto-detect <img> elements rendered in the default slot instead (opt an image out with data-lightbox="false")' },
  { name: 'index', type: 'number', default: '0', description: 'v-model:index — current image index' },
  { name: 'loop', type: 'boolean', default: 'true', description: 'Wrap around when navigating past the first/last image' },
  { name: 'closeLabel', type: 'string', description: 'Overrides the close button aria-label (defaults to the active locale)' },
  { name: 'showThumbnails', type: 'boolean', default: 'false', description: 'Show a row of clickable thumbnails at the bottom for jumping directly to an image' },
  { name: 'rounded', type: 'boolean', default: 'true', description: 'Round the corners of the opened image' },
  { name: 'zoom', type: 'boolean', default: 'true', description: 'Allow zooming: double tap or double click, pinch, wheel, and the + / - / 0 keys' },
  { name: 'maxZoom', type: 'number', default: '4', description: 'Largest zoom factor' },
]

const lightboxEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Fires when the lightbox opens or closes' },
  { name: 'update:index', payload: 'number', description: 'Fires whenever the current index changes (next/prev/goTo/auto-detected image click)' },
  { name: 'change', payload: 'number', description: 'Fires alongside update:index with the new index' },
]

const lightboxSlots: SlotDef[] = [
  { name: 'default', description: 'Content to scan for <img> elements when items is not given' },
  { name: 'actions', scope: '{ item: LightboxItem, index: number }', description: 'Extra buttons in the top bar, for the image being shown (download, share, info…)' },
]

const gestures = [
  ['Swipe, ← →, arrow buttons', 'Previous / next image (the next one is already there as you drag)'],
  ['Double tap or double click', 'Zoom in at that point, or back out'],
  ['Pinch, wheel, + − 0', 'Zoom in and out, reset'],
  ['Drag while zoomed', 'Move around the image'],
  ['Drag the image down', 'Close (it follows your finger and the background fades)'],
  ['Tap the image', 'Hide or show the bars'],
  ['Tap outside, Esc', 'Close'],
]

const toast = useToast()
const actionsOpen = ref(false)
const actionsIndex = ref(0)
function download(item: LightboxItem) {
  const a = document.createElement('a')
  a.href = item.src
  a.download = ''
  a.target = '_blank'
  a.click()
}
async function share(item: LightboxItem) {
  try {
    await navigator.clipboard.writeText(item.src)
    toast.success('Link copied')
  } catch {
    toast.error('Could not copy the link')
  }
}

const custom = ref<{ open(index?: number, sourceEl?: HTMLElement): void } | null>(null)

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
      A full-screen image viewer in the style of Google Photos. Images grow out of the picture you
      tapped and shrink back into it, you swipe between them with the next one already in view, zoom
      with a double tap or a pinch, and drag one down to close. Tapping the image hides the bars.
      Wrap your content and it finds the &lt;img&gt; elements by itself, or pass items.
    </p>

    <MCard class="mb-6 flex items-start gap-3 p-4">
      <MIcon name="science" :size="22" class="mt-0.5 shrink-0 text-error" />
      <p class="text-body-medium text-on-surface">
        <strong>This component is in beta.</strong> It was just rebuilt with zoom, gestures and the container transform;
        expect its behavior to be tuned in the next releases.
      </p>
    </MCard>

    <ComponentDemo
      title="Auto-detected gallery"
      description="Wrap arbitrary content and MLightbox scans it for <img> elements, wiring click-to-open + prev/next navigation automatically — no items array needed. Each image opens from the picture you clicked and closes back into it."
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

    <ComponentDemo
      title="Actions in the top bar"
      description="The #actions slot adds buttons next to the position, for the image being shown. The bar sits on a dark gradient, so give the icons a light color."
      :code="`<MLightbox v-model=&quot;open&quot; v-model:index=&quot;index&quot; :items=&quot;items&quot;>
  <template #actions=&quot;{ item }&quot;>
    <MIconButton icon=&quot;download&quot; label=&quot;Download&quot; style=&quot;color: #fff&quot; @click=&quot;download(item)&quot; />
    <MIconButton icon=&quot;share&quot; label=&quot;Copy link&quot; style=&quot;color: #fff&quot; @click=&quot;share(item)&quot; />
  </template>
</MLightbox>`"
    >
      <MButton icon="photo_library" @click="actionsIndex = 0; actionsOpen = true">Open gallery</MButton>
      <MLightbox v-model="actionsOpen" v-model:index="actionsIndex" :items="lightboxItems">
        <template #actions="{ item }">
          <MIconButton icon="download" label="Download" style="color: #fff" @click="download(item)" />
          <MIconButton icon="share" label="Copy link" style="color: #fff" @click="share(item)" />
        </template>
      </MLightbox>
    </ComponentDemo>

    <ComponentDemo
      title="Open from your own thumbnails"
      description="With items, pass the clicked element to open(index, el) through a template ref: the image grows out of it and, if you close on that image, shrinks back into it."
      :code="`<button v-for=&quot;(p, i) in items&quot; :key=&quot;p.src&quot; @click=&quot;viewer.open(i, $event.currentTarget)&quot;>
  <img :src=&quot;p.src&quot; :alt=&quot;p.alt&quot; />
</button>
<MLightbox ref=&quot;viewer&quot; :items=&quot;items&quot; show-thumbnails />`"
    >
      <div class="flex flex-wrap gap-3">
        <button
          v-for="(p, i) in lightboxItems"
          :key="p.src"
          type="button"
          class="cursor-zoom-in overflow-hidden rounded-xl"
          @click="custom?.open(i, $event.currentTarget as HTMLElement)"
        >
          <img :src="p.src" :alt="p.alt" class="h-28 w-28 object-cover" />
        </button>
        <MLightbox ref="custom" :items="lightboxItems" show-thumbnails />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Gestures and keys</h3>
    <div class="mb-6 overflow-hidden rounded-xl border border-outline-variant">
      <div v-for="[how, what] in gestures" :key="how" class="grid grid-cols-[minmax(9rem,14rem)_1fr] gap-4 border-b border-outline-variant px-4 py-2.5 last:border-b-0">
        <span class="text-label-large text-on-surface">{{ how }}</span>
        <span class="text-body-medium text-on-surface-variant">{{ what }}</span>
      </div>
    </div>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="lightboxProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="lightboxEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="lightboxSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="lightboxTypes" />

    <p class="mt-4 text-body-small text-on-surface-variant">
      Also exposes <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">open(index?, sourceEl?)</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">close()</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">next()</code>, and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">prev()</code>
      via <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">defineExpose</code>. Passing the clicked
      element as <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">sourceEl</code> to
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">open()</code> is what makes the image
      grow out of it and shrink back on close; the auto-detected mode does this by itself. Opened through v-model alone,
      the viewer scales and fades in instead.
    </p>

    <ComponentPager current="MLightbox" />
  </div>
</template>
