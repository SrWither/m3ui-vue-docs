import { onBeforeUnmount, onMounted, ref } from 'vue'

/*
 * The theme's colors as plain strings, for Chart.js datasets (a canvas can't read CSS
 * variables). Re-read whenever the theme (`class="dark"`) or the palette (`data-palette`)
 * changes on <html>, so the charts recolor with the rest of the page.
 */
const names = ['primary', 'secondary', 'tertiary', 'error', 'success', 'primary-container', 'tertiary-container', 'outline-variant', 'surface-container-low'] as const
type Name = (typeof names)[number]

function read(): Record<Name, string> {
  const style = getComputedStyle(document.documentElement)
  return Object.fromEntries(names.map((n) => [n, style.getPropertyValue(`--color-${n}`).trim()])) as Record<Name, string>
}

/** `#rrggbb` + alpha (0–1) → `rgba()`, for fills under a line. */
export function alpha(hex: string, a: number) {
  const m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i)
  if (!m) return hex
  return `rgba(${parseInt(m[1]!, 16)}, ${parseInt(m[2]!, 16)}, ${parseInt(m[3]!, 16)}, ${a})`
}

export function useThemeColors() {
  const colors = ref(read())
  let observer: MutationObserver | undefined
  onMounted(() => {
    // The palette switch animates (theme-transitioning); read after it settles too.
    const refresh = () => {
      colors.value = read()
      setTimeout(() => (colors.value = read()), 350)
    }
    observer = new MutationObserver(refresh)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-palette', 'style'] })
  })
  onBeforeUnmount(() => observer?.disconnect())
  return colors
}
