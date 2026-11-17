<script setup lang="ts">
import { ref } from 'vue'
import { MOdontogram, MSegmentedButton } from '@m3ui-vue/m3ui-vue'
import type { OdontogramValue } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const chart = ref<OdontogramValue>({
  18: { conditions: ['missing'] },
  16: { surfaces: { occlusal: 'filling', mesial: 'filling' } },
  14: { surfaces: { distal: 'caries' } },
  11: { conditions: ['crown', 'rootCanal'] },
  26: { surfaces: { occlusal: 'caries', buccal: 'caries' } },
  36: { conditions: ['implant', 'crown'] },
  38: { conditions: ['extraction'] },
  46: { surfaces: { occlusal: 'sealant' } },
})
const tool = ref('caries')
const numbering = ref<'fdi' | 'universal'>('fdi')
const log = ref<string[]>([])

const kid = ref<OdontogramValue>({ C: { surfaces: { occlusal: 'caries' } }, S: { surfaces: { occlusal: 'filling' } } })

const props: PropDef[] = [
  { name: 'modelValue', type: 'Record<string, ToothState>', default: '{}', description: 'Tooth number → { surfaces?: { mesial | distal | buccal | lingual | occlusal: condition }, conditions?: string[] } (v-model)' },
  { name: 'tool', type: 'string', description: 'Condition picked, or "eraser" (v-model:tool)' },
  { name: 'conditions', type: 'OdontogramCondition[]', default: 'caries, filling, sealant, crown, root canal, implant, missing, to extract', description: '{ key, label, color, scope: surface | tooth }' },
  { name: 'numbering', type: "'fdi' | 'universal'", default: "'fdi'", description: 'FDI (11–48) or Universal (1–32, A–T)' },
  { name: 'dentition', type: "'permanent' | 'primary'", default: "'permanent'", description: '32 adult teeth or 20 primary teeth' },
  { name: 'hideToolbar', type: 'boolean', default: 'false', description: 'Hides the condition picker' },
  { name: 'readonly', type: 'boolean', default: 'false', description: "Shows the chart without changing it" },
]

const slots: SlotDef[] = [
  { name: 'toolbar', description: 'Replaces the condition picker', scope: '{ conditions, tool, setTool }' },
]

const events: EventDef[] = [
  { name: 'update:modelValue', payload: 'Record<string, ToothState>', description: 'The chart changed' },
  { name: 'update:tool', payload: 'string', description: 'A condition was picked' },
  { name: 'change', payload: '{ tooth, surface?, condition }', description: 'One tooth changed (condition null = cleared)' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MOdontogram</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A dental chart. Every tooth has its five surfaces (mesial toward the midline, buccal toward the lips) and
      whole-tooth conditions: missing, to extract, crown, root canal, implant. Pick a condition, then tap a surface or
      a tooth's number; tapping again removes it. With the keyboard each tooth is one stop: arrows move, M / D / B / L
      / O chart a surface, Enter a tooth condition, Delete clears.
    </p>

    <ComponentDemo
      title="Adult chart"
      description="A charted patient. Switch to Universal numbering to see the same chart keyed 1–32 (the value is keyed by the numbering in use)."
      :code="`<MOdontogram v-model=&quot;chart&quot; v-model:tool=&quot;tool&quot; :numbering=&quot;numbering&quot; @change=&quot;log&quot; />`"
      :script="`const chart = ref<OdontogramValue>({
  18: { conditions: ['missing'] },
  16: { surfaces: { occlusal: 'filling', mesial: 'filling' } },
  11: { conditions: ['crown', 'rootCanal'] },
  …
})`"
    >
      <div class="flex w-full flex-col gap-3">
        <MSegmentedButton
          v-model="numbering"
          class="self-start"
          density="compact"
          :options="[{ value: 'fdi', label: 'FDI' }, { value: 'universal', label: 'Universal' }]"
        />
        <MOdontogram
          v-model="chart"
          v-model:tool="tool"
          :numbering="numbering"
          @change="(c) => log.unshift(`${c.tooth}${c.surface ? ' ' + c.surface : ''} → ${c.condition ?? 'cleared'}`)"
        />
        <p v-if="log.length" class="font-mono text-body-small text-on-surface-variant">{{ log.slice(0, 3).join(' · ') }}</p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Primary teeth"
      description="dentition=&quot;primary&quot; shows the 20 baby teeth, here with Universal letters A–T."
      :code="`<MOdontogram v-model=&quot;chart&quot; dentition=&quot;primary&quot; numbering=&quot;universal&quot; />`"
    >
      <MOdontogram v-model="kid" class="mx-auto w-full max-w-xl" dentition="primary" numbering="universal" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <ComponentPager current="MOdontogram" />
  </div>
</template>
