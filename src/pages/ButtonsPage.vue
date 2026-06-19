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
  { name: 'to', type: 'string | RouteLocationRaw', description: 'Vue Router destination — renders as RouterLink instead of button' },
]

const iconButtonProps: PropDef[] = [
  { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'label', type: 'string', description: 'Accessible label (aria-label and title)' },
  { name: 'variant', type: "'standard' | 'filled' | 'tonal' | 'outlined'", default: "'standard'", description: 'Visual style' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'size', type: 'number', default: '40', description: 'Button size in pixels' },
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="buttonProps" />

    <!-- ── MIconButton ──────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MIconButton</h2>

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
      description="Custom sizes via the size prop."
      :code="`<template>
  <MIconButton icon=&quot;favorite&quot; label=&quot;Small&quot; :size=&quot;32&quot; variant=&quot;tonal&quot; />
  <MIconButton icon=&quot;favorite&quot; label=&quot;Default&quot; :size=&quot;40&quot; variant=&quot;tonal&quot; />
  <MIconButton icon=&quot;favorite&quot; label=&quot;Large&quot; :size=&quot;48&quot; variant=&quot;tonal&quot; />
</template>`"
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

    <!-- ── MSegmentedButton ─────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MSegmentedButton</h2>

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
