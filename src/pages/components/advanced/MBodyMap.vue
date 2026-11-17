<script setup lang="ts">
import { computed, ref } from 'vue'
import { MBodyMap, MChip } from '@m3ui-vue/m3ui-vue'
import type { BodyMapValue, BodyRegion } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const pain = ref<BodyMapValue>({ 'back-lower-back': 3, 'knee-right': 1 })
const labels = ref<Record<string, string>>({ 'back-lower-back': 'Lower back', 'knee-right': 'Knee, right' })
function onSelect(r: BodyRegion & { level: number }) {
  labels.value[r.id] = r.label
}
const levelNames = ['Mild', 'Moderate', 'Severe']
const marked = computed(() => Object.entries(pain.value).sort((a, b) => b[1] - a[1]))

const sites = ref<BodyMapValue>({})

const props: PropDef[] = [
  { name: 'modelValue', type: 'Record<string, number>', default: '{}', description: 'Marked regions: id → level (v-model)' },
  { name: 'levels', type: 'number', default: '1', description: 'Levels a tap cycles through; 1 is a plain on/off selection' },
  { name: 'levelColors', type: 'string[]', description: 'Color per level. Defaults to the error color, stronger for higher levels' },
  { name: 'levelLabels', type: 'string[]', description: 'Names of the levels for the legend and screen readers' },
  { name: 'view', type: "'front' | 'back' | 'both'", default: "'both'", description: 'Which side(s) to draw' },
  { name: 'disabledRegions', type: 'string[]', default: '[]', description: "Region ids that can't be marked" },
  { name: 'readonly', type: 'boolean', default: 'false', description: "Shows the marks without changing them" },
]

const slots: SlotDef[] = [
  { name: 'legend', description: 'Replaces the levels legend', scope: '{ levels, colors, labels }' },
]

const events: EventDef[] = [
  { name: 'update:modelValue', payload: 'Record<string, number>', description: 'The marked regions' },
  { name: 'select', payload: '{ id, label, view, level }', description: 'A region changed (level 0 = cleared)' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MBodyMap</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A front and back body silhouette with regions to mark: where it hurts, an injury, a rash, an injection site.
      Each tap moves a region one level up and back to unmarked; with the keyboard, Enter cycles, a digit sets the
      level and Delete clears. Sides are the patient's, so on the front view their right shoulder is on your left.
      Region names come from the locale (<code>shoulder-right</code> reads "Shoulder, right").
    </p>

    <ComponentDemo
      title="Pain assessment"
      description="Three levels with names. The list beside the map uses the select event's translated labels."
      :code="`<MBodyMap
  v-model=&quot;pain&quot;
  :levels=&quot;3&quot;
  :level-labels=&quot;['Mild', 'Moderate', 'Severe']&quot;
  @select=&quot;(r) => (labels[r.id] = r.label)&quot;
/>`"
      :script="`const pain = ref<BodyMapValue>({ 'back-lower-back': 3, 'knee-right': 1 })`"
    >
      <div class="grid w-full items-start gap-6 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <MBodyMap v-model="pain" :levels="3" :level-labels="levelNames" @select="onSelect" />
        <div class="flex flex-col gap-2">
          <p class="text-title-small">Marked areas</p>
          <p v-if="!marked.length" class="text-body-medium text-on-surface-variant">Tap where it hurts</p>
          <div v-for="[id, level] in marked" :key="id" class="flex items-center justify-between gap-2 text-body-medium">
            <span>{{ labels[id] ?? id }}</span>
            <MChip>{{ levelNames[level - 1] }}</MChip>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Injection sites, front only"
      description="levels 1 is a plain selection; levelColors picks the color, and disabledRegions keeps the head and neck out."
      :code="`<MBodyMap v-model=&quot;sites&quot; view=&quot;front&quot; :level-colors=&quot;['var(--color-primary)']&quot; :disabled-regions=&quot;['head', 'neck']&quot; />`"
    >
      <div class="flex w-full flex-col items-center gap-2">
        <MBodyMap v-model="sites" view="front" class="w-48" :level-colors="['var(--color-primary)']" :disabled-regions="['head', 'neck']" />
        <p class="font-mono text-body-small text-on-surface-variant">{{ JSON.stringify(sites) }}</p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <ComponentPager current="MBodyMap" />
  </div>
</template>
