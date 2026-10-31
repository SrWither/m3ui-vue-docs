# Floor example

Seated, a restaurant host stand built only with [m3ui-vue](https://m3ui.dev) components on the Floor plan family
(`MFloorPlan`, `MFloorPlanToolbar`, `MFloorPlanInspector`). Live at
[m3ui.dev/examples/floor](https://m3ui.dev/examples/floor).

## Structure

```
floor/
├── FloorExample.vue        layout: top bar, the plan, the side panel (bottom sheets on phones)
├── useFloor.ts             two rooms (tables, zones, walls, decor, merges), each table's service, servers, the
│                           waitlist, two decor kinds of its own (host stand, TV)
└── components/
    ├── TopBar.vue          logo, the room, Service or Layout, covers, more
    ├── TablePanel.vue      the picked table: guests, minutes, bill; seat, bill, clear, clean, reserve, join, split
    └── Waitlist.vue        who's waiting, for how long, and the table that fits them best
```

## How it works

- **The layout and the service are kept apart**: a room's tables are only where they are and their seats; what's
  happening at each one (status, party, since when, the bill) lives in a map by table id. In service the plan gets
  the tables with `status` and a `badge` added (minutes seated, or the bill once it's asked for), and `statuses`
  maps each status to a color role and an icon.
- **Service**: `selectable="single"` picks a table and opens its panel. Joining switches to `"multiple"`: pick as many
  tables as you like and Join calls the plan's `merge()` with them; `canMerge` refuses two open bills (`merge-refused` shows why).
  The `#overlay` slot puts each server's initials beside their tables, in plan units (`toPx`). The waitlist
  suggests the smallest free table or joined group that fits each party, in either room. Minutes tick every 30 s.
- **Layout**: `editable`; `MFloorPlanToolbar` (move / wall / zone, table presets including a stool, the decor kinds
  with the app's own, duplicate, delete, undo) and `MFloorPlanInspector`, both given the plan's template ref
  (`:plan`) since they sit outside it. The inspector's `#table` slot adds a Server field (`table.data.server`)
  whose `update` is an undo step like the built-in fields. Every v-model goes back into the room.
- **Saved** in localStorage; More › Start the sample night again resets it.
