<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MFlow', description: 'A node editor: drag nodes, connect handles, pan and zoom, select, undo, copy and paste, groups and automatic layouts.' },
  { name: 'MFlowNode', description: 'The default node: an M3 card with an icon, a label, a subtitle and its handles.' },
  { name: 'MFlowHandle', description: 'A connection point on a node, for nodes of your own.' },
  { name: 'MFlowControls', description: 'Zoom, fit, lock, undo and redo as a floating toolbar over the canvas.' },
  { name: 'MFlowMinimap', description: 'An overview of the whole flow that moves the view when dragged.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Flow</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A node editor for workflows, automations, pipelines, org charts and diagrams: nodes you drag on a canvas that
      pans and zooms, joined by edges you draw between handles. From the /flow entry point, with no dependencies.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/flow/${c.name.toLowerCase()}`"
        class="no-underline"
      >
        <MCard clickable class="flex h-full flex-col gap-2 p-4">
          <div class="flex items-center gap-2">
            <MIcon :name="iconMap[c.name] ?? 'code'" :size="22" class="text-primary" />
            <span class="text-title-medium font-medium">{{ c.name }}</span>
          </div>
          <p class="text-body-small text-on-surface-variant">{{ c.description }}</p>
        </MCard>
      </router-link>
    </div>
  </div>
</template>
