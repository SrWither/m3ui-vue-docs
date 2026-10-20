# Orvian example ("Orvian Lite")

A public map viewer for the styles of an MVT server, built only with [m3ui-vue](https://m3ui.dev) components. Live at
[m3ui.dev/examples/orvian](https://m3ui.dev/examples/orvian).

It's the showcase for `MMap`. The original Orvian Lite wires MapLibre by hand: a layer manager, click-to-identify,
hover info and a measuring control, each a few hundred lines. Here each one is a component reading the style's
metadata through `orvianAdapter()`.

## Structure

```
orvian/
├── OrvianExample.vue   the top bar (style name, theme, docs, source), the map with search, measuring, hover and
│                       identify, FABs for the layer window (MMapLayers) and base maps (MMapBaseLayers), the info window
└── town.ts             Monteluz, a made-up town (blocks, lots, zoning, streets, bike lanes, parks, schools, health
                        centers), and a MapLibre style for it with the Orvian metadata conventions
```

## The data

Everything is invented and generated in the browser (seeded, so it's the same town on every visit), placed in the
farmland of the pampas. A real Orvian deployment loads its style from mvt-rs instead
(`https://…/services/styles/<category>:<style>`), with vector tiles from PostGIS and legends from its legend service;
`town.ts` shows the same metadata on GeoJSON sources, and its legends are SVG data URIs.
