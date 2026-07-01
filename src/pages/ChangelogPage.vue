<script setup lang="ts">
import { MStack, MFlex, MChip, MIcon, MDivider, MCard } from '@m3ui-vue/m3ui-vue'

interface ChangeEntry {
  added?: string[]
  fixed?: string[]
}

interface Version {
  version: string
  date: string
  changes: ChangeEntry
}

const versions: Version[] = [
  {
    version: '0.5.1',
    date: '2026-07-01',
    changes: {
      fixed: [
        'MContextMenu now closes when the page is scrolled instead of staying anchored to a stale position',
        'Toast and notification duplicate-count badge no longer gets clipped mid-animation when dismissed, and fades out in sync with the item instead of popping off abruptly',
        'MColorPicker and MColorPickerModal: dragging past the saturation/brightness area edge no longer triggers native text selection on the page',
      ],
    },
  },
  {
    version: '0.5.0',
    date: '2026-06-30',
    changes: {
      added: [
        'New component: MMenuDivider — horizontal divider for MMenu and MContextMenu',
        'shortcut prop on MMenuItem — displays a keyboard shortcut label aligned to the right',
        'MContextMenu rewritten to slot-based composition — uses MMenuItem + #children slots like MMenu (removes items prop)',
        'MTreeTable expand/collapse animation — height + opacity transition matching MTree and MExpansionPanel',
        'errorLabel prop on all input components — separates the error message from the boolean error state',
      ],
      fixed: [
        'MSlider range variant: crossing thumbs then clicking near the crossed position caused the wrong thumb to jump',
        'MCircleProgressBar indeterminate: trailing end trembled at minimum arc size — fixed via stroke-dashoffset animation',
        'MAbsolute defaults to top/left 8px when no position props are passed',
        'MWindow corner resize handles enlarged (12→20px) and edges (5→8px) for easier grabbing',
      ],
    },
  },
  {
    version: '0.4.7',
    date: '2026-06-30',
    changes: {
      added: [
        'New component: MCircleProgressBar — animated ring progress with wavy (bumpy wave) and circle (smooth arc) variants',
        'MCircleProgressBar default slot — embed any content centered inside the ring; percentage label hidden automatically',
        'MCircleProgressBar indeterminate state — M3-style spinning arc with subtle grow/shrink breathing animation',
        'thickness prop for MCircleProgressBar and MProgressBar to control stroke width',
        'MProgressBar wavy variant — wave appears smoothly above 10% and fades at 100%, margin animates in sync',
        'Toast and notification deduplication — identical messages show a count badge instead of stacking',
        'icon: null option in useToast and useNotification to suppress the icon entirely',
      ],
      fixed: [
        'MColorPicker and MColorPickerModal: drag not working on mobile (touch-action: none)',
        'MCircleProgressBar: edge gap now scales sub-linearly with thickness to stay proportional',
        'MProgressBar wavy variant: inactive track overlapping wave due to Vue style / rAF conflict',
      ],
    },
  },
  {
    version: '0.4.6',
    date: '2026-06-25',
    changes: {
      fixed: ['Flex1 in drawer modal not filling available height'],
    },
  },
  {
    version: '0.4.5',
    date: '2026-06-25',
    changes: {
      fixed: ['Drawer custom content slot not stretching to use all available space'],
    },
  },
  {
    version: '0.4.4',
    date: '2026-06-24',
    changes: {
      added: ['MNavigationDrawer item click event (@item-click)'],
    },
  },
  {
    version: '0.4.3',
    date: '2026-06-24',
    changes: {
      added: ['Debounced prop for text inputs (MTextField and related)'],
    },
  },
  {
    version: '0.4.2',
    date: '2026-06-24',
    changes: {
      added: ['Dynamic locale switching at runtime'],
      fixed: ['Slider lag on mobile devices'],
    },
  },
  {
    version: '0.4.1',
    date: '2026-06-24',
    changes: {
      fixed: ['Modal variant broken in MAutocomplete and MMultiAutocomplete'],
    },
  },
  {
    version: '0.4.0',
    date: '2026-06-23',
    changes: {
      added: [
        'New component: MSplitButton — button with primary action and dropdown',
        'New component: MButtonGroup — groups related buttons together',
        'New component: MToolbar — horizontal toolbar container',
        'Button size variants: xs, sm, md, lg, xl on MButton and MSplitButton',
        'Ripple effect in MIconButton with size variants',
        'Segmented style variant for list components',
        'Dialog fullscreen variant',
        'Carousel improvements (beta)',
        'Rich tooltip — arbitrary content inside MTooltip',
        'useNotification composable and MNotification component',
        'useDevice composable with device/viewport info',
        'FAB auto-close on scroll',
        'FAB custom expand content via #expand slot',
        'Docked input variant auto-closes on scroll',
        'Modal variant for MDatePicker and MTimePicker',
        'Modal variant for MColorPicker',
        'Modal variant for MSelect, MAutocomplete, MMultiAutocomplete, and MMultiSelect',
        'Improved toast system with richer API',
      ],
      fixed: [
        'Slider centered variant gap',
        'Expansion panel animation regression',
        'MTagInput on mobile',
      ],
    },
  },
  {
    version: '0.3.1',
    date: '2026-06-22',
    changes: {
      added: ['New component: MChatBubble — speech-bubble style message display'],
      fixed: [
        'MWindow clamp-to-content behavior',
        'Touch event handling in MWindow',
        'MWindow vertical resize delay',
      ],
    },
  },
  {
    version: '0.3.0',
    date: '2026-06-21',
    changes: {
      added: [
        'New component: MWindow — draggable and resizable floating window',
        'New component: MMultiAutocomplete — multi-value autocomplete input',
        'MAutocomplete and MTagInput general improvements',
        'hideSelected option in MSelect and MMultiSelect',
        'Expand chips inline in MMultiSelect',
        'Custom value data support in MSelect and MMultiSelect',
      ],
      fixed: [
        'Icons alignment in input fields (outline and filled variants)',
        'MTopAppBar height adjustment',
      ],
    },
  },
  {
    version: '0.2.7',
    date: '2026-06-21',
    changes: {
      added: ['MNavigationDrawer default slot for arbitrary custom content'],
    },
  },
  {
    version: '0.2.6',
    date: '2026-06-21',
    changes: {
      added: ['New header/footer slots in MNavigationDrawer'],
    },
  },
  {
    version: '0.2.5',
    date: '2026-06-21',
    changes: {
      added: [
        'Right drawer support in MAppLayout',
        'Drawer position variants: left, right, top, bottom',
        'MFooter layout component',
        'x / y offset props on MAbsolute and MFixed',
        'Navigation slot in MTopAppBar',
      ],
    },
  },
  {
    version: '0.2.4',
    date: '2026-06-21',
    changes: {
      added: [
        'Configurable width prop on MNavigationDrawer',
        'MAvatar image fallback — shows initials when image fails to load',
      ],
      fixed: ['MAppLayout drawer width not reflecting custom width prop'],
    },
  },
  {
    version: '0.2.3',
    date: '2026-06-21',
    changes: {
      fixed: ['Invisible custom scrollbar in WebKit-based browsers'],
    },
  },
  {
    version: '0.2.2',
    date: '2026-06-21',
    changes: {
      fixed: [
        'Incorrect locale entry keys',
        'Test files incorrectly included in tsconfig compilation',
      ],
    },
  },
  {
    version: '0.2.1',
    date: '2026-06-20',
    changes: {
      added: ['Unit test suite'],
    },
  },
  {
    version: '0.2.0',
    date: '2026-06-20',
    changes: {
      added: [
        'i18n — internationalization with createM3UI({ locale }) and useLocale()',
        'Preset locale bundles (EN, ES, FR, DE, PT, and more)',
        '10 new color palettes',
        'New component: MCarousel — image/content carousel',
        'MDataTable server-side pagination and sorting support',
        'New input types and variants',
        'Children item dividers in MNavigationDrawer with smooth transition',
        'Improved collapsed-variant children rendering in MNavigationDrawer',
      ],
      fixed: [
        'Icons and placeholder alignment in input fields',
        'Input outline icon vertical alignment',
      ],
    },
  },
  {
    version: '0.1.11',
    date: '2026-06-19',
    changes: {
      fixed: ['Excess padding in drawer modal header'],
    },
  },
  {
    version: '0.1.10',
    date: '2026-06-19',
    changes: {
      added: [
        'New components: MEmoji, MEmojiButton, MEmojiSelector',
        'Improved MBadge styling and variants',
        'Improved MMarkdown renderer',
        'MIconButton label is now optional',
      ],
      fixed: [
        'MMarkdown and MRichTextEditor rendering issues',
        'MTour overflow on mobile',
        'MFab click not firing on mobile',
      ],
    },
  },
  {
    version: '0.1.9',
    date: '2026-06-19',
    changes: {
      added: [
        'New display and layout components: MText, MTitle, MSubtitle, MSection, MRelative, MSticky, MCenter, MBox',
        'Improved absolute/fixed positioning components and list layouts',
        'New props in MAppLayout and MFab',
      ],
    },
  },
  {
    version: '0.1.8',
    date: '2026-06-18',
    changes: {
      added: [
        'Drawer full-close animation',
        'MDataTable row expand/collapse animation',
        'Improved label rendering',
      ],
      fixed: [
        'Minor Vue prop-type warnings',
        'MIconButton no longer requires a visible label',
      ],
    },
  },
  {
    version: '0.1.7',
    date: '2026-06-18',
    changes: {
      fixed: ['Dropdown element size on expand'],
    },
  },
  {
    version: '0.1.6',
    date: '2026-06-18',
    changes: {
      added: ['Improved MCard variants and surface styling'],
    },
  },
  {
    version: '0.1.5',
    date: '2026-06-18',
    changes: {
      added: ['Router-aware navigation components with to prop support'],
    },
  },
  {
    version: '0.1.4',
    date: '2026-06-18',
    changes: {
      fixed: ['MTour z-index stacking issue'],
    },
  },
  {
    version: '0.1.3',
    date: '2026-06-18',
    changes: {
      fixed: ['Context menu children positioning'],
    },
  },
  {
    version: '0.1.2',
    date: '2026-06-18',
    changes: {
      added: [
        'Vue language syntax highlighting in MCodeEditor',
        'Copy-to-clipboard icon in MCodeEditor',
        'Code editor general improvements',
        'Tailwind CSS source file entry point',
      ],
      fixed: [
        'CSS styles import ordering',
        'MFab expand overflow clipping',
        'MSelect placeholder spacing when option selected',
        'Tooltip auto-close on scroll',
      ],
    },
  },
  {
    version: '0.1.1',
    date: '2026-06-18',
    changes: {
      fixed: ['NPM publish workflow and CI pipeline setup'],
    },
  },
  {
    version: '0.1.0',
    date: '2026-06-18',
    changes: {
      added: [
        'Initial release of @m3ui-vue/m3ui-vue',
        '80+ components: Buttons, Inputs, Data Display, Feedback, Navigation, Layout, Overlays, Tables, Utility, Editors, Advanced',
        'Full TypeScript support with exported types',
        'Tailwind CSS v4 integration via @tailwindcss/vite',
        'Material Design 3 theming with 20 built-in color palettes',
        'Dark / light / system theme switching',
        'Composables: useToast, useTheme, useColorPalette, useLocale',
      ],
    },
  },
]

function isLatest(v: Version) {
  return v.version === versions[0]?.version
}

function isMajorMinor(v: Version) {
  return v.version.endsWith('.0')
}
</script>

<template>
  <MStack gap="xl" class="mx-auto max-w-3xl px-4 py-10">
    <!-- Header -->
    <MStack gap="sm">
      <MFlex align="center" gap="sm">
        <MIcon name="history" class="text-primary" :size="28" />
        <h1 class="text-display-small font-medium text-on-surface">Changelog</h1>
      </MFlex>
      <p class="text-body-large text-on-surface-variant">
        All notable changes to <code class="rounded bg-surface-variant px-1.5 py-0.5 text-on-surface-variant">@m3ui-vue/m3ui-vue</code>, version by version.
      </p>
    </MStack>

    <MDivider />

    <!-- Timeline -->
    <MStack gap="0">
      <div
        v-for="(entry, i) in versions"
        :key="entry.version"
        class="relative pl-8"
        :class="{ 'pb-10': i < versions.length - 1 }"
      >
        <!-- Timeline line -->
        <div
          v-if="i < versions.length - 1"
          class="absolute left-[11px] top-6 bottom-0 w-px bg-outline-variant"
        />

        <!-- Timeline dot -->
        <div
          class="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full"
          :class="isLatest(entry) ? 'bg-primary' : isMajorMinor(entry) ? 'bg-secondary-container' : 'bg-surface-variant'"
        >
          <MIcon
            :name="isLatest(entry) ? 'new_releases' : isMajorMinor(entry) ? 'upgrade' : 'commit'"
            :size="14"
            :class="isLatest(entry) ? 'text-on-primary' : isMajorMinor(entry) ? 'text-on-secondary-container' : 'text-on-surface-variant'"
          />
        </div>

        <!-- Version card -->
        <MCard variant="outlined" class="overflow-hidden">
          <!-- Card header -->
          <div
            class="flex items-center justify-between px-5 py-3"
            :class="isMajorMinor(entry) ? 'bg-secondary-container/30' : ''"
          >
            <MFlex align="center" gap="sm">
              <span class="text-title-medium font-semibold text-on-surface">
                v{{ entry.version }}
              </span>
              <MChip v-if="isLatest(entry)" tone="primary" size="small" icon="new_releases">
                Latest
              </MChip>
              <MChip v-else-if="isMajorMinor(entry)" size="small" icon="upgrade">
                Minor
              </MChip>
            </MFlex>
            <span class="text-body-small text-on-surface-variant">{{ entry.date }}</span>
          </div>

          <MDivider />

          <!-- Changes -->
          <MStack gap="sm" class="px-5 py-4">
            <!-- Added -->
            <div v-if="entry.changes.added?.length">
              <MFlex align="center" gap="xs" class="mb-2">
                <MIcon name="add_circle" :size="16" class="text-tertiary" />
                <span class="text-label-medium font-medium text-tertiary">Added</span>
              </MFlex>
              <ul class="space-y-1 pl-1">
                <li
                  v-for="item in entry.changes.added"
                  :key="item"
                  class="flex items-start gap-2 text-body-medium text-on-surface-variant"
                >
                  <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary" />
                  {{ item }}
                </li>
              </ul>
            </div>

            <!-- Fixed -->
            <div v-if="entry.changes.fixed?.length">
              <MFlex align="center" gap="xs" class="mb-2">
                <MIcon name="bug_report" :size="16" class="text-error" />
                <span class="text-label-medium font-medium text-error">Fixed</span>
              </MFlex>
              <ul class="space-y-1 pl-1">
                <li
                  v-for="item in entry.changes.fixed"
                  :key="item"
                  class="flex items-start gap-2 text-body-medium text-on-surface-variant"
                >
                  <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-error" />
                  {{ item }}
                </li>
              </ul>
            </div>
          </MStack>
        </MCard>
      </div>
    </MStack>
  </MStack>
</template>
