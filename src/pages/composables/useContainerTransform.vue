<script setup lang="ts">
import { MContainerTransform, MCard, MIcon, MIconButton, MAvatar, MButton, MList, MListItem, useContainerTransform } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const albums = [
  { title: 'Night Drive', artist: 'Lumen', icon: 'nightlight', tone: 'bg-primary-container text-on-primary-container' },
  { title: 'Tidal', artist: 'Okeano', icon: 'waves', tone: 'bg-secondary-container text-on-secondary-container' },
  { title: 'Ember', artist: 'Kiln', icon: 'local_fire_department', tone: 'bg-tertiary-container text-on-tertiary-container' },
]
const album = useContainerTransform<(typeof albums)[number]>()

// Contacts: a round avatar grows into a contact card
const people = [
  { name: 'Ana Díaz', role: 'Designer', phone: '+54 11 5555 0101', mail: 'ana@example.com' },
  { name: 'Leo Park', role: 'Engineer', phone: '+82 2 555 0102', mail: 'leo@example.com' },
  { name: 'Mia Rossi', role: 'Product', phone: '+39 06 555 0103', mail: 'mia@example.com' },
  { name: 'Tom Okafor', role: 'Research', phone: '+234 1 555 0104', mail: 'tom@example.com' },
]
const contact = useContainerTransform<(typeof people)[number]>()

// A month of plans: a day grows into its agenda
interface Plan { time: string; title: string; icon: string }
const plans: Record<number, Plan[]> = {
  3: [{ time: '09:00', title: 'Dentist', icon: 'medical_services' }],
  8: [{ time: '13:00', title: 'Lunch with Ana', icon: 'restaurant' }, { time: '19:30', title: 'Climbing', icon: 'fitness_center' }],
  14: [{ time: '21:00', title: 'Aurora Live', icon: 'music_note' }],
  19: [{ time: '10:00', title: 'Design review', icon: 'groups' }, { time: '16:00', title: 'Call with Leo', icon: 'call' }, { time: '20:00', title: 'Book club', icon: 'menu_book' }],
  27: [{ time: '08:30', title: 'Flight to Lisbon', icon: 'flight' }],
}
const days = Array.from({ length: 30 }, (_, i) => i + 1)
// November 2026, weeks starting on Monday
const offset = (new Date(2026, 10, 1).getDay() + 6) % 7
const weekday = (d: number) => new Date(2026, 10, d).toLocaleDateString('en-US', { weekday: 'long' })
const day = useContainerTransform<number>()

const types: TypeDef[] = [
  {
    name: 'useContainerTransform<T>()',
    description: 'A controller for MContainerTransform, for elements that live apart from the expanded view. Pass it as :controller',
    fields: [
      { name: 'open(origin?, item?)', type: '(origin?: Event | Element | ComponentPublicInstance, item?: T) => void', required: true, description: 'Opens from origin: a click (its element), an element or a component, which grows into the expanded view; item is handed to the expanded slot' },
      { name: 'close()', type: '() => void', required: true, description: 'Shrinks the expanded view back into the element it opened from' },
      { name: 'isOpen', type: 'Ref<boolean>', required: true, description: 'Whether the expanded view is open (or opening)' },
      { name: 'item', type: 'Ref<T | undefined>', required: true, description: 'What open() was given' },
      { name: 'source', type: 'ShallowRef<HTMLElement | null>', required: true, description: 'The element it grows from and shrinks back into' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useContainerTransform</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The controller behind MContainerTransform, for when the elements that open the expanded view live apart from it:
      a grid or list of cards in one component, a single detail view in another. Each element opens it with its own
      click and item; the expanded view grows from that element and shrinks back into it.
    </p>

    <ComponentDemo
      title="Many Elements, One Detail"
      description="open($event, item) grows the clicked element; the controller can live in a store or be passed down."
      :code="`<script setup>
const album = useContainerTransform()
</script>

<template>
  <MCard v-for=&quot;a in albums&quot; clickable @click=&quot;album.open($event, a)&quot;>…</MCard>
  <MContainerTransform :controller=&quot;album&quot;>
    <template #expanded=&quot;{ item, close }&quot;>…</template>
  </MContainerTransform>
</template>`"
    >
      <div class="flex flex-wrap gap-3">
        <MCard v-for="a in albums" :key="a.title" clickable variant="filled" class="w-36 overflow-hidden rounded-2xl p-0" @click="album.open($event, a)">
          <div class="flex aspect-square items-center justify-center" :class="a.tone"><MIcon :name="a.icon" :size="48" /></div>
          <p class="px-3 pt-2 text-title-small">{{ a.title }}</p>
          <p class="px-3 pb-3 text-body-small text-on-surface-variant">{{ a.artist }}</p>
        </MCard>
      </div>
      <MContainerTransform :controller="album" :label="album.item.value?.title">
        <template #expanded="{ item, close }">
          <template v-if="item">
            <div class="p-2"><MIconButton icon="arrow_back" label="Back" @click="close" /></div>
            <div class="mx-auto flex max-w-md flex-col items-center gap-4 p-6 text-center">
              <div class="flex aspect-square w-64 items-center justify-center rounded-3xl" :class="item.tone"><MIcon :name="item.icon" :size="96" /></div>
              <p class="text-headline-medium">{{ item.title }}</p>
              <p class="text-title-medium text-on-surface-variant">{{ item.artist }}</p>
            </div>
          </template>
        </template>
      </MContainerTransform>
    </ComponentDemo>

    <ComponentDemo
      title="Contacts to a Card"
      description="A round avatar grows into a centered contact card (mode=&quot;dialog&quot;): the corners go from a circle to the panel's, and the page stays around it."
      :code="`<button v-for=&quot;p in people&quot; class=&quot;rounded-full&quot; @click=&quot;contact.open($event, p)&quot;>
  <MAvatar :name=&quot;p.name&quot; :size=&quot;56&quot; />
</button>
<MContainerTransform :controller=&quot;contact&quot; mode=&quot;dialog&quot; max-width=&quot;360px&quot;>…</MContainerTransform>`"
    >
      <div class="flex flex-wrap gap-4">
        <button
          v-for="p in people"
          :key="p.name"
          type="button"
          class="flex cursor-pointer flex-col items-center gap-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          :aria-label="p.name"
          @click="contact.open($event, p)"
        >
          <MAvatar :name="p.name" :size="56" />
        </button>
      </div>
      <MContainerTransform :controller="contact" mode="dialog" max-width="360px" :label="contact.item.value?.name">
        <template #expanded="{ item, close }">
          <div v-if="item" class="flex flex-col items-center gap-2 p-6 text-center">
            <MAvatar :name="item.name" :size="96" />
            <p class="mt-2 text-headline-small">{{ item.name }}</p>
            <p class="text-body-medium text-on-surface-variant">{{ item.role }}</p>
            <MList class="mt-2 w-full text-left">
              <MListItem icon="call" :title="item.phone" subtitle="Mobile" />
              <MListItem icon="mail" :title="item.mail" subtitle="Work" />
            </MList>
            <div class="mt-2 flex gap-2">
              <MButton variant="tonal" icon="chat" @click="close">Message</MButton>
              <MButton icon="call" @click="close">Call</MButton>
            </div>
          </div>
        </template>
      </MContainerTransform>
    </ComponentDemo>

    <ComponentDemo
      title="A Month of Plans"
      description="Every day of a calendar opens the same agenda panel with its own plans: the tiny cell grows into the day."
      :code="`<button v-for=&quot;d in days&quot; @click=&quot;day.open($event, d)&quot;>{{ d }}</button>
<MContainerTransform :controller=&quot;day&quot; mode=&quot;dialog&quot; max-width=&quot;400px&quot;>
  <template #expanded=&quot;{ item }&quot;>…plans[item]…</template>
</MContainerTransform>`"
    >
      <div class="w-full max-w-sm">
        <p class="mb-3 text-title-medium">November</p>
        <div class="grid grid-cols-7 gap-1.5">
          <span v-for="(w, wi) in ['M', 'T', 'W', 'T', 'F', 'S', 'S']" :key="`h-${wi}`" class="text-center text-label-small text-on-surface-variant">{{ w }}</span>
          <span v-for="n in offset" :key="`pad-${n}`" />
          <button
            v-for="d in days"
            :key="d"
            type="button"
            class="relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl text-body-medium transition-colors focus-visible:outline-2 focus-visible:outline-secondary"
            :class="plans[d] ? 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'"
            :aria-label="`November ${d}${plans[d] ? `, ${plans[d]!.length} plans` : ''}`"
            @click="day.open($event, d)"
          >
            {{ d }}
            <span v-if="plans[d]" class="absolute bottom-1 flex gap-0.5">
              <span v-for="(_, i) in plans[d]" :key="i" class="h-1 w-1 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </div>
      <MContainerTransform :controller="day" mode="dialog" max-width="400px" :label="`November ${day.item.value}`">
        <template #expanded="{ item, close }">
          <div v-if="item" class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-label-large text-on-surface-variant">{{ weekday(item) }}</p>
                <p class="text-headline-medium">November {{ item }}</p>
              </div>
              <MIconButton icon="close" label="Close" @click="close" />
            </div>
            <MList v-if="plans[item]" class="mt-4">
              <MListItem v-for="p in plans[item]" :key="p.title" :icon="p.icon" :title="p.title" :subtitle="p.time" />
            </MList>
            <div v-else class="mt-6 flex flex-col items-center gap-2 py-6 text-on-surface-variant">
              <MIcon name="event_available" :size="40" />
              <p class="text-body-large">Nothing planned</p>
            </div>
            <MButton class="mt-4 w-full" variant="tonal" icon="add" @click="close">Add a plan</MButton>
          </div>
        </template>
      </MContainerTransform>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <ComponentPager current="useContainerTransform" />
  </div>
</template>
