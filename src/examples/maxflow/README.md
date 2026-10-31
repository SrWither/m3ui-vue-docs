# Max flow example

Maximum flow, step by step, built only with [m3ui-vue](https://m3ui.dev) components on `MFlow` from the library's
`/flow` entry point. Live at [m3ui.dev/examples/maxflow](https://m3ui.dev/examples/maxflow).

## Structure

```
maxflow/
├── MaxflowExample.vue       layout: top bar, the network (MFlow), the step panel (below the canvas on phones)
├── maxflow.ts               Edmonds–Karp and Dinic: each runs to the end and records a frame per step
├── useNetwork.ts            the network being edited, the run and the current step
├── presets.ts               networks to start from: the textbook one, the trap for plain Ford–Fulkerson, a
│                            matching, a layered one for Dinic
└── components/
    ├── TopBar.vue           logo, presets, algorithm, theme, docs and source
    ├── Vertex.vue           a vertex (#node-vertex): source, sink, reached by the search, level, side of the cut
    ├── NetEdge.vue          an edge (#edge-net): a straight line between the vertices with flow/capacity, thicker
    │                        the more it carries; the augmenting path and the minimum cut
    └── StepPanel.vue        the flow so far, step controls and what each step did; or the editing tools
```

## How it works

- **The algorithms** (`maxflow.ts`) work on a residual graph: every edge can take its spare capacity forwards or
  give back its flow backwards. Edmonds–Karp augments along the shortest path a BFS finds, until there's none.
  Dinic works in phases: a BFS labels each vertex with its distance from the source, then depth-first searches
  push a blocking flow along arcs that climb one level at a time. Both record every step as a frame (the flows,
  the path, the levels, an explanation), so the page can step back and forth or play them, and both end with
  the source side of a minimum cut: the vertices still reachable in the residual graph.
- **Drawing**: vertices and edges are MFlow slots. Each vertex has two `MFlowHandle`s: the target at its center
  (with `pointer-events-none`, so the circle still drags) and the source on its right edge, to draw new edges from.
  `#edge-net` gets both handles' positions and draws its own straight line between the centers, so edges can run
  in any direction; opposite edges between two vertices sit side by side.
- **Editing**: while not running, move vertices, draw edges (capacity 5 to start), click one to set its capacity,
  rename vertices or make one the source or the sink. `isValidConnection` keeps edges out of the source and the
  sink. During a run the canvas is `locked` (it still pans and zooms).
