<script setup lang="ts">
import { ref } from 'vue'
import { MCard, MJsonViewer } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor, MJsonEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import { MMarkdown } from '@m3ui-vue/m3ui-vue/markdown'
import { MTerminal } from '@m3ui-vue/m3ui-vue/terminal'
import { MRichTextEditor } from '@m3ui-vue/m3ui-vue/rich-text-editor'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'

/* ── MCodeEditor ─────────────────────────────────────────────────────── */
const sampleCode = ref(`function greet(name: string) {\n  return \`Hello, \${name}!\`\n}`)

const codeEditorProps: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'Editor content (v-model)' },
  { name: 'language', type: "'javascript' | 'typescript' | 'json' | 'html' | 'css' | 'python' | 'vue' | 'plain'", default: "'javascript'", description: 'Syntax language' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Read-only mode' },
  { name: 'lineNumbers', type: 'boolean', default: 'true', description: 'Show line numbers' },
  { name: 'theme', type: "'light' | 'dark'", default: "'light'", description: 'Color theme' },
  { name: 'minHeight', type: 'string', default: "'200px'", description: 'Minimum editor height' },
  { name: 'maxHeight', type: 'string', default: "'600px'", description: 'Maximum editor height' },
  { name: 'placeholder', type: 'string', description: 'Placeholder text' },
  { name: 'wrap', type: 'boolean', default: 'true', description: 'Word wrap' },
]

/* ── MJsonEditor ─────────────────────────────────────────────────────── */
const jsonEditorData = ref({
  name: 'John Doe',
  age: 30,
  active: true,
  tags: ['admin', 'user'],
})

const jsonEditorProps: PropDef[] = [
  { name: 'modelValue', type: 'unknown', description: 'JSON data (v-model, any valid JSON)' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Read-only mode' },
  { name: 'minHeight', type: 'string', default: "'200px'", description: 'Min height' },
  { name: 'maxHeight', type: 'string', default: "'600px'", description: 'Max height' },
]

/* ── MJsonViewer ─────────────────────────────────────────────────────── */
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
]

/* ── MMarkdown ───────────────────────────────────────────────────────── */
const markdownSource = `# Hello World\n\nThis is **bold** and this is *italic*.\n\n- Item one\n- Item two\n- Item three\n\n\`\`\`js\nconsole.log('hello')\n\`\`\`\n\n[Visit Google](https://google.com)`

const markdownProps: PropDef[] = [
  { name: 'source', type: 'string', description: 'Markdown source text' },
  { name: 'breaks', type: 'boolean', default: 'true', description: 'Convert newlines to <br>' },
  { name: 'linkify', type: 'boolean', default: 'true', description: 'Auto-detect URLs as links' },
]

/* ── MTerminal ───────────────────────────────────────────────────────── */
const terminalLines = ['$ npm install @m3ui-vue/m3ui-vue', 'added 42 packages in 3.2s', '$ echo "Ready!"', 'Ready!']

const terminalProps: PropDef[] = [
  { name: 'lines', type: 'string[]', default: '[]', description: 'Initial lines to display' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Disable input' },
  { name: 'title', type: 'string', default: "'Terminal'", description: 'Title bar text' },
  { name: 'minHeight', type: 'string', default: "'300px'", description: 'Minimum height' },
]

const richTextContent = ref('<p>This is <strong>bold</strong> and <em>italic</em> text.</p><p>Try editing this content!</p>')

const richTextProps: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'HTML content (v-model)' },
  { name: 'placeholder', type: 'string', default: "'Escribe aquí...'", description: 'Placeholder text' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables editing' },
  { name: 'minHeight', type: 'string', default: "'200px'", description: 'Minimum editor height' },
]

</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Editors &amp; Viewers</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Components for editing and displaying code, JSON, markdown, and terminal output.
    </p>

    <!-- ── MCodeEditor ─────────────────────────────────────────────────── -->
    <h2 class="mb-4 text-headline-small font-medium">MCodeEditor</h2>

    <ComponentDemo
      title="Basic Editor"
      description="Editable code editor with syntax highlighting and line numbers."
      :code="`<script setup>
import { ref } from 'vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'

const code = ref(\`function greet(name: string) {
  return \\\`Hello, \\\${name}!\\\`
}\`)
<\/script>

<template>
  <MCodeEditor v-model=&quot;code&quot; language=&quot;typescript&quot; />
</template>`"
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="codeEditorProps" />

    <!-- ── MJsonEditor ─────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MJsonEditor</h2>

    <ComponentDemo
      title="JSON Editor"
      description="Edit JSON data with syntax highlighting and validation."
      :code="`<script setup>
import { ref } from 'vue'
import { MJsonEditor } from '@m3ui-vue/m3ui-vue'

const data = ref({
  name: 'John Doe',
  age: 30,
  active: true,
  tags: ['admin', 'user'],
})
<\/script>

<template>
  <MJsonEditor v-model=&quot;data&quot; />
</template>`"
    >
      <div class="w-full">
        <MJsonEditor v-model="jsonEditorData" min-height="150px" max-height="400px" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="jsonEditorProps" />

    <!-- ── MJsonViewer ─────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MJsonViewer</h2>

    <ComponentDemo
      title="JSON Viewer"
      description="Read-only tree view for inspecting JSON data with expand/collapse."
      :code="`<script setup>
import { MJsonViewer } from '@m3ui-vue/m3ui-vue'

const data = {
  name: 'm3ui-vue',
  version: '0.1.4',
  dependencies: { vue: '^3.5.0', tailwindcss: '^4.0.0' },
  features: ['dark mode', 'material 3', 'tree-shaking'],
}
<\/script>

<template>
  <MJsonViewer :data=&quot;data&quot; root-name=&quot;package&quot; :expand-depth=&quot;2&quot; />
</template>`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="p-4">
          <MJsonViewer :data="sampleData" root-name="package" :expand-depth="2" />
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="jsonViewerProps" />

    <!-- ── MMarkdown ───────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MMarkdown</h2>

    <ComponentDemo
      title="Markdown Renderer"
      description="Render markdown content with support for headings, lists, links, bold, and code blocks."
      :code="`<script setup>
import { MMarkdown } from '@m3ui-vue/m3ui-vue'

const source = \`# Hello World

This is **bold** and this is *italic*.

- Item one
- Item two
- Item three

\\\`\\\`\\\`js
console.log('hello')
\\\`\\\`\\\`

[Visit Google](https://google.com)\`
<\/script>

<template>
  <MMarkdown :source=&quot;source&quot; />
</template>`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="p-6">
          <MMarkdown :source="markdownSource" />
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="markdownProps" />

    <!-- ── MTerminal ───────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MTerminal</h2>

    <MCard variant="outlined" class="mb-6 p-4">
      <div class="flex items-start gap-3">
        <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container text-label-small font-medium">!</span>
        <div>
          <p class="text-body-medium font-medium">Peer dependencies required</p>
          <p class="mt-1 text-body-medium text-on-surface-variant">
            MTerminal requires <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">@xterm/xterm</code> and
            <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">@xterm/addon-fit</code> as peer dependencies.
            Install them with: <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">pnpm add @xterm/xterm @xterm/addon-fit</code>
          </p>
        </div>
      </div>
    </MCard>

    <ComponentDemo
      title="Terminal"
      description="Terminal emulator with pre-filled output lines."
      :code="`<script setup>
import { MTerminal } from '@m3ui-vue/m3ui-vue/terminal'

const lines = [
  '$ npm install @m3ui-vue/m3ui-vue',
  'added 42 packages in 3.2s',
  '$ echo &quot;Ready!&quot;',
  'Ready!',
]
<\/script>

<template>
  <MTerminal :lines=&quot;lines&quot; :readonly=&quot;true&quot; title=&quot;Installation&quot; />
</template>`"
    >
      <div class="w-full">
        <MTerminal :lines="terminalLines" :readonly="true" title="Installation" min-height="200px" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="terminalProps" />

    <!-- ── MRichTextEditor ─────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MRichTextEditor</h2>

    <ComponentDemo
      title="Rich Text Editor"
      description="WYSIWYG editor with formatting toolbar."
      :code="`<script setup>
import { ref } from 'vue'
import { MRichTextEditor } from '@m3ui-vue/m3ui-vue/rich-text-editor'

const content = ref('<p>Hello <strong>world</strong>!</p>')
<\/script>

<template>
  <MRichTextEditor v-model=&quot;content&quot; placeholder=&quot;Start writing...&quot; />
</template>`"
    >
      <div class="w-full">
        <MRichTextEditor v-model="richTextContent" placeholder="Start writing..." />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="richTextProps" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Peer Dependencies</p>
      <pre class="rounded-lg bg-surface-container p-3 text-body-small"><code>@tiptap/vue-3  @tiptap/starter-kit  @tiptap/extension-underline
@tiptap/extension-text-align  @tiptap/extension-link
@tiptap/extension-image  @tiptap/extension-highlight
@tiptap/extension-placeholder  @tiptap/extension-text-style
@tiptap/extension-color</code></pre>
    </MCard>

  </div>
</template>
