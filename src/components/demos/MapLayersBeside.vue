<script setup lang="ts">
// The layer list and base layers in a side panel next to the map, reaching it through the MMap's template ref
import { ref } from 'vue'
import { MMap, MMapBaseLayers, MMapLayers, orvianAdapter } from '@m3ui-vue/m3ui-vue/map'
import { sampleStyle as style } from './mapSampleStyle'

const map = ref()
const adapter = orvianAdapter()
</script>

<template>
  <div class="flex h-[32rem] w-full flex-col overflow-hidden rounded-xl border border-outline-variant sm:flex-row">
    <aside class="flex max-h-56 shrink-0 flex-col gap-4 overflow-y-auto bg-surface-container-low p-3 sm:max-h-none sm:w-72">
      <MMapBaseLayers :map="map" />
      <MMapLayers :map="map" :search="false" />
    </aside>
    <MMap ref="map" :map-style="style" :adapter="adapter" :center="[-64.19, -31.42]" :zoom="12" class="min-h-0 flex-1" />
  </div>
</template>
