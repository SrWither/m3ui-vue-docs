<script setup lang="ts">
import { ref } from 'vue'
import {
  MBottomSheet, MSideSheet, MLoadingOverlay, MWindow, MChatBubble,
  MButton, MCard, MIcon, MTextField, MSelect, MSwitch,
  MChip, MAvatar, MDivider, MProgressBar, MBadge,
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

const windowBasic = ref(true)
const windowCustom = ref(false)
const windowMulti1 = ref(false)
const windowMulti2 = ref(false)
const windowReset = ref(false)
const windowApp = ref(false)
const chatMessages = ref([
  { from: 'them', name: 'Alex', text: 'Hey! How\'s the project going?', time: '10:32' },
  { from: 'me', name: 'You', text: 'Almost done, just finishing the UI components.', time: '10:33' },
  { from: 'them', name: 'Alex', text: 'Nice! Can you show me a preview?', time: '10:34' },
])
const chatInput = ref('')
function sendChat() {
  if (!chatInput.value.trim()) return
  const now = new Date()
  chatMessages.value.push({ from: 'me', name: 'You', text: chatInput.value, time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}` })
  chatInput.value = ''
}

const windowConstrained = ref(false)
const windowPlayer = ref(false)
const playerPlaying = ref(false)
const playerProgress = ref(35)
const playerVolume = ref(75)
const playlist = [
  { title: 'Midnight City', artist: 'M83', duration: '4:03', active: true },
  { title: 'Digital Love', artist: 'Daft Punk', duration: '4:58', active: false },
  { title: 'Intro', artist: 'The xx', duration: '2:07', active: false },
  { title: 'Retrograde', artist: 'James Blake', duration: '3:43', active: false },
]

const windowProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Visible state (v-model)' },
  { name: 'title', type: 'string', description: 'Window title in the title bar' },
  { name: 'icon', type: 'string', description: 'Material Symbol icon in the title bar' },
  { name: 'width', type: 'string', default: "'400px'", description: 'Initial width' },
  { name: 'height', type: 'string', default: "'300px'", description: 'Initial height' },
  { name: 'minWidth', type: 'number', default: '200', description: 'Minimum width in px' },
  { name: 'minHeight', type: 'number', default: '150', description: 'Minimum height in px' },
  { name: 'maxWidth', type: 'number', description: 'Maximum width in px' },
  { name: 'maxHeight', type: 'number', description: 'Maximum height in px' },
  { name: 'x', type: 'number', default: '50', description: 'Initial X position' },
  { name: 'y', type: 'number', default: '50', description: 'Initial Y position' },
  { name: 'resizable', type: 'boolean', default: 'true', description: 'Allow resizing from edges and corners' },
  { name: 'draggable', type: 'boolean', default: 'true', description: 'Allow dragging from the title bar' },
  { name: 'closable', type: 'boolean', default: 'true', description: 'Show close button' },
  { name: 'minimizable', type: 'boolean', default: 'true', description: 'Show minimize button (collapses to title bar)' },
  { name: 'resetPosition', type: 'boolean', default: 'false', description: 'Reset position, size, and state when the window is closed' },
]

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
    <h2 id="mbottomsheet" class="mb-4 text-headline-small font-medium">MBottomSheet</h2>

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
    <h2 id="msidesheet" class="mb-4 mt-14 text-headline-small font-medium">MSideSheet</h2>

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
    <h2 id="mloadingoverlay" class="mb-4 mt-14 text-headline-small font-medium">MLoadingOverlay</h2>

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

    <!-- ── MWindow ──────────────────────────────────────────────────────── -->
    <h2 id="mwindow" class="mb-4 mt-14 text-headline-small font-medium">MWindow</h2>

    <ComponentDemo
      title="Draggable Window"
      description="A floating window that can be dragged from the title bar, resized from edges and corners, and minimized to the title bar only."
      :code="`<MButton @click=&quot;open = true&quot;>Open Window</MButton>
<MWindow
  v-model=&quot;open&quot;
  title=&quot;My Window&quot;
  icon=&quot;terminal&quot;
  width=&quot;420px&quot;
  height=&quot;280px&quot;
>
  <div class=&quot;p-4&quot;>
    <p>Drag the title bar to move. Resize from any edge or corner.</p>
  </div>
</MWindow>`"
      :script="`const open = ref(true)`"
    >
      <div class="relative h-96 w-full overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
        <MButton v-if="!windowBasic" variant="tonal" class="absolute left-4 top-4" @click="windowBasic = true">Open Window</MButton>
        <MWindow
          v-model="windowBasic"
          title="My Window"
          icon="terminal"
          width="420px"
          height="250px"
          :x="20"
          :y="20"
        >
          <div class="p-4 text-body-medium text-on-surface-variant">
            <p>Drag the title bar to move this window around.</p>
            <p class="mt-2">Resize from any edge or corner. Click minimize to collapse to the title bar.</p>
          </div>
        </MWindow>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Header & Actions"
      description="Use the #actions slot to add extra buttons, or #header to fully customize the title bar."
      :code="`<MWindow v-model=&quot;open&quot; title=&quot;Settings&quot; icon=&quot;settings&quot;>
  <template #actions>
    <button class=&quot;...&quot;>
      <MIcon name=&quot;push_pin&quot; :size=&quot;16&quot; />
    </button>
  </template>
  <div class=&quot;p-4&quot;>Window content...</div>
</MWindow>`"
    >
      <div class="relative h-96 w-full overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
        <MButton v-if="!windowCustom" variant="tonal" class="absolute left-4 top-4" @click="windowCustom = true">Open Window</MButton>
        <MWindow
          v-model="windowCustom"
          title="Settings"
          icon="settings"
          width="380px"
          height="260px"
          :x="30"
          :y="30"
        >
          <template #actions>
            <button class="flex h-7 w-7 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/8">
              <MIcon name="push_pin" :size="16" />
            </button>
          </template>
          <div class="p-4 text-body-medium text-on-surface-variant">
            <p>This window has a custom action button (pin) in the title bar alongside the default minimize and close buttons.</p>
          </div>
        </MWindow>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Multiple Windows"
      description="Open multiple windows — clicking or dragging a window brings it to the front automatically."
      :code="`<MWindow v-model=&quot;win1&quot; title=&quot;Notes&quot; icon=&quot;edit_note&quot; :x=&quot;20&quot; :y=&quot;20&quot;>
  <div class=&quot;p-4&quot;>First window</div>
</MWindow>
<MWindow v-model=&quot;win2&quot; title=&quot;Calculator&quot; icon=&quot;calculate&quot; :x=&quot;120&quot; :y=&quot;60&quot;>
  <div class=&quot;p-4&quot;>Second window</div>
</MWindow>`"
    >
      <div class="relative h-96 w-full overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
        <div class="absolute left-4 top-4 flex gap-2">
          <MButton v-if="!windowMulti1" variant="tonal" size="small" @click="windowMulti1 = true">Notes</MButton>
          <MButton v-if="!windowMulti2" variant="tonal" size="small" @click="windowMulti2 = true">Calculator</MButton>
        </div>
        <MWindow
          v-model="windowMulti1"
          title="Notes"
          icon="edit_note"
          width="350px"
          height="220px"
          :x="10"
          :y="10"
        >
          <div class="p-4 text-body-medium text-on-surface-variant">
            <p>First window. Click the other window to bring it to front.</p>
          </div>
        </MWindow>
        <MWindow
          v-model="windowMulti2"
          title="Calculator"
          icon="calculate"
          width="320px"
          height="200px"
          :x="140"
          :y="70"
        >
          <div class="p-4 text-body-medium text-on-surface-variant">
            <p>Second window. Drag, resize, minimize — all independent.</p>
          </div>
        </MWindow>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Reset Position"
      description="With resetPosition, the window returns to its initial position, size, and state every time it reopens."
      :code="`<MWindow
  v-model=&quot;open&quot;
  title=&quot;Reset Demo&quot;
  icon=&quot;restart_alt&quot;
  :reset-position=&quot;true&quot;
/>`"
    >
      <div class="relative h-96 w-full overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
        <MButton v-if="!windowReset" variant="tonal" class="absolute left-4 top-4" @click="windowReset = true">Open Window</MButton>
        <MWindow
          v-model="windowReset"
          title="Reset Demo"
          icon="restart_alt"
          width="360px"
          height="220px"
          :x="30"
          :y="30"
          :reset-position="true"
        >
          <div class="p-4 text-body-medium text-on-surface-variant">
            <p>Move, resize, or minimize this window, then close it.</p>
            <p class="mt-2">When you reopen it, it returns to its original position and size.</p>
          </div>
        </MWindow>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Size Constraints"
      description="Use maxWidth and maxHeight to limit how large the window can grow. The window also auto-clamps to its container — try resizing your browser."
      :code="`<MWindow
  v-model=&quot;open&quot;
  title=&quot;Constrained&quot;
  icon=&quot;aspect_ratio&quot;
  width=&quot;300px&quot;
  height=&quot;200px&quot;
  :min-width=&quot;200&quot;
  :min-height=&quot;150&quot;
  :max-width=&quot;500&quot;
  :max-height=&quot;300&quot;
/>`"
    >
      <div class="relative h-96 w-full overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
        <MButton v-if="!windowConstrained" variant="tonal" class="absolute left-4 top-4" @click="windowConstrained = true">Open Window</MButton>
        <MWindow
          v-model="windowConstrained"
          title="Constrained"
          icon="aspect_ratio"
          width="300px"
          height="200px"
          :min-width="200"
          :min-height="150"
          :max-width="500"
          :max-height="300"
          :x="20"
          :y="20"
        >
          <div class="p-4 text-body-medium text-on-surface-variant">
            <p>This window can't shrink below 200×150 or grow beyond 500×300.</p>
            <p class="mt-2">It also auto-clamps to the container boundaries on resize.</p>
          </div>
        </MWindow>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Chat App"
      description="A more elaborate example showing a functional chat window with messages, input, and status indicators."
      flush
      :code="`<MWindow
  v-model=&quot;open&quot;
  title=&quot;Chat — Alex&quot;
  icon=&quot;chat&quot;
  width=&quot;380px&quot;
  height=&quot;420px&quot;
  :reset-position=&quot;true&quot;
>
  <template #actions>
    <MBadge :dot=&quot;true&quot; color=&quot;success&quot;>
      <MAvatar name=&quot;Alex&quot; :size=&quot;24&quot; />
    </MBadge>
  </template>
  <div class=&quot;flex h-full flex-col&quot;>
    <div class=&quot;flex-1 space-y-2 overflow-y-auto p-3&quot;>
      <MChatBubble
        v-for=&quot;msg in messages&quot;
        :text=&quot;msg.text&quot;
        :time=&quot;msg.time&quot;
        :side=&quot;msg.from === 'me' ? 'right' : 'left'&quot;
        :sender=&quot;msg.from !== 'me' ? 'Alex' : undefined&quot;
        :status=&quot;msg.from === 'me' ? 'read' : undefined&quot;
      />
    </div>
    <div class=&quot;flex items-center gap-2 border-t border-outline-variant p-2&quot;>
      <input
        v-model=&quot;input&quot;
        placeholder=&quot;Type a message...&quot;
        class=&quot;flex-1 rounded-full bg-surface-container-high px-4 py-2 text-body-medium outline-none&quot;
        @keydown.enter=&quot;send&quot;
      />
      <button
        class=&quot;flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary&quot;
        @click=&quot;send&quot;
      >
        <MIcon name=&quot;send&quot; :size=&quot;18&quot; />
      </button>
    </div>
  </div>
</MWindow>`"
      :script="`const open = ref(false)
const input = ref('')
const messages = ref([
  { from: 'them', text: 'Hey! How\\'s the project going?', time: '10:32' },
  { from: 'me', text: 'Almost done, just finishing the UI.', time: '10:33' },
])
function send() {
  if (!input.value.trim()) return
  messages.value.push({ from: 'me', text: input.value, time: '...' })
  input.value = ''
}`"
    >
      <div class="relative h-[500px] w-full overflow-hidden rounded-b-md bg-surface-container-low">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center text-on-surface-variant">
            <MIcon name="desktop_windows" :size="48" class="mb-2 opacity-20" />
            <p class="text-body-medium opacity-40">Desktop workspace</p>
          </div>
        </div>
        <MButton v-if="!windowApp" variant="tonal" class="absolute left-4 top-4 z-10" @click="windowApp = true">
          <MBadge :count="1" color="error">
            <MIcon name="chat" :size="18" />
          </MBadge>
          <span class="ml-2">Open Chat</span>
        </MButton>
        <MWindow
          v-model="windowApp"
          title="Chat — Alex"
          icon="chat"
          width="380px"
          height="420px"
          :x="40"
          :y="20"
          :reset-position="true"
        >
          <template #actions>
            <MBadge :dot="true" color="success">
              <MAvatar name="Alex" :size="24" />
            </MBadge>
          </template>
          <div class="flex h-full flex-col">
            <div class="flex-1 space-y-2 overflow-y-auto p-3">
              <MChatBubble
                v-for="(msg, i) in chatMessages"
                :key="i"
                :text="msg.text"
                :time="msg.time"
                :side="msg.from === 'me' ? 'right' : 'left'"
                :sender="msg.from !== 'me' ? msg.name : undefined"
                :status="msg.from === 'me' ? 'read' : undefined"
              />
            </div>
            <div class="flex items-center gap-2 border-t border-outline-variant p-2">
              <input
                v-model="chatInput"
                type="text"
                placeholder="Type a message..."
                class="flex-1 rounded-full bg-surface-container-high px-4 py-2 text-body-medium text-on-surface outline-none placeholder:text-on-surface-variant"
                @keydown.enter="sendChat"
              />
              <button
                class="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary transition-colors hover:bg-primary/90"
                @click="sendChat"
              >
                <MIcon name="send" :size="18" />
              </button>
            </div>
          </div>
        </MWindow>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Music Player"
      description="A floating music player with album art, playlist, playback controls, and a progress bar — all inside a draggable, resizable window."
      flush
      :code="`<MWindow
  v-model=&quot;open&quot;
  title=&quot;Now Playing&quot;
  icon=&quot;headphones&quot;
  width=&quot;360px&quot;
  height=&quot;440px&quot;
  :reset-position=&quot;true&quot;
>
  <div class=&quot;flex h-full flex-col&quot;>
    &lt;!-- Album art + controls --&gt;
    <div class=&quot;relative bg-gradient-to-br from-primary/20 via-tertiary/10 to-secondary/20 px-5 py-4&quot;>
      <div class=&quot;flex items-center gap-4&quot;>
        <div class=&quot;flex h-16 w-16 items-center justify-center rounded-xl bg-primary/15&quot;>
          <MIcon name=&quot;music_note&quot; :size=&quot;32&quot; class=&quot;text-primary&quot; />
        </div>
        <div class=&quot;min-w-0 flex-1&quot;>
          <p class=&quot;text-title-medium font-medium&quot;>Midnight City</p>
          <p class=&quot;text-body-small text-on-surface-variant&quot;>M83</p>
          <div class=&quot;mt-1.5 flex items-center gap-2&quot;>
            <span class=&quot;text-label-small&quot;>1:24</span>
            <MProgressBar :value=&quot;35&quot; class=&quot;flex-1&quot; />
            <span class=&quot;text-label-small&quot;>4:03</span>
          </div>
        </div>
      </div>
      <div class=&quot;mt-3 flex items-center justify-center gap-1&quot;>
        <MIconButton icon=&quot;shuffle&quot; />
        <MIconButton icon=&quot;skip_previous&quot; />
        <button class=&quot;h-12 w-12 rounded-full bg-primary text-on-primary&quot; @click=&quot;playing = !playing&quot;>
          <MIcon :name=&quot;playing ? 'pause' : 'play_arrow'&quot; :size=&quot;28&quot; />
        </button>
        <MIconButton icon=&quot;skip_next&quot; />
        <MIconButton icon=&quot;repeat&quot; />
      </div>
    </div>
    <MDivider />
    &lt;!-- Playlist --&gt;
    <div class=&quot;flex-1 overflow-y-auto px-2 py-1&quot;>
      <div v-for=&quot;track in playlist&quot; class=&quot;flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-on-surface/5&quot;>
        <MIcon :name=&quot;track.active ? 'equalizer' : 'music_note'&quot; :size=&quot;16&quot; />
        <div class=&quot;flex-1&quot;>
          <p class=&quot;text-body-medium&quot;>{{ track.title }}</p>
          <p class=&quot;text-label-small text-on-surface-variant&quot;>{{ track.artist }}</p>
        </div>
        <span class=&quot;text-label-small&quot;>{{ track.duration }}</span>
      </div>
    </div>
    &lt;!-- Volume --&gt;
    <div class=&quot;flex items-center gap-2 border-t border-outline-variant px-4 py-2&quot;>
      <MIcon name=&quot;volume_down&quot; :size=&quot;18&quot; />
      <MProgressBar :value=&quot;75&quot; class=&quot;flex-1&quot; />
      <MIcon name=&quot;volume_up&quot; :size=&quot;18&quot; />
    </div>
  </div>
</MWindow>`"
      :script="`const open = ref(false)
const playing = ref(false)
const playlist = [
  { title: 'Midnight City', artist: 'M83', duration: '4:03', active: true },
  { title: 'Digital Love', artist: 'Daft Punk', duration: '4:58', active: false },
  { title: 'Intro', artist: 'The xx', duration: '2:07', active: false },
  { title: 'Retrograde', artist: 'James Blake', duration: '3:43', active: false },
]`"
    >
      <div class="relative h-[520px] w-full overflow-hidden rounded-b-md bg-surface-container-low">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center text-on-surface-variant">
            <MIcon name="desktop_windows" :size="48" class="mb-2 opacity-20" />
            <p class="text-body-medium opacity-40">Desktop workspace</p>
          </div>
        </div>
        <MButton v-if="!windowPlayer" variant="tonal" class="absolute left-4 top-4 z-10" @click="windowPlayer = true">
          <MIcon name="headphones" :size="18" />
          <span class="ml-2">Open Player</span>
        </MButton>
        <MWindow
          v-model="windowPlayer"
          title="Now Playing"
          icon="headphones"
          width="360px"
          height="440px"
          :x="30"
          :y="20"
          :reset-position="true"
        >
          <div class="flex h-full flex-col">
            <!-- Album art + info -->
            <div class="relative bg-gradient-to-br from-primary/20 via-tertiary/10 to-secondary/20 px-5 py-4">
              <div class="flex items-center gap-4">
                <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/15 shadow-elevation-1">
                  <MIcon name="music_note" :size="32" class="text-primary" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-title-medium font-medium text-on-surface">Midnight City</p>
                  <p class="text-body-small text-on-surface-variant">M83 — Hurry Up, We're Dreaming</p>
                  <div class="mt-1.5 flex items-center gap-2">
                    <span class="text-label-small text-on-surface-variant">1:24</span>
                    <MProgressBar :value="playerProgress" class="flex-1" />
                    <span class="text-label-small text-on-surface-variant">4:03</span>
                  </div>
                </div>
              </div>
              <!-- Controls -->
              <div class="mt-3 flex items-center justify-center gap-1">
                <button class="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/8">
                  <MIcon name="shuffle" :size="20" />
                </button>
                <button class="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/8">
                  <MIcon name="skip_previous" :size="24" />
                </button>
                <button
                  class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-elevation-1 transition-colors hover:bg-primary/90"
                  @click="playerPlaying = !playerPlaying"
                >
                  <MIcon :name="playerPlaying ? 'pause' : 'play_arrow'" :size="28" />
                </button>
                <button class="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/8">
                  <MIcon name="skip_next" :size="24" />
                </button>
                <button class="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/8">
                  <MIcon name="repeat" :size="20" />
                </button>
              </div>
            </div>

            <MDivider />

            <!-- Playlist -->
            <div class="flex-1 overflow-y-auto">
              <div class="px-2 py-1">
                <p class="px-3 py-2 text-label-medium font-medium text-on-surface-variant">Up Next</p>
                <div
                  v-for="(track, i) in playlist"
                  :key="i"
                  class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-on-surface/5"
                  :class="track.active ? 'bg-primary/8' : ''"
                >
                  <div
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    :class="track.active ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'"
                  >
                    <MIcon :name="track.active ? 'equalizer' : 'music_note'" :size="16" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-body-medium" :class="track.active ? 'font-medium text-primary' : 'text-on-surface'">{{ track.title }}</p>
                    <p class="text-label-small text-on-surface-variant">{{ track.artist }}</p>
                  </div>
                  <span class="text-label-small text-on-surface-variant">{{ track.duration }}</span>
                </div>
              </div>
            </div>

            <!-- Volume -->
            <div class="flex items-center gap-2 border-t border-outline-variant px-4 py-2">
              <MIcon name="volume_down" :size="18" class="text-on-surface-variant" />
              <MProgressBar :value="playerVolume" class="flex-1" />
              <MIcon name="volume_up" :size="18" class="text-on-surface-variant" />
            </div>
          </div>
        </MWindow>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="windowProps" />

    <MCard class="mt-4 border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Slots</p>
      <pre class="overflow-x-auto rounded-lg bg-surface-container p-3 text-body-small"><code>#default  — Window body content (scrollable)
#header   — Custom title bar content (keeps drag behavior)
#actions  — Extra buttons in the title bar (before minimize/close)</code></pre>
    </MCard>
  </div>
</template>
