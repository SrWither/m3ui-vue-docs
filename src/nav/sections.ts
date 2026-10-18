import type { DrawerSection, DrawerItem, SpotlightResult } from '@m3ui-vue/m3ui-vue'
import { examples } from '@/examples/registry'

export const iconMap: Record<string, string> = {
  MScrollField: 'swipe_vertical', MDragHandle: 'drag_handle', MSwipeToDismiss: 'swipe_left', MTransition: 'animation', MButton: 'smart_button', MIconButton: 'touch_app', MFab: 'add_circle', MFabMenu: 'apps',MSplitButton: 'call_split', MButtonGroup: 'view_week', MSegmentedButton: 'toggle_on', MToggleButton: 'change_circle', MCopyButton: 'content_copy', MExportButton: 'file_download',
  MTextField: 'edit', MSelect: 'arrow_drop_down_circle', MMultiSelect: 'checklist', MAutocomplete: 'search', MMultiAutocomplete: 'filter_list', MTagInput: 'sell', MCheckbox: 'check_box', MSwitch: 'toggle_on',
  MRadioGroup: 'radio_button_checked', MSlider: 'tune', MRating: 'star_half', MDatePicker: 'calendar_today',
  MDatePickerModal: 'event', MDateRangePickerModal: 'date_range',
  MTimePicker: 'schedule', MTimePickerModal: 'schedule', MTimeScroll: 'more_time',
  MColorPicker: 'palette', MColorPickerModal: 'palette',
  MAlert: 'warning', useToast: 'chat_bubble', useNotification: 'notifications_active',
  MDialog: 'open_in_new', MConfirmDialog: 'help', MTooltip: 'info',
  MProgressBar: 'linear_scale', MPageProgress: 'route', MCircleProgressBar: 'donut_large', MSpinner: 'progress_activity', MLoadingIndicator: 'blur_on', MPullToRefresh: 'swipe_down_alt', MExpansionPanel: 'expand_more',
  MCard: 'crop_square', MChip: 'label', MBadge: 'notifications', MAvatar: 'account_circle',
  MIcon: 'emoji_symbols', MDivider: 'horizontal_rule', MStatCard: 'analytics', MTimeline: 'timeline',
  MSkeleton: 'rectangle', MEmptyState: 'inbox', MTree: 'account_tree', MList: 'list',
  MEmoji: 'sentiment_satisfied', MEmojiButton: 'add_reaction', MEmojiSelector: 'emoji_emotions',
  MTabs: 'tab', MMenu: 'menu', MContextMenu: 'more_vert', MBreadcrumbs: 'chevron_right',
  MStepper: 'format_list_numbered', MPagination: 'last_page', MNavigationBar: 'bottom_navigation', MShortNavigationBar: 'dock_to_bottom',
  MNavigationDrawer: 'side_navigation', MNavigationRail: 'dock_to_left',
  MToolbar: 'toolbar', MTopAppBar: 'web_asset', MSearchBar: 'search', MAppBarWithSearch: 'manage_search',
  MContainer: 'crop_free', MGrid: 'grid_view', MStack: 'view_agenda', MFlex: 'view_stream',
  MSpacer: 'space_bar', MCenter: 'center_focus_strong', MBox: 'check_box_outline_blank',
  MSplitter: 'vertical_split', MMasonry: 'dashboard', MAppLayout: 'view_sidebar', useWindowSizeClass: 'devices', MNavigationSuite: 'responsive_layout', MListDetail: 'view_list', MSupportingPane: 'view_column_2',
  MScrollable: 'swap_vert', MFullscreen: 'fullscreen', MOverlay: 'filter_none',
  MText: 'text_fields', MTitle: 'title', MSubtitle: 'subtitles', MKbd: 'keyboard', MSection: 'view_day',
  MResponsive: 'devices', MRelative: 'photo_size_select_large', MSticky: 'push_pin',
  MAbsolute: 'open_with', MAspectRatio: 'aspect_ratio', MShape: 'interests', MFixed: 'picture_in_picture', MFooter: 'call_to_action',
  MResult: 'check_circle', MDateRangePicker: 'date_range', MAppBar: 'web', MBottomAppBar: 'bottom_navigation',
  MNumberField: 'pin', MMaskField: 'password', MPinInput: 'dialpad', MPasswordMeter: 'security', MSignaturePad: 'draw', MRelativeTime: 'schedule', MQRCode: 'qr_code_2', MBarcode: 'barcode', MCarousel: 'view_carousel', MSimpleCarousel: 'view_carousel',
  MChatBubble: 'chat_bubble', MBottomSheet: 'drag_handle', MBottomSheetScaffold: 'vertical_split', MSideSheet: 'dock_to_right', MLoadingOverlay: 'hourglass_top', MWindow: 'picture_in_picture', MBar: 'web_asset',
  MTable: 'table_chart', MDataTable: 'table_view', MTreeTable: 'account_tree', MVirtualTable: 'view_list',
  MFileUpload: 'upload_file', MDragDropList: 'drag_indicator', MTransferList: 'swap_horiz',
  MHotkeys: 'keyboard', MInfiniteScroll: 'all_inclusive', MTour: 'tour', useDevice: 'devices',
  MCodeEditor: 'code', MJsonEditor: 'data_object', MJsonViewer: 'data_array',
  MMarkdown: 'article', MTerminal: 'terminal', MRichTextEditor: 'format_bold',
  MCalendar: 'calendar_month', MScheduler: 'event_note', MKanban: 'view_kanban',
  MCommandPalette: 'keyboard_command_key', MSpotlightSearch: 'search', MChart: 'bar_chart', MShader: 'gradient',
  useTheme: 'dark_mode', useColorPalette: 'palette', useLocale: 'translate', usePageProgress: 'route', useDebounce: 'timer', useSpring: 'animation', useFieldBg: 'format_color_fill',
  'v-ripple': 'touch_app',
}

// Top-level groups outside Components (Composables, Directives): one page per entry under
// src/pages/<group>/<name>.vue, routed at /<group>/<lowercased name>.
export const composableNames = ['useTheme', 'useColorPalette', 'useLocale', 'useToast', 'useNotification', 'usePageProgress', 'useWindowSizeClass', 'useDevice', 'useDebounce', 'useSpring', 'useFieldBg']
export const directiveNames = ['v-ripple']

function pages(base: string, names: string[]): DrawerItem[] {
  return names.map(n => ({ value: `${base}/${n.toLowerCase()}`, label: n, icon: iconMap[n] ?? 'code', to: `${base}/${n.toLowerCase()}` }))
}

// Sections migrated to the new one-page-per-component structure (real routes,
// e.g. /components/buttons/mbutton). Everything else still lives as anchored
// sections on one big page per category (#mbutton) until it gets migrated —
// add a section's base path here once its components/<section>/*.vue pages
// exist, so its sidebar children stop pointing at hash anchors that no
// longer have a matching heading.
const migratedSections = new Set(['/components/buttons', '/components/tables', '/components/feedback', '/components/editors', '/components/overlays', '/components/utility', '/components/advanced', '/components/navigation', '/components/inputs', '/components/layout', '/components/data-display'])

function ch(base: string, names: string[]): DrawerItem[] {
  const separator = migratedSections.has(base) ? '/' : '#'
  return names.map(n => ({
    value: `${base}${separator}${n.toLowerCase().replace(/[&\s]+/g, '-')}`,
    label: n,
    icon: iconMap[n] ?? 'code',
    to: `${base}${separator}${n.toLowerCase().replace(/[&\s]+/g, '-')}`,
  }))
}

export const sections: DrawerSection[] = [
  {
    title: 'Getting Started',
    icon: 'rocket_launch',
    collapsible: true,
    items: [
      { value: '/', label: 'Introduction', icon: 'home', to: '/' },
      { value: '/about', label: 'About', icon: 'info', to: '/about' },
      { value: '/getting-started/setup', label: 'Setup', icon: 'build', to: '/getting-started/setup' },
      { value: '/getting-started/i18n', label: 'i18n', icon: 'translate', to: '/getting-started/i18n' },
    ],
  },
  {
    title: 'Components',
    icon: 'widgets',
    collapsible: true,
    items: [
      { value: '/components/buttons', label: 'Buttons', icon: 'smart_button', to: '/components/buttons',
        children: ch('/components/buttons', ['MButton', 'MIconButton', 'MFab', 'MFabMenu', 'MSplitButton', 'MButtonGroup', 'MSegmentedButton', 'MToggleButton', 'MCopyButton', 'MExportButton']) },
      { value: '/components/inputs', label: 'Inputs', icon: 'input', to: '/components/inputs',
        children: ch('/components/inputs', ['MTextField', 'MNumberField', 'MMaskField', 'MPinInput', 'MPasswordMeter', 'MSignaturePad', 'MSelect', 'MMultiSelect', 'MAutocomplete', 'MMultiAutocomplete', 'MTagInput', 'MCheckbox', 'MSwitch', 'MRadioGroup', 'MSlider', 'MScrollField', 'MRating', 'MDatePicker', 'MDatePickerModal', 'MDateRangePicker', 'MDateRangePickerModal', 'MTimePicker', 'MTimePickerModal', 'MTimeScroll', 'MColorPicker', 'MColorPickerModal']) },
      { value: '/components/feedback', label: 'Feedback', icon: 'feedback', to: '/components/feedback',
        children: ch('/components/feedback', ['MAlert', 'MDialog', 'MConfirmDialog', 'MTooltip', 'MProgressBar', 'MPageProgress', 'MCircleProgressBar', 'MSpinner', 'MLoadingIndicator', 'MPullToRefresh', 'MExpansionPanel']) },
      { value: '/components/data-display', label: 'Data Display', icon: 'dashboard', to: '/components/data-display',
        children: ch('/components/data-display', ['MCard', 'MChip', 'MBadge', 'MAvatar', 'MIcon', 'MDivider', 'MStatCard', 'MTimeline', 'MSkeleton', 'MEmptyState', 'MResult', 'MTree', 'MList', 'MEmoji', 'MEmojiButton', 'MEmojiSelector', 'MCarousel', 'MSimpleCarousel', 'MLightbox', 'MChatBubble', 'MRelativeTime']) },
      { value: '/components/navigation', label: 'Navigation', icon: 'menu_open', to: '/components/navigation',
        children: ch('/components/navigation', ['MTabs', 'MMenu', 'MContextMenu', 'MBreadcrumbs', 'MStepper', 'MPagination', 'MNavigationBar', 'MShortNavigationBar', 'MNavigationDrawer', 'MNavigationRail', 'MToolbar', 'MTopAppBar', 'MBottomAppBar', 'MSearchBar', 'MAppBarWithSearch', 'MAppBar']) },
      { value: '/components/layout', label: 'Layout', icon: 'grid_view', to: '/components/layout',
        children: ch('/components/layout', ['MContainer', 'MGrid', 'MStack', 'MSplitter', 'MDragHandle', 'MMasonry', 'MText', 'MTitle', 'MSubtitle', 'MKbd', 'MFlex', 'MSpacer', 'MCenter', 'MBox', 'MSection', 'MResponsive', 'MRelative', 'MAbsolute', 'MFixed', 'MSticky', 'MScrollable', 'MAspectRatio', 'MShape', 'MAppLayout', 'MNavigationSuite', 'MListDetail', 'MSupportingPane', 'MFooter', 'MOverlay', 'MFullscreen']) },
      { value: '/components/overlays', label: 'Overlays', icon: 'layers', to: '/components/overlays',
        children: ch('/components/overlays', ['MBottomSheet', 'MBottomSheetScaffold', 'MSideSheet', 'MLoadingOverlay', 'MWindow', 'MBar']) },
      { value: '/components/tables', label: 'Tables', icon: 'table_chart', to: '/components/tables',
        children: ch('/components/tables', ['MTable', 'MDataTable', 'MTreeTable', 'MVirtualTable']) },
      { value: '/components/utility', label: 'Utility', icon: 'build', to: '/components/utility',
        children: ch('/components/utility', ['MFileUpload', 'MDragDropList', 'MSwipeToDismiss', 'MTransferList', 'MTransition', 'MHotkeys', 'MInfiniteScroll', 'MTour']) },
      { value: '/components/editors', label: 'Editors', icon: 'code', to: '/components/editors',
        children: ch('/components/editors', ['MCodeEditor', 'MJsonEditor', 'MJsonViewer', 'MMarkdown', 'MTerminal', 'MRichTextEditor']) },
      { value: '/components/advanced', label: 'Advanced', icon: 'auto_awesome', to: '/components/advanced',
        children: ch('/components/advanced', ['MCalendar', 'MScheduler', 'MKanban', 'MCommandPalette', 'MSpotlightSearch', 'MChart', 'MShader', 'MQRCode', 'MBarcode']) },
    ],
  },
  {
    title: 'Composables',
    icon: 'function',
    collapsible: true,
    items: [
      { value: '/composables', label: 'All composables', icon: 'apps', to: '/composables' },
      ...pages('/composables', composableNames),
    ],
  },
  {
    title: 'Directives',
    icon: 'bolt',
    collapsible: true,
    items: [
      { value: '/directives', label: 'All directives', icon: 'apps', to: '/directives' },
      ...pages('/directives', directiveNames),
    ],
  },
  {
    title: 'Styles',
    icon: 'palette',
    collapsible: true,
    items: [
      { value: '/styles/palettes', label: 'Palettes', icon: 'color_lens', to: '/styles/palettes' },
      { value: '/styles/colors', label: 'Colors', icon: 'format_color_fill', to: '/styles/colors' },
      { value: '/styles/typography', label: 'Typography', icon: 'text_fields', to: '/styles/typography' },
      { value: '/styles/shapes', label: 'Shapes', icon: 'rounded_corner', to: '/styles/shapes' },
      { value: '/styles/motion', label: 'Motion', icon: 'motion_mode', to: '/styles/motion' },
      { value: '/styles/palette-builder', label: 'Palette Builder', icon: 'auto_fix_high', to: '/styles/palette-builder' },
    ],
  },
  {
    title: 'Examples',
    icon: 'design_services',
    collapsible: true,
    items: [
      { value: '/examples', label: 'All examples', icon: 'apps', to: '/examples' },
      ...examples.map((e) => ({ value: `/examples/${e.id}`, label: e.title, icon: e.icon, to: `/examples/${e.id}` })),
    ],
  },
  {
    title: 'More',
    icon: 'info',
    collapsible: true,
    items: [
      { value: '/changelog', label: 'Changelog', icon: 'history', to: '/changelog' },
    ],
  },
]

// Flattened, in order, from just the Components section's per-component
// entries — used by ComponentPager for Prev/Next links. Derived from the
// same `sections` the sidebar renders, so it can't drift out of sync.
export const componentPageOrder: { name: string; to: string; section: string }[] =
  sections
    .find((s) => s.title === 'Components')!
    .items.flatMap((item) =>
      (item.children ?? []).map((child) => ({
        name: child.label,
        to: String(child.to),
        section: item.label,
      })),
    )

// Prev/Next order inside each top-level group (overview item excluded), same shape as componentPageOrder.
export const groupPageOrders: { name: string; to: string; section: string }[][] =
  (['Composables', 'Directives'] as const).map((title) =>
    sections
      .find((s) => s.title === title)!
      .items.slice(1)
      .map((item) => ({ name: item.label, to: String(item.to), section: title })),
  )

// Flattened once from the same `sections` the sidebar renders, so search
// results and the nav tree can never drift out of sync with each other.
export const searchIndex: SpotlightResult[] = sections.flatMap((section) =>
  section.items.flatMap((item): SpotlightResult[] => {
    const own: SpotlightResult = {
      id: String(item.to ?? item.value),
      title: item.label,
      icon: item.icon,
      category: section.title,
    }
    if (!item.children?.length) return [own]
    const children = item.children.map((child): SpotlightResult => ({
      id: String(child.to ?? child.value),
      title: child.label,
      icon: child.icon,
      category: item.label,
    }))
    return [own, ...children]
  }),
)
