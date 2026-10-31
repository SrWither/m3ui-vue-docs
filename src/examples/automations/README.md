# Automations example

A workflow builder in the style of n8n or Zapier, built only with [m3ui-vue](https://m3ui.dev) components, on
`MFlow` from the library's `/flow` entry point. Live at [m3ui.dev/examples/automations](https://m3ui.dev/examples/automations).

## Structure

```
automations/
├── AutomationsExample.vue   layout: top bar, the palette, the canvas (MFlow with controls, minimap, the run log and
│                            the add menu), the inspector (an MSideSheet on phones), the palette in an MBottomSheet
├── useWorkflow.ts           the workflow (nodes, edges, name) and the test run that steps through it
├── catalog.ts               the kinds of steps: triggers, actions, logic, and their settings
└── components/
    ├── TopBar.vue           logo, the workflow's name, tidy up, test run, theme, docs and source
    ├── Palette.vue          every kind of step, to drag onto the canvas or tap to add
    ├── StepNode.vue         a step: an MFlowNode in its category's color with its run status; a condition gets
    │                        an MFlowHandle per branch
    ├── Inspector.vue        the selected step's name and settings; duplicate and delete
    ├── RunLog.vue           the last run, step by step
    └── AddMenu.vue          what to add where a connection was dropped on nothing
```

## How it works

- **Building**: drag a step from the palette onto the canvas (or tap it to add it in the middle). As soon as it's
  over the canvas it becomes a real node that MFlow drags on (`addNodes` + `startDrag`), so it can go straight onto
  an edge, where it splices in between two steps. Then drag from a
  step's right handle to the next one. Drop a connection on empty canvas to pick a step to add there, already
  connected. Click an edge for its × to disconnect, or pull a connected input away. Delete, Ctrl+Z, Ctrl+C / V
  and Shift + drag (select several) are MFlow's own; "Tidy up" runs its layered layout.
- **Steps** are `#node-step` / `#node-branch` slots drawing an `MFlowNode`. A condition has two source handles,
  `yes` and `no`; edges name the one they leave from in `sourceHandle`.
- **Test run** (Ctrl+Enter): from every trigger, each step runs in turn (a short wait each), and a condition sends
  the run down the branch its "In test runs, take" setting picks; the other side is skipped. A step missing a
  required setting fails and stops its branch. Edges are an `#edge-flow` slot that lights up and animates while the
  run goes through, using `arrowPath` from the library for the arrowheads.
- Everything stays in memory (`useWorkflow.ts` keeps it at module level, so it survives going back to the docs).
