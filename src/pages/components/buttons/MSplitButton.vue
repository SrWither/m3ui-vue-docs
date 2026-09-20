<script setup lang="ts">
import { MSplitButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const splitButtonProps: PropDef[] = [
  { name: 'label', type: 'string', description: 'Main button label' },
  { name: 'icon', type: 'string', description: 'Main button icon' },
  { name: 'variant', type: "'filled' | 'tonal' | 'outlined' | 'elevated'", default: "'tonal'", description: 'Visual style' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary'", default: "'primary'", description: 'Color scheme' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'Button size' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables both parts' },
  { name: 'items', type: 'SplitButtonItem[]', description: 'Dropdown menu items — see the type below' },
]

const splitButtonSlots: SlotDef[] = [
  { name: '#menu', scope: '{ close: () => void }', description: 'Custom dropdown content. Used instead of items. Call close() to dismiss.' },
]

const splitButtonEvents = [
  { name: 'click', payload: 'MouseEvent', description: 'Emitted when the main (left) button is clicked' },
]

const splitButtonTypes: TypeDef[] = [
  {
    name: 'SplitButtonItem',
    fields: [
      { name: 'label', type: 'string', required: true, description: 'Menu item text' },
      { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
      { name: 'disabled', type: 'boolean', description: 'Disables the item' },
      { name: 'onClick', type: '() => void', description: 'Click handler' },
    ],
  },
]

const splitItems = [
  { label: 'Schedule send', icon: 'schedule_send', onClick: () => {} },
  { label: 'Save draft', icon: 'drafts', onClick: () => {} },
  { label: 'Discard', icon: 'delete', onClick: () => {} },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSplitButton</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A button split into a main action and a dropdown toggle — click the main part for the primary action, the
      arrow for alternatives.
    </p>

    <ComponentDemo
      title="Split Button"
      description="Click the main part for the primary action, the arrow for alternatives."
      :code="`<MSplitButton
  label=&quot;Send&quot;
  icon=&quot;send&quot;
  :items=&quot;[
    { label: 'Schedule send', icon: 'schedule_send' },
    { label: 'Save draft', icon: 'drafts' },
  ]&quot;
  @click=&quot;send()&quot;
/>`"
    >
      <div class="flex flex-wrap items-center gap-4">
        <MSplitButton label="Send" icon="send" variant="filled" :items="splitItems" />
        <MSplitButton label="Save" icon="save" variant="tonal" :items="splitItems" />
        <MSplitButton label="Export" icon="download" variant="outlined" :items="splitItems" />
        <MSplitButton label="Share" icon="share" variant="elevated" :items="splitItems" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Colors"
      description="Available in primary, secondary, and tertiary color schemes."
      :code="`<MSplitButton label=&quot;Send&quot; color=&quot;primary&quot; :items=&quot;items&quot; />
<MSplitButton label=&quot;Send&quot; color=&quot;secondary&quot; :items=&quot;items&quot; />
<MSplitButton label=&quot;Send&quot; color=&quot;tertiary&quot; :items=&quot;items&quot; />`"
    >
      <div class="flex flex-wrap items-center gap-4">
        <MSplitButton label="Primary" icon="send" color="primary" :items="splitItems" />
        <MSplitButton label="Secondary" icon="send" color="secondary" :items="splitItems" />
        <MSplitButton label="Tertiary" icon="send" color="tertiary" :items="splitItems" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Menu"
      description="Use the menu slot for fully custom dropdown content instead of items."
      :code="`<MSplitButton label=&quot;Actions&quot; icon=&quot;bolt&quot;>
  <template #menu=&quot;{ close }&quot;>
    <div class=&quot;rounded-xl bg-surface-container p-4&quot;>
      <p>Custom content here</p>
      <button @click=&quot;close()&quot;>Close</button>
    </div>
  </template>
</MSplitButton>`"
    >
      <div class="flex flex-wrap items-center gap-4">
        <MSplitButton label="Actions" icon="bolt" variant="tonal">
          <template #menu="{ close }">
            <div class="w-56 overflow-hidden rounded-xl bg-surface-container py-2 shadow-elevation-2">
              <button
                v-for="item in ['Copy link', 'Duplicate', 'Move to folder', 'Archive']"
                :key="item"
                type="button"
                class="flex w-full cursor-pointer items-center px-4 py-2.5 text-left text-body-medium text-on-surface transition-colors hover:bg-on-surface/8"
                @click="close()"
              >
                {{ item }}
              </button>
            </div>
          </template>
        </MSplitButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="Five sizes matching MButton."
      :code="`<MSplitButton label=&quot;Send&quot; size=&quot;xs&quot; :items=&quot;items&quot; />
<MSplitButton label=&quot;Send&quot; size=&quot;sm&quot; :items=&quot;items&quot; />
<MSplitButton label=&quot;Send&quot; size=&quot;md&quot; :items=&quot;items&quot; />
<MSplitButton label=&quot;Send&quot; size=&quot;lg&quot; :items=&quot;items&quot; />
<MSplitButton label=&quot;Send&quot; size=&quot;xl&quot; :items=&quot;items&quot; />`"
    >
      <div class="flex flex-col items-start gap-3">
        <MSplitButton label="XS" icon="send" size="xs" :items="splitItems" />
        <MSplitButton label="SM" icon="send" size="sm" :items="splitItems" />
        <MSplitButton label="MD" icon="send" size="md" :items="splitItems" />
        <MSplitButton label="LG" icon="send" size="lg" :items="splitItems" />
        <MSplitButton label="XL" icon="send" size="xl" :items="splitItems" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="splitButtonProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="splitButtonEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="splitButtonSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="splitButtonTypes" />

    <ComponentPager current="MSplitButton" />
  </div>
</template>
