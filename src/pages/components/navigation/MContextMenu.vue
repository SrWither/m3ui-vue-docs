<script setup lang="ts">
import { MContextMenu, MMenuItem, MMenuDivider, MIcon } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const contextMenuSlots: SlotDef[] = [
  { name: '#trigger', description: 'The element(s) that respond to right-click. MContextMenu intercepts contextmenu events automatically and positions the panel at the cursor, clamped to stay on-screen.' },
  { name: '#default', description: 'Menu items — use MMenuItem, MMenuDivider, or any element.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MContextMenu</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A right-click context menu composed with MMenuItem — same item/divider/submenu building blocks as
      MMenu, but positioned at the cursor instead of anchored to a trigger element.
    </p>

    <ComponentDemo
      title="Context Menu"
      description="Right-click menu composed with MMenuItem — same pattern as MMenu."
      :code="`<MContextMenu>
  <template #trigger>
    <div>Right-click anywhere here</div>
  </template>

  <MMenuItem icon=&quot;content_cut&quot; shortcut=&quot;Ctrl+X&quot;>Cut</MMenuItem>
  <MMenuItem icon=&quot;content_copy&quot; shortcut=&quot;Ctrl+C&quot;>Copy</MMenuItem>
  <MMenuItem icon=&quot;content_paste&quot; shortcut=&quot;Ctrl+V&quot;>Paste</MMenuItem>
  <MMenuDivider />
  <MMenuItem icon=&quot;add&quot;>
    Insert
    <template #children>
      <MMenuItem icon=&quot;image&quot;>Image</MMenuItem>
      <MMenuItem icon=&quot;videocam&quot;>Video</MMenuItem>
      <MMenuDivider />
      <MMenuItem icon=&quot;code&quot;>
        Code
        <template #children>
          <MMenuItem>JavaScript</MMenuItem>
          <MMenuItem>TypeScript</MMenuItem>
        </template>
      </MMenuItem>
    </template>
  </MMenuItem>
  <MMenuDivider />
  <MMenuItem shortcut=&quot;Ctrl+A&quot;>Select All</MMenuItem>
  <MMenuDivider />
  <MMenuItem icon=&quot;delete&quot; danger>Delete</MMenuItem>
</MContextMenu>`"
    >
      <MContextMenu>
        <template #trigger>
          <div
            class="flex w-full cursor-default items-center justify-center rounded-lg border-2 border-dashed border-outline-variant p-8 text-body-medium text-on-surface-variant transition-colors hover:border-primary hover:bg-primary-container/10"
          >
            <MIcon name="mouse" :size="20" class="mr-2" />
            Right-click anywhere in this area
          </div>
        </template>

        <MMenuItem icon="content_cut" shortcut="Ctrl+X">Cut</MMenuItem>
        <MMenuItem icon="content_copy" shortcut="Ctrl+C">Copy</MMenuItem>
        <MMenuItem icon="content_paste" shortcut="Ctrl+V">Paste</MMenuItem>
        <MMenuDivider />
        <MMenuItem icon="add">
          Insert
          <template #children>
            <MMenuItem icon="image">Image</MMenuItem>
            <MMenuItem icon="videocam">Video</MMenuItem>
            <MMenuItem icon="link">Link</MMenuItem>
            <MMenuDivider />
            <MMenuItem icon="code">
              Code
              <template #children>
                <MMenuItem>JavaScript</MMenuItem>
                <MMenuItem>TypeScript</MMenuItem>
                <MMenuItem>Python</MMenuItem>
              </template>
            </MMenuItem>
          </template>
        </MMenuItem>
        <MMenuItem icon="transform">
          Transform
          <template #children>
            <MMenuItem>Uppercase</MMenuItem>
            <MMenuItem>Lowercase</MMenuItem>
            <MMenuItem>Title Case</MMenuItem>
          </template>
        </MMenuItem>
        <MMenuDivider />
        <MMenuItem shortcut="Ctrl+A">Select All</MMenuItem>
        <MMenuDivider />
        <MMenuItem icon="delete" danger>Delete</MMenuItem>
      </MContextMenu>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="contextMenuSlots" />

    <ComponentPager current="MContextMenu" />
  </div>
</template>
