<script setup lang="ts">
import {
  MCard,
  MButton,
  useColorPalette,
} from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'

const { palette, palettes, set } = useColorPalette()

const installCode = `@import 'tailwindcss';
@import '@m3ui-vue/m3ui-vue/theme';
@import '@m3ui-vue/m3ui-vue/palettes';`

const usageCode = `import { useColorPalette } from '@m3ui-vue/m3ui-vue'

const { palette, palettes, set } = useColorPalette()

// Switch to teal
set('teal')`

const pluginCode = `import { createM3UI } from '@m3ui-vue/m3ui-vue'

app.use(createM3UI({ palette: 'teal' }))`

const colorTokens = [
  { name: 'primary', var: '--color-primary', desc: 'Main brand color' },
  { name: 'on-primary', var: '--color-on-primary', desc: 'Text/icons on primary' },
  { name: 'primary-container', var: '--color-primary-container', desc: 'Container using primary' },
  { name: 'secondary', var: '--color-secondary', desc: 'Supporting color' },
  { name: 'tertiary', var: '--color-tertiary', desc: 'Accent color' },
  { name: 'error', var: '--color-error', desc: 'Error states' },
  { name: 'surface', var: '--color-surface', desc: 'Background surfaces' },
  { name: 'on-surface', var: '--color-on-surface', desc: 'Text on surfaces' },
  { name: 'outline', var: '--color-outline', desc: 'Borders and dividers' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Color Palettes</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      M3UI ships with 20 pre-built color palettes, each with light and dark variants.
      Click any palette below to apply it — the entire page updates instantly.
    </p>

    <!-- Palette grid -->
    <h2 class="mb-4 text-headline-small font-medium">Available Palettes</h2>
    <div class="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
      <button
        v-for="p in palettes"
        :key="p.id"
        type="button"
        class="flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-all hover:shadow-elevation-1"
        :class="p.id === palette
          ? 'border-primary bg-primary-container/30'
          : 'border-outline-variant bg-surface-container'"
        @click="set(p.id)"
      >
        <span
          class="h-8 w-8 shrink-0 rounded-full shadow-sm"
          :style="{ backgroundColor: p.seed }"
        />
        <div class="text-left">
          <span class="text-label-large font-medium">{{ p.label }}</span>
          <span class="block text-label-small text-on-surface-variant">{{ p.id }}</span>
        </div>
      </button>
    </div>

    <!-- Color tokens preview -->
    <h2 class="mb-4 text-headline-small font-medium">Color Tokens</h2>
    <p class="mb-4 text-body-medium text-on-surface-variant">
      These are the main design tokens from the active palette. They update automatically when you switch palettes.
    </p>

    <MCard class="mb-10 overflow-hidden">
      <div class="grid gap-0 divide-y divide-outline-variant sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
        <div v-for="token in colorTokens" :key="token.name" class="flex items-center gap-3 px-4 py-3">
          <span
            class="h-8 w-8 shrink-0 rounded-full border border-outline-variant"
            :style="{ backgroundColor: `var(${token.var})` }"
          />
          <div>
            <code class="text-label-medium text-primary">{{ token.name }}</code>
            <p class="text-body-small text-on-surface-variant">{{ token.desc }}</p>
          </div>
        </div>
      </div>
    </MCard>

    <!-- Live demo -->
    <h2 class="mb-4 text-headline-small font-medium">Live Preview</h2>
    <MCard class="mb-10 p-6">
      <p class="mb-4 text-body-medium text-on-surface-variant">
        These components react to the active palette in real time:
      </p>
      <div class="flex flex-wrap items-center gap-3">
        <MButton>Primary</MButton>
        <MButton variant="tonal">Tonal</MButton>
        <MButton variant="outlined">Outlined</MButton>
        <MButton variant="elevated">Elevated</MButton>
        <MButton color="error">Error</MButton>
      </div>
    </MCard>

    <!-- Setup instructions -->
    <h2 class="mb-4 text-headline-small font-medium">Setup</h2>

    <h3 class="mb-2 text-title-medium font-medium">1. Import the palette CSS</h3>
    <div class="mb-6">
      <MCodeEditor
        :model-value="installCode"
        language="css"
        :readonly="true"
        :line-numbers="false"
        min-height="60px"
        max-height="200px"
      />
    </div>

    <h3 class="mb-2 text-title-medium font-medium">2a. Set palette via plugin</h3>
    <div class="mb-6">
      <MCodeEditor
        :model-value="pluginCode"
        language="typescript"
        :readonly="true"
        :line-numbers="false"
        min-height="60px"
        max-height="200px"
      />
    </div>

    <h3 class="mb-2 text-title-medium font-medium">2b. Or switch at runtime with the composable</h3>
    <div class="mb-6">
      <MCodeEditor
        :model-value="usageCode"
        language="typescript"
        :readonly="true"
        :line-numbers="false"
        min-height="60px"
        max-height="200px"
      />
    </div>
  </div>
</template>
