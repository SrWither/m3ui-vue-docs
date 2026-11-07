<script setup lang="ts">
/*
 * The tutorial, as an interactive MTour: each step of the lesson (lessons.ts) rings what it's about (the part to
 * add in the palette, the part to wire on the canvas, the bar's button) while the page stays usable, and the card
 * follows it as the canvas moves. Every step is checked against the circuit all the time, so the tour stands on the
 * first one not done yet: what you did ahead of time is skipped, and deleting a part brings back the step that
 * asked for it. Steps marked `latch` (flipping a switch) stay done once done. `did` carries what happens outside
 * the canvas (the truth table); `hidden` puts the tour away while a dialog is over the page.
 */
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { MButton, MIcon, MTour, type TourStep } from '@m3ui-vue/m3ui-vue'
import { lessons, type LessonContext, type Step } from '../lessons'
import { useCircuit } from '../useCircuit'

const props = defineProps<{ did: Set<string>; hidden?: boolean }>()
const emit = defineEmits<{ close: [] }>()
const c = useCircuit()
const lessonIndex = ref(0)
const lesson = computed(() => lessons[lessonIndex.value]!)
const ctx = computed<LessonContext>(() => {
  c.version.value
  return { nodes: c.nodes.value, edges: c.edges.value, sim: c.sim, did: props.did }
})

/** Latched steps, by lesson and index */
const latched = reactive(new Set<string>())
const key = (i: number) => `${lesson.value.id}:${i}`
const states = computed(() => lesson.value.steps.map((s, i) => latched.has(key(i)) || s.done(ctx.value)))
watch(states, (st) => st.forEach((d, i) => d && lesson.value.steps[i]!.latch && latched.add(key(i))), { immediate: true })
/** The first step not done (the steps' count when the lesson is) */
const reached = computed(() => {
  const i = states.value.indexOf(false)
  return i < 0 ? lesson.value.steps.length : i
})

// The step on show trails `reached`: moving on, the done step ticks for a moment first; going back is at once
const shown = ref(reached.value)
const ticked = ref(false)
let timer = 0
watch(reached, (r) => {
  if (r > shown.value) {
    if (ticked.value) return
    ticked.value = true
    timer = window.setTimeout(() => {
      ticked.value = false
      shown.value = reached.value
    }, 700)
  } else if (r < shown.value) {
    clearTimeout(timer)
    ticked.value = false
    shown.value = r
  }
})
onBeforeUnmount(() => clearTimeout(timer))
const finished = computed(() => shown.value >= lesson.value.steps.length)

/** The first of a step's targets that's on the page */
function targetOf(s: Step) {
  for (const sel of s.target?.(ctx.value) ?? []) {
    const el = document.querySelector(sel)
    if (el?.getClientRects().length) return el
  }
  return null
}
const tourSteps = computed<TourStep[]>(() => [
  ...lesson.value.steps.map((s) => ({ title: s.text, content: s.hint ?? '', target: () => targetOf(s), placement: s.placement })),
  // The lesson's end, at the bottom of the screen
  { title: 'Done!', content: lesson.value.outro, placement: 'bottom' as const },
])
const step = computed(() => lesson.value.steps[shown.value])

function skip() {
  latched.add(key(shown.value))
}
function next() {
  if (lessonIndex.value + 1 < lessons.length) {
    lessonIndex.value++
    clearTimeout(timer)
    ticked.value = false
    shown.value = reached.value
  } else emit('close')
}
</script>

<template>
  <MTour
    :model-value="!props.hidden"
    :steps="tourSteps"
    :step="shown"
    interactive
    @update:model-value="(v) => !v && emit('close')"
  >
    <template #indicator>
      <span class="flex min-w-0 items-center gap-1.5 text-label-medium text-tertiary">
        <MIcon name="school" :size="16" />
        <span class="truncate">{{ lesson.title }} · lesson {{ lessonIndex + 1 }} of {{ lessons.length }}</span>
      </span>
    </template>

    <template #content>
      <div aria-live="polite">
        <div v-if="!finished && step" :key="`${lessonIndex}-${shown}`" class="tutorial-step flex gap-3 pt-1 pb-3">
          <span
            class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-label-medium transition-colors duration-200"
            :class="ticked ? 'bg-primary text-on-primary' : 'bg-secondary-container text-on-secondary-container'"
          >
            <MIcon v-if="ticked" name="check" :size="16" />
            <template v-else>{{ shown + 1 }}</template>
          </span>
          <div class="min-w-0">
            <p class="text-body-large text-on-surface">{{ step.text }}</p>
            <p v-if="step.hint" class="mt-1 text-body-small text-on-surface-variant">{{ step.hint }}</p>
          </div>
        </div>
        <div v-else :key="`${lessonIndex}-done`" class="tutorial-step pt-1 pb-3">
          <p class="flex items-center gap-2 text-title-medium text-primary"><MIcon name="celebration" :size="20" />Done!</p>
          <p class="mt-1 text-body-medium text-on-surface-variant">{{ lesson.outro }}</p>
        </div>
      </div>
    </template>

    <template #progress>
      <div class="mb-3 flex gap-1" aria-hidden="true">
        <span
          v-for="(d, i) in states"
          :key="i"
          class="h-1 flex-1 rounded-full transition-colors duration-300"
          :class="d && (i !== shown || ticked || finished) ? 'bg-primary' : i === shown ? 'bg-primary/35' : 'bg-on-surface/10'"
        />
      </div>
    </template>

    <template #actions>
      <div class="flex justify-end gap-2">
        <MButton v-if="!finished" variant="text" size="sm" :disabled="ticked" @click="skip">Skip step</MButton>
        <MButton v-else size="sm" :icon="lessonIndex + 1 < lessons.length ? 'arrow_forward' : 'check'" @click="next">
          {{ lessonIndex + 1 < lessons.length ? 'Next lesson' : 'Finish' }}
        </MButton>
      </div>
    </template>
  </MTour>
</template>

<style scoped>
.tutorial-step { animation: tutorial-step-in 260ms cubic-bezier(0.2, 0, 0, 1); }
@keyframes tutorial-step-in {
  from { opacity: 0; transform: translateX(12px); }
}
@media (prefers-reduced-motion: reduce) {
  .tutorial-step { animation: none; }
}
</style>
