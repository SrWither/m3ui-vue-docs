<script setup lang="ts">
/*
 * Dashboard example: store analytics built only with m3ui-vue.
 * - MNavigationSuite     bottom bar on phones, rail on tablets, expanded rail on large screens
 * - TopBar.vue           title, search / command palette, theme, back to the docs
 * - views/*.vue          Overview (stats + charts), Orders and Customers (data tables)
 * - useDashboard.ts      view, date range and every metric derived from the orders
 * - data.ts              a year of seeded fake orders, customers and products
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MCommandPalette, MNavigationSuite, palettes, useColorPalette, useTheme, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import type { CommandItem, NavigationSuiteItem } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { useDashboard, presets, type View } from './useDashboard'
import { orders } from './data'
import TopBar from './components/TopBar.vue'
import OverviewView from './views/OverviewView.vue'
import OrdersView from './views/OrdersView.vue'
import CustomersView from './views/CustomersView.vue'

const router = useRouter()
const { view, setPreset } = useDashboard()
const { theme } = useTheme()
const { set: setPalette } = useColorPalette()

const pending = orders.filter((o) => o.status === 'pending').length
const items: NavigationSuiteItem[] = [
  { value: 'overview', label: 'Overview', icon: 'monitoring' },
  { value: 'orders', label: 'Orders', icon: 'receipt_long', badge: pending || undefined },
  { value: 'customers', label: 'Customers', icon: 'group' },
]
const views = { overview: OverviewView, orders: OrdersView, customers: CustomersView }

// The window decides: an expanded rail with labels only where there's plenty of room.
const { widthClass } = useWindowSizeClass()
const layout = computed(() => (widthClass.value === 'large' || widthClass.value === 'extra-large' ? 'rail-expanded' : 'auto'))

// The new view starts at the top: MNavigationSuite's content area is the scroller.
const page = ref<HTMLElement>()
const toTop = () => page.value?.parentElement?.scrollTo({ top: 0 })

const palette = ref(false)
const commands = computed<CommandItem[]>(() => [
  ...items.map((i) => ({ id: `go-${i.value}`, label: `Go to ${i.label}`, icon: i.icon, group: 'Navigate', onSelect: () => (view.value = i.value as View) })),
  ...presets.map((p) => ({ id: `range-${p.id}`, label: p.label, icon: 'date_range', group: 'Date range', onSelect: () => setPreset(p.days) })),
  { id: 'theme-light', label: 'Light theme', icon: 'light_mode', group: 'Appearance', onSelect: () => (theme.value = 'light') },
  { id: 'theme-dark', label: 'Dark theme', icon: 'dark_mode', group: 'Appearance', onSelect: () => (theme.value = 'dark') },
  { id: 'palette-random', label: 'Random palette', icon: 'palette', group: 'Appearance', onSelect: () => setPalette(palettes[Math.floor(Math.random() * palettes.length)]!.id) },
  { id: 'source', label: 'View source on GitHub', icon: 'code', group: 'Example', onSelect: () => window.open(exampleSource('dashboard'), '_blank', 'noopener') },
  { id: 'docs', label: 'Back to the docs', icon: 'menu_book', group: 'Example', onSelect: () => router.push('/examples') },
])
</script>

<template>
  <MNavigationSuite v-model="view" :items="items" :layout="layout" class="h-dvh">
    <div ref="page" class="flex min-h-full flex-col bg-surface">
      <TopBar @search="palette = true" />
      <main class="mx-auto w-full max-w-7xl flex-1 px-4 pb-8 sm:px-6">
        <!-- Same page transition as the docs -->
        <Transition name="m3d-page" mode="out-in" @after-leave="toTop">
          <component :is="views[view]" :key="view" />
        </Transition>
      </main>
    </div>
  </MNavigationSuite>

  <MCommandPalette v-model="palette" :items="commands" placeholder="Search for a command…" />
</template>

<style scoped>
/* The same page transition as the docs: a short fade with a 6px slide up. */
.m3d-page-enter-active,
.m3d-page-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.m3d-page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.m3d-page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
@media (prefers-reduced-motion: reduce) {
  .m3d-page-enter-active,
  .m3d-page-leave-active {
    transition: none;
  }
}
</style>
