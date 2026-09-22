<script setup lang="ts">
import { MContextMenu, MMenuItem, MMenuDivider, MIcon, useToast } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const toast = useToast()
function notifyClick(label: string) {
  toast.success(`Clicked: ${label}`)
}

const contextMenuProps: PropDef[] = [
  { name: 'submenuMode', type: "'flyout' | 'push'", default: "'flyout'", description: "How MMenuItem's with #children behave. 'flyout' opens a side panel next to the item (desktop, mouse hover). 'push' replaces the panel's own content with the submenu plus a back header — no hover, no positioning math, works reliably with touch/long-press context menus." },
  { name: 'variant', type: "'standard' | 'expressive'", default: "'standard'", description: "'standard' is M3's baseline menu (4dp corners). 'expressive' is M3's rounder 'vertical menu' styling (16dp corners) — combine with <MMenuDivider gap /> to split the panel into independently-rounded groups with a visible gap, instead of a plain divider line." },
]

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
      description="Right-click menu composed with MMenuItem — same pattern as MMenu. Every leaf item fires a toast on click, so you can confirm the click actually landed (this used to fail on touch inside a submenu)."
      :code="`<MContextMenu>
  <template #trigger>
    <div>Right-click anywhere here</div>
  </template>

  <MMenuItem icon=&quot;content_cut&quot; shortcut=&quot;Ctrl+X&quot; @click=&quot;notifyClick('Cut')&quot;>Cut</MMenuItem>
  <MMenuItem icon=&quot;content_copy&quot; shortcut=&quot;Ctrl+C&quot; @click=&quot;notifyClick('Copy')&quot;>Copy</MMenuItem>
  <MMenuItem icon=&quot;content_paste&quot; shortcut=&quot;Ctrl+V&quot; @click=&quot;notifyClick('Paste')&quot;>Paste</MMenuItem>
  <MMenuDivider />
  <MMenuItem icon=&quot;add&quot;>
    Insert
    <template #children>
      <MMenuItem icon=&quot;image&quot; @click=&quot;notifyClick('Image')&quot;>Image</MMenuItem>
      <MMenuItem icon=&quot;videocam&quot; @click=&quot;notifyClick('Video')&quot;>Video</MMenuItem>
      <MMenuDivider />
      <MMenuItem icon=&quot;code&quot;>
        Code
        <template #children>
          <MMenuItem @click=&quot;notifyClick('JavaScript')&quot;>JavaScript</MMenuItem>
          <MMenuItem @click=&quot;notifyClick('TypeScript')&quot;>TypeScript</MMenuItem>
        </template>
      </MMenuItem>
    </template>
  </MMenuItem>
  <MMenuDivider />
  <MMenuItem shortcut=&quot;Ctrl+A&quot; @click=&quot;notifyClick('Select All')&quot;>Select All</MMenuItem>
  <MMenuDivider />
  <MMenuItem icon=&quot;delete&quot; danger @click=&quot;notifyClick('Delete')&quot;>Delete</MMenuItem>
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

        <MMenuItem icon="content_cut" shortcut="Ctrl+X" @click="notifyClick('Cut')">Cut</MMenuItem>
        <MMenuItem icon="content_copy" shortcut="Ctrl+C" @click="notifyClick('Copy')">Copy</MMenuItem>
        <MMenuItem icon="content_paste" shortcut="Ctrl+V" @click="notifyClick('Paste')">Paste</MMenuItem>
        <MMenuDivider />
        <MMenuItem icon="add">
          Insert
          <template #children>
            <MMenuItem icon="image" @click="notifyClick('Image')">Image</MMenuItem>
            <MMenuItem icon="videocam" @click="notifyClick('Video')">Video</MMenuItem>
            <MMenuItem icon="link" @click="notifyClick('Link')">Link</MMenuItem>
            <MMenuDivider />
            <MMenuItem icon="code">
              Code
              <template #children>
                <MMenuItem @click="notifyClick('JavaScript')">JavaScript</MMenuItem>
                <MMenuItem @click="notifyClick('TypeScript')">TypeScript</MMenuItem>
                <MMenuItem @click="notifyClick('Python')">Python</MMenuItem>
              </template>
            </MMenuItem>
          </template>
        </MMenuItem>
        <MMenuItem icon="transform">
          Transform
          <template #children>
            <MMenuItem @click="notifyClick('Uppercase')">Uppercase</MMenuItem>
            <MMenuItem @click="notifyClick('Lowercase')">Lowercase</MMenuItem>
            <MMenuItem @click="notifyClick('Title Case')">Title Case</MMenuItem>
          </template>
        </MMenuItem>
        <MMenuDivider />
        <MMenuItem shortcut="Ctrl+A" @click="notifyClick('Select All')">Select All</MMenuItem>
        <MMenuDivider />
        <MMenuItem icon="delete" danger @click="notifyClick('Delete')">Delete</MMenuItem>
      </MContextMenu>
    </ComponentDemo>

    <ComponentDemo
      title="Expressive Variant"
      description="variant=&quot;expressive&quot; switches M3's baseline square-ish 4dp corners for its rounder 16dp 'vertical menu' styling. &lt;MMenuDivider gap /&gt; (instead of a plain &lt;MMenuDivider /&gt;) splits the panel into independently-rounded group boxes with a visible gap between them."
      :code="`<MContextMenu variant=&quot;expressive&quot;>
  <template #trigger>
    <div>Right-click anywhere here</div>
  </template>

  <MMenuItem icon=&quot;content_cut&quot;>Cut</MMenuItem>
  <MMenuItem icon=&quot;content_copy&quot;>Copy</MMenuItem>
  <MMenuDivider gap />
  <MMenuItem icon=&quot;delete&quot; danger>Delete</MMenuItem>
</MContextMenu>`"
    >
      <MContextMenu variant="expressive">
        <template #trigger>
          <div
            class="flex w-full cursor-default items-center justify-center rounded-lg border-2 border-dashed border-outline-variant p-8 text-body-medium text-on-surface-variant transition-colors hover:border-primary hover:bg-primary-container/10"
          >
            <MIcon name="mouse" :size="20" class="mr-2" />
            Right-click anywhere in this area
          </div>
        </template>

        <MMenuItem icon="content_cut" shortcut="Ctrl+X" @click="notifyClick('Cut')">Cut</MMenuItem>
        <MMenuItem icon="content_copy" shortcut="Ctrl+C" @click="notifyClick('Copy')">Copy</MMenuItem>
        <MMenuDivider gap />
        <MMenuItem icon="share" @click="notifyClick('Share')">Share</MMenuItem>
        <MMenuItem icon="download" @click="notifyClick('Download')">Download</MMenuItem>
        <MMenuDivider gap />
        <MMenuItem icon="delete" danger @click="notifyClick('Delete')">Delete</MMenuItem>
      </MContextMenu>
    </ComponentDemo>

    <ComponentDemo
      title="Push Submenus (touch/mobile)"
      description="submenuMode=&quot;push&quot; swaps the panel's own content for the submenu plus a back header instead of a hover flyout — no positioning math, no hover required, so it holds up on long-press context menus on touch devices. Every leaf item fires a toast on click, so you can confirm the click actually landed."
      :code="`<MContextMenu submenu-mode=&quot;push&quot;>
  <template #trigger>
    <div>Right-click anywhere here</div>
  </template>

  <MMenuItem icon=&quot;content_cut&quot; @click=&quot;notifyClick('Cut')&quot;>Cut</MMenuItem>
  <MMenuItem icon=&quot;add&quot;>
    Insert
    <template #children>
      <MMenuItem icon=&quot;image&quot; @click=&quot;notifyClick('Image')&quot;>Image</MMenuItem>
      <MMenuItem icon=&quot;videocam&quot; @click=&quot;notifyClick('Video')&quot;>Video</MMenuItem>
    </template>
  </MMenuItem>
</MContextMenu>`"
    >
      <MContextMenu submenu-mode="push">
        <template #trigger>
          <div
            class="flex w-full cursor-default items-center justify-center rounded-lg border-2 border-dashed border-outline-variant p-8 text-body-medium text-on-surface-variant transition-colors hover:border-primary hover:bg-primary-container/10"
          >
            <MIcon name="mouse" :size="20" class="mr-2" />
            Right-click anywhere in this area
          </div>
        </template>

        <MMenuItem icon="content_cut" shortcut="Ctrl+X" @click="notifyClick('Cut')">Cut</MMenuItem>
        <MMenuItem icon="content_copy" shortcut="Ctrl+C" @click="notifyClick('Copy')">Copy</MMenuItem>
        <MMenuDivider />
        <MMenuItem icon="add">
          Insert
          <template #children>
            <MMenuItem icon="image" @click="notifyClick('Image')">Image</MMenuItem>
            <MMenuItem icon="videocam" @click="notifyClick('Video')">Video</MMenuItem>
            <MMenuItem icon="code">
              Code
              <template #children>
                <MMenuItem @click="notifyClick('JavaScript')">JavaScript</MMenuItem>
                <MMenuItem @click="notifyClick('TypeScript')">TypeScript</MMenuItem>
              </template>
            </MMenuItem>
          </template>
        </MMenuItem>
        <MMenuDivider />
        <MMenuItem icon="delete" danger @click="notifyClick('Delete')">Delete</MMenuItem>
      </MContextMenu>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="contextMenuProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="contextMenuSlots" />

    <ComponentPager current="MContextMenu" />
  </div>
</template>
