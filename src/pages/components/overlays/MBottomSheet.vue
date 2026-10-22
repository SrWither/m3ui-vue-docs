<script setup lang="ts">
import { ref } from 'vue'
import { MBottomSheet, MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const bottomSheetProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model)' },
  { name: 'title', type: 'string', description: 'Sheet header title' },
  { name: 'maxHeight', type: 'string', default: "'60vh'", description: "Tallest the sheet gets, as a CSS length ('480px', '70dvh'); past it the content scrolls. With partial the default is the whole screen" },
  { name: 'partial', type: 'boolean | number', default: 'false', description: 'Opens a sheet taller than this share of the screen partially expanded (true = half, or a ratio like 0.4); dragging the handle or the content up expands it fully' },
  { name: 'expanded', type: 'boolean', default: 'false', description: 'Fully (true) or partially (false) expanded, with partial (v-model:expanded)' },
  { name: 'squareCornersWhenFull', type: 'boolean', default: 'false', description: "Squares the top corners while the expanded sheet fills the screen, as Android's views sheet does" },
  { name: 'fullHeight', type: 'boolean', default: 'false', description: 'Deprecated: use max-height="92vh"' },
]

const bottomSheetEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted when the sheet closes (scrim click, drag-to-dismiss, Escape, or the close button) — powers v-model' },
  { name: 'update:expanded', payload: 'boolean', description: 'Emitted when the sheet moves between partially and fully expanded (or closes) — powers v-model:expanded' },
]

const bottomSheetSlots: SlotDef[] = [
  { name: 'default', description: 'Sheet body content (scrollable)' },
  { name: 'actions', description: 'Footer action buttons, shown in a bordered strip below the content' },
]

const sheetOpen = ref(false)
const sheetMaxHeight = ref(false)
const sheetPartial = ref(false)
const sheetPartialExpanded = ref(false)
const sheetActions = ref(false)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MBottomSheet</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A sheet that slides up from the bottom of the screen, capped at a 640px max width and rounded top
      corners. Supports drag-to-dismiss via the handle bar, or tapping the scrim, and optionally a partially
      expanded state that expands to the full screen. For a standard sheet that stays
      on screen without a scrim, use <RouterLink to="/components/overlays/mbottomsheetscaffold" class="text-primary underline">MBottomSheetScaffold</RouterLink>.
    </p>

    <ComponentDemo
      title="Basic Bottom Sheet"
      description="A sheet that slides up from the bottom. Supports drag-to-dismiss via the handle bar."
      :code="`<script setup>
const open = ref(false)
<\/script>

<template>
  <MButton @click=&quot;open = true&quot;>Open Sheet</MButton>
  <MBottomSheet v-model=&quot;open&quot; title=&quot;My Sheet&quot;>
    <p>Sheet content goes here.</p>
  </MBottomSheet>
</template>`"
    >
      <MButton @click="sheetOpen = true">Open Bottom Sheet</MButton>
      <MBottomSheet v-model="sheetOpen" title="Example Sheet">
        <p class="text-body-medium text-on-surface-variant">
          This is a basic bottom sheet. You can drag the handle bar at the top to dismiss it,
          or tap the scrim behind it.
        </p>
      </MBottomSheet>
    </ComponentDemo>

    <ComponentDemo
      title="Fixed Max Height"
      description="maxHeight caps the sheet at any CSS length; past it the content scrolls inside. Without it the cap is 60vh."
      :code="`<script setup>
const open = ref(false)
<\/script>

<template>
  <MButton @click=&quot;open = true&quot;>Open</MButton>
  <MBottomSheet v-model=&quot;open&quot; title=&quot;Fixed Height&quot; max-height=&quot;420px&quot;>
    <p>Scrollable content here...</p>
  </MBottomSheet>
</template>`"
    >
      <MButton variant="tonal" @click="sheetMaxHeight = true">Open 420px Sheet</MButton>
      <MBottomSheet v-model="sheetMaxHeight" title="Fixed Height" max-height="420px">
        <div class="space-y-4 text-body-medium text-on-surface-variant">
          <p>This sheet never grows past 420px; the content scrolls inside it.</p>
          <p v-for="n in 8" :key="n">
            Paragraph {{ n }} &mdash; Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </MBottomSheet>
    </ComponentDemo>

    <ComponentDemo
      title="Partially Expanded"
      description="With partial, a sheet taller than half the screen opens halfway. Drag the handle or the content up (or scroll the wheel, or tap the handle) to expand it to the full screen; the content scrolls once it's expanded, and dragging it down from the top collapses it again. squareCornersWhenFull squares the corners when it fills the screen."
      :code="`<script setup>
const open = ref(false)
const expanded = ref(false)
<\/script>

<template>
  <MButton @click=&quot;open = true&quot;>Open</MButton>
  <MBottomSheet
    v-model=&quot;open&quot;
    v-model:expanded=&quot;expanded&quot;
    title=&quot;Nearby places&quot;
    partial
    square-corners-when-full
  >
    <!-- long content -->
  </MBottomSheet>
</template>`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MButton variant="tonal" @click="sheetPartial = true">Open Partial Sheet</MButton>
        <span class="text-body-medium text-on-surface-variant">expanded: {{ sheetPartialExpanded }}</span>
      </div>
      <MBottomSheet v-model="sheetPartial" v-model:expanded="sheetPartialExpanded" title="Nearby places" partial square-corners-when-full>
        <div class="space-y-4 text-body-medium text-on-surface-variant">
          <p v-for="n in 16" :key="n">
            Place {{ n }} &mdash; Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </MBottomSheet>
    </ComponentDemo>

    <ComponentDemo
      title="Sheet with Actions"
      description="Use the actions slot to place footer buttons in the sheet."
      :code="`<script setup>
const open = ref(false)
<\/script>

<template>
  <MButton @click=&quot;open = true&quot;>Open</MButton>
  <MBottomSheet v-model=&quot;open&quot; title=&quot;Confirm Action&quot;>
    <p>Are you sure you want to proceed?</p>
    <template #actions>
      <MButton variant=&quot;text&quot; @click=&quot;open = false&quot;>Cancel</MButton>
      <MButton @click=&quot;open = false&quot;>Confirm</MButton>
    </template>
  </MBottomSheet>
</template>`"
    >
      <MButton variant="tonal" @click="sheetActions = true">Open Sheet with Actions</MButton>
      <MBottomSheet v-model="sheetActions" title="Confirm Action">
        <p class="text-body-medium text-on-surface-variant">
          Are you sure you want to proceed with this action?
        </p>
        <template #actions>
          <MButton variant="text" @click="sheetActions = false">Cancel</MButton>
          <MButton @click="sheetActions = false">Confirm</MButton>
        </template>
      </MBottomSheet>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="bottomSheetProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="bottomSheetEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="bottomSheetSlots" />

    <ComponentPager current="MBottomSheet" />
  </div>
</template>
