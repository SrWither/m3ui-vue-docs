<script setup lang="ts">
// Docs-only: a resizable "device" frame for the adaptive layout demos, so the layouts can be
// seen switching on any screen. Presets set the width; the corner handle drags it freely.
import { ref } from 'vue'
import { MSegmentedButton, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'

const props = withDefaults(defineProps<{ height?: string; initial?: 'phone' | 'tablet' | 'desktop' }>(), {
  height: '480px',
  initial: 'desktop',
})

const presets = { phone: 390, tablet: 720, desktop: 1024 }
const options = [
  { value: 'phone', label: 'Phone', icon: 'smartphone' },
  { value: 'tablet', label: 'Tablet', icon: 'tablet' },
  { value: 'desktop', label: 'Desktop', icon: 'computer' },
]
const preset = ref<string | number | (string | number)[]>(props.initial)
const width = ref(presets[props.initial])
function pick(v: string | number | (string | number)[]) {
  preset.value = v
  width.value = presets[v as keyof typeof presets]
  // A drag writes the inline width itself, which Vue doesn't know about: set it back explicitly.
  if (frame.value) frame.value.style.width = `${width.value}px`
}

const frame = ref<HTMLElement>()
const { width: measured, widthClass, heightClass } = useWindowSizeClass(frame)
</script>

<template>
  <div class="flex w-full min-w-0 flex-col gap-3">
    <div class="flex flex-wrap items-center gap-3">
      <MSegmentedButton :model-value="preset" :options="options" @update:model-value="pick" />
      <span class="text-label-large tabular-nums text-on-surface-variant">
        {{ Math.round(measured) }}px · {{ widthClass }} width · {{ heightClass }} height
      </span>
    </div>
    <div class="w-full overflow-x-auto pb-2">
      <div
        ref="frame"
        class="overflow-hidden rounded-xl border border-outline-variant bg-surface"
        :style="{ width: `${width}px`, height, minWidth: '320px', resize: 'horizontal' }"
      >
        <slot />
      </div>
    </div>
    <p class="text-body-small text-on-surface-variant">Drag the frame's bottom-right corner to resize it.</p>
  </div>
</template>
