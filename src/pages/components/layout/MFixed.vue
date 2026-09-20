<script setup lang="ts">
import { MCard, MIcon, MText } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const fixedProps: PropDef[] = [
  { name: 'placement', type: "'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'", description: 'Preset corner/edge placement' },
  { name: 'offset', type: 'string | number', default: '0', description: 'Distance from edges when using placement (applies to both axes)' },
  { name: 'offsetX', type: 'string | number', description: 'Horizontal offset — overrides offset for the X axis' },
  { name: 'offsetY', type: 'string | number', description: 'Vertical offset — overrides offset for the Y axis' },
  { name: 'top', type: 'string | number', description: 'Top offset (number = px)' },
  { name: 'right', type: 'string | number', description: 'Right offset' },
  { name: 'bottom', type: 'string | number', description: 'Bottom offset' },
  { name: 'left', type: 'string | number', description: 'Left offset' },
  { name: 'inset', type: 'boolean', default: 'false', description: 'Set all sides to 0' },
  { name: 'zIndex', type: 'number', default: '50', description: 'Z-index value' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFixed</h1>
    <p class="mb-6 text-body-large text-on-surface-variant">
      Same API as MAbsolute but uses <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">position: fixed</code>.
      Positions elements relative to the viewport, not a positioned ancestor.
    </p>

    <ComponentDemo
      title="Fixed Positioning"
      description="Use MFixed to pin elements to the viewport. Supports the same placement, offset, offsetX, and offsetY props as MAbsolute."
      :code="`<MFixed placement=&quot;bottom-right&quot; :offset-x=&quot;24&quot; :offset-y=&quot;24&quot;>
  <MFab icon=&quot;add&quot; />
</MFixed>

<MFixed placement=&quot;top-center&quot; :offset-y=&quot;16&quot;>
  <MAlert variant=&quot;filled&quot;>Fixed banner</MAlert>
</MFixed>`"
    >
      <MCard class="flex items-center gap-3 p-4">
        <MIcon name="info" :size="20" class="text-primary" />
        <MText variant="body-medium" color="on-surface-variant">
          MFixed shares the same props as MAbsolute — see the table below. Two differences: the default z-index is
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-body-small text-primary">50</code>
          (MAbsolute's is unset), and it uses
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-body-small text-primary">position: fixed</code>
          instead of absolute — so it isn't rendered live here, since a truly fixed element would float over the rest of this docs page.
        </MText>
      </MCard>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="fixedProps" />

    <ComponentPager current="MFixed" />
  </div>
</template>
