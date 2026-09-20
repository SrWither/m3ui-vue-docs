<script setup lang="ts">
import { MText } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const textProps: PropDef[] = [
  { name: 'variant', type: "'display-large' | 'display-medium' | 'display-small' | 'headline-large' | 'headline-medium' | 'headline-small' | 'title-large' | 'title-medium' | 'title-small' | 'body-large' | 'body-medium' | 'body-small' | 'label-large' | 'label-medium' | 'label-small'", default: "'body-medium'", description: 'Typography variant from the Material 3 type scale' },
  { name: 'tag', type: 'string', default: 'auto', description: 'HTML tag to render (auto-selected based on variant — h1/h2/h3 for display/headline, p for title/body, span for label)' },
  { name: 'color', type: "'on-surface' | 'on-surface-variant' | 'primary' | 'secondary' | 'tertiary' | 'error' | 'inherit'", default: "'inherit'", description: 'Text color' },
  { name: 'align', type: "'left' | 'center' | 'right'", default: "'left'", description: 'Text alignment' },
  { name: 'truncate', type: 'boolean', default: 'false', description: 'Truncate text with ellipsis on overflow' },
  { name: 'lines', type: '1 | 2 | 3 | 4 | 5 | 6', description: 'Clamp text to a specific number of lines' },
  { name: 'weight', type: "'regular' | 'medium' | 'bold'", description: 'Font weight override' },
]

const textVariants = [
  'display-large', 'display-medium', 'display-small',
  'headline-large', 'headline-medium', 'headline-small',
  'title-large', 'title-medium', 'title-small',
  'body-large', 'body-medium', 'body-small',
  'label-large', 'label-medium', 'label-small',
] as const
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MText</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Renders any of the 15 Material 3 typography variants, with an auto-selected semantic HTML tag.
    </p>

    <ComponentDemo
      title="Type Scale"
      description="All 15 Material 3 typography variants."
      :code="`<template>
  <MText variant=&quot;display-large&quot;>Display Large</MText>
  <MText variant=&quot;headline-medium&quot;>Headline Medium</MText>
  <MText variant=&quot;body-medium&quot;>Body Medium</MText>
  <MText variant=&quot;label-small&quot;>Label Small</MText>
</template>`"
    >
      <div class="w-full space-y-2">
        <MText v-for="v in textVariants" :key="v" :variant="v">{{ v }}</MText>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Colors & Weight"
      description="Different color and weight combinations."
      :code="`<template>
  <MText color=&quot;primary&quot; weight=&quot;bold&quot;>Primary Bold</MText>
  <MText color=&quot;secondary&quot; weight=&quot;medium&quot;>Secondary Medium</MText>
  <MText color=&quot;error&quot;>Error text</MText>
</template>`"
    >
      <div class="w-full space-y-2">
        <MText variant="body-large" color="primary" weight="bold">Primary Bold</MText>
        <MText variant="body-large" color="secondary" weight="medium">Secondary Medium</MText>
        <MText variant="body-large" color="tertiary">Tertiary Regular</MText>
        <MText variant="body-large" color="error">Error text</MText>
        <MText variant="body-large" color="on-surface">On Surface</MText>
        <MText variant="body-large" color="on-surface-variant">On Surface Variant</MText>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Truncation"
      description="Single-line truncation and multi-line clamping."
      :code="`<template>
  <MText :truncate=&quot;true&quot;>Long text that will be truncated...</MText>
  <MText :lines=&quot;2&quot;>Long text clamped to two lines...</MText>
</template>`"
    >
      <div class="w-full max-w-sm space-y-4">
        <div>
          <p class="mb-1 text-label-medium text-on-surface-variant">truncate</p>
          <MText :truncate="true">This is a very long piece of text that will be truncated with an ellipsis when it overflows the container width.</MText>
        </div>
        <div>
          <p class="mb-1 text-label-medium text-on-surface-variant">lines="2"</p>
          <MText :lines="2">This is a long paragraph of text that will be clamped to exactly two lines. Any content beyond the second line will be hidden and replaced with an ellipsis to indicate that there is more content available.</MText>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="textProps" />

    <ComponentPager current="MText" />
  </div>
</template>
