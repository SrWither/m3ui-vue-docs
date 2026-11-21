<script setup lang="ts">
import { ref } from 'vue'
import { MTypewriter, MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const once = ref<InstanceType<typeof MTypewriter>>()

const props: PropDef[] = [
  { name: 'text', type: 'string | string[]', description: 'A phrase, or phrases typed one after another' },
  { name: 'typeSpeed', type: 'number', default: '70', description: 'Milliseconds per character typed' },
  { name: 'deleteSpeed', type: 'number', default: '35', description: 'Milliseconds per character erased' },
  { name: 'pause', type: 'number', default: '1600', description: 'Milliseconds a typed phrase stays before it is erased' },
  { name: 'startDelay', type: 'number', default: '300', description: 'Milliseconds before the first character' },
  { name: 'loop', type: 'boolean', default: 'true', description: 'Start over after the last phrase; off stops on it (and emits done)' },
  { name: 'smartBackspace', type: 'boolean', default: 'true', description: 'Erase only the end that differs from the next phrase' },
  { name: 'humanize', type: 'boolean', default: 'true', description: "Vary each keystroke's delay a little, like a person typing" },
  { name: 'cursor', type: 'boolean', default: 'true', description: 'Show the blinking caret (2px, primary)' },
  { name: 'startOnVisible', type: 'boolean', default: 'true', description: "Wait until it's on screen to start" },
  { name: 'tag', type: 'string', default: "'span'", description: 'Element rendered' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTypewriter</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Text that types itself out and, with several phrases, erases and types the next in a loop, behind a blinking
      caret. Only the end that differs is erased, it counts emoji and accented letters as one keystroke, starts when it
      scrolls into view, and with reduced motion swaps whole phrases. Screen readers get every phrase once instead of
      each keystroke.
    </p>

    <ComponentDemo
      title="Hero"
      description="Phrases sharing a start keep it: only “faster”, “prettier”, “accessible” are erased and typed."
      :code="`<template>
  <h2 class=&quot;text-display-small&quot;>
    <MTypewriter :text=&quot;['Build faster apps', 'Build prettier apps', 'Build accessible apps']&quot; />
  </h2>
</template>`"
    >
      <h2 class="text-display-small font-medium">
        <MTypewriter :text="['Build faster apps', 'Build prettier apps', 'Build accessible apps']" />
      </h2>
    </ComponentDemo>

    <ComponentDemo
      title="Highlighted Word"
      description="Only the changing word types: style it like any text."
      :code="`<template>
  <p class=&quot;text-headline-medium&quot;>
    Made for
    <MTypewriter :text=&quot;['restaurants', 'clinics', 'schools', 'shops 🛍️']&quot; class=&quot;text-primary&quot; />
  </p>
</template>`"
    >
      <p class="text-headline-medium">
        Made for
        <MTypewriter :text="['restaurants', 'clinics', 'schools', 'shops 🛍️']" class="font-medium text-primary" />
      </p>
    </ComponentDemo>

    <ComponentDemo
      title="Once, Like a Terminal"
      description="loop off types every phrase and stops on the last; restart() starts over. A custom caret through #cursor."
      :code="`<template>
  <MTypewriter ref=&quot;term&quot; :text=&quot;['npm i @m3ui-vue/m3ui-vue', 'added 1 package in 2s ✔']&quot; :loop=&quot;false&quot; :type-speed=&quot;40&quot;>
    <template #cursor>█</template>
  </MTypewriter>
  <MButton @click=&quot;term.restart()&quot;>Replay</MButton>
</template>`"
    >
      <div class="flex w-full flex-col gap-3">
        <div class="rounded-md bg-inverse-surface p-4 font-mono text-body-medium text-inverse-on-surface">
          $ <MTypewriter ref="once" :text="['npm i @m3ui-vue/m3ui-vue', 'added 1 package in 2s ✔']" :loop="false" :type-speed="40">
            <template #cursor>█</template>
          </MTypewriter>
        </div>
        <MButton variant="tonal" icon="replay" class="self-start" @click="once?.restart()">Replay</MButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events, Slots and Methods</h3>
    <ul class="mb-6 list-disc space-y-1 pl-6 text-body-medium text-on-surface-variant">
      <li><code>typed</code>: a phrase fully typed, with its index</li>
      <li><code>done</code>: the last phrase typed, with <code>loop</code> off</li>
      <li><code>#cursor</code>: replaces the caret</li>
      <li><code>restart()</code> (template ref): starts over from the first phrase</li>
    </ul>

    <ComponentPager current="MTypewriter" />
  </div>
</template>
