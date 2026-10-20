<script setup lang="ts">
// A control of your own: an M3 card with sliders for the map's rotation and tilt, and a button back to north. It
// follows the map both ways: drag-rotate or tilt with the mouse or two fingers and the sliders move too.
import { ref } from 'vue'
import { MCard, MIconButton, MSlider } from '@m3ui-vue/m3ui-vue'
import { MMapControl, useMap } from '@m3ui-vue/m3ui-vue/map'

const { map, on, onReady } = useMap()
const bearing = ref(0)
const pitch = ref(0)

const read = () => {
  if (!map.value) return
  bearing.value = Math.round(map.value.getBearing())
  pitch.value = Math.round(map.value.getPitch())
}
onReady(read)
on('move', read)

const rotate = (value: number) => map.value?.setBearing(value)
const tilt = (value: number) => map.value?.setPitch(value)
const reset = () => map.value?.easeTo({ bearing: 0, pitch: 0 })
</script>

<template>
  <MMapControl position="top-left" :group="false">
    <MCard variant="elevated" class="flex w-64 max-w-[calc(100vw-5rem)] flex-col gap-2 p-3">
      <div class="flex items-center justify-between">
        <span class="text-title-small text-on-surface">View</span>
        <MIconButton icon="explore" label="Back to north" size="sm" :disabled="!bearing && !pitch" @click="reset" />
      </div>
      <label class="text-label-medium text-on-surface-variant">Rotation · {{ bearing }}°</label>
      <MSlider :model-value="bearing" :min="-180" :max="180" :step="1" label="Rotation" @update:model-value="rotate(Number($event))" />
      <label class="text-label-medium text-on-surface-variant">Tilt · {{ pitch }}°</label>
      <MSlider :model-value="pitch" :min="0" :max="60" :step="1" label="Tilt" @update:model-value="tilt(Number($event))" />
    </MCard>
  </MMapControl>
</template>
