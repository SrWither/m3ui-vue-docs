<script setup lang="ts">
import {
  MContainer, MGrid, MStack, MSplitter, MMasonry, MCard, MButton,
} from '@m3ui-vue/m3ui-vue'
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
  </div>
</template>
