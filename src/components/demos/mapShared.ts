// Shared by the map pages' demos (src/pages/components/map/)
import { onBeforeUnmount, onMounted, ref } from 'vue'

export const STYLE = 'https://tiles.openfreemap.org/styles/liberty'
export const CORDOBA: [number, number] = [-64.1888, -31.4201]

/**
 * The theme's colors as plain strings for MapLibre (it can't use var()) and whether it's dark, re-read when the
 * theme or palette changes (and again once its transition settles).
 */
export function useMapTheme() {
  const read = () => {
    const s = getComputedStyle(document.documentElement)
    const get = (n: string) => s.getPropertyValue(`--color-${n}`).trim()
    return {
      primary: get('primary'), secondary: get('secondary'), tertiary: get('tertiary'),
      dark: document.documentElement.classList.contains('dark'),
    }
  }
  const theme = ref({ primary: '', secondary: '', tertiary: '', dark: false })
  let observer: MutationObserver | undefined
  let settle: ReturnType<typeof setTimeout> | undefined
  onMounted(() => {
    theme.value = read()
    observer = new MutationObserver(() => {
      theme.value = read()
      clearTimeout(settle)
      settle = setTimeout(() => (theme.value = read()), 300)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-palette'] })
  })
  onBeforeUnmount(() => {
    observer?.disconnect()
    clearTimeout(settle)
  })
  return theme
}

/** Sample points around Córdoba's center, with a kind to filter by */
export const spots = {
  type: 'FeatureCollection' as const,
  features: [
    { name: 'Cathedral', kind: 'Church', at: [-64.1843, -31.4163] },
    { name: 'Compañía de Jesús', kind: 'Church', at: [-64.1874, -31.4198] },
    { name: 'Caraffa Museum', kind: 'Museum', at: [-64.1735, -31.4268] },
    { name: 'Evita Museum', kind: 'Museum', at: [-64.1795, -31.4281] },
    { name: 'Parque Sarmiento', kind: 'Park', at: [-64.1736, -31.4296] },
    { name: 'Mercado Norte', kind: 'Market', at: [-64.1856, -31.4093] },
  ].map(({ at, ...properties }) => ({ type: 'Feature' as const, properties, geometry: { type: 'Point' as const, coordinates: at } })),
}
