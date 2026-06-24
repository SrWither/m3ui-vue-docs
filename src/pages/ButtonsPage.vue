<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MIconButton, MFab, MSplitButton, MButtonGroup, MSegmentedButton, MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'

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
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'Button size (xs: 32px, sm: 40px, md: 48px, lg: 56px, xl: 64px)' },
  { name: 'shape', type: "'rounded' | 'squared'", default: "'rounded'", description: 'Button shape — rounded (pill) or squared (rounded-md)' },
  { name: 'to', type: 'string | RouteLocationRaw', description: 'Vue Router destination — renders as RouterLink instead of button' },
]

const iconButtonProps: PropDef[] = [
  { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'label', type: 'string', description: 'Accessible label (aria-label and title)' },
  { name: 'variant', type: "'standard' | 'filled' | 'tonal' | 'outlined'", default: "'standard'", description: 'Visual style' },
  { name: 'shape', type: "'rounded' | 'squared'", default: "'rounded'", description: 'Button shape — rounded or squared (rounded-md)' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'sm'", description: 'Preset size or custom pixel value (xs:32, sm:40, md:48, lg:56, xl:64)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'to', type: 'string | RouteLocationRaw', description: 'Vue Router destination — renders as RouterLink instead of button' },
]

const fabProps: PropDef[] = [
  { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'label', type: 'string', description: 'Extended FAB label text' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'surface'", default: "'primary'", description: 'Color scheme' },
  { name: 'size', type: "'small' | 'regular' | 'large'", default: "'regular'", description: 'FAB size' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'items', type: 'SpeedDialItem[]', description: 'Speed-dial child items (see interface below)' },
  { name: 'direction', type: "'up' | 'down' | 'left' | 'right' | 'radial'", default: "'up'", description: 'Speed-dial expand direction' },
  { name: 'to', type: 'string | RouteLocationRaw', description: 'Vue Router destination — renders as RouterLink instead of button' },
  { name: 'persistent', type: 'boolean', default: 'false', description: 'Keep speed-dial open after clicking an item or clicking outside' },
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
  { name: '#menu', type: 'slot', description: 'Custom dropdown content. Receives { close } to dismiss. Used instead of items.' },
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
      description="Rounded (pill, default) or squared (rounded-lg) shape."
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
  </div>
</template>
