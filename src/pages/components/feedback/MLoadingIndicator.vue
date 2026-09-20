<script setup lang="ts">
import { MLoadingIndicator } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const loadingIndicatorProps: PropDef[] = [
  { name: 'size', type: 'number', default: '48', description: 'Overall footprint in px. The active shape sits inset within it (38/48 ratio) unless contained, where it scales to 55% of size.' },
  { name: 'contained', type: 'boolean', default: 'false', description: 'Wraps the shape in a filled container circle, and recolors the shape to the OnXContainer role instead of the bare X role' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error'", default: "'primary'", description: 'Active shape (and container, when contained) color' },
  { name: 'label', type: 'string', description: "Aria label for the indicator's status role — falls back to the locale string ('Loading') when omitted" },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MLoadingIndicator</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The M3 Expressive loading indicator — continuously morphs between rounded shapes (soft burst, cookie,
      pentagon, pill, sunny, oval) via an underdamped spring while slowly rotating. Comes in a plain and a
      contained (circle-backed) variant.
    </p>

    <ComponentDemo
      title="Loading indicators"
      description="A plain shape, per color, and the contained (circle-backed) variant."
      :code="`<template>
  <MLoadingIndicator />
  <MLoadingIndicator color=&quot;tertiary&quot; />
  <MLoadingIndicator contained />
  <MLoadingIndicator contained color=&quot;secondary&quot; :size=&quot;64&quot; />
</template>`"
      :script="`import { MLoadingIndicator } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex flex-wrap items-center gap-8">
        <div class="flex flex-col items-center gap-2">
          <MLoadingIndicator />
          <span class="text-label-small text-on-surface-variant">default</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MLoadingIndicator color="secondary" />
          <span class="text-label-small text-on-surface-variant">secondary</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MLoadingIndicator color="tertiary" />
          <span class="text-label-small text-on-surface-variant">tertiary</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MLoadingIndicator color="error" />
          <span class="text-label-small text-on-surface-variant">error</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MLoadingIndicator contained />
          <span class="text-label-small text-on-surface-variant">contained</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MLoadingIndicator contained color="secondary" :size="64" />
          <span class="text-label-small text-on-surface-variant">contained, 64px</span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="The size prop controls the overall footprint (the active shape scales down proportionally inside the container when contained)."
      :code="`<template>
  <MLoadingIndicator :size=&quot;24&quot; />
  <MLoadingIndicator :size=&quot;48&quot; />
  <MLoadingIndicator :size=&quot;80&quot; />
  <MLoadingIndicator contained :size=&quot;80&quot; />
</template>`"
      :script="`import { MLoadingIndicator } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex flex-wrap items-end gap-8">
        <div class="flex flex-col items-center gap-2">
          <MLoadingIndicator :size="24" />
          <span class="text-label-small text-on-surface-variant">24px</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MLoadingIndicator :size="48" />
          <span class="text-label-small text-on-surface-variant">48px</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MLoadingIndicator :size="80" />
          <span class="text-label-small text-on-surface-variant">80px</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MLoadingIndicator contained :size="80" />
          <span class="text-label-small text-on-surface-variant">contained, 80px</span>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="loadingIndicatorProps" />

    <ComponentPager current="MLoadingIndicator" />
  </div>
</template>
