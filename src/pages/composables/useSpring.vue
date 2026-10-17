<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { MButton, MCard, motionSprings, useSpring } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

// A card that grows and rounds its corners on a spring; clicking mid-flight retargets it smoothly
const big = ref(false)
const box = ref<HTMLElement | null>(null)
useSpring(
  () => (big.value ? [280, 160, 40] : [120, 80, 12]),
  ([width, height, radius]) => {
    if (!box.value) return
    box.value.style.width = `${width}px`
    box.value.style.height = `${height}px`
    box.value.style.borderRadius = `${radius}px`
  },
  motionSprings.expressive.defaultSpatial,
)

// Pointer follower: the target moves on every pointermove and the spring keeps chasing it
const area = ref<HTMLElement | null>(null)
const follower = ref<HTMLElement | null>(null)
const pointer = ref<[number, number]>([0, 0])
useSpring(
  () => pointer.value,
  ([x, y]) => { if (follower.value) follower.value.style.transform = `translate(${x}px, ${y}px)` },
  motionSprings.expressive.slowSpatial,
)
function onAreaMove(e: PointerEvent) {
  const r = area.value!.getBoundingClientRect()
  pointer.value = [e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2]
}

// Counter: the number springs to its new value; snap() resets without counting down
const total = ref(0)
const counter = ref<HTMLElement | null>(null)
const { snap: snapCounter } = useSpring(
  () => [total.value],
  ([v]) => { if (counter.value) counter.value.textContent = Math.round(v!).toLocaleString() },
  motionSprings.standard.slowEffects,
)
function resetCounter() {
  total.value = 0
  snapCounter()
}

// Equalizer: one spring per bar, each retargeted on a timer; the Expressive spring makes them bounce
const playing = ref(false)
const levels = ref<number[]>(Array.from({ length: 12 }, () => 0.1))
const bars: (HTMLElement | null)[] = []
useSpring(
  () => levels.value,
  (values) => values.forEach((v, i) => { const b = bars[i]; if (b) b.style.transform = `scaleY(${Math.max(0.05, v)})` }),
  motionSprings.expressive.fastSpatial,
)
let timer = 0
function togglePlay() {
  playing.value = !playing.value
  clearInterval(timer)
  if (playing.value) {
    timer = window.setInterval(() => { levels.value = levels.value.map(() => 0.15 + Math.random() * 0.85) }, 180)
  } else {
    levels.value = levels.value.map(() => 0.1)
  }
}
onUnmounted(() => clearInterval(timer))

const types: TypeDef[] = [
  {
    name: 'useSpring(target, apply, spec?)',
    description: 'Springs a list of numbers toward target() whenever it changes, calling apply once per frame. Call it in setup',
    fields: [
      { name: 'target', type: '() => number[]', required: true, description: 'The values to spring toward, read reactively: the spring restarts (keeping its speed) when they change' },
      { name: 'apply', type: '(values: readonly number[]) => void', required: true, description: 'Writes the current values, e.g. to an element\'s style. Runs on mount with the starting values, then every frame while moving' },
      { name: 'spec', type: 'SpringSpec', description: 'dampingRatio and stiffness; defaults to the Standard fast spatial spring. Take one from motionSprings' },
    ],
  },
  {
    name: 'Returns',
    fields: [
      { name: 'snap', type: '() => void', description: 'Jumps to the target without animating (e.g. after a layout change)' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useSpring</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Animates numbers with a real spring, the way the library's own components move: give it the target values
      and a function that writes them. Unlike a CSS transition, a spring changed mid-flight keeps its speed and
      just heads for the new target. Use the specs in
      <RouterLink to="/styles/motion" class="text-primary underline">motionSprings</RouterLink>.
    </p>

    <ComponentDemo
      title="Grow on a spring"
      description="Click repeatedly, even while it moves: the card retargets without a jolt. Width, height and corner radius are three values on one Expressive spring."
      :code="`<div ref=&quot;box&quot; class=&quot;bg-primary-container&quot; />
<MButton @click=&quot;big = !big&quot;>Toggle</MButton>`"
      :script="`import { ref } from 'vue'
import { useSpring, motionSprings } from '@m3ui-vue/m3ui-vue'

const big = ref(false)
const box = ref<HTMLElement | null>(null)
useSpring(
  () => (big.value ? [280, 160, 40] : [120, 80, 12]),
  ([width, height, radius]) => {
    if (!box.value) return
    box.value.style.width = \`\${width}px\`
    box.value.style.height = \`\${height}px\`
    box.value.style.borderRadius = \`\${radius}px\`
  },
  motionSprings.expressive.defaultSpatial,
)`"
    >
      <div class="flex w-full flex-col items-start gap-4">
        <MButton @click="big = !big">Toggle</MButton>
        <div class="flex h-44 items-center">
          <div ref="box" class="bg-primary-container" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Follow the pointer"
      description="Move the pointer over the box: the target changes on every move and the spring keeps chasing it, carrying its speed, so it trails and overshoots a little instead of stopping dead."
      :code="`<div ref=&quot;area&quot; @pointermove=&quot;onMove&quot;>
  <div ref=&quot;follower&quot; class=&quot;h-10 w-10 rounded-full bg-primary&quot; />
</div>`"
      :script="`const pointer = ref([0, 0])
useSpring(
  () => pointer.value,
  ([x, y]) => { follower.value.style.transform = \`translate(\${x}px, \${y}px)\` },
  motionSprings.expressive.slowSpatial,
)
function onMove(e: PointerEvent) {
  const r = area.value.getBoundingClientRect()
  pointer.value = [e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2]
}`"
    >
      <div
        ref="area"
        class="relative flex h-56 w-full max-w-md touch-none items-center justify-center overflow-hidden rounded-xl bg-surface-container-low"
        @pointermove="onAreaMove"
        @pointerleave="pointer = [0, 0]"
      >
        <span class="pointer-events-none absolute bottom-3 text-label-medium text-on-surface-variant">Move the pointer here</span>
        <div ref="follower" class="pointer-events-none h-10 w-10 rounded-full bg-primary shadow-elevation-2" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Count up"
      description="A number that springs to its new value on an effects spring (no overshoot), writing the rounded value as text. Reset uses snap() to jump to zero instead of counting down."
      :code="`<span ref=&quot;counter&quot; />
<MButton @click=&quot;total += 250&quot;>+250</MButton>
<MButton @click=&quot;reset&quot;>Reset</MButton>`"
      :script="`const total = ref(0)
const { snap } = useSpring(
  () => [total.value],
  ([v]) => { counter.value.textContent = Math.round(v).toLocaleString() },
  motionSprings.standard.slowEffects,
)
function reset() {
  total.value = 0
  snap()
}`"
    >
      <div class="flex w-full max-w-md flex-col gap-4">
        <p class="text-display-medium tabular-nums text-on-surface"><span ref="counter">0</span> <span class="text-title-large text-on-surface-variant">points</span></p>
        <div class="flex flex-wrap gap-2">
          <MButton icon="add" @click="total += 250">250</MButton>
          <MButton icon="add" variant="tonal" @click="total += 5000">5,000</MButton>
          <MButton variant="text" @click="resetCounter">Reset</MButton>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Equalizer"
      description="Twelve values on one useSpring call, retargeted at random every 180ms. Each keeps its own speed between targets, and the Expressive fast spring makes them bounce."
      :code="`<div v-for=&quot;(_, i) in levels&quot; :ref=&quot;(el) => (bars[i] = el)&quot; class=&quot;origin-bottom&quot; />`"
      :script="`const levels = ref(Array.from({ length: 12 }, () => 0.1))
useSpring(
  () => levels.value,
  (values) => values.forEach((v, i) => { bars[i].style.transform = \`scaleY(\${v})\` }),
  motionSprings.expressive.fastSpatial,
)
setInterval(() => { levels.value = levels.value.map(() => 0.15 + Math.random() * 0.85) }, 180)`"
    >
      <div class="flex w-full max-w-md flex-col gap-4">
        <MButton :icon="playing ? 'pause' : 'play_arrow'" class="self-start" @click="togglePlay">{{ playing ? 'Pause' : 'Play' }}</MButton>
        <div class="flex h-32 items-end gap-1.5 rounded-xl bg-surface-container-low p-3">
          <div
            v-for="(_, i) in levels"
            :key="i"
            :ref="(el) => { bars[i] = el as HTMLElement | null }"
            class="h-full flex-1 origin-bottom rounded-t-sm bg-tertiary"
            style="transform: scaleY(0.1)"
          />
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>Write styles in <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">apply</code>, not through a reactive <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">:style</code> on the same property: Vue would re-apply the bound value on every re-render</li>
        <li>Stiff springs stay stable: it integrates in 4ms steps, so a dropped frame doesn't make it explode</li>
        <li>The loop stops once every value has settled, and on unmount</li>
      </ul>
    </MCard>

    <ComponentPager current="useSpring" />
  </div>
</template>
