/*
 * Shared state for the Files example (Folio): every item, where you are, what's selected and open, and the
 * actions on them. Module level, so it survives switching views; nothing leaves the browser (uploads are object
 * URLs, released when deleted for good).
 */
import { computed, ref, shallowRef } from 'vue'
import { useToast } from '@m3ui-vue/m3ui-vue'
import type { PdfAnnotation } from '@m3ui-vue/m3ui-vue/pdf'
import { ELSEWHERE, QUOTA, seed, type Item, type Kind } from './data'

export type Section = 'files' | 'recent' | 'starred' | 'shared' | 'trash'
export type SortKey = 'name' | 'modified' | 'size'

const toast = useToast()

const items = ref<Item[]>(seed.map((i) => ({ ...i })))
const section = ref<Section>('files')
const folder = ref<string | null>(null)
const layout = ref<'grid' | 'list'>('grid')
const sort = ref<{ key: SortKey; desc: boolean }>({ key: 'name', desc: false })
const query = ref('')
const kindFilter = ref<Kind | null>(null)
const selected = ref<Set<string>>(new Set())
const detailsOpen = ref(false)
/** The file open in the viewer (PDF, video, audio) */
const viewing = ref<string | null>(null)
/** An image open in the lightbox, among its folder's images */
const lightbox = shallowRef<{ ids: string[]; index: number } | null>(null)

const byId = (id: string | null | undefined) => items.value.find((i) => i.id === id)
const alive = computed(() => items.value.filter((i) => !i.trashed && !inTrashedFolder(i)))
function inTrashedFolder(i: Item): boolean {
  let p = byId(i.parent)
  while (p) {
    if (p.trashed) return true
    p = byId(p.parent)
  }
  return false
}

function sorted(list: Item[]) {
  const { key, desc } = sort.value
  const dir = desc ? -1 : 1
  return [...list].sort((a, b) => {
    // Folders first, like every file manager
    if ((a.kind === 'folder') !== (b.kind === 'folder')) return a.kind === 'folder' ? -1 : 1
    const v = key === 'name' ? a.name.localeCompare(b.name, undefined, { numeric: true }) : key === 'size' ? sizeOf(a) - sizeOf(b) : a.modified - b.modified
    return v * dir
  })
}

/** What the current view lists */
const listed = computed(() => {
  const q = query.value.trim().toLowerCase()
  let list: Item[]
  if (section.value === 'trash') list = items.value.filter((i) => i.trashed)
  else if (q) list = alive.value.filter((i) => i.name.toLowerCase().includes(q))
  else if (section.value === 'recent') list = alive.value.filter((i) => i.kind !== 'folder').sort((a, b) => b.modified - a.modified).slice(0, 12)
  else if (section.value === 'starred') list = alive.value.filter((i) => i.starred)
  else if (section.value === 'shared') list = alive.value.filter((i) => i.shared || (i.owner !== 'You' && i.kind !== 'folder'))
  else list = alive.value.filter((i) => i.parent === folder.value)
  if (kindFilter.value) list = list.filter((i) => i.kind === kindFilter.value)
  return section.value === 'recent' && !q ? list : sorted(list)
})

const path = computed(() => {
  const out: Item[] = []
  let f = byId(folder.value)
  while (f) {
    out.unshift(f)
    f = byId(f.parent)
  }
  return out
})

function sizeOf(i: Item): number {
  if (i.kind !== 'folder') return i.size
  return alive.value.filter((c) => c.parent === i.id).reduce((s, c) => s + sizeOf(c), 0)
}
const countIn = (folderId: string) => alive.value.filter((c) => c.parent === folderId).length

const used = computed(() => ELSEWHERE + items.value.filter((i) => i.kind !== 'folder').reduce((s, i) => s + i.size, 0))

// ── Navigation ──────────────────────────────────────────────────────────────────────────────────────────
function goSection(s: Section) {
  section.value = s
  folder.value = null
  query.value = ''
  selected.value = new Set()
}
function goFolder(id: string | null) {
  section.value = 'files'
  folder.value = id
  query.value = ''
  selected.value = new Set()
}

function open(i: Item) {
  if (i.trashed) return
  touch(i)
  if (i.kind === 'folder') return goFolder(i.id)
  if (i.kind === 'image') {
    const images = listed.value.filter((x) => x.kind === 'image')
    lightbox.value = { ids: images.map((x) => x.id), index: Math.max(0, images.findIndex((x) => x.id === i.id)) }
    return
  }
  viewing.value = i.id
}
// Opening counts for Recent
function touch(i: Item) {
  if (i.kind !== 'folder') i.modified = Math.max(i.modified, Date.now() - 1000)
}

// ── Selection ───────────────────────────────────────────────────────────────────────────────────────────
function select(id: string, mode: 'only' | 'toggle' | 'range' = 'only') {
  const next = new Set(mode === 'only' ? [] : selected.value)
  if (mode === 'range' && selected.value.size) {
    const ids = listed.value.map((i) => i.id)
    const last = [...selected.value].pop()!
    const [a, b] = [ids.indexOf(last), ids.indexOf(id)].sort((x, y) => x - y)
    ids.slice(a, b + 1).forEach((x) => next.add(x))
  } else if (mode === 'toggle' && next.has(id)) next.delete(id)
  else next.add(id)
  selected.value = next
}
const clearSelection = () => (selected.value = new Set())
const selectedItems = computed(() => [...selected.value].map(byId).filter((i): i is Item => !!i))

// ── Actions ─────────────────────────────────────────────────────────────────────────────────────────────
function toggleStar(list: Item[]) {
  const on = !list.every((i) => i.starred)
  list.forEach((i) => (i.starred = on))
  toast.info(on ? `Added to Starred` : `Removed from Starred`, { icon: on ? 'star' : 'star_outline' })
}

function trash(list: Item[]) {
  if (!list.length) return
  const at = Date.now()
  list.forEach((i) => (i.trashed = at))
  clearSelection()
  if (list.some((i) => i.id === viewing.value)) viewing.value = null
  toast.info(list.length === 1 ? `"${list[0]!.name}" moved to trash` : `${list.length} items moved to trash`, {
    icon: 'delete',
    action: { label: 'Undo', onClick: () => list.forEach((i) => delete i.trashed) },
  })
}
function restore(list: Item[]) {
  list.forEach((i) => delete i.trashed)
  clearSelection()
  toast.info(list.length === 1 ? `"${list[0]!.name}" restored` : `${list.length} items restored`, { icon: 'restore_from_trash' })
}
function deleteForever(list: Item[]) {
  const ids = new Set<string>()
  const collect = (id: string) => {
    ids.add(id)
    items.value.filter((c) => c.parent === id).forEach((c) => collect(c.id))
  }
  list.forEach((i) => collect(i.id))
  items.value.filter((i) => ids.has(i.id) && i.local && i.src).forEach((i) => URL.revokeObjectURL(i.src!))
  items.value = items.value.filter((i) => !ids.has(i.id))
  clearSelection()
  toast.info(list.length === 1 ? `"${list[0]!.name}" deleted forever` : `${list.length} items deleted forever`, { icon: 'delete_forever' })
}
const emptyTrash = () => deleteForever(items.value.filter((i) => i.trashed))

function rename(i: Item, name: string) {
  const clean = name.trim()
  if (!clean || clean === i.name) return
  i.name = clean
  i.modified = Date.now()
}

const uid = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
function newFolder(name: string) {
  const clean = name.trim() || 'Untitled folder'
  const f: Item = { id: uid(), name: clean, kind: 'folder', parent: section.value === 'files' ? folder.value : null, size: 0, modified: Date.now(), owner: 'You', color: '#7E57C2' }
  items.value.push(f)
  toast.success(`Folder "${clean}" created`, { icon: 'create_new_folder' })
  return f
}

function kindOf(file: File): Kind | null {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return 'pdf'
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  if (file.type.startsWith('audio/')) return 'audio'
  return null
}
function upload(files: FileList | File[]) {
  const added: Item[] = []
  const skipped: string[] = []
  for (const file of Array.from(files)) {
    const kind = kindOf(file)
    if (!kind) {
      skipped.push(file.name)
      continue
    }
    added.push({
      id: uid(), name: file.name, kind, parent: section.value === 'files' ? folder.value : null, size: file.size,
      modified: Date.now(), owner: 'You', src: URL.createObjectURL(file), local: true,
    })
  }
  items.value.push(...added)
  if (added.length) toast.success(added.length === 1 ? `"${added[0]!.name}" uploaded` : `${added.length} files uploaded`, { icon: 'cloud_done' })
  if (skipped.length) toast.warning(`Only PDFs, images, video and audio open here: skipped ${skipped.join(', ')}`)
}

function download(i: Item) {
  if (!i.src) return
  const a = document.createElement('a')
  a.href = i.src
  a.download = i.name
  a.target = '_blank'
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function setAnnotations(id: string, list: PdfAnnotation[]) {
  const i = byId(id)
  if (!i) return
  i.annotations = list
  i.modified = Date.now()
}

// ── Formatting ──────────────────────────────────────────────────────────────────────────────────────────
export function formatSize(bytes: number) {
  if (!bytes) return '—'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let n = bytes
  let u = 0
  while (n >= 1000 && u < units.length - 1) {
    n /= 1000
    u++
  }
  return `${n >= 100 || u === 0 ? Math.round(n) : n.toFixed(1)} ${units[u]}`
}

const dayFmt = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' })
const timeFmt = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' })
export function formatDate(t: number) {
  const d = new Date(t)
  const today = new Date()
  return d.toDateString() === today.toDateString() ? timeFmt.format(d) : dayFmt.format(d)
}

export const KIND_ICON: Record<Kind, string> = { folder: 'folder', pdf: 'picture_as_pdf', image: 'image', video: 'movie', audio: 'music_note' }
export const KIND_COLOR: Record<Kind, string> = { folder: '#7E57C2', pdf: '#E53935', image: '#43A047', video: '#8E24AA', audio: '#FB8C00' }
export const KIND_LABEL: Record<Kind, string> = { folder: 'Folder', pdf: 'PDF', image: 'Image', video: 'Video', audio: 'Audio' }

export function useFiles() {
  return {
    items, section, folder, layout, sort, query, kindFilter, selected, selectedItems, detailsOpen, viewing, lightbox,
    listed, path, used, quota: QUOTA, byId, sizeOf, countIn,
    goSection, goFolder, open, select, clearSelection,
    toggleStar, trash, restore, deleteForever, emptyTrash, rename, newFolder, upload, download, setAnnotations,
  }
}
