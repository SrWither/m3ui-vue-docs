<script setup lang="ts">
import { ref } from 'vue'
import { MAvatar, MButton, MCard, MSegmentedButton, MSwitch, vSkeleton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const loading = ref(true)
const animation = ref<'pulse' | 'wave' | 'none'>('pulse')
const animations = [
  { value: 'pulse' as const, label: 'pulse' },
  { value: 'wave' as const, label: 'wave' },
  { value: 'none' as const, label: 'none' },
]

// A list that "loads": rows render with placeholder text until the data arrives
interface Person { name: string, role: string }
const people = ref<Person[] | null>(null)
function load() {
  people.value = null
  setTimeout(() => {
    people.value = [
      { name: 'Ada Lovelace', role: 'Analyst' },
      { name: 'Grace Hopper', role: 'Compiler engineer' },
      { name: 'Alan Turing', role: 'Mathematician' },
    ]
  }, 1500)
}
load()

const types: TypeDef[] = [
  {
    name: 'SkeletonValue',
    description: 'What v-skeleton accepts',
    fields: [
      { name: 'loading', type: 'boolean', description: 'Shows the placeholder while true (pulse animation)' },
      { name: '{ … }', type: 'SkeletonOptions', description: 'Loading and the animation' },
    ],
  },
  {
    name: 'SkeletonOptions',
    fields: [
      { name: 'loading', type: 'boolean', description: 'Shows the placeholder while true' },
      { name: 'animation', type: "'pulse' | 'wave' | 'none'", description: "MSkeleton's animations (default 'pulse')" },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">v-skeleton</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Turns the real element into its own loading placeholder: it keeps its size and corners, hides its content
      and takes MSkeleton's tint and animation, so the layout doesn't jump when the data arrives. No separate
      skeleton markup to keep in sync with the real one.
    </p>

    <ComponentDemo
      title="Profile card"
      description="Each part of the card is its own placeholder; the card around them stays."
      :code="`<MCard class=&quot;flex items-center gap-4 p-4&quot;>
  <MAvatar v-skeleton=&quot;{ loading, animation }&quot; name=&quot;Ada Lovelace&quot; />
  <div class=&quot;flex flex-col items-start gap-1&quot;>
    <p v-skeleton=&quot;{ loading, animation }&quot; class=&quot;rounded-full text-title-medium&quot;>Ada Lovelace</p>
    <p v-skeleton=&quot;{ loading, animation }&quot; class=&quot;rounded-full text-body-medium&quot;>Analyst, Analytical Engine</p>
  </div>
  <MButton v-skeleton=&quot;{ loading, animation }&quot; variant=&quot;tonal&quot;>Follow</MButton>
</MCard>`"
      :script="`// With createM3UI() installed, v-skeleton is already registered.
// Without the plugin, import it: a vSkeleton variable becomes v-skeleton in the template.
import { ref } from 'vue'
import { vSkeleton } from '@m3ui-vue/m3ui-vue'

const loading = ref(true)
const animation = ref('pulse')`"
    >
      <div class="flex w-full flex-col gap-4">
        <div class="flex flex-wrap items-center gap-6">
          <label class="flex items-center gap-3 text-body-large">
            <MSwitch v-model="loading" />
            Loading
          </label>
          <MSegmentedButton v-model="animation" :options="animations" />
        </div>
        <MCard variant="outlined" class="flex w-full max-w-md items-center gap-4 p-4">
          <MAvatar v-skeleton="{ loading, animation }" name="Ada Lovelace" />
          <div class="flex min-w-0 flex-1 flex-col items-start gap-1">
            <p v-skeleton="{ loading, animation }" class="rounded-full text-title-medium">Ada Lovelace</p>
            <p v-skeleton="{ loading, animation }" class="rounded-full text-body-medium text-on-surface-variant">Analyst, Analytical Engine</p>
          </div>
          <MButton v-skeleton="{ loading, animation }" variant="tonal">Follow</MButton>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Placeholder text while the data loads"
      description="Before the data exists, render the rows with stand-in text: it sizes each placeholder, so the list keeps the height it will have."
      :code="`<li v-for=&quot;i in 3&quot; :key=&quot;i&quot;>
  <p v-skeleton=&quot;!people&quot; class=&quot;rounded-full&quot;>{{ people?.[i - 1]?.name ?? 'Loading a name' }}</p>
  <p v-skeleton=&quot;!people&quot; class=&quot;rounded-full&quot;>{{ people?.[i - 1]?.role ?? 'Loading the role' }}</p>
</li>`"
    >
      <div class="flex w-full max-w-md flex-col gap-3">
        <ul class="overflow-hidden rounded-xl bg-surface-container">
          <li v-for="i in 3" :key="i" class="flex items-center gap-4 px-4 py-3">
            <MAvatar v-skeleton="!people" :name="people?.[i - 1]?.name ?? '?'" :size="40" />
            <div class="flex flex-col items-start gap-1">
              <p v-skeleton="!people" class="rounded-full text-body-large">{{ people?.[i - 1]?.name ?? 'Loading a name' }}</p>
              <p v-skeleton="!people" class="rounded-full text-body-medium text-on-surface-variant">{{ people?.[i - 1]?.role ?? 'Loading the role' }}</p>
            </div>
          </li>
        </ul>
        <MButton variant="text" icon="refresh" class="self-start" @click="load">Load again</MButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Value</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>The content stays in the layout, only invisible: it's what gives the placeholder its size. An empty element has none, so give it stand-in text or a size</li>
        <li>While loading, the element's background, text color, border and shadow give way to the placeholder, it ignores the pointer, and it's <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">aria-busy</code></li>
        <li>Corners come from the element: <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">rounded-full</code> on a line of text gives the pill shape of MSkeleton's text variant. Inline text that should be only as wide as itself needs an inline or <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">items-start</code> parent</li>
        <li>With reduced motion it doesn't animate. For placeholders with no real element behind them, use <router-link to="/components/data-display/mskeleton" class="text-primary">MSkeleton</router-link></li>
      </ul>
    </MCard>

    <ComponentPager current="v-skeleton" />
  </div>
</template>
