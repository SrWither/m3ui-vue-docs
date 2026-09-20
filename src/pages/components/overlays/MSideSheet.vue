<script setup lang="ts">
import { ref } from 'vue'
import { MSideSheet, MButton, MIcon } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const sideSheetProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model)' },
  { name: 'title', type: 'string', description: 'Sheet header title, ignored if the header slot is used' },
  { name: 'width', type: 'string', default: "'w-80'", description: 'Tailwind width class for the panel (capped at max-w-[90vw])' },
]

const sideSheetEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted when the sheet closes (scrim click, drag-to-dismiss from the left edge, or the close button) — powers v-model' },
]

const sideSheetSlots: SlotDef[] = [
  { name: 'default', description: 'Sheet body content (scrollable)' },
  { name: 'header', description: 'Replaces the default title text entirely — the close button stays' },
  { name: 'actions', description: 'Footer action buttons, shown in a bordered strip below the content' },
]

const sideSheetOpen = ref(false)
const sideSheetWide = ref(false)
const sideSheetHeader = ref(false)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSideSheet</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A panel that slides in from the right edge of the screen. Supports drag-to-dismiss from its left
      edge, or tapping the scrim.
    </p>

    <ComponentDemo
      title="Basic Side Sheet"
      description="A panel that slides in from the right. Supports drag-to-dismiss from the left edge."
      :code="`<script setup>
const open = ref(false)
<\/script>

<template>
  <MButton @click=&quot;open = true&quot;>Open Side Sheet</MButton>
  <MSideSheet v-model=&quot;open&quot; title=&quot;Details&quot;>
    <p>Side sheet content goes here.</p>
  </MSideSheet>
</template>`"
    >
      <MButton @click="sideSheetOpen = true">Open Side Sheet</MButton>
      <MSideSheet v-model="sideSheetOpen" title="Details">
        <p class="text-body-medium text-on-surface-variant">
          This is a basic side sheet that slides in from the right side of the screen.
          You can drag from the left edge to dismiss it.
        </p>
      </MSideSheet>
    </ComponentDemo>

    <ComponentDemo
      title="Wide Side Sheet with Form"
      description="Use the width prop to control the panel width. Supports actions and custom header slots."
      :code="`<script setup>
const open = ref(false)
<\/script>

<template>
  <MButton @click=&quot;open = true&quot;>Open Wide Sheet</MButton>
  <MSideSheet v-model=&quot;open&quot; title=&quot;Edit Profile&quot; width=&quot;w-96&quot;>
    <div class=&quot;space-y-4&quot;>
      <p>Form content goes here...</p>
    </div>
    <template #actions>
      <MButton variant=&quot;text&quot; @click=&quot;open = false&quot;>Cancel</MButton>
      <MButton @click=&quot;open = false&quot;>Save</MButton>
    </template>
  </MSideSheet>
</template>`"
    >
      <MButton variant="tonal" @click="sideSheetWide = true">Open Wide Sheet</MButton>
      <MSideSheet v-model="sideSheetWide" title="Edit Profile" width="w-96">
        <div class="space-y-4 text-body-medium text-on-surface-variant">
          <p>This side sheet uses a wider panel (w-96) and includes action buttons in the footer.</p>
          <p>You could place form fields, settings, or any detailed content here.</p>
        </div>
        <template #actions>
          <MButton variant="text" @click="sideSheetWide = false">Cancel</MButton>
          <MButton @click="sideSheetWide = false">Save</MButton>
        </template>
      </MSideSheet>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Header"
      description="Use the header slot to replace the title text entirely — the close button is still rendered alongside it."
      :code="`<MSideSheet v-model=&quot;open&quot;>
  <template #header>
    <div class=&quot;flex items-center gap-2&quot;>
      <MIcon name=&quot;filter_list&quot; :size=&quot;20&quot; />
      <span class=&quot;text-title-large&quot;>Filters</span>
    </div>
  </template>
  <p>Filter controls go here.</p>
</MSideSheet>`"
    >
      <MButton variant="tonal" @click="sideSheetHeader = true">Open Sheet with Custom Header</MButton>
      <MSideSheet v-model="sideSheetHeader">
        <template #header>
          <div class="flex items-center gap-2 text-on-surface">
            <MIcon name="filter_list" :size="20" />
            <span class="text-title-large">Filters</span>
          </div>
        </template>
        <p class="text-body-medium text-on-surface-variant">
          The header slot replaces the default title text — useful when you need an icon or
          other rich content next to the title.
        </p>
      </MSideSheet>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="sideSheetProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="sideSheetEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="sideSheetSlots" />

    <ComponentPager current="MSideSheet" />
  </div>
</template>
