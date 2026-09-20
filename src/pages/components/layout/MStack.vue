<script setup lang="ts">
import { MStack, MButton, MCard } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const stackProps: PropDef[] = [
  { name: 'direction', type: "'column' | 'row'", default: "'column'", description: 'Stack direction' },
  { name: 'gap', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Gap between items (ignored when divider is true)' },
  { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'stretch'", description: 'Cross-axis alignment' },
  { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'", description: 'Main-axis alignment' },
  { name: 'wrap', type: 'boolean', default: 'false', description: 'Allow items to wrap' },
  { name: 'divider', type: 'boolean', default: 'false', description: 'Show dividers between items instead of a gap' },
  { name: 'inline', type: 'boolean', default: 'false', description: 'Use inline-flex' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MStack</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Flex stack with gap, alignment, and optional dividers between items.
    </p>

    <ComponentDemo
      title="Horizontal Stack"
      description="Row layout with gap and alignment control."
      :code="`<template>
  <MStack direction=&quot;row&quot; gap=&quot;sm&quot; align=&quot;center&quot;>
    <MButton>Save</MButton>
    <MButton variant=&quot;outlined&quot;>Cancel</MButton>
    <MButton variant=&quot;text&quot;>Reset</MButton>
  </MStack>
</template>`"
    >
      <MStack direction="row" gap="sm" align="center">
        <MButton>Save</MButton>
        <MButton variant="outlined">Cancel</MButton>
        <MButton variant="text">Reset</MButton>
      </MStack>
    </ComponentDemo>

    <ComponentDemo
      title="Vertical Stack"
      description="Column layout stacking items vertically."
      :code="`<template>
  <MStack direction=&quot;column&quot; gap=&quot;md&quot;>
    <MCard variant=&quot;outlined&quot; class=&quot;p-4&quot;>First</MCard>
    <MCard variant=&quot;outlined&quot; class=&quot;p-4&quot;>Second</MCard>
    <MCard variant=&quot;outlined&quot; class=&quot;p-4&quot;>Third</MCard>
  </MStack>
</template>`"
    >
      <MStack direction="column" gap="md" class="w-full max-w-sm">
        <MCard variant="outlined" class="p-4">First item</MCard>
        <MCard variant="outlined" class="p-4">Second item</MCard>
        <MCard variant="outlined" class="p-4">Third item</MCard>
      </MStack>
    </ComponentDemo>

    <ComponentDemo
      title="With Dividers"
      description="Automatic dividers between stack items — the gap prop is ignored in favor of the divider's own spacing."
      :code="`<template>
  <MStack direction=&quot;row&quot; :divider=&quot;true&quot; align=&quot;center&quot;>
    <span>Home</span>
    <span>About</span>
    <span>Contact</span>
  </MStack>
</template>`"
    >
      <MStack direction="row" :divider="true" align="center" class="text-body-medium">
        <span class="px-3">Home</span>
        <span class="px-3">About</span>
        <span class="px-3">Contact</span>
      </MStack>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="stackProps" />

    <ComponentPager current="MStack" />
  </div>
</template>
