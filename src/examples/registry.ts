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
]

export const exampleSource = (id: string) => `${SOURCE_BASE}/${id}`
