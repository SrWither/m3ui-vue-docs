<script setup lang="ts">
import { MAppBar, MIconButton, MCard } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const appBarProps: PropDef[] = [
  { name: 'color', type: "'surface' | 'primary' | 'secondary' | 'tertiary'", default: "'surface'", description: 'Background color' },
  { name: 'elevated', type: 'boolean', default: 'false', description: 'Add shadow elevation' },
  { name: 'dense', type: 'boolean', default: 'false', description: 'Compact height (48px vs 64px)' },
  { name: 'bordered', type: 'boolean', default: 'false', description: 'Add a bottom border (border-outline-variant)' },
]

const appBarSlots: SlotDef[] = [
  { name: '#leading', description: 'Leading area (e.g. back button, menu icon)' },
  { name: '#default', description: 'Main content (title text)' },
  { name: '#trailing', description: 'Trailing action buttons' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MAppBar</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A simple, generic slot-based app bar with leading, default, and trailing areas — a lighter-weight
      alternative to MTopAppBar for when you don't need its variant/title-row layouts.
    </p>

    <ComponentDemo
      title="App Bar"
      description="Simple slot-based app bar with leading, default, and trailing areas."
      :code="`<template>
  <MAppBar>
    <template #leading>
      <MIconButton icon=&quot;menu&quot; label=&quot;Menu&quot; />
    </template>
    <span class=&quot;text-title-large&quot;>App Title</span>
    <template #trailing>
      <MIconButton icon=&quot;search&quot; label=&quot;Search&quot; />
    </template>
  </MAppBar>
</template>`"
    >
      <div class="w-full space-y-4">
        <MCard variant="outlined" class="overflow-hidden">
          <MAppBar>
            <template #leading>
              <MIconButton icon="menu" label="Menu" />
            </template>
            <span class="text-title-large">My App</span>
            <template #trailing>
              <MIconButton icon="search" label="Search" />
              <MIconButton icon="more_vert" label="More" />
            </template>
          </MAppBar>
        </MCard>
        <MCard variant="outlined" class="overflow-hidden">
          <MAppBar color="primary" :elevated="true">
            <template #leading>
              <MIconButton icon="arrow_back" label="Back" />
            </template>
            <span class="text-title-large">Primary</span>
          </MAppBar>
        </MCard>
        <MCard variant="outlined" class="overflow-hidden">
          <MAppBar color="tertiary" :dense="true">
            <template #leading>
              <MIconButton icon="arrow_back" label="Back" />
            </template>
            <span class="text-title-medium">Dense Tertiary</span>
          </MAppBar>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Bordered"
      description="Use the bordered prop to add a bottom border instead of elevation."
      :code="`<MAppBar :bordered=&quot;true&quot;>
  <template #leading>
    <MIconButton icon=&quot;arrow_back&quot; label=&quot;Back&quot; />
  </template>
  <span class=&quot;text-title-large&quot;>Details</span>
  <template #trailing>
    <MIconButton icon=&quot;share&quot; label=&quot;Share&quot; />
  </template>
</MAppBar>`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="overflow-hidden">
          <MAppBar :bordered="true">
            <template #leading>
              <MIconButton icon="arrow_back" label="Back" />
            </template>
            <span class="text-title-large">Details</span>
            <template #trailing>
              <MIconButton icon="share" label="Share" />
              <MIconButton icon="more_vert" label="More" />
            </template>
          </MAppBar>
          <div class="flex h-16 items-center justify-center text-body-medium text-on-surface-variant">Content below</div>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="appBarProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="appBarSlots" />

    <ComponentPager current="MAppBar" />
  </div>
</template>
