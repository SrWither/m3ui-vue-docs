<script setup lang="ts">
import { MSection, MCard, MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const sectionProps: PropDef[] = [
  { name: 'title', type: 'string', description: 'Section title text' },
  { name: 'subtitle', type: 'string', description: 'Section subtitle text' },
  { name: 'divider', type: 'boolean', default: 'false', description: 'Show divider below header' },
  { name: 'gap', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Gap between header and content' },
  { name: 'titleVariant', type: 'TextVariant', default: "'title-large'", description: 'Typography variant for the title' },
]

const sectionSlots: SlotDef[] = [
  { name: '#title', description: 'Custom title content (overrides title prop)' },
  { name: '#subtitle', description: 'Custom subtitle content (overrides subtitle prop)' },
  { name: '#actions', description: 'Action buttons displayed in the header row' },
  { name: '#default', description: 'Main section content' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSection</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A titled content section with optional subtitle, header actions, and divider.
    </p>

    <ComponentDemo
      title="Basic Section"
      description="Section with title, subtitle, and content."
      :code="`<template>
  <MSection title=&quot;Account Settings&quot; subtitle=&quot;Manage your account preferences&quot; :divider=&quot;true&quot;>
    <MCard variant=&quot;outlined&quot; class=&quot;p-4&quot;>Section content goes here</MCard>
  </MSection>
</template>`"
    >
      <div class="w-full">
        <MSection title="Account Settings" subtitle="Manage your account preferences" :divider="true">
          <MCard variant="outlined" class="p-4">Section content goes here</MCard>
        </MSection>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With Actions"
      description="Section with action buttons in the header."
      :code="`<template>
  <MSection title=&quot;Notifications&quot; subtitle=&quot;Configure how you receive alerts&quot;>
    <template #actions>
      <MButton variant=&quot;text&quot; size=&quot;small&quot;>Mark all read</MButton>
      <MButton size=&quot;small&quot;>Settings</MButton>
    </template>
    <MCard variant=&quot;outlined&quot; class=&quot;p-4&quot;>Notification preferences</MCard>
  </MSection>
</template>`"
    >
      <div class="w-full">
        <MSection title="Notifications" subtitle="Configure how you receive alerts">
          <template #actions>
            <MButton variant="text" size="small">Mark all read</MButton>
            <MButton size="small">Settings</MButton>
          </template>
          <MCard variant="outlined" class="p-4">Notification preferences</MCard>
        </MSection>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="sectionProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="sectionSlots" />

    <ComponentPager current="MSection" />
  </div>
</template>
