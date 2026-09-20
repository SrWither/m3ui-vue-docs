<script setup lang="ts">
import { ref } from 'vue'
import { MFabMenu, MCard, MButton, useToast } from '@m3ui-vue/m3ui-vue'
import type { FabMenuItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const fabMenuProps: PropDef[] = [
  { name: 'icon', type: 'string', description: "Trigger FAB's Material Symbol icon — use a symmetric one like 'add', since MFab rotates it 45° on open (turning a + into a ×)" },
  { name: 'label', type: 'string', description: 'Shows the trigger as an extended FAB (icon + text) instead of icon-only' },
  { name: 'items', type: 'FabMenuItem[]', description: 'See the type below — an item\'s own color overrides the menu\'s color for just that row' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'surface'", default: "'primary'", description: 'Color scheme applied to both the trigger FAB and every menu item row' },
  { name: 'size', type: "'small' | 'regular' | 'large'", default: "'regular'", description: 'Trigger FAB size — independent from itemSize' },
  { name: 'itemSize', type: "'small' | 'regular' | 'large'", default: "'large'", description: 'Menu item row size (padding, icon, and text scale) — independent from the trigger FAB\'s size. \'large\' matches the real M3 FabMenuItem spec (56dp row height, 24dp icon, titleMedium text)' },
  { name: 'direction', type: "'up' | 'down'", default: "'up'", description: 'Which side of the FAB the menu list opens toward' },
  { name: 'align', type: "'start' | 'end'", default: "'end'", description: "Which edge the (usually wider-than-the-FAB) menu list anchors to — 'end' keeps it from running off-screen when the FAB sits in a bottom-right corner" },
  { name: 'scrim', type: 'boolean', default: 'true', description: 'Dim the rest of the screen while the menu is open' },
  { name: 'persistent', type: 'boolean', default: 'false', description: 'Keep the menu open after clicking an item or clicking outside' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the trigger FAB' },
]

const fabMenuTypes: TypeDef[] = [
  {
    name: 'FabMenuItem',
    fields: [
      { name: 'icon', type: 'string', required: true, description: 'Material Symbol name' },
      { name: 'label', type: 'string', required: true, description: 'Row text' },
      { name: 'to', type: 'string | Record<string, any>', description: 'Vue Router destination' },
      { name: 'onClick', type: '() => void', description: 'Click handler' },
      { name: 'disabled', type: 'boolean', description: 'Disables the row' },
      { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'surface'", description: "Overrides the menu's own color for just this row" },
    ],
  },
]

const fabMenuItems = [
  { icon: 'edit', label: 'Edit', onClick: () => {} },
  { icon: 'share', label: 'Share', onClick: () => {} },
  { icon: 'delete', label: 'Delete', onClick: () => {} },
]

const toast = useToast()

const colorOverrideItems: FabMenuItem[] = [
  { icon: 'star', label: 'Favorite', onClick: () => toast.success('Marked as favorite') },
  { icon: 'archive', label: 'Archive', onClick: () => toast.info('Archived') },
  { icon: 'delete', label: 'Delete', color: 'tertiary', onClick: () => toast.error('Deleted') },
]

// A small, functional example: a note card whose FAB Menu actually edits,
// duplicates, shares, and deletes the note it's attached to.
interface Note { id: number; title: string; body: string }
let nextNoteId = 3
const notes = ref<Note[]>([
  { id: 1, title: 'Grocery list', body: 'Milk, eggs, bread, coffee' },
  { id: 2, title: 'Trip ideas', body: 'Patagonia, Bariloche, Ushuaia' },
])
const editingNoteId = ref<number | null>(null)

function noteMenuItems(note: Note): FabMenuItem[] {
  return [
    { icon: 'edit', label: 'Edit', onClick: () => { editingNoteId.value = note.id } },
    {
      icon: 'content_copy',
      label: 'Duplicate',
      onClick: () => {
        notes.value.push({ id: nextNoteId++, title: `${note.title} (copy)`, body: note.body })
        toast.success('Note duplicated')
      },
    },
    {
      icon: 'share',
      label: 'Share',
      onClick: () => {
        navigator.clipboard?.writeText(`${note.title}: ${note.body}`)
        toast.info('Copied note to clipboard')
      },
    },
    {
      icon: 'delete',
      label: 'Delete',
      color: 'tertiary',
      onClick: () => {
        notes.value = notes.value.filter(n => n.id !== note.id)
        toast.error('Note deleted')
      },
    },
  ]
}
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFabMenu</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The M3 "FAB Menu" — a thin wrapper around <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MFab</code>'s
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">#content</code> slot, so opening/closing, the
      icon's 45° morph, outside-click, and scroll-away are all inherited from <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MFab</code> —
      this component only supplies the row list. Unlike the small circular buttons of a speed dial (<code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MFab</code>'s
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">items</code> prop), each row is a full icon+label pill, revealed one at a time starting
      from the item closest to the FAB.
    </p>

    <ComponentDemo
      title="FAB Menu"
      description="A FAB that expands into a labeled action list."
      :code="`<template>
  <MFabMenu icon=&quot;add&quot; :items=&quot;items&quot; />
</template>`"
      :script="`const items = [
  { icon: 'edit', label: 'Edit', onClick: () => {} },
  { icon: 'share', label: 'Share', onClick: () => {} },
  { icon: 'delete', label: 'Delete', onClick: () => {} },
]`"
    >
      <div class="flex h-64 w-full items-end justify-end">
        <MFabMenu icon="add" :items="fabMenuItems" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Colors"
      description="color applies the same role/container pairing to both the trigger and every menu item row (matching the real M3 FloatingActionButtonMenuItem, whose rows use the color role's *Container tone, not a neutral surface)."
      :code="`<template>
  <MFabMenu icon=&quot;add&quot; :items=&quot;items&quot; color=&quot;secondary&quot; />
</template>`"
    >
      <div class="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
        <MCard v-for="c in (['primary', 'secondary', 'tertiary', 'surface'] as const)" :key="c" class="flex flex-col items-center overflow-visible p-0">
          <p class="w-full border-b border-outline-variant px-4 py-2 text-center text-label-large font-medium text-on-surface-variant">
            {{ c }}
          </p>
          <div class="flex h-52 items-end justify-end p-4">
            <MFabMenu icon="add" :items="fabMenuItems" :color="c" size="small" />
          </div>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="size (trigger FAB) and itemSize (menu rows) are independent props — mix and match, e.g. a small trigger with large, easier-to-tap rows."
      :code="`<template>
  <MFabMenu icon=&quot;add&quot; :items=&quot;items&quot; size=&quot;small&quot; />
  <MFabMenu icon=&quot;add&quot; :items=&quot;items&quot; item-size=&quot;large&quot; />
</template>`"
    >
      <div class="mb-6 flex w-full items-end justify-around">
        <div class="flex flex-col items-center gap-2">
          <MFabMenu icon="add" :items="fabMenuItems" size="small" />
          <span class="text-label-small text-on-surface-variant">size="small"</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MFabMenu icon="add" :items="fabMenuItems" size="regular" />
          <span class="text-label-small text-on-surface-variant">size="regular" (default)</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MFabMenu icon="add" :items="fabMenuItems" size="large" />
          <span class="text-label-small text-on-surface-variant">size="large"</span>
        </div>
      </div>
      <div class="flex w-full items-end justify-around">
        <div class="flex flex-col items-center gap-2">
          <MFabMenu icon="add" :items="fabMenuItems" item-size="small" />
          <span class="text-label-small text-on-surface-variant">itemSize="small"</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MFabMenu icon="add" :items="fabMenuItems" size="small" item-size="large" />
          <span class="text-label-small text-on-surface-variant">size="small", itemSize="large"</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MFabMenu icon="add" :items="fabMenuItems" item-size="large" />
          <span class="text-label-small text-on-surface-variant">itemSize="large" (default)</span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Per-item color override"
      description="An item's own color overrides the menu's color for just that row — handy for calling out a destructive action like Delete while the rest stay on the menu's default color."
      :code="`<template>
  <MFabMenu icon=&quot;add&quot; :items=&quot;items&quot; />
</template>`"
      :script="`const items = [
  { icon: 'star', label: 'Favorite', onClick: () => toast.success('Marked as favorite') },
  { icon: 'archive', label: 'Archive', onClick: () => toast.info('Archived') },
  { icon: 'delete', label: 'Delete', color: 'tertiary', onClick: () => toast.error('Deleted') },
]`"
    >
      <div class="flex h-64 w-full items-end justify-end">
        <MFabMenu icon="add" :items="colorOverrideItems" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Without a scrim"
      description="scrim=&quot;false&quot; skips dimming the rest of the screen while the menu is open — useful when the menu should feel like a lightweight inline reveal rather than a modal-ish overlay."
      :code="`<template>
  <MFabMenu icon=&quot;add&quot; :items=&quot;items&quot; :scrim=&quot;false&quot; />
</template>`"
    >
      <div class="flex h-64 w-full items-end justify-end">
        <MFabMenu icon="add" :items="fabMenuItems" :scrim="false" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Direction and alignment"
      description="direction controls whether the list opens above or below the FAB; align picks which edge a menu wider than the FAB anchors to (use 'start' when the FAB sits closer to the left edge of its container, so the list doesn't run off-screen the other way)."
      :code="`<template>
  <MFabMenu icon=&quot;add&quot; :items=&quot;items&quot; direction=&quot;down&quot; align=&quot;start&quot; />
</template>`"
    >
      <div class="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
        <MCard class="flex flex-col items-center overflow-visible p-0">
          <p class="w-full border-b border-outline-variant px-4 py-2 text-center text-label-large font-medium text-on-surface-variant">
            direction="up" · align="end" (default)
          </p>
          <div class="flex h-64 w-full items-end justify-end p-4">
            <MFabMenu icon="add" :items="fabMenuItems" />
          </div>
        </MCard>
        <MCard class="flex flex-col items-center overflow-visible p-0">
          <p class="w-full border-b border-outline-variant px-4 py-2 text-center text-label-large font-medium text-on-surface-variant">
            direction="down" · align="start"
          </p>
          <div class="flex h-64 w-full items-start justify-start p-4">
            <MFabMenu icon="add" :items="fabMenuItems" direction="down" align="start" />
          </div>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Practical example: note actions"
      description="Each note card has its own MFabMenu whose items actually edit, duplicate, share (copies to clipboard), and delete that note — not just placeholder onClick handlers."
      :code="`<template>
  <MCard v-for=&quot;note in notes&quot; :key=&quot;note.id&quot; class=&quot;relative p-4&quot;>
    <h3>{{ note.title }}</h3>
    <p>{{ note.body }}</p>
    <MFabMenu
      icon=&quot;more_vert&quot;
      size=&quot;small&quot;
      color=&quot;surface&quot;
      :items=&quot;noteMenuItems(note)&quot;
      class=&quot;absolute right-3 bottom-3&quot;
    />
  </MCard>
</template>

<script setup>
function noteMenuItems(note) {
  return [
    { icon: 'edit', label: 'Edit', onClick: () => { editingNoteId.value = note.id } },
    { icon: 'content_copy', label: 'Duplicate', onClick: () => {
        notes.value.push({ id: nextNoteId++, title: \`\${note.title} (copy)\`, body: note.body })
        toast.success('Note duplicated')
    } },
    { icon: 'share', label: 'Share', onClick: () => {
        navigator.clipboard?.writeText(\`\${note.title}: \${note.body}\`)
        toast.info('Copied note to clipboard')
    } },
    { icon: 'delete', label: 'Delete', color: 'tertiary', onClick: () => {
        notes.value = notes.value.filter(n => n.id !== note.id)
        toast.error('Note deleted')
    } },
  ]
}
<\/script>`"
    >
      <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <MCard v-if="notes.length === 0" class="col-span-full p-6 text-center text-body-medium text-on-surface-variant">
          No notes left — duplicate one from the other demos above, or refresh the page to reset.
        </MCard>
        <MCard v-for="note in notes" :key="note.id" class="relative overflow-visible p-4 pb-14">
          <template v-if="editingNoteId === note.id">
            <input
              v-model="note.title"
              class="mb-2 w-full rounded border border-outline bg-surface px-2 py-1 text-title-medium text-on-surface"
            />
            <textarea
              v-model="note.body"
              rows="2"
              class="w-full rounded border border-outline bg-surface px-2 py-1 text-body-medium text-on-surface"
            />
            <MButton size="xs" variant="text" class="mt-2" @click="editingNoteId = null">Done</MButton>
          </template>
          <template v-else>
            <h3 class="text-title-medium font-medium text-on-surface">{{ note.title }}</h3>
            <p class="mt-1 text-body-medium text-on-surface-variant">{{ note.body }}</p>
          </template>
          <MFabMenu
            icon="more_vert"
            size="small"
            color="surface"
            :items="noteMenuItems(note)"
            class="absolute right-3 bottom-3"
          />
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="fabMenuProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="fabMenuTypes" />

    <ComponentPager current="MFabMenu" />
  </div>
</template>
