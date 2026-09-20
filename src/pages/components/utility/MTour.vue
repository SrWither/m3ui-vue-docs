<script setup lang="ts">
import { ref } from 'vue'
import { MTour, MButton } from '@m3ui-vue/m3ui-vue'
import type { TourStep } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const tourProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Show/hide the tour (v-model)' },
  { name: 'steps', type: 'TourStep[]', description: 'Ordered list of steps — see the type below' },
  { name: 'prevLabel', type: 'string', description: "Label for the Previous button (defaults to the locale string, 'Previous')" },
  { name: 'nextLabel', type: 'string', description: "Label for the Next button (defaults to the locale string, 'Next')" },
  { name: 'finishLabel', type: 'string', description: "Label for the final step's button (defaults to the locale string, 'Finish')" },
]

const tourEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted when the tour opens or closes (Escape-less — closed via the X button, clicking the scrim, or finishing) — powers v-model' },
  { name: 'finish', description: 'Emitted when the user completes the last step (clicks the finish button)' },
]

const tourTypes: TypeDef[] = [
  {
    name: 'TourStep',
    fields: [
      { name: 'target', type: 'string', required: true, description: 'CSS selector for the element to highlight and anchor the tooltip to' },
      { name: 'title', type: 'string', required: true, description: 'Step title' },
      { name: 'content', type: 'string', required: true, description: 'Step description' },
      { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", description: 'Preferred tooltip placement — auto-flips when there isn\'t enough viewport room' },
    ],
  },
]

const tourOpen = ref(false)
const tourSteps: TourStep[] = [
  { target: '#tour-target-1', title: 'Welcome', content: 'This is the first step of the tour.', placement: 'bottom' },
  { target: '#tour-target-2', title: 'Features', content: 'Here you can explore the features.', placement: 'bottom' },
  { target: '#tour-target-3', title: 'Done!', content: 'You have completed the tour.', placement: 'left' },
]

const finishCount = ref(0)
const customTourOpen = ref(false)
const customSteps: TourStep[] = [
  { target: '#tour-custom-1', title: 'Paso 1', content: 'Etiquetas de botón personalizadas.', placement: 'bottom' },
  { target: '#tour-custom-2', title: 'Paso 2', content: 'Se cierra al pulsar "Listo".', placement: 'bottom' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTour</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A guided, step-by-step walkthrough that highlights a page element per step with an auto-positioned tooltip
      and a dimming scrim.
    </p>

    <ComponentDemo
      title="Guided Tour"
      description="Step-by-step walkthrough that highlights elements on the page. The tooltip auto-flips placement when it would run off-screen."
      :code="`<template>
  <MButton @click=&quot;open = true&quot;>Start Tour</MButton>
  <MTour v-model=&quot;open&quot; :steps=&quot;steps&quot; />
</template>`"
      :script="`const open = ref(false)
const steps = [
  { target: '#step-1', title: 'Welcome', content: 'Start here.', placement: 'bottom' },
  { target: '#step-2', title: 'Features', content: 'Explore features.', placement: 'bottom' },
  { target: '#step-3', title: 'Done!', content: 'Tour complete.', placement: 'left' },
]`"
    >
      <div class="w-full">
        <div class="mb-4 flex items-center gap-4">
          <MButton id="tour-target-1" variant="tonal" icon="flag">Start</MButton>
          <MButton id="tour-target-2" variant="outlined" icon="explore">Features</MButton>
          <MButton id="tour-target-3" variant="outlined" icon="check_circle">Finish</MButton>
        </div>
        <MButton @click="tourOpen = true">Start Tour</MButton>
        <MTour v-model="tourOpen" :steps="tourSteps" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Labels & finish Event"
      description="prevLabel/nextLabel/finishLabel override the button text (handy for localization); finish fires once, when the user completes the last step."
      :code="`<template>
  <MTour
    v-model=&quot;open&quot;
    :steps=&quot;steps&quot;
    prev-label=&quot;Atrás&quot;
    next-label=&quot;Siguiente&quot;
    finish-label=&quot;Listo&quot;
    @finish=&quot;onFinish&quot;
  />
</template>`"
      :script="`function onFinish() {
  finishCount.value++
}`"
    >
      <div class="w-full">
        <div class="mb-4 flex items-center gap-4">
          <MButton id="tour-custom-1" variant="tonal" icon="looks_one">Paso 1</MButton>
          <MButton id="tour-custom-2" variant="outlined" icon="looks_two">Paso 2</MButton>
        </div>
        <MButton @click="customTourOpen = true">Iniciar tour</MButton>
        <span class="ml-3 text-body-small text-on-surface-variant">Completado: {{ finishCount }} vez/veces</span>
        <MTour
          v-model="customTourOpen"
          :steps="customSteps"
          prev-label="Atrás"
          next-label="Siguiente"
          finish-label="Listo"
          @finish="finishCount++"
        />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="tourProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="tourEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="tourTypes" />

    <ComponentPager current="MTour" />
  </div>
</template>
