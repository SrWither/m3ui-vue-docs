// Every public route with its title and description, read from the same sources the app uses:
// component pages from src/pages/components/** (description from their section overview card),
// section overviews from their own <h1> + intro <p>, examples from src/examples/registry.ts.
// Used by generate-sitemap.mjs (before the build) and prerender-meta.mjs (after it).
// Keep STATIC below in sync with router.ts if top-level pages are added/removed there.
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const SITE_URL = 'https://m3ui.dev'
export const SITE_NAME = 'M3UI Vue'

const src = (p) => fileURLToPath(new URL(`../src/${p}`, import.meta.url))
const read = (p) => readFileSync(src(p), 'utf8')

const decode = (s) =>
  s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim()

// '...' or "..." JS string literal body -> plain text
const unquote = (lit) => lit.slice(1, -1).replace(/\\(.)/g, '$1')

/** <h1>Title</h1> followed by the intro <p>, as rendered at the top of most pages. */
function pageIntro(file) {
  const m = read(`pages/${file}`).match(/<h1[^>]*>([^<]+)<\/h1>\s*<p[^>]*>([\s\S]*?)<\/p>/)
  if (!m) throw new Error(`No <h1> + intro <p> found in ${file}`)
  return { heading: decode(m[1]), description: decode(m[2]) }
}

const SECTIONS = {
  buttons: 'ButtonsPage.vue',
  inputs: 'InputsPage.vue',
  feedback: 'FeedbackPage.vue',
  'data-display': 'DataDisplayPage.vue',
  navigation: 'NavigationPage.vue',
  layout: 'LayoutPage.vue',
  overlays: 'OverlaysPage.vue',
  tables: 'TablesPage.vue',
  utility: 'UtilityPage.vue',
  editors: 'EditorsPage.vue',
  advanced: 'AdvancedPage.vue',
}

const DEFAULT_DESCRIPTION =
  'Material Design 3 component library for Vue 3 + Tailwind CSS v4 — 135+ tree-shakeable components, 40 color palettes, dark mode, and i18n support.'

const STATIC = [
  { path: '/', title: `${SITE_NAME} — Documentation`, description: DEFAULT_DESCRIPTION },
  {
    path: '/getting-started/setup',
    title: `Setup — ${SITE_NAME}`,
    description: 'Install M3UI Vue, add the Tailwind CSS v4 theme and fonts, and start using Material Design 3 components in your Vue 3 app.',
  },
  {
    path: '/getting-started/i18n',
    title: `Internationalization (i18n) — ${SITE_NAME}`,
    description: pageIntro('I18nPage.vue').description,
  },
  { path: '/examples', title: `Examples — ${SITE_NAME}`, description: pageIntro('ExamplesPage.vue').description },
  { path: '/styles/palettes', title: `Color Palettes — ${SITE_NAME}`, description: pageIntro('PalettesPage.vue').description },
  { path: '/styles/colors', title: `Colors — ${SITE_NAME}`, description: pageIntro('ColorsPage.vue').description },
  { path: '/styles/typography', title: `Typography — ${SITE_NAME}`, description: pageIntro('TypographyPage.vue').description },
  {
    path: '/styles/palette-builder',
    title: `Palette Builder — ${SITE_NAME}`,
    description: pageIntro('PaletteBuilderPage.vue').description,
  },
  {
    path: '/changelog',
    title: `Changelog — ${SITE_NAME}`,
    description: 'All notable changes to @m3ui-vue/m3ui-vue, version by version.',
  },
]

function sectionRoutes() {
  return Object.entries(SECTIONS).flatMap(([section, file]) => {
    const { heading, description } = pageIntro(file)
    const overview = { path: `/components/${section}`, title: `${heading} components — ${SITE_NAME}`, description }

    // { name: 'MButton', description: '...' } cards on the section overview page
    const cards = new Map()
    for (const m of read(`pages/${file}`).matchAll(/\{\s*name:\s*'([^']+)',\s*description:\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g)) {
      cards.set(m[1], unquote(m[2]))
    }

    const pages = readdirSync(src(`pages/components/${section}`))
      .filter((f) => f.endsWith('.vue'))
      .map((f) => {
        const name = f.replace(/\.vue$/, '')
        const card = cards.get(name)
        if (!card) throw new Error(`No description card for ${name} in ${file}`)
        return { path: `/components/${section}/${name.toLowerCase()}`, title: `${name} — ${SITE_NAME}`, description: card }
      })
      .sort((a, b) => a.path.localeCompare(b.path))

    return [overview, ...pages]
  })
}

// Top-level groups outside Components: overview page + one page per src/pages/<group>/<name>.vue,
// described by the { name, description } cards on the overview.
const GROUPS = {
  composables: 'ComposablesPage.vue',
  directives: 'DirectivesPage.vue',
}

function groupRoutes() {
  return Object.entries(GROUPS).flatMap(([group, file]) => {
    const { heading, description } = pageIntro(file)
    const overview = { path: `/${group}`, title: `${heading} — ${SITE_NAME}`, description }
    const cards = new Map()
    for (const m of read(`pages/${file}`).matchAll(/\{\s*name:\s*'([^']+)',\s*description:\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g)) {
      cards.set(m[1], unquote(m[2]))
    }
    const pages = readdirSync(src(`pages/${group}`))
      .filter((f) => f.endsWith('.vue'))
      .map((f) => {
        const name = f.replace(/\.vue$/, '')
        const card = cards.get(name)
        if (!card) throw new Error(`No description card for ${name} in ${file}`)
        return { path: `/${group}/${name.toLowerCase()}`, title: `${name} — ${SITE_NAME}`, description: card }
      })
      .sort((a, b) => a.path.localeCompare(b.path))
    return [overview, ...pages]
  })
}

function exampleRoutes() {
  const re = /id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*description:\s*('(?:[^'\\]|\\.)*')/g
  const found = [...read('examples/registry.ts').matchAll(re)]
  if (!found.length) throw new Error('No examples found in src/examples/registry.ts')
  return found.map(([, id, title, description]) => ({
    path: `/examples/${id}`,
    title: `${title} example — ${SITE_NAME}`,
    description: unquote(description),
  }))
}

export function getRoutes() {
  return [...STATIC, ...sectionRoutes(), ...groupRoutes(), ...exampleRoutes()]
}
