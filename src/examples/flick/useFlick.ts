/*
 * Shared state at module level, so every component sees the same thing: where you are (with
 * back, like a browser), the player (what's playing, position, speed, volume, quality), your
 * library (subscriptions, likes, Watch later, playlists, history) and the comments you write.
 */
import { computed, reactive, ref, watch } from 'vue'
import { usePageProgress, useToast } from '@m3ui-vue/m3ui-vue'
import { channelById, makeComments, me, shorts, videoById, videos, type Comment, type Video } from './data'

export type Screen =
  | { name: 'home' }
  | { name: 'shorts'; id?: string }
  | { name: 'subscriptions' }
  | { name: 'you' }
  | { name: 'watch'; id: string }
  | { name: 'channel'; id: string }
  | { name: 'search'; q: string }
  | { name: 'playlist'; id: string }

export interface Playlist {
  id: string
  name: string
  ids: string[]
  /** Watch later and Liked videos are built in and can't be renamed or deleted. */
  builtIn?: boolean
}

const toast = useToast()
const progressBar = usePageProgress()

// --- Navigation -----------------------------------------------------------------------------------

const history = ref<Screen[]>([{ name: 'home' }])
const cursor = ref(0)
const screen = computed(() => history.value[cursor.value]!)
/** True for a moment after each navigation, while the "page loads" (skeletons + the top bar). */
const loading = ref(false)
let loadTimer: number | undefined

function fakeLoad() {
  clearTimeout(loadTimer)
  loading.value = true
  progressBar.start()
  loadTimer = window.setTimeout(() => {
    loading.value = false
    progressBar.done()
  }, 450)
}

function go(s: Screen, replace = false) {
  if (JSON.stringify(s) === JSON.stringify(screen.value)) return
  if (replace) history.value.splice(cursor.value, 1, s)
  else {
    history.value = [...history.value.slice(0, cursor.value + 1), s]
    cursor.value++
  }
  fakeLoad()
}
const canBack = computed(() => cursor.value > 0)
function back() {
  if (canBack.value) cursor.value--
  else go({ name: 'home' }, true)
}

// --- Player ---------------------------------------------------------------------------------------

export type Quality = 'auto' | 1080 | 720 | 480 | 360 | 144

const current = ref<string | null>(null)
const video = computed(() => (current.value ? videoById.get(current.value)! : null))
const playing = ref(false)
const position = ref(0)
const ended = ref(false)
/** Shown for a moment after a seek or a quality change, like a real stream refilling. */
const buffering = ref(false)
const speed = ref(1)
const volume = ref(80)
const muted = ref(false)
const quality = ref<Quality>('auto')
const theater = ref(false)
const autoplay = ref(true)
/** Where you left each video, to resume it. */
const resume = reactive(new Map<string, number>())

let last = 0
let raf = 0
function tick(now: number) {
  const dt = Math.min((now - last) / 1000, 0.25)
  last = now
  const v = video.value
  if (v && playing.value && !buffering.value) {
    position.value = Math.min(v.duration, position.value + dt * speed.value)
    resume.set(v.id, position.value)
    if (position.value >= v.duration) {
      playing.value = false
      ended.value = true
    }
  }
  raf = playing.value ? requestAnimationFrame(tick) : 0
}
watch(playing, (on) => {
  if (on && !raf) {
    last = performance.now()
    raf = requestAnimationFrame(tick)
  }
})

let bufferTimer: number | undefined
function buffer(ms = 350) {
  clearTimeout(bufferTimer)
  buffering.value = true
  bufferTimer = window.setTimeout(() => (buffering.value = false), ms)
}

/** Starts a video (from where you left it, unless you finished it) and shows its page. */
function play(id: string, opts: { at?: number; page?: boolean } = {}) {
  const v = videoById.get(id)!
  if (current.value !== id) {
    current.value = id
    const saved = resume.get(id) ?? 0
    position.value = opts.at ?? (saved < v.duration - 5 ? saved : 0)
    addToHistory(id)
    buffer(500)
  } else if (opts.at !== undefined) seek(opts.at)
  ended.value = false
  playing.value = true
  if (opts.page !== false) go({ name: 'watch', id })
}
function toggle() {
  if (!video.value) return
  if (ended.value) {
    position.value = 0
    ended.value = false
  }
  playing.value = !playing.value
}
/** `quiet` while scrubbing: the frame follows the thumb, and it only buffers once you let go. */
function seek(t: number, quiet = false) {
  const v = video.value
  if (!v) return
  position.value = Math.max(0, Math.min(v.duration, t))
  ended.value = position.value >= v.duration
  if (ended.value) playing.value = false
  if (!quiet) buffer()
}
const skip = (s: number) => seek(position.value + s)
function stop() {
  playing.value = false
  current.value = null
}
watch(quality, () => buffer(600))

/** What plays next: more from the same channel first, then the newest from everyone else. */
function upNext(id: string): Video[] {
  const v = videoById.get(id)!
  const same = videos.filter((o) => o.channelId === v.channelId && o.id !== id)
  const rest = videos.filter((o) => o.channelId !== v.channelId && o.category === v.category)
  const others = videos.filter((o) => o.channelId !== v.channelId && o.category !== v.category)
  return [...same.slice(0, 3), ...rest, ...same.slice(3), ...others].slice(0, 14)
}

// --- Library --------------------------------------------------------------------------------------

const subscriptions = reactive(new Set(['lumen-lab', 'night-transit', 'tidewatch', 'blob-studio', 'pixel-forge']))
const bell = reactive(new Set(['night-transit']))
const liked = reactive(new Set<string>([videos[3]!.id, videos[11]!.id, videos[20]!.id]))
const disliked = reactive(new Set<string>())

function toggleSubscribe(channelId: string) {
  const c = channelById.get(channelId)!
  if (subscriptions.has(channelId)) {
    subscriptions.delete(channelId)
    bell.delete(channelId)
    toast.info(`Unsubscribed from ${c.name}`, { icon: 'person_remove', action: { label: 'Undo', onClick: () => subscriptions.add(channelId) } })
  } else {
    subscriptions.add(channelId)
    toast.success(`Subscribed to ${c.name}`, { icon: 'notifications_active' })
  }
}
const subscriberCount = (channelId: string) => channelById.get(channelId)!.subscribers + (subscriptions.has(channelId) ? 1 : 0)

function rateVideo(id: string, kind: 'like' | 'dislike') {
  const [on, off] = kind === 'like' ? [liked, disliked] : [disliked, liked]
  off.delete(id)
  if (on.has(id)) on.delete(id)
  else {
    on.add(id)
    if (kind === 'like') toast.info('Added to Liked videos', { icon: 'thumb_up' })
  }
}
const likeCount = (v: Video) => v.likes + (liked.has(v.id) ? 1 : 0)

const playlists = ref<Playlist[]>([
  { id: 'watch-later', name: 'Watch later', ids: [videos[5]!.id, videos[14]!.id, videos[27]!.id], builtIn: true },
  { id: 'chill', name: 'Chill evenings', ids: videos.filter((v) => v.category === 'Relaxing').slice(0, 4).map((v) => v.id) },
  { id: 'learn', name: 'Things to learn', ids: videos.filter((v) => v.category === 'Science').slice(0, 5).map((v) => v.id) },
])
const playlistById = (id: string): Playlist | undefined =>
  id === 'liked' ? { id: 'liked', name: 'Liked videos', ids: [...liked].reverse(), builtIn: true } : playlists.value.find((p) => p.id === id)
const inPlaylist = (pid: string, vid: string) => !!playlistById(pid)?.ids.includes(vid)

function toggleInPlaylist(pid: string, vid: string) {
  const p = playlists.value.find((l) => l.id === pid)!
  const on = !p.ids.includes(vid)
  p.ids = on ? [vid, ...p.ids] : p.ids.filter((i) => i !== vid)
  toast.info(on ? `Saved to ${p.name}` : `Removed from ${p.name}`, {
    icon: on ? 'playlist_add_check' : 'playlist_remove',
    action: { label: on ? 'View' : 'Undo', onClick: () => (on ? go({ name: 'playlist', id: pid }) : toggleInPlaylist(pid, vid)) },
  })
}
const watchLater = (vid: string) => !inPlaylist('watch-later', vid) && toggleInPlaylist('watch-later', vid)

function createPlaylist(name: string, firstVideo?: string) {
  const p: Playlist = { id: `pl${Date.now()}`, name, ids: firstVideo ? [firstVideo] : [] }
  playlists.value = [...playlists.value, p]
  toast.success(firstVideo ? `Saved to ${name}` : `Created ${name}`, { icon: 'playlist_add' })
  return p
}
function deletePlaylist(id: string) {
  const i = playlists.value.findIndex((p) => p.id === id)
  const [p] = playlists.value.splice(i, 1)
  toast.info(`Deleted ${p!.name}`, { icon: 'delete', action: { label: 'Undo', onClick: () => playlists.value.splice(i, 0, p!) } })
}

/** The "Save to playlist" sheet, for one video. */
const saving = ref<string | null>(null)
/** The share dialog, for one video (optionally at a time). */
const sharing = ref<{ id: string; at?: number } | null>(null)

// Watch history, newest first; one entry per video.
const watched = ref<Array<{ id: string; at: number }>>(
  [videos[2], videos[8], videos[17], videos[30], videos[41]].map((v, i) => ({ id: v!.id, at: Date.now() - (i * 9 + 2) * 3_600_000 })),
)
watched.value.forEach((w, i) => resume.set(w.id, videoById.get(w.id)!.duration * [0.3, 1, 0.6, 0.15, 1][i]!))
function addToHistory(id: string) {
  watched.value = [{ id, at: Date.now() }, ...watched.value.filter((w) => w.id !== id)]
}
function removeFromHistory(id: string) {
  const before = watched.value
  watched.value = before.filter((w) => w.id !== id)
  toast.info('Removed from watch history', { icon: 'history', action: { label: 'Undo', onClick: () => (watched.value = before) } })
}

// --- Comments -------------------------------------------------------------------------------------

const generated = new Map<string, Comment[]>()
const written = reactive(new Map<string, Comment[]>())
const likedComments = reactive(new Set<string>())

function commentsOf(id: string) {
  if (!generated.has(id)) generated.set(id, reactive(makeComments(videoById.get(id)!)))
  return [...(written.get(id) ?? []), ...generated.get(id)!]
}
const commentCount = (id: string) => commentsOf(id).reduce((n, c) => n + 1 + c.replies.length, 0)

function addComment(videoId: string, text: string, replyTo?: Comment) {
  const c: Comment = reactive({ id: `mine-${Date.now()}`, author: me.name, text, date: Date.now(), likes: 0, replies: [], mine: true })
  if (replyTo) replyTo.replies.push(c)
  else written.set(videoId, [c, ...(written.get(videoId) ?? [])])
  toast.success(replyTo ? 'Reply added' : 'Comment added', { icon: 'chat' })
  // The creator notices a while later.
  setTimeout(() => {
    c.likes += 1
    c.hearted = true
  }, 5000)
}
function deleteComment(videoId: string, c: Comment, parent?: Comment) {
  if (parent) parent.replies = parent.replies.filter((r) => r !== c)
  else written.set(videoId, (written.get(videoId) ?? []).filter((r) => r !== c))
  toast.info('Comment deleted', { icon: 'delete' })
}

// --- Search ---------------------------------------------------------------------------------------

const recentSearches = ref(['synthwave mix', 'aurora 4k', 'shader art'])
function search(q: string) {
  q = q.trim()
  if (!q) return
  recentSearches.value = [q, ...recentSearches.value.filter((s) => s !== q)].slice(0, 6)
  go({ name: 'search', q })
}
function results(q: string) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean)
  const hit = (text: string) => words.every((w) => text.toLowerCase().includes(w))
  return videos.filter((v) => hit(`${v.title} ${channelById.get(v.channelId)!.name} ${v.category} ${v.description}`))
}

export function useFlick() {
  return {
    screen, go, back, canBack, loading,
    current, video, playing, position, ended, buffering, speed, volume, muted, quality, theater, autoplay, resume,
    play, toggle, seek, skip, stop, upNext,
    subscriptions, bell, toggleSubscribe, subscriberCount,
    liked, disliked, rateVideo, likeCount,
    playlists, playlistById, inPlaylist, toggleInPlaylist, watchLater, createPlaylist, deletePlaylist, saving, sharing,
    watched, removeFromHistory,
    commentsOf, commentCount, addComment, deleteComment, likedComments,
    recentSearches, search, results,
    shorts,
  }
}
