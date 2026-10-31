// The workflow being edited and its test runs. Module-level, so it survives leaving and coming back.
import { computed, reactive, ref, shallowRef } from 'vue'
import { layoutLayered, type FlowEdge, type FlowNode } from '@m3ui-vue/m3ui-vue/flow'
import { kindById } from './catalog'

export interface StepData {
  kind: string
  label: string
  config: Record<string, string>
}
export type Status = 'running' | 'done' | 'failed' | 'skipped'
export interface LogLine { at: number; text: string; tone: 'info' | 'ok' | 'error' }

let seq = 0
export const newId = (prefix = 's') => `${prefix}${Date.now().toString(36)}${(seq++).toString(36)}`

export function makeStep(kind: string, position = { x: 0, y: 0 }): FlowNode<StepData> {
  const k = kindById.get(kind)!
  const config: Record<string, string> = {}
  for (const f of k.fields) if (f.type === 'select') config[f.key] = f.options![0]!
  return { id: newId(), type: k.branches ? 'branch' : 'step', position, data: { kind, label: k.label, config } }
}

// Starts with a signup flow
const start: { id: string; kind: string; label: string; config: Record<string, string> }[] = [
  { id: 'hook', kind: 'webhook', label: 'New signup', config: { path: '/hooks/signup' } },
  { id: 'wait', kind: 'delay', label: 'Wait a minute', config: { for: '1 minute' } },
  { id: 'plan', kind: 'condition', label: 'Picked Pro?', config: { rule: 'plan is "Pro"', test: 'yes' } },
  { id: 'sales', kind: 'chat', label: 'Tell sales', config: { channel: '#sales', text: 'New Pro signup: {{ name }}' } },
  { id: 'crm', kind: 'http', label: 'Create CRM lead', config: { method: 'POST', url: 'https://crm.example.dev/v1/leads' } },
  { id: 'welcome', kind: 'email', label: 'Welcome email', config: { to: '{{ email }}', subject: 'Welcome aboard', body: '' } },
  { id: 'sheet', kind: 'row', label: 'Log signup', config: { sheet: 'Signups' } },
]
const startEdges: FlowEdge[] = ([
  { id: 'a', source: 'hook', target: 'wait' },
  { id: 'b', source: 'wait', target: 'plan' },
  { id: 'c', source: 'plan', sourceHandle: 'yes', target: 'sales' },
  { id: 'd', source: 'sales', target: 'crm' },
  { id: 'e', source: 'plan', sourceHandle: 'no', target: 'welcome' },
  { id: 'f', source: 'crm', target: 'sheet' },
  { id: 'g', source: 'welcome', target: 'sheet' },
] as FlowEdge[]).map((e) => ({ ...e, type: 'flow' }))
const startNodes: FlowNode<StepData>[] = start.map((s) => ({
  id: s.id,
  type: kindById.get(s.kind)!.branches ? 'branch' : 'step',
  position: { x: 0, y: 0 },
  data: { kind: s.kind, label: s.label, config: s.config },
}))
// Laid out once with the library's layered layout, at about the nodes' size
const placed = layoutLayered(startNodes, startEdges, { direction: 'LR', defaultSize: { width: 240, height: 72 }, gap: 48, levelGap: 72 })
for (const n of startNodes) n.position = placed[n.id]!

const nodes = shallowRef<FlowNode<StepData>[]>(startNodes)
const edges = shallowRef<FlowEdge[]>(startEdges)
const name = ref('Signup follow-up')
const status = reactive(new Map<string, Status>())
const activeEdges = reactive(new Set<string>())
const log = ref<LogLine[]>([])
const running = ref(false)
const edited = ref(false)

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** A test run: from every trigger, each step in turn, down the branches their settings pick */
async function run(): Promise<{ ok: boolean; seconds: number } | null> {
  if (running.value) return null
  const byId = new Map(nodes.value.map((n) => [n.id, n]))
  const triggers = nodes.value.filter((n) => kindById.get(n.data!.kind)?.category === 'trigger')
  status.clear()
  activeEdges.clear()
  log.value = []
  const t0 = performance.now()
  const say = (text: string, tone: LogLine['tone'] = 'info') => log.value.push({ at: performance.now() - t0, text, tone })
  if (!triggers.length) {
    say('Add a trigger to start the workflow', 'error')
    return { ok: false, seconds: 0 }
  }
  running.value = true
  let ok = true
  const seen = new Set<string>()
  let wave = triggers.map((n) => n.id)
  while (wave.length) {
    const next: string[] = []
    await Promise.all(wave.map(async (id) => {
      if (seen.has(id)) return
      seen.add(id)
      const n = byId.get(id)!
      const kind = kindById.get(n.data!.kind)!
      status.set(id, 'running')
      say(`${n.data!.label} started`)
      await sleep((kind.seconds ?? 0.6) * 1000)
      const missing = kind.fields.find((f) => f.required && !n.data!.config[f.key]?.trim())
      if (missing) {
        status.set(id, 'failed')
        say(`${n.data!.label}: ${missing.label} is required`, 'error')
        ok = false
        return
      }
      status.set(id, 'done')
      say(`${n.data!.label} done`, 'ok')
      // A condition takes the branch its test setting says; the other side is skipped
      const out = edges.value.filter((e) => e.source === id && (!kind.branches || e.sourceHandle === n.data!.config.test))
      for (const e of out) {
        activeEdges.add(e.id)
        next.push(e.target)
      }
    }))
    if (next.length) await sleep(350)
    wave = next
  }
  for (const n of nodes.value) if (!status.has(n.id)) status.set(n.id, 'skipped')
  running.value = false
  const seconds = (performance.now() - t0) / 1000
  say(ok ? `Run finished in ${seconds.toFixed(1)} s` : 'Run stopped with errors', ok ? 'ok' : 'error')
  return { ok, seconds }
}

function clearRun() {
  status.clear()
  activeEdges.clear()
}

export function useWorkflow() {
  return {
    nodes,
    edges,
    name,
    status,
    activeEdges,
    log,
    running,
    edited,
    run,
    clearRun,
    hasRun: computed(() => status.size > 0),
  }
}
