<script setup lang="ts">
import { computed, watch, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { MNavigationDrawer, MIcon, MIconButton, MFlex } from '@m3ui-vue/m3ui-vue'
import type { DrawerSection, DrawerItem } from '@m3ui-vue/m3ui-vue'

defineProps<{ expanded?: boolean; drawerOpen?: boolean }>()
defineEmits<{ toggle: []; drawerClose: [] }>()

const route = useRoute()
const selected = computed(() => route.hash ? route.path + route.hash : route.path)
const desktopDrawer = ref<InstanceType<typeof MNavigationDrawer>>()
const mobileDrawer = ref<InstanceType<typeof MNavigationDrawer>>()

function syncDrawer(drawer: InstanceType<typeof MNavigationDrawer> | undefined, path: string) {
  const oi = drawer?.openItems
  if (!oi) return
  for (const key of Object.keys(oi)) oi[key] = false
  const allItems = sections.flatMap(s => s.items)
  const match = allItems.find(i => i.children?.length && i.value === path)
  if (match) oi[match.value] = true
}

watch(() => route.path, (path) => {
  nextTick(() => {
    syncDrawer(desktopDrawer.value, path)
    syncDrawer(mobileDrawer.value, path)
  })
}, { immediate: true })

const iconMap: Record<string, string> = {
  MButton: 'smart_button', MIconButton: 'touch_app', MFab: 'add_circle', MSegmentedButton: 'toggle_on',
  MTextField: 'edit', MSelect: 'arrow_drop_down_circle', MMultiSelect: 'checklist', MCheckbox: 'check_box',
  MRadioGroup: 'radio_button_checked', MSlider: 'tune', MRating: 'star_half', MDatePicker: 'calendar_today',
  MTimePicker: 'schedule', MColorPicker: 'palette',
  MAlert: 'warning', MDialog: 'open_in_new', MConfirmDialog: 'help', MTooltip: 'info',
  MProgressBar: 'linear_scale', MSpinner: 'progress_activity', MExpansionPanel: 'expand_more',
  MCard: 'crop_square', MChip: 'label', MBadge: 'notifications', MAvatar: 'account_circle',
  MIcon: 'emoji_symbols', MDivider: 'horizontal_rule', MStatCard: 'analytics', MTimeline: 'timeline',
  MSkeleton: 'rectangle', MEmptyState: 'inbox', MTree: 'account_tree', MList: 'list',
  MEmoji: 'sentiment_satisfied', MEmojiButton: 'add_reaction', MEmojiSelector: 'emoji_emotions',
  MTabs: 'tab', MMenu: 'menu', MContextMenu: 'more_vert', MBreadcrumbs: 'chevron_right',
  MStepper: 'format_list_numbered', MPagination: 'last_page', MNavigationBar: 'bottom_navigation',
  MNavigationDrawer: 'side_navigation', MNavigationRail: 'dock_to_left', MTopAppBar: 'web_asset',
  MContainer: 'crop_free', MGrid: 'grid_view', MStack: 'view_agenda', MFlex: 'view_stream',
  MSpacer: 'space_bar', MCenter: 'center_focus_strong', MBox: 'check_box_outline_blank',
  MSplitter: 'vertical_split', MMasonry: 'dashboard', MAppLayout: 'view_sidebar',
  MScrollable: 'swap_vert', MFullscreen: 'fullscreen', MOverlay: 'filter_none',
  MText: 'text_fields', MTitle: 'title', MSubtitle: 'subtitles', MSection: 'view_day',
  MResponsive: 'devices', MRelative: 'photo_size_select_large', MSticky: 'push_pin',
  MAspectRatio: 'aspect_ratio', MFixed: 'picture_in_picture',
  MResult: 'check_circle', MDateRangePicker: 'date_range', MAppBar: 'web',
  MBottomSheet: 'drag_handle', MSideSheet: 'dock_to_right', MLoadingOverlay: 'hourglass_top',
  MTable: 'table_chart', MDataTable: 'table_view', MTreeTable: 'account_tree', MVirtualTable: 'view_list',
  MFileUpload: 'upload_file', MDragDropList: 'drag_indicator', MTransferList: 'swap_horiz',
  MHotkeys: 'keyboard', MInfiniteScroll: 'all_inclusive', MTour: 'tour',
  MCodeEditor: 'code', MJsonEditor: 'data_object', MJsonViewer: 'data_array',
  MMarkdown: 'article', MTerminal: 'terminal', MRichTextEditor: 'format_bold',
  MCalendar: 'calendar_month', MScheduler: 'event_note', MKanban: 'view_kanban',
  MCommandPalette: 'keyboard_command_key', MSpotlightSearch: 'search', MChart: 'bar_chart',
}

function ch(base: string, names: string[]): DrawerItem[] {
  return names.map(n => ({
    value: `${base}#${n.toLowerCase().replace(/[&\s]+/g, '-')}`,
    label: n,
    icon: iconMap[n] ?? 'code',
    to: `${base}#${n.toLowerCase().replace(/[&\s]+/g, '-')}`,
  }))
}

const sections: DrawerSection[] = [
  {
    title: 'Getting Started',
    icon: 'rocket_launch',
    collapsible: true,
    items: [
      { value: '/', label: 'Introduction', icon: 'home', to: '/' },
      { value: '/getting-started/setup', label: 'Setup', icon: 'build', to: '/getting-started/setup' },
    ],
  },
  {
    title: 'Components',
    icon: 'widgets',
    collapsible: true,
    items: [
      { value: '/components/buttons', label: 'Buttons', icon: 'smart_button', to: '/components/buttons',
        children: ch('/components/buttons', ['MButton', 'MIconButton', 'MFab', 'MSegmentedButton']) },
      { value: '/components/inputs', label: 'Inputs', icon: 'input', to: '/components/inputs',
        children: ch('/components/inputs', ['MTextField', 'MSelect', 'MMultiSelect', 'MCheckbox', 'MRadioGroup', 'MSlider', 'MRating', 'MDatePicker', 'MDateRangePicker', 'MTimePicker', 'MColorPicker']) },
      { value: '/components/feedback', label: 'Feedback', icon: 'feedback', to: '/components/feedback',
        children: ch('/components/feedback', ['MAlert', 'MDialog', 'MConfirmDialog', 'MTooltip', 'MProgressBar', 'MSpinner', 'MExpansionPanel']) },
      { value: '/components/data-display', label: 'Data Display', icon: 'dashboard', to: '/components/data-display',
        children: ch('/components/data-display', ['MCard', 'MChip', 'MBadge', 'MAvatar', 'MIcon', 'MDivider', 'MStatCard', 'MTimeline', 'MSkeleton', 'MEmptyState', 'MResult', 'MTree', 'MList', 'MEmoji', 'MEmojiButton', 'MEmojiSelector']) },
      { value: '/components/navigation', label: 'Navigation', icon: 'menu_open', to: '/components/navigation',
        children: ch('/components/navigation', ['MTabs', 'MMenu', 'MContextMenu', 'MBreadcrumbs', 'MStepper', 'MPagination', 'MNavigationBar', 'MNavigationDrawer', 'MNavigationRail', 'MTopAppBar', 'MAppBar']) },
      { value: '/components/layout', label: 'Layout', icon: 'grid_view', to: '/components/layout',
        children: ch('/components/layout', ['MContainer', 'MGrid', 'MStack', 'MSplitter', 'MMasonry', 'MText', 'MTitle', 'MSubtitle', 'MFlex', 'MSpacer', 'MCenter', 'MBox', 'MSection', 'MResponsive', 'MRelative', 'MSticky', 'MScrollable', 'MAspectRatio', 'MAppLayout', 'MOverlay', 'MFullscreen']) },
      { value: '/components/overlays', label: 'Overlays', icon: 'layers', to: '/components/overlays',
        children: ch('/components/overlays', ['MBottomSheet', 'MSideSheet', 'MLoadingOverlay']) },
      { value: '/components/tables', label: 'Tables', icon: 'table_chart', to: '/components/tables',
        children: ch('/components/tables', ['MTable', 'MDataTable', 'MTreeTable', 'MVirtualTable']) },
      { value: '/components/utility', label: 'Utility', icon: 'build', to: '/components/utility',
        children: ch('/components/utility', ['MFileUpload', 'MDragDropList', 'MTransferList', 'MHotkeys', 'MInfiniteScroll', 'MTour']) },
      { value: '/components/editors', label: 'Editors', icon: 'code', to: '/components/editors',
        children: ch('/components/editors', ['MCodeEditor', 'MJsonEditor', 'MJsonViewer', 'MMarkdown', 'MTerminal', 'MRichTextEditor']) },
      { value: '/components/advanced', label: 'Advanced', icon: 'auto_awesome', to: '/components/advanced',
        children: ch('/components/advanced', ['MCalendar', 'MScheduler', 'MKanban', 'MCommandPalette', 'MSpotlightSearch', 'MChart']) },
    ],
  },
  {
    title: 'Examples',
    icon: 'design_services',
    collapsible: true,
    items: [
      { value: '/examples', label: 'Layouts', icon: 'view_quilt', to: '/examples' },
      { value: '/examples/apps', label: 'Apps', icon: 'devices', to: '/examples/apps' },
    ],
  },
  {
    title: 'Styles',
    icon: 'palette',
    collapsible: true,
    items: [
      { value: '/styles/palettes', label: 'Palettes', icon: 'color_lens', to: '/styles/palettes' },
    ],
  },
]
</script>

<template>
  <!-- Desktop sidebar -->
  <div class="hidden h-full md:flex">
    <MNavigationDrawer
      ref="desktopDrawer"
      :model-value="true"
      :modal="false"
      :collapsed="!expanded"
      :selected="selected"
      :sections="sections"
    >
      <template #header>
        <div class="shrink-0 border-b border-outline-variant">
          <MFlex align="center" class="h-16">
            <div class="flex w-18 shrink-0 justify-center">
              <MIconButton
                :icon="expanded ? 'menu_open' : 'menu'"
                :label="expanded ? 'Collapse' : 'Expand'"
                @click="$emit('toggle')"
              />
            </div>
          </MFlex>
        </div>
      </template>
    </MNavigationDrawer>
  </div>

  <!-- Mobile drawer -->
  <MNavigationDrawer
    ref="mobileDrawer"
    :model-value="drawerOpen ?? false"
    :sections="sections"
    :selected="selected"
    @update:model-value="!$event && $emit('drawerClose')"
  >
    <template #header>
      <MFlex align="center" justify="between" class="px-4 pt-5 pb-2">
        <MFlex align="center" gap="sm">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
            <MIcon name="widgets" :size="18" />
          </span>
          <span class="text-title-medium font-medium text-on-surface">M3UI Docs</span>
        </MFlex>
        <MIconButton icon="close" label="Close menu" @click="$emit('drawerClose')" />
      </MFlex>
    </template>
  </MNavigationDrawer>
</template>
