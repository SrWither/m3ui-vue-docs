<script setup lang="ts">
import { MTitle } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const titleProps: PropDef[] = [
  { name: 'size', type: "'large' | 'medium' | 'small'", default: "'large'", description: 'Title size (maps to headline-large/medium/small)' },
  { name: 'color', type: "'on-surface' | 'on-surface-variant' | 'primary' | 'secondary' | 'tertiary' | 'error' | 'inherit'", default: "'inherit'", description: 'Text color' },
  { name: 'align', type: "'left' | 'center' | 'right'", default: "'left'", description: 'Text alignment' },
  { name: 'truncate', type: 'boolean', default: 'false', description: 'Truncate text with ellipsis on overflow' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTitle</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Semantic heading component in three sizes — a thin wrapper around <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MText</code> at medium weight.
    </p>

    <ComponentDemo
      title="Title Sizes"
      description="Semantic title component in three sizes."
      :code="`<template>
  <MTitle size=&quot;large&quot;>Large Title</MTitle>
  <MTitle size=&quot;medium&quot;>Medium Title</MTitle>
  <MTitle size=&quot;small&quot;>Small Title</MTitle>
</template>`"
    >
      <div class="w-full space-y-3">
        <MTitle size="large">Large Title</MTitle>
        <MTitle size="medium">Medium Title</MTitle>
        <MTitle size="small">Small Title</MTitle>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="titleProps" />

    <ComponentPager current="MTitle" />
  </div>
</template>
