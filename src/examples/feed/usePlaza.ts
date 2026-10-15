/*
 * Shared state at module level: where you are, every post seen so far, the endless timeline and
 * the new posts waiting at the top, what you liked / reposted / saved / voted, who you follow,
 * replies, notifications and stories.
 */
import { computed, reactive, ref } from 'vue'
import { useToast } from '@m3ui-vue/m3ui-vue'
import type { Photo } from './art'
import { initialNotifications, makePost, makeReplies, me, myPosts, person, type Notification, type Post } from './data'

export type Screen =
  | { name: 'home' }
  | { name: 'explore'; q?: string }
  | { name: 'notifications' }
  | { name: 'bookmarks' }
  | { name: 'profile'; handle: string }
  | { name: 'post'; id: string }

const toast = useToast()

// --- Navigation -----------------------------------------------------------------------------------

const history = ref<Screen[]>([{ name: 'home' }])
const cursor = ref(0)
const screen = computed(() => history.value[cursor.value]!)
function go(s: Screen) {
  history.value = [...history.value.slice(0, cursor.value + 1), s]
  cursor.value++
}
const canBack = computed(() => cursor.value > 0)
const back = () => canBack.value && cursor.value--

// --- Posts ----------------------------------------------------------------------------------------

const posts = reactive(new Map<string, Post>())
const add = (p: Post) => (posts.set(p.id, p), p.id)
const post = (id: string) => posts.get(id)!
myPosts.forEach(add)

/** Post number `n` of the generated pool (for Explore and profiles), created on first use. */
const postAt = (n: number, author?: string) => {
  const id = author ? `${author}-${n}` : `p${n}`
  return posts.has(id) ? id : add(author ? { ...makePost(n, { author }), id } : makePost(n))
}

const timeline = ref<string[]>([])
let nextN = 0
const loading = ref(false)
function loadMore() {
  if (loading.value) return
  loading.value = true
  setTimeout(() => {
    const ids: string[] = []
    for (let i = 0; i < 8; i++) ids.push(add(makePost(nextN++)))
    timeline.value = [...timeline.value, ...ids]
    loading.value = false
  }, timeline.value.length ? 700 : 400)
}

// New posts pile up while you read; the "new posts" pill shows them.
const incoming = ref<string[]>([])
let newN = -1
function arrive(count = 1) {
  for (let i = 0; i < count; i++) {
    const p = makePost(newN--, { date: Date.now() - i * 20_000 })
    p.likes = Math.round(p.likes / 30)
    p.reposts = Math.round(p.reposts / 30)
    p.replies = Math.round(p.replies / 30)
    p.views = Math.round(p.views / 30)
    incoming.value = [add(p), ...incoming.value]
  }
}
setInterval(() => arrive(1 + Math.floor(Math.random() * 2)), 30_000)
function showIncoming() {
  timeline.value = [...incoming.value, ...timeline.value]
  incoming.value = []
}
const refreshing = ref(false)
function refresh() {
  refreshing.value = true
  setTimeout(() => {
    arrive(1)
    showIncoming()
    refreshing.value = false
  }, 900)
}

const feedTab = ref<'for-you' | 'following'>('for-you')
const following = reactive(new Set(['luciafdz', 'mayachen', 'papermoons', 'm3ui', 'samokafor']))
const feed = computed(() => (feedTab.value === 'for-you' ? timeline.value : timeline.value.filter((id) => following.has(post(id).author) || post(id).author === me.handle)))

// --- Interactions ---------------------------------------------------------------------------------

const liked = reactive(new Set<string>())
const reposted = reactive(new Set<string>())
const bookmarked = reactive(new Set<string>([]))
const votes = reactive(new Map<string, number>())

function toggleLike(id: string) {
  liked.has(id) ? liked.delete(id) : liked.add(id)
}
function toggleRepost(id: string) {
  const on = !reposted.has(id)
  on ? reposted.add(id) : reposted.delete(id)
  toast.info(on ? 'Reposted' : 'Repost removed', { icon: 'repeat' })
}
function toggleBookmark(id: string) {
  const on = !bookmarked.has(id)
  on ? bookmarked.add(id) : bookmarked.delete(id)
  toast.info(on ? 'Added to your Bookmarks' : 'Removed from your Bookmarks', {
    icon: on ? 'bookmark_added' : 'bookmark_remove',
    action: on ? { label: 'View', onClick: () => go({ name: 'bookmarks' }) } : undefined,
  })
}
const count = (id: string, kind: 'likes' | 'reposts' | 'replies') =>
  post(id)[kind] + (kind === 'likes' && liked.has(id) ? 1 : 0) + (kind === 'reposts' && reposted.has(id) ? 1 : 0) + (kind === 'replies' ? (userReplies.get(id)?.length ?? 0) : 0)

function vote(id: string, option: number) {
  if (votes.has(id)) return
  votes.set(id, option)
  post(id).poll!.options[option]!.votes++
}

function toggleFollow(handle: string) {
  const on = !following.has(handle)
  on ? following.add(handle) : following.delete(handle)
  toast.info(on ? `You followed ${person(handle).name}` : `You unfollowed ${person(handle).name}`, { icon: on ? 'person_add' : 'person_remove' })
}
const followers = (handle: string) => person(handle).followers + (following.has(handle) ? 1 : 0)

// --- Replies --------------------------------------------------------------------------------------

const generatedReplies = new Map<string, string[]>()
const userReplies = reactive(new Map<string, string[]>())
function repliesOf(id: string) {
  if (!generatedReplies.has(id)) generatedReplies.set(id, makeReplies(post(id)).map(add))
  return [...(userReplies.get(id) ?? []), ...generatedReplies.get(id)!]
}

// --- Writing --------------------------------------------------------------------------------------

/** The composer dialog; `replyTo` when answering a post. */
const composer = ref<{ open: boolean; replyTo?: string }>({ open: false })
const mine = ref<string[]>(myPosts.map((p) => p.id))
let ownN = 0

function publish(text: string, photos: Photo[], poll: string[] | null, replyTo?: string) {
  const p: Post = {
    id: `me${++ownN}`,
    author: me.handle,
    text,
    date: Date.now(),
    photos,
    poll: poll ? { options: poll.map((label) => ({ label, votes: 0 })), ends: Date.now() + 24 * 3_600_000 } : undefined,
    replyTo,
    likes: 0,
    reposts: 0,
    replies: 0,
    views: 1,
  }
  add(p)
  mine.value = [p.id, ...mine.value]
  if (replyTo) {
    userReplies.set(replyTo, [p.id, ...(userReplies.get(replyTo) ?? [])])
    toast.success('Your reply was sent', { icon: 'reply' })
  } else {
    timeline.value = [p.id, ...timeline.value]
    toast.success('Your post was sent', { icon: 'send', action: { label: 'View', onClick: () => go({ name: 'post', id: p.id }) } })
  }
  // Someone notices a few seconds later.
  setTimeout(() => {
    const who = ['luciafdz', 'theo', 'mayachen', 'samokafor'][Math.floor(Math.random() * 4)]!
    p.likes++
    p.views += 40
    notifications.value = [{ id: `n${Date.now()}`, kind: 'like', who: [who], postId: p.id, date: Date.now(), read: false }, ...notifications.value]
    toast.info(`${person(who).name} liked your ${replyTo ? 'reply' : 'post'}`, { icon: 'favorite' })
  }, 6000)
}

// --- Notifications and stories --------------------------------------------------------------------

const notifications = ref<Notification[]>(initialNotifications.map((n) => ({ ...n })))
const unread = computed(() => notifications.value.filter((n) => !n.read).length)
const markAllRead = () => notifications.value.forEach((n) => (n.read = true))

const seenStories = reactive(new Set<string>())
const storyViewer = ref<{ open: boolean; index: number }>({ open: false, index: 0 })

export function usePlaza() {
  return {
    screen, go, back, canBack,
    post, postAt, timeline, feed, feedTab, loading, loadMore, incoming, showIncoming, refreshing, refresh,
    liked, reposted, bookmarked, votes, toggleLike, toggleRepost, toggleBookmark, count, vote,
    following, toggleFollow, followers, repliesOf,
    composer, publish, mine,
    notifications, unread, markAllRead,
    seenStories, storyViewer,
  }
}
