<script setup lang="ts">
import { ref } from 'vue'
import {
  MCard, MChip, MBadge, MAvatar, MIcon, MDivider, MButton, MIconButton,
  MStatCard, MTimeline, MSkeleton, MEmptyState, MResult, MTree,
  MList, MListItem, MListSubheader, MSwitch,
  MEmoji, MEmojiButton, MEmojiSelector, MCarousel, MChatBubble,
} from '@m3ui-vue/m3ui-vue'
import type { TimelineItem, TreeNode, CarouselItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const chipSelected = ref(true)
const removableChips = ref(['Vue', 'React', 'Svelte'])

function removeChip(label: string) {
  removableChips.value = removableChips.value.filter((c) => c !== label)
}
function resetChips() {
  removableChips.value = ['Vue', 'React', 'Svelte']
}

const cardProps: PropDef[] = [
  { name: 'variant', type: "'elevated' | 'filled' | 'outlined'", default: "'elevated'", description: 'Card surface style' },
  { name: 'clickable', type: 'boolean', default: 'false', description: 'Adds hover elevation and cursor pointer' },
  { name: 'image', type: 'string', description: 'URL for a full-bleed header image' },
  { name: 'imageAlt', type: 'string', description: 'Alt text for the header image' },
  { name: 'imageHeight', type: 'string', description: 'Tailwind height class for the image (default h-48)' },
  { name: 'title', type: 'string', description: 'Card title text' },
  { name: 'subtitle', type: 'string', description: 'Supporting text below the title' },
]

const chipProps: PropDef[] = [
  { name: 'tone', type: "'neutral' | 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | CSS color", default: "'neutral'", description: 'Color tone or any CSS color string' },
  { name: 'selected', type: 'boolean', default: 'false', description: 'Selected/active state' },
  { name: 'removable', type: 'boolean', default: 'false', description: 'Show remove (X) button' },
  { name: 'clickable', type: 'boolean', default: 'false', description: 'Makes the chip interactive' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'icon', type: 'string', description: 'Leading Material Symbol icon' },
]

const badgeProps: PropDef[] = [
  { name: 'count', type: 'number', description: 'Numeric badge value' },
  { name: 'dot', type: 'boolean', default: 'false', description: 'Show a small dot instead of a number' },
  { name: 'color', type: "'primary' | 'error' | 'secondary' | 'tertiary'", default: "'error'", description: 'Badge color' },
  { name: 'max', type: 'number', default: '99', description: 'Max value before showing "N+"' },
  { name: 'position', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'", default: "'top-right'", description: 'Corner where the badge is placed' },
  { name: 'overlap', type: "'inside' | 'outside' | 'edge'", default: "'edge'", description: 'How much the badge overlaps the content' },
]

const avatarProps: PropDef[] = [
  { name: 'name', type: 'string', description: 'Full name — initials are extracted automatically. Takes priority over fallback' },
  { name: 'fallback', type: 'string', description: 'Custom text to display when name is not provided (e.g. "AJ")' },
  { name: 'size', type: 'number', default: '40', description: 'Avatar size in px' },
]

const iconProps: PropDef[] = [
  { name: 'name', type: 'string', description: 'Material Symbol name (e.g. "settings", "favorite")' },
  { name: 'size', type: 'number', default: '24', description: 'Icon size in px' },
]

const dividerProps: PropDef[] = [
  { name: 'vertical', type: 'boolean', default: 'false', description: 'Render as vertical divider' },
  { name: 'label', type: 'string', description: 'Text label in the middle of the divider' },
  { name: 'inset', type: 'boolean', default: 'false', description: 'Add horizontal padding' },
]

const statCardProps: PropDef[] = [
  { name: 'title', type: 'string', description: 'Stat label text' },
  { name: 'value', type: 'string | number', description: 'Main stat value' },
  { name: 'icon', type: 'string', description: 'Material Symbol icon' },
  { name: 'trend', type: 'number', description: 'Percentage change (positive/negative)' },
  { name: 'trendLabel', type: 'string', description: 'Text next to trend indicator' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error' | 'success'", default: "'primary'", description: 'Icon container color' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show skeleton placeholder' },
]

const timelineItems: TimelineItem[] = [
  { title: 'Project created', description: 'Initial repository setup', date: 'Jan 15', icon: 'rocket_launch', color: 'primary' },
  { title: 'First release', description: 'v1.0.0 published to npm', date: 'Feb 20', icon: 'celebration', color: 'success' },
  { title: 'Bug reported', description: 'Critical rendering issue found', date: 'Mar 5', icon: 'bug_report', color: 'error' },
  { title: 'Patch released', description: 'Fix deployed in v1.0.1', date: 'Mar 7', icon: 'check_circle', color: 'success' },
]

const timelineProps: PropDef[] = [
  { name: 'items', type: 'TimelineItem[]', description: 'Array of { title, description?, date?, icon?, color? }' },
  { name: 'dense', type: 'boolean', default: 'false', description: 'Compact spacing' },
  { name: 'alternating', type: 'boolean', default: 'false', description: 'Alternate items left/right' },
]

const skeletonProps: PropDef[] = [
  { name: 'variant', type: "'text' | 'circular' | 'rectangular' | 'rounded'", default: "'text'", description: 'Skeleton shape' },
  { name: 'width', type: 'string', description: 'CSS width' },
  { name: 'height', type: 'string', description: 'CSS height' },
  { name: 'lines', type: 'number', default: '1', description: 'Number of text lines (text variant)' },
  { name: 'animation', type: "'pulse' | 'wave' | 'none'", default: "'pulse'", description: 'Animation style' },
]

const emptyStateProps: PropDef[] = [
  { name: 'icon', type: 'string', default: "'inbox'", description: 'Material Symbol icon' },
  { name: 'title', type: 'string', description: 'Title text' },
  { name: 'description', type: 'string', description: 'Supporting description' },
  { name: 'compact', type: 'boolean', default: 'false', description: 'Smaller variant' },
]

const resultProps: PropDef[] = [
  { name: 'status', type: "'success' | 'error' | 'warning' | 'info' | '404' | '403' | '500'", description: 'Result type with predefined icon, colors, and default text' },
  { name: 'title', type: 'string', description: 'Custom title (overrides default)' },
  { name: 'description', type: 'string', description: 'Custom description (overrides default)' },
]

const treeNodes: TreeNode[] = [
  {
    id: 'src', label: 'src', icon: 'folder',
    children: [
      {
        id: 'components', label: 'components', icon: 'folder',
        children: [
          { id: 'button', label: 'MButton.vue', icon: 'code' },
          { id: 'card', label: 'MCard.vue', icon: 'code' },
          { id: 'dialog', label: 'MDialog.vue', icon: 'code' },
        ],
      },
      {
        id: 'composables', label: 'composables', icon: 'folder',
        children: [
          { id: 'useTheme', label: 'useTheme.ts', icon: 'code' },
          { id: 'useToast', label: 'useToast.ts', icon: 'code' },
        ],
      },
      { id: 'index', label: 'index.ts', icon: 'code' },
    ],
  },
  { id: 'package', label: 'package.json', icon: 'description' },
  { id: 'readme', label: 'README.md', icon: 'description' },
]

const treeProps: PropDef[] = [
  { name: 'nodes', type: 'TreeNode[]', description: 'Array of { id, label, icon?, children?, disabled? }' },
  { name: 'selected', type: 'string | number | null', description: 'Currently selected node id' },
  { name: 'checked', type: '(string | number)[]', description: 'Checked node ids (when checkable)' },
  { name: 'checkable', type: 'boolean', default: 'false', description: 'Show checkboxes with cascade selection' },
  { name: 'defaultExpanded', type: "(string | number)[] | 'all' | 'none'", default: "'none'", description: 'Which nodes start expanded' },
  { name: 'emptyText', type: 'string', description: 'Text shown when no nodes' },
]

const selectedNode = ref<string | number | null>(null)
const checkedNodes = ref<(string | number)[]>([])
const statLoading = ref(false)

const listSelected = ref<string | number | null>('inbox')
const darkMode = ref(false)
const notifications = ref(true)
const autoUpdate = ref(false)

const listProps: PropDef[] = [
  { name: 'dense', type: 'boolean', default: 'false', description: 'Compact vertical padding' },
  { name: 'dividers', type: "boolean | 'inset'", default: 'false', description: 'Show separators between items' },
  { name: 'nav', type: 'boolean', default: 'false', description: 'Navigation variant with rounded active items' },
  { name: 'segmented', type: 'boolean', default: 'false', description: 'Segmented style — items have individual backgrounds and rounded corners' },
  { name: 'selectable', type: 'boolean', default: 'false', description: 'Enable single-item selection' },
  { name: 'selected', type: 'string | number | null', description: 'Currently selected item value' },
  { name: 'lines', type: '1 | 2 | 3', description: 'Default line count for child items' },
]

const listItemProps: PropDef[] = [
  { name: 'title', type: 'string', description: 'Primary text' },
  { name: 'subtitle', type: 'string', description: 'Secondary text (line 2)' },
  { name: 'description', type: 'string', description: 'Tertiary text (line 3)' },
  { name: 'lines', type: '1 | 2 | 3', description: 'Number of text lines (auto-detected)' },
  { name: 'icon', type: 'string', description: 'Leading Material Symbol icon' },
  { name: 'leading', type: "'icon' | 'avatar' | 'checkbox' | 'image' | 'icon-container'", description: 'Leading element type' },
  { name: 'avatarName', type: 'string', description: 'Name for avatar (when leading=avatar)' },
  { name: 'image', type: 'string', description: 'Image URL (when leading=image)' },
  { name: 'iconContainerColor', type: "'primary' | 'secondary' | 'tertiary' | 'error' | 'success'", description: 'Icon container background color' },
  { name: 'trailingIcon', type: 'string', description: 'Trailing icon name' },
  { name: 'trailingText', type: 'string', description: 'Trailing text label' },
  { name: 'trailing', type: "'icon' | 'text' | 'switch' | 'checkbox'", description: 'Trailing element type' },
  { name: 'trailingValue', type: 'boolean', description: 'Value for trailing switch/checkbox' },
  { name: 'value', type: 'string | number', description: 'Selection value (used with MList selectable)' },
  { name: 'active', type: 'boolean', default: 'false', description: 'Active/highlighted state' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
  { name: 'clickable', type: 'boolean', description: 'Make item interactive (auto if @click or href)' },
  { name: 'href', type: 'string', description: 'Link URL (renders as <a>)' },
  { name: 'to', type: 'string | object', description: 'Vue Router destination' },
  { name: 'expandable', type: 'boolean', default: 'false', description: 'Show expand/collapse arrow with #children slot' },
  { name: 'expanded', type: 'boolean', description: 'Control expanded state (v-model:expanded)' },
]

const listSubheaderProps: PropDef[] = [
  { name: 'inset', type: 'boolean', default: 'false', description: 'Align with items that have leading icons' },
]

/* ── Emoji ──────────────────────────────────────────────────────────── */
const selectedEmoji = ref('')

const carouselItems: CarouselItem[] = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop', label: 'Mountain Vista', supportingText: 'Swiss Alps at sunrise' },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=450&fit=crop', label: 'Tropical Beach', supportingText: 'Crystal clear waters' },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=450&fit=crop', label: 'Starry Night', supportingText: 'Milky way over the mountains' },
  { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=450&fit=crop', label: 'Green Valley', supportingText: 'Rolling hills in summer' },
  { src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=450&fit=crop', label: 'Autumn Forest', supportingText: 'Golden canopy' },
]

const carouselMultiRatio: CarouselItem[] = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', label: 'Wide', ratio: 1.5 },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500&fit=crop', label: 'Tall', ratio: 0.8 },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&h=500&fit=crop', label: 'Square', ratio: 1 },
  { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=700&h=350&fit=crop', label: 'Panoramic', ratio: 2 },
  { src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=600&fit=crop', label: 'Portrait', ratio: 0.7 },
]

const carouselProps: PropDef[] = [
  { name: 'items', type: 'CarouselItem[]', description: '{ src, alt?, label?, supportingText?, ratio? }' },
  { name: 'layout', type: "'hero' | 'multi-browse' | 'uncontained'", default: "'hero'", description: 'Carousel layout style' },
  { name: 'height', type: 'string', default: "'320px'", description: 'Container height' },
  { name: 'autoplay', type: 'boolean', default: 'false', description: 'Auto-advance slides' },
  { name: 'interval', type: 'number', default: '5000', description: 'Autoplay interval in ms' },
  { name: 'showArrows', type: 'boolean', default: 'true', description: 'Show prev/next arrow buttons' },
  { name: 'showIndicators', type: 'boolean', default: 'true', description: 'Show dot indicators' },
  { name: 'gap', type: 'number', default: '8', description: 'Gap between items in pixels' },
  { name: 'visibleItems', type: 'number', default: '3', description: 'Number of visible items (multi-browse)' },
  { name: 'animated', type: 'boolean', default: 'false', description: 'Enable dynamic resize on scroll (uncontained layout)' },
]

const chatBubbleProps: PropDef[] = [
  { name: 'text', type: 'string', description: 'Message text (or use default slot for custom content)' },
  { name: 'sender', type: 'string', description: 'Sender name (shown above left-side bubbles)' },
  { name: 'time', type: 'string', description: 'Timestamp string (e.g. "10:32")' },
  { name: 'side', type: "'left' | 'right'", default: "'left'", description: 'Left = received, right = sent' },
  { name: 'avatar', type: 'string', description: 'Avatar name (shown on left-side only)' },
  { name: 'avatarSrc', type: 'string', description: 'Avatar image URL' },
  { name: 'status', type: "'sent' | 'delivered' | 'read'", description: 'Message status (right-side only)' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary'", default: "'primary'", description: 'Bubble color for sent messages' },
  { name: 'tail', type: 'boolean', default: 'true', description: 'Show bubble tail (rounded corner notch)' },
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Text size (body-small / body-medium / body-large)' },
  { name: 'maxWidth', type: 'string', default: "'320px'", description: 'Max bubble width (px, %, or var()). Supports CSS variables for responsive control.' },
]

const emojiProps: PropDef[] = [
  { name: 'emoji', type: 'string', description: 'The emoji character to display' },
  { name: 'size', type: 'number', default: '24', description: 'Size in pixels' },
  { name: 'label', type: 'string', description: 'Accessible label (sets role="img")' },
]

const emojiButtonProps: PropDef[] = [
  { name: 'emoji', type: 'string', default: "'😀'", description: 'Default emoji to display' },
  { name: 'size', type: 'number', default: '28', description: 'Emoji size in pixels' },
  { name: 'randomOnHover', type: 'boolean', default: 'true', description: 'Cycle random emojis on hover (Discord-style)' },
  { name: 'category', type: 'string', description: "Limit random pool to a category id (e.g. 'smileys', 'animals')" },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction' },
  { name: 'label', type: 'string', description: 'Accessible label' },
]

const emojiSelectorProps: PropDef[] = [
  { name: 'categories', type: 'string[]', description: 'Which category ids to show (all if omitted)' },
  { name: 'search', type: 'boolean', default: 'true', description: 'Show search bar' },
  { name: 'columns', type: 'number', default: '8', description: 'Number of columns in the grid' },
  { name: 'emojiSize', type: 'number', default: '28', description: 'Emoji render size in px' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Data Display</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Components for presenting content, status indicators, and visual elements.
    </p>

    <!-- ── MCard ────────────────────────────────────────────────────────── -->
    <h2 id="mcard" class="mb-4 text-headline-small font-medium">MCard</h2>

    <ComponentDemo
      title="Variants"
      description="Three card surface styles following M3 elevation system."
      :code="`<template>
  <MCard variant=&quot;elevated&quot; class=&quot;p-6&quot;>Elevated</MCard>
  <MCard variant=&quot;filled&quot; class=&quot;p-6&quot;>Filled</MCard>
  <MCard variant=&quot;outlined&quot; class=&quot;p-6&quot;>Outlined</MCard>
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-3">
        <MCard variant="elevated" class="p-6">
          <h3 class="text-title-medium font-medium">Elevated</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Shadow-based elevation</p>
        </MCard>
        <MCard variant="filled" class="p-6">
          <h3 class="text-title-medium font-medium">Filled</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Tinted background</p>
        </MCard>
        <MCard variant="outlined" class="p-6">
          <h3 class="text-title-medium font-medium">Outlined</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Border-based</p>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Clickable"
      description="Cards with hover elevation feedback."
      :code="`<template>
  <MCard :clickable=&quot;true&quot; class=&quot;p-6&quot;>
    Click me — I have hover feedback
  </MCard>
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard :clickable="true" class="p-6">
          <h3 class="text-title-medium font-medium">Clickable elevated</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Hover to see elevation change</p>
        </MCard>
        <MCard :clickable="true" variant="outlined" class="p-6">
          <h3 class="text-title-medium font-medium">Clickable outlined</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Hover to see shadow appear</p>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With Image"
      description="Full-bleed header image via the image prop or media slot."
      :code="`<template>
  <MCard
    image=&quot;https://picsum.photos/seed/m3ui/400/200&quot;
    image-alt=&quot;Landscape&quot;
    class=&quot;w-72&quot;
  >
    <div class=&quot;p-4&quot;>
      <h3>Card Title</h3>
      <p>Card description here.</p>
    </div>
  </MCard>
</template>`"
    >
      <div class="flex flex-wrap gap-4">
        <MCard image="https://picsum.photos/seed/m3ui-a/400/200" image-alt="Photo" class="w-72">
          <div class="p-4">
            <h3 class="text-title-medium font-medium">Mountain View</h3>
            <p class="mt-1 text-body-medium text-on-surface-variant">A beautiful landscape</p>
          </div>
        </MCard>
        <MCard image="https://picsum.photos/seed/m3ui-b/400/200" image-alt="Photo" variant="outlined" class="w-72">
          <div class="p-4">
            <h3 class="text-title-medium font-medium">Ocean Breeze</h3>
            <p class="mt-1 text-body-medium text-on-surface-variant">Outlined variant with image</p>
          </div>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Title & Subtitle"
      description="Use the title and subtitle props for structured text headers."
      :code="`<template>
  <MCard title=&quot;Card Title&quot; subtitle=&quot;Supporting text goes here&quot; class=&quot;w-72&quot;>
    <p class=&quot;px-4 pb-4 text-body-medium text-on-surface-variant&quot;>
      Card content using title and subtitle props for a structured layout.
    </p>
  </MCard>
</template>`"
    >
      <div class="flex flex-wrap gap-4">
        <MCard title="Card Title" subtitle="Supporting text goes here" class="w-72">
          <p class="px-4 pb-4 text-body-medium text-on-surface-variant">
            Card content using title and subtitle props for a structured layout.
          </p>
        </MCard>
        <MCard title="Title Only" class="w-72">
          <p class="px-4 pb-4 text-body-medium text-on-surface-variant">
            A card with just a title, no subtitle.
          </p>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Header Slot"
      description="Use the #header slot for custom layouts like an avatar with text."
      :code="`<template>
  <MCard class=&quot;w-72&quot;>
    <template #header>
      <div class=&quot;flex items-center gap-3&quot;>
        <MAvatar name=&quot;Alice Brown&quot; :size=&quot;40&quot; />
        <div>
          <h3 class=&quot;text-title-medium font-medium&quot;>Alice Brown</h3>
          <p class=&quot;text-body-small text-on-surface-variant&quot;>Product Designer</p>
        </div>
      </div>
    </template>
    <p class=&quot;px-4 pb-4 text-body-medium text-on-surface-variant&quot;>
      Custom header with avatar and role information.
    </p>
  </MCard>
</template>`"
    >
      <div class="flex flex-wrap gap-4">
        <MCard class="w-72">
          <template #header>
            <div class="flex items-center gap-3">
              <MAvatar name="Alice Brown" :size="40" />
              <div>
                <h3 class="text-title-medium font-medium">Alice Brown</h3>
                <p class="text-body-small text-on-surface-variant">Product Designer</p>
              </div>
            </div>
          </template>
          <p class="px-4 pb-4 text-body-medium text-on-surface-variant">
            Custom header with avatar and role information.
          </p>
        </MCard>
        <MCard variant="outlined" class="w-72">
          <template #header>
            <div class="flex items-center gap-3">
              <MAvatar name="Carlos Diaz" :size="40" />
              <div>
                <h3 class="text-title-medium font-medium">Carlos Diaz</h3>
                <p class="text-body-small text-on-surface-variant">Engineer</p>
              </div>
            </div>
          </template>
          <p class="px-4 pb-4 text-body-medium text-on-surface-variant">
            Outlined variant with custom header slot.
          </p>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Actions"
      description="Use the #actions slot for bottom-aligned buttons."
      :code="`<template>
  <MCard title=&quot;Confirm Action&quot; subtitle=&quot;This action cannot be undone.&quot; class=&quot;w-72&quot;>
    <p class=&quot;px-4 pb-2 text-body-medium text-on-surface-variant&quot;>
      Are you sure you want to proceed?
    </p>
    <template #actions>
      <MButton variant=&quot;text&quot;>Cancel</MButton>
      <MButton>Confirm</MButton>
    </template>
  </MCard>
</template>`"
    >
      <div class="flex flex-wrap gap-4">
        <MCard title="Confirm Action" subtitle="This action cannot be undone." class="w-72">
          <p class="px-4 pb-2 text-body-medium text-on-surface-variant">
            Are you sure you want to proceed?
          </p>
          <template #actions>
            <MButton variant="text">Cancel</MButton>
            <MButton>Confirm</MButton>
          </template>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Complete Card"
      description="Image, title, subtitle, content, and action buttons combined."
      :code="`<template>
  <MCard
    image=&quot;https://picsum.photos/seed/m3ui-card/400/200&quot;
    image-alt=&quot;Landscape&quot;
    title=&quot;Mountain Adventure&quot;
    subtitle=&quot;Explore the great outdoors&quot;
    class=&quot;w-72&quot;
  >
    <p class=&quot;px-4 pb-2 text-body-medium text-on-surface-variant&quot;>
      An unforgettable hiking experience through scenic mountain trails.
    </p>
    <template #actions>
      <MButton variant=&quot;text&quot;>Learn More</MButton>
      <MButton>Book Now</MButton>
    </template>
  </MCard>
</template>`"
    >
      <div class="flex flex-wrap gap-4">
        <MCard
          image="https://picsum.photos/seed/m3ui-card/400/200"
          image-alt="Mountain landscape"
          title="Mountain Adventure"
          subtitle="Explore the great outdoors"
          class="w-72"
        >
          <p class="px-4 pb-2 text-body-medium text-on-surface-variant">
            An unforgettable hiking experience through scenic mountain trails.
          </p>
          <template #actions>
            <MButton variant="text">Learn More</MButton>
            <MButton>Book Now</MButton>
          </template>
        </MCard>
        <MCard
          image="https://picsum.photos/seed/m3ui-card2/400/200"
          image-alt="Ocean view"
          title="Beach Getaway"
          subtitle="Relax by the sea"
          variant="outlined"
          class="w-72"
        >
          <p class="px-4 pb-2 text-body-medium text-on-surface-variant">
            A perfect weekend escape with sun, sand, and waves.
          </p>
          <template #actions>
            <MButton variant="text">Details</MButton>
            <MButton variant="tonal">Reserve</MButton>
          </template>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="cardProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <MCard variant="outlined" class="overflow-x-auto p-4">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant text-left">
            <th class="pb-2 pr-4 font-medium">Slot</th>
            <th class="pb-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="py-2 pr-4 font-mono text-body-small">#default</td><td class="py-2 text-on-surface-variant">Main content area (raw, no wrapper)</td></tr>
          <tr><td class="py-2 pr-4 font-mono text-body-small">#header</td><td class="py-2 text-on-surface-variant">Custom header content (overrides title/subtitle props)</td></tr>
          <tr><td class="py-2 pr-4 font-mono text-body-small">#media</td><td class="py-2 text-on-surface-variant">Custom media content (alternative to image prop)</td></tr>
          <tr><td class="py-2 pr-4 font-mono text-body-small">#actions</td><td class="py-2 text-on-surface-variant">Bottom action buttons (flex row, right-aligned)</td></tr>
        </tbody>
      </table>
    </MCard>

    <!-- ── MChip ────────────────────────────────────────────────────────── -->
    <h2 id="mchip" class="mb-4 mt-14 text-headline-small font-medium">MChip</h2>

    <ComponentDemo
      title="Tones"
      description="Named semantic tones and custom CSS colors."
      :code="`<template>
  <MChip>Neutral</MChip>
  <MChip tone=&quot;primary&quot;>Primary</MChip>
  <MChip tone=&quot;secondary&quot;>Secondary</MChip>
  <MChip tone=&quot;tertiary&quot;>Tertiary</MChip>
  <MChip tone=&quot;success&quot;>Success</MChip>
  <MChip tone=&quot;error&quot;>Error</MChip>
  <MChip tone=&quot;#e91e63&quot;>Custom</MChip>
</template>`"
    >
      <MChip>Neutral</MChip>
      <MChip tone="primary">Primary</MChip>
      <MChip tone="secondary">Secondary</MChip>
      <MChip tone="tertiary">Tertiary</MChip>
      <MChip tone="success">Success</MChip>
      <MChip tone="error">Error</MChip>
      <MChip tone="#e91e63">Custom</MChip>
    </ComponentDemo>

    <ComponentDemo
      title="With Icons & Interaction"
      description="Clickable, selectable, and removable chips."
      :code="`<template>
  <MChip icon=&quot;code&quot;>With icon</MChip>
  <MChip :clickable=&quot;true&quot; tone=&quot;primary&quot; @click=&quot;handleClick&quot;>Clickable</MChip>
  <MChip :selected=&quot;selected&quot; :clickable=&quot;true&quot; tone=&quot;primary&quot; @click=&quot;selected = !selected&quot;>
    Selectable
  </MChip>
  <MChip :removable=&quot;true&quot; tone=&quot;tertiary&quot; @remove=&quot;handleRemove&quot;>Removable</MChip>
</template>`"
      :script="`const selected = ref(true)`"
    >
      <MChip icon="code">With icon</MChip>
      <MChip :clickable="true" tone="primary">Clickable</MChip>
      <MChip :selected="chipSelected" :clickable="true" tone="primary" @click="chipSelected = !chipSelected">
        {{ chipSelected ? 'Selected' : 'Unselected' }}
      </MChip>
      <MChip :disabled="true">Disabled</MChip>
    </ComponentDemo>

    <ComponentDemo
      title="Removable Chips"
      description="Chips that can be dismissed with an animated removal."
      :code="`<template>
  <MChip
    v-for=&quot;chip in chips&quot;
    :key=&quot;chip&quot;
    :removable=&quot;true&quot;
    tone=&quot;primary&quot;
    @remove=&quot;remove(chip)&quot;
  >
    {{ chip }}
  </MChip>
</template>`"
      :script="`const chips = ref(['Vue', 'React', 'Svelte'])

function remove(label) {
  chips.value = chips.value.filter(c => c !== label)
}`"
    >
      <MChip
        v-for="chip in removableChips"
        :key="chip"
        :removable="true"
        tone="primary"
        @remove="removeChip(chip)"
      >
        {{ chip }}
      </MChip>
      <MButton v-if="removableChips.length === 0" variant="text" icon="refresh" @click="resetChips">Reset</MButton>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="chipProps" />

    <!-- ── MBadge ───────────────────────────────────────────────────────── -->
    <h2 id="mbadge" class="mb-4 mt-14 text-headline-small font-medium">MBadge</h2>

    <ComponentDemo
      title="Badge"
      description="Numeric badges, dot indicators, and color variants."
      :code="`<template>
  <MBadge :count=&quot;5&quot;>
    <MIconButton icon=&quot;mail&quot; label=&quot;Mail&quot; variant=&quot;tonal&quot; />
  </MBadge>
  <MBadge :count=&quot;128&quot; :max=&quot;99&quot;>
    <MIconButton icon=&quot;notifications&quot; label=&quot;Notifications&quot; variant=&quot;tonal&quot; />
  </MBadge>
  <MBadge dot>
    <MIconButton icon=&quot;chat&quot; label=&quot;Chat&quot; variant=&quot;tonal&quot; />
  </MBadge>
</template>`"
    >
      <MBadge :count="5">
        <MIconButton icon="mail" label="Mail" variant="tonal" />
      </MBadge>
      <MBadge :count="128" :max="99">
        <MIconButton icon="notifications" label="Notifications" variant="tonal" />
      </MBadge>
      <MBadge dot>
        <MIconButton icon="chat" label="Chat" variant="tonal" />
      </MBadge>
      <MBadge :count="3" color="primary">
        <MIconButton icon="inbox" label="Inbox" variant="tonal" />
      </MBadge>
      <MBadge :count="7" color="tertiary">
        <MIconButton icon="favorite" label="Favorites" variant="tonal" />
      </MBadge>
    </ComponentDemo>

    <ComponentDemo
      title="Position"
      description="Place the badge on any corner with the position prop."
      :code="`<MBadge :count=&quot;3&quot; position=&quot;top-left&quot;>...
<MBadge :count=&quot;3&quot; position=&quot;top-right&quot;>...
<MBadge :count=&quot;3&quot; position=&quot;bottom-left&quot;>...
<MBadge :count=&quot;3&quot; position=&quot;bottom-right&quot;>...`"
    >
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <MBadge :count="3" position="top-left">
            <MIconButton icon="mail" label="Mail" variant="tonal" />
          </MBadge>
          <span class="text-label-small text-on-surface-variant">top-left</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MBadge :count="3" position="top-right">
            <MIconButton icon="mail" label="Mail" variant="tonal" />
          </MBadge>
          <span class="text-label-small text-on-surface-variant">top-right</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MBadge :count="3" position="bottom-left">
            <MIconButton icon="mail" label="Mail" variant="tonal" />
          </MBadge>
          <span class="text-label-small text-on-surface-variant">bottom-left</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MBadge :count="3" position="bottom-right">
            <MIconButton icon="mail" label="Mail" variant="tonal" />
          </MBadge>
          <span class="text-label-small text-on-surface-variant">bottom-right</span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Overlap"
      description="Control how much the badge overlaps the content: outside, edge, or inside."
      :code="`<MBadge :count=&quot;3&quot; overlap=&quot;outside&quot;>...
<MBadge :count=&quot;3&quot; overlap=&quot;edge&quot;>...
<MBadge :count=&quot;3&quot; overlap=&quot;inside&quot;>...`"
    >
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <MBadge :count="3" overlap="outside">
            <MAvatar name="Alice" :size="48" />
          </MBadge>
          <span class="text-label-small text-on-surface-variant">outside</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MBadge :count="3" overlap="edge">
            <MAvatar name="Bob" :size="48" />
          </MBadge>
          <span class="text-label-small text-on-surface-variant">edge</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MBadge :count="3" overlap="inside">
            <MAvatar name="Carol" :size="48" />
          </MBadge>
          <span class="text-label-small text-on-surface-variant">inside</span>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="badgeProps" />

    <!-- ── MAvatar ──────────────────────────────────────────────────────── -->
    <h2 id="mavatar" class="mb-4 mt-14 text-headline-small font-medium">MAvatar</h2>

    <ComponentDemo
      title="Avatars"
      description="Initials extracted from the name prop. Supports different sizes."
      :code="`<template>
  <MAvatar name=&quot;Alice Brown&quot; />
  <MAvatar name=&quot;Carlos Diaz&quot; :size=&quot;48&quot; />
  <MAvatar name=&quot;Eva&quot; :size=&quot;56&quot; />
  <MAvatar name=&quot;Gabriel Hernandez&quot; :size=&quot;64&quot; />
</template>`"
    >
      <MAvatar name="Alice Brown" />
      <MAvatar name="Carlos Diaz" :size="48" />
      <MAvatar name="Eva" :size="56" />
      <MAvatar name="Gabriel Hernandez" :size="64" />
    </ComponentDemo>

    <ComponentDemo
      title="Fallback"
      description="Use the fallback prop for custom initials when no name is available."
      :code="`<template>
  <MAvatar fallback=&quot;FM&quot; />
  <MAvatar fallback=&quot;AJ&quot; :size=&quot;48&quot; />
  <MAvatar :size=&quot;56&quot; />  &lt;!-- shows ? --&gt;
  <MAvatar name=&quot;Alice Brown&quot; fallback=&quot;XX&quot; :size=&quot;56&quot; />  &lt;!-- name wins --&gt;
</template>`"
    >
      <MAvatar fallback="FM" />
      <MAvatar fallback="AJ" :size="48" />
      <MAvatar :size="56" />
      <MAvatar name="Alice Brown" fallback="XX" :size="56" />
    </ComponentDemo>

    <ComponentDemo
      title="Avatar Stack"
      description="Overlap avatars with negative spacing for group displays."
      :code="`<template>
  <div class=&quot;flex -space-x-3&quot;>
    <MAvatar name=&quot;Alice Brown&quot; :size=&quot;44&quot; />
    <MAvatar name=&quot;Carlos Diaz&quot; :size=&quot;44&quot; />
    <MAvatar name=&quot;Eva Flores&quot; :size=&quot;44&quot; />
    <span class=&quot;...&quot;>+5</span>
  </div>
</template>`"
    >
      <div class="flex -space-x-3">
        <MAvatar name="Alice Brown" :size="44" />
        <MAvatar name="Carlos Diaz" :size="44" />
        <MAvatar name="Eva Flores" :size="44" />
        <MAvatar name="Gabriel H" :size="44" />
        <span class="flex h-11 w-11 items-center justify-center rounded-full border-2 border-surface bg-surface-container-high text-label-medium text-on-surface-variant">
          +5
        </span>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="avatarProps" />

    <!-- ── MIcon ────────────────────────────────────────────────────────── -->
    <h2 id="micon" class="mb-4 mt-14 text-headline-small font-medium">MIcon</h2>

    <ComponentDemo
      title="Icons"
      description="Renders Material Symbols Outlined. Browse all icons at fonts.google.com/icons."
      :code="`<template>
  <MIcon name=&quot;home&quot; />
  <MIcon name=&quot;favorite&quot; :size=&quot;32&quot; class=&quot;text-error&quot; />
  <MIcon name=&quot;settings&quot; :size=&quot;32&quot; class=&quot;text-primary&quot; />
  <MIcon name=&quot;palette&quot; :size=&quot;32&quot; class=&quot;text-tertiary&quot; />
</template>`"
    >
      <MIcon name="home" :size="32" />
      <MIcon name="favorite" :size="32" class="text-error" />
      <MIcon name="settings" :size="32" class="text-primary" />
      <MIcon name="palette" :size="32" class="text-tertiary" />
      <MIcon name="notifications" :size="32" class="text-secondary" />
      <MIcon name="code" :size="32" class="text-on-surface-variant" />
      <MIcon name="widgets" :size="32" />
      <MIcon name="rocket_launch" :size="32" class="text-primary" />
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="Scale icons to any pixel size."
      :code="`<template>
  <MIcon name=&quot;star&quot; :size=&quot;16&quot; />
  <MIcon name=&quot;star&quot; :size=&quot;24&quot; />
  <MIcon name=&quot;star&quot; :size=&quot;32&quot; />
  <MIcon name=&quot;star&quot; :size=&quot;48&quot; />
</template>`"
    >
      <div class="flex items-end gap-4">
        <div class="flex flex-col items-center gap-1">
          <MIcon name="star" :size="16" class="text-primary" />
          <span class="text-label-small text-on-surface-variant">16</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <MIcon name="star" :size="24" class="text-primary" />
          <span class="text-label-small text-on-surface-variant">24</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <MIcon name="star" :size="32" class="text-primary" />
          <span class="text-label-small text-on-surface-variant">32</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <MIcon name="star" :size="48" class="text-primary" />
          <span class="text-label-small text-on-surface-variant">48</span>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="iconProps" />

    <!-- ── MDivider ─────────────────────────────────────────────────────── -->
    <h2 id="mdivider" class="mb-4 mt-14 text-headline-small font-medium">MDivider</h2>

    <ComponentDemo
      title="Divider"
      description="Horizontal and vertical dividers with optional labels."
      :code="`<template>
  <MDivider />
  <MDivider label=&quot;OR&quot; />
  <MDivider :inset=&quot;true&quot; />
  <div class=&quot;flex h-10 items-center gap-4&quot;>
    <span>Left</span>
    <MDivider :vertical=&quot;true&quot; />
    <span>Right</span>
  </div>
</template>`"
    >
      <div class="w-full space-y-6">
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Default</p>
          <MDivider />
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">With label</p>
          <MDivider label="OR" />
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Inset</p>
          <MDivider :inset="true" />
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Vertical</p>
          <div class="flex h-10 items-center gap-4">
            <span class="text-body-medium">Left</span>
            <MDivider :vertical="true" />
            <span class="text-body-medium">Center</span>
            <MDivider :vertical="true" />
            <span class="text-body-medium">Right</span>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="dividerProps" />

    <!-- ── MStatCard ───────────────────────────────────────────────────── -->
    <h2 id="mstatcard" class="mb-4 mt-14 text-headline-small font-medium">MStatCard</h2>

    <ComponentDemo
      title="Stat Cards"
      description="Display key metrics with trend indicators and icons."
      :code="`<template>
  <MStatCard title=&quot;Revenue&quot; value=&quot;$12,450&quot; icon=&quot;payments&quot; :trend=&quot;12.5&quot; trend-label=&quot;vs last month&quot; />
  <MStatCard title=&quot;Users&quot; value=&quot;1,234&quot; icon=&quot;group&quot; :trend=&quot;-3.2&quot; trend-label=&quot;vs last week&quot; color=&quot;secondary&quot; />
  <MStatCard title=&quot;Errors&quot; value=&quot;23&quot; icon=&quot;error&quot; :trend=&quot;8&quot; color=&quot;error&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MStatCard title="Revenue" value="$12,450" icon="payments" :trend="12.5" trend-label="vs last month" />
        <MStatCard title="Users" value="1,234" icon="group" :trend="-3.2" trend-label="vs last week" color="secondary" />
        <MStatCard title="Errors" value="23" icon="error" :trend="8" color="error" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Loading State"
      description="Stat card with a skeleton placeholder while data loads."
      :code="`<template>
  <MStatCard title=&quot;Orders&quot; value=&quot;856&quot; icon=&quot;shopping_cart&quot; :loading=&quot;loading&quot; color=&quot;tertiary&quot; />
</template>`"
    >
      <div class="flex items-center gap-4">
        <div class="w-64">
          <MStatCard title="Orders" value="856" icon="shopping_cart" :loading="statLoading" color="tertiary" />
        </div>
        <MButton variant="tonal" @click="statLoading = !statLoading">
          {{ statLoading ? 'Show' : 'Toggle Loading' }}
        </MButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="statCardProps" />

    <!-- ── MTimeline ───────────────────────────────────────────────────── -->
    <h2 id="mtimeline" class="mb-4 mt-14 text-headline-small font-medium">MTimeline</h2>

    <ComponentDemo
      title="Timeline"
      description="Vertical event timeline with icons and colors."
      :code="`<template>
  <MTimeline :items=&quot;items&quot; />
</template>`"
      :script="`const items = [
  { title: 'Project created', description: 'Initial setup', date: 'Jan 15', icon: 'rocket_launch', color: 'primary' },
  { title: 'First release', description: 'v1.0.0 published', date: 'Feb 20', icon: 'celebration', color: 'success' },
  { title: 'Bug reported', date: 'Mar 5', icon: 'bug_report', color: 'error' },
  { title: 'Patch released', date: 'Mar 7', icon: 'check_circle', color: 'success' },
]`"
    >
      <div class="w-full max-w-lg">
        <MTimeline :items="timelineItems" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Dense"
      description="Compact timeline with less vertical spacing."
      :code="`<template>
  <MTimeline :items=&quot;items&quot; :dense=&quot;true&quot; />
</template>`"
    >
      <div class="w-full max-w-lg">
        <MTimeline :items="timelineItems" :dense="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Alternating"
      description="Items alternate left and right of a central line, with icons and connecting vertical track."
      :code="`<MTimeline :items=&quot;items&quot; :alternating=&quot;true&quot; />`"
      :script="`import { MTimeline } from '@m3ui-vue/m3ui-vue'
import type { TimelineItem } from '@m3ui-vue/m3ui-vue'

const items: TimelineItem[] = [
  { title: 'Project created', description: 'Initial repo setup', date: 'Jan 15', icon: 'rocket_launch', color: 'primary' },
  { title: 'Design approved', description: 'Mockups finalized by the team', date: 'Jan 22', icon: 'design_services', color: 'secondary' },
  { title: 'Sprint 1 done', description: 'Button, Card, TextField shipped', date: 'Feb 5', icon: 'check_circle', color: 'success' },
  { title: 'Critical bug fixed', description: 'Dark mode rendering issue resolved', date: 'Feb 8', icon: 'bug_report', color: 'error' },
  { title: 'v1.0 released', description: 'First stable version in production', date: 'Feb 20', icon: 'celebration', color: 'tertiary' },
]`"
    >
      <div class="w-full">
        <MTimeline
          :items="[
            { title: 'Project created', description: 'Initial repo setup', date: 'Jan 15', icon: 'rocket_launch', color: 'primary' },
            { title: 'Design approved', description: 'Mockups finalized by the team', date: 'Jan 22', icon: 'design_services', color: 'secondary' },
            { title: 'Sprint 1 done', description: 'Button, Card, TextField shipped', date: 'Feb 5', icon: 'check_circle', color: 'success' },
            { title: 'Critical bug fixed', description: 'Dark mode rendering issue resolved', date: 'Feb 8', icon: 'bug_report', color: 'error' },
            { title: 'v1.0 released', description: 'First stable version in production', date: 'Feb 20', icon: 'celebration', color: 'tertiary' },
          ]"
          :alternating="true"
        />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="timelineProps" />

    <!-- ── MSkeleton ───────────────────────────────────────────────────── -->
    <h2 id="mskeleton" class="mb-4 mt-14 text-headline-small font-medium">MSkeleton</h2>

    <ComponentDemo
      title="Variants"
      description="Different skeleton shapes for various content types."
      :code="`<template>
  <MSkeleton variant=&quot;text&quot; />
  <MSkeleton variant=&quot;text&quot; :lines=&quot;3&quot; />
  <MSkeleton variant=&quot;circular&quot; width=&quot;48px&quot; height=&quot;48px&quot; />
  <MSkeleton variant=&quot;rectangular&quot; height=&quot;120px&quot; />
  <MSkeleton variant=&quot;rounded&quot; height=&quot;80px&quot; />
</template>`"
    >
      <div class="grid w-full gap-6 sm:grid-cols-2">
        <div class="space-y-4">
          <div>
            <p class="mb-2 text-label-medium text-on-surface-variant">Text (1 line)</p>
            <MSkeleton variant="text" />
          </div>
          <div>
            <p class="mb-2 text-label-medium text-on-surface-variant">Text (3 lines)</p>
            <MSkeleton variant="text" :lines="3" />
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <p class="mb-2 text-label-medium text-on-surface-variant">Circular</p>
            <MSkeleton variant="circular" width="48px" height="48px" />
          </div>
          <div>
            <p class="mb-2 text-label-medium text-on-surface-variant">Rectangular</p>
            <MSkeleton variant="rectangular" height="80px" />
          </div>
          <div>
            <p class="mb-2 text-label-medium text-on-surface-variant">Rounded</p>
            <MSkeleton variant="rounded" height="60px" />
          </div>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Card Skeleton"
      description="Compose skeletons to build loading placeholders for real UI."
      :code="`<template>
  <MCard class=&quot;w-64 p-4&quot;>
    <div class=&quot;flex items-center gap-3&quot;>
      <MSkeleton variant=&quot;circular&quot; width=&quot;40px&quot; height=&quot;40px&quot; />
      <div class=&quot;flex-1 space-y-2&quot;>
        <MSkeleton variant=&quot;text&quot; width=&quot;60%&quot; />
        <MSkeleton variant=&quot;text&quot; width=&quot;40%&quot; />
      </div>
    </div>
    <MSkeleton variant=&quot;rectangular&quot; height=&quot;120px&quot; class=&quot;mt-4&quot; />
    <MSkeleton variant=&quot;text&quot; :lines=&quot;2&quot; class=&quot;mt-3&quot; />
  </MCard>
</template>`"
    >
      <div class="flex flex-wrap gap-4">
        <MCard class="w-64 p-4">
          <div class="flex items-center gap-3">
            <MSkeleton variant="circular" width="40px" height="40px" />
            <div class="flex-1 space-y-2">
              <MSkeleton variant="text" width="60%" />
              <MSkeleton variant="text" width="40%" />
            </div>
          </div>
          <MSkeleton variant="rectangular" height="120px" class="mt-4" />
          <MSkeleton variant="text" :lines="2" class="mt-3" />
        </MCard>
        <MCard class="w-64 p-4">
          <div class="flex items-center gap-3">
            <MSkeleton variant="circular" width="40px" height="40px" animation="wave" />
            <div class="flex-1 space-y-2">
              <MSkeleton variant="text" width="60%" animation="wave" />
              <MSkeleton variant="text" width="40%" animation="wave" />
            </div>
          </div>
          <MSkeleton variant="rectangular" height="120px" class="mt-4" animation="wave" />
          <MSkeleton variant="text" :lines="2" class="mt-3" animation="wave" />
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="skeletonProps" />

    <!-- ── MEmptyState ─────────────────────────────────────────────────── -->
    <h2 id="memptystate" class="mb-4 mt-14 text-headline-small font-medium">MEmptyState</h2>

    <ComponentDemo
      title="Empty State"
      description="Placeholder for empty views with optional action buttons."
      :code="`<template>
  <MEmptyState
    icon=&quot;search_off&quot;
    title=&quot;No results found&quot;
    description=&quot;Try adjusting your search or filters.&quot;
  >
    <template #actions>
      <MButton variant=&quot;tonal&quot;>Clear filters</MButton>
    </template>
  </MEmptyState>
</template>`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="overflow-hidden">
          <MEmptyState
            icon="search_off"
            title="No results found"
            description="Try adjusting your search or filters to find what you're looking for."
          >
            <template #actions>
              <MButton variant="tonal" icon="filter_alt_off">Clear filters</MButton>
            </template>
          </MEmptyState>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Compact"
      description="A smaller empty state for inline use."
      :code="`<template>
  <MEmptyState icon=&quot;inbox&quot; title=&quot;No messages&quot; :compact=&quot;true&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard variant="outlined" class="overflow-hidden">
          <MEmptyState icon="inbox" title="No messages" description="Your inbox is empty." :compact="true" />
        </MCard>
        <MCard variant="outlined" class="overflow-hidden">
          <MEmptyState icon="notifications_off" title="No notifications" :compact="true" />
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="emptyStateProps" />

    <!-- ── MResult ─────────────────────────────────────────────────────── -->
    <h2 id="mresult" class="mb-4 mt-14 text-headline-small font-medium">MResult</h2>

    <ComponentDemo
      title="Result Pages"
      description="Pre-built result screens for success, errors, and HTTP status codes."
      :code="`<template>
  <MResult status=&quot;success&quot; />
  <MResult status=&quot;error&quot; />
  <MResult status=&quot;404&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard variant="outlined" class="overflow-hidden">
          <MResult status="success" />
        </MCard>
        <MCard variant="outlined" class="overflow-hidden">
          <MResult status="404">
            <template #actions>
              <MButton variant="tonal" icon="home">Go home</MButton>
            </template>
          </MResult>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="All Statuses"
      description="Available status presets with default text."
      :code="`<template>
  <MResult status=&quot;success&quot; />
  <MResult status=&quot;error&quot; />
  <MResult status=&quot;warning&quot; />
  <MResult status=&quot;info&quot; />
  <MResult status=&quot;404&quot; />
  <MResult status=&quot;403&quot; />
  <MResult status=&quot;500&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <MCard v-for="s in (['success', 'error', 'warning', 'info', '404', '403', '500'] as const)" :key="s" variant="outlined" class="overflow-hidden">
          <MResult :status="s" />
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="resultProps" />

    <!-- ── MTree ───────────────────────────────────────────────────────── -->
    <h2 id="mtree" class="mb-4 mt-14 text-headline-small font-medium">MTree</h2>

    <ComponentDemo
      title="Tree View"
      description="Hierarchical tree with expand/collapse and node selection."
      :code="`<template>
  <MTree :nodes=&quot;nodes&quot; :selected=&quot;selected&quot; default-expanded=&quot;all&quot; @update:selected=&quot;selected = $event&quot; />
</template>`"
      :script="`const selected = ref(null)
const nodes = [
  {
    id: 'src', label: 'src', icon: 'folder',
    children: [
      { id: 'components', label: 'components', icon: 'folder',
        children: [
          { id: 'button', label: 'MButton.vue', icon: 'code' },
          { id: 'card', label: 'MCard.vue', icon: 'code' },
        ],
      },
      { id: 'index', label: 'index.ts', icon: 'code' },
    ],
  },
]`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="p-2">
          <MTree
            :nodes="treeNodes"
            :selected="selectedNode"
            default-expanded="all"
            @update:selected="selectedNode = $event"
          />
        </MCard>
        <p v-if="selectedNode" class="mt-2 text-body-medium text-on-surface-variant">
          Selected: {{ selectedNode }}
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Checkable Tree"
      description="Tree with checkboxes and cascading selection."
      :code="`<template>
  <MTree :nodes=&quot;nodes&quot; :checkable=&quot;true&quot; :checked=&quot;checked&quot; default-expanded=&quot;all&quot; @update:checked=&quot;checked = $event&quot; />
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="p-2">
          <MTree
            :nodes="treeNodes"
            :checkable="true"
            :checked="checkedNodes"
            default-expanded="all"
            @update:checked="checkedNodes = $event"
          />
        </MCard>
        <p v-if="checkedNodes.length" class="mt-2 text-body-medium text-on-surface-variant">
          Checked: {{ checkedNodes.join(', ') }}
        </p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="treeProps" />

    <!-- ── MList ───────────────────────────────────────────────────────── -->
    <h2 id="mlist" class="mb-4 mt-14 text-headline-small font-medium">MList</h2>

    <ComponentDemo
      title="Basic List"
      description="Simple one-line and two-line list items with icons."
      :code="`<template>
  <MList>
    <MListItem title=&quot;Inbox&quot; icon=&quot;inbox&quot; trailing-text=&quot;24&quot; />
    <MListItem title=&quot;Starred&quot; icon=&quot;star&quot; />
    <MListItem title=&quot;Sent&quot; icon=&quot;send&quot; />
    <MListItem title=&quot;Drafts&quot; icon=&quot;drafts&quot; trailing-text=&quot;3&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MList>
            <MListItem title="Inbox" icon="inbox" trailing-text="24" />
            <MListItem title="Starred" icon="star" />
            <MListItem title="Sent" icon="send" />
            <MListItem title="Drafts" icon="drafts" trailing-text="3" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Two-Line Items"
      description="Items with title and subtitle for additional context."
      :code="`<template>
  <MList :dividers=&quot;true&quot;>
    <MListItem title=&quot;Wi-Fi&quot; subtitle=&quot;Connected to HomeNetwork&quot; icon=&quot;wifi&quot; />
    <MListItem title=&quot;Bluetooth&quot; subtitle=&quot;Galaxy Buds Pro&quot; icon=&quot;bluetooth&quot; />
    <MListItem title=&quot;Mobile data&quot; subtitle=&quot;4G LTE&quot; icon=&quot;signal_cellular_alt&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MList :dividers="true">
            <MListItem title="Wi-Fi" subtitle="Connected to HomeNetwork" icon="wifi" />
            <MListItem title="Bluetooth" subtitle="Galaxy Buds Pro" icon="bluetooth" />
            <MListItem title="Mobile data" subtitle="4G LTE" icon="signal_cellular_alt" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Three-Line Items"
      description="Rich items with title, subtitle, and description."
      :code="`<template>
  <MList :dividers=&quot;'inset'&quot;>
    <MListItem
      title=&quot;Alice Brown&quot;
      subtitle=&quot;Project update&quot;
      description=&quot;Hey team, just pushed the latest changes to the staging branch. Let me know if you see any issues.&quot;
      leading=&quot;avatar&quot;
      avatar-name=&quot;Alice Brown&quot;
      trailing-text=&quot;3m&quot;
    />
    <MListItem
      title=&quot;Carlos Diaz&quot;
      subtitle=&quot;Design review&quot;
      description=&quot;I've uploaded the new mockups for the dashboard. The color scheme follows our M3 guidelines.&quot;
      leading=&quot;avatar&quot;
      avatar-name=&quot;Carlos Diaz&quot;
      trailing-text=&quot;1h&quot;
    />
  </MList>
</template>`"
    >
      <div class="w-full max-w-md">
        <MCard variant="outlined" class="overflow-hidden">
          <MList dividers="inset">
            <MListItem
              title="Alice Brown"
              subtitle="Project update"
              description="Hey team, just pushed the latest changes to the staging branch. Let me know if you see any issues."
              leading="avatar"
              avatar-name="Alice Brown"
              trailing-text="3m"
            />
            <MListItem
              title="Carlos Diaz"
              subtitle="Design review"
              description="I've uploaded the new mockups for the dashboard. The color scheme follows our M3 guidelines."
              leading="avatar"
              avatar-name="Carlos Diaz"
              trailing-text="1h"
            />
            <MListItem
              title="Eva Flores"
              subtitle="Sprint planning"
              description="Let's schedule a meeting this week to discuss the roadmap and prioritize the backlog items."
              leading="avatar"
              avatar-name="Eva Flores"
              trailing-text="2h"
            />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Icon Containers"
      description="Colored icon containers for settings-style lists."
      :code="`<template>
  <MList>
    <MListItem title=&quot;Account&quot; subtitle=&quot;Privacy, security, language&quot; icon=&quot;person&quot; leading=&quot;icon-container&quot; icon-container-color=&quot;primary&quot; trailing-icon=&quot;chevron_right&quot; />
    <MListItem title=&quot;Notifications&quot; subtitle=&quot;Alerts, sounds, vibration&quot; icon=&quot;notifications&quot; leading=&quot;icon-container&quot; icon-container-color=&quot;secondary&quot; trailing-icon=&quot;chevron_right&quot; />
    <MListItem title=&quot;Storage&quot; subtitle=&quot;12.4 GB used of 64 GB&quot; icon=&quot;storage&quot; leading=&quot;icon-container&quot; icon-container-color=&quot;tertiary&quot; trailing-icon=&quot;chevron_right&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MList>
            <MListItem title="Account" subtitle="Privacy, security, language" icon="person" leading="icon-container" icon-container-color="primary" trailing-icon="chevron_right" />
            <MListItem title="Notifications" subtitle="Alerts, sounds, vibration" icon="notifications" leading="icon-container" icon-container-color="secondary" trailing-icon="chevron_right" />
            <MListItem title="Storage" subtitle="12.4 GB used of 64 GB" icon="storage" leading="icon-container" icon-container-color="tertiary" trailing-icon="chevron_right" />
            <MListItem title="Battery" subtitle="87% — About 14h left" icon="battery_5_bar" leading="icon-container" icon-container-color="success" trailing-icon="chevron_right" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With Switches"
      description="Toggle settings using trailing switches."
      :code="`<template>
  <MList>
    <MListItem title=&quot;Dark Mode&quot; icon=&quot;dark_mode&quot; trailing=&quot;switch&quot; :trailing-value=&quot;darkMode&quot; @update:trailing-value=&quot;darkMode = $event&quot; />
    <MListItem title=&quot;Notifications&quot; icon=&quot;notifications&quot; trailing=&quot;switch&quot; :trailing-value=&quot;notifications&quot; @update:trailing-value=&quot;notifications = $event&quot; />
    <MListItem title=&quot;Auto-update&quot; icon=&quot;system_update&quot; trailing=&quot;switch&quot; :trailing-value=&quot;autoUpdate&quot; @update:trailing-value=&quot;autoUpdate = $event&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MList>
            <MListItem title="Dark Mode" icon="dark_mode" trailing="switch" :trailing-value="darkMode" @update:trailing-value="darkMode = $event" />
            <MListItem title="Notifications" icon="notifications" trailing="switch" :trailing-value="notifications" @update:trailing-value="notifications = $event" />
            <MListItem title="Auto-update" icon="system_update" trailing="switch" :trailing-value="autoUpdate" @update:trailing-value="autoUpdate = $event" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Navigation List"
      description="Nav variant with rounded active items, ideal for drawers."
      :code="`<template>
  <MList :nav=&quot;true&quot; :selectable=&quot;true&quot; :selected=&quot;selected&quot; @update:selected=&quot;selected = $event&quot;>
    <MListItem title=&quot;Inbox&quot; icon=&quot;inbox&quot; value=&quot;inbox&quot; />
    <MListItem title=&quot;Starred&quot; icon=&quot;star&quot; value=&quot;starred&quot; />
    <MListItem title=&quot;Sent&quot; icon=&quot;send&quot; value=&quot;sent&quot; />
    <MListSubheader>Labels</MListSubheader>
    <MListItem title=&quot;Important&quot; icon=&quot;label_important&quot; value=&quot;important&quot; />
    <MListItem title=&quot;Work&quot; icon=&quot;label&quot; value=&quot;work&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-xs">
        <MCard variant="outlined" class="overflow-hidden">
          <MList :nav="true" :selectable="true" :selected="listSelected" @update:selected="listSelected = $event">
            <MListItem title="Inbox" icon="inbox" value="inbox" />
            <MListItem title="Starred" icon="star" value="starred" />
            <MListItem title="Sent" icon="send" value="sent" />
            <MListSubheader>Labels</MListSubheader>
            <MListItem title="Important" icon="label_important" value="important" />
            <MListItem title="Work" icon="label" value="work" />
          </MList>
        </MCard>
        <p v-if="listSelected" class="mt-2 text-body-medium text-on-surface-variant">
          Selected: {{ listSelected }}
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Dense & Sections"
      description="Compact list with subheaders dividing sections."
      :code="`<template>
  <MList :dense=&quot;true&quot; :dividers=&quot;true&quot;>
    <MListSubheader>Folders</MListSubheader>
    <MListItem title=&quot;Photos&quot; icon=&quot;photo_library&quot; trailing-text=&quot;245&quot; />
    <MListItem title=&quot;Documents&quot; icon=&quot;description&quot; trailing-text=&quot;18&quot; />
    <MListSubheader>Files</MListSubheader>
    <MListItem title=&quot;resume.pdf&quot; icon=&quot;picture_as_pdf&quot; trailing-text=&quot;2.4 MB&quot; />
    <MListItem title=&quot;notes.txt&quot; icon=&quot;text_snippet&quot; trailing-text=&quot;12 KB&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MList :dense="true" :dividers="true">
            <MListSubheader>Folders</MListSubheader>
            <MListItem title="Photos" icon="photo_library" trailing-text="245" />
            <MListItem title="Documents" icon="description" trailing-text="18" />
            <MListItem title="Downloads" icon="download" trailing-text="7" />
            <MListSubheader>Files</MListSubheader>
            <MListItem title="resume.pdf" icon="picture_as_pdf" trailing-text="2.4 MB" />
            <MListItem title="notes.txt" icon="text_snippet" trailing-text="12 KB" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Disabled Items"
      description="Items can be individually disabled."
      :code="`<template>
  <MList>
    <MListItem title=&quot;Available&quot; icon=&quot;check_circle&quot; />
    <MListItem title=&quot;Unavailable&quot; icon=&quot;block&quot; :disabled=&quot;true&quot; />
    <MListItem title=&quot;Premium only&quot; icon=&quot;lock&quot; :disabled=&quot;true&quot; subtitle=&quot;Upgrade to unlock&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MList>
            <MListItem title="Available" icon="check_circle" :clickable="true" />
            <MListItem title="Unavailable" icon="block" :disabled="true" />
            <MListItem title="Premium only" icon="lock" :disabled="true" subtitle="Upgrade to unlock" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Expandable Items"
      description="Collapsible children, similar to MNavigationDrawer sections."
      :code="`<template>
  <MList>
    <MListItem title=&quot;Inbox&quot; icon=&quot;inbox&quot; :expandable=&quot;true&quot;>
      <template #children>
        <MListItem title=&quot;Primary&quot; icon=&quot;label&quot; />
        <MListItem title=&quot;Social&quot; icon=&quot;group&quot; />
        <MListItem title=&quot;Promotions&quot; icon=&quot;local_offer&quot; />
      </template>
    </MListItem>
    <MListItem title=&quot;Sent&quot; icon=&quot;send&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MList>
            <MListItem title="Inbox" icon="inbox" :expandable="true">
              <template #children>
                <MListItem title="Primary" icon="label" />
                <MListItem title="Social" icon="group" />
                <MListItem title="Promotions" icon="local_offer" />
              </template>
            </MListItem>
            <MListItem title="Starred" icon="star" :expandable="true">
              <template #children>
                <MListItem title="Work" icon="work" />
                <MListItem title="Personal" icon="person" />
              </template>
            </MListItem>
            <MListItem title="Sent" icon="send" />
            <MListItem title="Trash" icon="delete" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Segmented"
      description="Each item has its own background and rounded corners, visually grouping them as separate segments."
      :code="`<MList :segmented=&quot;true&quot; :selectable=&quot;true&quot; v-model:selected=&quot;selected&quot;>
  <MListItem title=&quot;General&quot; icon=&quot;settings&quot; value=&quot;general&quot; />
  <MListItem title=&quot;Privacy&quot; icon=&quot;lock&quot; value=&quot;privacy&quot; />
</MList>`"
    >
      <div class="grid w-full gap-6 sm:grid-cols-2">
        <MCard class="p-0">
          <p class="px-4 pt-4 pb-1 text-title-small font-medium text-on-surface">Settings</p>
          <MList :segmented="true" :selectable="true" v-model:selected="listSelected">
            <MListItem title="General" subtitle="App preferences" icon="settings" value="general" />
            <MListItem title="Notifications" subtitle="Alerts and sounds" icon="notifications" value="notifications" />
            <MListItem title="Privacy" subtitle="Data and permissions" icon="lock" value="privacy" />
            <MListItem title="Storage" subtitle="Manage local data" icon="storage" value="storage" />
          </MList>
        </MCard>
        <MCard class="p-0">
          <p class="px-4 pt-4 pb-1 text-title-small font-medium text-on-surface">Account</p>
          <MList :segmented="true">
            <MListItem title="Profile" subtitle="fadel@example.com" icon="person" :clickable="true" trailing-icon="chevron_right" />
            <MListItem title="Security" subtitle="Password and 2FA" icon="shield" :clickable="true" trailing-icon="chevron_right" />
            <MListItem title="Sign out" icon="logout" :clickable="true" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">MList Props</h3>
    <PropsTable :props="listProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MListItem Props</h3>
    <PropsTable :props="listItemProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MListSubheader Props</h3>
    <PropsTable :props="listSubheaderProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <MCard variant="outlined" class="overflow-x-auto p-4">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant text-left">
            <th class="pb-2 pr-4 font-medium">Component</th>
            <th class="pb-2 pr-4 font-medium">Slot</th>
            <th class="pb-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="py-2 pr-4 font-mono text-body-small">MList</td><td class="py-2 pr-4 font-mono text-body-small">#default</td><td class="py-2 text-on-surface-variant">List items and subheaders</td></tr>
          <tr><td class="py-2 pr-4 font-mono text-body-small">MListItem</td><td class="py-2 pr-4 font-mono text-body-small">#default</td><td class="py-2 text-on-surface-variant">Custom content (overrides title/subtitle)</td></tr>
          <tr><td class="py-2 pr-4 font-mono text-body-small">MListItem</td><td class="py-2 pr-4 font-mono text-body-small">#leading</td><td class="py-2 text-on-surface-variant">Custom leading element</td></tr>
          <tr><td class="py-2 pr-4 font-mono text-body-small">MListItem</td><td class="py-2 pr-4 font-mono text-body-small">#trailing</td><td class="py-2 text-on-surface-variant">Custom trailing element</td></tr>
          <tr><td class="py-2 pr-4 font-mono text-body-small">MListItem</td><td class="py-2 pr-4 font-mono text-body-small">#children</td><td class="py-2 text-on-surface-variant">Expandable nested content (requires expandable prop)</td></tr>
        </tbody>
      </table>
    </MCard>

    <!-- ── MEmoji ──────────────────────────────────────────────────────── -->
    <h2 id="memoji" class="mb-4 mt-14 text-headline-small font-medium">MEmoji</h2>

    <ComponentDemo
      title="Emoji Display"
      description="Render an emoji at any size with accessible labeling."
      :code="`<MEmoji emoji=&quot;🚀&quot; :size=&quot;48&quot; label=&quot;Rocket&quot; />`"
      :script="`import { MEmoji } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex items-end gap-4">
        <MEmoji emoji="😀" :size="20" />
        <MEmoji emoji="🚀" :size="32" />
        <MEmoji emoji="🎉" :size="48" />
        <MEmoji emoji="🐶" :size="64" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="emojiProps" />

    <!-- ── MEmojiButton ────────────────────────────────────────────────── -->
    <h2 id="memojibutton" class="mb-4 mt-14 text-headline-small font-medium">MEmojiButton</h2>

    <ComponentDemo
      title="Discord-style Hover"
      description="Hover the button to see random emojis cycle. Click to trigger."
      :code="`<MEmojiButton emoji=&quot;😎&quot; @click=&quot;onPick&quot; />`"
      :script="`import { MEmojiButton } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <MEmojiButton emoji="😎" :size="32" @click="(e: string) => selectedEmoji = e" />
          <span class="text-label-small text-on-surface-variant">All</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MEmojiButton emoji="🐱" :size="32" category="animals" @click="(e: string) => selectedEmoji = e" />
          <span class="text-label-small text-on-surface-variant">Animals</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MEmojiButton emoji="🍕" :size="32" category="food" @click="(e: string) => selectedEmoji = e" />
          <span class="text-label-small text-on-surface-variant">Food</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MEmojiButton emoji="😊" :size="32" :random-on-hover="false" @click="(e: string) => selectedEmoji = e" />
          <span class="text-label-small text-on-surface-variant">No random</span>
        </div>
        <p v-if="selectedEmoji" class="ml-4 text-body-large">
          Picked: <span class="text-headline-medium">{{ selectedEmoji }}</span>
        </p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="emojiButtonProps" />

    <!-- ── MEmojiSelector ──────────────────────────────────────────────── -->
    <h2 id="memojiselector" class="mb-4 mt-14 text-headline-small font-medium">MEmojiSelector</h2>

    <ComponentDemo
      title="Emoji Picker"
      description="Full emoji picker with categories, search, and click-to-select."
      :code="`<MEmojiSelector @select=&quot;onSelect&quot; />`"
      :script="`import { MEmojiSelector } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex w-full flex-col gap-4 sm:flex-row">
        <div class="w-full sm:w-80">
          <MEmojiSelector @select="(e: string) => selectedEmoji = e" />
        </div>
        <div v-if="selectedEmoji" class="flex items-center gap-3">
          <span class="text-6xl">{{ selectedEmoji }}</span>
          <span class="text-body-large text-on-surface-variant">Selected</span>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="emojiSelectorProps" />

    <!-- ── MCarousel ───────────────────────────────────────────────────── -->
    <h2 id="mcarousel" class="mb-4 mt-14 text-headline-small font-medium">MCarousel</h2>

    <ComponentDemo
      title="Hero"
      description="One prominent item with adjacent items peeking from the sides. Items scale and parallax as you scroll. Default layout."
      :code="`<MCarousel :items=&quot;items&quot; layout=&quot;hero&quot; />`"
    >
      <div class="w-full">
        <MCarousel :items="carouselItems" layout="hero" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Multi-browse"
      description="Multiple items visible at once. Configure how many with visibleItems."
      :code="`<MCarousel :items=&quot;items&quot; layout=&quot;multi-browse&quot; :visible-items=&quot;3&quot; />`"
    >
      <div class="w-full">
        <MCarousel :items="carouselItems" layout="multi-browse" :visible-items="3" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Uncontained Multi-Aspect Ratio"
      description="Items with different widths based on their ratio property. Static widths."
      :code="`<MCarousel :items=&quot;items&quot; layout=&quot;uncontained&quot; />`"
    >
      <div class="w-full">
        <MCarousel :items="carouselMultiRatio" layout="uncontained" height="260px" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Uncontained Animated"
      description="With animated prop, items smoothly grow as they approach the center and shrink as they move away. The protagonist item expands while others contract."
      :code="`<MCarousel :items=&quot;items&quot; layout=&quot;uncontained&quot; :animated=&quot;true&quot; />`"
    >
      <div class="w-full">
        <MCarousel :items="carouselMultiRatio" layout="uncontained" height="260px" :animated="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Autoplay"
      description="Auto-advance with hero layout. Pauses on hover."
      :code="`<MCarousel :items=&quot;items&quot; :autoplay=&quot;true&quot; :interval=&quot;3000&quot; />`"
    >
      <div class="w-full">
        <MCarousel :items="carouselItems" :autoplay="true" :interval="3000" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="carouselProps" />

    <!-- ── MChatBubble ─────────────────────────────────────────────────── -->
    <h2 id="mchatbubble" class="mb-4 mt-14 text-headline-small font-medium">MChatBubble</h2>

    <ComponentDemo
      title="Chat Conversation"
      description="Chat message bubbles with sender names, avatars, timestamps, and read status. Left side for received messages, right for sent."
      :code="`<MChatBubble
  text=&quot;Hey! How's the project going?&quot;
  sender=&quot;Alex&quot;
  avatar=&quot;Alex&quot;
  time=&quot;10:32&quot;
  side=&quot;left&quot;
/>
<MChatBubble
  text=&quot;Almost done, finishing the UI components.&quot;
  time=&quot;10:33&quot;
  side=&quot;right&quot;
  status=&quot;read&quot;
/>
<MChatBubble
  text=&quot;Nice! Can you show me a preview?&quot;
  sender=&quot;Alex&quot;
  avatar=&quot;Alex&quot;
  time=&quot;10:34&quot;
  side=&quot;left&quot;
/>
<MChatBubble
  text=&quot;Sure, give me 5 minutes 👍&quot;
  time=&quot;10:35&quot;
  side=&quot;right&quot;
  status=&quot;delivered&quot;
/>`"
    >
      <div class="mx-auto w-full max-w-md space-y-2 rounded-xl bg-surface-container-low p-4">
        <MChatBubble text="Hey! How's the project going? I saw the repo had some new commits this morning and wanted to check in." sender="Alex" avatar="Alex" time="10:32" side="left" />
        <MChatBubble text="Almost done! I've been working on the input components — autocomplete, tag input, and multi-select are all ready. Just polishing some edge cases with the icon alignment." time="10:33" side="right" status="read" />
        <MChatBubble text="Nice! Can you show me a preview? I'd love to see how the chat bubble component turned out, especially with the different color variants." sender="Alex" avatar="Alex" time="10:34" side="left" />
        <MChatBubble text="Sure, give me 5 minutes 👍" time="10:35" side="right" status="delivered" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Colors & Status"
      description="Change the bubble color with the color prop. Status indicators show sent, delivered, and read states."
      :code="`<MChatBubble text=&quot;Primary bubble&quot; side=&quot;right&quot; color=&quot;primary&quot; status=&quot;read&quot; time=&quot;now&quot; />
<MChatBubble text=&quot;Secondary bubble&quot; side=&quot;right&quot; color=&quot;secondary&quot; status=&quot;delivered&quot; time=&quot;now&quot; />
<MChatBubble text=&quot;Tertiary bubble&quot; side=&quot;right&quot; color=&quot;tertiary&quot; status=&quot;sent&quot; time=&quot;now&quot; />`"
    >
      <div class="mx-auto w-full max-w-md space-y-2 rounded-xl bg-surface-container-low p-4">
        <MChatBubble text="Primary bubble (read)" side="right" color="primary" status="read" time="now" />
        <MChatBubble text="Secondary bubble (delivered)" side="right" color="secondary" status="delivered" time="now" />
        <MChatBubble text="Tertiary bubble (sent)" side="right" color="tertiary" status="sent" time="now" />
        <MChatBubble text="Received message — always uses surface colors" sender="Bot" avatar="Bot" side="left" time="now" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Without Tail"
      description="Set tail to false for a fully rounded bubble — useful for consecutive messages from the same sender."
      :code="`<MChatBubble text=&quot;First message&quot; sender=&quot;Alex&quot; avatar=&quot;Alex&quot; time=&quot;10:30&quot; />
<MChatBubble text=&quot;Second message&quot; :tail=&quot;false&quot; time=&quot;10:30&quot; />
<MChatBubble text=&quot;Third message&quot; :tail=&quot;false&quot; time=&quot;10:31&quot; />`"
    >
      <div class="mx-auto w-full max-w-md space-y-1 rounded-xl bg-surface-container-low p-4">
        <MChatBubble text="First message from Alex" sender="Alex" avatar="Alex" time="10:30" />
        <MChatBubble text="Followed by another one" :tail="false" time="10:30" side="left" />
        <MChatBubble text="And a third" :tail="false" time="10:31" side="left" />
        <MChatBubble text="Got it!" time="10:32" side="right" status="read" />
        <MChatBubble text="Will reply soon" :tail="false" time="10:32" side="right" status="read" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Max Width"
      description="Control the maximum bubble width with the maxWidth prop. Accepts px, %, or CSS variables for responsive control."
      :code="`<MChatBubble
  text=&quot;This bubble is limited to 200px max width, so longer text will wrap earlier.&quot;
  max-width=&quot;200px&quot;
  side=&quot;right&quot;
  time=&quot;now&quot;
  status=&quot;read&quot;
/>
<MChatBubble
  text=&quot;This one uses the default 320px max width, giving more room for longer messages before wrapping.&quot;
  side=&quot;left&quot;
  sender=&quot;Alex&quot;
  time=&quot;now&quot;
/>
<!-- Responsive via CSS variable -->
<div class=&quot;[--chat-w:240px] md:[--chat-w:320px]&quot;>
  <MChatBubble text=&quot;Responsive width&quot; max-width=&quot;var(--chat-w)&quot; />
</div>`"
    >
      <div class="mx-auto w-full max-w-md space-y-2 rounded-xl bg-surface-container-low p-4">
        <MChatBubble text="Narrow bubble (200px). Long text wraps much earlier than the default." max-width="200px" side="right" time="now" status="read" />
        <MChatBubble text="Default width (320px). This gives more room for longer messages before they start wrapping to a new line." side="left" sender="Alex" avatar="Alex" time="now" />
        <MChatBubble text="Wide bubble (400px). Plenty of space — only very long messages will wrap at this width." max-width="400px" side="right" time="now" status="delivered" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Content"
      description="Use the default slot to put anything inside the bubble — images, cards, buttons, or any custom layout."
      :code="`<MChatBubble side=&quot;left&quot; sender=&quot;Alex&quot; avatar=&quot;Alex&quot; time=&quot;10:40&quot;>
  <p class=&quot;text-body-medium&quot;>Check out this photo from the trip!</p>
  <img src=&quot;...&quot; class=&quot;mt-2 rounded-lg&quot; />
</MChatBubble>

<MChatBubble side=&quot;right&quot; time=&quot;10:41&quot; status=&quot;read&quot;>
  <p class=&quot;text-body-medium&quot;>That looks amazing! 🤩</p>
  <div class=&quot;mt-2 flex gap-1&quot;>
    <MChip size=&quot;small&quot; icon=&quot;favorite&quot;>Love it</MChip>
    <MChip size=&quot;small&quot; icon=&quot;bookmark&quot;>Save</MChip>
  </div>
</MChatBubble>`"
    >
      <div class="mx-auto w-full max-w-md space-y-2 rounded-xl bg-surface-container-low p-4">
        <MChatBubble side="left" sender="Alex" avatar="Alex" time="10:40">
          <p class="text-body-medium">Check out this view from the office! 🏔️</p>
          <div class="mt-2 flex h-32 items-center justify-center rounded-lg bg-on-surface/10">
            <MIcon name="image" :size="32" class="text-on-surface-variant/40" />
          </div>
        </MChatBubble>
        <MChatBubble side="right" time="10:41" status="read">
          <p class="text-body-medium">That looks amazing! 🤩</p>
          <div class="mt-2 flex gap-1">
            <MChip size="small" icon="favorite">Love it</MChip>
            <MChip size="small" icon="bookmark">Save</MChip>
          </div>
        </MChatBubble>
        <MChatBubble side="left" sender="Alex" avatar="Alex" time="10:42" :tail="false">
          <div class="rounded-lg bg-on-surface/10 p-3">
            <p class="text-label-small font-medium">📎 project-specs.pdf</p>
            <p class="text-label-small text-on-surface-variant">2.4 MB — PDF Document</p>
          </div>
        </MChatBubble>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="chatBubbleProps" />

    <MCard class="mt-4 border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Slots</p>
      <pre class="overflow-x-auto rounded-lg bg-surface-container p-3 text-body-small"><code>#default  — Custom content inside the bubble (replaces the text prop).
           Use for images, files, buttons, or any custom layout.</code></pre>
    </MCard>
  </div>
</template>
