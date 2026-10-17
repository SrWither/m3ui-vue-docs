<script setup lang="ts">
import { MCard, MIcon, MIconButton, MSegmentedButton, useTheme } from '@m3ui-vue/m3ui-vue'
import type { Theme } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const { theme, cycle } = useTheme()

const themeIcon = { light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' } as const

const types: TypeDef[] = [
  {
    name: 'useTheme()',
    description: 'Returned object — module-level state, so every call site shares the same theme',
    fields: [
      { name: 'theme', type: 'Ref<Theme>', description: "The chosen scheme. Assign it to switch: theme.value = 'dark'" },
      { name: 'cycle', type: '() => void', description: 'Steps light → dark → system → light, for a single toggle button' },
    ],
  },
  {
    name: 'Theme',
    description: "'light' | 'dark' | 'system'",
    fields: [],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useTheme</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Light, dark or system color scheme. The choice is saved in localStorage and applied as the
      <code>dark</code> class on <code>&lt;html&gt;</code>, which every component and token follows.
    </p>

    <ComponentDemo
      title="Choosing a scheme"
      description="theme is a ref: bind it to a control, or assign it. 'system' follows the operating system and updates live when it changes."
      :code="`<MSegmentedButton
  v-model=&quot;theme&quot;
  :options=&quot;[
    { value: 'light', label: 'Light', icon: 'light_mode' },
    { value: 'dark', label: 'Dark', icon: 'dark_mode' },
    { value: 'system', label: 'System', icon: 'brightness_auto' },
  ]&quot;
/>`"
      :script="`import { useTheme } from '@m3ui-vue/m3ui-vue'

const { theme } = useTheme()`"
    >
      <MSegmentedButton
        :model-value="theme"
        :options="[
          { value: 'light', label: 'Light', icon: 'light_mode' },
          { value: 'dark', label: 'Dark', icon: 'dark_mode' },
          { value: 'system', label: 'System', icon: 'brightness_auto' },
        ]"
        @update:model-value="(v: string | number | (string | number)[]) => theme = v as Theme"
      />
    </ComponentDemo>

    <ComponentDemo
      title="One toggle button"
      description="cycle() steps through the three schemes, for a compact app bar button."
      :code="`<MIconButton
  :icon=&quot;{ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' }[theme]&quot;
  label=&quot;Change theme&quot;
  @click=&quot;cycle&quot;
/>`"
      :script="`import { useTheme } from '@m3ui-vue/m3ui-vue'

const { theme, cycle } = useTheme()`"
    >
      <div class="flex items-center gap-3">
        <MIconButton :icon="themeIcon[theme]" label="Change theme" variant="tonal" @click="cycle" />
        <span class="text-body-large">Current: <strong>{{ theme }}</strong></span>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Styling your own markup"
      description="Theme tokens switch by themselves. For anything else, Tailwind's dark: variant is wired to the same class."
      :code="`<!-- tokens follow the scheme with no extra classes -->
<div class=&quot;bg-surface-container text-on-surface&quot;>…</div>

<!-- dark: for one-off differences -->
<MIcon name=&quot;wb_sunny&quot; class=&quot;text-amber-500 dark:text-indigo-300&quot; />`"
    >
      <MCard variant="filled" class="flex items-center gap-3 p-4">
        <MIcon name="wb_sunny" :size="28" class="text-amber-500 dark:text-indigo-300" />
        <span class="text-body-large">This icon is amber in light mode and indigo in dark mode</span>
      </MCard>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>The saved scheme (<code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">localStorage['m3-theme']</code>, <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">'system'</code> when there's none) is applied as soon as the library loads, before any component mounts, so a reload doesn't flash the wrong colors</li>
        <li>Switching animates the colors for 300ms through the <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">theme-transitioning</code> class on <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">&lt;html&gt;</code>; the first paint doesn't animate</li>
        <li>The operating system's scheme is watched while at least one mounted component uses <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">useTheme()</code></li>
        <li>Palettes are a separate setting that combines with the scheme: see <RouterLink to="/composables/usecolorpalette" class="text-primary underline">useColorPalette</RouterLink></li>
      </ul>
    </MCard>

    <ComponentPager current="useTheme" />
  </div>
</template>
