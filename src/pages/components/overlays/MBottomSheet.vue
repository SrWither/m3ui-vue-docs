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
  { name: 'fullHeight', type: 'boolean', default: 'false', description: 'Use max-h-[92vh] instead of the default max-h-[60vh]' },
]

const bottomSheetEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted when the sheet closes (scrim click, drag-to-dismiss, or the close button) — powers v-model' },
]

const bottomSheetSlots: SlotDef[] = [
  { name: 'default', description: 'Sheet body content (scrollable)' },
  { name: 'actions', description: 'Footer action buttons, shown in a bordered strip below the content' },
]

const sheetOpen = ref(false)
const sheetFullHeight = ref(false)
const sheetActions = ref(false)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MBottomSheet</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A sheet that slides up from the bottom of the screen, capped at a 640px max width and rounded top
      corners. Supports drag-to-dismiss via the handle bar, or tapping the scrim.
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
      title="Full-Height Sheet"
      description="Use fullHeight to expand the sheet to 92vh, useful for scrollable content."
      :code="`<script setup>
const open = ref(false)
<\/script>

<template>
  <MButton @click=&quot;open = true&quot;>Open Full-Height</MButton>
  <MBottomSheet v-model=&quot;open&quot; title=&quot;Full Height&quot; :full-height=&quot;true&quot;>
    <p>Scrollable content here...</p>
  </MBottomSheet>
</template>`"
    >
      <MButton variant="tonal" @click="sheetFullHeight = true">Open Full-Height Sheet</MButton>
      <MBottomSheet v-model="sheetFullHeight" title="Full-Height Sheet" :full-height="true">
        <div class="space-y-4 text-body-medium text-on-surface-variant">
          <p>This sheet uses the full height variant (92vh). Ideal for long scrollable content.</p>
          <p v-for="n in 8" :key="n">
            Paragraph {{ n }} &mdash; Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
