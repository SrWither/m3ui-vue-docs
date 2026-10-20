<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { MFab, MIcon, MIconButton, MTooltip, MTopAppBar, MWindow, useTheme } from '@m3ui-vue/m3ui-vue'
import {
  MMap,
  MMapBaseLayers,
  MMapFeatureInfo,
  MMapHover,
  MMapIdentify,
  MMapLayers,
  MMapMeasure,
  MMapSearch,
  orvianAdapter,
  type MapIdentifyResult,
} from '@m3ui-vue/m3ui-vue/map'
import type { Map as MaplibreMap } from 'maplibre-gl'
import { exampleSource } from '@/examples/registry'
import { BOUNDS, CENTER, style } from './town'

// Orvian Lite, a public map viewer for an MVT server's styles, rebuilt on MMap. The original wires MapLibre by hand
// (a layer manager, identify, hover and measuring controls); here each one is a component. The style is made up
// (./town.ts): a real deployment loads it from mvt-rs, e.g. :map-style="'https://…/services/styles/public:city'".

const router = useRouter()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])

const adapter = orvianAdapter()
const title = ref('')
const hover = ref(true)
const showLayers = ref(false)

// Identify: the results go to a window instead of a popup, as in Orvian
const info = ref<MapIdentifyResult[]>([])
const showInfo = ref(false)
const identify = ref<{ close: () => void }>()
// Closing the window also clears the marker where the user clicked
watch(showInfo, (open) => { if (!open) identify.value?.close() })
function onIdentify(results: MapIdentifyResult[]) {
  info.value = results
  showInfo.value = results.length > 0
}

function onReady(map: MaplibreMap) {
  title.value = map.getStyle().name ?? ''
}

const openSource = () => window.open(exampleSource('orvian'), '_blank', 'noopener')
</script>

<template>
  <div class="flex h-dvh flex-col bg-surface text-on-surface">
    <MTopAppBar :title="title || 'Orvian'" subtitle="Orvian Lite" bordered>
      <template #navigation>
        <div class="mx-1 grid size-10 place-items-center rounded-xl bg-primary-container text-on-primary-container">
          <MIcon name="public" :size="22" />
        </div>
      </template>
      <template #actions>
        <MTooltip text="Switch theme" placement="bottom"><MIconButton :icon="themeIcon" label="Switch theme" @click="cycle" /></MTooltip>
        <MTooltip text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
        <MTooltip text="View source on GitHub" placement="bottom"><MIconButton icon="code" label="View source on GitHub" @click="openSource" /></MTooltip>
      </template>
    </MTopAppBar>

    <MMap
      :map-style="style"
      :adapter="adapter"
      :center="CENTER"
      :zoom="15"
      :options="{ maxBounds: [[BOUNDS[0][0] - 0.05, BOUNDS[0][1] - 0.05], [BOUNDS[1][0] + 0.05, BOUNDS[1][1] + 0.05]] }"
      persist="orvian-view"
      geolocate
      class="min-h-0 flex-1"
      @ready="onReady"
    >
      <MMapSearch placeholder="Search a place" />
      <MMapMeasure />
      <MMapHover v-model="hover" />
      <MMapIdentify ref="identify" :popup="false" @identify="onIdentify" />

      <!-- Layers and base maps, from FABs in the bottom-left corner -->
      <div class="pointer-events-none absolute bottom-10 left-4 z-[2] flex items-end gap-3">
        <MFab icon="layers" class="pointer-events-auto" :aria-pressed="showLayers" @click="showLayers = !showLayers" />
        <MFab icon="map" color="surface" direction="right" persistent class="pointer-events-auto">
          <template #content>
            <MMapBaseLayers />
          </template>
        </MFab>
      </div>

      <MWindow v-model="showLayers" title="Layers" icon="layers" width="380px" height="520px" :min-width="300" :min-height="240" :x="16" :y="16">
        <div class="h-full overflow-y-auto p-3">
          <MMapLayers />
        </div>
      </MWindow>

      <MWindow v-model="showInfo" title="Information" icon="info" width="380px" height="440px" :min-width="300" :min-height="200" :x="420" :y="16">
        <div class="h-full overflow-y-auto p-3">
          <MMapFeatureInfo :results="info" />
        </div>
      </MWindow>
    </MMap>
  </div>
</template>
