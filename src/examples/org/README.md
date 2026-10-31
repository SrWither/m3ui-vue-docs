# Org chart example

A company's org chart built only with [m3ui-vue](https://m3ui.dev) components, on `MFlow` and its tree layout from
the library's `/flow` entry point. Live at [m3ui.dev/examples/org](https://m3ui.dev/examples/org).

## Structure

```
org/
├── OrgExample.vue           layout: top bar, the chart (MFlow with direction, department filters, fold buttons,
│                            controls and minimap), the profile (an MSideSheet on phones)
├── useOrg.ts                who reports to whom, folded teams, the department filter; the chart's nodes and edges
├── people.ts                the company: 28 made-up people in six departments
└── components/
    ├── TopBar.vue           logo, people search (opens the person on the chart), theme, docs and source
    ├── PersonNode.vue       a person's card, with the button under it that folds their team
    └── Profile.vue          the selected person: contact, manager and direct reports
```

## How it works

- **Layout**: `MFlow` with `layout="tree"` lays the chart out whenever its shape changes (someone folded, unfolded,
  moved), and every card springs to its new place. Top down or left to right is MFlow's `direction`. Positions are
  MFlow's: `useOrg.ts` keeps them when it rebuilds the nodes, and a person who appears starts at their manager's
  spot, so they spring out from there.
- **Folding**: the button under a card (or a double click) hides everyone below that person (`hidden` nodes).
- **Changing managers**: drag a person onto someone else; while dragging, `getIntersectingNodes` finds who's under
  them and that card offers itself. Drop to move the person and their whole team (a toast offers Undo); drop
  anywhere else and they go back to their place. Nobody can be moved under their own team.
- **Finding people**: the search unfolds the way to the person, selects them and flies there with `setCenter`.
- Edges have no handles: they run between the cards' sides (bottom to top, or right to left).
