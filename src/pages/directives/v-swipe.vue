<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MCard, MIcon, vSwipe } from '@m3ui-vue/m3ui-vue'
import type { SwipeInfo } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

// Photo viewer: left / right change the photo, the photo follows the finger meanwhile
const photos = [
  { icon: 'landscape', label: 'Mountains' },
  { icon: 'beach_access', label: 'Beach' },
  { icon: 'forest', label: 'Forest' },
  { icon: 'location_city', label: 'City' },
]
const index = ref(0)
const offset = ref(0)
const dragging = ref(false)
function go(step: number) {
  index.value = (index.value + step + photos.length) % photos.length
}

// Any direction
const last = ref<SwipeInfo | null>(null)
const arrows = { left: 'arrow_back', right: 'arrow_forward', up: 'arrow_upward', down: 'arrow_downward' } as const

const types: TypeDef[] = [
  {
    name: 'SwipeValue',
    description: 'What v-swipe accepts',
    fields: [
      { name: 'onSwipe', type: '(info: SwipeInfo) => void', description: 'One handler for every direction (info.direction says which); listens on both axes' },
      { name: '{ … }', type: 'SwipeOptions', description: 'Handlers per direction and settings' },
    ],
  },
  {
    name: 'SwipeOptions',
    fields: [
      { name: 'left / right / up / down', type: '(info: SwipeInfo) => void', description: 'Handler for that direction. The ones you give decide the touch-action (see Details)' },
      { name: 'handler', type: '(info: SwipeInfo) => void', description: 'For a direction with no handler of its own; listens on both axes' },
      { name: 'threshold', type: 'number', description: 'How far (px) a slow swipe has to travel to count (default 50)' },
      { name: 'velocity', type: 'number', description: 'A flick at least this fast (px/ms) counts at any length (default 0.5)' },
      { name: 'onMove', type: '(dx: number, dy: number, event: PointerEvent) => void', description: 'While the finger moves along a listened axis: follow it, show a hint' },
      { name: 'onEnd', type: '(swiped: boolean) => void', description: 'When the press ends, swiped or not: put a moved element back' },
      { name: 'mouse', type: 'boolean', description: 'Also with a mouse drag (default false)' },
      { name: 'disabled', type: 'boolean', description: 'Off while true' },
    ],
  },
  {
    name: 'SwipeInfo',
    fields: [
      { name: 'direction', type: "'left' | 'right' | 'up' | 'down'", description: 'Which way' },
      { name: 'dx / dy', type: 'number', description: 'Distance from where the press started, px' },
      { name: 'velocity', type: 'number', description: 'Speed along the swipe when the finger lifted, px/ms' },
      { name: 'event', type: 'PointerEvent', description: 'The pointerup that ended it' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">v-swipe</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Run a function when an element is swiped left, right, up or down: a long enough drag, or a quick flick of
      any length. Swipes along an axis you don't listen to stay the page's scroll, and the click a swipe ends in
      doesn't fire.
    </p>

    <ComponentDemo
      title="Left and right"
      description="Swipe the photo on a phone (or drag it with the mouse: mouse is on here). It follows the finger with onMove and goes back with onEnd; the page still scrolls vertically over it."
      :code="`<div
  v-swipe=&quot;{
    left: () => go(1),
    right: () => go(-1),
    onMove: (dx) => { offset = dx; dragging = true },
    onEnd: () => { offset = 0; dragging = false },
    mouse: true,
  }&quot;
  :style=&quot;{ transform: \`translateX(\${offset}px)\` }&quot;
  :class=&quot;dragging ? '' : 'transition-transform duration-300'&quot;
>…</div>`"
      :script="`// With createM3UI() installed, v-swipe is already registered.
// Without the plugin, import it: a vSwipe variable becomes v-swipe in the template.
import { ref } from 'vue'
import { vSwipe } from '@m3ui-vue/m3ui-vue'

const index = ref(0)
const offset = ref(0)
const dragging = ref(false)
const go = (step: number) => { index.value = (index.value + step + photos.length) % photos.length }`"
    >
      <div class="flex w-full max-w-sm flex-col items-center gap-3">
        <div class="w-full overflow-hidden rounded-3xl">
          <div
            v-swipe="{
              left: () => go(1),
              right: () => go(-1),
              onMove: (dx: number) => { offset = dx; dragging = true },
              onEnd: () => { offset = 0; dragging = false },
              mouse: true,
            }"
            class="flex aspect-[4/3] cursor-grab select-none flex-col items-center justify-center gap-2 bg-tertiary-container text-on-tertiary-container"
            :class="dragging ? '' : 'transition-transform duration-300'"
            :style="{ transform: `translateX(${offset}px)` }"
          >
            <MIcon :name="photos[index]!.icon" :size="64" />
            <span class="text-title-medium">{{ photos[index]!.label }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <MButton variant="text" icon="chevron_left" @click="go(-1)">Previous</MButton>
          <span class="text-body-medium text-on-surface-variant">{{ index + 1 }} / {{ photos.length }}</span>
          <MButton variant="text" icon="chevron_right" icon-pos="trailing" @click="go(1)">Next</MButton>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Any direction"
      description="One handler for all four: info.direction says which way. Listening on both axes means the page doesn't scroll from this pad (touch-action: none)."
      :code="`<div v-swipe=&quot;(info) => (last = info)&quot;>Swipe me</div>`"
    >
      <div class="flex w-full flex-col items-center gap-3 sm:flex-row sm:items-stretch">
        <div
          v-swipe="{ handler: (info: SwipeInfo) => (last = info), mouse: true }"
          class="flex h-48 w-full max-w-xs cursor-grab select-none items-center justify-center rounded-3xl border-2 border-dashed border-outline-variant text-title-medium text-on-surface-variant"
        >
          Swipe me
        </div>
        <div class="flex min-w-48 flex-col items-center justify-center gap-1 text-body-medium text-on-surface-variant">
          <template v-if="last">
            <MIcon :name="arrows[last.direction]" :size="40" class="text-primary" />
            <span class="text-title-medium text-on-surface">{{ last.direction }}</span>
            <span>{{ Math.round(Math.hypot(last.dx, last.dy)) }}px · {{ last.velocity.toFixed(2) }} px/ms</span>
          </template>
          <span v-else>No swipe yet</span>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Value</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>It sets the element's <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">touch-action</code> from the directions you listen to: only left/right → <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">pan-y</code> (the page still scrolls vertically over it), only up/down → <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">pan-x</code>, both → <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">none</code> (nothing scrolls from it)</li>
        <li>A drag starting along an axis you don't listen to is left alone, so it scrolls as usual</li>
        <li>For a list item swiped away, <router-link to="/components/utility/mswipetodismiss" class="text-primary">MSwipeToDismiss</router-link> already does the animation, the background and the threshold</li>
        <li>On a component it lands on the component's root element, and Vue ignores it on components with more than one root</li>
      </ul>
    </MCard>

    <ComponentPager current="v-swipe" />
  </div>
</template>
