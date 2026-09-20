<script setup lang="ts">
import { MSticky, MScrollable, MCard, MBox, MText } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const stickyProps: PropDef[] = [
  { name: 'top', type: 'string | number', default: '0', description: 'Sticky offset from top (number = px)' },
  { name: 'zIndex', type: 'number', default: '40', description: 'Z-index value' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSticky</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Sticks content to the top of its scroll container using <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">position: sticky</code>.
    </p>

    <ComponentDemo
      title="Sticky Header"
      description="Elements that stick to the top of their scroll container."
      :code="`<template>
  <MScrollable max-height=&quot;200px&quot;>
    <MSticky :top=&quot;0&quot;>
      <MBox surface=&quot;container-high&quot; padding=&quot;sm&quot;>
        Sticky Header
      </MBox>
    </MSticky>
    <div>Scrollable content...</div>
  </MScrollable>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MScrollable max-height="200px">
            <MSticky :top="0" :z-index="10">
              <MBox surface="container-high" padding="sm" class="border-b border-outline-variant">
                <MText variant="title-small" weight="medium">Sticky Header</MText>
              </MBox>
            </MSticky>
            <div class="space-y-2 p-4">
              <MText v-for="i in 15" :key="i" variant="body-medium" color="on-surface-variant">
                Scrollable content line {{ i }}
              </MText>
            </div>
          </MScrollable>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="stickyProps" />

    <ComponentPager current="MSticky" />
  </div>
</template>
