/*
 * Destinations, the things to do there, and the sample trips. Trip dates are relative to today,
 * so the upcoming trip always starts this week and shows up in the itinerary right away.
 */
import { scene, type SceneKind } from './art'

export interface Experience {
  id: string
  title: string
  icon: string
  /** Hours. */
  duration: number
  price: number
}

export interface Destination {
  id: string
  name: string
  country: string
  kind: SceneKind
  seed: number
  blurb: string
  rating: number
  reviews: number
  /** Typical high / low in °C during the best months. */
  high: number
  low: number
  bestMonths: string[]
  tags: string[]
  flightHours: number
  priceFrom: number
  airport: string
  experiences: Experience[]
}

type Seed = Omit<Destination, 'experiences' | 'seed'>

const activities: Record<SceneKind, Array<Omit<Experience, 'id' | 'price'> & { price: [number, number] }>> = {
  beach: [
    { title: 'Snorkeling trip', icon: 'scuba_diving', duration: 3, price: [45, 80] },
    { title: 'Sunset sail', icon: 'sailing', duration: 2, price: [60, 110] },
    { title: 'Surf lesson', icon: 'surfing', duration: 2, price: [35, 60] },
    { title: 'Seafood market tour', icon: 'set_meal', duration: 2, price: [30, 55] },
  ],
  island: [
    { title: 'Island hopping', icon: 'directions_boat', duration: 6, price: [80, 140] },
    { title: 'Reef dive', icon: 'scuba_diving', duration: 3, price: [70, 120] },
    { title: 'Spice farm visit', icon: 'eco', duration: 2, price: [25, 40] },
    { title: 'Beach yoga', icon: 'self_improvement', duration: 1, price: [15, 25] },
  ],
  mountain: [
    { title: 'Guided ridge hike', icon: 'hiking', duration: 5, price: [50, 90] },
    { title: 'Cable car to the summit', icon: 'cable', duration: 2, price: [30, 60] },
    { title: 'Hot springs', icon: 'hot_tub', duration: 2, price: [20, 45] },
    { title: 'Stargazing night', icon: 'nights_stay', duration: 2, price: [35, 55] },
  ],
  snow: [
    { title: 'Ski day pass', icon: 'downhill_skiing', duration: 6, price: [70, 130] },
    { title: 'Snowshoe walk', icon: 'snowshoeing', duration: 3, price: [40, 70] },
    { title: 'Northern lights tour', icon: 'auto_awesome', duration: 3, price: [80, 140] },
    { title: 'Sauna and ice plunge', icon: 'hot_tub', duration: 2, price: [25, 45] },
  ],
  lake: [
    { title: 'Kayak at sunrise', icon: 'kayaking', duration: 2, price: [35, 60] },
    { title: 'Lakeside cycling', icon: 'directions_bike', duration: 3, price: [25, 45] },
    { title: 'Boat cruise', icon: 'directions_boat', duration: 2, price: [30, 50] },
    { title: 'Picnic and swim', icon: 'pool', duration: 3, price: [15, 30] },
  ],
  forest: [
    { title: 'Canopy walk', icon: 'forest', duration: 2, price: [30, 55] },
    { title: 'Waterfall trail', icon: 'water', duration: 4, price: [25, 50] },
    { title: 'Birdwatching at dawn', icon: 'flutter_dash', duration: 2, price: [20, 40] },
    { title: 'Cooking with locals', icon: 'skillet', duration: 3, price: [45, 75] },
  ],
  desert: [
    { title: 'Dune safari', icon: 'landscape', duration: 4, price: [60, 100] },
    { title: 'Souk walking tour', icon: 'storefront', duration: 3, price: [20, 40] },
    { title: 'Camel ride at dusk', icon: 'pets', duration: 2, price: [40, 70] },
    { title: 'Desert camp dinner', icon: 'local_fire_department', duration: 3, price: [55, 90] },
  ],
  city: [
    { title: 'Old town walking tour', icon: 'tour', duration: 3, price: [20, 40] },
    { title: 'Food tasting tour', icon: 'restaurant', duration: 3, price: [55, 95] },
    { title: 'Museum pass', icon: 'museum', duration: 4, price: [25, 45] },
    { title: 'Rooftop dinner', icon: 'dinner_dining', duration: 2, price: [60, 120] },
  ],
}

const seeds: Seed[] = [
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', kind: 'city', blurb: 'Temples, quiet gardens and lantern-lit alleys, a short train ride from Osaka.', rating: 4.9, reviews: 12840, high: 23, low: 12, bestMonths: ['Mar', 'Apr', 'Oct', 'Nov'], tags: ['Culture', 'Food', 'Gardens'], flightHours: 13, priceFrom: 890, airport: 'KIX' },
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', kind: 'city', blurb: 'Hills, trams and tiled facades over the Tagus, with the coast half an hour away.', rating: 4.7, reviews: 9312, high: 26, low: 15, bestMonths: ['May', 'Jun', 'Sep'], tags: ['Food', 'Nightlife', 'Culture'], flightHours: 7, priceFrom: 420, airport: 'LIS' },
  { id: 'new-york', name: 'New York', country: 'United States', kind: 'city', blurb: 'Five boroughs of museums, parks, food and the skyline you already know.', rating: 4.6, reviews: 20110, high: 24, low: 14, bestMonths: ['May', 'Sep', 'Oct'], tags: ['Culture', 'Nightlife', 'Shopping'], flightHours: 8, priceFrom: 380, airport: 'JFK' },
  { id: 'tulum', name: 'Tulum', country: 'Mexico', kind: 'beach', blurb: 'White sand below Mayan ruins, cenotes inland and long, slow dinners.', rating: 4.6, reviews: 6420, high: 30, low: 22, bestMonths: ['Dec', 'Jan', 'Feb', 'Mar'], tags: ['Beaches', 'History', 'Food'], flightHours: 5, priceFrom: 510, airport: 'CUN' },
  { id: 'algarve', name: 'Algarve', country: 'Portugal', kind: 'beach', blurb: 'Golden cliffs, sea caves and fishing towns along the sunny south coast.', rating: 4.7, reviews: 5210, high: 28, low: 17, bestMonths: ['Jun', 'Jul', 'Sep'], tags: ['Beaches', 'Hiking', 'Food'], flightHours: 7, priceFrom: 450, airport: 'FAO' },
  { id: 'zanzibar', name: 'Zanzibar', country: 'Tanzania', kind: 'island', blurb: 'Spice farms, coral reefs and the winding streets of Stone Town.', rating: 4.5, reviews: 3180, high: 31, low: 23, bestMonths: ['Jun', 'Jul', 'Aug', 'Jan'], tags: ['Beaches', 'Diving', 'History'], flightHours: 14, priceFrom: 980, airport: 'ZNZ' },
  { id: 'maldives', name: 'Maldives', country: 'Maldives', kind: 'island', blurb: 'Tiny islands over a turquoise lagoon, with manta rays just offshore.', rating: 4.8, reviews: 7730, high: 31, low: 26, bestMonths: ['Jan', 'Feb', 'Mar', 'Apr'], tags: ['Beaches', 'Diving', 'Relaxing'], flightHours: 15, priceFrom: 1240, airport: 'MLE' },
  { id: 'patagonia', name: 'Patagonia', country: 'Argentina', kind: 'mountain', blurb: 'Granite towers, glaciers and wind-swept trails at the end of the world.', rating: 4.9, reviews: 4120, high: 17, low: 6, bestMonths: ['Nov', 'Dec', 'Jan', 'Feb'], tags: ['Hiking', 'Nature', 'Adventure'], flightHours: 12, priceFrom: 960, airport: 'FTE' },
  { id: 'dolomites', name: 'Dolomites', country: 'Italy', kind: 'mountain', blurb: 'Jagged pink peaks, alpine huts and some of the best via ferratas anywhere.', rating: 4.8, reviews: 5860, high: 22, low: 9, bestMonths: ['Jun', 'Jul', 'Aug', 'Sep'], tags: ['Hiking', 'Food', 'Nature'], flightHours: 9, priceFrom: 610, airport: 'VCE' },
  { id: 'banff', name: 'Banff', country: 'Canada', kind: 'lake', blurb: 'Glacier-blue lakes under the Rockies, with elk wandering through town.', rating: 4.8, reviews: 8350, high: 22, low: 7, bestMonths: ['Jun', 'Jul', 'Aug', 'Sep'], tags: ['Nature', 'Hiking', 'Wildlife'], flightHours: 6, priceFrom: 540, airport: 'YYC' },
  { id: 'bled', name: 'Lake Bled', country: 'Slovenia', kind: 'lake', blurb: 'A church on an island in an emerald lake, under a cliff-top castle.', rating: 4.7, reviews: 3940, high: 24, low: 11, bestMonths: ['May', 'Jun', 'Sep'], tags: ['Nature', 'Relaxing', 'Culture'], flightHours: 9, priceFrom: 520, airport: 'LJU' },
  { id: 'reykjavik', name: 'Reykjavík', country: 'Iceland', kind: 'snow', blurb: 'Geothermal pools, black-sand beaches and the northern lights in winter.', rating: 4.7, reviews: 6720, high: 3, low: -3, bestMonths: ['Dec', 'Jan', 'Feb', 'Mar'], tags: ['Nature', 'Adventure', 'Northern lights'], flightHours: 6, priceFrom: 480, airport: 'KEF' },
  { id: 'hokkaido', name: 'Hokkaido', country: 'Japan', kind: 'snow', blurb: 'Powder snow, steaming onsen and the best seafood in Japan.', rating: 4.8, reviews: 4410, high: 0, low: -7, bestMonths: ['Jan', 'Feb'], tags: ['Skiing', 'Food', 'Hot springs'], flightHours: 14, priceFrom: 940, airport: 'CTS' },
  { id: 'costa-rica', name: 'Monteverde', country: 'Costa Rica', kind: 'forest', blurb: 'Cloud forest bridges, hummingbirds and coffee farms on misty hills.', rating: 4.7, reviews: 3560, high: 24, low: 15, bestMonths: ['Dec', 'Jan', 'Feb', 'Mar'], tags: ['Nature', 'Wildlife', 'Adventure'], flightHours: 6, priceFrom: 560, airport: 'SJO' },
  { id: 'black-forest', name: 'Black Forest', country: 'Germany', kind: 'forest', blurb: 'Fir-covered hills, cuckoo-clock villages and long woodland trails.', rating: 4.6, reviews: 2870, high: 23, low: 11, bestMonths: ['May', 'Jun', 'Sep', 'Oct'], tags: ['Hiking', 'Food', 'Relaxing'], flightHours: 8, priceFrom: 470, airport: 'FRA' },
  { id: 'marrakech', name: 'Marrakech', country: 'Morocco', kind: 'desert', blurb: 'Busy souks and riad courtyards, with the Sahara a day’s drive away.', rating: 4.6, reviews: 7980, high: 28, low: 14, bestMonths: ['Mar', 'Apr', 'Oct', 'Nov'], tags: ['Culture', 'Food', 'Shopping'], flightHours: 7, priceFrom: 430, airport: 'RAK' },
  { id: 'wadi-rum', name: 'Wadi Rum', country: 'Jordan', kind: 'desert', blurb: 'Red sand valleys and sandstone arches under the clearest night skies.', rating: 4.8, reviews: 2650, high: 27, low: 11, bestMonths: ['Mar', 'Apr', 'Oct', 'Nov'], tags: ['Adventure', 'Nature', 'Stargazing'], flightHours: 10, priceFrom: 690, airport: 'AQJ' },
]

export const destinations: Destination[] = seeds.map((d, i) => ({
  ...d,
  seed: i * 31 + 7,
  experiences: activities[d.kind].map((a, j) => ({
    id: `${d.id}-${j}`,
    title: a.title,
    icon: a.icon,
    duration: a.duration,
    price: Math.round(a.price[0] + ((i * 7 + j * 13) % 10) / 10 * (a.price[1] - a.price[0])),
  })),
}))

export const destination = (id: string) => destinations.find((d) => d.id === id)!

/** The destination's main picture, or one of its gallery views. */
export const photo = (d: Destination, view = 0, w = 800, h = 900) => scene(d.kind, d.seed + view * 101, w, h)

export const featured = ['patagonia', 'kyoto', 'maldives', 'reykjavik', 'marrakech'].map(destination)

export const collections: { title: string; subtitle: string; kinds: SceneKind[] }[] = [
  { title: 'Beaches and islands', subtitle: 'Warm water, soft sand', kinds: ['beach', 'island'] },
  { title: 'Mountains and lakes', subtitle: 'Trails with a view', kinds: ['mountain', 'lake', 'forest'] },
  { title: 'Cities', subtitle: 'Food, art and late nights', kinds: ['city', 'desert'] },
  { title: 'Snow', subtitle: 'Powder, onsen and auroras', kinds: ['snow'] },
]

// ── Trips ──────────────────────────────────────────────────────────────────────────────────────

export interface Activity {
  id: string
  title: string
  icon: string
  /** Local date-time, 'YYYY-MM-DDTHH:mm'. */
  start: string
  end: string
}

export interface Trip {
  id: string
  destinationId: string
  /** 'YYYY-MM-DD'. */
  start: string
  end: string
  travelers: number
  interests: string[]
  activities: Activity[]
  flight: { number: string; seat: string; gate: string; boards: string; reference: string; checkedIn: boolean }
}

const pad = (n: number) => String(n).padStart(2, '0')
export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00`)
  d.setDate(d.getDate() + days)
  return isoDate(d)
}
export const daysBetween = (a: string, b: string) => Math.round((new Date(`${b}T00:00`).getTime() - new Date(`${a}T00:00`).getTime()) / 86400000)

const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
let refSeed = 11
export function bookingReference() {
  let s = ''
  for (let i = 0; i < 6; i++) s += letters[(refSeed = (refSeed * 1103515245 + 12345) % 2147483648) % letters.length]
  return s
}

/** Two activities a day (morning and afternoon), preferring the ones that match the interests. */
export function planActivities(d: Destination, start: string, end: string): Activity[] {
  const days = daysBetween(start, end) + 1
  const list: Activity[] = []
  for (let day = 0; day < days; day++) {
    const date = addDays(start, day)
    const slots: [number, Experience][] = [
      [9, d.experiences[(day * 2) % d.experiences.length]!],
      [15, d.experiences[(day * 2 + 1) % d.experiences.length]!],
    ]
    // Arrival and departure days are lighter: no morning plans on the first one.
    for (const [hour, e] of day === 0 ? slots.slice(1) : slots) {
      const endHour = Math.min(hour + e.duration, 21)
      list.push({ id: `${date}-${hour}-${e.id}`, title: e.title, icon: e.icon, start: `${date}T${pad(hour)}:00`, end: `${date}T${pad(endHour)}:00` })
    }
  }
  return list
}

export function makeTrip(destinationId: string, start: string, end: string, travelers: number, interests: string[]): Trip {
  const d = destination(destinationId)
  return {
    id: `${destinationId}-${start}`,
    destinationId,
    start,
    end,
    travelers,
    interests,
    activities: planActivities(d, start, end),
    flight: {
      number: `DW ${100 + ((d.seed * 37) % 800)}`,
      seat: `${10 + (d.seed % 20)}${'ACDF'[d.seed % 4]}`,
      gate: `${'ABC'[d.seed % 3]}${(d.seed % 30) + 1}`,
      boards: '07:40',
      reference: bookingReference(),
      checkedIn: false,
    },
  }
}

export function sampleTrips(): Trip[] {
  const today = isoDate(new Date())
  return [
    makeTrip('lisbon', addDays(today, 1), addDays(today, 4), 2, ['Food', 'Culture']),
    makeTrip('banff', addDays(today, 38), addDays(today, 44), 3, ['Hiking', 'Nature']),
    { ...makeTrip('kyoto', addDays(today, -120), addDays(today, -112), 2, ['Culture', 'Gardens']), flight: { number: 'DW 318', seat: '22A', gate: 'C4', boards: '10:15', reference: 'KQ7M2X', checkedIn: true } },
    { ...makeTrip('algarve', addDays(today, -260), addDays(today, -254), 4, ['Beaches']), flight: { number: 'DW 205', seat: '9C', gate: 'A12', boards: '06:55', reference: 'P3RT8N', checkedIn: true } },
  ]
}
