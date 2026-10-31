<script setup lang="ts">
/*
 * The side panel. While editing: the preset's story, how to edit, and the selected vertex or edge's settings. While
 * running: the flow so far, the step controls (back, play, forward, speed) and what this step did.
 */
import { computed } from 'vue'
import { MAnimatedNumber, MButton, MDivider, MIcon, MIconButton, MNumberField, MProgressBar, MSlider, MTextField } from '@m3ui-vue/m3ui-vue'
import type { FlowEdge, FlowNode } from '@m3ui-vue/m3ui-vue/flow'
import { presets } from '../presets'
import { useNetwork, type EdgeData, type VertexData } from '../useNetwork'

const props = defineProps<{ playing: boolean; speed: number; selectedNode?: FlowNode<VertexData>; selectedEdge?: FlowEdge<EdgeData> }>()
const emit = defineEmits<{
  'update:playing': [boolean]
  'update:speed': [number]
  vertex: [patch: Partial<VertexData>]
  capacity: [value: number]
  remove: []
  add: []
}>()
const n = useNetwork()
const preset = computed(() => presets.find((p) => p.id === n.presetId.value))
const label = (id: string) => n.nodes.value.find((x) => x.id === id)?.data?.label ?? id
const atEnd = computed(() => n.index.value >= n.frames.value.length - 1)
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <template v-if="n.running.value && n.frame.value">
      <div class="flex items-end justify-between gap-3">
        <div>
          <div class="text-label-large text-on-surface-variant">Flow from {{ label(n.net.value!.source) }} to {{ label(n.net.value!.sink) }}</div>
          <MAnimatedNumber :value="n.frame.value.total" class="text-display-small text-primary" />
        </div>
        <div class="pb-2 text-label-large text-on-surface-variant">Step {{ n.index.value + 1 }} of {{ n.frames.value.length }}</div>
      </div>
      <MProgressBar :value="((n.index.value + 1) / n.frames.value.length) * 100" />
      <div class="flex items-center gap-1">
        <MIconButton icon="first_page" label="First step" :disabled="n.index.value === 0" @click="n.index.value = 0" />
        <MIconButton icon="skip_previous" label="Step back" :disabled="n.index.value === 0" @click="n.step(-1)" />
        <MIconButton :icon="playing ? 'pause' : 'play_arrow'" :label="playing ? 'Pause' : 'Play'" variant="filled" size="md" :disabled="atEnd && !playing" @click="emit('update:playing', !playing)" />
        <MIconButton icon="skip_next" label="Step forward" :disabled="atEnd" @click="n.step(1)" />
        <MIconButton icon="last_page" label="Last step" :disabled="atEnd" @click="n.index.value = n.frames.value.length - 1" />
      </div>
      <MSlider :model-value="speed" :min="0.5" :max="4" :step="0.5" label="Speed" show-value @update:model-value="emit('update:speed', $event as number)" />
      <MDivider />
      <div class="flex flex-col gap-2" aria-live="polite">
        <div class="flex items-center gap-2 text-title-medium" :class="n.frame.value.done && 'text-primary'">
          <MIcon v-if="n.frame.value.done" name="check_circle" filled :size="22" />
          {{ n.frame.value.title }}
        </div>
        <p class="text-body-medium text-on-surface-variant">{{ n.frame.value.detail }}</p>
      </div>
      <div class="flex flex-wrap gap-x-4 gap-y-2 text-label-medium text-on-surface-variant">
        <span class="flex items-center gap-1.5"><span class="h-1 w-5 rounded-full bg-primary" />Augmenting path</span>
        <span class="flex items-center gap-1.5"><span class="h-1 w-5 rounded-full bg-tertiary" />Saturated</span>
        <span class="flex items-center gap-1.5"><span class="h-1 w-5 rounded-full bg-error" />Minimum cut</span>
        <span v-if="n.algorithm.value !== 'edmonds-karp'" class="flex items-center gap-1.5"><span class="flex size-4 items-center justify-center rounded-full bg-tertiary text-[10px] text-on-tertiary">2</span>{{ n.frame.value.excess ? 'Excess' : 'Level' }}</span>
        <span v-if="n.algorithm.value === 'wave'" class="flex items-center gap-1.5"><span class="size-4 rounded-full ring-4 ring-error/35" />Blocked</span>
      </div>
      <MButton variant="tonal" icon="edit" @click="n.stop()">Edit the network</MButton>
    </template>

    <template v-else>
      <div>
        <div class="text-title-medium">{{ preset?.name ?? 'Your network' }}</div>
        <p class="text-body-medium text-on-surface-variant">{{ preset?.description ?? 'A network of your own.' }}</p>
      </div>
      <MButton icon="play_arrow" :disabled="!n.net.value" @click="n.start()">Find the maximum flow</MButton>
      <p v-if="!n.net.value" class="text-body-small text-error">The network needs a source and a sink.</p>
      <MDivider />
      <template v-if="selectedNode">
        <div class="text-title-small">Vertex</div>
        <MTextField :model-value="selectedNode.data!.label" label="Name" variant="outlined" @update:model-value="emit('vertex', { label: String($event) })" />
        <div class="flex flex-wrap gap-2">
          <MButton variant="outlined" size="sm" :disabled="selectedNode.data!.kind === 'source'" @click="emit('vertex', { kind: 'source' })">Make it the source</MButton>
          <MButton variant="outlined" size="sm" :disabled="selectedNode.data!.kind === 'sink'" @click="emit('vertex', { kind: 'sink' })">Make it the sink</MButton>
        </div>
        <MButton variant="text" icon="delete" color="error" class="self-start" @click="emit('remove')">Delete vertex</MButton>
      </template>
      <template v-else-if="selectedEdge">
        <div class="text-title-small">Edge {{ label(selectedEdge.source) }} → {{ label(selectedEdge.target) }}</div>
        <MNumberField :model-value="selectedEdge.data?.capacity ?? 0" label="Capacity" variant="outlined" :min="0" :max="9999" stepper @update:model-value="emit('capacity', $event ?? 0)" />
        <MButton variant="text" icon="delete" color="error" class="self-start" @click="emit('remove')">Delete edge</MButton>
      </template>
      <ul v-else class="flex list-disc flex-col gap-1 pl-5 text-body-medium text-on-surface-variant">
        <li>Double click the canvas to add a vertex there.</li>
        <li>Drag from a vertex's right edge onto another to add an edge, or into empty space to add a vertex already connected.</li>
        <li>Click an edge to change its capacity, a vertex to rename it or make it the source or the sink.</li>
        <li>Delete removes what's selected; Ctrl+Z undoes.</li>
      </ul>
      <MButton variant="tonal" icon="add_circle" class="self-start" @click="emit('add')">Add a vertex</MButton>
    </template>
  </div>
</template>
