<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { MCard, MIcon, MIconButton, useToast } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import SetupExample from '@/components/SetupExample.vue'
// Shown as the step-5 snippet, so the code on the page is exactly what the live preview runs
import usageCode from '@/components/SetupExample.vue?raw'

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
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@400&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
  rel="stylesheet"
/>`

const fontsOfflineInstallCode = `pnpm add material-symbols @fontsource/roboto @fontsource/roboto-mono`

const fontsOfflineCssCode = `@import 'material-symbols/outlined.css';
@import '@fontsource/roboto/400.css';
@import '@fontsource/roboto/500.css';
@import '@fontsource/roboto/700.css';
@import '@fontsource/roboto-mono/400.css'; /* only if you use MCodeEditor / MMarkdown */`

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
@import '@m3ui-vue/m3ui-vue/palettes'; /* optional — 40 color palettes */
@import '@m3ui-vue/m3ui-vue/styles';   /* component transitions & animations */`

const pluginCode = `// main.ts
import { createApp } from 'vue'
import { createM3UI } from '@m3ui-vue/m3ui-vue'
import App from './App.vue'

const app = createApp(App)
app.use(createM3UI({ palette: 'teal' })) // optional — sets initial palette
// or generate the whole scheme from your brand color:
// app.use(createM3UI({ seed: '#0b57d0' }))
// several apps on one domain under different paths (example.com/admin, example.com/shop)?
// give each its own prefix so they don't share the stored theme and palette:
// app.use(createM3UI({ palette: 'teal', storagePrefix: 'admin' }))
app.mount('#app')`

const agentsCode = `UI components come from @m3ui-vue/m3ui-vue. Before using one, read its API in
node_modules/@m3ui-vue/m3ui-vue/dist/API.md (or https://m3ui.dev/llms.txt).`

const optionalCode = `// Only import what you need — these have their own entry points
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import { MChart } from '@m3ui-vue/m3ui-vue/chart'
import { MMarkdown } from '@m3ui-vue/m3ui-vue/markdown'
import { MRichTextEditor } from '@m3ui-vue/m3ui-vue/rich-text-editor'
import { MTerminal } from '@m3ui-vue/m3ui-vue/terminal'
import { MQRCode } from '@m3ui-vue/m3ui-vue/qrcode'
import { MBarcode } from '@m3ui-vue/m3ui-vue/barcode'`

const optionalDeps = [
  { sub: 'code-editor', components: 'MCodeEditor, MJsonEditor', install: 'pnpm add codemirror @codemirror/view @codemirror/state @codemirror/commands @codemirror/language @codemirror/lang-javascript @codemirror/lang-json @codemirror/lang-html @codemirror/lang-css @codemirror/lang-python @codemirror/lang-vue @codemirror/theme-one-dark' },
  { sub: 'chart', components: 'MChart', install: 'pnpm add chart.js vue-chartjs' },
  { sub: 'markdown', components: 'MMarkdown', install: 'pnpm add markdown-it' },
  { sub: 'rich-text-editor', components: 'MRichTextEditor', install: 'pnpm add @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-underline @tiptap/extension-text-align @tiptap/extension-link @tiptap/extension-image @tiptap/extension-color @tiptap/extension-text-style @tiptap/extension-highlight' },
  { sub: 'terminal', components: 'MTerminal', install: 'pnpm add @xterm/xterm @xterm/addon-fit' },
  { sub: 'qrcode', components: 'MQRCode', install: 'pnpm add qrcode-generator' },
  { sub: 'barcode', components: 'MBarcode', install: 'pnpm add jsbarcode' },
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

    <MCard class="mb-8 flex items-start gap-3 p-4">
      <MIcon name="dns" :size="22" class="mt-0.5 shrink-0 text-primary" />
      <div>
        <p class="text-body-medium font-medium text-on-surface">
          Using Nuxt? The <RouterLink to="/getting-started/nuxt" class="text-primary underline">Nuxt &amp; SSR</RouterLink>
          guide (beta) sets everything up with one module, server rendering included.
        </p>
      </div>
    </MCard>

    <MCard class="mb-8 flex items-start gap-3 p-4">
      <MIcon name="info" :size="22" class="mt-0.5 shrink-0 text-primary" />
      <div>
        <p class="text-body-medium font-medium text-on-surface">
          Scrollbars are thin and take the theme's colors wherever something scrolls; phones keep their own
          overlay scrollbars. Components that scroll as part of their design (tabs, thumbnail strips, carousels)
          hide theirs. To hide one in your own markup, for a row of chips that scrolls sideways for example, add
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">scrollbar-none</code>; it
          keeps scrolling with the wheel, touch and keys.
        </p>
      </div>
    </MCard>

    <!-- Step 1 -->
    <div class="mb-8 flex gap-4">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary text-label-large font-medium">1</span>
      <div class="flex-1">
        <h2 class="mb-2 text-title-large font-medium">Install the package</h2>
        <p class="mb-3 text-body-medium text-on-surface-variant">
          After installing, run <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">pnpm info @m3ui-vue/m3ui-vue version</code> and compare it with your
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">node_modules</code> to make sure you got the latest version — package managers can sometimes resolve an older cached version even with the <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">@latest</code> tag.
        </p>
        <MCodeEditor :model-value="installCode" language="javascript" :readonly="true" :line-numbers="false" min-height="50px" max-height="100px" />
      </div>
    </div>

    <!-- Step 2 -->
    <div class="mb-8 flex gap-4">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary text-label-large font-medium">2</span>
      <div class="flex-1">
        <h2 class="mb-2 text-title-large font-medium">Add the fonts</h2>
        <p class="mb-3 text-body-medium text-on-surface-variant">
          M3UI Vue ships the CSS rules but not the font files, so you load them yourself: <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">Material Symbols Outlined</code> for
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MIcon</code> and every icon-rendering component, and <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">Roboto</code> (plus <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">Roboto Mono</code> for code) as the default text font. Pick one of the two options below.
        </p>
        <p class="mb-2 text-label-large font-medium text-on-surface">Option A — Google Fonts CDN (default, simplest)</p>
        <p class="mb-3 text-body-medium text-on-surface-variant">
          Add this to the <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">&lt;head&gt;</code> of your <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">index.html</code>:
        </p>
        <MCodeEditor :model-value="fontsCode" language="html" :readonly="true" :line-numbers="false" min-height="50px" max-height="150px" class="mb-4" />
        <p class="mb-2 text-label-large font-medium text-on-surface">Option B — self-hosted (offline / no third-party requests)</p>
        <p class="mb-3 text-body-medium text-on-surface-variant">
          The CDN link needs network access to <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">fonts.googleapis.com</code>, which won't work offline or behind a restrictive firewall. Install
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">material-symbols</code> (icons) and <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">@fontsource/*</code> (text) — they ship the <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">.woff2</code> files locally — and import them from your main stylesheet instead:
        </p>
        <MCodeEditor :model-value="fontsOfflineInstallCode" language="javascript" :readonly="true" :line-numbers="false" min-height="50px" max-height="80px" class="mb-3" />
        <MCodeEditor :model-value="fontsOfflineCssCode" language="css" :readonly="true" :line-numbers="false" min-height="50px" max-height="160px" />
        <p class="mt-3 text-body-medium text-on-surface-variant">
          Roboto isn't required — without it, text falls back to the system font. To use a different typeface (build time or runtime), see
          <RouterLink to="/styles/typography" class="text-primary underline">Typography</RouterLink>.
        </p>
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
          The plugin sets an initial color palette, either one of the 40 built in or a scheme generated from your
          own color with <code>seed</code> (<RouterLink to="/palettes#seed" class="text-primary underline">dynamic color</RouterLink>).
          Without it, the default purple palette is used.
        </p>
        <p class="mb-3 text-body-medium text-on-surface-variant">
          The user's theme and palette are saved in localStorage, which is shared by the whole domain. If several apps
          live on the same domain under different paths (<code>example.com/admin</code>, <code>example.com/shop</code>),
          give each one its own <code>storagePrefix</code> so they don't share them (apps on different subdomains are
          already separate). More on the
          <RouterLink to="/composables/usecolorpalette" class="text-primary underline">useColorPalette</RouterLink> page.
        </p>
        <MCodeEditor :model-value="pluginCode" language="typescript" :readonly="true" :line-numbers="false" min-height="50px" max-height="300px" />
      </div>
    </div>

    <!-- Step 5 -->
    <div class="mb-10 flex gap-4">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary text-label-large font-medium">5</span>
      <div class="flex-1">
        <h2 class="mb-2 text-title-large font-medium">Use components</h2>
        <p class="mb-4 text-body-medium text-on-surface-variant">
          Import what you need from <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">@m3ui-vue/m3ui-vue</code> — every component is tree-shakeable.
          Here's a small profile form with validation, a loading state and a toast (<code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">useToast()</code> mounts its own host, no extra setup). Try it:
        </p>
        <!-- The example centers itself on a full screen; shrink that to fit the preview -->
        <div class="mb-3 overflow-hidden rounded-xl border border-outline-variant [&>div]:min-h-0 [&>div]:py-8">
          <SetupExample />
        </div>
        <MCodeEditor :model-value="usageCode" language="vue" :readonly="true" :line-numbers="false" min-height="50px" max-height="500px" />
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

    <!-- AI agents -->
    <h2 class="mt-10 mb-4 text-headline-small font-medium">Using an AI coding agent</h2>
    <p class="mb-4 text-body-medium text-on-surface-variant">
      The whole API (every component's props, events, slots and types, generated from the source) is available in
      formats made for LLMs, so an agent can look up exactly what it needs instead of guessing:
    </p>
    <ul class="mb-4 list-disc space-y-2 pl-6 text-body-medium text-on-surface-variant">
      <li>
        <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">node_modules/@m3ui-vue/m3ui-vue/dist/API.md</code>:
        ships with the package, always matching the version you installed, and works offline.
      </li>
      <li>
        <a href="/llms.txt" class="text-primary underline">m3ui.dev/llms.txt</a>: an index with setup and a link per component.
        Every component page also exists as Markdown: add <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">.md</code>
        to its address (e.g. <a href="/components/buttons/mbutton.md" class="text-primary underline">/components/buttons/mbutton.md</a>).
      </li>
      <li>
        <a href="/llms-full.txt" class="text-primary underline">m3ui.dev/llms-full.txt</a>: everything in one file.
      </li>
    </ul>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      To point your agent at it, add a line to your project's <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">CLAUDE.md</code>
      or <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">AGENTS.md</code>:
    </p>
    <MCodeEditor :model-value="agentsCode" language="plain" :readonly="true" :line-numbers="false" min-height="50px" max-height="200px" />

  </div>
</template>
