<script setup lang="ts">
import { MAspectRatio, MGrid, MCenter, MText } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const aspectRatioProps: PropDef[] = [
  { name: 'ratio', type: 'string | number', default: "'16/9'", description: 'Aspect ratio (e.g. "16/9", "4/3", 1) — passed straight through to the CSS aspect-ratio property' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MAspectRatio</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Maintains a consistent aspect ratio for media or containers.
    </p>

    <ComponentDemo
      title="Aspect Ratios"
      description="Maintain a consistent aspect ratio for media or containers."
      :code="`<template>
  <MAspectRatio ratio=&quot;16/9&quot;>
    <img src=&quot;...&quot; class=&quot;h-full w-full object-cover&quot; />
  </MAspectRatio>
</template>`"
    >
      <MGrid :cols="3" gap="md" class="w-full">
        <div v-for="r in ['1/1', '16/9', '4/3']" :key="r">
          <MText variant="label-small" color="on-surface-variant" class="mb-1">{{ r }}</MText>
          <MAspectRatio :ratio="r" class="rounded-lg bg-linear-to-br from-primary/30 to-tertiary/30">
            <MCenter class="h-full">
              <MText variant="body-small" color="on-surface-variant">{{ r }}</MText>
            </MCenter>
          </MAspectRatio>
        </div>
      </MGrid>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="aspectRatioProps" />

    <ComponentPager current="MAspectRatio" />
  </div>
</template>
