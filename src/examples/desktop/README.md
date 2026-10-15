# Desktop example

A desktop environment in the browser, built only with [m3ui-vue](https://m3ui.dev) components. Live at
[m3ui.dev/examples/desktop](https://m3ui.dev/examples/desktop).

## Structure

```
desktop/
├── DesktopExample.vue      the screen: wallpaper, icons, one MWindow per running app, taskbar
├── useDesktop.ts           shared state: the app list, which apps run, which windows show, which is in front
├── components/
│   ├── Wallpaper.vue       background from the palette's colors (aurora, M3 shapes, plain)
│   ├── DesktopIcons.vue    icons: click selects, double-click / Enter / tap opens
│   ├── Taskbar.vue         start button, running apps, tray (theme, back to docs, clock)
│   └── StartMenu.vue       app search and launcher
└── apps/                   one component per app
    ├── WelcomeApp.vue
    ├── FilesApp.vue        folder browser with MBreadcrumbs and MSegmentedButton
    ├── NotesApp.vue
    ├── TasksApp.vue        MKanban board
    ├── CalendarApp.vue     MCalendar
    ├── MusicApp.vue        MSlider for position and volume
    ├── CalculatorApp.vue   works with the keyboard too
    ├── BrowserApp.vue      web browser: tabs (one iframe each), address bar, back/forward, start page
    ├── TerminalApp.vue     commands that drive the desktop: open, close, theme, palette, wallpaper…
    └── SettingsApp.vue     MListDetail inside a window: one pane normally, two when maximized
```

## How it works

- **Windows** are `MWindow` with `snap` (drag to the top to maximize, to a side for half) and `offscreen`
  (can be pushed partly off the edges). Its own minimize button is replaced, through the `#actions`
  slot, by one that hides the window to the taskbar.
- **Bringing a window to the front** from the taskbar, the start menu or the terminal goes through
  `focusRequest` in `useDesktop.ts`, which `DesktopExample.vue` turns into `MWindow`'s exposed
  `focus()`. `MWindow`'s `focus` event keeps the taskbar's active app in sync when you click a window.
- **App state lives at module level** (a plain `<script>` block next to `<script setup>`), because a
  hidden `MWindow` unmounts its content: notes, the calculator, the terminal session and the playing
  song all survive being minimized.
- **The browser** shows each tab in its own iframe (background tabs stay loaded) and starts over when
  it's closed. Sites that forbid being framed (Google, GitHub, YouTube pages…) can't be
  detected from outside, so known ones show an "Open in new tab" page instead of a blank frame. The
  address bar follows links clicked inside pages of this same site (readable, same origin) but not
  inside other sites, and back / forward use the browser's own list rather than the frame's history.
- **Theme and palette** use the library's `useTheme()` and `useColorPalette()`, so changes in Settings or
  the terminal apply to the whole site.
