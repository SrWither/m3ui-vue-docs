<script setup lang="ts">
/*
 * Arranging a room: the plan's tool (move things, draw a wall, drag out a zone), tables and decor to add, and the
 * picked table's label, seats, shape and angle.
 */
import { computed } from 'vue'
import { MButton, MIcon, MMenu, MMenuItem, MNumberField, MSegmentedButton, MSlider, MTextField, type FloorDecor, type FloorTable } from '@m3ui-vue/m3ui-vue'
import { newId, useFloor } from '../useFloor'

const props = defineProps<{ selected: (string | number)[] }>()
const tool = defineModel<'select' | 'wall' | 'area'>('tool', { required: true })
const emit = defineEmits<{ select: [ids: (string | number)[]] }>()
const f = useFloor()
const table = computed(() => (props.selected.length === 1 ? f.room.value.tables.find((t) => t.id === props.selected[0]) : undefined))
const patch = (p: Partial<FloorTable>) => f.patchRoom({ tables: f.room.value.tables.map((t) => (t.id === table.value!.id ? { ...t, ...p } : t)) })

const ADD: { shape: FloorTable['shape']; seats: number; label: string; icon: string }[] = [
  { shape: 'round', seats: 2, label: 'Round · 2', icon: 'circle' },
  { shape: 'round', seats: 4, label: 'Round · 4', icon: 'circle' },
  { shape: 'square', seats: 4, label: 'Square · 4', icon: 'square' },
  { shape: 'rect', seats: 6, label: 'Long · 6', icon: 'rectangle' },
]
function addTable(a: (typeof ADD)[number]) {
  // The next number after the highest numbered table (the bar and its stools have names of their own)
  const n = Math.max(0, ...f.room.value.tables.map((t) => Number(t.label)).filter((x) => Number.isFinite(x))) + 1
  const t: FloorTable = { id: newId('t'), label: String(n), x: 500, y: 300, shape: a.shape, seats: a.seats }
  f.patchRoom({ tables: [...f.room.value.tables, t] })
  emit('select', [t.id])
}
const DECOR: { kind: FloorDecor['kind']; label: string; icon: string }[] = [
  { kind: 'door', label: 'Door', icon: 'door_front' },
  { kind: 'window', label: 'Window', icon: 'window' },
  { kind: 'plant', label: 'Plant', icon: 'potted_plant' },
  { kind: 'column', label: 'Column', icon: 'radio_button_unchecked' },
  { kind: 'restroom', label: 'Restroom', icon: 'wc' },
  { kind: 'kitchen', label: 'Kitchen', icon: 'skillet' },
  { kind: 'register', label: 'Register', icon: 'point_of_sale' },
  { kind: 'stairs', label: 'Stairs', icon: 'stairs' },
  { kind: 'label', label: 'Text label', icon: 'title' },
]
function addDecor(kind: FloorDecor['kind']) {
  f.patchRoom({ decor: [...f.room.value.decor, { id: newId('d'), kind, x: 500, y: 300, ...(kind === 'label' && { label: 'Label' }) }] })
}
function removeTable() {
  const id = table.value!.id
  f.patchRoom({ tables: f.room.value.tables.filter((t) => t.id !== id), merges: f.room.value.merges.map((m) => ({ ...m, tables: m.tables.filter((x) => x !== id) })).filter((m) => m.tables.length > 1) })
  emit('select', [])
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <MSegmentedButton
      v-model="tool"
      :options="[{ value: 'select', label: 'Move', icon: 'open_with' }, { value: 'wall', label: 'Wall', icon: 'timeline' }, { value: 'area', label: 'Zone', icon: 'crop_square' }]"
      density="compact"
    />
    <p class="text-body-small text-on-surface-variant">
      {{ tool === 'wall' ? 'Click each corner of the wall; double-click or Enter ends it, Escape cancels.' : tool === 'area' ? 'Drag out a zone.' : 'Drag tables (Shift-click to pick several), zones, walls and decor; arrows nudge, Delete removes a picked zone, wall or decor.' }}
    </p>
    <div>
      <div class="mb-2 text-title-small">Add</div>
      <div class="grid grid-cols-2 gap-2">
        <MButton v-for="a in ADD" :key="a.label" variant="tonal" size="sm" :icon="a.icon" @click="addTable(a)">{{ a.label }}</MButton>
      </div>
      <MMenu>
        <template #trigger><MButton variant="text" size="sm" icon="add" class="mt-2">Decor</MButton></template>
        <MMenuItem v-for="d in DECOR" :key="d.kind" :icon="d.icon" @click="addDecor(d.kind)">{{ d.label }}</MMenuItem>
      </MMenu>
    </div>
    <div v-if="table" class="flex flex-col gap-3 border-t border-outline-variant pt-4">
      <div class="flex items-center gap-2 text-title-small"><MIcon name="table_restaurant" :size="18" />Table {{ table.label }}</div>
      <div class="grid grid-cols-2 gap-3">
        <MTextField :model-value="table.label" label="Label" variant="outlined" @update:model-value="patch({ label: String($event) })" />
        <MNumberField :model-value="table.seats ?? 0" label="Seats" variant="outlined" :min="0" :max="20" @update:model-value="patch({ seats: $event ?? 0, width: undefined, height: undefined })" />
      </div>
      <MSegmentedButton
        :model-value="table.shape ?? 'square'"
        :options="[{ value: 'round', label: 'Round' }, { value: 'square', label: 'Square' }, { value: 'rect', label: 'Long' }]"
        density="compact"
        @update:model-value="patch({ shape: $event as FloorTable['shape'], width: undefined, height: undefined })"
      />
      <div>
        <div class="text-label-medium text-on-surface-variant">Angle · {{ table.rotation ?? 0 }}°</div>
        <MSlider :model-value="table.rotation ?? 0" :min="0" :max="180" :step="15" label="Angle" @update:model-value="patch({ rotation: $event as number })" />
      </div>
      <MButton variant="tonal" color="error" icon="delete" @click="removeTable">Remove table</MButton>
    </div>
    <p v-else-if="selected.length > 1" class="text-body-small text-on-surface-variant">{{ selected.length }} tables picked: drag one to move them all.</p>
  </div>
</template>
