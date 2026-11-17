<script setup lang="ts">
import { ref } from 'vue'
import { MOrderTicket, MButton, MChip } from '@m3ui-vue/m3ui-vue'
import type { OrderItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

interface Order {
  number: number
  title: string
  icon: string
  createdAt: number
  items: OrderItem[]
  note?: string
  done: (string | number)[]
}

const minutesAgo = (m: number) => Date.now() - m * 60_000

const orders = ref<Order[]>([
  {
    number: 41,
    title: 'Table 3',
    icon: 'restaurant',
    createdAt: minutesAgo(23),
    items: [
      { id: 1, name: 'Ribeye steak', quantity: 2, modifiers: ['Medium rare', { label: 'Chimichurri', kind: 'add' }] },
      { id: 2, name: 'Mashed potatoes', quantity: 2 },
    ],
    done: [2],
  },
  {
    number: 42,
    title: 'Takeaway · Ana',
    icon: 'takeout_dining',
    createdAt: minutesAgo(12),
    items: [
      { id: 1, name: 'Margherita pizza', modifiers: [{ label: 'Onion', kind: 'remove' }, { label: 'Extra cheese', kind: 'add' }] },
      { id: 2, name: 'Fries', quantity: 3, note: 'Well done' },
      { id: 3, name: 'Lemonade', quantity: 2 },
    ],
    done: [],
  },
  {
    number: 43,
    title: 'Table 7',
    icon: 'restaurant',
    createdAt: minutesAgo(2),
    items: [
      { id: 1, name: 'Caesar salad', modifiers: [{ label: 'Croutons', kind: 'remove' }] },
      { id: 2, name: 'Mushroom risotto', note: 'Allergy: nuts' },
    ],
    note: 'Birthday: bring the dessert with a candle',
    done: [],
  },
])
const log = ref('')

function bump(o: Order) {
  log.value = `PATCH /api/orders/${o.number} { status: "ready" }`
  orders.value = orders.value.filter((x) => x !== o)
}

const single = ref<(string | number)[]>([])
const singleItems: OrderItem[] = [
  { id: 'a', name: 'Cheeseburger', quantity: 2, modifiers: [{ label: 'Pickles', kind: 'remove' }, 'No bun: lettuce wrap'] },
  { id: 'b', name: 'Onion rings' },
]
const created = minutesAgo(4)

const props: PropDef[] = [
  { name: 'number', type: 'string | number', description: 'Required. Order number shown big in the header' },
  { name: 'title', type: 'string', description: 'Where it goes, e.g. "Table 7" or "Takeaway · Ana"' },
  { name: 'icon', type: 'string', description: 'Material Symbol before the title' },
  { name: 'createdAt', type: 'Date | string | number', description: 'Required. When the order came in; drives the timer' },
  { name: 'finishedAt', type: 'Date | string | number', description: 'When it was finished: freezes the timer' },
  { name: 'items', type: 'OrderItem[]', description: 'Required. { id, name, quantity?, modifiers?, note? }; a modifier is a string or { label, kind: add | remove | info }' },
  { name: 'done', type: '(string | number)[]', default: '[]', description: 'Ids of the lines done (v-model:done)' },
  { name: 'note', type: 'string', description: 'A note for the whole order' },
  { name: 'warnAfter', type: 'number', default: '10', description: 'Minutes after which the header turns to the warning color' },
  { name: 'lateAfter', type: 'number', default: '20', description: 'Minutes after which the header turns to the error color' },
  { name: 'readonly', type: 'boolean', default: 'false', description: "Lines can't be ticked" },
]

const slots: SlotDef[] = [
  { name: 'header', description: 'Extra content under the title (chips with the waiter, the channel…)' },
  { name: 'item', description: "Replaces a line's content (the tappable row stays)", scope: '{ item, done }' },
  { name: 'actions', description: 'Content at the bottom, e.g. a bump button', scope: '{ allDone, elapsed }' },
]

const events: EventDef[] = [
  { name: 'update:done', payload: '(string | number)[]', description: 'Ids of the lines marked done' },
  { name: 'complete', payload: '—', description: 'The last line was marked done' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MOrderTicket</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A kitchen ticket for a kitchen display or an order queue: the order number, where it goes, how long it has been
      waiting (the header turns amber, then red, as it ages) and its lines with quantities, modifiers and notes. Tapping
      a line crosses it out; when every line is done, <code>complete</code> fires. Every ticket on the page shares one
      clock, so a screen full of them costs a single timer.
    </p>

    <ComponentDemo
      title="Kitchen display"
      description="Three orders of different ages: 2, 12 and 23 minutes. Tap lines to cross them out; Bump is enabled once every line of a ticket is done."
      :code="`<div class=&quot;grid gap-4 sm:grid-cols-3&quot;>
  <MOrderTicket
    v-for=&quot;o in orders&quot;
    :key=&quot;o.number&quot;
    v-model:done=&quot;o.done&quot;
    :number=&quot;o.number&quot;
    :title=&quot;o.title&quot;
    :icon=&quot;o.icon&quot;
    :created-at=&quot;o.createdAt&quot;
    :items=&quot;o.items&quot;
    :note=&quot;o.note&quot;
  >
    <template #actions=&quot;{ allDone }&quot;>
      <MButton class=&quot;w-full&quot; icon=&quot;done_all&quot; :disabled=&quot;!allDone&quot; @click=&quot;bump(o)&quot;>Bump</MButton>
    </template>
  </MOrderTicket>
</div>`"
      :script="`const orders = ref([
  {
    number: 42,
    title: 'Takeaway · Ana',
    icon: 'takeout_dining',
    createdAt: '2026-11-17T20:31:00Z',
    items: [
      { id: 1, name: 'Margherita pizza', modifiers: [{ label: 'Onion', kind: 'remove' }, { label: 'Extra cheese', kind: 'add' }] },
      { id: 2, name: 'Fries', quantity: 3, note: 'Well done' },
    ],
    done: [],
  },
  …
])`"
    >
      <div class="flex w-full flex-col gap-3">
        <div class="grid items-start gap-4 sm:grid-cols-3">
          <MOrderTicket
            v-for="o in orders"
            :key="o.number"
            v-model:done="o.done"
            :number="o.number"
            :title="o.title"
            :icon="o.icon"
            :created-at="o.createdAt"
            :items="o.items"
            :note="o.note"
          >
            <template #actions="{ allDone }">
              <MButton class="w-full" icon="done_all" :disabled="!allDone" @click="bump(o)">Bump</MButton>
            </template>
          </MOrderTicket>
        </div>
        <p v-if="!orders.length" class="text-center text-body-large text-on-surface-variant">All caught up</p>
        <p v-if="log" class="font-mono text-body-small text-on-surface-variant">{{ log }}</p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Header content and a frozen timer"
      description="The header slot adds chips under the title. finishedAt stops the clock (the icon becomes a check) for a ticket in a &quot;served&quot; column; readonly keeps its lines from being ticked."
      :code="`<MOrderTicket v-model:done=&quot;done&quot; :number=&quot;17&quot; title=&quot;Delivery&quot; icon=&quot;two_wheeler&quot; :created-at=&quot;created&quot; :items=&quot;items&quot;>
  <template #header>
    <div class=&quot;mt-1 flex gap-1&quot;><MChip>Waiter: Leo</MChip></div>
  </template>
</MOrderTicket>

<MOrderTicket :number=&quot;16&quot; title=&quot;Table 2&quot; :created-at=&quot;created&quot; :finished-at=&quot;served&quot; :items=&quot;items&quot; readonly />`"
    >
      <div class="grid w-full items-start gap-4 sm:grid-cols-2">
        <MOrderTicket v-model:done="single" :number="17" title="Delivery" icon="two_wheeler" :created-at="created" :items="singleItems">
          <template #header>
            <div class="mt-1 flex gap-1"><MChip>Waiter: Leo</MChip></div>
          </template>
        </MOrderTicket>
        <MOrderTicket
          :number="16"
          title="Table 2"
          icon="restaurant"
          :created-at="created - 900_000"
          :finished-at="created - 900_000 + 734_000"
          :items="singleItems"
          :done="['a', 'b']"
          readonly
        />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <ComponentPager current="MOrderTicket" />
  </div>
</template>
