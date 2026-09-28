import { ref, type Ref } from 'vue'

// Docs-site-only font switcher: M3UI itself just reads --font-sans / --font-mono,
// so swapping fonts is left to the app — this is one way an app can do it.

export type FontKind = 'sans' | 'mono'

export interface FontOption {
  id: string
  label: string
  /** Google Fonts family name — omitted for the theme default, which index.html already loads */
  family?: string
  fallback: string
}

export const fontOptions: FontOption[] = [
  { id: 'roboto', label: 'Roboto', fallback: 'sans-serif' },
  { id: 'inter', label: 'Inter', family: 'Inter', fallback: 'sans-serif' },
  { id: 'open-sans', label: 'Open Sans', family: 'Open Sans', fallback: 'sans-serif' },
  { id: 'lato', label: 'Lato', family: 'Lato', fallback: 'sans-serif' },
  { id: 'nunito', label: 'Nunito', family: 'Nunito', fallback: 'sans-serif' },
  { id: 'poppins', label: 'Poppins', family: 'Poppins', fallback: 'sans-serif' },
  { id: 'montserrat', label: 'Montserrat', family: 'Montserrat', fallback: 'sans-serif' },
  { id: 'dm-sans', label: 'DM Sans', family: 'DM Sans', fallback: 'sans-serif' },
  { id: 'outfit', label: 'Outfit', family: 'Outfit', fallback: 'sans-serif' },
  { id: 'space-grotesk', label: 'Space Grotesk', family: 'Space Grotesk', fallback: 'sans-serif' },
  { id: 'merriweather', label: 'Merriweather', family: 'Merriweather', fallback: 'serif' },
  { id: 'playfair', label: 'Playfair Display', family: 'Playfair Display', fallback: 'serif' },
]

export const monoFontOptions: FontOption[] = [
  { id: 'roboto-mono', label: 'Roboto Mono', fallback: 'monospace' },
  { id: 'jetbrains-mono', label: 'JetBrains Mono', family: 'JetBrains Mono', fallback: 'monospace' },
  { id: 'fira-code', label: 'Fira Code', family: 'Fira Code', fallback: 'monospace' },
  { id: 'source-code-pro', label: 'Source Code Pro', family: 'Source Code Pro', fallback: 'monospace' },
  { id: 'ibm-plex-mono', label: 'IBM Plex Mono', family: 'IBM Plex Mono', fallback: 'monospace' },
  { id: 'inconsolata', label: 'Inconsolata', family: 'Inconsolata', fallback: 'monospace' },
  { id: 'dm-mono', label: 'DM Mono', family: 'DM Mono', fallback: 'monospace' },
]

const config: Record<FontKind, { options: FontOption[]; defaultFamily: string; weights: string; storageKey: string }> = {
  // M3UI UI text uses 400/500/700; code only needs regular + medium
  sans: { options: fontOptions, defaultFamily: 'Roboto', weights: '400;500;700', storageKey: 'm3ui-docs-font' },
  mono: { options: monoFontOptions, defaultFamily: 'Roboto Mono', weights: '400;500', storageKey: 'm3ui-docs-font-mono' },
}

export function fontStack(option: FontOption, kind: FontKind = 'sans'): string {
  const system = kind === 'mono' ? 'ui-monospace' : 'system-ui'
  return `'${option.family ?? config[kind].defaultFamily}', ${system}, ${option.fallback}`
}

function googleFontsHref(family: string, extra = ''): string {
  return `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}${extra}&display=swap`
}

function injectLink(id: string, href: string) {
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

/** Loads just the glyphs of each font's own name, so a picker can preview them for a few KB. */
export function loadFontPreviews() {
  for (const f of [...fontOptions, ...monoFontOptions]) {
    if (f.family) injectLink(`font-preview-${f.id}`, googleFontsHref(f.family, `&text=${encodeURIComponent(f.label)}`))
  }
}

function apply(kind: FontKind, option: FontOption) {
  const root = document.documentElement
  const prop = `--font-${kind}`
  if (!option.family) {
    root.style.removeProperty(prop) // back to theme.css's default
    return
  }
  injectLink(`font-${option.id}`, googleFontsHref(option.family, `:wght@${config[kind].weights}`))
  root.style.setProperty(prop, fontStack(option, kind))
}

function init(kind: FontKind): Ref<string> {
  const { options, storageKey } = config[kind]
  let option = options[0]!
  try {
    option = options.find(f => f.id === localStorage.getItem(storageKey)) ?? option
  } catch { /* localStorage unavailable */ }
  apply(kind, option)
  return ref(option.id)
}

/** Which font id is active per kind — read these for highlighting the current choice in a picker UI. */
export const activeFontId = init('sans')
export const activeMonoFontId = init('mono')

function set(kind: FontKind, active: Ref<string>, id: string) {
  const option = config[kind].options.find(f => f.id === id)
  if (!option) return
  active.value = option.id
  apply(kind, option)
  try { localStorage.setItem(config[kind].storageKey, option.id) } catch { /* localStorage unavailable */ }
}

export const setSiteFont = (id: string) => set('sans', activeFontId, id)
export const setSiteMonoFont = (id: string) => set('mono', activeMonoFontId, id)
