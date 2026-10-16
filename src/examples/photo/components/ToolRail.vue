<script setup lang="ts">
/* The tools, as a vertical floating toolbar beside the canvas (wide screens). */
import { MIconButton, MToolbar, MTooltip } from '@m3ui-vue/m3ui-vue'
import { tools, usePhoto } from '../usePhoto'

const { tool, setTool, showOriginal } = usePhoto()
</script>

<template>
  <MToolbar variant="floating" orientation="vertical" class="shadow-elevation-2 rounded-full">
    <MTooltip v-for="t in tools" :key="t.id" :text="`${t.label} (${t.key})`" placement="right">
      <MIconButton
        :icon="t.icon"
        :label="t.label"
        :variant="tool === t.id ? 'filled' : 'standard'"
        :aria-pressed="tool === t.id"
        @click="setTool(t.id)"
      />
    </MTooltip>
    <span class="my-1 h-px w-8 bg-outline-variant" />
    <MTooltip text="Hold to compare with the original (\)" placement="right">
      <MIconButton
        icon="compare"
        label="Compare with the original"
        :variant="showOriginal ? 'tonal' : 'standard'"
        @pointerdown="showOriginal = true"
        @pointerup="showOriginal = false"
        @pointerleave="showOriginal = false"
        @pointercancel="showOriginal = false"
      />
    </MTooltip>
  </MToolbar>
</template>
