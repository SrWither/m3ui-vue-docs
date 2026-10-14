<script setup lang="ts">
// Jira-style issue tracker built on MKanban + MSideSheet, for the MKanban docs page.
import { computed, ref } from 'vue'
import {
  MKanban,
  MSideSheet,
  MSelect,
  MChip,
  MIcon,
  MAvatar,
  MButton,
  MCheckbox,
  MDivider,
  MTextField,
  MMenu,
  MMenuItem,
} from '@m3ui-vue/m3ui-vue'
import type { KanbanColumn, KanbanCard } from '@m3ui-vue/m3ui-vue'

type IssueType = 'story' | 'bug' | 'task' | 'improvement'
type Priority = 'highest' | 'high' | 'medium' | 'low'

const TYPES: Record<IssueType, { icon: string; cls: string; label: string }> = {
  story: { icon: 'bookmark', cls: 'bg-success text-on-success', label: 'Feature' },
  bug: { icon: 'bug_report', cls: 'bg-error text-on-error', label: 'Bug' },
  task: { icon: 'check', cls: 'bg-primary text-on-primary', label: 'Task' },
  improvement: { icon: 'arrow_upward', cls: 'bg-tertiary text-on-tertiary', label: 'Improvement' },
}
const PRIORITIES: Record<Priority, { icon: string; cls: string; label: string }> = {
  highest: { icon: 'keyboard_double_arrow_up', cls: 'text-error', label: 'Highest' },
  high: { icon: 'keyboard_arrow_up', cls: 'text-error', label: 'High' },
  medium: { icon: 'drag_handle', cls: 'text-tertiary', label: 'Medium' },
  low: { icon: 'keyboard_arrow_down', cls: 'text-primary', label: 'Low' },
}
const POINTS = [1, 2, 3, 5, 8, 13]
const PEOPLE = ['Ana Torres', 'Luis Gómez', 'Marta Ruiz', 'Diego Pérez', 'Sofía Lima']
const ME = 'Luis Gómez'

let seq = 100
function issue(
  type: IssueType,
  title: string,
  priority: Priority,
  points: number,
  assignee: string | null,
  extra: Partial<KanbanCard> = {},
): KanbanCard {
  seq++
  return {
    id: `M3-${seq}`,
    type,
    title,
    priority,
    points,
    assignee,
    reporter: 'Sofía Lima',
    labels: [] as string[],
    description: '',
    subtasks: [] as { title: string; done: boolean }[],
    comments: [] as { author: string; text: string; when: string }[],
    created: 'Oct 6',
    ...extra,
  }
}

const board = ref<KanbanColumn[]>([
  {
    id: 'todo',
    title: 'To do',
    cards: [
      issue('story', 'Saved payment methods at checkout', 'high', 8, 'Ana Torres', {
        labels: ['checkout', 'payments'],
        description: 'Let signed-in customers save a card during checkout and pick it next time, instead of typing it again.',
        subtasks: [
          { title: 'Design the saved-cards list', done: true },
          { title: 'Tokenize cards with the payment provider', done: false },
          { title: 'Add "remove card" to account settings', done: false },
        ],
        comments: [{ author: 'Marta Ruiz', text: 'Provider supports network tokens, so we never store the PAN.', when: '2d' }],
      }),
      issue('task', 'Upgrade to Vue 3.6', 'medium', 3, null, { labels: ['tech-debt'], description: 'Bump Vue and fix the deprecation warnings in the build.' }),
      issue('bug', 'Date picker shows the wrong week start in es-ES', 'low', 2, 'Diego Pérez', {
        labels: ['i18n'],
        description: 'With the Spanish locale the calendar still starts on Sunday; it should start on Monday.',
      }),
    ],
  },
  {
    id: 'progress',
    title: 'In progress',
    cards: [
      issue('bug', 'Checkout crashes on Safari 17', 'highest', 5, ME, {
        labels: ['checkout', 'safari'],
        description: 'Pressing "Pay" on Safari 17 throws in the address step and the page goes blank. Reproducible on macOS and iOS.',
        subtasks: [
          { title: 'Reproduce on BrowserStack', done: true },
          { title: 'Find the failing polyfill', done: true },
          { title: 'Ship the fix behind a flag', done: false },
        ],
        comments: [
          { author: 'Ana Torres', text: 'Seeing it on iOS 17.4 too.', when: '5h' },
          { author: ME, text: 'Looks like structuredClone on a Proxy. On it.', when: '3h' },
        ],
      }),
      issue('story', 'Order history filters', 'medium', 5, 'Marta Ruiz', { labels: ['account'], description: 'Filter past orders by date range and status.' }),
    ],
  },
  {
    id: 'review',
    title: 'In review',
    cards: [
      issue('task', 'Rate-limit the public API', 'high', 3, ME, { labels: ['api', 'security'], description: '100 requests per minute per key, with a Retry-After header.' }),
    ],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      issue('story', 'Two-factor login', 'high', 8, 'Sofía Lima', { labels: ['security'], description: 'TOTP apps and recovery codes.' }),
      issue('bug', 'Invoice totals off by one cent', 'medium', 1, 'Marta Ruiz', { labels: ['billing'] }),
    ],
  },
])

// ---- Toolbar filters (dim non-matching cards instead of removing them, so dragging stays simple)
const query = ref('')
const onlyMine = ref(false)
const people = ref<string[]>([])
function togglePerson(name: string) {
  people.value = people.value.includes(name) ? people.value.filter((p) => p !== name) : [...people.value, name]
}
function clearFilters() {
  query.value = ''
  onlyMine.value = false
  people.value = []
}
const filtering = computed(() => !!query.value || onlyMine.value || people.value.length > 0)
function matches(card: KanbanCard) {
  const q = query.value.trim().toLowerCase()
  if (q && !`${card.id} ${card.title}`.toLowerCase().includes(q)) return false
  if (onlyMine.value && card.assignee !== ME) return false
  if (people.value.length && !people.value.includes(card.assignee)) return false
  return true
}

// ---- Sprint progress
const allCards = computed(() => board.value.flatMap((c) => c.cards))
const totalPoints = computed(() => allCards.value.reduce((s, c) => s + c.points, 0))
const donePoints = computed(() => board.value.find((c) => c.id === 'done')!.cards.reduce((s, c) => s + c.points, 0))
const columnPoints = (col: KanbanColumn) => col.cards.reduce((s, c) => s + c.points, 0)

// ---- Side sheet
const open = ref(false)
const selectedId = ref<string | number | null>(null)
const selected = computed(() => allCards.value.find((c) => c.id === selectedId.value) ?? null)
function openIssue({ card }: { card: KanbanCard }) {
  selectedId.value = card.id
  open.value = true
}

const statusOptions = computed(() => board.value.map((c) => ({ label: c.title, value: c.id })))
const assigneeOptions = [{ label: 'Unassigned', value: null }, ...PEOPLE.map((p) => ({ label: p, value: p }))]
const priorityOptions = (Object.keys(PRIORITIES) as Priority[]).map((p) => ({ label: PRIORITIES[p].label, value: p }))
const typeOptions = (Object.keys(TYPES) as IssueType[]).map((t) => ({ label: TYPES[t].label, value: t }))
const pointOptions = POINTS.map((p) => ({ label: `${p} point${p === 1 ? '' : 's'}`, value: p }))

const status = computed({
  get: () => board.value.find((c) => c.cards.some((x) => x.id === selectedId.value))?.id,
  // Moving the card from the sheet: MKanban animates the change like any other reorder.
  set: (to) => {
    const from = board.value.find((c) => c.cards.some((x) => x.id === selectedId.value))
    const target = board.value.find((c) => c.id === to)
    if (!from || !target || from === target) return
    const i = from.cards.findIndex((x) => x.id === selectedId.value)
    const [card] = from.cards.splice(i, 1)
    target.cards.push(card!)
  },
})

const subtaskProgress = computed(() => {
  const list = selected.value?.subtasks ?? []
  return list.length ? Math.round((list.filter((s: { done: boolean }) => s.done).length / list.length) * 100) : 0
})

// Copy the issue key from the card itself (a data-kanban-action area: no side sheet, no drag)
const copiedId = ref<string | number | null>(null)
async function copyKey(card: KanbanCard) {
  try {
    await navigator.clipboard?.writeText(String(card.id))
  } catch {
    /* clipboard may be blocked; the feedback still shows */
  }
  copiedId.value = card.id
  setTimeout(() => copiedId.value === card.id && (copiedId.value = null), 1200)
}

const newComment = ref('')
function addComment() {
  if (!selected.value || !newComment.value.trim()) return
  selected.value.comments.push({ author: ME, text: newComment.value.trim(), when: 'now' })
  newComment.value = ''
}
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <!-- Sprint header -->
    <div class="flex flex-wrap items-end gap-x-6 gap-y-3">
      <div class="min-w-0">
        <p class="text-label-medium text-on-surface-variant">M3 Store · Sprint 14</p>
        <h3 class="text-title-large text-on-surface">Checkout reliability</h3>
      </div>
      <div class="flex min-w-48 flex-1 flex-col gap-1">
        <div class="flex justify-between text-label-medium text-on-surface-variant">
          <span>{{ donePoints }} of {{ totalPoints }} points done</span>
          <span>{{ totalPoints ? Math.round((donePoints / totalPoints) * 100) : 0 }}%</span>
        </div>
        <div class="h-1.5 overflow-hidden rounded-full bg-surface-container-highest">
          <div class="h-full rounded-full bg-primary transition-[width] duration-500" :style="{ width: `${totalPoints ? (donePoints / totalPoints) * 100 : 0}%` }" />
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex h-10 w-56 items-center gap-2 rounded-full bg-surface-container-high px-3 focus-within:ring-2 focus-within:ring-secondary">
        <MIcon name="search" :size="20" class="text-on-surface-variant" />
        <input v-model="query" placeholder="Search issues" class="min-w-0 flex-1 bg-transparent text-body-medium text-on-surface outline-none placeholder:text-on-surface-variant" />
      </div>
      <div class="flex -space-x-1.5">
        <button
          v-for="p in PEOPLE"
          :key="p"
          type="button"
          class="rounded-full ring-2 transition-transform hover:z-10 hover:-translate-y-0.5"
          :class="people.includes(p) ? 'z-10 ring-primary' : 'ring-surface'"
          :title="p"
          @click="togglePerson(p)"
        >
          <MAvatar :name="p" :size="32" />
        </button>
      </div>
      <MChip :selected="onlyMine" clickable icon="person" @click="onlyMine = !onlyMine">Only my issues</MChip>
      <MButton v-if="filtering" variant="text" @click="clearFilters">Clear filters</MButton>
    </div>

    <!-- Board -->
    <MKanban v-model="board" @card-click="openIssue">
      <template #column-header="{ column, count }">
        <h4 class="min-w-0 flex-1 truncate text-label-large tracking-wide text-on-surface-variant uppercase">{{ column.title }}</h4>
        <span class="text-label-medium text-on-surface-variant">{{ count }}</span>
        <span class="rounded-full bg-surface-container-highest px-2 py-0.5 text-label-small text-on-surface-variant" title="Story points">
          {{ columnPoints(column) }} pts
        </span>
      </template>

      <template #card="{ card, column }">
        <div class="transition-opacity duration-200" :class="filtering && !matches(card) ? 'opacity-30' : ''">
          <p class="line-clamp-2 text-body-medium text-on-surface">{{ card.title }}</p>
          <div v-if="card.labels.length" class="mt-2 flex flex-wrap gap-1">
            <span v-for="l in card.labels" :key="l" class="rounded-sm bg-surface-container-highest px-1.5 py-0.5 text-label-small text-on-surface-variant">{{ l }}</span>
          </div>
          <div class="mt-3 flex items-center gap-1">
            <!--
              These open their own menus instead of the side sheet: buttons inside a card never
              fire cardClick or start a drag.
            -->
            <MMenu>
              <template #trigger>
                <button type="button" class="flex h-7 w-7 items-center justify-center rounded-full hover:bg-on-surface/8" :title="`Type: ${TYPES[card.type as IssueType].label}`">
                  <span class="flex h-4.5 w-4.5 items-center justify-center rounded-xs" :class="TYPES[card.type as IssueType].cls">
                    <MIcon :name="TYPES[card.type as IssueType].icon" :size="14" />
                  </span>
                </button>
              </template>
              <MMenuItem v-for="t in (Object.keys(TYPES) as IssueType[])" :key="t" :icon="TYPES[t].icon" @click="card.type = t">
                {{ TYPES[t].label }}
              </MMenuItem>
            </MMenu>

            <!-- A plain span marked data-kanban-action: copies the key instead of opening the issue -->
            <span
              data-kanban-action
              class="cursor-copy rounded-xs px-1 text-label-medium text-on-surface-variant hover:bg-on-surface/8"
              :class="column.id === 'done' ? 'line-through' : ''"
              title="Copy key"
              @click="copyKey(card)"
            >{{ copiedId === card.id ? 'Copied!' : card.id }}</span>

            <MMenu>
              <template #trigger>
                <button type="button" class="flex h-7 w-7 items-center justify-center rounded-full hover:bg-on-surface/8" :title="`${PRIORITIES[card.priority as Priority].label} priority`">
                  <MIcon :name="PRIORITIES[card.priority as Priority].icon" :size="18" :class="PRIORITIES[card.priority as Priority].cls" />
                </button>
              </template>
              <MMenuItem v-for="p in (Object.keys(PRIORITIES) as Priority[])" :key="p" :icon="PRIORITIES[p].icon" @click="card.priority = p">
                {{ PRIORITIES[p].label }}
              </MMenuItem>
            </MMenu>

            <span class="flex-1" />

            <MMenu align="right">
              <template #trigger>
                <button
                  type="button"
                  class="flex h-6 min-w-6 items-center justify-center rounded-full bg-surface-container-highest px-1.5 text-label-small text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container"
                  title="Story points (difficulty)"
                >
                  {{ card.points }}
                </button>
              </template>
              <MMenuItem v-for="pt in POINTS" :key="pt" :icon="pt === card.points ? 'check' : undefined" @click="card.points = pt">
                {{ pt }} {{ pt === 1 ? 'point' : 'points' }}
              </MMenuItem>
            </MMenu>
            <MAvatar v-if="card.assignee" :name="card.assignee" :size="24" />
            <span v-else class="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-outline text-on-surface-variant" title="Unassigned">
              <MIcon name="person" :size="14" />
            </span>
          </div>
        </div>
      </template>
    </MKanban>

    <!-- Issue details -->
    <MSideSheet v-model="open" width="w-[460px]">
      <template #header>
        <div v-if="selected" class="flex min-w-0 items-center gap-2">
          <span class="flex h-5 w-5 items-center justify-center rounded-xs" :class="TYPES[selected.type as IssueType].cls">
            <MIcon :name="TYPES[selected.type as IssueType].icon" :size="16" />
          </span>
          <span class="text-label-large text-on-surface-variant">{{ selected.id }}</span>
        </div>
      </template>

      <div v-if="selected" class="flex flex-col gap-6">
        <h2 class="text-headline-small text-on-surface">{{ selected.title }}</h2>

        <div class="grid grid-cols-2 gap-3">
          <MSelect v-model="status" :options="statusOptions" label="Status" variant="outlined" />
          <MSelect v-model="selected.type" :options="typeOptions" label="Type" variant="outlined" />
          <MSelect v-model="selected.assignee" :options="assigneeOptions" label="Assignee" variant="outlined" />
          <MSelect v-model="selected.priority" :options="priorityOptions" label="Priority" variant="outlined" />
          <MSelect v-model="selected.points" :options="pointOptions" label="Story points" variant="outlined" class="col-span-2" />
        </div>

        <section>
          <h3 class="mb-2 text-title-small text-on-surface">Description</h3>
          <p v-if="selected.description" class="text-body-medium text-on-surface-variant">{{ selected.description }}</p>
          <p v-else class="text-body-medium text-on-surface-variant italic">No description yet.</p>
        </section>

        <section v-if="selected.subtasks.length">
          <div class="mb-2 flex items-center justify-between">
            <h3 class="text-title-small text-on-surface">Subtasks</h3>
            <span class="text-label-medium text-on-surface-variant">{{ subtaskProgress }}% done</span>
          </div>
          <div class="mb-3 h-1 overflow-hidden rounded-full bg-surface-container-highest">
            <div class="h-full rounded-full bg-success transition-[width] duration-300" :style="{ width: `${subtaskProgress}%` }" />
          </div>
          <div class="flex flex-col gap-3">
            <MCheckbox v-for="(s, i) in selected.subtasks" :key="i" v-model="s.done">
              <span :class="s.done ? 'text-on-surface-variant line-through' : ''">{{ s.title }}</span>
            </MCheckbox>
          </div>
        </section>

        <section>
          <h3 class="mb-3 text-title-small text-on-surface">Details</h3>
          <dl class="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-3 text-body-medium">
            <dt class="text-on-surface-variant">Reporter</dt>
            <dd class="flex items-center gap-2 text-on-surface"><MAvatar :name="selected.reporter" :size="24" />{{ selected.reporter }}</dd>
            <dt class="text-on-surface-variant">Labels</dt>
            <dd class="flex flex-wrap gap-1">
              <MChip v-for="l in selected.labels" :key="l">{{ l }}</MChip>
              <span v-if="!selected.labels.length" class="text-on-surface-variant">None</span>
            </dd>
            <dt class="text-on-surface-variant">Sprint</dt>
            <dd class="text-on-surface">Sprint 14</dd>
            <dt class="text-on-surface-variant">Created</dt>
            <dd class="text-on-surface">{{ selected.created }}</dd>
          </dl>
        </section>

        <MDivider />

        <section>
          <h3 class="mb-3 text-title-small text-on-surface">Activity</h3>
          <div class="flex flex-col gap-4">
            <div v-for="(c, i) in selected.comments" :key="i" class="flex gap-3">
              <MAvatar :name="c.author" :size="32" />
              <div class="min-w-0 flex-1">
                <p class="text-label-large text-on-surface">{{ c.author }} <span class="font-normal text-on-surface-variant">· {{ c.when }}</span></p>
                <p class="text-body-medium text-on-surface-variant">{{ c.text }}</p>
              </div>
            </div>
            <p v-if="!selected.comments.length" class="text-body-medium text-on-surface-variant">No comments yet.</p>
            <div class="flex items-start gap-3">
              <MAvatar :name="ME" :size="32" />
              <div class="flex min-w-0 flex-1 flex-col items-end gap-2">
                <MTextField v-model="newComment" label="Add a comment" multiline :rows="2" variant="outlined" class="w-full" />
                <MButton :disabled="!newComment.trim()" @click="addComment">Comment</MButton>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MSideSheet>
  </div>
</template>
