<script setup lang="ts">
/*
 * A vertex: a circle with its name. The source and the sink have their own colors; during a run it shows whether the
 * search reached it, its level (Dinic) and, at the end, which side of the minimum cut it's on. Two handles: the
 * target in the middle (edges arrive at the center; it doesn't catch the pointer, so the circle still drags) and the
 * source on the right edge, to draw a new edge from while editing.
 */
import { MFlowHandle } from '@m3ui-vue/m3ui-vue/flow'

const props = defineProps<{
  label: string
  kind: 'source' | 'sink' | 'inner'
  selected: boolean
  editing: boolean
  visited?: boolean
  level?: number
  cutSide?: boolean
}>()

const TONE = {
  source: 'bg-tertiary-container text-on-tertiary-container',
  sink: 'bg-primary-container text-on-primary-container',
  inner: 'bg-surface-container-highest text-on-surface',
}
// On the source's side of the minimum cut, the inner vertices take the secondary color
const tone = () => (props.cutSide && props.kind === 'inner' ? 'bg-secondary-container text-on-secondary-container' : TONE[props.kind])
</script>

<template>
  <div class="relative size-14">
    <div
      class="flex size-full items-center justify-center rounded-full border-2 text-title-small transition-[box-shadow,border-color,background-color] duration-200"
      :class="[
        tone(),
        selected ? 'border-primary' : cutSide ? 'border-secondary' : 'border-transparent',
        visited && 'ring-4 ring-tertiary/35',
      ]"
    >
      <span class="max-w-12 truncate">{{ label }}</span>
    </div>
    <span
      v-if="level !== undefined"
      class="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-tertiary text-label-small text-on-tertiary shadow-elevation-1"
      :title="`Level ${level}`"
    >{{ level }}</span>
    <MFlowHandle type="target" position="left" class="pointer-events-none opacity-0" :style="{ left: '50%' }" />
    <MFlowHandle type="source" position="right" :connectable="editing && kind !== 'sink'" />
  </div>
</template>
