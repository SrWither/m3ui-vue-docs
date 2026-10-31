<script setup lang="ts">
/*
 * Floor example (Seated): a restaurant host stand on MFloorPlan, built only with m3ui-vue. Two rooms with their
 * tables, zones, walls and decor. Service: every table colored by what's happening there, minutes seated as a badge,
 * a waitlist that points at the table that fits each party, seat, bill, clear, clean, reserve, join and split tables.
 * Layout: drag tables, add tables and decor, draw walls and zones.
 * - components/TopBar.vue       logo, the room, service or layout, covers, more
 * - components/TablePanel.vue   the picked table and what to do next
 * - components/Waitlist.vue     who's waiting and the table for them
 * - components/LayoutPanel.vue  tools, tables and decor to add, the picked table's settings
 * - useFloor.ts                 rooms, service, waitlist, kept in localStorage
 */
import { computed, ref, watch } from 'vue'
import { MBottomSheet, MButton, MChip, MFloorPlan, useToast, useWindowSizeClass, type FloorTable } from '@m3ui-vue/m3ui-vue'
import TopBar from './components/TopBar.vue'
import TablePanel from './components/TablePanel.vue'
import Waitlist from './components/Waitlist.vue'
import LayoutPanel from './components/LayoutPanel.vue'
import { STATUSES, useFloor } from './useFloor'

const f = useFloor()
const toast = useToast()
const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')

const editing = ref(false)
const tool = ref<'select' | 'wall' | 'area'>('select')
const selection = ref<(string | number)[]>([])
/** Service: the table whose panel is open */
const picked = computed(() => (!editing.value && selection.value.length === 1 ? selection.value[0] : undefined))
/** Service: joining the picked table with the next one clicked */
const joining = ref<string | number | null>(null)
const waitlistOpen = ref(false)
const layoutOpen = ref(false)
watch([editing, f.roomId], () => {
  selection.value = []
  joining.value = null
  tool.value = 'select'
})

// While editing, the layout is the room's own; in service, the tables carry their status and badge
const tables = computed(() => (editing.value ? f.room.value.tables : f.tables.value))
function onTables(next: FloorTable[]) {
  f.patchRoom({ tables: next.map(({ status: _s, badge: _b, ...t }) => t) })
}

function onTableClick(t: FloorTable) {
  if (editing.value) return
  if (joining.value !== null) {
    const a = joining.value
    joining.value = null
    if (a === t.id || f.groupOf(a).includes(t.id)) return
    const rest = f.room.value.merges.filter((m) => !m.tables.includes(a) && !m.tables.includes(t.id))
    const tablesJoined = [...f.groupOf(a), ...f.groupOf(t.id)]
    const label = tablesJoined.map((id) => f.room.value.tables.find((x) => x.id === id)?.label).join(' + ')
    f.patchRoom({ merges: [...rest, { id: `m-${tablesJoined.join('-')}`, tables: tablesJoined, label }] })
    toast.success(`Joined ${label}`)
    selection.value = [a]
    return
  }
  selection.value = [t.id]
}
function showTable(room: string, table: string | number) {
  editing.value = false
  f.roomId.value = room
  // After the room switch has cleared the selection
  setTimeout(() => (selection.value = [table]))
  waitlistOpen.value = false
}
const legend = computed(() => (Object.keys(STATUSES) as (keyof typeof STATUSES)[]).map((k) => ({ k, ...STATUSES[k], n: f.counts.value[k] ?? 0 })))
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden text-on-surface" :class="wide ? 'bg-surface-container' : 'bg-surface'">
    <TopBar v-model:editing="editing" :wide="wide" />
    <div class="flex min-h-0 flex-1">
      <main class="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-y-auto p-3 sm:p-4" :class="wide && 'mb-2 ml-2 rounded-2xl bg-surface'">
        <div v-if="!editing" class="flex flex-wrap gap-2">
          <MChip v-for="l in legend" :key="l.k" :icon="l.icon ?? 'table_restaurant'">{{ l.label }} · {{ l.n }}</MChip>
          <MButton v-if="!wide" variant="tonal" size="sm" icon="hourglass_top" class="ml-auto" @click="waitlistOpen = true">Waitlist · {{ f.waitlist.value.length }}</MButton>
        </div>
        <div v-else-if="!wide" class="flex">
          <MButton variant="tonal" size="sm" icon="tune" @click="layoutOpen = true">Tools and tables</MButton>
        </div>
        <div v-if="joining !== null" class="flex items-center gap-2 rounded-lg bg-primary-container px-3 py-2 text-body-medium text-on-primary-container">
          Pick the table to join with {{ f.room.value.tables.find((t) => t.id === joining)?.label }}
          <MButton variant="text" size="xs" class="ml-auto" @click="joining = null">Cancel</MButton>
        </div>
        <MFloorPlan
          :tables="tables"
          :areas="f.room.value.areas"
          :walls="f.room.value.walls"
          :decor="f.room.value.decor"
          :merges="f.room.value.merges"
          v-model:selection="selection"
          v-model:tool="tool"
          :statuses="STATUSES"
          :editable="editing"
          :grid="20"
          class="mx-auto max-w-[calc((100dvh-11rem)*5/3)] shrink-0"
          @update:tables="onTables"
          @update:areas="f.patchRoom({ areas: $event })"
          @update:walls="f.patchRoom({ walls: $event })"
          @update:decor="f.patchRoom({ decor: $event })"
          @table-click="onTableClick"
        />
      </main>

      <aside v-if="wide" class="mr-2 mb-2 ml-2 w-96 shrink-0 overflow-y-auto rounded-2xl bg-surface">
        <LayoutPanel v-if="editing" v-model:tool="tool" :selected="selection" @select="selection = $event" />
        <template v-else>
          <TablePanel v-if="picked !== undefined" :id="picked" @join="joining = picked!" @close="selection = []" />
          <div v-if="picked !== undefined" class="mx-4 border-t border-outline-variant" />
          <Waitlist @show="showTable" />
        </template>
      </aside>
    </div>

    <template v-if="!wide">
      <MBottomSheet :model-value="picked !== undefined && joining === null" @update:model-value="!$event && (selection = [])">
        <TablePanel v-if="picked !== undefined" :id="picked" @join="joining = picked!" @close="selection = []" />
      </MBottomSheet>
      <MBottomSheet v-model="waitlistOpen">
        <Waitlist @show="showTable" />
      </MBottomSheet>
      <MBottomSheet v-model="layoutOpen">
        <LayoutPanel v-model:tool="tool" :selected="selection" @select="selection = $event" />
      </MBottomSheet>
    </template>
  </div>
</template>
