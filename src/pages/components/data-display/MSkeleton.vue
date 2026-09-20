<script setup lang="ts">
import { MSkeleton, MCard } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const skeletonProps: PropDef[] = [
  { name: 'variant', type: "'text' | 'circular' | 'rectangular' | 'rounded'", default: "'text'", description: 'Skeleton shape' },
  { name: 'width', type: 'string', description: 'CSS width (defaults to 100%, or 40px for circular)' },
  { name: 'height', type: 'string', description: 'CSS height (defaults to 14px for text, 40px for circular, 100px otherwise)' },
  { name: 'lines', type: 'number', default: '1', description: 'Number of text lines (text variant only) — the last line renders at 60% width' },
  { name: 'animation', type: "'pulse' | 'wave' | 'none'", default: "'pulse'", description: 'Animation style' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSkeleton</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A loading placeholder shape — text, circular, rectangular, or rounded — with pulse or wave animation.
    </p>

    <ComponentDemo
      title="Variants"
      description="Different skeleton shapes for various content types."
      :code="`<template>
  <MSkeleton variant=&quot;text&quot; />
  <MSkeleton variant=&quot;text&quot; :lines=&quot;3&quot; />
  <MSkeleton variant=&quot;circular&quot; width=&quot;48px&quot; height=&quot;48px&quot; />
  <MSkeleton variant=&quot;rectangular&quot; height=&quot;120px&quot; />
  <MSkeleton variant=&quot;rounded&quot; height=&quot;80px&quot; />
</template>`"
    >
      <div class="grid w-full gap-6 sm:grid-cols-2">
        <div class="space-y-4">
          <div>
            <p class="mb-2 text-label-medium text-on-surface-variant">Text (1 line)</p>
            <MSkeleton variant="text" />
          </div>
          <div>
            <p class="mb-2 text-label-medium text-on-surface-variant">Text (3 lines)</p>
            <MSkeleton variant="text" :lines="3" />
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <p class="mb-2 text-label-medium text-on-surface-variant">Circular</p>
            <MSkeleton variant="circular" width="48px" height="48px" />
          </div>
          <div>
            <p class="mb-2 text-label-medium text-on-surface-variant">Rectangular</p>
            <MSkeleton variant="rectangular" height="80px" />
          </div>
          <div>
            <p class="mb-2 text-label-medium text-on-surface-variant">Rounded</p>
            <MSkeleton variant="rounded" height="60px" />
          </div>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Animation"
      description="Pulse (default), wave (a moving shimmer highlight), or none."
      :code="`<MSkeleton variant=&quot;rectangular&quot; height=&quot;60px&quot; animation=&quot;pulse&quot; />
<MSkeleton variant=&quot;rectangular&quot; height=&quot;60px&quot; animation=&quot;wave&quot; />
<MSkeleton variant=&quot;rectangular&quot; height=&quot;60px&quot; animation=&quot;none&quot; />`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-3">
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">pulse</p>
          <MSkeleton variant="rectangular" height="60px" animation="pulse" />
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">wave</p>
          <MSkeleton variant="rectangular" height="60px" animation="wave" />
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">none</p>
          <MSkeleton variant="rectangular" height="60px" animation="none" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Card Skeleton"
      description="Compose skeletons to build loading placeholders for real UI."
      :code="`<template>
  <MCard class=&quot;w-64 p-4&quot;>
    <div class=&quot;flex items-center gap-3&quot;>
      <MSkeleton variant=&quot;circular&quot; width=&quot;40px&quot; height=&quot;40px&quot; />
      <div class=&quot;flex-1 space-y-2&quot;>
        <MSkeleton variant=&quot;text&quot; width=&quot;60%&quot; />
        <MSkeleton variant=&quot;text&quot; width=&quot;40%&quot; />
      </div>
    </div>
    <MSkeleton variant=&quot;rectangular&quot; height=&quot;120px&quot; class=&quot;mt-4&quot; />
    <MSkeleton variant=&quot;text&quot; :lines=&quot;2&quot; class=&quot;mt-3&quot; />
  </MCard>
</template>`"
    >
      <div class="flex flex-wrap gap-4">
        <MCard class="w-64 p-4">
          <div class="flex items-center gap-3">
            <MSkeleton variant="circular" width="40px" height="40px" />
            <div class="flex-1 space-y-2">
              <MSkeleton variant="text" width="60%" />
              <MSkeleton variant="text" width="40%" />
            </div>
          </div>
          <MSkeleton variant="rectangular" height="120px" class="mt-4" />
          <MSkeleton variant="text" :lines="2" class="mt-3" />
        </MCard>
        <MCard class="w-64 p-4">
          <div class="flex items-center gap-3">
            <MSkeleton variant="circular" width="40px" height="40px" animation="wave" />
            <div class="flex-1 space-y-2">
              <MSkeleton variant="text" width="60%" animation="wave" />
              <MSkeleton variant="text" width="40%" animation="wave" />
            </div>
          </div>
          <MSkeleton variant="rectangular" height="120px" class="mt-4" animation="wave" />
          <MSkeleton variant="text" :lines="2" class="mt-3" animation="wave" />
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="skeletonProps" />

    <ComponentPager current="MSkeleton" />
  </div>
</template>
