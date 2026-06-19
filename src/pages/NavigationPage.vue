<script setup lang="ts">
import { ref } from 'vue'
import {
  MTabs, MMenu, MMenuItem, MContextMenu, MBreadcrumbs, MStepper,
  MPagination, MButton, MIconButton, MIcon, MCard, MFab,
  MNavigationBar, MNavigationDrawer, MNavigationRail, MTopAppBar, MAppBar,
} from '@m3ui-vue/m3ui-vue'
import type { ContextMenuItem, BreadcrumbItem, StepItem, NavBarItem, DrawerSection, NavRailItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const activeTab = ref<string | number>('home')
const secondaryTab = ref<string | number>('all')

const contextMenuRef = ref<InstanceType<typeof MContextMenu>>()
const contextItems: ContextMenuItem[] = [
  { label: 'Cut', icon: 'content_cut', shortcut: 'Ctrl+X', onClick: () => {} },
  { label: 'Copy', icon: 'content_copy', shortcut: 'Ctrl+C', onClick: () => {} },
  { label: 'Paste', icon: 'content_paste', shortcut: 'Ctrl+V', onClick: () => {} },
  { divider: true },
  {
    label: 'Insert',
    icon: 'add',
    children: [
      { label: 'Image', icon: 'image', onClick: () => {} },
      { label: 'Video', icon: 'videocam', onClick: () => {} },
      { label: 'Link', icon: 'link', onClick: () => {} },
      { divider: true },
      {
        label: 'Code',
        icon: 'code',
        children: [
          { label: 'JavaScript', onClick: () => {} },
          { label: 'TypeScript', onClick: () => {} },
          { label: 'Python', onClick: () => {} },
        ],
      },
    ],
  },
  {
    label: 'Transform',
    icon: 'transform',
    children: [
      { label: 'Uppercase', onClick: () => {} },
      { label: 'Lowercase', onClick: () => {} },
      { label: 'Title Case', onClick: () => {} },
    ],
  },
  { divider: true },
  { label: 'Select All', shortcut: 'Ctrl+A', onClick: () => {} },
  { divider: true },
  { label: 'Delete', icon: 'delete', danger: true, onClick: () => {} },
]

const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Home', icon: 'home', to: '/' },
  { label: 'Components', to: '/components/buttons' },
  { label: 'Navigation' },
]

const stepperVal = ref(1)
const steps: StepItem[] = [
  { label: 'Account', description: 'Create your account', icon: 'person' },
  { label: 'Profile', description: 'Set up your profile', icon: 'badge' },
  { label: 'Settings', description: 'Configure preferences', icon: 'settings' },
  { label: 'Done', description: 'All set!', icon: 'check_circle' },
]

const page = ref(1)

const tabsProps: PropDef[] = [
  { name: 'modelValue', type: 'string | number', description: 'Active tab value' },
  { name: 'tabs', type: '{ value, label, icon?, disabled? }[]', description: 'Tab definitions' },
  { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Tab style — underline or pill' },
]

const menuProps: PropDef[] = [
  { name: 'align', type: "'left' | 'right'", default: "'right'", description: 'Dropdown alignment relative to trigger' },
]

const menuItemProps: PropDef[] = [
  { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'to', type: 'string | RouteLocationRaw', description: 'Vue Router destination — renders as RouterLink instead of button' },
]

const contextMenuProps: PropDef[] = [
  { name: 'items', type: 'ContextMenuItem[]', description: 'Array of menu items (see interface below)' },
]

const breadcrumbsProps: PropDef[] = [
  { name: 'items', type: '{ label, icon?, to?, disabled? }[]', description: 'Breadcrumb items' },
  { name: 'separator', type: 'string', default: "'chevron_right'", description: 'Material Symbol separator icon' },
]

const stepperProps: PropDef[] = [
  { name: 'modelValue', type: 'number', description: 'Active step index (0-based)' },
  { name: 'steps', type: '{ label, description?, icon?, optional?, error? }[]', description: 'Step definitions' },
  { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction' },
  { name: 'linear', type: 'boolean', default: 'true', description: 'Only allow sequential navigation' },
]

const paginationProps: PropDef[] = [
  { name: 'page', type: 'number', description: 'Current page (1-based)' },
  { name: 'perPage', type: 'number', description: 'Items per page' },
  { name: 'total', type: 'number', description: 'Total number of items' },
]

const navBarVal = ref<string | number>('home')
const navBarItems: NavBarItem[] = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'search', label: 'Search', icon: 'search' },
  { value: 'notifications', label: 'Alerts', icon: 'notifications', badge: 3 },
  { value: 'profile', label: 'Profile', icon: 'person' },
]

const navBarProps: PropDef[] = [
  { name: 'modelValue', type: 'string | number', description: 'Active item value' },
  { name: 'items', type: 'NavBarItem[]', description: 'Array of { value, label, icon, badge?, badgeDot? }' },
]

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

const collapsedOpen = ref(false)
const collapsedVal = ref(false)

const drawerProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model)' },
  { name: 'selected', type: 'string | number', description: 'Currently selected item value' },
  { name: 'sections', type: 'DrawerSection[]', description: 'Array of sections (see interfaces below)' },
  { name: 'title', type: 'string', description: 'Drawer header title' },
  { name: 'modal', type: 'boolean', default: 'true', description: 'Modal with scrim overlay, or inline sidebar' },
  { name: 'collapsed', type: 'boolean', default: 'false', description: 'Compact mode (72px) showing only icons (inline variant only)' },
]

const railVal = ref<string | number>('home')
const railItems: NavRailItem[] = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'search', label: 'Search', icon: 'search' },
  { value: 'library', label: 'Library', icon: 'video_library' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
]

const railProps: PropDef[] = [
  { name: 'modelValue', type: 'string | number', description: 'Active item value' },
  { name: 'items', type: 'NavRailItem[]', description: 'Array of { value, label, icon, badge?, badgeDot?, disabled? }' },
  { name: 'alignment', type: "'top' | 'center' | 'bottom'", default: "'top'", description: 'Vertical alignment of items' },
]

const topAppBarProps: PropDef[] = [
  { name: 'title', type: 'string', description: 'App bar title' },
  { name: 'variant', type: "'center' | 'small' | 'medium' | 'large'", default: "'small'", description: 'Title layout variant' },
  { name: 'navigationIcon', type: 'string', description: 'Leading icon (e.g. menu, arrow_back)' },
  { name: 'elevated', type: 'boolean', default: 'false', description: 'Add shadow elevation' },
]

const appBarProps: PropDef[] = [
  { name: 'color', type: "'surface' | 'primary' | 'secondary' | 'tertiary'", default: "'surface'", description: 'Background color' },
  { name: 'elevated', type: 'boolean', default: 'false', description: 'Add shadow elevation' },
  { name: 'dense', type: 'boolean', default: 'false', description: 'Compact height (48px vs 64px)' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Navigation</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Components for navigating between views, sections, and pages.
    </p>

    <!-- ── MTabs ────────────────────────────────────────────────────────── -->
    <h2 class="mb-4 text-headline-small font-medium">MTabs</h2>

    <ComponentDemo
      title="Primary Tabs"
      description="Underline-style tabs with a sliding indicator."
      :code="`<script setup>
const active = ref('home')
<\/script>

<template>
  <MTabs
    v-model=&quot;active&quot;
    :tabs=&quot;[
      { value: 'home', label: 'Home', icon: 'home' },
      { value: 'explore', label: 'Explore', icon: 'explore' },
      { value: 'settings', label: 'Settings', icon: 'settings' },
    ]&quot;
  />
</template>`"
    >
      <div class="w-full">
        <MTabs
          v-model="activeTab"
          :tabs="[
            { value: 'home', label: 'Home', icon: 'home' },
            { value: 'explore', label: 'Explore', icon: 'explore' },
            { value: 'library', label: 'Library', icon: 'video_library' },
            { value: 'settings', label: 'Settings', icon: 'settings' },
          ]"
        />
        <div class="p-4 text-body-medium text-on-surface-variant">Active: {{ activeTab }}</div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Secondary Tabs"
      description="Pill-style tabs with a filled indicator."
      :code="`<template>
  <MTabs
    v-model=&quot;active&quot;
    variant=&quot;secondary&quot;
    :tabs=&quot;[
      { value: 'all', label: 'All' },
      { value: 'active', label: 'Active' },
      { value: 'done', label: 'Done' },
    ]&quot;
  />
</template>`"
    >
      <div class="w-full">
        <MTabs
          v-model="secondaryTab"
          variant="secondary"
          :tabs="[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'done', label: 'Done' },
            { value: 'archived', label: 'Archived', disabled: true },
          ]"
        />
        <div class="mt-3 text-body-medium text-on-surface-variant">Active: {{ secondaryTab }}</div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="tabsProps" />

    <!-- ── MMenu ────────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MMenu</h2>

    <ComponentDemo
      title="Dropdown Menu"
      description="Trigger-based dropdown with menu items. Uses slots for trigger and content."
      :code="`<template>
  <MMenu>
    <template #trigger>
      <MButton variant=&quot;outlined&quot;>Options</MButton>
    </template>
    <MMenuItem icon=&quot;edit&quot;>Edit</MMenuItem>
    <MMenuItem icon=&quot;content_copy&quot;>Duplicate</MMenuItem>
    <MMenuItem icon=&quot;delete&quot;>Delete</MMenuItem>
  </MMenu>
</template>`"
    >
      <MMenu align="left">
        <template #trigger>
          <MButton variant="outlined" icon="expand_more">Options</MButton>
        </template>
        <MMenuItem icon="edit">Edit</MMenuItem>
        <MMenuItem icon="content_copy">Duplicate</MMenuItem>
        <MMenuItem icon="share">Share</MMenuItem>
        <MMenuItem icon="delete">Delete</MMenuItem>
      </MMenu>

      <MMenu align="left">
        <template #trigger>
          <MIconButton icon="more_vert" label="More" variant="tonal" />
        </template>
        <MMenuItem icon="person">Profile</MMenuItem>
        <MMenuItem icon="settings">Settings</MMenuItem>
        <MMenuItem icon="logout">Log out</MMenuItem>
      </MMenu>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">MMenu Props</h3>
    <PropsTable :props="menuProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MMenuItem Props</h3>
    <PropsTable :props="menuItemProps" />

    <!-- ── MContextMenu ─────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MContextMenu</h2>

    <ComponentDemo
      title="Context Menu"
      description="Right-click menu with icons, shortcuts, dividers, and danger items."
      :code="`<script setup>
const menuRef = ref()
const items = [
  { label: 'Cut', icon: 'content_cut', shortcut: 'Ctrl+X' },
  { label: 'Copy', icon: 'content_copy', shortcut: 'Ctrl+C' },
  { divider: true },
  {
    label: 'Insert',
    icon: 'add',
    children: [
      { label: 'Image', icon: 'image', onClick: () => {} },
      { label: 'Video', icon: 'videocam', onClick: () => {} },
      {
        label: 'Code',
        icon: 'code',
        children: [
          { label: 'JavaScript', onClick: () => {} },
          { label: 'TypeScript', onClick: () => {} },
        ],
      },
    ],
  },
  { divider: true },
  { label: 'Delete', icon: 'delete', danger: true },
]
<\/script>

<template>
  <div @contextmenu.prevent=&quot;menuRef.show($event)&quot;>
    Right-click here
  </div>
  <MContextMenu ref=&quot;menuRef&quot; :items=&quot;items&quot; />
</template>`"
    >
      <div
        class="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-outline-variant p-8 text-body-medium text-on-surface-variant transition-colors hover:border-primary hover:bg-primary-container/10"
        @contextmenu.prevent="contextMenuRef?.show($event)"
      >
        <MIcon name="mouse" :size="20" class="mr-2" />
        Right-click anywhere in this area
      </div>
      <MContextMenu ref="contextMenuRef" :items="contextItems" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="contextMenuProps" />

    <MCard class="mt-4 border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">ContextMenuItem interface</p>
      <pre class="overflow-x-auto rounded-lg bg-surface-container p-3 text-body-small"><code>interface ContextMenuItem {
  label?: string           // Item text
  icon?: string            // Material Symbol icon
  shortcut?: string        // Keyboard shortcut hint (e.g. 'Ctrl+C')
  disabled?: boolean       // Grayed out, not clickable
  danger?: boolean         // Red/error color for destructive actions
  divider?: boolean        // Renders a separator line instead of an item
  to?: string | Record&lt;string, any&gt;  // Vue Router destination (renders as RouterLink)
  children?: ContextMenuItem[]       // Nested submenu items (recursive)
  onClick?: () => void     // Click handler
}</code></pre>
    </MCard>

    <!-- ── MBreadcrumbs ─────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MBreadcrumbs</h2>

    <ComponentDemo
      title="Breadcrumbs"
      description="Navigation trail with icons and custom separators."
      :code="`<template>
  <MBreadcrumbs :items=&quot;[
    { label: 'Home', icon: 'home', to: '/' },
    { label: 'Components', to: '/components' },
    { label: 'Navigation' },
  ]&quot; />
</template>`"
    >
      <div class="w-full space-y-4">
        <MBreadcrumbs :items="breadcrumbs" />
        <MBreadcrumbs
          :items="[
            { label: 'Root' },
            { label: 'Folder' },
            { label: 'Subfolder' },
            { label: 'File.vue' },
          ]"
          separator="arrow_forward_ios"
        />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="breadcrumbsProps" />

    <!-- ── MStepper ─────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MStepper</h2>

    <ComponentDemo
      title="Horizontal Stepper"
      description="Multi-step wizard with icons and descriptions."
      :code="`<script setup>
const step = ref(0)
const steps = [
  { label: 'Account', description: 'Create your account', icon: 'person' },
  { label: 'Profile', description: 'Set up your profile', icon: 'badge' },
  { label: 'Done', description: 'All set!', icon: 'check_circle' },
]
<\/script>

<template>
  <MStepper v-model=&quot;step&quot; :steps=&quot;steps&quot; />
</template>`"
    >
      <div class="w-full">
        <MStepper v-model="stepperVal" :steps="steps" :linear="false" />
        <div class="mt-4 flex justify-center gap-3">
          <MButton variant="outlined" :disabled="stepperVal === 0" @click="stepperVal--">Back</MButton>
          <MButton :disabled="stepperVal === steps.length - 1" @click="stepperVal++">Next</MButton>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Vertical Stepper"
      description="Vertical layout for longer step descriptions."
      :code="`<template>
  <MStepper v-model=&quot;step&quot; :steps=&quot;steps&quot; direction=&quot;vertical&quot; />
</template>`"
    >
      <div class="w-full max-w-md">
        <MStepper v-model="stepperVal" :steps="steps" direction="vertical" :linear="false" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="stepperProps" />

    <!-- ── MPagination ──────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MPagination</h2>

    <ComponentDemo
      title="Pagination"
      description="Page navigation with automatic page range calculation."
      :code="`<script setup>
const page = ref(1)
<\/script>

<template>
  <MPagination :page=&quot;page&quot; :per-page=&quot;10&quot; :total=&quot;87&quot; @update:page=&quot;page = $event&quot; />
</template>`"
    >
      <div class="flex w-full flex-col items-center gap-4">
        <MPagination :page="page" :per-page="10" :total="87" @update:page="page = $event" />
        <span class="text-body-medium text-on-surface-variant">
          Page {{ page }} of {{ Math.ceil(87 / 10) }} — showing items {{ (page - 1) * 10 + 1 }}–{{ Math.min(page * 10, 87) }} of 87
        </span>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="paginationProps" />

    <!-- ── MNavigationBar ──────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MNavigationBar</h2>

    <ComponentDemo
      title="Bottom Navigation"
      description="Mobile bottom navigation bar with pill indicator and badges."
      :code="`<script setup>
const active = ref('home')
const items = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'search', label: 'Search', icon: 'search' },
  { value: 'notifications', label: 'Alerts', icon: 'notifications', badge: 3 },
  { value: 'profile', label: 'Profile', icon: 'person' },
]
<\/script>

<template>
  <MNavigationBar v-model=&quot;active&quot; :items=&quot;items&quot; />
</template>`"
    >
      <div class="w-full max-w-sm overflow-hidden rounded-xl border border-outline-variant">
        <div class="flex h-32 items-center justify-center bg-surface-container text-body-medium text-on-surface-variant">
          {{ navBarVal }} view
        </div>
        <MNavigationBar v-model="navBarVal" :items="navBarItems" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="navBarProps" />

    <!-- ── MNavigationDrawer ───────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MNavigationDrawer</h2>

    <ComponentDemo
      title="Modal Drawer"
      description="Slide-out drawer with grouped items and badges."
      :code="`<script setup>
const open = ref(false)
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
]
<\/script>

<template>
  <MButton @click=&quot;open = true&quot;>Open Drawer</MButton>
  <MNavigationDrawer
    v-model=&quot;open&quot;
    :sections=&quot;sections&quot;
    :selected=&quot;selected&quot;
    title=&quot;My App&quot;
    @select=&quot;selected = $event&quot;
  />
</template>`"
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
      :code="`<script setup>
const sections = [
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
]
<\/script>

<template>
  <MNavigationDrawer
    v-model=&quot;open&quot;
    :sections=&quot;sections&quot;
    :selected=&quot;selected&quot;
    :modal=&quot;false&quot;
  />
</template>`"
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
      title="Full Close"
      description="Toggle modelValue to fully show/hide the inline drawer with a smooth curtain animation."
      :code="`<script setup>
const open = ref(true)
const selected = ref('inbox')
<\/script>

<template>
  <div class=&quot;flex h-[280px] overflow-hidden rounded-xl border border-outline-variant&quot;>
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
  </div>
</template>`"
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
      description="Use the collapsed prop for a compact icon-only sidebar (72px). Items show a tooltip on hover."
      :code="`<script setup>
const collapsed = ref(false)
<\/script>

<template>
  <MButton @click=&quot;collapsed = !collapsed&quot;>Toggle</MButton>
  <MNavigationDrawer
    :model-value=&quot;true&quot;
    :modal=&quot;false&quot;
    :collapsed=&quot;collapsed&quot;
    :sections=&quot;sections&quot;
    :selected=&quot;selected&quot;
  />
</template>`"
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
          <template #header>
            <div class="flex h-12 shrink-0 items-center" :class="collapsedVal ? 'justify-center' : 'px-3'">
              <button
                type="button"
                class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/8"
                @click="collapsedVal = !collapsedVal"
              >
                <MIcon :name="collapsedVal ? 'menu' : 'menu_open'" :size="22" />
              </button>
            </div>
          </template>
        </MNavigationDrawer>
        <div class="flex flex-1 items-center justify-center bg-surface-container text-body-medium text-on-surface-variant">
          {{ collapsibleSelected }} view
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="drawerProps" />

    <MCard class="mt-4 border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">DrawerSection &amp; DrawerItem interfaces</p>
      <pre class="overflow-x-auto rounded-lg bg-surface-container p-3 text-body-small"><code>interface DrawerItem {
  value: string | number
  label: string
  icon?: string
  badge?: string | number
  disabled?: boolean
  to?: string | Record&lt;string, any&gt;  // Vue Router destination (renders as RouterLink)
}

interface DrawerSection {
  title?: string
  icon?: string            // Icon for collapsible section header
  items: DrawerItem[]
  collapsible?: boolean    // Section can be expanded/collapsed
}</code></pre>
    </MCard>

    <!-- ── MNavigationRail ─────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MNavigationRail</h2>

    <ComponentDemo
      title="Navigation Rail"
      description="Compact vertical navigation for desktop layouts with pill indicator."
      :code="`<script setup>
const active = ref('home')
const items = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'search', label: 'Search', icon: 'search' },
  { value: 'library', label: 'Library', icon: 'video_library' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
]
<\/script>

<template>
  <MNavigationRail v-model=&quot;active&quot; :items=&quot;items&quot;>
    <template #fab>
      <MFab icon=&quot;edit&quot; size=&quot;small&quot; />
    </template>
  </MNavigationRail>
</template>`"
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="railProps" />

    <!-- ── MTopAppBar ──────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MTopAppBar</h2>

    <ComponentDemo
      title="Variants"
      description="Four top app bar layouts: center-aligned, small, medium, and large."
      :code="`<template>
  <MTopAppBar title=&quot;My App&quot; variant=&quot;small&quot; navigation-icon=&quot;menu&quot;>
    <template #actions>
      <MIconButton icon=&quot;search&quot; label=&quot;Search&quot; />
      <MIconButton icon=&quot;more_vert&quot; label=&quot;More&quot; />
    </template>
  </MTopAppBar>
</template>`"
    >
      <div class="w-full space-y-4">
        <MCard v-for="v in (['center', 'small', 'medium', 'large'] as const)" :key="v" variant="outlined" class="overflow-hidden">
          <MTopAppBar :title="`${v.charAt(0).toUpperCase() + v.slice(1)} variant`" :variant="v" navigation-icon="menu">
            <template #actions>
              <MIconButton icon="search" label="Search" />
              <MIconButton icon="more_vert" label="More" />
            </template>
          </MTopAppBar>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="topAppBarProps" />

    <!-- ── MAppBar ─────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MAppBar</h2>

    <ComponentDemo
      title="App Bar"
      description="Simple slot-based app bar with leading, default, and trailing areas."
      :code="`<template>
  <MAppBar>
    <template #leading>
      <MIconButton icon=&quot;menu&quot; label=&quot;Menu&quot; />
    </template>
    <span class=&quot;text-title-large&quot;>App Title</span>
    <template #trailing>
      <MIconButton icon=&quot;search&quot; label=&quot;Search&quot; />
    </template>
  </MAppBar>
</template>`"
    >
      <div class="w-full space-y-4">
        <MCard variant="outlined" class="overflow-hidden">
          <MAppBar>
            <template #leading>
              <MIconButton icon="menu" label="Menu" />
            </template>
            <span class="text-title-large">My App</span>
            <template #trailing>
              <MIconButton icon="search" label="Search" />
              <MIconButton icon="more_vert" label="More" />
            </template>
          </MAppBar>
        </MCard>
        <MCard variant="outlined" class="overflow-hidden">
          <MAppBar color="primary" :elevated="true">
            <template #leading>
              <MIconButton icon="arrow_back" label="Back" />
            </template>
            <span class="text-title-large">Primary</span>
          </MAppBar>
        </MCard>
        <MCard variant="outlined" class="overflow-hidden">
          <MAppBar color="tertiary" :dense="true">
            <template #leading>
              <MIconButton icon="arrow_back" label="Back" />
            </template>
            <span class="text-title-medium">Dense Tertiary</span>
          </MAppBar>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="appBarProps" />
  </div>
</template>
