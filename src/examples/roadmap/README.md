# Roadmap example

A project planner, built only with [m3ui-vue](https://m3ui.dev) components, on `MGantt` from the library's `/gantt`
entry point. Live at [m3ui.dev/examples/roadmap](https://m3ui.dev/examples/roadmap).

## Structure

```
roadmap/
├── RoadmapExample.vue      layout: top bar, the project's figures, the chart (MGantt with MGanttControls and an
│                           owner column), the task editor (a side panel, an MSideSheet on phones)
├── useProject.ts           the tasks (dated around today), the people, the view's switches
└── components/
    ├── TopBar.vue          logo, the project's name, critical path / baselines / auto schedule, import and export
    └── TaskEditor.vue      the selected task: name, owner, dates, milestone, progress, color, predecessors
```

## How it works

- **Planning**: drag a bar to move it, its ends to resize it, the triangle under it for progress. With auto
  schedule on (the default), everything that waits on a task follows it, counting working days. Drag from the dot
  at a bar's end onto another bar to make one wait for the other (the ends you pick decide the kind: finish to
  start, start to start…); click a dependency for its × to remove it.
- **Tasks**: double click a bar or a row (Enter on the keyboard) to edit it in the side panel; Add task puts a
  new one after the selected task, or inside the selected phase. Rows reorder by dragging them in the list, and
  Ctrl + ] / [ indent and outdent. Ctrl + Z undoes anything.
- **Reading the plan**: the critical path (in red) is what sets the launch date; hover a bar to see how many days
  it can slip. Baselines draw the plan as first agreed under each task, and the header says how far behind it is.
- **Files**: export to CSV (for a spreadsheet), JSON (everything), or Microsoft Project XML, which Project,
  ProjectLibre and GanttProject open; import any of the three, e.g. a plan saved from one of those tools.
