// The project: its tasks (around today, so the plan always reads as current), the people on it, and the view's
// switches. Module state, shared by the example's components.
import { ref } from 'vue'
import { scheduleTasks, type GanttTask } from '@m3ui-vue/m3ui-vue/gantt'

export interface Person { id: string; name: string }
export interface TaskData { owner?: string }

export const people: Person[] = [
  { id: 'ada', name: 'Ada Brooks' },
  { id: 'linus', name: 'Linus Okafor' },
  { id: 'grace', name: 'Grace Kim' },
  { id: 'evan', name: 'Evan Silva' },
  { id: 'luca', name: 'Luca Moretti' },
]
export const personById = new Map(people.map((p) => [p.id, p]))

const pad = (n: number) => String(n).padStart(2, '0')
// Days from this week's Monday
export function day(offset: number) {
  const d = new Date()
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + offset)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function sample(): GanttTask<TaskData>[] {
  const t = (id: string, name: string, s: number, e: number | null, extra: Partial<GanttTask<TaskData>> = {}): GanttTask<TaskData> => ({
    id, name, start: day(s), ...(e === null ? { type: 'milestone' as const } : { end: day(e) }), ...extra,
  })
  // Baselines: the plan as first agreed
  const b = (s: number, e: number) => ({ baselineStart: day(s), baselineEnd: day(e) })
  return [
    t('disc', 'Discovery', -21, -8),
    t('kick', 'Kickoff', -21, null, { parentId: 'disc' }),
    t('int', 'Stakeholder interviews', -21, -15, { parentId: 'disc', progress: 100, data: { owner: 'ada' }, dependencies: ['kick'], ...b(-21, -16) }),
    t('aud', 'Content audit', -18, -11, { parentId: 'disc', progress: 100, data: { owner: 'luca' }, dependencies: [{ id: 'kick', type: 'SS', lag: 3 }], ...b(-18, -12) }),
    t('brief', 'Brief signed off', -8, null, { parentId: 'disc', dependencies: ['int', 'aud'] }),
    t('des', 'Design', -7, 11),
    t('ia', 'Information architecture', -7, -3, { parentId: 'des', progress: 100, color: 'tertiary', data: { owner: 'ada' }, dependencies: ['brief'], ...b(-7, -4) }),
    t('wire', 'Wireframes', -2, 4, { parentId: 'des', progress: 60, color: 'tertiary', data: { owner: 'grace' }, dependencies: ['ia'], ...b(-3, 1) }),
    t('vis', 'Visual design', 3, 11, { parentId: 'des', progress: 10, color: 'tertiary', data: { owner: 'grace' }, dependencies: [{ id: 'wire', type: 'SS', lag: 4 }], ...b(1, 8) }),
    t('build', 'Build', 4, 32),
    t('cms', 'CMS setup', 4, 12, { parentId: 'build', progress: 20, data: { owner: 'linus' }, dependencies: ['wire'], ...b(2, 10) }),
    t('front', 'Front end', 12, 26, { parentId: 'build', data: { owner: 'evan' }, dependencies: ['vis'], ...b(9, 22) }),
    t('migr', 'Content migration', 13, 25, { parentId: 'build', color: 'secondary', data: { owner: 'luca' }, dependencies: ['cms'], ...b(11, 22) }),
    t('qa', 'QA and fixes', 26, 32, { parentId: 'build', color: 'secondary', data: { owner: 'evan' }, dependencies: ['front', { id: 'migr', type: 'FF', lag: 2 }], ...b(23, 29) }),
    t('launch', 'Launch', 35, null, { color: 'success', dependencies: ['qa'] }),
    t('train', 'Editor training', 28, 31, { color: 'secondary', data: { owner: 'luca' }, dependencies: ['migr'] }),
  ]
}

// Each task as soon as what it waits for allows, in working days: the plan is tight, so its critical path runs
// from start to launch
export const tasks = ref<GanttTask<TaskData>[]>(scheduleTasks(sample(), { mode: 'asap', calendar: {} }))
export const projectName = ref('Website relaunch')
export const showCritical = ref(true)
export const showBaselines = ref(false)
export const autoSchedule = ref(true)

let seq = 0
export const newId = () => `task-${Date.now().toString(36)}-${++seq}`
