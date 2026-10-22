<script setup lang="ts">
import { ref } from 'vue'
import { MTimeline, MCard, MAvatar, MChip, MButton, MSegmentedButton, MSlider } from '@m3ui-vue/m3ui-vue'
import type { TimelineItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const timelineProps: PropDef[] = [
  { name: 'items', type: 'T[] (T extends TimelineItem)', description: 'Array of timeline entries — required. Your own item type (with extra fields) flows into the slots' },
  { name: 'dense', type: 'boolean', default: 'false', description: 'Compact spacing between items' },
  { name: 'alternating', type: 'boolean', default: 'false', description: 'Alternate items left/right of a central line instead of a single left-aligned column (vertical only)' },
  { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: "Horizontal lays entries side by side along a line, scrolling sideways when they don't fit" },
  { name: 'bare', type: 'boolean', default: 'false', description: 'Leaves each entry\'s content to the #item slot: no title, description or date' },
  { name: 'responsive', type: 'boolean', default: 'true', description: 'Lets the alternating layout fold into a single column (line on the left, #opposite under the content) while the timeline is narrower than 32rem. It goes by its own width (a container query), so it also folds in a side column on a wide screen' },
  { name: 'animate', type: 'boolean', default: 'true', description: 'Entries added after it mounts fade and slide in, and the others move to their new places, on M3 springs (not with reduced motion). Give items a key, or an insertion looks like a change to every entry after it' },
  { name: 'limit', type: 'number', description: "Shows only the first entries (groups' headers don't count), with a \"Show N more\" button for the rest that turns into \"Show less\"" },
  { name: 'expanded', type: 'boolean', description: 'Whether the entries past limit show (v-model:expanded); the timeline keeps its own state when left out' },
  { name: 'current', type: 'number', description: "Makes it a progress timeline: the index of the current step. The ones before are done (filled, solid line), the current one pulses (aria-current=\"step\"), the ones after are pending (outlined, dashed line). An item's own status wins; items.length marks them all done" },
]

const timelineTypes: TypeDef[] = [
  {
    name: 'TimelineItem',
    fields: [
      { name: 'key', type: 'string | number', description: 'Stable key for the entry (defaults to its index): set it when entries are added or removed' },
      { name: 'title', type: 'string', required: true, description: 'Item headline' },
      { name: 'description', type: 'string', description: 'Supporting text below the title' },
      { name: 'date', type: 'string', description: 'Date/time label' },
      { name: 'icon', type: 'string', description: 'Material Symbol shown inside the dot (dot grows to fit it)' },
      { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error' | 'success'", description: "Dot/connector color — defaults to 'primary'" },
      { name: 'dotColor', type: 'string', description: 'Any CSS color to override color with an exact value instead of a named token' },
      { name: 'group', type: 'string', description: 'A group to show it under ("Today"): a header goes before each run of consecutive entries with the same group, and the line ends with the run' },
      { name: 'status', type: "'done' | 'current' | 'pending'", description: "This step's progress, over what the timeline's current gives it" },
    ],
  },
]

const timelineEvents: EventDef[] = [
  { name: 'update:expanded', payload: 'boolean', description: 'The "Show more" / "Show less" button was pressed' },
]

const timelineSlots: SlotDef[] = [
  { name: '#item', description: "Extra content under every entry's description (a card, chips, a button). With bare, the entry's whole content", scope: '{ item: T, index: number }' },
  { name: '#title', description: "Replaces an entry's title row (title and date)", scope: '{ item: T, index: number }' },
  { name: '#dot', description: "Replaces an entry's dot (an avatar, an image, a custom shape); the line still runs from it", scope: '{ item: T, index: number }' },
  { name: '#group', description: "Replaces a group's header", scope: '{ group: string, items: T[] }' },
  { name: '#opposite', description: 'Content across the line: on the empty side in the alternating layout, or in a column before the line in the single-column one (dates, times, amounts)', scope: '{ item: T, index: number }' },
  { name: '#item-{i}', description: 'Extra content under a single entry, by its zero-based index (e.g. #item-0); wins over #item for that entry', scope: '{ item: T, index: number }' },
]

// Custom content: your own item type reaches the slots
interface Activity extends TimelineItem { who: string; action: string; text?: string; tags?: string[] }
const activity: Activity[] = [
  { key: 1, title: '', who: 'Ana Torres', action: 'opened the issue', date: '2h ago', text: 'Dark mode flickers when switching palettes on Safari.' },
  { key: 2, title: '', who: 'Leo Park', action: 'added labels', date: '1h ago', tags: ['bug', 'safari'] },
  { key: 3, title: '', who: 'Mia Chen', action: 'commented', date: '20m ago', text: 'I can reproduce it on iOS 18 too, looking into it.' },
]

const schedule: TimelineItem[] = [
  { title: 'Check-in', description: 'Lobby, badge pickup', date: '09:00', color: 'secondary' },
  { title: 'Keynote', description: 'Main hall', date: '10:00', icon: 'mic', color: 'primary' },
  { title: 'Workshops', description: 'Rooms A to D', date: '11:30', color: 'tertiary' },
  { title: 'Lunch', date: '13:00', icon: 'restaurant', color: 'success' },
]

const order: TimelineItem[] = [
  { title: 'Ordered', date: 'Mon 12', icon: 'shopping_bag', color: 'success' },
  { title: 'Packed', date: 'Tue 13', icon: 'inventory_2', color: 'success' },
  { title: 'Shipped', date: 'Wed 14', icon: 'local_shipping', color: 'primary' },
  { title: 'Out for delivery', date: 'Fri 16', icon: 'route', color: 'secondary' },
  { title: 'Delivered', date: 'Est. Fri 16', icon: 'home', color: 'secondary' },
]

// Progress: an order being tracked
const tracking: TimelineItem[] = [
  { title: 'Order placed', description: 'The restaurant got it', date: '20:14', icon: 'receipt_long' },
  { title: 'Preparing', description: 'In the kitchen', date: '20:16', icon: 'skillet' },
  { title: 'On the way', description: 'Leo is bringing it', icon: 'two_wheeler' },
  { title: 'Delivered', description: 'Enjoy your meal', icon: 'home' },
]
const step = ref(1)
const altWidth = ref(720)
const trackingLayout = ref<'vertical' | 'alternating' | 'horizontal'>('vertical')
const trackingLayouts = (['vertical', 'alternating', 'horizontal'] as const).map((v) => ({ value: v, label: v }))

// Groups: a day's activity
const days: TimelineItem[] = [
  { title: 'Morning run', description: '5.2 km along the river', date: '07:10', icon: 'directions_run', color: 'success', group: 'Today' },
  { title: 'Standup', description: 'Planning the 1.2.0 release', date: '09:30', icon: 'groups', group: 'Today' },
  { title: 'Lunch with Ana', date: '13:00', icon: 'restaurant', color: 'tertiary', group: 'Today' },
  { title: 'Code review', description: 'MTimeline groups', date: '16:45', icon: 'rate_review', group: 'Yesterday' },
  { title: 'Cinema', date: '21:00', icon: 'movie', color: 'tertiary', group: 'Yesterday' },
  { title: 'Flight to Córdoba', date: '18:20', icon: 'flight_land', color: 'secondary', group: 'Monday, Oct 20' },
]
// Live: events arriving at the top
const feedPool: Omit<TimelineItem, 'key'>[] = [
  { title: 'Deploy started', description: 'main → production', icon: 'rocket_launch', color: 'primary' },
  { title: 'Tests passed', description: '942 of 942', icon: 'check_circle', color: 'success' },
  { title: 'New comment', description: 'Ana: looks good to me', icon: 'chat', color: 'tertiary' },
  { title: 'Build failed', description: 'Type error in MTimeline.vue', icon: 'error', color: 'error' },
  { title: 'Release tagged', description: 'v1.2.0', icon: 'sell', color: 'secondary' },
]
let feedId = 3
const feed = ref<TimelineItem[]>([
  { key: 3, ...feedPool[1]!, date: 'now' },
  { key: 2, ...feedPool[2]!, date: '2 min ago' },
  { key: 1, ...feedPool[0]!, date: '5 min ago' },
])
function addEvent() {
  feedId++
  feed.value = [{ key: feedId, ...feedPool[feedId % feedPool.length]!, date: 'now' }, ...feed.value].slice(0, 8)
}
function removeEvent() {
  feed.value = feed.value.slice(1)
}
// A late event that belongs in the middle (one that arrives out of order, a backfill)
function insertMiddle() {
  feedId++
  const at = Math.floor(feed.value.length / 2)
  const late = { key: feedId, title: 'Late event', description: 'Arrived out of order, placed where it belongs', icon: 'history', color: 'secondary' as const, date: 'earlier' }
  feed.value = [...feed.value.slice(0, at), late, ...feed.value.slice(at)].slice(0, 8)
}

// Show more: a long history
const history: TimelineItem[] = [
  'Account created', 'Email verified', 'Profile photo added', 'First order', 'Address changed', 'Second order',
  'Review posted', 'Password changed', 'Gift card redeemed', 'Third order', 'Newsletter on',
].map((title, i) => ({ key: i, title, date: `Oct ${i + 2}`, icon: i % 3 === 0 ? 'shopping_bag' : 'person', color: i % 3 === 0 ? 'primary' : 'secondary' }))
const historyLayout = ref<'vertical' | 'alternating' | 'horizontal'>('vertical')
const historyOpen = ref(false)

const daysLayout = ref<'vertical' | 'alternating' | 'horizontal'>('vertical')

const releases: (TimelineItem & { version: string; notes: string[] })[] = [
  { key: 'v1.2', title: 'v1.2', version: '1.2.0', notes: ['Horizontal timelines', 'Slots for every part'], color: 'primary' },
  { key: 'v1.1', title: 'v1.1', version: '1.1.0', notes: ['Alternating layout'], color: 'secondary' },
  { key: 'v1.0', title: 'v1.0', version: '1.0.0', notes: ['First stable release'], color: 'tertiary' },
]

const timelineItems: TimelineItem[] = [
  { title: 'Project created', description: 'Initial repository setup', date: 'Jan 15', icon: 'rocket_launch', color: 'primary' },
  { title: 'First release', description: 'v1.0.0 published to npm', date: 'Feb 20', icon: 'celebration', color: 'success' },
  { title: 'Bug reported', description: 'Critical rendering issue found', date: 'Mar 5', icon: 'bug_report', color: 'error' },
  { title: 'Patch released', description: 'Fix deployed in v1.0.1', date: 'Mar 7', icon: 'check_circle', color: 'success' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTimeline</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      An event timeline with icon dots, dates, and colors — a single column, alternating left/right, or
      horizontal. Every part can be replaced through slots.
    </p>

    <ComponentDemo
      title="Timeline"
      description="Vertical event timeline with icons and colors."
      :code="`<template>
  <MTimeline :items=&quot;items&quot; />
</template>`"
      :script="`const items = [
  { title: 'Project created', description: 'Initial setup', date: 'Jan 15', icon: 'rocket_launch', color: 'primary' },
  { title: 'First release', description: 'v1.0.0 published', date: 'Feb 20', icon: 'celebration', color: 'success' },
  { title: 'Bug reported', date: 'Mar 5', icon: 'bug_report', color: 'error' },
  { title: 'Patch released', date: 'Mar 7', icon: 'check_circle', color: 'success' },
]`"
    >
      <div class="w-full max-w-lg">
        <MTimeline :items="timelineItems" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Dense"
      description="Compact timeline with less vertical spacing."
      :code="`<template>
  <MTimeline :items=&quot;items&quot; :dense=&quot;true&quot; />
</template>`"
    >
      <div class="w-full max-w-lg">
        <MTimeline :items="timelineItems" :dense="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Alternating"
      description="Items alternate left and right of a central line. Narrower than 32rem (its own width, not the screen's), it folds into a single column: drag the slider. responsive: false keeps it alternating."
      :code="`<MTimeline :items=&quot;items&quot; :alternating=&quot;true&quot; />`"
      :script="`import { MTimeline } from '@m3ui-vue/m3ui-vue'
import type { TimelineItem } from '@m3ui-vue/m3ui-vue'

const items: TimelineItem[] = [
  { title: 'Project created', description: 'Initial repo setup', date: 'Jan 15', icon: 'rocket_launch', color: 'primary' },
  { title: 'Design approved', description: 'Mockups finalized by the team', date: 'Jan 22', icon: 'design_services', color: 'secondary' },
  { title: 'Sprint 1 done', description: 'Button, Card, TextField shipped', date: 'Feb 5', icon: 'check_circle', color: 'success' },
  { title: 'Critical bug fixed', description: 'Dark mode rendering issue resolved', date: 'Feb 8', icon: 'bug_report', color: 'error' },
  { title: 'v1.0 released', description: 'First stable version in production', date: 'Feb 20', icon: 'celebration', color: 'tertiary' },
]`"
    >
      <div class="flex w-full flex-col gap-4">
        <label class="flex max-w-md items-center gap-4 text-body-medium text-on-surface-variant">
          <span class="w-24 shrink-0 tabular-nums">{{ altWidth }}px</span>
          <MSlider v-model="altWidth" :min="260" :max="900" :step="10" class="flex-1" />
        </label>
        <div class="max-w-full rounded-xl border border-dashed border-outline-variant p-3" :style="{ width: `${altWidth}px` }">
        <MTimeline
          :items="[
            { title: 'Project created', description: 'Initial repo setup', date: 'Jan 15', icon: 'rocket_launch', color: 'primary' },
            { title: 'Design approved', description: 'Mockups finalized by the team', date: 'Jan 22', icon: 'design_services', color: 'secondary' },
            { title: 'Sprint 1 done', description: 'Button, Card, TextField shipped', date: 'Feb 5', icon: 'check_circle', color: 'success' },
            { title: 'Critical bug fixed', description: 'Dark mode rendering issue resolved', date: 'Feb 8', icon: 'bug_report', color: 'error' },
            { title: 'v1.0 released', description: 'First stable version in production', date: 'Feb 20', icon: 'celebration', color: 'tertiary' },
          ]"
          :alternating="true"
        />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Per-item Extra Content"
      description="#item-{i} attaches content under a single entry, by its index — such as a link only one entry needs. For every entry, use #item."
      :code="`<MTimeline :items=&quot;items&quot;>
  <template #item-1=&quot;{ item }&quot;>
    <a href=&quot;#&quot; class=&quot;text-label-medium text-primary underline&quot;>View release notes</a>
  </template>
</MTimeline>`"
    >
      <div class="w-full max-w-lg">
        <MTimeline :items="timelineItems">
          <template #item-1="{ item }">
            <a href="#" class="text-label-medium text-primary underline" @click.prevent>View {{ item.title.toLowerCase() }} notes</a>
          </template>
        </MTimeline>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom content"
      description="Every part takes a slot with { item, index }, and your own item type reaches them: here an activity feed with avatars as dots (#dot), a sentence as the title (#title), and a comment card or chips under it (#item)."
      :code="`<MTimeline :items=&quot;activity&quot;>
  <template #dot=&quot;{ item }&quot;><MAvatar :name=&quot;item.who&quot; :size=&quot;36&quot; /></template>
  <template #title=&quot;{ item }&quot;>
    <p><strong>{{ item.who }}</strong> {{ item.action }} · {{ item.date }}</p>
  </template>
  <template #item=&quot;{ item }&quot;>
    <MCard v-if=&quot;item.text&quot; variant=&quot;outlined&quot; class=&quot;p-3&quot;>{{ item.text }}</MCard>
    <MChip v-for=&quot;t in item.tags&quot; :key=&quot;t&quot;>{{ t }}</MChip>
  </template>
</MTimeline>`"
      :script="`interface Activity extends TimelineItem { who: string; action: string; text?: string; tags?: string[] }
const activity: Activity[] = [
  { key: 1, title: '', who: 'Ana Torres', action: 'opened the issue', date: '2h ago', text: 'Dark mode flickers…' },
  { key: 2, title: '', who: 'Leo Park', action: 'added labels', date: '1h ago', tags: ['bug', 'safari'] },
]`"
    >
      <div class="w-full max-w-lg">
        <MTimeline :items="activity" dense>
          <template #dot="{ item }"><MAvatar :name="item.who" :size="36" /></template>
          <template #title="{ item }">
            <p class="pt-2 text-body-medium text-on-surface"><strong class="font-medium">{{ item.who }}</strong> {{ item.action }} <span class="text-on-surface-variant">· {{ item.date }}</span></p>
          </template>
          <template #item="{ item }">
            <MCard v-if="item.text" variant="outlined" class="p-3 text-body-medium">{{ item.text }}</MCard>
            <div v-if="item.tags" class="flex gap-1">
              <MChip v-for="t in item.tags" :key="t">{{ t }}</MChip>
            </div>
          </template>
        </MTimeline>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Opposite column"
      description="#opposite adds a column before the line in the single-column layout (times, amounts), and fills the empty side in the alternating one."
      :code="`<MTimeline :items=&quot;schedule&quot;>
  <template #opposite=&quot;{ item }&quot;>
    <span class=&quot;text-title-small text-primary&quot;>{{ item.date }}</span>
  </template>
  <template #title=&quot;{ item }&quot;>
    <p class=&quot;text-body-large font-medium&quot;>{{ item.title }}</p>
  </template>
</MTimeline>`"
    >
      <div class="grid w-full gap-8 lg:grid-cols-2">
        <MTimeline :items="schedule">
          <template #opposite="{ item }"><span class="text-title-small text-primary">{{ item.date }}</span></template>
          <template #title="{ item }"><p class="text-body-large font-medium text-on-surface">{{ item.title }}</p></template>
        </MTimeline>
        <MTimeline :items="schedule" alternating>
          <template #opposite="{ item }"><span class="text-title-small text-primary">{{ item.date }}</span></template>
          <template #title="{ item }"><p class="text-body-large font-medium text-on-surface">{{ item.title }}</p></template>
        </MTimeline>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Horizontal"
      description="orientation='horizontal' lays the entries side by side, like an order's progress; it scrolls sideways when they don't fit."
      :code="`<MTimeline :items=&quot;order&quot; orientation=&quot;horizontal&quot; />`"
    >
      <div class="w-full">
        <MTimeline :items="order" orientation="horizontal" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Progress"
      description="current makes it a progress timeline, like an order being tracked: done steps are filled with a solid line, the current one pulses, the rest are outlined with a dashed line. In every layout."
      :code="`<MTimeline :items=&quot;tracking&quot; :current=&quot;step&quot; />

<MButton @click=&quot;step++&quot;>Next step</MButton>`"
      :script="`const tracking = [
  { title: 'Order placed', description: 'The restaurant got it', date: '20:14', icon: 'receipt_long' },
  { title: 'Preparing', description: 'In the kitchen', date: '20:16', icon: 'skillet' },
  { title: 'On the way', description: 'Leo is bringing it', icon: 'two_wheeler' },
  { title: 'Delivered', description: 'Enjoy your meal', icon: 'home' },
]
const step = ref(1)`"
    >
      <div class="flex w-full flex-col gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <MSegmentedButton v-model="trackingLayout" :options="trackingLayouts" />
          <MButton variant="tonal" icon="undo" :disabled="step === 0" @click="step--">Back</MButton>
          <MButton icon="redo" :disabled="step === tracking.length" @click="step++">Next step</MButton>
        </div>
        <MTimeline
          :items="tracking"
          :current="step"
          :alternating="trackingLayout === 'alternating'"
          :orientation="trackingLayout === 'horizontal' ? 'horizontal' : 'vertical'"
        />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Groups"
      description="Give entries a group and a header goes before each run of them, the line ending with the run. #group replaces the header (here, with a count)."
      :code="`<MTimeline :items=&quot;days&quot;>
  <template #group=&quot;{ group, items }&quot;>
    <p class=&quot;text-title-small text-on-surface-variant&quot;>{{ group }} · {{ items.length }}</p>
  </template>
</MTimeline>`"
      :script="`const days = [
  { title: 'Morning run', date: '07:10', icon: 'directions_run', group: 'Today' },
  { title: 'Standup', date: '09:30', icon: 'groups', group: 'Today' },
  { title: 'Code review', date: '16:45', icon: 'rate_review', group: 'Yesterday' },
  // …
]`"
    >
      <div class="flex w-full flex-col gap-4">
        <MSegmentedButton v-model="daysLayout" :options="trackingLayouts" class="self-start" />
        <MTimeline
          :items="days"
          :alternating="daysLayout === 'alternating'"
          :orientation="daysLayout === 'horizontal' ? 'horizontal' : 'vertical'"
        >
          <template #group="{ group, items }">
            <p class="text-title-small text-on-surface-variant">{{ group }} · {{ items.length }}</p>
          </template>
        </MTimeline>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Live updates"
      description="Entries added after the timeline mounts slide in wherever they land (on top, or in the middle like an event that arrived late), and the rest move along on a spring instead of jumping (give them a key). animate: false turns it off."
      :code="`<MTimeline :items=&quot;feed&quot; />

<MButton @click=&quot;feed = [{ key: ++id, title: 'Deploy started', icon: 'rocket_launch' }, ...feed]&quot;>
  Add event
</MButton>`"
    >
      <div class="flex w-full flex-col gap-4">
        <div class="flex flex-wrap gap-3">
          <MButton icon="add" @click="addEvent">Add event</MButton>
          <MButton variant="tonal" icon="vertical_align_center" :disabled="feed.length < 2" @click="insertMiddle">Insert in the middle</MButton>
          <MButton variant="tonal" icon="remove" :disabled="!feed.length" @click="removeEvent">Remove the newest</MButton>
        </div>
        <MTimeline :items="feed" dense />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Show more"
      description="limit shows the first entries with a button for the rest; the ones it reveals slide in. v-model:expanded if you need the state."
      :code="`<MTimeline :items=&quot;history&quot; :limit=&quot;4&quot; v-model:expanded=&quot;open&quot; />`"
      :script="`const open = ref(false)`"
    >
      <div class="flex w-full flex-col gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <MSegmentedButton v-model="historyLayout" :options="trackingLayouts" />
          <span class="text-body-medium text-on-surface-variant">expanded: {{ historyOpen }}</span>
        </div>
        <MTimeline
          v-model:expanded="historyOpen"
          :items="history"
          :limit="4"
          dense
          :alternating="historyLayout === 'alternating'"
          :orientation="historyLayout === 'horizontal' ? 'horizontal' : 'vertical'"
        />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Bare"
      description="With bare the timeline only draws the dots and the line, and #item draws each entry however you like."
      :code="`<MTimeline :items=&quot;releases&quot; bare>
  <template #item=&quot;{ item }&quot;>
    <MCard variant=&quot;filled&quot; class=&quot;p-4&quot;>
      <p class=&quot;text-title-medium&quot;>{{ item.version }}</p>
      <ul><li v-for=&quot;n in item.notes&quot; :key=&quot;n&quot;>{{ n }}</li></ul>
    </MCard>
  </template>
</MTimeline>`"
    >
      <div class="w-full max-w-lg">
        <MTimeline :items="releases" bare>
          <template #item="{ item }">
            <MCard variant="filled" class="p-4">
              <p class="text-title-medium text-on-surface">{{ item.version }}</p>
              <ul class="mt-1 list-inside list-disc text-body-medium text-on-surface-variant">
                <li v-for="n in item.notes" :key="n">{{ n }}</li>
              </ul>
            </MCard>
          </template>
        </MTimeline>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="timelineProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="timelineTypes" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="timelineEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="timelineSlots" />

    <ComponentPager current="MTimeline" />
  </div>
</template>
