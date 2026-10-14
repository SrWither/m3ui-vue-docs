/*
 * The mailbox you start with: contacts, labels and a couple of weeks of threads. Dates are
 * relative to when the page loads, so "2 hours ago" is always 2 hours ago. Photos are drawn
 * as SVG so the example needs no image hosting.
 */

export interface Contact {
  id: string
  name: string
  email: string
}

export interface Attachment {
  name: string
  /** Bytes. */
  size: number
  kind: 'image' | 'pdf' | 'doc' | 'sheet' | 'zip'
  /** Images only: what MLightbox shows (a data URI, or an object URL for files you attach). */
  src?: string
}

export interface Message {
  id: string
  /** A contact id, or 'me'. */
  from: string
  to: string[]
  cc?: string[]
  date: number
  html: string
  attachments?: Attachment[]
}

export type Folder = 'inbox' | 'archive' | 'trash' | 'sent' | 'spam'

export interface Thread {
  id: string
  subject: string
  messages: Message[]
  folder: Folder
  labels: string[]
  starred: boolean
  unread: boolean
  important?: boolean
  /** Hidden from the inbox until then. */
  snoozedUntil?: number
}

export interface Label {
  id: string
  name: string
  tone: 'primary' | 'tertiary' | 'success' | 'secondary'
}

export const me: Contact = { id: 'me', name: 'Alex Rivera', email: 'alex@postbox.dev' }

export const contacts: Contact[] = [
  { id: 'maya', name: 'Maya Chen', email: 'maya.chen@northwind.io' },
  { id: 'jonas', name: 'Jonas Weber', email: 'jonas@northwind.io' },
  { id: 'priya', name: 'Priya Natarajan', email: 'priya@northwind.io' },
  { id: 'sam', name: 'Sam Okafor', email: 'sam.okafor@gmail.com' },
  { id: 'lucia', name: 'Lucía Fernández', email: 'lucia.fdz@gmail.com' },
  { id: 'mom', name: 'Mom', email: 'carmen.rivera@gmail.com' },
  { id: 'theo', name: 'Theo Laurent', email: 'theo@studio-laurent.fr' },
  { id: 'nook', name: 'Nook', email: 'orders@nook.shop' },
  { id: 'tempo', name: 'Tempo', email: 'no-reply@tempo.fm' },
  { id: 'skyway', name: 'Skyway Airlines', email: 'bookings@skyway.com' },
  { id: 'm3ui', name: 'm3ui-vue', email: 'releases@m3ui.dev' },
  { id: 'gitbot', name: 'Northwind CI', email: 'ci@northwind.io' },
  { id: 'calendar', name: 'Calendar', email: 'calendar@northwind.io' },
  { id: 'bank', name: 'Harbor Bank', email: 'alerts@harborbank.com' },
  { id: 'deals', name: 'MegaDeals', email: 'hello@megadeals.biz' },
]

export const labels: Label[] = [
  { id: 'work', name: 'Work', tone: 'primary' },
  { id: 'personal', name: 'Personal', tone: 'tertiary' },
  { id: 'travel', name: 'Travel', tone: 'success' },
  { id: 'receipts', name: 'Receipts', tone: 'secondary' },
]

const loadedAt = Date.now()
const min = 60_000
const ago = (minutes: number) => loadedAt - minutes * min
const h = 60
const d = 24 * h

// A little landscape "photo": sky gradient, sun, mountains, water.
function photo(seed: number, [sky1, sky2, hill]: [string, string, string]) {
  const sun = 80 + ((seed * 37) % 240)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 560'><defs><linearGradient id='s' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${sky1}'/><stop offset='1' stop-color='${sky2}'/></linearGradient></defs><rect width='800' height='560' fill='url(#s)'/><circle cx='${sun + 300}' cy='${170 + (seed % 3) * 30}' r='60' fill='#fff6d5' fill-opacity='.9'/><path d='M0 380l140-130 110 90 160-170 170 150 90-60 130 110v190H0z' fill='${hill}' fill-opacity='.65'/><path d='M0 420l200-110 150 90 120-60 330 120v100H0z' fill='${hill}'/><rect y='450' width='800' height='110' fill='#1d3557' fill-opacity='.55'/><path d='M0 470h800M60 500h300M420 520h320' stroke='#fff' stroke-opacity='.25' stroke-width='4'/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const p = (...paras: string[]) => paras.map((t) => (t.startsWith('<') ? t : `<p>${t}</p>`)).join('')
let n = 0
const msg = (from: string, to: string[], date: number, html: string, extra: Partial<Message> = {}): Message => ({
  id: `m${++n}`,
  from,
  to,
  date,
  html,
  ...extra,
})
const ME = 'alex@postbox.dev'

export const initialThreads: Thread[] = [
  {
    id: 't-q4',
    subject: 'Q4 roadmap: final draft for review',
    folder: 'inbox',
    labels: ['work'],
    starred: true,
    unread: true,
    important: true,
    messages: [
      msg('maya', [ME, 'jonas@northwind.io'], ago(3 * h), p(
        'Hi both,',
        'Attached is the final draft of the Q4 roadmap. The big changes since last week:',
        '<ul><li>Offline mode moves up to <strong>October</strong></li><li>The billing rewrite is split into two milestones</li><li>We drop the legacy export API at the end of the quarter</li></ul>',
        'Could you leave comments by <strong>Thursday</strong>? I want to share it with the wider team on Friday.',
        'Thanks!<br>Maya',
      ), { cc: ['priya@northwind.io'], attachments: [{ name: 'Q4-roadmap-v3.pdf', size: 1_840_000, kind: 'pdf' }, { name: 'milestones.xlsx', size: 64_000, kind: 'sheet' }] }),
      msg('jonas', [ME, 'maya.chen@northwind.io'], ago(2 * h), p(
        'Looks great. One question on the billing split: does milestone 1 include the invoice PDFs, or is that milestone 2?',
        'Jonas',
      )),
      msg('maya', [ME, 'jonas@northwind.io'], ago(38), p(
        'Milestone 2. Milestone 1 is only the new pricing engine, so nothing changes for customers yet.',
        '@Alex, could you double-check the offline mode estimate? You know that code best.',
      )),
    ],
  },
  {
    id: 't-lisbon',
    subject: 'Lisbon trip 🌊 photos!',
    folder: 'inbox',
    labels: ['personal', 'travel'],
    starred: false,
    unread: true,
    messages: [
      msg('lucia', [ME], ago(5 * h), p(
        'Finally sorting through the photos from Lisbon. These are my favorites, the one from the miradouro at sunset is going on my wall.',
        'Same time next year? I vote Porto 🍷',
        'Lu',
      ), { attachments: [
        { name: 'miradouro-sunset.jpg', size: 2_400_000, kind: 'image', src: photo(1, ['#ff9e7a', '#ffd8a8', '#7b4b6b']) },
        { name: 'tram-28.jpg', size: 1_900_000, kind: 'image', src: photo(4, ['#8ecae6', '#e0f4ff', '#3d5a80']) },
        { name: 'belem-morning.jpg', size: 2_100_000, kind: 'image', src: photo(7, ['#a3c4f3', '#fdf0d5', '#52796f']) },
      ] }),
    ],
  },
  {
    id: 't-ci',
    subject: '[northwind/app] Build failed on main (#4821)',
    folder: 'inbox',
    labels: ['work'],
    starred: false,
    unread: true,
    messages: [
      msg('gitbot', [ME], ago(52), p(
        '<strong>Build #4821 failed</strong> on <code>main</code> after commit <code>a91f3c2</code> (“Cache offline queue in IndexedDB”).',
        '<blockquote>FAIL src/offline/queue.test.ts › replays queued requests in order<br>Expected 3 requests, received 2</blockquote>',
        'You are receiving this because you authored the commit.',
      )),
    ],
  },
  {
    id: 't-standup',
    subject: 'Invitation: Design review @ Wed 10:00 – 11:00',
    folder: 'inbox',
    labels: ['work'],
    starred: false,
    unread: false,
    messages: [
      msg('calendar', [ME], ago(7 * h), p(
        '<strong>Design review: new onboarding</strong>',
        'Wednesday, 10:00 – 11:00 · Room “Fjord” and video call',
        'Organizer: Priya Natarajan<br>Guests: Alex Rivera, Maya Chen, Theo Laurent',
        'Going? <strong>Yes</strong> · Maybe · No',
      ), { attachments: [{ name: 'invite.ics', size: 2_000, kind: 'doc' }] }),
    ],
  },
  {
    id: 't-mom',
    subject: 'Sunday lunch',
    folder: 'inbox',
    labels: ['personal'],
    starred: false,
    unread: false,
    messages: [
      msg('mom', [ME], ago(9 * h), p('Hi sweetie, are you coming on Sunday? Your aunt is bringing the flan. Let me know if you’re bringing someone so I make enough!', 'Love, Mom')),
      msg('me', ['carmen.rivera@gmail.com'], ago(8 * h), p('Of course! Just me this time. Should I bring anything?')),
      msg('mom', [ME], ago(6 * h), p('Just yourself. And maybe bread from that bakery you like 🥖')),
    ],
  },
  {
    id: 't-nook',
    subject: 'Your Nook order #10482 has shipped',
    folder: 'inbox',
    labels: ['receipts'],
    starred: false,
    unread: false,
    messages: [
      msg('nook', [ME], ago(1 * d + 2 * h), p(
        'Good news: your order is on its way!',
        '<ul><li>Stoneware mug, Sage × 2</li><li>Linen tote, Natural × 1</li></ul>',
        'Estimated delivery: <strong>Friday</strong>. Track it any time from your account.',
        'Thanks for shopping with Nook.',
      ), { attachments: [{ name: 'receipt-10482.pdf', size: 88_000, kind: 'pdf' }] }),
    ],
  },
  {
    id: 't-theo',
    subject: 'Illustrations for the onboarding screens',
    folder: 'inbox',
    labels: ['work'],
    starred: true,
    unread: false,
    messages: [
      msg('theo', [ME], ago(1 * d + 5 * h), p(
        'Hello Alex,',
        'Here are the first sketches for the three onboarding screens. I kept the palette close to your brand colors but softer. Tell me what you think before I move on to the final versions.',
        'Best,<br>Theo',
      ), { attachments: [
        { name: 'onboarding-1.png', size: 840_000, kind: 'image', src: photo(2, ['#cdb4db', '#ffc8dd', '#6d597a']) },
        { name: 'onboarding-2.png', size: 910_000, kind: 'image', src: photo(5, ['#bde0fe', '#e9f5db', '#457b9d']) },
        { name: 'sketches.zip', size: 12_400_000, kind: 'zip' },
      ] }),
    ],
  },
  {
    id: 't-m3ui',
    subject: 'm3ui-vue 0.8.7 is out: MWindow, adaptive layouts and more',
    folder: 'inbox',
    labels: [],
    starred: false,
    unread: false,
    messages: [
      msg('m3ui', [ME], ago(1 * d + 9 * h), p(
        '<h2>What’s new in 0.8.7</h2>',
        '<ul><li><strong>MWindow</strong>: draggable, resizable desktop-style windows with snapping</li><li><strong>MListDetail</strong> and <strong>MSupportingPane</strong>: adaptive layouts that follow their own size</li><li>Springs everywhere: bottom and side sheets now slide in with real physics</li></ul>',
        'Read the full changelog at <a href="https://m3ui.dev/changelog">m3ui.dev/changelog</a>.',
      )),
    ],
  },
  {
    id: 't-sam',
    subject: 'Climbing on Saturday?',
    folder: 'inbox',
    labels: ['personal'],
    starred: false,
    unread: false,
    messages: [
      msg('sam', [ME], ago(2 * d), p('Gym opens at 9, I’m thinking 10:30 so we can grab breakfast first. You in? The new routes on the overhang look brutal 😅')),
    ],
  },
  {
    id: 't-flight',
    subject: 'Booking confirmed: MAD → LIS, 14 Nov',
    folder: 'inbox',
    labels: ['travel', 'receipts'],
    starred: true,
    unread: false,
    messages: [
      msg('skyway', [ME], ago(2 * d + 4 * h), p(
        'Your booking reference is <strong>K7Q2ZP</strong>.',
        '<strong>SK 1482</strong> · Madrid (MAD) 08:35 → Lisbon (LIS) 08:55 · Seat 14A',
        'Check-in opens 24 hours before departure. Have a great trip!',
      ), { attachments: [{ name: 'boarding-pass-K7Q2ZP.pdf', size: 230_000, kind: 'pdf' }] }),
    ],
  },
  {
    id: 't-tempo',
    subject: 'Your Tempo Premium receipt',
    folder: 'inbox',
    labels: ['receipts'],
    starred: false,
    unread: false,
    messages: [
      msg('tempo', [ME], ago(3 * d), p('Thanks for listening! Here’s your receipt for this month.', '<strong>Tempo Premium Individual</strong> · $9.99', 'Your next payment is on the 14th of next month.')),
    ],
  },
  {
    id: 't-priya',
    subject: 'Re: Accessibility audit results',
    folder: 'inbox',
    labels: ['work'],
    starred: false,
    unread: false,
    messages: [
      msg('me', ['priya@northwind.io'], ago(4 * d), p('Hi Priya, did the audit agency send their report yet? I’d like to plan the fixes for next sprint.')),
      msg('priya', [ME], ago(3 * d + 6 * h), p(
        'They did! Overall good, but 3 blockers:',
        '<ol><li>Focus is lost after closing the settings dialog</li><li>Chart colors fail contrast in dark mode</li><li>The date picker can’t be used with a keyboard</li></ol>',
        'Full report attached. Happy to pair on the focus one.',
      ), { attachments: [{ name: 'a11y-report.pdf', size: 3_200_000, kind: 'pdf' }] }),
    ],
  },
  {
    id: 't-bank',
    subject: 'Your monthly statement is ready',
    folder: 'inbox',
    labels: [],
    starred: false,
    unread: false,
    messages: [msg('bank', [ME], ago(5 * d), p('Your statement for last month is now available in online banking. For your security, we never send statements as attachments.'))],
  },
  {
    id: 't-lucia-book',
    subject: 'That book I told you about',
    folder: 'inbox',
    labels: ['personal'],
    starred: false,
    unread: false,
    messages: [msg('lucia', [ME], ago(6 * d), p('It’s called <em>The Overstory</em>. Took me a while to get into but now I can’t stop. Tell me when you start it!'))],
  },
  {
    id: 't-maya-1on1',
    subject: '1:1 notes',
    folder: 'inbox',
    labels: ['work'],
    starred: false,
    unread: false,
    messages: [msg('maya', [ME], ago(8 * d), p('Quick notes from today:', '<ul><li>You’ll lead the offline mode project</li><li>Conference talk: submit the abstract by the 30th</li><li>Next 1:1 in two weeks</li></ul>'))],
  },
  // Snoozed: comes back later.
  {
    id: 't-renew',
    subject: 'Reminder: renew your passport',
    folder: 'inbox',
    labels: ['travel'],
    starred: false,
    unread: false,
    snoozedUntil: loadedAt + 3 * d * min,
    messages: [msg('me', [ME], ago(10 * d), p('Note to self: passport expires in March. Book the appointment!'))],
  },
  // Sent
  {
    id: 't-sent-theo',
    subject: 'Contract for the illustrations',
    folder: 'sent',
    labels: ['work'],
    starred: false,
    unread: false,
    messages: [msg('me', ['theo@studio-laurent.fr'], ago(9 * d), p('Hi Theo, please find the signed contract attached. Looking forward to working together!', 'Alex'), { attachments: [{ name: 'contract-signed.pdf', size: 410_000, kind: 'pdf' }] })],
  },
  // Archive
  {
    id: 't-old-offsite',
    subject: 'Offsite agenda',
    folder: 'archive',
    labels: ['work'],
    starred: false,
    unread: false,
    messages: [msg('jonas', [ME], ago(14 * d), p('Agenda for the offsite is in the shared folder. Bring comfortable shoes, there’s a hike on day 2.'))],
  },
  // Spam
  {
    id: 't-spam',
    subject: 'CONGRATULATIONS!!! You won a FREE cruise 🛳️',
    folder: 'spam',
    labels: [],
    starred: false,
    unread: true,
    messages: [msg('deals', [ME], ago(4 * h), p('Click here to claim your prize before it expires in 10 minutes!!!'))],
  },
]

/** Mail that "arrives" when you refresh, one at a time. */
export const incoming: Array<Omit<Thread, 'messages'> & { message: Omit<Message, 'id' | 'date'> }> = [
  { id: 'in-1', subject: 'Re: Q4 roadmap: final draft for review', folder: 'inbox', labels: ['work'], starred: false, unread: true, message: { from: 'priya', to: [ME], html: p('Left a few comments on the PDF. Mostly small stuff, the plan looks solid 👍') } },
  { id: 'in-2', subject: 'Your Nook order was delivered', folder: 'inbox', labels: ['receipts'], starred: false, unread: true, message: { from: 'nook', to: [ME], html: p('Your package was left at the front door. Enjoy your new things!') } },
  { id: 'in-3', subject: 'Porto?? 🍷', folder: 'inbox', labels: ['personal', 'travel'], starred: false, unread: true, message: { from: 'lucia', to: [ME], html: p('Flights in May are super cheap right now. Just saying.') } },
  { id: 'in-4', subject: '[northwind/app] Build fixed on main (#4823)', folder: 'inbox', labels: ['work'], starred: false, unread: true, message: { from: 'gitbot', to: [ME], html: p('Build <strong>#4823</strong> passed on <code>main</code>. Nice work.') } },
]

/** What contacts answer when you write to them. */
export const replies: Record<string, string[]> = {
  default: ['Thanks, got it!', 'Sounds good to me 👍', 'Perfect, thank you. I’ll take a look and get back to you.'],
  mom: ['Got it, sweetie ❤️', 'Okay! Don’t forget your jacket, it’s getting cold.'],
  sam: ['Haha deal. See you there 🧗', 'Yesss. Bring chalk, I lost mine.'],
  lucia: ['Love it!! 😍', 'Omg yes. Let’s plan it this weekend.'],
  maya: ['Thanks Alex, that helps a lot.', 'Great, I’ll update the doc.'],
  jonas: ['👍 makes sense.', 'Cool, thanks for the quick answer.'],
  priya: ['Perfect, let’s pair on Thursday then.', 'Thanks! Adding it to the board.'],
  theo: ['Merci Alex! I’ll send the finals next week.', 'Noted, thank you!'],
}
