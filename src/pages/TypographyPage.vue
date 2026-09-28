<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { MCard, MButton, MChip, MTextField, MSegmentedButton } from '@m3ui-vue/m3ui-vue'
import type { SegmentedOption } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'

// ── Live font switcher (restored on leave so the rest of the site stays on Roboto) ──

const fontStacks: Record<string, string> = {
  roboto: "'Roboto', system-ui, -apple-system, sans-serif",
  system: 'system-ui, -apple-system, sans-serif',
  serif: "Georgia, 'Times New Roman', serif",
}

const fontOptions: SegmentedOption[] = [
  { value: 'roboto', label: 'Roboto' },
  { value: 'system', label: 'System UI' },
  { value: 'serif', label: 'Serif' },
]

const activeFont = ref('roboto')
const demoText = ref('Hello, Material 3')

watch(activeFont, (id) => {
  if (id === 'roboto') document.documentElement.style.removeProperty('--font-sans')
  else document.documentElement.style.setProperty('--font-sans', fontStacks[id])
})

onBeforeUnmount(() => document.documentElement.style.removeProperty('--font-sans'))

// ── Type scale ───────────────────────────────────────────────────────────────

const typeScale = [
  { cls: 'text-display-large', size: '57 / 64' },
  { cls: 'text-display-medium', size: '45 / 52' },
  { cls: 'text-display-small', size: '36 / 44' },
  { cls: 'text-headline-large', size: '32 / 40' },
  { cls: 'text-headline-medium', size: '28 / 36' },
  { cls: 'text-headline-small', size: '24 / 32' },
  { cls: 'text-title-large', size: '22 / 28' },
  { cls: 'text-title-medium', size: '16 / 24' },
  { cls: 'text-title-small', size: '14 / 20' },
  { cls: 'text-body-large', size: '16 / 24' },
  { cls: 'text-body-medium', size: '14 / 20' },
  { cls: 'text-body-small', size: '12 / 16' },
  { cls: 'text-label-large', size: '14 / 20' },
  { cls: 'text-label-medium', size: '12 / 16' },
  { cls: 'text-label-small', size: '11 / 16' },
]

// ── Code samples ─────────────────────────────────────────────────────────────

const defaultsCode = `/* theme.css */
@theme {
  --font-sans: 'Roboto', system-ui, -apple-system, sans-serif;
  --font-mono: 'Roboto Mono', ui-monospace, 'Fira Code', Consolas, monospace;
}`

const overrideCode = `@import 'tailwindcss';
@import '@m3ui-vue/m3ui-vue/theme';
@import '@m3ui-vue/m3ui-vue/palettes';
@import '@m3ui-vue/m3ui-vue/styles';

@theme {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}`

const fontsourceInstallCode = `pnpm add @fontsource/inter @fontsource/jetbrains-mono`

const fontsourceCssCode = `@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/700.css';
@import '@fontsource/jetbrains-mono/400.css';`

const fontFaceCode = `/* Font files in public/fonts/ */
@font-face {
  font-family: 'Brand Sans';
  src: url('/fonts/brand-sans-regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'Brand Sans';
  src: url('/fonts/brand-sans-medium.woff2') format('woff2');
  font-weight: 500;
  font-display: swap;
}

@theme {
  --font-sans: 'Brand Sans', system-ui, sans-serif;
}`

const runtimeCode = `// Switch the font at runtime — every component follows, including MChart's canvas
document.documentElement.style.setProperty('--font-sans', "'Inter', system-ui, sans-serif")

// Back to the theme default
document.documentElement.style.removeProperty('--font-sans')`
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Typography</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      M3UI uses Roboto by default, but it isn't required — every component reads its typeface from two CSS tokens,
      so you can swap in any font you like.
    </p>

    <!-- Tokens -->
    <h2 class="mb-4 text-headline-small font-medium">Font tokens</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">--font-sans</code> is used for all UI text;
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">--font-mono</code> for code in
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MCodeEditor</code> and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MMarkdown</code>.
      The library doesn't ship the font files — if Roboto isn't loaded, text falls back to the system font.
    </p>
    <div class="mb-10">
      <MCodeEditor :model-value="defaultsCode" language="css" :readonly="true" :line-numbers="false" min-height="50px" max-height="150px" />
    </div>

    <!-- Live preview -->
    <h2 class="mb-4 text-headline-small font-medium">Live Preview</h2>
    <MCard class="mb-10 p-6">
      <p class="mb-4 text-body-medium text-on-surface-variant">
        Pick a font — the whole page switches by changing <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">--font-sans</code> on <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">&lt;html&gt;</code>.
        It resets when you leave this page.
      </p>
      <MSegmentedButton v-model="activeFont" :options="fontOptions" class="mb-6" />
      <p class="mb-1 text-headline-medium">The quick brown fox</p>
      <p class="mb-4 text-body-large text-on-surface-variant">jumps over the lazy dog — 0123456789</p>
      <div class="flex flex-wrap items-center gap-3">
        <MButton>Primary</MButton>
        <MButton variant="tonal">Tonal</MButton>
        <MChip>Chip</MChip>
        <MTextField v-model="demoText" label="Text field" class="w-64" />
      </div>
    </MCard>

    <!-- Change the font -->
    <h2 class="mb-4 text-headline-small font-medium">Using a different font</h2>

    <h3 class="mb-2 text-title-medium font-medium">1. Load the font</h3>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      From a CDN (a Google Fonts <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">&lt;link&gt;</code>, same as in Setup), or self-hosted with
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">@fontsource/*</code> so no third-party requests are made:
    </p>
    <MCodeEditor :model-value="fontsourceInstallCode" language="javascript" :readonly="true" :line-numbers="false" min-height="50px" max-height="80px" class="mb-3" />
    <MCodeEditor :model-value="fontsourceCssCode" language="css" :readonly="true" :line-numbers="false" min-height="50px" max-height="150px" class="mb-3" />
    <p class="mb-3 text-body-medium text-on-surface-variant">
      Or with your own font files and <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">@font-face</code>:
    </p>
    <MCodeEditor :model-value="fontFaceCode" language="css" :readonly="true" :line-numbers="false" min-height="50px" max-height="400px" class="mb-6" />

    <h3 class="mb-2 text-title-medium font-medium">2. Override the tokens</h3>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      In your main stylesheet, after importing the theme:
    </p>
    <MCodeEditor :model-value="overrideCode" language="css" :readonly="true" :line-numbers="false" min-height="50px" max-height="250px" class="mb-6" />

    <h3 class="mb-2 text-title-medium font-medium">Switching at runtime</h3>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      There's no built-in font switcher (fonts need loading, unlike palettes), but since everything reads the token, one line does it:
    </p>
    <MCodeEditor :model-value="runtimeCode" language="javascript" :readonly="true" :line-numbers="false" min-height="50px" max-height="150px" class="mb-10" />

    <!-- Type scale -->
    <h2 class="mb-4 text-headline-small font-medium">Type Scale</h2>
    <p class="mb-4 text-body-medium text-on-surface-variant">
      The full M3 type scale is available as Tailwind utilities (size / line height in px).
    </p>
    <MCard class="overflow-hidden">
      <div
        v-for="t in typeScale"
        :key="t.cls"
        class="flex flex-col gap-1 border-b border-outline-variant px-4 py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-4"
      >
        <div class="w-48 shrink-0">
          <code class="text-label-medium text-primary">{{ t.cls }}</code>
          <span class="ml-2 text-label-small text-on-surface-variant">{{ t.size }}</span>
        </div>
        <span :class="t.cls" class="min-w-0 truncate">Material Design 3</span>
      </div>
    </MCard>
  </div>
</template>
