// Seated's restaurant: two rooms (tables, zones, walls, decor), what's happening at each table, merged tables, and
// the waitlist. Kept in this browser's localStorage so a shift survives a reload.
import { computed, ref, watch } from 'vue'
import type { FloorArea, FloorDecor, FloorMerge, FloorStatus, FloorTable, FloorWall } from '@m3ui-vue/m3ui-vue'

export interface Room { id: string; name: string; tables: FloorTable[]; areas: FloorArea[]; walls: FloorWall[]; decor: FloorDecor[]; merges: FloorMerge[] }
/** What's going on at a table (kept apart from the layout) */
export interface Service { status: 'free' | 'seated' | 'bill' | 'reserved' | 'cleaning'; party?: string; guests?: number; since?: number; total?: number; reservedFor?: string }
export interface Party { id: string; name: string; size: number; since: number; note?: string }

export const STATUSES: Record<Service['status'], FloorStatus> = {
  free: { label: 'Free', color: 'surface' },
  seated: { label: 'Seated', color: 'primary', icon: 'restaurant' },
  bill: { label: 'Bill requested', color: 'tertiary', icon: 'receipt_long' },
  reserved: { label: 'Reserved', color: 'secondary', icon: 'event' },
  cleaning: { label: 'To clean', color: 'error', icon: 'cleaning_services' },
}

let n = 0
export const newId = (p: string) => `${p}${Date.now().toString(36)}${(n++).toString(36)}`
const t = (id: string, label: string, x: number, y: number, shape: FloorTable['shape'], seats: number, extra: Partial<FloorTable> = {}): FloorTable => ({ id, label, x, y, shape, seats, ...extra })

function sample(): { rooms: Room[]; service: Record<string, Service>; waitlist: Party[] } {
  const min = (m: number) => Date.now() - m * 60_000
  const hall: Room = {
    id: 'hall',
    name: 'Main hall',
    tables: [
      t('h1', '1', 140, 150, 'round', 4), t('h2', '2', 300, 150, 'round', 4), t('h3', '3', 460, 150, 'round', 2),
      t('h4', '4', 140, 340, 'square', 4), t('h5', '5', 260, 340, 'square', 4), t('h6', '6', 460, 340, 'rect', 6),
      t('h7', '7', 160, 500, 'rect', 8), t('h8', '8', 420, 510, 'round', 6),
      t('bar', 'Bar', 820, 150, 'rect', 0, { width: 220, height: 50 }),
      t('b1', 'B1', 740, 230, 'round', 1, { width: 40 }), t('b2', 'B2', 820, 230, 'round', 1, { width: 40 }), t('b3', 'B3', 900, 230, 'round', 1, { width: 40 }),
    ],
    areas: [{ id: 'dining', label: 'Dining', x: 40, y: 60, width: 560, height: 520, color: 'secondary' }, { id: 'barzone', label: 'Bar', x: 660, y: 60, width: 300, height: 240, color: 'tertiary' }],
    walls: [{ id: 'w1', points: [[20, 30], [980, 30], [980, 590], [20, 590], [20, 30]] }, { id: 'w2', points: [[640, 330], [980, 330]], thickness: 6 }],
    decor: [
      { id: 'door', kind: 'door', x: 320, y: 590 }, { id: 'win1', kind: 'window', x: 200, y: 30 }, { id: 'win2', kind: 'window', x: 440, y: 30 },
      { id: 'p1', kind: 'plant', x: 620, y: 560 }, { id: 'reg', kind: 'register', x: 700, y: 400 }, { id: 'kit', kind: 'kitchen', x: 800, y: 470 },
      { id: 'wc', kind: 'restroom', x: 920, y: 520 }, { id: 'lbl', kind: 'label', x: 830, y: 380, label: 'Kitchen' },
    ],
    merges: [{ id: 'm1', tables: ['h4', 'h5'], label: '4 + 5' }],
  }
  const terrace: Room = {
    id: 'terrace',
    name: 'Terrace',
    tables: [t('t1', 'T1', 150, 160, 'round', 2), t('t2', 'T2', 300, 160, 'round', 2), t('t3', 'T3', 450, 160, 'round', 2), t('t4', 'T4', 200, 380, 'rect', 6, { rotation: 0 }), t('t5', 'T5', 520, 380, 'square', 4)],
    areas: [{ id: 'deck', label: 'Deck', x: 60, y: 60, width: 640, height: 470, color: 'success' }],
    walls: [{ id: 'tw', points: [[40, 40], [720, 40]], thickness: 4 }],
    decor: [{ id: 'tp1', kind: 'plant', x: 80, y: 80 }, { id: 'tp2', kind: 'plant', x: 680, y: 80 }, { id: 'tp3', kind: 'plant', x: 680, y: 500 }, { id: 'ts', kind: 'stairs', x: 840, y: 300 }],
    merges: [],
  }
  return {
    rooms: [hall, terrace],
    service: {
      h1: { status: 'seated', party: 'Ortega', guests: 3, since: min(42), total: 86 },
      h3: { status: 'bill', party: 'Lee', guests: 2, since: min(75), total: 54 },
      h4: { status: 'seated', party: 'Birthday', guests: 7, since: min(18), total: 120 },
      h5: { status: 'seated', party: 'Birthday', guests: 0, since: min(18) },
      h6: { status: 'reserved', reservedFor: 'Nakamura · 21:00' },
      h8: { status: 'cleaning' },
      b2: { status: 'seated', guests: 1, since: min(9), total: 12 },
      t2: { status: 'seated', party: 'Silva', guests: 2, since: min(31), total: 40 },
      t4: { status: 'reserved', reservedFor: 'Team dinner · 20:30' },
    },
    waitlist: [
      { id: 'p1', name: 'García', size: 2, since: min(6) },
      { id: 'p2', name: 'Kowalski', size: 4, since: min(12), note: 'High chair' },
      { id: 'p3', name: 'Rossi', size: 6, since: min(20) },
    ],
  }
}

const KEY = 'm3-example-seated'
function read() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as ReturnType<typeof sample>) : null
  } catch {
    return null
  }
}
const start = read() ?? sample()
const rooms = ref<Room[]>(start.rooms)
const service = ref<Record<string, Service>>(start.service)
const waitlist = ref<Party[]>(start.waitlist)
const roomId = ref('hall')
/** Ticks every 30 s, for the minutes at each table */
const now = ref(Date.now())
setInterval(() => (now.value = Date.now()), 30_000)
watch([rooms, service, waitlist], () => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ rooms: rooms.value, service: service.value, waitlist: waitlist.value }))
  } catch {
    /* blocked or full: the shift just isn't kept */
  }
}, { deep: true })

export function useFloor() {
  const room = computed(() => rooms.value.find((r) => r.id === roomId.value)!)
  function patchRoom(patch: Partial<Room>) {
    rooms.value = rooms.value.map((r) => (r.id === roomId.value ? { ...r, ...patch } : r))
  }
  const serviceOf = (id: string | number) => service.value[String(id)] ?? { status: 'free' as const }
  function setService(id: string | number, s: Service) {
    service.value = { ...service.value, [String(id)]: s }
  }
  /** The tables joined with this one (itself included) */
  const groupOf = (id: string | number) => room.value.merges.find((m) => m.tables.includes(id))?.tables ?? [id]
  /** Tables as drawn: their status and a badge from the service */
  const tables = computed(() =>
    room.value.tables.map((tb) => {
      const s = serviceOf(tb.id)
      const mins = s.since ? Math.max(0, Math.round((now.value - s.since) / 60_000)) : 0
      const badge = s.status === 'seated' && s.since ? `${mins}′` : s.status === 'bill' && s.total ? `$${s.total}` : undefined
      return { ...tb, status: s.status, badge }
    }),
  )
  /** Seats of a table and the ones merged with it */
  const seatsOf = (id: string | number) => groupOf(id).reduce<number>((a, x) => a + (room.value.tables.find((tb) => tb.id === x)?.seats ?? 0), 0)
  /** The smallest free table (or merged group) that fits `size`, across both rooms */
  function suggest(size: number) {
    let best: { room: Room; table: FloorTable; seats: number } | null = null
    for (const r of rooms.value) {
      for (const tb of r.tables) {
        if ((service.value[String(tb.id)]?.status ?? 'free') !== 'free' || !tb.seats) continue
        const group = r.merges.find((m) => m.tables.includes(tb.id))?.tables ?? [tb.id]
        if (group[0] !== tb.id || group.some((x) => (service.value[String(x)]?.status ?? 'free') !== 'free')) continue
        const seats = group.reduce<number>((a, x) => a + (r.tables.find((y) => y.id === x)?.seats ?? 0), 0)
        if (seats >= size && (!best || seats < best.seats)) best = { room: r, table: tb, seats }
      }
    }
    return best
  }
  const covers = computed(() => Object.values(service.value).reduce((a, s) => a + (s.status === 'seated' || s.status === 'bill' ? s.guests ?? 0 : 0), 0))
  const counts = computed(() => {
    const c: Record<string, number> = { free: 0, seated: 0, bill: 0, reserved: 0, cleaning: 0 }
    for (const r of rooms.value) for (const tb of r.tables) if (tb.seats) c[serviceOf(tb.id).status]!++
    return c
  })
  function reset() {
    const s = sample()
    rooms.value = s.rooms
    service.value = s.service
    waitlist.value = s.waitlist
  }
  return { rooms, roomId, room, patchRoom, service, serviceOf, setService, groupOf, seatsOf, tables, waitlist, suggest, covers, counts, now, reset }
}
