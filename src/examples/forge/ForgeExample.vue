<script setup lang="ts">
/*
 * Forge example: a code hosting site built only with m3ui-vue, browsing the
 * real source of the other examples in these docs.
 * - repos.ts              every example becomes a repo; its files load on demand (import.meta.glob ?raw)
 * - data.ts               the simulated part: people, labels, commits, issues, pull requests, CI runs
 * - useForge.ts           navigation, stars, committed edits, merging, runs; diff.ts  line diffs
 * - views/HomeView        the organization and its repositories
 * - views/RepoView        header and tabs: CodeTab (MTree, MSplitter, MCodeEditor, MMarkdown),
 *                         IssuesTab, PullsTab (MTimeline, MMultiSelect, diffs, MSplitButton merge),
 *                         ActionsTab (MTerminal logs, MJsonViewer payload)
 * - MSpotlightSearch      press `t` to jump to any file or repository
 */
import { computed, ref } from 'vue'
import { MSpotlightSearch, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import type { SpotlightResult } from '@m3ui-vue/m3ui-vue'
import { fileIcon, repos } from './repos'
import { useForge } from './useForge'
import TopBar from './components/TopBar.vue'
import HomeView from './views/HomeView.vue'
import RepoView from './views/RepoView.vue'

const { screen, repo, openRepo, finderOpen } = useForge()

const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')

// File finder: the current repo's files first, then every repository.
const query = ref('')
const results = computed<SpotlightResult[]>(() => {
  const q = query.value.trim().toLowerCase()
  const files = (repo.value?.files ?? [])
    .filter((f) => !q || f.path.toLowerCase().includes(q))
    .slice(0, 12)
    .map((f) => ({ id: `file:${f.path}`, title: f.name, description: f.path, icon: fileIcon(f.name), category: `Files in ${repo.value!.name}` }))
  const all = repos
    .filter((r) => !q || r.name.includes(q) || r.description.toLowerCase().includes(q))
    .map((r) => ({ id: `repo:${r.id}`, title: `m3ui/${r.name}`, description: r.description, icon: 'book', category: 'Repositories' }))
  return [...files, ...all]
})
function select(r: SpotlightResult) {
  const [kind, value] = String(r.id).split(/:(.+)/) as [string, string]
  if (kind === 'repo') openRepo(value)
  else openRepo(repo.value!.id, 'code', { path: value })
}
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-surface text-on-surface">
    <TopBar :wide="wide" />
    <main class="min-h-0 flex-1" :class="screen.name === 'home' ? 'overflow-y-auto' : ''">
      <HomeView v-if="screen.name === 'home'" />
      <RepoView
        v-else-if="repo && screen.name === 'repo'"
        :key="repo.id"
        :repo="repo"
        :tab="screen.tab"
        :path="screen.path"
        :issue="screen.issue"
        :pull="screen.pull"
        :run="screen.run"
        :new-issue="screen.newIssue"
        :wide="wide"
      />
    </main>
    <MSpotlightSearch v-model="finderOpen" :results="results" hotkey="t" placeholder="Search files and repositories" @search="query = $event" @select="select" />
  </div>
</template>

<style>
.m3f-fill.material-symbols-outlined,
.m3f-fill .material-symbols-outlined {
  font-variation-settings: 'FILL' 1;
}

/* Rendered Markdown (READMEs, comments): readable spacing and headings. */
.m3f-md { color: var(--color-on-surface); line-height: 1.6; }
.m3f-md > :first-child { margin-top: 0; }
.m3f-md > :last-child { margin-bottom: 0; }
.m3f-md h1, .m3f-md h2 { padding-bottom: 0.3em; border-bottom: 1px solid var(--color-outline-variant); }
.m3f-md h1 { font-size: 1.75rem; font-weight: 600; margin: 1.2em 0 0.6em; }
.m3f-md h2 { font-size: 1.35rem; font-weight: 600; margin: 1.2em 0 0.6em; }
.m3f-md h3 { font-size: 1.1rem; font-weight: 600; margin: 1em 0 0.5em; }
.m3f-md p, .m3f-md ul, .m3f-md ol, .m3f-md pre, .m3f-md blockquote { margin: 0 0 0.9em; }
.m3f-md ul { list-style: disc; padding-left: 1.5em; }
.m3f-md ol { list-style: decimal; padding-left: 1.5em; }
.m3f-md code { font-family: var(--font-mono, monospace); font-size: 0.875em; background: var(--color-surface-container-highest); padding: 0.15em 0.35em; border-radius: 4px; }
.m3f-md pre { background: var(--color-surface-container-high); padding: 1em; border-radius: 12px; overflow-x: auto; }
.m3f-md pre code { background: none; padding: 0; }
.m3f-md a { color: var(--color-primary); }
.m3f-md blockquote { border-left: 3px solid var(--color-outline-variant); padding-left: 1em; color: var(--color-on-surface-variant); }
.m3f-md table { border-collapse: collapse; margin-bottom: 1em; }
.m3f-md th, .m3f-md td { border: 1px solid var(--color-outline-variant); padding: 0.35em 0.75em; }
</style>
