<script setup lang="ts">
import { ref } from 'vue'
import { MBadge, MButton, MCard, MChip, MIcon, MSwitch, vSparkle } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const enabled = ref(true)

const types: TypeDef[] = [
  {
    name: 'SparkleValue',
    description: 'What v-sparkle accepts',
    fields: [
      { name: '(none) / true', type: 'undefined | true', description: 'Sparkles all the time, in the theme\'s primary and tertiary' },
      { name: 'false', type: 'false', description: 'No sparkles (same as { disabled: true })' },
      { name: "'hover'", type: "'hover' | 'always'", description: 'Only while the pointer is over it or focus is in it (same as { trigger })' },
      { name: "'#f5b400'", type: 'string', description: 'In that CSS color (same as { color })' },
      { name: '{ … }', type: 'SparkleOptions', description: 'Several settings at once' },
    ],
  },
  {
    name: 'SparkleOptions',
    fields: [
      { name: 'disabled', type: 'boolean', description: 'No sparkles while true' },
      { name: 'trigger', type: "'always' | 'hover'", description: "'always' (default), or only while hovered or focused" },
      { name: 'color', type: 'string | string[]', description: 'Any CSS colors or tokens, one picked per sparkle. Default: var(--color-primary) and var(--color-tertiary), so an MScheme around it recolors them' },
      { name: 'size', type: 'number', description: 'Sparkle size in px, each a bit bigger or smaller (14)' },
      { name: 'rate', type: 'number', description: 'Sparkles per second (3)' },
      { name: 'shapes', type: 'ShapeName[]', description: 'MShape\'s shapes instead of the four-pointed star (Heart, Sunny, Flower…)' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">v-sparkle</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Little stars that twinkle over an element, to draw the eye to something new or special: a new feature, a premium
      plan, a reward. They're drawn in a layer over the element that ignores clicks and screen readers, pause while
      it's off screen, and don't appear when the system asks for reduced motion.
    </p>

    <ComponentDemo
      title="Basic"
      description="Add v-sparkle to any element."
      :code="`<MButton v-sparkle icon=&quot;auto_awesome&quot;>Try the new editor</MButton>

<MCard v-sparkle variant=&quot;filled&quot; class=&quot;p-4&quot;>…</MCard>`"
      :script="`// With createM3UI() installed, v-sparkle is already registered.
// Without the plugin, import it: a vSparkle variable becomes v-sparkle in the template.
import { vSparkle } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex flex-wrap items-center justify-center gap-6">
        <MButton v-sparkle size="md" icon="auto_awesome">Try the new editor</MButton>
        <MCard v-sparkle variant="filled" class="w-64 p-4">
          <p class="text-title-medium">Premium</p>
          <p class="text-body-medium text-on-surface-variant">Unlimited projects and themes</p>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="On Hover"
      description="'hover' sparkles only while the pointer is over it, or keyboard focus is inside it."
      :code="`<MChip v-sparkle=&quot;'hover'&quot; icon=&quot;fiber_new&quot;>New</MChip>`"
    >
      <div class="flex flex-wrap justify-center gap-3">
        <MChip v-sparkle="'hover'" icon="fiber_new">New</MChip>
        <MChip v-sparkle="'hover'" icon="science">Beta</MChip>
        <MButton v-sparkle="'hover'" variant="outlined">Hover me</MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Colors, Shapes and Rate"
      description="Your own colors, MShape's shapes instead of stars, more of them or bigger."
      :code="`<span v-sparkle=&quot;{ color: ['#f5b400', '#ffd54f'], rate: 6 }&quot;>Gold member</span>
<MIcon v-sparkle=&quot;{ shapes: ['Heart'], color: '#e91e63', size: 12 }&quot; name=&quot;favorite&quot; filled />
<MBadge v-sparkle=&quot;{ shapes: ['Sunny', 'Flower'], size: 18 }&quot; :count=&quot;3&quot;>…</MBadge>`"
    >
      <div class="flex flex-wrap items-center justify-center gap-8">
        <span v-sparkle="{ color: ['#f5b400', '#ffd54f', '#ffecb3'], rate: 6 }" class="text-title-large font-medium">Gold member</span>
        <MIcon v-sparkle="{ shapes: ['Heart'], color: ['#e91e63', '#ff80ab'], size: 12 }" name="favorite" filled :size="40" class="text-[#e91e63]" />
        <MBadge v-sparkle="{ shapes: ['Sunny', 'Flower'], size: 18 }" :count="3">
          <MIcon name="redeem" :size="32" />
        </MBadge>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="On and Off"
      description="Bind false (or { disabled }) to stop it; the sparkles already out finish."
      :code="`<MSwitch v-model=&quot;enabled&quot; />
<MCard v-sparkle=&quot;enabled&quot;>Reward unlocked</MCard>`"
    >
      <div class="flex flex-wrap items-center justify-center gap-6">
        <MSwitch v-model="enabled" aria-label="Sparkles" />
        <MCard v-sparkle="enabled" variant="outlined" class="p-4 text-title-medium">Reward unlocked</MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Value</h3>
    <TypesTable :types="types" />

    <ComponentPager current="v-sparkle" />
  </div>
</template>
