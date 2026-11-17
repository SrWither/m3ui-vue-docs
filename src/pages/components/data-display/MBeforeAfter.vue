<script setup lang="ts">
import { ref } from 'vue'
import { MBeforeAfter, MButton, MChip, MIcon } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const photo = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop'
const room = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop'

const split = ref(50)
const lastChange = ref<number | null>(null)

const props: PropDef[] = [
  { name: 'modelValue', type: 'number', default: '50', description: 'Split position as a percentage (v-model). Without v-model the component keeps its own' },
  { name: 'before', type: 'string', description: 'Image URL of the "before" side (left, or top when vertical)' },
  { name: 'after', type: 'string', description: 'Image URL of the "after" side (right, or bottom when vertical)' },
  { name: 'beforeAlt', type: 'string', description: 'Alt text of the "before" image (defaults to its label)' },
  { name: 'afterAlt', type: 'string', description: 'Alt text of the "after" image (defaults to its label)' },
  { name: 'beforeLabel', type: 'string', default: "locale 'Before'", description: 'Label chip on the "before" side; an empty string hides it' },
  { name: 'afterLabel', type: 'string', default: "locale 'After'", description: 'Label chip on the "after" side; an empty string hides it' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Direction the divider moves in' },
  { name: 'hover', type: 'boolean', default: 'false', description: 'The split follows the mouse without pressing (touch still drags)' },
  { name: 'aspectRatio', type: 'string', description: 'CSS aspect-ratio of the box, e.g. "16 / 9". Unset sizes to the "after" content' },
  { name: 'hideHandle', type: 'boolean', default: 'false', description: 'Hides the round grip, leaving only the divider line' },
  { name: 'step', type: 'number', default: '1', description: 'Percentage moved by an arrow key (Page Up/Down move 10×)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables dragging and the keyboard' },
]

const slots: SlotDef[] = [
  { name: 'before', description: 'Content of the "before" side, replacing the before image' },
  { name: 'after', description: 'Content of the "after" side, replacing the after image' },
  { name: 'handle', description: 'Replaces the round grip in the middle of the divider', scope: '{ position, dragging }' },
]

const events: EventDef[] = [
  { name: 'update:modelValue', payload: 'number', description: 'Emitted while dragging or stepping with the keyboard (0–100)' },
  { name: 'change', payload: 'number', description: 'Emitted once when a drag or a key press ends, with the final position' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MBeforeAfter</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Compares two images, or any two pieces of content, stacked on top of each other and split by a handle you drag:
      a renovation, a photo edit, a redesign. Clicking anywhere moves the split there, and the handle works as a slider
      from the keyboard (arrows, Page Up/Down, Home/End).
    </p>

    <ComponentDemo
      title="Photo edit"
      description="Pass the two image URLs. The labels come from the locale; drag, click anywhere or focus the handle and use the arrow keys."
      :code="`<MBeforeAfter
  v-model=&quot;split&quot;
  :before=&quot;original&quot;
  :after=&quot;edited&quot;
  aspect-ratio=&quot;3 / 2&quot;
  class=&quot;w-full max-w-xl rounded-xl&quot;
  @change=&quot;save&quot;
/>`"
      :script="`const split = ref(50)
const original = photo + '&sat=-100'
const edited = photo`"
    >
      <div class="flex w-full flex-col items-center gap-3">
        <MBeforeAfter
          v-model="split"
          :before="`${photo}&sat=-100`"
          :after="photo"
          aspect-ratio="3 / 2"
          class="w-full max-w-xl rounded-xl"
          @change="lastChange = $event"
        />
        <p class="text-body-medium text-on-surface-variant">
          v-model: {{ split }}<template v-if="lastChange !== null"> · @change: {{ lastChange }}</template>
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Vertical, following the mouse"
      description="orientation=&quot;vertical&quot; splits top/bottom. With hover the split follows a mouse without pressing; on touch it still drags."
      :code="`<MBeforeAfter
  :before=&quot;empty&quot;
  :after=&quot;furnished&quot;
  orientation=&quot;vertical&quot;
  hover
  before-label=&quot;Empty&quot;
  after-label=&quot;Staged&quot;
  aspect-ratio=&quot;3 / 2&quot;
  class=&quot;w-full max-w-xl rounded-xl&quot;
/>`"
    >
      <MBeforeAfter
        :before="`${room}&sat=-60&blur=40`"
        :after="room"
        orientation="vertical"
        hover
        before-label="Empty"
        after-label="Staged"
        aspect-ratio="3 / 2"
        class="w-full max-w-xl rounded-xl"
      />
    </ComponentDemo>

    <ComponentDemo
      title="Any content"
      description="The before and after slots take anything, not only images: here, an old and a new version of the same card."
      :code="`<MBeforeAfter before-label=&quot;v1&quot; after-label=&quot;v2&quot; class=&quot;w-full max-w-md rounded-xl&quot;>
  <template #before>
    <div class=&quot;h-full bg-surface-container p-6&quot;>…old design…</div>
  </template>
  <template #after>
    <div class=&quot;h-full bg-primary-container p-6&quot;>…new design…</div>
  </template>
</MBeforeAfter>`"
    >
      <MBeforeAfter before-label="v1" after-label="v2" class="w-full max-w-md rounded-xl">
        <template #before>
          <div class="flex h-full flex-col gap-3 bg-surface-container p-6 pt-14">
            <p class="text-title-medium text-on-surface">Weekly summary</p>
            <p class="text-body-medium text-on-surface-variant">You walked 42,180 steps this week. That is 8% more than last week.</p>
            <div><MButton variant="outlined">See details</MButton></div>
          </div>
        </template>
        <template #after>
          <div class="flex h-full flex-col items-end gap-3 bg-primary-container p-6 pt-14 text-right text-on-primary-container">
            <div class="flex items-center gap-2">
              <MIcon name="directions_walk" :size="28" />
              <p class="text-title-large">42,180 steps</p>
            </div>
            <div class="flex gap-2"><MChip>+8% vs last week</MChip></div>
            <div><MButton icon="arrow_forward">Details</MButton></div>
          </div>
        </template>
      </MBeforeAfter>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <ComponentPager current="MBeforeAfter" />
  </div>
</template>
