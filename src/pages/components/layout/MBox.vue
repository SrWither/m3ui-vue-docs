<script setup lang="ts">
import { MBox, MGrid, MFlex } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const boxProps: PropDef[] = [
  { name: 'surface', type: "'default' | 'container' | 'container-low' | 'container-high' | 'container-highest' | 'primary-container' | 'secondary-container' | 'tertiary-container' | 'inverse'", description: 'Surface color variant' },
  { name: 'padding', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'none'", description: 'Padding size' },
  { name: 'rounded', type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'none'", description: 'Border radius' },
  { name: 'elevation', type: '0 | 1 | 2 | 3', default: '0', description: 'Shadow elevation level' },
  { name: 'border', type: 'boolean', default: 'false', description: 'Show border' },
  { name: 'tag', type: 'string', default: "'div'", description: 'HTML tag to render' },
]

const surfaceVariants = [
  'default', 'container', 'container-low', 'container-high', 'container-highest',
  'primary-container', 'secondary-container', 'tertiary-container', 'inverse',
] as const
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MBox</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Generic surface box with padding, radius, elevation, and border — a building block for ad-hoc layout that
      doesn't warrant a dedicated component.
    </p>

    <ComponentDemo
      title="Surface Variants"
      description="All available surface color options."
      :code="`<template>
  <MBox surface=&quot;container&quot; padding=&quot;md&quot; rounded=&quot;lg&quot;>
    Container surface
  </MBox>
</template>`"
    >
      <MGrid :cols="2" :sm="3" gap="md" class="w-full">
        <MBox
          v-for="s in surfaceVariants"
          :key="s"
          :surface="s"
          padding="md"
          rounded="lg"
          class="text-center text-body-small"
        >
          {{ s }}
        </MBox>
      </MGrid>
    </ComponentDemo>

    <ComponentDemo
      title="Elevation & Border"
      description="Shadow elevation levels and border option."
      :code="`<template>
  <MBox :elevation=&quot;1&quot; padding=&quot;md&quot; rounded=&quot;lg&quot;>Level 1</MBox>
  <MBox :elevation=&quot;2&quot; padding=&quot;md&quot; rounded=&quot;lg&quot;>Level 2</MBox>
  <MBox :border=&quot;true&quot; padding=&quot;md&quot; rounded=&quot;lg&quot;>Bordered</MBox>
</template>`"
    >
      <MFlex direction="row" gap="lg" wrap class="w-full">
        <MBox v-for="e in [0, 1, 2, 3]" :key="e" :elevation="(e as 0 | 1 | 2 | 3)" padding="md" rounded="lg" class="text-body-small">
          elevation={{ e }}
        </MBox>
        <MBox :border="true" padding="md" rounded="lg" class="text-body-small">
          border
        </MBox>
      </MFlex>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="boxProps" />

    <ComponentPager current="MBox" />
  </div>
</template>
