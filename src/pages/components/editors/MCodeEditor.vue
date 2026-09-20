<script setup lang="ts">
import { ref } from 'vue'
import { MCard } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const sampleCode = ref(`function greet(name: string) {\n  return \`Hello, \${name}!\`\n}`)
const emptyCode = ref('')

const codeEditorProps: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'Editor content (v-model)' },
  { name: 'language', type: "'javascript' | 'typescript' | 'json' | 'html' | 'css' | 'python' | 'vue' | 'plain'", default: "'javascript'", description: 'Syntax language' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Read-only mode' },
  { name: 'lineNumbers', type: 'boolean', default: 'true', description: 'Show line numbers' },
  { name: 'theme', type: "'light' | 'dark'", default: "'light'", description: 'Color theme' },
  { name: 'minHeight', type: 'string', default: "'200px'", description: 'Minimum editor height' },
  { name: 'maxHeight', type: 'string', default: "'600px'", description: 'Maximum editor height' },
  { name: 'placeholder', type: 'string', description: 'Placeholder text shown via CodeMirror when the editor is empty' },
  { name: 'wrap', type: 'boolean', default: 'true', description: 'Word wrap' },
]

const codeEditorEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'string', description: 'Emitted on every document change — powers v-model' },
]

const codeEditorSlots: SlotDef[] = [
  { name: 'actions', description: 'Extra controls rendered in the header bar, before the built-in copy button' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCodeEditor</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A syntax-highlighted code editor built on CodeMirror 6, with a header bar, line numbers, and a copy button.
    </p>

    <MCard variant="outlined" class="mb-6 p-4">
      <div class="flex items-start gap-3">
        <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container text-label-small font-medium">!</span>
        <div>
          <p class="text-body-medium font-medium">Peer dependencies required</p>
          <p class="mt-1 text-body-medium text-on-surface-variant">
            MCodeEditor requires CodeMirror as a peer dependency. Install it with:
            <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">pnpm add codemirror @codemirror/view @codemirror/state @codemirror/commands @codemirror/language @codemirror/lang-javascript @codemirror/lang-json @codemirror/lang-html @codemirror/lang-css @codemirror/lang-python @codemirror/lang-vue @codemirror/theme-one-dark</code>
          </p>
        </div>
      </div>
    </MCard>

    <ComponentDemo
      title="Basic Editor"
      description="Editable code editor with syntax highlighting and line numbers."
      :code="`<MCodeEditor v-model=&quot;code&quot; language=&quot;typescript&quot; />`"
      :script="`import { ref } from 'vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'

const code = ref(\`function greet(name: string) {
  return \\\`Hello, \\\${name}!\\\`
}\`)`"
    >
      <div class="w-full">
        <MCodeEditor v-model="sampleCode" language="typescript" min-height="100px" max-height="300px" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Read-only"
      description="Display code in read-only mode, useful for documentation snippets."
      :code="`<template>
  <MCodeEditor
    :model-value=&quot;code&quot;
    language=&quot;typescript&quot;
    :readonly=&quot;true&quot;
    :line-numbers=&quot;false&quot;
  />
</template>`"
    >
      <div class="w-full">
        <MCodeEditor
          :model-value="sampleCode"
          language="typescript"
          :readonly="true"
          :line-numbers="false"
          min-height="80px"
          max-height="200px"
        />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Dark Theme"
      description="The theme prop switches the CodeMirror color scheme independently of the app's own light/dark mode."
      :code="`<MCodeEditor v-model=&quot;code&quot; language=&quot;typescript&quot; theme=&quot;dark&quot; />`"
    >
      <div class="w-full">
        <MCodeEditor :model-value="sampleCode" language="typescript" theme="dark" :readonly="true" min-height="100px" max-height="220px" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Placeholder"
      description="Shown by CodeMirror whenever the document is empty."
      :code="`<MCodeEditor v-model=&quot;code&quot; language=&quot;javascript&quot; placeholder=&quot;// Write some code...&quot; />`"
    >
      <div class="w-full">
        <MCodeEditor v-model="emptyCode" language="javascript" placeholder="// Write some code..." min-height="100px" max-height="200px" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="codeEditorProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="codeEditorEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="codeEditorSlots" />

    <ComponentPager current="MCodeEditor" />
  </div>
</template>
