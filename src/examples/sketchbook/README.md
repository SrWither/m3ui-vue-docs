# Sketchbook example

Quill, boards and notebooks to draw and write in, built only with [m3ui-vue](https://m3ui.dev) components on
`MDrawCanvas` from the library's `/draw` entry point. Live at [m3ui.dev/examples/sketchbook](https://m3ui.dev/examples/sketchbook).

## Structure

```
sketchbook/
├── SketchbookExample.vue   layout: top bar, the documents, the canvas with its toolbar and layers
├── useNotebooks.ts         the documents (boards and notebooks), three samples, kept in localStorage
└── components/
    ├── TopBar.vue          logo, the title (click to rename), paper, export, theme, docs and source
    └── DocList.vue         the documents, newest first, with thumbnails; new board or notebook
```

## How it works

- **A document** is plain data: MDrawCanvas' items (strokes, shapes, texts), its layers, the paper (`background`),
  a board (`mode="infinite"`) or a notebook (`mode="pages"`, A5-ish pages stacked down). Every edit goes through
  `v-model`, so saving is watching the list (debounced into localStorage).
- **Thumbnails** come from `toDrawSvg` (the library's pure export), the first page or the whole board as an SVG
  data URL: no canvas is mounted for them.
- **The pen** (tool, color, size) is the app's, shared by every document; each document opens fitted to the view.
- **Toolbar**: MDrawToolbar with its `#end` slot holding Layers (shows MDrawLayers), Add a page and Fit.
- **Export**: PNG and SVG of the board, or of the page in the middle of the view (worked out from the viewport),
  through the canvas' `exportPng()` / `exportSvg()`; JSON is the document itself.
- **Trace a photo** shows `backgroundImage` under a page, with an Ink layer to draw on.
