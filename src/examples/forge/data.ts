/*
 * What's simulated around the real files: people, labels, commits, issues, pull requests and CI
 * runs. Each repo gets its own, generated from fixed seeds and from the components its example
 * actually uses, so they read like that project's own history.
 */
import { examples } from '@/examples/registry'
import type { Repo } from './repos'

export interface User {
  login: string
  name: string
}

export const me: User = { login: 'alex', name: 'Alex Rivera' }
export const users: User[] = [
  me,
  { login: 'mayachen', name: 'Maya Chen' },
  { login: 'jweber', name: 'Jonas Weber' },
  { login: 'priya-n', name: 'Priya Natarajan' },
  { login: 'samokafor', name: 'Sam Okafor' },
  { login: 'luciafdz', name: 'Lucía Fernández' },
  { login: 'theo-l', name: 'Theo Laurent' },
]
export const user = (login: string) => users.find((u) => u.login === login) ?? { login, name: login }

export interface Label {
  id: string
  name: string
  color: string
  description: string
}
export const labels: Label[] = [
  { id: 'bug', name: 'bug', color: '#d73a4a', description: 'Something isn’t working' },
  { id: 'enhancement', name: 'enhancement', color: '#a2eeef', description: 'New feature or request' },
  { id: 'docs', name: 'documentation', color: '#0075ca', description: 'Improvements or additions to documentation' },
  { id: 'good-first-issue', name: 'good first issue', color: '#7057ff', description: 'Good for newcomers' },
  { id: 'question', name: 'question', color: '#d876e3', description: 'Further information is requested' },
  { id: 'a11y', name: 'accessibility', color: '#fbca04', description: 'Keyboard, screen readers, contrast' },
]
export const labelById = (id: string) => labels.find((l) => l.id === id)!

export interface Commit {
  sha: string
  message: string
  author: string
  date: number
  branch: string
  /** Files it touched, for commits you make (the generated ones don't track this). */
  files?: string[]
}

export type TimelineEntry =
  | { kind: 'comment'; id: string; author: string; date: number; body: string }
  | { kind: 'event'; id: string; actor: string; date: number; action: 'labeled' | 'closed' | 'reopened' | 'assigned' | 'merged' | 'committed' | 'opened-pr'; detail?: string }

export interface Issue {
  number: number
  title: string
  author: string
  state: 'open' | 'closed'
  labels: string[]
  assignees: string[]
  created: number
  timeline: TimelineEntry[]
}

/** How a pull request's diff is made: a typo fixed in a real line, or your own edit of a file. */
export type Change = { kind: 'typo'; path: string } | { kind: 'edit'; path: string; before: string; after: string }

export interface PullRequest extends Omit<Issue, 'state'> {
  state: 'open' | 'merged' | 'closed'
  branch: string
  changes: Change[]
  checks: 'success' | 'failure' | 'pending'
}

export interface Step {
  name: string
  seconds: number
  /** Log lines (with ANSI colors), printed one by one in the terminal. */
  log: string[]
}
export interface Job {
  name: string
  status: 'success' | 'failure' | 'skipped'
  steps: Step[]
}
export interface Run {
  id: string
  number: number
  title: string
  branch: string
  event: 'push' | 'pull_request'
  actor: string
  status: 'success' | 'failure' | 'running' | 'queued'
  started: number
  jobs: Job[]
  sha: string
}

// --- Generation -------------------------------------------------------------------------------

const loadedAt = Date.now()
const HOUR = 3_600_000
const DAY = 24 * HOUR

function rng(seedText: string) {
  let a = [...seedText].reduce((h, c) => (Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0), 2166136261)
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const pick = <T>(r: () => number, list: readonly T[]) => list[Math.floor(r() * list.length)]!
export const sha = (r: () => number) => [...Array(40)].map(() => Math.floor(r() * 16).toString(16)).join('')

const others = users.filter((u) => u !== me).map((u) => u.login)

export interface RepoData {
  commits: Commit[]
  issues: Issue[]
  pulls: PullRequest[]
  runs: Run[]
}

function componentsOf(repo: Repo) {
  const uses = examples.find((e) => e.id === repo.id)?.uses ?? ['MTree', 'MCodeEditor', 'MMarkdown', 'MTerminal']
  return uses.filter((u) => u.startsWith('M'))
}

export function generate(repo: Repo): RepoData {
  const r = rng(repo.id)
  const comps = componentsOf(repo)
  const vueFiles = repo.files.filter((f) => f.lang === 'vue')
  const someFile = () => pick(r, repo.files).path
  const someComp = () => pick(r, comps)

  // Commits: a couple of weeks of work, newest first.
  const commitTemplates = [
    () => `Add ${pick(r, vueFiles).name.replace('.vue', '')}`,
    () => `Use ${someComp()} for ${pick(r, ['the list', 'the header', 'empty states', 'the settings', 'the dialog'])}`,
    () => `Fix ${pick(r, ['spacing', 'focus ring', 'dark mode colors', 'scroll position', 'keyboard navigation'])} in ${pick(r, vueFiles).name}`,
    () => 'Update README',
    () => `Tidy up ${someFile()}`,
    () => `Make ${pick(r, ['phones', 'tablets', 'wide screens'])} layout nicer`,
    () => `Simplify ${pick(r, ['state', 'props', 'the store', 'event handling'])}`,
  ]
  let t = loadedAt - 2 * HOUR
  const commits: Commit[] = [...Array(14)].map((_, i) => {
    t -= (2 + r() * 30) * HOUR
    return { sha: sha(r), message: i === 13 ? 'Initial commit' : pick(r, commitTemplates)(), author: pick(r, [me.login, me.login, ...others]), date: t, branch: 'main' }
  })

  // Issues.
  const issueTemplates: Array<() => Omit<Issue, 'number' | 'created' | 'timeline' | 'assignees'> & { body: string; reply?: string }> = [
    () => {
      const c = someComp()
      return { title: `${c}: focus is lost after closing`, author: pick(r, others), state: 'open', labels: ['bug', 'a11y'], body: `### Steps\n\n1. Open anything that uses \`${c}\`\n2. Close it with **Esc**\n\nFocus jumps back to the top of the page instead of the button that opened it.\n\n### Expected\n\nFocus returns to the trigger.`, reply: 'Good catch. We should restore focus in the close handler, I can take this one.' }
    },
    () => ({ title: 'Add screenshots to the README', author: pick(r, others), state: 'open', labels: ['docs', 'good-first-issue'], body: 'A light and a dark screenshot at the top of the README would help people see what this looks like before running it.', reply: 'Yes please! Phone + desktop would be great too.' }),
    () => {
      const c = someComp()
      return { title: `${c} looks cramped on small phones`, author: pick(r, others), state: 'open', labels: ['bug'], body: `On a 360px wide screen the ${c} touches the edges. Probably needs some padding below the \`sm\` breakpoint.`, reply: undefined }
    },
    () => ({ title: `Keyboard shortcuts for ${repo.name}`, author: pick(r, others), state: 'open', labels: ['enhancement'], body: 'It would be great to have shortcuts for the most common actions, and `?` to list them.\n\n```ts\n// something like\nuseHotkeys({ c: compose, \'/\': focusSearch })\n```', reply: 'Agreed. Let’s keep them close to what people already know from other apps.' }),
    () => ({ title: 'How do I change the accent color?', author: pick(r, others), state: 'closed', labels: ['question'], body: 'I’d like to use our brand color instead of purple. Where is it set?', reply: 'It comes from the palette: call `useColorPalette().set(\'teal\')`, or pass `palette` to `createM3UI()`. Closing, feel free to reopen!' }),
    () => {
      const f = someFile()
      return { title: `Typo in ${f}`, author: pick(r, others), state: 'closed', labels: ['docs', 'good-first-issue'], body: `There’s a small typo in \`${f}\`. Fixed in the linked pull request.`, reply: 'Thanks!' }
    },
    () => ({ title: 'Respect prefers-reduced-motion everywhere', author: pick(r, others), state: 'open', labels: ['a11y', 'enhancement'], body: 'Most transitions already check it, but a couple of animations still play with reduced motion turned on.', reply: undefined }),
  ]
  const issues: Issue[] = issueTemplates
    .map((tpl, i) => {
      const { body, reply, ...rest } = tpl()
      const created = loadedAt - (1 + i * 1.7 + r() * 2) * DAY
      const timeline: TimelineEntry[] = [{ kind: 'comment', id: `c${i}-0`, author: rest.author, date: created, body }]
      if (rest.labels.length) timeline.push({ kind: 'event', id: `e${i}-l`, actor: me.login, date: created + HOUR, action: 'labeled', detail: rest.labels.join(',') })
      if (reply) timeline.push({ kind: 'comment', id: `c${i}-1`, author: pick(r, [me.login, ...others.filter((o) => o !== rest.author)]), date: created + (3 + r() * 20) * HOUR, body: reply })
      if (rest.state === 'closed') timeline.push({ kind: 'event', id: `e${i}-c`, actor: me.login, date: created + DAY, action: 'closed' })
      return { ...rest, number: 0, created, assignees: r() < 0.5 ? [me.login] : [], timeline }
    })
    .sort((a, b) => a.created - b.created)

  // Pull requests: typo fixes in real lines of real files.
  const docs = repo.files.filter((f) => f.lang === 'markdown')
  const pulls: PullRequest[] = [
    { title: `Fix typo in ${docs[0]?.name ?? 'README.md'}`, path: docs[0]?.path ?? repo.files[0]!.path, state: 'open' as const, checks: 'success' as const },
    { title: `Fix typo in ${vueFiles[1]?.name ?? repo.files[0]!.name} comment`, path: vueFiles[1]?.path ?? repo.files[0]!.path, state: 'merged' as const, checks: 'success' as const },
    { title: `Fix typo in ${vueFiles[0]?.name ?? repo.files[0]!.name}`, path: vueFiles[0]?.path ?? repo.files[0]!.path, state: 'open' as const, checks: 'failure' as const },
  ].map((p, i) => {
    const author = pick(r, others)
    const created = loadedAt - (0.5 + i * 2.3) * DAY
    const timeline: TimelineEntry[] = [
      { kind: 'comment', id: `p${i}-0`, author, date: created, body: 'Spotted this while reading through the code. Small fix!' },
      { kind: 'event', id: `p${i}-c`, actor: author, date: created + 60_000, action: 'committed', detail: p.title },
    ]
    if (p.state === 'merged') timeline.push({ kind: 'event', id: `p${i}-m`, actor: me.login, date: created + 5 * HOUR, action: 'merged' })
    if (p.checks === 'failure') timeline.push({ kind: 'comment', id: `p${i}-1`, author: me.login, date: created + 2 * HOUR, body: 'Thanks! Looks like the **test** job failed, could you take a look? It might be flaky, I can re-run it.' })
    return { number: 0, title: p.title, author, state: p.state, labels: ['docs'], assignees: [], created, timeline, branch: `${author}/fix-typo-${i + 1}`, changes: [{ kind: 'typo', path: p.path }], checks: p.checks }
  })

  // Issues and pull requests share one sequence of numbers, in order of creation.
  ;[...issues, ...pulls].sort((a, b) => a.created - b.created).forEach((x, i) => (x.number = i + 1))
  issues.sort((a, b) => b.number - a.number)
  pulls.sort((a, b) => b.number - a.number)

  // CI runs for the latest commits, the third one failed.
  const runs: Run[] = commits.slice(0, 6).map((c, i) => makeRun(repo, i === 2 ? 'failure' : 'success', c.message, c.sha, c.author, c.date + 30_000, 60 - i * 1, 'push', 'main'))

  return { commits, issues, pulls, runs }
}

// --- CI logs ------------------------------------------------------------------------------------

const C = { dim: '\x1b[2m', green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m', cyan: '\x1b[36m', bold: '\x1b[1m', reset: '\x1b[0m' }

export function makeRun(repo: Repo, outcome: 'success' | 'failure', title: string, commitSha: string, actor: string, started: number, number: number, event: Run['event'], branch: string): Run {
  const r = rng(`${repo.id}-${number}-${title}`)
  const comps = componentsOf(repo)
  const files = repo.files.filter((f) => f.lang !== 'markdown')
  const ms = () => Math.round(80 + r() * 900)
  const testLines = files.slice(0, 6).map((f) => `${C.green} ✓${C.reset} ${f.path.replace(/\.(vue|ts)$/, '')}.test.ts ${C.dim}(${2 + Math.floor(r() * 9)} tests) ${ms()}ms${C.reset}`)
  const failing = files[1]?.path.replace(/\.(vue|ts)$/, '') ?? 'app'
  const setup: Step = { name: 'Set up job', seconds: 2, log: [`${C.dim}Runner: ubuntu-24.04, 4 cores${C.reset}`, 'Prepare workflow directory', `Download action repository 'actions/checkout@v4'`, `Download action repository 'pnpm/action-setup@v4'`] }
  const install: Step = { name: 'Install dependencies', seconds: 14, log: [`${C.cyan}$ pnpm install --frozen-lockfile${C.reset}`, 'Lockfile is up to date, resolution step is skipped', `Packages: ${C.green}+${312 + Math.floor(r() * 40)}${C.reset}`, `Progress: resolved 352, reused 352, downloaded 0, added 352, ${C.green}done${C.reset}`, `${C.dim}dependencies:${C.reset}`, `+ @m3ui-vue/m3ui-vue 0.8.8`, '+ vue 3.5.24', `Done in 11.2s`] }
  const typecheck: Step = { name: 'Type check', seconds: 21, log: [`${C.cyan}$ vue-tsc --noEmit${C.reset}`, ...comps.slice(0, 4).map((c) => `${C.dim}checking usages of ${c}…${C.reset}`), `${C.green}No type errors found${C.reset}`] }
  const test: Step = {
    name: 'Run tests',
    seconds: 33,
    log:
      outcome === 'success'
        ? [`${C.cyan}$ vitest run${C.reset}`, '', ...testLines, '', `${C.bold} Test Files${C.reset}  ${C.green}${testLines.length} passed${C.reset} (${testLines.length})`, `${C.bold}      Tests${C.reset}  ${C.green}${testLines.length * 5} passed${C.reset}`, `${C.dim}   Duration  4.${Math.floor(r() * 9)}1s${C.reset}`]
        : [`${C.cyan}$ vitest run${C.reset}`, '', ...testLines.slice(0, 2), `${C.red} ✗${C.reset} ${failing}.test.ts ${C.dim}(6 tests | ${C.red}1 failed${C.reset}${C.dim})${C.reset}`, `   ${C.red}✗ keeps the order after a reorder${C.reset}`, '', `${C.red}${C.bold} FAIL ${C.reset} ${failing}.test.ts > keeps the order after a reorder`, `${C.red}AssertionError: expected [ 'b', 'a', 'c' ] to deeply equal [ 'a', 'b', 'c' ]${C.reset}`, `${C.dim} ❯ ${failing}.test.ts:42:24${C.reset}`, '', `${C.bold} Test Files${C.reset}  ${C.red}1 failed${C.reset} | ${C.green}${testLines.length - 1} passed${C.reset}`, `${C.red}Error: Process completed with exit code 1.${C.reset}`],
  }
  const build: Step = { name: 'Build', seconds: 17, log: [`${C.cyan}$ vite build${C.reset}`, `${C.dim}vite v8.3.4 building for production...${C.reset}`, `${C.green}✓${C.reset} ${200 + Math.floor(r() * 300)} modules transformed.`, `dist/index.html                   ${C.dim}0.46 kB${C.reset}`, `dist/assets/index.css            ${C.dim}${(40 + r() * 30).toFixed(2)} kB${C.reset}`, `dist/assets/index.js             ${C.dim}${(180 + r() * 120).toFixed(2)} kB${C.reset}`, `${C.green}✓ built in ${(1 + r() * 2).toFixed(2)}s${C.reset}`] }
  const deploy: Step = { name: 'Deploy preview', seconds: 9, log: ['Uploading artifact…', `Preview ready: ${C.cyan}https://m3ui.dev/examples/${repo.id}${C.reset}`] }
  const jobs: Job[] = [
    { name: 'check', status: 'success', steps: [setup, install, typecheck] },
    { name: 'test', status: outcome, steps: [setup, install, test] },
    { name: 'build', status: outcome === 'success' ? 'success' : 'skipped', steps: [setup, install, build, deploy] },
  ]
  return { id: `${repo.id}-run-${number}-${Math.round(r() * 1e6)}`, number, title, branch, event, actor, status: outcome, started, jobs, sha: commitSha }
}

export const jobSeconds = (j: Job) => j.steps.reduce((s, x) => s + x.seconds, 0)
export const runSeconds = (run: Run) => Math.max(...run.jobs.map(jobSeconds))
