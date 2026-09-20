<script setup lang="ts">
import { MMenu, MMenuItem, MMenuDivider, MButton, MIconButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const menuProps: PropDef[] = [
  { name: 'align', type: "'left' | 'right'", default: "'right'", description: 'Which edge of the trigger the dropdown aligns to' },
]

const menuItemProps: PropDef[] = [
  { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'shortcut', type: 'string', description: 'Keyboard shortcut hint displayed on the right (e.g. "Ctrl+C") — hidden when the item has #children' },
  { name: 'to', type: 'string | Record<string, any>', description: 'Vue Router destination — renders as RouterLink instead of button' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the item' },
  { name: 'danger', type: 'boolean', default: 'false', description: 'Danger/destructive styling (error color)' },
]

const menuItemEvents = [
  { name: 'click', description: 'Emitted when the item is clicked (not emitted for disabled items or items with #children, since those just toggle/expand)' },
]

const menuItemSlots: SlotDef[] = [
  { name: '#default', description: 'Item label text.' },
  { name: '#children', description: 'Nested submenu items — renders as a hover-expandable submenu. When present, the item shows a chevron instead of a shortcut and click is no longer emitted (hovering opens the submenu instead).' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMenu</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A trigger-based dropdown menu, composed with <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MMenuItem</code>
      and <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MMenuDivider</code>. Items support unlimited-depth nested submenus via the
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">#children</code> slot.
    </p>

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

    <ComponentDemo
      title="Submenus"
      description="Menu items can have nested children via the #children slot. Hover to expand — supports unlimited nesting depth."
      :code="`<MMenu>
  <template #trigger>
    <MButton>Open</MButton>
  </template>
  <MMenuItem icon=&quot;file_open&quot;>Open</MMenuItem>
  <MMenuItem icon=&quot;share&quot;>
    Share
    <template #children>
      <MMenuItem icon=&quot;email&quot;>Email</MMenuItem>
      <MMenuItem icon=&quot;link&quot;>Copy link</MMenuItem>
    </template>
  </MMenuItem>
</MMenu>`"
    >
      <MMenu>
        <template #trigger>
          <MButton variant="tonal" icon="menu">Menu with subs</MButton>
        </template>
        <MMenuItem icon="file_open">Open</MMenuItem>
        <MMenuItem icon="edit">Edit</MMenuItem>
        <MMenuItem icon="share">
          Share
          <template #children>
            <MMenuItem icon="email">Email</MMenuItem>
            <MMenuItem icon="link">Copy link</MMenuItem>
            <MMenuItem icon="chat">
              Social
              <template #children>
                <MMenuItem icon="flutter_dash">Twitter</MMenuItem>
                <MMenuItem icon="public">Facebook</MMenuItem>
                <MMenuItem icon="code">LinkedIn</MMenuItem>
              </template>
            </MMenuItem>
          </template>
        </MMenuItem>
        <MMenuItem icon="drive_file_move">
          Move to
          <template #children>
            <MMenuItem icon="folder">Documents</MMenuItem>
            <MMenuItem icon="folder">
              Projects
              <template #children>
                <MMenuItem icon="folder">Frontend</MMenuItem>
                <MMenuItem icon="folder">Backend</MMenuItem>
                <MMenuItem icon="folder">Design</MMenuItem>
              </template>
            </MMenuItem>
            <MMenuItem icon="folder">Archive</MMenuItem>
          </template>
        </MMenuItem>
        <MMenuItem icon="delete" danger>Delete</MMenuItem>
      </MMenu>
    </ComponentDemo>

    <ComponentDemo
      title="Keyboard Shortcuts and Danger Items"
      description="MMenuItem's shortcut prop shows a right-aligned hint; danger switches to error-colored text for destructive actions."
      :code="`<MMenu>
  <template #trigger>
    <MButton variant=&quot;outlined&quot;>Edit</MButton>
  </template>
  <MMenuItem icon=&quot;content_cut&quot; shortcut=&quot;Ctrl+X&quot;>Cut</MMenuItem>
  <MMenuItem icon=&quot;content_copy&quot; shortcut=&quot;Ctrl+C&quot;>Copy</MMenuItem>
  <MMenuDivider />
  <MMenuItem icon=&quot;delete&quot; shortcut=&quot;Del&quot; danger>Delete</MMenuItem>
</MMenu>`"
    >
      <MMenu align="left">
        <template #trigger>
          <MButton variant="outlined" icon="edit">Edit</MButton>
        </template>
        <MMenuItem icon="content_cut" shortcut="Ctrl+X">Cut</MMenuItem>
        <MMenuItem icon="content_copy" shortcut="Ctrl+C">Copy</MMenuItem>
        <MMenuItem icon="content_paste" shortcut="Ctrl+V">Paste</MMenuItem>
        <MMenuDivider />
        <MMenuItem icon="delete" shortcut="Del" danger>Delete</MMenuItem>
      </MMenu>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">MMenu Props</h3>
    <PropsTable :props="menuProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MMenuItem Props</h3>
    <PropsTable :props="menuItemProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MMenuItem Events</h3>
    <EventsTable :events="menuItemEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MMenuItem Slots</h3>
    <SlotsTable :slots="menuItemSlots" />

    <ComponentPager current="MMenu" />
  </div>
</template>
