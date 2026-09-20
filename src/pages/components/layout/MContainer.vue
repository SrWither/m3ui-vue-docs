<script setup lang="ts">
import { MContainer } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const containerProps: PropDef[] = [
  { name: 'maxWidth', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'", default: "'lg'", description: 'Maximum width breakpoint' },
  { name: 'fluid', type: 'boolean', default: 'false', description: 'Full-width (no max constraint)' },
  { name: 'centered', type: 'boolean', default: 'true', description: 'Center horizontally with mx-auto' },
  { name: 'padding', type: 'boolean', default: 'true', description: 'Add responsive horizontal padding' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MContainer</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Constrains content width with responsive horizontal padding.
    </p>

    <ComponentDemo
      title="Max Width Breakpoints"
      description="Constrains content width with responsive horizontal padding."
      :code="`<template>
  <MContainer max-width=&quot;sm&quot;>Small container</MContainer>
  <MContainer max-width=&quot;md&quot;>Medium container</MContainer>
  <MContainer max-width=&quot;lg&quot;>Large (default)</MContainer>
</template>`"
    >
      <div class="w-full space-y-3">
        <MContainer v-for="size in (['sm', 'md', 'lg', 'xl'] as const)" :key="size" :max-width="size" class="rounded-lg bg-primary-container/30 py-3 text-center text-body-medium">
          max-width="{{ size }}"
        </MContainer>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Fluid"
      description="Full-width container without max-width constraint."
      :code="`<template>
  <MContainer :fluid=&quot;true&quot;>Full width content</MContainer>
</template>`"
    >
      <div class="w-full">
        <MContainer :fluid="true" class="rounded-lg bg-tertiary-container/30 py-3 text-center text-body-medium">
          Fluid — stretches to full width
        </MContainer>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="containerProps" />

    <ComponentPager current="MContainer" />
  </div>
</template>
