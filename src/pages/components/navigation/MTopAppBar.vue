<script setup lang="ts">
import { ref } from 'vue'
import { MTopAppBar, MIconButton, MCard, MResponsive, MSegmentedButton } from '@m3ui-vue/m3ui-vue'
import type { SegmentedOption } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const topAppBarProps: PropDef[] = [
  { name: 'title', type: 'string', description: 'App bar title' },
  { name: 'variant', type: "'center' | 'small' | 'medium' | 'large'", default: "'small'", description: '64dp small/center-aligned row, or a 112dp medium / 152dp large two-row layout with the title below' },
  { name: 'subtitle', type: 'string', description: 'A line below the title: small, center-aligned and flexible medium/large bars' },
  { name: 'flexible', type: 'boolean', default: 'false', description: "Medium/large only: Material 3 Expressive's flexible bars, with a bigger title (headline-medium / display-small) and room for a subtitle (112/136px and 120/152px tall, without/with one)" },
  { name: 'titleAlignment', type: "'start' | 'center'", default: "'start'", description: 'Medium/large only: where the title sits' },
  { name: 'navigationIcon', type: 'string', description: 'Leading icon (e.g. menu, arrow_back)' },
  { name: 'navigationLabel', type: 'string', description: "Accessible label for the navigation icon — defaults to the locale's \"Menu\"; override when navigationIcon is a back arrow instead" },
  { name: 'elevated', type: 'boolean', default: 'false', description: 'Swaps both container color (surface → surface-container) and elevation (level 0 → level 2), matching the real M3 on-scroll container tokens rather than just adding a shadow' },
  { name: 'bordered', type: 'boolean', default: 'false', description: 'Add a bottom border (border-outline-variant)' },
  { name: 'scrollBehavior', type: "'pinned' | 'enter-always' | 'exit-until-collapsed'", description: "How the bar reacts to scrollTarget scrolling. pinned stays put and takes the scrolled color once content moves under it; enter-always hides (a medium/large bar collapses to the small one) while scrolling down and returns as soon as you scroll up; exit-until-collapsed collapses a medium/large bar with the content and expands it only back at the top. The last two make the bar sticky: put it at the top of the scrolling element (or of the page)" },
  { name: 'scrollTarget', type: 'HTMLElement | string | null', default: 'null (the window)', description: 'What scrollBehavior follows: an element or a CSS selector for it' },
]

type Behavior = 'pinned' | 'enter-always' | 'exit-until-collapsed'
const behavior = ref<Behavior>('exit-until-collapsed')
const behaviorOptions: SegmentedOption[] = [
  { value: 'pinned', label: 'Pinned' },
  { value: 'enter-always', label: 'Enter always' },
  { value: 'exit-until-collapsed', label: 'Exit until collapsed' },
]
type ScrollVariant = 'small' | 'medium' | 'large'
const scrollVariant = ref<ScrollVariant>('medium')
const scrollVariantOptions: SegmentedOption[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
]
const scrollEl = ref<HTMLElement | null>(null)
const mails = Array.from({ length: 24 }, (_, i) => ({ from: ['Ana', 'Bruno', 'Carla', 'Diego'][i % 4], subject: `Message ${i + 1}` }))

const topAppBarEvents = [
  { name: 'navigation', description: 'Emitted when the default navigation icon button is clicked (not emitted when the #navigation slot is overridden — that content is fully custom)' },
]

const topAppBarSlots: SlotDef[] = [
  { name: '#title', description: 'Custom title content (default: renders the title prop)' },
  { name: '#subtitle', description: 'Custom subtitle content (default: renders the subtitle prop)' },
  { name: '#navigation', description: 'Custom leading area (default: an MIconButton built from the navigationIcon prop)' },
  { name: '#actions', description: 'Trailing action buttons' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTopAppBar</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A top app bar in four M3 layouts — center-aligned, small, medium, and large — with a leading
      navigation icon and trailing actions. Medium and large can be Material 3 Expressive's flexible bars,
      with a subtitle, and any of them can react to scrolling: change color, hide, or collapse to the small bar.
    </p>

    <ComponentDemo
      title="Variants"
      description="Four top app bar layouts: center-aligned, small, medium, and large. Medium/large are 112dp/152dp two-row layouts with the title below the top row."
      :code="`<template>
  <MTopAppBar title=&quot;My App&quot; variant=&quot;small&quot; navigation-icon=&quot;menu&quot;>
    <template #actions>
      <MIconButton icon=&quot;search&quot; label=&quot;Search&quot; />
      <MIconButton icon=&quot;more_vert&quot; label=&quot;More&quot; />
    </template>
  </MTopAppBar>
</template>`"
    >
      <div class="w-full space-y-4">
        <MCard v-for="v in (['center', 'small', 'medium', 'large'] as const)" :key="v" variant="outlined" class="overflow-hidden">
          <MTopAppBar :title="`${v.charAt(0).toUpperCase() + v.slice(1)} variant`" :variant="v" navigation-icon="menu">
            <template #actions>
              <MIconButton icon="search" label="Search" />
              <MIconButton icon="more_vert" label="More" />
            </template>
          </MTopAppBar>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Flexible Medium and Large"
      description="Material 3 Expressive's flexible bars: a bigger title, an optional subtitle, and start or centered titles."
      :code="`<MTopAppBar variant=&quot;medium&quot; flexible title=&quot;Inbox&quot; subtitle=&quot;3 unread&quot; navigation-icon=&quot;menu&quot; />
<MTopAppBar variant=&quot;large&quot; flexible title=&quot;Photos&quot; subtitle=&quot;Last week&quot; title-alignment=&quot;center&quot; navigation-icon=&quot;arrow_back&quot; />`"
    >
      <div class="w-full space-y-4">
        <MCard variant="outlined" class="overflow-hidden">
          <MTopAppBar variant="medium" flexible title="Inbox" subtitle="3 unread" navigation-icon="menu">
            <template #actions>
              <MIconButton icon="search" label="Search" />
            </template>
          </MTopAppBar>
        </MCard>
        <MCard variant="outlined" class="overflow-hidden">
          <MTopAppBar variant="large" flexible title="Photos" subtitle="Last week" title-alignment="center" navigation-icon="arrow_back" navigation-label="Back">
            <template #actions>
              <MIconButton icon="more_vert" label="More" />
            </template>
          </MTopAppBar>
        </MCard>
        <MCard variant="outlined" class="overflow-hidden">
          <MTopAppBar title="Inbox" subtitle="3 unread" navigation-icon="menu" />
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Scroll Behaviors"
      description="Scroll the list. Pinned stays and changes color; enter-always hides while you scroll down (a medium/large bar collapses to the small one) and comes back as soon as you scroll up; exit-until-collapsed shrinks with the content and expands only at the top. The bar is the first child of the scrolling element."
      :code="`<div ref=&quot;scrollEl&quot; class=&quot;h-[480px] overflow-y-auto&quot;>
  <MTopAppBar
    variant=&quot;${scrollVariant}&quot;
    flexible
    title=&quot;Inbox&quot;
    subtitle=&quot;24 messages&quot;
    navigation-icon=&quot;menu&quot;
    scroll-behavior=&quot;${behavior}&quot;
    :scroll-target=&quot;scrollEl&quot;
  />
  <!-- the list -->
</div>`"
      :script="`const scrollEl = ref<HTMLElement | null>(null)`"
    >
      <div class="flex w-full max-w-sm flex-col gap-3">
        <MSegmentedButton v-model="behavior" :options="behaviorOptions" density="compact" />
        <MSegmentedButton v-model="scrollVariant" :options="scrollVariantOptions" density="compact" />
        <div ref="scrollEl" class="h-[480px] overflow-y-auto rounded-xl border border-outline-variant bg-surface">
          <MTopAppBar
            :key="`${behavior}-${scrollVariant}`"
            :variant="scrollVariant"
            flexible
            title="Inbox"
            subtitle="24 messages"
            navigation-icon="menu"
            :scroll-behavior="behavior"
            :scroll-target="scrollEl"
          >
            <template #actions>
              <MIconButton icon="search" label="Search" />
            </template>
          </MTopAppBar>
          <div
            v-for="m in mails"
            :key="m.subject"
            class="border-b border-outline-variant px-4 py-3"
          >
            <p class="text-title-small text-on-surface">{{ m.from }}</p>
            <p class="text-body-medium text-on-surface-variant">{{ m.subject }}</p>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Elevated"
      description="elevated swaps the container to surface-container and adds shadow elevation 2, matching the on-scroll state — use it once the page content has scrolled under the bar."
      :code="`<MTopAppBar title=&quot;My App&quot; :elevated=&quot;true&quot; navigation-icon=&quot;menu&quot; />`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="overflow-hidden">
          <MTopAppBar title="Elevated" :elevated="true" navigation-icon="menu">
            <template #actions>
              <MIconButton icon="search" label="Search" />
            </template>
          </MTopAppBar>
          <div class="flex h-16 items-center justify-center text-body-medium text-on-surface-variant">Content below</div>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Bordered"
      description="Use the bordered prop to add a bottom border. Useful when the app bar sits above content without elevation."
      :code="`<MTopAppBar title=&quot;My App&quot; :bordered=&quot;true&quot; navigation-icon=&quot;arrow_back&quot;>
  <template #actions>
    <MIconButton icon=&quot;more_vert&quot; label=&quot;More&quot; />
  </template>
</MTopAppBar>`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="overflow-hidden">
          <MTopAppBar title="Bordered" :bordered="true" navigation-icon="arrow_back">
            <template #actions>
              <MIconButton icon="search" label="Search" />
              <MIconButton icon="more_vert" label="More" />
            </template>
          </MTopAppBar>
          <div class="flex h-16 items-center justify-center text-body-medium text-on-surface-variant">Content below</div>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Navigation Slot"
      description="Use the #navigation slot for full control over the leading area — for example, to conditionally show a menu icon only on mobile. When overridden this way, the navigation event is no longer emitted by MTopAppBar itself."
      :code="`<MTopAppBar title=&quot;Dashboard&quot;>
  <template #navigation>
    <MResponsive hide=&quot;md-up&quot; tag=&quot;span&quot;>
      <MIconButton icon=&quot;menu&quot; label=&quot;Menu&quot; @click=&quot;drawerOpen = true&quot; />
    </MResponsive>
  </template>
  <template #actions>
    <MIconButton icon=&quot;notifications&quot; label=&quot;Alerts&quot; />
  </template>
</MTopAppBar>`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="overflow-hidden">
          <MTopAppBar title="Dashboard" :bordered="true">
            <template #navigation>
              <MIconButton icon="menu" label="Menu" />
            </template>
            <template #actions>
              <MIconButton icon="notifications" label="Alerts" />
              <MIconButton icon="more_vert" label="More" />
            </template>
          </MTopAppBar>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="topAppBarProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="topAppBarEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="topAppBarSlots" />

    <ComponentPager current="MTopAppBar" />
  </div>
</template>
