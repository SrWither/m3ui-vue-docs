# Photo editor example ("Lightbench")

A photo editor built only with [m3ui-vue](https://m3ui.dev) components and a `<canvas>`. Live at
[m3ui.dev/examples/photo](https://m3ui.dev/examples/photo). Photos you open never leave the browser.

It's the showcase for menus and toolbars: a desktop-style menu bar, right-click menus on the canvas and on layers, a
vertical tool rail and a floating toolbar with the current tool's options.

## Structure

```
photo/
├── PhotoExample.vue        menu bar (wide) or top bar + modes (phones), canvas, side panel, status bar, MHotkeys, dialogs
├── usePhoto.ts             the document, tools, view (zoom/pan), layers, painting, crop, rendering and the undo history
├── imaging.ts              adjustments, filter presets, straighten, histogram and "auto", on plain ImageData
├── samples.ts              the sample photos, painted on a canvas from a seed
└── components/
    ├── Stage.vue           the canvas: zoom and pan, brush/eraser, text, color picker, crop frame, MContextMenu, file drop
    ├── MenuSection.vue     one menu's items, shared by the menu bar (flyout submenus) and the phone ⋮ menu (push submenus)
    ├── ToolRail.vue        vertical floating MToolbar of tools with tooltips, and hold-to-compare
    ├── ToolOptions.vue     the tool's options: a floating toolbar on wide screens, a panel on phones
    ├── ColorButton.vue     swatch menu with "Custom…" (MColorPickerModal)
    ├── AdjustPanel.vue     MSlider groups (centered for ± values), Auto, Reset; Histogram.vue
    ├── FiltersPanel.vue    preset thumbnails rendered from the photo, strength slider
    ├── LayersPanel.vue     MDragDropList of layers (grip to reorder), visibility, ⋮ and right-click menus, opacity, blend
    ├── LayerMenuItems.vue  a layer's actions, used by three different menus
    ├── HistoryPanel.vue    MList of steps; click one to go back to it
    └── *Dialog.vue         export, open (samples + MFileUpload), edit text, stickers (MEmojiSelector), shortcuts (MKbd)
```

## How it works

- **Rendering**: the photo is processed once per change of its look (adjustments, filter, straighten angle) at screen
  resolution and cached; painting and moving text only recomposite the layers on top. Export renders everything again
  at full size, cropped.
- **History**: each step is a snapshot of the document. Paint layers are copy-on-write (a stroke draws on a fresh copy
  of the layer's canvas), so a snapshot can keep pointing at the old canvas. Sliders and typing add one step once the
  value settles.
- **Rotate and flip** transform the whole document: the photo, every paint layer, text positions and the crop.
  Straightening only turns the photo, zoomed in just enough to keep the corners filled.
- **Menus**: the same `MenuSection` fills the menu bar and the phone menu; layer actions (`LayerMenuItems`) appear in
  the Layer menu, each layer's ⋮ menu and its right-click menu. Blend modes and filters use `keep-open` items so you
  can try several without reopening the menu.
- **Shortcuts** are one list given to `MHotkeys` and to the shortcuts dialog. Press <kbd>?</kbd> to see them.
