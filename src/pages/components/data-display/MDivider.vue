<script setup lang="ts">
import { MDivider } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const dividerProps: PropDef[] = [
  { name: 'vertical', type: 'boolean', default: 'false', description: 'Render as a vertical divider (fills the height of a flex container)' },
  { name: 'label', type: 'string', description: 'Text label in the middle of the divider (horizontal only)' },
  { name: 'inset', type: 'boolean', default: 'false', description: "Add left margin (ml-16) to align with content that has a leading icon" },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MDivider</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A thin separator line, horizontal or vertical, with an optional centered label.
    </p>

    <ComponentDemo
      title="Divider"
      description="Horizontal and vertical dividers with optional labels."
      :code="`<template>
  <MDivider />
  <MDivider label=&quot;OR&quot; />
  <MDivider :inset=&quot;true&quot; />
  <div class=&quot;flex h-10 items-center gap-4&quot;>
    <span>Left</span>
    <MDivider :vertical=&quot;true&quot; />
    <span>Right</span>
  </div>
</template>`"
    >
      <div class="w-full space-y-6">
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Default</p>
          <MDivider />
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">With label</p>
          <MDivider label="OR" />
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Inset</p>
          <MDivider :inset="true" />
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Vertical</p>
          <div class="flex h-10 items-center gap-4">
            <span class="text-body-medium">Left</span>
            <MDivider :vertical="true" />
            <span class="text-body-medium">Center</span>
            <MDivider :vertical="true" />
            <span class="text-body-medium">Right</span>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="dividerProps" />

    <ComponentPager current="MDivider" />
  </div>
</template>
