<script setup lang="ts">
import { ref } from 'vue'
import { MCard, MIcon, MIconButton, vScrollElevation } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const messages = Array.from({ length: 24 }, (_, i) => ({
  from: ['Ada', 'Grace', 'Alan', 'Linus', 'Margaret', 'Dennis'][i % 6]!,
  text: ['Lunch tomorrow?', 'Draft attached', 'Build is green', 'Re: the release', 'Photos from Saturday', 'Quick question'][i % 6]!,
}))

const list = ref<HTMLElement>()
const scrolledState = ref(false)

const types: TypeDef[] = [
  {
    name: 'ScrollElevationValue',
    description: 'What v-scroll-elevation accepts',
    fields: [
      { name: '(none) / true', type: 'undefined | true', description: 'Follows the window' },
      { name: 'false', type: 'false', description: 'Off (same as { disabled: true })' },
      { name: "'#list'", type: 'string', description: 'Follows the element that selector finds (same as { target })' },
      { name: '{ … }', type: 'ScrollElevationOptions', description: 'Several settings at once' },
    ],
  },
  {
    name: 'ScrollElevationOptions',
    fields: [
      { name: 'target', type: 'HTMLElement | Window | string', description: 'What scrolls: an element (a template ref works), a CSS selector, or the window (default)' },
      { name: 'threshold', type: 'number', description: 'How far (px) it has to scroll before the element counts as scrolled (default 0: any scroll)' },
      { name: 'color', type: 'string | false', description: "The background while scrolled (default var(--color-surface-container), M3's scrolled app bar color); false changes no color, so you style [data-scrolled] yourself" },
      { name: 'onChange', type: '(scrolled: boolean) => void', description: 'Called when the scrolled state changes' },
      { name: 'disabled', type: 'boolean', description: 'Stops following the scroll while true' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">v-scroll-elevation</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Your own header or toolbar reacts to the content scrolling under it, as M3's top app bar does: once the
      content leaves the top, it takes the scrolled container color (surface-container), and goes back when the
      content returns. It also gets a <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">data-scrolled</code>
      attribute for anything else you want to change. For a full app bar, MTopAppBar's
      <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">scrollBehavior</code> already does this.
    </p>

    <ComponentDemo
      title="Header over a list"
      description="Scroll the list: the header takes the scrolled color, and fades thanks to transition-colors."
      :code="`<header
  v-scroll-elevation=&quot;{ target: list }&quot;
  class=&quot;flex items-center gap-2 bg-surface px-4 py-2 transition-colors&quot;
>
  <h2 class=&quot;flex-1 text-title-large&quot;>Inbox</h2>
  <MIconButton icon=&quot;search&quot; label=&quot;Search&quot; />
</header>
<ul ref=&quot;list&quot; class=&quot;h-72 overflow-y-auto&quot;>…</ul>`"
      :script="`// With createM3UI() installed, v-scroll-elevation is already registered.
// Without the plugin, import it: a vScrollElevation variable becomes v-scroll-elevation in the template.
import { ref } from 'vue'
import { vScrollElevation } from '@m3ui-vue/m3ui-vue'

const list = ref<HTMLElement>()`"
    >
      <div class="flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface">
        <header
          v-scroll-elevation="{ target: list, onChange: (s: boolean) => (scrolledState = s) }"
          class="flex items-center gap-2 bg-surface px-4 py-2 transition-colors"
        >
          <h2 class="flex-1 text-title-large">Inbox</h2>
          <MIconButton icon="search" label="Search" />
        </header>
        <ul ref="list" class="h-72 overflow-y-auto">
          <li v-for="(m, i) in messages" :key="i" class="flex items-center gap-4 px-4 py-3">
            <MIcon name="account_circle" class="text-on-surface-variant" />
            <div class="min-w-0">
              <p class="text-body-large">{{ m.from }}</p>
              <p class="truncate text-body-medium text-on-surface-variant">{{ m.text }}</p>
            </div>
          </li>
        </ul>
      </div>
      <p class="mt-3 text-body-small text-on-surface-variant">onChange: {{ scrolledState ? 'scrolled' : 'at the top' }}</p>
    </ComponentDemo>

    <ComponentDemo
      title="Your own scrolled look"
      description="With color: false it only sets data-scrolled, so Tailwind's data-scrolled: variant styles it: here a shadow and a divider, after 40px."
      :code="`<header
  v-scroll-elevation=&quot;{ target: list, color: false, threshold: 40 }&quot;
  class=&quot;border-b border-transparent transition-[box-shadow,border-color]
         data-scrolled:border-outline-variant data-scrolled:shadow-elevation-2&quot;
>…</header>`"
    >
      <div class="flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
        <header
          v-scroll-elevation="{ target: '#scroll-elevation-own', color: false, threshold: 40 }"
          class="relative z-10 flex items-center gap-2 border-b border-transparent bg-surface-container-low px-4 py-3 transition-[box-shadow,border-color] data-scrolled:border-outline-variant data-scrolled:shadow-elevation-2"
        >
          <h2 class="flex-1 text-title-medium">Recent files</h2>
        </header>
        <ul id="scroll-elevation-own" class="h-60 overflow-y-auto">
          <li v-for="(m, i) in messages" :key="i" class="px-4 py-3 text-body-large">{{ m.text }}</li>
        </ul>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Value</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>The color goes inline while scrolled, so it wins over the element's own <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">bg-*</code> class and gives it back at the top</li>
        <li>M3 only changes the color on scroll (no shadow); add one through <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">data-scrolled:</code> if your design wants it</li>
        <li>A template ref or a selector that isn't there yet when the element mounts is picked up on the next render</li>
        <li>On a component it lands on the component's root element, and Vue ignores it on components with more than one root</li>
      </ul>
    </MCard>

    <ComponentPager current="v-scroll-elevation" />
  </div>
</template>
