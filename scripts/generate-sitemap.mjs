// Generates public/sitemap.xml from the same route sources as src/router.ts:
// auto-discovered component pages under src/pages/components/**, plus the
// explicit static routes. Runs before `vite build` so the file lands in dist/
// via Vite's public/ passthrough. Keep the static route list below in sync
// with router.ts if routes are added/removed there.
import { readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SITE_URL = 'https://m3ui.dev'
const componentsDir = fileURLToPath(new URL('../src/pages/components', import.meta.url))

const componentPaths = readdirSync(componentsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .flatMap((sectionEntry) => {
    const section = sectionEntry.name
    return readdirSync(`${componentsDir}/${section}`)
      .filter((file) => file.endsWith('.vue'))
      .map((file) => `/components/${section}/${file.replace(/\.vue$/, '').toLowerCase()}`)
  })
  .sort()

const staticPaths = [
  '/',
  '/getting-started/setup',
  '/getting-started/i18n',
  '/components/buttons',
  '/components/inputs',
  '/components/feedback',
  '/components/data-display',
  '/components/navigation',
  '/components/layout',
  '/components/overlays',
  '/components/tables',
  '/components/utility',
  '/components/editors',
  '/components/advanced',
  '/examples',
  '/examples/apps',
  '/styles/palettes',
  '/styles/palette-builder',
  '/changelog',
]

const allPaths = [...staticPaths, ...componentPaths]
const lastmod = new Date().toISOString().slice(0, 10)

const urls = allPaths
  .map((path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)
console.log(`Generated sitemap.xml with ${allPaths.length} URLs`)
