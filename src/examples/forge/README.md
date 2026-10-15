# Forge example

A code hosting site built only with [m3ui-vue](https://m3ui.dev) components, browsing the real source
of the other examples. Live at [m3ui.dev/examples/forge](https://m3ui.dev/examples/forge).

## Structure

```
forge/
├── ForgeExample.vue         top bar, the page, and the file finder (MSpotlightSearch, press `t`)
├── repos.ts                 every example becomes a repo; files load on demand via import.meta.glob(?raw)
├── data.ts                  the simulated part: people, labels, commits, issues, pull requests, CI runs and logs
├── useForge.ts              navigation, stars, committed edits, issues, merging, CI runs
├── diff.ts                  a small line diff (LCS) grouped into hunks, like `git diff`
├── time.ts                  "3 days ago" and durations
├── views/
│   ├── HomeView.vue         the organization: pinned repos and all repos with search, language and sort
│   ├── RepoView.vue         header (watch, fork, star), description, languages and the tabs
│   ├── CodeTab.vue          MTree in a resizable MSplitter beside CodeMain.vue
│   ├── CodeMain.vue         folders with the README (MMarkdown), files in MCodeEditor, edit and commit
│   ├── IssuesTab.vue        list, one issue's conversation, a new issue
│   ├── PullsTab.vue         list, conversation with the merge box (MSplitButton), files changed, checks
│   └── ActionsTab.vue       workflow runs; a run's jobs, logs and event payload
└── components/
    ├── ItemList.vue         issues / pull requests list with open/closed, search and label filter
    ├── ItemTimeline.vue     the conversation on MTimeline: comment cards and events
    ├── ItemSidebar.vue      assignees and labels (MMultiSelect), participants
    ├── CommentBox.vue       Markdown comment with Write / Preview tabs
    ├── DiffView.vue         one file's diff with line numbers
    ├── JobLog.vue           a job's log in MTerminal, streamed while the run is in progress
    └── LabelChip, StateIcon, RunStatus, TopBar
```

## How it works

- **The files are real.** `repos.ts` globs the other examples' folders with `import.meta.glob('../*/**/*.{ts,vue,md}', { query: '?raw' })`. The tree is built from the paths up front; each file is its own chunk, fetched when you open it (with an `MSkeleton` meanwhile).
- **Everything else is simulated** per repo from fixed seeds (`data.ts`), using the components that example uses, so issues and commits mention the right things.
- **Editing**: open a file, edit it in `MCodeEditor` and commit. Committing to main changes the file for the rest of your visit and starts a CI run. Proposing a change opens a pull request whose diff (`diff.ts`) compares your edit with the original.
- **Pull requests** wait for their checks; merge with a merge commit, squash or rebase (`MSplitButton`). The seeded typo-fix PRs get their "before" by putting a typo back into a real line.
- **CI**: runs are queued, run for a few seconds and finish; open one while it runs to watch its log stream into `MTerminal`. A failed run passes when re-run.
- **Keyboard**: `t` opens the file finder from anywhere (outside text fields).
