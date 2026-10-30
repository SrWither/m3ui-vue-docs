/*
 * What's in the drive to begin with. The PDFs are the docs' own samples (public/pdf/, written for these pages);
 * the films and music play from Wikimedia Commons (Blender Foundation open movies and Kevin MacLeod's music,
 * CC BY 3.0); the photos are drawn as SVG.
 */
import { films, tracks } from '@/components/demos/mediaSamples'
import type { PdfAnnotation } from '@m3ui-vue/m3ui-vue/pdf'

export type Kind = 'folder' | 'pdf' | 'image' | 'video' | 'audio'

export interface Item {
  id: string
  name: string
  kind: Kind
  /** Folder it sits in; null at the top */
  parent: string | null
  /** Bytes (folders: 0) */
  size: number
  modified: number
  owner: string
  starred?: boolean
  /** In the trash since */
  trashed?: number
  shared?: boolean
  /** Where it plays or shows from */
  src?: string
  /** A picture for the grid (video posters, covers) */
  thumb?: string
  /** Folder color */
  color?: string
  /** A PDF's annotations */
  annotations?: PdfAnnotation[]
  artist?: string
  /** A file added from your device (an object URL, released when deleted) */
  local?: boolean
}

const DAY = 86_400_000
const now = Date.now()
const ago = (days: number, hours = 0) => now - days * DAY - hours * 3_600_000

// A landscape in a few layers, for the photos
function photo(sky: [string, string], hills: string[], sun: string) {
  const layers = hills.map((c, i) => {
    const y = 120 + i * 40
    return `<path d="M0 ${y} C 80 ${y - 50 + i * 10}, 160 ${y + 20}, 240 ${y - 20} S 380 ${y - 40}, 480 ${y - 10} V 360 H 0 Z" fill="${c}"/>`
  }).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs><rect width="480" height="360" fill="url(#s)"/><circle cx="340" cy="90" r="34" fill="${sun}"/>${layers}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export const seed: Item[] = [
  { id: 'garden', name: 'Garden club', kind: 'folder', parent: null, size: 0, modified: ago(1), owner: 'You', color: '#4CAF50', shared: true },
  { id: 'money', name: 'Finances', kind: 'folder', parent: null, size: 0, modified: ago(3), owner: 'You', color: '#FFB300' },
  { id: 'home', name: 'Home', kind: 'folder', parent: null, size: 0, modified: ago(9), owner: 'You', color: '#29B6F6' },
  { id: 'films', name: 'Film night', kind: 'folder', parent: null, size: 0, modified: ago(14), owner: 'You', color: '#AB47BC' },
  { id: 'music', name: 'Music', kind: 'folder', parent: null, size: 0, modified: ago(20), owner: 'You', color: '#EF5350' },

  { id: 'guide', name: 'Pocket Gardens field guide.pdf', kind: 'pdf', parent: 'garden', size: 183_300, modified: ago(0, 2), owner: 'Mara Ellison', starred: true, shared: true, src: '/pdf/pocket-gardens.pdf' },
  { id: 'p1', name: 'Balcony in June.svg', kind: 'image', parent: 'garden', size: 2_412_000, modified: ago(2), owner: 'You', src: photo(['#9fd3ff', '#fef6e4'], ['#7cb87f', '#4f9a5a', '#2f6e3f'], '#ffd54f') },
  { id: 'p2', name: 'Seed swap.svg', kind: 'image', parent: 'garden', size: 1_980_000, modified: ago(5), owner: 'Jonah Reyes', src: photo(['#ffcf9f', '#ffeedd'], ['#c58b5a', '#9b6b45', '#6d4a30'], '#ff8a65') },
  { id: 'p3', name: 'Harvest.svg', kind: 'image', parent: 'garden', size: 2_870_000, modified: ago(6), owner: 'You', src: photo(['#b39ddb', '#ffe0b2'], ['#8d6e63', '#6d4c41', '#4e342e'], '#fff176') },

  { id: 'invoice', name: 'Invoice INV-2026-0142.pdf', kind: 'pdf', parent: 'money', size: 42_339, modified: ago(3), owner: 'Lattice Studio', src: '/pdf/invoice.pdf' },
  { id: 'lease', name: 'Lease agreement (password m3ui).pdf', kind: 'pdf', parent: 'home', size: 54_916, modified: ago(9), owner: 'Harbourview Properties', src: '/pdf/lease-protected.pdf' },
  { id: 'p4', name: 'Moving day.svg', kind: 'image', parent: 'home', size: 1_640_000, modified: ago(11), owner: 'You', src: photo(['#80deea', '#e0f7fa'], ['#90a4ae', '#607d8b', '#37474f'], '#ffffff') },

  ...films.map((f, i): Item => ({
    id: `film-${f.id}`, name: `${f.title}.webm`, kind: 'video', parent: 'films', size: [148, 201, 166][i]! * 1_000_000,
    modified: ago(14 + i), owner: 'Blender Foundation', src: f.src, thumb: f.poster, starred: i === 1,
  })),
  ...tracks.map((t, i): Item => ({
    id: `track-${i}`, name: `${t.title}.mp3`, kind: 'audio', parent: 'music', size: [4.9, 6.1, 5.4, 3.8][i]! * 1_000_000,
    modified: ago(20 + i), owner: 'You', src: t.src, thumb: t.artwork, artist: t.artist,
  })),

  { id: 'top-guide', name: 'Read me first.pdf', kind: 'pdf', parent: null, size: 183_300, modified: ago(0, 5), owner: 'You', src: '/pdf/pocket-gardens.pdf' },
  { id: 'top-photo', name: 'Window box.svg', kind: 'image', parent: null, size: 2_100_000, modified: ago(1, 3), owner: 'You', starred: true, src: photo(['#a5d6a7', '#f1f8e9'], ['#81c784', '#43a047', '#1b5e20'], '#fff59d') },
]

/** 15 GB, of which the seed and your uploads use a little */
export const QUOTA = 15_000_000_000
/** What's stored outside this example (mail, photos…), so the meter doesn't start empty */
export const ELSEWHERE = 4_200_000_000
