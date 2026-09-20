<script setup lang="ts">
import { ref } from 'vue'
import { MCard } from '@m3ui-vue/m3ui-vue'
import { MJsonEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const jsonEditorData = ref({
  name: 'John Doe',
  age: 30,
  active: true,
  tags: ['admin', 'user'],
})

const jsonEditorDataEs = ref({
  nombre: 'María',
  edad: 27,
  activo: true,
})

const jsonEditorProps: PropDef[] = [
  { name: 'modelValue', type: 'unknown', description: 'JSON data (v-model, any valid JSON)' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Read-only mode' },
  { name: 'minHeight', type: 'string', default: "'200px'", description: 'Min height' },
  { name: 'maxHeight', type: 'string', default: "'600px'", description: 'Max height' },
  { name: 'labels', type: 'JsonEditorLabels', description: 'Overrides for the valid/invalid badge and format/minify button text (see the type below) — defaults come from useLocale()' },
]

const jsonEditorEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'unknown', description: 'Emitted with the parsed value whenever the text is valid JSON — powers v-model' },
]

const jsonEditorTypes: TypeDef[] = [
  {
    name: 'JsonEditorLabels',
    description: 'All fields optional — unset ones fall back to the active locale',
    fields: [
      { name: 'valid', type: 'string', description: "Validation badge text when the JSON parses ('Valid')" },
      { name: 'invalid', type: 'string', description: "Validation badge text when it doesn't ('Invalid')" },
      { name: 'format', type: 'string', description: "Pretty-print button label ('Format')" },
      { name: 'minify', type: 'string', description: "Minify button label ('Minify')" },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MJsonEditor</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A JSON-aware editor built on top of MCodeEditor — validates as you type and adds format/minify shortcuts.
    </p>

    <MCard variant="outlined" class="mb-6 p-4">
      <div class="flex items-start gap-3">
        <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container text-label-small font-medium">!</span>
        <div>
          <p class="text-body-medium font-medium">Peer dependencies required</p>
          <p class="mt-1 text-body-medium text-on-surface-variant">
            MJsonEditor is built on top of MCodeEditor, so it requires the same CodeMirror peer dependencies. Install them with:
            <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">pnpm add codemirror @codemirror/view @codemirror/state @codemirror/commands @codemirror/language @codemirror/lang-javascript @codemirror/lang-json @codemirror/lang-html @codemirror/lang-css @codemirror/lang-python @codemirror/lang-vue @codemirror/theme-one-dark</code>
          </p>
        </div>
      </div>
    </MCard>

    <ComponentDemo
      title="JSON Editor"
      description="Edit JSON data with syntax highlighting and validation."
      :code="`<MJsonEditor v-model=&quot;data&quot; />`"
      :script="`import { ref } from 'vue'
import { MJsonEditor } from '@m3ui-vue/m3ui-vue/code-editor'

const data = ref({
  name: 'John Doe',
  age: 30,
  active: true,
  tags: ['admin', 'user'],
})`"
    >
      <div class="w-full">
        <MJsonEditor v-model="jsonEditorData" min-height="150px" max-height="400px" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Labels"
      description="Override the validation badge and button text via the labels prop, independent of the app-wide locale."
      :code="`<MJsonEditor v-model=&quot;data&quot; :labels=&quot;labels&quot; />`"
      :script="`const labels = {
  valid: 'Válido',
  invalid: 'Inválido',
  format: 'Formatear',
  minify: 'Minificar',
}`"
    >
      <div class="w-full">
        <MJsonEditor
          v-model="jsonEditorDataEs"
          min-height="120px"
          max-height="300px"
          :labels="{ valid: 'Válido', invalid: 'Inválido', format: 'Formatear', minify: 'Minificar' }"
        />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="jsonEditorProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="jsonEditorEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="jsonEditorTypes" />

    <ComponentPager current="MJsonEditor" />
  </div>
</template>
