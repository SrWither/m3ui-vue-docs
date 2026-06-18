<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MIconButton, MFab, MSegmentedButton, MCard } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const segmentedValue = ref('day')
const segmentedMulti = ref<string[]>(['bold'])

const dialItems = [
  { icon: 'image', label: 'Photo', onClick: () => {} },
  { icon: 'videocam', label: 'Video', onClick: () => {} },
  { icon: 'mic', label: 'Audio', onClick: () => {} },
]

const buttonProps: PropDef[] = [
  { name: 'variant', type: "'filled' | 'tonal' | 'outlined' | 'text' | 'elevated'", default: "'filled'", description: 'Visual style of the button' },
  { name: 'color', type: "'primary' | 'error' | CSS color", default: "'primary'", description: 'Semantic color or any CSS color string' },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'HTML button type' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner and disables the button' },
  { name: 'icon', type: 'string', description: 'Material Symbol icon name shown before the label' },
]

const iconButtonProps: PropDef[] = [
  { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'label', type: 'string', description: 'Accessible label (aria-label and title)' },
  { name: 'variant', type: "'standard' | 'filled' | 'tonal' | 'outlined'", default: "'standard'", description: 'Visual style' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'size', type: 'number', default: '40', description: 'Button size in pixels' },
]

const fabProps: PropDef[] = [
  { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'label', type: 'string', description: 'Extended FAB label text' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'surface'", default: "'primary'", description: 'Color scheme' },
  { name: 'size', type: "'small' | 'regular' | 'large'", default: "'regular'", description: 'FAB size' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'items', type: 'SpeedDialItem[]', description: 'Speed-dial child items: { icon: string, label?: string, onClick?: () => void }' },
  { name: 'direction', type: "'up' | 'down' | 'left' | 'right' | 'radial'", default: "'up'", description: 'Speed-dial expand direction' },
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
    <h2 class="mb-4 text-headline-small font-medium">MButton</h2>

    <ComponentDemo
      title="Variants"
      description="Five button variants following the M3 specification."
      :code="`<MButton variant=&quot;filled&quot;>Filled</MButton>
<MButton variant=&quot;tonal&quot;>Tonal</MButton>
<MButton variant=&quot;elevated&quot;>Elevated</MButton>
<MButton variant=&quot;outlined&quot;>Outlined</MButton>
<MButton variant=&quot;text&quot;>Text</MButton>`"
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
      :code="`<MButton icon=&quot;add&quot;>Create</MButton>
<MButton variant=&quot;tonal&quot; icon=&quot;edit&quot;>Edit</MButton>
<MButton variant=&quot;outlined&quot; icon=&quot;delete&quot;>Delete</MButton>`"
    >
      <MButton icon="add">Create</MButton>
      <MButton variant="tonal" icon="edit">Edit</MButton>
      <MButton variant="outlined" icon="delete">Delete</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="Error Color"
      description="Use color='error' for destructive actions."
      :code="`<MButton color=&quot;error&quot;>Delete</MButton>
<MButton color=&quot;error&quot; variant=&quot;tonal&quot;>Remove</MButton>
<MButton color=&quot;error&quot; variant=&quot;outlined&quot;>Cancel</MButton>
<MButton color=&quot;error&quot; variant=&quot;text&quot;>Discard</MButton>`"
    >
      <MButton color="error">Delete</MButton>
      <MButton color="error" variant="tonal">Remove</MButton>
      <MButton color="error" variant="outlined">Cancel</MButton>
      <MButton color="error" variant="text">Discard</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Colors"
      description="Pass any CSS color string to override the button's primary color."
      :code="`<MButton color=&quot;#e91e63&quot;>Pink</MButton>
<MButton color=&quot;#ff9800&quot; variant=&quot;tonal&quot;>Orange</MButton>
<MButton color=&quot;teal&quot; variant=&quot;elevated&quot;>Teal</MButton>`"
    >
      <MButton color="#e91e63">Pink</MButton>
      <MButton color="#ff9800" variant="tonal">Orange</MButton>
      <MButton color="teal" variant="elevated">Teal</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="States"
      description="Loading and disabled states."
      :code="`<MButton :loading=&quot;true&quot;>Saving...</MButton>
<MButton :disabled=&quot;true&quot;>Disabled</MButton>
<MButton variant=&quot;outlined&quot; :disabled=&quot;true&quot;>Disabled</MButton>`"
    >
      <MButton :loading="true">Saving...</MButton>
      <MButton :disabled="true">Disabled</MButton>
      <MButton variant="outlined" :disabled="true">Disabled</MButton>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="buttonProps" />

    <!-- ── MIconButton ──────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MIconButton</h2>

    <ComponentDemo
      title="Variants"
      description="Four icon button styles."
      :code="`<MIconButton icon=&quot;settings&quot; label=&quot;Settings&quot; variant=&quot;standard&quot; />
<MIconButton icon=&quot;settings&quot; label=&quot;Settings&quot; variant=&quot;filled&quot; />
<MIconButton icon=&quot;settings&quot; label=&quot;Settings&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;settings&quot; label=&quot;Settings&quot; variant=&quot;outlined&quot; />`"
    >
      <MIconButton icon="settings" label="Settings" variant="standard" />
      <MIconButton icon="settings" label="Settings" variant="filled" />
      <MIconButton icon="settings" label="Settings" variant="tonal" />
      <MIconButton icon="settings" label="Settings" variant="outlined" />
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="Custom sizes via the size prop."
      :code="`<MIconButton icon=&quot;favorite&quot; label=&quot;Small&quot; :size=&quot;32&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;favorite&quot; label=&quot;Default&quot; :size=&quot;40&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;favorite&quot; label=&quot;Large&quot; :size=&quot;48&quot; variant=&quot;tonal&quot; />`"
    >
      <MIconButton icon="favorite" label="Small" :size="32" variant="tonal" />
      <MIconButton icon="favorite" label="Default" :size="40" variant="tonal" />
      <MIconButton icon="favorite" label="Large" :size="48" variant="tonal" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="iconButtonProps" />

    <!-- ── MFab ─────────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MFab</h2>

    <ComponentDemo
      title="Sizes"
      description="Small, regular, and large floating action buttons."
      :code="`<MFab icon=&quot;add&quot; size=&quot;small&quot; />
<MFab icon=&quot;add&quot; size=&quot;regular&quot; />
<MFab icon=&quot;add&quot; size=&quot;large&quot; />`"
    >
      <MFab icon="add" size="small" />
      <MFab icon="add" size="regular" />
      <MFab icon="add" size="large" />
    </ComponentDemo>

    <ComponentDemo
      title="Colors"
      description="Four color schemes for the FAB."
      :code="`<MFab icon=&quot;edit&quot; color=&quot;primary&quot; />
<MFab icon=&quot;edit&quot; color=&quot;secondary&quot; />
<MFab icon=&quot;edit&quot; color=&quot;tertiary&quot; />
<MFab icon=&quot;edit&quot; color=&quot;surface&quot; />`"
    >
      <MFab icon="edit" color="primary" />
      <MFab icon="edit" color="secondary" />
      <MFab icon="edit" color="tertiary" />
      <MFab icon="edit" color="surface" />
    </ComponentDemo>

    <ComponentDemo
      title="Extended FAB"
      description="FAB with a text label for more context."
      :code="`<MFab icon=&quot;add&quot; label=&quot;New item&quot; />
<MFab icon=&quot;edit&quot; label=&quot;Compose&quot; color=&quot;tertiary&quot; />`"
    >
      <MFab icon="add" label="New item" />
      <MFab icon="edit" label="Compose" color="tertiary" />
    </ComponentDemo>

    <ComponentDemo
      title="Speed Dial"
      description="Pass an items array to turn the FAB into a speed dial. Each item needs an icon and optionally a label and onClick handler."
      :code="`const items = [
  { icon: 'image', label: 'Photo', onClick: () => {} },
  { icon: 'videocam', label: 'Video', onClick: () => {} },
  { icon: 'mic', label: 'Audio', onClick: () => {} },
]

<MFab icon=&quot;add&quot; :items=&quot;items&quot; direction=&quot;up&quot; />`"
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="fabProps" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">SpeedDialItem interface</p>
      <pre class="rounded-lg bg-surface-container p-3 text-body-small"><code>interface SpeedDialItem {
  icon: string        // Material Symbol name
  label?: string      // Tooltip label (shown for up/down directions)
  onClick?: () => void
}</code></pre>
    </MCard>

    <!-- ── MSegmentedButton ─────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MSegmentedButton</h2>

    <ComponentDemo
      title="Single Select"
      description="Only one segment can be active at a time."
      :code="`<MSegmentedButton
  v-model=&quot;value&quot;
  :options=&quot;[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]&quot;
/>`"
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
      :code="`<MSegmentedButton
  v-model=&quot;values&quot;
  :options=&quot;[
    { value: 'bold', label: 'Bold', icon: 'format_bold' },
    { value: 'italic', label: 'Italic', icon: 'format_italic' },
    { value: 'underline', label: 'Underline', icon: 'format_underlined' },
  ]&quot;
  :multi-select=&quot;true&quot;
/>`"
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
