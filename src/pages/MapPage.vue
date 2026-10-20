<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MMap', description: 'A MapLibre map for any style, its view as a v-model, with M3 controls that follow the theme.' },
  { name: 'MMapMarker', description: 'A pin in the theme\'s color or your own content at a point, draggable, with a popup.' },
  { name: 'MMapPopup', description: 'A popup with your own content at a point of the map.' },
  { name: 'MMapGeoJson', description: 'GeoJSON drawn in the theme\'s colors, or with your own layers, clickable.' },
  { name: 'MMapControl', description: 'Your own control in a corner: icon buttons, anything else, or a button that expands into a panel.' },
  { name: 'MMapLayers', description: 'A layer list from the style\'s conventions: groups, visibility, opacity and legends.' },
  { name: 'MMapBaseLayers', description: 'A thumbnail switcher for the style\'s base layers.' },
  { name: 'MMapIdentify', description: 'Click a feature for its formatted data, in a popup or your own panel.' },
  { name: 'MMapFeatureInfo', description: 'Identify results as cards, anywhere.' },
  { name: 'MMapHover', description: 'A summary of the features under the pointer, with its own toggle.' },
  { name: 'MMapMeasure', description: 'Measure distances and areas, editable, with M3 labels.' },
  { name: 'MMapFilter', description: 'Filter a layer by the values of one property, as chips.' },
  { name: 'MMapSearch', description: 'A place search card, with Nominatim or your own geocoder.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Map</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A MapLibre map and the components that go inside it: markers, popups, GeoJSON, controls, layer lists from the
      style's conventions, identify, hover, measuring, filters and search. All from the /map entry point, with
      maplibre-gl as an optional peer dependency.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/map/${c.name.toLowerCase()}`"
        class="no-underline"
      >
        <MCard clickable class="flex h-full flex-col gap-2 p-4">
          <div class="flex items-center gap-2">
            <MIcon :name="iconMap[c.name] ?? 'code'" :size="22" class="text-primary" />
            <span class="text-title-medium font-medium">{{ c.name }}</span>
          </div>
          <p class="text-body-small text-on-surface-variant">{{ c.description }}</p>
        </MCard>
      </router-link>
    </div>
  </div>
</template>
