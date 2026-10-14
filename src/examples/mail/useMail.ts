/*
 * Shared state, at module level so every component sees the same mailbox: threads and the
 * folder you're in, selection, search, drafts and the composer, plus the simulated parts
 * (new mail on refresh, contacts answering what you send, scheduled mail going out).
 */
import { computed, ref } from 'vue'
import { useToast } from '@m3ui-vue/m3ui-vue'
import { contacts, incoming, initialThreads, labels, me, replies, type Attachment, type Contact, type Thread } from './data'

export type Box = 'inbox' | 'starred' | 'snoozed' | 'sent' | 'drafts' | 'scheduled' | 'archive' | 'spam' | 'trash'
/** A folder, or a label as `label:<id>`. */
export type View = Box | `label:${string}`

export interface Draft {
  id: string
  to: string[]
  cc: string[]
  subject: string
  html: string
  attachments: Attachment[]
  /** Replying in (or forwarding from) this thread. */
  threadId?: string
  updated: number
  /** Scheduled to go out at this time. */
  sendAt?: number
}

const toast = useToast()

export const boxes: Array<{ id: Box; label: string; icon: string }> = [
  { id: 'inbox', label: 'Inbox', icon: 'inbox' },
  { id: 'starred', label: 'Starred', icon: 'star' },
  { id: 'snoozed', label: 'Snoozed', icon: 'schedule' },
  { id: 'sent', label: 'Sent', icon: 'send' },
  { id: 'drafts', label: 'Drafts', icon: 'draft' },
  { id: 'scheduled', label: 'Scheduled', icon: 'schedule_send' },
  { id: 'archive', label: 'Archive', icon: 'archive' },
  { id: 'spam', label: 'Spam', icon: 'report' },
  { id: 'trash', label: 'Trash', icon: 'delete' },
]

// --- People -----------------------------------------------------------------------------------

const everyone: Contact[] = [me, ...contacts]
const byId = new Map(everyone.map((c) => [c.id, c]))
const byEmail = new Map(everyone.map((c) => [c.email, c]))
export const person = (idOrEmail: string): Contact => byId.get(idOrEmail) ?? byEmail.get(idOrEmail) ?? { id: idOrEmail, name: idOrEmail.split('@')[0]!, email: idOrEmail }
export const isMe = (idOrEmail: string) => idOrEmail === 'me' || idOrEmail === me.email
export const firstName = (idOrEmail: string) => (isMe(idOrEmail) ? 'me' : person(idOrEmail).name.split(' ')[0]!)

// --- Mailbox ----------------------------------------------------------------------------------

const threads = ref<Thread[]>(structuredClone(initialThreads))
const now = ref(Date.now())
setInterval(() => (now.value = Date.now()), 30_000)

const view = ref<View>('inbox')
const query = ref('')
const unreadOnly = ref(false)
const withAttachments = ref(false)
const openId = ref<string | null>(null)
const showDetail = ref(false)
const selected = ref<string[]>([])

const last = (t: Thread) => t.messages.at(-1)!
const snoozed = (t: Thread) => !!t.snoozedUntil && t.snoozedUntil > now.value
const binned = (t: Thread) => t.folder === 'trash' || t.folder === 'spam'
const hasAttachments = (t: Thread) => t.messages.some((m) => m.attachments?.length)
export const plain = (html: string) => html.replace(/<br\s*\/?>/g, ' ').replace(/<\/(p|li|h\d|blockquote)>/g, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()

function inView(t: Thread, v: View) {
  if (v.startsWith('label:')) return t.labels.includes(v.slice(6)) && !binned(t)
  switch (v as Box) {
    case 'inbox':
      return t.folder === 'inbox' && !snoozed(t)
    case 'starred':
      return t.starred && !binned(t)
    case 'snoozed':
      return snoozed(t) && !binned(t)
    case 'sent':
      return t.messages.some((m) => isMe(m.from)) && !binned(t)
    default:
      return t.folder === v
  }
}

const searching = computed(() => query.value.trim().length > 0)
const list = computed(() => {
  const q = query.value.trim().toLowerCase()
  return threads.value
    .filter((t) => {
      if (q) {
        if (t.folder === 'trash' || t.folder === 'spam') return false
        const people = t.messages.flatMap((m) => [m.from, ...m.to]).map((x) => `${person(x).name} ${person(x).email}`)
        const text = `${t.subject} ${people.join(' ')} ${t.messages.map((m) => plain(m.html)).join(' ')}`.toLowerCase()
        if (!text.includes(q)) return false
      } else if (!inView(t, view.value)) return false
      if (unreadOnly.value && !t.unread) return false
      if (withAttachments.value && !hasAttachments(t)) return false
      return true
    })
    .sort((a, b) => last(b).date - last(a).date)
})

const openThread = computed(() => threads.value.find((t) => t.id === openId.value) ?? null)
const thread = (id: string) => threads.value.find((t) => t.id === id)!

const counts = computed(() => ({
  inbox: threads.value.filter((t) => inView(t, 'inbox') && t.unread).length,
  spam: threads.value.filter((t) => t.folder === 'spam' && t.unread).length,
  drafts: drafts.value.filter((d) => !d.sendAt).length,
  scheduled: drafts.value.filter((d) => d.sendAt).length,
}))

const viewTitle = computed(() => {
  if (searching.value) return 'Search results'
  if (view.value.startsWith('label:')) return labels.find((l) => l.id === view.value.slice(6))?.name ?? ''
  return boxes.find((b) => b.id === view.value)!.label
})

function go(v: View) {
  view.value = v
  query.value = ''
  selected.value = []
  showDetail.value = false
  openId.value = null
}

function open(id: string) {
  openId.value = id
  showDetail.value = true
  const t = thread(id)
  t.unread = false
}

// After archiving or deleting the open thread, show the next one (or go back to the list).
function advance(removed: string[], twoPane: boolean) {
  if (!openId.value || !removed.includes(openId.value)) return
  const ids = list.value.map((t) => t.id)
  const at = ids.indexOf(openId.value)
  const next = ids.slice(at + 1).find((id) => !removed.includes(id)) ?? ids.slice(0, at).reverse().find((id) => !removed.includes(id))
  if (twoPane && next) open(next)
  else {
    openId.value = null
    showDetail.value = false
  }
}

/** Runs a change on some threads with an "Undo" in the toast that restores them as they were. */
function withUndo(ids: string[], message: string, change: (t: Thread) => void, icon: string) {
  const before = ids.map((id) => ({ ...thread(id) }))
  ids.forEach((id) => change(thread(id)))
  selected.value = selected.value.filter((id) => !ids.includes(id))
  toast.info(message, {
    icon,
    action: {
      label: 'Undo',
      onClick: () => before.forEach((b) => Object.assign(thread(b.id), b)),
    },
  })
}

const plural = (n: number, one: string) => (n === 1 ? one : `${n} conversations`)

function archive(ids: string[], twoPane = false) {
  advance(ids, twoPane)
  withUndo(ids, `${plural(ids.length, 'Conversation')} archived`, (t) => (t.folder = 'archive'), 'archive')
}
function remove(ids: string[], twoPane = false) {
  advance(ids, twoPane)
  if (ids.every((id) => thread(id).folder === 'trash')) {
    threads.value = threads.value.filter((t) => !ids.includes(t.id))
    selected.value = []
    toast.info(`${plural(ids.length, 'Conversation')} deleted forever`, { icon: 'delete_forever' })
    return
  }
  withUndo(ids, `${plural(ids.length, 'Conversation')} moved to Trash`, (t) => (t.folder = 'trash'), 'delete')
}
function moveToInbox(ids: string[], twoPane = false) {
  advance(ids, twoPane)
  withUndo(ids, `${plural(ids.length, 'Conversation')} moved to Inbox`, (t) => {
    t.folder = 'inbox'
    t.snoozedUntil = undefined
  }, 'inbox')
}
function spam(ids: string[], twoPane = false) {
  advance(ids, twoPane)
  withUndo(ids, `${plural(ids.length, 'Conversation')} marked as spam`, (t) => (t.folder = 'spam'), 'report')
}
function snooze(ids: string[], until: number, twoPane = false) {
  advance(ids, twoPane)
  withUndo(ids, `Snoozed until ${formatWhen(until)}`, (t) => (t.snoozedUntil = until), 'schedule')
}
function markRead(ids: string[], read: boolean) {
  ids.forEach((id) => (thread(id).unread = !read))
  selected.value = []
}
function toggleStar(id: string) {
  const t = thread(id)
  t.starred = !t.starred
}
function setLabel(ids: string[], label: string, on: boolean) {
  for (const id of ids) {
    const t = thread(id)
    t.labels = on ? [...new Set([...t.labels, label])] : t.labels.filter((l) => l !== label)
  }
}

// Snoozed threads come back to the inbox, unread, when their time comes.
setInterval(() => {
  for (const t of threads.value) {
    if (t.snoozedUntil && t.snoozedUntil <= Date.now()) {
      t.snoozedUntil = undefined
      t.unread = true
    }
  }
}, 15_000)

// --- New mail ---------------------------------------------------------------------------------

const refreshing = ref(false)
let nextIncoming = 0

function deliver() {
  const item = incoming[nextIncoming++]
  if (!item) return false
  const { message, ...rest } = item
  threads.value.push({ ...rest, messages: [{ ...message, id: `${item.id}-m`, date: Date.now() }] })
  const from = person(message.from).name
  toast.info(`New email from ${from}`, { icon: 'mail', action: { label: 'Open', onClick: () => open(item.id) } })
  return true
}

/** Pull to refresh / the refresh button: "fetches" one new email, if there's any left. */
function refresh() {
  if (refreshing.value) return
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
    if (!deliver()) toast.info('No new mail', { icon: 'done_all' })
  }, 900)
}

// --- Drafts and sending -----------------------------------------------------------------------

const drafts = ref<Draft[]>([
  { id: 'd-1', to: ['sam.okafor@gmail.com'], cc: [], subject: 'Gear list for the trip', html: '<p>Hey Sam, here’s what I have so far:</p><ul><li>Tent (mine)</li><li>Stove + gas</li><li>Headlamps</li></ul>', attachments: [], updated: Date.now() - 26 * 3_600_000 },
])
/** The draft open in the composer, and how its window is shown. */
const composer = ref<{ draftId: string; minimized: boolean; maximized: boolean } | null>(null)

function compose(init: Partial<Draft> = {}) {
  // One composer at a time: an open, untouched draft is simply replaced.
  const d: Draft = { id: `d-${Date.now()}`, to: [], cc: [], subject: '', html: '', attachments: [], updated: Date.now(), ...init }
  drafts.value.push(d)
  composer.value = { draftId: d.id, minimized: false, maximized: false }
  return d
}
function openDraft(id: string) {
  composer.value = { draftId: id, minimized: false, maximized: false }
}
const draft = (id: string) => drafts.value.find((d) => d.id === id)

const quote = (t: Thread) => {
  const m = last(t)
  return `<p></p><blockquote><p>On ${new Date(m.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}, ${person(m.from).name} wrote:</p>${m.html}</blockquote>`
}

function reply(threadId: string, all = false) {
  const t = thread(threadId)
  const m = [...t.messages].reverse().find((x) => !isMe(x.from)) ?? last(t)
  const from = isMe(m.from) ? m.to : [person(m.from).email]
  const others = all ? [...m.to, ...(m.cc ?? [])].filter((e) => !isMe(e) && !from.includes(e)) : []
  compose({ to: from, cc: others, subject: t.subject.startsWith('Re:') ? t.subject : `Re: ${t.subject}`, html: quote(t), threadId })
}
function forward(threadId: string) {
  const t = thread(threadId)
  compose({ subject: `Fwd: ${t.subject}`, html: `<p></p><p>---------- Forwarded message ----------</p>${last(t).html}`, attachments: t.messages.flatMap((m) => m.attachments ?? []) })
}

const emptyHtml = (html: string) => !plain(html)
const isBlank = (d: Draft) => !d.to.length && !d.cc.length && !d.subject.trim() && emptyHtml(d.html) && !d.attachments.length

/** Closing the composer keeps the draft, unless it's empty. */
function closeComposer() {
  const d = composer.value && draft(composer.value.draftId)
  composer.value = null
  if (!d) return
  if (isBlank(d)) drafts.value = drafts.value.filter((x) => x.id !== d.id)
  else toast.info('Saved to Drafts', { icon: 'draft' })
}
function discard(id: string) {
  const d = draft(id)!
  drafts.value = drafts.value.filter((x) => x.id !== id)
  if (composer.value?.draftId === id) composer.value = null
  toast.info('Draft discarded', { icon: 'delete', action: { label: 'Undo', onClick: () => drafts.value.push(d) } })
}

function send(id: string, silent = false) {
  const d = draft(id)
  if (!d) return
  drafts.value = drafts.value.filter((x) => x.id !== id)
  if (composer.value?.draftId === id) composer.value = null
  const message = { id: `m-${Date.now()}`, from: 'me', to: d.to, cc: d.cc, date: Date.now(), html: d.html || '<p></p>', attachments: d.attachments }
  let t = d.threadId && !d.subject.startsWith('Fwd:') ? threads.value.find((x) => x.id === d.threadId) : undefined
  if (t) t.messages.push(message)
  else {
    t = { id: `t-${Date.now()}`, subject: d.subject.trim() || '(no subject)', messages: [message], folder: 'sent', labels: [], starred: false, unread: false }
    threads.value.push(t)
  }
  const target = t
  const answer = scheduleReplies(target, d.to)
  if (silent) return
  toast.success('Message sent', {
    icon: 'send',
    action: {
      label: 'Undo',
      onClick: () => {
        clearTimeout(answer)
        target.messages = target.messages.filter((m) => m.id !== message.id)
        if (!target.messages.length) threads.value = threads.value.filter((x) => x.id !== target.id)
        drafts.value.push(d)
        openDraft(d.id)
      },
    },
  })
}

function schedule(id: string, at: number) {
  const d = draft(id)!
  d.sendAt = at
  if (composer.value?.draftId === id) composer.value = null
  toast.info(`Send scheduled for ${formatWhen(at)}`, { icon: 'schedule_send', action: { label: 'Undo', onClick: () => { d.sendAt = undefined; openDraft(d.id) } } })
}
function cancelSchedule(id: string) {
  draft(id)!.sendAt = undefined
  openDraft(id)
}
setInterval(() => {
  for (const d of drafts.value.filter((x) => x.sendAt && x.sendAt <= Date.now())) {
    send(d.id, true)
    toast.success(`Scheduled email sent: ${d.subject || '(no subject)'}`, { icon: 'send' })
  }
}, 5_000)

// The first known contact you wrote to answers a few seconds later, and the thread jumps to the inbox.
function scheduleReplies(t: Thread, to: string[]) {
  const who = to.map((e) => person(e)).find((c) => !isMe(c.email) && contacts.some((x) => x.id === c.id) && replies[c.id])
    ?? to.map((e) => person(e)).find((c) => contacts.some((x) => x.id === c.id) && !['nook', 'tempo', 'skyway', 'm3ui', 'gitbot', 'calendar', 'bank', 'deals'].includes(c.id))
  if (!who) return undefined
  const lines = replies[who.id] ?? replies.default!
  return window.setTimeout(() => {
    t.messages.push({ id: `m-${Date.now()}`, from: who.id, to: [me.email], date: Date.now(), html: `<p>${lines[Math.floor(Math.random() * lines.length)]}</p>` })
    if (t.folder === 'sent' || t.folder === 'archive') t.folder = 'inbox'
    if (openId.value !== t.id) t.unread = true
    toast.info(`New email from ${who.name}`, { icon: 'mail', action: { label: 'Open', onClick: () => open(t.id) } })
  }, 5_000 + Math.random() * 4_000)
}

// --- Dates ------------------------------------------------------------------------------------

/** The list's short date: a time today, "Oct 3" this year, a full date before. */
export function shortDate(ts: number) {
  const d = new Date(ts)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  if (d.getFullYear() === today.getFullYear()) return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return d.toLocaleDateString('en-US', { dateStyle: 'short' })
}
export function formatWhen(ts: number) {
  return new Date(ts).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function fileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

/** Presets shared by snooze and schedule send. */
export function laterOptions() {
  const at = (days: number, hour: number) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    d.setHours(hour, 0, 0, 0)
    return d.getTime()
  }
  const today = new Date()
  const toSaturday = (6 - today.getDay() + 7) % 7 || 7
  const toMonday = (1 - today.getDay() + 7) % 7 || 7
  const opts = [
    { label: 'Tomorrow', at: at(1, 8), icon: 'wb_twilight' },
    { label: 'This weekend', at: at(toSaturday, 8), icon: 'weekend' },
    { label: 'Next week', at: at(toMonday, 8), icon: 'next_week' },
  ]
  if (today.getHours() < 17) opts.unshift({ label: 'Later today', at: at(0, 18), icon: 'schedule' })
  return opts
}

export function useMail() {
  return {
    threads, view, query, searching, unreadOnly, withAttachments, list, openId, openThread, showDetail, selected, counts, viewTitle,
    go, open, thread, archive, remove, moveToInbox, spam, snooze, markRead, toggleStar, setLabel,
    refreshing, refresh, deliver,
    drafts, draft, composer, compose, openDraft, reply, forward, closeComposer, discard, send, schedule, cancelSchedule,
  }
}
