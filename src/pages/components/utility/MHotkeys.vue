<script setup lang="ts">
import { ref } from 'vue'
import { MHotkeys } from '@m3ui-vue/m3ui-vue'
import type { HotkeyBinding } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const hotkeyProps: PropDef[] = [
  { name: 'bindings', type: 'HotkeyBinding[]', description: 'Array of key combos to register globally — see the type below' },
  { name: 'showOverlay', type: 'boolean', default: 'false', description: 'Render a visible list of the registered shortcuts (otherwise the component is invisible and only listens)' },
]

const hotkeyTypes: TypeDef[] = [
  {
    name: 'HotkeyBinding',
    fields: [
      { name: 'keys', type: 'string', required: true, description: "Key combo, e.g. 'mod+s', 'mod+shift+p', 'escape' ('mod' is Cmd on Mac, Ctrl elsewhere)" },
      { name: 'label', type: 'string', required: true, description: 'Display name shown in the overlay' },
      { name: 'handler', type: '() => void', required: true, description: 'Callback invoked when the combo is pressed' },
      { name: 'group', type: 'string', description: 'Groups related bindings together in the overlay' },
      { name: 'disabled', type: 'boolean', description: 'Temporarily disable this binding without removing it from the array' },
    ],
  },
]

const hotkeyLog = ref<string[]>([])
const hotkeyBindings: HotkeyBinding[] = [
  { keys: 'mod+s', label: 'Save', handler: () => hotkeyLog.value.push('Save'), group: 'File' },
  { keys: 'mod+shift+p', label: 'Command Palette', handler: () => hotkeyLog.value.push('Palette'), group: 'Navigation' },
  { keys: 'mod+k', label: 'Search', handler: () => hotkeyLog.value.push('Search'), group: 'Navigation' },
]

const disabledBindings: HotkeyBinding[] = [
  { keys: 'mod+d', label: 'Duplicate', handler: () => hotkeyLog.value.push('Duplicate'), group: 'Edit' },
  { keys: 'mod+shift+d', label: 'Delete (disabled)', handler: () => hotkeyLog.value.push('Delete'), group: 'Edit', disabled: true },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MHotkeys</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Registers global keyboard shortcuts for as long as it's mounted, with an optional on-screen overlay listing
      them grouped by category.
    </p>

    <ComponentDemo
      title="Keyboard Shortcuts"
      description="Register global keyboard shortcuts with an overlay display grouped by the group field. Try Ctrl/Cmd+S, Ctrl/Cmd+Shift+P, or Ctrl/Cmd+K anywhere on this page."
      :code="`<template>
  <MHotkeys :bindings=&quot;bindings&quot; :show-overlay=&quot;true&quot; />
</template>`"
      :script="`const bindings = [
  { keys: 'mod+s', label: 'Save', handler: () => console.log('Save'), group: 'File' },
  { keys: 'mod+shift+p', label: 'Palette', handler: () => console.log('Palette'), group: 'Navigation' },
  { keys: 'mod+k', label: 'Search', handler: () => console.log('Search'), group: 'Navigation' },
]`"
    >
      <div class="w-full">
        <MHotkeys :bindings="hotkeyBindings" :show-overlay="true" />
        <p v-if="hotkeyLog.length" class="mt-3 text-body-medium text-on-surface-variant">
          Last action: {{ hotkeyLog[hotkeyLog.length - 1] }}
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Disabled Binding"
      description="Setting disabled on a binding keeps it listed in the overlay (dimmed) but it no longer fires — useful for toggling shortcuts conditionally without rebuilding the array."
      :code="`<template>
  <MHotkeys :bindings=&quot;bindings&quot; :show-overlay=&quot;true&quot; />
</template>`"
      :script="`const bindings = [
  { keys: 'mod+d', label: 'Duplicate', handler: () => {}, group: 'Edit' },
  { keys: 'mod+shift+d', label: 'Delete (disabled)', handler: () => {}, group: 'Edit', disabled: true },
]`"
    >
      <div class="w-full">
        <MHotkeys :bindings="disabledBindings" :show-overlay="true" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="hotkeyProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="hotkeyTypes" />

    <ComponentPager current="MHotkeys" />
  </div>
</template>
