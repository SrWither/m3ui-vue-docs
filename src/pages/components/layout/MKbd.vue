<script setup lang="ts">
import { MKbd } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const kbdProps: PropDef[] = [
  { name: 'keys', type: 'string | string[]', description: "Required. A '+'-delimited string (\"Ctrl+Shift+K\") or an array of keys" },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Key chip size' },
  { name: 'separator', type: 'string', default: "'+'", description: 'Separator rendered between keys' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MKbd</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Displays a keyboard shortcut as styled key chips. Purely presentational — pairs well with MHotkeys or
      MCommandPalette to show the shortcut that triggers an action.
    </p>

    <ComponentDemo
      title="Keyboard shortcut hint"
      description="Pass a '+'-delimited string or an array of keys."
      :code="`<MKbd keys=&quot;Ctrl+K&quot; />
<MKbd :keys=&quot;['Cmd', 'Shift', 'P']&quot; size=&quot;lg&quot; />
<MKbd keys=&quot;Esc&quot; size=&quot;sm&quot; />`"
    >
      <div class="flex flex-wrap items-center gap-6">
        <MKbd keys="Ctrl+K" />
        <MKbd :keys="['Cmd', 'Shift', 'P']" size="lg" />
        <MKbd keys="Esc" size="sm" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="kbdProps" />

    <ComponentPager current="MKbd" />
  </div>
</template>
