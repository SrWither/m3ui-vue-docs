/*
 * Shared state for the whole app, at module level so every component sees the same thing:
 * navigation history, your library (likes, saved albums, followed artists, playlists) and the
 * player (what's playing, from where, the queue, shuffle and repeat).
 */
import { computed, ref, watch } from 'vue'
import { useToast } from '@m3ui-vue/m3ui-vue'
import { albumById, albumTracks, artistById, curated, popularTracks, trackById, type Playlist } from './catalog'
import { likedCover, mosaic } from './art'
import { engine } from './engine'

export type Screen =
  | { name: 'home' }
  | { name: 'search' }
  | { name: 'library' }
  | { name: 'liked' }
  | { name: 'album'; id: string }
  | { name: 'playlist'; id: string }
  | { name: 'artist'; id: string }

/** Where the current queue came from ("Playing from …"). */
export interface Source {
  type: 'album' | 'playlist' | 'artist' | 'liked' | 'search'
  id: string
  name: string
}

export interface LibraryEntry {
  type: 'liked' | 'playlist' | 'album' | 'artist'
  id: string
  title: string
  subtitle: string
  image: string
}

const toast = useToast()

// --- Navigation (with back/forward, like a browser) ------------------------------------------

const history = ref<Screen[]>([{ name: 'home' }])
const cursor = ref(0)
const screen = computed(() => history.value[cursor.value]!)
const same = (a: Screen, b: Screen) => a.name === b.name && ('id' in a ? a.id : '') === ('id' in b ? b.id : '')

function go(s: Screen) {
  if (same(s, screen.value)) return
  history.value = [...history.value.slice(0, cursor.value + 1), s]
  cursor.value++
}
const canBack = computed(() => cursor.value > 0)
const canForward = computed(() => cursor.value < history.value.length - 1)
const back = () => canBack.value && cursor.value--
const forward = () => canForward.value && cursor.value++

// --- Library ----------------------------------------------------------------------------------

const liked = ref<string[]>(['chrome-horizon-2', 'rain-on-tin-1', 'overworld-1', 'tidal-4', 'basement-hours-4', 'soft-focus-1', 'insert-coin-3', 'northern-2', 'small-hours-1'])
const savedAlbums = ref<string[]>(['chrome-horizon', 'rain-on-tin', 'overworld', 'northern'])
const followed = ref<string[]>(['paper-moons', 'neon-harbor', 'bit-garden'])
const savedPlaylists = ref<string[]>(['focus-flow', 'night-drive', 'daily-mix'])
const playlists = ref<Playlist[]>([
  ...curated,
  { id: 'road-trip', name: 'Road Trip', description: 'Windows down.', cover: '', trackIds: ['chrome-horizon-1', 'basement-hours-4', 'insert-coin-1', 'overworld-3', 'harbor-lights-2', 'chrome-horizon-5'], own: true },
])

const isLiked = (id: string) => liked.value.includes(id)
function toggleLike(id: string) {
  if (isLiked(id)) {
    liked.value = liked.value.filter((t) => t !== id)
    toast.info('Removed from Liked Songs', { icon: 'heart_minus' })
  } else {
    liked.value = [id, ...liked.value]
    toast.success('Added to Liked Songs', { icon: 'favorite' })
  }
}

const playlistById = (id: string) => playlists.value.find((p) => p.id === id)
/** Your playlists get a mosaic of their first albums' covers. */
function playlistImage(p: Playlist) {
  if (!p.own) return p.cover
  const covers = [...new Set(p.trackIds.map((t) => albumById.get(trackById.get(t)!.albumId)!.cover))]
  return mosaic(covers)
}

function createPlaylist(name: string, firstTrack?: string) {
  const id = `mine-${Date.now()}`
  playlists.value.push({ id, name, description: '', cover: '', trackIds: firstTrack ? [firstTrack] : [], own: true })
  toast.success(`Created “${name}”`, { icon: 'playlist_add_check' })
  return id
}
function addToPlaylist(playlistId: string, trackId: string) {
  const p = playlistById(playlistId)!
  if (p.trackIds.includes(trackId)) return toast.info(`Already in “${p.name}”`)
  p.trackIds.push(trackId)
  toast.success(`Added to “${p.name}”`, { icon: 'playlist_add' })
}
function removeFromPlaylist(playlistId: string, trackId: string) {
  const p = playlistById(playlistId)!
  p.trackIds = p.trackIds.filter((t) => t !== trackId)
}
function deletePlaylist(id: string) {
  const p = playlistById(id)!
  playlists.value = playlists.value.filter((x) => x.id !== id)
  if ('id' in screen.value && screen.value.id === id) go({ name: 'library' })
  toast.info(`Deleted “${p.name}”`, {
    icon: 'delete',
    action: { label: 'Undo', onClick: () => playlists.value.push(p) },
  })
}

function toggleIn(list: typeof savedAlbums, id: string, added: string, removed: string) {
  const has = list.value.includes(id)
  list.value = has ? list.value.filter((x) => x !== id) : [id, ...list.value]
  toast.info(has ? removed : added)
}
const toggleSaveAlbum = (id: string) => toggleIn(savedAlbums, id, 'Saved to Your Library', 'Removed from Your Library')
const toggleFollow = (id: string) => toggleIn(followed, id, `Following ${artistById.get(id)!.name}`, `Unfollowed ${artistById.get(id)!.name}`)
const toggleSavePlaylist = (id: string) => toggleIn(savedPlaylists, id, 'Saved to Your Library', 'Removed from Your Library')

const libraryFilter = ref<'all' | 'playlist' | 'album' | 'artist'>('all')
const library = computed<LibraryEntry[]>(() => {
  const all: LibraryEntry[] = [
    { type: 'liked', id: 'liked', title: 'Liked Songs', subtitle: `Playlist · ${liked.value.length} songs`, image: likedCover },
    ...playlists.value
      .filter((p) => p.own || savedPlaylists.value.includes(p.id))
      .map((p): LibraryEntry => ({ type: 'playlist', id: p.id, title: p.name, subtitle: `Playlist · ${p.own ? 'You' : 'Tempo'}`, image: playlistImage(p) })),
    ...savedAlbums.value.map((id): LibraryEntry => {
      const a = albumById.get(id)!
      return { type: 'album', id, title: a.title, subtitle: `${a.type} · ${artistById.get(a.artistId)!.name}`, image: a.cover }
    }),
    ...followed.value.map((id): LibraryEntry => {
      const a = artistById.get(id)!
      return { type: 'artist', id, title: a.name, subtitle: 'Artist', image: a.image }
    }),
  ]
  const f = libraryFilter.value
  return f === 'all' ? all : all.filter((e) => e.type === f || (f === 'playlist' && e.type === 'liked'))
})

const screenFor = (e: { type: LibraryEntry['type']; id: string }): Screen => (e.type === 'liked' ? { name: 'liked' } : { name: e.type, id: e.id })

/** The tracks and display name of anything playable. */
function collection(type: Source['type'], id: string): { name: string; tracks: string[] } {
  if (type === 'liked') return { name: 'Liked Songs', tracks: liked.value }
  if (type === 'album') return { name: albumById.get(id)!.title, tracks: albumTracks(id) }
  if (type === 'artist') return { name: artistById.get(id)!.name, tracks: popularTracks(id) }
  if (type === 'playlist') {
    const p = playlistById(id)!
    return { name: p.name, tracks: p.trackIds }
  }
  return { name: 'Search', tracks: [id] }
}

// Recently played, for the home screen's quick picks.
const recent = ref<Array<{ type: LibraryEntry['type']; id: string }>>([
  { type: 'playlist', id: 'focus-flow' },
  { type: 'album', id: 'chrome-horizon' },
  { type: 'liked', id: 'liked' },
  { type: 'playlist', id: 'night-drive' },
  { type: 'artist', id: 'bit-garden' },
  { type: 'album', id: 'tidal' },
])

// --- Player -----------------------------------------------------------------------------------

const current = ref<string | null>(null)
const playing = ref(false)
const position = ref(0)
const source = ref<Source | null>(null)
/** The context's tracks in play order (shuffled or not), and where we are in it. */
const context = ref<string[]>([])
const index = ref(-1)
let original: string[] = []
/** Songs you added with "Add to queue": they play before the rest of the context. */
const manual = ref<Array<{ id: string; trackId: string }>>([])
const shuffle = ref(false)
const repeat = ref<'off' | 'all' | 'one'>('off')
const volume = ref(0.8)
const muted = ref(false)

const track = computed(() => (current.value ? trackById.get(current.value)! : null))
const upNext = computed(() => context.value.slice(index.value + 1).map((trackId) => ({ id: trackId, trackId })))

function start(id: string) {
  current.value = id
  position.value = 0
  engine.load(trackById.get(id)!)
  engine.play(0)
  playing.value = true
}

const shuffled = (ids: string[]) => {
  const a = [...ids]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

/** Plays a collection, from `startId` (or the top, or a random song when shuffling). */
function playFrom(type: Source['type'], id: string, startId?: string) {
  const c = collection(type, id)
  if (!c.tracks.length) return
  original = [...new Set(c.tracks)]
  const first = startId ?? (shuffle.value ? original[Math.floor(Math.random() * original.length)]! : original[0]!)
  context.value = shuffle.value ? [first, ...shuffled(original.filter((t) => t !== first))] : original
  index.value = context.value.indexOf(first)
  source.value = { type, id, name: c.name }
  if (type !== 'search') {
    recent.value = [{ type: type as LibraryEntry['type'], id }, ...recent.value.filter((r) => r.type !== type || r.id !== id)].slice(0, 8)
  }
  start(first)
}

const isSource = (type: Source['type'], id: string) => source.value?.type === type && source.value.id === id
const playingFrom = (type: Source['type'], id: string) => playing.value && isSource(type, id)

/** The big play button of an album, playlist or artist: pause/resume if it's what's playing. */
function togglePlayFrom(type: Source['type'], id: string) {
  if (isSource(type, id) && current.value) toggle()
  else playFrom(type, id)
}

function toggle() {
  if (!current.value) return playFrom('playlist', 'daily-mix')
  if (playing.value) {
    engine.pause()
    playing.value = false
  } else {
    engine.play()
    playing.value = true
  }
}

function next(auto = false) {
  if (auto && repeat.value === 'one') return start(current.value!)
  const queued = manual.value.shift()
  if (queued) return start(queued.trackId)
  if (index.value + 1 < context.value.length) {
    index.value++
    return start(context.value[index.value]!)
  }
  if (repeat.value !== 'off' && context.value.length) {
    index.value = 0
    return start(context.value[0]!)
  }
  // End of the queue: stop at the start of the last song.
  engine.load(track.value!)
  position.value = 0
  playing.value = false
}

function prev() {
  if (position.value > 3 || index.value <= 0) return seek(0)
  index.value--
  start(context.value[index.value]!)
}

function seek(t: number) {
  engine.seek(t)
  position.value = engine.position()
}

watch(shuffle, (on) => {
  if (!current.value) return
  const cur = current.value
  if (on) context.value = [cur, ...shuffled(context.value.filter((t) => t !== cur))]
  else context.value = original
  index.value = Math.max(0, context.value.indexOf(cur))
})

function cycleRepeat() {
  repeat.value = ({ off: 'all', all: 'one', one: 'off' } as const)[repeat.value]
}

function addToQueue(trackId: string) {
  manual.value.push({ id: `${trackId}-${Date.now()}`, trackId })
  toast.info('Added to queue', { icon: 'queue_music' })
}
function setUpNext(items: Array<{ trackId: string }>) {
  context.value = [...context.value.slice(0, index.value + 1), ...items.map((i) => i.trackId)]
}
function removeUpNext(trackId: string) {
  context.value = context.value.filter((t, i) => i <= index.value || t !== trackId)
}
/** Play a song you queued by hand right now. */
function playQueued(id: string) {
  const q = manual.value.find((m) => m.id === id)
  if (!q) return
  manual.value = manual.value.filter((m) => m.id !== id)
  start(q.trackId)
}
function removeQueued(id: string) {
  manual.value = manual.value.filter((m) => m.id !== id)
}
/** Jump to a song further down the queue. */
function skipTo(trackId: string) {
  const i = context.value.indexOf(trackId, index.value + 1)
  if (i < 0) return
  index.value = i
  start(trackId)
}

watch([volume, muted], ([v, m]) => engine.setVolume(m ? 0 : v), { immediate: true })
engine.onEnded(() => next(true))

// The position is read from the audio clock a few times a second.
setInterval(() => {
  if (playing.value) position.value = engine.position()
}, 200)

// --- UI state shared across components ----------------------------------------------------------

const nowPlayingOpen = ref(false)
const queueOpen = ref(false)
/** The "New playlist" dialog; `pendingTrack` is added to it once created. */
const newPlaylist = ref<{ open: boolean; pendingTrack?: string }>({ open: false })
const query = ref('')

export function useMusic() {
  return {
    screen, go, back, forward, canBack, canForward,
    liked, isLiked, toggleLike, savedAlbums, toggleSaveAlbum, followed, toggleFollow, savedPlaylists, toggleSavePlaylist,
    playlists, playlistById, playlistImage, createPlaylist, addToPlaylist, removeFromPlaylist, deletePlaylist,
    library, libraryFilter, screenFor, collection, recent,
    current, track, playing, position, source, shuffle, repeat, volume, muted, manual, upNext,
    playFrom, togglePlayFrom, playingFrom, isSource, toggle, next, prev, seek, cycleRepeat,
    addToQueue, setUpNext, removeUpNext, skipTo, playQueued, removeQueued,
    nowPlayingOpen, queueOpen, newPlaylist, query,
  }
}
