<script setup lang="ts">
// A layer panel of your own on useMapLayers(): a chip per listed layer, an opacity slider for one, and the base map
// as a segmented button. Same state as MMapLayers and MMapBaseLayers, so they'd stay in sync.
import { computed } from 'vue'
import { MCard, MChip, MSegmentedButton, MSlider } from '@m3ui-vue/m3ui-vue'
import { useMapLayers } from '@m3ui-vue/m3ui-vue/map'

const { layers, isVisible, toggle, opacityOf, setOpacity, baseLayers, baseLayer, setBaseLayer } = useMapLayers()

const listed = computed(() => layers.value.filter((l) => l.listed))
const bases = computed(() => [...baseLayers.value.map((l) => ({ value: l.id, label: l.title })), { value: 'none', label: 'None' }])
const base = computed({
  get: () => baseLayer.value ?? 'none',
  set: (id: string | number) => setBaseLayer(id === 'none' ? null : String(id)),
})
</script>

<template>
  <MCard variant="elevated" class="flex w-72 max-w-[calc(100vw-5rem)] flex-col gap-3 p-3">
    <div class="flex flex-wrap gap-2">
      <MChip v-for="layer in listed" :key="layer.id" type="filter" clickable :selected="isVisible(layer.id)" @click="toggle(layer.id)">
        {{ layer.title }}
      </MChip>
    </div>
    <MSlider
      :model-value="opacityOf('districts')"
      :min="0"
      :max="1"
      :step="0.05"
      label="Districts opacity"
      @update:model-value="setOpacity('districts', Number($event))"
    />
    <MSegmentedButton v-model="base" :options="bases" density="compact" />
  </MCard>
</template>
