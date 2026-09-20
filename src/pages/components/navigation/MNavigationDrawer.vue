<script setup lang="ts">
import { ref } from 'vue'
import { MNavigationDrawer, MButton, MIconButton, MIcon, MAvatar } from '@m3ui-vue/m3ui-vue'
import type { DrawerSection } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const drawerProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model)' },
  { name: 'selected', type: 'string | number', description: 'Currently selected item value' },
  { name: 'sections', type: 'DrawerSection[]', description: 'Array of sections (see the types below)' },
  { name: 'title', type: 'string', description: 'Drawer header title (ignored if the #header slot is used)' },
  { name: 'modal', type: 'boolean', default: 'true', description: 'Modal with a Teleported scrim overlay, or an inline sidebar that participates in normal layout flow' },
  { name: 'collapsed', type: 'boolean', default: 'false', description: 'Compact mode (72px) showing only icons — inline variant only' },
  { name: 'width', type: 'string', description: 'Custom drawer width (e.g. "320px", "25rem"). Defaults to 22.5rem (360px)' },
  { name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", default: "'left'", description: 'Which side the drawer opens from. Top/bottom are only available for the modal variant — the inline variant always renders on left or right.' },
]

const drawerSlots: SlotDef[] = [
  { name: '#toggle', description: 'Collapse/expand toggle button area (inline variant only). Renders inside a 72px centered container with a bottom border that aligns with MTopAppBar (64px height). The icon stays anchored in the same position during collapse/expand transitions.' },
  { name: '#header', description: 'Custom header content (e.g. profile card, logo). Fully generic, no positioning constraints applied — overrides the title prop.' },
  { name: '#default', description: 'Free content rendered at the end of the scrollable area, after all sections. Use for footers, logout buttons, or any custom content.' },
]

const drawerEvents = [
  { name: 'select', payload: 'string | number', description: 'Fires when an item is clicked — use to track the selected item' },
  { name: 'update:modelValue', payload: 'boolean', description: 'Open/closed state for v-model' },
]

const drawerTypes: TypeDef[] = [
  {
    name: 'DrawerItem',
    fields: [
      { name: 'value', type: 'string | number', required: true, description: 'Unique item identifier' },
      { name: 'label', type: 'string', required: true, description: 'Item label' },
      { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
      { name: 'badge', type: 'string | number', description: 'Badge text/count shown on the right' },
      { name: 'disabled', type: 'boolean', description: 'Disables the item' },
      { name: 'to', type: 'string | Record<string, any>', description: 'Vue Router destination — renders as RouterLink instead of button' },
      { name: 'children', type: 'DrawerItem[]', description: 'Nested sub-items (recursive, unlimited depth)' },
      { name: 'iconSize', type: 'number', description: 'Override icon size (px) for this item' },
      { name: 'labelClass', type: 'string', description: "Override label CSS class (e.g. 'text-label-large')" },
      { name: 'py', type: 'string', description: "Override vertical padding class (e.g. 'py-2.5')" },
      { name: 'click', type: '() => void', description: 'Per-item callback, fires before the select event' },
    ],
  },
  {
    name: 'DrawerSection',
    fields: [
      { name: 'title', type: 'string', description: 'Section header text' },
      { name: 'icon', type: 'string', description: 'Icon for a collapsible section header' },
      { name: 'items', type: 'DrawerItem[]', required: true, description: 'Items in this section' },
      { name: 'collapsible', type: 'boolean', description: 'Section can be expanded/collapsed by clicking its header' },
    ],
  },
]

const S = { iconSize: 24, labelClass: 'text-label-large', py: 'py-2.5' } as const

const drawerOpen = ref(false)
const drawerSelected = ref<string | number>('inbox')
const drawerSections: DrawerSection[] = [
  {
    title: 'Mail',
    items: [
      { value: 'inbox', label: 'Inbox', icon: 'inbox', badge: '12' },
      { value: 'sent', label: 'Sent', icon: 'send' },
      { value: 'drafts', label: 'Drafts', icon: 'drafts', badge: '3' },
    ],
  },
  {
    title: 'Labels',
    items: [
      { value: 'work', label: 'Work', icon: 'work' },
      { value: 'personal', label: 'Personal', icon: 'person' },
      { value: 'trash', label: 'Trash', icon: 'delete' },
    ],
  },
]

const collapsibleSections: DrawerSection[] = [
  {
    title: 'Mail',
    icon: 'mail',
    collapsible: true,
    items: [
      { value: 'inbox', label: 'Inbox', icon: 'inbox', badge: '12' },
      { value: 'sent', label: 'Sent', icon: 'send' },
      { value: 'drafts', label: 'Drafts', icon: 'drafts', badge: '3' },
    ],
  },
  {
    title: 'Labels',
    icon: 'label',
    collapsible: true,
    items: [
      { value: 'work', label: 'Work', icon: 'work' },
      { value: 'personal', label: 'Personal', icon: 'person' },
    ],
  },
]
const collapsibleSelected = ref<string | number>('inbox')

const fullCloseOpen = ref(true)
const fullCloseSelected = ref<string | number>('inbox')

const collapsedVal = ref(false)

const nestedSelected = ref<string | number>('dashboard')
const nestedCollapsed = ref(false)
const nestedSections: DrawerSection[] = [
  {
    items: [
      { value: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      {
        value: 'settings', label: 'Settings', icon: 'settings',
        children: [
          { value: 'profile', label: 'Profile', icon: 'person', ...S },
          { value: 'security', label: 'Security', icon: 'lock', ...S },
          {
            value: 'notifications', label: 'Notifications', icon: 'notifications', ...S,
            children: [
              { value: 'email-notif', label: 'Email', icon: 'mail', ...S },
              { value: 'push-notif', label: 'Push', icon: 'phone_android', ...S },
              { value: 'sms-notif', label: 'SMS', icon: 'sms', ...S },
            ],
          },
        ],
      },
      {
        value: 'content', label: 'Content', icon: 'article',
        children: [
          { value: 'posts', label: 'Posts', icon: 'edit_note', ...S },
          { value: 'media', label: 'Media', icon: 'image', ...S },
          { value: 'comments', label: 'Comments', icon: 'comment', ...S },
        ],
      },
    ],
  },
]

const profileModalOpen = ref(false)
const profileSelected = ref<string | number>('p-home')
const profileSections: DrawerSection[] = [
  {
    items: [
      { value: 'p-home', label: 'Home', icon: 'home' },
      { value: 'p-inbox', label: 'Inbox', icon: 'inbox', badge: '24' },
      { value: 'p-starred', label: 'Starred', icon: 'star' },
      { value: 'p-sent', label: 'Sent Mail', icon: 'send' },
    ],
  },
  {
    title: 'Labels',
    items: [
      { value: 'p-important', label: 'Important', icon: 'label_important' },
      { value: 'p-spam', label: 'Spam', icon: 'report' },
      { value: 'p-trash', label: 'Trash', icon: 'delete' },
    ],
  },
]

const sideModalLeft = ref(false)
const sideModalRight = ref(false)
const sideModalTop = ref(false)
const sideModalBottom = ref(false)
const sideSelected = ref<string | number>('w-home')
const widthSections: DrawerSection[] = [
  {
    title: 'Navigation',
    icon: 'explore',
    collapsible: true,
    items: [
      { value: 'w-home', label: 'Home', icon: 'home' },
      { value: 'w-discover', label: 'Discover', icon: 'travel_explore' },
      {
        value: 'w-projects', label: 'Projects', icon: 'folder',
        children: [
          { value: 'w-active', label: 'Active', icon: 'play_circle', ...S },
          { value: 'w-archived', label: 'Archived', icon: 'archive', ...S },
        ],
      },
    ],
  },
  {
    title: 'Account',
    icon: 'person',
    collapsible: true,
    items: [
      { value: 'w-profile', label: 'Profile', icon: 'badge' },
      { value: 'w-billing', label: 'Billing', icon: 'credit_card' },
    ],
  },
]

const customWidthSelected = ref<string | number>('w-home')
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MNavigationDrawer</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A slide-out or inline drawer of grouped, badge-able, optionally-nested navigation items — modal
      (Teleported, scrim-backed) or inline (participates in layout, supports a collapsed icon-only mode).
    </p>

    <ComponentDemo
      title="Modal Drawer"
      description="Slide-out drawer with grouped items and badges."
      :code="`<MButton @click=&quot;open = true&quot;>Open Drawer</MButton>
<MNavigationDrawer
  v-model=&quot;open&quot;
  :sections=&quot;sections&quot;
  :selected=&quot;selected&quot;
  title=&quot;My App&quot;
  @select=&quot;selected = $event&quot;
/>`"
      :script="`const open = ref(false)
const selected = ref('inbox')
const sections = [
  {
    title: 'Mail',
    items: [
      { value: 'inbox', label: 'Inbox', icon: 'inbox', badge: '12' },
      { value: 'sent', label: 'Sent', icon: 'send' },
      { value: 'drafts', label: 'Drafts', icon: 'drafts', badge: '3' },
    ],
  },
  {
    title: 'Labels',
    items: [
      { value: 'work', label: 'Work', icon: 'work' },
      { value: 'personal', label: 'Personal', icon: 'person' },
    ],
  },
]`"
    >
      <div class="flex items-center gap-4">
        <MButton icon="menu" @click="drawerOpen = true">Open Drawer</MButton>
        <span class="text-body-medium text-on-surface-variant">Selected: {{ drawerSelected }}</span>
      </div>
      <MNavigationDrawer
        v-model="drawerOpen"
        :sections="drawerSections"
        :selected="drawerSelected"
        title="My App"
        @select="drawerSelected = $event"
      />
    </ComponentDemo>

    <ComponentDemo
      title="Collapsible Sections"
      description="Sections with collapsible: true can be expanded and collapsed. Add an icon to the section for the toggle header."
      :code="`<MNavigationDrawer
  v-model=&quot;open&quot;
  :sections=&quot;sections&quot;
  :selected=&quot;selected&quot;
  :modal=&quot;false&quot;
/>`"
      :script="`const sections = [
  {
    title: 'Mail',
    icon: 'mail',
    collapsible: true,
    items: [
      { value: 'inbox', label: 'Inbox', icon: 'inbox', badge: '12' },
      { value: 'sent', label: 'Sent', icon: 'send' },
    ],
  },
  {
    title: 'Labels',
    icon: 'label',
    collapsible: true,
    items: [
      { value: 'work', label: 'Work', icon: 'work' },
      { value: 'personal', label: 'Personal', icon: 'person' },
    ],
  },
]`"
    >
      <div class="flex h-64 w-full overflow-hidden rounded-xl border border-outline-variant">
        <MNavigationDrawer
          :model-value="true"
          :modal="false"
          :sections="collapsibleSections"
          :selected="collapsibleSelected"
          @select="collapsibleSelected = $event"
        />
        <div class="flex flex-1 items-center justify-center bg-surface-container text-body-medium text-on-surface-variant">
          {{ collapsibleSelected }} view
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Full Close (inline)"
      description="Toggle modelValue to fully show/hide the inline drawer with a smooth curtain animation."
      :code="`<div class=&quot;flex h-[280px] overflow-hidden rounded-xl border border-outline-variant&quot;>
  <MNavigationDrawer
    :model-value=&quot;open&quot;
    :modal=&quot;false&quot;
    :sections=&quot;sections&quot;
    :selected=&quot;selected&quot;
    @select=&quot;selected = $event&quot;
  />
  <div class=&quot;flex flex-1 items-center justify-center&quot;>
    <MButton @click=&quot;open = !open&quot;>Toggle Drawer</MButton>
  </div>
</div>`"
      :script="`const open = ref(true)
const selected = ref('inbox')`"
    >
      <div class="flex h-64 w-full overflow-hidden rounded-xl border border-outline-variant">
        <MNavigationDrawer
          :model-value="fullCloseOpen"
          :modal="false"
          :sections="collapsibleSections"
          :selected="fullCloseSelected"
          @select="fullCloseSelected = $event"
        />
        <div class="flex flex-1 items-center justify-center bg-surface-container">
          <MButton @click="fullCloseOpen = !fullCloseOpen">
            {{ fullCloseOpen ? 'Close' : 'Open' }} Drawer
          </MButton>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Collapsed Mode"
      description="Use the collapsed prop for a compact icon-only sidebar (72px). Items show a tooltip (native title) on hover. The #toggle slot keeps the icon anchored during transitions and adds a bottom border aligned with MTopAppBar."
      :code="`<MNavigationDrawer
  :model-value=&quot;true&quot;
  :modal=&quot;false&quot;
  :collapsed=&quot;collapsed&quot;
  :sections=&quot;sections&quot;
  :selected=&quot;selected&quot;
  @select=&quot;selected = $event&quot;
>
  <template #toggle>
    <MIconButton :icon=&quot;collapsed ? 'menu' : 'menu_open'&quot; @click=&quot;collapsed = !collapsed&quot; />
  </template>
</MNavigationDrawer>`"
      :script="`const collapsed = ref(false)`"
    >
      <div class="flex h-64 w-full overflow-hidden rounded-xl border border-outline-variant">
        <MNavigationDrawer
          :model-value="true"
          :modal="false"
          :collapsed="collapsedVal"
          :sections="collapsibleSections"
          :selected="collapsibleSelected"
          @select="collapsibleSelected = $event"
        >
          <template #toggle>
            <MIconButton
              :icon="collapsedVal ? 'menu' : 'menu_open'"
              :label="collapsedVal ? 'Expand' : 'Collapse'"
              @click="collapsedVal = !collapsedVal"
            />
          </template>
        </MNavigationDrawer>
        <div class="flex flex-1 items-center justify-center bg-surface-container text-body-medium text-on-surface-variant">
          {{ collapsibleSelected }} view
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Nested Children + Collapsed"
      description="Items can have children (recursive). Each level indents further and animates on expand/collapse. In collapsed mode, children icons slide to center with a smooth transition. Supports unlimited nesting depth."
      :code="`<MNavigationDrawer
  :model-value=&quot;true&quot;
  :modal=&quot;false&quot;
  :collapsed=&quot;collapsed&quot;
  :sections=&quot;sections&quot;
  :selected=&quot;selected&quot;
  @select=&quot;selected = $event&quot;
>
  <template #toggle>
    <MIconButton :icon=&quot;collapsed ? 'menu' : 'menu_open'&quot; @click=&quot;collapsed = !collapsed&quot; />
  </template>
</MNavigationDrawer>`"
      :script="`const selected = ref('dashboard')
const sections = [
  {
    items: [
      { value: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      {
        value: 'settings', label: 'Settings', icon: 'settings',
        children: [
          // iconSize, labelClass, py make children match parent size
          { value: 'profile', label: 'Profile', icon: 'person', iconSize: 24, labelClass: 'text-label-large', py: 'py-2.5' },
          { value: 'security', label: 'Security', icon: 'lock', iconSize: 24, labelClass: 'text-label-large', py: 'py-2.5' },
        ],
      },
    ],
  },
]`"
    >
      <div class="flex h-96 w-full overflow-hidden rounded-xl border border-outline-variant">
        <MNavigationDrawer
          :model-value="true"
          :modal="false"
          :collapsed="nestedCollapsed"
          :sections="nestedSections"
          :selected="nestedSelected"
          @select="nestedSelected = $event"
        >
          <template #toggle>
            <MIconButton
              :icon="nestedCollapsed ? 'menu' : 'menu_open'"
              :label="nestedCollapsed ? 'Expand' : 'Collapse'"
              @click="nestedCollapsed = !nestedCollapsed"
            />
          </template>
        </MNavigationDrawer>
        <div class="flex flex-1 items-center justify-center bg-surface-container text-body-medium text-on-surface-variant">
          {{ nestedSelected }} view
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Default Slot (Footer)"
      description="The default slot renders at the end of the scrollable area, after all sections. Use it for footers, logout buttons, or any custom content."
      :code="`<MNavigationDrawer
  :model-value=&quot;true&quot;
  :modal=&quot;false&quot;
  :sections=&quot;sections&quot;
  :selected=&quot;selected&quot;
  @select=&quot;selected = $event&quot;
>
  <div class=&quot;mt-auto border-t border-outline-variant px-3 py-2&quot;>
    <button class=&quot;flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-on-surface-variant hover:bg-on-surface/8&quot;>
      <MIcon name=&quot;logout&quot; :size=&quot;24&quot; />
      <span class=&quot;text-label-large font-medium&quot;>Log out</span>
    </button>
  </div>
</MNavigationDrawer>`"
    >
      <div class="flex h-80 w-full overflow-hidden rounded-xl border border-outline-variant">
        <MNavigationDrawer
          :model-value="true"
          :modal="false"
          :sections="drawerSections"
          :selected="drawerSelected"
          @select="drawerSelected = $event"
        >
          <div class="mt-auto border-t border-outline-variant px-3 py-2">
            <button type="button" class="flex w-full cursor-pointer items-center gap-3 rounded-full px-3 py-2.5 text-on-surface-variant transition-colors hover:bg-on-surface/8">
              <MIcon name="logout" :size="24" />
              <span class="text-label-large font-medium">Log out</span>
            </button>
          </div>
        </MNavigationDrawer>
        <div class="flex flex-1 items-center justify-center bg-surface-container text-body-medium text-on-surface-variant">
          {{ drawerSelected }} view
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Profile Header (#header slot)"
      description="Classic Material drawer with a cover image, profile avatar, name, and email in the header slot — overrides the title prop entirely."
      :code="`<MNavigationDrawer v-model=&quot;open&quot; :sections=&quot;sections&quot; :selected=&quot;selected&quot; @select=&quot;selected = $event&quot;>
  <template #header>
    <div class=&quot;relative h-40 bg-gradient-to-br from-primary via-tertiary to-secondary&quot;>
      <div class=&quot;absolute inset-0 bg-black/20&quot; />
      <div class=&quot;absolute bottom-0 left-0 p-4&quot;>
        <MAvatar fallback=&quot;AJ&quot; :size=&quot;56&quot; class=&quot;mb-2 ring-2 ring-white/30&quot; />
        <p class=&quot;text-title-medium font-medium text-white&quot;>Alex Johnson</p>
        <p class=&quot;text-body-small text-white/80&quot;>alex.johnson@gmail.com</p>
      </div>
    </div>
  </template>
</MNavigationDrawer>`"
    >
      <div class="flex items-center gap-4">
        <MButton icon="menu" @click="profileModalOpen = true">Open Profile Drawer</MButton>
        <span class="text-body-medium text-on-surface-variant">Selected: {{ profileSelected }}</span>
      </div>
      <MNavigationDrawer
        v-model="profileModalOpen"
        :sections="profileSections"
        :selected="profileSelected"
        @select="profileSelected = $event"
      >
        <template #header>
          <div class="relative h-40 bg-gradient-to-br from-primary via-tertiary to-secondary">
            <div class="absolute inset-0 bg-black/20" />
            <div class="absolute bottom-0 left-0 p-4">
              <MAvatar fallback="AJ" :size="56" class="mb-2 ring-2 ring-white/30" />
              <p class="text-title-medium font-medium text-white">Alex Johnson</p>
              <p class="text-body-small text-white/80">alex.johnson@gmail.com</p>
            </div>
          </div>
        </template>
      </MNavigationDrawer>
    </ComponentDemo>

    <ComponentDemo
      title="Side"
      description="Use the side prop to open the modal drawer from any direction. The inline variant only supports left/right."
      :code="`<MNavigationDrawer v-model=&quot;open&quot; side=&quot;right&quot; :sections=&quot;sections&quot; ... />
<MNavigationDrawer v-model=&quot;open&quot; side=&quot;top&quot; :sections=&quot;sections&quot; ... />
<MNavigationDrawer v-model=&quot;open&quot; side=&quot;bottom&quot; :sections=&quot;sections&quot; ... />`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MButton variant="outlined" icon="chevron_right" @click="sideModalLeft = true">Left (default)</MButton>
        <MButton variant="outlined" icon="chevron_left" @click="sideModalRight = true">Right</MButton>
        <MButton variant="outlined" icon="expand_more" @click="sideModalTop = true">Top</MButton>
        <MButton variant="outlined" icon="expand_less" @click="sideModalBottom = true">Bottom</MButton>
        <span class="text-body-medium text-on-surface-variant">Selected: {{ sideSelected }}</span>
      </div>
      <MNavigationDrawer v-model="sideModalLeft" side="left" :sections="widthSections" :selected="sideSelected" title="Left" @select="sideSelected = $event" />
      <MNavigationDrawer v-model="sideModalRight" side="right" :sections="widthSections" :selected="sideSelected" title="Right" @select="sideSelected = $event" />
      <MNavigationDrawer v-model="sideModalTop" side="top" :sections="widthSections" :selected="sideSelected" title="Top" @select="sideSelected = $event" />
      <MNavigationDrawer v-model="sideModalBottom" side="bottom" :sections="widthSections" :selected="sideSelected" title="Bottom" @select="sideSelected = $event" />
    </ComponentDemo>

    <ComponentDemo
      title="Custom Width"
      description="The width prop overrides the default 360px (22.5rem) on both modal and inline variants — here a narrower 280px inline sidebar."
      :code="`<MNavigationDrawer :model-value=&quot;true&quot; :modal=&quot;false&quot; width=&quot;280px&quot; :sections=&quot;sections&quot; :selected=&quot;selected&quot; @select=&quot;selected = $event&quot; />`"
    >
      <div class="flex h-72 w-full overflow-hidden rounded-xl border border-outline-variant">
        <MNavigationDrawer
          :model-value="true"
          :modal="false"
          width="280px"
          :sections="widthSections"
          :selected="customWidthSelected"
          @select="customWidthSelected = $event"
        />
        <div class="flex flex-1 items-center justify-center bg-surface-container text-body-medium text-on-surface-variant">
          {{ customWidthSelected }} view
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="drawerProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="drawerEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="drawerSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="drawerTypes" />

    <ComponentPager current="MNavigationDrawer" />
  </div>
</template>
