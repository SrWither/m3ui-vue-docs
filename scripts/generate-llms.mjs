// Generates the files AI agents and LLM tools read (https://llmstxt.org):
//   public/llms.txt                         index: what the library is, setup, one line + link per page
//   public/<section>/<name>.md              one per component, composable or directive (components/<section>/, composables/, directives/): intro, import, an example, the API
//   public/getting-started/*.md, styles/*.md the guide pages (setup, i18n, palettes, colors, typography, shapes, motion), converted from their templates
//   public/llms-full.txt                    all of the above in one file
// The API (props, events, slots, types, descriptions) comes from the installed library's dist/api.json,
// generated from its source; intros and examples come from these docs pages. The outputs are build
// artifacts (gitignored), regenerated before `vite` and `vite build`.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { SITE_URL } from './routes.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const apiFile = path.join(root, 'node_modules/@m3ui-vue/m3ui-vue/dist/api.json')
if (!existsSync(apiFile)) {
  console.warn('generate-llms: the installed @m3ui-vue/m3ui-vue has no dist/api.json (added in 0.9.1); skipping.')
  process.exit(0)
}
const api = JSON.parse(readFileSync(apiFile, 'utf8'))
const PKG = api.name
const read = (p) => readFileSync(path.join(root, p), 'utf8')

// ─── Pages, in the sidebar's order ───────────────────────────────────────────

const sectionLabels = {
  buttons: 'Buttons', inputs: 'Inputs', feedback: 'Feedback', 'data-display': 'Data display', navigation: 'Navigation',
  layout: 'Layout', overlays: 'Overlays', tables: 'Tables', utility: 'Utility', editors: 'Editors', advanced: 'Advanced',
  composables: 'Composables', directives: 'Directives',
}
const nav = read('src/nav/sections.ts')
// `section` is the page's folder under src/pages/ and its URL path: 'components/buttons', 'composables', 'directives'.
const order = [
  ...[...nav.matchAll(/ch\('\/components\/([\w-]+)',\s*\[([^\]]+)\]\)/g)].map((m) => ({
    section: `components/${m[1]}`,
    names: [...m[2].matchAll(/'(\w+)'/g)].map((x) => x[1]),
  })),
  ...[...nav.matchAll(/export const (composable|directive)Names = \[([^\]]+)\]/g)].map((m) => ({
    section: `${m[1]}s`,
    names: [...m[2].matchAll(/'([\w-]+)'/g)].map((x) => x[1]),
  })),
]
const label = (section) => sectionLabels[section.replace(/^components\//, '')]
// A directive page is named as it's written in templates ('v-ripple'); its export is 'vRipple'.
const apiName = (name) => name.replace(/^v-(\w)/, (_, c) => `v${c.toUpperCase()}`)

const decode = (s) => s
  .replace(/<code[^>]*>([\s\S]*?)<\/code>/g, '`$1`')
  .replace(/<[^>]+>/g, '')
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim()

/** HTML-looking tags outside backticks get backticks, or Markdown renderers would treat them as HTML. */
const mdText = (s) => s.split(/(`[^`]*`)/).map((part) => (part.startsWith('`') ? part : part.replace(/<\/?[A-Za-z][^<>`]*>/g, (tag) => `\`${tag}\``))).join('')

/** A ComponentDemo's :code / :script attribute: a JS template literal inside an HTML attribute. */
function literal(attr) {
  return attr
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
    .replace(/<\\\/script>/g, '</script>')
    .replace(/\\([`$\\])/g, '$1')
    .trim()
}

/** The attributes of the first `tag` (up to its closing `>`, skipping any `>` inside quoted attribute values). */
function openingTag(text, tag) {
  const start = text.indexOf(tag)
  if (start < 0) return null
  let quote = null
  for (let i = start + tag.length; i < text.length; i++) {
    const c = text[i]
    if (quote) { if (c === quote) quote = null }
    else if (c === '"' || c === "'") quote = c
    else if (c === '>') return [text.slice(start, i + 1), text.slice(start + tag.length, i)]
  }
  return null
}

/** A page's script and template. Split at the script's real end: code samples in the script can contain
 * `<template>`, but always write a closing script tag as `<\/script>`. */
function splitPage(text) {
  const end = text.indexOf('</script>')
  return { script: text.slice(0, Math.max(end, 0)), template: text.slice(text.indexOf('<template>', Math.max(end, 0))) }
}

function pageInfo(section, name) {
  const text = read(`src/pages/${section}/${name}.vue`)
  const { template } = splitPage(text)
  const intro = template.match(/<\/h1>\s*<p[^>]*>([\s\S]*?)<\/p>/)
  // The first demo is the page's basic usage.
  const demo = openingTag(template, '<ComponentDemo')
  let example = ''
  if (demo) {
    // Inline (:code="`…`") or a variable from the page's script (:code="inboxCode" + const inboxCode = `…`).
    const attr = (name) => {
      const inline = demo[1].match(new RegExp(`:${name}="\`([\\s\\S]*?)\`"`))
      if (inline) return inline
      const ref = demo[1].match(new RegExp(`:${name}="(\\w+)"`))
      const value = ref && text.match(new RegExp(`const ${ref[1]}\\s*=\\s*\`([\\s\\S]*?)(?<!\\\\)\``))
      return value ? [null, value[1]] : null
    }
    const code = attr('code')
    const script = attr('script')
    const title = demo[1].match(/\btitle="([^"]*)"/)
    const parts = []
    if (script && !(code && /<script/.test(code[1]))) parts.push(`<script setup lang="ts">\n${literal(script[1])}\n</script>`)
    if (code) parts.push(literal(code[1]))
    if (parts.length) example = { title: title ? decode(title[1]) : '', code: parts.join('\n\n') }
  }
  // Other components documented on this page ("MMenuItem Props" on the MMenu page).
  const hosted = [...template.matchAll(/<h3[^>]*>(\w+) Props<\/h3>/g)].map((m) => m[1]).filter((n) => n !== name)
  return { intro: intro ? mdText(decode(intro[1])) : '', example, hosted }
}

// ─── Guide pages (Getting started, Styles) ──────────────────────────────────
// Prose pages without an API of their own: headings, paragraphs, lists, code blocks (MCodeEditor bound to a
// template literal in the page's script), PropsTable tables (an array literal in the page's script) and ComponentDemo
// examples, in page order. Interactive demos and anything rendered from data ({{ … }}, v-for) are left out; the token
// lists are in llms-full.txt's Theme tokens.

const guides = [
  { section: 'getting-started', label: 'Getting started', pages: [['setup', 'SetupPage'], ['nuxt', 'NuxtPage'], ['i18n', 'I18nPage']] },
  { section: 'styles', label: 'Styles', pages: [['palettes', 'PalettesPage'], ['colors', 'ColorsPage'], ['typography', 'TypographyPage'], ['shapes', 'ShapesPage'], ['motion', 'MotionPage']] },
]

// What these pages render from data (v-for), appended from the library's api.json
const guideTokens = {
  PalettesPage: () => [`Palette ids: ${api.theme.palettes.join(', ')}`],
  ColorsPage: () => [`Color roles (\`--color-*\`, \`bg-*\`, \`text-*\`, \`border-*\`): ${api.theme.colors.join(', ')}`],
  TypographyPage: () => [`Type scale (\`text-*\`): ${api.theme.text.join(', ')}`],
  ShapesPage: () => [`Radius (\`rounded-*\`, CSS \`--radius-*\`): ${api.theme.radius.join(', ')}`],
  MotionPage: () => api.theme.ease ? [
    `Easing (\`ease-*\`, CSS \`--ease-*\`): ${api.theme.ease.join(', ')}`,
    `Durations (CSS \`--duration-*\`): ${api.theme.duration.join(', ')}`,
  ] : [],
}

/** Inline HTML to Markdown: code, bold, links (site routes become absolute URLs). */
const inline = (html) => mdText(html
  .replace(/<code[^>]*>([\s\S]*?)<\/code>/g, (_, c) => '`' + c.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() + '`')
  .replace(/<InlineCode[^>]*\bcode="([^"]*)"[^>]*\/>/g, '`$1`')
  .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/g, '**$2**')
  .replace(/<RouterLink[^>]*\bto="([^"]*)"[^>]*>([\s\S]*?)<\/RouterLink>/g, (_, to, t) => `[${t}](${SITE_URL}${to})`)
  .replace(/<a[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, t) => `[${t}](${href.startsWith('/') ? SITE_URL + href : href})`)
  .replace(/<[^>]+>/g, '')
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&rarr;/g, '→').replace(/&larr;/g, '←').replace(/&hellip;/g, '…').replace(/&middot;/g, '·').replace(/&times;/g, '×')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim())

/** A code string the page's script defines: `const x = \`…\`` or a computed one, with `${ref.value}` resolved
 * to the ref's initial value where it can be. */
function scriptCode(script, name) {
  // import usageCode from '@/components/SetupExample.vue?raw'
  const raw = script.match(new RegExp(`import ${name} from '@/([^']+)\\?raw'`))
  if (raw) return read(`src/${raw[1]}`).trim()
  const m = script.match(new RegExp(`const ${name}\\s*=\\s*(?:computed\\(\\(\\)\\s*=>\\s*)?\`([\\s\\S]*?)(?<!\\\\)\``))
  if (!m) return null
  return m[1]
    .replace(/\$\{(\w+)\.value\}/g, (all, ref) => {
      // ref('x'), ref(0), or ref(stored?.x ?? 'x'): the literal default
      const init = script.match(new RegExp(`const ${ref}\\s*=\\s*ref(?:<[^>]*>)?\\((.*)\\)\\s*$`, 'm'))?.[1]
      const literal = init?.match(/(?:^|\?\?)\s*(['"]?)([^'"?]*?)\1\s*$/)
      return literal ? literal[2] : all
    })
    .replace(/\\([`$\\])/g, '$1')
    .replace(/<\\\/script>/g, '</script>')
    .trim()
}

/** An array of plain object literals the page's script defines (`const options: PropDef[] = [...]`). */
function scriptArray(script, name) {
  const m = name && script.match(new RegExp(`const ${name}(?::[^=]+)?\\s*=\\s*(\\[[\\s\\S]*?\\n\\])`))
  return m ? new Function(`return ${m[1]}`)() : null
}

const TAG_ATTRS = `((?:[^>"']|"[^"]*"|'[^']*')*)`

function guideMd(file, url) {
  const text = read(`src/pages/${file}.vue`)
  const { script, template: page } = splitPage(text)
  let template = page
  // Comments, and the slot content of demos (the live preview, not the documented code)
  template = template.replace(/<!--[\s\S]*?-->/g, '')
  const out = []
  const re = new RegExp([
    `<h([1-4])\\b[^>]*>([\\s\\S]*?)<\\/h\\1>`,
    `<p\\b[^>]*>([\\s\\S]*?)<\\/p>`,
    `<li\\b[^>]*>([\\s\\S]*?)<\\/li>`,
    `<MCodeEditor\\b${TAG_ATTRS}>`,
    `<ComponentDemo\\b${TAG_ATTRS}>([\\s\\S]*?)<\\/ComponentDemo>`,
    `<PropsTable\\b${TAG_ATTRS}>`,
  ].join('|'), 'g')
  let title = ''
  // Sections that are only an interactive preview of this site ("Live Preview", "Try it") are skipped whole
  let skipBelow = 0
  for (const m of template.matchAll(re)) {
    if (m[1]) {
      const h = inline(m[2])
      if (!h || /\{\{/.test(m[2])) continue
      const level = Number(m[1])
      if (skipBelow && level > skipBelow) continue
      skipBelow = /^(live preview|try it)$/i.test(h) ? level : 0
      if (skipBelow) continue
      if (level === 1) { title = h; out.push(`# ${h}`, '') } else out.push(`${'#'.repeat(level)} ${h}`, '')
    } else if (skipBelow) {
      continue
    } else if (m[3] != null || m[4] != null) {
      const raw = m[3] ?? m[4]
      if (/\{\{|v-for|v-if/.test(raw)) continue
      const t = inline(raw)
      // A short caption with no sentence in it is a demo's label ("Variant", a sample card's title), not prose
      if (m[3] != null && t.split(' ').length < 4 && !/[.:!?]$/.test(t)) continue
      if (t) out.push(m[4] != null ? `- ${t}` : t, '')
    } else if (m[5] != null) {
      const ref = m[5].match(/:model-value="(\w+)"/)
      const code = ref && scriptCode(script, ref[1])
      if (!code) continue
      const lang = m[5].match(/\blanguage="(\w+)"/)?.[1] ?? ''
      out.push('```' + (lang === 'javascript' && /^(pnpm|npm|yarn|bun) /m.test(code) ? 'bash' : lang), code, '```', '')
    } else if (m[6] != null) {
      const attr = (n) => m[6].match(new RegExp(`(?<![:\\w-])${n}="([^"]*)"`))?.[1]
      const code = m[6].match(/:code="`([\s\S]*?)`"/)?.[1] ?? (m[6].match(/:code="(\w+)"/) && scriptCode(script, m[6].match(/:code="(\w+)"/)[1]))
      if (attr('title')) out.push(`### Example: ${inline(attr('title'))}`, '')
      if (attr('description')) out.push(inline(attr('description')), '')
      if (code) out.push('```vue', literal(code), '```', '')
    } else if (m[8] != null) {
      const rows = scriptArray(script, m[8].match(/:props="(\w+)"/)?.[1])
      if (rows?.length) {
        const cell = (v) => (v ?? '').replace(/\|/g, '\\|')
        out.push('| Name | Type | Default | Description |', '|---|---|---|---|',
          ...rows.map((r) => `| \`${cell(r.name)}\` | \`${cell(r.type)}\` | ${r.default ? `\`${cell(r.default)}\`` : ''} | ${cell(r.description)} |`), '')
      }
    }
  }
  // List items render as one list
  const tokens = guideTokens[file]?.() ?? []
  if (tokens.length) out.push('## Tokens', '', ...tokens.map((t) => `- ${t}`), '')
  const md = out.join('\n').replace(/^(- .*)\n\n(?=- )/gm, '$1\n').replace(/\n{3,}/g, '\n\n').trim()
  const description = md.split('\n\n')[1] ?? ''
  return { title, description, md: md.replace(/^# .*\n/, (h) => `${h}\nDocs with live demos: ${url}\n`) + '\n' }
}

const components = new Map(api.components.map((c) => [c.name, c]))
const values = new Map(api.values.map((v) => [v.name, v]))
const extraHosts = { MRadio: 'MRadioGroup', MSnackbar: 'useToast' }

const pages = [] // { name, section, url, md, docs, summary }
for (const { section, names } of order) {
  for (const name of names) {
    const info = pageInfo(section, name)
    const docs = `${SITE_URL}/${section}/${name.toLowerCase()}`
    pages.push({ name, section, docs, info })
    const guest = { intro: '', example: '', hosted: [] }
    for (const hosted of info.hosted) pages.push({ name: hosted, section, docs, host: name, info: guest })
    for (const [extra, host] of Object.entries(extraHosts)) if (host === name) pages.push({ name: extra, section, docs, host: name, info: guest })
  }
}

// ─── Markdown ────────────────────────────────────────────────────────────────

const oneLine = (s) => (s ?? '').replace(/\s+/g, ' ').trim()
const code = (s) => '`' + s.replace(/`/g, "'") + '`'
const firstSentence = (s) => (s.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? s)

function apiMd(c) {
  const out = []
  const prop = (p) => {
    let s = `- ${code(`${p.name}${p.required ? '' : '?'}: ${p.type}${p.default != null ? ` = ${p.default}` : ''}`)}`
    if (p.model) s += ' (v-model' + (p.name === 'modelValue' ? '' : `:${p.name}`) + ')'
    return p.description ? `${s} — ${p.description}` : s
  }
  if (c.props.length) out.push('### Props', '', ...c.props.map(prop), '')
  if (c.events.length) out.push('### Events', '', ...c.events.map((e) => `- ${code(`${e.name}(${e.args})`)}${e.description ? ` — ${e.description}` : ''}`), '')
  if (c.slots.length) out.push('### Slots', '', ...c.slots.map((s) => `- ${code(`#${s.name}${s.bindings ? ` ${oneLine(s.bindings)}` : ''}`)}${s.description ? ` — ${s.description}` : ''}`), '')
  if (c.exposed.length) out.push('### Exposed (template ref)', '', ...c.exposed.map((x) => `- ${code(`${x.name}: ${oneLine(x.type)}`)}${x.description ? ` — ${x.description}` : ''}`), '')
  const types = c.types.filter((t) => t.source)
  if (types.length) out.push('### Types', '', ...types.flatMap((t) => ['```ts', t.source, '```', '']))
  return out.join('\n')
}

/** Types from the library's loose types (composables) that a signature mentions. */
function typesFor(text) {
  const found = new Map()
  const visit = (t) => {
    for (const ty of api.types) {
      if (!found.has(ty.name) && ty.source && new RegExp(`\\b${ty.name}\\b`).test(t)) {
        found.set(ty.name, ty)
        visit(ty.source)
      }
    }
  }
  visit(text)
  return [...found.values()]
}

function pageMd(p) {
  const c = components.get(p.name)
  const v = values.get(apiName(p.name))
  const description = p.info.intro || c?.description || v?.description || ''
  const out = [`# ${p.name}`, '']
  if (description) out.push(`> ${description}`, '')
  const from = c?.import ?? v?.import ?? PKG
  out.push(`Import: ${code(`import { ${apiName(p.name)} } from '${from}'`)}`, `Docs with live demos: ${p.docs}`, '')
  if (!p.info.example && p.host) {
    out.push(`Documented on the ${p.host} page; see its example: ${SITE_URL}/${p.section}/${p.host.toLowerCase()}.md`, '')
  }
  if (p.info.example) {
    out.push(`## Example${p.info.example.title ? `: ${p.info.example.title}` : ''}`, '', '```vue', p.info.example.code, '```', '')
  }
  if (c) {
    if (p.info.intro && c.description && c.description !== p.info.intro) out.splice(2, 0, c.description, '')
    out.push('## API', '', apiMd(c))
  } else if (v) {
    out.push('## API', '', '```ts', v.signature, '```', '')
    const types = typesFor(v.signature)
    if (types.length) out.push('### Types', '', ...types.flatMap((t) => ['```ts', t.source, '```', '']))
  }
  return { description, md: out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n' }
}

const setup = `## Setup

\`\`\`bash
pnpm add ${PKG}
\`\`\`

\`\`\`css
/* main stylesheet, in this order */
@import 'tailwindcss';
@import '${PKG}/theme';
@import '${PKG}/palettes';
@import '${PKG}/palettes-contrast'; /* optional: medium and high contrast */
@import '${PKG}/styles';
\`\`\`

\`\`\`ts
// main.ts (optional): default palette and translated built-in strings
import { createM3UI } from '${PKG}'
import { esLocale } from '${PKG}/locales'
app.use(createM3UI({ palette: 'blue', locale: esLocale }))
\`\`\`

- Icons use the Material Symbols Outlined font, loaded by the app (e.g. Google Fonts); \`icon\` props take a symbol name like \`'home'\`.
- Import components by name from \`${PKG}\`. Heavy ones live in their own entry points: ${api.entries.filter((e) => e !== PKG).map(code).join(', ')}.
- Dark mode is the \`dark\` class on \`<html>\` (\`useTheme()\`); palettes are \`data-palette="<id>"\` on \`<html>\` (\`useColorPalette()\`, or a scheme generated from any color with \`setSeed()\` / \`createM3UI({ seed })\`); contrast levels are \`data-contrast="medium|high"\` (\`setContrast()\` / \`createM3UI({ contrast })\`, needs the \`palettes-contrast\` import).
- \`createM3UI()\` also registers the \`v-ripple\` directive globally.
- Style your own markup with the M3 tokens as Tailwind utilities: \`bg-surface-container\`, \`text-on-surface-variant\`, \`text-title-medium\`, \`shadow-elevation-2\`.
- The installed package also ships the whole API in one file: \`node_modules/${PKG}/dist/API.md\`.`

const intro = `# M3UI Vue (${PKG})

> Material Design 3 component library for Vue 3 and Tailwind CSS v4: ${api.components.length} tree-shakeable components, composables, ${api.theme.palettes.length} color palettes, dark mode and ${api.locale.presets.length + 1} languages. Version ${api.version}.`

// ─── Write ───────────────────────────────────────────────────────────────────

const out = path.join(root, 'public')
for (const dir of ['components', 'composables', 'directives', ...guides.map((g) => g.section)]) rmSync(path.join(out, dir), { recursive: true, force: true })
const index = [intro, '', setup, '']
const full = [intro, '', setup, '']
let current = ''
let written = 0
for (const g of guides) {
  index.push(`## ${g.label}`, '')
  for (const [name, file] of g.pages) {
    const { title, description, md } = guideMd(file, `${SITE_URL}/${g.section}/${name}`)
    const target = path.join(out, g.section, `${name}.md`)
    mkdirSync(path.dirname(target), { recursive: true })
    writeFileSync(target, md)
    written++
    index.push(`- [${title}](${SITE_URL}/${g.section}/${name}.md): ${firstSentence(description)}`)
    full.push(md.replace(/^(#+) /gm, '#$1 '), '')
  }
  index.push('')
}
for (const p of pages) {
  if (!components.has(p.name) && !values.has(apiName(p.name))) continue
  const { description, md } = pageMd(p)
  const file = path.join(out, p.section, `${p.name.toLowerCase()}.md`)
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, md)
  written++
  if (p.section !== current) {
    current = p.section
    if (index.at(-1) !== '') index.push('')
    index.push(`## ${label(p.section)}`, '')
  }
  index.push(`- [${p.name}](${SITE_URL}/${p.section}/${p.name.toLowerCase()}.md): ${firstSentence(description)}`)
  full.push(md.replace(/^# /, '## ').replace(/^(#{2,}) /gm, (m, h) => (h.length >= 2 ? `#${h} ` : m)).replace(/^### (\w+)\n/, '## $1\n'), '')
}
const otherFns = api.values.filter((v) => !pages.some((p) => apiName(p.name) === v.name))
index.push('', '## Optional', '',
  `- [Full reference](${SITE_URL}/llms-full.txt): every page above in one file, plus the remaining functions (${otherFns.map((v) => v.name).join(', ')}), locale keys and theme tokens`,
  `- [Example apps](${SITE_URL}/examples): full apps built with the library; source at https://github.com/SrWither/m3ui-vue-docs/tree/main/src/examples`)

full.push('## Other functions', '', ...otherFns.flatMap((v) => [`### ${v.name}`, '', ...(v.description ? [v.description, ''] : []), '```ts', v.signature, '```', '']))
full.push('## Locale keys', '', `\`M3Locale\` (pass a partial object to \`createM3UI({ locale })\`; presets from \`${PKG}/locales\`: ${api.locale.presets.join(', ')}): ${api.locale.keys.join(', ')}`, '')
full.push('## Theme tokens', '',
  `- Colors (\`bg-*\`, \`text-*\`, \`border-*\`): ${api.theme.colors.join(', ')}`,
  `- Type scale (\`text-*\`): ${api.theme.text.join(', ')}`,
  `- Radius (\`rounded-*\`): ${api.theme.radius.join(', ')}`,
  `- Shadows (\`shadow-*\`): ${api.theme.shadow.join(', ')}`,
  ...(api.theme.ease ? [
    `- Easing (\`ease-*\`, CSS \`--ease-*\`): ${api.theme.ease.join(', ')}`,
    `- Durations (CSS \`--duration-*\`, e.g. \`duration-(--duration-medium-2)\`): ${api.theme.duration.join(', ')}`,
    `- Utilities: ${api.theme.utilities.map(code).join(', ')}`,
  ] : []),
  `- Palettes: ${api.theme.palettes.join(', ')}`, '')

writeFileSync(path.join(out, 'llms.txt'), index.join('\n') + '\n')
writeFileSync(path.join(out, 'llms-full.txt'), full.join('\n').replace(/\n{3,}/g, '\n\n'))
const missing = api.components.filter((c) => !pages.some((p) => p.name === c.name)).map((c) => c.name)
console.log(`llms: ${written} pages, llms.txt + llms-full.txt (${api.name} ${api.version})${missing.length ? `; no page for ${missing.join(', ')}` : ''}`)
