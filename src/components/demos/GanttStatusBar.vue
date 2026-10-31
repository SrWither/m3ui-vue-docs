<script setup lang="ts">
// A strip under MGantt's controls: the project's end and the selected task's slack, through useGantt()
import { computed } from 'vue'
import { MButton } from '@m3ui-vue/m3ui-vue'
import { useGantt } from '@m3ui-vue/m3ui-vue/gantt'

const gantt = useGantt()
const selected = computed(() => gantt.tasks.value.find((t) => t.id === gantt.selection.value[0]))
const slack = computed(() => (selected.value ? gantt.criticalPath.value.slack[selected.value.id] : undefined))
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 border-b border-outline-variant px-4 py-2 text-body-medium">
    <span>Ends <strong>{{ gantt.criticalPath.value.finish }}</strong></span>
    <span v-if="selected" class="text-on-surface-variant">
      {{ selected.name }}: {{ slack === 0 ? 'on the critical path' : `${slack} days of slack` }}
    </span>
    <span class="flex-1" />
    <MButton variant="text" icon="event_repeat" @click="gantt.schedule({ mode: 'asap' })">Pull in</MButton>
    <MButton v-if="selected" variant="text" icon="my_location" @click="gantt.scrollToTask(selected.id)">Show</MButton>
  </div>
</template>
