<script setup lang="ts">
import { MTooltip, MButton, MIconButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const tooltipProps: PropDef[] = [
  { name: 'text', type: 'string', description: 'Tooltip text (plain variant), or the rich variant\'s title line' },
  { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Tooltip position relative to the trigger' },
  { name: 'delay', type: 'number', default: '600', description: 'Show delay in ms after hover/focus' },
  { name: 'rich', type: 'boolean', default: 'false', description: 'Rich tooltip with a #content slot and optional #actions. Stays open when hovering the tooltip itself instead of closing immediately.' },
]

const tooltipSlots: SlotDef[] = [
  { name: '#default', description: 'The trigger element the tooltip is anchored to' },
  { name: '#content', description: 'Rich-tooltip body content (only used when rich is true)' },
  { name: '#actions', description: 'Rich-tooltip action buttons row (only used when rich is true)' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTooltip</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A hover/focus-triggered label — plain text, or a rich variant with a title, detailed content, and
      action buttons.
    </p>

    <ComponentDemo
      title="Placements"
      description="Tooltips can appear on any side of the trigger."
      :code="`<template>
  <MTooltip text=&quot;Top tooltip&quot; placement=&quot;top&quot;>
    <MButton variant=&quot;outlined&quot;>Top</MButton>
  </MTooltip>
</template>`"
    >
      <MTooltip text="Top tooltip" placement="top">
        <MButton variant="outlined">Top</MButton>
      </MTooltip>
      <MTooltip text="Bottom tooltip" placement="bottom">
        <MButton variant="outlined">Bottom</MButton>
      </MTooltip>
      <MTooltip text="Left tooltip" placement="left">
        <MButton variant="outlined">Left</MButton>
      </MTooltip>
      <MTooltip text="Right tooltip" placement="right">
        <MButton variant="outlined">Right</MButton>
      </MTooltip>
    </ComponentDemo>

    <ComponentDemo
      title="Delay"
      description="Control how long the trigger must be hovered/focused before the tooltip appears."
      :code="`<MTooltip text=&quot;Instant&quot; :delay=&quot;0&quot;>
  <MButton variant=&quot;outlined&quot;>No delay</MButton>
</MTooltip>
<MTooltip text=&quot;Default 600ms&quot;>
  <MButton variant=&quot;outlined&quot;>Default</MButton>
</MTooltip>
<MTooltip text=&quot;Slow, 1200ms&quot; :delay=&quot;1200&quot;>
  <MButton variant=&quot;outlined&quot;>Slow</MButton>
</MTooltip>`"
    >
      <MTooltip text="Instant" :delay="0">
        <MButton variant="outlined">No delay</MButton>
      </MTooltip>
      <MTooltip text="Default 600ms">
        <MButton variant="outlined">Default</MButton>
      </MTooltip>
      <MTooltip text="Slow, 1200ms" :delay="1200">
        <MButton variant="outlined">Slow</MButton>
      </MTooltip>
    </ComponentDemo>

    <ComponentDemo
      title="Rich Tooltip"
      description="Rich tooltips support custom content, a title, and action buttons. The tooltip stays open when you hover over it."
      :code="`<MTooltip text=&quot;Learn more&quot; rich>
  <template #default>
    <MButton variant=&quot;outlined&quot;>Hover me</MButton>
  </template>
  <template #content>
    Rich tooltips can contain detailed descriptions
    and even interactive elements.
  </template>
  <template #actions>
    <MButton variant=&quot;text&quot;>Action</MButton>
  </template>
</MTooltip>`"
    >
      <div class="flex flex-wrap gap-4">
        <MTooltip text="File details" rich placement="top">
          <MButton variant="outlined">Top</MButton>
          <template #content>
            This file was last modified on June 23, 2026. It contains 3 pages and weighs 2.4 MB.
          </template>
          <template #actions>
            <MButton variant="text">Open</MButton>
            <MButton variant="text">Share</MButton>
          </template>
        </MTooltip>

        <MTooltip text="Storage info" rich placement="bottom">
          <MButton variant="outlined">Bottom</MButton>
          <template #content>
            You are using 14.2 GB of 15 GB. Consider upgrading your plan for more storage.
          </template>
          <template #actions>
            <MButton variant="text">Upgrade</MButton>
          </template>
        </MTooltip>

        <MTooltip text="User profile" rich placement="left">
          <MButton variant="outlined">Left</MButton>
          <template #content>
            Fadel — Software Engineer. Last active 2 minutes ago.
          </template>
          <template #actions>
            <MButton variant="text">View profile</MButton>
          </template>
        </MTooltip>

        <MTooltip text="Notifications" rich placement="right">
          <MButton variant="outlined">Right</MButton>
          <template #content>
            You have 3 unread notifications and 1 pending invitation.
          </template>
          <template #actions>
            <MButton variant="text">View all</MButton>
            <MButton variant="text">Dismiss</MButton>
          </template>
        </MTooltip>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Rich Tooltip — Content only"
      description="Rich tooltip without title or actions — just detailed info the user can read at their own pace."
      :code="`<MTooltip rich>
  <MIconButton icon=&quot;help&quot; label=&quot;Help&quot; />
  <template #content>
    Click to open the help center with guides and FAQs.
  </template>
</MTooltip>`"
    >
      <div class="flex flex-wrap gap-4">
        <MTooltip rich placement="top">
          <MIconButton icon="help" label="Help" />
          <template #content>
            Click to open the help center with guides and FAQs.
          </template>
        </MTooltip>

        <MTooltip rich placement="bottom">
          <MIconButton icon="settings" label="Settings" />
          <template #content>
            Configure your account preferences, theme, and notification settings.
          </template>
        </MTooltip>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="tooltipProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="tooltipSlots" />

    <ComponentPager current="MTooltip" />
  </div>
</template>
