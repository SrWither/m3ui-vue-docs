<script setup lang="ts">
import { MGrid } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const gridProps: PropDef[] = [
  { name: 'cols', type: '1 | 2 | 3 | 4 | 5 | 6 | 12', default: '1', description: 'Default column count' },
  { name: 'sm', type: '1 | 2 | 3 | 4 | 5 | 6 | 12', description: 'Columns at sm breakpoint' },
  { name: 'md', type: '1 | 2 | 3 | 4 | 5 | 6 | 12', description: 'Columns at md breakpoint' },
  { name: 'lg', type: '1 | 2 | 3 | 4 | 5 | 6 | 12', description: 'Columns at lg breakpoint' },
  { name: 'xl', type: '1 | 2 | 3 | 4 | 5 | 6 | 12', description: 'Columns at xl breakpoint' },
  { name: 'gap', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Gap between items' },
  { name: 'alignItems', type: "'start' | 'center' | 'end' | 'stretch'", default: "'stretch'", description: 'Vertical alignment' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MGrid</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A responsive CSS grid with per-breakpoint column counts.
    </p>

    <ComponentDemo
      title="Responsive Grid"
      description="Columns adapt from 1 on mobile to 3 on large screens."
      :code="`<template>
  <MGrid :cols=&quot;1&quot; :sm=&quot;2&quot; :lg=&quot;3&quot; gap=&quot;md&quot;>
    <div v-for=&quot;i in 6&quot; :key=&quot;i&quot; class=&quot;rounded-xl bg-primary-container p-4 text-center&quot;>
      Item {{ i }}
    </div>
  </MGrid>
</template>`"
    >
      <MGrid :cols="1" :sm="2" :lg="3" gap="md" class="w-full">
        <div v-for="i in 6" :key="i" class="rounded-xl bg-primary-container p-4 text-center text-on-primary-container">
          Item {{ i }}
        </div>
      </MGrid>
    </ComponentDemo>

    <ComponentDemo
      title="Gap Sizes"
      description="Control spacing between grid items."
      :code="`<template>
  <MGrid :cols=&quot;3&quot; gap=&quot;xs&quot;>...</MGrid>
  <MGrid :cols=&quot;3&quot; gap=&quot;lg&quot;>...</MGrid>
</template>`"
    >
      <div class="w-full space-y-6">
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">gap="xs"</p>
          <MGrid :cols="3" gap="xs">
            <div v-for="i in 3" :key="i" class="rounded-lg bg-secondary-container p-3 text-center text-on-secondary-container">{{ i }}</div>
          </MGrid>
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">gap="lg"</p>
          <MGrid :cols="3" gap="lg">
            <div v-for="i in 3" :key="i" class="rounded-lg bg-secondary-container p-3 text-center text-on-secondary-container">{{ i }}</div>
          </MGrid>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="gridProps" />

    <ComponentPager current="MGrid" />
  </div>
</template>
