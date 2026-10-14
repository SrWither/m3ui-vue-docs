<script setup lang="ts">
import { MChip } from '@m3ui-vue/m3ui-vue'
import type { OrderStatus } from '../data'

defineProps<{ status: OrderStatus }>()

const look: Record<OrderStatus, { tone: string; icon: string; label: string }> = {
  pending: { tone: 'tertiary', icon: 'schedule', label: 'Pending' },
  paid: { tone: 'primary', icon: 'payments', label: 'Paid' },
  shipped: { tone: 'secondary', icon: 'local_shipping', label: 'Shipped' },
  delivered: { tone: 'success', icon: 'check_circle', label: 'Delivered' },
  refunded: { tone: 'error', icon: 'undo', label: 'Refunded' },
}
</script>

<template>
  <MChip :tone="look[status].tone" :icon="look[status].icon" class="pointer-events-none">{{ look[status].label }}</MChip>
</template>
