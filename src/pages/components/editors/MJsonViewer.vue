<script setup lang="ts">
import { MCard, MJsonViewer } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const sampleData = {
  name: 'm3ui-vue',
  version: '0.1.4',
  dependencies: { vue: '^3.5.0', tailwindcss: '^4.0.0' },
  features: ['dark mode', 'material 3', 'tree-shaking'],
}

const jsonViewerProps: PropDef[] = [
  { name: 'data', type: 'unknown', description: 'Data to display (any JSON-compatible value)' },
  { name: 'rootName', type: 'string', default: "'root'", description: 'Name for the root node' },
  { name: 'expandDepth', type: 'number', default: '2', description: 'Levels to expand by default' },
  { name: 'labels', type: 'JsonViewerLabels', description: "Overrides for the collapsed-node summary text (see the type below) — defaults come from useLocale()" },
]

const jsonViewerTypes: TypeDef[] = [
  {
    name: 'JsonViewerLabels',
    description: 'All fields optional — unset ones fall back to the active locale',
    fields: [
      { name: 'elements', type: 'string', description: "Unit shown after the count on a collapsed array node ('elements')" },
      { name: 'fields', type: 'string', description: "Unit shown after the count on a collapsed object node ('fields')" },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MJsonViewer</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A read-only, recursively expandable tree view for inspecting JSON-compatible data.
    </p>

    <ComponentDemo
      title="JSON Viewer"
      description="Read-only tree view for inspecting JSON data with expand/collapse."
      :code="`<MJsonViewer :data=&quot;data&quot; root-name=&quot;package&quot; :expand-depth=&quot;2&quot; />`"
      :script="`import { MJsonViewer } from '@m3ui-vue/m3ui-vue'

const data = {
  name: 'm3ui-vue',
  version: '0.1.4',
  dependencies: { vue: '^3.5.0', tailwindcss: '^4.0.0' },
  features: ['dark mode', 'material 3', 'tree-shaking'],
}`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="p-4">
          <MJsonViewer :data="sampleData" root-name="package" :expand-depth="2" />
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Labels"
      description="Override the collapsed-node unit text via the labels prop, independent of the app-wide locale."
      :code="`<MJsonViewer :data=&quot;data&quot; root-name=&quot;paquete&quot; :expand-depth=&quot;0&quot; :labels=&quot;labels&quot; />`"
      :script="`const labels = { elements: 'elementos', fields: 'campos' }`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="p-4">
          <MJsonViewer
            :data="sampleData"
            root-name="paquete"
            :expand-depth="0"
            :labels="{ elements: 'elementos', fields: 'campos' }"
          />
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="jsonViewerProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="jsonViewerTypes" />

    <ComponentPager current="MJsonViewer" />
  </div>
</template>
