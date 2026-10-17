<script setup lang="ts">
import { ref } from 'vue'
import { MBottomSheetScaffold, MTopAppBar, MIconButton, MListItem, MButton } from '@m3ui-vue/m3ui-vue'
import type { BottomSheetValue } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const scaffoldProps: PropDef[] = [
  { name: 'modelValue', type: "'hidden' | 'partial' | 'expanded'", default: "'partial'", description: 'The sheet\'s state (v-model): partial shows peekHeight of it, expanded all of it, hidden none' },
  { name: 'peekHeight', type: 'number', default: '56', description: 'Height in px the partially expanded sheet shows' },
  { name: 'skipHiddenState', type: 'boolean', default: 'true', description: 'Leaves out the hidden state, so the sheet can\'t be swiped away. Set it to false for a sheet you can dismiss and bring back' },
  { name: 'swipeEnabled', type: 'boolean', default: 'true', description: 'Lets the sheet be dragged; with false it only moves through v-model and the handle' },
  { name: 'maxWidth', type: 'number', default: '640', description: 'Maximum width in px; the sheet is centered when the screen is wider' },
]

const scaffoldSlots: SlotDef[] = [
  { name: '#default', description: 'The screen\'s content. It gets bottom padding equal to peekHeight so nothing hides under the peeking sheet' },
  { name: '#sheet', description: 'The sheet\'s content, below the drag handle. It scrolls once the sheet is fully expanded' },
  { name: '#top-bar', description: 'An app bar above the content (the sheet can rise over it)' },
]

const scaffoldEvents = [
  { name: 'update:modelValue', payload: "'hidden' | 'partial' | 'expanded'", description: 'Emitted when the sheet settles in another state after a drag or a handle tap — powers v-model' },
]

const places = [
  { name: 'Café Tortoni', kind: 'Café · 1.2 km', icon: 'local_cafe' },
  { name: 'Museo Nacional de Bellas Artes', kind: 'Museum · 3.4 km', icon: 'museum' },
  { name: 'Parque Tres de Febrero', kind: 'Park · 5.1 km', icon: 'park' },
  { name: 'Teatro Colón', kind: 'Theater · 2.0 km', icon: 'theater_comedy' },
  { name: 'Mercado de San Telmo', kind: 'Market · 1.8 km', icon: 'storefront' },
  { name: 'Biblioteca Nacional', kind: 'Library · 4.0 km', icon: 'local_library' },
  { name: 'Planetario Galileo Galilei', kind: 'Planetarium · 5.6 km', icon: 'nightlight' },
  { name: 'Jardín Japonés', kind: 'Garden · 5.3 km', icon: 'yard' },
  { name: 'Usina del Arte', kind: 'Venue · 2.7 km', icon: 'piano' },
  { name: 'Caminito', kind: 'Street · 3.9 km', icon: 'palette' },
]

const sheet = ref<BottomSheetValue>('partial')
const dismissible = ref<BottomSheetValue>('partial')
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MBottomSheetScaffold</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A screen with Material 3's standard bottom sheet: the sheet sits over the bottom of the content without a
      scrim, peeking out when partially expanded, and the content behind it stays usable. Drag the sheet up and
      down (once fully up, its content scrolls), or tap its handle. For a sheet that blocks the screen behind a
      scrim, use <RouterLink to="/components/overlays/mbottomsheet" class="text-primary underline">MBottomSheet</RouterLink>.
    </p>

    <ComponentDemo
      title="Standard Bottom Sheet"
      description="A map-like screen with a list of places in the sheet. Drag it up (more than 56px, or with a flick), scroll the list once it's fully up, and drag it back down from the top of the list. It can't be swiped away: that's skipHiddenState, on by default. peek-height is set to 80 so the sheet's heading shows below the 48px handle; the default 56 shows only the handle and the top edge of the content, as in Compose."
      :code="`<MBottomSheetScaffold v-model=&quot;sheet&quot; :peek-height=&quot;80&quot;>
  <template #top-bar>
    <MTopAppBar title=&quot;Nearby&quot; />
  </template>

  <!-- the screen -->
  <div class=&quot;h-full bg-tertiary-container&quot;>…</div>

  <template #sheet>
    <p class=&quot;px-6 pb-4 text-title-medium&quot;>10 places nearby</p>
    <MListItem v-for=&quot;p in places&quot; :key=&quot;p.name&quot; :title=&quot;p.name&quot; :subtitle=&quot;p.kind&quot; :icon=&quot;p.icon&quot; />
  </template>
</MBottomSheetScaffold>`"
      :script="`const sheet = ref<BottomSheetValue>('partial')`"
    >
      <div class="h-[520px] w-full max-w-sm overflow-hidden rounded-xl border border-outline-variant">
        <MBottomSheetScaffold v-model="sheet" :peek-height="80">
          <template #top-bar>
            <MTopAppBar title="Nearby">
              <template #actions>
                <MIconButton icon="search" label="Search" />
              </template>
            </MTopAppBar>
          </template>
          <div class="flex h-full flex-col items-center justify-center gap-2 bg-tertiary-container text-on-tertiary-container">
            <span class="material-symbols-outlined text-[48px]">map</span>
            <span class="text-body-medium">Map · sheet is {{ sheet }}</span>
          </div>
          <template #sheet>
            <p class="px-6 pb-2 text-title-medium">{{ places.length }} places nearby</p>
            <MListItem v-for="p in places" :key="p.name" :title="p.name" :subtitle="p.kind" :icon="p.icon" />
          </template>
        </MBottomSheetScaffold>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Dismissible (skipHiddenState false)"
      description="With skip-hidden-state set to false the sheet can also be swiped down out of sight, and v-model brings it back."
      :code="`<MBottomSheetScaffold v-model=&quot;sheet&quot; :skip-hidden-state=&quot;false&quot; :peek-height=&quot;120&quot;>
  <MButton :disabled=&quot;sheet !== 'hidden'&quot; @click=&quot;sheet = 'partial'&quot;>Show sheet</MButton>
  <template #sheet>…</template>
</MBottomSheetScaffold>`"
    >
      <div class="h-[420px] w-full max-w-sm overflow-hidden rounded-xl border border-outline-variant">
        <MBottomSheetScaffold v-model="dismissible" :skip-hidden-state="false" :peek-height="120">
          <div class="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <span class="text-body-medium text-on-surface-variant">Sheet is {{ dismissible }}</span>
            <MButton :disabled="dismissible !== 'hidden'" @click="dismissible = 'partial'">Show sheet</MButton>
          </div>
          <template #sheet>
            <div class="px-6 pb-6">
              <p class="text-title-medium">Now playing</p>
              <p class="mb-4 text-body-medium text-on-surface-variant">Swipe down to hide, up to see the queue.</p>
              <MListItem v-for="n in 6" :key="n" :title="`Track ${n}`" subtitle="Artist" icon="music_note" />
            </div>
          </template>
        </MBottomSheetScaffold>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="scaffoldProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="scaffoldSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="scaffoldEvents" />

    <ComponentPager current="MBottomSheetScaffold" />
  </div>
</template>
