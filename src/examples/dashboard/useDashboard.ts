import { computed, ref } from 'vue'
import type { DateRange } from '@m3ui-vue/m3ui-vue'
import { customerById, daysAgo, iso, orders, productById, type Channel, type Order } from './data'

/*
 * Dashboard state: the current view and the date range, and every metric derived from the
 * orders in that range (plus the same-length period before it, for the trends).
 */

export type View = 'overview' | 'orders' | 'customers'
const view = ref<View>('overview')
const range = ref<DateRange>({ start: daysAgo(29), end: daysAgo(0) })

export const presets = [
  { id: '7', label: 'Last 7 days', days: 7 },
  { id: '30', label: 'Last 30 days', days: 30 },
  { id: '90', label: 'Last 90 days', days: 90 },
  { id: '365', label: 'Last 12 months', days: 365 },
]
function setPreset(days: number) {
  range.value = { start: daysAgo(days - 1), end: daysAgo(0) }
}

const DAY = 86_400_000
const toTime = (d: string) => new Date(`${d}T00:00:00`).getTime()

const bounds = computed(() => {
  const start = range.value.start ?? daysAgo(29)
  const end = range.value.end ?? start
  const length = Math.round((toTime(end) - toTime(start)) / DAY) + 1
  const prevEnd = iso(new Date(toTime(start) - DAY))
  const prevStart = iso(new Date(toTime(start) - length * DAY))
  return { start, end, length, prevStart, prevEnd }
})

const inRange = (o: Order, from: string, to: string) => o.date >= from && o.date <= to
const current = computed(() => orders.filter((o) => inRange(o, bounds.value.start, bounds.value.end)))
const previous = computed(() => orders.filter((o) => inRange(o, bounds.value.prevStart, bounds.value.prevEnd)))

function summarize(list: Order[]) {
  const valid = list.filter((o) => o.status !== 'refunded')
  const revenue = valid.reduce((s, o) => s + o.total, 0)
  return {
    revenue,
    orders: valid.length,
    average: valid.length ? revenue / valid.length : 0,
    customers: new Set(valid.map((o) => o.customer)).size,
    refunds: list.length - valid.length,
  }
}
const stats = computed(() => summarize(current.value))
const prevStats = computed(() => summarize(previous.value))
/** Percent change vs the previous period, rounded to one decimal. */
const trend = (now: number, before: number) => (before ? Math.round(((now - before) / before) * 1000) / 10 : 0)

/** Revenue (or order count) per day, or per week for long ranges; previous period aligned by index. */
function series(metric: 'revenue' | 'orders') {
  const { start, length } = bounds.value
  const bucket = length > 120 ? 7 : 1
  const buckets = Math.ceil(length / bucket)
  const value = (list: Order[]) => (metric === 'revenue' ? list.reduce((s, o) => s + o.total, 0) : list.length)
  const labels: string[] = []
  const now: number[] = []
  const before: number[] = []
  for (let i = 0; i < buckets; i++) {
    const from = iso(new Date(toTime(start) + i * bucket * DAY))
    const to = iso(new Date(toTime(start) + ((i + 1) * bucket - 1) * DAY))
    const pFrom = iso(new Date(toTime(from) - length * DAY))
    const pTo = iso(new Date(toTime(to) - length * DAY))
    labels.push(new Date(`${from}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }))
    now.push(value(current.value.filter((o) => o.status !== 'refunded' && inRange(o, from, to))))
    before.push(value(previous.value.filter((o) => o.status !== 'refunded' && inRange(o, pFrom, pTo))))
  }
  return { labels, now, before, bucket }
}

const byChannel = computed(() => {
  const totals = new Map<Channel, number>()
  for (const o of current.value) if (o.status !== 'refunded') totals.set(o.channel, (totals.get(o.channel) ?? 0) + o.total)
  return [...totals.entries()].sort((a, b) => b[1] - a[1])
})

const topProducts = computed(() => {
  const totals = new Map<string, { qty: number; revenue: number }>()
  for (const o of current.value) {
    if (o.status === 'refunded') continue
    for (const l of o.lines) {
      const t = totals.get(l.product) ?? { qty: 0, revenue: 0 }
      t.qty += l.qty
      t.revenue += l.qty * l.price
      totals.set(l.product, t)
    }
  }
  return [...totals.entries()].map(([id, t]) => ({ ...productById[id]!, ...t })).sort((a, b) => b.revenue - a.revenue)
})

const byCountry = computed(() => {
  const totals = new Map<string, number>()
  for (const o of current.value) if (o.status !== 'refunded') {
    const c = customerById[o.customer]!.country
    totals.set(c, (totals.get(c) ?? 0) + o.total)
  }
  return [...totals.entries()].sort((a, b) => b[1] - a[1])
})

/** Customers with their spend and orders in the selected range. */
const customerRows = computed(() => {
  const agg = new Map<string, { orders: number; spent: number; last: string }>()
  for (const o of current.value) {
    if (o.status === 'refunded') continue
    const a = agg.get(o.customer) ?? { orders: 0, spent: 0, last: o.date }
    a.orders++
    a.spent += o.total
    if (o.date > a.last) a.last = o.date
    agg.set(o.customer, a)
  }
  return [...agg.entries()].map(([id, a]) => ({ ...customerById[id]!, ...a })).sort((a, b) => b.spent - a.spent)
})

export function useDashboard() {
  return {
    view,
    range,
    bounds,
    current,
    stats,
    prevStats,
    trend,
    series,
    byChannel,
    topProducts,
    byCountry,
    customerRows,
    setPreset,
  }
}
