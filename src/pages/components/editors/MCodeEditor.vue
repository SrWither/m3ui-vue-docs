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

const cCode = ref(`#include <stdio.h>\n\nint main(void) {\n  printf("Hello, %s!\\n", "world");\n  return 0;\n}`)
const cppCode = ref(`#include <iostream>\n#include <string>\n\nstd::string greet(const std::string& name) {\n  return "Hello, " + name + "!";\n}\n\nint main() {\n  std::cout << greet("world") << std::endl;\n}`)
const rustCode = ref(`fn greet(name: &str) -> String {\n    format!("Hello, {name}!")\n}\n\nfn main() {\n    println!("{}", greet("world"));\n}`)
const asmCode = ref(`.global _start\n\n.section .text\n_start:\n    mov     $1, %rax\n    mov     $1, %rdi\n    lea     msg(%rip), %rsi\n    mov     $14, %rdx\n    syscall\n\n    mov     $60, %rax\n    xor     %rdi, %rdi\n    syscall\n\n.section .data\nmsg:\n    .ascii "Hello, world!\\n"`)

const codeEditorProps: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'Editor content (v-model)' },
  { name: 'language', type: "'javascript' | 'typescript' | 'json' | 'html' | 'css' | 'python' | 'vue' | 'c' | 'cpp' | 'rust' | 'asm' | 'plain'", default: "'javascript'", description: 'Syntax language' },
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
            <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">pnpm add codemirror @codemirror/view @codemirror/state @codemirror/commands @codemirror/language @codemirror/lang-javascript @codemirror/lang-json @codemirror/lang-html @codemirror/lang-css @codemirror/lang-python @codemirror/lang-vue @codemirror/lang-cpp @codemirror/lang-rust @codemirror/legacy-modes @codemirror/theme-one-dark</code>
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

    <ComponentDemo
      title="More Languages"
      description="C and C++ use the official @codemirror/lang-cpp parser (the same grammar handles both — there's no separate C-only package). Rust uses @codemirror/lang-rust. Assembly (GNU/AT&T syntax) has no dedicated CodeMirror 6 package, so it's ported from CodeMirror 5 via @codemirror/legacy-modes — highlighting is more basic than the others, but still distinguishes registers, directives, and comments."
      :code="`<MCodeEditor v-model=&quot;code&quot; language=&quot;cpp&quot; />
<MCodeEditor v-model=&quot;code&quot; language=&quot;rust&quot; />
<MCodeEditor v-model=&quot;code&quot; language=&quot;asm&quot; />`"
    >
      <div class="grid w-full gap-4 md:grid-cols-2">
        <MCodeEditor v-model="cCode" language="c" min-height="140px" max-height="200px" />
        <MCodeEditor v-model="cppCode" language="cpp" min-height="140px" max-height="200px" />
        <MCodeEditor v-model="rustCode" language="rust" min-height="140px" max-height="200px" />
        <MCodeEditor v-model="asmCode" language="asm" min-height="140px" max-height="200px" />
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
