<script setup lang="ts">
import { MCard, MAvatar, MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const cardProps: PropDef[] = [
  { name: 'variant', type: "'elevated' | 'filled' | 'outlined'", default: "'elevated'", description: 'Card surface style' },
  { name: 'elevated', type: 'boolean', default: 'false', description: "Shortcut that forces the elevated variant regardless of variant — true is equivalent to variant='elevated'" },
  { name: 'clickable', type: 'boolean', default: 'false', description: 'Makes the card an interactive element — hover/press elevation (varies by variant per M3), a focus ring/border on keyboard focus, and reachable/activatable via Tab + Enter/Space, not just mouse' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled visual state (own per-variant color, not just a dimmed one) and, when combined with clickable, blocks interaction entirely' },
  { name: 'image', type: 'string', description: 'URL for a full-bleed header image' },
  { name: 'imageAlt', type: 'string', description: 'Alt text for the header image' },
  { name: 'imageHeight', type: 'string', default: "'h-48'", description: 'Tailwind height class for the image' },
  { name: 'title', type: 'string', description: 'Card title text' },
  { name: 'subtitle', type: 'string', description: 'Supporting text below the title' },
]

const cardSlots: SlotDef[] = [
  { name: '#default', description: 'Main content area (raw, no wrapper)' },
  { name: '#header', description: 'Custom header content (overrides title/subtitle props)' },
  { name: '#media', description: 'Custom media content (alternative to the image prop)' },
  { name: '#actions', description: 'Bottom action buttons (flex row, right-aligned)' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCard</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A flexible surface for grouping related content — three variants following the M3 elevation system,
      with optional header image, structured title/subtitle, and action buttons.
    </p>

    <ComponentDemo
      title="Variants"
      description="Three card surface styles following the M3 elevation system."
      :code="`<template>
  <MCard variant=&quot;elevated&quot; class=&quot;p-6&quot;>Elevated</MCard>
  <MCard variant=&quot;filled&quot; class=&quot;p-6&quot;>Filled</MCard>
  <MCard variant=&quot;outlined&quot; class=&quot;p-6&quot;>Outlined</MCard>
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-3">
        <MCard variant="elevated" class="p-6">
          <h3 class="text-title-medium font-medium">Elevated</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Shadow-based elevation</p>
        </MCard>
        <MCard variant="filled" class="p-6">
          <h3 class="text-title-medium font-medium">Filled</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Tinted background</p>
        </MCard>
        <MCard variant="outlined" class="p-6">
          <h3 class="text-title-medium font-medium">Outlined</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Border-based</p>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Clickable"
      description="Cards with hover/press elevation (varies by variant, per M3 — elevated reaches a higher elevation than filled/outlined) plus an M3 state layer (8% hover / 12% pressed overlay), same as MButton/MListItem. Also Tab-focusable and activatable with Enter/Space, with a focus ring (or border color, for outlined) on keyboard focus — try tabbing to one instead of clicking."
      :code="`<template>
  <MCard :clickable=&quot;true&quot; class=&quot;p-6&quot;>
    Click me — I have hover feedback
  </MCard>
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard :clickable="true" class="p-6">
          <h3 class="text-title-medium font-medium">Clickable elevated</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Hover/press to see the elevation change + state layer</p>
        </MCard>
        <MCard :clickable="true" variant="outlined" class="p-6">
          <h3 class="text-title-medium font-medium">Clickable outlined</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Hover/press to see the shadow + state layer appear</p>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Disabled"
      description="The disabled prop uses each variant's own M3 disabled color (elevated swaps to plain surface, filled to surface-variant, both at 38% opacity) — not just a dimmed version of the resting one — and, combined with clickable, blocks all interaction (mouse, keyboard focus, and the hover/press state layer)."
      :code="`<template>
  <MCard variant=&quot;elevated&quot; disabled class=&quot;p-6&quot;>Disabled elevated</MCard>
  <MCard variant=&quot;filled&quot; disabled class=&quot;p-6&quot;>Disabled filled</MCard>
  <MCard variant=&quot;outlined&quot; disabled class=&quot;p-6&quot;>Disabled outlined</MCard>
  <MCard variant=&quot;elevated&quot; :clickable=&quot;true&quot; disabled class=&quot;p-6&quot;>
    Disabled + clickable — no hover/press/focus at all
  </MCard>
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard variant="elevated" disabled class="p-6">
          <h3 class="text-title-medium font-medium">Disabled elevated</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Swaps to plain surface at 38%</p>
        </MCard>
        <MCard variant="filled" disabled class="p-6">
          <h3 class="text-title-medium font-medium">Disabled filled</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Swaps to surface-variant at 38%</p>
        </MCard>
        <MCard variant="outlined" disabled class="p-6">
          <h3 class="text-title-medium font-medium">Disabled outlined</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Background stays put, only the border dims (12%)</p>
        </MCard>
        <MCard variant="elevated" :clickable="true" disabled class="p-6">
          <h3 class="text-title-medium font-medium">Disabled + clickable</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">No hover, press, or keyboard focus at all</p>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With Image"
      description="Full-bleed header image via the image prop or media slot."
      :code="`<template>
  <MCard
    image=&quot;https://picsum.photos/seed/m3ui/400/200&quot;
    image-alt=&quot;Landscape&quot;
    class=&quot;w-72&quot;
  >
    <div class=&quot;p-4&quot;>
      <h3>Card Title</h3>
      <p>Card description here.</p>
    </div>
  </MCard>
</template>`"
    >
      <div class="flex flex-wrap gap-4">
        <MCard image="https://picsum.photos/seed/m3ui-a/400/200" image-alt="Photo" class="w-72">
          <div class="p-4">
            <h3 class="text-title-medium font-medium">Mountain View</h3>
            <p class="mt-1 text-body-medium text-on-surface-variant">A beautiful landscape</p>
          </div>
        </MCard>
        <MCard image="https://picsum.photos/seed/m3ui-b/400/200" image-alt="Photo" variant="outlined" class="w-72">
          <div class="p-4">
            <h3 class="text-title-medium font-medium">Ocean Breeze</h3>
            <p class="mt-1 text-body-medium text-on-surface-variant">Outlined variant with image</p>
          </div>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Title & Subtitle"
      description="Use the title and subtitle props for structured text headers."
      :code="`<template>
  <MCard title=&quot;Card Title&quot; subtitle=&quot;Supporting text goes here&quot; class=&quot;w-72&quot;>
    <p class=&quot;px-4 pb-4 text-body-medium text-on-surface-variant&quot;>
      Card content using title and subtitle props for a structured layout.
    </p>
  </MCard>
</template>`"
    >
      <div class="flex flex-wrap gap-4">
        <MCard title="Card Title" subtitle="Supporting text goes here" class="w-72">
          <p class="px-4 pb-4 text-body-medium text-on-surface-variant">
            Card content using title and subtitle props for a structured layout.
          </p>
        </MCard>
        <MCard title="Title Only" class="w-72">
          <p class="px-4 pb-4 text-body-medium text-on-surface-variant">
            A card with just a title, no subtitle.
          </p>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Header Slot"
      description="Use the #header slot for custom layouts like an avatar with text."
      :code="`<template>
  <MCard class=&quot;w-72&quot;>
    <template #header>
      <div class=&quot;flex items-center gap-3&quot;>
        <MAvatar name=&quot;Alice Brown&quot; :size=&quot;40&quot; />
        <div>
          <h3 class=&quot;text-title-medium font-medium&quot;>Alice Brown</h3>
          <p class=&quot;text-body-small text-on-surface-variant&quot;>Product Designer</p>
        </div>
      </div>
    </template>
    <p class=&quot;px-4 pb-4 text-body-medium text-on-surface-variant&quot;>
      Custom header with avatar and role information.
    </p>
  </MCard>
</template>`"
    >
      <div class="flex flex-wrap gap-4">
        <MCard class="w-72">
          <template #header>
            <div class="flex items-center gap-3">
              <MAvatar name="Alice Brown" :size="40" />
              <div>
                <h3 class="text-title-medium font-medium">Alice Brown</h3>
                <p class="text-body-small text-on-surface-variant">Product Designer</p>
              </div>
            </div>
          </template>
          <p class="px-4 pb-4 text-body-medium text-on-surface-variant">
            Custom header with avatar and role information.
          </p>
        </MCard>
        <MCard variant="outlined" class="w-72">
          <template #header>
            <div class="flex items-center gap-3">
              <MAvatar name="Carlos Diaz" :size="40" />
              <div>
                <h3 class="text-title-medium font-medium">Carlos Diaz</h3>
                <p class="text-body-small text-on-surface-variant">Engineer</p>
              </div>
            </div>
          </template>
          <p class="px-4 pb-4 text-body-medium text-on-surface-variant">
            Outlined variant with custom header slot.
          </p>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Actions"
      description="Use the #actions slot for bottom-aligned buttons."
      :code="`<template>
  <MCard title=&quot;Confirm Action&quot; subtitle=&quot;This action cannot be undone.&quot; class=&quot;w-72&quot;>
    <p class=&quot;px-4 pb-2 text-body-medium text-on-surface-variant&quot;>
      Are you sure you want to proceed?
    </p>
    <template #actions>
      <MButton variant=&quot;text&quot;>Cancel</MButton>
      <MButton>Confirm</MButton>
    </template>
  </MCard>
</template>`"
    >
      <div class="flex flex-wrap gap-4">
        <MCard title="Confirm Action" subtitle="This action cannot be undone." class="w-72">
          <p class="px-4 pb-2 text-body-medium text-on-surface-variant">
            Are you sure you want to proceed?
          </p>
          <template #actions>
            <MButton variant="text">Cancel</MButton>
            <MButton>Confirm</MButton>
          </template>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Complete Card"
      description="Image, title, subtitle, content, and action buttons combined."
      :code="`<template>
  <MCard
    image=&quot;https://picsum.photos/seed/m3ui-card/400/200&quot;
    image-alt=&quot;Landscape&quot;
    title=&quot;Mountain Adventure&quot;
    subtitle=&quot;Explore the great outdoors&quot;
    class=&quot;w-72&quot;
  >
    <p class=&quot;px-4 pb-2 text-body-medium text-on-surface-variant&quot;>
      An unforgettable hiking experience through scenic mountain trails.
    </p>
    <template #actions>
      <MButton variant=&quot;text&quot;>Learn More</MButton>
      <MButton>Book Now</MButton>
    </template>
  </MCard>
</template>`"
    >
      <div class="flex flex-wrap gap-4">
        <MCard
          image="https://picsum.photos/seed/m3ui-card/400/200"
          image-alt="Mountain landscape"
          title="Mountain Adventure"
          subtitle="Explore the great outdoors"
          class="w-72"
        >
          <p class="px-4 pb-2 text-body-medium text-on-surface-variant">
            An unforgettable hiking experience through scenic mountain trails.
          </p>
          <template #actions>
            <MButton variant="text">Learn More</MButton>
            <MButton>Book Now</MButton>
          </template>
        </MCard>
        <MCard
          image="https://picsum.photos/seed/m3ui-card2/400/200"
          image-alt="Ocean view"
          title="Beach Getaway"
          subtitle="Relax by the sea"
          variant="outlined"
          class="w-72"
        >
          <p class="px-4 pb-2 text-body-medium text-on-surface-variant">
            A perfect weekend escape with sun, sand, and waves.
          </p>
          <template #actions>
            <MButton variant="text">Details</MButton>
            <MButton variant="tonal">Reserve</MButton>
          </template>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="cardProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="cardSlots" />

    <ComponentPager current="MCard" />
  </div>
</template>
