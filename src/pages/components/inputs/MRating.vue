<script setup lang="ts">
import { ref } from 'vue'
import { MRating } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const ratingVal = ref(3.5)

const iconExamples = [
  { icon: 'favorite', color: 'error', label: 'favorite', val: ref(3) },
  { icon: 'thumb_up', color: 'primary', label: 'thumb_up', val: ref(4) },
  { icon: 'local_fire_department', color: '#f97316', label: 'local_fire_department', val: ref(2.5) },
  { icon: 'bolt', color: '#eab308', label: 'bolt', val: ref(3.5) },
  { icon: 'sentiment_satisfied', color: 'tertiary', label: 'sentiment_satisfied', val: ref(2) },
  { icon: 'pets', color: 'secondary', label: 'pets', val: ref(4.5) },
  { icon: 'local_cafe', color: '#92400e', label: 'local_cafe', val: ref(1.5) },
  { icon: 'diamond', color: '#06b6d4', label: 'diamond', val: ref(3) },
]

const ratingEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'number', description: 'Emitted when the user rates by click, drag or keyboard (v-model). Dragging past the first icon emits 0' },
]

const ratingProps: PropDef[] = [
  { name: 'modelValue', type: 'number', description: 'Current rating (v-model)' },
  { name: 'max', type: 'number', default: '5', description: 'Maximum stars' },
  { name: 'size', type: 'number', default: '28', description: 'Star size in px' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Display-only: not focusable, exposed as role="img" with the value as its label' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'color', type: 'string', default: "'primary'", description: "One of the 4 M3 roles ('primary' | 'secondary' | 'tertiary' | 'error'), or any other CSS color string" },
  { name: 'icon', type: 'string', default: "'star'", description: 'Material Symbol icon' },
  { name: 'halfIncrements', type: 'boolean', default: 'false', description: 'Allow half-star values (click the left half of an icon). Fractional values always render exactly, with or without this prop' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MRating</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A star rating input with half increments and any Material Symbol icon. Not part of the
      official M3 spec, so it's built from M3 primitives: filled/outlined icon pairs, a state
      layer on hover/press, and a focus ring. Click or drag to rate (drag past the first icon to
      clear), or use the arrow keys, <kbd>Home</kbd> and <kbd>End</kbd> when focused.
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

    <ComponentDemo
      title="Custom icons"
      description="icon accepts any Material Symbol: the unfilled part uses its outlined glyph and the filled part uses its FILL 1 glyph, so half values work with every icon. Each row below is interactive with half increments."
      :code="`<MRating v-model=&quot;love&quot; icon=&quot;favorite&quot; color=&quot;error&quot; half-increments />
<MRating v-model=&quot;likes&quot; icon=&quot;thumb_up&quot; half-increments />
<MRating v-model=&quot;heat&quot; icon=&quot;local_fire_department&quot; color=&quot;#f97316&quot; half-increments />
<MRating v-model=&quot;energy&quot; icon=&quot;bolt&quot; color=&quot;#eab308&quot; half-increments />
<MRating v-model=&quot;mood&quot; icon=&quot;sentiment_satisfied&quot; color=&quot;tertiary&quot; half-increments />
<MRating v-model=&quot;pets&quot; icon=&quot;pets&quot; color=&quot;secondary&quot; half-increments />
<MRating v-model=&quot;coffee&quot; icon=&quot;local_cafe&quot; color=&quot;#92400e&quot; half-increments />
<MRating v-model=&quot;value&quot; icon=&quot;diamond&quot; color=&quot;#06b6d4&quot; half-increments />`"
    >
      <div class="grid gap-x-8 gap-y-3 sm:grid-cols-2">
        <div v-for="ex in iconExamples" :key="ex.icon" class="flex items-center gap-3">
          <MRating v-model="ex.val.value" :icon="ex.icon" :color="ex.color" half-increments />
          <span class="text-label-medium text-on-surface-variant">{{ ex.label }} · {{ ex.val.value }}</span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Fractional display"
      description="Any fractional value renders exactly, which suits showing an average. Works with any icon, not just star."
      :code="`<MRating :model-value=&quot;4.3&quot; readonly />
<MRating :model-value=&quot;2.7&quot; readonly icon=&quot;favorite&quot; color=&quot;error&quot; />`"
    >
      <div class="flex flex-wrap items-center gap-6">
        <MRating :model-value="4.3" readonly />
        <MRating :model-value="2.7" readonly icon="favorite" color="error" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Disabled"
      :code="`<MRating :model-value=&quot;3&quot; disabled />`"
    >
      <MRating :model-value="3" disabled />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="ratingProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="ratingEvents" />

    <ComponentPager current="MRating" />
  </div>
</template>
