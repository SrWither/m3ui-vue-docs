// Runs after `vite build`. GitHub Pages has no SPA rewrites: a deep link like /components/buttons/mbutton
// used to fall through to 404.html, which boots the app fine but answers with HTTP 404 — so search
// engines never indexed anything but the home page, and link previews always showed the home meta.
// This writes one copy of dist/index.html per route (same app, own title/description/og/canonical),
// which Pages serves with a 200. 404.html stays as the fallback for unknown URLs.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_URL, getRoutes } from './routes.mjs'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const template = readFileSync(`${dist}index.html`, 'utf8')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`)
  if (!re.test(html)) throw new Error(`index.html is missing <meta ${attr}="${key}">`)
  return html.replace(re, `$1${esc(value)}$2`)
}

function render({ path, title, description }) {
  const url = `${SITE_URL}${path}`
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
  html = setMeta(html, 'name', 'description', description)
  html = setMeta(html, 'property', 'og:title', title)
  html = setMeta(html, 'property', 'og:description', description)
  html = setMeta(html, 'property', 'og:url', url)
  html = setMeta(html, 'name', 'twitter:title', title)
  html = setMeta(html, 'name', 'twitter:description', description)
  return html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${esc(url)}"`)
}

const write = (file, html) => {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

const routes = getRoutes()
for (const route of routes) {
  const html = render(route)
  if (route.path === '/') {
    write(`${dist}index.html`, html)
    continue
  }
  // Pages serves /foo from foo.html; foo/index.html covers the case where a foo/ directory also
  // exists (section overviews like /components/buttons sit next to their components/buttons/ folder).
  write(`${dist}${route.path.slice(1)}.html`, html)
  if (routes.some((r) => r.path.startsWith(`${route.path}/`))) write(`${dist}${route.path.slice(1)}/index.html`, html)
}
console.log(`Prerendered meta for ${routes.length} routes`)
