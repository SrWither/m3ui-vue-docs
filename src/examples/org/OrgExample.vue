<script setup lang="ts">
/*
 * Org chart example (Crew): a company's org chart built only with m3ui-vue, on MFlow's tree layout. Fold and
 * unfold teams, filter by department, find someone and fly to them, open a profile, and drag a person onto
 * someone else to change who they report to: the chart lays itself out again, every card springing to its place.
 * - components/TopBar.vue      logo, people search, theme, docs and source
 * - components/PersonNode.vue  a person's card, with the button that folds their team
 * - components/Profile.vue     the selected person's details, manager and reports
 * - useOrg.ts / people.ts      who reports to whom, folded teams, the filter; the company
 */
import { computed, nextTick, ref } from 'vue'
import { MChip, MIconButton, MSegmentedButton, MSideSheet, MTooltip, useToast, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import { MFlow, MFlowControls, MFlowMinimap, type FlowContext, type FlowNode, type FlowSelection } from '@m3ui-vue/m3ui-vue/flow'
import { depts, type Person } from './people'
import { useOrg } from './useOrg'
import TopBar from './components/TopBar.vue'
import PersonNode from './components/PersonNode.vue'
import Profile from './components/Profile.vue'

const org = useOrg()
const toast = useToast()
const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')
const compact = computed(() => widthClass.value === 'compact')

const flow = ref<InstanceType<typeof MFlow>>()
const direction = ref<'vertical' | 'horizontal'>('vertical')
const selection = ref<FlowSelection>({ nodes: [], edges: [] })
const selected = computed(() => {
  const id = selection.value.nodes.length === 1 ? selection.value.nodes[0] : undefined
  return id ? org.byId.value.get(id) : undefined
})
const profileOpen = computed({
  get: () => !!selected.value,
  set: (v) => { if (!v) selection.value = { nodes: [], edges: [] } },
})

// Once the chart has laid itself out again (MFlow does it on its own when its shape changes; doing it here too
// lets us wait for it), run `then`
// Through the template ref Vue unwraps MFlow's refs: `f.viewport.zoom`, not `f.viewport.value.zoom`
type Flow = InstanceType<typeof MFlow>
async function afterLayout(then: (f: Flow) => void) {
  await nextTick()
  await nextTick()
  const f = flow.value
  if (!f) return
  await f.layout()
  then(f)
}
function centerOn(f: Flow, id: string, zoom?: number) {
  const p = f.getAbsolutePosition(id)
  const s = f.getSize(id)
  f.setCenter(p.x + s.width / 2, p.y + s.height / 2, { zoom })
}

/** Unfolds the way to someone, selects them and flies there */
function open(id: string) {
  org.reveal(id)
  org.focusId.value = id
  selection.value = { nodes: [id], edges: [] }
  afterLayout((f) => centerOn(f, id, Math.max(1, f.viewport.zoom)))
  setTimeout(() => { if (org.focusId.value === id) org.focusId.value = null }, 2500)
}
// Folding or unfolding someone's team lays the chart out again, which would move their card: the view moves the
// other way, with the same spring the nodes use, so the card stays put on screen while the rest settles around it
const folding = new Set<string>()
async function toggle(id: string) {
  if (folding.has(id)) return
  const before = flow.value?.getAbsolutePosition(id)
  // Folding: the team gathers into the card first, then hides
  if (!org.collapsed.value.has(id)) {
    folding.add(id)
    await org.gather(id)
    folding.delete(id)
  }
  org.toggle(id)
  afterLayout((f) => {
    const after = org.nodes.value.find((n) => n.id === id)?.position
    if (!before || !after) return
    const v = f.viewport
    f.setViewport({ x: v.x - (after.x - before.x) * v.zoom, y: v.y - (after.y - before.y) * v.zoom })
  })
}
const fitAll = () => afterLayout((f) => f.fitView())

// ── Drag a person onto someone else to change their manager ─────────────────────────────────────────────
const dropTarget = ref<string | null>(null)
function targetFor(n: FlowNode) {
  const hit = flow.value?.getIntersectingNodes(n.id).find((m) => !org.team(n.id).includes(m.id) && m.id !== n.id)
  return hit?.id ?? null
}
function onDrag(nodes: FlowNode[]) {
  dropTarget.value = nodes.length === 1 ? targetFor(nodes[0]!) : null
}
function onDragStop({ nodes }: { nodes: FlowNode[] }) {
  const target = dropTarget.value
  dropTarget.value = null
  const person = nodes[0]?.data as Person | undefined
  if (target && person && target !== person.managerId) {
    const before = person.managerId!
    const manager = org.byId.value.get(target)!
    if (org.reassign(person.id, target)) {
      toast.show(`${person.name} now reports to ${manager.name}`, 'info', {
        action: { label: 'Undo', onClick: () => org.reassign(person.id, before) },
      })
      return
    }
  }
  // Anywhere else: back to their place in the tree
  flow.value?.layout()
}

function onInit(f: FlowContext) {
  f.fitView({ animate: false })
}
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden text-on-surface" :class="wide ? 'bg-surface-container' : 'bg-surface'">
    <TopBar :wide="wide" @open="open" />
    <div class="flex min-h-0 flex-1">
      <main class="relative min-w-0 flex-1 overflow-hidden bg-surface" :class="wide && 'mx-2 mb-2 rounded-2xl'">
        <MFlow
          ref="flow"
          v-model:nodes="org.nodes.value"
          v-model:selection="selection"
          :edges="org.edges.value"
          layout="tree"
          :layout-options="{ gap: 24, levelGap: 56 }"
          :direction="direction"
          :nodes-connectable="false"
          :delete-keys="null"
          :history="false"
          :guides="false"
          :zoom-on-double-click="false"
          :min-zoom="0.1"
          label="Org chart"
          class="absolute inset-0"
          @init="onInit"
          @node-drag="onDrag"
          @node-drag-stop="onDragStop"
          @node-dblclick="(n) => toggle(n.id)"
        >
          <template #node-person="{ node, selected: isSelected, dragging }">
            <PersonNode :person="node.data" :selected="isSelected" :dragging="dragging" :drop-target="dropTarget === node.id" @toggle="toggle(node.id)" />
          </template>

          <div class="absolute top-3 right-3 left-3 z-20 flex items-center gap-2 overflow-x-auto pb-1" style="scrollbar-width: none">
            <MSegmentedButton
              v-model="direction"
              :options="[{ value: 'vertical', label: compact ? '' : 'Top down', icon: 'south' }, { value: 'horizontal', label: compact ? '' : 'Left to right', icon: 'east' }]"
              class="shrink-0"
              @update:model-value="fitAll"
            />
            <MChip
              v-for="d in depts"
              :key="d.id"
              type="filter"
              :selected="org.filter.value === d.id"
              elevated
              class="shrink-0"
              @update:selected="(on) => (org.filter.value = on ? d.id : null)"
            >{{ d.id }}</MChip>
            <span class="flex-1" />
            <MTooltip text="Unfold everyone" placement="bottom"><MIconButton icon="unfold_more" label="Unfold everyone" variant="tonal" @click="org.expandAll(); fitAll()" /></MTooltip>
            <MTooltip text="Fold teams" placement="bottom"><MIconButton icon="unfold_less" label="Fold teams" variant="tonal" @click="org.collapseAll(); fitAll()" /></MTooltip>
          </div>
          <MFlowControls :lock="false" />
          <MFlowMinimap v-if="!compact" :node-color="(n) => org.filter.value && (n.data as Person).dept !== org.filter.value ? 'var(--color-surface-container-highest)' : undefined" />
          <div v-if="!compact" class="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-surface-container-high px-4 py-2 text-body-small text-on-surface-variant shadow-elevation-1">
            Drag someone onto a person to change who they report to · double click folds a team
          </div>
        </MFlow>
      </main>

      <aside v-if="wide && selected" class="mr-2 mb-2 w-80 shrink-0 overflow-hidden rounded-2xl bg-surface">
        <Profile :person="selected" @open="open" @close="profileOpen = false" />
      </aside>
    </div>

    <MSideSheet v-if="!wide" v-model="profileOpen">
      <Profile v-if="selected" :person="selected" @open="open" @close="profileOpen = false" />
    </MSideSheet>
  </div>
</template>

<style>
/* People fade in as they appear (an unfolded team), and out as they fold into their manager */
.crew-node {
  animation: crew-in 300ms cubic-bezier(0.2, 0, 0, 1);
  transition: opacity 250ms cubic-bezier(0.2, 0, 0, 1);
}
.crew-leaving {
  opacity: 0;
}
@keyframes crew-in {
  from { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .crew-node { animation: none; transition: none; }
}
</style>
