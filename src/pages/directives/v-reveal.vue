<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MCard, MIcon, vReveal } from '@m3ui-vue/m3ui-vue'
import type { RevealEffect } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

// Remounting replays the reveal
const listRun = ref(0)
const effectsRun = ref(0)
const features = [
  { icon: 'bolt', title: 'Fast', text: 'Compositor-driven springs, no layout work.' },
  { icon: 'palette', title: 'Themed', text: 'Follows your palette and dark mode.' },
  { icon: 'accessibility_new', title: 'Accessible', text: 'Off with reduced motion: content is just there.' },
  { icon: 'devices', title: 'Everywhere', text: 'Phones, tablets and desktops alike.' },
]
const effects: RevealEffect[] = ['fade-up', 'fade', 'scale', 'slide-left', 'slide-right']

// A long scrolling feed: two columns sliding in from their own side, slow springs, again on every pass
const moods = [
  { icon: 'landscape', name: 'Mountains', tone: 'from-emerald-400 to-teal-700' },
  { icon: 'waves', name: 'Coast', tone: 'from-sky-300 to-blue-700' },
  { icon: 'local_florist', name: 'Gardens', tone: 'from-pink-300 to-rose-600' },
  { icon: 'wb_twilight', name: 'Dusk', tone: 'from-amber-300 to-orange-600' },
  { icon: 'forest', name: 'Woods', tone: 'from-lime-400 to-green-800' },
  { icon: 'nights_stay', name: 'Night', tone: 'from-indigo-400 to-violet-900' },
]
const feed = Array.from({ length: 36 }, (_, i) => ({ id: i, ...moods[(i * 5) % moods.length]!, tall: i % 3 === 0 }))

const types: TypeDef[] = [
  {
    name: 'RevealValue',
    description: 'What v-reveal accepts',
    fields: [
      { name: '(none) / true', type: 'undefined | true', description: 'Fades up from 24px below' },
      { name: 'false', type: 'false', description: 'Off' },
      { name: "'scale'", type: 'RevealEffect', description: "An effect: 'fade-up' | 'fade' | 'scale' | 'slide-left' | 'slide-right'" },
      { name: '{ … }', type: 'ScrollRevealOptions', description: 'Every option (see below)' },
    ],
  },
  {
    name: 'ScrollRevealOptions',
    fields: [
      { name: 'effect', type: 'RevealEffect', description: "How it enters (default 'fade-up')" },
      { name: 'distance', type: 'number', description: 'Distance in px for the slide effects (default 24)' },
      { name: 'delay', type: 'number', description: 'Delay in ms before it starts (default 0)' },
      { name: 'stagger', type: 'number', description: 'Extra delay in ms for each next element entering at the same time, so a list cascades (default 60)' },
      { name: 'once', type: 'boolean', description: 'Reveal only the first time (default true); false hides it again when it leaves the screen' },
      { name: 'threshold', type: 'number', description: 'How much of it has to be visible, 0 to 1 (default 0.15)' },
      { name: 'rootMargin', type: 'string', description: "Grows or shrinks the visible area, like IntersectionObserver's rootMargin (default '0px')" },
      { name: 'scheme', type: "'standard' | 'expressive'", description: "Motion scheme of the springs (default 'standard'; expressive bounces a little)" },
      { name: 'speed', type: "'fast' | 'default' | 'slow'", description: "Pace: M3's fast, default or slow springs (default 'default'); slow suits large, calm entrances" },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">v-reveal</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Reveals an element as it scrolls into view: it fades (and slides or grows) in on Material 3's springs, played by
      the compositor. Items of a list with the same options cascade in together. With reduced motion it does nothing:
      the content is simply there. For elements you hold in refs, see useScrollReveal.
    </p>

    <ComponentDemo
      title="A list that cascades in"
      description="v-reveal on each item: the ones entering together come in one after another (stagger). Replay remounts them."
      :code="`<MCard v-for=&quot;f in features&quot; :key=&quot;f.title&quot; v-reveal class=&quot;p-4&quot;>
  …
</MCard>`"
      :script="`// Registered by createM3UI(); without the plugin:
import { vReveal } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex w-full flex-col gap-3">
        <MButton variant="tonal" icon="replay" class="self-start" @click="listRun++">Replay</MButton>
        <div :key="listRun" class="grid gap-3 sm:grid-cols-2">
          <MCard v-for="f in features" :key="f.title" v-reveal variant="filled" class="flex gap-3 p-4">
            <MIcon :name="f.icon" class="text-primary" />
            <div>
              <p class="text-title-medium text-on-surface">{{ f.title }}</p>
              <p class="text-body-medium text-on-surface-variant">{{ f.text }}</p>
            </div>
          </MCard>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Effects"
      description="Pass an effect name, or options such as a longer stagger or the expressive scheme."
      :code="`<div v-reveal=&quot;'scale'&quot;>…</div>
<div v-reveal=&quot;{ effect: 'slide-left', distance: 48, scheme: 'expressive' }&quot;>…</div>`"
    >
      <div class="flex w-full flex-col gap-3">
        <MButton variant="tonal" icon="replay" class="self-start" @click="effectsRun++">Replay</MButton>
        <div :key="effectsRun" class="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div
            v-for="e in effects"
            :key="e"
            v-reveal="{ effect: e, distance: 48, stagger: 120, scheme: 'expressive' }"
            class="flex h-24 items-center justify-center rounded-2xl bg-tertiary-container text-label-large text-on-tertiary-container"
          >
            {{ e }}
          </div>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="A long, slow feed"
      description="Scroll the panel: 36 cards slide in from their column's side on M3's slow springs, cascading row by row. With once: false they leave again as they scroll out, so they come back on every pass, up or down."
      :code="`<div class=&quot;h-[28rem] overflow-x-hidden overflow-y-auto&quot;>
  <div class=&quot;grid grid-cols-2 gap-3&quot;>
    <div
      v-for=&quot;(card, i) in feed&quot;
      :key=&quot;card.id&quot;
      v-reveal=&quot;{ effect: i % 2 ? 'slide-left' : 'slide-right', distance: 40, speed: 'slow', stagger: 90, once: false }&quot;
    >…</div>
  </div>
</div>`"
    >
      <div class="h-[28rem] w-full overflow-x-hidden overflow-y-auto rounded-2xl bg-surface-container-low p-3">
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="(card, i) in feed"
            :key="card.id"
            v-reveal="{ effect: i % 2 ? 'slide-left' : 'slide-right', distance: 40, speed: 'slow', stagger: 90, once: false }"
            class="flex flex-col justify-end overflow-hidden rounded-2xl bg-linear-to-br p-4 text-white shadow-elevation-1"
            :class="[card.tone, card.tall ? 'h-48' : 'h-32']"
          >
            <MIcon :name="card.icon" :size="28" class="mb-auto opacity-90" />
            <p class="text-title-medium">{{ card.name }}</p>
            <p class="text-label-medium opacity-80">#{{ card.id + 1 }}</p>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>It hides the element with inline opacity and transform while it waits, so don't animate those two on it yourself</li>
        <li>Rendered on the server as is; it hides only once mounted in the browser, so content never stays invisible without JavaScript</li>
        <li>The slide effects move elements sideways while they enter: give a scrolling container <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">overflow-x-hidden</code> so they don't add a horizontal scrollbar</li>
      </ul>
    </MCard>

    <ComponentPager current="v-reveal" />
  </div>
</template>
