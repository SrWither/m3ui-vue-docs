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
    version: '0.8.0',
    date: '2026-09-18',
    changes: {
      added: [
        '10 new color palettes, bringing the total to 40: a hand-authored Monochrome (true pure black-and-white, no hue tint at all, distinct from the library\'s existing muted-gray palettes) plus 9 new jewel-tone colors — Rust, Gold, Emerald, Turquoise, Cobalt, Sapphire, Amethyst, Magenta, and Mauve — generated the same way as the existing 30 to fill real gaps in the color spectrum',
        'MTabs gained a scrollable prop (default false): tabs now evenly fill the available width with no scrolling by default, matching M3\'s Fixed TabRow — pass scrollable to restore the previous natural-width, scroll-on-overflow behavior (M3\'s Scrollable TabRow). This changes the default look for existing usage with many tabs',
        'MMenu and MContextMenu support keyboard navigation now — opening a menu focuses its first item, and ArrowUp/ArrowDown move focus between items',
        'MNavigationRail gained an expanded prop, matching M3\'s wide navigation rail: items switch from a narrow centered icon to a full-width row with the icon and label side by side, and the rail widens from 80px to 220px. Row height stays constant so toggling never shifts other items, and the label reveals with a left-to-right wipe growing out from the icon. Doesn\'t include the real component\'s draggable resize yet, but see the modal variant below',
        'MNavigationRail gained a modal variant: instead of reflowing the app\'s layout, expanding now opens a scrim-backed panel flush against the screen edge with a slight spring overshoot on open, closable via the scrim, Escape, or picking an item',
        'MDialog gained an optional #icon slot (its presence also centers the title, matching M3\'s spec) and a closable prop (default true) to opt out of the header close button, which isn\'t actually part of M3\'s dialog spec',
        'MDialog gained an optional divider above the actions row that appears automatically once the content has more to scroll to, and disappears once scrolled to the bottom',
        'MDialog gained a maxHeight prop, mirroring the existing maxWidth',
        'MCard gained a disabled prop with real per-variant disabled colors, and clickable cards are now fully keyboard-accessible (reachable via Tab, activatable with Enter/Space, with a visible focus ring) — previously there was no way to reach or trigger one without a mouse',
        'MCheckbox, MRadio, and MSwitch all gained real hover/press/focus feedback (a state-layer overlay plus a focus-visible ring) they were completely missing before — MSwitch\'s version tracks the moving thumb rather than staying in a fixed spot',
        'MSwitch gained an icon prop (default true) — M3\'s actual default Switch has no checkmark icon in the thumb at all, so this exposes that plainer variant too',
        'MChip\'s clickable chips gained a keyboard-focus ring and a real hover/press state layer, replacing a hover effect that would have visually replaced a filled/selected chip\'s own color instead of overlaying it',
        'MListItem gained an overline prop and #overline slot — the third text region M3\'s spec defines above the headline, previously missing entirely',
        'MFab gained a new medium size tier (80dp), the M3 size between the existing regular and large tiers',
      ],
      fixed: [
        'All text-field-shaped inputs — MTextField, MSelect, MAutocomplete, MMultiSelect, MMultiAutocomplete, MNumberField, MMaskField, MTagInput, MPinInput, and the date/time/color pickers\' trigger fields — shared the same corner radius (8px instead of M3\'s 4px), leading icon size (20px instead of 24dp), and disabled-state bugs (one flat opacity instead of M3\'s split values for text/label/border/background, which made filled fields look far more washed out and outlined borders far more visible than they should). Also added a tinted text caret, which was missing everywhere',
        'MSelect\'s empty-dropdown text was hardcoded in Spanish regardless of locale; now goes through the same locale system as the rest of the library',
        'MMultiSelect/MMultiAutocomplete let you remove a chip by its × even while the whole field was disabled',
        'MNavigationBar/MNavigationRail\'s active item label was tinted the same as its icon; M3 actually uses a different color for each',
        'MNavigationBar was missing its container shadow entirely',
        'MNavigationDrawer: default width was 288px instead of M3\'s 360px, the modal variant had the wrong surface color and far too much shadow, active rows were shorter than spec, and the far edge had no corner rounding',
        'MTabs: label typography, icon size, the icon-tab height (primary), and the secondary indicator thickness all corrected to match M3 exactly',
        'MMenu/MMenuItem/MContextMenu\'s dropdown panels had the same corner-radius bug as the text fields above, and menu items had no visible keyboard-focus ring at all',
        'MDialog/MConfirmDialog\'s padding, max-width, and min-width corrected to spec; also fixed the title rendering slightly off-center when both the icon slot and the close button were showing at once',
        'MButton and MIconButton\'s five size tiers (xs through xl) had several wrong dimensions — icon size, spacing, and especially the large/xl tiers, which are meant to be a much bigger jump in the real spec than they were. Also fixed the outlined variant\'s border color and disabled-state opacity',
        'MIconButton\'s filled/tonal variants had a fake shadow standing in for hover feedback instead of any real state layer — replaced with one',
        'MCard\'s hover/press elevation now differs correctly per variant — only the elevated variant should actually lift on hover and stay lifted while pressed; filled/outlined were using the same behavior by mistake',
        'MCheckbox\'s touch target, check-icon size, and corner radius corrected to spec; also fixed a regression (introduced while adding the hover/focus feedback above) where clicking the checkbox could make an unrelated part of the host page jump-scroll',
        'MChip\'s shape now morphs into a full pill once selected instead of staying a fixed rounded-square; also corrected its neutral border color and disabled-state opacity',
        'MRadio had the same missing touch-target and hover/press feedback issues MCheckbox did, now fixed the same way (MRadio has no focus ring in the real spec, unlike Checkbox/Chip, so it doesn\'t get one)',
        'MSwitch\'s on-check icon color, handle recoloring on hover/press, and the handle\'s grow-while-pressed animation all corrected to match spec',
        'MBadge\'s dot and label sizes, plus the label\'s typography, corrected to spec',
        'MListItem\'s minimum row height wasn\'t enforced (rows were shorter than spec), and the selected-state highlight color wasn\'t applied consistently across every context it\'s used in',
        'MTooltip: the plain variant had a shadow it shouldn\'t (M3\'s default elevation is 0), plus wrong padding/max-width/sizing; the rich variant had the wrong elevation and subhead color',
        'MSnackbar: shape, elevation, icon size, action-button typography, and minimum height all corrected to spec',
        'MSegmentedButton\'s disabled-state opacity was applied as one flat value across content and border instead of two different ones per spec; also fixed a dead color option that didn\'t actually change anything',
        'MSplitButton had the same size-tier bugs MButton did (see above), plus icon size, padding, and inner-corner fixes',
        'MButtonGroup\'s button spacing and inner corner radius corrected on its one real spec-defined size tier',
        'MBottomSheet: corners, elevation, a missing max-width cap, and the drag handle\'s color/touch-target all corrected to spec',
        'Library-wide: the dark scrim behind dialogs, drawers, pickers, and other overlays was slightly too opaque (40% instead of M3\'s 32%) across 16+ components — now consistent everywhere, including MOverlay and MSpotlightSearch which an earlier pass of this fix missed',
        'MToolbar wasn\'t enforcing M3\'s real container height, its floating variant\'s pill shape and (lack of) default elevation, or the different padding the floating vs. docked variants should have',
        'MTopAppBar: edge padding, the elevated state\'s color+elevation swap, and the navigation icon\'s color all corrected to spec',
        'MSelect/MAutocomplete\'s selected option now uses a solid highlight color instead of a translucent one, matching the rest of the library\'s selected-state treatment',
        'MDatePicker/MDateRangePicker\'s dropdown variants brought up to match what their Modal siblings already had right (panel size, radius, color, day-cell height), plus a shared weekday-header bug fixed across all four picker files',
        'MTimePickerModal: digit-box size, typography, and the drag handle all corrected to spec; MTimePicker\'s (dropdown) outer shell had the same color/shape bug as the date pickers above',
        'MFab\'s elevation was wrong at every interaction state, plus icon/shape sizing on the small and large tiers; MFabMenu\'s item rows had the same elevation bug',
        'MLoadingIndicator\'s bare shape sizing ratio and its contained variant\'s active color both corrected to spec',
        'MSearchBar: elevation, divider color, and back-button color corrected, plus a keyboard-focus ring it was completely missing before',
        'MProgressBar and MCircleProgressBar: thickness unified to spec, MProgressBar\'s linear variant gained the gapped-track look its wavy variant already had, and MCircleProgressBar\'s default size is now correctly variant-aware instead of one flat value',
        'MCodeEditor\'s placeholder prop was declared but never actually did anything — it\'s now wired up to show placeholder text when the editor is empty',
        'MChatBubble\'s avatarSrc prop was dead code (the MAvatar it renders internally has no way to show an image) — removed',
        'Two type exports (JsonEditorLabels, JsonViewerLabels) that should have been importable from the package weren\'t actually reachable — fixed',
        'MCodeEditor\'s line-number gutter didn\'t reach the full height of the editor, leaving a mismatched blank strip below it whenever there was more empty space than lines of code (most visible with few lines, a tall minHeight, or stretching the whole component to match a taller sibling) — fixed, and the component now properly fills a stretched container instead of just sitting at its own minimum height',
      ],
    },
  },
  {
    version: '0.7.1',
    date: '2026-09-18',
    changes: {
      added: [
        'New --color-scrim design token — M3 keeps scrim distinct from shadow even though both are black in the baseline theme. 17 backdrop-rendering components (MDialog, MBottomSheet, MSideSheet, MNavigationDrawer, MOverlay, MFab, MTour, MCommandPalette, MSpotlightSearch, the *Modal pickers, MSelect/MAutocomplete/MMultiSelect/MMultiAutocomplete) now use it instead of a hardcoded black overlay',
        'MCheckbox and MSwitch gained a color prop (primary/secondary/tertiary/error), matching MRadio',
      ],
      fixed: [
        'MCheckbox, MRadio, and MSwitch now have a full 48×48px touch target around their visual control, matching M3\'s minimum — previously the small visible control itself was the only clickable area',
        'Disabled MButton/MIconButton/MChip/MCheckbox no longer just go translucent (a disabled filled-primary button used to still read as blue) — content now dims to on-surface 38%, container to on-surface 12%, matching the real M3 split',
        'MCard\'s clickable state now shows a proper hover/pressed state-layer overlay, not just the elevation change',
        'MFab\'s extended (icon+label) layout padding corrected to M3\'s exact asymmetric spacing plus its minimum width',
        'MSlider\'s inactive track no longer tints toward whatever color is active (e.g. an error-colored slider\'s empty track is no longer reddish) — it\'s a fixed secondary-container tone, matching the real M3 slider',
        'MSlider disabled state now dims content and track separately instead of one flat opacity',
        'MSlider had no visible keyboard-focus indicator at all — it now narrows and rings the handle on focus, matching its existing drag-press behavior',
        'MSlider\'s default size now uses the exact M3 handle height/gap/press-ratio instead of approximated values',
      ],
    },
  },
  {
    version: '0.7.0',
    date: '2026-09-17',
    changes: {
      added: [
        'MLoadingIndicator documented on the Feedback page — color variants, the contained variant, and a dedicated sizes example',
        'MPullToRefresh (beta) documented on the Feedback page, with notes on when it actually applies (nested scroll containers, or app shells where the browser\'s native gesture doesn\'t fire) versus a plain page scroll, which already gets pull-to-refresh for free on mobile, and on its known reliability limits as a touch drag in an actual mobile browser tab',
        'MFabMenu documented on the Buttons page — the M3 FAB Menu, built on top of MFab\'s #content slot, with examples for the independent size/itemSize props, colors (including per-item overrides), the extended (icon+label) trigger, the scrim toggle, direction/alignment combinations, and a functional note-actions example (edit/duplicate/share/delete)',
        'MSearchBar documented on the Navigation page — the M3 search bar, with docked and fullscreen examples, one showing it embedded in MTopAppBar\'s #title slot, and one for the iconPosition/textAlign props',
      ],
      fixed: [
        'Docs site now self-hosts Material Symbols via the material-symbols npm package instead of the Google Fonts CDN, so icons render offline and without a third-party request',
        'MTopAppBar\'s navigation icon had a hardcoded Spanish aria-label regardless of the active locale; now translated, and its medium/large variants use the exact M3 container heights instead of a slightly-short approximation',
        'MTabs primary/secondary indicator now uses the same physics as the real M3 component (two independent springs for offset and width, matching androidx.compose.material3.TabRow) instead of a hand-made stretch animation, and no longer loses its animation to a race with the tabs-list watcher',
      ],
    },
  },
  {
    version: '0.6.4',
    date: '2026-09-16',
    changes: {
      fixed: [
        'MSlider centered and range variants: the fill next to a thumb now follows that thumb\'s actual pinned position near 0%/100%, instead of occasionally creeping past it and closing the gap around it',
        'MSlider centered and range variants: track segment corners now match the standard variant — rounded where a segment touches the real track end, square where it meets a thumb, and square on both ends for a segment sitting between two thumbs',
        'MSlider track-end corners are now a touch rounder/softer across all variants',
      ],
    },
  },
  {
    version: '0.6.3',
    date: '2026-09-15',
    changes: {
      fixed: [
        'MWindow bring-to-front z-index counter is now shared across every instance (previously each window kept its own independent counter, so with 3+ windows open, clicking one to bring it to the front could fail to actually come to the top)',
        'MWindow z-index range now starts lower, keeping it below the app-level overlay scale used by MDialog, the *Modal pickers, MSelect/MAutocomplete/MMultiSelect/MMultiAutocomplete, MSpotlightSearch, and MCommandPalette — windows no longer render on top of a real modal/spotlight/command palette',
        'MTerminal: the last line of the initial lines prop no longer forces a trailing newline, so the cursor sits right after that line instead of dropping to an empty line below it — useful for a prompt as the last line in an interactive shell-style demo',
      ],
    },
  },
  {
  version: '0.6.2',
  date: '2026-09-14',
  changes: {
    added: [
      'New component: MPageProgress — thin top loading bar for page/route transitions with a trickle-then-complete animation',
      'MPageProgress auto-detects vue-router and automatically wires itself to beforeEach/afterEach/onError without adding vue-router as a dependency',
      'New composable: usePageProgress() — shared progress state with start(), set(pct), and done() for manual or router-driven page progress',
      'MPageProgress auto prop (default true) controls vue-router auto-wiring',
      'MPageProgress position prop (top | bottom, default top) controls which edge of the viewport the progress bar is pinned to',
      'New component: MBar — draggable Electron title bar for frameless windows, with customizable icon, title, alignment, trailing content, and window controls',
      'MBar platform prop supports Windows and macOS title bar conventions, including native macOS traffic-light spacing',
      'MBar icon automatically detects image sources (URL, data URI, or file path) versus Material Symbol names',
      'MBar supports minimize/maximize/close controls with corresponding events, configurable button visibility, maximized state, and double-click-to-maximize behavior',
      'MSlider corner stop dots now hide once the fill passes them, and the standard variant no longer shows a start indicator, matching the official M3 slider',
      'MSlider thumb now maintains a constant margin from the track ends, with matching fill gaps at 0% and 100%',
      'MSlider standard variant now uses fully rounded outer fill corners and square corners facing the thumb, matching the official M3 slider',
      'MSlider gained fillColor and thumbColor props for independently customizing the filled track and thumb colors',
      'MSlider gained thumbIcon to replace the draggable bar thumb with a Material Symbol icon',
      'MSlider corner icon now uses its own edge inset and is naturally covered by the thumb when overlapping',
      'MSlider stops variant now hides the stop currently under the thumb, including both thumbs in range mode',
    ],
  },
},
  {
    version: '0.6.1',
    date: '2026-09-13',
    changes: {
      added: [
        'New component: MLightbox — Material 3 fullscreen image lightbox with prev/next arrow navigation, keyboard arrow-key navigation, and swipe/drag-to-navigate via Pointer Events (mouse and touch)',
        'MLightbox auto-detects <img> elements rendered in its default slot (opt out with data-lightbox="false") and wires click-to-open automatically, so wrapping arbitrary content — including MMarkdown output — makes every image in it clickable without building an items array by hand; pass an explicit items array instead for full programmatic control (modelValue/index v-models, open()/close()/next()/prev() exposed via template ref)',
        'MLightbox opens with a Discord-style animation: when opened from a detected/clicked thumbnail, the image visibly expands from that thumbnail\'s on-screen position and size to fullscreen; falls back to a plain scale-up when there\'s no originating element',
        'MLightbox showThumbnails prop (default false) shows a row of clickable thumbnails at the bottom for jumping directly to an image',
        'MLightbox rounded prop (default true) rounds the corners of the main opened image',
        'MLightbox loop prop (default true) controls whether navigating past the first/last image wraps around',
        'createM3UI gained a persistPalette option (default true, matching prior behavior) — set to false to make palette a hard default that always wins on boot regardless of what\'s already stored in localStorage, and to stop later useColorPalette().set() calls from persisting either (they still apply live)',
        'useColorPalette() gained setPersistPalette(enabled) to toggle localStorage persistence at runtime, plus a persistPalette ref reflecting the current state',
      ],
    },
  },
  {
    version: '0.6.0',
    date: '2026-09-09',
    changes: {
      added: [
        'New component: MPinInput — OTP/PIN code input with one box per character, auto-advance on type, smart backspace, arrow-key navigation, and full-code paste support',
        'MPinInput type prop (numeric/alphanumeric) and masked prop (password-style dots) for PIN vs. verification-code use cases',
        'MPinInput groups prop (segment sizes, e.g. [2, 4, 2, 3, 1, 3]) with a configurable separator for license/activation-key style layouts — length is derived as the sum of the groups',
        'MPinInput complete event, fired once with the full value as soon as every box is filled',
        'material-symbols listed as an optional peer dependency, documented as a self-hosted/offline alternative to the Google Fonts CDN for Material Symbols Outlined',
        'New component: MCopyButton — copy-to-clipboard icon button with temporary success feedback, copied/error events',
        'New component: MPasswordMeter — password strength meter (length + character variety heuristic), 5 levels with customizable labels, emits score',
        'New component: MRelativeTime — auto-updating "3 minutes ago" / "in 2 hours" text using the native Intl.RelativeTimeFormat, with an adaptive refresh cadence',
        'M3Locale gained a lang field (BCP-47 tag) set by every packaged locale — MRelativeTime reads it via useLocale() to auto-match the app locale without a locale prop on every instance',
        'New component: MQRCode — QR code generator rendered as inline SVG, available from the @m3ui-vue/m3ui-vue/qrcode entry point with qrcode-generator as an optional peer dependency',
        'MQRCode rounded prop (default true) rounds the outer container corners, independent of the scannable pattern itself',
        'MQRCode moduleStyle prop (square/dots, default square): dots rounds each module corner individually based on its neighbors, so connected runs (the finder-pattern squares especially) merge into smooth shapes instead of showing notches; both styles scan identically',
        'New component: MExportButton — exports an array of objects to CSV or JSON with one click (real browser download), exported/error events, no dependencies',
        'New component: MSignaturePad — canvas signature capture with pointer events, clear()/undo()/isEmpty()/toDataURL() exposed via template ref, begin/end/change events',
        'New component: MKbd — keyboard-shortcut hint chip; accepts a \'+\'-delimited string or an array of keys, with a customizable separator',
        'New component: MBarcode — barcode generator (Code128, EAN13, UPC, CODE39, and other symbologies) rendered as inline SVG, available from the @m3ui-vue/m3ui-vue/barcode entry point with jsbarcode as an optional peer dependency, with an error slot for values invalid in the given format',
      ],
    },
  },
  {
    version: '0.5.10',
    date: '2026-09-09',
    changes: {
      fixed: [
        'Bumped vue to ^3.5.42 and vue-tsc to ^3.3.11 (latest stable); typescript stays on ~6.0.3 since TypeScript 7\'s native compiler drops the classic API vue-tsc needs for .vue type-checking',
      ],
    },
  },
  {
    version: '0.5.9',
    date: '2026-08-19',
    changes: {
      added: [
        'New component: MShader — Shadertoy-style GLSL fragment shaders on WebGL2, with optional WGSL shaders on WebGPU when available',
        'MShader custom uniforms alongside built-in iTime, iResolution, iMouse, and iFrame',
        'MShader paused and pixelRatio props, loading/fallback/error slots, and ready/error events',
      ],
    },
  },
  {
    version: '0.5.8',
    date: '2026-07-30',
    changes: {
      fixed: [
        'MDataTable no longer caches whether the row-actions/row-expand slots are present, so adding or removing them dynamically updates the table immediately instead of requiring a full remount',
      ],
    },
  },
  {
    version: '0.5.7',
    date: '2026-07-30',
    changes: {
      added: ['MTimePicker now emits a value as soon as an hour is picked, using the currently selected minute'],
      fixed: ['createM3UI no longer overwrites a palette the user already chose on every app boot'],
    },
  },
  {
    version: '0.5.6',
    date: '2026-07-21',
    changes: {
      fixed: [
        'MDataTable minHeight no longer defaults to 20rem — tables size to their content unless minHeight is explicitly set',
        'MDataTable empty state has a sensible minimum height by default even without minHeight',
      ],
    },
  },
  {
    version: '0.5.5',
    date: '2026-07-21',
    changes: {
      fixed: [
        'MDataTable loading skeleton row count now matches the reserved minHeight instead of always showing a full page of rows',
        'MDataTable empty-state message now centers vertically within the reserved height',
      ],
    },
  },
  {
    version: '0.5.4',
    date: '2026-07-18',
    changes: {
      fixed: ['MNavigationDrawer static section titles no longer get compressed when space is tight'],
    },
  },
  {
    version: '0.5.3',
    date: '2026-07-18',
    changes: {
      fixed: ['MNavigationDrawer long content no longer overflows its scrollable sections'],
    },
  },
  {
    version: '0.5.2',
    date: '2026-07-09',
    changes: {
      fixed: [
        'MJsonEditor and MJsonViewer text is now localized instead of hardcoded in Spanish',
        'MJsonEditor no longer overwrites freshly formatted/minified text with a stale copy',
        'MCodeEditor text selection is now visibly highlighted',
        'MCircleProgressBar wavy variant wave now travels in the correct direction',
      ],
    },
  },
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
