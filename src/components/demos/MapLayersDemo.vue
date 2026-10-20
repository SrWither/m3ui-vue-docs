<script setup lang="ts">
import { ref } from 'vue'
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { MMap, MMapBaseLayers, MMapControl, MMapHover, MMapIdentify, MMapLayers, orvianAdapter } from '@m3ui-vue/m3ui-vue/map'
import { sampleStyle as style } from './mapSampleStyle'

const adapter = orvianAdapter()
const hover = ref(true)
const showLayers = ref(true)
</script>

<template>
  <MMap :map-style="style" :adapter="adapter" :center="[-64.19, -31.42]" :zoom="12" fullscreen class="h-[32rem] w-full rounded-xl">
    <MMapIdentify />
    <MMapHover v-model="hover" />

    <!-- A button that opens the layer list over the map (so it's there in fullscreen too) -->
    <MMapControl position="top-left">
      <button type="button" class="grid place-items-center" title="Layers" :aria-pressed="showLayers" @click="showLayers = !showLayers">
        <MIcon name="layers" :size="20" />
      </button>
    </MMapControl>
    <MMapControl position="top-left" :group="false">
      <MCard v-if="showLayers" variant="elevated" class="max-h-96 w-72 max-w-[calc(100vw-5rem)] overflow-y-auto p-3">
        <MMapLayers />
      </MCard>
    </MMapControl>

    <MMapControl position="bottom-left" :group="false">
      <MCard variant="elevated" class="p-2">
        <MMapBaseLayers />
      </MCard>
    </MMapControl>
  </MMap>
</template>
