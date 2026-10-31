<script setup lang="ts">
import { ref } from 'vue'
import { MSegmentedButton, MSwitch } from '@m3ui-vue/m3ui-vue'
import { MGanttControls, MResourceTimeline, type TimelineEvent, type TimelineResource } from '@m3ui-vue/m3ui-vue/gantt'
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
import { at, shifts, staff } from '@/components/demos/ganttSamples'

// ── Shifts ──────────────────────────────────────────────────────────────────────────────────────────────
const events = ref<TimelineEvent[]>(shifts())
const overlap = ref<'stack' | 'prevent'>('stack')
const creatable = ref(true)
let n = 0
function create(e: { resourceId: string; start: string; end: string }) {
  events.value = [...events.value, { id: `new${++n}`, title: 'New shift', ...e }]
}

// ── Tables ──────────────────────────────────────────────────────────────────────────────────────────────
const tables: TimelineResource[] = [
  { id: 't1', name: 'Table 1', subtitle: '2 seats', icon: 'table_restaurant', group: 'Terrace' },
  { id: 't2', name: 'Table 2', subtitle: '4 seats', icon: 'table_restaurant', group: 'Terrace' },
  { id: 't3', name: 'Table 3', subtitle: '6 seats', icon: 'table_restaurant', group: 'Inside' },
  { id: 'bar', name: 'Bar', subtitle: '8 stools', icon: 'local_bar', group: 'Inside', capacity: 3 },
]
const bookings = ref<TimelineEvent[]>([
  { id: 'b1', resourceId: 't1', start: at(0, '12:30'), end: at(0, '14:00'), title: 'Gómez', subtitle: '2 people', color: 'tertiary' },
  { id: 'b2', resourceId: 't2', start: at(0, '13:00'), end: at(0, '14:30'), title: 'Ito', subtitle: '4 people' },
  { id: 'b3', resourceId: 't3', start: at(0, '20:00'), end: at(0, '22:30'), title: 'Birthday', subtitle: '6 people', color: 'secondary' },
  { id: 'b4', resourceId: 'bar', start: at(0, '19:00'), end: at(0, '21:00'), title: 'Walk-in' },
  { id: 'b5', resourceId: 'bar', start: at(0, '19:30'), end: at(0, '20:30'), title: 'Walk-in' },
  { id: 'b6', resourceId: 't2', start: at(0, '20:00'), end: at(0, '21:30'), title: 'Moreau', subtitle: '3 people' },
])

const props: PropDef[] = [
  { name: 'events', type: 'TimelineEvent[]', default: '[]', description: 'The bookings (v-model:events)' },
  { name: 'resources', type: 'TimelineResource[]', default: '[]', description: 'The rows; those with a group sit under a header that folds' },
  { name: 'scale / pxPerDay', type: "GanttScale / number", default: "'day' / 240", description: 'The zoom (v-model:scale); pxPerDay starts it between the named levels (240 = 10 px an hour)' },
  { name: 'selection / collapsed', type: 'string[]', description: 'v-model: selected bookings, folded groups' },
  { name: 'listWidth', type: 'number', default: '220', description: 'The resource column (v-model:list-width; drag its edge); 0 hides it' },
  { name: 'rowHeight / laneHeight', type: 'number', default: '56 / 40', description: "A row's least height; rows grow by a lane for each overlapping booking" },
  { name: 'overlap', type: "'stack' | 'prevent'", default: "'stack'", description: "Overlaps share the row in lanes and past a resource's capacity show as conflicts; prevent also refuses a drop that makes one" },
  { name: 'creatable', type: 'boolean', default: 'false', description: 'Dragging across empty time (a short press first on touch) fires create with the span' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'No editing' },
  { name: 'snap', type: 'number', default: '15', description: 'Minutes bookings snap to (coarser when zoomed far out); whole-day bookings snap to days' },
  { name: 'calendar / workHours', type: 'GanttCalendar / [number, number]', description: 'Days off and the hours outside work hours, shaded' },
  { name: 'now / start', type: 'string', description: "The now line (null hides it) and where the view starts" },
  { name: 'weekStartsOn, minPxPerDay, maxPxPerDay, locale, label, beforeDelete', type: '…', description: 'As in MGantt' },
]
const eventsTable: EventDef[] = [
  { name: 'update:events / scale / selection / collapsed / listWidth', payload: '…', description: 'v-model updates' },
  { name: 'event-click / event-dblclick / event-contextmenu', payload: '(event, mouseEvent)', description: 'On a booking (Enter is a dblclick)' },
  { name: 'create', payload: '{ resourceId, start, end }', description: 'Empty time was dragged across; add the booking yourself' },
  { name: 'slot-click', payload: '{ resourceId, start }', description: 'Empty time was clicked' },
  { name: 'change', payload: "{ events, kind: 'move' | 'resize' }", description: 'What a drag or a key changed' },
  { name: 'conflict', payload: '{ event, with }', description: "A drop was refused (overlap='prevent')" },
  { name: 'delete', payload: '{ events }', description: 'Bookings were deleted' },
]
const slots: SlotDef[] = [
  { name: 'default', scope: '{ timeline }', description: 'Above the timeline: MGanttControls, filters of yours' },
  { name: 'resource', scope: '{ resource, events, hours }', description: "A resource's cell (hours: booked in total)" },
  { name: 'event', scope: '{ event, resource, selected, conflict }', description: "A booking's content" },
  { name: 'group', scope: '{ group, resources, collapsed }', description: "A group's header" },
  { name: 'empty', description: 'Shown while there are no resources' },
]
const types: TypeDef[] = [
  {
    name: 'TimelineEvent',
    fields: [
      { name: 'id / resourceId / title', type: 'string', required: true, description: 'Its id, the row it is on, its label' },
      { name: 'start / end', type: 'string', required: true, description: 'Datetimes (YYYY-MM-DDTHH:mm), or YYYY-MM-DD for whole days (end inclusive)' },
      { name: 'subtitle', type: 'string', description: 'Second line (default its times)' },
      { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'neutral'", description: "Default the resource's" },
      { name: 'draggable, resizable, deletable, selectable, class, data', type: '…', description: 'Per booking' },
    ],
  },
  {
    name: 'TimelineResource',
    fields: [
      { name: 'id / name', type: 'string', required: true, description: 'Its id and name' },
      { name: 'subtitle, group', type: 'string', description: 'Second line; the header it sits under' },
      { name: 'avatar / icon', type: 'string', description: 'A picture, or a Material Symbol (else initials)' },
      { name: 'color', type: 'role', description: 'Its bookings and avatar' },
      { name: 'capacity', type: 'number', description: 'Bookings at once before they conflict (default 1)' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MResourceTimeline</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      One row per person, table, room or machine, with their bookings along a timeline that zooms from hours to
      months: who works when, which table is taken, what a machine is doing. Drag a booking along its row to move
      it, onto another row to hand it over, or by its ends to resize it. Overlaps stack in lanes and show as
      conflicts past the resource's capacity. Not an M3 spec component. From <code>/gantt</code>.
    </p>

    <ComponentDemo
      title="Staff Shifts"
      description="A restaurant's week, grouped by team. Leo's double booking on Wednesday shows as a conflict; with Prevent, a drop that makes one springs back. Drag across empty time to add a shift."
      flush
      :code="`<MResourceTimeline
  v-model:events=&quot;events&quot;
  :resources=&quot;staff&quot;
  :overlap=&quot;overlap&quot;
  :creatable=&quot;creatable&quot;
  :work-hours=&quot;[8, 24]&quot;
  @create=&quot;create&quot;
>
  <MGanttControls :scales=&quot;['hour', 'day', 'week']&quot; />
</MResourceTimeline>`"
      :script="`const staff: TimelineResource[] = [
  { id: 'ana', name: 'Ana Ruiz', subtitle: 'Head chef', group: 'Kitchen', color: 'tertiary' },
  { id: 'mia', name: 'Mia Sol', subtitle: 'Floor manager', group: 'Floor' },
  // …
]
const events = ref<TimelineEvent[]>([
  { id: 'a1', resourceId: 'ana', start: '2026-03-02T09:00', end: '2026-03-02T17:00', title: 'Morning' },
  // …
])
function create({ resourceId, start, end }) {
  events.value = [...events.value, { id: crypto.randomUUID(), resourceId, start, end, title: 'New shift' }]
}`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-body-medium">
          <MSegmentedButton v-model="overlap" density="compact" :options="[{ value: 'stack', label: 'Stack' }, { value: 'prevent', label: 'Prevent' }]" />
          <label class="flex items-center gap-2"><MSwitch v-model="creatable" /> Drag to add</label>
        </div>
        <MResourceTimeline
          v-model:events="events"
          :resources="staff"
          :overlap="overlap"
          :creatable="creatable"
          :work-hours="[8, 24]"
          :start="at(0, '06:00')"
          class="h-[520px] border border-outline-variant"
          @create="create"
        >
          <MGanttControls :scales="['hour', 'day', 'week']" />
        </MResourceTimeline>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Table Bookings"
      description="Tables as resources with icons; the bar seats three groups at once (capacity: 3). The #event slot draws each booking."
      flush
      :code="`<MResourceTimeline v-model:events=&quot;bookings&quot; :resources=&quot;tables&quot; :px-per-day=&quot;1200&quot; :snap=&quot;30&quot;>
  <template #event=&quot;{ event }&quot;>
    <span class=&quot;truncate text-label-large&quot;>{{ event.title }}</span>
    <span class=&quot;ml-auto shrink-0 text-label-small opacity-80&quot;>{{ event.subtitle }}</span>
  </template>
</MResourceTimeline>`"
      :script="`const tables: TimelineResource[] = [
  { id: 't1', name: 'Table 1', subtitle: '2 seats', icon: 'table_restaurant', group: 'Terrace' },
  { id: 'bar', name: 'Bar', subtitle: '8 stools', icon: 'local_bar', group: 'Inside', capacity: 3 },
]`"
    >
      <div class="p-4 sm:p-6">
        <MResourceTimeline v-model:events="bookings" :resources="tables" :px-per-day="1200" :snap="30" :start="at(0, '11:00')" class="h-[360px] border border-outline-variant">
          <template #event="{ event }">
            <span class="truncate text-label-large">{{ event.title }}</span>
            <span class="ml-auto shrink-0 text-label-small opacity-80">{{ event.subtitle }}</span>
          </template>
        </MResourceTimeline>
      </div>
    </ComponentDemo>

    <h3 class="mt-6 mb-3 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Events</h3>
    <EventsTable :events="eventsTable" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Types</h3>
    <TypesTable :types="types" />
    <p class="mt-4 text-body-medium text-on-surface-variant">
      Keyboard on a booking: ←/→ move it, Shift + ←/→ change its end, ↑/↓ hand it to the resource above or below,
      Enter opens it, Delete deletes. The template ref, and <code>useResourceTimeline()</code> inside it, give its state
      and controls (see <RouterLink to="/composables/usegantt" class="text-primary">useGantt</RouterLink>).
    </p>

    <ComponentPager current="MResourceTimeline" />
  </div>
</template>
