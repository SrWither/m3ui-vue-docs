<script setup lang="ts">
/* One row per spatial spring of a motion scheme, each dot sprung with useSpring (the docs' Motion page) */
import { motionSprings, useSpring } from '@m3ui-vue/m3ui-vue'

const props = defineProps<{ scheme: 'standard' | 'expressive'; on: boolean }>()

const names = ['fastSpatial', 'defaultSpatial', 'slowSpatial'] as const
const dots: (HTMLElement | null)[] = [null, null, null]
// The spec is read once: the page re-creates this component (keyed by scheme) to switch schemes
for (const [i, name] of names.entries()) {
  useSpring(
    () => [props.on ? 1 : 0],
    ([p]) => { const d = dots[i]; if (d) d.style.left = `calc(${p! * 100}% - ${p! * 24}px)` },
    motionSprings[props.scheme][name],
  )
}
</script>

<template>
  <div v-for="(name, i) in names" :key="name" class="border-b border-outline-variant px-4 py-3 last:border-b-0">
    <div class="mb-2 flex flex-wrap items-baseline justify-between gap-x-4">
      <code class="text-label-medium text-primary">motionSprings.{{ scheme }}.{{ name }}</code>
      <span class="text-label-small text-on-surface-variant">
        dampingRatio {{ motionSprings[scheme][name].dampingRatio }} · stiffness {{ motionSprings[scheme][name].stiffness }}
      </span>
    </div>
    <div class="relative h-6 rounded-full bg-surface-container-high">
      <div :ref="(el) => { dots[i] = el as HTMLElement | null }" class="absolute top-0 h-6 w-6 rounded-full bg-tertiary" style="left: 0" />
    </div>
  </div>
</template>
