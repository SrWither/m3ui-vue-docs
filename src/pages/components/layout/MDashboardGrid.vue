<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MCard, MDashboardGrid, MIcon, MSparkline, MSwitch } from '@m3ui-vue/m3ui-vue'
import type { DashboardItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import DashboardHomeScreen from '@/components/demos/DashboardHomeScreen.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

type Widget = DashboardItem & { label: string; icon: string; value: string; trend: number[]; color: string }
const initial: Widget[] = [
  { id: 'sales', label: 'Sales', icon: 'payments', value: '$48.2k', x: 0, y: 0, w: 6, h: 2, color: 'primary', trend: [12, 18, 15, 22, 28, 26, 34, 31, 40] },
  { id: 'visitors', label: 'Visitors', icon: 'group', value: '12,840', x: 6, y: 0, w: 3, h: 2, color: 'tertiary', trend: [30, 28, 35, 33, 41, 38, 44] },
  { id: 'orders', label: 'Orders', icon: 'shopping_bag', value: '1,204', x: 9, y: 0, w: 3, h: 2, color: 'secondary', trend: [8, 9, 7, 11, 10, 13, 12] },
  { id: 'refunds', label: 'Refunds', icon: 'undo', value: '23', x: 0, y: 2, w: 4, h: 1, color: 'error', trend: [5, 3, 4, 2, 3, 2, 1] },
  { id: 'rating', label: 'Rating', icon: 'star', value: '4.8', x: 4, y: 2, w: 4, h: 1, color: 'tertiary', trend: [4.5, 4.6, 4.6, 4.7, 4.8] },
  { id: 'notice', label: 'Pinned notice', icon: 'push_pin', value: 'Inventory count on Friday', x: 8, y: 2, w: 4, h: 1, color: 'secondary', trend: [], static: true },
]
const clone = () => initial.map((w) => ({ ...w }))
const layout = ref<Widget[]>(clone())
const editing = ref(true)
const reset = () => (layout.value = clone())

const gridProps: PropDef[] = [
  { name: 'modelValue', type: 'DashboardItem[]', description: '{ id, x, y, w, h, minW?, minH?, maxW?, maxH?, static?, label? } in cells (v-model); other fields of yours ride along. Overlapping or out-of-range input is fixed up.' },
  { name: 'columns', type: 'number', default: '12', description: 'Columns.' },
  { name: 'rowHeight / gap', type: 'number', default: '96 / 16', description: 'A row\'s height and the gap between cells, in px.' },
  { name: 'editable', type: 'boolean', default: 'true', description: 'Let people move and resize widgets (mouse, a long press with a finger, or the keyboard).' },
  { name: 'resizable', type: 'boolean', default: 'true', description: 'A resize handle on each widget\'s corner.' },
  { name: 'handle', type: 'string', description: 'Only start a drag from an element matching this selector (a title bar), instead of anywhere on the widget.' },
  { name: 'breakpoint', type: 'number', default: '600', description: 'Below this width (the grid\'s own) the widgets stack in one column, in reading order.' },
]
const gridEvents: EventDef[] = [{ name: 'update:modelValue', payload: 'DashboardItem[]', description: 'The layout changed: save it.' }]
const gridSlots: SlotDef[] = [{ name: 'item', scope: '{ item, dragging, resizing }', description: 'A widget\'s content. Controls inside it (buttons, links, inputs, [data-dashboard-action]) don\'t start a drag.' }]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MDashboardGrid</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A dashboard people rearrange: drag a widget to move it (the rest make room and float up), drag its corner to resize
      it, everything on springs. A finger picks a widget up with a long press, so the page still scrolls; the keyboard
      does it all too (Space, arrows, Shift and arrows, Escape). The layout is the v-model, in grid cells, ready to save;
      the content is yours. Narrow, it stacks in one column. The layout functions (moveItem, compactLayout,
      normalizeLayout) are exported too.
    </p>

    <ComponentDemo
      title="An analytics dashboard"
      description="Move a card by its title bar (handle), resize it from its corner, or Tab to one and press Space. The pinned notice is static: the others flow around it. Turn editing off to lock it."
      :code="`<MDashboardGrid v-model=&quot;layout&quot; :editable=&quot;editing&quot; handle=&quot;[data-drag]&quot;>
  <template #item=&quot;{ item, dragging }&quot;>
    <MCard variant=&quot;elevated&quot; class=&quot;flex h-full flex-col&quot;>
      <div data-drag class=&quot;flex items-center gap-2 px-4 pt-3&quot;>
        <MIcon :name=&quot;item.icon&quot; /> {{ item.label }}
      </div>
      <p class=&quot;px-4 text-headline-medium&quot;>{{ item.value }}</p>
      <MSparkline :data=&quot;item.trend&quot; type=&quot;area&quot; class=&quot;mt-auto&quot; />
    </MCard>
  </template>
</MDashboardGrid>`"
      :script="`import { MDashboardGrid } from '@m3ui-vue/m3ui-vue'

// In cells of a 12-column grid; your own fields ride along
const layout = ref([
  { id: 'sales', x: 0, y: 0, w: 6, h: 2, label: 'Sales', icon: 'payments', value: '$48.2k', trend: [/* … */] },
  { id: 'notice', x: 8, y: 2, w: 4, h: 1, label: 'Pinned notice', static: true },
  // …
])
watch(layout, (l) => localStorage.setItem('dashboard', JSON.stringify(l)))`"
    >
      <div class="flex w-full flex-col gap-3">
        <div class="flex items-center gap-3">
          <MSwitch v-model="editing" aria-label="Editing" />
          <span class="text-body-medium">Editing</span>
          <span class="flex-1" />
          <MButton variant="text" icon="restart_alt" @click="reset">Reset</MButton>
        </div>
        <MDashboardGrid v-model="layout" :editable="editing" handle="[data-drag]" class="w-full">
          <template #item="{ item, dragging }">
            <MCard :variant="(item as Widget).static ? 'filled' : 'elevated'" class="flex h-full flex-col overflow-hidden" :class="dragging ? 'opacity-95' : ''">
              <div data-drag class="flex items-center gap-2 px-4 pt-3 text-title-small" :class="editing && !(item as Widget).static ? 'cursor-grab' : ''">
                <MIcon :name="(item as Widget).icon" :size="20" :class="`text-${(item as Widget).color}`" />
                <span class="flex-1 truncate">{{ (item as Widget).label }}</span>
                <MIcon v-if="editing && !(item as Widget).static" name="drag_indicator" :size="18" class="text-on-surface-variant" />
              </div>
              <p class="truncate px-4 pt-1 text-headline-small font-medium">{{ (item as Widget).value }}</p>
              <MSparkline v-if="(item as Widget).trend.length && item.h > 1" :data="(item as Widget).trend" type="area" :color="`var(--color-${(item as Widget).color})`" class="mt-auto h-16 w-full" />
            </MCard>
          </template>
        </MDashboardGrid>
        <pre class="max-h-32 overflow-auto rounded-xl bg-surface-container-high p-3 font-mono text-body-small text-on-surface-variant">{{ layout.map((w) => `${w.id}: x${w.x} y${w.y} ${w.w}×${w.h}`).join('   ') }}</pre>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="A home screen of your own"
      description="Widgets of different kinds that adapt to their size: widen the weather for its forecast, the clock for its seconds, the team for names (container queries). The checkboxes and the note work without starting a drag. Add widgets from the catalog, remove them with their ✕ (data-dashboard-action), and the layout is saved in this browser."
      :code="`<MDashboardGrid v-model=&quot;layout&quot; :row-height=&quot;88&quot; :gap=&quot;12&quot;>
  <template #item=&quot;{ item }&quot;>
    <!-- @container: each widget lays out by its own size -->
    <div class=&quot;@container relative h-full rounded-lg bg-surface-container-high&quot;>
      <MIconButton icon=&quot;close&quot; label=&quot;Remove&quot; data-dashboard-action class=&quot;absolute right-1 top-1&quot; @click=&quot;remove(item.id)&quot; />
      <WeatherWidget v-if=&quot;item.kind === 'weather'&quot; />  <!-- forecast: hidden @[28rem]:flex -->
      <TasksWidget v-else-if=&quot;item.kind === 'tasks'&quot; />  <!-- MCheckbox inside: no drag from controls -->
      …
    </div>
  </template>
</MDashboardGrid>`"
      :script="`const layout = ref(JSON.parse(localStorage.getItem('home') ?? 'null') ?? DEFAULT)
watch(layout, (l) => localStorage.setItem('home', JSON.stringify(l)), { deep: true })

// Into the first gap it fits, in reading order
function freeSpot(w, h) {
  const taken = (x, y) => layout.value.some((o) => x < o.x + o.w && o.x < x + w && y < o.y + o.h && o.y < y + h)
  for (let y = 0; ; y++) for (let x = 0; x + w <= 12; x++) if (!taken(x, y)) return { x, y }
}
function add(kind) {
  layout.value = [...layout.value, { id: crypto.randomUUID(), kind, ...freeSpot(4, 2), w: 4, h: 2, minW: 3 }]
}
const remove = (id) => (layout.value = layout.value.filter((w) => w.id !== id))`"
    >
      <DashboardHomeScreen />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="gridProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="gridEvents" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="gridSlots" />

    <ComponentPager current="MDashboardGrid" />
  </div>
</template>
