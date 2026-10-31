import type { GanttTask, TimelineEvent, TimelineResource } from '@m3ui-vue/m3ui-vue/gantt'

// Dates around today, so the demos always show the "today" line inside the plan
const pad = (n: number) => String(n).padStart(2, '0')
function day(offset: number) {
  const d = new Date()
  // From this week's Monday
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + offset)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
export const dayFrom = day
export const at = (offset: number, time: string) => `${day(offset)}T${time}`

export function launchPlan(): GanttTask[] {
  return [
    { id: 'plan', name: 'Planning', start: day(-14), end: day(-3) },
    { id: 'brief', name: 'Brief and goals', start: day(-14), end: day(-11), parentId: 'plan', progress: 100, baselineStart: day(-14), baselineEnd: day(-12) },
    { id: 'research', name: 'User research', start: day(-10), end: day(-5), parentId: 'plan', progress: 100, dependencies: ['brief'], baselineStart: day(-11), baselineEnd: day(-7) },
    { id: 'scope', name: 'Scope signed off', start: day(-4), type: 'milestone', parentId: 'plan', dependencies: ['research'] },
    { id: 'build', name: 'Build', start: day(-3), end: day(18) },
    { id: 'design', name: 'Design', start: day(-3), end: day(4), parentId: 'build', progress: 70, color: 'tertiary', dependencies: ['scope'], baselineStart: day(-3), baselineEnd: day(2) },
    { id: 'api', name: 'API', start: day(0), end: day(10), parentId: 'build', progress: 35, dependencies: [{ id: 'design', type: 'SS', lag: 3 }], baselineStart: day(0), baselineEnd: day(9) },
    { id: 'app', name: 'App', start: day(5), end: day(16), parentId: 'build', progress: 10, dependencies: ['design'], baselineStart: day(3), baselineEnd: day(14) },
    { id: 'qa', name: 'QA', start: day(14), end: day(18), parentId: 'build', color: 'secondary', dependencies: [{ id: 'app', type: 'FF', lag: 2 }, 'api'] },
    { id: 'launch', name: 'Launch', start: day(21), type: 'milestone', dependencies: ['qa'] },
    { id: 'docs', name: 'Docs', start: day(9), end: day(19), progress: 0, color: 'secondary', dependencies: ['api'] },
  ]
}

export const staff: TimelineResource[] = [
  { id: 'ana', name: 'Ana Ruiz', subtitle: 'Head chef', group: 'Kitchen', color: 'tertiary' },
  { id: 'leo', name: 'Leo Paz', subtitle: 'Line cook', group: 'Kitchen', color: 'tertiary' },
  { id: 'sam', name: 'Sam Ortiz', subtitle: 'Pastry', group: 'Kitchen', color: 'tertiary' },
  { id: 'mia', name: 'Mia Sol', subtitle: 'Floor manager', group: 'Floor', color: 'primary' },
  { id: 'noa', name: 'Noa Vidal', subtitle: 'Server', group: 'Floor', color: 'primary' },
  { id: 'teo', name: 'Teo Lima', subtitle: 'Bartender', group: 'Bar', color: 'secondary' },
]
export function shifts(): TimelineEvent[] {
  const s = (id: string, resourceId: string, d: number, from: string, to: string, title: string, end = d): TimelineEvent => ({ id, resourceId, start: at(d, from), end: at(end, to), title })
  return [
    s('a1', 'ana', 0, '09:00', '17:00', 'Morning'), s('a2', 'ana', 1, '09:00', '17:00', 'Morning'), s('a3', 'ana', 3, '14:00', '23:00', 'Evening'),
    s('l1', 'leo', 0, '15:00', '23:30', 'Evening'), s('l2', 'leo', 2, '15:00', '23:30', 'Evening'), s('l3', 'leo', 2, '11:00', '16:00', 'Lunch'),
    s('p1', 'sam', 1, '06:00', '13:00', 'Bake'), s('p2', 'sam', 4, '06:00', '13:00', 'Bake'),
    s('m1', 'mia', 0, '11:00', '19:00', 'Day'), s('m2', 'mia', 3, '17:00', '01:00', 'Night', 4),
    s('n1', 'noa', 1, '12:00', '16:00', 'Lunch'), s('n2', 'noa', 2, '19:00', '23:00', 'Dinner'),
    s('t1', 'teo', 0, '18:00', '02:00', 'Bar', 1), s('t2', 'teo', 4, '18:00', '02:00', 'Bar', 5),
  ]
}
