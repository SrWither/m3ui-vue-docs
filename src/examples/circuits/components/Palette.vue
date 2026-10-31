<script setup lang="ts">
/*
 * Every kind of part, by category. A click (or a tap) adds one in the middle of the view; pressing one with a mouse
 * or a pen emits `grab`, so the page can drag it straight onto the canvas.
 */
import { MIcon } from '@m3ui-vue/m3ui-vue'
import { categories, parts } from '../parts'

const emit = defineEmits<{ pick: [kind: string]; grab: [kind: string, event: PointerEvent] }>()
// A press that became a drag onto the canvas doesn't also add a part with its click (the page says so)
let suppress = false
defineExpose({ suppressClick: () => (suppress = true) })
function down(e: PointerEvent, kind: string) {
  suppress = false
  if (e.button === 0 && e.pointerType !== 'touch') emit('grab', kind, e)
}
function click(kind: string) {
  if (!suppress) emit('pick', kind)
  suppress = false
}
</script>

<template>
  <div class="flex flex-col gap-3 p-3">
    <section v-for="cat in categories" :key="cat.id">
      <h3 class="px-2 pb-1 text-label-large text-on-surface-variant">{{ cat.label }}</h3>
      <div class="grid grid-cols-2 gap-1">
        <button
          v-for="p in parts.filter((x) => x.category === cat.id)"
          :key="p.kind"
          type="button"
          :title="p.description"
          class="flex cursor-grab items-center gap-2 rounded-md px-2 py-1.5 text-left text-body-medium transition-colors outline-none select-none hover:bg-on-surface/8 focus-visible:ring-2 focus-visible:ring-secondary active:cursor-grabbing"
          @pointerdown="down($event, p.kind)"
          @click="click(p.kind)"
        >
          <MIcon :name="p.icon" :size="18" class="shrink-0 text-primary" />
          <span class="truncate">{{ p.label }}</span>
        </button>
      </div>
    </section>
  </div>
</template>
