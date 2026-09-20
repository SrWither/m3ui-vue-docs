<script setup lang="ts">
import { MCard } from '@m3ui-vue/m3ui-vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const fullscreenProps: PropDef[] = [
  { name: 'fixed', type: 'boolean', default: 'true', description: 'Use position: fixed to fill the viewport instead of the parent element' },
  { name: 'zIndex', type: 'number', default: '50', description: 'Z-index value' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFullscreen</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Fills the entire viewport (or parent when <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">fixed=false</code>).
      Useful for loading screens, splash pages, or modal backdrops.
    </p>

    <MCard class="overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Usage</p>
      <p class="mb-3 text-body-medium text-on-surface-variant">
        Not rendered live on this page — a truly fixed, viewport-filling element would cover the rest of the docs.
      </p>
      <pre class="rounded-lg bg-surface-container p-3 text-body-small"><code>&lt;MFullscreen&gt;
  &lt;MCenter class="h-full"&gt;
    &lt;MSpinner /&gt;
  &lt;/MCenter&gt;
&lt;/MFullscreen&gt;</code></pre>
    </MCard>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="fullscreenProps" />

    <ComponentPager current="MFullscreen" />
  </div>
</template>
