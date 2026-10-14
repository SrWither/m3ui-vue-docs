<script lang="ts">
// Module-level state: survives the window being minimized (its content unmounts while hidden).
import { ref } from 'vue'

interface Note { id: number; title: string; body: string; color: 'primary' | 'secondary' | 'tertiary' }

let nextId = 4
const notes = ref<Note[]>([
  { id: 1, title: 'Meeting notes', body: 'Design review moved to Thursday.\n- Bring the latest prototypes\n- Decide on the payment step', color: 'primary' },
  { id: 2, title: 'Groceries', body: 'Coffee, oat milk, bread, lemons', color: 'tertiary' },
  { id: 3, title: 'Ideas', body: 'A desktop example for the docs, with real apps in windows.', color: 'secondary' },
])
const currentId = ref(1)
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { MIconButton, MIcon } from '@m3ui-vue/m3ui-vue'

const current = computed(() => notes.value.find((n) => n.id === currentId.value))
const colors = ['primary', 'secondary', 'tertiary'] as const
const dot = { primary: 'bg-primary', secondary: 'bg-secondary', tertiary: 'bg-tertiary' }

function add() {
  const note: Note = { id: nextId++, title: 'Untitled', body: '', color: colors[nextId % 3]! }
  notes.value.unshift(note)
  currentId.value = note.id
}
function remove() {
  notes.value = notes.value.filter((n) => n.id !== currentId.value)
  currentId.value = notes.value[0]?.id ?? 0
}
</script>

<template>
  <div class="flex h-full">
    <aside class="flex w-44 shrink-0 flex-col border-r border-outline-variant/60">
      <div class="flex items-center justify-between px-3 py-2">
        <span class="text-title-small text-on-surface">{{ notes.length }} notes</span>
        <MIconButton icon="add" size="xs" variant="tonal" label="New note" @click="add" />
      </div>
      <div class="min-h-0 flex-1 overflow-auto px-1.5 pb-2">
        <button
          v-for="n in notes"
          :key="n.id"
          type="button"
          class="mb-1 flex w-full flex-col rounded-xl px-3 py-2 text-left"
          :class="n.id === currentId ? 'bg-secondary-container' : 'hover:bg-on-surface/8'"
          @click="currentId = n.id"
        >
          <span class="flex items-center gap-2">
            <span class="h-2 w-2 shrink-0 rounded-full" :class="dot[n.color]" />
            <span class="truncate text-label-large" :class="n.id === currentId ? 'text-on-secondary-container' : 'text-on-surface'">{{ n.title || 'Untitled' }}</span>
          </span>
          <span class="truncate text-body-small text-on-surface-variant">{{ n.body || 'Empty' }}</span>
        </button>
      </div>
    </aside>

    <section v-if="current" class="flex min-w-0 flex-1 flex-col">
      <div class="flex items-center gap-1 px-3 pt-2">
        <input
          v-model="current.title"
          aria-label="Title"
          class="min-w-0 flex-1 bg-transparent text-title-large text-on-surface outline-none"
        />
        <button
          v-for="c in colors"
          :key="c"
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded-full"
          :aria-label="`Color ${c}`"
          @click="current.color = c"
        >
          <span class="h-3.5 w-3.5 rounded-full" :class="[dot[c], current.color === c && 'ring-2 ring-offset-2 ring-offset-surface ring-on-surface-variant']" />
        </button>
        <MIconButton icon="delete" size="xs" label="Delete note" @click="remove" />
      </div>
      <textarea
        v-model="current.body"
        aria-label="Note"
        placeholder="Write something…"
        class="min-h-0 flex-1 resize-none bg-transparent px-3 py-2 text-body-large text-on-surface outline-none placeholder:text-on-surface-variant"
      />
    </section>
    <div v-else class="flex flex-1 flex-col items-center justify-center gap-2 text-on-surface-variant">
      <MIcon name="sticky_note_2" :size="40" />
      <span class="text-body-medium">No notes</span>
    </div>
  </div>
</template>
