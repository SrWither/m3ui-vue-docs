<script setup lang="ts">
import { MScrollable, MCard, MText, MBox, MFlex } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const scrollableProps: PropDef[] = [
  { name: 'direction', type: "'vertical' | 'horizontal' | 'both'", default: "'vertical'", description: 'Scroll direction' },
  { name: 'height', type: 'string', description: 'Fixed height (CSS value)' },
  { name: 'maxHeight', type: 'string', description: 'Maximum height (CSS value)' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MScrollable</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A constrained scroll area — vertical, horizontal, or both directions.
    </p>

    <ComponentDemo
      title="Scroll Directions"
      description="Constrained scroll areas in vertical, horizontal, or both directions."
      :code="`<template>
  <MScrollable max-height=&quot;150px&quot; direction=&quot;vertical&quot;>
    Long vertical content...
  </MScrollable>
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard variant="outlined" class="overflow-hidden">
          <MText variant="label-medium" class="border-b border-outline-variant px-3 py-2 text-on-surface-variant">vertical</MText>
          <MScrollable max-height="120px">
            <div class="space-y-1 p-3">
              <MText v-for="i in 12" :key="i" variant="body-small" color="on-surface-variant">Line {{ i }}</MText>
            </div>
          </MScrollable>
        </MCard>
        <MCard variant="outlined" class="overflow-hidden">
          <MText variant="label-medium" class="border-b border-outline-variant px-3 py-2 text-on-surface-variant">horizontal</MText>
          <MScrollable direction="horizontal" class="p-3">
            <MFlex gap="sm" class="w-max">
              <MBox v-for="i in 10" :key="i" surface="primary-container" padding="sm" rounded="md" class="shrink-0">
                <MText variant="body-small">Item {{ i }}</MText>
              </MBox>
            </MFlex>
          </MScrollable>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="scrollableProps" />

    <ComponentPager current="MScrollable" />
  </div>
</template>
