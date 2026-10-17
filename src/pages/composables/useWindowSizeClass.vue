<script setup lang="ts">
import { ref } from 'vue'
import { MChip, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import AdaptiveFrame from '@/components/demos/AdaptiveFrame.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const win = useWindowSizeClass()

const box = ref<HTMLElement>()
const boxClass = useWindowSizeClass(box)

const widthClasses = [
  { name: 'compact', range: '< 600px', use: 'Phones in portrait. One pane, navigation bar' },
  { name: 'medium', range: '600 – 839px', use: 'Tablets in portrait, foldables. One pane, navigation rail' },
  { name: 'expanded', range: '840 – 1199px', use: 'Tablets in landscape, small desktops. Two panes' },
  { name: 'large', range: '1200 – 1599px', use: 'Desktops. Two panes, wider list/supporting pane' },
  { name: 'extra-large', range: '≥ 1600px', use: 'Large desktops' },
]
const heightClasses = [
  { name: 'compact', range: '< 480px', use: 'Phones in landscape' },
  { name: 'medium', range: '480 – 899px', use: 'Most tablets and desktops' },
  { name: 'expanded', range: '≥ 900px', use: 'Tall screens' },
]

const types: TypeDef[] = [
  {
    name: 'useWindowSizeClass(target?)',
    description: 'No argument: tracks the browser window. With an element (ref or getter): tracks that element\'s own size with a ResizeObserver',
    fields: [
      { name: 'width', type: 'Ref<number>', description: 'Current width in px' },
      { name: 'height', type: 'Ref<number>', description: 'Current height in px' },
      { name: 'widthClass', type: "Ref<'compact' | 'medium' | 'expanded' | 'large' | 'extra-large'>", description: 'M3 width size class' },
      { name: 'heightClass', type: "Ref<'compact' | 'medium' | 'expanded'>", description: 'M3 height size class' },
    ],
  },
  {
    name: 'widthSizeClass(px) / heightSizeClass(px)',
    description: 'Plain functions with the same breakpoints, for use outside components',
    fields: [
      { name: 'px', type: 'number', required: true, description: 'A width or height in px; returns the class name' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useWindowSizeClass</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Material 3 window size classes as reactive values. Instead of one mobile/desktop breakpoint, M3 sorts
      the available width into five classes and the height into three, and adaptive layouts decide by class:
      how many panes fit, which navigation to show. Breakpoints are the ones from Android's
      <code>WindowSizeClass</code>. MNavigationSuite, MListDetail and MSupportingPane are built on it.
    </p>

    <ComponentDemo
      title="Browser window"
      description="With no argument it tracks the window. Resize your browser to see it change."
      :code="`const { width, widthClass, heightClass } = useWindowSizeClass()`"
    >
      <div class="flex flex-wrap items-center gap-2">
        <MChip icon="width" tone="primary">{{ win.widthClass.value }} width</MChip>
        <MChip icon="height" tone="secondary">{{ win.heightClass.value }} height</MChip>
        <span class="text-body-medium tabular-nums text-on-surface-variant">{{ win.width.value }} × {{ win.height.value }}px</span>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="An element's own size"
      description="Pass an element to classify the space a component actually gets, for example a column, a dialog or a resizable panel. The adaptive layout components do this, so they work anywhere, not only full screen."
      :code="`<script setup>
const card = ref()
const { widthClass } = useWindowSizeClass(card)
</script>

<template>
  <div ref=&quot;card&quot;>
    <Compact v-if=&quot;widthClass === 'compact'&quot; />
    <Wide v-else />
  </div>
</template>`"
    >
      <AdaptiveFrame height="200px" initial="tablet">
        <div ref="box" class="flex h-full flex-col items-center justify-center gap-2 bg-surface-container-low p-4 text-center">
          <p class="text-headline-small text-on-surface">{{ boxClass.widthClass.value }}</p>
          <p class="text-body-medium text-on-surface-variant">
            {{ boxClass.widthClass.value === 'compact' ? 'One column, bottom navigation' : boxClass.widthClass.value === 'medium' ? 'One column, navigation rail' : 'Two panes side by side' }}
          </p>
        </div>
      </AdaptiveFrame>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Width classes</h3>
    <div class="mb-6 overflow-x-auto rounded-xl border border-outline-variant">
      <table class="w-full text-body-medium">
        <thead class="bg-surface-container text-left text-label-large text-on-surface-variant">
          <tr><th class="px-4 py-2">Class</th><th class="px-4 py-2">Width</th><th class="px-4 py-2">Typical use</th></tr>
        </thead>
        <tbody>
          <tr v-for="c in widthClasses" :key="c.name" class="border-t border-outline-variant">
            <td class="px-4 py-2"><code>{{ c.name }}</code></td>
            <td class="px-4 py-2 tabular-nums">{{ c.range }}</td>
            <td class="px-4 py-2 text-on-surface-variant">{{ c.use }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Height classes</h3>
    <div class="mb-6 overflow-x-auto rounded-xl border border-outline-variant">
      <table class="w-full text-body-medium">
        <thead class="bg-surface-container text-left text-label-large text-on-surface-variant">
          <tr><th class="px-4 py-2">Class</th><th class="px-4 py-2">Height</th><th class="px-4 py-2">Typical use</th></tr>
        </thead>
        <tbody>
          <tr v-for="c in heightClasses" :key="c.name" class="border-t border-outline-variant">
            <td class="px-4 py-2"><code>{{ c.name }}</code></td>
            <td class="px-4 py-2 tabular-nums">{{ c.range }}</td>
            <td class="px-4 py-2 text-on-surface-variant">{{ c.use }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <ComponentPager current="useWindowSizeClass" />
  </div>
</template>
