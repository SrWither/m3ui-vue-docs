<script setup lang="ts">
import { ref } from 'vue'
import {
  MBottomSheet, MSideSheet, MLoadingOverlay, MWindow,
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

const windowProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Visible state (v-model)' },
  { name: 'title', type: 'string', description: 'Window title in the title bar' },
  { name: 'icon', type: 'string', description: 'Material Symbol icon in the title bar' },
  { name: 'width', type: 'string', default: "'400px'", description: 'Initial width' },
  { name: 'height', type: 'string', default: "'300px'", description: 'Initial height' },
  { name: 'minWidth', type: 'number', default: '200', description: 'Minimum width in px' },
  { name: 'minHeight', type: 'number', default: '150', description: 'Minimum height in px' },
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
      title="Chat App"
      description="A more elaborate example showing a functional chat window with messages, input, and status indicators."
      flush
      :code="`<MWindow
  v-model=&quot;open&quot;
  title=&quot;Chat — Alex&quot;
  icon=&quot;chat&quot;
  width=&quot;380px&quot;
  height=&quot;420px&quot;
>
  <template #actions>
    <MBadge :dot=&quot;true&quot; color=&quot;success&quot;>
      <MAvatar name=&quot;Alex&quot; :size=&quot;24&quot; />
    </MBadge>
  </template>
  <div class=&quot;flex h-full flex-col&quot;>
    <div class=&quot;flex-1 overflow-y-auto p-3 space-y-2&quot;>
      <!-- messages -->
    </div>
    <div class=&quot;border-t border-outline-variant p-2 flex gap-2&quot;>
      <input ... />
      <MButton size=&quot;small&quot; icon=&quot;send&quot; @click=&quot;send&quot; />
    </div>
  </div>
</MWindow>`"
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
              <div
                v-for="(msg, i) in chatMessages"
                :key="i"
                class="flex"
                :class="msg.from === 'me' ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="max-w-[75%] rounded-2xl px-3 py-2"
                  :class="msg.from === 'me'
                    ? 'rounded-br-sm bg-primary text-on-primary'
                    : 'rounded-bl-sm bg-surface-container-high text-on-surface'"
                >
                  <p class="text-body-medium">{{ msg.text }}</p>
                  <p class="mt-0.5 text-right text-label-small" :class="msg.from === 'me' ? 'text-on-primary/60' : 'text-on-surface-variant'">{{ msg.time }}</p>
                </div>
              </div>
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
