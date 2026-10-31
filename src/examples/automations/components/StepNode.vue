<script setup lang="ts">
/* A step on the canvas: an MFlowNode in its category's color, with its run status; a condition gets a handle per branch. */
import { computed } from 'vue'
import { MCircleProgressBar, MIcon } from '@m3ui-vue/m3ui-vue'
import { MFlowHandle, MFlowNode } from '@m3ui-vue/m3ui-vue/flow'
import { colorOf, kindById } from '../catalog'
import type { StepData, Status } from '../useWorkflow'

const props = defineProps<{ data: StepData; status?: Status }>()
const kind = computed(() => kindById.get(props.data.kind)!)
const subtitle = computed(() => {
  const c = props.data.config
  return c.url || c.channel || c.to || c.every || c.for || c.rule || c.path || c.sheet || kind.value.label
})
</script>

<template>
  <div class="relative w-60 transition-opacity duration-300" :class="status === 'skipped' && 'opacity-45'">
    <MFlowNode
      :label="data.label"
      :subtitle="subtitle"
      :icon="kind.icon"
      :color="colorOf(kind.category)"
      :handles="kind.category === 'trigger' ? 'source' : kind.branches ? 'target' : 'both'"
      class="w-full"
    >
      <template #trailing>
        <MCircleProgressBar v-if="status === 'running'" indeterminate :size="20" />
        <MIcon v-else-if="status === 'done'" name="check_circle" filled :size="20" class="text-primary" />
        <MIcon v-else-if="status === 'failed'" name="error" filled :size="20" class="text-error" />
      </template>
    </MFlowNode>
    <template v-if="kind.branches">
      <div
        v-for="(b, i) in kind.branches"
        :key="b"
        class="pointer-events-none absolute left-full ml-2 text-label-small text-on-surface-variant capitalize"
        :style="{ top: `calc(${((i + 1) * 100) / (kind.branches.length + 1)}% - 18px)` }"
      >{{ b }}</div>
      <MFlowHandle
        v-for="(b, i) in kind.branches"
        :id="b"
        :key="b"
        position="right"
        :style="{ top: `${((i + 1) * 100) / (kind.branches.length + 1)}%` }"
      />
    </template>
  </div>
</template>
