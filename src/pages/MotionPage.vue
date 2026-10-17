<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MCard, MIcon, MSegmentedButton, motionDurations, motionEasings } from '@m3ui-vue/m3ui-vue'
import SpringDemo from '@/components/demos/SpringDemo.vue'
import SpringDragDemo from '@/components/demos/SpringDragDemo.vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import type { SegmentedOption } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'

// ── Easings ──────────────────────────────────────────────────────────────────────────────────────
const easings = [
  { cls: 'ease-emphasized', key: 'emphasized', use: 'Most transitions: things that begin and end on screen' },
  { cls: 'ease-emphasized-decelerate', key: 'emphasizedDecelerate', use: 'Entering the screen' },
  { cls: 'ease-emphasized-accelerate', key: 'emphasizedAccelerate', use: 'Leaving the screen for good' },
  { cls: 'ease-standard', key: 'standard', use: 'Small utility changes (same curve as emphasized here)' },
  { cls: 'ease-standard-decelerate', key: 'standardDecelerate', use: 'Small things entering' },
  { cls: 'ease-standard-accelerate', key: 'standardAccelerate', use: 'Small things leaving' },
  { cls: 'ease-legacy', key: 'legacy', use: 'Material 2 curves, for matching older UIs' },
] as const
const played = ref(false)
const duration = ref<'short4' | 'medium2' | 'long2'>('medium2')
const durationOptions: SegmentedOption[] = [
  { value: 'short4', label: 'Short 4' },
  { value: 'medium2', label: 'Medium 2' },
  { value: 'long2', label: 'Long 2' },
]
const durationVar = (key: string) => `--duration-${key.replace(/([a-z])(\d)$/, '$1-$2').replace(/([A-Z])/g, '-$1').toLowerCase()}`

const durationRows = Object.entries(motionDurations).map(([key, ms]) => ({ name: durationVar(key), key, ms }))

// ── Springs ──────────────────────────────────────────────────────────────────────────────────────
const scheme = ref<'standard' | 'expressive'>('expressive')
const schemeOptions: SegmentedOption[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'expressive', label: 'Expressive' },
]
const springOn = ref(false)

// ── Examples ─────────────────────────────────────────────────────────────────────────────────────
const openCard = ref<number | null>(null)
const cards = [
  { icon: 'flight', title: 'Lisbon', text: 'Three days of tiled streets, custard tarts and the 28 tram up the hills.' },
  { icon: 'hiking', title: 'Patagonia', text: 'Glaciers, granite towers and wind that never stops. Pack layers.' },
  { icon: 'sailing', title: 'Croatia', text: 'Island hopping along the Dalmatian coast, from Split to Dubrovnik.' },
]

let nextId = 4
const items = ref([{ id: 1, text: 'Buy coffee' }, { id: 2, text: 'Call Ana' }, { id: 3, text: 'Water the plants' }])
const ideas = ['Read a chapter', 'Go for a run', 'Book the dentist', 'Clean the inbox', 'Plan the weekend']
function addItem() {
  items.value.unshift({ id: nextId, text: ideas[nextId % ideas.length]! })
  nextId++
}
function removeItem(id: number) {
  items.value = items.value.filter((i) => i.id !== id)
}

const tilesShown = ref(true)
function replayTiles() {
  tilesShown.value = false
  requestAnimationFrame(() => requestAnimationFrame(() => { tilesShown.value = true }))
}
const dragScheme = ref<'standard' | 'expressive'>('expressive')

const cssCode = `<!-- Tailwind: an M3 easing and duration on a transition -->
<div class="transition-transform ease-emphasized duration-(--duration-medium-2)">…</div>

/* Your own CSS */
.panel {
  transition: transform var(--duration-long-2) var(--ease-emphasized-decelerate);
}`

const jsCode = `import { motionSprings, motionEasings, motionDurations, cubicBezier } from '@m3ui-vue/m3ui-vue'

motionSprings.expressive.fastSpatial   // { dampingRatio: 0.6, stiffness: 800 }
motionDurations.medium2                // 300
const ease = cubicBezier(...motionEasings.emphasized)
ease(0.5)                              // progress through the curve at half time`
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Motion</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Material 3's motion tokens, for animations of your own that should feel like the components': easing curves
      and durations as Tailwind utilities and CSS variables, and the springs of the two motion schemes in JS.
    </p>

    <h2 class="mb-4 text-headline-small font-medium">Easing</h2>
    <p class="mb-4 text-body-medium text-on-surface-variant">
      Each curve is a <code>--ease-*</code> variable, so Tailwind gives you an <code>ease-*</code> class. Press play
      to send each dot across with its curve.
    </p>
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <MButton :icon="played ? 'replay' : 'play_arrow'" @click="played = !played">{{ played ? 'Back' : 'Play' }}</MButton>
      <MSegmentedButton v-model="duration" :options="durationOptions" density="compact" />
    </div>
    <MCard class="mb-10 overflow-hidden">
      <div v-for="e in easings" :key="e.cls" class="border-b border-outline-variant px-4 py-3 last:border-b-0">
        <div class="mb-2 flex flex-wrap items-baseline justify-between gap-x-4">
          <code class="text-label-medium text-primary">{{ e.cls }}</code>
          <span class="text-label-small text-on-surface-variant">{{ e.use }} · cubic-bezier({{ motionEasings[e.key].join(', ') }})</span>
        </div>
        <div class="relative h-6 rounded-full bg-surface-container-high">
          <div
            class="absolute top-0 h-6 w-6 rounded-full bg-primary transition-[left]"
            :class="e.cls"
            :style="{ left: played ? 'calc(100% - 24px)' : '0px', transitionDuration: `var(${durationVar(duration)})` }"
          />
        </div>
      </div>
    </MCard>

    <h2 class="mb-4 text-headline-small font-medium">Duration</h2>
    <p class="mb-4 text-body-medium text-on-surface-variant">
      Short for small changes (a switch, a ripple), medium for most transitions, long and extra-long for large
      surfaces moving across the screen. Use them with Tailwind's <code>duration-(--duration-medium-2)</code>.
    </p>
    <MCard class="mb-10 overflow-hidden">
      <div class="grid grid-cols-1 sm:grid-cols-2">
        <div v-for="d in durationRows" :key="d.name" class="flex items-center justify-between border-b border-outline-variant px-4 py-2 sm:odd:border-r">
          <code class="text-label-medium text-primary">{{ d.name }}</code>
          <span class="text-label-large text-on-surface-variant">{{ d.ms }}ms</span>
        </div>
      </div>
    </MCard>

    <h2 class="mb-4 text-headline-small font-medium">Springs</h2>
    <p class="mb-4 text-body-medium text-on-surface-variant">
      Components move on springs, not curves: a spring can be retargeted mid-flight and keeps its speed. Spatial
      springs move things, effects springs fade colors and opacity without overshooting. The Standard scheme is
      calm; the Expressive one bounces. They're in <code>motionSprings</code>, ready for
      <RouterLink to="/composables/usespring" class="text-primary underline">useSpring</RouterLink>.
    </p>
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <MButton :icon="springOn ? 'replay' : 'play_arrow'" @click="springOn = !springOn">{{ springOn ? 'Back' : 'Play' }}</MButton>
      <MSegmentedButton v-model="scheme" :options="schemeOptions" density="compact" />
    </div>
    <MCard class="mb-10 overflow-hidden">
      <SpringDemo :key="scheme" :scheme="scheme" :on="springOn" />
    </MCard>

    <h2 class="mb-4 text-headline-small font-medium">Examples</h2>

    <ComponentDemo
      title="Expand a card"
      description="Content that opens in place uses ease-emphasized: it moves most of the way at once and settles gently. Height with a grid-rows trick, the text fading a beat later."
      :code="`<div
  class=&quot;grid transition-[grid-template-rows] ease-emphasized duration-(--duration-long-1)&quot;
  :class=&quot;open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'&quot;
>
  <div class=&quot;overflow-hidden&quot;>
    <p class=&quot;transition-opacity ease-standard duration-(--duration-medium-2)&quot; :class=&quot;open ? 'opacity-100 delay-(--duration-short-2)' : 'opacity-0'&quot;>…</p>
  </div>
</div>`"
    >
      <div class="flex w-full max-w-md flex-col gap-2">
        <MCard v-for="(c, i) in cards" :key="c.title" variant="filled" class="cursor-pointer overflow-hidden" @click="openCard = openCard === i ? null : i">
          <div class="flex items-center gap-3 p-4">
            <MIcon :name="c.icon" class="text-primary" />
            <span class="flex-1 text-title-medium">{{ c.title }}</span>
            <MIcon name="expand_more" class="transition-transform duration-(--duration-medium-2) ease-emphasized" :class="openCard === i ? 'rotate-180' : ''" />
          </div>
          <div class="grid transition-[grid-template-rows] duration-(--duration-long-1) ease-emphasized" :class="openCard === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
            <div class="overflow-hidden">
              <p
                class="px-4 pb-4 text-body-medium text-on-surface-variant transition-opacity duration-(--duration-medium-2) ease-standard"
                :class="openCard === i ? 'opacity-100 delay-(--duration-short-2)' : 'opacity-0'"
              >
                {{ c.text }}
              </p>
            </div>
          </div>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Enter and leave"
      description="New items come in on ease-emphasized-decelerate (fast, then easing into place) and leave on ease-emphasized-accelerate, quicker, picking up speed as they go: something leaving doesn't need to slow down. The rest slide over with ease-emphasized."
      :code="`<TransitionGroup
  tag=&quot;ul&quot;
  enter-active-class=&quot;transition ease-emphasized-decelerate duration-(--duration-medium-4)&quot;
  enter-from-class=&quot;-translate-y-3 opacity-0&quot;
  leave-active-class=&quot;absolute w-full transition ease-emphasized-accelerate duration-(--duration-short-4)&quot;
  leave-to-class=&quot;translate-x-8 opacity-0&quot;
  move-class=&quot;transition-transform ease-emphasized duration-(--duration-medium-2)&quot;
>
  <li v-for=&quot;item in items&quot; :key=&quot;item.id&quot;>…</li>
</TransitionGroup>`"
    >
      <div class="flex w-full max-w-md flex-col gap-3">
        <MButton icon="add" class="self-start" @click="addItem">Add</MButton>
        <TransitionGroup
          tag="ul"
          class="relative flex flex-col gap-2"
          enter-active-class="transition ease-emphasized-decelerate duration-(--duration-medium-4)"
          enter-from-class="-translate-y-3 opacity-0"
          leave-active-class="absolute w-full transition ease-emphasized-accelerate duration-(--duration-short-4)"
          leave-to-class="translate-x-8 opacity-0"
          move-class="transition-transform ease-emphasized duration-(--duration-medium-2)"
        >
          <li v-for="item in items" :key="item.id" class="flex items-center gap-3 rounded-md bg-surface-container px-4 py-3">
            <span class="flex-1 text-body-large">{{ item.text }}</span>
            <MButton variant="text" @click="removeItem(item.id)">Done</MButton>
          </li>
        </TransitionGroup>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Staggered entrance"
      description="A grid appearing one tile after another: each starts 50ms (duration-short-1) after the previous, on ease-emphasized-decelerate."
      :code="`<div
  v-for=&quot;(tile, i) in tiles&quot;
  class=&quot;transition ease-emphasized-decelerate duration-(--duration-long-2)&quot;
  :class=&quot;shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'&quot;
  :style=&quot;{ transitionDelay: shown ? \`calc(\${i} * var(--duration-short-1))\` : '0ms' }&quot;
/>`"
    >
      <div class="flex w-full max-w-md flex-col gap-3">
        <MButton icon="replay" class="self-start" @click="replayTiles">Replay</MButton>
        <div class="grid grid-cols-4 gap-2">
          <div
            v-for="i in 12"
            :key="i"
            class="aspect-square rounded-lg bg-secondary-container transition duration-(--duration-long-2) ease-emphasized-decelerate"
            :class="tilesShown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
            :style="tilesShown ? { transitionDelay: `calc(${i - 1} * var(--duration-short-1))` } : { transitionDuration: '0ms' }"
          />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Drag and let go"
      description="Drag the ball anywhere and let go: a spring takes it home. Grab it again mid-flight and it follows your finger at once. Compare the calm Standard spring with the bouncy Expressive one."
      :code="`const offset = ref([0, 0])
const { snap } = useSpring(
  () => offset.value,
  ([x, y]) => { ball.value.style.transform = \`translate(\${x}px, \${y}px)\` },
  motionSprings.expressive.defaultSpatial,
)
// pointermove: offset.value = [dx, dy]; snap()   (follow the finger exactly)
// pointerup:   offset.value = [0, 0]             (the spring takes it home)`"
    >
      <div class="flex w-full max-w-md flex-col gap-3">
        <MSegmentedButton v-model="dragScheme" :options="schemeOptions" density="compact" />
        <SpringDragDemo :key="dragScheme" :scheme="dragScheme" />
      </div>
    </ComponentDemo>

    <h2 class="mb-4 mt-10 text-headline-small font-medium">Using them</h2>
    <MCodeEditor :model-value="cssCode" language="vue" :readonly="true" :line-numbers="false" min-height="50px" max-height="220px" class="mb-4" />
    <MCodeEditor :model-value="jsCode" language="javascript" :readonly="true" :line-numbers="false" min-height="50px" max-height="200px" />
  </div>
</template>
