<script setup lang="ts">
import { MMasonry } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const masonryProps: PropDef[] = [
  { name: 'cols', type: 'number', default: '2', description: 'Default column count' },
  { name: 'smCols', type: 'number', description: 'Columns at sm breakpoint (640px)' },
  { name: 'mdCols', type: 'number', description: 'Columns at md breakpoint (768px)' },
  { name: 'lgCols', type: 'number', description: 'Columns at lg breakpoint (1024px)' },
  { name: 'gap', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Gap between items' },
]

const masonryItems = [
  { title: 'Card 1', height: 'h-24', color: 'bg-primary-container text-on-primary-container' },
  { title: 'Card 2', height: 'h-36', color: 'bg-secondary-container text-on-secondary-container' },
  { title: 'Card 3', height: 'h-20', color: 'bg-tertiary-container text-on-tertiary-container' },
  { title: 'Card 4', height: 'h-32', color: 'bg-primary-container text-on-primary-container' },
  { title: 'Card 5', height: 'h-28', color: 'bg-secondary-container text-on-secondary-container' },
  { title: 'Card 6', height: 'h-40', color: 'bg-tertiary-container text-on-tertiary-container' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMasonry</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Pinterest-style column layout that fills the shortest column first. Re-lays out on container resize via
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">ResizeObserver</code> and when the slotted content changes.
    </p>

    <ComponentDemo
      title="Masonry Layout"
      description="Pinterest-style layout that fills columns by shortest-first."
      :code="`<template>
  <MMasonry :cols=&quot;3&quot; gap=&quot;md&quot;>
    <div v-for=&quot;item in items&quot; :key=&quot;item.title&quot; class=&quot;rounded-xl bg-primary-container p-4&quot; :class=&quot;item.height&quot;>
      {{ item.title }}
    </div>
  </MMasonry>
</template>`"
    >
      <div class="w-full">
        <MMasonry :cols="3" gap="md">
          <div
            v-for="item in masonryItems"
            :key="item.title"
            class="flex items-center justify-center rounded-xl p-4 text-body-medium font-medium"
            :class="[item.height, item.color]"
          >
            {{ item.title }}
          </div>
        </MMasonry>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Responsive Columns"
      description="Different column counts per breakpoint."
      :code="`<template>
  <MMasonry :cols=&quot;1&quot; :sm-cols=&quot;2&quot; :lg-cols=&quot;4&quot; gap=&quot;sm&quot;>
    ...
  </MMasonry>
</template>`"
    >
      <div class="w-full">
        <MMasonry :cols="1" :sm-cols="2" :lg-cols="4" gap="sm">
          <div
            v-for="(item, i) in masonryItems"
            :key="i"
            class="flex items-center justify-center rounded-xl p-4 text-body-medium font-medium"
            :class="[item.height, item.color]"
          >
            {{ item.title }}
          </div>
        </MMasonry>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="masonryProps" />

    <ComponentPager current="MMasonry" />
  </div>
</template>
