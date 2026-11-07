<script setup lang="ts">
import { computed, ref } from 'vue'
import { MTour, MButton, MSwitch, MTextField } from '@m3ui-vue/m3ui-vue'
import type { TourStep } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
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
  { name: 'step', type: 'number', description: 'The current step\'s index (v-model:step). Without it the tour keeps its own; with it the page can move the tour on by itself (when the user has done what a step asks) or skip steps already done' },
  { name: 'interactive', type: 'boolean', default: 'false', description: 'Leaves the page usable while the tour is open: no scrim, a ring drawn over the target instead of lifting the target itself, the ring and the tooltip following the target as it moves, no scrolling to it' },
]

const tourSlots: SlotDef[] = [
  { name: 'content', scope: '{ step, index }', description: "Replaces the step's title and text" },
  { name: 'indicator', scope: '{ index, count }', description: 'Replaces the "2 / 5" over the step' },
  { name: 'progress', scope: '{ index, count }', description: 'Replaces the progress dots' },
  { name: 'actions', scope: '{ step, index, isFirst, isLast, next, prev, close }', description: 'Replaces the Previous/Next buttons' },
]

const tourEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted when the tour opens or closes (Escape-less — closed via the X button, clicking the scrim, or finishing) — powers v-model' },
  { name: 'update:step', payload: 'number', description: 'Emitted when the current step changes (v-model:step)' },
  { name: 'finish', description: 'Emitted when the user completes the last step (clicks the finish button)' },
]

const tourTypes: TypeDef[] = [
  {
    name: 'TourStep',
    fields: [
      { name: 'target', type: 'string | (() => Element | null | undefined)', description: 'The element to highlight and anchor the tooltip to: a CSS selector, or a function returning it (looked up again every frame in interactive mode, so it can change). None, or none found: the tooltip sits in the viewport, on its placement side (centered without one)' },
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

// Interactive: the tour moves on when you've done what a step asks, and skips what you did ahead of time
const guideOpen = ref(false)
const guideName = ref('')
const guideAlerts = ref(false)
const guideSteps: TourStep[] = [
  { target: '#tour-guide-name', title: 'Your name', content: 'Type it in: the tour moves on by itself.', placement: 'bottom' },
  { target: '#tour-guide-alerts', title: 'Alerts', content: 'Turn them on.', placement: 'bottom' },
  { title: 'All set', content: 'Every step was checked against the page, not clicked through.', placement: 'bottom' },
]
const guideStep = computed(() => (!guideName.value.trim() ? 0 : !guideAlerts.value ? 1 : 2))

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
      and a dimming scrim, or, interactive, a ring over the element while the page stays usable.
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

    <ComponentDemo
      title="Interactive, Driven by the Page"
      description="interactive leaves the page usable (no scrim; a ring follows the target as it moves), and v-model:step lets the page decide the step: here, the first thing not done yet, so the tour moves on as you do each one and skips what you did ahead of time. The actions slot swaps the buttons; a step without a target sits on its placement side of the screen."
      :code="`<template>
  <MTextField id=&quot;name&quot; v-model=&quot;name&quot; label=&quot;Name&quot; />
  <MSwitch id=&quot;alerts&quot; v-model=&quot;alerts&quot; label=&quot;Alerts&quot; />
  <MTour v-model=&quot;open&quot; :step=&quot;step&quot; :steps=&quot;steps&quot; interactive>
    <template #actions=&quot;{ isLast, close }&quot;>
      <div class=&quot;flex justify-end&quot;>
        <MButton v-if=&quot;isLast&quot; @click=&quot;close&quot;>Done</MButton>
      </div>
    </template>
  </MTour>
</template>`"
      :script="`const steps = [
  { target: '#name', title: 'Your name', content: 'Type it in.', placement: 'bottom' },
  { target: '#alerts', title: 'Alerts', content: 'Turn them on.', placement: 'bottom' },
  { title: 'All set', content: 'Checked against the page.', placement: 'bottom' },
]
// The first step not done yet
const step = computed(() => (!name.value.trim() ? 0 : !alerts.value ? 1 : 2))`"
    >
      <div class="flex w-full flex-wrap items-center gap-4">
        <MTextField id="tour-guide-name" v-model="guideName" label="Name" class="w-56" />
        <MSwitch id="tour-guide-alerts" v-model="guideAlerts" label="Alerts" />
        <MButton @click="guideOpen = true">Start the guide</MButton>
        <MTour v-model="guideOpen" :step="guideStep" :steps="guideSteps" interactive>
          <template #actions="{ isLast, close }">
            <div class="flex justify-end">
              <MButton v-if="isLast" @click="close">Done</MButton>
            </div>
          </template>
        </MTour>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="tourProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="tourSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="tourEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="tourTypes" />

    <ComponentPager current="MTour" />
  </div>
</template>
