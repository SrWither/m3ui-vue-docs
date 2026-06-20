<script setup lang="ts">
import {
  MCard,
  MButton,
  MIcon,
  MSegmentedButton,
  useColorPalette,
  useTheme,
} from '@m3ui-vue/m3ui-vue'
import type { SegmentedOption } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'

const { palette, palettes, set } = useColorPalette()
const { theme } = useTheme()

const themeOptions: SegmentedOption[] = [
  { value: 'light', label: 'Light', icon: 'light_mode' },
  { value: 'dark', label: 'Dark', icon: 'dark_mode' },
  { value: 'system', label: 'System', icon: 'brightness_auto' },
]

const darkModeCode = `import { useTheme } from '@m3ui-vue/m3ui-vue'

const { theme, cycle } = useTheme()

// theme is a ref: 'light' | 'dark' | 'system'
theme.value = 'dark'

// or cycle through light → dark → system
cycle()`

const darkModeCssCode = `/* All M3UI tokens adapt automatically.
   No extra CSS needed — just toggle the .dark class. */

/* You can also use Tailwind's dark: modifier in your own code */
<div class="bg-surface dark:bg-surface-dim">
  <p class="text-on-surface">Adapts automatically</p>
</div>`

const installCode = `@import 'tailwindcss';
@import '@m3ui-vue/m3ui-vue/theme';
@import '@m3ui-vue/m3ui-vue/palettes';
@import '@m3ui-vue/m3ui-vue/styles';`

const usageCode = `import { useColorPalette } from '@m3ui-vue/m3ui-vue'

const { palette, palettes, set } = useColorPalette()

// Switch to teal
set('teal')`

const pluginCode = `import { createM3UI } from '@m3ui-vue/m3ui-vue'

app.use(createM3UI({ palette: 'teal' }))`

const customPaletteCode = `/* Add this to your main CSS file, after the m3ui imports */

/* Light mode */
[data-palette='brand'] {
  --color-primary: #0057B8;
  --color-on-primary: #ffffff;
  --color-primary-container: #D4E3FF;
  --color-on-primary-container: #001B3D;

  --color-secondary: #555F71;
  --color-on-secondary: #ffffff;
  --color-secondary-container: #D9E3F8;
  --color-on-secondary-container: #121C2B;

  --color-tertiary: #6E5676;
  --color-on-tertiary: #ffffff;
  --color-tertiary-container: #F8D8FE;
  --color-on-tertiary-container: #271430;

  --color-surface: #FAFBFF;
  --color-on-surface: #1A1C20;
  --color-surface-variant: #DFE2EB;
  --color-on-surface-variant: #43474E;

  --color-surface-dim: #DAD9E0;
  --color-surface-bright: #FAFBFF;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #F4F3FA;
  --color-surface-container: #EEECF4;
  --color-surface-container-high: #E8E7EF;
  --color-surface-container-highest: #E3E1E9;

  --color-background: #FAFBFF;
  --color-on-background: #1A1C20;
  --color-outline: #73777F;
  --color-outline-variant: #C3C6CF;
  --color-inverse-surface: #2F3036;
  --color-inverse-on-surface: #F1F0F7;
  --color-inverse-primary: #A6C8FF;
}

/* Dark mode */
[data-palette='brand'].dark {
  --color-primary: #A6C8FF;
  --color-on-primary: #003063;
  --color-primary-container: #00468C;
  --color-on-primary-container: #D4E3FF;

  --color-secondary: #BDC7DC;
  --color-on-secondary: #273141;
  --color-secondary-container: #3E4758;
  --color-on-secondary-container: #D9E3F8;

  --color-tertiary: #DBBCE2;
  --color-on-tertiary: #3E2846;
  --color-tertiary-container: #553F5D;
  --color-on-tertiary-container: #F8D8FE;

  --color-surface: #121318;
  --color-on-surface: #E3E1E9;
  --color-surface-variant: #43474E;
  --color-on-surface-variant: #C3C6CF;

  --color-surface-dim: #121318;
  --color-surface-bright: #38393F;
  --color-surface-container-lowest: #0D0E13;
  --color-surface-container-low: #1A1C20;
  --color-surface-container: #1E1F25;
  --color-surface-container-high: #292A2F;
  --color-surface-container-highest: #33343A;

  --color-background: #121318;
  --color-on-background: #E3E1E9;
  --color-outline: #8D9199;
  --color-outline-variant: #43474E;
  --color-inverse-surface: #E3E1E9;
  --color-inverse-on-surface: #2F3036;
  --color-inverse-primary: #0057B8;
}`

const customUsageCode = `import { useColorPalette } from '@m3ui-vue/m3ui-vue'

const { set } = useColorPalette()
set('brand') // activates your custom palette`

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

const allTokens = [
  { group: 'Primary', tokens: ['primary', 'on-primary', 'primary-container', 'on-primary-container'] },
  { group: 'Secondary', tokens: ['secondary', 'on-secondary', 'secondary-container', 'on-secondary-container'] },
  { group: 'Tertiary', tokens: ['tertiary', 'on-tertiary', 'tertiary-container', 'on-tertiary-container'] },
  { group: 'Surface', tokens: ['surface', 'on-surface', 'surface-variant', 'on-surface-variant', 'surface-dim', 'surface-bright', 'surface-container-lowest', 'surface-container-low', 'surface-container', 'surface-container-high', 'surface-container-highest'] },
  { group: 'Other', tokens: ['background', 'on-background', 'outline', 'outline-variant', 'inverse-surface', 'inverse-on-surface', 'inverse-primary'] },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Color Palettes</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      M3UI ships with 30 pre-built color palettes (including 10 monochromatic neutrals), each with light and dark variants.
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
      Each palette defines a full set of M3 design tokens. They update automatically when you switch palettes.
    </p>

    <MCard class="mb-10 overflow-hidden">
      <div v-for="group in allTokens" :key="group.group" class="border-b border-outline-variant last:border-b-0">
        <p class="bg-surface-container px-4 py-2 text-label-large font-medium text-on-surface-variant">{{ group.group }}</p>
        <div class="flex flex-wrap gap-0">
          <div
            v-for="token in group.tokens"
            :key="token"
            class="flex items-center gap-2 px-4 py-2"
            style="min-width: 220px"
          >
            <span
              class="h-7 w-7 shrink-0 rounded-full border border-outline-variant"
              :style="{ backgroundColor: `var(--color-${token})` }"
            />
            <code class="text-label-medium text-on-surface-variant">{{ token }}</code>
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

    <h3 class="mb-2 text-title-medium font-medium">1. Import the CSS</h3>
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

    <h3 class="mb-2 text-title-medium font-medium">2b. Or switch at runtime</h3>
    <div class="mb-10">
      <MCodeEditor
        :model-value="usageCode"
        language="typescript"
        :readonly="true"
        :line-numbers="false"
        min-height="60px"
        max-height="200px"
      />
    </div>

    <!-- Custom palette -->
    <h2 class="mb-4 text-headline-small font-medium">Custom Palette</h2>
    <p class="mb-4 text-body-large text-on-surface-variant">
      You can create your own palette by defining CSS custom properties under a
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">data-palette</code> attribute selector.
      Define both light and dark variants. Use the
      <a href="https://m3.material.io/theme-builder" target="_blank" class="text-primary underline">Material Theme Builder</a>
      to generate tokens from a seed color.
    </p>

    <h3 class="mb-2 text-title-medium font-medium">1. Define the palette in your CSS</h3>
    <div class="mb-6">
      <MCodeEditor
        :model-value="customPaletteCode"
        language="css"
        :readonly="true"
        :line-numbers="true"
        min-height="200px"
        max-height="500px"
      />
    </div>

    <h3 class="mb-2 text-title-medium font-medium">2. Activate it</h3>
    <div class="mb-6">
      <MCodeEditor
        :model-value="customUsageCode"
        language="typescript"
        :readonly="true"
        :line-numbers="false"
        min-height="60px"
        max-height="200px"
      />
    </div>

    <MCard class="mb-6 border-l-4 border-l-primary p-5">
      <p class="text-body-medium text-on-surface-variant">
        <strong class="text-on-surface">Tip:</strong> The palette ID in
        <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">[data-palette='brand']</code>
        must match the string you pass to <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">set('brand')</code>.
        You need at minimum the <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">primary</code>,
        <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">surface</code>, and
        <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">outline</code> token groups
        for components to render correctly.
      </p>
    </MCard>

    <!-- Dark mode -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">Dark Mode</h2>
    <p class="mb-4 text-body-large text-on-surface-variant">
      Every palette includes both light and dark variants. The
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">useTheme()</code>
      composable manages the current theme and persists it to localStorage.
    </p>

    <h3 class="mb-3 text-title-medium font-medium">Try it</h3>
    <div class="mb-6 flex items-center gap-4">
      <MSegmentedButton v-model="theme" :options="themeOptions" />
      <span class="text-body-medium text-on-surface-variant">
        Current: <strong class="text-on-surface">{{ theme }}</strong>
      </span>
    </div>

    <h3 class="mb-2 text-title-medium font-medium">Usage</h3>
    <MCodeEditor
      :model-value="darkModeCode"
      language="typescript"
      :readonly="true"
      :line-numbers="false"
      min-height="50px"
      max-height="250px"
      class="mb-6"
    />

    <MCard class="mb-6 flex items-start gap-3 p-4">
      <MIcon name="info" :size="22" class="mt-0.5 shrink-0 text-primary" />
      <div>
        <p class="text-body-medium text-on-surface-variant">
          <strong class="text-on-surface">How it works:</strong>
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">useTheme()</code>
          toggles the <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">.dark</code> class on
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">&lt;html&gt;</code>.
          All M3 color tokens automatically switch to their dark variants &mdash; no extra CSS needed.
          The <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">system</code> option
          follows the user's OS preference via
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">prefers-color-scheme</code>.
        </p>
      </div>
    </MCard>

    <h3 class="mb-2 text-title-medium font-medium">In your templates</h3>
    <MCodeEditor
      :model-value="darkModeCssCode"
      language="html"
      :readonly="true"
      :line-numbers="false"
      min-height="50px"
      max-height="200px"
    />
  </div>
</template>
