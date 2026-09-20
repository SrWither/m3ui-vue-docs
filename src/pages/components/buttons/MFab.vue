<script setup lang="ts">
import { ref } from 'vue'
import { MFab, MCard } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const fabProps: PropDef[] = [
  { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'label', type: 'string', description: 'Extended FAB label text' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'surface'", default: "'primary'", description: 'Color scheme' },
  { name: 'size', type: "'small' | 'regular' | 'medium' | 'large'", default: "'regular'", description: 'FAB size' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'items', type: 'SpeedDialItem[]', description: 'Speed-dial child items (see the type below)' },
  { name: 'direction', type: "'up' | 'down' | 'left' | 'right' | 'radial'", default: "'up'", description: 'Speed-dial expand direction' },
  { name: 'to', type: 'string | RouteLocationRaw', description: 'Vue Router destination — renders as RouterLink instead of button' },
  { name: 'persistent', type: 'boolean', default: 'false', description: 'Keep speed-dial open after clicking an item or clicking outside' },
]

const fabEvents = [
  { name: 'click', payload: 'MouseEvent', description: 'Emitted when the FAB itself is clicked (not a speed-dial item)' },
]

const fabTypes: TypeDef[] = [
  {
    name: 'SpeedDialItem',
    fields: [
      { name: 'icon', type: 'string', required: true, description: 'Material Symbol name' },
      { name: 'label', type: 'string', description: 'Tooltip label (shown for up/down directions)' },
      { name: 'to', type: 'string | Record<string, any>', description: 'Vue Router destination (renders as RouterLink)' },
      { name: 'onClick', type: '() => void', description: 'Click handler' },
    ],
  },
]

const dialItems = [
  { icon: 'image', label: 'Photo', onClick: () => {} },
  { icon: 'videocam', label: 'Video', onClick: () => {} },
  { icon: 'mic', label: 'Audio', onClick: () => {} },
]

const activeLayer = ref('osm')
const activeLayers = ref<string[]>(['osm'])
const mapLayers = [
  { id: 'osm', label: 'OpenStreetMap', img: 'https://tile.openstreetmap.org/2/2/1.png' },
  { id: 'satellite', label: 'Satellite', img: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/2/1/2' },
  { id: 'topo', label: 'Topographic', img: 'https://tile.opentopomap.org/2/2/1.png' },
]
function toggleLayer(id: string) {
  const i = activeLayers.value.indexOf(id)
  if (i >= 0) activeLayers.value = activeLayers.value.filter(l => l !== id)
  else activeLayers.value = [...activeLayers.value, id]
}
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFab</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A Floating Action Button for the primary action of a screen. Supports extended (icon+label), a speed-dial
      of small items, or a fully custom expanding panel via the <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">#content</code> slot.
    </p>

    <ComponentDemo
      title="Sizes"
      description="Small, regular, medium, and large floating action buttons."
      :code="`<template>
  <MFab icon=&quot;add&quot; size=&quot;small&quot; />
  <MFab icon=&quot;add&quot; size=&quot;regular&quot; />
  <MFab icon=&quot;add&quot; size=&quot;medium&quot; />
  <MFab icon=&quot;add&quot; size=&quot;large&quot; />
</template>`"
    >
      <div class="flex flex-col items-start gap-4">
        <MFab icon="add" size="small" />
        <MFab icon="add" size="regular" />
        <MFab icon="add" size="medium" />
        <MFab icon="add" size="large" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Colors"
      description="Four color schemes for the FAB."
      :code="`<template>
  <MFab icon=&quot;edit&quot; color=&quot;primary&quot; />
  <MFab icon=&quot;edit&quot; color=&quot;secondary&quot; />
  <MFab icon=&quot;edit&quot; color=&quot;tertiary&quot; />
  <MFab icon=&quot;edit&quot; color=&quot;surface&quot; />
</template>`"
    >
      <MFab icon="edit" color="primary" />
      <MFab icon="edit" color="secondary" />
      <MFab icon="edit" color="tertiary" />
      <MFab icon="edit" color="surface" />
    </ComponentDemo>

    <ComponentDemo
      title="Extended FAB"
      description="FAB with a text label for more context."
      :code="`<template>
  <MFab icon=&quot;add&quot; label=&quot;New item&quot; />
  <MFab icon=&quot;edit&quot; label=&quot;Compose&quot; color=&quot;tertiary&quot; />
</template>`"
    >
      <MFab icon="add" label="New item" />
      <MFab icon="edit" label="Compose" color="tertiary" />
    </ComponentDemo>

    <ComponentDemo
      title="Speed Dial"
      description="Pass an items array to turn the FAB into a speed dial. Each item needs an icon and optionally a label and onClick handler."
      :code="`<template>
  <MFab icon=&quot;add&quot; :items=&quot;items&quot; direction=&quot;up&quot; />
</template>`"
      :script="`const items = [
  { icon: 'image', label: 'Photo', onClick: () => {} },
  { icon: 'videocam', label: 'Video', onClick: () => {} },
  { icon: 'mic', label: 'Audio', onClick: () => {} },
]`"
    >
      <div class="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <MCard v-for="dir in (['up', 'down', 'left', 'right', 'radial'] as const)" :key="dir" class="flex flex-col items-center overflow-visible p-0">
          <p class="w-full border-b border-outline-variant px-4 py-2 text-center text-label-large font-medium text-on-surface-variant">
            {{ dir }}
          </p>
          <div class="flex h-40 items-center justify-center">
            <MFab icon="add" :items="dialItems" :direction="dir" size="small" />
          </div>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Persistent Speed Dial"
      description="With persistent, the speed dial stays open after clicking an item or clicking outside. The user must click the FAB again to close it."
      :code="`<template>
  <MFab icon=&quot;add&quot; :items=&quot;items&quot; :persistent=&quot;true&quot; />
</template>`"
    >
      <div class="flex h-52 w-full items-center justify-center">
        <MFab icon="add" :items="dialItems" :persistent="true" size="small" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Content"
      description="Use the content slot to show any custom content when the FAB expands. The slot receives a close function. Supports all directions."
      :code="`<MFab icon=&quot;add&quot;>
  <template #content=&quot;{ close }&quot;>
    <div class=&quot;rounded-2xl bg-surface-container-high shadow-elevation-3&quot;>
      <button @click=&quot;close()&quot;>New file</button>
      <button @click=&quot;close()&quot;>New folder</button>
    </div>
  </template>
</MFab>`"
    >
      <div class="grid w-full grid-cols-2 gap-6 sm:grid-cols-4">
        <MCard v-for="dir in (['up', 'down', 'left', 'right'] as const)" :key="dir" class="flex flex-col items-center overflow-visible p-0">
          <p class="w-full border-b border-outline-variant px-4 py-2 text-center text-label-large font-medium text-on-surface-variant">
            {{ dir }}
          </p>
          <div class="flex h-52 items-center justify-center">
            <MFab icon="add" :direction="dir" size="small">
              <template #content="{ close }">
                <div class="flex w-44 flex-col overflow-hidden rounded-2xl bg-surface-container-high py-2 shadow-elevation-3">
                  <button
                    v-for="item in ['New file', 'New folder', 'Upload']"
                    :key="item"
                    type="button"
                    class="cursor-pointer px-4 py-2.5 text-left text-body-medium text-on-surface transition-colors hover:bg-on-surface/8"
                    @click="close()"
                  >
                    {{ item }}
                  </button>
                </div>
              </template>
            </MFab>
          </div>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Map Layer Switcher"
      description="A FAB that expands to show circular map layer toggles. The active layer gets a colored border. Content is fully custom — no wrapper styles imposed."
      :code="`<MFab icon=&quot;layers&quot; direction=&quot;right&quot; color=&quot;surface&quot;>
  <template #content>
    <div class=&quot;flex gap-3&quot;>
      <button v-for=&quot;layer in layers&quot; @click=&quot;active = layer.id&quot;>
        <img :src=&quot;layer.img&quot; class=&quot;rounded-full&quot; />
      </button>
    </div>
  </template>
</MFab>`"
    >
      <div class="flex w-full flex-col gap-6">
        <div>
          <div class="flex h-16 items-center pl-8">
            <MFab icon="layers" direction="right" color="surface" size="small">
              <template #content>
                <div class="ml-3 flex items-center gap-3">
                  <button
                    v-for="layer in mapLayers"
                    :key="layer.id"
                    type="button"
                    class="h-10 w-10 cursor-pointer overflow-hidden rounded-full ring-2 transition-all duration-200"
                    :class="activeLayer === layer.id ? 'ring-primary scale-110' : 'ring-outline-variant hover:ring-on-surface'"
                    :title="layer.label"
                    @click="activeLayer = layer.id"
                  >
                    <img :src="layer.img" :alt="layer.label" class="h-full w-full object-cover" />
                  </button>
                </div>
              </template>
            </MFab>
          </div>
          <p class="mt-2 pl-8 text-body-small text-on-surface-variant">
            Base layer: <strong class="text-on-surface">{{ mapLayers.find(l => l.id === activeLayer)?.label }}</strong>
          </p>
        </div>

        <div>
          <div class="flex h-16 items-center pl-8">
            <MFab icon="stacks" direction="right" color="surface" size="small" :persistent="true">
              <template #content>
                <div class="ml-3 flex items-center gap-3">
                  <button
                    v-for="layer in mapLayers"
                    :key="layer.id"
                    type="button"
                    class="h-10 w-10 cursor-pointer overflow-hidden rounded-full ring-2 transition-all duration-200"
                    :class="activeLayers.includes(layer.id) ? 'ring-primary scale-110' : 'ring-outline-variant hover:ring-on-surface opacity-60'"
                    :title="layer.label"
                    @click="toggleLayer(layer.id)"
                  >
                    <img :src="layer.img" :alt="layer.label" class="h-full w-full object-cover" />
                  </button>
                </div>
              </template>
            </MFab>
          </div>
          <p class="mt-2 pl-8 text-body-small text-on-surface-variant">
            Overlays: <strong class="text-on-surface">{{ activeLayers.map(id => mapLayers.find(l => l.id === id)?.label).join(', ') || 'None' }}</strong>
          </p>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="fabProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="fabEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="fabTypes" />

    <ComponentPager current="MFab" />
  </div>
</template>
