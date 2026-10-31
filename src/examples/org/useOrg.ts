// The company: who reports to whom, which teams are folded, the department filter. Module-level state.
import { computed, ref, shallowRef } from 'vue'
import type { FlowEdge, FlowNode } from '@m3ui-vue/m3ui-vue/flow'
import { people as startPeople, type Dept, type Person } from './people'

const people = shallowRef<Person[]>(startPeople)
const collapsed = ref(new Set<string>())
const filter = ref<Dept | null>(null)
const focusId = ref<string | null>(null)

const byId = computed(() => new Map(people.value.map((p) => [p.id, p])))
const reports = computed(() => {
  const m = new Map<string, Person[]>()
  for (const p of people.value) if (p.managerId) (m.get(p.managerId) ?? m.set(p.managerId, []).get(p.managerId)!).push(p)
  return m
})
/** Everyone under someone, at any depth */
function team(id: string): string[] {
  const out: string[] = []
  const walk = (i: string) => (reports.value.get(i) ?? []).forEach((r) => { out.push(r.id); walk(r.id) })
  walk(id)
  return out
}
/** The managers above someone, nearest first */
function chain(id: string): Person[] {
  const out: Person[] = []
  for (let p = byId.value.get(id); p?.managerId && out.length < 50; p = byId.value.get(p.managerId)) out.push(byId.value.get(p.managerId)!)
  return out
}
const hidden = computed(() => {
  const s = new Set<string>()
  for (const id of collapsed.value) team(id).forEach((t) => s.add(t))
  return s
})

/**
 * The chart's nodes: one per person, hidden under a folded manager. Positions belong to MFlow's tree layout, so
 * existing nodes keep theirs; a new or unfolded person starts where their manager is and springs out from there.
 */
const nodes = shallowRef<FlowNode<Person>[]>([])
function syncNodes() {
  const prev = new Map(nodes.value.map((n) => [n.id, n]))
  nodes.value = people.value.map((p) => {
    const old = prev.get(p.id)
    const isHidden = hidden.value.has(p.id)
    const from = (p.managerId && prev.get(p.managerId)?.position) || { x: 0, y: 0 }
    const position = old && !old.hidden ? old.position : { ...from }
    return { id: p.id, type: 'person', position, data: p, hidden: isHidden || undefined, connectable: false }
  })
}
syncNodes()
const edges = computed<FlowEdge[]>(() => people.value
  .filter((p) => p.managerId)
  .map((p) => ({ id: `${p.managerId}-${p.id}`, source: p.managerId!, target: p.id, type: 'smoothstep', markerEnd: 'none', selectable: false, deletable: false })))

function toggle(id: string) {
  const s = new Set(collapsed.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  collapsed.value = s
  syncNodes()
}
function expandAll() {
  collapsed.value = new Set()
  syncNodes()
}
function collapseAll() {
  // Everyone below the top two levels folds away
  collapsed.value = new Set(people.value.filter((p) => p.managerId && !byId.value.get(p.managerId)?.managerId && reports.value.has(p.id)).map((p) => p.id))
  syncNodes()
}
/** Unfolds the managers above someone so they show */
function reveal(id: string) {
  const s = new Set(collapsed.value)
  for (const m of chain(id)) s.delete(m.id)
  collapsed.value = s
  syncNodes()
}
/** Moves someone (and their team) under a new manager; false when it would make a loop */
function reassign(id: string, managerId: string): boolean {
  if (id === managerId || team(id).includes(managerId)) return false
  people.value = people.value.map((p) => (p.id === id ? { ...p, managerId } : p))
  reveal(id)
  return true
}

export function useOrg() {
  return { people, byId, reports, team, chain, nodes, edges, collapsed, filter, focusId, toggle, expandAll, collapseAll, reveal, reassign }
}
