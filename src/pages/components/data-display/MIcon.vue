<script setup lang="ts">
import { MIcon } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const iconProps: PropDef[] = [
  { name: 'name', type: 'string', description: 'Material Symbol name (e.g. "settings", "favorite") — required' },
  { name: 'size', type: 'number', default: '24', description: 'Icon size in px' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MIcon</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Renders a Material Symbols Outlined glyph by name. Color follows the surrounding text color
      (set it with a Tailwind text-* class).
    </p>

    <ComponentDemo
      title="Icons"
      description="Renders Material Symbols Outlined. Browse all icons at fonts.google.com/icons."
      :code="`<template>
  <MIcon name=&quot;home&quot; />
  <MIcon name=&quot;favorite&quot; :size=&quot;32&quot; class=&quot;text-error&quot; />
  <MIcon name=&quot;settings&quot; :size=&quot;32&quot; class=&quot;text-primary&quot; />
  <MIcon name=&quot;palette&quot; :size=&quot;32&quot; class=&quot;text-tertiary&quot; />
</template>`"
    >
      <MIcon name="home" :size="32" />
      <MIcon name="favorite" :size="32" class="text-error" />
      <MIcon name="settings" :size="32" class="text-primary" />
      <MIcon name="palette" :size="32" class="text-tertiary" />
      <MIcon name="notifications" :size="32" class="text-secondary" />
      <MIcon name="code" :size="32" class="text-on-surface-variant" />
      <MIcon name="widgets" :size="32" />
      <MIcon name="rocket_launch" :size="32" class="text-primary" />
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="Scale icons to any pixel size."
      :code="`<template>
  <MIcon name=&quot;star&quot; :size=&quot;16&quot; />
  <MIcon name=&quot;star&quot; :size=&quot;24&quot; />
  <MIcon name=&quot;star&quot; :size=&quot;32&quot; />
  <MIcon name=&quot;star&quot; :size=&quot;48&quot; />
</template>`"
    >
      <div class="flex flex-col items-start gap-3">
        <div class="flex items-center gap-2">
          <MIcon name="star" :size="16" class="text-primary" />
          <span class="text-label-small text-on-surface-variant">16</span>
        </div>
        <div class="flex items-center gap-2">
          <MIcon name="star" :size="24" class="text-primary" />
          <span class="text-label-small text-on-surface-variant">24</span>
        </div>
        <div class="flex items-center gap-2">
          <MIcon name="star" :size="32" class="text-primary" />
          <span class="text-label-small text-on-surface-variant">32</span>
        </div>
        <div class="flex items-center gap-2">
          <MIcon name="star" :size="48" class="text-primary" />
          <span class="text-label-small text-on-surface-variant">48</span>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="iconProps" />

    <ComponentPager current="MIcon" />
  </div>
</template>
