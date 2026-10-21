<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MCard, MIcon, MScheme, MCheckbox, useConfetti } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const { fire } = useConfetti()

// A checklist: finishing it celebrates from the card
const tasks = ref([
  { label: 'Water the plants', done: true },
  { label: 'Reply to Ana', done: true },
  { label: 'Book the dentist', done: false },
])
const card = ref<InstanceType<typeof MCard>>()
function toggle(i: number, value: boolean) {
  tasks.value[i]!.done = value
  if (tasks.value.every((t) => t.done)) fire(card.value?.$el as Element, { count: 120 })
}

const types: TypeDef[] = [
  {
    name: 'useConfetti()',
    description: 'Returns fire(). fireConfetti(origin?, options?) is the same as a plain function, outside components',
    fields: [
      { name: 'fire(origin?, options?)', type: '(origin?: MouseEvent | Element | { x, y } | ConfettiOptions, options?: ConfettiOptions) => void', required: true, description: 'Bursts from the pointer of a click (from the element for a keyboard click), from an element\'s center, or from a point in viewport pixels; with only options (or nothing), from the lower middle of the screen. The colors are read from the origin, so a burst inside an MScheme takes its scheme' },
    ],
  },
  {
    name: 'ConfettiOptions',
    fields: [
      { name: 'count', type: 'number', description: 'How many pieces (80; 160 for from: \'top\')' },
      { name: 'shapes', type: 'ShapeName[]', description: 'MShape\'s shape names to pick from (Cookie4Sided, Sunny, Heart, Clover4Leaf…)' },
      { name: 'colors', type: 'string[]', description: 'Any CSS colors. Default: primary, secondary, tertiary and their containers, read at the origin' },
      { name: 'from', type: "'point' | 'top'", description: 'Burst from a point (default) or rain from the top of the screen' },
      { name: 'angle', type: 'number', description: 'Burst angle in degrees, 0 = up' },
      { name: 'spread', type: 'number', description: 'Cone the pieces leave in, in degrees (70)' },
      { name: 'velocity', type: 'number', description: 'Launch speed in px/s (950)' },
      { name: 'size', type: 'number', description: 'Piece size in px (14)' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useConfetti</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A burst of confetti made of Material 3's expressive shapes, in your theme's colors, for the end of a flow: an
      order placed, a goal met, a list done. It draws on one canvas over the page that ignores clicks and screen
      readers and goes away when the last piece lands, and it does nothing when the system asks for reduced motion.
    </p>

    <ComponentDemo
      title="From a Click"
      description="Pass the click event and the pieces fly from the pointer, in the theme's colors."
      :code="`<script setup>
import { useConfetti } from '@m3ui-vue/m3ui-vue'
const { fire } = useConfetti()
</script>

<template>
  <MButton icon=&quot;celebration&quot; @click=&quot;fire($event)&quot;>Celebrate</MButton>
</template>`"
    >
      <MButton size="md" icon="celebration" @click="fire($event)">Celebrate</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="When Something Is Done"
      description="Tick the last task: the burst comes from the card's center."
      :code="`<template>
  <MCard ref=&quot;card&quot;>…</MCard>
</template>

<script setup>
function toggle(i, value) {
  tasks.value[i].done = value
  if (tasks.value.every((t) => t.done)) fire(card.value.$el, { count: 120 })
}
</script>`"
    >
      <MCard ref="card" variant="outlined" class="w-full max-w-sm p-4">
        <p class="mb-2 text-title-medium">Today</p>
        <label v-for="(task, i) in tasks" :key="task.label" class="flex cursor-pointer items-center gap-3 py-1">
          <MCheckbox :model-value="task.done" @update:model-value="(v: boolean) => toggle(i, v)" />
          <span class="text-body-large" :class="task.done && 'text-on-surface-variant line-through'">{{ task.label }}</span>
        </label>
      </MCard>
    </ComponentDemo>

    <ComponentDemo
      title="In a Scheme's Colors"
      description="The colors are read where the burst starts: inside an MScheme, they're its scheme's."
      :code="`<template>
  <MScheme seed=&quot;#c8432b&quot; variant=&quot;content&quot;>
    <MButton @click=&quot;fire($event)&quot;>Order placed</MButton>
  </MScheme>
</template>`"
    >
      <div class="flex flex-wrap justify-center gap-3">
        <MScheme v-for="seed in ['#c8432b', '#e5b92c', '#3b8a5a', '#3b4ca0']" :key="seed" :seed="seed" variant="content">
          <MButton icon="check" @click="fire($event)">Order placed</MButton>
        </MScheme>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Shapes and Rain"
      description="Pick the shapes, or let it rain from the top of the screen."
      :code="`<template>
  <MButton @click=&quot;fire($event, { shapes: ['Heart'], colors: ['#e91e63', '#ff80ab'] })&quot;>Love it</MButton>
  <MButton @click=&quot;fire({ from: 'top' })&quot;>Let it rain</MButton>
</template>`"
    >
      <div class="flex flex-wrap justify-center gap-3">
        <MButton variant="tonal" @click="fire($event, { shapes: ['Heart'], colors: ['#e91e63', '#ff80ab', '#f8bbd0'], count: 50 })">
          <MIcon name="favorite" filled :size="18" /> Love it
        </MButton>
        <MButton variant="tonal" @click="fire($event, { shapes: ['Sunny', 'SoftBurst'], spread: 120, velocity: 700 })">Sunny burst</MButton>
        <MButton icon="water_drop" @click="fire({ from: 'top' })">Let it rain</MButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <ComponentPager current="useConfetti" />
  </div>
</template>
