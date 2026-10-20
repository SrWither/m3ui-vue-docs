<script setup lang="ts">
// A tool of your own on useMap(): while on it owns the map's clicks (activeTool), so MMapIdentify waits, and each
// click drops a pin. Its button goes among the map's controls with the M3 look.
import { ref } from 'vue'
import { MIcon } from '@m3ui-vue/m3ui-vue'
import { MMapControl, MMapMarker, useMap } from '@m3ui-vue/m3ui-vue/map'

const { on, activeTool, map } = useMap()
const pins = ref<[number, number][]>([])
const active = () => activeTool.value === 'pins'

function toggle() {
  activeTool.value = active() ? null : 'pins'
  if (map.value) map.value.getCanvas().style.cursor = active() ? 'crosshair' : ''
}

on('click', (e) => {
  if (active()) pins.value.push([e.lngLat.lng, e.lngLat.lat])
})
</script>

<template>
  <div class="hidden">
    <MMapControl position="top-left">
      <button type="button" class="grid place-items-center" title="Drop pins" :aria-pressed="active()" @click="toggle">
        <MIcon name="add_location_alt" :size="20" />
      </button>
      <button type="button" class="grid place-items-center" title="Remove the pins" :disabled="!pins.length" @click="pins = []">
        <MIcon name="location_off" :size="20" />
      </button>
    </MMapControl>
    <MMapMarker v-for="(pin, i) in pins" :key="i" v-model:lng-lat="pins[i]!" draggable />
  </div>
</template>
