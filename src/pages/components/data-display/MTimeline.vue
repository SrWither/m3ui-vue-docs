<script setup lang="ts">
import { MTimeline, MCard } from '@m3ui-vue/m3ui-vue'
import type { TimelineItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const timelineProps: PropDef[] = [
  { name: 'items', type: 'TimelineItem[]', description: 'Array of timeline entries — required' },
  { name: 'dense', type: 'boolean', default: 'false', description: 'Compact spacing between items' },
  { name: 'alternating', type: 'boolean', default: 'false', description: 'Alternate items left/right of a central line instead of a single left-aligned column' },
]

const timelineTypes: TypeDef[] = [
  {
    name: 'TimelineItem',
    fields: [
      { name: 'title', type: 'string', required: true, description: 'Item headline' },
      { name: 'description', type: 'string', description: 'Supporting text below the title' },
      { name: 'date', type: 'string', description: 'Date/time label' },
      { name: 'icon', type: 'string', description: 'Material Symbol shown inside the dot (dot grows to fit it)' },
      { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error' | 'success'", description: "Dot/connector color — defaults to 'primary'" },
      { name: 'dotColor', type: 'string', description: 'Any CSS color to override color with an exact value instead of a named token' },
    ],
  },
]

const timelineSlots: SlotDef[] = [
  { name: '#item-{i}', description: 'Extra custom content appended under an item, keyed by its zero-based index in items (e.g. #item-0 for the first item) — non-alternating layout only', scope: '{ item: TimelineItem }' },
]

const timelineItems: TimelineItem[] = [
  { title: 'Project created', description: 'Initial repository setup', date: 'Jan 15', icon: 'rocket_launch', color: 'primary' },
  { title: 'First release', description: 'v1.0.0 published to npm', date: 'Feb 20', icon: 'celebration', color: 'success' },
  { title: 'Bug reported', description: 'Critical rendering issue found', date: 'Mar 5', icon: 'bug_report', color: 'error' },
  { title: 'Patch released', description: 'Fix deployed in v1.0.1', date: 'Mar 7', icon: 'check_circle', color: 'success' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTimeline</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A vertical event timeline with icon dots, dates, and colors — standard single-column or
      alternating left/right layout.
    </p>

    <ComponentDemo
      title="Timeline"
      description="Vertical event timeline with icons and colors."
      :code="`<template>
  <MTimeline :items=&quot;items&quot; />
</template>`"
      :script="`const items = [
  { title: 'Project created', description: 'Initial setup', date: 'Jan 15', icon: 'rocket_launch', color: 'primary' },
  { title: 'First release', description: 'v1.0.0 published', date: 'Feb 20', icon: 'celebration', color: 'success' },
  { title: 'Bug reported', date: 'Mar 5', icon: 'bug_report', color: 'error' },
  { title: 'Patch released', date: 'Mar 7', icon: 'check_circle', color: 'success' },
]`"
    >
      <div class="w-full max-w-lg">
        <MTimeline :items="timelineItems" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Dense"
      description="Compact timeline with less vertical spacing."
      :code="`<template>
  <MTimeline :items=&quot;items&quot; :dense=&quot;true&quot; />
</template>`"
    >
      <div class="w-full max-w-lg">
        <MTimeline :items="timelineItems" :dense="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Alternating"
      description="Items alternate left and right of a central line, with icons and connecting vertical track."
      :code="`<MTimeline :items=&quot;items&quot; :alternating=&quot;true&quot; />`"
      :script="`import { MTimeline } from '@m3ui-vue/m3ui-vue'
import type { TimelineItem } from '@m3ui-vue/m3ui-vue'

const items: TimelineItem[] = [
  { title: 'Project created', description: 'Initial repo setup', date: 'Jan 15', icon: 'rocket_launch', color: 'primary' },
  { title: 'Design approved', description: 'Mockups finalized by the team', date: 'Jan 22', icon: 'design_services', color: 'secondary' },
  { title: 'Sprint 1 done', description: 'Button, Card, TextField shipped', date: 'Feb 5', icon: 'check_circle', color: 'success' },
  { title: 'Critical bug fixed', description: 'Dark mode rendering issue resolved', date: 'Feb 8', icon: 'bug_report', color: 'error' },
  { title: 'v1.0 released', description: 'First stable version in production', date: 'Feb 20', icon: 'celebration', color: 'tertiary' },
]`"
    >
      <div class="w-full">
        <MTimeline
          :items="[
            { title: 'Project created', description: 'Initial repo setup', date: 'Jan 15', icon: 'rocket_launch', color: 'primary' },
            { title: 'Design approved', description: 'Mockups finalized by the team', date: 'Jan 22', icon: 'design_services', color: 'secondary' },
            { title: 'Sprint 1 done', description: 'Button, Card, TextField shipped', date: 'Feb 5', icon: 'check_circle', color: 'success' },
            { title: 'Critical bug fixed', description: 'Dark mode rendering issue resolved', date: 'Feb 8', icon: 'bug_report', color: 'error' },
            { title: 'v1.0 released', description: 'First stable version in production', date: 'Feb 20', icon: 'celebration', color: 'tertiary' },
          ]"
          :alternating="true"
        />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Per-item Extra Content"
      description="A dynamic #item-{i} slot lets you attach arbitrary content under any single item — indexed by its position in items — such as a link or chip only the third entry needs."
      :code="`<MTimeline :items=&quot;items&quot;>
  <template #item-1=&quot;{ item }&quot;>
    <a href=&quot;#&quot; class=&quot;text-label-medium text-primary underline&quot;>View release notes</a>
  </template>
</MTimeline>`"
    >
      <div class="w-full max-w-lg">
        <MTimeline :items="timelineItems">
          <template #item-1="{ item }">
            <a href="#" class="text-label-medium text-primary underline" @click.prevent>View {{ item.title.toLowerCase() }} notes</a>
          </template>
        </MTimeline>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="timelineProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="timelineTypes" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="timelineSlots" />

    <ComponentPager current="MTimeline" />
  </div>
</template>
