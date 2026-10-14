/*
 * Fake but consistent data for a small online store: ~1 year of orders generated from a fixed
 * seed (the same on every load), so every number on the dashboard is computed from real rows
 * instead of being made up per chart.
 */

export type OrderStatus = 'paid' | 'shipped' | 'delivered' | 'refunded' | 'pending'
export type Channel = 'Online store' | 'Instagram' | 'Marketplace' | 'In person'

export interface Product { id: string; name: string; icon: string; price: number }
export interface Customer { id: string; name: string; email: string; country: string; since: string }
export interface OrderLine { product: string; qty: number; price: number }
export interface Order {
  id: string
  date: string // YYYY-MM-DD
  customer: string // customer id
  channel: Channel
  status: OrderStatus
  lines: OrderLine[]
  total: number
}

// Small deterministic PRNG (mulberry32).
function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = rng(20261014)
const pick = <T>(xs: readonly T[]) => xs[Math.floor(rand() * xs.length)]!
function weighted<T>(entries: [T, number][]) {
  const total = entries.reduce((n, [, w]) => n + w, 0)
  let r = rand() * total
  for (const [v, w] of entries) if ((r -= w) <= 0) return v
  return entries[0]![0]
}

export const products: Product[] = [
  { id: 'p1', name: 'Espresso beans 1kg', icon: 'coffee', price: 28 },
  { id: 'p2', name: 'Pour-over kettle', icon: 'kettle', price: 64 },
  { id: 'p3', name: 'Ceramic mug', icon: 'local_cafe', price: 16 },
  { id: 'p4', name: 'Hand grinder', icon: 'blender', price: 89 },
  { id: 'p5', name: 'Filter papers (100)', icon: 'filter_alt', price: 7 },
  { id: 'p6', name: 'Cold brew bottle', icon: 'water_bottle', price: 32 },
  { id: 'p7', name: 'Gift card', icon: 'redeem', price: 50 },
]
export const productById = Object.fromEntries(products.map((p) => [p.id, p]))

const first = ['Ana', 'Luis', 'Marta', 'Diego', 'Sofía', 'Pablo', 'Carla', 'Iván', 'Lucía', 'Tomás', 'Emma', 'Noah', 'Mia', 'Leo', 'Olivia', 'Hugo', 'Chloé', 'Yuki', 'Ines', 'Mateo']
const last = ['Torres', 'Gómez', 'Ruiz', 'Pérez', 'Lima', 'Ortiz', 'Vidal', 'Silva', 'Martin', 'Becker', 'Rossi', 'Dubois', 'Tanaka', 'Costa', 'Novak']
const countries: [string, number][] = [['Spain', 30], ['Mexico', 18], ['Argentina', 14], ['United States', 12], ['France', 8], ['Germany', 7], ['Portugal', 6], ['Japan', 5]]

const today = new Date()
// Local date (not toISOString, which is UTC and would shift days in the evening west of GMT).
export const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const daysAgo = (n: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() - n)
  return iso(d)
}

export const customers: Customer[] = Array.from({ length: 90 }, (_, i) => {
  const f = pick(first)
  const l = pick(last)
  return {
    id: `c${i + 1}`,
    name: `${f} ${l}`,
    email: `${f}.${l}${i}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') + '@mail.test',
    country: weighted(countries),
    since: daysAgo(30 + Math.floor(rand() * 700)),
  }
})
export const customerById = Object.fromEntries(customers.map((c) => [c.id, c]))

// Orders: more on weekends, a slow upward trend, and a bump in December.
export const orders: Order[] = []
let n = 1
for (let day = 364; day >= 0; day--) {
  const date = new Date(today)
  date.setDate(date.getDate() - day)
  const weekend = date.getDay() === 0 || date.getDay() === 6
  const december = date.getMonth() === 11
  const base = 3 + (364 - day) / 90 + (weekend ? 2 : 0) + (december ? 3 : 0)
  const count = Math.max(0, Math.round(base + (rand() - 0.5) * 4))
  for (let i = 0; i < count; i++) {
    const lines: OrderLine[] = []
    const items = 1 + Math.floor(rand() * 3)
    for (let k = 0; k < items; k++) {
      const p = weighted(products.map((x, idx) => [x, [9, 3, 7, 2, 6, 3, 2][idx]!] as [Product, number]))
      const existing = lines.find((x) => x.product === p.id)
      if (existing) existing.qty++
      else lines.push({ product: p.id, qty: 1, price: p.price })
    }
    const age = day
    const status: OrderStatus =
      rand() < 0.04 ? 'refunded' : age < 1 ? weighted([['pending', 3], ['paid', 2]]) : age < 4 ? weighted([['paid', 2], ['shipped', 3]]) : 'delivered'
    orders.push({
      id: `#${String(10000 + n++)}`,
      date: iso(date),
      customer: pick(customers).id,
      channel: weighted<Channel>([['Online store', 50], ['Instagram', 22], ['Marketplace', 18], ['In person', 10]]),
      status,
      lines,
      total: lines.reduce((s, x) => s + x.qty * x.price, 0),
    })
  }
}
orders.reverse() // newest first

export const money = (v: number, digits = 0) =>
  v.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: digits, minimumFractionDigits: digits })
export const compact = (v: number) => v.toLocaleString(undefined, { notation: 'compact', maximumFractionDigits: 1 })
