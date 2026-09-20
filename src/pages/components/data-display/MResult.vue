<script setup lang="ts">
import { MResult, MCard, MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const resultProps: PropDef[] = [
  { name: 'status', type: "'success' | 'error' | 'warning' | 'info' | '404' | '403' | '500'", description: 'Result type with a predefined icon, colors, and default title/description text — required. The three HTTP statuses also render a large code above the icon' },
  { name: 'title', type: 'string', description: 'Custom title (overrides the status default)' },
  { name: 'description', type: 'string', description: 'Custom description (overrides the status default)' },
]

const resultSlots: SlotDef[] = [
  { name: '#actions', description: 'Action buttons rendered in a centered row below the description' },
  { name: '#default', description: 'Extra content appended below the actions row' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MResult</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Pre-built result screens for success, errors, and HTTP status codes — each with a matching
      default icon, color, title, and description you can override.
    </p>

    <ComponentDemo
      title="Result Pages"
      description="Pre-built result screens for success, errors, and HTTP status codes."
      :code="`<template>
  <MResult status=&quot;success&quot; />
  <MResult status=&quot;error&quot; />
  <MResult status=&quot;404&quot;>
    <template #actions>
      <MButton variant=&quot;tonal&quot; icon=&quot;home&quot;>Go home</MButton>
    </template>
  </MResult>
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard variant="outlined" class="overflow-hidden">
          <MResult status="success" />
        </MCard>
        <MCard variant="outlined" class="overflow-hidden">
          <MResult status="404">
            <template #actions>
              <MButton variant="tonal" icon="home">Go home</MButton>
            </template>
          </MResult>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="All Statuses"
      description="Available status presets with default text."
      :code="`<template>
  <MResult status=&quot;success&quot; />
  <MResult status=&quot;error&quot; />
  <MResult status=&quot;warning&quot; />
  <MResult status=&quot;info&quot; />
  <MResult status=&quot;404&quot; />
  <MResult status=&quot;403&quot; />
  <MResult status=&quot;500&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <MCard v-for="s in (['success', 'error', 'warning', 'info', '404', '403', '500'] as const)" :key="s" variant="outlined" class="overflow-hidden">
          <MResult :status="s" />
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Default Slot"
      description="The #default slot appends extra content below the actions row — useful for a secondary link or fine print."
      :code="`<MResult status=&quot;error&quot; title=&quot;Payment failed&quot;>
  <template #actions>
    <MButton>Try again</MButton>
  </template>
  <p class=&quot;text-body-small text-on-surface-variant&quot;>
    Still stuck? <a href=&quot;#&quot; class=&quot;text-primary underline&quot;>Contact support</a>
  </p>
</MResult>`"
    >
      <MCard variant="outlined" class="w-full overflow-hidden">
        <MResult status="error" title="Payment failed">
          <template #actions>
            <MButton>Try again</MButton>
          </template>
          <p class="text-body-small text-on-surface-variant">
            Still stuck? <a href="#" class="text-primary underline" @click.prevent>Contact support</a>
          </p>
        </MResult>
      </MCard>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="resultProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="resultSlots" />

    <ComponentPager current="MResult" />
  </div>
</template>
