<script setup lang="ts">
import { ref } from 'vue'
import {
  MFileUpload, MDragDropList, MTransferList, MHotkeys, MInfiniteScroll,
  MTour, MButton, MCard, MIcon,
} from '@m3ui-vue/m3ui-vue'
import type { DragDropItem, TransferItem, HotkeyBinding, TourStep } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const dragItems = ref<DragDropItem[]>([
  { id: '1', label: 'First item' },
  { id: '2', label: 'Second item' },
  { id: '3', label: 'Third item' },
  { id: '4', label: 'Fourth item' },
  { id: '5', label: 'Fifth item' },
])

const transferItems: TransferItem[] = [
  { value: 'vue', label: 'Vue', icon: 'code' },
  { value: 'react', label: 'React', icon: 'code' },
  { value: 'angular', label: 'Angular', icon: 'code' },
  { value: 'svelte', label: 'Svelte', icon: 'code' },
  { value: 'solid', label: 'Solid', icon: 'code' },
  { value: 'ember', label: 'Ember', icon: 'code' },
]
const transferValue = ref<(string | number)[]>(['vue'])

const hotkeyLog = ref<string[]>([])
const hotkeyBindings: HotkeyBinding[] = [
  { keys: 'mod+s', label: 'Save', handler: () => hotkeyLog.value.push('Save'), group: 'File' },
  { keys: 'mod+shift+p', label: 'Command Palette', handler: () => hotkeyLog.value.push('Palette'), group: 'Navigation' },
  { keys: 'mod+k', label: 'Search', handler: () => hotkeyLog.value.push('Search'), group: 'Navigation' },
]

const infiniteItems = ref(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`))
const infiniteLoading = ref(false)
const infiniteEnded = ref(false)
function loadMore() {
  infiniteLoading.value = true
  setTimeout(() => {
    const start = infiniteItems.value.length
    if (start >= 60) {
      infiniteEnded.value = true
    } else {
      for (let i = 1; i <= 10; i++) infiniteItems.value.push(`Item ${start + i}`)
    }
    infiniteLoading.value = false
  }, 800)
}

const tourOpen = ref(false)
const tourSteps: TourStep[] = [
  { target: '#tour-target-1', title: 'Welcome', content: 'This is the first step of the tour.', placement: 'bottom' },
  { target: '#tour-target-2', title: 'Features', content: 'Here you can explore the features.', placement: 'bottom' },
  { target: '#tour-target-3', title: 'Done!', content: 'You have completed the tour.', placement: 'left' },
]

const fileUploadProps: PropDef[] = [
  { name: 'accept', type: 'string', description: 'Accepted file types (e.g. ".png,.jpg", "image/*")' },
  { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple files' },
  { name: 'maxSize', type: 'number', description: 'Max file size in bytes' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the upload area' },
]

const dragDropProps: PropDef[] = [
  { name: 'modelValue', type: 'DragDropItem[]', description: 'Array of items with id and any extra data' },
  { name: 'handle', type: 'boolean', default: 'false', description: 'Require drag handle instead of whole item' },
]

const transferProps: PropDef[] = [
  { name: 'modelValue', type: '(string | number)[]', description: 'Selected (right-side) values' },
  { name: 'items', type: 'TransferItem[]', description: 'Array of { value, label, icon? }' },
  { name: 'sourceTitle', type: 'string', default: "'Disponibles'", description: 'Left panel title' },
  { name: 'targetTitle', type: 'string', default: "'Seleccionados'", description: 'Right panel title' },
  { name: 'filterable', type: 'boolean', default: 'false', description: 'Show search inputs' },
]

const hotkeyProps: PropDef[] = [
  { name: 'bindings', type: 'HotkeyBinding[]', description: 'Array of { keys, label, handler, group?, disabled? }' },
  { name: 'showOverlay', type: 'boolean', default: 'false', description: 'Show keyboard shortcut overlay' },
]

const infiniteScrollProps: PropDef[] = [
  { name: 'loading', type: 'boolean', default: 'false', description: 'Currently loading more items' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable load trigger' },
  { name: 'threshold', type: 'number', default: '100', description: 'Distance in px before sentinel triggers' },
  { name: 'loadingText', type: 'string', default: "'Cargando...'", description: 'Text shown while loading' },
  { name: 'endText', type: 'string', default: "'No hay más elementos'", description: 'Text when ended' },
  { name: 'ended', type: 'boolean', default: 'false', description: 'No more items to load' },
]

const tourProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Show/hide the tour (v-model)' },
  { name: 'steps', type: 'TourStep[]', description: 'Array of { target, title, content, placement? }' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Utility</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Interactive utilities for file handling, drag-and-drop, keyboard shortcuts, and more.
    </p>

    <!-- ── MFileUpload ─────────────────────────────────────────────────── -->
    <h2 class="mb-4 text-headline-small font-medium">MFileUpload</h2>

    <ComponentDemo
      title="File Upload"
      description="Drag-and-drop file upload zone with preview and progress tracking."
      :code="`<template>
  <MFileUpload accept=&quot;image/*&quot; :multiple=&quot;true&quot; @select=&quot;handleFiles&quot; />
</template>`"
    >
      <div class="w-full max-w-lg">
        <MFileUpload accept="image/*,.pdf" :multiple="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Single File"
      description="Restrict to a single file upload."
      :code="`<template>
  <MFileUpload accept=&quot;.pdf&quot; />
</template>`"
    >
      <div class="w-full max-w-lg">
        <MFileUpload accept=".pdf" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="fileUploadProps" />

    <!-- ── MDragDropList ────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MDragDropList</h2>

    <ComponentDemo
      title="Drag & Drop List"
      description="Reorder items by dragging. Each item needs a unique id."
      :code="`<template>
  <MDragDropList v-model=&quot;items&quot;>
    <template #item=&quot;{ item }&quot;>
      {{ item.label }}
    </template>
  </MDragDropList>
</template>`"
      :script="`const items = ref([
  { id: '1', label: 'First item' },
  { id: '2', label: 'Second item' },
  { id: '3', label: 'Third item' },
])`"
    >
      <div class="w-full max-w-sm">
        <MDragDropList v-model="dragItems">
          <template #item="{ item }">
            <div class="flex items-center gap-2">
              <MIcon name="drag_indicator" :size="20" class="text-on-surface-variant" />
              <span>{{ (item as any).label }}</span>
            </div>
          </template>
        </MDragDropList>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="dragDropProps" />

    <!-- ── MTransferList ───────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MTransferList</h2>

    <ComponentDemo
      title="Transfer List"
      description="Move items between two lists. Selected values are tracked via v-model."
      :code="`<template>
  <MTransferList
    v-model=&quot;selected&quot;
    :items=&quot;items&quot;
    source-title=&quot;Available&quot;
    target-title=&quot;Selected&quot;
    :filterable=&quot;true&quot;
  />
</template>`"
      :script="`const selected = ref(['vue'])
const items = [
  { value: 'vue', label: 'Vue', icon: 'code' },
  { value: 'react', label: 'React', icon: 'code' },
  { value: 'angular', label: 'Angular', icon: 'code' },
  { value: 'svelte', label: 'Svelte', icon: 'code' },
]`"
    >
      <div class="w-full">
        <MTransferList
          v-model="transferValue"
          :items="transferItems"
          source-title="Available"
          target-title="Selected"
          :filterable="true"
        />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="transferProps" />

    <!-- ── MHotkeys ────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MHotkeys</h2>

    <ComponentDemo
      title="Keyboard Shortcuts"
      description="Register global keyboard shortcuts with optional overlay display."
      :code="`<template>
  <MHotkeys :bindings=&quot;bindings&quot; :show-overlay=&quot;true&quot; />
</template>`"
      :script="`const bindings = [
  { keys: 'mod+s', label: 'Save', handler: () => console.log('Save'), group: 'File' },
  { keys: 'mod+shift+p', label: 'Palette', handler: () => console.log('Palette'), group: 'Navigation' },
  { keys: 'mod+k', label: 'Search', handler: () => console.log('Search'), group: 'Navigation' },
]`"
    >
      <div class="w-full">
        <MHotkeys :bindings="hotkeyBindings" :show-overlay="true" />
        <p v-if="hotkeyLog.length" class="mt-3 text-body-medium text-on-surface-variant">
          Last action: {{ hotkeyLog[hotkeyLog.length - 1] }}
        </p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="hotkeyProps" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">HotkeyBinding interface</p>
      <pre class="rounded-lg bg-surface-container p-3 text-body-small"><code>interface HotkeyBinding {
  keys: string        // Key combo: 'mod+s', 'mod+shift+p', 'escape'
  label: string       // Display name
  handler: () => void // Callback function
  group?: string      // Group in overlay
  disabled?: boolean  // Temporarily disable
}</code></pre>
    </MCard>

    <!-- ── MInfiniteScroll ─────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MInfiniteScroll</h2>

    <ComponentDemo
      title="Infinite Scroll"
      description="Automatically loads more content when scrolling near the bottom."
      :code="`<template>
  <MInfiniteScroll :loading=&quot;loading&quot; :ended=&quot;ended&quot; @load=&quot;loadMore&quot;>
    <div v-for=&quot;item in items&quot; :key=&quot;item&quot;>{{ item }}</div>
  </MInfiniteScroll>
</template>`"
      :script="`const items = ref([...])
const loading = ref(false)
const ended = ref(false)

function loadMore() {
  loading.value = true
  // fetch more items...
  loading.value = false
}`"
    >
      <div class="h-64 w-full max-w-md overflow-y-auto rounded-xl border border-outline-variant">
        <MInfiniteScroll :loading="infiniteLoading" :ended="infiniteEnded" @load="loadMore">
          <div
            v-for="item in infiniteItems"
            :key="item"
            class="border-b border-outline-variant px-4 py-3 text-body-medium"
          >
            {{ item }}
          </div>
        </MInfiniteScroll>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="infiniteScrollProps" />

    <!-- ── MTour ───────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MTour</h2>

    <ComponentDemo
      title="Guided Tour"
      description="Step-by-step walkthrough that highlights elements on the page."
      :code="`<template>
  <MButton @click=&quot;open = true&quot;>Start Tour</MButton>
  <MTour v-model=&quot;open&quot; :steps=&quot;steps&quot; />
</template>`"
      :script="`const open = ref(false)
const steps = [
  { target: '#step-1', title: 'Welcome', content: 'Start here.', placement: 'bottom' },
  { target: '#step-2', title: 'Features', content: 'Explore features.', placement: 'bottom' },
  { target: '#step-3', title: 'Done!', content: 'Tour complete.', placement: 'left' },
]`"
    >
      <div class="w-full">
        <div class="mb-4 flex items-center gap-4">
          <MButton id="tour-target-1" variant="tonal" icon="flag">Start</MButton>
          <MButton id="tour-target-2" variant="outlined" icon="explore">Features</MButton>
          <MButton id="tour-target-3" variant="outlined" icon="check_circle">Finish</MButton>
        </div>
        <MButton @click="tourOpen = true">Start Tour</MButton>
        <MTour v-model="tourOpen" :steps="tourSteps" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="tourProps" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">TourStep interface</p>
      <pre class="rounded-lg bg-surface-container p-3 text-body-small"><code>interface TourStep {
  target: string    // CSS selector for the highlighted element
  title: string     // Step title
  content: string   // Step description
  placement?: 'top' | 'bottom' | 'left' | 'right'
}</code></pre>
    </MCard>
  </div>
</template>
