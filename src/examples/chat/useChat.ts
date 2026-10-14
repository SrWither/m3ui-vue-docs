import { computed, reactive, ref } from 'vue'

/*
 * Chat state, module-level so the list, the conversation and the composer share it. Nothing
 * goes to a server: replies are simulated (the other person reads, types or records audio,
 * then answers from a canned list) so the example feels alive.
 */

export interface Message {
  id: number
  /** 'me', or the sender's name (groups have several). */
  from: string
  at: number
  text?: string
  /** An image: an object URL from the file picker, or an inline SVG for the seeded ones. */
  image?: string
  /** A voice note, length in seconds. */
  audio?: number
  status?: 'sent' | 'delivered' | 'read'
}

export interface Chat {
  id: string
  name: string
  group?: boolean
  /** Group members who reply (the chat name is used for 1:1 chats). */
  members?: string[]
  online?: boolean
  lastSeen?: number
  pinned?: boolean
  muted?: boolean
  unread: number
  /** What the other side is doing right now, shown in the header, the list and as a bubble. */
  activity: { who: string; kind: 'text' | 'audio' } | null
  /** Canned answers, used in order. */
  replies: string[]
  messages: Message[]
}

const MIN = 60_000
const HOUR = 60 * MIN
const now = Date.now()
let nextId = 1000

/** A placeholder "photo": a gradient with a sun and hills, no network needed. */
function photo(from: string, to: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='400' height='300' fill='url(#g)'/><circle cx='300' cy='90' r='42' fill='#fff' fill-opacity='.85'/><path d='M0 230 Q100 150 200 220 T400 200 V300 H0Z' fill='#000' fill-opacity='.18'/><path d='M0 260 Q120 200 240 255 T400 240 V300 H0Z' fill='#000' fill-opacity='.22'/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const m = (from: string, ago: number, rest: Omit<Message, 'id' | 'from' | 'at'>): Message => ({
  id: nextId++,
  from,
  at: now - ago,
  ...rest,
})

const chats = ref<Chat[]>([
  {
    id: 'alex', name: 'Alex Rivera', online: true, pinned: true, unread: 2, activity: null,
    replies: ['Haha, true', 'Sounds good to me', 'Wait, really? 😄', 'Send me the link when you can', 'Deal. See you then!'],
    messages: [
      m('Alex Rivera', 26 * HOUR, { text: 'Did you finish the slides?' }),
      m('me', 25 * HOUR, { text: 'Almost, sending them tonight', status: 'read' }),
      m('Alex Rivera', 50 * MIN, { text: 'Look at this view from the hike 🏔️' }),
      m('Alex Rivera', 49 * MIN, { image: photo('#7c9cff', '#f7b267') }),
      m('Alex Rivera', 48 * MIN, { text: 'We should go together next time' }),
    ],
  },
  {
    id: 'team', name: 'Design team', group: true, members: ['Ana', 'Luis', 'Marta'], unread: 5, activity: null,
    replies: ['Love it 🙌', 'Can we move it to 4pm?', 'I can take that one', 'Pushed a new version to Figma', 'Looks great, ship it!'],
    messages: [
      m('Ana', 3 * HOUR, { text: 'Review is moved to Thursday 10:00' }),
      m('Luis', 3 * HOUR - 4 * MIN, { text: 'Works for me' }),
      m('me', 2 * HOUR, { text: 'Same here. I’ll bring the prototype', status: 'read' }),
      m('Marta', 40 * MIN, { audio: 14 }),
      m('Ana', 12 * MIN, { text: 'New icons are in the shared folder 🎨' }),
    ],
  },
  {
    id: 'mom', name: 'Mom', lastSeen: now - 35 * MIN, unread: 0, activity: null,
    replies: ['Call me when you can ❤️', 'Did you eat?', 'Okay! Love you', 'Bring a jacket, it’s cold'],
    messages: [
      m('Mom', 27 * HOUR, { text: 'Sunday lunch at 1?' }),
      m('me', 26 * HOUR, { text: 'Yes! I’ll bring dessert 🍰', status: 'read' }),
      m('Mom', 26 * HOUR - 2 * MIN, { text: 'Perfect' }),
    ],
  },
  {
    id: 'sofia', name: 'Sofía Lima', online: true, unread: 0, activity: null,
    replies: ['Yes! I just read it', 'Let me check and get back to you', 'Thanks 🙏', 'That makes sense'],
    messages: [
      m('me', 5 * HOUR, { text: 'Can you review the roadmap draft?', status: 'read' }),
      m('Sofía Lima', 4 * HOUR, { text: 'On it, give me an hour' }),
    ],
  },
  {
    id: 'climbing', name: 'Climbing crew', group: true, members: ['Diego', 'Carla'], muted: true, unread: 0, activity: null,
    replies: ['Who’s in for Saturday?', 'I’ll bring the ropes', '7am at the usual spot', '💪💪'],
    messages: [
      m('Diego', 52 * HOUR, { image: photo('#2bb3a3', '#235b9e') }),
      m('Carla', 51 * HOUR, { text: 'That wall was brutal 😅' }),
    ],
  },
  {
    id: 'pablo', name: 'Pablo Ortiz', lastSeen: now - 3 * 24 * HOUR, unread: 0, activity: null,
    replies: ['Sure, no rush', 'Haha nice', 'Talk soon!'],
    messages: [m('Pablo Ortiz', 4 * 24 * HOUR, { text: 'Thanks for the help with the move!' })],
  },
])

const selectedId = ref<string | null>(null)
const showDetail = ref(false)
const query = ref('')
const filter = ref<'all' | 'unread' | 'groups'>('all')

const lastMessage = (c: Chat) => c.messages.at(-1)
const sortKey = (c: Chat) => (c.pinned ? 1e15 : 0) + (lastMessage(c)?.at ?? 0)

const visibleChats = computed(() => {
  const q = query.value.trim().toLowerCase()
  return chats.value
    .filter((c) => !q || c.name.toLowerCase().includes(q) || c.messages.some((x) => x.text?.toLowerCase().includes(q)))
    .filter((c) => (filter.value === 'unread' ? c.unread > 0 : filter.value === 'groups' ? !!c.group : true))
    .sort((a, b) => sortKey(b) - sortKey(a))
})
const selected = computed(() => chats.value.find((c) => c.id === selectedId.value) ?? null)
const unreadTotal = computed(() => chats.value.reduce((n, c) => n + (c.muted ? 0 : c.unread), 0))

function open(id: string) {
  selectedId.value = id
  showDetail.value = true
  const chat = chats.value.find((c) => c.id === id)
  if (chat) chat.unread = 0
}

/** Simulated other side: read my messages, then type (or record) and answer. */
const replyCursor = reactive<Record<string, number>>({})
const pending = new Map<string, ReturnType<typeof setTimeout>[]>()
function later(chatId: string, ms: number, fn: () => void) {
  const t = setTimeout(fn, ms)
  pending.set(chatId, [...(pending.get(chatId) ?? []), t])
}

function respond(chat: Chat, mine: Message) {
  for (const t of pending.get(chat.id) ?? []) clearTimeout(t)
  pending.set(chat.id, [])
  later(chat.id, 500, () => (mine.status = 'delivered'))
  const away = !chat.online && !chat.group
  later(chat.id, away ? 2500 : 1200, () => {
    for (const x of chat.messages) if (x.from === 'me') x.status = 'read'
    const who = chat.group ? chat.members![Math.floor(Math.random() * chat.members!.length)]! : chat.name
    const voice = Math.random() < 0.2
    chat.activity = { who, kind: voice ? 'audio' : 'text' }
    later(chat.id, 1500 + Math.random() * 1500, () => {
      chat.activity = null
      const i = replyCursor[chat.id] ?? 0
      replyCursor[chat.id] = i + 1
      chat.messages.push({
        id: nextId++,
        from: who,
        at: Date.now(),
        ...(voice ? { audio: 3 + Math.floor(Math.random() * 20) } : { text: chat.replies[i % chat.replies.length] }),
      })
      if (selectedId.value !== chat.id || !showDetail.value) chat.unread++
    })
  })
}

function send(content: Pick<Message, 'text' | 'image' | 'audio'>) {
  const chat = selected.value
  if (!chat) return
  chat.messages.push({ id: nextId++, from: 'me', at: Date.now(), status: 'sent', ...content })
  // The reactive copy in the array, not the plain object: status updates must re-render.
  respond(chat, chat.messages.at(-1)!)
}

function clearChat(id: string) {
  const chat = chats.value.find((c) => c.id === id)
  if (chat) chat.messages = []
}

export function useChat() {
  return {
    chats,
    visibleChats,
    selected,
    selectedId,
    showDetail,
    query,
    filter,
    unreadTotal,
    lastMessage,
    open,
    send,
    clearChat,
  }
}

/** "14:05" today, "Yesterday", a weekday this week, else a short date. */
export function shortTime(at: number) {
  const d = new Date(at)
  const today = new Date()
  const days = Math.floor((new Date(today.toDateString()).getTime() - new Date(d.toDateString()).getTime()) / 86_400_000)
  if (days === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (days === 1) return 'Yesterday'
  if (days < 7) return d.toLocaleDateString([], { weekday: 'short' })
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' })
}

export const clock = (at: number) => new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
export const duration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
