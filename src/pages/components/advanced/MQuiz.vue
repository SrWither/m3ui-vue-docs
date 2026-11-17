<script setup lang="ts">
import { ref } from 'vue'
import { MQuiz, MCard, MButton } from '@m3ui-vue/m3ui-vue'
import type { QuizQuestion, QuizResult } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const questions: QuizQuestion[] = [
  { id: 'ref', prompt: 'Which function makes a primitive value reactive in Vue 3?', options: ['reactive()', 'ref()', 'computed()', 'watch()'], answer: 1, explanation: 'reactive() only takes objects; ref() wraps any value in an object with .value.' },
  { id: 'hooks', type: 'multiple', prompt: 'Which of these are lifecycle hooks?', options: ['onMounted', 'onClicked', 'onUnmounted', 'onUpdated'], answer: [0, 2, 3], points: 2 },
  { id: 'sfc', type: 'truefalse', prompt: 'A single-file component can have two script blocks.', answer: true, explanation: 'A plain script block next to script setup is how you export types or run module code once.' },
  { id: 'order', type: 'order', prompt: 'Order these from first to last in a component’s life', options: ['setup()', 'onBeforeMount', 'onMounted', 'onBeforeUnmount'] },
  { id: 'directive', type: 'text', prompt: 'Which directive renders an element once per item of a list? (without the v-)', answer: ['for', 'v-for'], explanation: 'v-for="item in items", always with a :key.' },
]
const last = ref<QuizResult | null>(null)
const examStarted = ref(false)

const safety: QuizQuestion[] = [
  { id: 1, prompt: 'A coworker is bleeding heavily. First thing to do?', options: ['Give them water', 'Apply firm pressure on the wound', 'Lift them to a chair'], answer: 1 },
  { id: 2, type: 'truefalse', prompt: 'You should use the elevator during a fire evacuation.', answer: false },
  { id: 3, prompt: 'Where is the assembly point?', options: ['Parking lot B', 'Main lobby', 'Rooftop'], answer: 0 },
]

const props: PropDef[] = [
  { name: 'questions', type: 'QuizQuestion[]', description: 'Required. { id, type?: single | multiple | truefalse | order | text, prompt, image?, options?, answer?, explanation?, points? }' },
  { name: 'feedback', type: "'immediate' | 'end'", default: "'immediate'", description: 'Check each answer on the spot, or reveal everything in the results' },
  { name: 'shuffle', type: 'boolean', default: 'false', description: 'Shuffles the questions on every attempt' },
  { name: 'shuffleOptions', type: 'boolean', default: 'false', description: 'Shuffles the options of choice questions' },
  { name: 'passScore', type: 'number', description: 'Percent needed to pass; without it there is no pass / fail' },
  { name: 'timeLimit', type: 'number', description: 'Seconds for the whole quiz; it ends when they run out' },
  { name: 'review', type: 'boolean', default: 'true', description: 'Lists each question with the given and the right answer in the results' },
  { name: 'allowRetry', type: 'boolean', default: 'true', description: 'Offers to try again' },
]

const slots: SlotDef[] = [
  { name: 'result', description: 'Replaces the results screen', scope: '{ result, retry }' },
]

const events: EventDef[] = [
  { name: 'answer', payload: '{ id, value, correct }', description: 'A question was answered' },
  { name: 'finish', payload: 'QuizResult', description: '{ score, total, percent, passed, answers } when the quiz ends' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MQuiz</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A quiz for a course, an onboarding or a training, one question at a time: single and multiple choice, true/false,
      putting items in order, and typed answers that ignore case, accents and extra spaces. Questions can weigh more
      points and carry an explanation. The results show the score, pass / fail and a review of every answer.
    </p>

    <ComponentDemo
      title="Course quiz with instant feedback"
      description="Every question type, a 2-point question and a 70% pass mark."
      :code="`<MQuiz :questions=&quot;questions&quot; :pass-score=&quot;70&quot; @finish=&quot;save&quot; />`"
      :script="`const questions: QuizQuestion[] = [
  { id: 'ref', prompt: 'Which function makes a primitive value reactive?', options: ['reactive()', 'ref()', …], answer: 1, explanation: '…' },
  { id: 'hooks', type: 'multiple', prompt: 'Which are lifecycle hooks?', options: [...], answer: [0, 2, 3], points: 2 },
  { id: 'sfc', type: 'truefalse', prompt: '…', answer: true },
  { id: 'order', type: 'order', prompt: 'Order these…', options: ['setup()', 'onBeforeMount', 'onMounted', 'onBeforeUnmount'] },
  { id: 'directive', type: 'text', prompt: '…', answer: ['for', 'v-for'] },
]`"
    >
      <div class="flex w-full flex-col items-center gap-3">
        <MCard variant="outlined" class="w-full max-w-xl p-5">
          <MQuiz :questions="questions" :pass-score="70" @finish="(r) => (last = r)" />
        </MCard>
        <p v-if="last" class="font-mono text-body-small text-on-surface-variant">finish → score {{ last.score }}/{{ last.total }} · {{ last.percent }}% · passed {{ last.passed }}</p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Timed exam, answers at the end"
      description="feedback=&quot;end&quot; moves on without revealing anything; a 60-second limit ends the quiz on its own. The timer starts when the quiz mounts, so mount it when the exam begins."
      :code="`<MQuiz v-if=&quot;started&quot; :questions=&quot;questions&quot; feedback=&quot;end&quot; :time-limit=&quot;60&quot; :pass-score=&quot;100&quot; shuffle-options />
<MButton v-else @click=&quot;started = true&quot;>Start exam</MButton>`"
    >
      <MCard variant="outlined" class="mx-auto w-full max-w-xl p-5">
        <MQuiz v-if="examStarted" :questions="safety" feedback="end" :time-limit="60" :pass-score="100" shuffle-options />
        <div v-else class="flex flex-col items-center gap-3 py-6 text-center">
          <p class="text-title-medium">Workplace safety · 3 questions · 1 minute</p>
          <MButton icon="timer" @click="examStarted = true">Start exam</MButton>
        </div>
      </MCard>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <ComponentPager current="MQuiz" />
  </div>
</template>
