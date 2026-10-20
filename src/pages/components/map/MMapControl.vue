<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import { computed, ref } from 'vue'
import { MIcon, MIconButton } from '@m3ui-vue/m3ui-vue'
import { MMap, MMapControl } from '@m3ui-vue/m3ui-vue/map'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import MapViewControl from '@/components/demos/MapViewControl.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import { CORDOBA, STYLE } from '@/components/demos/mapShared'

// ── A control group ──
const pitch = ref(0)
const bearing = ref(0)
const tilted = computed(() => pitch.value > 10)

// ── Expanding into a panel ──
const styles = [
  { id: 'liberty', label: 'Streets', icon: 'map' },
  { id: 'bright', label: 'Bright', icon: 'light_mode' },
  { id: 'positron', label: 'Light', icon: 'texture' },
  { id: 'dark', label: 'Dark', icon: 'dark_mode' },
]
const styleId = ref('liberty')
const pickerOpen = ref(false)
const pickerStyle = computed(() => `https://tiles.openfreemap.org/styles/${styleId.value}`)
const pickerCenter = ref<[number, number]>([...CORDOBA])

const controlProps: PropDef[] = [
  { name: 'position', type: 'MapControlPosition', default: '\'top-right\'', description: 'The corner, stacked with MapLibre\'s controls.' },
  { name: 'group', type: 'boolean', default: 'true', description: 'A control group like the zoom buttons: buttons inside get the same M3 look (aria-pressed for the active one, title for the tooltip). false for anything else, bare: a card, a search bar, a legend, an MFab…' },
  { name: 'expanded', type: 'boolean', default: 'false', description: 'Expanded into its #panel (v-model:expanded).' },
  { name: 'animate', type: 'boolean', default: 'true', description: 'Spring its size when its content changes size (expanding, or anything else), so the controls below it move along.' },
]
const controlEvents: EventDef[] = [
  { name: 'update:expanded', payload: 'boolean', description: 'The panel opened or closed (its toggle, close, Escape or a press outside it): powers v-model:expanded.' },
]
const controlSlots: SlotDef[] = [
  { name: 'default', description: 'The control\'s content. With a #panel, its scope has expanded and toggle: call toggle from your button.' },
  { name: 'panel', description: 'What the control expands into, in place, on a surface of its own (your buttons inside keep their own look). Scope: close.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMapControl</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Your own control in a corner of an <RouterLink to="/components/map/mmap" class="text-primary underline">MMap</RouterLink>,
      stacked with MapLibre's. As a control group (the default), icon buttons get the zoom buttons' M3 look; without
      it, anything goes. Give it a #panel and a button in it expands the control in place into your own content,
      with its size springing open and closed.
    </p>

    <ComponentDemo
      title="A control group"
      description="Icon buttons with a click handler each, in the zoom buttons' look: aria-pressed marks the active one, and a title becomes the library's tooltip. Here, a 3D tilt and back to north, through MMap's view v-models."
      :code="`<MMap
  map-style=&quot;https://tiles.openfreemap.org/styles/liberty&quot;
  v-model:pitch=&quot;pitch&quot;
  v-model:bearing=&quot;bearing&quot;
  :center=&quot;[-64.1888, -31.4201]&quot;
  :zoom=&quot;16&quot;
  class=&quot;h-80 rounded-xl&quot;
>
  <MMapControl position=&quot;top-left&quot;>
    <button type=&quot;button&quot; title=&quot;3D&quot; :aria-pressed=&quot;pitch > 10&quot; @click=&quot;pitch = pitch > 10 ? 0 : 60&quot;>
      <MIcon name=&quot;3d_rotation&quot; :size=&quot;20&quot; />
    </button>
    <button type=&quot;button&quot; title=&quot;North up&quot; :disabled=&quot;!bearing&quot; @click=&quot;bearing = 0&quot;>
      <MIcon name=&quot;north&quot; :size=&quot;20&quot; />
    </button>
  </MMapControl>
</MMap>`"
      :script="`import { MMap, MMapControl } from '@m3ui-vue/m3ui-vue/map'

const pitch = ref(0)
const bearing = ref(0)`"
    >
      <MMap v-model:pitch="pitch" v-model:bearing="bearing" :map-style="STYLE" :center="CORDOBA" :zoom="16" class="h-80 w-full rounded-xl">
        <MMapControl position="top-left">
          <button type="button" class="grid place-items-center" title="3D" :aria-pressed="tilted" @click="pitch = tilted ? 0 : 60">
            <MIcon name="3d_rotation" :size="20" />
          </button>
          <button type="button" class="grid place-items-center" title="North up" :disabled="!Math.round(bearing)" @click="bearing = 0">
            <MIcon name="north" :size="20" />
          </button>
        </MMapControl>
      </MMap>
    </ComponentDemo>

    <ComponentDemo
      title="Expanding into a panel"
      description="A button that expands, in its corner, into a panel of your own: here a map style picker. Its size springs open and closed, and the button below it moves along. It closes from its ✕, on Escape or with a press outside it; v-model:expanded follows it."
      :code="`<MMap :map-style=&quot;'https://tiles.openfreemap.org/styles/' + styleId&quot; class=&quot;h-96 rounded-xl&quot;>
  <MMapControl v-model:expanded=&quot;open&quot; position=&quot;top-left&quot;>
    <template #default=&quot;{ toggle }&quot;>
      <button type=&quot;button&quot; title=&quot;Map style&quot; @click=&quot;toggle&quot;>
        <MIcon name=&quot;layers&quot; :size=&quot;20&quot; />
      </button>
    </template>

    <template #panel=&quot;{ close }&quot;>
      <div class=&quot;w-56&quot;>
        <div class=&quot;flex items-center py-1 pr-1 pl-4&quot;>
          <span class=&quot;flex-1 text-title-small&quot;>Map style</span>
          <MIconButton icon=&quot;close&quot; label=&quot;Close&quot; size=&quot;xs&quot; @click=&quot;close&quot; />
        </div>
        <button
          v-for=&quot;s in styles&quot;
          :key=&quot;s.id&quot;
          type=&quot;button&quot;
          class=&quot;flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-on-surface/8&quot;
          @click=&quot;styleId = s.id&quot;
        >
          <MIcon :name=&quot;s.icon&quot; :size=&quot;20&quot; />
          <span class=&quot;flex-1&quot;>{{ s.label }}</span>
          <MIcon v-if=&quot;styleId === s.id&quot; name=&quot;check&quot; :size=&quot;20&quot; class=&quot;text-primary&quot; />
        </button>
      </div>
    </template>
  </MMapControl>

  <!-- Moves along while the one above it opens and closes -->
  <MMapControl position=&quot;top-left&quot;>
    <button type=&quot;button&quot; title=&quot;Back to the center&quot; @click=&quot;center = [-64.1888, -31.4201]&quot;>
      <MIcon name=&quot;my_location&quot; :size=&quot;20&quot; />
    </button>
  </MMapControl>
</MMap>`"
      :script="`const open = ref(false)
const styleId = ref('liberty')
const styles = [
  { id: 'liberty', label: 'Streets', icon: 'map' },
  { id: 'bright', label: 'Bright', icon: 'light_mode' },
  { id: 'positron', label: 'Light', icon: 'texture' },
  { id: 'dark', label: 'Dark', icon: 'dark_mode' },
]`"
    >
      <div class="flex w-full flex-col gap-2">
        <MMap v-model:center="pickerCenter" :map-style="pickerStyle" :zoom="13" class="h-96 w-full rounded-xl">
          <MMapControl v-model:expanded="pickerOpen" position="top-left">
            <template #default="{ toggle }">
              <button type="button" class="grid place-items-center" title="Map style" @click="toggle">
                <MIcon name="layers" :size="20" />
              </button>
            </template>
            <template #panel="{ close }">
              <div class="w-56 pb-2">
                <div class="flex items-center py-1 pr-1 pl-4">
                  <span class="flex-1 text-title-small">Map style</span>
                  <MIconButton icon="close" label="Close" size="xs" @click="close" />
                </div>
                <button
                  v-for="s in styles"
                  :key="s.id"
                  type="button"
                  class="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-body-large transition-colors hover:bg-on-surface/8"
                  @click="styleId = s.id"
                >
                  <MIcon :name="s.icon" :size="20" class="text-on-surface-variant" />
                  <span class="flex-1">{{ s.label }}</span>
                  <MIcon v-if="styleId === s.id" name="check" :size="20" class="text-primary" />
                </button>
              </div>
            </template>
          </MMapControl>
          <MMapControl position="top-left">
            <button type="button" class="grid place-items-center" title="Back to the center" @click="pickerCenter = [...CORDOBA]">
              <MIcon name="my_location" :size="20" />
            </button>
          </MMapControl>
        </MMap>
        <p class="text-body-medium text-on-surface-variant">expanded: {{ pickerOpen }}</p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Anything in a corner"
      description="With :group=&quot;false&quot; the control is bare: here an M3 card with sliders for the map's rotation and tilt, made of library components and wired with useMap(). It follows the map both ways: rotate or tilt it with the right mouse button, Ctrl + drag or two fingers, and the sliders move too."
      :code="`<MMap map-style=&quot;https://tiles.openfreemap.org/styles/liberty&quot; :center=&quot;[-64.1888, -31.4201]&quot; :zoom=&quot;16&quot; fullscreen class=&quot;h-96 rounded-xl&quot;>
  <ViewControl />
</MMap>`"
      :script="`// ViewControl.vue
import { ref } from 'vue'
import { MCard, MIconButton, MSlider } from '@m3ui-vue/m3ui-vue'
import { MMapControl, useMap } from '@m3ui-vue/m3ui-vue/map'

const { map, on, onReady } = useMap()
const bearing = ref(0)
const pitch = ref(0)

// From the map to the sliders: on load, and on every move (mouse, touch, keys)
const read = () => {
  bearing.value = Math.round(map.value.getBearing())
  pitch.value = Math.round(map.value.getPitch())
}
onReady(read)
on('move', read)

// <MMapControl position=&quot;top-left&quot; :group=&quot;false&quot;>
//   <MCard variant=&quot;elevated&quot; class=&quot;w-64 p-3&quot;>
//     <MIconButton icon=&quot;explore&quot; label=&quot;Back to north&quot; @click=&quot;map.easeTo({ bearing: 0, pitch: 0 })&quot; />
//     <MSlider :model-value=&quot;bearing&quot; :min=&quot;-180&quot; :max=&quot;180&quot; @update:model-value=&quot;map.setBearing($event)&quot; />
//     <MSlider :model-value=&quot;pitch&quot; :min=&quot;0&quot; :max=&quot;60&quot; @update:model-value=&quot;map.setPitch($event)&quot; />
//   </MCard>
// </MMapControl>`"
    >
      <MMap :map-style="STYLE" :center="CORDOBA" :zoom="16" fullscreen class="h-96 w-full rounded-xl">
        <MapViewControl />
      </MMap>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="controlProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="controlEvents" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="controlSlots" />

    <ComponentPager current="MMapControl" />
  </div>
</template>
