# Floor example

Seated, a restaurant host stand built only with [m3ui-vue](https://m3ui.dev) components on `MFloorPlan`. Live at
[m3ui.dev/examples/floor](https://m3ui.dev/examples/floor).

## Structure

```
floor/
├── FloorExample.vue        layout: top bar, the plan, the side panel (bottom sheets on phones)
├── useFloor.ts             two rooms (tables, zones, walls, decor, merges), each table's service, the waitlist
└── components/
    ├── TopBar.vue          logo, the room, Service or Layout, covers, more
    ├── TablePanel.vue      the picked table: guests, minutes, bill; seat, bill, clear, clean, reserve, join, split
    ├── Waitlist.vue        who's waiting, for how long, and the table that fits them best
    └── LayoutPanel.vue     the plan's tool, tables and decor to add, the picked table's settings
```

## How it works

- **The layout and the service are kept apart**: a room's tables are only where they are and their seats; what's
  happening at each one (status, party, since when, the bill) lives in a map by table id. In service the plan gets
  the tables with `status` and a `badge` added (minutes seated, or the bill once it's asked for), and `statuses`
  maps each status to a color role and an icon.
- **Service**: `table-click` picks a table and opens its panel; joining waits for the next click and adds a
  `merges` entry (the plan draws the group); the waitlist suggests the smallest free table or joined group that fits
  each party, in either room. Minutes tick every 30 seconds.
- **Layout**: `editable` with `v-model:tool` (move, wall, zone); the plan's `update:tables`, `update:areas`,
  `update:walls` and `update:decor` go back into the room. Tables and decor are added at the middle of the plan.
- **Saved** in localStorage; More › Start the sample night again resets it.
