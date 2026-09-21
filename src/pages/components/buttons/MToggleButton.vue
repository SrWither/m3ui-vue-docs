<script setup lang="ts">
import { ref } from 'vue'
import { MToggleButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const toggleProps: PropDef[] = [
  { name: 'checked', type: 'boolean', description: 'Whether the button is checked/selected — v-model' },
  { name: 'variant', type: "'filled' | 'tonal' | 'outlined' | 'elevated'", default: "'filled'", description: 'Visual style, matching MButton\'s naming' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: "Same 5-tier expressive sizing as MButton" },
  { name: 'icon', type: 'string', description: 'Material Symbol icon name shown before the label' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
]

const toggleEvents = [
  { name: 'update:checked', payload: 'boolean', description: 'Emitted when clicked — powers v-model:checked' },
]

const favorite = ref(false)
const bold = ref(true)
const italic = ref(false)
const underline = ref(false)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MToggleButton</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      M3 Expressive's standalone toggle button — morphs its own shape between a pill and a squared
      corner on check, and squishes further while pressed, all on a real spring. Distinct from
      MSegmentedButton/MButtonGroup, which are groups of options — this is a single button.
    </p>

    <ComponentDemo
      title="Basic Toggle"
      description="Click to feel the shape morph — pill when unchecked, squared when checked, momentarily tighter while pressed."
      :code="`<template>
  <MToggleButton v-model:checked=&quot;favorite&quot; icon=&quot;favorite&quot;>
    {{ favorite ? 'Favorited' : 'Favorite' }}
  </MToggleButton>
</template>`"
    >
      <MToggleButton v-model:checked="favorite" icon="favorite">
        {{ favorite ? 'Favorited' : 'Favorite' }}
      </MToggleButton>
    </ComponentDemo>

    <ComponentDemo
      title="Variants"
      description="filled, tonal, elevated, and outlined — outlined is the odd one out: checked fills solid with an inverted surface color instead of a primary/secondary tone."
      :code="`<template>
  <MToggleButton v-model:checked=&quot;bold&quot; variant=&quot;filled&quot; icon=&quot;format_bold&quot; />
  <MToggleButton v-model:checked=&quot;italic&quot; variant=&quot;tonal&quot; icon=&quot;format_italic&quot; />
  <MToggleButton v-model:checked=&quot;underline&quot; variant=&quot;outlined&quot; icon=&quot;format_underlined&quot; />
</template>`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MToggleButton v-model:checked="bold" variant="filled" icon="format_bold">Bold</MToggleButton>
        <MToggleButton v-model:checked="italic" variant="tonal" icon="format_italic">Italic</MToggleButton>
        <MToggleButton v-model:checked="underline" variant="outlined" icon="format_underlined">Underline</MToggleButton>
        <MToggleButton :checked="true" variant="elevated" icon="star">Elevated</MToggleButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="The same 5-tier expressive sizing MButton uses (xs through xl)."
      :code="`<MToggleButton size=&quot;xs&quot; :checked=&quot;true&quot; icon=&quot;star&quot;>XS</MToggleButton>
<MToggleButton size=&quot;sm&quot; :checked=&quot;true&quot; icon=&quot;star&quot;>Small</MToggleButton>
<MToggleButton size=&quot;md&quot; :checked=&quot;true&quot; icon=&quot;star&quot;>Medium</MToggleButton>`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MToggleButton size="xs" :checked="true" icon="star">XS</MToggleButton>
        <MToggleButton size="sm" :checked="true" icon="star">Small</MToggleButton>
        <MToggleButton size="md" :checked="true" icon="star">Medium</MToggleButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="toggleProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="toggleEvents" />

    <ComponentPager current="MToggleButton" />
  </div>
</template>
