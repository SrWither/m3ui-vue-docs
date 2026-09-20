<script setup lang="ts">
import { ref } from 'vue'
import { MBar, MIcon, MBadge } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const barProps: PropDef[] = [
  { name: 'title', type: 'string', description: 'Window title text' },
  { name: 'icon', type: 'string', description: 'Material Symbol name or an image src (URL, data URI, path with an extension) — detected automatically' },
  { name: 'titleAlign', type: "'start' | 'center'", default: "'start'", description: 'Centered floats over the whole bar so it stays centered regardless of side content width' },
  { name: 'controls', type: 'boolean', description: "Show the minimize/maximize/close group. Defaults to true, except on platform='macos'" },
  { name: 'minimizable', type: 'boolean', default: 'true', description: 'Show the minimize button on its own' },
  { name: 'maximizable', type: 'boolean', default: 'true', description: 'Show the maximize/restore button on its own' },
  { name: 'closable', type: 'boolean', default: 'true', description: 'Show the close button on its own' },
  { name: 'maximized', type: 'boolean', default: 'false', description: "Reflects the real OS window state — fed from your Electron main process via IPC. Swaps the maximize icon for restore" },
  { name: 'platform', type: "'windows' | 'macos'", default: "'windows'", description: "'macos' reserves space for the native traffic lights and hides the drawn controls by default" },
  { name: 'height', type: 'number', default: '36', description: 'Bar height in px' },
  { name: 'doubleClickMaximize', type: 'boolean', default: 'true', description: 'Double-clicking empty drag space emits maximize' },
]

const barEvents: EventDef[] = [
  { name: 'minimize', description: 'Emitted when the minimize button is clicked — forward to your Electron IPC call' },
  { name: 'maximize', description: 'Emitted when the maximize/restore button is clicked, or (with doubleClickMaximize) empty drag space is double-clicked' },
  { name: 'close', description: 'Emitted when the close button is clicked' },
]

const barSlots: SlotDef[] = [
  { name: 'icon', description: 'Replaces the icon — e.g. an <img> logo instead of a Material Symbol' },
  { name: 'title', description: 'Replaces the title text' },
  { name: 'default', description: 'Extra content between the title and the trailing area (drag-adjacent, e.g. tabs)' },
  { name: 'trailing', description: 'Action buttons right before minimize/maximize/close' },
]

const barWindowsMaximized = ref(false)
const barEditorMaximized = ref(true)
const barLastAction = ref('—')
const barShowcaseMaximized = ref(true)
// Stand-in app logo — a real app would point `icon` at its own asset (e.g. `/logo.png`).
const barLogoDataUri = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='12' fill='%236750A4'/%3E%3Ctext x='12' y='16.5' font-size='12' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='bold'%3EM%3C/text%3E%3C/svg%3E"

function logBarAction(action: string) {
  barLastAction.value = action
}
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MBar</h1>
    <p class="mb-8 max-w-3xl text-body-large text-on-surface-variant">
      A draggable Electron title bar for frameless windows (<code class="rounded bg-surface-container px-1 py-0.5 text-body-small">frame: false</code>).
      Sets <code class="rounded bg-surface-container px-1 py-0.5 text-body-small">-webkit-app-region: drag</code> on itself and carves out
      <code class="rounded bg-surface-container px-1 py-0.5 text-body-small">no-drag</code> around the icon, controls, and slot content, so those stay
      clickable. It can't touch the real OS window — minimize/maximize/close just emit events for your app to forward over IPC.
    </p>

    <ComponentDemo
      title="Windows / Linux"
      description="Icon + title on the left, drawn minimize/maximize/close on the right — the default look, matching Windows 11 and most Linux desktops."
      :code="`<MBar
  title=&quot;My App&quot;
  icon=&quot;terminal&quot;
  :maximized=&quot;isMaximized&quot;
  @minimize=&quot;api.minimize()&quot;
  @maximize=&quot;api.toggleMaximize()&quot;
  @close=&quot;api.close()&quot;
/>`"
    >
      <div class="w-full overflow-hidden rounded-xl border border-outline-variant shadow-elevation-2">
        <MBar
          title="My App"
          icon="terminal"
          :maximized="barWindowsMaximized"
          @minimize="logBarAction('minimize')"
          @maximize="barWindowsMaximized = !barWindowsMaximized; logBarAction('maximize/restore')"
          @close="logBarAction('close')"
        />
        <div class="flex h-40 items-center justify-center bg-surface-container-low text-body-medium text-on-surface-variant">
          Window content goes here
        </div>
      </div>
      <p class="mt-2 text-label-medium text-on-surface-variant">Last action: <span class="font-medium text-on-surface">{{ barLastAction }}</span></p>
    </ComponentDemo>

    <ComponentDemo
      title="macOS"
      description="platform=&quot;macos&quot; reserves space on the left for the OS's native traffic lights (drawn outside the web content — nothing to render there) and centers the title, which floats independently of the icon/controls width."
      :code="`<MBar
  platform=&quot;macos&quot;
  title=&quot;My App&quot;
  title-align=&quot;center&quot;
/>`"
    >
      <div class="w-full overflow-hidden rounded-xl border border-outline-variant shadow-elevation-2">
        <MBar platform="macos" title="My App" title-align="center" />
        <div class="flex h-40 items-center justify-center bg-surface-container-low text-body-medium text-on-surface-variant">
          Window content goes here
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Editor-style, with tabs"
      description="The default slot holds extra draggable-adjacent content (here, tabs) between the title and the trailing area — a common pattern in code editors. #trailing adds action buttons before the window controls."
      :code="`<MBar title=&quot;project&quot; icon=&quot;code&quot; :maximized=&quot;true&quot;>
  <div class=&quot;flex h-full items-center gap-1 px-2&quot;>
    <span class=&quot;rounded-t bg-surface px-3 py-1 text-label-small&quot;>index.ts</span>
    <span class=&quot;rounded-t px-3 py-1 text-label-small text-on-surface-variant&quot;>App.vue</span>
  </div>
  <template #trailing>
    <button class=&quot;...&quot;><MIcon name=&quot;search&quot; :size=&quot;16&quot; /></button>
  </template>
</MBar>`"
    >
      <div class="w-full overflow-hidden rounded-xl border border-outline-variant shadow-elevation-2">
        <MBar
          title="my-project"
          icon="code"
          :maximized="barEditorMaximized"
          @minimize="logBarAction('minimize')"
          @maximize="barEditorMaximized = !barEditorMaximized; logBarAction('maximize/restore')"
          @close="logBarAction('close')"
        >
          <div class="flex h-full items-center gap-1 px-2">
            <span class="rounded-t bg-surface px-3 py-1 text-label-small text-on-surface">index.ts</span>
            <span class="rounded-t px-3 py-1 text-label-small text-on-surface-variant">App.vue</span>
            <span class="rounded-t px-3 py-1 text-label-small text-on-surface-variant">style.css</span>
          </div>
          <template #trailing>
            <button class="m3-docs-bar-btn" type="button">
              <MIcon name="search" :size="16" class="text-on-surface-variant" />
            </button>
            <button class="m3-docs-bar-btn" type="button">
              <MIcon name="more_vert" :size="16" class="text-on-surface-variant" />
            </button>
          </template>
        </MBar>
        <div class="flex h-40 items-center justify-center bg-surface-container-low font-mono text-body-small text-on-surface-variant">
          const app = createApp(App)
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Granular controls & fixed size"
      description="minimizable/maximizable/closable toggle each button independently — e.g. a fixed-size about/settings window with no maximize button."
      :code="`<MBar title=&quot;About&quot; icon=&quot;info&quot; :maximizable=&quot;false&quot; />`"
    >
      <div class="w-full max-w-sm overflow-hidden rounded-xl border border-outline-variant shadow-elevation-2">
        <MBar title="About" icon="info" :maximizable="false" @close="logBarAction('close')" />
        <div class="flex h-28 items-center justify-center bg-surface-container-low text-body-medium text-on-surface-variant">
          Fixed-size dialog
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Complete Example"
      description="Everything together: an image icon (a data URI here — point it at your own asset, e.g. /logo.png), tabs in the default slot, trailing action buttons, and fully wired controls, over a small app layout to sell the illusion of a real window."
      :code="`<MBar
  :icon=&quot;logoUrl&quot;
  title=&quot;Studio&quot;
  :maximized=&quot;isMaximized&quot;
  @minimize=&quot;api.minimize()&quot;
  @maximize=&quot;isMaximized = !isMaximized; api.toggleMaximize()&quot;
  @close=&quot;api.close()&quot;
&gt;
  &lt;div class=&quot;flex h-full items-center gap-1 px-2&quot;&gt;
    &lt;span class=&quot;...&quot;&gt;Design&lt;/span&gt;
    &lt;span class=&quot;...&quot;&gt;Code&lt;/span&gt;
    &lt;span class=&quot;...&quot;&gt;Preview&lt;/span&gt;
  &lt;/div&gt;
  &lt;template #trailing&gt;
    &lt;button&gt;&lt;MIcon name=&quot;notifications&quot; /&gt;&lt;/button&gt;
    &lt;button&gt;&lt;MIcon name=&quot;settings&quot; /&gt;&lt;/button&gt;
  &lt;/template&gt;
&lt;/MBar&gt;`"
    >
      <div class="w-full overflow-hidden rounded-xl border border-outline-variant shadow-elevation-3">
        <MBar
          :icon="barLogoDataUri"
          title="Studio"
          :maximized="barShowcaseMaximized"
          @minimize="logBarAction('minimize')"
          @maximize="barShowcaseMaximized = !barShowcaseMaximized; logBarAction('maximize/restore')"
          @close="logBarAction('close')"
        >
          <div class="flex h-full items-center gap-1 px-2">
            <span class="rounded-t bg-surface px-3 py-1 text-label-small text-on-surface">Design</span>
            <span class="rounded-t px-3 py-1 text-label-small text-on-surface-variant">Code</span>
            <span class="rounded-t px-3 py-1 text-label-small text-on-surface-variant">Preview</span>
          </div>
          <template #trailing>
            <button class="m3-docs-bar-btn" type="button">
              <MBadge :count="3">
                <MIcon name="notifications" :size="16" class="text-on-surface-variant" />
              </MBadge>
            </button>
            <button class="m3-docs-bar-btn" type="button">
              <MIcon name="settings" :size="16" class="text-on-surface-variant" />
            </button>
          </template>
        </MBar>

        <div class="flex h-56 bg-surface">
          <div class="w-40 shrink-0 space-y-1 border-r border-outline-variant bg-surface-container-low p-3">
            <div class="flex items-center gap-2 rounded-lg bg-secondary-container px-2 py-1.5 text-label-medium text-on-secondary-container">
              <MIcon name="dashboard" :size="16" /> Dashboard
            </div>
            <div class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-label-medium text-on-surface-variant">
              <MIcon name="layers" :size="16" /> Layers
            </div>
            <div class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-label-medium text-on-surface-variant">
              <MIcon name="palette" :size="16" /> Assets
            </div>
          </div>
          <div class="flex flex-1 items-center justify-center p-4">
            <div class="grid grid-cols-3 gap-3">
              <div v-for="i in 6" :key="i" class="h-14 w-20 rounded-lg bg-surface-container" />
            </div>
          </div>
        </div>
      </div>
      <p class="mt-2 text-label-medium text-on-surface-variant">Last action: <span class="font-medium text-on-surface">{{ barLastAction }}</span></p>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="barProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="barEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="barSlots" />

    <ComponentPager current="MBar" />
  </div>
</template>

<style scoped>
.m3-docs-bar-btn {
  display: inline-flex;
  height: 100%;
  width: 36px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.m3-docs-bar-btn:hover {
  background-color: var(--color-surface-container-highest);
}
</style>
