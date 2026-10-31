<script setup lang="ts">
import { computed } from 'vue'
import { MButton } from '@m3ui-vue/m3ui-vue'
import { useFlow } from '@m3ui-vue/m3ui-vue/flow'

// A panel over the canvas built on useFlow (the useFlow page's demo)
const flow = useFlow()
const zoom = computed(() => Math.round(flow.viewport.value.zoom * 100))
const selected = computed(() => flow.selection.value.nodes)
function focusFirst() {
  const id = flow.nodes.value[0]!.id
  const p = flow.getAbsolutePosition(id)
  const s = flow.getSize(id)
  flow.setSelection({ nodes: [id] })
  flow.setCenter(p.x + s.width / 2, p.y + s.height / 2, { zoom: 1.5 })
}
</script>

<template>
  <div class="absolute right-4 bottom-4 left-4 flex flex-wrap items-center gap-2 rounded-lg bg-surface-container-high px-3 py-2 shadow-elevation-2">
    <span class="text-label-large text-on-surface-variant">{{ zoom }}% · {{ selected.length }} selected</span>
    <span class="flex-1" />
    <MButton variant="text" size="sm" icon="center_focus_strong" @click="focusFirst">Focus first</MButton>
    <MButton variant="text" size="sm" icon="delete" :disabled="!selected.length" @click="flow.remove({ nodes: selected })">Delete</MButton>
  </div>
</template>
