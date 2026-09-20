<script setup lang="ts">
import { MCenter, MSpinner } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const centerProps: PropDef[] = [
  { name: 'inline', type: 'boolean', default: 'false', description: 'Use inline-flex instead of flex' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCenter</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Centers its children both horizontally and vertically.
    </p>

    <ComponentDemo
      title="Center Content"
      description="Centers its children both horizontally and vertically."
      :code="`<template>
  <MCenter class=&quot;h-40&quot;>
    <MSpinner />
  </MCenter>
</template>`"
    >
      <div class="w-full">
        <MCenter class="h-40 rounded-xl border border-outline-variant">
          <MSpinner />
        </MCenter>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="centerProps" />

    <ComponentPager current="MCenter" />
  </div>
</template>
