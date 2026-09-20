<script setup lang="ts">
import { MEmoji } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const emojiProps: PropDef[] = [
  { name: 'emoji', type: 'string', description: 'The emoji character to display — required' },
  { name: 'size', type: 'number', default: '24', description: 'Size in pixels (sets font-size, width, and height)' },
  { name: 'label', type: 'string', description: 'Accessible label — when set, adds role="img" and aria-label' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MEmoji</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Renders a single emoji character at a fixed pixel size, with optional accessible labeling.
    </p>

    <ComponentDemo
      title="Emoji Display"
      description="Render an emoji at any size with accessible labeling."
      :code="`<MEmoji emoji=&quot;🚀&quot; :size=&quot;48&quot; label=&quot;Rocket&quot; />`"
      :script="`import { MEmoji } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex items-end gap-4">
        <MEmoji emoji="😀" :size="20" />
        <MEmoji emoji="🚀" :size="32" />
        <MEmoji emoji="🎉" :size="48" />
        <MEmoji emoji="🐶" :size="64" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="emojiProps" />

    <ComponentPager current="MEmoji" />
  </div>
</template>
