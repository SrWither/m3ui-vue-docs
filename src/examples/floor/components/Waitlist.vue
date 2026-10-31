<script setup lang="ts">
/* Who's waiting, for how long, and the table that would fit them best (a tap shows it). Add a party at the door. */
import { ref } from 'vue'
import { MButton, MIcon, MNumberField, MTextField } from '@m3ui-vue/m3ui-vue'
import { newId, useFloor } from '../useFloor'

const emit = defineEmits<{ show: [room: string, table: string | number] }>()
const f = useFloor()
const name = ref('')
const size = ref<number | null>(2)
function add() {
  if (!name.value.trim()) return
  f.waitlist.value = [...f.waitlist.value, { id: newId('p'), name: name.value.trim(), size: size.value ?? 2, since: Date.now() }]
  name.value = ''
}
const waited = (since: number) => `${Math.max(0, Math.round((f.now.value - since) / 60_000))}′`
</script>

<template>
  <div class="flex flex-col gap-3 p-4">
    <div class="flex items-center gap-2 text-title-small"><MIcon name="hourglass_top" :size="18" />Waitlist · {{ f.waitlist.value.length }}</div>
    <p v-if="!f.waitlist.value.length" class="text-body-small text-on-surface-variant">Nobody waiting.</p>
    <div v-for="p in f.waitlist.value" :key="p.id" class="flex items-center gap-2 rounded-lg bg-surface-container-high px-3 py-2">
      <div class="min-w-0 flex-1">
        <div class="truncate text-body-medium">{{ p.name }} · {{ p.size }}</div>
        <div class="text-body-small text-on-surface-variant">{{ waited(p.since) }}<template v-if="p.note"> · {{ p.note }}</template></div>
      </div>
      <MButton
        v-if="f.suggest(p.size)"
        size="xs"
        variant="tonal"
        @click="emit('show', f.suggest(p.size)!.room.id, f.suggest(p.size)!.table.id)"
      >{{ f.suggest(p.size)!.table.label }}</MButton>
      <span v-else class="text-label-small text-error">No table</span>
    </div>
    <form class="flex items-end gap-2" @submit.prevent="add">
      <MTextField v-model="name" label="Name" variant="outlined" class="min-w-0 flex-1" />
      <MNumberField v-model="size" label="Size" variant="outlined" :min="1" :max="20" class="w-32" />
      <MButton type="submit" icon="person_add" :disabled="!name.trim()">Add</MButton>
    </form>
  </div>
</template>
