/*
 * The fake catalog: artists, albums, tracks and curated playlists. Every track is a small
 * generated song (see engine.ts), so its genre, tempo and key here are what you actually hear.
 * Everything is derived from fixed seeds, so the catalog is the same on every visit.
 */
import { artistArt, cover, playlistCover, type Motif } from './art'
import { rng } from './rng'

export type Genre = 'lofi' | 'synthwave' | 'ambient' | 'house' | 'chiptune'

export interface Artist {
  id: string
  name: string
  genre: Genre
  listeners: number
  bio: string
  image: string
  colors: [string, string]
}

export interface Album {
  id: string
  title: string
  artistId: string
  year: number
  type: 'Album' | 'EP' | 'Single'
  cover: string
  color: string
}

export interface Track {
  id: string
  title: string
  artistId: string
  albumId: string
  /** Seconds. Matches the generated song's real length. */
  duration: number
  plays: number
  genre: Genre
  bpm: number
  /** MIDI note of the key's root. */
  root: number
  minor: boolean
  seed: number
}

export interface Playlist {
  id: string
  name: string
  description: string
  cover: string
  trackIds: string[]
  /** Made by you (editable) or by "Tempo". */
  own: boolean
}

export const genres: Record<Genre, { label: string; color: string; bpm: [number, number] }> = {
  lofi: { label: 'Lo-fi', color: '#8d6e63', bpm: [72, 86] },
  synthwave: { label: 'Synthwave', color: '#c2185b', bpm: [96, 112] },
  ambient: { label: 'Ambient', color: '#00897b', bpm: [58, 70] },
  house: { label: 'House', color: '#3949ab', bpm: [118, 124] },
  chiptune: { label: 'Chiptune', color: '#f57c00', bpm: [132, 148] },
}

const artistSeeds: Array<{ id: string; name: string; genre: Genre; colors: [string, string]; bio: string }> = [
  { id: 'paper-moons', name: 'Paper Moons', genre: 'lofi', colors: ['#d7ccc8', '#6d4c41'], bio: 'Rainy-window beats recorded on a cassette deck that has seen better days. Best with tea.' },
  { id: 'neon-harbor', name: 'Neon Harbor', genre: 'synthwave', colors: ['#f48fb1', '#4a148c'], bio: 'Night drives, chrome sunsets and arpeggios that never quite end.' },
  { id: 'still-water', name: 'Still Water', genre: 'ambient', colors: ['#b2dfdb', '#004d40'], bio: 'Slow, wide music for reading, sleeping or staring at the sea.' },
  { id: 'kilo-club', name: 'Kilo Club', genre: 'house', colors: ['#9fa8da', '#1a237e'], bio: 'Four on the floor since day one. Warehouse-tested, kitchen-approved.' },
  { id: 'bit-garden', name: 'Bit Garden', genre: 'chiptune', colors: ['#ffcc80', '#bf360c'], bio: 'Songs written on a handheld console, then lovingly overclocked.' },
  { id: 'velvet-static', name: 'Velvet Static', genre: 'lofi', colors: ['#f8bbd0', '#5d4037'], bio: 'Dusty chords, soft drums and the occasional happy accident.' },
  { id: 'aurora-drift', name: 'Aurora Drift', genre: 'ambient', colors: ['#c5cae9', '#00695c'], bio: 'Pads that move like northern lights: slowly, and in every color.' },
  { id: 'midnight-arcade', name: 'Midnight Arcade', genre: 'synthwave', colors: ['#ce93d8', '#311b92'], bio: 'One more credit. One more level. One more song.' },
]

const albumSeeds: Array<{ title: string; artistId: string; year: number; type: Album['type']; motif: Motif; tracks: string[] }> = [
  { title: 'Rain on Tin', artistId: 'paper-moons', year: 2025, type: 'Album', motif: 'blobs', tracks: ['Kettle On', 'Window Seat', 'Borrowed Umbrella', 'Late Bus', 'Puddle Jumps', 'Tea Gone Cold', 'Sleepy Streetlights'] },
  { title: 'Small Hours', artistId: 'paper-moons', year: 2023, type: 'EP', motif: 'moon', tracks: ['2:47 a.m.', 'Desk Lamp', 'Cat on the Keys', 'Last Page'] },
  { title: 'Chrome Horizon', artistId: 'neon-harbor', year: 2026, type: 'Album', motif: 'sun', tracks: ['Overdrive', 'Coastline 1986', 'Pink Skyline', 'Tape Deck Hearts', 'Mirrorball Highway', 'After Midnight', 'Exit Ramp', 'Afterglow'] },
  { title: 'Harbor Lights', artistId: 'neon-harbor', year: 2024, type: 'EP', motif: 'grid', tracks: ['Dockside', 'Signal Flare', 'Lighthouse Code', 'Undertow'] },
  { title: 'Tidal', artistId: 'still-water', year: 2025, type: 'Album', motif: 'rings', tracks: ['Low Tide', 'Kelp Forest', 'Salt', 'Drift', 'The Long Swell', 'Moonpull'] },
  { title: 'Glass Lake', artistId: 'still-water', year: 2022, type: 'Single', motif: 'waves', tracks: ['Glass Lake'] },
  { title: 'Basement Hours', artistId: 'kilo-club', year: 2026, type: 'Album', motif: 'bars', tracks: ['Doors at Ten', 'Strobe Theory', 'Cloakroom', 'Bassline Taxi', 'Sunrise Exit', 'Afterparty Kitchen', 'Last Train Home'] },
  { title: 'Kilo', artistId: 'kilo-club', year: 2024, type: 'EP', motif: 'grid', tracks: ['Kilo', 'Gram', 'Ounce'] },
  { title: 'Overworld', artistId: 'bit-garden', year: 2025, type: 'Album', motif: 'pixels', tracks: ['Press Start', 'Mushroom Valley', 'Cloud Castle', 'Boss Rush', 'Secret Warp', 'High Score', 'Credits'] },
  { title: 'Save Point', artistId: 'bit-garden', year: 2023, type: 'EP', motif: 'pixels', tracks: ['Save Point', 'Continue?', 'Extra Life'] },
  { title: 'Soft Focus', artistId: 'velvet-static', year: 2026, type: 'Album', motif: 'blobs', tracks: ['Polaroid', 'Linen', 'Sunday Laundry', 'Film Grain', 'Honey', 'Soft Focus'] },
  { title: 'Northern', artistId: 'aurora-drift', year: 2025, type: 'Album', motif: 'waves', tracks: ['Magnetic North', 'Solar Wind', 'Green Curtain', 'Polar Night', 'First Light'] },
  { title: 'Insert Coin', artistId: 'midnight-arcade', year: 2026, type: 'Album', motif: 'sun', tracks: ['Insert Coin', 'Player Two', 'Neon Maze', 'Continue Screen', 'Game Over (Not Yet)', 'Attract Mode'] },
  { title: 'Hi-Score Nights', artistId: 'midnight-arcade', year: 2024, type: 'Single', motif: 'grid', tracks: ['Hi-Score Nights'] },
]

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const artists: Artist[] = artistSeeds.map((a, i) => ({
  ...a,
  listeners: Math.round(120_000 + rng(i + 7)() * 4_800_000),
  image: artistArt(a.colors, i),
}))
export const artistById = new Map(artists.map((a) => [a.id, a]))

export const albums: Album[] = []
export const tracks: Track[] = []

albumSeeds.forEach((s, ai) => {
  const artist = artistById.get(s.artistId)!
  const id = slug(s.title)
  const r = rng(1000 + ai * 31)
  const g = genres[artist.genre]
  // Albums share a key and a tempo range, songs vary inside it.
  const root = 45 + Math.floor(r() * 12)
  const minor = artist.genre === 'synthwave' || r() < 0.55
  albums.push({ id, title: s.title, artistId: s.artistId, year: s.year, type: s.type, cover: cover(s.motif, artist.colors, ai), color: artist.colors[1] })
  s.tracks.forEach((title, ti) => {
    const bpm = Math.round(g.bpm[0] + r() * (g.bpm[1] - g.bpm[0]))
    // Length in whole 4-bar phrases, roughly 1:40–2:50.
    const target = 100 + r() * 70
    const bars = Math.max(16, Math.round((target * bpm) / 240 / 4) * 4)
    tracks.push({
      id: `${id}-${ti + 1}`,
      title,
      artistId: s.artistId,
      albumId: id,
      duration: (bars * 240) / bpm,
      plays: Math.round(20_000 + r() ** 2 * 9_000_000),
      genre: artist.genre,
      bpm,
      root: root + [0, 0, 2, -3, 5, 0, -2, 3][ti % 8]!,
      minor: ti % 3 === 2 ? !minor : minor,
      seed: ai * 100 + ti + 1,
    })
  })
})

export const albumById = new Map(albums.map((a) => [a.id, a]))
export const trackById = new Map(tracks.map((t) => [t.id, t]))

export const albumTracks = (id: string) => tracks.filter((t) => t.albumId === id).map((t) => t.id)
export const artistAlbums = (id: string) => albums.filter((a) => a.artistId === id).sort((a, b) => b.year - a.year)
export const popularTracks = (artistId: string) =>
  tracks.filter((t) => t.artistId === artistId).sort((a, b) => b.plays - a.plays).slice(0, 5).map((t) => t.id)

function pick(seed: number, filter: (t: Track) => boolean, count: number) {
  const r = rng(seed)
  const pool = tracks.filter(filter)
  const out: string[] = []
  while (out.length < Math.min(count, pool.length)) {
    const t = pool[Math.floor(r() * pool.length)]!
    if (!out.includes(t.id)) out.push(t.id)
  }
  return out
}

export const curated: Playlist[] = [
  { id: 'focus-flow', name: 'Focus Flow', description: 'Lo-fi and ambient to keep your head down and your tabs closed.', trackIds: pick(1, (t) => t.genre === 'lofi' || t.genre === 'ambient', 14), colors: ['#80cbc4', '#4e342e'] },
  { id: 'night-drive', name: 'Night Drive', description: 'Synthwave for empty highways and long tunnels.', trackIds: pick(2, (t) => t.genre === 'synthwave', 12), colors: ['#f06292', '#283593'] },
  { id: 'dance-floor', name: 'Kitchen Dance Floor', description: 'House music for doing the dishes way too energetically.', trackIds: pick(3, (t) => t.genre === 'house' || t.genre === 'synthwave', 12), colors: ['#7986cb', '#ad1457'] },
  { id: '8-bit-energy', name: '8-Bit Energy', description: 'Chiptune bangers. Gamepad optional.', trackIds: pick(4, (t) => t.genre === 'chiptune' || t.genre === 'house', 10), colors: ['#ffb74d', '#6a1b9a'] },
  { id: 'deep-sleep', name: 'Deep Sleep', description: 'Slow ambient waves. Set a timer, close your eyes.', trackIds: pick(5, (t) => t.genre === 'ambient', 9), colors: ['#4db6ac', '#1a237e'] },
  { id: 'daily-mix', name: 'Daily Mix', description: 'Paper Moons, Neon Harbor, Bit Garden and more.', trackIds: pick(6, () => true, 16), colors: ['#aed581', '#00695c'] },
].map(({ colors, ...p }, i) => ({ ...p, own: false, cover: playlistCover(p.name, colors as [string, string], i) }))

export const formatTime = (s: number) => {
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

export const formatCount = (n: number) => n.toLocaleString('en-US')
