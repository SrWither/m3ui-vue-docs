<script setup lang="ts">
import { MTopAppBar, MIconButton, MCard, MResponsive } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const topAppBarProps: PropDef[] = [
  { name: 'title', type: 'string', description: 'App bar title' },
  { name: 'variant', type: "'center' | 'small' | 'medium' | 'large'", default: "'small'", description: '64dp small/center-aligned row, or a 112dp medium / 152dp large two-row layout with the title below' },
  { name: 'navigationIcon', type: 'string', description: 'Leading icon (e.g. menu, arrow_back)' },
  { name: 'navigationLabel', type: 'string', description: "Accessible label for the navigation icon — defaults to the locale's \"Menu\"; override when navigationIcon is a back arrow instead" },
  { name: 'elevated', type: 'boolean', default: 'false', description: 'Swaps both container color (surface → surface-container) and elevation (level 0 → level 2), matching the real M3 on-scroll container tokens rather than just adding a shadow' },
  { name: 'bordered', type: 'boolean', default: 'false', description: 'Add a bottom border (border-outline-variant)' },
]

const topAppBarEvents = [
  { name: 'navigation', description: 'Emitted when the default navigation icon button is clicked (not emitted when the #navigation slot is overridden — that content is fully custom)' },
]

const topAppBarSlots: SlotDef[] = [
  { name: '#title', description: 'Custom title content (default: renders the title prop)' },
  { name: '#navigation', description: 'Custom leading area (default: an MIconButton built from the navigationIcon prop)' },
  { name: '#actions', description: 'Trailing action buttons' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTopAppBar</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A top app bar in four M3 layouts — center-aligned, small, medium, and large — with a leading
      navigation icon and trailing actions.
    </p>

    <ComponentDemo
      title="Variants"
      description="Four top app bar layouts: center-aligned, small, medium, and large. Medium/large are 112dp/152dp two-row layouts with the title below the top row."
      :code="`<template>
  <MTopAppBar title=&quot;My App&quot; variant=&quot;small&quot; navigation-icon=&quot;menu&quot;>
    <template #actions>
      <MIconButton icon=&quot;search&quot; label=&quot;Search&quot; />
      <MIconButton icon=&quot;more_vert&quot; label=&quot;More&quot; />
    </template>
  </MTopAppBar>
</template>`"
    >
      <div class="w-full space-y-4">
        <MCard v-for="v in (['center', 'small', 'medium', 'large'] as const)" :key="v" variant="outlined" class="overflow-hidden">
          <MTopAppBar :title="`${v.charAt(0).toUpperCase() + v.slice(1)} variant`" :variant="v" navigation-icon="menu">
            <template #actions>
              <MIconButton icon="search" label="Search" />
              <MIconButton icon="more_vert" label="More" />
            </template>
          </MTopAppBar>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Elevated"
      description="elevated swaps the container to surface-container and adds shadow elevation 2, matching the on-scroll state — use it once the page content has scrolled under the bar."
      :code="`<MTopAppBar title=&quot;My App&quot; :elevated=&quot;true&quot; navigation-icon=&quot;menu&quot; />`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="overflow-hidden">
          <MTopAppBar title="Elevated" :elevated="true" navigation-icon="menu">
            <template #actions>
              <MIconButton icon="search" label="Search" />
            </template>
          </MTopAppBar>
          <div class="flex h-16 items-center justify-center text-body-medium text-on-surface-variant">Content below</div>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Bordered"
      description="Use the bordered prop to add a bottom border. Useful when the app bar sits above content without elevation."
      :code="`<MTopAppBar title=&quot;My App&quot; :bordered=&quot;true&quot; navigation-icon=&quot;arrow_back&quot;>
  <template #actions>
    <MIconButton icon=&quot;more_vert&quot; label=&quot;More&quot; />
  </template>
</MTopAppBar>`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="overflow-hidden">
          <MTopAppBar title="Bordered" :bordered="true" navigation-icon="arrow_back">
            <template #actions>
              <MIconButton icon="search" label="Search" />
              <MIconButton icon="more_vert" label="More" />
            </template>
          </MTopAppBar>
          <div class="flex h-16 items-center justify-center text-body-medium text-on-surface-variant">Content below</div>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Navigation Slot"
      description="Use the #navigation slot for full control over the leading area — for example, to conditionally show a menu icon only on mobile. When overridden this way, the navigation event is no longer emitted by MTopAppBar itself."
      :code="`<MTopAppBar title=&quot;Dashboard&quot;>
  <template #navigation>
    <MResponsive hide=&quot;md-up&quot; tag=&quot;span&quot;>
      <MIconButton icon=&quot;menu&quot; label=&quot;Menu&quot; @click=&quot;drawerOpen = true&quot; />
    </MResponsive>
  </template>
  <template #actions>
    <MIconButton icon=&quot;notifications&quot; label=&quot;Alerts&quot; />
  </template>
</MTopAppBar>`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="overflow-hidden">
          <MTopAppBar title="Dashboard" :bordered="true">
            <template #navigation>
              <MIconButton icon="menu" label="Menu" />
            </template>
            <template #actions>
              <MIconButton icon="notifications" label="Alerts" />
              <MIconButton icon="more_vert" label="More" />
            </template>
          </MTopAppBar>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="topAppBarProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="topAppBarEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="topAppBarSlots" />

    <ComponentPager current="MTopAppBar" />
  </div>
</template>
