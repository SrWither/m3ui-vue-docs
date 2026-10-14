<script setup lang="ts">
import { computed, ref } from 'vue'
import { MKanban, MChip, MIcon, MAvatar, MButton, MCard } from '@m3ui-vue/m3ui-vue'
import type { KanbanColumn, KanbanCard } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import KanbanIssueTracker from '@/components/demos/KanbanIssueTracker.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const kanbanProps: PropDef[] = [
  { name: 'modelValue', type: 'KanbanColumn[]', description: 'Columns with their cards (v-model). Required' },
  { name: 'emptyText', type: 'string', description: 'Text shown in a column with no cards (defaults to the locale string)' },
]

const kanbanEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'KanbanColumn[]', description: 'Emitted after a card moves, by pointer or keyboard (v-model)' },
  { name: 'cardMove', payload: '{ cardId, fromColumn, toColumn, toIndex }', description: 'Emitted alongside update:modelValue with where the card went. Not emitted when a card is dropped back where it was' },
  { name: 'cardClick', payload: '{ card, columnId }', description: 'Emitted when a card is clicked or Enter is pressed on it. Not emitted at the end of a drag' },
]

const kanbanSlots: SlotDef[] = [
  { name: 'card', scope: '{ card, column, dragging }', description: 'Content of each card. column is the full KanbanColumn; dragging is true while the card is lifted. Buttons, links and inputs inside keep working: they never start a drag or fire cardClick. Add data-kanban-action to any other element (a badge, a span) to give it the same treatment, so a click there can do something else instead of opening the card' },
  { name: 'column-header', scope: '{ column, count }', description: 'Replaces the default header (color dot, title and count)' },
  { name: 'column-footer', scope: '{ column }', description: 'Content below each column\'s cards, e.g. an "Add card" button' },
]

const kanbanTypes: TypeDef[] = [
  {
    name: 'KanbanColumn',
    fields: [
      { name: 'id', type: 'string | number', required: true, description: 'Unique identifier' },
      { name: 'title', type: 'string', required: true, description: 'Column heading, also used in keyboard announcements' },
      { name: 'cards', type: 'KanbanCard[]', required: true, description: 'Cards currently in this column' },
      { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error' | 'success'", description: 'Color of the dot before the title' },
      { name: 'limit', type: 'number', description: 'WIP limit: the count shows as count/limit, tertiary when full and error when exceeded. Cards can still be moved in' },
    ],
  },
  {
    name: 'KanbanCard',
    fields: [
      { name: 'id', type: 'string | number', required: true, description: 'Unique across the whole board' },
      { name: '[key: string]', type: 'any', description: 'Any data your #card slot needs' },
    ],
  },
]

// Basic
const basic = ref<KanbanColumn[]>([
  { id: 'todo', title: 'To do', color: 'primary', cards: [{ id: 1, title: 'Design system tokens' }, { id: 2, title: 'Write unit tests' }, { id: 3, title: 'Plan the release' }] },
  { id: 'doing', title: 'In progress', color: 'tertiary', cards: [{ id: 4, title: 'Build components' }] },
  { id: 'done', title: 'Done', color: 'success', cards: [{ id: 5, title: 'Project setup' }, { id: 6, title: 'CI pipeline' }] },
])

// Project board
const tagTone: Record<string, string> = { Design: 'tertiary', Frontend: 'primary', Backend: 'secondary', Bug: 'error' }
const project = ref<KanbanColumn[]>([
  {
    id: 'backlog', title: 'Backlog', color: 'secondary',
    cards: [
      { id: 'p1', title: 'Dark mode for charts', tags: ['Design', 'Frontend'], due: 'Oct 28', comments: 2, owner: 'Ana Torres' },
      { id: 'p2', title: 'Rate-limit the public API', tags: ['Backend'], due: 'Nov 4', comments: 0, owner: 'Marta Ruiz' },
      { id: 'p3', title: 'Onboarding checklist', tags: ['Design'], due: 'Nov 10', comments: 5, owner: 'Sofía Lima' },
    ],
  },
  {
    id: 'progress', title: 'In progress', color: 'primary',
    cards: [
      { id: 'p4', title: 'Checkout crashes on Safari 17', tags: ['Bug', 'Frontend'], due: 'Today', comments: 8, owner: 'Luis Gómez', urgent: true },
      { id: 'p5', title: 'Invoice PDF export', tags: ['Backend'], due: 'Oct 20', comments: 1, owner: 'Pablo Ortiz' },
    ],
  },
  {
    id: 'review', title: 'In review', color: 'tertiary',
    cards: [{ id: 'p6', title: 'New pricing page', tags: ['Design', 'Frontend'], due: 'Oct 18', comments: 3, owner: 'Carla Vidal' }],
  },
  { id: 'shipped', title: 'Shipped', color: 'success', cards: [{ id: 'p7', title: 'Two-factor login', tags: ['Backend'], due: 'Oct 2', comments: 12, owner: 'Diego Pérez' }] },
])
const openedCard = ref<KanbanCard | null>(null)

// WIP limits
const wip = ref<KanbanColumn[]>([
  { id: 'ready', title: 'Ready', cards: [{ id: 'w1', title: 'Search filters' }, { id: 'w2', title: 'Email digest' }, { id: 'w3', title: 'Audit log' }, { id: 'w4', title: 'SSO' }] },
  { id: 'dev', title: 'Development', limit: 2, cards: [{ id: 'w5', title: 'Billing v2' }, { id: 'w6', title: 'Mobile push' }] },
  { id: 'qa', title: 'QA', limit: 1, cards: [] },
])

// Sales pipeline
const pipeline = ref<KanbanColumn[]>([
  { id: 'lead', title: 'Leads', color: 'secondary', cards: [{ id: 's1', company: 'Northwind', amount: 12000, contact: 'Ana Torres' }, { id: 's2', company: 'Globex', amount: 4500, contact: 'Luis Gómez' }] },
  { id: 'proposal', title: 'Proposal', color: 'tertiary', cards: [{ id: 's3', company: 'Initech', amount: 28000, contact: 'Marta Ruiz' }] },
  { id: 'negotiation', title: 'Negotiation', color: 'primary', cards: [{ id: 's4', company: 'Umbrella', amount: 54000, contact: 'Diego Pérez' }, { id: 's5', company: 'Hooli', amount: 9800, contact: 'Sofía Lima' }] },
  { id: 'won', title: 'Won', color: 'success', cards: [{ id: 's6', company: 'Stark Industries', amount: 76000, contact: 'Pablo Ortiz' }] },
])
const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const stageTotal = (col: KanbanColumn) => col.cards.reduce((sum, c) => sum + (c.amount as number), 0)
const wonTotal = computed(() => stageTotal(pipeline.value.find((c) => c.id === 'won')!))

// Add cards from the footer
let nextIdea = 1
const ideas = ref<KanbanColumn[]>([
  { id: 'now', title: 'Now', color: 'error', cards: [{ id: 'i0', title: 'Fix the login copy' }] },
  { id: 'next', title: 'Next', color: 'primary', cards: [] },
  { id: 'later', title: 'Later', color: 'secondary', cards: [] },
])
const ideaPool = ['Weekly digest email', 'Keyboard shortcuts', 'CSV import', 'Team avatars', 'Offline drafts', 'Usage dashboard']
function addIdea(column: KanbanColumn) {
  const col = ideas.value.find((c) => c.id === column.id)!
  col.cards.push({ id: `i${nextIdea}`, title: ideaPool[nextIdea % ideaPool.length] })
  nextIdea++
}

// Saving moves
const saveLog = ref<string[]>([])
const sync = ref<KanbanColumn[]>([
  { id: 'open', title: 'Open', cards: [{ id: 101, title: 'Order #101' }, { id: 102, title: 'Order #102' }] },
  { id: 'packing', title: 'Packing', cards: [{ id: 103, title: 'Order #103' }] },
  { id: 'sent', title: 'Sent', cards: [] },
])
function onSyncMove(e: { cardId: string | number; fromColumn: string | number; toColumn: string | number; toIndex: number }) {
  saveLog.value = [`PATCH /api/orders/${e.cardId}  {"status":"${e.toColumn}","position":${e.toIndex}}`, ...saveLog.value].slice(0, 4)
}
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MKanban</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A drag-and-drop board. Cards lift and follow the pointer, the others make room, and a dashed slot shows where
      the card will land. Works with a mouse, a finger (long-press a card) and the keyboard; the board scrolls
      sideways on its own when you drag near its edges.
    </p>

    <MCard class="mb-6 flex items-start gap-3 p-4">
      <MIcon name="keyboard" :size="22" class="mt-0.5 shrink-0 text-primary" />
      <p class="text-body-medium text-on-surface">
        <strong>Keyboard:</strong> focus a card and press <kbd>Space</kbd> to pick it up. <kbd>↑</kbd>/<kbd>↓</kbd>
        move it within the column, <kbd>←</kbd>/<kbd>→</kbd> to the neighboring column, <kbd>Space</kbd> drops it and
        <kbd>Esc</kbd> puts it back. <kbd>Enter</kbd> on a card fires <code>cardClick</code>.
      </p>
    </MCard>

    <ComponentDemo
      title="Basic"
      description="v-model the columns. Each card needs an id that's unique across the board; render it with the #card slot."
      :code="`<MKanban v-model=&quot;columns&quot;>
  <template #card=&quot;{ card }&quot;>
    <p class=&quot;text-body-medium&quot;>{{ card.title }}</p>
  </template>
</MKanban>`"
      :script="`const columns = ref([
  { id: 'todo', title: 'To do', color: 'primary', cards: [{ id: 1, title: 'Design system tokens' }] },
  { id: 'doing', title: 'In progress', color: 'tertiary', cards: [{ id: 4, title: 'Build components' }] },
  { id: 'done', title: 'Done', color: 'success', cards: [] },
])`"
    >
      <MKanban v-model="basic" class="w-full">
        <template #card="{ card }">
          <p class="text-body-medium text-on-surface">{{ card.title }}</p>
        </template>
      </MKanban>
    </ComponentDemo>

    <ComponentDemo
      title="Project board"
      description="Richer cards with tags, a due date, comments and the owner. cardClick opens the card (here, a summary below the board). The dragging flag lets a card restyle itself while lifted."
      :code="`<MKanban v-model=&quot;project&quot; @card-click=&quot;({ card }) => (opened = card)&quot;>
  <template #card=&quot;{ card, dragging }&quot;>
    <div class=&quot;flex flex-wrap gap-1.5&quot;>
      <MChip v-for=&quot;tag in card.tags&quot; :key=&quot;tag&quot; :tone=&quot;tagTone[tag]&quot;>{{ tag }}</MChip>
    </div>
    <p class=&quot;mt-2 text-title-small&quot; :class=&quot;dragging &amp;&amp; 'text-primary'&quot;>{{ card.title }}</p>
    <div class=&quot;mt-3 flex items-center gap-3 text-label-medium text-on-surface-variant&quot;>
      <span class=&quot;flex items-center gap-1&quot;><MIcon name=&quot;schedule&quot; :size=&quot;16&quot; />{{ card.due }}</span>
      <span class=&quot;flex items-center gap-1&quot;><MIcon name=&quot;chat_bubble&quot; :size=&quot;16&quot; />{{ card.comments }}</span>
      <MAvatar :name=&quot;card.owner&quot; :size=&quot;24&quot; class=&quot;ml-auto&quot; />
    </div>
  </template>
</MKanban>`"
    >
      <div class="flex w-full flex-col gap-3">
        <MKanban v-model="project" @card-click="({ card }) => (openedCard = card)">
          <template #card="{ card, dragging }">
            <div class="flex flex-wrap gap-1.5">
              <MChip v-for="tag in card.tags" :key="tag" :tone="tagTone[tag]">{{ tag }}</MChip>
            </div>
            <p class="mt-2 text-title-small transition-colors" :class="dragging ? 'text-primary' : 'text-on-surface'">{{ card.title }}</p>
            <div class="mt-3 flex items-center gap-3 text-label-medium text-on-surface-variant">
              <span class="flex items-center gap-1" :class="card.urgent ? 'text-error' : ''">
                <MIcon name="schedule" :size="16" />{{ card.due }}
              </span>
              <span class="flex items-center gap-1"><MIcon name="chat_bubble" :size="16" />{{ card.comments }}</span>
              <MAvatar :name="card.owner" :size="24" class="ml-auto" />
            </div>
          </template>
        </MKanban>
        <p class="text-body-medium text-on-surface-variant">
          <template v-if="openedCard">Opened: <strong class="text-on-surface">{{ openedCard.title }}</strong> · {{ openedCard.owner }} · due {{ openedCard.due }}</template>
          <template v-else>Click a card (or press Enter on it) to open it.</template>
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Issue tracker"
      description="A Jira-style sprint board: issue type, key, priority, story points (difficulty) and assignee on each ticket, with points per column and sprint progress. Clicking a ticket opens an MSideSheet with its details, but its type, priority and story points are small menus that change the value right on the ticket, and clicking the key copies it (a span marked data-kanban-action): none of them open the sheet or start a drag. Changing the status there moves the ticket on the board with the same animation as a drag, and edits to assignee, priority or points show up on the card right away. The filters dim the tickets that don't match instead of hiding them, so dragging keeps working."
      :code="`<MKanban v-model=&quot;board&quot; @card-click=&quot;({ card }) => openIssue(card)&quot;>
  <template #column-header=&quot;{ column, count }&quot;>
    <h4 class=&quot;flex-1 text-label-large uppercase text-on-surface-variant&quot;>{{ column.title }}</h4>
    <span class=&quot;text-label-medium&quot;>{{ count }}</span>
    <span class=&quot;rounded-full bg-surface-container-highest px-2 text-label-small&quot;>{{ points(column) }} pts</span>
  </template>

  <template #card=&quot;{ card, column }&quot;>
    <p class=&quot;line-clamp-2 text-body-medium&quot;>{{ card.title }}</p>
    <div class=&quot;mt-3 flex items-center gap-2&quot;>
      <!-- Buttons inside a card don't open it: this one changes the type in place -->
      <MMenu>
        <template #trigger>
          <button><MIcon :name=&quot;TYPES[card.type].icon&quot; /></button>
        </template>
        <MMenuItem v-for=&quot;t in types&quot; :key=&quot;t&quot; @click=&quot;card.type = t&quot;>{{ TYPES[t].label }}</MMenuItem>
      </MMenu>

      <!-- Any element marked data-kanban-action is ignored by the card too -->
      <span data-kanban-action @click=&quot;copyKey(card)&quot;>{{ card.id }}</span>

      <!-- Priority: same pattern as the type menu -->

      <MMenu align=&quot;right&quot; class=&quot;ml-auto&quot;>
        <template #trigger>
          <button class=&quot;rounded-full bg-surface-container-highest px-1.5&quot;>{{ card.points }}</button>
        </template>
        <MMenuItem v-for=&quot;pt in [1, 2, 3, 5, 8, 13]&quot; :key=&quot;pt&quot; @click=&quot;card.points = pt&quot;>{{ pt }} points</MMenuItem>
      </MMenu>
      <MAvatar :name=&quot;card.assignee&quot; :size=&quot;24&quot; />
    </div>
  </template>
</MKanban>

<MSideSheet v-model=&quot;open&quot; width=&quot;w-[460px]&quot;>
  <h2 class=&quot;text-headline-small&quot;>{{ selected.title }}</h2>
  <div class=&quot;grid grid-cols-2 gap-3&quot;>
    <MSelect v-model=&quot;status&quot; :options=&quot;statusOptions&quot; label=&quot;Status&quot; />
    <MSelect v-model=&quot;selected.assignee&quot; :options=&quot;people&quot; label=&quot;Assignee&quot; />
    <MSelect v-model=&quot;selected.priority&quot; :options=&quot;priorities&quot; label=&quot;Priority&quot; />
    <MSelect v-model=&quot;selected.points&quot; :options=&quot;points&quot; label=&quot;Story points&quot; />
  </div>
  <!-- description, subtasks, details, comments... -->
</MSideSheet>`"
      :script="`// Status select: move the card between columns; MKanban animates it like a drag.
const status = computed({
  get: () => board.value.find((c) => c.cards.includes(selected.value))?.id,
  set: (to) => {
    const from = board.value.find((c) => c.cards.includes(selected.value))
    const target = board.value.find((c) => c.id === to)
    from.cards.splice(from.cards.indexOf(selected.value), 1)
    target.cards.push(selected.value)
  },
})`"
      flush
    >
      <div class="p-4 sm:p-6">
        <KanbanIssueTracker />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="WIP limits"
      description="limit on a column shows the count as count/limit. It turns tertiary when the column is full and error when it goes over, without blocking the move."
      :code="`const columns = ref([
  { id: 'ready', title: 'Ready', cards: [...] },
  { id: 'dev', title: 'Development', limit: 2, cards: [...] },
  { id: 'qa', title: 'QA', limit: 1, cards: [] },
])`"
    >
      <MKanban v-model="wip" class="w-full">
        <template #card="{ card }">
          <p class="text-body-medium text-on-surface">{{ card.title }}</p>
        </template>
      </MKanban>
    </ComponentDemo>

    <ComponentDemo
      title="Sales pipeline"
      description="#column-header replaces the default header: here each stage shows its deal count and total value, which update as deals move."
      :code="`<MKanban v-model=&quot;pipeline&quot;>
  <template #column-header=&quot;{ column, count }&quot;>
    <div class=&quot;min-w-0 flex-1&quot;>
      <h3 class=&quot;text-title-medium&quot;>{{ column.title }}</h3>
      <p class=&quot;text-label-medium text-on-surface-variant&quot;>{{ count }} deals · {{ money(stageTotal(column)) }}</p>
    </div>
  </template>
  <template #card=&quot;{ card }&quot;>
    <div class=&quot;flex items-center gap-3&quot;>
      <MAvatar :name=&quot;card.company&quot; :size=&quot;36&quot; />
      <div class=&quot;min-w-0 flex-1&quot;>
        <p class=&quot;truncate text-title-small&quot;>{{ card.company }}</p>
        <p class=&quot;truncate text-body-small text-on-surface-variant&quot;>{{ card.contact }}</p>
      </div>
      <span class=&quot;text-label-large text-primary&quot;>{{ money(card.amount) }}</span>
    </div>
  </template>
</MKanban>`"
    >
      <div class="flex w-full flex-col gap-3">
        <MKanban v-model="pipeline">
          <template #column-header="{ column, count }">
            <span v-if="column.color" class="h-2.5 w-2.5 shrink-0 rounded-full" :class="{ primary: 'bg-primary', secondary: 'bg-secondary', tertiary: 'bg-tertiary', success: 'bg-success', error: 'bg-error' }[column.color]" />
            <div class="min-w-0 flex-1">
              <h3 class="truncate text-title-medium text-on-surface">{{ column.title }}</h3>
              <p class="text-label-medium text-on-surface-variant">{{ count }} {{ count === 1 ? 'deal' : 'deals' }} · {{ money(stageTotal(column)) }}</p>
            </div>
          </template>
          <template #card="{ card }">
            <div class="flex items-center gap-3">
              <MAvatar :name="card.company" :size="36" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-title-small text-on-surface">{{ card.company }}</p>
                <p class="truncate text-body-small text-on-surface-variant">{{ card.contact }}</p>
              </div>
              <span class="text-label-large text-primary">{{ money(card.amount) }}</span>
            </div>
          </template>
        </MKanban>
        <p class="text-body-medium text-on-surface-variant">Won so far: <strong class="text-on-surface">{{ money(wonTotal) }}</strong></p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Add cards from the footer"
      description="#column-footer sits below each column's cards, a natural spot for an Add button."
      :code="`<MKanban v-model=&quot;ideas&quot;>
  <template #card=&quot;{ card }&quot;>{{ card.title }}</template>
  <template #column-footer=&quot;{ column }&quot;>
    <MButton variant=&quot;text&quot; icon=&quot;add&quot; class=&quot;w-full&quot; @click=&quot;addCard(column)&quot;>Add card</MButton>
  </template>
</MKanban>`"
    >
      <MKanban v-model="ideas" class="w-full">
        <template #card="{ card }">
          <p class="text-body-medium text-on-surface">{{ card.title }}</p>
        </template>
        <template #column-footer="{ column }">
          <MButton variant="text" icon="add" class="w-full" @click="addIdea(column)">Add card</MButton>
        </template>
      </MKanban>
    </ComponentDemo>

    <ComponentDemo
      title="Saving moves"
      description="cardMove tells you which card went where, ready for a request to your API. The log shows what this board would send."
      :code="`<MKanban v-model=&quot;orders&quot; @card-move=&quot;save&quot; />`"
      :script="`function save({ cardId, toColumn, toIndex }) {
  api.patch(\`/api/orders/\${cardId}\`, { status: toColumn, position: toIndex })
}`"
    >
      <div class="grid w-full gap-4 lg:grid-cols-[1fr_minmax(0,320px)]">
        <MKanban v-model="sync" @card-move="onSyncMove">
          <template #card="{ card }">
            <div class="flex items-center gap-2">
              <MIcon name="package_2" :size="20" class="text-on-surface-variant" />
              <span class="text-body-medium text-on-surface">{{ card.title }}</span>
            </div>
          </template>
        </MKanban>
        <div class="flex min-w-0 flex-col gap-2">
          <span class="text-label-medium text-on-surface-variant">Requests</span>
          <div class="min-h-32 rounded-xl bg-surface-container p-3 font-mono text-body-small text-on-surface">
            <p v-for="(line, i) in saveLog" :key="i + line" class="break-all" :class="i ? 'text-on-surface-variant' : ''">{{ line }}</p>
            <p v-if="!saveLog.length" class="text-on-surface-variant">Move an order to see the request.</p>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="kanbanProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="kanbanEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="kanbanSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="kanbanTypes" />

    <ComponentPager current="MKanban" />
  </div>
</template>
