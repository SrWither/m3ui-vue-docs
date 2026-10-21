/*
 * The open recipe's scheme, for RecipesExample to put on <html> (so teleported pieces like toasts
 * and sheets wear it too): the library's generateScheme() as inline --color-* variables. Cards and
 * other pieces use MScheme instead, which does the same on its own element.
 */
import { computed, reactive, ref, type MaybeRefOrGetter, toValue } from 'vue'
import { generateScheme, type GeneratedScheme } from '@m3ui-vue/m3ui-vue'

const schemes = reactive(new Map<string, GeneratedScheme>())
const pending = new Set<string>()

// Follow the app's light/dark class, whatever set it (the theme button, or the system).
const isDark = ref(document.documentElement.classList.contains('dark'))
new MutationObserver(() => {
  isDark.value = document.documentElement.classList.contains('dark')
}).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

function load(seed: string) {
  if (schemes.has(seed) || pending.has(seed)) return
  pending.add(seed)
  // 'content' keeps the seed's own hue and chroma in the primary container (a tomato red dish
  // gets a tomato red page, not a tamer tone of it) and picks an analogous tertiary, so the
  // accents stay in the dish's family instead of 'fidelity''s complementary color.
  generateScheme(seed, { variant: 'content' }).then((s) => {
    schemes.set(seed, s)
    pending.delete(seed)
  })
}

/** Builds (once) the schemes for a list of seeds, so cards don't pop in one by one. */
export function preload(seeds: string[]) {
  seeds.forEach(load)
}

/**
 * Inline style for an element that should wear `seed`'s scheme. Undefined until it's ready (the
 * element keeps the app's colors meanwhile).
 */
export function useScheme(seed: MaybeRefOrGetter<string | undefined>) {
  return computed(() => {
    const s = toValue(seed)
    if (!s) return undefined
    load(s)
    const scheme = schemes.get(s)
    if (!scheme) return undefined
    const tokens = isDark.value ? scheme.dark : scheme.light
    const style: Record<string, string> = { colorScheme: isDark.value ? 'dark' : 'light' }
    for (const [role, value] of Object.entries(tokens)) style[`--color-${role}`] = value
    return style
  })
}

/** True once every seed's scheme is built. */
export const ready = (seeds: string[]) => seeds.every((s) => schemes.has(s))
