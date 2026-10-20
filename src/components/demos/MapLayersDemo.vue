<script setup lang="ts">
// The sample style with the Orvian conventions, with whichever of the style-driven components a page shows
import { ref, shallowRef } from 'vue'
import { MCard, MIcon, MIconButton } from '@m3ui-vue/m3ui-vue'
import { MMap, MMapBaseLayers, MMapControl, MMapFeatureInfo, MMapHover, MMapIdentify, MMapLayers, orvianAdapter } from '@m3ui-vue/m3ui-vue/map'
import type { MapIdentifyResult } from '@m3ui-vue/m3ui-vue/map'
import { sampleStyle as style } from './mapSampleStyle'

const props = defineProps<{
  layers?: boolean
  base?: boolean
  identify?: boolean
  hover?: boolean
  /** Identify into a side card of MMapFeatureInfo instead of the popup */
  panel?: boolean
}>()

const adapter = orvianAdapter()
const hoverOn = ref(true)
const layersOpen = ref(true)
const results = shallowRef<MapIdentifyResult[]>([])
</script>

<template>
  <MMap :map-style="style" :adapter="adapter" :center="[-64.19, -31.42]" :zoom="12" fullscreen class="h-[32rem] w-full rounded-xl">
    <MMapIdentify v-if="props.identify || props.panel" :popup="!props.panel" @identify="(r) => (results = r)" />
    <MMapHover v-if="props.hover" v-model="hoverOn" />

    <!-- The layer list: a button that expands into it, in the map's corner (so it's there in fullscreen too) -->
    <MMapControl v-if="props.layers" v-model:expanded="layersOpen" position="top-left">
      <template #default="{ toggle }">
        <button type="button" class="grid place-items-center" title="Layers" @click="toggle">
          <MIcon name="layers" :size="20" />
        </button>
      </template>
      <template #panel="{ close }">
        <div class="flex max-h-96 w-72 max-w-[calc(100vw-5rem)] flex-col">
          <div class="flex items-center gap-2 py-1 pr-1 pl-4">
            <span class="flex-1 text-title-small">Layers</span>
            <MIconButton icon="close" label="Close" size="xs" @click="close" />
          </div>
          <div class="overflow-y-auto px-3 pb-3">
            <MMapLayers />
          </div>
        </div>
      </template>
    </MMapControl>

    <MMapControl v-if="props.base" position="bottom-left" :group="false">
      <MCard variant="elevated" class="p-2">
        <MMapBaseLayers />
      </MCard>
    </MMapControl>

    <!-- MMapFeatureInfo in a card of your own, filled from MMapIdentify's identify event -->
    <MMapControl v-if="props.panel" position="top-right" :group="false">
      <MCard variant="elevated" class="max-h-80 w-64 max-w-[calc(100vw-5rem)] overflow-y-auto p-3">
        <MMapFeatureInfo v-if="results.length" :results="results" />
        <p v-else class="text-body-medium text-on-surface-variant">Click a district, a bike lane or a place.</p>
      </MCard>
    </MMapControl>
  </MMap>
</template>
