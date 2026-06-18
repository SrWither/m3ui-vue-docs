<script setup lang="ts">
import { ref } from 'vue'
import {
  MTabs, MMenu, MMenuItem, MContextMenu, MBreadcrumbs, MStepper,
  MPagination, MButton, MIconButton, MIcon, MCard,
} from '@m3ui-vue/m3ui-vue'
import type { ContextMenuItem, BreadcrumbItem, StepItem } from '@m3ui-vue/m3ui-vue'
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="menuProps" />

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
  children?: ContextMenuItem[]  // Nested submenu items (recursive)
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
  </div>
</template>
