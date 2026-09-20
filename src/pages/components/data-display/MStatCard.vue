<script setup lang="ts">
import { ref } from 'vue'
import { MStatCard, MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const statCardProps: PropDef[] = [
  { name: 'title', type: 'string', description: 'Stat label text — required' },
  { name: 'value', type: 'string | number', description: 'Main stat value — required' },
  { name: 'icon', type: 'string', description: 'Material Symbol icon shown in a colored container on the right' },
  { name: 'trend', type: 'number', description: 'Percentage change — positive shows green/up, negative red/down, zero neutral/flat' },
  { name: 'trendLabel', type: 'string', description: 'Text next to the trend indicator (e.g. "vs last month")' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error' | 'success'", default: "'primary'", description: 'Icon container color' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show a skeleton placeholder instead of the value' },
]

const statCardSlots: SlotDef[] = [
  { name: '#footer', description: 'Extra content appended after the trend indicator/label row (only rendered when trend, trendLabel, or this slot is present)' },
]

const statLoading = ref(false)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MStatCard</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A compact metric card — title, value, optional icon, and a trend indicator, with a built-in
      loading skeleton.
    </p>

    <ComponentDemo
      title="Stat Cards"
      description="Display key metrics with trend indicators and icons."
      :code="`<template>
  <MStatCard title=&quot;Revenue&quot; value=&quot;$12,450&quot; icon=&quot;payments&quot; :trend=&quot;12.5&quot; trend-label=&quot;vs last month&quot; />
  <MStatCard title=&quot;Users&quot; value=&quot;1,234&quot; icon=&quot;group&quot; :trend=&quot;-3.2&quot; trend-label=&quot;vs last week&quot; color=&quot;secondary&quot; />
  <MStatCard title=&quot;Errors&quot; value=&quot;23&quot; icon=&quot;error&quot; :trend=&quot;8&quot; color=&quot;error&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MStatCard title="Revenue" value="$12,450" icon="payments" :trend="12.5" trend-label="vs last month" />
        <MStatCard title="Users" value="1,234" icon="group" :trend="-3.2" trend-label="vs last week" color="secondary" />
        <MStatCard title="Errors" value="23" icon="error" :trend="8" color="error" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Loading State"
      description="Stat card with a skeleton placeholder while data loads."
      :code="`<template>
  <MStatCard title=&quot;Orders&quot; value=&quot;856&quot; icon=&quot;shopping_cart&quot; :loading=&quot;loading&quot; color=&quot;tertiary&quot; />
</template>`"
    >
      <div class="flex items-center gap-4">
        <div class="w-64">
          <MStatCard title="Orders" value="856" icon="shopping_cart" :loading="statLoading" color="tertiary" />
        </div>
        <MButton variant="tonal" @click="statLoading = !statLoading">
          {{ statLoading ? 'Show' : 'Toggle Loading' }}
        </MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Footer Slot"
      description="Use the #footer slot to append extra content next to the trend row — a link, a secondary metric, anything."
      :code="`<template>
  <MStatCard title=&quot;Signups&quot; value=&quot;312&quot; icon=&quot;person_add&quot; :trend=&quot;5.4&quot;>
    <template #footer>
      <a href=&quot;#&quot; class=&quot;text-label-medium text-primary underline&quot;>View report</a>
    </template>
  </MStatCard>
</template>`"
    >
      <div class="w-64">
        <MStatCard title="Signups" value="312" icon="person_add" :trend="5.4">
          <template #footer>
            <a href="#" class="text-label-medium text-primary underline" @click.prevent>View report</a>
          </template>
        </MStatCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="statCardProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="statCardSlots" />

    <ComponentPager current="MStatCard" />
  </div>
</template>
