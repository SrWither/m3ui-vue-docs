/*
 * People and an endless supply of posts. Posts are generated from a seed (text from templates,
 * sometimes photos or a poll), so scrolling always finds more and the same seed always gives
 * the same post.
 */
import { banner, photo, rng, type Photo, type PhotoKind } from './art'

export interface Person {
  handle: string
  name: string
  bio: string
  location: string
  followers: number
  following: number
  verified?: boolean
  banner: string
  /** What they post about. */
  topics: Topic[]
}

export interface PollOption {
  label: string
  votes: number
}

export interface Post {
  id: string
  author: string
  text: string
  date: number
  photos: Photo[]
  poll?: { options: PollOption[]; ends: number }
  /** The post this one answers. */
  replyTo?: string
  likes: number
  reposts: number
  replies: number
  views: number
}

type Topic = 'photo' | 'food' | 'code' | 'travel' | 'music' | 'outdoors' | 'life'

export const me: Person = {
  handle: 'alex',
  name: 'Alex Rivera',
  bio: 'Building things with Vue and Material 3. Weekend climber, weekday coffee person ☕',
  location: 'Madrid',
  followers: 812,
  following: 304,
  banner: banner(1),
  topics: ['code'],
}

export const people: Person[] = [
  me,
  { handle: 'mayachen', name: 'Maya Chen', bio: 'Product @ Northwind. Shipping offline mode, one sprint at a time.', location: 'Berlin', followers: 4210, following: 512, verified: true, banner: banner(2), topics: ['code', 'life'] },
  { handle: 'luciafdz', name: 'Lucía Fernández', bio: 'Photographer. Chasing light in Lisbon, Porto and everywhere in between 📷', location: 'Lisbon', followers: 18_400, following: 290, verified: true, banner: banner(3), topics: ['photo', 'travel'] },
  { handle: 'samokafor', name: 'Sam Okafor', bio: 'Climbing, trail running, too many carabiners.', location: 'Bristol', followers: 2130, following: 640, banner: banner(4), topics: ['outdoors', 'life'] },
  { handle: 'theo', name: 'Theo Laurent', bio: 'Illustrator & designer. Soft colors, round shapes.', location: 'Lyon', followers: 9870, following: 410, verified: true, banner: banner(5), topics: ['photo', 'life'] },
  { handle: 'nomnom', name: 'Priya Eats', bio: 'Recipes that take less time than deciding what to order.', location: 'London', followers: 52_300, following: 120, verified: true, banner: banner(6), topics: ['food'] },
  { handle: 'jweber', name: 'Jonas Weber', bio: 'Backend things. Opinions on databases available on request.', location: 'Hamburg', followers: 1540, following: 380, banner: banner(7), topics: ['code'] },
  { handle: 'papermoons', name: 'Paper Moons', bio: 'Lo-fi beats for rainy windows. New album “Rain on Tin” out now on Tempo.', location: 'Somewhere rainy', followers: 88_100, following: 42, verified: true, banner: banner(8), topics: ['music'] },
  { handle: 'wanderkit', name: 'Kit Moreno', bio: 'Slow travel, trains over planes 🚆', location: 'On a train', followers: 7300, following: 860, banner: banner(9), topics: ['travel', 'outdoors'] },
  { handle: 'm3ui', name: 'm3ui-vue', bio: 'Material 3 components for Vue. Docs and examples at m3ui.dev', location: 'm3ui.dev', followers: 3120, following: 12, verified: true, banner: banner(10), topics: ['code'] },
]
export const person = (handle: string) => people.find((p) => p.handle === handle)!

const templates: Record<Topic, string[]> = {
  photo: [
    'Golden hour never misses. #photography #goldenhour',
    'Went out for bread, came back with 200 photos. Classic. #photography',
    'Some light from this week ✨ #photography',
    'Film or digital? I keep going back and forth. These are digital, pretending to be film.',
  ],
  food: [
    'Ten-minute lunch bowl: rice, whatever’s in the fridge, a fried egg on top. Never fails. #recipes',
    'Unpopular opinion: breakfast for dinner is the best dinner. #food',
    'Made focaccia for the first time and I’m never buying bread again 🍞 #baking',
    'Sunday brunch spread. Who’s coming over? #food',
  ],
  code: [
    'Spent the morning deleting code. Best kind of morning. #webdev',
    'TIL a CSS transition declared once keeps applying to every later change of that property. Learned it the hard way. #css',
    'Hot take: most “performance problems” are a list that renders 10,000 rows. Virtualize it and go home. #webdev',
    'Shipped offline mode today 🎉 Requests queue up while you’re offline and replay in order when you’re back. #vue',
    'Springs > easing curves. Once you animate with real physics you can’t go back. #animation #material3',
    'New m3ui-vue examples are up: a music app whose songs are generated live, a mail client and a code host. All built with the library. #vue #material3',
  ],
  travel: [
    'Night train, window seat, nowhere to be until tomorrow. Perfect. #slowtravel',
    'The best part of a trip is always the part you didn’t plan. #travel',
    'Packing light is a lie I tell myself every single time. #travel',
    'Morning ferry across the river. Coffee in one hand, camera in the other. #travel',
  ],
  music: [
    'New single “Window Seat” out now. Made it on a rainy Tuesday, best listened to on one too. #lofi',
    'Thank you for 10 million plays on “Kettle On” 🫖 #lofi',
    'Working on something slower. Fewer drums, more rain. #lofi',
  ],
  outdoors: [
    'Sent my project today after 14 attempts. Fingers are destroyed, heart is full. #climbing',
    'Trail run at sunrise, nobody else around. #trailrunning',
    'Rain all week, so it’s gym climbing again. The new overhang routes are brutal. #climbing',
    'Camping trip report: three bears (cardboard ones at the visitor center), zero regrets. #outdoors',
  ],
  life: [
    'Coffee number three. Not a cry for help, just a fact. ☕',
    'Reminder to drink water and close some tabs.',
    'My plant survived another week. We celebrate small wins here. 🌱',
    'What’s one small thing that made your week better?',
  ],
}
const photoKinds: Record<Topic, PhotoKind[]> = {
  photo: ['landscape', 'city', 'beach', 'abstract'],
  food: ['food'],
  code: ['abstract'],
  travel: ['landscape', 'beach', 'city'],
  music: ['abstract', 'city'],
  outdoors: ['landscape'],
  life: ['abstract', 'food', 'city'],
}
const polls: Array<{ text: string; options: string[] }> = [
  { text: 'Settle this once and for all:', options: ['Tabs', 'Spaces', 'Whatever the formatter says'] },
  { text: 'Best time to go for a run?', options: ['Sunrise', 'Lunch break', 'After work', 'Never 🛋️'] },
  { text: 'Coffee order?', options: ['Espresso', 'Flat white', 'Iced latte', 'Tea, actually'] },
  { text: 'Next trip:', options: ['Mountains', 'Beach', 'A city I’ve never been to'] },
]

const loadedAt = Date.now()

/** Post number `n` of the endless timeline (0 = newest). Older posts have higher numbers. */
export function makePost(n: number, opts: { author?: string; date?: number } = {}): Post {
  const r = rng(n * 2654435761 + 97)
  const author = opts.author ?? people[1 + Math.floor(r() * (people.length - 1))]!.handle
  const p = person(author)
  const topic = p.topics[Math.floor(r() * p.topics.length)]!
  const poll = r() < 0.1 ? polls[Math.floor(r() * polls.length)]! : null
  const photoCount = poll ? 0 : r() < (topic === 'photo' || topic === 'food' || topic === 'travel' ? 0.85 : 0.3) ? [1, 1, 1, 2, 3, 4][Math.floor(r() * 6)]! : 0
  const kinds = photoKinds[topic]
  const famous = p.followers > 10_000
  const likes = Math.round((famous ? 400 : 8) + r() ** 2 * (famous ? 9000 : 400))
  return {
    id: `p${n}`,
    author,
    text: poll ? poll.text : templates[topic][Math.floor(r() * templates[topic].length)]!,
    date: opts.date ?? loadedAt - (n * 37 + r() * 30) * 60_000,
    photos: [...Array(photoCount)].map((_, i) => photo(n * 10 + i, kinds[Math.floor(r() * kinds.length)])),
    poll: poll ? { options: poll.options.map((label) => ({ label, votes: Math.round(r() * 400) })), ends: loadedAt + (2 + r() * 40) * 3_600_000 } : undefined,
    likes,
    reposts: Math.round(likes * (0.05 + r() * 0.2)),
    replies: Math.round(likes * (0.02 + r() * 0.08)),
    views: Math.round(likes * (20 + r() * 60)),
  }
}

const replyLines = [
  'This is so good 😍',
  'Saving this for later!',
  'Okay but where is this??',
  'Completely agree.',
  'Haha, every single time.',
  'Need the recipe please 🙏',
  'Love the colors in this one.',
  'Same here, honestly.',
  'Congrats!! 🎉',
  'This made my day.',
]

/** A few replies to a post, generated when you open it. */
export function makeReplies(post: Post): Post[] {
  const r = rng(Number(post.id.replace(/\D/g, '')) * 31 + 5)
  const count = Math.min(6, Math.max(1, Math.round(post.replies / 30) + 1))
  return [...Array(count)].map((_, i) => ({
    id: `${post.id}-r${i}`,
    author: people[1 + Math.floor(r() * (people.length - 1))]!.handle,
    text: replyLines[Math.floor(r() * replyLines.length)]!,
    date: post.date + (i + 1) * (5 + r() * 40) * 60_000,
    photos: [],
    replyTo: post.id,
    likes: Math.round(r() * 60),
    reposts: Math.round(r() * 4),
    replies: 0,
    views: Math.round(200 + r() * 3000),
  }))
}

/** Your own posts, for your profile. */
export const myPosts: Post[] = [
  { ...makePost(9001, { author: 'alex', date: loadedAt - 3 * 3_600_000 }), text: 'Finally got the drag-and-drop list to feel right: springs for everything, FLIP for reorders. #vue #animation' },
  { ...makePost(9002, { author: 'alex', date: loadedAt - 30 * 3_600_000 }), text: 'Climbing then tapas. Perfect Saturday. #climbing', photos: [photo(424242, 'landscape')] },
]

export const trends = [
  { tag: 'material3', posts: 12_400 },
  { tag: 'photography', posts: 98_100 },
  { tag: 'lofi', posts: 21_300 },
  { tag: 'climbing', posts: 8700 },
  { tag: 'recipes', posts: 41_200 },
  { tag: 'slowtravel', posts: 5900 },
  { tag: 'vue', posts: 15_800 },
]

export interface Story {
  handle: string
  frames: Photo[]
}
export const stories: Story[] = people.slice(1, 9).map((p, i) => ({ handle: p.handle, frames: [...Array(1 + (i % 3))].map((_, f) => photo(7000 + i * 10 + f, photoKinds[p.topics[0]!][f % photoKinds[p.topics[0]!].length])) }))

export type NotificationKind = 'like' | 'repost' | 'follow' | 'reply' | 'mention'
export interface Notification {
  id: string
  kind: NotificationKind
  who: string[]
  postId?: string
  text?: string
  date: number
  read: boolean
}
export const initialNotifications: Notification[] = [
  { id: 'n1', kind: 'like', who: ['luciafdz', 'theo', 'samokafor'], postId: myPosts[0]!.id, date: loadedAt - 20 * 60_000, read: false },
  { id: 'n2', kind: 'follow', who: ['wanderkit'], date: loadedAt - 55 * 60_000, read: false },
  { id: 'n3', kind: 'reply', who: ['mayachen'], postId: myPosts[0]!.id, text: 'Looks amazing! Does it work with the keyboard too?', date: loadedAt - 2 * 3_600_000, read: false },
  { id: 'n4', kind: 'repost', who: ['m3ui'], postId: myPosts[0]!.id, date: loadedAt - 4 * 3_600_000, read: true },
  { id: 'n5', kind: 'mention', who: ['samokafor'], text: '@alex climbing on Saturday? The new routes are up 🧗', date: loadedAt - 20 * 3_600_000, read: true },
  { id: 'n6', kind: 'like', who: ['jweber', 'nomnom'], postId: myPosts[1]!.id, date: loadedAt - 26 * 3_600_000, read: true },
]

export const compact = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 10_000 ? `${Math.round(n / 1000)}K` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n))
