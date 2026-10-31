// The restaurant's staff, the kinds of shift, and two weeks of shifts around today. Module state, shared by the
// example's components.
import { ref } from 'vue'
import type { TimelineEvent, TimelineResource } from '@m3ui-vue/m3ui-vue/gantt'

export interface StaffData { contract: number }
export interface ShiftKind { id: string; label: string; from: string; to: string; color: NonNullable<TimelineEvent['color']>; icon: string }

export const kinds: ShiftKind[] = [
  { id: 'open', label: 'Opening', from: '07:00', to: '15:00', color: 'tertiary', icon: 'wb_twilight' },
  { id: 'lunch', label: 'Lunch', from: '11:00', to: '16:00', color: 'secondary', icon: 'lunch_dining' },
  { id: 'dinner', label: 'Dinner', from: '18:00', to: '23:30', color: 'primary', icon: 'dinner_dining' },
  { id: 'close', label: 'Closing', from: '19:00', to: '02:00', color: 'neutral', icon: 'nights_stay' },
]
export const kindById = new Map(kinds.map((k) => [k.id, k]))

export const staff: TimelineResource<StaffData>[] = [
  { id: 'ana', name: 'Ana Ruiz', subtitle: 'Head chef', group: 'Kitchen', data: { contract: 40 } },
  { id: 'leo', name: 'Leo Paz', subtitle: 'Line cook', group: 'Kitchen', data: { contract: 40 } },
  { id: 'sam', name: 'Sam Ortiz', subtitle: 'Pastry', group: 'Kitchen', data: { contract: 30 } },
  { id: 'iris', name: 'Iris Dalmau', subtitle: 'Dishwasher', group: 'Kitchen', data: { contract: 20 } },
  { id: 'mia', name: 'Mia Sol', subtitle: 'Floor manager', group: 'Floor', data: { contract: 40 } },
  { id: 'noa', name: 'Noa Vidal', subtitle: 'Server', group: 'Floor', data: { contract: 30 } },
  { id: 'omar', name: 'Omar Haddad', subtitle: 'Server', group: 'Floor', data: { contract: 20 } },
  { id: 'teo', name: 'Teo Lima', subtitle: 'Bartender', group: 'Bar', data: { contract: 30 } },
  { id: 'zoe', name: 'Zoe Grant', subtitle: 'Bartender', group: 'Bar', data: { contract: 20 } },
]

const pad = (n: number) => String(n).padStart(2, '0')
/** `YYYY-MM-DD`, `offset` days from this week's Monday */
export function day(offset: number) {
  const d = new Date()
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + offset)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
/** A shift of a kind on a day; one that ends past midnight ends the next day */
export function shiftOf(kind: ShiftKind, date: string, resourceId: string, id: string): TimelineEvent {
  const [y, m, d] = date.split('-').map(Number)
  const next = new Date(y!, m! - 1, d! + 1)
  const endDate = kind.to < kind.from ? `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}` : date
  return { id, resourceId, start: `${date}T${kind.from}`, end: `${endDate}T${kind.to}`, title: kind.label, color: kind.color, data: { kind: kind.id } }
}

let seq = 0
export const newId = () => `shift-${++seq}`

function sample(): TimelineEvent[] {
  // Who works what, per weekday (Mon … Sun), for two weeks from this one
  const plan: Record<string, (string | null)[]> = {
    ana: ['open', 'open', null, 'dinner', 'dinner', 'dinner', null],
    leo: [null, 'dinner', 'dinner', 'dinner', 'dinner', 'close', null],
    sam: ['open', null, 'open', null, 'open', 'open', null],
    iris: [null, null, null, null, 'dinner', 'dinner', 'lunch'],
    mia: ['lunch', 'lunch', 'lunch', null, 'dinner', 'dinner', null],
    noa: [null, 'dinner', null, 'lunch', 'dinner', 'dinner', 'lunch'],
    omar: [null, null, null, null, null, 'lunch', 'lunch'],
    teo: [null, 'close', 'close', 'close', 'close', null, null],
    zoe: [null, null, null, null, 'dinner', 'close', 'dinner'],
  }
  const out: TimelineEvent[] = []
  for (let w = 0; w < 2; w++) {
    for (const [rid, days] of Object.entries(plan)) {
      days.forEach((k, i) => {
        if (k) out.push(shiftOf(kindById.get(k)!, day(w * 7 + i), rid, newId()))
      })
    }
  }
  // Teo is down for dinner and closing on Tuesday: a double booking to sort out
  out.push(shiftOf(kindById.get('dinner')!, day(1), 'teo', newId()))
  return out
}

export const shifts = ref<TimelineEvent[]>(sample())
