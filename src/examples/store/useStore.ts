import { computed, ref } from 'vue'
import { art, type Kind } from './art'

/*
 * Store state, module-level: the catalog, the filters, the cart and which screen is showing.
 * No backend: the checkout "places" the order locally.
 */

export interface Variant { name: string; hex: string }
export interface Review { name: string; rating: number; text: string; date: string }
export interface Product {
  id: string
  name: string
  kind: Kind
  category: 'Kitchen' | 'Living' | 'Office' | 'Accessories'
  price: number
  /** Before a discount, shown struck through. */
  was?: number
  rating: number
  reviews: Review[]
  colors: Variant[]
  sizes?: string[]
  backdrop: string
  description: string
  stock: number
  isNew?: boolean
}

const reviewPool: Omit<Review, 'rating'>[] = [
  { name: 'Ana T.', text: 'Even nicer in person. Arrived well packed.', date: '2 weeks ago' },
  { name: 'Luis G.', text: 'Good quality for the price, would buy again.', date: '1 month ago' },
  { name: 'Marta R.', text: 'The color is exactly like the picture.', date: '3 weeks ago' },
  { name: 'Diego P.', text: 'Took a few days longer to arrive, but worth it.', date: '2 months ago' },
]
const reviews = (ratings: number[]) => ratings.map((rating, i) => ({ ...reviewPool[i % reviewPool.length]!, rating }))

export const products: Product[] = [
  { id: 'mug', name: 'Stoneware mug', kind: 'mug', category: 'Kitchen', price: 18, rating: 4.7, reviews: reviews([5, 5, 4]), backdrop: '#f3e7dc', stock: 24, sizes: ['250 ml', '350 ml'],
    colors: [{ name: 'Clay', hex: '#c8794f' }, { name: 'Sage', hex: '#8fa98c' }, { name: 'Ink', hex: '#3b4a6b' }],
    description: 'Hand-glazed stoneware that keeps coffee warm a little longer. Dishwasher and microwave safe.' },
  { id: 'plant', name: 'Terracotta planter', kind: 'plant', category: 'Living', price: 32, was: 40, rating: 4.5, reviews: reviews([5, 4, 4, 5]), backdrop: '#e6efe2', stock: 9, sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Terracotta', hex: '#c66b3d' }, { name: 'Chalk', hex: '#e8e2d6' }, { name: 'Charcoal', hex: '#4a4a4a' }],
    description: 'Unglazed terracotta with a drainage hole and saucer. Plant not included (but it looks great with one).' },
  { id: 'lamp', name: 'Arc desk lamp', kind: 'lamp', category: 'Office', price: 89, rating: 4.8, reviews: reviews([5, 5, 5, 4]), backdrop: '#ece8f6', stock: 6, isNew: true,
    colors: [{ name: 'Butter', hex: '#e8c35a' }, { name: 'Mint', hex: '#7fc6a4' }, { name: 'Graphite', hex: '#53565c' }],
    description: 'Warm dimmable light with a weighted base. The shade tilts so the light lands where you need it.' },
  { id: 'candle', name: 'Soy candle', kind: 'candle', category: 'Living', price: 24, rating: 4.6, reviews: reviews([5, 4, 5]), backdrop: '#f6ece6', stock: 40, sizes: ['Small', 'Large'],
    colors: [{ name: 'Rose', hex: '#d9a0a0' }, { name: 'Linen', hex: '#e9dcc4' }, { name: 'Moss', hex: '#7d8f62' }],
    description: 'Hand-poured soy wax with a cotton wick and about 40 hours of burn time. Notes of fig and cedar.' },
  { id: 'notebook', name: 'Linen notebook', kind: 'notebook', category: 'Office', price: 14, rating: 4.4, reviews: reviews([4, 5, 4]), backdrop: '#e4ecf4', stock: 0,
    colors: [{ name: 'Navy', hex: '#2f4a7a' }, { name: 'Ochre', hex: '#c99a3c' }, { name: 'Berry', hex: '#8c3b5a' }],
    description: 'A5, 160 dotted pages of 100 gsm paper that takes fountain pens without bleeding through.' },
  { id: 'speaker', name: 'Pocket speaker', kind: 'speaker', category: 'Living', price: 59, was: 79, rating: 4.3, reviews: reviews([4, 4, 5, 4]), backdrop: '#e9eef0', stock: 12,
    colors: [{ name: 'Fog', hex: '#a8b4bc' }, { name: 'Coral', hex: '#e07a62' }, { name: 'Night', hex: '#30343a' }],
    description: 'Room-filling sound for its size, 12 hours of battery and a splash-proof fabric cover.' },
  { id: 'tote', name: 'Canvas tote', kind: 'tote', category: 'Accessories', price: 22, rating: 4.9, reviews: reviews([5, 5, 5]), backdrop: '#f1efe4', stock: 30, isNew: true,
    colors: [{ name: 'Natural', hex: '#d8c9a8' }, { name: 'Olive', hex: '#6f7449' }, { name: 'Black', hex: '#2b2b2b' }],
    description: 'Heavy organic cotton canvas with an inside pocket. Holds a laptop, groceries or both.' },
  { id: 'mug-set', name: 'Espresso cups (set of 2)', kind: 'mug', category: 'Kitchen', price: 26, rating: 4.6, reviews: reviews([5, 4]), backdrop: '#efe6f0', stock: 15,
    colors: [{ name: 'Lilac', hex: '#a08cc0' }, { name: 'Cream', hex: '#efe3cf' }],
    description: 'Small, thick-walled cups for a proper espresso. Comes as a pair in a gift box.' },
]
export const productById = (id: string) => products.find((p) => p.id === id)!
export const picture = (p: Product, color = 0, view = 0) => art(p.kind, p.colors[color]!.hex, p.backdrop, view)
export const money = (v: number) => v.toLocaleString(undefined, { style: 'currency', currency: 'USD' })

// Screens: the shop, a product, the checkout.
export type Screen = { name: 'shop' } | { name: 'product'; id: string } | { name: 'checkout' }
const screen = ref<Screen>({ name: 'shop' })
function go(next: Screen) {
  screen.value = next
  window.scrollTo({ top: 0 })
}

// Filters
export const categories = ['Kitchen', 'Living', 'Office', 'Accessories'] as const
const filters = ref({
  query: '',
  categories: [] as string[],
  price: [0, 100] as [number, number],
  minRating: 0,
  inStock: false,
  sort: 'featured' as 'featured' | 'price-asc' | 'price-desc' | 'rating',
})
const activeFilters = computed(() => {
  const f = filters.value
  return f.categories.length + (f.price[0] > 0 || f.price[1] < 100 ? 1 : 0) + (f.minRating ? 1 : 0) + (f.inStock ? 1 : 0)
})
function resetFilters() {
  filters.value = { ...filters.value, categories: [], price: [0, 100], minRating: 0, inStock: false }
}
const visible = computed(() => {
  const f = filters.value
  const q = f.query.trim().toLowerCase()
  const list = products.filter(
    (p) =>
      (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) &&
      (!f.categories.length || f.categories.includes(p.category)) &&
      p.price >= f.price[0] &&
      p.price <= f.price[1] &&
      p.rating >= f.minRating &&
      (!f.inStock || p.stock > 0),
  )
  if (f.sort === 'price-asc') list.sort((a, b) => a.price - b.price)
  if (f.sort === 'price-desc') list.sort((a, b) => b.price - a.price)
  if (f.sort === 'rating') list.sort((a, b) => b.rating - a.rating)
  return list
})

// Cart
export interface CartLine { key: string; id: string; color: number; size?: string; qty: number }
const cart = ref<CartLine[]>([])
const cartOpen = ref(false)
const coupon = ref<string | null>(null)
const COUPONS: Record<string, number> = { M3UI: 0.1, WELCOME: 0.15 }

function addToCart(id: string, color: number, size: string | undefined, qty: number) {
  const key = `${id}-${color}-${size ?? ''}`
  const line = cart.value.find((l) => l.key === key)
  if (line) line.qty += qty
  else cart.value.push({ key, id, color, size, qty })
}
function setQty(key: string, qty: number) {
  if (qty <= 0) cart.value = cart.value.filter((l) => l.key !== key)
  else {
    const line = cart.value.find((l) => l.key === key)
    if (line) line.qty = qty
  }
}
function applyCoupon(code: string) {
  const c = code.trim().toUpperCase()
  if (!(c in COUPONS)) return false
  coupon.value = c
  return true
}

export const shippingOptions = [
  { value: 'standard', label: 'Standard · 3–5 days', price: 6 },
  { value: 'express', label: 'Express · next day', price: 14 },
  { value: 'pickup', label: 'Pick up in store · free', price: 0 },
]
const shipping = ref('standard')

const count = computed(() => cart.value.reduce((n, l) => n + l.qty, 0))
const subtotal = computed(() => cart.value.reduce((s, l) => s + l.qty * productById(l.id).price, 0))
const discount = computed(() => (coupon.value ? subtotal.value * COUPONS[coupon.value]! : 0))
/** Standard shipping is free over $50 (after the discount). */
const shippingCost = computed(() => {
  const option = shippingOptions.find((o) => o.value === shipping.value)!
  return option.value === 'standard' && subtotal.value - discount.value >= 50 ? 0 : option.price
})
const total = computed(() => subtotal.value - discount.value + shippingCost.value)

function clearCart() {
  cart.value = []
  coupon.value = null
}

export function useStore() {
  return {
    screen, go,
    filters, activeFilters, resetFilters, visible,
    cart, cartOpen, coupon, addToCart, setQty, applyCoupon, clearCart,
    shipping, count, subtotal, discount, shippingCost, total,
  }
}
