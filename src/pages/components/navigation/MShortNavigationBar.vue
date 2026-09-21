<script setup lang="ts">
import { ref } from 'vue'
import { MShortNavigationBar } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const navBarProps: PropDef[] = [
  { name: 'modelValue', type: 'string | number', description: 'Active item value, v-model' },
  { name: 'items', type: 'ShortNavBarItem[]', description: 'Array of nav bar items (see the type below)' },
  { name: 'arrangement', type: "'equal' | 'centered'", default: "'equal'", description: "'equal' fills the bar edge to edge (small screens); 'centered' groups items toward the middle instead, recommended for medium/landscape screens" },
  { name: 'iconPosition', type: "'top' | 'start'", default: "'top'", description: "'top' stacks the icon above the label; 'start' places it beside the label in one wider pill — typically paired with arrangement='centered'" },
]

const navBarEvents = [
  { name: 'update:modelValue', payload: 'string | number', description: 'Emitted when an item is clicked — powers v-model' },
]

const navBarTypes: TypeDef[] = [
  {
    name: 'ShortNavBarItem',
    fields: [
      { name: 'value', type: 'string | number', required: true, description: 'Unique item identifier' },
      { name: 'label', type: 'string', required: true, description: 'Item label' },
      { name: 'icon', type: 'string', required: true, description: 'Material Symbol icon name' },
      { name: 'badge', type: 'number', description: 'Numeric badge count shown on the icon' },
      { name: 'badgeDot', type: 'boolean', description: 'Shows a small dot badge instead of a count' },
    ],
  },
]

const smallVal = ref<string | number>('home')
const smallItems = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'search', label: 'Search', icon: 'search' },
  { value: 'notifications', label: 'Alerts', icon: 'notifications', badge: 3 },
  { value: 'profile', label: 'Profile', icon: 'person' },
]

const mediumVal = ref<string | number>('home')
const mediumItems = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'search', label: 'Search', icon: 'search' },
  { value: 'profile', label: 'Profile', icon: 'person' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MShortNavigationBar</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      M3 Expressive's shorter navigation bar (64dp, vs. MNavigationBar's classic 80dp) — a genuinely
      separate component, not just a size variant.
    </p>

    <ComponentDemo
      title="Equal Weight — Small Screens"
      description="The default: items fill the bar edge to edge with a top icon position, exactly like a phone in portrait mode."
      :code="`<MShortNavigationBar v-model=&quot;active&quot; :items=&quot;items&quot; />`"
      :script="`const active = ref('home')
const items = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'search', label: 'Search', icon: 'search' },
  { value: 'notifications', label: 'Alerts', icon: 'notifications', badge: 3 },
  { value: 'profile', label: 'Profile', icon: 'person' },
]`"
    >
      <div class="w-full max-w-sm overflow-hidden rounded-xl border border-outline-variant">
        <div class="flex h-28 items-center justify-center bg-surface-container text-body-medium text-on-surface-variant">
          {{ smallVal }} view
        </div>
        <MShortNavigationBar v-model="smallVal" :items="smallItems" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Centered + Start Icon — Medium Screens"
      description="arrangement='centered' groups items toward the middle instead of stretching them, and iconPosition='start' puts the icon beside the label in one pill — recommended together for a phone in landscape mode or a foldable/tablet."
      :code="`<MShortNavigationBar
  v-model=&quot;active&quot;
  :items=&quot;items&quot;
  arrangement=&quot;centered&quot;
  icon-position=&quot;start&quot;
/>`"
    >
      <div class="w-full overflow-hidden rounded-xl border border-outline-variant">
        <div class="flex h-28 items-center justify-center bg-surface-container text-body-medium text-on-surface-variant">
          {{ mediumVal }} view
        </div>
        <MShortNavigationBar v-model="mediumVal" :items="mediumItems" arrangement="centered" icon-position="start" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="navBarProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="navBarEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="navBarTypes" />

    <ComponentPager current="MShortNavigationBar" />
  </div>
</template>
