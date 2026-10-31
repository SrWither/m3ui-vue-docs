<script setup lang="ts">
/* A rail of your own for an MDrawCanvas, built on useDrawing(): a few tools, the size as a slider, pages, undo. */
import { MIconButton, MSlider } from '@m3ui-vue/m3ui-vue'
import { useDrawing, type DrawTool } from '@m3ui-vue/m3ui-vue/draw'

const draw = useDrawing()
const tools: { tool: DrawTool; icon: string; label: string }[] = [
  { tool: 'pen', icon: 'ink_pen', label: 'Pen' },
  { tool: 'brush', icon: 'brush', label: 'Brush' },
  { tool: 'eraser', icon: 'ink_eraser', label: 'Eraser' },
  { tool: 'pan', icon: 'pan_tool', label: 'Pan' },
]
</script>

<template>
  <div class="absolute top-4 left-4 flex flex-col items-center gap-1 rounded-2xl bg-surface-container p-1.5 shadow-elevation-2">
    <MIconButton
      v-for="t in tools"
      :key="t.tool"
      :icon="t.icon"
      :label="t.label"
      :variant="draw.tool.value === t.tool ? 'filled' : 'standard'"
      @click="draw.tool.value = t.tool"
    />
    <div class="h-28 py-2">
      <MSlider v-model="draw.size.value" :min="1" :max="24" orientation="vertical" label="Size" class="h-full" />
    </div>
    <MIconButton icon="note_add" :label="`Add a page (${draw.pages.value})`" @click="draw.addPage()" />
    <MIconButton icon="undo" label="Undo" :disabled="!draw.canUndo.value" @click="draw.undo()" />
  </div>
</template>
