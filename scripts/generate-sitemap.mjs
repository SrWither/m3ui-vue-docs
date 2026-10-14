// Generates public/sitemap.xml from the route list in routes.mjs. Runs before `vite build` so the
// file lands in dist/ via Vite's public/ passthrough.
import { writeFileSync } from 'node:fs'
import { SITE_URL, getRoutes } from './routes.mjs'

const allPaths = getRoutes().map((r) => r.path)
const lastmod = new Date().toISOString().slice(0, 10)

const urls = allPaths
  .map((path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)
console.log(`Generated sitemap.xml with ${allPaths.length} URLs`)
