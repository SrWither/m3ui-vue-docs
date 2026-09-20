<script setup lang="ts">
import { ref } from 'vue'
import { MNavigationRail, MFab, MIconButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const railProps: PropDef[] = [
  { name: 'modelValue', type: 'string | number', description: 'Active item value, v-model' },
  { name: 'items', type: 'NavRailItem[]', description: 'Array of rail items (see the type below)' },
  { name: 'alignment', type: "'top' | 'center' | 'bottom'", default: "'top'", description: 'Vertical alignment of items within the rail' },
  { name: 'expanded', type: 'boolean', default: 'false', description: "M3 WideNavigationRail's expanded state — items switch from icon-over-label in a narrow centered pill to icon-beside-label in a full-width pill (220px rail)" },
  { name: 'modal', type: 'boolean', default: 'false', description: "M3 ModalWideNavigationRail: the inline rail stays collapsed at all times and expanded instead opens a Teleported, scrim-backed panel flush against the screen edge above the app, closable via scrim click, Escape, or selecting an item. Emits update:expanded on close." },
]

const railEvents = [
  { name: 'update:modelValue', payload: 'string | number', description: 'Emitted when an item is clicked — powers v-model' },
  { name: 'update:expanded', payload: 'boolean', description: 'Emitted when the modal panel closes (modal mode only) — pair with :expanded for v-model:expanded' },
]

const railTypes: TypeDef[] = [
  {
    name: 'NavRailItem',
    fields: [
      { name: 'value', type: 'string | number', required: true, description: 'Unique item identifier' },
      { name: 'label', type: 'string', required: true, description: 'Item label' },
      { name: 'icon', type: 'string', required: true, description: 'Material Symbol icon name' },
      { name: 'badge', type: 'number', description: 'Numeric badge count shown on the icon' },
      { name: 'badgeDot', type: 'boolean', description: 'Shows a small dot badge instead of a count' },
      { name: 'disabled', type: 'boolean', description: 'Disables the item' },
    ],
  },
]

const railVal = ref<string | number>('home')
const railDrawerVal = ref<string | number>('inbox')
const railExpandedVal = ref<string | number>('home')
const railExpanded = ref(false)
const railModalVal = ref<string | number>('home')
const railModalExpanded = ref(false)
const railItems = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'search', label: 'Search', icon: 'search' },
  { value: 'library', label: 'Library', icon: 'video_library' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MNavigationRail</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Compact vertical navigation for desktop/tablet layouts with a pill indicator, an optional wide
      "expanded" state, and an optional modal (flyout) variant.
    </p>

    <ComponentDemo
      title="Navigation Rail"
      description="Compact vertical navigation for desktop layouts with pill indicator."
      :code="`<MNavigationRail v-model=&quot;active&quot; :items=&quot;items&quot;>
  <template #fab>
    <MFab icon=&quot;edit&quot; size=&quot;small&quot; />
  </template>
</MNavigationRail>`"
      :script="`const active = ref('home')
const items = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'search', label: 'Search', icon: 'search' },
  { value: 'library', label: 'Library', icon: 'video_library' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
]`"
    >
      <div class="flex h-72 w-full max-w-md overflow-hidden rounded-xl border border-outline-variant">
        <MNavigationRail v-model="railVal" :items="railItems">
          <template #fab>
            <MFab icon="edit" size="small" />
          </template>
        </MNavigationRail>
        <div class="flex flex-1 items-center justify-center bg-surface-container text-body-medium text-on-surface-variant">
          {{ railVal }} view
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Expanded Mode"
      description="M3's wide navigation rail: the expanded prop switches items from a narrow icon-only pill to a full-width icon+label pill (220px rail). The menu-toggle button lives in the #fab slot's header area — same spot the real WideNavigationRail uses for its header menu button."
      :code="`<MNavigationRail v-model=&quot;active&quot; :items=&quot;items&quot; :expanded=&quot;expanded&quot;>
  <template #fab>
    <MIconButton
      :icon=&quot;expanded ? 'left_panel_close' : 'left_panel_open'&quot;
      :label=&quot;expanded ? 'Collapse' : 'Expand'&quot;
      @click=&quot;expanded = !expanded&quot;
    />
  </template>
</MNavigationRail>`"
      :script="`const expanded = ref(false)`"
    >
      <div class="flex h-96 w-full max-w-md overflow-hidden rounded-xl border border-outline-variant">
        <MNavigationRail v-model="railExpandedVal" :items="railItems" :expanded="railExpanded">
          <template #fab>
            <MIconButton
              :icon="railExpanded ? 'left_panel_close' : 'left_panel_open'"
              :label="railExpanded ? 'Collapse' : 'Expand'"
              @click="railExpanded = !railExpanded"
            />
          </template>
        </MNavigationRail>
        <div class="flex flex-1 items-center justify-center bg-surface-container text-body-medium text-on-surface-variant">
          {{ railExpandedVal }} view
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Modal Mode"
      description="M3's ModalWideNavigationRail: the collapsed rail always stays put in the layout — opening it doesn't resize or reflow anything — and expanding instead opens a scrim-backed panel flush against the screen edge, on top of the app, closable via the scrim, Escape, or picking an item."
      :code="`<MNavigationRail
  v-model=&quot;active&quot;
  :items=&quot;items&quot;
  modal
  :expanded=&quot;expanded&quot;
  @update:expanded=&quot;expanded = $event&quot;
>
  <template #fab>
    <MIconButton icon=&quot;menu&quot; label=&quot;Menu&quot; @click=&quot;expanded = !expanded&quot; />
  </template>
</MNavigationRail>`"
      :script="`const expanded = ref(false)`"
    >
      <div class="relative flex h-72 w-full max-w-md overflow-hidden rounded-xl border border-outline-variant">
        <MNavigationRail
          v-model="railModalVal"
          :items="railItems"
          modal
          :expanded="railModalExpanded"
          @update:expanded="railModalExpanded = $event"
        >
          <template #fab>
            <MIconButton icon="menu" label="Menu" @click="railModalExpanded = !railModalExpanded" />
          </template>
        </MNavigationRail>
        <div class="flex flex-1 items-center justify-center bg-surface-container text-body-medium text-on-surface-variant">
          {{ railModalVal }} view
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With App Layout"
      description="Navigation rail with FAB, badges, and a content area. Typical sidebar pattern for tablet/desktop."
      :code="`<MNavigationRail v-model=&quot;active&quot; :items=&quot;items&quot;>
  <template #fab>
    <MFab icon=&quot;edit&quot; size=&quot;small&quot; />
  </template>
</MNavigationRail>`"
    >
      <div class="flex h-96 w-full max-w-xl overflow-hidden rounded-xl border border-outline-variant">
        <MNavigationRail
          v-model="railDrawerVal"
          :items="[
            { value: 'inbox', label: 'Inbox', icon: 'inbox', badge: 12 },
            { value: 'starred', label: 'Starred', icon: 'star' },
            { value: 'sent', label: 'Sent', icon: 'send' },
            { value: 'drafts', label: 'Drafts', icon: 'drafts', badge: 3 },
            { value: 'trash', label: 'Trash', icon: 'delete' },
            { value: 'settings', label: 'Settings', icon: 'settings' },
          ]"
        >
          <template #fab>
            <MFab icon="edit" size="small" color="tertiary" />
          </template>
        </MNavigationRail>
        <div class="flex flex-1 flex-col bg-surface-container">
          <div class="flex h-14 items-center gap-3 border-b border-outline-variant px-4">
            <span class="text-title-medium font-medium text-on-surface capitalize">{{ railDrawerVal }}</span>
          </div>
          <div class="flex flex-1 items-center justify-center text-body-medium text-on-surface-variant">
            {{ railDrawerVal }} content
          </div>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="railProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="railEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="railTypes" />

    <ComponentPager current="MNavigationRail" />
  </div>
</template>
