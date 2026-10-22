<script setup lang="ts">
import { ref } from 'vue'
import { MButton, useScrollReveal } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const tiles = ref<HTMLElement[]>([])
const run = ref(0)
useScrollReveal(tiles, { effect: 'scale', stagger: 40 })
const colors = ['bg-primary-container', 'bg-secondary-container', 'bg-tertiary-container']

const types: TypeDef[] = [
  {
    name: 'useScrollReveal(target, options?)',
    description: 'Reveals elements as they scroll into view; stops when the component unmounts',
    fields: [
      { name: 'target', type: 'MaybeRefOrGetter<Element | Element[] | null>', required: true, description: 'An element, a template ref, an array of them (a v-for ref), or a getter. Elements added later are picked up' },
      { name: 'options', type: 'ScrollRevealOptions', description: 'effect, distance, delay, stagger, once, threshold, rootMargin, scheme: see v-reveal' },
    ],
  },
  { name: 'Returns', fields: [{ name: 'stop', type: '() => void', description: 'Stops watching; what was revealed stays' }] },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useScrollReveal</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The engine behind v-reveal, for elements you hold in refs: a v-for of tiles, a section built in code. They fade in
      on Material 3's springs as they scroll into view, cascading when several enter together. Off with reduced motion.
    </p>

    <ComponentDemo
      title="A grid from a v-for ref"
      description="Scroll the grid into view, or replay it: the tiles grow in one after another."
      :code="`<div v-for=&quot;n in 12&quot; :key=&quot;n&quot; ref=&quot;tiles&quot; class=&quot;h-20 rounded-xl bg-primary-container&quot; />`"
      :script="`import { ref } from 'vue'
import { useScrollReveal } from '@m3ui-vue/m3ui-vue'

const tiles = ref<HTMLElement[]>([])
useScrollReveal(tiles, { effect: 'scale', stagger: 40 })`"
    >
      <div class="flex w-full flex-col gap-3">
        <MButton variant="tonal" icon="replay" class="self-start" @click="tiles = []; run++">Replay</MButton>
        <div :key="run" class="grid grid-cols-3 gap-3 sm:grid-cols-6">
          <div v-for="n in 12" :key="n" ref="tiles" class="h-20 rounded-xl" :class="colors[n % 3]" />
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <ComponentPager current="useScrollReveal" />
  </div>
</template>
