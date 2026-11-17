<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { MOrderBook, MSegmentedButton, MNumberField, MButton, MCard } from '@m3ui-vue/m3ui-vue'
import type { OrderBookLevel } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

// A simulated market around a drifting mid price
let mid = 64_250
function side(dir: 1 | -1): OrderBookLevel[] {
  return Array.from({ length: 40 }, (_, i) => {
    const price = Math.round((mid + dir * (0.5 + i * 0.5 + Math.random() * 0.4)) * 10) / 10
    return [price, Math.round((0.05 + Math.random() * (0.4 + i * 0.05)) * 10_000) / 10_000] as OrderBookLevel
  })
}
const bids = ref<OrderBookLevel[]>(side(-1))
const asks = ref<OrderBookLevel[]>(side(1))
const last = ref(mid)
const step = ref<number>(0.5)

function update() {
  mid += (Math.random() - 0.5) * 4
  // Change a few levels per tick, like a real feed
  const next = (levels: OrderBookLevel[], dir: 1 | -1) => {
    const fresh = side(dir)
    return levels.map((l, i) => (Math.random() < 0.25 ? fresh[i]! : l))
  }
  bids.value = next(bids.value, -1).filter(([p]) => p < mid)
  asks.value = next(asks.value, 1).filter(([p]) => p > mid)
  if (bids.value.length < 20) bids.value = side(-1)
  if (asks.value.length < 20) asks.value = side(1)
  last.value = Math.round(mid * 10) / 10
}
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => (timer = setInterval(update, 900)))
onBeforeUnmount(() => clearInterval(timer))

const limit = ref<number | null>(null)

const props: PropDef[] = [
  { name: 'bids', type: 'OrderBookLevel[]', description: 'Required. Buy orders as [price, size], any order' },
  { name: 'asks', type: 'OrderBookLevel[]', description: 'Required. Sell orders as [price, size], any order' },
  { name: 'levels', type: 'number', default: '10', description: 'Levels shown per side' },
  { name: 'step', type: 'number', description: 'Groups prices into buckets of this size (bids round down, asks up)' },
  { name: 'decimals', type: 'number', default: 'from step, or 2', description: 'Decimals of prices' },
  { name: 'sizeDecimals', type: 'number', default: '4', description: 'Decimals of sizes' },
  { name: 'lastPrice', type: 'number', description: 'Last traded price in the middle; its arrow follows the previous value' },
  { name: 'layout', type: "'stacked' | 'split'", default: "'stacked'", description: 'Asks above bids, or side by side' },
  { name: 'flash', type: 'boolean', default: 'true', description: 'Flashes levels whose size changed' },
  { name: 'bidColor', type: 'string', default: "'var(--color-success)'", description: 'Color of bids' },
  { name: 'askColor', type: 'string', default: "'var(--color-error)'", description: 'Color of asks' },
]

const slots: SlotDef[] = [
  { name: 'middle', description: 'Replaces the last price / spread row', scope: '{ lastPrice, direction, spread, spreadPercent }' },
]

const events: EventDef[] = [
  { name: 'select', payload: '{ price, size, side }', description: 'A level was clicked' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MOrderBook</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A live order book for an exchange or trading screen: asks and bids with their sizes, running totals and depth
      bars, and the last price and spread between them. Levels whose size changes flash, <code>step</code> groups
      levels into coarser buckets, and clicking a level emits it, e.g. to fill the price of an order form.
    </p>

    <ComponentDemo
      title="Live book with grouping"
      description="A simulated feed updating every second. Change the grouping; click a level to use its price in the order form."
      :code="`<MSegmentedButton v-model=&quot;step&quot; :options=&quot;[{ value: 0.1, label: '0.1' }, { value: 0.5, label: '0.5' }, { value: 1, label: '1' }, { value: 5, label: '5' }]&quot; />
<MOrderBook
  :bids=&quot;bids&quot;
  :asks=&quot;asks&quot;
  :step=&quot;step&quot;
  :last-price=&quot;last&quot;
  :size-decimals=&quot;4&quot;
  @select=&quot;({ price }) => (limit = price)&quot;
/>`"
      :script="`const bids = ref<OrderBookLevel[]>([[64249.5, 0.42], [64249, 1.1], …])
const asks = ref<OrderBookLevel[]>([[64250.5, 0.3], …])
socket.on('book', (b) => { bids.value = b.bids; asks.value = b.asks })`"
    >
      <div class="grid w-full gap-6 md:grid-cols-[minmax(0,22rem)_1fr]">
        <div class="flex flex-col gap-2">
          <MSegmentedButton
            v-model="step"
            density="compact"
            :options="[{ value: 0.1, label: '0.1' }, { value: 0.5, label: '0.5' }, { value: 1, label: '1' }, { value: 5, label: '5' }]"
          />
          <MOrderBook :bids="bids" :asks="asks" :step="step" :last-price="last" @select="({ price }) => (limit = price)" />
        </div>
        <MCard variant="outlined" class="flex h-fit flex-col gap-3 p-4">
          <p class="text-title-medium">Limit order · BTC/USD</p>
          <MNumberField v-model="limit" label="Price" :step="step" />
          <div class="flex gap-2">
            <MButton class="flex-1" :disabled="!limit">Buy</MButton>
            <MButton class="flex-1" color="error" :disabled="!limit">Sell</MButton>
          </div>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Split layout"
      description="layout=&quot;split&quot; puts bids and asks side by side, with the depth bars growing from the middle. Fewer levels for a compact widget."
      :code="`<MOrderBook :bids=&quot;bids&quot; :asks=&quot;asks&quot; layout=&quot;split&quot; :levels=&quot;8&quot; :step=&quot;1&quot; :last-price=&quot;last&quot; />`"
    >
      <MOrderBook class="w-full max-w-xl" :bids="bids" :asks="asks" layout="split" :levels="8" :step="1" :last-price="last" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />

    <ComponentPager current="MOrderBook" />
  </div>
</template>
