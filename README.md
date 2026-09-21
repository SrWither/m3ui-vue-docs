<p align="center">
  <img src="public/favicon-512.png" width="120" height="120" alt="M3UI Vue logo">
</p>

<p align="center">
  <strong>M3UI Vue — Documentation</strong>
</p>

<p align="center">
  Live component docs and playground for <a href="https://github.com/SrWither/m3ui-vue">@m3ui-vue/m3ui-vue</a>, a Material Design 3 component library for Vue 3 + Tailwind CSS v4.
</p>

<p align="center">
  <a href="https://m3ui.dev"><strong>m3ui.dev →</strong></a>
</p>

---

This is the source for the documentation site — one page per component with live, editable-looking previews and copyable code, plus getting-started/i18n guides and a full changelog. It's not the library itself; that lives in the separate [`m3ui-vue`](https://github.com/SrWither/m3ui-vue) repo and is consumed here via `@m3ui-vue/m3ui-vue`.

## Development

```bash
pnpm install
pnpm dev       # start the dev server
pnpm build     # production build to dist/
pnpm preview   # preview the production build locally
```

Deploys automatically to [m3ui.dev](https://m3ui.dev) via GitHub Pages on every push to `main` (see `.github/workflows/deploy.yml`).

## Adding a component page

Component pages live at `src/pages/components/<section>/<Component>.vue` and are auto-routed to `/components/<section>/<component>` — no manual route registration needed. See any existing page in that directory for the expected shape (props table, live demo, code sample).
