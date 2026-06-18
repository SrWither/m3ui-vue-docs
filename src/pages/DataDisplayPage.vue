<script setup lang="ts">
import { ref } from 'vue'
import {
  MCard, MChip, MBadge, MAvatar, MIcon, MDivider, MButton, MIconButton,
  MStatCard, MTimeline, MSkeleton, MEmptyState, MResult, MTree,
} from '@m3ui-vue/m3ui-vue'
import type { TimelineItem, TreeNode } from '@m3ui-vue/m3ui-vue'
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
]

const avatarProps: PropDef[] = [
  { name: 'name', type: 'string', description: 'Full name — initials are extracted automatically' },
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
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Data Display</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Components for presenting content, status indicators, and visual elements.
    </p>

    <!-- ── MCard ────────────────────────────────────────────────────────── -->
    <h2 class="mb-4 text-headline-small font-medium">MCard</h2>

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
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MChip</h2>

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
      :code="`<script setup>
const selected = ref(true)
<\/script>

<template>
  <MChip icon=&quot;code&quot;>With icon</MChip>
  <MChip :clickable=&quot;true&quot; tone=&quot;primary&quot; @click=&quot;handleClick&quot;>Clickable</MChip>
  <MChip :selected=&quot;selected&quot; :clickable=&quot;true&quot; tone=&quot;primary&quot; @click=&quot;selected = !selected&quot;>
    Selectable
  </MChip>
  <MChip :removable=&quot;true&quot; tone=&quot;tertiary&quot; @remove=&quot;handleRemove&quot;>Removable</MChip>
</template>`"
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
      :code="`<script setup>
const chips = ref(['Vue', 'React', 'Svelte'])

function remove(label) {
  chips.value = chips.value.filter(c => c !== label)
}
<\/script>

<template>
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
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MBadge</h2>

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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="badgeProps" />

    <!-- ── MAvatar ──────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MAvatar</h2>

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
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MIcon</h2>

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
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MDivider</h2>

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
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MStatCard</h2>

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
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MTimeline</h2>

    <ComponentDemo
      title="Timeline"
      description="Vertical event timeline with icons and colors."
      :code="`<script setup>
const items = [
  { title: 'Project created', description: 'Initial setup', date: 'Jan 15', icon: 'rocket_launch', color: 'primary' },
  { title: 'First release', description: 'v1.0.0 published', date: 'Feb 20', icon: 'celebration', color: 'success' },
  { title: 'Bug reported', date: 'Mar 5', icon: 'bug_report', color: 'error' },
  { title: 'Patch released', date: 'Mar 7', icon: 'check_circle', color: 'success' },
]
<\/script>

<template>
  <MTimeline :items=&quot;items&quot; />
</template>`"
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="timelineProps" />

    <!-- ── MSkeleton ───────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MSkeleton</h2>

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
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MEmptyState</h2>

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
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MResult</h2>

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
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MTree</h2>

    <ComponentDemo
      title="Tree View"
      description="Hierarchical tree with expand/collapse and node selection."
      :code="`<script setup>
const selected = ref(null)
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
]
<\/script>

<template>
  <MTree :nodes=&quot;nodes&quot; :selected=&quot;selected&quot; default-expanded=&quot;all&quot; @update:selected=&quot;selected = $event&quot; />
</template>`"
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
  </div>
</template>
