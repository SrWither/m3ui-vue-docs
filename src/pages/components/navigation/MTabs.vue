<script setup lang="ts">
import { ref } from 'vue'
import { MTabs } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const tabsProps: PropDef[] = [
  { name: 'modelValue', type: 'string | number', description: 'Active tab value (v-model)' },
  { name: 'tabs', type: '{ value, label, icon?, disabled? }[]', description: 'Tab definitions' },
  { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Primary: short sliding underline shorter than the tab with a stretch animation. Secondary: full-width underline spanning the entire tab, text-only.' },
  { name: 'scrollable', type: 'boolean', default: 'false', description: "M3's Fixed vs Scrollable TabRow: false (default) evenly distributes tabs with no scroll (use for 2-5 tabs), true keeps each tab at its natural width and scrolls horizontally on overflow (use for many tabs)" },
]

const activeTab = ref<string | number>('home')
const secondaryTab = ref<string | number>('all')

// Hoisted rather than inline `:tabs="[...]"` — passing a fresh array literal
// straight in a template recreates it (a new reference) on every unrelated
// re-render of this page, which is exactly what surfaced MTabs' animation
// race in the first place (see CLAUDE.md).
const primaryTabsDemo = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'explore', label: 'Explore', icon: 'explore' },
  { value: 'library', label: 'Library', icon: 'video_library' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
]
const secondaryTabsDemo = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'done', label: 'Done' },
  { value: 'archived', label: 'Archived', disabled: true },
]
const fewTabsDemo = [
  { value: 'tab1', label: 'Overview' },
  { value: 'tab2', label: 'Features' },
  { value: 'tab3', label: 'Pricing' },
]
const manyTabsDemo = [
  { value: 'tab1', label: 'Overview' },
  { value: 'tab2', label: 'Features' },
  { value: 'tab3', label: 'Pricing' },
  { value: 'tab4', label: 'Reviews' },
  { value: 'tab5', label: 'Support' },
  { value: 'tab6', label: 'Changelog' },
  { value: 'tab7', label: 'Docs' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTabs</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Switches between different views or content sections. The indicator animates via two independent
      springs (offset and width), not a CSS transition — see the component source for details.
    </p>

    <ComponentDemo
      title="Primary Tabs"
      description="Underline indicator shorter than the tab, with a stretch animation when switching. Icons and text pushed up from the indicator."
      :code="`<MTabs
  v-model=&quot;active&quot;
  :tabs=&quot;[
    { value: 'home', label: 'Home', icon: 'home' },
    { value: 'explore', label: 'Explore', icon: 'explore' },
    { value: 'settings', label: 'Settings', icon: 'settings' },
  ]&quot;
/>`"
      :script="`const active = ref('home')`"
    >
      <div class="w-full">
        <MTabs v-model="activeTab" :tabs="primaryTabsDemo" />
        <div class="p-4 text-body-medium text-on-surface-variant">Active: {{ activeTab }}</div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Secondary Tabs"
      description="Full-width underline indicator spanning the entire tab. Text-only, simpler style. No icons."
      :code="`<MTabs
  v-model=&quot;active&quot;
  variant=&quot;secondary&quot;
  :tabs=&quot;[
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'done', label: 'Done' },
  ]&quot;
/>`"
    >
      <div class="w-full">
        <MTabs v-model="secondaryTab" variant="secondary" :tabs="secondaryTabsDemo" />
        <div class="p-4 text-body-medium text-on-surface-variant">Active: {{ secondaryTab }}</div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Fixed Tabs (default)"
      description="With 2-5 tabs the default (M3's Fixed TabRow) evenly distributes them across the available width and never scrolls."
      :code="`<MTabs v-model=&quot;active&quot; :tabs=&quot;fewTabs&quot; />`"
    >
      <div class="w-full max-w-md">
        <MTabs v-model="activeTab" :tabs="fewTabsDemo" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Many Tabs (Scrollable)"
      description="Pass scrollable to opt into M3's ScrollableTabRow instead: tabs keep their natural width and scroll horizontally when there are too many to fit."
      :code="`<MTabs v-model=&quot;active&quot; :tabs=&quot;manyTabs&quot; scrollable />`"
    >
      <div class="w-full max-w-md">
        <MTabs v-model="activeTab" scrollable :tabs="manyTabsDemo" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="tabsProps" />

    <ComponentPager current="MTabs" />
  </div>
</template>
