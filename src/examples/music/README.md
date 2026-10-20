# Music example

A music streaming app built only with [m3ui-vue](https://m3ui.dev) components, whose songs really play.
Live at [m3ui.dev/examples/music](https://m3ui.dev/examples/music).

## Structure

```
music/
├── MusicExample.vue         layout: sidebar + page + player bar from 840px wide, tabs + mini player below
├── useMusic.ts              shared state: navigation (back/forward), library, playlists, player and queue
├── engine.ts                the songs, generated live with the Web Audio API (look-ahead scheduler)
├── catalog.ts               artists, albums, tracks and curated playlists, all from fixed seeds
├── art.ts                   covers, artist photos and playlist covers drawn as SVG data URIs
├── rng.ts                   a tiny seeded random generator
├── components/
│   ├── TopBar.vue           back/forward, theme, source and back-to-docs
│   ├── Sidebar.vue          Home, Search and Your Library (wide screens)
│   ├── LibraryList.vue      filter chips and everything you saved
│   ├── TrackList.vue        song rows: playing indicator, like, length, menu and right-click menu
│   ├── TrackMenuItems.vue   add to queue / playlist, like, go to artist or album
│   ├── MediaCard.vue        album, playlist and artist cards; Shelf.vue rows them up
│   ├── CollectionHeader.vue the cover over its own blurred colors
│   ├── PlayerBar.vue        wide-screen player; MiniPlayer.vue on phones
│   ├── PlayerControls.vue   shuffle, previous, play, next, repeat
│   ├── SeekBar.vue          MSeekBar that seeks once you let go; VolumeControl.vue
│   ├── NowPlaying.vue       full-screen player; Visualizer.vue draws the analyser's bars on a canvas
│   ├── QueuePanel.vue       now playing, "Next in queue" and "Next from …", reordered with MDragDropList
│   └── NewPlaylistDialog.vue
└── views/                   Home, Search, Library (phones), Collection (album, playlist, Liked Songs), Artist
```

## How it works

- **The songs** are generated, not files: each track's genre, tempo, key and seed define its chords, bass,
  drums and a melody (`engine.ts`). The same seed always gives the same song, so pausing, seeking and
  coming back behave like a recording. Notes are queued slightly ahead on the audio clock, and the
  position is read from that clock.
- **Playing from somewhere** sets a context (album, playlist, artist, Liked Songs or a search result).
  "Add to queue" songs play before the rest of it. Shuffle reorders what's left, and repeat goes
  off → all → one.
- **Your library** lives in memory: likes, saved albums and playlists, followed artists and your own
  playlists (create, rename, delete with undo, add or remove songs).
- **Adaptive layout**: from 840px wide there's a sidebar, the page, an optional queue column and a
  player bar. Below that, `MShortNavigationBar` tabs with a mini player above them, and the queue
  opens in an `MBottomSheet`.
- **Keyboard**: Space plays/pauses (unless you're typing or on a control), Escape closes the full
  player, and the queue can be reordered with the keyboard through `MDragDropList`.
