# Files example

A cloud drive built only with [m3ui-vue](https://m3ui.dev) components, where every file opens for real.
Live at [m3ui.dev/examples/files](https://m3ui.dev/examples/files).

## Structure

```
files/
├── FilesExample.vue         layout: top bar, MNavigationDrawer (inline on wide screens, modal on phones), the files,
│                            the details panel (an MSideSheet on phones), the viewer, MLightbox and the name dialog
├── useFiles.ts              shared state: items, where you are, selection, sort, and the actions (trash with undo,
│                            restore, rename, new folder, upload, star, annotations)
├── data.ts                  what's in the drive to begin with
└── components/
    ├── TopBar.vue           logo, search across every file, theme, docs and source
    ├── FilesDrawer.vue      My files, Recent, Starred, Shared with me, Trash; New (upload, folder); storage meter
    ├── Toolbar.vue          breadcrumbs or the selection's actions, type filters, grid/list, sort, details
    ├── FileBrowser.vue      the grid (folders, then file cards) or the list; selection, right-click, drop to upload
    ├── ItemMenuItems.vue    the actions on an item or the selection, for its ⋮ and right-click menus
    ├── Thumb.vue            an item's picture: a PDF's first page (usePdf), a photo, a poster, a cover
    ├── DetailsPanel.vue     the selected item, with a PDF's highlights and notes
    ├── Viewer.vue           a file opened full screen: MPdfViewer, MVideoPlayer or MAudioPlayer
    └── NameDialog.vue       new folder and rename
```

## How it works

- **PDFs** open in `MPdfViewer` with `annotate`: highlights, notes and drawings go into `v-model:annotations`,
  saved with the file (here, in memory), and the details panel lists them. The guide, the invoice and the lease
  (password `m3ui`) are the docs' own sample PDFs, written for them.
- **Videos and music** play in `MVideoPlayer` and `MAudioPlayer`, stepping through the other files of their kind
  in the folder. They stream from Wikimedia Commons: Blender Foundation open movies and Kevin MacLeod's music,
  both CC BY 3.0. The photos are drawn as SVG.
- **Selecting**: a click selects, Ctrl/⌘ adds, Shift takes a range, Ctrl+A everything; a double click or Enter
  opens. On phones a tap opens and a long press selects.
- **Uploading**: New → Upload files, or drop files from your desktop onto the list. Nothing leaves the browser:
  uploads are object URLs, released when deleted for good.
