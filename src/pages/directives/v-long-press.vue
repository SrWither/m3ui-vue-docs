<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MCard, MIcon, vLongPress } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const log = ref<string[]>([])
function note(text: string) {
  log.value = [text, ...log.value].slice(0, 4)
}

const photos = ['landscape', 'forest', 'beach_access', 'park', 'water', 'filter_hdr']
const selected = ref<Set<number>>(new Set())
const selecting = ref(false)
function toggle(i: number) {
  const next = new Set(selected.value)
  if (next.has(i)) next.delete(i)
  else next.add(i)
  selected.value = next
  if (!next.size) selecting.value = false
}
function startSelecting(i: number) {
  selecting.value = true
  if (!selected.value.has(i)) toggle(i)
}
function tap(i: number) {
  if (selecting.value) toggle(i)
  else note(`Opened photo ${i + 1}`)
}

const types: TypeDef[] = [
  {
    name: 'LongPressValue',
    description: 'What v-long-press accepts',
    fields: [
      { name: 'onHold', type: '(event: PointerEvent) => void', description: 'The handler, with the defaults' },
      { name: '{ … }', type: 'LongPressOptions', description: 'The handler and its settings' },
    ],
  },
  {
    name: 'LongPressOptions',
    fields: [
      { name: 'handler', type: '(event: PointerEvent) => void', description: 'Called once the press has been held long enough, with the pointerdown that started it' },
      { name: 'duration', type: 'number', description: 'How long to hold, in ms (default 500)' },
      { name: 'tolerance', type: 'number', description: 'How far (px) the pointer may move before it counts as a scroll or a drag and cancels (default 10)' },
      { name: 'haptic', type: 'boolean', description: 'A short vibration when it fires, where the device supports it (default true)' },
      { name: 'mouse', type: 'boolean', description: 'Also with a mouse (default true); false is for touch and pen only' },
      { name: 'disabled', type: 'boolean', description: 'Off while true' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">v-long-press</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Calls a function when an element is pressed and held, with a finger, a pen or the mouse. A long-pressed
      button doesn't also click, the browser's own long-press menu stays closed, and moving the finger (a
      scroll) cancels it.
    </p>

    <ComponentDemo
      title="Basic"
      description="Click the button, then press and hold it. The data-long-pressing attribute shrinks it while you hold."
      :code="`<MButton
  v-long-press=&quot;() => note('Held')&quot;
  class=&quot;transition-transform duration-500 data-long-pressing:scale-95&quot;
  @click=&quot;note('Clicked')&quot;
>
  Click or hold
</MButton>`"
      :script="`// With createM3UI() installed, v-long-press is already registered.
// Without the plugin, import it: a vLongPress variable becomes v-long-press in the template.
import { vLongPress } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex w-full flex-wrap items-start gap-6">
        <MButton
          v-long-press="() => note('Held')"
          class="transition-transform duration-500 data-long-pressing:scale-95"
          @click="note('Clicked')"
        >
          Click or hold
        </MButton>
        <ul class="min-w-48 text-body-medium text-on-surface-variant">
          <li v-for="(l, i) in log" :key="i + l" :class="i === 0 ? 'text-on-surface' : ''">{{ l }}</li>
          <li v-if="!log.length">Nothing yet</li>
        </ul>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Selection mode"
      description="The usual pattern on a phone: holding a photo starts selecting, after which taps select. Scrolling over the grid doesn't trigger it."
      :code="`<div
  v-for=&quot;(photo, i) in photos&quot;
  :key=&quot;i&quot;
  v-long-press=&quot;() => startSelecting(i)&quot;
  @click=&quot;tap(i)&quot;
>…</div>`"
    >
      <div class="flex w-full flex-col gap-3">
        <p class="text-body-medium text-on-surface-variant">
          {{ selecting ? `${selected.size} selected` : 'Hold a photo to start selecting' }}
        </p>
        <div class="grid grid-cols-3 gap-2 sm:grid-cols-6">
          <div
            v-for="(p, i) in photos"
            :key="i"
            v-long-press="() => startSelecting(i)"
            v-state-layer
            class="relative flex aspect-square cursor-pointer select-none items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container transition-transform duration-200"
            :class="selected.has(i) ? 'scale-90 rounded-3xl' : ''"
            @click="tap(i)"
          >
            <MIcon :name="p" :size="32" />
            <MIcon v-if="selected.has(i)" name="check_circle" filled class="absolute left-1.5 top-1.5 text-primary" />
          </div>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Value</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>Only the primary button counts (left click, touch, pen). The handler gets the <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">pointerdown</code> that started the press, for its position</li>
        <li>Once it fires, the click the press ends in is swallowed, and so is the browser's context menu (and iOS's copy/share callout)</li>
        <li>On touch, a scroll moves the finger past the tolerance, so scrolling over a list of long-pressable items doesn't trigger them</li>
        <li>On a component it lands on the component's root element, and Vue ignores it on components with more than one root</li>
      </ul>
    </MCard>

    <ComponentPager current="v-long-press" />
  </div>
</template>
