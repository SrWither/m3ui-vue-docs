/*
 * Shared state at module level: where you are (with a back stack), saved destinations, trips and
 * the story viewer. Everything lives in memory except whether you've seen the welcome tour.
 */
import { computed, ref } from 'vue'
import { useToast } from '@m3ui-vue/m3ui-vue'
import { destination, makeTrip, sampleTrips, type Activity, type Trip } from './data'

export type Screen =
  | { name: 'explore' }
  | { name: 'saved' }
  | { name: 'trips' }
  | { name: 'destination'; id: string }
  | { name: 'trip'; id: string }
  | { name: 'plan'; destinationId?: string }

const toast = useToast()

// ── Navigation ────────────────────────────────────────────────────────────────────────────────

const history = ref<Screen[]>([{ name: 'explore' }])
const screen = computed(() => history.value[history.value.length - 1]!)
const tabs = ['explore', 'saved', 'trips'] as const
export type Tab = (typeof tabs)[number]

// Each screen remembers how far down you were, so going back lands where you left it. The shell
// applies `pendingScroll` once the next screen is in the DOM.
const scrolls: number[] = []
const pendingScroll = ref(0)
const scrollTop = () => document.querySelector('[data-travel-scroll]')?.scrollTop ?? 0

function go(s: Screen) {
  // A tab starts a fresh stack; anything else is pushed on top of the current one.
  if ((tabs as readonly string[]).includes(s.name)) {
    history.value = [s]
    scrolls.length = 0
  } else {
    scrolls[history.value.length - 1] = scrollTop()
    history.value = [...history.value, s]
  }
  pendingScroll.value = 0
}
const canBack = computed(() => history.value.length > 1)
function back() {
  if (!canBack.value) return
  history.value = history.value.slice(0, -1)
  pendingScroll.value = scrolls[history.value.length - 1] ?? 0
}

/** The tab the current screen belongs to. */
const tab = computed<Tab>(() => {
  for (let i = history.value.length - 1; i >= 0; i--) {
    const name = history.value[i]!.name
    if ((tabs as readonly string[]).includes(name)) return name as Tab
  }
  return 'explore'
})

// ── Saved ─────────────────────────────────────────────────────────────────────────────────────

const saved = ref<string[]>(['dolomites', 'maldives', 'marrakech'])
const isSaved = (id: string) => saved.value.includes(id)
function toggleSaved(id: string) {
  if (isSaved(id)) {
    saved.value = saved.value.filter((s) => s !== id)
    toast.info(`Removed ${destination(id).name} from Saved`, { icon: 'favorite_border', action: { label: 'Undo', onClick: () => toggleSaved(id) } })
  } else {
    saved.value = [id, ...saved.value]
    toast.info(`Saved ${destination(id).name}`, { icon: 'favorite' })
  }
}

// ── Trips ─────────────────────────────────────────────────────────────────────────────────────

const trips = ref<Trip[]>(sampleTrips())
const trip = (id: string) => trips.value.find((t) => t.id === id)

function createTrip(destinationId: string, start: string, end: string, travelers: number, interests: string[]) {
  const t = makeTrip(destinationId, start, end, travelers, interests)
  trips.value = [t, ...trips.value.filter((x) => x.id !== t.id)]
  toast.success(`Trip to ${destination(destinationId).name} created`)
  return t
}

function updateTrip(id: string, patch: Partial<Trip>) {
  trips.value = trips.value.map((t) => (t.id === id ? { ...t, ...patch } : t))
}

function addActivity(tripId: string, a: Activity) {
  const t = trip(tripId)
  if (t) updateTrip(tripId, { activities: [...t.activities, a] })
}

function removeActivity(tripId: string, activityId: string) {
  const t = trip(tripId)
  if (!t) return
  const removed = t.activities.find((a) => a.id === activityId)
  updateTrip(tripId, { activities: t.activities.filter((a) => a.id !== activityId) })
  if (removed) toast.info(`Removed “${removed.title}”`, { icon: 'event_busy', action: { label: 'Undo', onClick: () => addActivity(tripId, removed) } })
}

function deleteTrip(id: string) {
  const t = trip(id)
  if (!t) return
  trips.value = trips.value.filter((x) => x.id !== id)
  back()
  toast.info(`Trip to ${destination(t.destinationId).name} deleted`, { icon: 'delete', action: { label: 'Undo', onClick: () => (trips.value = [t, ...trips.value]) } })
}

// ── Stories ───────────────────────────────────────────────────────────────────────────────────

const stories = ref<{ open: boolean; index: number }>({ open: false, index: 0 })
const openStories = (index = 0) => (stories.value = { open: true, index })

// ── Welcome tour ──────────────────────────────────────────────────────────────────────────────

const TOUR_KEY = 'driftway-tour-seen'
const tourOpen = ref(false)
function maybeStartTour() {
  let seen = false
  try { seen = localStorage.getItem(TOUR_KEY) === '1' } catch { /* storage blocked */ }
  if (!seen) tourOpen.value = true
}
function tourDone() {
  tourOpen.value = false
  try { localStorage.setItem(TOUR_KEY, '1') } catch { /* storage blocked */ }
}

export function useTravel() {
  return {
    screen, go, back, canBack, tab, pendingScroll,
    saved, isSaved, toggleSaved,
    trips, trip, createTrip, updateTrip, addActivity, removeActivity, deleteTrip,
    stories, openStories,
    tourOpen, maybeStartTour, tourDone,
  }
}
