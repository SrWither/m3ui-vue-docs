import { ref } from 'vue'

export interface FontOption {
  id: string
  label: string
  /** Google Fonts family name — omitted for Roboto, which index.html already loads */
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

const STORAGE_KEY = 'm3ui-docs-font'

export function fontStack(option: FontOption): string {
  return `'${option.family ?? 'Roboto'}', system-ui, ${option.fallback}`
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
  for (const f of fontOptions) {
    if (f.family) injectLink(`font-preview-${f.id}`, googleFontsHref(f.family, `&text=${encodeURIComponent(f.label)}`))
  }
}

function apply(option: FontOption) {
  const root = document.documentElement
  if (!option.family) {
    root.style.removeProperty('--font-sans')
    return
  }
  // M3UI uses 400/500/700 (regular, medium, bold)
  injectLink(`font-${option.id}`, googleFontsHref(option.family, ':wght@400;500;700'))
  root.style.setProperty('--font-sans', fontStack(option))
}

function initialOption(): FontOption {
  try {
    const found = fontOptions.find(f => f.id === localStorage.getItem(STORAGE_KEY))
    if (found) return found
  } catch { /* localStorage unavailable */ }
  return fontOptions[0]!
}

const initial = initialOption()
apply(initial)

/** Which font id is active — read this for highlighting the current choice in a picker UI. */
export const activeFontId = ref(initial.id)

export function setSiteFont(id: string) {
  const option = fontOptions.find(f => f.id === id)
  if (!option) return
  activeFontId.value = option.id
  apply(option)
  try { localStorage.setItem(STORAGE_KEY, option.id) } catch { /* localStorage unavailable */ }
}
