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
  { name: 'scrollbar', type: "'native' | 'indicator' | 'none'", default: "'native'", description: "The browser's scrollbar, Material 3's thin visual-only indicator, or none" },
  { name: 'scrollbarFade', type: 'boolean', default: 'true', description: 'With the indicator: show it only while scrolling (false keeps it visible)' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MScrollable</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A constrained scroll area — vertical, horizontal, or both directions. It can swap the browser's scrollbar for
      Material 3's thin scroll indicator, which only shows where you are (it can't be dragged), appears while you
      scroll and fades out shortly after.
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

    <ComponentDemo
      title="Scroll Indicator"
      description="scrollbar=&quot;indicator&quot; draws Material 3's 4px scroll indicator instead of the browser's scrollbar. Scroll to see it; it fades out 400ms after you stop. The second one stays visible."
      :code="`<template>
  <MScrollable max-height=&quot;180px&quot; scrollbar=&quot;indicator&quot;>
    Long content...
  </MScrollable>

  <MScrollable max-height=&quot;180px&quot; scrollbar=&quot;indicator&quot; :scrollbar-fade=&quot;false&quot;>
    Long content...
  </MScrollable>
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard v-for="fade in [true, false]" :key="String(fade)" variant="outlined" class="overflow-hidden">
          <MText variant="label-medium" class="border-b border-outline-variant px-3 py-2 text-on-surface-variant">{{ fade ? 'fades out' : 'always visible' }}</MText>
          <MScrollable max-height="180px" scrollbar="indicator" :scrollbar-fade="fade">
            <div class="space-y-3 p-3">
              <MText v-for="i in 14" :key="i" variant="body-small" color="on-surface-variant">Paragraph {{ i }}: the indicator only shows where you are in the content.</MText>
            </div>
          </MScrollable>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="scrollableProps" />

    <ComponentPager current="MScrollable" />
  </div>
</template>
