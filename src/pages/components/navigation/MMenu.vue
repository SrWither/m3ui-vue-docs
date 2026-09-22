<script setup lang="ts">
import { reactive } from 'vue'
import { MMenu, MMenuItem, MMenuDivider, MButton, MIconButton, useToast } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const toast = useToast()
function notifyClick(label: string) {
  toast.success(`Clicked: ${label}`)
}

const filters = reactive({
  electronics: true,
  clothing: false,
  books: false,
  under25: false,
  mid: true,
  over100: false,
})
function toggleFilter(key: keyof typeof filters) {
  filters[key] = !filters[key]
}

const menuProps: PropDef[] = [
  { name: 'align', type: "'left' | 'right'", default: "'right'", description: 'Which edge of the trigger the dropdown aligns to' },
  { name: 'submenuMode', type: "'flyout' | 'push'", default: "'flyout'", description: "How items with #children behave. 'flyout' opens a side panel next to the item (desktop, mouse hover). 'push' replaces the menu's own content with the submenu plus a back header — no hover, no positioning math, works reliably with touch. Use 'push' for mobile-oriented menus." },
  { name: 'variant', type: "'standard' | 'expressive'", default: "'standard'", description: "'standard' is M3's baseline menu (4dp corners). 'expressive' is M3's rounder 'vertical menu' styling (16dp corners) — combine with <MMenuDivider gap /> to split the panel into independently-rounded groups with a visible gap, instead of a plain divider line." },
]

const menuDividerProps: PropDef[] = [
  { name: 'gap', type: 'boolean', default: 'false', description: "Only meaningful inside an expressive-variant menu: instead of rendering a plain line, splits the panel here into two independently-rounded group boxes with a small gap between them. Renders as a normal divider anywhere else (standard variant, or no effect)." },
]

const menuItemProps: PropDef[] = [
  { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'shortcut', type: 'string', description: 'Keyboard shortcut hint displayed on the right (e.g. "Ctrl+C") — hidden when the item has #children' },
  { name: 'to', type: 'string | Record<string, any>', description: 'Vue Router destination — renders as RouterLink instead of button' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the item' },
  { name: 'danger', type: 'boolean', default: 'false', description: 'Danger/destructive styling (error color)' },
  { name: 'keepOpen', type: 'boolean', default: 'false', description: 'Keep the menu open after this item is clicked, instead of the default close-on-click. Useful for checkable/toggle items (e.g. "Show columns", "Sort by") where the user picks several without the menu closing on every tap.' },
]

const menuItemEvents = [
  { name: 'click', description: 'Emitted when a leaf item (no #children) is clicked. Not emitted for disabled items or for items with #children, since clicking those just opens/toggles the submenu instead.' },
]

const menuItemSlots: SlotDef[] = [
  { name: '#default', description: 'Item label text.' },
  { name: '#children', description: "Nested submenu items. In the parent MMenu's default 'flyout' mode, clicking or hovering (mouse only) the item opens a side panel — supports unlimited nesting depth. In 'push' mode, clicking the item instead swaps the whole menu panel to the submenu with a back header; hover does nothing." },
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
      description="Menu items can have nested children via the #children slot. Hover (or tap — every leaf item here fires a toast on click, so you can confirm the click actually landed) to expand — supports unlimited nesting depth."
      :code="`<MMenu>
  <template #trigger>
    <MButton>Open</MButton>
  </template>
  <MMenuItem icon=&quot;file_open&quot; @click=&quot;notifyClick('Open')&quot;>Open</MMenuItem>
  <MMenuItem icon=&quot;share&quot;>
    Share
    <template #children>
      <MMenuItem icon=&quot;email&quot; @click=&quot;notifyClick('Email')&quot;>Email</MMenuItem>
      <MMenuItem icon=&quot;link&quot; @click=&quot;notifyClick('Copy link')&quot;>Copy link</MMenuItem>
    </template>
  </MMenuItem>
</MMenu>`"
    >
      <MMenu>
        <template #trigger>
          <MButton variant="tonal" icon="menu">Menu with subs</MButton>
        </template>
        <MMenuItem icon="file_open" @click="notifyClick('Open')">Open</MMenuItem>
        <MMenuItem icon="edit" @click="notifyClick('Edit')">Edit</MMenuItem>
        <MMenuItem icon="share">
          Share
          <template #children>
            <MMenuItem icon="email" @click="notifyClick('Email')">Email</MMenuItem>
            <MMenuItem icon="link" @click="notifyClick('Copy link')">Copy link</MMenuItem>
            <MMenuItem icon="chat">
              Social
              <template #children>
                <MMenuItem icon="flutter_dash" @click="notifyClick('Twitter')">Twitter</MMenuItem>
                <MMenuItem icon="public" @click="notifyClick('Facebook')">Facebook</MMenuItem>
                <MMenuItem icon="code" @click="notifyClick('LinkedIn')">LinkedIn</MMenuItem>
              </template>
            </MMenuItem>
          </template>
        </MMenuItem>
        <MMenuItem icon="drive_file_move">
          Move to
          <template #children>
            <MMenuItem icon="folder" @click="notifyClick('Documents')">Documents</MMenuItem>
            <MMenuItem icon="folder">
              Projects
              <template #children>
                <MMenuItem icon="folder" @click="notifyClick('Frontend')">Frontend</MMenuItem>
                <MMenuItem icon="folder" @click="notifyClick('Backend')">Backend</MMenuItem>
                <MMenuItem icon="folder" @click="notifyClick('Design')">Design</MMenuItem>
              </template>
            </MMenuItem>
            <MMenuItem icon="folder" @click="notifyClick('Archive')">Archive</MMenuItem>
          </template>
        </MMenuItem>
        <MMenuItem icon="delete" danger @click="notifyClick('Delete')">Delete</MMenuItem>
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

    <ComponentDemo
      title="Standard vs. Expressive"
      description="variant=&quot;expressive&quot; switches M3's baseline square-ish 4dp corners for its rounder 16dp 'vertical menu' styling. Combine with &lt;MMenuDivider gap /&gt; (instead of a plain &lt;MMenuDivider /&gt;) to split the panel into independently-rounded group boxes with a visible gap, rather than an in-line divider line."
      :code="`<!-- Standard (default) -->
<MMenu>
  <template #trigger><MButton>Standard</MButton></template>
  <MMenuItem icon=&quot;edit&quot;>Edit</MMenuItem>
  <MMenuItem icon=&quot;content_copy&quot;>Duplicate</MMenuItem>
  <MMenuDivider />
  <MMenuItem icon=&quot;delete&quot; danger>Delete</MMenuItem>
</MMenu>

<!-- Expressive, single rounded group (plain divider) -->
<MMenu variant=&quot;expressive&quot;>
  <template #trigger><MButton>Expressive</MButton></template>
  <MMenuItem icon=&quot;edit&quot;>Edit</MMenuItem>
  <MMenuItem icon=&quot;content_copy&quot;>Duplicate</MMenuItem>
  <MMenuDivider />
  <MMenuItem icon=&quot;delete&quot; danger>Delete</MMenuItem>
</MMenu>

<!-- Expressive, split into two rounded groups -->
<MMenu variant=&quot;expressive&quot;>
  <template #trigger><MButton>Expressive (grouped)</MButton></template>
  <MMenuItem icon=&quot;edit&quot;>Edit</MMenuItem>
  <MMenuItem icon=&quot;content_copy&quot;>Duplicate</MMenuItem>
  <MMenuDivider gap />
  <MMenuItem icon=&quot;delete&quot; danger>Delete</MMenuItem>
</MMenu>`"
    >
      <MMenu align="left">
        <template #trigger>
          <MButton variant="outlined">Standard</MButton>
        </template>
        <MMenuItem icon="edit" @click="notifyClick('Edit')">Edit</MMenuItem>
        <MMenuItem icon="content_copy" @click="notifyClick('Duplicate')">Duplicate</MMenuItem>
        <MMenuItem icon="share" @click="notifyClick('Share')">Share</MMenuItem>
        <MMenuDivider />
        <MMenuItem icon="delete" danger @click="notifyClick('Delete')">Delete</MMenuItem>
      </MMenu>

      <MMenu align="left" variant="expressive">
        <template #trigger>
          <MButton variant="tonal">Expressive</MButton>
        </template>
        <MMenuItem icon="edit" @click="notifyClick('Edit')">Edit</MMenuItem>
        <MMenuItem icon="content_copy" @click="notifyClick('Duplicate')">Duplicate</MMenuItem>
        <MMenuItem icon="share" @click="notifyClick('Share')">Share</MMenuItem>
        <MMenuDivider />
        <MMenuItem icon="delete" danger @click="notifyClick('Delete')">Delete</MMenuItem>
      </MMenu>

      <MMenu align="left" variant="expressive">
        <template #trigger>
          <MButton variant="tonal" icon="dashboard">Expressive (grouped)</MButton>
        </template>
        <MMenuItem icon="edit" @click="notifyClick('Edit')">Edit</MMenuItem>
        <MMenuItem icon="content_copy" @click="notifyClick('Duplicate')">Duplicate</MMenuItem>
        <MMenuDivider gap />
        <MMenuItem icon="share" @click="notifyClick('Share')">Share</MMenuItem>
        <MMenuItem icon="download" @click="notifyClick('Download')">Download</MMenuItem>
        <MMenuDivider gap />
        <MMenuItem icon="delete" danger @click="notifyClick('Delete')">Delete</MMenuItem>
      </MMenu>
    </ComponentDemo>

    <ComponentDemo
      title="Push Submenus (mobile)"
      description="submenuMode=&quot;push&quot; replaces the menu's own content with the submenu plus a back header instead of a hover flyout — no positioning math, no hover required, so it works reliably with touch. Tap an item with children to drill in, tap the back row (or Escape) to go up one level. Every leaf item fires a toast on click, so you can confirm the click actually landed."
      :code="`<MMenu submenu-mode=&quot;push&quot;>
  <template #trigger>
    <MButton>Open</MButton>
  </template>
  <MMenuItem icon=&quot;file_open&quot; @click=&quot;notifyClick('Open')&quot;>Open</MMenuItem>
  <MMenuItem icon=&quot;share&quot;>
    Share
    <template #children>
      <MMenuItem icon=&quot;email&quot; @click=&quot;notifyClick('Email')&quot;>Email</MMenuItem>
      <MMenuItem icon=&quot;link&quot; @click=&quot;notifyClick('Copy link')&quot;>Copy link</MMenuItem>
    </template>
  </MMenuItem>
</MMenu>`"
    >
      <MMenu submenu-mode="push">
        <template #trigger>
          <MButton variant="tonal" icon="menu">Menu with subs</MButton>
        </template>
        <MMenuItem icon="file_open" @click="notifyClick('Open')">Open</MMenuItem>
        <MMenuItem icon="edit" @click="notifyClick('Edit')">Edit</MMenuItem>
        <MMenuItem icon="share">
          Share
          <template #children>
            <MMenuItem icon="email" @click="notifyClick('Email')">Email</MMenuItem>
            <MMenuItem icon="link" @click="notifyClick('Copy link')">Copy link</MMenuItem>
            <MMenuItem icon="chat">
              Social
              <template #children>
                <MMenuItem icon="flutter_dash" @click="notifyClick('Twitter')">Twitter</MMenuItem>
                <MMenuItem icon="public" @click="notifyClick('Facebook')">Facebook</MMenuItem>
                <MMenuItem icon="code" @click="notifyClick('LinkedIn')">LinkedIn</MMenuItem>
              </template>
            </MMenuItem>
          </template>
        </MMenuItem>
        <MMenuItem icon="drive_file_move">
          Move to
          <template #children>
            <MMenuItem icon="folder" @click="notifyClick('Documents')">Documents</MMenuItem>
            <MMenuItem icon="folder" @click="notifyClick('Projects')">Projects</MMenuItem>
            <MMenuItem icon="folder" @click="notifyClick('Archive')">Archive</MMenuItem>
          </template>
        </MMenuItem>
        <MMenuItem icon="delete" danger @click="notifyClick('Delete')">Delete</MMenuItem>
      </MMenu>
    </ComponentDemo>

    <ComponentDemo
      title="Persistent Items (keepOpen)"
      description="Set keepOpen on a checkable/toggle item so the menu stays open after it's clicked — useful for multi-select pickers like column visibility."
      :code="`<MMenu>
  <template #trigger>
    <MButton>Columns</MButton>
  </template>
  <MMenuItem icon=&quot;check_box&quot; keep-open>Name</MMenuItem>
  <MMenuItem icon=&quot;check_box&quot; keep-open>Email</MMenuItem>
  <MMenuItem icon=&quot;check_box_outline_blank&quot; keep-open>Phone</MMenuItem>
</MMenu>`"
    >
      <MMenu align="left">
        <template #trigger>
          <MButton variant="outlined" icon="view_column">Columns</MButton>
        </template>
        <MMenuItem icon="check_box" keep-open>Name</MMenuItem>
        <MMenuItem icon="check_box" keep-open>Email</MMenuItem>
        <MMenuItem icon="check_box_outline_blank" keep-open>Phone</MMenuItem>
        <MMenuItem icon="check_box" keep-open>Status</MMenuItem>
      </MMenu>
    </ComponentDemo>

    <ComponentDemo
      title="Persistent Items inside Submenus"
      description="keepOpen works the same way inside a #children submenu — picking several options across different categories doesn't close the menu (or collapse the submenu) after each tap, so you can filter across multiple groups in one go."
      :code="`<MMenu>
  <template #trigger>
    <MButton icon=&quot;filter_list&quot;>Filters</MButton>
  </template>
  <MMenuItem icon=&quot;category&quot;>
    Category
    <template #children>
      <MMenuItem
        :icon=&quot;filters.electronics ? 'check_box' : 'check_box_outline_blank'&quot;
        keep-open
        @click=&quot;toggleFilter('electronics')&quot;
      >
        Electronics
      </MMenuItem>
      <MMenuItem
        :icon=&quot;filters.clothing ? 'check_box' : 'check_box_outline_blank'&quot;
        keep-open
        @click=&quot;toggleFilter('clothing')&quot;
      >
        Clothing
      </MMenuItem>
    </template>
  </MMenuItem>
  <MMenuItem icon=&quot;attach_money&quot;>
    Price range
    <template #children>
      <MMenuItem
        :icon=&quot;filters.mid ? 'check_box' : 'check_box_outline_blank'&quot;
        keep-open
        @click=&quot;toggleFilter('mid')&quot;
      >
        \\$25 - \\$100
      </MMenuItem>
    </template>
  </MMenuItem>
  <MMenuDivider />
  <MMenuItem icon=&quot;clear&quot;>Clear filters</MMenuItem>
</MMenu>`"
    >
      <MMenu align="left">
        <template #trigger>
          <MButton variant="outlined" icon="filter_list">Filters</MButton>
        </template>
        <MMenuItem icon="category">
          Category
          <template #children>
            <MMenuItem
              :icon="filters.electronics ? 'check_box' : 'check_box_outline_blank'"
              keep-open
              @click="toggleFilter('electronics')"
            >
              Electronics
            </MMenuItem>
            <MMenuItem
              :icon="filters.clothing ? 'check_box' : 'check_box_outline_blank'"
              keep-open
              @click="toggleFilter('clothing')"
            >
              Clothing
            </MMenuItem>
            <MMenuItem
              :icon="filters.books ? 'check_box' : 'check_box_outline_blank'"
              keep-open
              @click="toggleFilter('books')"
            >
              Books
            </MMenuItem>
          </template>
        </MMenuItem>
        <MMenuItem icon="attach_money">
          Price range
          <template #children>
            <MMenuItem
              :icon="filters.under25 ? 'check_box' : 'check_box_outline_blank'"
              keep-open
              @click="toggleFilter('under25')"
            >
              Under $25
            </MMenuItem>
            <MMenuItem
              :icon="filters.mid ? 'check_box' : 'check_box_outline_blank'"
              keep-open
              @click="toggleFilter('mid')"
            >
              $25 - $100
            </MMenuItem>
            <MMenuItem
              :icon="filters.over100 ? 'check_box' : 'check_box_outline_blank'"
              keep-open
              @click="toggleFilter('over100')"
            >
              Over $100
            </MMenuItem>
          </template>
        </MMenuItem>
        <MMenuDivider />
        <MMenuItem icon="clear" @click="notifyClick('Clear filters')">Clear filters</MMenuItem>
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">MMenuDivider Props</h3>
    <PropsTable :props="menuDividerProps" />

    <ComponentPager current="MMenu" />
  </div>
</template>
