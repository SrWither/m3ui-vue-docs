# Dashboard example

Store analytics built only with [m3ui-vue](https://m3ui.dev) components. Live at
[m3ui.dev/examples/dashboard](https://m3ui.dev/examples/dashboard).

## Structure

```
dashboard/
├── DashboardExample.vue   MNavigationSuite + top bar + the current view + MCommandPalette (Ctrl/⌘ K)
├── data.ts                a year of seeded fake orders, customers and products (same on every load)
├── useDashboard.ts        view, date range, and every metric derived from the orders in range
├── useThemeColors.ts      theme colors as strings for Chart.js, re-read on theme/palette changes
├── components/
│   ├── TopBar.vue         title, search button, theme, back to the docs
│   └── StatusChip.vue     order status as an MChip
└── views/
    ├── OverviewView.vue   period chips + MDateRangePicker, MStatCards, line/doughnut MCharts, top products, latest orders
    ├── OrdersView.vue     status filters, MDataTable (search, sort, select, expandable rows, column toggle), MExportButton
    └── CustomersView.vue  customer stats, revenue by country (bar MChart), customers MDataTable
```

## How it works

- **Every number is computed** from the orders in the selected range (`useDashboard.ts`), and each stat card's
  trend compares it with the previous period of the same length. Long ranges switch the chart to weekly buckets.
- **Charts** come from the `/chart` entry (`import { MChart } from '@m3ui-vue/m3ui-vue/chart'`, which needs the
  optional `chart.js` and `vue-chartjs` peers). MChart styles axes, legend and tooltips from the theme; the
  dataset colors are read from the theme's CSS variables by `useThemeColors.ts`, so they follow light/dark and
  palette changes.
- **Navigation adapts**: `MNavigationSuite` shows a bottom bar on phones and a rail on tablets, and the example
  forces the expanded rail (`layout="rail-expanded"`) on large windows using `useWindowSizeClass()`.
- **The command palette** (`MCommandPalette`, Ctrl/⌘ K or the search field) jumps between views, changes the
  period, the theme or the palette, and links back to the docs.
