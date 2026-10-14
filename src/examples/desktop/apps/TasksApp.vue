<script lang="ts">
// Module-level state: survives the window being minimized (its content unmounts while hidden).
import { ref } from 'vue'
import type { KanbanColumn } from '@m3ui-vue/m3ui-vue'

const board = ref<KanbanColumn[]>([
  { id: 'todo', title: 'To do', color: 'secondary', cards: [
    { id: 1, title: 'Write the release notes', tag: 'Docs' },
    { id: 2, title: 'Desktop example: Settings app', tag: 'Docs' },
    { id: 3, title: 'Check MWindow on a phone', tag: 'QA' },
  ] },
  { id: 'doing', title: 'In progress', color: 'primary', limit: 2, cards: [
    { id: 4, title: 'Adaptive layouts', tag: 'Library' },
  ] },
  { id: 'done', title: 'Done', color: 'success', cards: [
    { id: 5, title: 'Sheets slide in on open', tag: 'Library' },
    { id: 6, title: 'MTransferList custom rows', tag: 'Library' },
  ] },
])
let nextId = 7
</script>

<script setup lang="ts">
import { MKanban, MChip, MIconButton } from '@m3ui-vue/m3ui-vue'

function add(columnId: string | number) {
  const column = board.value.find((c) => c.id === columnId)
  column?.cards.push({ id: nextId++, title: 'New task', tag: 'Inbox' })
}
</script>

<template>
  <div class="h-full overflow-auto p-3">
    <MKanban v-model="board">
      <template #card="{ card }">
        <p class="mb-2 text-body-medium text-on-surface">{{ card.title }}</p>
        <MChip>{{ card.tag }}</MChip>
      </template>
      <template #column-footer="{ column }">
        <MIconButton icon="add" size="xs" :label="`Add to ${column.title}`" @click="add(column.id)" />
      </template>
    </MKanban>
  </div>
</template>
