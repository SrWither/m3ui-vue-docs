<script setup lang="ts">
import { computed, ref } from 'vue'
import { MChip, MDataTable, MExportButton, MIcon } from '@m3ui-vue/m3ui-vue'
import type { DataTableColumn } from '@m3ui-vue/m3ui-vue'
import { useDashboard } from '../useDashboard'
import { customerById, money, productById, type OrderStatus } from '../data'
import StatusChip from '../components/StatusChip.vue'

const { current, bounds } = useDashboard()

const statuses: (OrderStatus | 'all')[] = ['all', 'pending', 'paid', 'shipped', 'delivered', 'refunded']
const status = ref<OrderStatus | 'all'>('all')
const count = (s: OrderStatus | 'all') => (s === 'all' ? current.value.length : current.value.filter((o) => o.status === s).length)

const columns: DataTableColumn[] = [
  { key: 'id', label: 'Order', sortable: true, width: '110px' },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'country', label: 'Country', sortable: true },
  { key: 'channel', label: 'Channel', sortable: true },
  { key: 'items', label: 'Items', sortable: true, align: 'right' },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'total', label: 'Total', sortable: true, align: 'right' },
]

// Flat rows (sortable, searchable values) built from the orders in the selected range.
const rows = computed(() =>
  current.value
    .filter((o) => status.value === 'all' || o.status === status.value)
    .map((o) => {
      const c = customerById[o.customer]!
      return {
        id: o.id,
        date: o.date,
        customer: c.name,
        email: c.email,
        country: c.country,
        channel: o.channel,
        items: o.lines.reduce((n, l) => n + l.qty, 0),
        status: o.status,
        total: o.total,
        lines: o.lines,
      }
    }),
)

const selected = ref<Record<string, any>[]>([])
// Export what's selected, or everything the filters show; without the nested lines.
const exportRows = computed(() => (selected.value.length ? selected.value : rows.value).map(({ lines, ...r }) => r))
const label = (s: string) => s[0]!.toUpperCase() + s.slice(1)
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-body-medium text-on-surface-variant">
      {{ current.length }} orders from {{ new Date(`${bounds.start}T00:00:00`).toLocaleDateString() }} to {{ new Date(`${bounds.end}T00:00:00`).toLocaleDateString() }}.
      Change the period on Overview or from the command palette.
    </p>

    <div class="flex flex-wrap gap-2">
      <MChip v-for="s in statuses" :key="s" :selected="status === s" @click="status = s">
        {{ s === 'all' ? 'All' : label(s) }} · {{ count(s) }}
      </MChip>
    </div>

    <section class="rounded-3xl bg-surface-container-low p-2 sm:p-4">
      <MDataTable
        v-model="selected"
        :columns="columns"
        :rows="rows"
        row-key="id"
        selectable
        searchable
        search-placeholder="Search orders, customers, countries…"
        expandable
        column-toggle
        sticky-header
        :per-page="10"
      >
        <template #toolbar>
          <MExportButton
            :data="exportRows"
            format="csv"
            filename="orders"
            :label="selected.length ? `Export ${selected.length} selected` : 'Export CSV'"
            variant="tonal"
          />
        </template>
        <template #cell-date="{ value }">{{ new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) }}</template>
        <template #cell-customer="{ row }">
          <span class="block text-on-surface">{{ row.customer }}</span>
          <span class="block text-body-small text-on-surface-variant">{{ row.email }}</span>
        </template>
        <template #cell-status="{ value }"><StatusChip :status="value" /></template>
        <template #cell-total="{ value }"><span class="tabular-nums">{{ money(value, 2) }}</span></template>

        <!-- Expanded row: the order's lines -->
        <template #row-expand="{ row }">
          <div class="flex flex-col gap-1 py-2">
            <div v-for="l in row.lines" :key="l.product" class="flex items-center gap-3">
              <MIcon :name="productById[l.product]!.icon" :size="20" class="text-on-surface-variant" />
              <span class="flex-1 text-body-medium text-on-surface">{{ productById[l.product]!.name }}</span>
              <span class="text-body-medium tabular-nums text-on-surface-variant">{{ l.qty }} × {{ money(l.price, 2) }}</span>
              <span class="w-24 text-right text-body-medium tabular-nums text-on-surface">{{ money(l.qty * l.price, 2) }}</span>
            </div>
          </div>
        </template>
      </MDataTable>
    </section>
  </div>
</template>
