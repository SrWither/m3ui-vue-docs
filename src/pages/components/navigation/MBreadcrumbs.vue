<script setup lang="ts">
import { MBreadcrumbs } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const breadcrumbsProps: PropDef[] = [
  { name: 'items', type: 'BreadcrumbItem[]', description: 'Breadcrumb items (see the type below)' },
  { name: 'separator', type: 'string', default: "'chevron_right'", description: 'Material Symbol separator icon' },
]

const breadcrumbsEvents = [
  { name: 'select', payload: '[item: BreadcrumbItem, index: number]', description: 'Emitted when a non-last, non-disabled item is clicked' },
]

const breadcrumbsTypes: TypeDef[] = [
  {
    name: 'BreadcrumbItem',
    fields: [
      { name: 'label', type: 'string', required: true, description: 'Item text' },
      { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
      { name: 'to', type: 'string', description: 'Route path (not currently used to render a RouterLink — clicks emit select instead)' },
      { name: 'disabled', type: 'boolean', description: 'Renders as plain, non-interactive text' },
    ],
  },
]

const breadcrumbs = [
  { label: 'Home', icon: 'home', to: '/' },
  { label: 'Components', to: '/components/buttons' },
  { label: 'Navigation' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MBreadcrumbs</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A navigation trail showing the current page's location within a hierarchy, with icons and custom
      separators.
    </p>

    <ComponentDemo
      title="Breadcrumbs"
      description="Navigation trail with icons and custom separators. The last item renders as plain (non-interactive) bold text."
      :code="`<template>
  <MBreadcrumbs :items=&quot;[
    { label: 'Home', icon: 'home', to: '/' },
    { label: 'Components', to: '/components' },
    { label: 'Navigation' },
  ]&quot; />
</template>`"
    >
      <div class="w-full space-y-4">
        <MBreadcrumbs :items="breadcrumbs" />
        <MBreadcrumbs
          :items="[
            { label: 'Root' },
            { label: 'Folder' },
            { label: 'Subfolder' },
            { label: 'File.vue' },
          ]"
          separator="arrow_forward_ios"
        />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Disabled Item"
      description="An item with disabled: true renders as non-interactive dimmed text, even if it isn't the last item."
      :code="`<MBreadcrumbs :items=&quot;[
  { label: 'Home', icon: 'home' },
  { label: 'Archived Project', disabled: true },
  { label: 'Settings' },
]&quot; />`"
    >
      <MBreadcrumbs
        :items="[
          { label: 'Home', icon: 'home' },
          { label: 'Archived Project', disabled: true },
          { label: 'Settings' },
        ]"
      />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="breadcrumbsProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="breadcrumbsEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="breadcrumbsTypes" />

    <ComponentPager current="MBreadcrumbs" />
  </div>
</template>
