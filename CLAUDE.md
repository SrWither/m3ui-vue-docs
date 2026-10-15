# CLAUDE.md

Docs site for `@m3ui-vue/m3ui-vue` (the library lives in the sibling repo `../m3ui-vue`, which has its own CLAUDE.md). Live at https://m3ui.dev. Vue 3 + Vite + Tailwind v4, pnpm.

## Commands

- `pnpm dev` — dev server (listens on `[::1]:5173`; use `pnpm dev --host` to test from a phone on the LAN).
- `pnpm build` — sitemap + `vite build` + copies `index.html` to `404.html`.
- **There is no working typecheck.** `vue-tsc` crashes against the pinned TypeScript 7 (`ERR_PACKAGE_PATH_NOT_EXPORTED ... './lib/tsc'`), and the build script doesn't typecheck. The real validation is `pnpm exec vite build` (compiles every page's template/script) — run it after editing a page. Don't claim a page "typechecks".
- **Pushing `main` deploys to m3ui.dev** (`.github/workflows/deploy.yml`, GitHub Pages). Never push without the user asking.

## Library dependency: local link vs npm

`./link.sh local|npm|status` switches `@m3ui-vue/m3ui-vue` between `link:../m3ui-vue` and the published `^x.y.z`. During a working session it's usually on `local`, which leaves `package.json` + `pnpm-lock.yaml` modified — **never commit those two while they point at `link:`**; commit only the page files. They go back to `^x.y.z` (`./link.sh npm`) after the new version is published.

The link resolves to the library's **built `dist/`, not its `src/`**. After changing the library: `pnpm build:js` in `../m3ui-vue`, then `rm -rf node_modules/.vite` here, before trusting anything in the browser.

## Where things live

- **One page per component**: `src/pages/components/<section>/<ComponentName>.vue`. Routes are auto-generated from that path by `import.meta.glob` in `src/router.ts` (`/components/<section>/<lowercased name>`) — no manual route entry. Sections: `advanced`, `buttons`, `data-display`, `editors`, `feedback`, `inputs`, `layout`, `navigation`, `overlays`, `tables`, `utility`.
- **Adding a new component page** also needs: its name in the section's `ch('/components/<section>', [...])` list and an icon in `iconMap`, both in `src/nav/sections.ts` (that list also drives `ComponentPager` prev/next order via `componentPageOrder`), plus a `{ name, description }` card on the section overview page (`src/pages/<Section>Page.vue`, e.g. `FeedbackPage.vue`).
- **Changelog page**: `src/pages/ChangelogPage.vue`, a `versions: Version[]` array (`{ version, date, changes: { added?, changed?, fixed? } }`), newest first. The unreleased version uses `date: 'Unreleased'`; set the real date once the lib tag exists (`git -C ../m3ui-vue tag`). Voice is plain-English and user-facing (what changed for someone using the component), shorter and less technical than the library's `CHANGELOG.md` — no token names, no internal mechanics.
- **Large demos** (e.g. the Jira-style issue tracker, `KanbanIssueTracker.vue`) live in `src/components/demos/` and are imported by the page. They **can't** go in a subfolder of `src/pages/components/<section>/`: the router glob throws on any path deeper than `<section>/<Name>.vue`. The page's `ComponentDemo` then shows a condensed `:code`/`:script` and renders the demo in its slot (use `flush` plus your own padding for full-width boards).
- Other top-level pages: `SetupPage.vue` (install + font links), `I18nPage.vue`, `PalettesPage.vue`, `TypographyPage.vue`, `PaletteBuilderPage.vue`, `ExamplesPage.vue` (the examples gallery, see below).

## Page anatomy (copy an existing page, e.g. `data-display/MResult.vue`)

```vue
<script setup lang="ts">
import { MSomething } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'       // + SlotsTable / EventsTable when relevant
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
const props: PropDef[] = [{ name, type, default?, description }]
</script>
<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSomething</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">Intro…</p>
    <ComponentDemo title="…" description="…" :code="`…`" :script="`…`"> live preview </ComponentDemo>
    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <ComponentPager current="MSomething" />
  </div>
</template>
```

`ComponentDemo` props: `title`, `description?`, `code` (Template tab), `script?` (Script tab), `flush?`. The preview is the default slot — **keep the `code` snippet in sync with what the slot actually renders**.

### `:code` / `:script` escaping gotchas

These are JS template literals inside an HTML attribute:
- Double quotes inside → `&quot;`.
- A literal `${...}` in the shown code must be written `\${...}`, or Vue evaluates it and the snippet shows the value (e.g. `0`) instead of the code. Same for backticks: `\``.
- A closing script tag inside must be `<\/script>`.
- Editing these with a Python/sed one-liner is fragile (nested quotes/backslashes); prefer the Edit tool.

### Demo conventions

- All demo text in **English** (the user asked for this explicitly).
- Use real library components inside demos (`MList`/`MListItem`, `MButton`, `MAvatar`, `MCard`…) rather than hand-rolled lookalikes. Check the component's props in `../m3ui-vue/src/components/<Name>.vue` first.
- Content placed on a colored surface (e.g. a `primary` chat bubble) must use that surface's on-color (`on-primary/12` tint etc.), not components designed for surface backgrounds like `MChip`.
- In a grid of cards with unequal heights, give the inner component `class="h-full"` so its own centering applies (grid stretches the card, not the child).
- Time-relative demo values that sit on a unit boundary drift as "now" advances (`+24h` soon reads "in 24 hours" instead of "tomorrow") — pad them.
- Demo state lives in the page's `<script setup>` (refs + small fake async with `setTimeout`).
- Each demo gets its own data: two demos sharing one ref (as the old MDragDropList page did) means interacting with one changes the other.
- `MCard` hardcodes `overflow-hidden`, which clips a dragged item's lift shadow; use `overflow-visible!` (Tailwind v4 important suffix) on the card, since class order alone isn't guaranteed to win.
- Show request/save behavior with a small fake log panel (`PUT /api/... {payload}`) rather than real network calls (see the MDragDropList ranking and MKanban saving demos).
- Point URLs in examples at real destinations (QR codes encode `https://m3ui.dev`), not `example.com`.
- Don't describe behavior a demo doesn't have (e.g. claiming new items animate in when only reorders do); check the component first.

## Example apps (`src/examples/`)

Full-screen apps built only with the library, outside the docs chrome. `src/examples/registry.ts` lists them; each entry becomes a `/examples/<id>` route with `meta: { fullscreen: true }` (App.vue then renders the RouterView without `AppShell`), a sidebar item and a card in `ExamplesPage.vue`. Each example is one self-contained folder (`src/examples/<id>/`, with its own `README.md`) because the gallery and the example itself link to it on GitHub (`exampleSource(id)` → `github.com/SrWither/m3ui-vue-docs/tree/main/src/examples/<id>`). Every example needs a subtle way back to the docs and to its source, as *visible* icon buttons in its top bar (`menu_book` "Back to the docs" → `router.push('/examples')`, `code` "View source on GitHub" → `exampleSource(id)`), reachable on phones too, never only inside a ⋮ menu. The Desktop example's apps keep their state at module level because a hidden `MWindow` unmounts its content.

There are eight: Desktop, Chat, Dashboard, Store, Music (Tempo: songs generated live with Web Audio in `engine.ts`), Mail (Postbox), Forge (a GitHub-like code host) and Plaza (social feed, folder `feed`). Each uses its own product name and look, never a real brand's. Adding one also means:
- a preview branch for it in `ExamplesPage.vue`'s card art (`v-else-if="e.id === '…'"`); without one it falls through to the Desktop preview (`v-else`);
- regenerating the sitemap (`node scripts/generate-sitemap.mjs`, commit `public/sitemap.xml`); routes and per-route meta come from the registry by themselves;
- a repo name in `src/examples/forge/repos.ts` (`names`): Forge globs every example folder (`import.meta.glob('../*/**/*.{ts,vue,md}', { query: '?raw' })`) and shows each one as a repo of real source, so anything in an example folder is also published as browsable text there.

Gotcha: `MTabs` draws its own 1px divider, only as wide as the tabs. For a divider across the whole width, wrap it in a full-width `border-b-2` element and give `MTabs` `-mb-px` so the two lines overlap instead of stacking (see Forge's `RepoView.vue`).

Gotcha: a component rendered inside a `<Transition>` (e.g. an example's page transition) must keep one fixed root element. If its root switches (`v-if` between an `MResult` and a form), Vue applies the enter-from state to the new root and it can stay stuck there, invisible at `opacity: 0`. Wrap the branches in a single `<div>` (and keep template comments inside it, see the lib's comment-before-root gotcha).

Gotcha: a dev server started before a new folder with Tailwind classes existed may not generate those classes (they only appear in that folder), so layouts silently collapse (e.g. a `bottom-14` box at 0px height). `touch src/assets/main.css` or restart the dev server; production builds are unaffected.

