/*
 * The repositories are real: every other example in these docs becomes a repo of the "m3ui"
 * organization, and its files are the actual source, loaded on demand with Vite's
 * import.meta.glob (`?raw`). The file tree is known up front; a file's text loads when you open it.
 */
import type { TreeNode } from '@m3ui-vue/m3ui-vue'
import { examples } from '@/examples/registry'

const loaders = import.meta.glob('../*/**/*.{ts,vue,md}', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>

export type Lang = 'vue' | 'typescript' | 'markdown'

export interface RepoFile {
  /** Path inside the repo, e.g. `components/Composer.vue`. */
  path: string
  name: string
  lang: Lang
  load: () => Promise<string>
}

export interface Repo {
  /** The example's folder, also the repo's id. */
  id: string
  name: string
  description: string
  topics: string[]
  files: RepoFile[]
  tree: TreeNode[]
  stars: number
  forks: number
  languages: Array<{ lang: Lang; share: number }>
}

// Product names the examples use inside themselves, so the repos read like real projects.
const names: Record<string, string> = { music: 'tempo', mail: 'postbox', store: 'nook', chat: 'chatter', dashboard: 'brew-analytics', desktop: 'webtop', forge: 'forge', feed: 'plaza', travel: 'driftway', photo: 'lightbench' }

const langOf = (name: string): Lang => (name.endsWith('.vue') ? 'vue' : name.endsWith('.md') ? 'markdown' : 'typescript')

function buildTree(files: RepoFile[]): TreeNode[] {
  const root: TreeNode[] = []
  for (const f of files) {
    const parts = f.path.split('/')
    let level = root
    parts.forEach((part, i) => {
      const id = parts.slice(0, i + 1).join('/')
      let node = level.find((n) => n.id === id)
      if (!node) {
        const isFile = i === parts.length - 1
        node = { id, label: part, icon: isFile ? fileIcon(part) : 'folder', ...(isFile ? {} : { children: [] }) }
        level.push(node)
      }
      level = node.children as TreeNode[]
    })
  }
  // Folders first, then files, each alphabetically (like the real thing).
  const sort = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => Number(!!b.children) - Number(!!a.children) || a.label.localeCompare(b.label))
    nodes.forEach((n) => n.children && sort(n.children))
  }
  sort(root)
  return root
}

export const fileIcon = (name: string) => (name.endsWith('.md') ? 'article' : name.endsWith('.vue') ? 'web' : 'code')

let seed = 7
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

export const repos: Repo[] = examples
  .map((e) => e.id)
  .concat('forge')
  .filter((id, i, all) => all.indexOf(id) === i)
  .map((id) => {
    const prefix = `../${id}/`
    const files = Object.keys(loaders)
      .filter((k) => k.startsWith(prefix))
      .map((k): RepoFile => {
        const path = k.slice(prefix.length)
        const name = path.split('/').at(-1)!
        return { path, name, lang: langOf(name), load: loaders[k]! }
      })
      .sort((a, b) => a.path.localeCompare(b.path))
    const counts = files.reduce<Record<string, number>>((acc, f) => ((acc[f.lang] = (acc[f.lang] ?? 0) + 1), acc), {})
    const total = files.length || 1
    const example = examples.find((e) => e.id === id)
    return {
      id,
      name: names[id] ?? id,
      description: example?.description ?? 'This very app: a code hosting site built only with m3ui-vue, browsing the source of the other examples.',
      topics: ['vue', 'material-design', ...(example?.uses.slice(0, 3).map((u) => u.toLowerCase()) ?? ['mtree', 'mcodeeditor'])],
      files,
      tree: buildTree(files),
      stars: Math.round(40 + rand() * 1800),
      forks: Math.round(4 + rand() * 160),
      languages: (Object.entries(counts) as Array<[Lang, number]>).map(([lang, n]) => ({ lang, share: n / total })).sort((a, b) => b.share - a.share),
    }
  })
  .filter((r) => r.files.length)

export const repoById = (id: string) => repos.find((r) => r.id === id)!

export const langInfo: Record<Lang, { label: string; color: string }> = {
  vue: { label: 'Vue', color: '#41b883' },
  typescript: { label: 'TypeScript', color: '#3178c6' },
  markdown: { label: 'Markdown', color: '#8c959f' },
}

/** Files and folders directly inside `dir` ('' for the root). */
export function listDir(repo: Repo, dir: string) {
  const find = (nodes: TreeNode[]): TreeNode[] => {
    if (!dir) return nodes
    for (const n of nodes) {
      if (n.id === dir) return n.children ?? []
      if (n.children && dir.startsWith(`${n.id}/`)) return find(n.children)
    }
    return []
  }
  return find(repo.tree)
}

export const isDir = (repo: Repo, path: string) => !repo.files.some((f) => f.path === path)
