<script setup lang="ts">
import { ref } from 'vue'
import { MNavigationBar } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const navBarProps: PropDef[] = [
  { name: 'modelValue', type: 'string | number', description: 'Active item value, v-model' },
  { name: 'items', type: 'NavBarItem[]', description: 'Array of nav bar items (see the type below)' },
]

const navBarEvents = [
  { name: 'update:modelValue', payload: 'string | number', description: 'Emitted when an item is clicked — powers v-model' },
]

const navBarTypes: TypeDef[] = [
  {
    name: 'NavBarItem',
    fields: [
      { name: 'value', type: 'string | number', required: true, description: 'Unique item identifier' },
      { name: 'label', type: 'string', required: true, description: 'Item label' },
      { name: 'icon', type: 'string', required: true, description: 'Material Symbol icon name' },
      { name: 'badge', type: 'number', description: 'Numeric badge count shown on the icon' },
      { name: 'badgeDot', type: 'boolean', description: 'Shows a small dot badge instead of a count' },
    ],
  },
]

const navBarVal = ref<string | number>('home')
const navBarItems = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'search', label: 'Search', icon: 'search' },
  { value: 'notifications', label: 'Alerts', icon: 'notifications', badge: 3 },
  { value: 'profile', label: 'Profile', icon: 'person' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MNavigationBar</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A mobile bottom navigation bar with a pill indicator and badge support.
    </p>

    <ComponentDemo
      title="Bottom Navigation"
      description="Mobile bottom navigation bar with pill indicator and badges."
      :code="`<MNavigationBar v-model=&quot;active&quot; :items=&quot;items&quot; />`"
      :script="`const active = ref('home')
const items = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'search', label: 'Search', icon: 'search' },
  { value: 'notifications', label: 'Alerts', icon: 'notifications', badge: 3 },
  { value: 'profile', label: 'Profile', icon: 'person' },
]`"
    >
      <div class="w-full max-w-sm overflow-hidden rounded-xl border border-outline-variant">
        <div class="flex h-32 items-center justify-center bg-surface-container text-body-medium text-on-surface-variant">
          {{ navBarVal }} view
        </div>
        <MNavigationBar v-model="navBarVal" :items="navBarItems" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="navBarProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="navBarEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="navBarTypes" />

    <ComponentPager current="MNavigationBar" />
  </div>
</template>
