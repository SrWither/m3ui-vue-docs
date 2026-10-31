<script setup lang="ts">
/* Where a connection was dropped on nothing: pick the step to add there, already connected. Escape or a click away closes it. */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { MIcon } from '@m3ui-vue/m3ui-vue'
import { kinds } from '../catalog'

const props = defineProps<{ x: number; y: number; width: number; height: number }>()
const emit = defineEmits<{ pick: [kind: string]; close: [] }>()
const el = ref<HTMLElement>()
const choices = kinds.filter((k) => k.category !== 'trigger')

// Kept inside the canvas
const W = 232
const H = 360
const left = Math.max(8, Math.min(props.x, props.width - W - 8))
const top = Math.max(8, Math.min(props.y, props.height - H - 8))

function away(e: PointerEvent) {
  if (!el.value?.contains(e.target as Node)) emit('close')
}
function key(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.stopPropagation()
    emit('close')
  }
}
onMounted(() => {
  // After the pointerup that opened it
  setTimeout(() => window.addEventListener('pointerdown', away, true))
  window.addEventListener('keydown', key, true)
  el.value?.querySelector('button')?.focus()
})
onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', away, true)
  window.removeEventListener('keydown', key, true)
})
</script>

<template>
  <div
    ref="el"
    data-flow-panel
    role="menu"
    class="absolute z-30 overflow-y-auto rounded-sm bg-surface-container py-2 shadow-elevation-2"
    :style="{ left: `${left}px`, top: `${top}px`, width: `${W}px`, maxHeight: `${H}px` }"
    data-flow-nowheel
  >
    <div class="px-3 pb-1 text-label-medium text-on-surface-variant">Add a step</div>
    <button
      v-for="k in choices"
      :key="k.id"
      type="button"
      role="menuitem"
      class="flex h-12 w-full cursor-pointer items-center gap-3 px-3 text-left text-label-large text-on-surface outline-none hover:bg-on-surface/8 focus-visible:bg-on-surface/12"
      @click="emit('pick', k.id)"
    >
      <MIcon :name="k.icon" :size="20" class="text-on-surface-variant" />
      {{ k.label }}
    </button>
  </div>
</template>
