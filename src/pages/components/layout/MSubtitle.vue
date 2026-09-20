<script setup lang="ts">
import { MSubtitle } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const subtitleProps: PropDef[] = [
  { name: 'size', type: "'large' | 'medium' | 'small'", default: "'large'", description: 'Subtitle size (maps to body-large/medium/small)' },
  { name: 'color', type: "'on-surface' | 'on-surface-variant' | 'primary' | 'secondary' | 'tertiary' | 'error' | 'inherit'", default: "'on-surface-variant'", description: 'Text color' },
  { name: 'align', type: "'left' | 'center' | 'right'", default: "'left'", description: 'Text alignment' },
  { name: 'truncate', type: 'boolean', default: 'false', description: 'Truncate text with ellipsis on overflow' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSubtitle</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Secondary text component with muted color by default — a thin wrapper around <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MText</code>.
    </p>

    <ComponentDemo
      title="Subtitle Sizes"
      description="Secondary text component with muted color by default."
      :code="`<template>
  <MSubtitle size=&quot;large&quot;>Large Subtitle</MSubtitle>
  <MSubtitle size=&quot;medium&quot;>Medium Subtitle</MSubtitle>
  <MSubtitle size=&quot;small&quot;>Small Subtitle</MSubtitle>
</template>`"
    >
      <div class="w-full space-y-3">
        <MSubtitle size="large">Large Subtitle</MSubtitle>
        <MSubtitle size="medium">Medium Subtitle</MSubtitle>
        <MSubtitle size="small">Small Subtitle</MSubtitle>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="subtitleProps" />

    <ComponentPager current="MSubtitle" />
  </div>
</template>
