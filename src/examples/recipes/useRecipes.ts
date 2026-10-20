/*
 * Shared state: which page is open (with a back stack), saved recipes, servings, the grocery
 * list and the cooking timers. Saved recipes and groceries persist in localStorage.
 */
import { computed, reactive, ref, watch } from 'vue'
import { useToast } from '@m3ui-vue/m3ui-vue'
import { byId, formatQty, type Aisle, type Recipe } from './data'

export type Screen = { name: 'today' } | { name: 'saved' } | { name: 'groceries' } | { name: 'recipe'; id: string }

const stack = ref<Screen[]>([{ name: 'today' }])
const screen = computed(() => stack.value[stack.value.length - 1]!)

function go(s: Screen) {
  // Tabs reset the stack; a recipe goes on top of whatever is open.
  if (s.name === 'recipe') stack.value = [...stack.value, s]
  else stack.value = [s]
}
function back() {
  if (stack.value.length > 1) stack.value = stack.value.slice(0, -1)
}
const tab = computed(() => stack.value[0]!.name)

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* private mode: keep it in memory */
  }
}

// ── Saved ──────────────────────────────────────────────────────────────────────────────────
const saved = ref<string[]>(read('simmer-saved', ['lemon-pasta', 'miso-ramen', 'plum-galette']))
watch(saved, (v) => write('simmer-saved', v), { deep: true })
const isSaved = (id: string) => saved.value.includes(id)
function toggleSaved(id: string, value = !isSaved(id)) {
  saved.value = value ? [id, ...saved.value.filter((s) => s !== id)] : saved.value.filter((s) => s !== id)
}

// ── Servings ───────────────────────────────────────────────────────────────────────────────
const servings = reactive<Record<string, number>>({})
const servingsOf = (r: Recipe) => servings[r.id] ?? r.servings
const factorOf = (r: Recipe) => servingsOf(r) / r.servings

// ── Groceries ──────────────────────────────────────────────────────────────────────────────
export interface Grocery {
  key: string
  name: string
  unit?: string
  qty?: number
  aisle: Aisle
  /** Seeds of the recipes it's for, to paint the little dots next to it. */
  from: string[]
  done: boolean
}
const groceries = ref<Grocery[]>(read('simmer-groceries', []))
watch(groceries, (v) => write('simmer-groceries', v), { deep: true })

const toast = useToast()

function addToGroceries(r: Recipe) {
  const f = factorOf(r)
  let added = 0
  for (const ing of r.ingredients) {
    const key = `${ing.name}|${ing.unit ?? ''}`
    const existing = groceries.value.find((g) => g.key === key)
    const qty = ing.qty != null ? ing.qty * f : undefined
    if (existing) {
      if (qty != null) existing.qty = (existing.qty ?? 0) + qty
      if (!existing.from.includes(r.id)) existing.from.push(r.id)
      existing.done = false
    } else {
      groceries.value.push({ key, name: ing.name, unit: ing.unit, qty, aisle: ing.aisle, from: [r.id], done: false })
      added++
    }
  }
  toast.show(added ? `${added} ingredients added to your list` : 'Your list already had everything, quantities updated', 'success', {
    action: { label: 'View', onClick: () => go({ name: 'groceries' }) },
  })
}
const groceryLabel = (g: Grocery) => [formatQty(g.qty, 1), g.unit].filter(Boolean).join(' ')
const openGroceries = computed(() => groceries.value.filter((g) => !g.done).length)

// ── Cooking ────────────────────────────────────────────────────────────────────────────────
const cooking = ref<string | null>(null)
const cookStep = ref(0)
function startCooking(id: string) {
  if (cooking.value !== id) cookStep.value = 0
  cooking.value = id
}

export interface Timer {
  recipe: string
  step: number
  total: number
  /** Seconds left, as of `since` when running. */
  left: number
  since: number | null
}
const timers = ref<Timer[]>([])
const now = ref(Date.now())
let ticker: ReturnType<typeof setInterval> | undefined

const timerFor = (recipe: string, step: number) => timers.value.find((t) => t.recipe === recipe && t.step === step)
const remaining = (t: Timer) => Math.max(0, t.since == null ? t.left : t.left - (now.value - t.since) / 1000)

function tick() {
  now.value = Date.now()
  for (const t of timers.value) {
    if (t.since != null && remaining(t) <= 0) {
      t.left = 0
      t.since = null
      const r = byId(t.recipe)
      navigator.vibrate?.([200, 100, 200])
      toast.show(`Timer done: ${r?.title}, step ${t.step + 1}`, 'info', { icon: 'alarm', duration: 8000 })
    }
  }
  if (!timers.value.some((t) => t.since != null)) {
    clearInterval(ticker)
    ticker = undefined
  }
}
function toggleTimer(recipe: string, step: number, minutes: number) {
  let t = timerFor(recipe, step)
  if (!t) {
    t = { recipe, step, total: minutes * 60, left: minutes * 60, since: null }
    timers.value.push(t)
    t = timers.value[timers.value.length - 1]!
  }
  if (t.since != null) {
    t.left = remaining(t)
    t.since = null
  } else {
    if (t.left <= 0) t.left = t.total
    t.since = Date.now()
    ticker ??= setInterval(tick, 250)
  }
  now.value = Date.now()
}
function resetTimer(recipe: string, step: number) {
  timers.value = timers.value.filter((t) => !(t.recipe === recipe && t.step === step))
}
const runningTimers = computed(() => timers.value.filter((t) => t.since != null))

export function useRecipes() {
  return {
    screen, tab, go, back, canBack: computed(() => stack.value.length > 1),
    saved, isSaved, toggleSaved,
    servings, servingsOf, factorOf,
    groceries, addToGroceries, groceryLabel, openGroceries,
    cooking, cookStep, startCooking,
    timers, timerFor, remaining, toggleTimer, resetTimer, runningTimers,
  }
}
