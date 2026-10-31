# Max flow example

Maximum flow, step by step, built only with [m3ui-vue](https://m3ui.dev) components on `MFlow` from the library's
`/flow` entry point. Live at [m3ui.dev/examples/maxflow](https://m3ui.dev/examples/maxflow).

## Structure

```
maxflow/
├── MaxflowExample.vue       layout: top bar, the network (MFlow), the step panel (below the canvas on phones)
├── maxflow.ts               Edmonds–Karp, Dinic and wave: each runs to the end and records a frame per step
├── useNetwork.ts            the network being edited, the run and the current step
├── presets.ts               networks to start from: the textbook one, the trap for plain Ford–Fulkerson, a
│                            matching, a layered one for Dinic
└── components/
    ├── TopBar.vue           logo, presets, algorithm, theme, docs and source
    └── StepPanel.vue        the flow so far, step controls and what each step did; or the editing tools
```

## How it works

- **The algorithms** (`maxflow.ts`) work on a residual graph: every edge can take its spare capacity forwards or
  give back its flow backwards. Edmonds–Karp augments along the shortest path a BFS finds, until there's none.
  Dinic works in phases: a BFS labels each vertex with its distance from the source, then depth-first searches
  push a blocking flow along arcs that climb one level at a time. Both record every step as a frame (the flows,
  the path, the levels, an explanation), so the page can step back and forth or play them, and both end with
  the source side of a minimum cut: the vertices still reachable in the residual graph.
- **Wave** keeps Dinic's phases but finds each blocking flow as a preflow (Karzanov, Tarjan's wave method, O(V³)):
  the source floods its level arcs, forward waves push excess up the levels, a vertex that can't pass all of it on
  is blocked for the phase, and backward waves return blocked vertices' excess the way it came. The badges show
  each vertex's excess, the red halo the blocked ones.
- **Drawing**: no slots. Vertices are MFlow's own `circle` nodes and edges its default ones, restyled for every
  step (`useNetwork.ts`'s `shownNodes`/`shownEdges`): a vertex's `color`, `badge` (level or excess) and `ring`
  (reached, blocked); an edge's `label` (flow/capacity), `labelTone`, `color`, `width` (the share in use),
  `animated` (`'reverse'` where the path cancels flow) and `dashed` (the cut). MFlow animates the changes.
  Edits come back through `update:nodes`/`update:edges` and are stripped back to the network.
- **Editing**: while not running, double click the canvas to add a vertex (`pane-dblclick`), drag from a vertex's
  rim onto another to add an edge, or into empty space to add a vertex already connected (`connect-end`); click an
  edge to set its capacity, a vertex to rename it or make it the source or the sink. "Blank" starts from scratch. `isValidConnection` keeps edges out of the source and the
  sink. During a run the canvas is `locked` (it still pans and zooms).
