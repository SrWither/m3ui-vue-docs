<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { MCandlestickChart, MButton, MSegmentedButton } from '@m3ui-vue/m3ui-vue'
import type { Candle } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

// A seeded random walk, so the chart looks the same on every visit
function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
}
function walk(count: number, start: number, periodMs: number, end: number, seed: number, vol = 0.02): Candle[] {
  const r = rng(seed)
  const out: Candle[] = []
  let price = start
  for (let i = 0; i < count; i++) {
    const open = price
    const close = Math.max(1, open * (1 + (r() - 0.48) * vol * 2))
    const high = Math.max(open, close) * (1 + r() * vol * 0.6)
    const low = Math.min(open, close) * (1 - r() * vol * 0.6)
    out.push({ time: end - (count - 1 - i) * periodMs, open, high, low, close, volume: Math.round(2e5 + r() * 8e5 * (1 + Math.abs(close - open) / open * 40)) })
    price = close
  }
  return out
}

const today = new Date()
today.setHours(0, 0, 0, 0)
const daily = walk(260, 182, 86_400_000, today.getTime(), 7)

const live = ref<Candle[]>(walk(90, 64_200, 60_000, Math.floor(Date.now() / 60_000) * 60_000, 3, 0.003))
const running = ref(true)
let timer: ReturnType<typeof setInterval> | undefined
const r = rng(11)
function tick() {
  const list = live.value
  const last = list[list.length - 1]!
  const now = Math.floor(Date.now() / 60_000) * 60_000
  const price = last.close * (1 + (r() - 0.5) * 0.002)
  if (now > (last.time as number)) {
    live.value = [...list, { time: now, open: last.close, high: Math.max(last.close, price), low: Math.min(last.close, price), close: price, volume: 0 }]
  } else {
    const c = { ...last, close: price, high: Math.max(last.high, price), low: Math.min(last.low, price), volume: (last.volume ?? 0) + Math.round(r() * 3000) }
    live.value = [...list.slice(0, -1), c]
  }
}
onMounted(() => (timer = setInterval(() => running.value && tick(), 500)))
onBeforeUnmount(() => clearInterval(timer))

const chart = ref<InstanceType<typeof MCandlestickChart> | null>(null)
const ma = ref<string[]>(['20', '50'])

const props: PropDef[] = [
  { name: 'data', type: 'Candle[]', description: 'Required. { time, open, high, low, close, volume? }, oldest first' },
  { name: 'height', type: 'number', default: '320', description: 'Height in px (the width follows the container)' },
  { name: 'volume', type: 'boolean', default: 'true', description: 'Volume bars under the candles, when the data has volume' },
  { name: 'movingAverages', type: 'number[]', default: '[]', description: 'Periods of simple moving averages, e.g. [20, 50]' },
  { name: 'visible', type: 'number', default: '60', description: 'Candles visible at first (the latest)' },
  { name: 'upColor', type: 'string', default: "'var(--color-success)'", description: 'Color of rising candles' },
  { name: 'downColor', type: 'string', default: "'var(--color-error)'", description: 'Color of falling candles' },
  { name: 'decimals', type: 'number', default: '2', description: 'Decimals of prices' },
  { name: 'currency', type: 'string', description: 'ISO 4217 code to format prices as money' },
  { name: 'lastPrice', type: 'boolean', default: 'true', description: 'Dashed line and label at the last close' },
]

const slots: SlotDef[] = [
  { name: 'legend', description: 'Replaces the O/H/L/C legend', scope: '{ candle, change, changePercent }' },
]

const events: EventDef[] = [
  { name: 'hover', payload: 'Candle | null', description: 'The candle under the crosshair' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCandlestickChart</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A candlestick (OHLC) chart for stocks, crypto, commodities or an exchange rate, in plain SVG with no chart
      library: candles, volume, moving averages, the last price and a crosshair with the candle's values. Drag or swipe
      to go back in time, Ctrl + wheel or pinch to zoom; with the chart focused, the arrow keys move the crosshair and
      <kbd>+</kbd>/<kbd>-</kbd> zoom. It isn't part of the <code>/chart</code> entry, so it needs no chart.js.
    </p>

    <ComponentDemo
      title="Daily stock prices"
      description="A year of daily candles with 20 and 50 day moving averages. reset() brings the view back to the latest candles."
      :code="`<MCandlestickChart ref=&quot;chart&quot; :data=&quot;candles&quot; :moving-averages=&quot;[20, 50]&quot; currency=&quot;USD&quot; />
<MButton variant=&quot;text&quot; @click=&quot;chart.reset()&quot;>Latest</MButton>`"
      :script="`const candles: Candle[] = [
  { time: '2026-01-02', open: 182.1, high: 184.0, low: 181.2, close: 183.6, volume: 412000 },
  …
]`"
    >
      <div class="flex w-full flex-col gap-2">
        <div class="flex flex-wrap items-center gap-2">
          <MSegmentedButton
            v-model="ma"
            multi-select
            :options="[{ value: '20', label: 'MA 20' }, { value: '50', label: 'MA 50' }, { value: '100', label: 'MA 100' }]"
          />
          <MButton variant="text" icon="last_page" class="ms-auto" @click="chart?.reset()">Latest</MButton>
        </div>
        <MCandlestickChart ref="chart" :data="daily" :moving-averages="ma.map(Number)" currency="USD" :height="360" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Live feed"
      description="One-minute candles updated twice a second: replacing the last candle moves it, appending one starts the next minute. The view stays pinned to the latest while it's in view."
      :code="`<MCandlestickChart :data=&quot;candles&quot; :decimals=&quot;1&quot; :visible=&quot;45&quot; :height=&quot;280&quot; />`"
      :script="`socket.on('trade', (price) => {
  const last = candles.value.at(-1)
  candles.value = [...candles.value.slice(0, -1), { ...last, close: price, high: Math.max(last.high, price), low: Math.min(last.low, price) }]
})`"
    >
      <div class="flex w-full flex-col gap-2">
        <MCandlestickChart :data="live" :decimals="1" :visible="45" :height="280" />
        <MButton variant="tonal" :icon="running ? 'pause' : 'play_arrow'" class="self-start" @click="running = !running">
          {{ running ? 'Pause feed' : 'Resume feed' }}
        </MButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <ComponentPager current="MCandlestickChart" />
  </div>
</template>
