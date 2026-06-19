<script setup lang="ts">
import { ref } from 'vue'
import {
  MContainer, MGrid, MStack, MSplitter, MMasonry, MCard, MButton,
  MText, MTitle, MSubtitle, MFlex, MSpacer, MCenter, MBox, MSection, MResponsive,
  MIconButton, MSpinner, MRelative, MAbsolute, MFixed, MSticky, MFullscreen,
  MScrollable, MAspectRatio, MAppLayout, MOverlay, MIcon, MBadge, MFab,
} from '@m3ui-vue/m3ui-vue'
import type { TextVariant } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const containerProps: PropDef[] = [
  { name: 'maxWidth', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'", default: "'lg'", description: 'Maximum width breakpoint' },
  { name: 'fluid', type: 'boolean', default: 'false', description: 'Full-width (no max constraint)' },
  { name: 'centered', type: 'boolean', default: 'true', description: 'Center horizontally with mx-auto' },
  { name: 'padding', type: 'boolean', default: 'true', description: 'Add responsive horizontal padding' },
]

const gridProps: PropDef[] = [
  { name: 'cols', type: '1 | 2 | 3 | 4 | 5 | 6 | 12', default: '1', description: 'Default column count' },
  { name: 'sm', type: '1 | 2 | 3 | 4 | 5 | 6 | 12', description: 'Columns at sm breakpoint' },
  { name: 'md', type: '1 | 2 | 3 | 4 | 5 | 6 | 12', description: 'Columns at md breakpoint' },
  { name: 'lg', type: '1 | 2 | 3 | 4 | 5 | 6 | 12', description: 'Columns at lg breakpoint' },
  { name: 'xl', type: '1 | 2 | 3 | 4 | 5 | 6 | 12', description: 'Columns at xl breakpoint' },
  { name: 'gap', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Gap between items' },
  { name: 'alignItems', type: "'start' | 'center' | 'end' | 'stretch'", default: "'stretch'", description: 'Vertical alignment' },
]

const stackProps: PropDef[] = [
  { name: 'direction', type: "'column' | 'row'", default: "'column'", description: 'Stack direction' },
  { name: 'gap', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Gap between items' },
  { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'stretch'", description: 'Cross-axis alignment' },
  { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'", description: 'Main-axis alignment' },
  { name: 'wrap', type: 'boolean', default: 'false', description: 'Allow items to wrap' },
  { name: 'divider', type: 'boolean', default: 'false', description: 'Show dividers between items' },
  { name: 'inline', type: 'boolean', default: 'false', description: 'Use inline-flex' },
]

const splitterProps: PropDef[] = [
  { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Split direction' },
  { name: 'initialSplit', type: 'number', default: '50', description: 'Initial split percentage' },
  { name: 'min', type: 'number', default: '10', description: 'Minimum panel percentage' },
  { name: 'max', type: 'number', default: '90', description: 'Maximum panel percentage' },
]

const masonryProps: PropDef[] = [
  { name: 'cols', type: 'number', default: '2', description: 'Default column count' },
  { name: 'smCols', type: 'number', description: 'Columns at sm breakpoint' },
  { name: 'mdCols', type: 'number', description: 'Columns at md breakpoint' },
  { name: 'lgCols', type: 'number', description: 'Columns at lg breakpoint' },
  { name: 'gap', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Gap between items' },
]

const masonryItems = [
  { title: 'Card 1', height: 'h-24', color: 'bg-primary-container text-on-primary-container' },
  { title: 'Card 2', height: 'h-36', color: 'bg-secondary-container text-on-secondary-container' },
  { title: 'Card 3', height: 'h-20', color: 'bg-tertiary-container text-on-tertiary-container' },
  { title: 'Card 4', height: 'h-32', color: 'bg-primary-container text-on-primary-container' },
  { title: 'Card 5', height: 'h-28', color: 'bg-secondary-container text-on-secondary-container' },
  { title: 'Card 6', height: 'h-40', color: 'bg-tertiary-container text-on-tertiary-container' },
]

const textProps: PropDef[] = [
  { name: 'variant', type: "'display-large' | 'display-medium' | 'display-small' | 'headline-large' | 'headline-medium' | 'headline-small' | 'title-large' | 'title-medium' | 'title-small' | 'body-large' | 'body-medium' | 'body-small' | 'label-large' | 'label-medium' | 'label-small'", default: "'body-medium'", description: 'Typography variant from the Material 3 type scale' },
  { name: 'tag', type: 'string', default: 'auto', description: 'HTML tag to render (auto-selected based on variant)' },
  { name: 'color', type: "'on-surface' | 'on-surface-variant' | 'primary' | 'secondary' | 'tertiary' | 'error' | 'inherit'", default: "'inherit'", description: 'Text color' },
  { name: 'align', type: "'left' | 'center' | 'right'", default: "'left'", description: 'Text alignment' },
  { name: 'truncate', type: 'boolean', default: 'false', description: 'Truncate text with ellipsis on overflow' },
  { name: 'lines', type: 'number', description: 'Clamp text to a specific number of lines' },
  { name: 'weight', type: "'regular' | 'medium' | 'bold'", description: 'Font weight override' },
]

const titleProps: PropDef[] = [
  { name: 'size', type: "'large' | 'medium' | 'small'", default: "'large'", description: 'Title size' },
  { name: 'color', type: "'on-surface' | 'on-surface-variant' | 'primary' | 'secondary' | 'tertiary' | 'error' | 'inherit'", default: "'inherit'", description: 'Text color' },
  { name: 'align', type: "'left' | 'center' | 'right'", default: "'left'", description: 'Text alignment' },
  { name: 'truncate', type: 'boolean', default: 'false', description: 'Truncate text with ellipsis on overflow' },
]

const subtitleProps: PropDef[] = [
  { name: 'size', type: "'large' | 'medium' | 'small'", default: "'large'", description: 'Subtitle size' },
  { name: 'color', type: "'on-surface' | 'on-surface-variant' | 'primary' | 'secondary' | 'tertiary' | 'error' | 'inherit'", default: "'on-surface-variant'", description: 'Text color' },
  { name: 'align', type: "'left' | 'center' | 'right'", default: "'left'", description: 'Text alignment' },
  { name: 'truncate', type: 'boolean', default: 'false', description: 'Truncate text with ellipsis on overflow' },
]

const flexProps: PropDef[] = [
  { name: 'direction', type: "'row' | 'column' | 'row-reverse' | 'column-reverse'", default: "'row'", description: 'Flex direction' },
  { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'stretch'", description: 'Cross-axis alignment (align-items)' },
  { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'", description: 'Main-axis alignment (justify-content)' },
  { name: 'gap', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'none'", description: 'Gap between items' },
  { name: 'wrap', type: 'boolean', default: 'false', description: 'Allow items to wrap' },
  { name: 'inline', type: 'boolean', default: 'false', description: 'Use inline-flex instead of flex' },
]

const centerProps: PropDef[] = [
  { name: 'inline', type: 'boolean', default: 'false', description: 'Use inline-flex instead of flex' },
]

const boxProps: PropDef[] = [
  { name: 'surface', type: "'default' | 'container' | 'container-low' | 'container-high' | 'container-highest' | 'primary-container' | 'secondary-container' | 'tertiary-container' | 'inverse'", description: 'Surface color variant' },
  { name: 'padding', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'none'", description: 'Padding size' },
  { name: 'rounded', type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'none'", description: 'Border radius' },
  { name: 'elevation', type: '0 | 1 | 2 | 3', default: '0', description: 'Shadow elevation level' },
  { name: 'border', type: 'boolean', default: 'false', description: 'Show border' },
  { name: 'tag', type: 'string', default: "'div'", description: 'HTML tag to render' },
]

const sectionProps: PropDef[] = [
  { name: 'title', type: 'string', description: 'Section title text' },
  { name: 'subtitle', type: 'string', description: 'Section subtitle text' },
  { name: 'divider', type: 'boolean', default: 'false', description: 'Show divider below header' },
  { name: 'gap', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Gap between header and content' },
  { name: 'titleVariant', type: 'TextVariant', default: "'title-large'", description: 'Typography variant for the title' },
]

const responsiveProps: PropDef[] = [
  { name: 'show', type: "'sm-up' | 'md-up' | 'lg-up' | 'xl-up' | 'sm-down' | 'md-down' | 'lg-down' | 'xl-down'", description: 'Show content only at this breakpoint range' },
  { name: 'hide', type: "'sm-up' | 'md-up' | 'lg-up' | 'xl-up' | 'sm-down' | 'md-down' | 'lg-down' | 'xl-down'", description: 'Hide content at this breakpoint range' },
  { name: 'tag', type: 'string', default: "'div'", description: 'HTML tag to render' },
]

const textVariants = [
  'display-large', 'display-medium', 'display-small',
  'headline-large', 'headline-medium', 'headline-small',
  'title-large', 'title-medium', 'title-small',
  'body-large', 'body-medium', 'body-small',
  'label-large', 'label-medium', 'label-small',
] as const

const surfaceVariants = [
  'default', 'container', 'container-low', 'container-high', 'container-highest',
  'primary-container', 'secondary-container', 'tertiary-container', 'inverse',
] as const

const positionProps: PropDef[] = [
  { name: 'placement', type: "'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'", description: 'Preset corner/edge placement' },
  { name: 'offset', type: 'string | number', default: '0', description: 'Distance from edges when using placement' },
  { name: 'top', type: 'string | number', description: 'Top offset (number = px)' },
  { name: 'right', type: 'string | number', description: 'Right offset' },
  { name: 'bottom', type: 'string | number', description: 'Bottom offset' },
  { name: 'left', type: 'string | number', description: 'Left offset' },
  { name: 'inset', type: 'boolean', default: 'false', description: 'Set all sides to 0' },
  { name: 'zIndex', type: 'number', description: 'Z-index value' },
]

const stickyProps: PropDef[] = [
  { name: 'top', type: 'string | number', default: '0', description: 'Sticky offset from top' },
  { name: 'zIndex', type: 'number', default: '40', description: 'Z-index value' },
]

const scrollableProps: PropDef[] = [
  { name: 'direction', type: "'vertical' | 'horizontal' | 'both'", default: "'vertical'", description: 'Scroll direction' },
  { name: 'height', type: 'string', description: 'Fixed height (CSS value)' },
  { name: 'maxHeight', type: 'string', description: 'Maximum height (CSS value)' },
]

const aspectRatioProps: PropDef[] = [
  { name: 'ratio', type: 'string | number', default: "'16/9'", description: 'Aspect ratio (e.g. "16/9", "4/3", 1)' },
]

const appLayoutProps: PropDef[] = [
  { name: 'drawerWidth', type: 'string', default: "'auto'", description: 'Fixed width for the drawer slot' },
  { name: 'height', type: 'string', default: "'100dvh'", description: 'Container height (CSS value). Use "100%" to fit inside a parent instead of the viewport.' },
]

const overlayProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', default: 'true', description: 'Controls visibility' },
  { name: 'scrim', type: 'boolean', default: 'true', description: 'Show dark backdrop' },
  { name: 'zIndex', type: 'number', default: '50', description: 'Z-index value' },
]

const showOverlay = ref(false)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Layout</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Components for structuring page layouts, grids, and content containers.
    </p>

    <!-- ── MContainer ──────────────────────────────────────────────────── -->
    <h2 class="mb-4 text-headline-small font-medium">MContainer</h2>

    <ComponentDemo
      title="Max Width Breakpoints"
      description="Constrains content width with responsive horizontal padding."
      :code="`<template>
  <MContainer max-width=&quot;sm&quot;>Small container</MContainer>
  <MContainer max-width=&quot;md&quot;>Medium container</MContainer>
  <MContainer max-width=&quot;lg&quot;>Large (default)</MContainer>
</template>`"
    >
      <div class="w-full space-y-3">
        <MContainer v-for="size in (['sm', 'md', 'lg', 'xl'] as const)" :key="size" :max-width="size" class="rounded-lg bg-primary-container/30 py-3 text-center text-body-medium">
          max-width="{{ size }}"
        </MContainer>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Fluid"
      description="Full-width container without max-width constraint."
      :code="`<template>
  <MContainer :fluid=&quot;true&quot;>Full width content</MContainer>
</template>`"
    >
      <div class="w-full">
        <MContainer :fluid="true" class="rounded-lg bg-tertiary-container/30 py-3 text-center text-body-medium">
          Fluid — stretches to full width
        </MContainer>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="containerProps" />

    <!-- ── MGrid ───────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MGrid</h2>

    <ComponentDemo
      title="Responsive Grid"
      description="Columns adapt from 1 on mobile to 3 on large screens."
      :code="`<template>
  <MGrid :cols=&quot;1&quot; :sm=&quot;2&quot; :lg=&quot;3&quot; gap=&quot;md&quot;>
    <div v-for=&quot;i in 6&quot; :key=&quot;i&quot; class=&quot;rounded-xl bg-primary-container p-4 text-center&quot;>
      Item {{ i }}
    </div>
  </MGrid>
</template>`"
    >
      <MGrid :cols="1" :sm="2" :lg="3" gap="md" class="w-full">
        <div v-for="i in 6" :key="i" class="rounded-xl bg-primary-container p-4 text-center text-on-primary-container">
          Item {{ i }}
        </div>
      </MGrid>
    </ComponentDemo>

    <ComponentDemo
      title="Gap Sizes"
      description="Control spacing between grid items."
      :code="`<template>
  <MGrid :cols=&quot;3&quot; gap=&quot;xs&quot;>...</MGrid>
  <MGrid :cols=&quot;3&quot; gap=&quot;lg&quot;>...</MGrid>
</template>`"
    >
      <div class="w-full space-y-6">
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">gap="xs"</p>
          <MGrid :cols="3" gap="xs">
            <div v-for="i in 3" :key="i" class="rounded-lg bg-secondary-container p-3 text-center text-on-secondary-container">{{ i }}</div>
          </MGrid>
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">gap="lg"</p>
          <MGrid :cols="3" gap="lg">
            <div v-for="i in 3" :key="i" class="rounded-lg bg-secondary-container p-3 text-center text-on-secondary-container">{{ i }}</div>
          </MGrid>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="gridProps" />

    <!-- ── MStack ──────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MStack</h2>

    <ComponentDemo
      title="Horizontal Stack"
      description="Row layout with gap and alignment control."
      :code="`<template>
  <MStack direction=&quot;row&quot; gap=&quot;sm&quot; align=&quot;center&quot;>
    <MButton>Save</MButton>
    <MButton variant=&quot;outlined&quot;>Cancel</MButton>
    <MButton variant=&quot;text&quot;>Reset</MButton>
  </MStack>
</template>`"
    >
      <MStack direction="row" gap="sm" align="center">
        <MButton>Save</MButton>
        <MButton variant="outlined">Cancel</MButton>
        <MButton variant="text">Reset</MButton>
      </MStack>
    </ComponentDemo>

    <ComponentDemo
      title="Vertical Stack"
      description="Column layout stacking items vertically."
      :code="`<template>
  <MStack direction=&quot;column&quot; gap=&quot;md&quot;>
    <MCard variant=&quot;outlined&quot; class=&quot;p-4&quot;>First</MCard>
    <MCard variant=&quot;outlined&quot; class=&quot;p-4&quot;>Second</MCard>
    <MCard variant=&quot;outlined&quot; class=&quot;p-4&quot;>Third</MCard>
  </MStack>
</template>`"
    >
      <MStack direction="column" gap="md" class="w-full max-w-sm">
        <MCard variant="outlined" class="p-4">First item</MCard>
        <MCard variant="outlined" class="p-4">Second item</MCard>
        <MCard variant="outlined" class="p-4">Third item</MCard>
      </MStack>
    </ComponentDemo>

    <ComponentDemo
      title="With Dividers"
      description="Automatic dividers between stack items."
      :code="`<template>
  <MStack direction=&quot;row&quot; :divider=&quot;true&quot; align=&quot;center&quot;>
    <span>Home</span>
    <span>About</span>
    <span>Contact</span>
  </MStack>
</template>`"
    >
      <MStack direction="row" :divider="true" align="center" class="text-body-medium">
        <span class="px-3">Home</span>
        <span class="px-3">About</span>
        <span class="px-3">Contact</span>
      </MStack>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="stackProps" />

    <!-- ── MSplitter ───────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MSplitter</h2>

    <ComponentDemo
      title="Horizontal Splitter"
      description="Drag the handle to resize two panels side by side."
      :code="`<template>
  <MSplitter :initial-split=&quot;40&quot;>
    <template #first>
      <div class=&quot;h-full bg-primary-container/20 p-4&quot;>Left panel</div>
    </template>
    <template #second>
      <div class=&quot;h-full bg-secondary-container/20 p-4&quot;>Right panel</div>
    </template>
  </MSplitter>
</template>`"
    >
      <div class="h-64 w-full overflow-hidden rounded-xl border border-outline-variant">
        <MSplitter :initial-split="40">
          <template #first>
            <div class="flex h-full items-center justify-center bg-primary-container/20 p-4 text-body-medium text-on-primary-container">
              Left panel
            </div>
          </template>
          <template #second>
            <div class="flex h-full items-center justify-center bg-secondary-container/20 p-4 text-body-medium text-on-secondary-container">
              Right panel
            </div>
          </template>
        </MSplitter>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Vertical Splitter"
      description="Top and bottom panels with vertical dragging."
      :code="`<template>
  <MSplitter direction=&quot;vertical&quot; :initial-split=&quot;60&quot;>
    <template #first>
      <div class=&quot;h-full bg-tertiary-container/20 p-4&quot;>Top panel</div>
    </template>
    <template #second>
      <div class=&quot;h-full bg-primary-container/20 p-4&quot;>Bottom panel</div>
    </template>
  </MSplitter>
</template>`"
    >
      <div class="h-64 w-full overflow-hidden rounded-xl border border-outline-variant">
        <MSplitter direction="vertical" :initial-split="60">
          <template #first>
            <div class="flex h-full items-center justify-center bg-tertiary-container/20 p-4 text-body-medium">
              Top panel
            </div>
          </template>
          <template #second>
            <div class="flex h-full items-center justify-center bg-primary-container/20 p-4 text-body-medium">
              Bottom panel
            </div>
          </template>
        </MSplitter>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="splitterProps" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Slots</p>
      <pre class="rounded-lg bg-surface-container p-3 text-body-small"><code>#first   — Content for the first (left/top) panel
#second  — Content for the second (right/bottom) panel</code></pre>
    </MCard>

    <!-- ── MMasonry ────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MMasonry</h2>

    <ComponentDemo
      title="Masonry Layout"
      description="Pinterest-style layout that fills columns by shortest-first."
      :code="`<template>
  <MMasonry :cols=&quot;3&quot; gap=&quot;md&quot;>
    <div v-for=&quot;item in items&quot; :key=&quot;item.title&quot; class=&quot;rounded-xl bg-primary-container p-4&quot; :class=&quot;item.height&quot;>
      {{ item.title }}
    </div>
  </MMasonry>
</template>`"
    >
      <div class="w-full">
        <MMasonry :cols="3" gap="md">
          <div
            v-for="item in masonryItems"
            :key="item.title"
            class="flex items-center justify-center rounded-xl p-4 text-body-medium font-medium"
            :class="[item.height, item.color]"
          >
            {{ item.title }}
          </div>
        </MMasonry>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Responsive Columns"
      description="Different column counts per breakpoint."
      :code="`<template>
  <MMasonry :cols=&quot;1&quot; :sm-cols=&quot;2&quot; :lg-cols=&quot;4&quot; gap=&quot;sm&quot;>
    ...
  </MMasonry>
</template>`"
    >
      <div class="w-full">
        <MMasonry :cols="1" :sm-cols="2" :lg-cols="4" gap="sm">
          <div
            v-for="(item, i) in masonryItems"
            :key="i"
            class="flex items-center justify-center rounded-xl p-4 text-body-medium font-medium"
            :class="[item.height, item.color]"
          >
            {{ item.title }}
          </div>
        </MMasonry>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="masonryProps" />

    <!-- ── MText ───────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MText</h2>

    <ComponentDemo
      title="Type Scale"
      description="All 15 Material 3 typography variants."
      :code="`<template>
  <MText variant=&quot;display-large&quot;>Display Large</MText>
  <MText variant=&quot;headline-medium&quot;>Headline Medium</MText>
  <MText variant=&quot;body-medium&quot;>Body Medium</MText>
  <MText variant=&quot;label-small&quot;>Label Small</MText>
</template>`"
    >
      <div class="w-full space-y-2">
        <MText v-for="v in textVariants" :key="v" :variant="v">{{ v }}</MText>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Colors & Weight"
      description="Different color and weight combinations."
      :code="`<template>
  <MText color=&quot;primary&quot; weight=&quot;bold&quot;>Primary Bold</MText>
  <MText color=&quot;secondary&quot; weight=&quot;medium&quot;>Secondary Medium</MText>
  <MText color=&quot;error&quot;>Error text</MText>
</template>`"
    >
      <div class="w-full space-y-2">
        <MText variant="body-large" color="primary" weight="bold">Primary Bold</MText>
        <MText variant="body-large" color="secondary" weight="medium">Secondary Medium</MText>
        <MText variant="body-large" color="tertiary">Tertiary Regular</MText>
        <MText variant="body-large" color="error">Error text</MText>
        <MText variant="body-large" color="on-surface">On Surface</MText>
        <MText variant="body-large" color="on-surface-variant">On Surface Variant</MText>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Truncation"
      description="Single-line truncation and multi-line clamping."
      :code="`<template>
  <MText :truncate=&quot;true&quot;>Long text that will be truncated...</MText>
  <MText :lines=&quot;2&quot;>Long text clamped to two lines...</MText>
</template>`"
    >
      <div class="w-full max-w-sm space-y-4">
        <div>
          <p class="mb-1 text-label-medium text-on-surface-variant">truncate</p>
          <MText :truncate="true">This is a very long piece of text that will be truncated with an ellipsis when it overflows the container width.</MText>
        </div>
        <div>
          <p class="mb-1 text-label-medium text-on-surface-variant">lines="2"</p>
          <MText :lines="2">This is a long paragraph of text that will be clamped to exactly two lines. Any content beyond the second line will be hidden and replaced with an ellipsis to indicate that there is more content available.</MText>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="textProps" />

    <!-- ── MTitle ──────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MTitle</h2>

    <ComponentDemo
      title="Title Sizes"
      description="Semantic title component in three sizes."
      :code="`<template>
  <MTitle size=&quot;large&quot;>Large Title</MTitle>
  <MTitle size=&quot;medium&quot;>Medium Title</MTitle>
  <MTitle size=&quot;small&quot;>Small Title</MTitle>
</template>`"
    >
      <div class="w-full space-y-3">
        <MTitle size="large">Large Title</MTitle>
        <MTitle size="medium">Medium Title</MTitle>
        <MTitle size="small">Small Title</MTitle>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="titleProps" />

    <!-- ── MSubtitle ───────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MSubtitle</h2>

    <ComponentDemo
      title="Subtitle Sizes"
      description="Secondary text component with muted color by default."
      :code="`<template>
  <MSubtitle size=&quot;large&quot;>Large Subtitle</MSubtitle>
  <MSubtitle size=&quot;medium&quot;>Medium Subtitle</MSubtitle>
  <MSubtitle size=&quot;small&quot;>Small Subtitle</MSubtitle>
</template>`"
    >
      <div class="w-full space-y-3">
        <MSubtitle size="large">Large Subtitle</MSubtitle>
        <MSubtitle size="medium">Medium Subtitle</MSubtitle>
        <MSubtitle size="small">Small Subtitle</MSubtitle>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="subtitleProps" />

    <!-- ── MFlex ───────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MFlex</h2>

    <ComponentDemo
      title="Row Layout"
      description="Horizontal flex with gap and centering."
      :code="`<template>
  <MFlex direction=&quot;row&quot; gap=&quot;md&quot; align=&quot;center&quot;>
    <MButton>Action</MButton>
    <MButton variant=&quot;outlined&quot;>Cancel</MButton>
  </MFlex>
</template>`"
    >
      <MFlex direction="row" gap="md" align="center">
        <MButton>Action</MButton>
        <MButton variant="outlined">Cancel</MButton>
        <MButton variant="text">Reset</MButton>
      </MFlex>
    </ComponentDemo>

    <ComponentDemo
      title="Justify Content"
      description="Distribute items along the main axis."
      :code="`<template>
  <MFlex justify=&quot;between&quot;>...</MFlex>
  <MFlex justify=&quot;around&quot;>...</MFlex>
  <MFlex justify=&quot;evenly&quot;>...</MFlex>
</template>`"
    >
      <div class="w-full space-y-6">
        <div v-for="j in (['between', 'around', 'evenly'] as const)" :key="j">
          <p class="mb-2 text-label-medium text-on-surface-variant">justify="{{ j }}"</p>
          <MFlex :justify="j" align="center" class="rounded-lg bg-surface-container p-3">
            <div v-for="i in 3" :key="i" class="rounded-lg bg-primary-container px-4 py-2 text-on-primary-container">Item {{ i }}</div>
          </MFlex>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="flexProps" />

    <!-- ── MSpacer ─────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MSpacer</h2>

    <ComponentDemo
      title="Spacer"
      description="Pushes items apart in a flex container (flex: 1)."
      :code="`<template>
  <MFlex direction=&quot;row&quot; align=&quot;center&quot; gap=&quot;sm&quot;>
    <MText variant=&quot;title-medium&quot;>App Title</MText>
    <MSpacer />
    <MIconButton icon=&quot;search&quot; />
    <MIconButton icon=&quot;more_vert&quot; />
  </MFlex>
</template>`"
    >
      <div class="w-full rounded-lg bg-surface-container p-3">
        <MFlex direction="row" align="center" gap="sm">
          <MText variant="title-medium">App Title</MText>
          <MSpacer />
          <MIconButton icon="search" label="Search" />
          <MIconButton icon="more_vert" label="More options" />
        </MFlex>
      </div>
    </ComponentDemo>

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">No Props</p>
      <p class="text-body-medium text-on-surface-variant">MSpacer renders a simple flex-1 div with no configurable props.</p>
    </MCard>

    <!-- ── MCenter ─────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MCenter</h2>

    <ComponentDemo
      title="Center Content"
      description="Centers its children both horizontally and vertically."
      :code="`<template>
  <MCenter class=&quot;h-40&quot;>
    <MSpinner />
  </MCenter>
</template>`"
    >
      <div class="w-full">
        <MCenter class="h-40 rounded-xl border border-outline-variant">
          <MSpinner />
        </MCenter>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="centerProps" />

    <!-- ── MBox ────────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MBox</h2>

    <ComponentDemo
      title="Surface Variants"
      description="All available surface color options."
      :code="`<template>
  <MBox surface=&quot;container&quot; padding=&quot;md&quot; rounded=&quot;lg&quot;>
    Container surface
  </MBox>
</template>`"
    >
      <MGrid :cols="2" :sm="3" gap="md" class="w-full">
        <MBox
          v-for="s in surfaceVariants"
          :key="s"
          :surface="s"
          padding="md"
          rounded="lg"
          class="text-center text-body-small"
        >
          {{ s }}
        </MBox>
      </MGrid>
    </ComponentDemo>

    <ComponentDemo
      title="Elevation & Border"
      description="Shadow elevation levels and border option."
      :code="`<template>
  <MBox :elevation=&quot;1&quot; padding=&quot;md&quot; rounded=&quot;lg&quot;>Level 1</MBox>
  <MBox :elevation=&quot;2&quot; padding=&quot;md&quot; rounded=&quot;lg&quot;>Level 2</MBox>
  <MBox :border=&quot;true&quot; padding=&quot;md&quot; rounded=&quot;lg&quot;>Bordered</MBox>
</template>`"
    >
      <MFlex direction="row" gap="lg" wrap class="w-full">
        <MBox v-for="e in [0, 1, 2, 3]" :key="e" :elevation="(e as 0 | 1 | 2 | 3)" padding="md" rounded="lg" class="text-body-small">
          elevation={{ e }}
        </MBox>
        <MBox :border="true" padding="md" rounded="lg" class="text-body-small">
          border
        </MBox>
      </MFlex>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="boxProps" />

    <!-- ── MSection ────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MSection</h2>

    <ComponentDemo
      title="Basic Section"
      description="Section with title, subtitle, and content."
      :code="`<template>
  <MSection title=&quot;Account Settings&quot; subtitle=&quot;Manage your account preferences&quot; :divider=&quot;true&quot;>
    <MCard variant=&quot;outlined&quot; class=&quot;p-4&quot;>Section content goes here</MCard>
  </MSection>
</template>`"
    >
      <div class="w-full">
        <MSection title="Account Settings" subtitle="Manage your account preferences" :divider="true">
          <MCard variant="outlined" class="p-4">Section content goes here</MCard>
        </MSection>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With Actions"
      description="Section with action buttons in the header."
      :code="`<template>
  <MSection title=&quot;Notifications&quot; subtitle=&quot;Configure how you receive alerts&quot;>
    <template #actions>
      <MButton variant=&quot;text&quot; size=&quot;small&quot;>Mark all read</MButton>
      <MButton size=&quot;small&quot;>Settings</MButton>
    </template>
    <MCard variant=&quot;outlined&quot; class=&quot;p-4&quot;>Notification preferences</MCard>
  </MSection>
</template>`"
    >
      <div class="w-full">
        <MSection title="Notifications" subtitle="Configure how you receive alerts">
          <template #actions>
            <MButton variant="text" size="small">Mark all read</MButton>
            <MButton size="small">Settings</MButton>
          </template>
          <MCard variant="outlined" class="p-4">Notification preferences</MCard>
        </MSection>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="sectionProps" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Slots</p>
      <pre class="rounded-lg bg-surface-container p-3 text-body-small"><code>#title     — Custom title content (overrides title prop)
#subtitle  — Custom subtitle content (overrides subtitle prop)
#actions   — Action buttons displayed in the header row
#default   — Main section content</code></pre>
    </MCard>

    <!-- ── MResponsive ─────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MResponsive</h2>

    <ComponentDemo
      title="Responsive Visibility"
      description="Show or hide elements at different breakpoints."
      :code="`<template>
  <MResponsive show=&quot;md-up&quot;>
    Visible on md screens and above
  </MResponsive>
  <MResponsive hide=&quot;lg-up&quot;>
    Hidden on lg screens and above
  </MResponsive>
</template>`"
    >
      <div class="w-full space-y-3">
        <MResponsive show="sm-up">
          <MBox surface="primary-container" padding="sm" rounded="md" class="text-body-small">
            Visible on sm and up (hidden on xs)
          </MBox>
        </MResponsive>
        <MResponsive show="md-up">
          <MBox surface="secondary-container" padding="sm" rounded="md" class="text-body-small">
            Visible on md and up
          </MBox>
        </MResponsive>
        <MResponsive show="lg-up">
          <MBox surface="tertiary-container" padding="sm" rounded="md" class="text-body-small">
            Visible on lg and up
          </MBox>
        </MResponsive>
        <MResponsive hide="md-up">
          <MBox surface="container-high" padding="sm" rounded="md" class="text-body-small">
            Hidden on md and up (mobile only)
          </MBox>
        </MResponsive>
        <MBox surface="container" padding="sm" rounded="md" class="text-body-small text-on-surface-variant">
          Resize the browser to see elements appear and disappear at different breakpoints.
        </MBox>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="responsiveProps" />

    <!-- ── MRelative & MAbsolute ───────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MRelative & MAbsolute</h2>

    <ComponentDemo
      title="Positioning"
      description="Declarative positioning without Tailwind classes."
      :code="`<template>
  <MRelative>
    <MBox surface=&quot;container&quot; padding=&quot;lg&quot; rounded=&quot;lg&quot; class=&quot;h-40&quot;>
      Base content
    </MBox>
    <MAbsolute :top=&quot;8&quot; :right=&quot;8&quot;>
      <MBadge :count=&quot;3&quot;>
        <MIconButton icon=&quot;notifications&quot; variant=&quot;tonal&quot; />
      </MBadge>
    </MAbsolute>
    <MAbsolute :bottom=&quot;8&quot; :left=&quot;8&quot;>
      <MChip tone=&quot;primary&quot;>Overlay chip</MChip>
    </MAbsolute>
  </MRelative>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MRelative>
          <MBox surface="container" padding="lg" rounded="lg" class="h-40">
            <MText variant="body-medium" color="on-surface-variant">Base content area</MText>
          </MBox>
          <MAbsolute :top="8" :right="8">
            <MBadge :count="3">
              <MIconButton icon="notifications" variant="tonal" label="Notifications" />
            </MBadge>
          </MAbsolute>
          <MAbsolute :bottom="12" :left="12">
            <MButton size="small" variant="tonal" label="Action" />
          </MAbsolute>
        </MRelative>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Inset Overlay"
      description="Use inset to fill the entire parent."
      :code="`<template>
  <MRelative>
    <img src=&quot;...&quot; class=&quot;h-40 w-full rounded-lg object-cover&quot; />
    <MAbsolute :inset=&quot;true&quot; class=&quot;flex items-end rounded-lg bg-gradient-to-t from-black/60 to-transparent p-4&quot;>
      <MText variant=&quot;title-medium&quot; color=&quot;inherit&quot; class=&quot;text-white&quot;>Image title</MText>
    </MAbsolute>
  </MRelative>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MRelative>
          <div class="h-40 w-full rounded-lg bg-linear-to-br from-primary to-tertiary" />
          <MAbsolute :inset="true" class="flex items-end rounded-lg bg-linear-to-t from-black/60 to-transparent p-4">
            <MText variant="title-medium" class="text-white">Overlay Title</MText>
          </MAbsolute>
        </MRelative>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Placement Shortcuts"
      description="Use placement to position in corners, edges, or center without manual offsets."
      :code="`<template>
  <MRelative class=&quot;h-48&quot;>
    <MAbsolute placement=&quot;top-left&quot; :offset=&quot;8&quot;>TL</MAbsolute>
    <MAbsolute placement=&quot;top-right&quot; :offset=&quot;8&quot;>TR</MAbsolute>
    <MAbsolute placement=&quot;center&quot;>Center</MAbsolute>
    <MAbsolute placement=&quot;bottom-left&quot; :offset=&quot;8&quot;>BL</MAbsolute>
    <MAbsolute placement=&quot;bottom-right&quot; :offset=&quot;8&quot;>BR</MAbsolute>
  </MRelative>
</template>`"
    >
      <div class="w-full max-w-md">
        <MRelative>
          <MBox surface="container" padding="lg" rounded="lg" class="h-48" />
          <MAbsolute v-for="p in (['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'] as const)" :key="p" :placement="p" :offset="8">
            <MBox surface="primary-container" padding="xs" rounded="md">
              <MText variant="label-small">{{ p }}</MText>
            </MBox>
          </MAbsolute>
        </MRelative>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">MAbsolute / MFixed Props</h3>
    <PropsTable :props="positionProps" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">MRelative</p>
      <p class="text-body-medium text-on-surface-variant">MRelative has no props — it simply sets <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">position: relative</code> on a wrapper div.</p>
    </MCard>

    <!-- ── MSticky ─────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MSticky</h2>

    <ComponentDemo
      title="Sticky Header"
      description="Elements that stick to the top of their scroll container."
      :code="`<template>
  <MScrollable max-height=&quot;200px&quot;>
    <MSticky :top=&quot;0&quot;>
      <MBox surface=&quot;container-high&quot; padding=&quot;sm&quot;>
        Sticky Header
      </MBox>
    </MSticky>
    <div>Scrollable content...</div>
  </MScrollable>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MScrollable max-height="200px">
            <MSticky :top="0" :z-index="10">
              <MBox surface="container-high" padding="sm" class="border-b border-outline-variant">
                <MText variant="title-small" weight="medium">Sticky Header</MText>
              </MBox>
            </MSticky>
            <div class="space-y-2 p-4">
              <MText v-for="i in 15" :key="i" variant="body-medium" color="on-surface-variant">
                Scrollable content line {{ i }}
              </MText>
            </div>
          </MScrollable>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="stickyProps" />

    <!-- ── MScrollable ─────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MScrollable</h2>

    <ComponentDemo
      title="Scroll Directions"
      description="Constrained scroll areas in vertical, horizontal, or both directions."
      :code="`<template>
  <MScrollable max-height=&quot;150px&quot; direction=&quot;vertical&quot;>
    Long vertical content...
  </MScrollable>
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard variant="outlined" class="overflow-hidden">
          <MText variant="label-medium" class="border-b border-outline-variant px-3 py-2 text-on-surface-variant">vertical</MText>
          <MScrollable max-height="120px">
            <div class="space-y-1 p-3">
              <MText v-for="i in 12" :key="i" variant="body-small" color="on-surface-variant">Line {{ i }}</MText>
            </div>
          </MScrollable>
        </MCard>
        <MCard variant="outlined" class="overflow-hidden">
          <MText variant="label-medium" class="border-b border-outline-variant px-3 py-2 text-on-surface-variant">horizontal</MText>
          <MScrollable direction="horizontal" class="p-3">
            <MFlex gap="sm" class="w-max">
              <MBox v-for="i in 10" :key="i" surface="primary-container" padding="sm" rounded="md" class="shrink-0">
                <MText variant="body-small">Item {{ i }}</MText>
              </MBox>
            </MFlex>
          </MScrollable>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="scrollableProps" />

    <!-- ── MAspectRatio ────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MAspectRatio</h2>

    <ComponentDemo
      title="Aspect Ratios"
      description="Maintain a consistent aspect ratio for media or containers."
      :code="`<template>
  <MAspectRatio ratio=&quot;16/9&quot;>
    <img src=&quot;...&quot; class=&quot;h-full w-full object-cover&quot; />
  </MAspectRatio>
</template>`"
    >
      <MGrid :cols="3" gap="md" class="w-full">
        <div v-for="r in ['1/1', '16/9', '4/3']" :key="r">
          <MText variant="label-small" color="on-surface-variant" class="mb-1">{{ r }}</MText>
          <MAspectRatio :ratio="r" class="rounded-lg bg-linear-to-br from-primary/30 to-tertiary/30">
            <MCenter class="h-full">
              <MText variant="body-small" color="on-surface-variant">{{ r }}</MText>
            </MCenter>
          </MAspectRatio>
        </div>
      </MGrid>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="aspectRatioProps" />

    <!-- ── MAppLayout ──────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MAppLayout</h2>

    <ComponentDemo
      title="App Shell"
      description="Full app layout with drawer, header, content, footer, and fab slots. Use the height prop to embed inside a container instead of filling the viewport."
      :code="`<template>
  &lt;!-- Full viewport (default) --&gt;
  <MAppLayout>
    <template #drawer>
      <MNavigationDrawer ... />
    </template>
    <template #header>
      <MTopAppBar ... />
    </template>
    <MContainer>Page content</MContainer>
    <template #footer>
      <MBox surface=&quot;container&quot; padding=&quot;sm&quot;>Footer</MBox>
    </template>
    <template #fab>
      <MAbsolute placement=&quot;bottom-right&quot; :offset=&quot;24&quot;>
        <MFab icon=&quot;edit&quot; />
      </MAbsolute>
    </template>
  </MAppLayout>

  &lt;!-- Embedded with fixed height --&gt;
  <MAppLayout height=&quot;400px&quot;>
    ...
  </MAppLayout>
</template>`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="h-72 overflow-hidden">
          <MAppLayout height="100%">
            <template #drawer>
              <MBox surface="container-low" padding="sm" class="h-full w-48 border-r border-outline-variant">
                <MText variant="title-small" weight="medium" class="mb-3">Drawer</MText>
                <MStack gap="xs">
                  <MBox surface="secondary-container" padding="xs" rounded="md">
                    <MFlex align="center" gap="sm">
                      <MIcon name="home" :size="18" />
                      <MText variant="label-large">Home</MText>
                    </MFlex>
                  </MBox>
                  <MFlex align="center" gap="sm" class="px-1">
                    <MIcon name="settings" :size="18" class="text-on-surface-variant" />
                    <MText variant="label-large" color="on-surface-variant">Settings</MText>
                  </MFlex>
                </MStack>
              </MBox>
            </template>

            <template #header>
              <MBox surface="container" padding="sm" class="border-b border-outline-variant">
                <MText variant="title-small" weight="medium">Header</MText>
              </MBox>
            </template>

            <MBox padding="md">
              <MText variant="body-medium" color="on-surface-variant">Main content area</MText>
            </MBox>

            <template #footer>
              <MBox surface="container" padding="xs" class="border-t border-outline-variant">
                <MText variant="body-small" color="on-surface-variant" align="center">Footer</MText>
              </MBox>
            </template>

            <template #fab>
              <MAbsolute placement="bottom-right" :offset="16">
                <MFab icon="edit" size="small" />
              </MAbsolute>
            </template>
          </MAppLayout>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="appLayoutProps" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Slots</p>
      <pre class="rounded-lg bg-surface-container p-3 text-body-small"><code>#drawer   — Side navigation (e.g. MNavigationDrawer)
#header   — Top bar (e.g. MTopAppBar)
#default  — Main scrollable content
#footer   — Bottom bar or status area
#fab      — Floating elements (e.g. MFab) rendered outside the scroll area</code></pre>
    </MCard>

    <!-- ── MOverlay ────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MOverlay</h2>

    <ComponentDemo
      title="Overlay"
      description="Full-screen overlay with scrim and teleport to body."
      :code="`<template>
  <MButton @click=&quot;show = true&quot;>Show Overlay</MButton>
  <MOverlay v-model=&quot;show&quot;>
    <MCenter class=&quot;h-full&quot;>
      <MCard class=&quot;p-6&quot;>
        <MText variant=&quot;title-medium&quot;>Overlay content</MText>
        <MButton class=&quot;mt-4&quot; @click=&quot;show = false&quot;>Close</MButton>
      </MCard>
    </MCenter>
  </MOverlay>
</template>`"
    >
      <MButton @click="showOverlay = true">Show Overlay</MButton>
      <MOverlay v-model="showOverlay">
        <MCenter class="h-full">
          <MCard class="p-6">
            <MText variant="title-medium" weight="medium">Overlay Content</MText>
            <MSubtitle size="medium" class="mt-1">Click the scrim or button to close.</MSubtitle>
            <MButton class="mt-4" @click="showOverlay = false">Close</MButton>
          </MCard>
        </MCenter>
      </MOverlay>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="overlayProps" />

    <!-- ── MFullscreen ─────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MFullscreen</h2>

    <MCard class="overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">MFullscreen</p>
      <p class="text-body-medium text-on-surface-variant">
        Fills the entire viewport (or parent when <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">fixed=false</code>).
        Useful for loading screens, splash pages, or modal backdrops.
      </p>
      <pre class="mt-3 rounded-lg bg-surface-container p-3 text-body-small"><code>&lt;MFullscreen&gt;
  &lt;MCenter class="h-full"&gt;
    &lt;MSpinner /&gt;
  &lt;/MCenter&gt;
&lt;/MFullscreen&gt;</code></pre>
      <h4 class="mt-4 text-title-small font-medium">Props</h4>
      <p class="mt-1 text-body-small text-on-surface-variant">
        <code class="rounded bg-surface-container px-1.5 py-0.5">fixed</code> (boolean, default true) —
        <code class="rounded bg-surface-container px-1.5 py-0.5">zIndex</code> (number, default 50)
      </p>
    </MCard>
  </div>
</template>
