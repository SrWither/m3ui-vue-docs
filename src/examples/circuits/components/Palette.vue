<script setup lang="ts">
/*
 * The project's circuits (open one, add, rename, delete), then every kind of part by category, the other circuits
 * last as subcircuits. A click (or a tap) adds one in the middle of the view; pressing one with a mouse or a pen
 * emits `grab`, so the page can drag it straight onto the canvas.
 */
import { computed, nextTick, ref } from 'vue'
import { MIcon, MIconButton, MMenu, MMenuItem, MTooltip, useToast } from '@m3ui-vue/m3ui-vue'
import { categories, parts } from '../parts'
import { useCircuit } from '../useCircuit'

const emit = defineEmits<{ pick: [kind: string]; grab: [kind: string, event: PointerEvent]; opened: [] }>()
const c = useCircuit()
const toast = useToast()
const items = (cat: string) =>
  cat === 'circuits'
    ? c.placeable.value.map((x) => ({ kind: `sub:${x.id}`, label: x.name, icon: 'developer_board', description: `${x.name} as a part` }))
    : parts.filter((x) => x.category === cat && x.kind !== 'sub')
const shown = computed(() => categories.filter((cat) => cat.id !== 'circuits' || c.placeable.value.length))

// ── Circuits ────────────────────────────────────────────────────────────────────────────────────────────
const renaming = ref('')
const nameInput = ref<HTMLInputElement[]>()
function open(id: string) {
  c.openCircuit(id)
  emit('opened')
}
function add() {
  c.addCircuit(`Circuit ${c.circuits.value.length + 1}`)
  emit('opened')
  startRename(c.currentId.value)
}
function startRename(id: string) {
  renaming.value = id
  nextTick(() => nameInput.value?.[0]?.select())
}
function rename(id: string, name: string) {
  if (name.trim()) c.renameCircuit(id, name.trim())
  renaming.value = ''
}
function remove(id: string) {
  const users = c.usersOf(id)
  if (users.length) return toast.error(`It's placed in ${users.map((u) => u.name).join(', ')}: remove it from there first`)
  if (!c.deleteCircuit(id)) toast.error('A project keeps at least one circuit')
}
// A press that became a drag onto the canvas doesn't also add a part with its click (the page says so)
let suppress = false
defineExpose({ suppressClick: () => (suppress = true) })
function down(e: PointerEvent, kind: string) {
  suppress = false
  if (e.button === 0 && e.pointerType !== 'touch') emit('grab', kind, e)
}
function click(kind: string) {
  if (!suppress) emit('pick', kind)
  suppress = false
}
</script>

<template>
  <div class="flex flex-col gap-3 p-3">
    <section>
      <div class="flex items-center pb-1 pl-2">
        <h3 class="flex-1 text-label-large text-on-surface-variant">Circuits</h3>
        <MIconButton icon="add" label="New circuit" size="xs" @click="add" />
      </div>
      <div
        v-for="x in c.circuits.value"
        :key="x.id"
        class="group flex h-9 items-center gap-2 rounded-full pr-1 pl-3 text-body-medium"
        :class="x.id === c.currentId.value ? 'bg-secondary-container text-on-secondary-container' : 'hover:bg-on-surface/8'"
      >
        <MIcon :name="x.id === c.circuits.value[0]?.id ? 'home' : 'developer_board'" :size="18" class="shrink-0" />
        <input
          v-if="renaming === x.id"
          ref="nameInput"
          :value="x.name"
          aria-label="Circuit name"
          class="h-7 min-w-0 flex-1 rounded-xs bg-surface px-1 outline-none ring-1 ring-primary"
          @keydown.enter="rename(x.id, ($event.target as HTMLInputElement).value)"
          @keydown.esc="renaming = ''"
          @blur="rename(x.id, ($event.target as HTMLInputElement).value)"
        />
        <button v-else type="button" class="min-w-0 flex-1 truncate text-left outline-none" @click="open(x.id)" @dblclick="startRename(x.id)">{{ x.name }}</button>
        <MMenu align="right">
          <template #trigger><MIconButton icon="more_vert" label="Circuit actions" size="xs" /></template>
          <MMenuItem icon="edit" @click="startRename(x.id)">Rename</MMenuItem>
          <MMenuItem icon="delete" @click="remove(x.id)">Delete</MMenuItem>
        </MMenu>
      </div>
      <p v-if="c.circuits.value.length === 1" class="px-2 pt-1 text-body-small text-on-surface-variant">
        Add a circuit to build a block once (with input and output pins) and place it here as many times as you need.
      </p>
    </section>
    <section v-for="cat in shown" :key="cat.id">
      <h3 class="px-2 pb-1 text-label-large text-on-surface-variant">{{ cat.label }}</h3>
      <div class="grid grid-cols-2 gap-1">
        <MTooltip v-for="p in items(cat.id)" :key="p.kind" :text="p.description" placement="right" :delay="600" class="min-w-0">
        <button
          type="button"
          class="flex w-full min-w-0 cursor-grab items-center gap-2 rounded-md px-2 py-1.5 text-left text-body-medium transition-colors outline-none select-none hover:bg-on-surface/8 focus-visible:ring-2 focus-visible:ring-secondary active:cursor-grabbing"
          @pointerdown="down($event, p.kind)"
          @click="click(p.kind)"
        >
          <MIcon :name="p.icon" :size="18" class="shrink-0 text-primary" />
          <span class="truncate">{{ p.label }}</span>
        </button>
        </MTooltip>
      </div>
    </section>
  </div>
</template>
