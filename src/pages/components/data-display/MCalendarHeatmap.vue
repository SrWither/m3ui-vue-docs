<script setup lang="ts">
import { computed, ref } from 'vue'
import { MCalendarHeatmap, MCard, MSegmentedButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

// A year of made-up activity: busier on weekdays, quieter in the holidays, with streaks
function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function seeded(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
}
function activity(days: number, seed: number, weekdayBias = true) {
  const rand = seeded(seed)
  const out: Record<string, number> = {}
  const today = new Date()
  for (let i = 0; i < days; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
    const weekend = d.getDay() === 0 || d.getDay() === 6
    const r = rand()
    if (r < (weekdayBias && weekend ? 0.6 : 0.25)) continue
    out[iso(d)] = Math.round(r * r * (weekdayBias && weekend ? 4 : 12))
  }
  return out
}
const commits = activity(371, 7)
const workouts = activity(120, 42, false)
const total = Object.values(commits).reduce((a, b) => a + b, 0)

const selected = ref<string | null>(null)
const color = ref('primary')
const colors = [
  { value: 'primary', label: 'Primary' },
  { value: 'tertiary', label: 'Tertiary' },
  { value: 'success', label: 'Success' },
  { value: 'error', label: 'Error' },
]
const selectedText = computed(() =>
  selected.value ? `${commits[selected.value] ?? 0} contributions on ${new Date(selected.value + 'T00:00:00').toDateString()}` : 'Click a day',
)

const props: PropDef[] = [
  { name: 'data', type: 'Record<string, number> | HeatmapDay[]', description: "Values per day: { '2026-11-20': 4 } or [{ date, value }] (repeated dates add up). Missing days are 0" },
  { name: 'end', type: 'string | Date', default: 'today', description: 'Last day shown' },
  { name: 'start', type: 'string | Date', description: 'First day shown; defaults to weeks weeks before end' },
  { name: 'weeks', type: 'number', default: '53', description: 'How many weeks to show when there is no start' },
  { name: 'weekStart', type: '0 | 1', default: '1', description: 'First row: 1 Monday (like the date pickers), 0 Sunday' },
  { name: 'levels', type: 'number', default: '5', description: 'Number of tints, the empty one included' },
  { name: 'max', type: 'number', description: 'The value that gets the darkest tint; defaults to the largest value shown' },
  { name: 'color', type: 'string', default: "'primary'", description: 'An M3 color role or any CSS color; tints mix it into surface-container-highest' },
  { name: 'cellSize', type: 'number', default: '12', description: "Side of a day's square, in px" },
  { name: 'gap', type: 'number', default: '3', description: 'Space between days, in px' },
  { name: 'monthLabels', type: 'boolean', default: 'true', description: 'Month names above the weeks' },
  { name: 'dayLabels', type: 'boolean', default: 'true', description: 'Weekday names (Mon, Wed, Fri) beside the rows' },
  { name: 'legend', type: 'boolean', default: 'true', description: 'The “Less ▢▢▢ More” scale below' },
  { name: 'tooltip', type: 'boolean', default: 'true', description: "The day's value on hover and focus" },
  { name: 'formatTooltip', type: '(cell: HeatmapCell) => string', description: 'The tooltip text and each day’s accessible name; defaults to “value · date”' },
  { name: 'locale', type: 'string', description: "BCP-47 language for month/weekday names and numbers; defaults to the app's locale" },
  { name: 'modelValue', type: 'string | null', default: 'null', description: 'Selected day, YYYY-MM-DD (v-model); outlined' },
  { name: 'label', type: 'string', description: 'Accessible name of the grid' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCalendarHeatmap</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Activity per day as a grid of weeks, each day tinted by how much happened: commits, workouts, orders, habits.
      Month and weekday names come from <code>Intl</code> in your app's language. Hover or focus a day for its value;
      arrow keys move by day (up/down) and by week (left/right), Enter or a click selects it. When it doesn't fit, it
      scrolls sideways, starting at the latest week.
    </p>

    <ComponentDemo
      title="A Year of Activity"
      description="The default: the last 53 weeks up to today, five tints of primary relative to the busiest day."
      :code="`<template>
  <MCalendarHeatmap :data=&quot;contributions&quot; label=&quot;Contributions&quot; />
</template>`"
    >
      <div class="flex w-full flex-col gap-2">
        <span class="text-title-small">{{ total.toLocaleString() }} contributions in the last year</span>
        <MCalendarHeatmap :data="commits" label="Contributions" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Selection and Color"
      description="v-model holds the selected day (outlined); select also gives its value and level. color takes any M3 role or CSS color."
      :code="`<template>
  <MCalendarHeatmap v-model=&quot;day&quot; :data=&quot;contributions&quot; color=&quot;tertiary&quot; />
</template>`"
    >
      <div class="flex w-full flex-col gap-3">
        <MSegmentedButton v-model="color" :options="colors" />
        <MCalendarHeatmap v-model="selected" :data="commits" :color="color" label="Contributions" />
        <span class="text-body-medium text-on-surface-variant">{{ selectedText }}</span>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Habit Tracker"
      description="A shorter range in a card: 17 weeks, bigger squares, Sunday first, three tints and a custom tooltip."
      :code="`<template>
  <MCalendarHeatmap
    :data=&quot;workouts&quot;
    :weeks=&quot;17&quot;
    :cell-size=&quot;18&quot;
    :gap=&quot;4&quot;
    :week-start=&quot;0&quot;
    :levels=&quot;3&quot;
    color=&quot;success&quot;
    :format-tooltip=&quot;(d) => d.value ? \`\${d.value} workouts\` : 'Rest day'&quot;
  />
</template>`"
    >
      <MCard variant="outlined" class="p-4">
        <div class="mb-3 text-title-medium">Workouts</div>
        <MCalendarHeatmap
          :data="workouts"
          :weeks="17"
          :cell-size="18"
          :gap="4"
          :week-start="0"
          :levels="3"
          color="success"
          :format-tooltip="(d) => (d.value ? `${d.value} workouts` : 'Rest day')"
          label="Workouts"
        />
      </MCard>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events and Slots</h3>
    <ul class="mb-6 list-disc space-y-1 pl-6 text-body-medium text-on-surface-variant">
      <li><code>update:modelValue</code>: the date picked (YYYY-MM-DD)</li>
      <li><code>select</code>: the picked day as <code>{ date, value, level }</code></li>
      <li><code>#tooltip</code>: replaces the tooltip's text; gets <code>{ date, value, level }</code></li>
      <li>Each day carries <code>data-date</code> and <code>data-level</code> for your own styling</li>
    </ul>

    <ComponentPager current="MCalendarHeatmap" />
  </div>
</template>
