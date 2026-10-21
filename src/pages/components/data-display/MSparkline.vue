<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { MSparkline, MAnimatedNumber, MCard, MIcon, MSegmentedButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const week = [12, 18, 15, 22, 19, 27, 24]

// Live stat cards: a new point every two seconds
function walk(start: number, n: number, drift: number) {
  const out = [start]
  for (let i = 1; i < n; i++) out.push(Math.max(1, out[i - 1]! + (Math.random() - 0.45) * drift))
  return out.map((v) => Math.round(v))
}
const visitors = ref(walk(820, 16, 90))
const revenue = ref(walk(3200, 16, 300))
const errors = ref(walk(14, 16, 6))
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  timer = setInterval(() => {
    const push = (r: typeof visitors, drift: number) => {
      const last = r.value[r.value.length - 1]!
      r.value = [...r.value.slice(1), Math.max(1, Math.round(last + (Math.random() - 0.45) * drift))]
    }
    push(visitors, 90)
    push(revenue, 300)
    push(errors, 6)
  }, 2000)
})
onBeforeUnmount(() => clearInterval(timer))
const last = (a: number[]) => a[a.length - 1]!
const change = (a: number[]) => (last(a) - a[0]!) / a[0]!

// A watchlist: each line against yesterday's close
const stocks = [
  { symbol: 'ACME', close: 184.3, data: [184.3, 185.1, 184.6, 186.9, 188.2, 187.4, 189.8, 191.2] },
  { symbol: 'GLOBX', close: 72.5, data: [72.5, 71.8, 72.1, 70.4, 69.9, 70.6, 68.7, 68.1] },
  { symbol: 'NOVA', close: 12.04, data: [12.04, 12.3, 11.9, 12.4, 12.1, 12.6, 12.5, 12.8] },
]

// Interactive: hover a day
const month = [42, 38, 51, 47, 55, 61, 58, 64, 59, 66, 72, 69, 75, 81]
const hovered = ref<number | null>(null)
const shownValue = computed(() => month[hovered.value ?? month.length - 1]!)

const type = ref<'line' | 'area' | 'bar'>('area')
const typeOptions = [
  { value: 'line', label: 'Line' },
  { value: 'area', label: 'Area' },
  { value: 'bar', label: 'Bar' },
]

const sparkProps: PropDef[] = [
  { name: 'data', type: 'number[]', description: 'The values, oldest first' },
  { name: 'type', type: "'line' | 'area' | 'bar'", default: "'line'", description: 'Line, line with a soft fill under it, or bars' },
  { name: 'color', type: 'string', default: "'primary'", description: 'An M3 color role (primary, tertiary, error, success...) or any CSS color' },
  { name: 'smooth', type: 'boolean', default: 'true', description: 'Smooth curve through the points (monotone: it never overshoots them) instead of straight segments' },
  { name: 'showLast', type: 'boolean', default: 'true', description: 'A dot on the last point (line and area)' },
  { name: 'strokeWidth', type: 'number', default: '2', description: 'Line width in px' },
  { name: 'min', type: 'number', description: 'Fix the bottom of the scale (otherwise the lowest value, or 0 for bars)' },
  { name: 'max', type: 'number', description: 'Fix the top of the scale (otherwise the highest value)' },
  { name: 'baseline', type: 'number', description: 'A dashed reference line at this value: a target, yesterday\'s close' },
  { name: 'interactive', type: 'boolean', default: 'false', description: 'Follow the pointer with a dot and emit hover with the index under it' },
  { name: 'label', type: 'string', description: 'Accessible name; defaults to a summary of the data (first, last, low, high) in the app\'s language' },
  { name: 'animate', type: 'boolean', default: 'true', description: 'Spring to new data; false (or reduced motion) jumps' },
]

const sparkEvents: EventDef[] = [
  { name: 'hover', payload: 'number | null', description: 'With interactive: the index of the point under the pointer, or null when it leaves' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSparkline</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A small trend chart, drawn as SVG with no chart library: a line, an area or bars, for next to a number in a
      stat card, a table or a list. It fills its box (size it with classes), and when the data changes the shape
      springs to the new values. Screen readers hear a summary of the data instead of the drawing.
    </p>

    <ComponentDemo
      title="Types"
      description="The same week as a line, an area and bars."
      :code="`<template>
  <MSparkline :data=&quot;week&quot; />
  <MSparkline :data=&quot;week&quot; type=&quot;area&quot; color=&quot;tertiary&quot; />
  <MSparkline :data=&quot;week&quot; type=&quot;bar&quot; color=&quot;secondary&quot; />
</template>`"
    >
      <div class="flex flex-wrap items-center justify-center gap-8">
        <div class="flex flex-col items-center gap-2"><MSparkline :data="week" class="h-12 w-36" /><span class="text-label-medium text-on-surface-variant">line</span></div>
        <div class="flex flex-col items-center gap-2"><MSparkline :data="week" type="area" color="tertiary" class="h-12 w-36" /><span class="text-label-medium text-on-surface-variant">area</span></div>
        <div class="flex flex-col items-center gap-2"><MSparkline :data="week" type="bar" color="secondary" class="h-12 w-36" /><span class="text-label-medium text-on-surface-variant">bar</span></div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Live Stat Cards"
      description="With MAnimatedNumber: a new point every two seconds, the line springs along and the number rolls."
      :code="`<template>
  <MCard>
    <span>Visitors</span>
    <MAnimatedNumber :value=&quot;last(visitors)&quot; class=&quot;text-headline-medium&quot; />
    <MSparkline :data=&quot;visitors&quot; type=&quot;area&quot; class=&quot;h-12 w-full&quot; />
  </MCard>
</template>`"
    >
      <div class="grid w-full gap-3 sm:grid-cols-3">
        <MCard v-for="card in [
          { title: 'Visitors', data: visitors, format: {}, color: 'primary' },
          { title: 'Revenue', data: revenue, format: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }, color: 'tertiary' },
          { title: 'Errors', data: errors, format: {}, color: 'error' },
        ]" :key="card.title" variant="filled" class="flex flex-col gap-1 p-4">
          <span class="text-label-large text-on-surface-variant">{{ card.title }}</span>
          <div class="flex items-baseline gap-2">
            <MAnimatedNumber :value="last(card.data)" :format="card.format" locale="en" class="text-headline-medium" />
            <MAnimatedNumber
              :value="change(card.data)"
              :format="{ style: 'percent', signDisplay: 'always', maximumFractionDigits: 1 }"
              locale="en"
              class="text-label-large"
              :class="(change(card.data) >= 0) === (card.title !== 'Errors') ? 'text-success' : 'text-error'"
            />
          </div>
          <MSparkline :data="card.data" type="area" :color="card.color" class="mt-2 h-12 w-full" />
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="In a List"
      description="A watchlist: each line in green or red against yesterday's close, drawn as a dashed baseline."
      :code="`<template>
  <MSparkline :data=&quot;stock.data&quot; :baseline=&quot;stock.close&quot; :color=&quot;up ? 'success' : 'error'&quot; />
</template>`"
    >
      <MCard variant="outlined" class="w-full max-w-md divide-y divide-outline-variant">
        <div v-for="s in stocks" :key="s.symbol" class="flex items-center gap-4 px-4 py-3">
          <span class="w-16 text-title-medium">{{ s.symbol }}</span>
          <MSparkline :data="s.data" :baseline="s.close" :color="last(s.data) >= s.close ? 'success' : 'error'" :show-last="false" class="h-8 flex-1" />
          <div class="w-20 text-right">
            <p class="text-body-large tabular-nums">{{ last(s.data).toFixed(2) }}</p>
            <p class="text-label-small tabular-nums" :class="last(s.data) >= s.close ? 'text-success' : 'text-error'">
              {{ ((last(s.data) - s.close) / s.close * 100).toFixed(2) }}%
            </p>
          </div>
        </div>
      </MCard>
    </ComponentDemo>

    <ComponentDemo
      title="Interactive"
      description="Hover the chart: hover gives the index under the pointer, here shown with MAnimatedNumber."
      :code="`<template>
  <MAnimatedNumber :value=&quot;month[hovered ?? month.length - 1]&quot; />
  <MSparkline :data=&quot;month&quot; interactive @hover=&quot;hovered = $event&quot; />
</template>`"
    >
      <div class="flex w-full max-w-md flex-col gap-3">
        <MSegmentedButton v-model="type" :options="typeOptions" class="self-center" />
        <div class="flex items-baseline gap-2">
          <MAnimatedNumber :value="shownValue" class="text-display-small" />
          <span class="text-body-medium text-on-surface-variant">
            {{ hovered === null ? 'sign-ups today' : `sign-ups on day ${hovered + 1}` }}
          </span>
          <MIcon name="trending_up" label="Trending up" class="ml-auto text-success" />
        </div>
        <MSparkline :data="month" :type="type" interactive class="h-24 w-full" @hover="hovered = $event" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="sparkProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="sparkEvents" />

    <ComponentPager current="MSparkline" />
  </div>
</template>
