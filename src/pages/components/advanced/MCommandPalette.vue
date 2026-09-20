<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MCommandPalette } from '@m3ui-vue/m3ui-vue'
import type { CommandItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const paletteOpen = ref(false)
const paletteOpen2 = ref(false)

const commandItems: CommandItem[] = [
  { id: 'new', label: 'New File', icon: 'add', shortcut: 'Ctrl+N', group: 'File' },
  { id: 'open', label: 'Open File', icon: 'folder_open', shortcut: 'Ctrl+O', group: 'File' },
  { id: 'save', label: 'Save', icon: 'save', shortcut: 'Ctrl+S', group: 'File' },
  { id: 'theme', label: 'Toggle Theme', icon: 'dark_mode', group: 'Preferences' },
  { id: 'search', label: 'Search', icon: 'search', shortcut: 'Ctrl+F', group: 'Edit' },
  { id: 'replace', label: 'Find & Replace', icon: 'find_replace', shortcut: 'Ctrl+H', group: 'Edit' },
]

const commandPaletteProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model). Required — there is no default.' },
  { name: 'items', type: 'CommandItem[]', description: 'Commands to search over (see the type below). Required — there is no default.' },
  { name: 'placeholder', type: 'string', description: "Search input placeholder — falls back to the locale's own string when unset" },
  { name: 'noResultsText', type: 'string', description: "Empty-state text — falls back to the locale's own string when unset" },
  { name: 'hotkey', type: 'string', default: "'k'", description: 'Global keyboard shortcut key, combined with Cmd/Ctrl, to toggle the palette' },
  { name: 'navigateHint', type: 'string', description: "Footer hint text for the arrow keys — falls back to the locale's own string when unset" },
  { name: 'selectHint', type: 'string', description: "Footer hint text for Enter — falls back to the locale's own string when unset" },
  { name: 'closeHint', type: 'string', description: "Footer hint text for Escape — falls back to the locale's own string when unset" },
]

const commandPaletteEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted on open/close — powers v-model' },
  { name: 'select', payload: 'CommandItem', description: "Emitted when an item is chosen (click, or Enter) — fires before the item's own onSelect callback runs" },
]

const commandPaletteTypes: TypeDef[] = [
  {
    name: 'CommandItem',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Unique identifier' },
      { name: 'label', type: 'string', required: true, description: 'Displayed text, also matched against the search query' },
      { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
      { name: 'shortcut', type: 'string', description: 'Keyboard shortcut label shown on the right (display only, not wired up)' },
      { name: 'group', type: 'string', description: 'Group heading the item is listed under, also matched against the search query' },
      { name: 'disabled', type: 'boolean', description: 'Excludes the item from the filtered/results list entirely' },
      { name: 'onSelect', type: '() => void', description: 'Called right after the select event fires and the palette closes' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCommandPalette</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A searchable, keyboard-driven command palette — grouped commands, fuzzy-free substring search, and a
      global hotkey (Cmd/Ctrl+K by default).
    </p>

    <ComponentDemo
      title="Command Palette"
      description="A searchable command palette with keyboard shortcut support. Press Ctrl+K to open, or use the button below."
      :code="`<MButton @click=&quot;open = true&quot;>Open Command Palette</MButton>
<MCommandPalette v-model=&quot;open&quot; :items=&quot;items&quot; />`"
      :script="`import { ref } from 'vue'
import type { CommandItem } from '@m3ui-vue/m3ui-vue'

const open = ref(false)

const items: CommandItem[] = [
  { id: 'new', label: 'New File', icon: 'add', shortcut: 'Ctrl+N', group: 'File' },
  { id: 'open', label: 'Open File', icon: 'folder_open', shortcut: 'Ctrl+O', group: 'File' },
  { id: 'save', label: 'Save', icon: 'save', shortcut: 'Ctrl+S', group: 'File' },
  { id: 'theme', label: 'Toggle Theme', icon: 'dark_mode', group: 'Preferences' },
  { id: 'search', label: 'Search', icon: 'search', shortcut: 'Ctrl+F', group: 'Edit' },
  { id: 'replace', label: 'Find &amp; Replace', icon: 'find_replace', shortcut: 'Ctrl+H', group: 'Edit' },
]`"
    >
      <MButton @click="paletteOpen = true">Open Command Palette</MButton>
      <MCommandPalette v-model="paletteOpen" :items="commandItems" />
    </ComponentDemo>

    <ComponentDemo
      title="Custom Text"
      description="placeholder, noResultsText, and the navigate/select/close footer hints can all be overridden independently of the active locale — useful for app-specific wording."
      :code="`<MCommandPalette
  v-model=&quot;open&quot;
  :items=&quot;items&quot;
  placeholder=&quot;Type a command or search…&quot;
  no-results-text=&quot;Nothing matches that&quot;
  navigate-hint=&quot;move&quot;
  select-hint=&quot;run&quot;
  close-hint=&quot;dismiss&quot;
/>`"
    >
      <MButton @click="paletteOpen2 = true">Open (custom text)</MButton>
      <MCommandPalette
        v-model="paletteOpen2"
        :items="commandItems"
        placeholder="Type a command or search…"
        no-results-text="Nothing matches that"
        navigate-hint="move"
        select-hint="run"
        close-hint="dismiss"
      />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="commandPaletteProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="commandPaletteEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="commandPaletteTypes" />

    <ComponentPager current="MCommandPalette" />
  </div>
</template>
