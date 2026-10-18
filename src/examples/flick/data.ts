/*
 * The fake catalog: channels, their videos and shorts, and the comments under them. Everything
 * comes from fixed seeds, so it's the same on every visit. A video is a scene (shaders.ts), three
 * colors and a seed; its thumbnail is a frame of that same scene (thumbs.ts).
 */
import { scenes, type Scene } from './shaders'
import { thumbnail } from './thumbs'

export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const pick = <T>(r: () => number, list: readonly T[]) => list[Math.floor(r() * list.length)]!
const DAY = 86_400_000

export type Category = 'Music' | 'Gaming' | 'Science' | 'Nature' | 'Relaxing' | 'Design'
export const categories: Category[] = ['Music', 'Gaming', 'Science', 'Nature', 'Relaxing', 'Design']

export interface Channel {
  id: string
  name: string
  handle: string
  subscribers: number
  description: string
  joined: number
  verified: boolean
  /** The scene and colors of its banner. */
  scene: Scene
  colors: [string, string, string]
  category: Category
}

export interface Video {
  id: string
  title: string
  channelId: string
  /** Seconds. */
  duration: number
  views: number
  likes: number
  date: number
  category: Category
  description: string
  scene: Scene
  colors: [string, string, string]
  seed: number
  short?: boolean
}

export interface Comment {
  id: string
  author: string
  text: string
  date: number
  likes: number
  /** Liked by the video's creator. */
  hearted?: boolean
  replies: Comment[]
  mine?: boolean
}

const palettes: Array<[string, string, string]> = [
  ['#7cf5c8', '#7aa7ff', '#0b1a33'],
  ['#ffb36b', '#ff6f91', '#1d2b53'],
  ['#ff4ecd', '#5ee7ff', '#1a0b2e'],
  ['#ffe066', '#ff7b54', '#2b193d'],
  ['#9bf6ff', '#caffbf', '#023047'],
  ['#f15bb5', '#fee440', '#3a0ca3'],
  ['#80ffdb', '#5390d9', '#10002b'],
  ['#ffd6a5', '#ff8fab', '#3d2c5e'],
  ['#b8f2e6', '#5e6472', '#1b2a41'],
  ['#ff9e00', '#ff0054', '#14001f'],
  ['#c3f73a', '#28afb0', '#132a13'],
  ['#e0aaff', '#7b2cbf', '#10002b'],
]

const channelSeeds: Array<Omit<Channel, 'subscribers' | 'joined' | 'scene' | 'colors'>> = [
  { id: 'lumen-lab', name: 'Lumen Lab', handle: '@lumenlab', verified: true, category: 'Science', description: 'Light, color and the physics behind pretty things. New explainer every Thursday.' },
  { id: 'tidewatch', name: 'Tidewatch', handle: '@tidewatch', verified: false, category: 'Nature', description: 'Slow footage of the sea, recorded from the same cliff for six years.' },
  { id: 'pixel-forge', name: 'Pixel Forge', handle: '@pixelforge', verified: true, category: 'Gaming', description: 'Speedruns, retro hardware and the tricks old games used to look good.' },
  { id: 'night-transit', name: 'Night Transit', handle: '@nighttransit', verified: true, category: 'Music', description: 'Synthwave mixes for driving, coding and staying up too late.' },
  { id: 'slow-coast', name: 'Slow Coast', handle: '@slowcoast', verified: false, category: 'Relaxing', description: 'Ambient loops to study, sleep or just breathe to. Hours long, no ads in the middle.' },
  { id: 'orbit-notes', name: 'Orbit Notes', handle: '@orbitnotes', verified: true, category: 'Science', description: 'Space news without the hype: missions, telescopes and what the data actually says.' },
  { id: 'blob-studio', name: 'Blob Studio', handle: '@blobstudio', verified: false, category: 'Design', description: 'Motion design breakdowns, shader art and the occasional lava lamp.' },
  { id: 'quiet-ripples', name: 'Quiet Ripples', handle: '@quietripples', verified: false, category: 'Relaxing', description: 'Rain, water and soft sounds. Put it on and close your eyes.' },
  { id: 'field-theory', name: 'Field Theory', handle: '@fieldtheory', verified: true, category: 'Design', description: 'Generative art, one algorithm at a time, explained from scratch.' },
  { id: 'arcade-hours', name: 'Arcade Hours', handle: '@arcadehours', verified: false, category: 'Gaming', description: 'Chill let\'s plays and long talks about level design.' },
]

const sceneFor: Record<Category, Scene[]> = {
  Science: ['stars', 'tunnel', 'rings'],
  Nature: ['waves', 'aurora'],
  Gaming: ['horizon', 'tunnel', 'plasma'],
  Music: ['horizon', 'plasma', 'aurora'],
  Relaxing: ['aurora', 'waves', 'rings', 'blobs'],
  Design: ['blobs', 'plasma', 'rings'],
}

const r0 = rng(7)
export const channels: Channel[] = channelSeeds.map((c, i) => ({
  ...c,
  subscribers: Math.round(10 ** (3.5 + r0() * 3)),
  joined: Date.now() - (400 + Math.floor(r0() * 3000)) * DAY,
  scene: pick(r0, sceneFor[c.category]),
  colors: palettes[i % palettes.length]!,
}))
export const channelById = new Map(channels.map((c) => [c.id, c]))

const titles: Record<Category, string[]> = {
  Science: ['Why the sky is never really black', 'The color that only exists in your brain', 'I built a telescope out of a coffee can', 'What a black hole would look like up close', 'The weird math of soap bubbles', 'How far can you actually see?', 'Every photon has a story', 'We finally know why auroras dance'],
  Nature: ['Six hours of the same wave, explained', 'Storm rolling in over the bay (4K)', 'Northern lights from my backyard, real time', 'The tide went out further than ever', 'A full day at the cliff in 12 minutes', 'Sunset over open water, no music'],
  Gaming: ['This 1994 game hides a whole second world', 'Beating the first level without jumping', 'The trick that made old racing games feel fast', 'I played every level backwards', 'Why this boss took 20 years to beat', 'Reviewing the strangest console ever made'],
  Music: ['3 hours of synthwave for night drives', 'Neon highway (full album)', 'Coding mix: deep focus retro', 'Outrun at 2 AM, mix vol. 7', 'Chrome sunset live set', 'Lo-fi city lights to relax to'],
  Relaxing: ['10 hours of soft aurora to fall asleep', 'Rain on a quiet lake, no talking', 'Breathe with the waves (guided, 15 min)', 'Calm colors for a busy brain', 'Deep sleep ambience, black screen after 1 hour', 'Gentle ripples for studying'],
  Design: ['Making a lava lamp with pure math', 'Shader art for beginners, part 1', 'The color palette that fixed my animations', 'Recreating a 70s poster in code', 'Why smooth motion is all about springs', 'I made 100 gradients and ranked them'],
}

const lines = [
  'In this one we take a closer look at something you\'ve probably seen a hundred times without noticing.',
  'Everything you see was generated live, frame by frame, with a few lines of code.',
  'Thanks to everyone who suggested this topic in the comments!',
  'Recorded over a few evenings, edited on a very old laptop.',
  'If you enjoyed this, the next part goes much deeper.',
]

function makeVideo(n: number, channel: Channel, short: boolean): Video {
  const r = rng(1000 + n * 31 + (short ? 7 : 0))
  const category = channel.category
  const duration = short ? 15 + Math.floor(r() * 46) : pick(r, [95, 240, 420, 612, 754, 980, 1320, 2710])
  const views = Math.round(10 ** (2.6 + r() * 4.2))
  const title = short ? pick(r, ['Wait for it…', 'This loop is too satisfying', 'POV: 3 AM', 'One take, no edits', 'Can you spot it?', 'Turn the sound up', 'Day 47 of this', 'Tiny thing, huge effect']) : titles[category][((n % 10) + Math.floor(n / 10) * 3) % titles[category].length]!
  const chapters = duration > 300 ? `\n\n0:00 Intro\n${fmt(Math.floor(duration * 0.2))} The setup\n${fmt(Math.floor(duration * 0.55))} Where it gets interesting\n${fmt(Math.floor(duration * 0.85))} Wrapping up` : ''
  return {
    id: `${short ? 's' : 'v'}${n}`,
    title,
    channelId: channel.id,
    duration,
    views,
    likes: Math.round(views * (0.02 + r() * 0.05)),
    date: Date.now() - Math.floor(r() * r() * 400 * DAY) - 3600_000,
    category,
    description: `${pick(r, lines)} ${pick(r, lines)}${chapters}\n\n#${category.toLowerCase()} #${channel.handle.slice(1)}`,
    scene: r() < 0.7 ? pick(r, sceneFor[category]) : pick(r, scenes),
    colors: pick(r, palettes),
    seed: Math.round(r() * 100) / 10,
    short,
  }
}

export const videos: Video[] = []
export const shorts: Video[] = []
channels.forEach((c, ci) => {
  for (let k = 0; k < 6; k++) videos.push(makeVideo(ci * 10 + k, c, false))
  for (let k = 0; k < 2; k++) shorts.push(makeVideo(ci * 10 + k, c, true))
})
videos.sort((a, b) => b.date - a.date)
export const videoById = new Map([...videos, ...shorts].map((v) => [v.id, v]))

/** The thumbnail (a frame a third of the way in), or a frame at `time` for the seek preview. */
export const thumbOf = (v: Video, time?: number) =>
  thumbnail({ id: v.id, scene: v.scene, colors: v.colors, seed: v.seed, time: time ?? Math.min(v.duration / 3, 40), vertical: v.short })
export const bannerOf = (c: Channel) => thumbnail({ id: `banner-${c.id}`, scene: c.scene, colors: c.colors, seed: 3, time: 12 })

// --- Comments --------------------------------------------------------------------------------------

const people = ['Maya Ortiz', 'Jonas Berg', 'Priya Nair', 'Leo Martins', 'Aiko Tanaka', 'Sam Whitfield', 'Nora Haddad', 'Felix Wagner', 'Ines Duarte', 'Omar Khalil', 'Ruth Mbeki', 'Theo Laurent', 'Kai Nakamura', 'Lucia Romero']
const remarks = [
  'This is exactly what I needed today.',
  'The part at the end gave me chills.',
  'Watching this at 3 AM and no regrets.',
  'How is this channel not bigger??',
  'I\'ve had this on repeat all week.',
  'The colors in this one are unreal.',
  'Came for the thumbnail, stayed for the whole thing.',
  'Every upload is better than the last.',
  'My cat is also watching this, she approves.',
  'Can you do a longer version of this?',
  'This explained it better than my teacher did in a whole semester.',
  'Saving this for later, it\'s too good to watch half asleep.',
]
const answers = ['Same here!', 'Agreed, 100%.', 'Haha this is so true', 'Thanks, I needed to hear that.', 'The longer version would be amazing.', 'Underrated comment.']

export function makeComments(v: Video): Comment[] {
  const r = rng(v.id.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 3))
  const count = 6 + Math.floor(r() * 8)
  return Array.from({ length: count }, (_, i) => {
    const date = v.date + Math.floor(r() * (Date.now() - v.date))
    const replies = Array.from({ length: r() < 0.4 ? 1 + Math.floor(r() * 3) : 0 }, (_, j) => ({
      id: `${v.id}-c${i}-r${j}`,
      author: pick(r, people),
      text: pick(r, answers),
      date: date + Math.floor(r() * (Date.now() - date)),
      likes: Math.floor(r() * 40),
      replies: [],
    }))
    return {
      id: `${v.id}-c${i}`,
      author: pick(r, people),
      text: pick(r, remarks),
      date,
      likes: Math.floor(r() * r() * 4000),
      hearted: r() < 0.15,
      replies,
    }
  }).sort((a, b) => b.likes - a.likes)
}

// --- Formatting ------------------------------------------------------------------------------------

export function fmt(s: number) {
  s = Math.max(0, Math.floor(s))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`
}

const compactFmt = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
export const compact = (n: number) => compactFmt.format(n)

export function ago(date: number) {
  const s = (Date.now() - date) / 1000
  const units: Array<[number, string]> = [[31536000, 'year'], [2592000, 'month'], [604800, 'week'], [86400, 'day'], [3600, 'hour'], [60, 'minute']]
  for (const [size, name] of units) {
    const n = Math.floor(s / size)
    if (n >= 1) return `${n} ${name}${n > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

export const me = { name: 'Alex Rivera', handle: '@alexrivera' }
