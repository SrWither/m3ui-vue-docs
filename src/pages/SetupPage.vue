<script setup lang="ts">
import { ref } from 'vue'
import { MCard, MIcon, MIconButton, useToast } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'

const toast = useToast()
const copiedDep = ref<string | null>(null)

async function copyInstall(cmd: string, id: string) {
  await navigator.clipboard.writeText(cmd)
  copiedDep.value = id
  toast.success('Copied to clipboard')
  setTimeout(() => { copiedDep.value = null }, 2000)
}

const installCode = `pnpm add @m3ui-vue/m3ui-vue@latest
# or
npm install @m3ui-vue/m3ui-vue@latest`

const fontsCode = `<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
  rel="stylesheet"
/>`

const tailwindInstallCode = `pnpm add tailwindcss @tailwindcss/vite
# or
npm install tailwindcss @tailwindcss/vite`

const viteConfigCode = `// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})`

const cssCode = `@import 'tailwindcss';
@import '@m3ui-vue/m3ui-vue/theme';
@import '@m3ui-vue/m3ui-vue/palettes'; /* optional — 20 color palettes */
@import '@m3ui-vue/m3ui-vue/styles';   /* component transitions & animations */`

const pluginCode = `// main.ts
import { createApp } from 'vue'
import { createM3UI } from '@m3ui-vue/m3ui-vue'
import App from './App.vue'

const app = createApp(App)
app.use(createM3UI({ palette: 'teal' })) // optional — sets initial palette
app.mount('#app')`

const usageCode = `<script setup>
import { MButton, MCard, MTextField, useToast } from '@m3ui-vue/m3ui-vue'

const toast = useToast()
<\/script>

<template>
  <MCard>
    <MTextField v-model="name" label="Name" />
    <MButton icon="save" @click="toast.success('Saved!')">
      Save
    </MButton>
  </MCard>
</template>`

const optionalCode = `// Only import what you need — these have their own entry points
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import { MChart } from '@m3ui-vue/m3ui-vue/chart'
import { MMarkdown } from '@m3ui-vue/m3ui-vue/markdown'
import { MRichTextEditor } from '@m3ui-vue/m3ui-vue/rich-text-editor'
import { MTerminal } from '@m3ui-vue/m3ui-vue/terminal'`

const optionalDeps = [
  { sub: 'code-editor', components: 'MCodeEditor, MJsonEditor', install: 'pnpm add codemirror @codemirror/view @codemirror/state @codemirror/commands @codemirror/language @codemirror/lang-javascript @codemirror/lang-json @codemirror/lang-html @codemirror/lang-css @codemirror/lang-python @codemirror/theme-one-dark' },
  { sub: 'chart', components: 'MChart', install: 'pnpm add chart.js vue-chartjs' },
  { sub: 'markdown', components: 'MMarkdown', install: 'pnpm add markdown-it' },
  { sub: 'rich-text-editor', components: 'MRichTextEditor', install: 'pnpm add @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-underline @tiptap/extension-text-align @tiptap/extension-link @tiptap/extension-image @tiptap/extension-color @tiptap/extension-text-style @tiptap/extension-highlight' },
  { sub: 'terminal', components: 'MTerminal', install: 'pnpm add @xterm/xterm @xterm/addon-fit' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Setup</h1>
    <p class="mb-6 text-body-large text-on-surface-variant">
      Get M3UI Vue up and running in your project in a few steps.
    </p>

    <MCard class="mb-8 flex items-start gap-3 p-4">
      <MIcon name="info" :size="22" class="mt-0.5 shrink-0 text-primary" />
      <div>
        <p class="text-body-medium font-medium text-on-surface">
          M3UI Vue is built on top of <strong>Vue 3</strong> and <strong>Tailwind CSS v4</strong>.
          Both are required peer dependencies — make sure your project already uses them before getting started.
        </p>
      </div>
    </MCard>

    <!-- Step 1 -->
    <div class="mb-8 flex gap-4">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary text-label-large font-medium">1</span>
      <div class="flex-1">
        <h2 class="mb-2 text-title-large font-medium">Install the package</h2>
        <MCodeEditor :model-value="installCode" language="javascript" :readonly="true" :line-numbers="false" min-height="50px" max-height="100px" />
      </div>
    </div>

    <!-- Step 2 -->
    <div class="mb-8 flex gap-4">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary text-label-large font-medium">2</span>
      <div class="flex-1">
        <h2 class="mb-2 text-title-large font-medium">Add Google Fonts</h2>
        <p class="mb-3 text-body-medium text-on-surface-variant">
          Add this to the <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">&lt;head&gt;</code> of your <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">index.html</code>:
        </p>
        <MCodeEditor :model-value="fontsCode" language="html" :readonly="true" :line-numbers="false" min-height="50px" max-height="150px" />
      </div>
    </div>

    <!-- Step 3 -->
    <div class="mb-8 flex gap-4">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary text-label-large font-medium">3</span>
      <div class="flex-1">
        <h2 class="mb-2 text-title-large font-medium">Configure CSS</h2>
        <p class="mb-3 text-body-medium text-on-surface-variant">
          M3UI Vue uses Tailwind CSS v4 for all its styling. Make sure you have
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">tailwindcss</code> and
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">@tailwindcss/vite</code>
          installed and configured in your project.
        </p>
        <MCodeEditor :model-value="tailwindInstallCode" language="javascript" :readonly="true" :line-numbers="false" min-height="50px" max-height="100px" class="mb-3" />
        <p class="mb-3 text-body-medium text-on-surface-variant">
          Then add the Tailwind plugin to your <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">vite.config.ts</code>:
        </p>
        <MCodeEditor :model-value="viteConfigCode" language="typescript" :readonly="true" :line-numbers="false" min-height="50px" max-height="200px" class="mb-3" />
        <p class="mb-3 text-body-medium text-on-surface-variant">
          Finally, in your main stylesheet (e.g. <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">src/assets/main.css</code>):
        </p>
        <MCodeEditor :model-value="cssCode" language="css" :readonly="true" :line-numbers="false" min-height="50px" max-height="150px" />
      </div>
    </div>

    <!-- Step 4 -->
    <div class="mb-8 flex gap-4">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary text-label-large font-medium">4</span>
      <div class="flex-1">
        <h2 class="mb-2 text-title-large font-medium">Register the plugin <span class="text-label-large text-on-surface-variant">(optional)</span></h2>
        <p class="mb-3 text-body-medium text-on-surface-variant">
          The plugin sets an initial color palette. Without it, the default purple palette is used.
        </p>
        <MCodeEditor :model-value="pluginCode" language="typescript" :readonly="true" :line-numbers="false" min-height="50px" max-height="200px" />
      </div>
    </div>

    <!-- Step 5 -->
    <div class="mb-10 flex gap-4">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary text-label-large font-medium">5</span>
      <div class="flex-1">
        <h2 class="mb-2 text-title-large font-medium">Use components</h2>
        <MCodeEditor :model-value="usageCode" language="vue" :readonly="true" :line-numbers="false" min-height="50px" max-height="300px" />
      </div>
    </div>

    <!-- Optional deps -->
    <h2 class="mb-4 text-headline-small font-medium">Optional Components</h2>
    <p class="mb-4 text-body-medium text-on-surface-variant">
      Some components require additional peer dependencies. They are shipped as separate entry points so they don't affect your bundle unless you use them.
    </p>

    <MCodeEditor :model-value="optionalCode" language="typescript" :readonly="true" :line-numbers="false" min-height="50px" max-height="200px" class="mb-6" />

    <div class="space-y-3">
      <MCard v-for="dep in optionalDeps" :key="dep.sub" class="p-4">
        <div class="mb-2 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <MIcon name="extension" :size="20" class="text-primary" />
            <code class="text-label-large font-medium text-primary">@m3ui-vue/m3ui-vue/{{ dep.sub }}</code>
          </div>
          <MIconButton
            :icon="copiedDep === dep.sub ? 'check' : 'content_copy'"
            :label="copiedDep === dep.sub ? 'Copied' : 'Copy install command'"
            variant="tonal"
            :size="32"
            @click="copyInstall(dep.install, dep.sub)"
          />
        </div>
        <p class="mb-2 text-body-medium text-on-surface-variant">{{ dep.components }}</p>
        <pre class="overflow-x-auto rounded-lg bg-surface-container p-3 text-body-small text-on-surface-variant"><code>{{ dep.install }}</code></pre>
      </MCard>
    </div>
  </div>
</template>
