<script setup lang="ts">
import { computed } from 'vue'
import { MAvatar, MDataTable, MStatCard } from '@m3ui-vue/m3ui-vue'
import type { DataTableColumn } from '@m3ui-vue/m3ui-vue'
import { MChart } from '@m3ui-vue/m3ui-vue/chart'
import { useDashboard } from '../useDashboard'
import { money } from '../data'
import { useThemeColors } from '../useThemeColors'

const { customerRows, byCountry, bounds } = useDashboard()
const colors = useThemeColors()

const returning = computed(() => customerRows.value.filter((c) => c.orders > 1).length)
const newOnes = computed(() => customerRows.value.filter((c) => c.since >= bounds.value.start).length)
const best = computed(() => customerRows.value[0])

const countryData = computed(() => ({
  labels: byCountry.value.map(([c]) => c),
  datasets: [{
    label: 'Revenue',
    data: byCountry.value.map(([, v]) => Math.round(v)),
    backgroundColor: colors.value.tertiary,
    borderRadius: 8,
    maxBarThickness: 28,
  }],
}))
const countryOptions = {
  indexAxis: 'y',
  plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${money(ctx.parsed.x)}` } } },
  scales: { x: { ticks: { callback: (v: number) => money(v) } } },
}

const columns: DataTableColumn[] = [
  { key: 'name', label: 'Customer', sortable: true },
  { key: 'country', label: 'Country', sortable: true },
  { key: 'orders', label: 'Orders', sortable: true, align: 'right' },
  { key: 'spent', label: 'Spent', sortable: true, align: 'right' },
  { key: 'last', label: 'Last order', sortable: true },
  { key: 'since', label: 'Customer since', sortable: true },
]
const date = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <MStatCard title="Active customers" :value="customerRows.length" icon="group" color="primary" trend-label="ordered in this period" />
      <MStatCard title="Returning" :value="returning" icon="repeat" color="secondary" :trend-label="`${Math.round((returning / (customerRows.length || 1)) * 100)}% ordered more than once`" />
      <MStatCard title="New" :value="newOnes" icon="person_add" color="tertiary" trend-label="first order in this period" />
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <section class="rounded-3xl bg-surface-container-low p-4 sm:p-6 lg:col-span-3">
        <h2 class="text-title-large text-on-surface">Revenue by country</h2>
        <p class="mb-4 text-body-medium text-on-surface-variant">Where your customers order from</p>
        <MChart type="bar" :data="countryData" :options="countryOptions" height="280px" />
      </section>

      <section v-if="best" class="flex flex-col items-center justify-center gap-3 rounded-3xl bg-primary-container p-6 text-center text-on-primary-container lg:col-span-2">
        <p class="text-label-large">Top customer this period</p>
        <MAvatar :name="best.name" :size="72" />
        <p class="text-headline-small">{{ best.name }}</p>
        <p class="text-body-medium opacity-80">{{ best.country }} · customer since {{ date(best.since) }}</p>
        <p class="text-display-small tabular-nums">{{ money(best.spent) }}</p>
        <p class="text-body-medium opacity-80">across {{ best.orders }} orders</p>
      </section>
    </div>

    <section class="rounded-3xl bg-surface-container-low p-2 sm:p-4">
      <MDataTable :columns="columns" :rows="customerRows" row-key="id" searchable search-placeholder="Search customers…" :per-page="10" sticky-header>
        <template #cell-name="{ row }">
          <span class="flex items-center gap-3">
            <MAvatar :name="row.name" :size="32" />
            <span>
              <span class="block text-on-surface">{{ row.name }}</span>
              <span class="block text-body-small text-on-surface-variant">{{ row.email }}</span>
            </span>
          </span>
        </template>
        <template #cell-spent="{ value }"><span class="tabular-nums">{{ money(value, 2) }}</span></template>
        <template #cell-last="{ value }">{{ date(value) }}</template>
        <template #cell-since="{ value }">{{ date(value) }}</template>
      </MDataTable>
    </section>
  </div>
</template>
