<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import InlineCode from '@/components/InlineCode.vue'

interface Role { name: string; use: string }

const groups: { group: string; note?: string; roles: Role[] }[] = [
  {
    group: 'Primary',
    roles: [
      { name: 'primary', use: 'Most prominent actions: filled buttons, active states, the FAB icon' },
      { name: 'on-primary', use: 'Text and icons on primary' },
      { name: 'primary-container', use: 'Less prominent fills: tonal buttons, selected chips, the FAB' },
      { name: 'on-primary-container', use: 'Text and icons on primary-container' },
    ],
  },
  {
    group: 'Secondary',
    roles: [
      { name: 'secondary', use: 'Less prominent accents' },
      { name: 'on-secondary', use: 'Text and icons on secondary' },
      { name: 'secondary-container', use: 'Selected items in lists and navigation, tonal fills' },
      { name: 'on-secondary-container', use: 'Text and icons on secondary-container' },
    ],
  },
  {
    group: 'Tertiary',
    roles: [
      { name: 'tertiary', use: 'Contrasting accents that balance primary and secondary' },
      { name: 'on-tertiary', use: 'Text and icons on tertiary' },
      { name: 'tertiary-container', use: 'Contrasting fills, e.g. a highlighted input or badge' },
      { name: 'on-tertiary-container', use: 'Text and icons on tertiary-container' },
    ],
  },
  {
    group: 'Error',
    roles: [
      { name: 'error', use: 'Errors and destructive actions' },
      { name: 'on-error', use: 'Text and icons on error' },
      { name: 'error-container', use: 'Error banners and backgrounds' },
      { name: 'on-error-container', use: 'Text and icons on error-container' },
    ],
  },
  {
    group: 'Success',
    note: 'A library extension, not an M3 role: the same in every palette, and not generated from a seed',
    roles: [
      { name: 'success', use: 'Success states' },
      { name: 'on-success', use: 'Text and icons on success' },
      { name: 'success-container', use: 'Success banners and backgrounds' },
      { name: 'on-success-container', use: 'Text and icons on success-container' },
    ],
  },
  {
    group: 'Surface',
    roles: [
      { name: 'surface', use: 'The default background of the app' },
      { name: 'on-surface', use: 'Main text and icons' },
      { name: 'on-surface-variant', use: 'Secondary text, icons, labels' },
      { name: 'surface-container-lowest', use: 'Lowest-emphasis container' },
      { name: 'surface-container-low', use: 'Low-emphasis containers, e.g. elevated cards' },
      { name: 'surface-container', use: 'Default containers: navigation bar, menus' },
      { name: 'surface-container-high', use: 'High-emphasis containers: dialogs, filled cards' },
      { name: 'surface-container-highest', use: 'Highest-emphasis containers: filled text fields' },
      { name: 'surface-dim', use: 'The dimmest surface, the same in light and dark' },
      { name: 'surface-bright', use: 'The brightest surface, the same in light and dark' },
      { name: 'surface-variant', use: 'Older M3 role, kept for compatibility; prefer the containers' },
    ],
  },
  {
    group: 'Outline',
    roles: [
      { name: 'outline', use: 'Important borders: outlined buttons and text fields' },
      { name: 'outline-variant', use: 'Decorative borders and dividers' },
    ],
  },
  {
    group: 'Inverse',
    roles: [
      { name: 'inverse-surface', use: 'Elements that contrast with the surface: snackbars, plain tooltips' },
      { name: 'inverse-on-surface', use: 'Text and icons on inverse-surface' },
      { name: 'inverse-primary', use: 'Actions on inverse-surface, e.g. a snackbar button' },
    ],
  },
  {
    group: 'Fixed',
    note: 'The same in light and dark, for elements that must not change color with the scheme',
    roles: [
      { name: 'primary-fixed', use: 'Fill' },
      { name: 'primary-fixed-dim', use: 'Stronger fill' },
      { name: 'on-primary-fixed', use: 'Text and icons on the fills' },
      { name: 'on-primary-fixed-variant', use: 'Lower-emphasis text and icons on the fills' },
      { name: 'secondary-fixed', use: 'Fill' },
      { name: 'secondary-fixed-dim', use: 'Stronger fill' },
      { name: 'on-secondary-fixed', use: 'Text and icons on the fills' },
      { name: 'on-secondary-fixed-variant', use: 'Lower-emphasis text and icons on the fills' },
      { name: 'tertiary-fixed', use: 'Fill' },
      { name: 'tertiary-fixed-dim', use: 'Stronger fill' },
      { name: 'on-tertiary-fixed', use: 'Text and icons on the fills' },
      { name: 'on-tertiary-fixed-variant', use: 'Lower-emphasis text and icons on the fills' },
    ],
  },
  {
    group: 'Other',
    roles: [
      { name: 'background', use: 'Older M3 role, the same as surface' },
      { name: 'on-background', use: 'Older M3 role, the same as on-surface' },
      { name: 'scrim', use: 'Overlay behind modal sheets and dialogs (used at 32% opacity)' },
      { name: 'shadow', use: 'Elevation shadows' },
    ],
  },
]

const utilities = ['bg', 'text', 'border', 'outline', 'ring', 'divide', 'fill', 'stroke', 'from / via / to', 'caret', 'accent', 'decoration', 'shadow']

const tailwindCode = `<div class="rounded-xl bg-primary-container p-4 text-on-primary-container">
  <p class="text-title-medium">Pairs: a fill and its on- color</p>
</div>

<div class="border border-outline-variant bg-surface-container-high">…</div>

<!-- opacity modifiers work too -->
<button class="hover:bg-on-surface/8 active:bg-on-surface/12">…</button>`

const cssCode = `.badge {
  background: var(--color-error);
  color: var(--color-on-error);
}

/* mix them like any CSS color */
.selected-row {
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
}`

const jsCode = `// the current value of a role, e.g. for a canvas or a chart
const primary = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary')
  .trim()`
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Colors</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Every Material 3 color role is a CSS variable, <code>--color-&lt;role&gt;</code>, and a Tailwind color of the same
      name, so <code>bg-primary</code>, <code>text-on-surface-variant</code> or <code>border-outline</code> work in your
      own markup. They follow the active palette and dark mode by themselves.
    </p>

    <h2 class="mb-4 text-headline-small font-medium">Using them</h2>
    <div class="mb-6 grid gap-4 lg:grid-cols-2">
      <div>
        <h3 class="mb-2 text-title-medium font-medium">Tailwind utilities</h3>
        <MCodeEditor :model-value="tailwindCode" language="html" :readonly="true" :line-numbers="false" min-height="60px" max-height="260px" />
      </div>
      <div>
        <h3 class="mb-2 text-title-medium font-medium">Plain CSS</h3>
        <MCodeEditor :model-value="cssCode" language="css" :readonly="true" :line-numbers="false" min-height="60px" max-height="260px" />
      </div>
    </div>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      Tailwind v4 makes each <code>--color-*</code> variable of the theme a color for every color utility:
    </p>
    <div class="mb-6 flex flex-wrap gap-2">
      <span
        v-for="u in utilities"
        :key="u"
        class="rounded-md bg-surface-container-high px-2 py-0.5 font-['Roboto_Mono'] text-body-small text-primary"
      >{{ u }}-*</span>
    </div>
    <MCard class="mb-6 flex items-start gap-3 p-4">
      <MIcon name="info" :size="22" class="mt-0.5 shrink-0 text-primary" />
      <p class="text-body-medium text-on-surface-variant">
        <strong class="text-on-surface">Pair a fill with its on- role:</strong> text on <code>primary-container</code> is
        <code>on-primary-container</code>, text on any surface is <code>on-surface</code> or <code>on-surface-variant</code>.
        Every palette keeps those pairs readable, in light and dark.
      </p>
    </MCard>
    <h3 class="mb-2 text-title-medium font-medium">From JavaScript</h3>
    <MCodeEditor :model-value="jsCode" language="typescript" :readonly="true" :line-numbers="false" min-height="60px" max-height="200px" class="mb-10" />

    <h2 class="mb-4 text-headline-small font-medium">All color roles</h2>
    <p class="mb-4 text-body-medium text-on-surface-variant">
      The swatches show the active palette. Click a variable or a class to copy it.
    </p>

    <MCard class="mb-10 overflow-hidden">
      <div v-for="g in groups" :key="g.group" class="border-b border-outline-variant last:border-b-0">
        <div class="bg-surface-container px-4 py-2">
          <p class="text-label-large font-medium text-on-surface-variant">{{ g.group }}</p>
          <p v-if="g.note" class="text-body-small text-on-surface-variant">{{ g.note }}</p>
        </div>
        <div
          v-for="r in g.roles"
          :key="r.name"
          class="flex items-start gap-3 border-t border-outline-variant/50 px-4 py-3 first:border-t-0"
        >
          <span class="mt-0.5 h-8 w-8 shrink-0 rounded-full border border-outline-variant" :style="{ backgroundColor: `var(--color-${r.name})` }" />
          <div class="flex min-w-0 flex-1 flex-col gap-1.5">
            <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span class="text-label-large">{{ r.name }}</span>
              <span class="text-body-small text-on-surface-variant">{{ r.use }}</span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <InlineCode :code="`--color-${r.name}`" />
              <InlineCode :code="`bg-${r.name}`" />
              <InlineCode :code="`text-${r.name}`" />
            </div>
          </div>
        </div>
      </div>
    </MCard>

    <p class="text-body-medium text-on-surface-variant">
      Picking or building a palette, and writing your own, is on the
      <RouterLink to="/styles/palettes" class="text-primary underline">Palettes</RouterLink> page.
    </p>
  </div>
</template>
