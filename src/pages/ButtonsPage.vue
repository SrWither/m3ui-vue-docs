<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MIconButton, MFab, MFabMenu, MSplitButton, MButtonGroup, MSegmentedButton, MCopyButton, MExportButton, MCard, MIcon, useToast } from '@m3ui-vue/m3ui-vue'
import type { FabMenuItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const copyButtonLog = ref('')
function onCopyButtonCopied(value: string) { copyButtonLog.value = `@copied: "${value}"` }

const exportRows = [
  { name: 'Ada Lovelace', role: 'Engineer' },
  { name: 'Grace Hopper', role: 'Admiral' },
]
const exportLog = ref('')
function onExported({ format, filename }: { format: string; filename: string }) {
  exportLog.value = `@exported: ${format} → ${filename}`
}

const segmentedValue = ref('day')
const segmentedMulti = ref<string[]>(['bold'])
const bgSingle = ref<string | null>('left')
const bgMulti = ref<string[]>(['bold', 'italic'])

const bgOptions = [
  { value: 'left', label: 'Left', icon: 'format_align_left' },
  { value: 'center', label: 'Center', icon: 'format_align_center' },
  { value: 'right', label: 'Right', icon: 'format_align_right' },
  { value: 'justify', label: 'Justify', icon: 'format_align_justify' },
]

const bgFormatOptions = [
  { value: 'bold', icon: 'format_bold' },
  { value: 'italic', icon: 'format_italic' },
  { value: 'underline', icon: 'format_underlined' },
  { value: 'strike', icon: 'strikethrough_s' },
]

const viewMode = ref<string | null>('grid')
const sortBy = ref<string | null>('name')
const fileFilters = ref<string[]>(['images'])

const selectedPriority = ref<Record<string, unknown> | null>({ level: 'medium', color: '#f59e0b' })
const priorityOptions = [
  { value: { level: 'low', color: '#22c55e' }, label: 'Low', icon: 'arrow_downward' },
  { value: { level: 'medium', color: '#f59e0b' }, label: 'Medium', icon: 'remove' },
  { value: { level: 'high', color: '#ef4444' }, label: 'High', icon: 'arrow_upward' },
  { value: { level: 'critical', color: '#dc2626' }, label: 'Critical', icon: 'priority_high' },
]

const dialItems = [
  { icon: 'image', label: 'Photo', onClick: () => {} },
  { icon: 'videocam', label: 'Video', onClick: () => {} },
  { icon: 'mic', label: 'Audio', onClick: () => {} },
]

const activeLayer = ref('osm')
const activeLayers = ref<string[]>(['osm'])
const mapLayers = [
  { id: 'osm', label: 'OpenStreetMap', img: 'https://tile.openstreetmap.org/2/2/1.png' },
  { id: 'satellite', label: 'Satellite', img: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/2/1/2' },
  { id: 'topo', label: 'Topographic', img: 'https://tile.opentopomap.org/2/2/1.png' },
]
function toggleLayer(id: string) {
  const i = activeLayers.value.indexOf(id)
  if (i >= 0) activeLayers.value = activeLayers.value.filter(l => l !== id)
  else activeLayers.value = [...activeLayers.value, id]
}

const buttonProps: PropDef[] = [
  { name: 'variant', type: "'filled' | 'tonal' | 'outlined' | 'text' | 'elevated'", default: "'filled'", description: 'Visual style of the button' },
  { name: 'color', type: "'primary' | 'error' | CSS color", default: "'primary'", description: 'Semantic color or any CSS color string' },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'HTML button type' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner and disables the button' },
  { name: 'icon', type: 'string', description: 'Material Symbol icon name shown before the label' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: "M3's 5-tier expressive button sizing (xs: 32px, sm: 40px, md: 56px, lg: 96px, xl: 136px) — lg/xl are meant for hero-style prominent buttons, not everyday UI" },
  { name: 'shape', type: "'rounded' | 'squared'", default: "'rounded'", description: 'Button shape — rounded (pill, always) or squared (corner radius scales with size: 12px xs/sm, 16px md, 28px lg/xl)' },
  { name: 'to', type: 'string | RouteLocationRaw', description: 'Vue Router destination — renders as RouterLink instead of button' },
]

const iconButtonProps: PropDef[] = [
  { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'label', type: 'string', description: 'Accessible label (aria-label and title)' },
  { name: 'variant', type: "'standard' | 'filled' | 'tonal' | 'outlined'", default: "'standard'", description: 'Visual style' },
  { name: 'shape', type: "'rounded' | 'squared'", default: "'rounded'", description: 'Button shape — rounded (pill, always) or squared (corner radius scales with size: 12px xs/sm, 16px md, 28px lg/xl)' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'sm'", description: "M3's 5-tier icon button sizing (xs:32, sm:40, md:56, lg:96, xl:136), or a custom pixel value" },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'to', type: 'string | RouteLocationRaw', description: 'Vue Router destination — renders as RouterLink instead of button' },
]

const fabProps: PropDef[] = [
  { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'label', type: 'string', description: 'Extended FAB label text' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'surface'", default: "'primary'", description: 'Color scheme' },
  { name: 'size', type: "'small' | 'regular' | 'medium' | 'large'", default: "'regular'", description: 'FAB size' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'items', type: 'SpeedDialItem[]', description: 'Speed-dial child items (see interface below)' },
  { name: 'direction', type: "'up' | 'down' | 'left' | 'right' | 'radial'", default: "'up'", description: 'Speed-dial expand direction' },
  { name: 'to', type: 'string | RouteLocationRaw', description: 'Vue Router destination — renders as RouterLink instead of button' },
  { name: 'persistent', type: 'boolean', default: 'false', description: 'Keep speed-dial open after clicking an item or clicking outside' },
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

const fabMenuProps: PropDef[] = [
  { name: 'icon', type: 'string', description: "Trigger FAB's Material Symbol icon — use a symmetric one like 'add', since MFab rotates it 45° on open (turning a + into a ×)" },
  { name: 'label', type: 'string', description: 'Shows the trigger as an extended FAB (icon + text) instead of icon-only' },
  { name: 'items', type: 'FabMenuItem[]', description: "{ icon, label, to?, onClick?, disabled?, color? } — an item's own color overrides the menu's color for just that row" },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'surface'", default: "'primary'", description: 'Color scheme applied to both the trigger FAB and every menu item row' },
  { name: 'size', type: "'small' | 'regular' | 'large'", default: "'regular'", description: 'Trigger FAB size — independent from itemSize' },
  { name: 'itemSize', type: "'small' | 'regular' | 'large'", default: "'large'", description: 'Menu item row size (padding, icon, and text scale) — independent from the trigger FAB\'s size. \'large\' matches the real M3 FabMenuItem spec (56dp row height, 24dp icon, titleMedium text)' },
  { name: 'direction', type: "'up' | 'down'", default: "'up'", description: 'Which side of the FAB the menu list opens toward' },
  { name: 'align', type: "'start' | 'end'", default: "'end'", description: "Which edge the (usually wider-than-the-FAB) menu list anchors to — 'end' keeps it from running off-screen when the FAB sits in a bottom-right corner" },
  { name: 'scrim', type: 'boolean', default: 'true', description: 'Dim the rest of the screen while the menu is open' },
  { name: 'persistent', type: 'boolean', default: 'false', description: 'Keep the menu open after clicking an item or clicking outside' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the trigger FAB' },
]

const splitItems = [
  { label: 'Schedule send', icon: 'schedule_send', onClick: () => {} },
  { label: 'Save draft', icon: 'drafts', onClick: () => {} },
  { label: 'Discard', icon: 'delete', onClick: () => {} },
]

const splitButtonProps: PropDef[] = [
  { name: 'label', type: 'string', description: 'Main button label' },
  { name: 'icon', type: 'string', description: 'Main button icon' },
  { name: 'variant', type: "'filled' | 'tonal' | 'outlined' | 'elevated'", default: "'tonal'", description: 'Visual style' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary'", default: "'primary'", description: 'Color scheme' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'Button size' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables both parts' },
  { name: 'items', type: 'SplitButtonItem[]', description: 'Dropdown menu items { label, icon?, disabled?, onClick? }' },
  { name: '@click', type: 'event', description: 'Emitted when the main (left) button is clicked' },
]

const splitButtonSlots: SlotDef[] = [
  { name: '#menu', scope: '{ close: () => void }', description: 'Custom dropdown content. Used instead of items. Call close() to dismiss.' },
]

const buttonGroupProps: PropDef[] = [
  { name: 'modelValue', type: 'unknown', description: 'Selected value(s) — any type (v-model)' },
  { name: 'options', type: 'ButtonGroupOption[]', description: '{ value: unknown, label?, icon?, disabled? }' },
  { name: 'variant', type: "'standard' | 'connected'", default: "'standard'", description: 'Standard (separated) or connected (joined)' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'Button size' },
  { name: 'multiSelect', type: 'boolean', default: 'false', description: 'Allow multiple selections' },
  { name: 'selectionRequired', type: 'boolean', default: 'false', description: 'At least one must be selected' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary'", default: "'primary'", description: 'Selected button color' },
]

const segmentedProps: PropDef[] = [
  { name: 'modelValue', type: 'string | number | (string | number)[]', description: 'Selected value(s)' },
  { name: 'options', type: 'SegmentedOption[]', description: 'Array of { value, label, icon?, disabled? }' },
  { name: 'multiSelect', type: 'boolean', default: 'false', description: 'Allow multiple selections' },
  { name: 'density', type: "'default' | 'comfortable' | 'compact'", default: "'default'", description: 'Button density' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary'", default: "'primary'", description: 'Selected segment color' },
]

const copyButtonProps: PropDef[] = [
  { name: 'value', type: 'string', description: 'Text copied to the clipboard on click' },
  { name: 'icon', type: 'string', default: "'content_copy'", description: 'Icon shown in the idle state' },
  { name: 'copiedIcon', type: 'string', default: "'check'", description: 'Icon shown right after a successful copy' },
  { name: 'label', type: 'string', default: "'Copy'", description: 'aria-label in the idle state' },
  { name: 'copiedLabel', type: 'string', default: "'Copied'", description: 'aria-label right after a successful copy' },
  { name: 'variant', type: "'standard' | 'filled' | 'tonal' | 'outlined'", default: "'standard'", description: 'Visual style (same as MIconButton)' },
  { name: 'shape', type: "'rounded' | 'squared'", default: "'rounded'", description: 'Button shape' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'sm'", description: 'Button size' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button' },
  { name: 'resetDelay', type: 'number', default: '2000', description: 'Milliseconds before the icon reverts to idle after copying' },
]

const exportButtonProps: PropDef[] = [
  { name: 'data', type: 'Record<string, unknown>[]', description: 'Array of objects to export' },
  { name: 'format', type: "'csv' | 'json'", default: "'csv'", description: 'Export format' },
  { name: 'filename', type: 'string', default: "'export'", description: 'Filename without extension — the extension is added automatically' },
  { name: 'label', type: 'string', default: "'Export'", description: 'Button label (overridden by the default slot)' },
  { name: 'icon', type: 'string', default: "'download'", description: 'Leading Material Symbol icon' },
  { name: 'variant', type: "'filled' | 'tonal' | 'outlined' | 'text' | 'elevated'", default: "'outlined'", description: 'Visual style (same as MButton)' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'Button size' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Buttons</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Buttons let users take actions and make choices with a single tap.
    </p>

    <!-- ── MButton ──────────────────────────────────────────────────────── -->
    <h2 id="mbutton" class="mb-4 text-headline-small font-medium">MButton</h2>

    <ComponentDemo
      title="Variants"
      description="Five button variants following the M3 specification."
      :code="`<template>
  <MButton variant=&quot;filled&quot;>Filled</MButton>
  <MButton variant=&quot;tonal&quot;>Tonal</MButton>
  <MButton variant=&quot;elevated&quot;>Elevated</MButton>
  <MButton variant=&quot;outlined&quot;>Outlined</MButton>
  <MButton variant=&quot;text&quot;>Text</MButton>
</template>`"
    >
      <MButton variant="filled">Filled</MButton>
      <MButton variant="tonal">Tonal</MButton>
      <MButton variant="elevated">Elevated</MButton>
      <MButton variant="outlined">Outlined</MButton>
      <MButton variant="text">Text</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="With Icons"
      description="Buttons with a leading Material Symbol icon."
      :code="`<template>
  <MButton icon=&quot;add&quot;>Create</MButton>
  <MButton variant=&quot;tonal&quot; icon=&quot;edit&quot;>Edit</MButton>
  <MButton variant=&quot;outlined&quot; icon=&quot;delete&quot;>Delete</MButton>
</template>`"
    >
      <MButton icon="add">Create</MButton>
      <MButton variant="tonal" icon="edit">Edit</MButton>
      <MButton variant="outlined" icon="delete">Delete</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="Error Color"
      description="Use color='error' for destructive actions."
      :code="`<template>
  <MButton color=&quot;error&quot;>Delete</MButton>
  <MButton color=&quot;error&quot; variant=&quot;tonal&quot;>Remove</MButton>
  <MButton color=&quot;error&quot; variant=&quot;outlined&quot;>Cancel</MButton>
  <MButton color=&quot;error&quot; variant=&quot;text&quot;>Discard</MButton>
</template>`"
    >
      <MButton color="error">Delete</MButton>
      <MButton color="error" variant="tonal">Remove</MButton>
      <MButton color="error" variant="outlined">Cancel</MButton>
      <MButton color="error" variant="text">Discard</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Colors"
      description="Pass any CSS color string to override the button's primary color."
      :code="`<template>
  <MButton color=&quot;#e91e63&quot;>Pink</MButton>
  <MButton color=&quot;#ff9800&quot; variant=&quot;tonal&quot;>Orange</MButton>
  <MButton color=&quot;teal&quot; variant=&quot;elevated&quot;>Teal</MButton>
</template>`"
    >
      <MButton color="#e91e63">Pink</MButton>
      <MButton color="#ff9800" variant="tonal">Orange</MButton>
      <MButton color="teal" variant="elevated">Teal</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="States"
      description="Loading and disabled states."
      :code="`<template>
  <MButton :loading=&quot;true&quot;>Saving...</MButton>
  <MButton :disabled=&quot;true&quot;>Disabled</MButton>
  <MButton variant=&quot;outlined&quot; :disabled=&quot;true&quot;>Disabled</MButton>
</template>`"
    >
      <MButton :loading="true">Saving...</MButton>
      <MButton :disabled="true">Disabled</MButton>
      <MButton variant="outlined" :disabled="true">Disabled</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="Five sizes following M3 spec. Default is sm (40px)."
      :code="`<MButton size=&quot;xs&quot;>Extra Small</MButton>
<MButton size=&quot;sm&quot;>Small</MButton>
<MButton size=&quot;md&quot;>Medium</MButton>
<MButton size=&quot;lg&quot;>Large</MButton>
<MButton size=&quot;xl&quot;>Extra Large</MButton>`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MButton size="xs" icon="add">Extra Small</MButton>
        <MButton size="sm" icon="add">Small</MButton>
        <MButton size="md" icon="add">Medium</MButton>
        <MButton size="lg" icon="add">Large</MButton>
        <MButton size="xl" icon="add">Extra Large</MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Shape"
      description="Rounded (pill, default) or squared shape — the squared corner radius scales with size (12px xs/sm, 16px md, 28px lg/xl), matching each M3 size tier's own ContainerShapeSquare token."
      :code="`<MButton shape=&quot;rounded&quot;>Rounded</MButton>
<MButton shape=&quot;squared&quot;>Squared</MButton>`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MButton shape="rounded" icon="add">Rounded</MButton>
        <MButton shape="squared" icon="add">Squared</MButton>
        <MButton shape="rounded" variant="outlined" icon="edit">Rounded</MButton>
        <MButton shape="squared" variant="outlined" icon="edit">Squared</MButton>
        <MButton shape="rounded" variant="tonal" icon="star">Rounded</MButton>
        <MButton shape="squared" variant="tonal" icon="star">Squared</MButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="buttonProps" />

    <!-- ── MIconButton ──────────────────────────────────────────────────── -->
    <h2 id="miconbutton" class="mb-4 mt-14 text-headline-small font-medium">MIconButton</h2>

    <ComponentDemo
      title="Variants"
      description="Four icon button styles."
      :code="`<template>
  <MIconButton icon=&quot;settings&quot; label=&quot;Settings&quot; variant=&quot;standard&quot; />
  <MIconButton icon=&quot;settings&quot; label=&quot;Settings&quot; variant=&quot;filled&quot; />
  <MIconButton icon=&quot;settings&quot; label=&quot;Settings&quot; variant=&quot;tonal&quot; />
  <MIconButton icon=&quot;settings&quot; label=&quot;Settings&quot; variant=&quot;outlined&quot; />
</template>`"
    >
      <MIconButton icon="settings" label="Settings" variant="standard" />
      <MIconButton icon="settings" label="Settings" variant="filled" />
      <MIconButton icon="settings" label="Settings" variant="tonal" />
      <MIconButton icon="settings" label="Settings" variant="outlined" />
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="Five preset sizes or a custom pixel value."
      :code="`<MIconButton icon=&quot;favorite&quot; size=&quot;xs&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;favorite&quot; size=&quot;sm&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;favorite&quot; size=&quot;md&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;favorite&quot; size=&quot;lg&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;favorite&quot; size=&quot;xl&quot; variant=&quot;tonal&quot; />`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MIconButton icon="favorite" label="XS" size="xs" variant="tonal" />
        <MIconButton icon="favorite" label="SM" size="sm" variant="tonal" />
        <MIconButton icon="favorite" label="MD" size="md" variant="tonal" />
        <MIconButton icon="favorite" label="LG" size="lg" variant="tonal" />
        <MIconButton icon="favorite" label="XL" size="xl" variant="tonal" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Shape"
      description="Rounded (default) or squared."
      :code="`<MIconButton icon=&quot;settings&quot; shape=&quot;rounded&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;settings&quot; shape=&quot;squared&quot; variant=&quot;tonal&quot; />`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MIconButton icon="settings" label="Rounded" shape="rounded" variant="filled" />
        <MIconButton icon="settings" label="Squared" shape="squared" variant="filled" />
        <MIconButton icon="settings" label="Rounded" shape="rounded" variant="tonal" />
        <MIconButton icon="settings" label="Squared" shape="squared" variant="tonal" />
        <MIconButton icon="settings" label="Rounded" shape="rounded" variant="outlined" />
        <MIconButton icon="settings" label="Squared" shape="squared" variant="outlined" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="iconButtonProps" />

    <!-- ── MFab ─────────────────────────────────────────────────────────── -->
    <h2 id="mfab" class="mb-4 mt-14 text-headline-small font-medium">MFab</h2>

    <ComponentDemo
      title="Sizes"
      description="Small, regular, and large floating action buttons."
      :code="`<template>
  <MFab icon=&quot;add&quot; size=&quot;small&quot; />
  <MFab icon=&quot;add&quot; size=&quot;regular&quot; />
  <MFab icon=&quot;add&quot; size=&quot;large&quot; />
</template>`"
    >
      <MFab icon="add" size="small" />
      <MFab icon="add" size="regular" />
      <MFab icon="add" size="large" />
    </ComponentDemo>

    <ComponentDemo
      title="Colors"
      description="Four color schemes for the FAB."
      :code="`<template>
  <MFab icon=&quot;edit&quot; color=&quot;primary&quot; />
  <MFab icon=&quot;edit&quot; color=&quot;secondary&quot; />
  <MFab icon=&quot;edit&quot; color=&quot;tertiary&quot; />
  <MFab icon=&quot;edit&quot; color=&quot;surface&quot; />
</template>`"
    >
      <MFab icon="edit" color="primary" />
      <MFab icon="edit" color="secondary" />
      <MFab icon="edit" color="tertiary" />
      <MFab icon="edit" color="surface" />
    </ComponentDemo>

    <ComponentDemo
      title="Extended FAB"
      description="FAB with a text label for more context."
      :code="`<template>
  <MFab icon=&quot;add&quot; label=&quot;New item&quot; />
  <MFab icon=&quot;edit&quot; label=&quot;Compose&quot; color=&quot;tertiary&quot; />
</template>`"
    >
      <MFab icon="add" label="New item" />
      <MFab icon="edit" label="Compose" color="tertiary" />
    </ComponentDemo>

    <ComponentDemo
      title="Speed Dial"
      description="Pass an items array to turn the FAB into a speed dial. Each item needs an icon and optionally a label and onClick handler."
      :code="`<template>
  <MFab icon=&quot;add&quot; :items=&quot;items&quot; direction=&quot;up&quot; />
</template>`"
      :script="`const items = [
  { icon: 'image', label: 'Photo', onClick: () => {} },
  { icon: 'videocam', label: 'Video', onClick: () => {} },
  { icon: 'mic', label: 'Audio', onClick: () => {} },
]`"
    >
      <div class="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <MCard v-for="dir in (['up', 'down', 'left', 'right', 'radial'] as const)" :key="dir" class="flex flex-col items-center overflow-visible p-0">
          <p class="w-full border-b border-outline-variant px-4 py-2 text-center text-label-large font-medium text-on-surface-variant">
            {{ dir }}
          </p>
          <div class="flex h-40 items-center justify-center">
            <MFab icon="add" :items="dialItems" :direction="dir" size="small" />
          </div>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Persistent Speed Dial"
      description="With persistent, the speed dial stays open after clicking an item or clicking outside. The user must click the FAB again to close it."
      :code="`<template>
  <MFab icon=&quot;add&quot; :items=&quot;items&quot; :persistent=&quot;true&quot; />
</template>`"
    >
      <div class="flex h-52 w-full items-center justify-center">
        <MFab icon="add" :items="dialItems" :persistent="true" size="small" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Content"
      description="Use the content slot to show any custom content when the FAB expands. The slot receives a close function. Supports all directions."
      :code="`<MFab icon=&quot;add&quot;>
  <template #content=&quot;{ close }&quot;>
    <div class=&quot;rounded-2xl bg-surface-container-high shadow-elevation-3&quot;>
      <button @click=&quot;close()&quot;>New file</button>
      <button @click=&quot;close()&quot;>New folder</button>
    </div>
  </template>
</MFab>`"
    >
      <div class="grid w-full grid-cols-2 gap-6 sm:grid-cols-4">
        <MCard v-for="dir in (['up', 'down', 'left', 'right'] as const)" :key="dir" class="flex flex-col items-center overflow-visible p-0">
          <p class="w-full border-b border-outline-variant px-4 py-2 text-center text-label-large font-medium text-on-surface-variant">
            {{ dir }}
          </p>
          <div class="flex h-52 items-center justify-center">
            <MFab icon="add" :direction="dir" size="small">
              <template #content="{ close }">
                <div class="flex w-44 flex-col overflow-hidden rounded-2xl bg-surface-container-high py-2 shadow-elevation-3">
                  <button
                    v-for="item in ['New file', 'New folder', 'Upload']"
                    :key="item"
                    type="button"
                    class="cursor-pointer px-4 py-2.5 text-left text-body-medium text-on-surface transition-colors hover:bg-on-surface/8"
                    @click="close()"
                  >
                    {{ item }}
                  </button>
                </div>
              </template>
            </MFab>
          </div>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Map Layer Switcher"
      description="Example: a FAB that expands to show circular map layer toggles. The active layer gets a colored border. Content is fully custom — no wrapper styles imposed."
      :code="`<MFab icon=&quot;layers&quot; direction=&quot;right&quot; color=&quot;surface&quot;>
  <template #content>
    <div class=&quot;flex gap-3&quot;>
      <button v-for=&quot;layer in layers&quot; @click=&quot;active = layer.id&quot;>
        <img :src=&quot;layer.img&quot; class=&quot;rounded-full&quot; />
      </button>
    </div>
  </template>
</MFab>`"
    >
      <div class="flex w-full flex-col gap-6">
        <!-- Single select -->
        <div>
          <div class="flex h-16 items-center pl-8">
            <MFab icon="layers" direction="right" color="surface" size="small">
              <template #content>
                <div class="ml-3 flex items-center gap-3">
                  <button
                    v-for="layer in mapLayers"
                    :key="layer.id"
                    type="button"
                    class="h-10 w-10 cursor-pointer overflow-hidden rounded-full ring-2 transition-all duration-200"
                    :class="activeLayer === layer.id ? 'ring-primary scale-110' : 'ring-outline-variant hover:ring-on-surface'"
                    :title="layer.label"
                    @click="activeLayer = layer.id"
                  >
                    <img :src="layer.img" :alt="layer.label" class="h-full w-full object-cover" />
                  </button>
                </div>
              </template>
            </MFab>
          </div>
          <p class="mt-2 pl-8 text-body-small text-on-surface-variant">
            Base layer: <strong class="text-on-surface">{{ mapLayers.find(l => l.id === activeLayer)?.label }}</strong>
          </p>
        </div>

        <!-- Multi select -->
        <div>
          <div class="flex h-16 items-center pl-8">
            <MFab icon="stacks" direction="right" color="surface" size="small" :persistent="true">
              <template #content>
                <div class="ml-3 flex items-center gap-3">
                  <button
                    v-for="layer in mapLayers"
                    :key="layer.id"
                    type="button"
                    class="h-10 w-10 cursor-pointer overflow-hidden rounded-full ring-2 transition-all duration-200"
                    :class="activeLayers.includes(layer.id) ? 'ring-primary scale-110' : 'ring-outline-variant hover:ring-on-surface opacity-60'"
                    :title="layer.label"
                    @click="toggleLayer(layer.id)"
                  >
                    <img :src="layer.img" :alt="layer.label" class="h-full w-full object-cover" />
                  </button>
                </div>
              </template>
            </MFab>
          </div>
          <p class="mt-2 pl-8 text-body-small text-on-surface-variant">
            Overlays: <strong class="text-on-surface">{{ activeLayers.map(id => mapLayers.find(l => l.id === id)?.label).join(', ') || 'None' }}</strong>
          </p>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="fabProps" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">SpeedDialItem interface</p>
      <pre class="rounded-lg bg-surface-container p-3 text-body-small"><code>interface SpeedDialItem {
  icon: string                    // Material Symbol name
  label?: string                  // Tooltip label (shown for up/down directions)
  to?: string | Record&lt;string, any&gt;  // Vue Router destination (renders as RouterLink)
  onClick?: () => void
}</code></pre>
    </MCard>

    <!-- ── MFabMenu ─────────────────────────────────────────────────────── -->
    <h2 id="mfabmenu" class="mb-4 mt-14 text-headline-small font-medium">MFabMenu</h2>
    <p class="mb-6 text-body-medium text-on-surface-variant">
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
      title="Extended trigger"
      description="Pass label to show the trigger as an extended FAB (icon + text) instead of icon-only — same as MFab's own label prop."
      :code="`<template>
  <MFabMenu icon=&quot;add&quot; label=&quot;New&quot; :items=&quot;items&quot; />
</template>`"
    >
      <div class="flex h-64 w-full items-end justify-end">
        <MFabMenu icon="add" label="New" :items="fabMenuItems" />
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

    <!-- ── MSplitButton ──────────────────────────────────────────────────── -->
    <h2 id="msplitbutton" class="mb-4 mt-14 text-headline-small font-medium">MSplitButton</h2>

    <ComponentDemo
      title="Split Button"
      description="A button split into a main action and a dropdown toggle. Click the main part for the primary action, the arrow for alternatives."
      :code="`<MSplitButton
  label=&quot;Send&quot;
  icon=&quot;send&quot;
  :items=&quot;[
    { label: 'Schedule send', icon: 'schedule_send' },
    { label: 'Save draft', icon: 'drafts' },
  ]&quot;
  @click=&quot;send()&quot;
/>`"
    >
      <div class="flex flex-wrap items-center gap-4">
        <MSplitButton label="Send" icon="send" variant="filled" :items="splitItems" />
        <MSplitButton label="Save" icon="save" variant="tonal" :items="splitItems" />
        <MSplitButton label="Export" icon="download" variant="outlined" :items="splitItems" />
        <MSplitButton label="Share" icon="share" variant="elevated" :items="splitItems" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Colors"
      description="Available in primary, secondary, and tertiary color schemes."
      :code="`<MSplitButton label=&quot;Send&quot; color=&quot;primary&quot; :items=&quot;items&quot; />
<MSplitButton label=&quot;Send&quot; color=&quot;secondary&quot; :items=&quot;items&quot; />
<MSplitButton label=&quot;Send&quot; color=&quot;tertiary&quot; :items=&quot;items&quot; />`"
    >
      <div class="flex flex-wrap items-center gap-4">
        <MSplitButton label="Primary" icon="send" color="primary" :items="splitItems" />
        <MSplitButton label="Secondary" icon="send" color="secondary" :items="splitItems" />
        <MSplitButton label="Tertiary" icon="send" color="tertiary" :items="splitItems" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Menu"
      description="Use the menu slot for fully custom dropdown content instead of items."
      :code="`<MSplitButton label=&quot;Actions&quot; icon=&quot;bolt&quot;>
  <template #menu=&quot;{ close }&quot;>
    <div class=&quot;rounded-xl bg-surface-container p-4&quot;>
      <p>Custom content here</p>
      <button @click=&quot;close()&quot;>Close</button>
    </div>
  </template>
</MSplitButton>`"
    >
      <div class="flex flex-wrap items-center gap-4">
        <MSplitButton label="Actions" icon="bolt" variant="tonal">
          <template #menu="{ close }">
            <div class="w-56 overflow-hidden rounded-xl bg-surface-container py-2 shadow-elevation-2">
              <button
                v-for="item in ['Copy link', 'Duplicate', 'Move to folder', 'Archive']"
                :key="item"
                type="button"
                class="flex w-full cursor-pointer items-center px-4 py-2.5 text-left text-body-medium text-on-surface transition-colors hover:bg-on-surface/8"
                @click="close()"
              >
                {{ item }}
              </button>
            </div>
          </template>
        </MSplitButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="Five sizes matching MButton."
      :code="`<MSplitButton label=&quot;Send&quot; size=&quot;xs&quot; :items=&quot;items&quot; />
<MSplitButton label=&quot;Send&quot; size=&quot;sm&quot; :items=&quot;items&quot; />
<MSplitButton label=&quot;Send&quot; size=&quot;md&quot; :items=&quot;items&quot; />
<MSplitButton label=&quot;Send&quot; size=&quot;lg&quot; :items=&quot;items&quot; />
<MSplitButton label=&quot;Send&quot; size=&quot;xl&quot; :items=&quot;items&quot; />`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MSplitButton label="XS" icon="send" size="xs" :items="splitItems" />
        <MSplitButton label="SM" icon="send" size="sm" :items="splitItems" />
        <MSplitButton label="MD" icon="send" size="md" :items="splitItems" />
        <MSplitButton label="LG" icon="send" size="lg" :items="splitItems" />
        <MSplitButton label="XL" icon="send" size="xl" :items="splitItems" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="splitButtonProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="splitButtonSlots" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">SplitButtonItem interface</p>
      <pre class="rounded-lg bg-surface-container p-3 text-body-small"><code>interface SplitButtonItem {
  label: string                    // Menu item text
  icon?: string                    // Material Symbol icon name
  disabled?: boolean               // Disables the item
  onClick?: () => void             // Callback when clicked
}</code></pre>
    </MCard>

    <!-- ── MButtonGroup ──────────────────────────────────────────────────── -->
    <h2 id="mbuttongroup" class="mb-4 mt-14 text-headline-small font-medium">MButtonGroup</h2>

    <ComponentDemo
      title="Variants"
      description="Standard (separated with gaps) and connected (joined, replaces segmented button). Shape morphs on selection."
      :code="`<MButtonGroup v-model=&quot;val&quot; :options=&quot;options&quot; variant=&quot;standard&quot; />
<MButtonGroup v-model=&quot;val&quot; :options=&quot;options&quot; variant=&quot;connected&quot; />`"
    >
      <div class="flex flex-col gap-4">
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Standard</p>
          <MButtonGroup v-model="bgSingle" :options="bgOptions" variant="standard" />
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Connected</p>
          <MButtonGroup v-model="bgSingle" :options="bgOptions" variant="connected" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Multi Select"
      description="Allow multiple selections. With selection-required, at least one must remain selected."
      :code="`<MButtonGroup v-model=&quot;val&quot; :options=&quot;options&quot; :multi-select=&quot;true&quot; />`"
    >
      <div class="flex flex-col gap-4">
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Multi select (standard)</p>
          <MButtonGroup v-model="bgMulti" :options="bgFormatOptions" :multi-select="true" variant="standard" />
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Multi select (connected, selection required)</p>
          <MButtonGroup v-model="bgMulti" :options="bgFormatOptions" :multi-select="true" :selection-required="true" variant="connected" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="All five sizes, shown in connected variant."
      :code="`<MButtonGroup v-model=&quot;val&quot; :options=&quot;options&quot; size=&quot;xs&quot; variant=&quot;connected&quot; />`"
    >
      <div class="flex flex-col gap-3">
        <div v-for="sz in (['xs', 'sm', 'md', 'lg', 'xl'] as const)" :key="sz" class="flex items-center gap-4">
          <span class="w-8 text-label-medium text-on-surface-variant">{{ sz }}</span>
          <MButtonGroup v-model="bgSingle" :options="bgOptions" :size="sz" variant="connected" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Colors"
      description="Primary, secondary, and tertiary."
      :code="`<MButtonGroup v-model=&quot;val&quot; :options=&quot;options&quot; color=&quot;primary&quot; />`"
    >
      <div class="flex flex-wrap gap-4">
        <MButtonGroup v-model="bgSingle" :options="bgOptions" color="primary" variant="connected" />
        <MButtonGroup v-model="bgSingle" :options="bgOptions" color="secondary" variant="connected" />
        <MButtonGroup v-model="bgSingle" :options="bgOptions" color="tertiary" variant="connected" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Icon Only"
      description="Options with only icons, no labels."
      :code="`<MButtonGroup v-model=&quot;val&quot; :options=&quot;iconOptions&quot; />`"
    >
      <div class="flex flex-wrap gap-4">
        <MButtonGroup v-model="bgMulti" :options="bgFormatOptions" :multi-select="true" variant="standard" />
        <MButtonGroup v-model="bgMulti" :options="bgFormatOptions" :multi-select="true" variant="connected" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Object Values"
      description="Values can be any type — objects, arrays, etc. Comparison uses deep equality (JSON.stringify)."
      :code="`<script setup>
const selected = ref({ level: 'medium', color: '#f59e0b' })
const options = [
  { value: { level: 'low', color: '#22c55e' }, label: 'Low' },
  { value: { level: 'medium', color: '#f59e0b' }, label: 'Medium' },
  { value: { level: 'high', color: '#ef4444' }, label: 'High' },
]
</script>

<MButtonGroup v-model=&quot;selected&quot; :options=&quot;options&quot; variant=&quot;connected&quot; />`"
    >
      <div class="flex flex-col gap-3">
        <MButtonGroup v-model="selectedPriority" :options="priorityOptions" variant="connected" :selection-required="true" />
        <div class="flex items-center gap-3 rounded-lg bg-surface-container-lowest px-4 py-3">
          <span
            v-if="selectedPriority"
            class="h-3 w-3 rounded-full"
            :style="{ backgroundColor: (selectedPriority as any).color }"
          />
          <span class="text-body-medium text-on-surface">
            Priority: <strong>{{ (selectedPriority as any)?.level ?? 'none' }}</strong>
          </span>
          <span class="text-body-small text-on-surface-variant">
            (value is an object: {{ JSON.stringify(selectedPriority) }})
          </span>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="buttonGroupProps" />

    <ComponentDemo
      title="Practical Example"
      description="A file manager toolbar using button groups for view mode, sort order, and file type filters — driven entirely by v-model."
      :code="`<script setup>
const viewMode = ref('grid')
const sortBy = ref('name')
const fileFilters = ref(['images'])
</script>

<template>
  <MButtonGroup v-model=&quot;viewMode&quot; :options=&quot;viewOptions&quot; variant=&quot;connected&quot; :selection-required=&quot;true&quot; />
  <MButtonGroup v-model=&quot;sortBy&quot; :options=&quot;sortOptions&quot; variant=&quot;connected&quot; :selection-required=&quot;true&quot; />
  <MButtonGroup v-model=&quot;fileFilters&quot; :options=&quot;filterOptions&quot; :multi-select=&quot;true&quot; />
</template>`"
    >
      <div class="w-full rounded-xl bg-surface-container p-5">
        <div class="mb-5 flex flex-wrap items-center gap-4">
          <div class="flex flex-col gap-1.5">
            <span class="text-label-small text-on-surface-variant">View</span>
            <MButtonGroup
              v-model="viewMode"
              :options="[
                { value: 'list', icon: 'view_list' },
                { value: 'grid', icon: 'grid_view' },
                { value: 'columns', icon: 'view_column' },
              ]"
              variant="connected"
              :selection-required="true"
              size="xs"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="text-label-small text-on-surface-variant">Sort by</span>
            <MButtonGroup
              v-model="sortBy"
              :options="[
                { value: 'name', label: 'Name' },
                { value: 'date', label: 'Date' },
                { value: 'size', label: 'Size' },
                { value: 'type', label: 'Type' },
              ]"
              variant="connected"
              :selection-required="true"
              size="xs"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="text-label-small text-on-surface-variant">Show</span>
            <MButtonGroup
              v-model="fileFilters"
              :options="[
                { value: 'images', label: 'Images', icon: 'image' },
                { value: 'docs', label: 'Docs', icon: 'description' },
                { value: 'videos', label: 'Videos', icon: 'movie' },
              ]"
              :multi-select="true"
              size="xs"
            />
          </div>
        </div>

        <div class="rounded-lg bg-surface-container-lowest p-4">
          <div class="flex items-center gap-2 text-body-small text-on-surface-variant">
            <MIcon :name="viewMode === 'list' ? 'view_list' : viewMode === 'grid' ? 'grid_view' : 'view_column'" :size="16" />
            <span>{{ viewMode }} view</span>
            <span class="text-outline">·</span>
            <span>sorted by {{ sortBy }}</span>
            <span class="text-outline">·</span>
            <span>showing: {{ (fileFilters as string[]).join(', ') || 'all' }}</span>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">ButtonGroupOption interface</p>
      <pre class="rounded-lg bg-surface-container p-3 text-body-small"><code>interface ButtonGroupOption {
  value: unknown          // Any type — deep equality via JSON.stringify
  label?: string          // Button text
  icon?: string           // Material Symbol icon name
  disabled?: boolean
}</code></pre>
    </MCard>

    <!-- ── MSegmentedButton ─────────────────────────────────────────────── -->
    <h2 id="msegmentedbutton" class="mb-4 mt-14 text-headline-small font-medium">MSegmentedButton</h2>

    <ComponentDemo
      title="Single Select"
      description="Only one segment can be active at a time."
      :code="`<template>
  <MSegmentedButton
    v-model=&quot;value&quot;
    :options=&quot;[
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ]&quot;
  />
</template>`"
    >
      <MSegmentedButton
        v-model="segmentedValue"
        :options="[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ]"
      />
      <span class="text-body-medium text-on-surface-variant">Selected: {{ segmentedValue }}</span>
    </ComponentDemo>

    <ComponentDemo
      title="Multi Select"
      description="Multiple segments can be active simultaneously."
      :code="`<template>
  <MSegmentedButton
    v-model=&quot;values&quot;
    :options=&quot;[
      { value: 'bold', label: 'Bold', icon: 'format_bold' },
      { value: 'italic', label: 'Italic', icon: 'format_italic' },
      { value: 'underline', label: 'Underline', icon: 'format_underlined' },
    ]&quot;
    :multi-select=&quot;true&quot;
  />
</template>`"
    >
      <MSegmentedButton
        v-model="segmentedMulti"
        :options="[
          { value: 'bold', label: 'Bold', icon: 'format_bold' },
          { value: 'italic', label: 'Italic', icon: 'format_italic' },
          { value: 'underline', label: 'Underline', icon: 'format_underlined' },
        ]"
        :multi-select="true"
      />
      <span class="text-body-medium text-on-surface-variant">Selected: {{ segmentedMulti.join(', ') }}</span>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="segmentedProps" />

    <!-- ── MCopyButton ──────────────────────────────────────────────────── -->
    <h2 id="mcopybutton" class="mb-4 mt-14 text-headline-small font-medium">MCopyButton</h2>

    <ComponentDemo
      title="Copy to clipboard"
      description="Wraps MIconButton and swaps to a checkmark for resetDelay ms after a successful copy. Emits copied with the copied value, or error if the browser refuses the clipboard write."
      :code="`<MCopyButton value=&quot;npm install @m3ui-vue/m3ui-vue&quot; label=&quot;Copy install command&quot; />
<MCopyButton value=&quot;npm install @m3ui-vue/m3ui-vue&quot; variant=&quot;tonal&quot; @copied=&quot;onCopied&quot; />`"
      :script="`function onCopied(value: string) {
  toast.success('Copied: ' + value)
}`"
    >
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 rounded-lg bg-surface-container-high px-3 py-2">
          <code class="text-body-medium text-on-surface-variant">npm install @m3ui-vue/m3ui-vue</code>
          <MCopyButton value="npm install @m3ui-vue/m3ui-vue" label="Copy install command" />
        </div>
        <MCopyButton value="npm install @m3ui-vue/m3ui-vue" variant="tonal" @copied="onCopyButtonCopied" />
        <span class="text-body-medium text-on-surface-variant">{{ copyButtonLog }}</span>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="copyButtonProps" />

    <!-- ── MExportButton ────────────────────────────────────────────────── -->
    <h2 id="mexportbutton" class="mb-4 mt-14 text-headline-small font-medium">MExportButton</h2>

    <ComponentDemo
      title="Export to CSV / JSON"
      description="Serializes the data prop and triggers a real browser download — no dependencies. CSV fields are escaped (commas, quotes, newlines). Emits exported with the format/filename, or error."
      :code="`<MExportButton :data=&quot;rows&quot; filename=&quot;users&quot; />
<MExportButton :data=&quot;rows&quot; filename=&quot;users&quot; format=&quot;json&quot; variant=&quot;tonal&quot;>Export JSON</MExportButton>`"
      :script="`const rows = [
  { name: 'Ada Lovelace', role: 'Engineer' },
  { name: 'Grace Hopper', role: 'Admiral' },
]`"
    >
      <div class="flex items-center gap-4">
        <MExportButton :data="exportRows" filename="users" @exported="onExported" />
        <MExportButton :data="exportRows" filename="users" format="json" variant="tonal">Export JSON</MExportButton>
        <span class="text-body-medium text-on-surface-variant">{{ exportLog }}</span>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="exportButtonProps" />

    <p class="mt-3 text-body-medium text-on-surface-variant">
      <strong>Slot:</strong> <code>default</code> — replaces the label text prop.
    </p>
  </div>
</template>
