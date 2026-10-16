<script setup lang="ts">
import { ref } from 'vue'
import { MSwipeToDismiss, MList, MListItem, MIcon, MButton } from '@m3ui-vue/m3ui-vue'
import type { SwipeToDismissValue } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

interface Mail { id: number; from: string; subject: string }
const allMail: Mail[] = [
  { id: 1, from: 'Ana Ruiz', subject: 'Slides for Thursday' },
  { id: 2, from: 'Build bot', subject: 'Pipeline #4821 passed' },
  { id: 3, from: 'Leo Park', subject: 'Lunch next week?' },
  { id: 4, from: 'Calendar', subject: 'Design review moved to 3 PM' },
]
const mail = ref<Mail[]>([...allMail])
const log = ref<string[]>([])

function onDismiss(item: Mail, direction: 'start-to-end' | 'end-to-start') {
  log.value.unshift(`${direction === 'start-to-end' ? 'Archived' : 'Deleted'} “${item.subject}”`)
  mail.value = mail.value.filter((m) => m.id !== item.id)
}
function resetMail() {
  mail.value = [...allMail]
  log.value = []
}

// Undo: swiping marks as done, the row comes back on its own
interface Task { id: number; title: string; done: boolean; state: SwipeToDismissValue }
const tasks = ref<Task[]>([
  { id: 1, title: 'Water the plants', done: false, state: 'settled' },
  { id: 2, title: 'Book the dentist', done: false, state: 'settled' },
  { id: 3, title: 'Renew passport', done: true, state: 'settled' },
])
function onTaskSwiped(task: Task) {
  task.done = !task.done
  task.state = 'settled'
}

const swipeProps: PropDef[] = [
  { name: 'modelValue', type: "'settled' | 'start-to-end' | 'end-to-start'", default: "'settled'", description: 'State (v-model). It stays dismissed until you set it back to settled, which animates it back' },
  { name: 'startToEnd', type: 'boolean', default: 'true', description: 'Allow swiping in the reading direction (right in left-to-right languages)' },
  { name: 'endToStart', type: 'boolean', default: 'true', description: 'Allow swiping against the reading direction (left in left-to-right languages)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Turns the swipe gesture off' },
  { name: 'threshold', type: 'number', default: '56', description: 'How far, in px, the content has to move before releasing dismisses it (a quick flick dismisses sooner)' },
]

const swipeEvents: EventDef[] = [
  { name: 'update:modelValue', payload: "'settled' | 'start-to-end' | 'end-to-start'", description: 'Emitted when it settles in a new state' },
  { name: 'dismiss', payload: "'start-to-end' | 'end-to-start'", description: 'Emitted when the content is swiped away' },
]

const swipeSlots: SlotDef[] = [
  { name: 'default', description: 'The content that moves. Give it a background so it covers what is behind' },
  { name: '#background', description: 'What the swipe uncovers. Receives { direction, target, progress }: the side being swiped, the state it would settle in if released now, and how far it has moved (0 to 1)' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSwipeToDismiss</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Content you can swipe left or right to dismiss, uncovering a background behind it, like the archive and
      delete actions behind a message. Swipe past the threshold or flick it to dismiss; anything less springs back.
      Vertical scrolling keeps working on touch screens. Once swiped away it stays there, so you decide what
      happens next: remove the item, or bring it back by setting v-model to settled.
    </p>

    <ComponentDemo
      title="Archive and Delete"
      description="Swipe right to archive, left to delete. The background changes color once letting go would dismiss."
      :code="`<template>
  <MList>
    <MSwipeToDismiss v-for=&quot;item in mail&quot; :key=&quot;item.id&quot; @dismiss=&quot;onDismiss(item, $event)&quot;>
      <template #background=&quot;{ direction, target }&quot;>
        <div
          class=&quot;flex w-full items-center px-6 transition-colors&quot;
          :class=&quot;[
            direction === 'end-to-start' ? 'justify-end' : 'justify-start',
            target === 'start-to-end' ? 'bg-tertiary-container text-on-tertiary-container'
              : target === 'end-to-start' ? 'bg-error-container text-on-error-container'
              : 'bg-surface-container-highest text-on-surface-variant',
          ]&quot;
        >
          <MIcon :name=&quot;direction === 'end-to-start' ? 'delete' : 'archive'&quot; />
        </div>
      </template>
      <div class=&quot;bg-surface&quot;>
        <MListItem :title=&quot;item.from&quot; :subtitle=&quot;item.subject&quot; :avatar-name=&quot;item.from&quot; />
      </div>
    </MSwipeToDismiss>
  </MList>
</template>`"
      :script="`const mail = ref([
  { id: 1, from: 'Ana Ruiz', subject: 'Slides for Thursday' },
  // ...
])

function onDismiss(item, direction) {
  // archive or delete it on the server, then:
  mail.value = mail.value.filter((m) => m.id !== item.id)
}`"
    >
      <div class="grid w-full gap-4 md:grid-cols-[1fr_16rem]">
        <div class="overflow-hidden rounded-xl border border-outline-variant">
          <MList class="py-0!">
            <MSwipeToDismiss v-for="item in mail" :key="item.id" @dismiss="onDismiss(item, $event)">
              <template #background="{ direction, target }">
                <div
                  class="flex w-full items-center px-6 transition-colors"
                  :class="[
                    direction === 'end-to-start' ? 'justify-end' : 'justify-start',
                    target === 'start-to-end' ? 'bg-tertiary-container text-on-tertiary-container'
                    : target === 'end-to-start' ? 'bg-error-container text-on-error-container'
                      : 'bg-surface-container-highest text-on-surface-variant',
                  ]"
                >
                  <MIcon :name="direction === 'end-to-start' ? 'delete' : 'archive'" />
                </div>
              </template>
              <div class="bg-surface">
                <MListItem :title="item.from" :subtitle="item.subject" :avatar-name="item.from" />
              </div>
            </MSwipeToDismiss>
          </MList>
          <div v-if="!mail.length" class="flex flex-col items-center gap-3 p-8 text-body-medium text-on-surface-variant">
            Inbox zero.
            <MButton variant="tonal" @click="resetMail">Bring them back</MButton>
          </div>
        </div>
        <div class="rounded-xl bg-surface-container p-3 font-mono text-body-small text-on-surface-variant">
          <p v-if="!log.length">Swipe a message…</p>
          <p v-for="(line, i) in log" :key="i">{{ line }}</p>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Swipe to Toggle"
      description="Reset v-model when it's dismissed and the row slides back: here a swipe either way marks a task done or not done."
      :code="`<template>
  <MSwipeToDismiss v-for=&quot;task in tasks&quot; :key=&quot;task.id&quot; v-model=&quot;task.state&quot; @dismiss=&quot;onTaskSwiped(task)&quot;>
    <template #background>
      <div class=&quot;flex w-full items-center justify-between bg-primary-container px-6 text-on-primary-container&quot;>
        <MIcon :name=&quot;task.done ? 'undo' : 'check'&quot; />
        <MIcon :name=&quot;task.done ? 'undo' : 'check'&quot; />
      </div>
    </template>
    <div class=&quot;bg-surface&quot;>
      <MListItem :title=&quot;task.title&quot; :icon=&quot;task.done ? 'task_alt' : 'radio_button_unchecked'&quot; />
    </div>
  </MSwipeToDismiss>
</template>`"
      :script="`function onTaskSwiped(task) {
  task.done = !task.done
  task.state = 'settled' // slides back
}`"
    >
      <div class="w-full max-w-md overflow-hidden rounded-xl border border-outline-variant">
        <MList class="py-0!">
          <MSwipeToDismiss v-for="task in tasks" :key="task.id" v-model="task.state" @dismiss="onTaskSwiped(task)">
            <template #background>
              <div class="flex w-full items-center justify-between bg-primary-container px-6 text-on-primary-container">
                <MIcon :name="task.done ? 'undo' : 'check'" />
                <MIcon :name="task.done ? 'undo' : 'check'" />
              </div>
            </template>
            <div class="bg-surface">
              <MListItem
                :title="task.title"
                :icon="task.done ? 'task_alt' : 'radio_button_unchecked'"
                :class="task.done ? 'line-through opacity-60' : ''"
              />
            </div>
          </MSwipeToDismiss>
        </MList>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="swipeProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="swipeEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="swipeSlots" />

    <ComponentPager current="MSwipeToDismiss" />
  </div>
</template>
