<script setup lang="ts">
import { ref } from 'vue'
import { MWindow, MButton, MIcon, MIconButton, MBadge, MAvatar, MChatBubble, MProgressBar, MDivider } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

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
  { name: 'maximizable', type: 'boolean', default: 'true', description: 'Show the maximize button and let a double-click on the title bar fill the container and restore it. Dragging a maximized window by its title bar (about 40px, so it isn\'t accidental) restores it' },
  { name: 'snap', type: 'boolean', default: 'false', description: 'Edge snapping while dragging: hold the pointer at the container\'s top edge to maximize, or at its left or right edge to fill that half. A preview shows where it will land; dragging it away restores its size' },
  { name: 'resetPosition', type: 'boolean', default: 'false', description: 'Reset position, size, and state when the window is closed' },
]

const windowEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted when the window closes — powers v-model' },
  { name: 'close', description: 'Emitted when the close button is clicked' },
  { name: 'minimize', description: 'Emitted when the minimize button is toggled (either direction)' },
  { name: 'maximize', payload: 'boolean', description: 'Emitted when the window is maximized (true) or restored (false)' },
]

const windowSlots: SlotDef[] = [
  { name: 'default', description: 'Window body content (scrollable)' },
  { name: 'header', description: 'Replaces the default icon + title, keeps drag behavior' },
  { name: 'actions', description: 'Extra buttons in the title bar, before minimize/maximize/close. MIconButton size="xs" matches the built-in ones' },
]

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
// Desktop with a taskbar
const apps = [
  { id: 'files', title: 'Files', icon: 'folder', x: 16, y: 16, w: '320px', h: '220px' },
  { id: 'terminal', title: 'Terminal', icon: 'terminal', x: 200, y: 60, w: '360px', h: '200px' },
  { id: 'notes', title: 'Notes', icon: 'sticky_note_2', x: 90, y: 150, w: '280px', h: '190px' },
]
const openApps = ref<Record<string, boolean>>({ files: true, terminal: true, notes: true })
const files = [
  { name: 'Design', icon: 'folder', meta: '12 items' },
  { name: 'Invoices', icon: 'folder', meta: '48 items' },
  { name: 'roadmap.pdf', icon: 'picture_as_pdf', meta: '2.4 MB' },
  { name: 'logo.svg', icon: 'image', meta: '18 KB' },
]
const terminalLines = ['$ pnpm build', 'vite v6 building for production...', '✓ 412 modules transformed.', '✓ built in 1.84s', '$ _']
const notesText = ref('Ideas for the launch:\n- Short demo video\n- Update the docs\n- Email beta users')

// Maximize to focus
const windowEditor = ref(false)
const editorMaximized = ref(false)
const editorFiles = ['App.vue', 'main.ts', 'router.ts', 'store.ts']
const editorFile = ref('App.vue')

// Picture-in-picture
const windowPip = ref(false)

// Snap to edges
const snapA = ref(true)
const snapB = ref(true)
const pipPlaying = ref(true)

const playlist = [
  { title: 'Midnight City', artist: 'M83', duration: '4:03', active: true },
  { title: 'Digital Love', artist: 'Daft Punk', duration: '4:58', active: false },
  { title: 'Intro', artist: 'The xx', duration: '2:07', active: false },
  { title: 'Retrograde', artist: 'James Blake', duration: '3:43', active: false },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MWindow</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A floating, draggable, resizable window — the building block for a desktop-style multi-window UI
      inside your app. Drag from the title bar, resize from any edge or corner, minimize to just the
      title bar, maximize (or double-click the title bar) to fill its container, and click any window to bring
      it to front. The window in front shows a stronger title bar and elevation, the others step back.
      Material 3 has no window component, so this one is built from M3 pieces: surface tones, elevation
      levels, 32dp icon buttons with state layers, and standard motion.
    </p>

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
    <MIconButton icon=&quot;push_pin&quot; size=&quot;xs&quot; label=&quot;Pin&quot; />
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
            <MIconButton icon="push_pin" size="xs" label="Pin" />
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
      title="Desktop with a taskbar"
      description="Three apps on a small desktop, with snap on. The window in front has the stronger title bar and shadow; click or drag another one to bring it forward. Drag one to the top or a side to snap it. Close one and reopen it from the taskbar, where a dot marks the open apps."
      flush
      :code="`<div class=&quot;relative h-[460px]&quot;>
  <MWindow
    v-for=&quot;app in apps&quot;
    :key=&quot;app.id&quot;
    v-model=&quot;open[app.id]&quot;
    snap
    :title=&quot;app.title&quot;
    :icon=&quot;app.icon&quot;
    :x=&quot;app.x&quot;
    :y=&quot;app.y&quot;
  >
    <component :is=&quot;app.view&quot; />
  </MWindow>

  <!-- Taskbar -->
  <nav class=&quot;absolute inset-x-0 bottom-0 flex justify-center gap-1 p-2&quot;>
    <MIconButton
      v-for=&quot;app in apps&quot;
      :key=&quot;app.id&quot;
      :icon=&quot;app.icon&quot;
      :label=&quot;app.title&quot;
      :variant=&quot;open[app.id] ? 'tonal' : 'standard'&quot;
      @click=&quot;open[app.id] = true&quot;
    />
  </nav>
</div>`"
    >
      <div class="relative h-[460px] w-full overflow-hidden rounded-b-md bg-gradient-to-br from-primary-container/40 via-surface-container-low to-tertiary-container/40">
        <MWindow
          v-for="app in apps"
          :key="app.id"
          v-model="openApps[app.id]!"
          :title="app.title"
          :icon="app.icon"
          :width="app.w"
          :height="app.h"
          :x="app.x"
          :y="app.y"
          :reset-position="true"
          snap
        >
          <div v-if="app.id === 'files'" class="p-2">
            <div v-for="f in files" :key="f.name" class="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-on-surface/5">
              <MIcon :name="f.icon" :size="20" :class="f.icon === 'folder' ? 'text-primary' : 'text-on-surface-variant'" />
              <span class="flex-1 truncate text-body-medium text-on-surface">{{ f.name }}</span>
              <span class="text-label-small text-on-surface-variant">{{ f.meta }}</span>
            </div>
          </div>
          <pre v-else-if="app.id === 'terminal'" class="m-0 h-full bg-inverse-surface p-3 font-mono text-body-small text-inverse-on-surface">{{ terminalLines.join('\n') }}</pre>
          <textarea
            v-else
            v-model="notesText"
            aria-label="Notes"
            class="block h-full w-full resize-none bg-tertiary-container/30 p-3 text-body-medium text-on-surface outline-none"
          />
        </MWindow>

        <nav class="absolute inset-x-0 bottom-0 flex justify-center">
          <div class="m-2 flex gap-1 rounded-full bg-surface-container-high p-1.5 shadow-elevation-2">
            <div v-for="app in apps" :key="app.id" class="relative">
              <MIconButton
                :icon="app.icon"
                :label="app.title"
                :variant="openApps[app.id] ? 'tonal' : 'standard'"
                @click="openApps[app.id] = true"
              />
              <span
                v-if="openApps[app.id]"
                class="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
              />
            </div>
          </div>
        </nav>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Snap to edges"
      description="With snap, dragging a window by its title bar to the top edge of the container previews a maximize, and to the left or right edge previews that half, like GNOME. Let go to snap; drag it away to get its previous size back. Put these two side by side."
      flush
      :code="`<MWindow v-model=&quot;mail&quot; title=&quot;Mail&quot; icon=&quot;mail&quot; snap />
<MWindow v-model=&quot;calendar&quot; title=&quot;Calendar&quot; icon=&quot;calendar_month&quot; snap />`"
    >
      <div class="relative h-[420px] w-full overflow-hidden rounded-b-md bg-surface-container-low">
        <div class="pointer-events-none absolute inset-x-0 top-2 flex justify-center">
          <span class="flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1 text-label-medium text-on-surface-variant">
            <MIcon name="drag_pan" :size="16" />
            Drag a title bar to the top or a side
          </span>
        </div>
        <MButton v-if="!snapA || !snapB" variant="tonal" class="absolute bottom-4 left-4" @click="snapA = true; snapB = true">Reopen</MButton>
        <MWindow v-model="snapA" title="Mail" icon="mail" width="300px" height="220px" :x="40" :y="60" snap :reset-position="true">
          <div class="p-2">
            <div v-for="m in ['Design review moved', 'Release notes draft', 'Your boarding pass']" :key="m" class="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-on-surface/5">
              <MAvatar :name="m" :size="28" />
              <span class="truncate text-body-medium text-on-surface">{{ m }}</span>
            </div>
          </div>
        </MWindow>
        <MWindow v-model="snapB" title="Calendar" icon="calendar_month" width="300px" height="220px" :x="380" :y="120" snap :reset-position="true">
          <div class="grid grid-cols-7 gap-1 p-3 text-center text-label-medium">
            <span v-for="(d, i) in ['M', 'T', 'W', 'T', 'F', 'S', 'S']" :key="'h' + i" class="text-on-surface-variant">{{ d }}</span>
            <span
              v-for="n in 28"
              :key="n"
              class="rounded-full py-1"
              :class="n === 14 ? 'bg-primary text-on-primary' : 'text-on-surface'"
            >{{ n }}</span>
          </div>
        </MWindow>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Maximize to focus"
      description="Maximize with the button or by double-clicking the title bar: the window fills its container and loses its rounded corners, then restores to where it was. Dragging the title bar of a maximized window also restores it, right under the pointer. The maximize event lets the content adapt, here showing the file list only when there's room."
      flush
      :code="`<MWindow
  v-model=&quot;open&quot;
  title=&quot;Editor — App.vue&quot;
  icon=&quot;code&quot;
  @maximize=&quot;maximized = $event&quot;
>
  <div class=&quot;flex h-full&quot;>
    <aside v-if=&quot;maximized&quot; class=&quot;w-44 border-r border-outline-variant&quot;>
      <!-- file list -->
    </aside>
    <pre class=&quot;flex-1&quot;>...</pre>
  </div>
</MWindow>`"
      :script="`const maximized = ref(false)`"
    >
      <div class="relative h-[420px] w-full overflow-hidden rounded-b-md bg-surface-container-low">
        <MButton v-if="!windowEditor" variant="tonal" icon="code" class="absolute left-4 top-4" @click="windowEditor = true">Open editor</MButton>
        <MWindow
          v-model="windowEditor"
          :title="`Editor — ${editorFile}`"
          icon="code"
          width="420px"
          height="260px"
          :x="40"
          :y="40"
          @maximize="editorMaximized = $event"
        >
          <div class="flex h-full">
            <aside v-if="editorMaximized" class="w-44 shrink-0 border-r border-outline-variant p-2">
              <p class="px-2 pb-2 text-label-medium text-on-surface-variant">Files</p>
              <button
                v-for="f in editorFiles"
                :key="f"
                type="button"
                class="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-body-medium"
                :class="f === editorFile ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface hover:bg-on-surface/5'"
                @click="editorFile = f"
              >
                <MIcon name="description" :size="18" />
                {{ f }}
              </button>
            </aside>
            <div class="flex min-w-0 flex-1 flex-col">
              <pre class="m-0 flex-1 overflow-auto p-4 font-mono text-body-small text-on-surface"><span class="text-tertiary">&lt;script setup lang="ts"&gt;</span>
<span class="text-primary">import</span> { ref } <span class="text-primary">from</span> 'vue'

<span class="text-primary">const</span> count = ref(0)
<span class="text-tertiary">&lt;/script&gt;</span>

<span class="text-tertiary">&lt;template&gt;</span>
  &lt;MButton @click="count++"&gt;Clicked {{ '{' }}{{ '{' }} count {{ '}' }}{{ '}' }}&lt;/MButton&gt;
<span class="text-tertiary">&lt;/template&gt;</span></pre>
              <div class="flex items-center gap-2 border-t border-outline-variant px-3 py-1.5 text-label-small text-on-surface-variant">
                <MIcon :name="editorMaximized ? 'close_fullscreen' : 'open_in_full'" :size="14" />
                {{ editorMaximized ? 'Maximized: file list shown' : 'Double-click the title bar to maximize' }}
              </div>
            </div>
          </div>
        </MWindow>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Picture-in-picture"
      description="A small floating video that keeps playing while you read: fixed size, no maximize or minimize, only close. It opens in the bottom-right corner (an out-of-range x/y is clamped to the container); drag it anywhere."
      flush
      :code="`<MWindow
  v-model=&quot;pip&quot;
  title=&quot;Live: Keynote&quot;
  icon=&quot;live_tv&quot;
  width=&quot;300px&quot;
  height=&quot;210px&quot;
  :x=&quot;9999&quot;
  :y=&quot;9999&quot;
  :resizable=&quot;false&quot;
  :maximizable=&quot;false&quot;
  :minimizable=&quot;false&quot;
>
  <video src=&quot;...&quot; autoplay />
</MWindow>`"
    >
      <div class="relative h-[360px] w-full overflow-hidden rounded-b-md bg-surface-container-low">
        <div class="space-y-3 p-6">
          <div class="h-4 w-1/3 rounded-full bg-on-surface/10" />
          <div class="h-3 w-3/4 rounded-full bg-on-surface/8" />
          <div class="h-3 w-2/3 rounded-full bg-on-surface/8" />
          <div class="h-3 w-1/2 rounded-full bg-on-surface/8" />
          <MButton v-if="!windowPip" variant="tonal" icon="picture_in_picture_alt" @click="windowPip = true">Watch in a small window</MButton>
        </div>
        <MWindow
          v-model="windowPip"
          title="Live: Keynote"
          icon="live_tv"
          width="300px"
          height="210px"
          :x="9999"
          :y="9999"
          :resizable="false"
          :maximizable="false"
          :minimizable="false"
        >
          <template #actions>
            <span class="mr-1 rounded-full bg-error px-2 py-0.5 text-label-small font-medium text-on-error">LIVE</span>
          </template>
          <div class="relative flex h-full items-center justify-center bg-gradient-to-br from-inverse-surface to-primary">
            <MIcon name="podium" :size="56" class="text-inverse-on-surface/70" />
            <div class="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-scrim/40 px-2 py-1">
              <button
                type="button"
                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-inverse-on-surface hover:bg-inverse-on-surface/10"
                :aria-label="pipPlaying ? 'Pause' : 'Play'"
                @click="pipPlaying = !pipPlaying"
              >
                <MIcon :name="pipPlaying ? 'pause' : 'play_arrow'" :size="20" />
              </button>
              <MProgressBar :value="62" class="flex-1" />
              <span class="text-label-small text-inverse-on-surface">42:10</span>
            </div>
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
                :max-width="'70%'"
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="windowEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="windowSlots" />

    <ComponentPager current="MWindow" />
  </div>
</template>
