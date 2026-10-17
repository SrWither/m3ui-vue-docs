<script setup lang="ts">
import { ref } from 'vue'
import { MBottomAppBar, MIconButton, MFab, MSegmentedButton } from '@m3ui-vue/m3ui-vue'
import type { SegmentedOption } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const bottomAppBarProps: PropDef[] = [
  { name: 'flexible', type: 'boolean', default: 'false', description: "M3 Expressive's FlexibleBottomAppBar: 64px instead of 80px, 16px side padding, actions spread across the bar, no FAB slot" },
  { name: 'arrangement', type: "'start' | 'between' | 'around' | 'evenly' | 'fixed'", default: "'start' (standard), 'between' (flexible)", description: 'How the actions are spread; fixed centers them 32px apart' },
  { name: 'color', type: "'surface' | 'primary' | 'secondary' | 'tertiary'", default: "'surface'", description: 'Container color: surface-container, or a color\'s container for a vibrant bar' },
  { name: 'scrollBehavior', type: "'pinned' | 'exit-always'", default: "'pinned'", description: 'exit-always collapses the bar while the content scrolls down and brings it back when it scrolls up; left half-way, it snaps to the closer end' },
  { name: 'scrollTarget', type: 'HTMLElement | string | null', default: 'null (the window)', description: 'What exit-always follows: an element or a CSS selector for it' },
]

const bottomAppBarSlots: SlotDef[] = [
  { name: '#default', description: 'The actions, usually MIconButtons' },
  { name: '#fab', description: 'A FAB at the end of the standard bar. An MFab here turns secondary and drops its shadow, as M3\'s bottom app bar FAB' },
]

type Arrangement = 'between' | 'around' | 'evenly' | 'fixed'
const arrangement = ref<Arrangement>('between')
const arrangementOptions: SegmentedOption[] = [
  { value: 'between', label: 'Between' },
  { value: 'around', label: 'Around' },
  { value: 'evenly', label: 'Evenly' },
  { value: 'fixed', label: 'Fixed' },
]

const scrollEl = ref<HTMLElement | null>(null)
const messages = Array.from({ length: 30 }, (_, i) => `Message ${i + 1}`)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MBottomAppBar</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Material 3's bottom app bar: navigation and key actions at the bottom of small screens, with an optional FAB
      at the end. With <code>flexible</code> it's Material 3 Expressive's flexible bottom app bar, shorter, with
      the actions spread across it. It can hide while the content scrolls down.
    </p>

    <ComponentDemo
      title="Bottom App Bar with FAB"
      description="80px tall on surface-container, actions at the start and a FAB at the end. The FAB takes the bar's secondary color and lies flat on it."
      :code="`<MBottomAppBar>
  <MIconButton icon=&quot;check&quot; label=&quot;Check&quot; />
  <MIconButton icon=&quot;edit&quot; label=&quot;Edit&quot; />
  <MIconButton icon=&quot;mic&quot; label=&quot;Voice&quot; />
  <MIconButton icon=&quot;image&quot; label=&quot;Image&quot; />
  <template #fab>
    <MFab icon=&quot;add&quot; />
  </template>
</MBottomAppBar>`"
    >
      <div class="w-full max-w-sm overflow-hidden rounded-xl border border-outline-variant">
        <div class="h-40 bg-surface p-4 text-body-medium text-on-surface-variant">Screen content</div>
        <MBottomAppBar>
          <MIconButton icon="check" label="Check" />
          <MIconButton icon="edit" label="Edit" />
          <MIconButton icon="mic" label="Voice" />
          <MIconButton icon="image" label="Image" />
          <template #fab>
            <MFab icon="add" />
          </template>
        </MBottomAppBar>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Flexible Bottom App Bar"
      description="M3 Expressive's flexible bar: 64px, with the actions spread across it. Pick how they're spaced; the second bar is a vibrant one on primary-container."
      :code="`<MBottomAppBar flexible arrangement=&quot;${arrangement}&quot;>
  <MIconButton icon=&quot;arrow_back&quot; label=&quot;Back&quot; />
  <MIconButton icon=&quot;arrow_forward&quot; label=&quot;Forward&quot; />
  <MIconButton icon=&quot;add&quot; label=&quot;Add&quot; variant=&quot;filled&quot; />
  <MIconButton icon=&quot;check&quot; label=&quot;Check&quot; />
  <MIconButton icon=&quot;edit&quot; label=&quot;Edit&quot; />
</MBottomAppBar>

<MBottomAppBar flexible arrangement=&quot;${arrangement}&quot; color=&quot;primary&quot;>…</MBottomAppBar>`"
    >
      <div class="flex w-full max-w-sm flex-col gap-4">
        <MSegmentedButton v-model="arrangement" :options="arrangementOptions" density="compact" />
        <div class="overflow-hidden rounded-xl border border-outline-variant">
          <MBottomAppBar flexible :arrangement="arrangement">
            <MIconButton icon="arrow_back" label="Back" />
            <MIconButton icon="arrow_forward" label="Forward" />
            <MIconButton icon="add" label="Add" variant="filled" />
            <MIconButton icon="check" label="Check" />
            <MIconButton icon="edit" label="Edit" />
          </MBottomAppBar>
        </div>
        <div class="overflow-hidden rounded-xl border border-outline-variant">
          <MBottomAppBar flexible :arrangement="arrangement" color="primary">
            <MIconButton icon="arrow_back" label="Back" />
            <MIconButton icon="arrow_forward" label="Forward" />
            <MIconButton icon="add" label="Add" variant="filled" />
            <MIconButton icon="check" label="Check" />
            <MIconButton icon="edit" label="Edit" />
          </MBottomAppBar>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Hide on Scroll (exit-always)"
      description="Scroll the list: the bar collapses as the content goes down and returns as it comes back up, giving its space to the list. Stop half-way and it snaps to the closer end. Without scroll-target it follows the window."
      :code="`<div class=&quot;flex h-96 flex-col&quot;>
  <div ref=&quot;scrollEl&quot; class=&quot;flex-1 overflow-y-auto&quot;>…</div>
  <MBottomAppBar flexible scroll-behavior=&quot;exit-always&quot; :scroll-target=&quot;scrollEl&quot;>
    …
  </MBottomAppBar>
</div>`"
      :script="`const scrollEl = ref<HTMLElement | null>(null)`"
    >
      <div class="flex h-96 w-full max-w-sm flex-col overflow-hidden rounded-xl border border-outline-variant">
        <div ref="scrollEl" class="flex-1 overflow-y-auto bg-surface">
          <div
            v-for="m in messages"
            :key="m"
            class="border-b border-outline-variant px-4 py-3 text-body-large text-on-surface"
          >
            {{ m }}
          </div>
        </div>
        <MBottomAppBar flexible scroll-behavior="exit-always" :scroll-target="scrollEl">
          <MIconButton icon="arrow_back" label="Back" />
          <MIconButton icon="arrow_forward" label="Forward" />
          <MIconButton icon="add" label="Add" variant="filled" />
          <MIconButton icon="check" label="Check" />
          <MIconButton icon="edit" label="Edit" />
        </MBottomAppBar>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="bottomAppBarProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="bottomAppBarSlots" />

    <ComponentPager current="MBottomAppBar" />
  </div>
</template>
