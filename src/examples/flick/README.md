# Flick example

A video site built only with [m3ui-vue](https://m3ui.dev) components, whose videos really play.
Live at [m3ui.dev/examples/flick](https://m3ui.dev/examples/flick).

## Structure

```
flick/
├── FlickExample.vue         layout: top bar, MNavigationDrawer (inline, collapsed below 1200px; modal on a video's page)
│                            or MShortNavigationBar on phones, pages, mini player
├── useFlick.ts              shared state: navigation (back), player, subscriptions, likes, playlists, history, comments, search
├── data.ts                  channels, videos, shorts and comments, all from fixed seeds
├── shaders.ts               the videos: eight GLSL scenes (aurora, waves, tunnel, plasma, stars, blobs, horizon, rings)
├── thumbs.ts                thumbnails: frames of the same scenes, rendered through one shared off-screen WebGL context
├── components/
│   ├── TopBar.vue           logo, MSearchBar (docked on wide screens, full screen on phones), theme, docs and source
│   ├── Player.vue           the player: MShader picture, controls (a slimmer layout on phones), end screen, shortcuts
│   ├── PlayerSettings.vue   the gear menu: autoplay, speed and quality submenus
│   ├── SeekBar.vue          MSeekBar line with chapters and a preview frame above the pointer
│   ├── MiniPlayer.vue       keeps the video playing while you browse; MSwipeToDismiss to close it
│   ├── Thumb.vue            thumbnail with length and watched progress; a live preview on mouse hover
│   ├── VideoCard.vue        grid, row and compact layouts, with a ⋮ menu (Watch later, playlist, share)
│   ├── Comments.vue         sort, add, reply, fold-out replies; CommentRow.vue is one comment
│   ├── SaveSheet.vue        "Save to…" playlists: MBottomSheet on phones, MDialog on wide screens
│   └── ShareDialog.vue      link (optionally at the current time), MCopyButton and MQRCode
└── views/                   Home, Watch, Shorts, Subscriptions, Channel, Search, You and Playlist (also the watch history)
```

## How it works

- **The videos** are fragment shaders, not files. Each video is a scene, three colors and a seed.
  `MShader` plays it, and instead of its own clock the scene reads a `uTime` uniform that is the
  player's position, so pausing, seeking (even while you drag) and the playback speed change the
  picture. **Quality** sets `MShader`'s `pixelRatio` from the player's height, so 144p really is
  blocky. Seeking and quality changes "buffer" for a moment, with an `MLoadingIndicator`.
- **Thumbnails** are a frame of the same scene. A browser only allows about 16 live WebGL contexts,
  so a grid of `MShader`s would run out: `thumbs.ts` draws every thumbnail (and the seek bar's
  preview frames) with one shared off-screen context and caches them as images. Only the player,
  the mini player, the current Short and the card under the mouse run live.
- **The player** hides its controls after a moment of playing. With a mouse, a click plays/pauses
  and a double click goes full screen. On touch, a tap shows the controls and a double tap on either
  side skips 10 seconds. Full screen puts the player over the page and asks the browser for full
  screen on the whole document, so menus and sheets (teleported to `<body>`) still show above it.
  At the end, autoplay counts down to the next video.
- **Keyboard**: Space or K play/pause, J/L skip 10s, ←/→ 5s, 0–9 jump to that tenth, F full screen,
  M mute, T theater mode, I mini player.
- **Navigation** follows YouTube: on wide screens an inline `MNavigationDrawer`, full from 1200px and
  collapsed (icons only) below, and ☰ switches between the two; on a video's page ☰ opens it as a
  modal drawer instead, so the video keeps the room. Phones get an `MShortNavigationBar`.
- **Shorts**: a vertical full-screen `MCarousel`. The Short in view loops on its own clock, and a tap
  pauses it.
- **Your library** lives in memory: subscriptions (with the bell), likes, Watch later, your own
  playlists (create, rename, delete with undo), watch history grouped by day, and the comments you
  write (the creator hearts them a few seconds later).
- **Share links** are real: `/examples/flick?v=<id>&t=<seconds>` opens this example on that video.
- **Page loads** are faked with `usePageProgress()` (the docs' `MPageProgress` bar) and `MSkeleton`s.
