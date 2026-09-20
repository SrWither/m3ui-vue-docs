<script setup lang="ts">
import { MEmptyState, MCard, MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const emptyStateProps: PropDef[] = [
  { name: 'icon', type: 'string', default: "'inbox'", description: 'Material Symbol icon' },
  { name: 'title', type: 'string', description: 'Title text — required' },
  { name: 'description', type: 'string', description: 'Supporting description' },
  { name: 'compact', type: 'boolean', default: 'false', description: 'Smaller variant (24px icon in a 48px circle, less padding)' },
]

const emptyStateSlots: SlotDef[] = [
  { name: '#actions', description: 'Action buttons rendered below the description' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MEmptyState</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A placeholder for empty views — icon, title, description, and optional action buttons.
    </p>

    <ComponentDemo
      title="Empty State"
      description="Placeholder for empty views with optional action buttons."
      :code="`<template>
  <MEmptyState
    icon=&quot;search_off&quot;
    title=&quot;No results found&quot;
    description=&quot;Try adjusting your search or filters.&quot;
  >
    <template #actions>
      <MButton variant=&quot;tonal&quot;>Clear filters</MButton>
    </template>
  </MEmptyState>
</template>`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="overflow-hidden">
          <MEmptyState
            icon="search_off"
            title="No results found"
            description="Try adjusting your search or filters to find what you're looking for."
          >
            <template #actions>
              <MButton variant="tonal" icon="filter_alt_off">Clear filters</MButton>
            </template>
          </MEmptyState>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Compact"
      description="A smaller empty state for inline use."
      :code="`<template>
  <MEmptyState icon=&quot;inbox&quot; title=&quot;No messages&quot; :compact=&quot;true&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard variant="outlined" class="overflow-hidden">
          <MEmptyState icon="inbox" title="No messages" description="Your inbox is empty." :compact="true" />
        </MCard>
        <MCard variant="outlined" class="overflow-hidden">
          <MEmptyState icon="notifications_off" title="No notifications" :compact="true" />
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="emptyStateProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="emptyStateSlots" />

    <ComponentPager current="MEmptyState" />
  </div>
</template>
