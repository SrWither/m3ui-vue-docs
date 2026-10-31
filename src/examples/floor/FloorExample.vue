<script setup lang="ts">
/*
 * Floor example (Seated): a restaurant host stand on the Floor plan family, built only with m3ui-vue. Two rooms with
 * their tables, zones, walls and decor (two decor kinds of its own: a host stand and a TV).
 * Service: every table colored by what's happening there, minutes seated as a badge, each server's initials beside
 * their tables (#overlay), a waitlist that points at the table that fits each party; seat, bill, clear, clean,
 * reserve; join tables with the plan's merge() (canMerge refuses two open bills) and split them.
 * Layout: MFloorPlanToolbar (tools, add, duplicate, delete, undo) and MFloorPlanInspector (with a Server field of
 * the app's own in its #table slot).
 * - components/TopBar.vue       logo, the room, Service or Layout, covers, more
 * - components/TablePanel.vue   the picked table and what to do next
 * - components/Waitlist.vue     who's waiting and the table for them
 * - useFloor.ts                 rooms, service, servers, waitlist, kept in localStorage
 */
import { computed, ref, watch } from 'vue'
import {
  MBottomSheet,
  MButton,
  MChip,
  MFloorPlan,
  MFloorPlanInspector,
  MFloorPlanToolbar,
  MSelect,
  useToast,
  useWindowSizeClass,
  type FloorArea,
  type FloorDecor,
  type FloorMerge,
  type FloorTable,
  type FloorWall,
} from '@m3ui-vue/m3ui-vue'
import TopBar from './components/TopBar.vue'
import TablePanel from './components/TablePanel.vue'
import Waitlist from './components/Waitlist.vue'
import { DECOR_KINDS, SERVERS, STATUSES, useFloor } from './useFloor'

const f = useFloor()
const toast = useToast()
const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')

const plan = ref<InstanceType<typeof MFloorPlan>>()
const editing = ref(false)
const tool = ref<'select' | 'wall' | 'area'>('select')
const selection = ref<(string | number)[]>([])
/** Service: joining the picked table with the next one clicked */
const joining = ref(false)
/** Service: the table whose panel is open */
const picked = computed(() => (!editing.value && !joining.value && selection.value.length === 1 ? selection.value[0] : undefined))
const waitlistOpen = ref(false)
const inspectorOpen = ref(false)
watch([editing, f.roomId], () => {
  selection.value = []
  joining.value = false
  tool.value = 'select'
})

// The room's layout, through the plan's v-models. In service the tables also carry their status and badge
const tables = computed({
  get: () => (editing.value ? f.room.value.tables : f.tables.value),
  set: (next: FloorTable[]) => f.patchRoom({ tables: next.map(({ status: _s, badge: _b, ...t }) => t) }),
})
const areas = computed({ get: () => f.room.value.areas, set: (v: FloorArea[]) => f.patchRoom({ areas: v }) })
const walls = computed({ get: () => f.room.value.walls, set: (v: FloorWall[]) => f.patchRoom({ walls: v }) })
const decor = computed({ get: () => f.room.value.decor, set: (v: FloorDecor[]) => f.patchRoom({ decor: v }) })
const merges = computed({ get: () => f.room.value.merges, set: (v: FloorMerge[]) => f.patchRoom({ merges: v }) })

// ── Joining tables: the plan's merge(), with a rule of the house ────────────────────────────────────────
function canMerge(ids: (string | number)[]) {
  const open = ids.filter((id) => ['seated', 'bill'].includes(f.serviceOf(id).status) && (f.serviceOf(id).guests ?? 0) > 0)
  return open.length > 1 ? "Two open bills can't be joined: close one first" : true
}
// Joining: pick as many tables as you like, then join them all (canMerge still has the last word)
function startJoin() {
  joining.value = true
}
function join() {
  const m = plan.value?.merge(selection.value)
  if (!m) return
  toast.success(`Joined ${m.label}`)
  joining.value = false
  selection.value = [m.tables[0]!]
}
function split() {
  if (picked.value !== undefined) plan.value?.split(picked.value)
}

function showTable(room: string, table: string | number) {
  editing.value = false
  f.roomId.value = room
  // After the room switch has cleared the selection
  setTimeout(() => (selection.value = [table]))
  waitlistOpen.value = false
}
const serverOf = (t: FloorTable) => SERVERS.find((s) => s.id === t.data?.server)
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
        <div v-else class="flex flex-wrap items-center gap-2">
          <MFloorPlanToolbar
            :plan="plan"
            :tables="[
              { shape: 'round', seats: 2 },
              { shape: 'round', seats: 4 },
              { shape: 'square', seats: 4 },
              { shape: 'rect', seats: 6 },
              { name: 'Stool', shape: 'round', seats: 1, width: 40 },
            ]"
          />
          <MButton v-if="!wide" variant="tonal" size="sm" icon="tune" @click="inspectorOpen = true">Settings</MButton>
        </div>
        <div v-if="joining" class="flex flex-wrap items-center gap-2 rounded-lg bg-primary-container px-3 py-2 text-body-medium text-on-primary-container">
          Pick the tables to join ({{ selection.length }} picked)
          <span class="flex-1" />
          <MButton variant="text" size="xs" @click="joining = false; selection = []">Cancel</MButton>
          <MButton size="xs" icon="join" :disabled="selection.length < 2" @click="join">Join {{ selection.length > 1 ? selection.length : '' }} tables</MButton>
        </div>
        <MFloorPlan
          ref="plan"
          v-model:tables="tables"
          v-model:areas="areas"
          v-model:walls="walls"
          v-model:decor="decor"
          v-model:merges="merges"
          v-model:selection="selection"
          v-model:tool="tool"
          :statuses="STATUSES"
          :decor-kinds="DECOR_KINDS"
          :editable="editing"
          :selectable="joining ? 'multiple' : 'single'"
          :can-merge="canMerge"
          :grid="20"
          class="mx-auto max-w-[calc((100dvh-12rem)*5/3)] shrink-0"
          @merge-refused="(_, reason) => toast.error(reason)"
        >
          <!-- Each server's initials beside their tables, in plan units -->
          <template #overlay="{ toPx }">
            <template v-if="!editing">
              <span
                v-for="t in tables.filter((x) => serverOf(x))"
                :key="t.id"
                class="pointer-events-none absolute flex size-5 items-center justify-center rounded-full text-[10px] font-medium text-white shadow-elevation-1"
                :style="{ left: `${toPx(t.x - 46)}px`, top: `${toPx(t.y + 24)}px`, background: serverOf(t)!.color }"
              >{{ serverOf(t)!.name[0] }}</span>
            </template>
          </template>
        </MFloorPlan>
      </main>

      <aside v-if="wide" class="mr-2 mb-2 ml-2 w-96 shrink-0 overflow-y-auto rounded-2xl bg-surface">
        <MFloorPlanInspector v-if="editing" :plan="plan" class="p-4">
          <!-- A field of the app's own, below the table's built-in ones -->
          <template #table="{ table, update }">
            <MSelect
              :model-value="(table.data?.server as string) ?? ''"
              :options="[{ value: '', label: 'No server' }, ...SERVERS.map((s) => ({ value: s.id, label: s.name }))]"
              label="Server"
              variant="outlined"
              @update:model-value="update({ data: { ...table.data, server: $event || undefined } })"
            />
          </template>
        </MFloorPlanInspector>
        <template v-else>
          <TablePanel v-if="picked !== undefined" :id="picked" @join="startJoin" @split="split" @close="selection = []" />
          <div v-if="picked !== undefined" class="mx-4 border-t border-outline-variant" />
          <Waitlist @show="showTable" />
        </template>
      </aside>
    </div>

    <template v-if="!wide">
      <MBottomSheet :model-value="picked !== undefined" @update:model-value="!$event && (selection = [])">
        <TablePanel v-if="picked !== undefined" :id="picked" @join="startJoin" @split="split" @close="selection = []" />
      </MBottomSheet>
      <MBottomSheet v-model="waitlistOpen">
        <Waitlist @show="showTable" />
      </MBottomSheet>
      <MBottomSheet v-model="inspectorOpen">
        <MFloorPlanInspector :plan="plan" class="p-4" />
      </MBottomSheet>
    </template>
  </div>
</template>
