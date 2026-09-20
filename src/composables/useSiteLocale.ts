import { ref } from 'vue'
import { esLocale, frLocale, ptLocale, deLocale, jaLocale, zhLocale, koLocale } from '@m3ui-vue/m3ui-vue/locales'
import type { M3Locale } from '@m3ui-vue/m3ui-vue'

export interface LocaleOption {
  id: string
  label: string
  locale: Partial<M3Locale>
}

export const localeOptions: LocaleOption[] = [
  { id: 'en', label: 'English', locale: {} },
  { id: 'es', label: 'Español', locale: esLocale },
  { id: 'fr', label: 'Français', locale: frLocale },
  { id: 'pt', label: 'Português', locale: ptLocale },
  { id: 'de', label: 'Deutsch', locale: deLocale },
  { id: 'ja', label: '日本語', locale: jaLocale },
  { id: 'zh', label: '中文', locale: zhLocale },
  { id: 'ko', label: '한국어', locale: koLocale },
]

const STORAGE_KEY = 'm3ui-docs-locale'

function initialOption(): LocaleOption {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const found = localeOptions.find(l => l.id === saved)
    if (found) return found
  } catch { /* localStorage unavailable */ }
  return localeOptions[0]!
}

const initial = initialOption()

/** Which locale id is active — read this for highlighting the current choice in a picker UI. */
export const activeLocaleId = ref(initial.id)

/**
 * The actual M3Locale override passed to createM3UI({ locale }) — a ref so switching it live
 * reactively updates every component using useLocale() across the site, the same way
 * useColorPalette's palette switch works.
 */
export const siteLocale = ref<Partial<M3Locale>>(initial.locale)

export function setSiteLocale(id: string) {
  const option = localeOptions.find(l => l.id === id)
  if (!option) return
  activeLocaleId.value = option.id
  siteLocale.value = option.locale
  try { localStorage.setItem(STORAGE_KEY, option.id) } catch { /* localStorage unavailable */ }
}
