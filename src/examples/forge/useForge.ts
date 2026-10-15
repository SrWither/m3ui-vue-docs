/*
 * Shared state, at module level: where you are, each repo's simulated history (generated the
 * first time you open it), your stars, the edits you commit, and the CI runs they start.
 */
import { computed, reactive, ref } from 'vue'
import { useToast } from '@m3ui-vue/m3ui-vue'
import { repoById, type Repo } from './repos'
import { generate, makeRun, me, sha, type Change, type Issue, type PullRequest, type RepoData, type Run, type TimelineEntry } from './data'

export type Tab = 'code' | 'issues' | 'pulls' | 'actions'
export type Screen =
  | { name: 'home' }
  | { name: 'repo'; repo: string; tab: Tab; path?: string; issue?: number; pull?: number; run?: string; newIssue?: boolean }

const toast = useToast()

// --- Navigation (back/forward like a browser) ---------------------------------------------------

const history = ref<Screen[]>([{ name: 'home' }])
const cursor = ref(0)
const screen = computed(() => history.value[cursor.value]!)
function go(s: Screen) {
  history.value = [...history.value.slice(0, cursor.value + 1), s]
  cursor.value++
}
const back = () => cursor.value > 0 && cursor.value--
const repo = computed<Repo | null>(() => (screen.value.name === 'repo' ? repoById(screen.value.repo) : null))
const openRepo = (id: string, tab: Tab = 'code', extra: Partial<Extract<Screen, { name: 'repo' }>> = {}) => go({ name: 'repo', repo: id, tab, ...extra })

// --- Per-repo data ------------------------------------------------------------------------------

const store = reactive<Record<string, RepoData>>({})
function data(id: string): RepoData {
  if (!store[id]) store[id] = generate(repoById(id))
  return store[id]!
}

const starred = ref<string[]>(['music', 'desktop'])
function toggleStar(id: string) {
  const on = !starred.value.includes(id)
  starred.value = on ? [...starred.value, id] : starred.value.filter((x) => x !== id)
  toast.info(on ? 'Starred' : 'Unstarred', { icon: on ? 'star' : 'star_outline' })
}
const stars = (r: Repo) => r.stars + (starred.value.includes(r.id) ? 1 : 0)

// --- Files ----------------------------------------------------------------------------------------

/** Text you committed, per `repo:path`; it wins over the original file. */
const edits = reactive<Record<string, string>>({})
const cache = new Map<string, string>()

async function readOriginal(r: Repo, path: string) {
  const key = `${r.id}:${path}`
  if (!cache.has(key)) cache.set(key, await r.files.find((f) => f.path === path)!.load())
  return cache.get(key)!
}
async function readFile(r: Repo, path: string) {
  return edits[`${r.id}:${path}`] ?? readOriginal(r, path)
}

/** The latest commit that touched a file (or folder), for the file list. */
function lastCommitFor(r: Repo, path: string) {
  const { commits } = data(r.id)
  const own = commits.find((c) => c.files?.includes(path) || c.files?.some((f) => f.startsWith(`${path}/`)))
  if (own) return own
  let h = 0
  for (const ch of path) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return commits[h % commits.length]!
}

/** Commit an edit straight to main, or on a new branch with a pull request. */
function commitEdit(r: Repo, path: string, before: string, after: string, message: string, asPull: boolean) {
  const d = data(r.id)
  const commitSha = sha(Math.random)
  if (!asPull) {
    edits[`${r.id}:${path}`] = after
    d.commits.unshift({ sha: commitSha, message, author: me.login, date: Date.now(), branch: 'main', files: [path] })
    startRun(r, message, commitSha, 'push', 'main')
    toast.success('Changes committed to main', { icon: 'commit' })
    return null
  }
  const number = nextNumber(d)
  const branch = `${me.login}/patch-${number}`
  const pr: PullRequest = {
    number,
    title: message,
    author: me.login,
    state: 'open',
    labels: [],
    assignees: [me.login],
    created: Date.now(),
    timeline: [
      { kind: 'comment', id: `n${number}`, author: me.login, date: Date.now(), body: `Edited \`${path}\` in the browser.` },
      { kind: 'event', id: `n${number}-c`, actor: me.login, date: Date.now(), action: 'committed', detail: message },
    ],
    branch,
    changes: [{ kind: 'edit', path, before, after }],
    checks: 'pending',
  }
  d.pulls.unshift(pr)
  const run = startRun(r, message, commitSha, 'pull_request', branch)
  run.onDone = (ok) => (pr.checks = ok ? 'success' : 'failure')
  toast.success(`Opened pull request #${number}`, { icon: 'merge' })
  return number
}

// --- Issues and pull requests -------------------------------------------------------------------

const nextNumber = (d: RepoData) => Math.max(0, ...d.issues.map((i) => i.number), ...d.pulls.map((p) => p.number)) + 1

function createIssue(r: Repo, title: string, body: string, labels: string[], assignees: string[]) {
  const d = data(r.id)
  const number = nextNumber(d)
  const timeline: TimelineEntry[] = [{ kind: 'comment', id: `i${number}`, author: me.login, date: Date.now(), body: body || '_No description provided._' }]
  if (labels.length) timeline.push({ kind: 'event', id: `i${number}-l`, actor: me.login, date: Date.now(), action: 'labeled', detail: labels.join(',') })
  d.issues.unshift({ number, title, author: me.login, state: 'open', labels, assignees, created: Date.now(), timeline })
  toast.success(`Created issue #${number}`, { icon: 'adjust' })
  return number
}

function comment(item: Issue | PullRequest, body: string) {
  item.timeline.push({ kind: 'comment', id: `c${Date.now()}`, author: me.login, date: Date.now(), body })
}
function setState(item: Issue | PullRequest, state: 'open' | 'closed') {
  item.state = state
  item.timeline.push({ kind: 'event', id: `e${Date.now()}`, actor: me.login, date: Date.now(), action: state === 'closed' ? 'closed' : 'reopened' })
}
function setLabels(item: Issue | PullRequest, labels: string[]) {
  const added = labels.filter((l) => !item.labels.includes(l))
  item.labels = labels
  if (added.length) item.timeline.push({ kind: 'event', id: `e${Date.now()}`, actor: me.login, date: Date.now(), action: 'labeled', detail: added.join(',') })
}
function setAssignees(item: Issue | PullRequest, assignees: string[]) {
  const added = assignees.filter((a) => !item.assignees.includes(a))
  item.assignees = assignees
  if (added.length) item.timeline.push({ kind: 'event', id: `e${Date.now()}`, actor: me.login, date: Date.now(), action: 'assigned', detail: added.join(',') })
}

async function merge(r: Repo, pr: PullRequest, method: 'merge' | 'squash' | 'rebase') {
  const d = data(r.id)
  for (const c of pr.changes) if (c.kind === 'edit') edits[`${r.id}:${c.path}`] = c.after
  pr.state = 'merged'
  pr.timeline.push({ kind: 'event', id: `m${Date.now()}`, actor: me.login, date: Date.now(), action: 'merged', detail: `${method === 'squash' ? 'squashed and merged' : method === 'rebase' ? 'rebased and merged' : 'merged'} ${pr.branch} into main` })
  const message = method === 'squash' ? `${pr.title} (#${pr.number})` : `Merge pull request #${pr.number} from ${pr.branch}`
  const commitSha = sha(Math.random)
  d.commits.unshift({ sha: commitSha, message, author: me.login, date: Date.now(), branch: 'main', files: pr.changes.map((c) => c.path) })
  startRun(r, message, commitSha, 'push', 'main')
  toast.success(`Pull request #${pr.number} merged`, { icon: 'merge' })
}

/** The diff of one change: the lines before and after. A typo PR un-fixes a real line to get its "before". */
async function changeTexts(r: Repo, c: Change) {
  if (c.kind === 'edit') return { before: c.before, after: c.after }
  const after = await readOriginal(r, c.path)
  const lines = after.split('\n')
  const at = lines.findIndex((l, i) => i > 4 && / the /.test(l))
  const i = at >= 0 ? at : lines.findIndex((l) => / the /.test(l))
  const before = [...lines]
  if (i >= 0) before[i] = before[i]!.replace(' the ', ' teh ')
  else before[0] = `${before[0]} `
  return { before: before.join('\n'), after }
}

// --- CI -------------------------------------------------------------------------------------------

type LiveRun = Run & { onDone?: (ok: boolean) => void }

/** A new run: queued, then running for a few seconds, then done. Re-runs of a failed test pass. */
function startRun(r: Repo, title: string, commitSha: string, event: Run['event'], branch: string, outcome: 'success' | 'failure' = 'success') {
  const d = data(r.id)
  const number = Math.max(0, ...d.runs.map((x) => x.number)) + 1
  const run = reactive(makeRun(r, outcome, title, commitSha, me.login, Date.now(), number, event, branch)) as LiveRun
  run.status = 'queued'
  d.runs.unshift(run)
  setTimeout(() => (run.status = 'running'), 1200)
  setTimeout(() => {
    run.status = outcome
    run.onDone?.(outcome === 'success')
    if (screen.value.name !== 'repo' || screen.value.run !== run.id) {
      toast[outcome === 'success' ? 'success' : 'error'](`CI ${outcome === 'success' ? 'passed' : 'failed'}: ${title}`, { icon: outcome === 'success' ? 'check_circle' : 'cancel' })
    }
  }, 9000)
  return run
}
function rerun(r: Repo, run: Run) {
  const next = startRun(r, run.title, run.sha, run.event, run.branch)
  const pr = data(r.id).pulls.find((p) => p.branch === run.branch)
  if (pr) {
    pr.checks = 'pending'
    next.onDone = (ok) => (pr.checks = ok ? 'success' : 'failure')
  }
  return next
}

// --- Spotlight ------------------------------------------------------------------------------------

const finderOpen = ref(false)

export function useForge() {
  return {
    screen, go, back, repo, openRepo,
    data, starred, toggleStar, stars,
    readFile, readOriginal, edits, lastCommitFor, commitEdit,
    createIssue, comment, setState, setLabels, setAssignees, merge, changeTexts,
    startRun, rerun,
    finderOpen,
  }
}
