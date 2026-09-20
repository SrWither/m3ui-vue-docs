<script setup lang="ts">
import { ref } from 'vue'
import { MExportButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

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

const exportButtonSlots: SlotDef[] = [
  { name: '#default', description: 'Replaces the label text prop' },
]

const exportButtonEvents = [
  { name: 'exported', payload: '{ format: string; filename: string }', description: 'Emitted after a successful download is triggered' },
  { name: 'error', payload: 'unknown', description: 'Emitted if serialization or the download trigger fails' },
]

const exportRows = [
  { name: 'Ada Lovelace', role: 'Engineer' },
  { name: 'Grace Hopper', role: 'Admiral' },
]
const exportLog = ref('')
function onExported({ format, filename }: { format: string; filename: string }) {
  exportLog.value = `@exported: ${format} → ${filename}`
}
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MExportButton</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Serializes the data prop and triggers a real browser download — no dependencies.
    </p>

    <ComponentDemo
      title="Export to CSV / JSON"
      description="CSV fields are escaped (commas, quotes, newlines)."
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="exportButtonEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="exportButtonSlots" />

    <ComponentPager current="MExportButton" />
  </div>
</template>
