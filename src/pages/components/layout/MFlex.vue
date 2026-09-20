<script setup lang="ts">
import { MFlex, MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const flexProps: PropDef[] = [
  { name: 'direction', type: "'row' | 'column' | 'row-reverse' | 'column-reverse'", default: "'row'", description: 'Flex direction' },
  { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'stretch'", description: 'Cross-axis alignment (align-items)' },
  { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'", description: 'Main-axis alignment (justify-content)' },
  { name: 'gap', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'none'", description: 'Gap between items' },
  { name: 'wrap', type: 'boolean', default: 'false', description: 'Allow items to wrap' },
  { name: 'inline', type: 'boolean', default: 'false', description: 'Use inline-flex instead of flex' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFlex</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A thin, prop-driven wrapper around CSS flexbox — direction, alignment, justification, gap, and wrap.
    </p>

    <ComponentDemo
      title="Row Layout"
      description="Horizontal flex with gap and centering."
      :code="`<template>
  <MFlex direction=&quot;row&quot; gap=&quot;md&quot; align=&quot;center&quot;>
    <MButton>Action</MButton>
    <MButton variant=&quot;outlined&quot;>Cancel</MButton>
  </MFlex>
</template>`"
    >
      <MFlex direction="row" gap="md" align="center">
        <MButton>Action</MButton>
        <MButton variant="outlined">Cancel</MButton>
        <MButton variant="text">Reset</MButton>
      </MFlex>
    </ComponentDemo>

    <ComponentDemo
      title="Justify Content"
      description="Distribute items along the main axis."
      :code="`<template>
  <MFlex justify=&quot;between&quot;>...</MFlex>
  <MFlex justify=&quot;around&quot;>...</MFlex>
  <MFlex justify=&quot;evenly&quot;>...</MFlex>
</template>`"
    >
      <div class="w-full space-y-6">
        <div v-for="j in (['between', 'around', 'evenly'] as const)" :key="j">
          <p class="mb-2 text-label-medium text-on-surface-variant">justify="{{ j }}"</p>
          <MFlex :justify="j" align="center" class="rounded-lg bg-surface-container p-3">
            <div v-for="i in 3" :key="i" class="rounded-lg bg-primary-container px-4 py-2 text-on-primary-container">Item {{ i }}</div>
          </MFlex>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="flexProps" />

    <ComponentPager current="MFlex" />
  </div>
</template>
