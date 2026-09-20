<script setup lang="ts">
import { ref } from 'vue'
import { MKanban, MChip } from '@m3ui-vue/m3ui-vue'
import type { KanbanColumn } from '@m3ui-vue/m3ui-vue'
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

const kanbanColumns = ref<KanbanColumn[]>([
  {
    id: 'todo', title: 'To Do', color: 'primary',
    cards: [
      { id: '1', title: 'Design system tokens', tag: 'Design' },
      { id: '2', title: 'Write unit tests', tag: 'Dev' },
    ],
  },
  {
    id: 'progress', title: 'In Progress', color: 'tertiary',
    cards: [
      { id: '3', title: 'Build components', tag: 'Dev' },
    ],
  },
  {
    id: 'done', title: 'Done', color: 'success',
    cards: [
      { id: '4', title: 'Project setup', tag: 'Ops' },
      { id: '5', title: 'CI pipeline', tag: 'Ops' },
    ],
  },
])

const kanbanProps: PropDef[] = [
  { name: 'modelValue', type: 'KanbanColumn[]', description: 'Columns with their cards (v-model). Required — there is no default.' },
]

const kanbanEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'KanbanColumn[]', description: 'Emitted after a drag-and-drop move — powers v-model' },
  { name: 'cardMove', payload: '{ cardId, fromColumn, toColumn, toIndex }', description: 'Emitted after a card is dropped into a (possibly different) column/position' },
  { name: 'cardClick', payload: '{ card, columnId }', description: 'Emitted when a card is clicked' },
]

const kanbanSlots: SlotDef[] = [
  { name: 'card', scope: '{ card, column }', description: 'Customize how each card renders. column is the full KanbanColumn the card belongs to (not just its id).' },
]

const kanbanTypes: TypeDef[] = [
  {
    name: 'KanbanColumn',
    fields: [
      { name: 'id', type: 'string | number', required: true, description: 'Unique identifier' },
      { name: 'title', type: 'string', required: true, description: 'Column heading' },
      { name: 'cards', type: 'KanbanCard[]', required: true, description: 'Cards currently in this column' },
      { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error' | 'success'", description: 'Dot color shown next to the column title' },
    ],
  },
  {
    name: 'KanbanCard',
    description: 'Open-ended — attach any extra fields your #card slot needs.',
    fields: [
      { name: 'id', type: 'string | number', required: true, description: 'Unique identifier, used for drag tracking' },
      { name: '[key: string]', type: 'any', description: 'Any additional fields (title, tag, assignee, etc.) — read them in the #card slot' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MKanban</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A drag-and-drop kanban board with fully customizable card rendering via the #card slot.
    </p>

    <ComponentDemo
      title="Kanban Board"
      description="Drag-and-drop kanban board with customizable card rendering via the #card slot."
      :code="`<MKanban v-model=&quot;columns&quot;>
  <template #card=&quot;{ card }&quot;>
    <p class=&quot;text-body-medium&quot;>{{ card.title }}</p>
    <MChip tone=&quot;primary&quot; class=&quot;mt-1&quot;>{{ card.tag }}</MChip>
  </template>
</MKanban>`"
      :script="`import { ref } from 'vue'
import type { KanbanColumn } from '@m3ui-vue/m3ui-vue'

const columns = ref<KanbanColumn[]>([
  {
    id: 'todo', title: 'To Do', color: 'primary',
    cards: [
      { id: '1', title: 'Design system tokens', tag: 'Design' },
      { id: '2', title: 'Write unit tests', tag: 'Dev' },
    ],
  },
  {
    id: 'progress', title: 'In Progress', color: 'tertiary',
    cards: [
      { id: '3', title: 'Build components', tag: 'Dev' },
    ],
  },
  {
    id: 'done', title: 'Done', color: 'success',
    cards: [
      { id: '4', title: 'Project setup', tag: 'Ops' },
      { id: '5', title: 'CI pipeline', tag: 'Ops' },
    ],
  },
])`"
    >
      <div class="w-full">
        <MKanban v-model="kanbanColumns">
          <template #card="{ card }">
            <p class="text-body-medium">{{ card.title }}</p>
            <MChip tone="primary" class="mt-1">{{ card.tag }}</MChip>
          </template>
        </MKanban>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="kanbanProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="kanbanEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="kanbanSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="kanbanTypes" />

    <ComponentPager current="MKanban" />
  </div>
</template>
