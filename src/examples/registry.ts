import type { Component } from 'vue'

/**
 * Full-screen example apps. Each one lives in its own folder under src/examples/<id>/ and is
 * self-contained (its own components, state and README), so it can be read on GitHub on its
 * own. They render outside the docs layout (see `meta.fullscreen` in router.ts / App.vue).
 */
export interface ExampleApp {
  id: string
  title: string
  description: string
  icon: string
  /** Components it showcases, for the gallery card. */
  uses: string[]
  component: () => Promise<{ default: Component }>
}

export const SOURCE_BASE = 'https://github.com/SrWither/m3ui-vue-docs/tree/main/src/examples'

export const examples: ExampleApp[] = [
  {
    id: 'desktop',
    title: 'Desktop',
    description:
      'A desktop environment in the browser: icons, a taskbar with a start menu and clock, and real apps in windows you can drag, snap to the edges, maximize and minimize.',
    icon: 'desktop_windows',
    uses: ['MWindow', 'MKanban', 'MCalendar', 'MSlider', 'MSegmentedButton', 'MShape', 'useTheme', 'useColorPalette'],
    component: () => import('./desktop/DesktopExample.vue'),
  },
  {
    id: 'chat',
    title: 'Chat',
    description:
      'A messaging app: chats with unread counts and search, conversations with photos and voice notes, and contacts that read, type and record audio back. Phone-first, side by side on wide screens.',
    icon: 'forum',
    uses: ['MListDetail', 'MChatBubble', 'MEmojiSelector', 'MLightbox', 'MMenu', 'MRelativeTime', 'MChip', 'useToast'],
    component: () => import('./chat/ChatExample.vue'),
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description:
      'Store analytics: key numbers with trends, revenue over time against the previous period, sales by channel and country, and full order and customer tables with search, sorting, selection and CSV export. Ctrl+K opens a command palette.',
    icon: 'monitoring',
    uses: ['MChart', 'MDataTable', 'MStatCard', 'MNavigationSuite', 'MDateRangePicker', 'MCommandPalette', 'MExportButton', 'MSegmentedButton'],
    component: () => import('./dashboard/DashboardExample.vue'),
  },
  {
    id: 'music',
    title: 'Music',
    description:
      'A music streaming app whose songs really play, generated live with the Web Audio API: home shelves, search, albums, artists, your library and playlists, a queue you reorder by dragging, and a full-screen player with a visualizer.',
    icon: 'headphones',
    uses: ['MShortNavigationBar', 'MSlider', 'MDragDropList', 'MBottomSheet', 'MContextMenu', 'MMenu', 'MList', 'MChip', 'MDialog', 'MEmptyState', 'useToast'],
    component: () => import('./music/MusicExample.vue'),
  },
  {
    id: 'mail',
    title: 'Mail',
    description:
      'An email client: folders, labels and search, conversations with attachments, bulk actions with undo, snooze, swipe to archive and pull to refresh on phones, a rich-text composer with scheduled send, contacts that write back, and Gmail-style keyboard shortcuts.',
    icon: 'mail',
    uses: ['MRichTextEditor', 'MNavigationDrawer', 'MPullToRefresh', 'MMultiAutocomplete', 'MSplitButton', 'MDatePicker', 'MTimePicker', 'MLightbox', 'MKbd', 'useToast'],
    component: () => import('./mail/MailExample.vue'),
  },
  {
    id: 'forge',
    title: 'Forge',
    description:
      'A code hosting site that browses the real source of these examples: a file tree beside the code, rendered READMEs, edits you commit or propose as pull requests with a diff, issues with labels and comments, a merge box, and CI runs with live logs in a terminal.',
    icon: 'deployed_code',
    uses: ['MTree', 'MCodeEditor', 'MMarkdown', 'MSplitter', 'MTabs', 'MTimeline', 'MTerminal', 'MJsonViewer', 'MSpotlightSearch', 'MMultiSelect', 'MSplitButton', 'MCopyButton'],
    component: () => import('./forge/ForgeExample.vue'),
  },
  {
    id: 'feed',
    title: 'Plaza',
    description:
      'A social feed: a timeline that refreshes when you pull and loads more as you scroll, stories, posts with photos and polls, likes with a double tap, an endless photo wall, profiles, replies, notifications and a composer with a character ring.',
    icon: 'forum',
    uses: ['MInfiniteScroll', 'MPullToRefresh', 'MMasonry', 'MNavigationSuite', 'MCircleProgressBar', 'MProgressBar', 'MToggleButton', 'MSkeleton', 'MLightbox', 'MEmojiButton', 'MTabs', 'useToast'],
    component: () => import('./feed/PlazaExample.vue'),
  },
  {
    id: 'travel',
    title: 'Travel',
    description:
      'A travel app for finding places and planning trips: full-screen stories, a hero carousel and rows of destinations to swipe through, destination pages, a trip planner with dates and interests, a day-by-day itinerary, and a boarding pass you check in to.',
    icon: 'travel_explore',
    uses: ['MCarousel', 'MSearchBar', 'MTopAppBar', 'MNavigationBar', 'MNavigationRail', 'MFabMenu', 'MScheduler', 'MDateRangePickerModal', 'MTagInput', 'MPinInput', 'MTour', 'MConfirmDialog'],
    component: () => import('./travel/TravelExample.vue'),
  },
  {
    id: 'photo',
    title: 'Photo editor',
    description:
      'A photo editor with a menu bar, right-click menus and toolbars: light and color adjustments with a histogram, filters, crop and straighten, layers you paint, write and put stickers on, an undo history and export. Phone-first modes on small screens.',
    icon: 'photo_filter',
    uses: ['MMenu', 'MContextMenu', 'MToolbar', 'MSlider', 'MTabs', 'MDragDropList', 'MSplitButton', 'MSegmentedButton', 'MColorPickerModal', 'MEmojiSelector', 'MFileUpload', 'MHotkeys', 'MKbd'],
    component: () => import('./photo/PhotoExample.vue'),
  },
  {
    id: 'store',
    title: 'Store',
    description:
      'A home-goods shop from browsing to checkout: a hero carousel, filters beside the grid (in a sheet on phones), product pages with a gallery and reviews, a cart with coupons, and a four-step checkout with validated forms.',
    icon: 'storefront',
    uses: ['MStepper', 'MTextField', 'MMaskField', 'MSelect', 'MRadioGroup', 'MSimpleCarousel', 'MSupportingPane', 'MSideSheet', 'MLightbox', 'MRating', 'MResult'],
    component: () => import('./store/StoreExample.vue'),
  },
  {
    id: 'flick',
    title: 'Flick',
    description:
      'A video site whose videos really play, each one a live shader: a home grid with topics and Shorts, a player with seek previews, speed, quality, theater and full screen, comments, a mini player you swipe away, vertical Shorts, channels, search and your playlists.',
    icon: 'smart_display',
    uses: ['MShader', 'MNavigationDrawer', 'MShortNavigationBar', 'MSearchBar', 'MSlider', 'MMenu', 'MButtonGroup', 'MCarousel', 'MSwipeToDismiss', 'MAspectRatio', 'MBottomSheet', 'MQRCode', 'usePageProgress'],
    component: () => import('./flick/FlickExample.vue'),
  },
]

export const exampleSource = (id: string) => `${SOURCE_BASE}/${id}`
