<script setup lang="ts">
import { computed, ref } from 'vue'
import { MButton, MChip, MDataTable, MDateRangePicker, MIcon, MProgressBar, MSegmentedButton, MStatCard } from '@m3ui-vue/m3ui-vue'
import type { DataTableColumn } from '@m3ui-vue/m3ui-vue'
import { MChart } from '@m3ui-vue/m3ui-vue/chart'
import { useDashboard, presets } from '../useDashboard'
import { customerById, daysAgo, money } from '../data'
import StatusChip from '../components/StatusChip.vue'

const { view, range, bounds, current, stats, prevStats, trend, series, byChannel, topProducts, setPreset } = useDashboard()

const activePreset = computed(() =>
  bounds.value.end === daysAgo(0) ? presets.find((p) => p.days === bounds.value.length)?.id : undefined,
)

const cards = computed(() => [
  { title: 'Revenue', value: money(stats.value.revenue), icon: 'payments', color: 'primary' as const, trend: trend(stats.value.revenue, prevStats.value.revenue) },
  { title: 'Orders', value: stats.value.orders.toLocaleString(), icon: 'shopping_bag', color: 'secondary' as const, trend: trend(stats.value.orders, prevStats.value.orders) },
  { title: 'Average order', value: money(stats.value.average, 2), icon: 'receipt', color: 'tertiary' as const, trend: trend(stats.value.average, prevStats.value.average) },
  { title: 'Customers', value: stats.value.customers.toLocaleString(), icon: 'group', color: 'success' as const, trend: trend(stats.value.customers, prevStats.value.customers) },
])

// Revenue or orders over time, against the previous period (dashed). MChart colors the datasets from the theme
// (here primary and outline-variant, through its colors prop), following light/dark and palette changes.
const metric = ref<'revenue' | 'orders'>('revenue')
const lineData = computed(() => {
  const s = series(metric.value)
  return {
    labels: s.labels,
    datasets: [
      {
        label: 'This period',
        data: s.now,
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
      },
      {
        label: 'Previous period',
        data: s.before,
        borderDash: [6, 4],
        fill: false,
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  }
})
const lineOptions = computed(() => ({
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { position: 'bottom' },
    tooltip: { callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${metric.value === 'revenue' ? money(ctx.parsed.y) : ctx.parsed.y}` } },
  },
  scales: { y: { beginAtZero: true, ticks: { callback: (v: number) => (metric.value === 'revenue' ? money(v) : v) } } },
}))

const channelData = computed(() => ({
  labels: byChannel.value.map(([name]) => name),
  datasets: [{
    data: byChannel.value.map(([, v]) => Math.round(v)),
    borderWidth: 3,
    hoverOffset: 6,
  }],
}))
const channelOptions = {
  cutout: '68%',
  plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.label}: ${money(ctx.parsed)}` } } },
}

const recentColumns: DataTableColumn[] = [
  { key: 'id', label: 'Order' },
  { key: 'customer', label: 'Customer' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
  { key: 'total', label: 'Total', align: 'right' },
]
const recent = computed(() =>
  current.value.slice(0, 6).map((o) => ({ ...o, customer: customerById[o.customer]!.name })),
)
const maxProduct = computed(() => topProducts.value[0]?.revenue ?? 1)
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Period -->
    <div class="flex flex-wrap items-center gap-2">
      <MChip v-for="p in presets" :key="p.id" :selected="activePreset === p.id" @click="setPreset(p.days)">{{ p.label }}</MChip>
      <MDateRangePicker v-model="range" label="Custom range" class="w-full sm:ml-auto sm:w-72" />
    </div>

    <!-- Key numbers, each against the previous period of the same length -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MStatCard
        v-for="c in cards"
        :key="c.title"
        :title="c.title"
        :value="c.value"
        :icon="c.icon"
        :color="c.color"
        :trend="c.trend"
        trend-label="vs previous period"
      />
    </div>

    <!-- Over time -->
    <section class="rounded-3xl bg-surface-container-low p-4 sm:p-6">
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <div class="flex-1">
          <h2 class="text-title-large text-on-surface">{{ metric === 'revenue' ? 'Revenue' : 'Orders' }} over time</h2>
          <p class="text-body-medium text-on-surface-variant">
            {{ series(metric).bucket === 7 ? 'Per week' : 'Per day' }}, compared with the previous {{ bounds.length }} days
          </p>
        </div>
        <MSegmentedButton
          v-model="metric"
          :options="[{ value: 'revenue', label: 'Revenue' }, { value: 'orders', label: 'Orders' }]"
        />
      </div>
      <MChart type="line" :data="lineData" :options="lineOptions" :colors="['primary', 'outline-variant']" height="300px" />
    </section>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <!-- Channels -->
      <section class="rounded-3xl bg-surface-container-low p-4 sm:p-6 lg:col-span-2">
        <h2 class="text-title-large text-on-surface">Sales by channel</h2>
        <p class="mb-4 text-body-medium text-on-surface-variant">Where this period's revenue came from</p>
        <MChart type="doughnut" :data="channelData" :options="channelOptions" :colors="['primary', 'tertiary', 'secondary', 'tertiary-container']" height="260px" />
      </section>

      <!-- Products -->
      <section class="rounded-3xl bg-surface-container-low p-4 sm:p-6 lg:col-span-3">
        <h2 class="text-title-large text-on-surface">Top products</h2>
        <p class="mb-4 text-body-medium text-on-surface-variant">By revenue in this period</p>
        <ul class="flex flex-col gap-4">
          <li v-for="p in topProducts.slice(0, 5)" :key="p.id" class="flex items-center gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container">
              <MIcon :name="p.icon" :size="22" />
            </span>
            <div class="min-w-0 flex-1">
              <div class="mb-1 flex items-baseline justify-between gap-2">
                <span class="truncate text-body-large text-on-surface">{{ p.name }}</span>
                <span class="shrink-0 text-title-small tabular-nums text-on-surface">{{ money(p.revenue) }}</span>
              </div>
              <MProgressBar :value="(p.revenue / maxProduct) * 100" />
              <span class="text-label-small text-on-surface-variant">{{ p.qty }} sold</span>
            </div>
          </li>
        </ul>
      </section>
    </div>

    <!-- Latest orders -->
    <section class="rounded-3xl bg-surface-container-low p-4 sm:p-6">
      <div class="mb-3 flex items-center gap-3">
        <h2 class="flex-1 text-title-large text-on-surface">Latest orders</h2>
        <MButton variant="text" icon="arrow_forward" @click="view = 'orders'">All orders</MButton>
      </div>
      <MDataTable :columns="recentColumns" :rows="recent" row-key="id" :searchable="false" dense>
        <template #cell-status="{ value }"><StatusChip :status="value" /></template>
        <template #cell-total="{ value }"><span class="tabular-nums">{{ money(value, 2) }}</span></template>
        <template #cell-date="{ value }">{{ new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) }}</template>
      </MDataTable>
    </section>
  </div>
</template>
