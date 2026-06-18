<script setup lang="ts">
import { ref } from 'vue'
import {
  MBottomSheet, MSideSheet, MLoadingOverlay,
  MButton, MCard,
} from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const sheetOpen = ref(false)
const sheetFullHeight = ref(false)
const sheetActions = ref(false)
const sideSheetOpen = ref(false)
const sideSheetWide = ref(false)
const loadingInline = ref(false)
const loadingSizes = ref(false)
const loadingText = ref(false)

const bottomSheetProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model)' },
  { name: 'title', type: 'string', description: 'Sheet header title' },
  { name: 'fullHeight', type: 'boolean', default: 'false', description: 'Use max-h-[92vh] instead of 60vh' },
]

const sideSheetProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model)' },
  { name: 'title', type: 'string', description: 'Sheet header title' },
  { name: 'width', type: 'string', default: "'w-80'", description: 'Tailwind width class for the panel' },
]

const loadingOverlayProps: PropDef[] = [
  { name: 'visible', type: 'boolean', description: 'Show/hide the overlay' },
  { name: 'text', type: 'string', description: 'Loading text message' },
  { name: 'fullscreen', type: 'boolean', default: 'false', description: 'Cover entire viewport via Teleport' },
  { name: 'opaque', type: 'boolean', default: 'false', description: 'Solid background instead of translucent' },
  { name: 'spinnerSize', type: 'number', default: '40', description: 'Spinner size in px' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Overlays &amp; Surfaces</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Panels, sheets, and overlays that appear above the main content.
    </p>

    <!-- ── MBottomSheet ──────────────────────────────────────────────────── -->
    <h2 class="mb-4 text-headline-small font-medium">MBottomSheet</h2>

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

    <!-- ── MSideSheet ────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MSideSheet</h2>

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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="sideSheetProps" />

    <!-- ── MLoadingOverlay ───────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MLoadingOverlay</h2>

    <ComponentDemo
      title="Inline Overlay on a Card"
      description="Wrap content in the #content slot to overlay a loading state on top of it."
      :code="`<script setup>
const loading = ref(false)
<\/script>

<template>
  <MButton @click=&quot;loading = !loading&quot;>Toggle Loading</MButton>
  <MLoadingOverlay :visible=&quot;loading&quot; text=&quot;Loading...&quot;>
    <template #content>
      <MCard class=&quot;p-6&quot;>
        <p>Content underneath the overlay.</p>
      </MCard>
    </template>
  </MLoadingOverlay>
</template>`"
    >
      <div class="w-full space-y-4">
        <MButton variant="tonal" @click="loadingInline = !loadingInline">
          {{ loadingInline ? 'Stop Loading' : 'Start Loading' }}
        </MButton>
        <MLoadingOverlay :visible="loadingInline" text="Loading...">
          <template #content>
            <MCard class="p-6">
              <p class="text-body-medium text-on-surface-variant">
                This card has an inline loading overlay. Toggle the button above to see it in action.
              </p>
            </MCard>
          </template>
        </MLoadingOverlay>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Spinner Sizes"
      description="Use spinnerSize to control the loading indicator size."
      :code="`<template>
  <MLoadingOverlay :visible=&quot;true&quot; :spinner-size=&quot;24&quot;>
    <template #content>
      <MCard class=&quot;p-6&quot;>Small spinner</MCard>
    </template>
  </MLoadingOverlay>
  <MLoadingOverlay :visible=&quot;true&quot; :spinner-size=&quot;60&quot;>
    <template #content>
      <MCard class=&quot;p-6&quot;>Large spinner</MCard>
    </template>
  </MLoadingOverlay>
</template>`"
    >
      <div class="flex w-full gap-4">
        <div class="flex-1">
          <MButton variant="tonal" class="mb-3" @click="loadingSizes = !loadingSizes">
            {{ loadingSizes ? 'Hide' : 'Show' }} Spinners
          </MButton>
        </div>
      </div>
      <div class="flex w-full gap-4">
        <MLoadingOverlay :visible="loadingSizes" :spinner-size="24">
          <template #content>
            <MCard class="flex-1 p-6">
              <p class="text-body-medium text-on-surface-variant">Small spinner (24px)</p>
            </MCard>
          </template>
        </MLoadingOverlay>
        <MLoadingOverlay :visible="loadingSizes" :spinner-size="60">
          <template #content>
            <MCard class="flex-1 p-6">
              <p class="text-body-medium text-on-surface-variant">Large spinner (60px)</p>
            </MCard>
          </template>
        </MLoadingOverlay>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With Text"
      description="Display a message below the spinner to inform the user."
      :code="`<script setup>
const loading = ref(false)
<\/script>

<template>
  <MLoadingOverlay :visible=&quot;loading&quot; text=&quot;Saving your changes...&quot;>
    <template #content>
      <MCard class=&quot;p-6&quot;>
        <p>Card content here.</p>
      </MCard>
    </template>
  </MLoadingOverlay>
</template>`"
    >
      <div class="w-full space-y-4">
        <MButton variant="tonal" @click="loadingText = !loadingText">
          {{ loadingText ? 'Stop' : 'Start' }} Loading
        </MButton>
        <MLoadingOverlay :visible="loadingText" text="Saving your changes...">
          <template #content>
            <MCard class="p-6">
              <p class="text-body-medium text-on-surface-variant">
                This card shows a loading overlay with a descriptive text message.
              </p>
            </MCard>
          </template>
        </MLoadingOverlay>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="loadingOverlayProps" />
  </div>
</template>
