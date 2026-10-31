# Shifts example

A restaurant's staff rota, built only with [m3ui-vue](https://m3ui.dev) components, on `MResourceTimeline` from the
library's `/gantt` entry point. Live at [m3ui.dev/examples/shifts](https://m3ui.dev/examples/shifts).

## Structure

```
shifts/
├── ShiftsExample.vue         layout: top bar, the kind of shift to add and the overlap switch, the timeline (staff
│                             grouped by section, each with their hours this week against their contract), the
│                             shift editor (a dialog, a bottom sheet on phones)
├── useRota.ts                the staff, the kinds of shift (opening, lunch, dinner, closing), two weeks of shifts
└── components/
    ├── TopBar.vue            logo, the week shown (previous, this week, next), theme, docs and source
    └── ShiftEditor.vue       a shift's kind, person, day and hours
```

## How it works

- **Moving shifts**: drag a shift along its row to another time, or onto someone else's row to hand it over; pull
  its ends to make it longer or shorter. Everything snaps to 15 minutes. On a phone, press a shift a moment to
  pick it up (a swipe scrolls), and pinch to zoom. With a shift focused, the arrow keys move it (↑/↓ to another
  person) and Shift + ←/→ changes its end.
- **Adding**: pick a kind of shift above, then drag across empty time on someone's row. Double click a shift (or
  press Enter) to change its kind, person, day or hours; a closing shift that ends after midnight runs into the
  next day.
- **Overlaps**: two shifts of one person at once share their row and are outlined in red; the chip above jumps
  to them. With "Prevent overlaps" on, a drop that would make one springs back.
- **Hours**: each person shows the hours they work this week against their contract, in red when over.
- **Undo**: Ctrl + Z, or the toolbar's undo, after any change.
