<script setup lang="ts">
import { computed, ref } from 'vue'
import { MDragDropList, MIcon, MCheckbox, MChip, MSwitch, MCard, MButton, MAvatar } from '@m3ui-vue/m3ui-vue'
import type { DragDropItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const dragDropProps: PropDef[] = [
  { name: 'modelValue', type: 'DragDropItem[]', description: 'Array of items with a unique id (v-model)' },
  { name: 'handle', type: 'boolean', default: 'false', description: 'Drag only from a handle button at the start of each row. Touch drags start right away from the handle; without it, a whole row starts dragging after a long press so swipes still scroll the page' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Turns reordering off (pointer and keyboard) and dims the list' },
  { name: 'bare', type: 'boolean', default: 'false', description: 'Removes the row\'s own look (padding, min height, state layers, background) so the slot draws the whole row, e.g. a card per item. Dragging, keyboard support and the lift shadow (which follows your content\'s shape) remain. Add spacing with a gap class on the list. With handle, bind the slot\'s handleProps onto your own grip' },
]

const dragDropEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'DragDropItem[]', description: 'Emitted with the reordered array (v-model)' },
  { name: 'reorder', payload: '{ from: number, to: number, items: DragDropItem[] }', description: 'Emitted alongside update:modelValue with the source and destination indices. Useful for saving the new order to a backend' },
]

const dragDropSlots: SlotDef[] = [
  { name: 'default', scope: '{ item, index, dragging, handleProps }', description: 'Content of each row (or the whole row with bare). Falls back to item.id. Controls inside it (checkboxes, switches, buttons, links) keep working and never start a drag. dragging is true while the row is lifted; handleProps (with handle) goes on your own grip element via v-bind' },
]

const dragDropTypes: TypeDef[] = [
  {
    name: 'DragDropItem',
    fields: [
      { name: 'id', type: 'string | number', required: true, description: 'Unique identifier used as the render key' },
      { name: '[key: string]', type: 'any', description: 'Any extra data your #default slot needs' },
    ],
  },
]

// Basic
const fruits = ref<DragDropItem[]>([
  { id: 1, label: 'Apples', icon: 'nutrition' },
  { id: 2, label: 'Bananas', icon: 'eco' },
  { id: 3, label: 'Cherries', icon: 'favorite' },
  { id: 4, label: 'Grapes', icon: 'grain' },
  { id: 5, label: 'Lemons', icon: 'wb_sunny' },
])

// Task list
const priorityTone: Record<string, string> = { High: 'error', Medium: 'tertiary', Low: 'secondary' }
const tasks = ref<DragDropItem[]>([
  { id: 't1', title: 'Review pull request #212', priority: 'High', done: false },
  { id: 't2', title: 'Write release notes', priority: 'Medium', done: false },
  { id: 't3', title: 'Update the onboarding docs', priority: 'Low', done: true },
  { id: 't4', title: 'Fix flaky checkout test', priority: 'High', done: false },
  { id: 't5', title: 'Plan next sprint', priority: 'Medium', done: false },
])
const openTasks = computed(() => tasks.value.filter((t) => !t.done).length)

// Playlist
const tracks = ref<DragDropItem[]>([
  { id: 's1', title: 'Midnight Drive', artist: 'Neon Coast', seconds: 214, hue: 'bg-primary-container text-on-primary-container' },
  { id: 's2', title: 'Paper Planes', artist: 'Lumen', seconds: 187, hue: 'bg-tertiary-container text-on-tertiary-container' },
  { id: 's3', title: 'Slow Tides', artist: 'Harbor Lights', seconds: 251, hue: 'bg-secondary-container text-on-secondary-container' },
  { id: 's4', title: 'Glasshouse', artist: 'Aria Vale', seconds: 199, hue: 'bg-error-container text-on-error-container' },
  { id: 's5', title: 'Northbound', artist: 'The Fieldnotes', seconds: 232, hue: 'bg-surface-container-highest text-on-surface' },
])
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
const totalTime = computed(() => fmt(tracks.value.reduce((sum, t) => sum + (t.seconds as number), 0)))

// Home sections
const sections = ref<DragDropItem[]>([
  { id: 'news', label: 'Top stories', icon: 'newspaper', visible: true },
  { id: 'weather', label: 'Weather', icon: 'partly_cloudy_day', visible: true },
  { id: 'calendar', label: 'Upcoming events', icon: 'event', visible: false },
  { id: 'stocks', label: 'Markets', icon: 'monitoring', visible: true },
  { id: 'tips', label: 'Tips for you', icon: 'lightbulb', visible: false },
])
const visibleSections = computed(() => sections.value.filter((s) => s.visible))

// Ranking + saving
const languages = ref<DragDropItem[]>([
  { id: 'ts', name: 'TypeScript' },
  { id: 'rs', name: 'Rust' },
  { id: 'py', name: 'Python' },
  { id: 'go', name: 'Go' },
  { id: 'kt', name: 'Kotlin' },
])
const medal = ['bg-[#f4c542] text-black', 'bg-[#c0c4cc] text-black', 'bg-[#cd7f32] text-white']
const saveLog = ref<string[]>([])
function onRankReorder(e: { from: number; to: number; items: DragDropItem[] }) {
  const body = JSON.stringify({ order: e.items.map((i) => i.id) })
  saveLog.value = [`PUT /api/rankings/me  ${body}`, ...saveLog.value].slice(0, 4)
}

// Bare: project cards
const projects = ref<DragDropItem[]>([
  { id: 'p1', title: 'Checkout redesign', desc: 'New payment step and saved cards', tags: ['Design', 'Web'], owner: 'Ana Torres', accent: 'bg-primary' },
  { id: 'p2', title: 'Offline mode', desc: 'Cache orders and sync when back online', tags: ['Android', 'iOS'], owner: 'Luis Gómez', accent: 'bg-tertiary' },
  { id: 'p3', title: 'Billing exports', desc: 'Monthly CSV and PDF invoices', tags: ['Backend'], owner: 'Marta Ruiz', accent: 'bg-secondary' },
  { id: 'p4', title: 'Accessibility audit', desc: 'Keyboard and screen reader pass on every screen', tags: ['A11y', 'Web'], owner: 'Diego Pérez', accent: 'bg-error' },
])

// Bare: pinned chats as pills
const pinned = ref<DragDropItem[]>([
  { id: 'c1', name: 'Design team', unread: 3 },
  { id: 'c2', name: 'Mom', unread: 0 },
  { id: 'c3', name: 'Weekend trip', unread: 12 },
  { id: 'c4', name: 'Book club', unread: 1 },
])

// Disabled
const lockable = ref<DragDropItem[]>([
  { id: 'l1', label: 'Intro' },
  { id: 'l2', label: 'Chapter one' },
  { id: 'l3', label: 'Chapter two' },
])
const locked = ref(false)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MDragDropList</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A reorderable list: v-model the array and render each row with the #default slot. Works with a mouse,
      a finger and the keyboard. The dragged row lifts with M3's dragged-item elevation and the rest slide out
      of its way.
    </p>

    <MCard class="mb-6 flex items-start gap-3 p-4">
      <MIcon name="keyboard" :size="22" class="mt-0.5 shrink-0 text-primary" />
      <p class="text-body-medium text-on-surface">
        <strong>Keyboard:</strong> focus a row (or its handle) and press <kbd>Space</kbd> to pick it up, the
        <kbd>↑</kbd>/<kbd>↓</kbd> arrows to move it, <kbd>Space</kbd> again to drop it, or <kbd>Esc</kbd> to put
        it back. Each step is announced to screen readers. <strong>Touch:</strong> long-press a row to drag it,
        or use <code>handle</code> to drag right away from the grip.
      </p>
    </MCard>

    <ComponentDemo
      title="Basic"
      description="The whole row is draggable. Each item needs a unique id."
      :code="`<MDragDropList v-model=&quot;fruits&quot;>
  <template #default=&quot;{ item }&quot;>
    <div class=&quot;flex items-center gap-4&quot;>
      <MIcon :name=&quot;item.icon&quot; class=&quot;text-on-surface-variant&quot; />
      {{ item.label }}
    </div>
  </template>
</MDragDropList>`"
      :script="`const fruits = ref([
  { id: 1, label: 'Apples', icon: 'nutrition' },
  { id: 2, label: 'Bananas', icon: 'eco' },
  { id: 3, label: 'Cherries', icon: 'favorite' },
])`"
    >
      <MCard variant="outlined" class="mx-auto w-full max-w-sm overflow-visible! py-2">
        <MDragDropList v-model="fruits">
          <template #default="{ item }">
            <div class="flex items-center gap-4">
              <MIcon :name="item.icon" class="text-on-surface-variant" />
              {{ item.label }}
            </div>
          </template>
        </MDragDropList>
      </MCard>
    </ComponentDemo>

    <ComponentDemo
      title="Task list"
      description="Rows can hold their own controls: the checkboxes keep working, and only dragging the rest of the row reorders it."
      :code="`<MDragDropList v-model=&quot;tasks&quot;>
  <template #default=&quot;{ item }&quot;>
    <div class=&quot;flex items-center gap-3&quot;>
      <MCheckbox v-model=&quot;item.done&quot; />
      <span class=&quot;flex-1 truncate&quot; :class=&quot;item.done &amp;&amp; 'text-on-surface-variant line-through'&quot;>{{ item.title }}</span>
      <MChip :tone=&quot;priorityTone[item.priority]&quot;>{{ item.priority }}</MChip>
    </div>
  </template>
</MDragDropList>`"
    >
      <MCard variant="outlined" class="mx-auto w-full max-w-md overflow-visible!">
        <div class="flex items-center justify-between px-4 pt-4 pb-2">
          <span class="text-title-medium text-on-surface">Today</span>
          <span class="text-label-large text-on-surface-variant">{{ openTasks }} open</span>
        </div>
        <MDragDropList v-model="tasks" class="pb-2">
          <template #default="{ item }">
            <div class="flex items-center gap-3">
              <MCheckbox v-model="item.done" />
              <span class="min-w-0 flex-1 truncate" :class="item.done ? 'text-on-surface-variant line-through' : ''">{{ item.title }}</span>
              <MChip :tone="priorityTone[item.priority]">{{ item.priority }}</MChip>
            </div>
          </template>
        </MDragDropList>
      </MCard>
    </ComponentDemo>

    <ComponentDemo
      title="Playlist with a drag handle"
      description="With handle, only the grip starts a drag, so the rest of the row stays free for taps (and touch drags start instantly from the grip). The track numbers come from the slot's index, so they update as you reorder."
      :code="`<MDragDropList v-model=&quot;tracks&quot; handle>
  <template #default=&quot;{ item, index }&quot;>
    <div class=&quot;flex items-center gap-4&quot;>
      <span class=&quot;w-4 text-right text-on-surface-variant&quot;>{{ index + 1 }}</span>
      <div class=&quot;flex h-10 w-10 items-center justify-center rounded-md&quot; :class=&quot;item.hue&quot;>
        <MIcon name=&quot;music_note&quot; />
      </div>
      <div class=&quot;min-w-0 flex-1&quot;>
        <p class=&quot;truncate text-body-large&quot;>{{ item.title }}</p>
        <p class=&quot;truncate text-body-medium text-on-surface-variant&quot;>{{ item.artist }}</p>
      </div>
      <span class=&quot;text-label-large text-on-surface-variant&quot;>{{ fmt(item.seconds) }}</span>
    </div>
  </template>
</MDragDropList>`"
    >
      <MCard variant="outlined" class="mx-auto w-full max-w-md overflow-visible!">
        <div class="flex items-center gap-3 px-4 pt-4 pb-2">
          <MIcon name="queue_music" class="text-primary" />
          <span class="flex-1 text-title-medium text-on-surface">Up next</span>
          <span class="text-label-large text-on-surface-variant">{{ tracks.length }} songs · {{ totalTime }}</span>
        </div>
        <MDragDropList v-model="tracks" handle class="pb-2">
          <template #default="{ item, index }">
            <div class="flex items-center gap-4">
              <span class="w-4 text-right text-label-large text-on-surface-variant">{{ index + 1 }}</span>
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md" :class="item.hue">
                <MIcon name="music_note" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-body-large text-on-surface">{{ item.title }}</p>
                <p class="truncate text-body-medium text-on-surface-variant">{{ item.artist }}</p>
              </div>
              <span class="text-label-large text-on-surface-variant">{{ fmt(item.seconds) }}</span>
            </div>
          </template>
        </MDragDropList>
      </MCard>
    </ComponentDemo>

    <ComponentDemo
      title="Customize the home screen"
      description="A settings-style list: reorder sections and toggle them on or off, with a live preview of the result. The switches work normally inside draggable rows."
      :code="`<MDragDropList v-model=&quot;sections&quot;>
  <template #default=&quot;{ item }&quot;>
    <div class=&quot;flex items-center gap-4&quot;>
      <MIcon :name=&quot;item.icon&quot; class=&quot;text-on-surface-variant&quot; />
      <span class=&quot;flex-1&quot;>{{ item.label }}</span>
      <MSwitch v-model=&quot;item.visible&quot; :icon=&quot;false&quot; />
    </div>
  </template>
</MDragDropList>

<!-- preview -->
<div v-for=&quot;s in sections.filter((s) => s.visible)&quot; :key=&quot;s.id&quot;>...</div>`"
    >
      <div class="grid w-full gap-6 md:grid-cols-[1fr_220px]">
        <MCard variant="outlined" class="overflow-visible! py-2">
          <MDragDropList v-model="sections">
            <template #default="{ item }">
              <div class="flex items-center gap-4">
                <MIcon :name="item.icon" class="text-on-surface-variant" />
                <span class="min-w-0 flex-1 truncate" :class="item.visible ? '' : 'text-on-surface-variant'">{{ item.label }}</span>
                <MSwitch v-model="item.visible" :icon="false" />
              </div>
            </template>
          </MDragDropList>
        </MCard>
        <div class="flex flex-col gap-2 rounded-xl bg-surface-container p-3">
          <span class="px-1 text-label-medium text-on-surface-variant">Preview</span>
          <TransitionGroup name="dd-preview" tag="div" class="flex flex-col gap-2">
            <div
              v-for="s in visibleSections"
              :key="s.id"
              class="flex items-center gap-2 rounded-lg bg-surface-container-high px-3 py-3 text-label-large text-on-surface"
            >
              <MIcon :name="s.icon" :size="18" class="text-primary" />
              {{ s.label }}
            </div>
          </TransitionGroup>
          <p v-if="!visibleSections.length" class="px-1 py-6 text-center text-body-small text-on-surface-variant">Nothing to show</p>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Ranking, saved on every change"
      description="Rank items by position. The reorder event carries the new order, ready to send to your backend; the log shows the request this demo would make."
      :code="`<MDragDropList v-model=&quot;languages&quot; @reorder=&quot;save&quot;>
  <template #default=&quot;{ item, index }&quot;>
    <div class=&quot;flex items-center gap-4&quot;>
      <span class=&quot;flex h-8 w-8 items-center justify-center rounded-full&quot; :class=&quot;medal[index] ?? 'bg-surface-container-high'&quot;>
        {{ index + 1 }}
      </span>
      {{ item.name }}
    </div>
  </template>
</MDragDropList>`"
      :script="`function save({ items }) {
  api.put('/api/rankings/me', { order: items.map((i) => i.id) })
}`"
    >
      <div class="grid w-full gap-6 md:grid-cols-2">
        <MCard variant="outlined" class="overflow-visible! py-2">
          <MDragDropList v-model="languages" @reorder="onRankReorder">
            <template #default="{ item, index }">
              <div class="flex items-center gap-4">
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-label-large font-medium"
                  :class="medal[index] ?? 'bg-surface-container-high text-on-surface-variant'"
                >
                  {{ index + 1 }}
                </span>
                <span :class="index === 0 ? 'font-medium' : ''">{{ item.name }}</span>
                <MIcon v-if="index === 0" name="emoji_events" :size="20" class="ml-auto text-[#d4a72c]" />
              </div>
            </template>
          </MDragDropList>
        </MCard>
        <div class="flex min-w-0 flex-col gap-2">
          <span class="text-label-medium text-on-surface-variant">Requests</span>
          <div class="min-h-32 rounded-xl bg-surface-container p-3 font-mono text-body-small text-on-surface">
            <p v-for="(line, i) in saveLog" :key="i + line" class="break-all" :class="i ? 'text-on-surface-variant' : ''">{{ line }}</p>
            <p v-if="!saveLog.length" class="text-on-surface-variant">Reorder the list to see what gets saved.</p>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom content with bare"
      description="bare removes the row's own padding, height and state layers so the slot draws the whole item, here one card per project with a gap between them. The grip lives inside the card: with handle, spread the slot's handleProps onto any element. dragging lets the card restyle itself while lifted, and the lift shadow follows the card's own rounded shape."
      :code="`<MDragDropList v-model=&quot;projects&quot; bare handle class=&quot;gap-3&quot;>
  <template #default=&quot;{ item, dragging, handleProps }&quot;>
    <div
      class=&quot;flex overflow-hidden rounded-xl bg-surface-container-low transition-[box-shadow,transform] duration-150&quot;
      :class=&quot;dragging &amp;&amp; 'rotate-1 ring-2 ring-primary'&quot;
    >
      <div class=&quot;w-1.5&quot; :class=&quot;item.accent&quot; />
      <div class=&quot;flex-1 p-4&quot;>
        <div class=&quot;flex items-start gap-2&quot;>
          <p class=&quot;flex-1 text-title-medium&quot;>{{ item.title }}</p>
          <span v-bind=&quot;handleProps&quot; class=&quot;rounded-full p-1 text-on-surface-variant hover:bg-on-surface/8&quot;>
            <MIcon name=&quot;drag_indicator&quot; />
          </span>
        </div>
        <p class=&quot;text-body-medium text-on-surface-variant&quot;>{{ item.desc }}</p>
        <div class=&quot;mt-3 flex items-center gap-2&quot;>
          <MChip v-for=&quot;tag in item.tags&quot; :key=&quot;tag&quot;>{{ tag }}</MChip>
          <MAvatar :name=&quot;item.owner&quot; :size=&quot;28&quot; class=&quot;ml-auto&quot; />
        </div>
      </div>
    </div>
  </template>
</MDragDropList>`"
    >
      <MDragDropList v-model="projects" bare handle class="mx-auto w-full max-w-md gap-3">
        <template #default="{ item, dragging, handleProps }">
          <div
            class="flex overflow-hidden rounded-xl bg-surface-container-low transition-[box-shadow,transform] duration-150"
            :class="dragging ? 'rotate-1 ring-2 ring-primary' : ''"
          >
            <div class="w-1.5 shrink-0" :class="item.accent" />
            <div class="min-w-0 flex-1 p-4">
              <div class="flex items-start gap-2">
                <p class="min-w-0 flex-1 text-title-medium text-on-surface">{{ item.title }}</p>
                <span
                  v-bind="handleProps"
                  class="-mt-1 -mr-1 flex rounded-full p-1 text-on-surface-variant outline-none hover:bg-on-surface/8 focus-visible:ring-2 focus-visible:ring-secondary"
                >
                  <MIcon name="drag_indicator" />
                </span>
              </div>
              <p class="mt-0.5 text-body-medium text-on-surface-variant">{{ item.desc }}</p>
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <MChip v-for="tag in item.tags" :key="tag">{{ tag }}</MChip>
                <MAvatar :name="item.owner" :size="28" class="ml-auto" />
              </div>
            </div>
          </div>
        </template>
      </MDragDropList>
    </ComponentDemo>

    <ComponentDemo
      title="Pills"
      description="bare without handle: the whole pill is draggable (long-press on touch). Any shape works, the lift shadow wraps the pill itself."
      :code="`<MDragDropList v-model=&quot;pinned&quot; bare class=&quot;gap-2&quot;>
  <template #default=&quot;{ item, dragging }&quot;>
    <div
      class=&quot;flex items-center gap-3 rounded-full py-2 pr-4 pl-2&quot;
      :class=&quot;dragging ? 'bg-secondary-container' : 'bg-surface-container-high'&quot;
    >
      <MAvatar :name=&quot;item.name&quot; :size=&quot;32&quot; />
      <span class=&quot;flex-1&quot;>{{ item.name }}</span>
      <span v-if=&quot;item.unread&quot; class=&quot;rounded-full bg-primary px-2 text-label-small text-on-primary&quot;>{{ item.unread }}</span>
    </div>
  </template>
</MDragDropList>`"
    >
      <MDragDropList v-model="pinned" bare class="mx-auto w-full max-w-xs gap-2">
        <template #default="{ item, dragging }">
          <div
            class="flex items-center gap-3 rounded-full py-2 pr-4 pl-2 transition-colors duration-150"
            :class="dragging ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface'"
          >
            <MAvatar :name="item.name" :size="32" />
            <span class="min-w-0 flex-1 truncate text-label-large">{{ item.name }}</span>
            <span v-if="item.unread" class="rounded-full bg-primary px-2 py-0.5 text-label-small text-on-primary">{{ item.unread }}</span>
          </div>
        </template>
      </MDragDropList>
    </ComponentDemo>

    <ComponentDemo
      title="Disabled"
      description="disabled turns off dragging and keyboard reordering, e.g. while a save is in flight or for users without permission."
      :code="`<MSwitch v-model=&quot;locked&quot; label=&quot;Lock order&quot; />
<MDragDropList v-model=&quot;chapters&quot; :disabled=&quot;locked&quot; handle />`"
    >
      <div class="mx-auto flex w-full max-w-sm flex-col gap-3">
        <MSwitch v-model="locked" label="Lock order" />
        <MCard variant="outlined" class="overflow-visible! py-2">
          <MDragDropList v-model="lockable" :disabled="locked" handle>
            <template #default="{ item }">{{ item.label }}</template>
          </MDragDropList>
        </MCard>
        <MButton variant="text" icon="restart_alt" class="self-start" @click="lockable = [...lockable].sort((a, b) => String(a.id).localeCompare(String(b.id)))">
          Reset order
        </MButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="dragDropProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="dragDropEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="dragDropSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="dragDropTypes" />

    <ComponentPager current="MDragDropList" />
  </div>
</template>

<style scoped>
.dd-preview-move {
  transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1);
}
.dd-preview-enter-active,
.dd-preview-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dd-preview-enter-from,
.dd-preview-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
.dd-preview-leave-active {
  position: absolute;
}
</style>
