<script setup lang="ts">
import { ref } from 'vue'
import { MRating } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const ratingVal = ref(3.5)

const ratingProps: PropDef[] = [
  { name: 'modelValue', type: 'number', description: 'Current rating (v-model)' },
  { name: 'max', type: 'number', default: '5', description: 'Maximum stars' },
  { name: 'size', type: 'number', default: '28', description: 'Star size in px' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Read-only mode' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'color', type: 'string', default: "'primary'", description: "One of the 4 M3 roles ('primary' | 'secondary' | 'tertiary' | 'error'), or any other CSS color string" },
  { name: 'icon', type: 'string', default: "'star'", description: 'Material Symbol icon' },
  { name: 'halfIncrements', type: 'boolean', default: 'false', description: 'Allow half-star values' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MRating</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A star rating input with half increments and any Material Symbol icon.
    </p>

    <ComponentDemo
      title="Rating"
      description="Star rating with half increments and custom icons."
      :code="`<template>
  <MRating v-model=&quot;val&quot; />
  <MRating v-model=&quot;val&quot; :half-increments=&quot;true&quot; />
  <MRating :model-value=&quot;4&quot; :readonly=&quot;true&quot; icon=&quot;favorite&quot; color=&quot;error&quot; />
</template>`"
      :script="`import { MRating } from '@m3ui-vue/m3ui-vue'

const val = ref(3.5)`"
    >
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex flex-col items-center gap-1">
          <MRating v-model="ratingVal" />
          <span class="text-label-medium text-on-surface-variant">{{ ratingVal }}</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <MRating v-model="ratingVal" :half-increments="true" />
          <span class="text-label-medium text-on-surface-variant">half: {{ ratingVal }}</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <MRating :model-value="4" :readonly="true" icon="favorite" color="error" />
          <span class="text-label-medium text-on-surface-variant">readonly</span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom color & size"
      description="color accepts any CSS color string, not just the 4 M3 roles — and size controls the star's pixel dimensions."
      :code="`<MRating :model-value=&quot;4&quot; color=&quot;#f59e0b&quot; :size=&quot;36&quot; />`"
    >
      <MRating :model-value="4" color="#f59e0b" :size="36" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="ratingProps" />

    <ComponentPager current="MRating" />
  </div>
</template>
