<script setup lang="ts">
/* A strip of your own inside an MFloorPlan's #overlay slot, built on useFloorPlan(): seats and tables counted, and a
   button that adds a two-top through the plan (an undo step like any other edit). */
import { computed } from 'vue'
import { MButton, useFloorPlan } from '@m3ui-vue/m3ui-vue'

const plan = useFloorPlan()
const seats = computed(() => plan.tables.value.reduce((a, t) => a + (t.seats ?? 0), 0))
</script>

<template>
  <div class="absolute top-2 left-2 flex items-center gap-2 rounded-full bg-surface-container-high/90 py-1 pr-1 pl-3 text-label-large shadow-elevation-1 backdrop-blur-sm">
    {{ plan.tables.value.length }} tables · {{ seats }} seats
    <MButton size="xs" variant="tonal" icon="add" @click="plan.addTable({ shape: 'round', seats: 2 })">Two-top</MButton>
    <MButton size="xs" variant="text" icon="undo" :disabled="!plan.canUndo.value" @click="plan.undo()">Undo</MButton>
  </div>
</template>
