<script setup lang="ts">
import { ref } from 'vue'
import { MTransferList } from '@m3ui-vue/m3ui-vue'
import type { TransferItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const transferProps: PropDef[] = [
  { name: 'modelValue', type: '(string | number)[]', description: 'Selected (right-side) values (v-model)' },
  { name: 'items', type: 'TransferItem[]', description: 'Full list of items — see the type below' },
  { name: 'sourceTitle', type: 'string', description: 'Left panel title (defaults to the locale string)' },
  { name: 'targetTitle', type: 'string', description: 'Right panel title (defaults to the locale string)' },
  { name: 'filterable', type: 'boolean', default: 'false', description: 'Show a search input in each panel' },
  { name: 'searchPlaceholder', type: 'string', description: 'Search input placeholder (defaults to the locale string)' },
  { name: 'emptyText', type: 'string', description: 'Text when a list is empty (defaults to the locale string)' },
  { name: 'moveAllRightLabel', type: 'string', description: 'Aria label for the move-all-right button (defaults to the locale string)' },
  { name: 'moveRightLabel', type: 'string', description: 'Aria label for the move-selected-right button (defaults to the locale string)' },
  { name: 'moveLeftLabel', type: 'string', description: 'Aria label for the move-selected-left button (defaults to the locale string)' },
  { name: 'moveAllLeftLabel', type: 'string', description: 'Aria label for the move-all-left button (defaults to the locale string)' },
]

const transferEvents: EventDef[] = [
  { name: 'update:modelValue', payload: '(string | number)[]', description: 'Emitted whenever items move between panels — powers v-model' },
]

const transferSlots: SlotDef[] = [
  { name: 'source-empty', description: 'Custom content when the source (left) list is empty' },
  { name: 'target-empty', description: 'Custom content when the target (right) list is empty' },
]

const transferTypes: TypeDef[] = [
  {
    name: 'TransferItem',
    fields: [
      { name: 'value', type: 'string | number', required: true, description: 'Unique identifier, used in modelValue' },
      { name: 'label', type: 'string', required: true, description: 'Display text' },
      { name: 'icon', type: 'string', description: 'Material Symbol icon shown before the label' },
    ],
  },
]

const transferItems: TransferItem[] = [
  { value: 'vue', label: 'Vue', icon: 'code' },
  { value: 'react', label: 'React', icon: 'code' },
  { value: 'angular', label: 'Angular', icon: 'code' },
  { value: 'svelte', label: 'Svelte', icon: 'code' },
  { value: 'solid', label: 'Solid', icon: 'code' },
  { value: 'ember', label: 'Ember', icon: 'code' },
]
const transferValue = ref<(string | number)[]>(['vue'])

const emptySourceItems: TransferItem[] = [
  { value: 'only', label: 'Only item' },
]
const emptyValue = ref<(string | number)[]>(['only'])
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTransferList</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Move items between two panels — source and target — with optional per-panel search filtering. The selected
      (right-side) values are tracked via v-model.
    </p>

    <ComponentDemo
      title="Transfer List"
      description="Move items between two lists. Selected values are tracked via v-model, with filterable search inputs."
      :code="`<template>
  <MTransferList
    v-model=&quot;selected&quot;
    :items=&quot;items&quot;
    :filterable=&quot;true&quot;
  />
</template>`"
      :script="`const selected = ref(['vue'])
const items = [
  { value: 'vue', label: 'Vue', icon: 'code' },
  { value: 'react', label: 'React', icon: 'code' },
  { value: 'angular', label: 'Angular', icon: 'code' },
  { value: 'svelte', label: 'Svelte', icon: 'code' },
]`"
    >
      <div class="w-full">
        <MTransferList
          v-model="transferValue"
          :items="transferItems"
          source-title="Available"
          target-title="Selected"
          :filterable="true"
        />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Empty Source List"
      description="The source-empty slot replaces the default 'No items' text when the source panel has nothing left to show."
      :code="`<template>
  <MTransferList v-model=&quot;selected&quot; :items=&quot;items&quot;>
    <template #source-empty>
      <p class=&quot;p-4 text-center text-on-surface-variant&quot;>Everything's been moved!</p>
    </template>
  </MTransferList>
</template>`"
    >
      <div class="w-full">
        <MTransferList v-model="emptyValue" :items="emptySourceItems">
          <template #source-empty>
            <p class="p-4 text-center text-body-small text-on-surface-variant">Everything's been moved!</p>
          </template>
        </MTransferList>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="transferProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="transferEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="transferSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="transferTypes" />

    <ComponentPager current="MTransferList" />
  </div>
</template>
