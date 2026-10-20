<script setup lang="ts">
// A filter of your own on useMapFilter(): a range slider over the districts' population. The style's own filter on the
// layer (if it had one) would stay, combined with this one.
import { ref, watch } from 'vue'
import { MCard, MSlider } from '@m3ui-vue/m3ui-vue'
import { useMap, useMapFilter } from '@m3ui-vue/m3ui-vue/map'

const { setFilter } = useMapFilter()
const { onReady } = useMap()
const range = ref<[number, number]>([30000, 70000])

function apply() {
  const [min, max] = range.value
  for (const layer of ['districts', 'districts-outline']) {
    setFilter(layer, ['all', ['>=', ['get', 'population'], min], ['<=', ['get', 'population'], max]])
  }
}
onReady(apply)
watch(range, apply)
</script>

<template>
  <MCard variant="elevated" class="w-72 max-w-[calc(100vw-5rem)] p-3">
    <p class="mb-1 text-label-large text-on-surface">Population</p>
    <MSlider v-model="range" variant="range" :min="30000" :max="70000" :step="1000" show-value label="Population" />
    <p class="text-body-small text-on-surface-variant">{{ range[0].toLocaleString() }} – {{ range[1].toLocaleString() }}</p>
  </MCard>
</template>
