<script setup lang="ts">
import { MCard } from '@m3ui-vue/m3ui-vue'
import { MMarkdown } from '@m3ui-vue/m3ui-vue/markdown'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const markdownSource = `# Hello World

This is **bold** and this is *italic*.

- Item one
- Item two
- Item three

## Syntax Highlighting

\`\`\`typescript copy {3-5}
interface User {
  name: string
  age: number
  active: boolean
}

function greet(user: User): string {
  // Return a personalized greeting
  const prefix = user.active ? "Welcome back" : "Hello"
  return \`\${prefix}, \${user.name}! You are \${user.age} years old.\`
}

const admin: User = { name: "Alice", age: 30, active: true }
console.log(greet(admin))
\`\`\`

\`\`\`html copy {3}
<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <MButton variant="filled" @click="onClick">
      Click me
    </MButton>
  </div>
</template>
\`\`\`

> Add \\\`copy\\\` for a copy button, and \\\`{1,3-5}\\\` to highlight lines.

## Table Example

| Component | Category | Status |
|-----------|----------|--------|
| MButton | Actions | Stable |
| MCard | Containers | Stable |
| MMarkdown | Editors | Beta |
| MDataTable | Data | Stable |

[Visit Google](https://google.com)`

const linkifySource = `Auto-linked when linkify is on: https://m3ui.dev\nNot auto-linked when it's off.\n\nA line break here\nbecomes a <br> when breaks is on.`

const markdownProps: PropDef[] = [
  { name: 'source', type: 'string', description: 'Markdown source text' },
  { name: 'breaks', type: 'boolean', default: 'true', description: 'Convert single newlines to <br>' },
  { name: 'linkify', type: 'boolean', default: 'true', description: 'Auto-detect bare URLs and turn them into links' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMarkdown</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Renders markdown source as styled HTML — headings, lists, tables, blockquotes, links, and fenced code blocks
      with optional syntax highlighting, line highlighting, and a copy button.
    </p>

    <ComponentDemo
      title="Markdown Renderer"
      description="Render markdown content with syntax highlighting, lists, links, and more. Install highlight.js for code coloring."
      :code="`<MMarkdown :source=&quot;source&quot; />`"
      :script="`import { MMarkdown } from '@m3ui-vue/m3ui-vue/markdown'

const source = \`# Hello World

This is **bold** and this is *italic*.

\\\`\\\`\\\`ts copy {2}
function greet(name: string): string {
  return \\\\\`Hello, \\\${name}!\\\\\`
}
\\\`\\\`\\\`
\``"
    >
      <div class="w-full">
        <MCard variant="outlined" class="p-6">
          <MMarkdown :source="markdownSource" />
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Breaks & Linkify"
      description="With linkify off, bare URLs render as plain text instead of links; breaks controls whether a single newline becomes a <br>."
      :code="`<MMarkdown :source=&quot;source&quot; :linkify=&quot;false&quot; :breaks=&quot;true&quot; />`"
    >
      <div class="flex w-full flex-col gap-4 sm:flex-row">
        <MCard variant="outlined" class="w-full p-4">
          <p class="mb-2 text-label-medium text-on-surface-variant">linkify: true (default)</p>
          <MMarkdown :source="linkifySource" :linkify="true" :breaks="true" />
        </MCard>
        <MCard variant="outlined" class="w-full p-4">
          <p class="mb-2 text-label-medium text-on-surface-variant">linkify: false</p>
          <MMarkdown :source="linkifySource" :linkify="false" :breaks="true" />
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="markdownProps" />

    <ComponentPager current="MMarkdown" />
  </div>
</template>
