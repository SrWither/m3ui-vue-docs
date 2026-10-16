<script setup lang="ts">
/* Every keyboard shortcut, grouped, from the same list that registers them. */
import { computed } from 'vue'
import { MDialog, MKbd, type HotkeyBinding } from '@m3ui-vue/m3ui-vue'
import { usePhoto } from '../usePhoto'

const props = defineProps<{ bindings: HotkeyBinding[] }>()
const { dialogs } = usePhoto()
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)

const groups = computed(() => {
  const map = new Map<string, HotkeyBinding[]>()
  for (const b of props.bindings) {
    // Several keys for one action (Ctrl+Y and Ctrl+Shift+Z) show once.
    const list = map.get(b.group ?? '') ?? []
    if (!list.some((x) => x.label === b.label)) list.push(b)
    map.set(b.group ?? '', list)
  }
  return [...map]
})
const keysOf = (b: HotkeyBinding) =>
  b.keys.split('+').map((k) => ({ mod: isMac ? '⌘' : 'Ctrl', shift: 'Shift', backslash: '\\', delete: 'Del', escape: 'Esc', enter: 'Enter' })[k] ?? k.toUpperCase())
</script>

<template>
  <MDialog v-model="dialogs.shortcuts" title="Keyboard shortcuts" max-width="640px">
    <div class="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      <section v-for="[group, list] in groups" :key="group">
        <h3 class="mb-2 text-label-large text-primary">{{ group }}</h3>
        <div v-for="b in list" :key="b.keys" class="flex items-center justify-between gap-3 py-1">
          <span class="text-body-medium text-on-surface">{{ b.label }}</span>
          <MKbd :keys="keysOf(b)" size="sm" />
        </div>
      </section>
      <section>
        <h3 class="mb-2 text-label-large text-primary">Mouse</h3>
        <div class="flex items-center justify-between gap-3 py-1"><span class="text-body-medium text-on-surface">Pan</span><MKbd :keys="['Space', 'Drag']" size="sm" /></div>
        <div class="flex items-center justify-between gap-3 py-1"><span class="text-body-medium text-on-surface">Zoom</span><MKbd :keys="['Ctrl', 'Wheel']" size="sm" /></div>
      </section>
    </div>
  </MDialog>
</template>
