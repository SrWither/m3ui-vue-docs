<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import PropsTable from '@/components/PropsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const installCode = `pnpm add @m3ui-vue/nuxt @m3ui-vue/m3ui-vue
pnpm add -D tailwindcss @tailwindcss/vite`

const configCode = `// nuxt.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@m3ui-vue/nuxt'],
  css: ['~/assets/main.css'],
  vite: { plugins: [tailwindcss()] },
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@400&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block' },
      ],
    },
  },
  m3ui: {
    palette: 'teal',
    locale: 'es',
  },
})`

const cssCode = `/* assets/main.css */
@import 'tailwindcss';
@import '@m3ui-vue/m3ui-vue/theme';
@import '@m3ui-vue/m3ui-vue/palettes';`

const usageCode = `<template>
  <MButton icon="save" @click="toast.success('Saved')">Save</MButton>
</template>

<script setup lang="ts">
// No imports: components and composables are auto-imported
const toast = useM3Toast()
<\/script>`

const containerTransformCode = `<script setup lang="ts">
// Auto-imported, prefixed like every composable
const detail = useM3ContainerTransform<Product>()
<\/script>

<template>
  <MCard v-for="p in products" :key="p.id" clickable @click="detail.open($event, p)">…</MCard>
  <MContainerTransform :controller="detail" mode="dialog">
    <template #expanded="{ item, close }">…</template>
  </MContainerTransform>
</template>`

const themeToggleCode = `<template>
  <!-- Rendered on the server with the user's theme: no ClientOnly needed -->
  <MIconButton :icon="theme === 'dark' ? 'dark_mode' : 'light_mode'" label="Switch theme" @click="cycle" />
</template>

<script setup lang="ts">
const { theme, cycle } = useM3Theme()
<\/script>`

const viteSsrCode = `// entry-client.ts
import { createSSRApp } from 'vue'
import { createM3UI, type M3InitialState } from '@m3ui-vue/m3ui-vue'
import App from './App.vue'

const cookie = (name: string) => document.cookie.match(new RegExp(\`(?:^|; )\${name}=([^;]*)\`))?.[1]
// the window size the server rendered for (see entry-server.ts), so hydration matches it
const viewport = (window as { __M3_VIEWPORT__?: { width: number, height: number } }).__M3_VIEWPORT__

const app = createSSRApp(App)
let hydrating = true
app.use(createM3UI({
  palette: 'teal',
  cookies: true, // keep the choice in cookies too, for the server
  // the same values the server read, so the first render matches its HTML
  initialState: { theme: cookie('m3-theme'), palette: cookie('m3-palette'), contrast: cookie('m3-contrast'), viewport } as M3InitialState,
  isHydrating: () => hydrating,
}))
app.mount('#app')
hydrating = false`

const headScriptCode = `// entry-server.ts, per request
import { createM3UI, themeInitScript, viewportFromHeaders, VIEWPORT_HINTS, type M3InitialState } from '@m3ui-vue/m3ui-vue'

// the window's size: its cookie, Chromium's viewport hints, or a guess from the device on a first visit
const viewport = viewportFromHeaders(request.headers)

app.use(createM3UI({
  palette: 'teal',
  // from the request's cookies, however your server parses them
  initialState: { theme: cookies['m3-theme'], palette: cookies['m3-palette'], contrast: cookies['m3-contrast'], viewport } as M3InitialState,
}))

// inline it in <head>, before your stylesheets, with the size for the client
const head = \`<script>\${themeInitScript({ palette: 'teal' })};window.__M3_VIEWPORT__=\${JSON.stringify(viewport ?? null)}<\/script>\`

// optional: ask Chromium for the exact size (Critical-CH repeats a first visit's request once)
// response.setHeader('Accept-CH', VIEWPORT_HINTS); response.setHeader('Critical-CH', VIEWPORT_HINTS)`

const i18nCode = `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@m3ui-vue/nuxt', '@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', language: 'en-US' },
      { code: 'es', language: 'es-AR' },
    ],
    defaultLocale: 'en',
  },
  m3ui: { locale: 'auto' },
})`

const options: PropDef[] = [
  { name: 'palette', type: 'string', description: 'The first-visit palette, as in createM3UI(). A palette the user picked later wins.' },
  { name: 'seed / seedOptions', type: 'string / SeedOptions', description: 'Generate the scheme from one color instead of a named palette, as in createM3UI().' },
  { name: 'contrast', type: "'standard' | 'medium' | 'high' | 'system'", description: 'The first-visit contrast level, as in createM3UI().' },
  { name: 'persistPalette', type: 'boolean', default: 'true', description: 'false makes palette and contrast a hard default that always wins, as in createM3UI().' },
  { name: 'customPalettes', type: 'Palette[]', description: 'Your own palettes, added to useM3ColorPalette().palettes.' },
  { name: 'themeColor', type: 'string', description: 'Keep <meta name="theme-color"> in sync with a color role, as in createM3UI().' },
  { name: 'locale', type: "'es' | 'fr' | 'pt' | 'de' | 'ja' | 'zh' | 'ko' | 'auto' | Partial<M3Locale>", default: 'English', description: "A preset's language code (only that preset is bundled), your own strings, or 'auto' to follow @nuxtjs/i18n." },
  { name: 'components', type: 'boolean', default: 'true', description: 'Auto-import the components. Each one is bundled only where it is used.' },
  { name: 'composables', type: 'boolean | { prefix: string }', default: "{ prefix: 'M3' }", description: 'Auto-import the composables with this prefix (useTheme becomes useM3Theme). false to import them yourself.' },
  { name: 'css', type: 'boolean', default: 'true', description: "Add the components' own stylesheet (@m3ui-vue/m3ui-vue/styles)." },
  { name: 'cookies', type: 'boolean', default: 'true', description: 'Keep the theme, palette and contrast in cookies too, so the server renders with the user\'s choice.' },
  { name: 'viewportHints', type: 'boolean', default: 'false', description: 'Ask Chromium for the window\'s exact size with client hints (Accept-CH / Critical-CH), so the adaptive layouts render at it on a first visit too, at the cost of one repeated request on that visit. Without it a first visit renders at a size guessed from the device. Needs cookies.' },
  { name: 'themeScript', type: 'boolean', default: 'true', description: 'Inline themeInitScript() in <head>, so the saved theme is on the page before it paints.' },
  { name: 'storagePrefix', type: 'string', description: "A prefix for the cookies and stored keys ('shop' → shop-m3-theme…), so apps on one domain under different paths keep their own theme and palette; the server reads the prefixed cookies. Needs @m3ui-vue/m3ui-vue 1.2.2 and @m3ui-vue/nuxt 0.4.0." },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Nuxt & SSR</h1>
    <p class="mb-6 text-body-large text-on-surface-variant">
      Use M3UI Vue in Nuxt with the official module, or in any server-rendered Vue app. Pages render on the server
      with the user's dark mode and palette already applied, without a flash of the default theme.
    </p>

    <MCard class="mb-4 flex items-start gap-3 p-4">
      <MIcon name="science" :size="22" class="mt-0.5 shrink-0 text-error" />
      <p class="text-body-medium text-on-surface">
        <strong>Server-side rendering and the Nuxt module are in beta.</strong> Every component renders on the server
        and is tested there, but real apps will find cases we haven't. If something breaks, renders differently on the
        server, or Vue warns about a hydration mismatch, please open an issue: on
        <a href="https://github.com/SrWither/m3ui-vue-nuxt/issues" class="text-primary underline">m3ui-vue-nuxt</a> for
        the module, or on <a href="https://github.com/SrWither/m3ui-vue/issues" class="text-primary underline">m3ui-vue</a>
        for a component.
      </p>
    </MCard>

    <MCard class="mb-8 flex items-start gap-3 p-4">
      <MIcon name="info" :size="22" class="mt-0.5 shrink-0 text-primary" />
      <p class="text-body-medium text-on-surface">
        Server-side rendering needs <strong>@m3ui-vue/m3ui-vue 1.0.2</strong> or later, and rendering the user's theme on the server (cookies) <strong>1.0.3</strong> with <strong>@m3ui-vue/nuxt 0.2.0</strong>. The module's source and
        a playground app live in
        <a href="https://github.com/SrWither/m3ui-vue-nuxt" class="text-primary underline">SrWither/m3ui-vue-nuxt</a>.
      </p>
    </MCard>

    <!-- Install -->
    <h2 class="mb-4 text-headline-small font-medium">Install</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      Add the module and the library, plus Tailwind CSS v4 and its Vite plugin if your project doesn't use them yet.
    </p>
    <MCodeEditor :model-value="installCode" language="javascript" :readonly="true" :line-numbers="false" min-height="50px" max-height="100px" class="mb-6" />

    <p class="mb-3 text-body-medium text-on-surface-variant">
      Register the module and set its options under <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">m3ui</code>.
      The fonts load the same way as in the <RouterLink to="/getting-started/setup" class="text-primary underline">Setup</RouterLink> guide,
      here through <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">app.head</code>.
    </p>
    <MCodeEditor :model-value="configCode" language="typescript" :readonly="true" :line-numbers="false" min-height="50px" max-height="500px" class="mb-6" />

    <p class="mb-3 text-body-medium text-on-surface-variant">
      The theme and the palettes are Tailwind CSS, so they go in your own stylesheet, after Tailwind. The module adds
      the components' stylesheet by itself.
    </p>
    <MCodeEditor :model-value="cssCode" language="css" :readonly="true" :line-numbers="false" min-height="50px" max-height="150px" class="mb-10" />

    <!-- Usage -->
    <h2 class="mb-4 text-headline-small font-medium">Components and composables</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      Every component works in any page or component without importing it. The ones with an optional dependency
      (<code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MChart</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MCodeEditor</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MRichTextEditor</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MMap</code>…) are
      registered once that dependency is installed.
    </p>
    <MCodeEditor :model-value="usageCode" language="vue" :readonly="true" :line-numbers="false" min-height="50px" max-height="250px" class="mb-6" />

    <p class="mb-3 text-body-medium text-on-surface-variant">
      Composables are auto-imported with an <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">M3</code>
      prefix, since names like <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">useTheme</code> and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">useDevice</code> are common in other
      modules. Importing them from <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">@m3ui-vue/m3ui-vue</code>
      under their own names still works.
    </p>
    <ul class="mb-3 grid gap-px overflow-hidden rounded-xl border border-outline-variant bg-outline-variant text-body-medium sm:grid-cols-2">
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useTheme</code> &rarr; <code class="font-mono text-primary">useM3Theme</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useThemeTokens</code> &rarr; <code class="font-mono text-primary">useM3ThemeTokens</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useColorPalette</code> &rarr; <code class="font-mono text-primary">useM3ColorPalette</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useToast</code> &rarr; <code class="font-mono text-primary">useM3Toast</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useNotification</code> &rarr; <code class="font-mono text-primary">useM3Notification</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useLocale</code> &rarr; <code class="font-mono text-primary">useM3Locale</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useDevice</code> &rarr; <code class="font-mono text-primary">useM3Device</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useWindowSizeClass</code> &rarr; <code class="font-mono text-primary">useM3WindowSizeClass</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useFieldBg</code> &rarr; <code class="font-mono text-primary">useM3FieldBg</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useDebounce</code> &rarr; <code class="font-mono text-primary">useM3Debounce</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useAutoGrow</code> &rarr; <code class="font-mono text-primary">useM3AutoGrow</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">usePageProgress</code> &rarr; <code class="font-mono text-primary">useM3PageProgress</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useSpring</code> &rarr; <code class="font-mono text-primary">useM3Spring</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useScrollReveal</code> &rarr; <code class="font-mono text-primary">useM3ScrollReveal</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useConfetti</code> &rarr; <code class="font-mono text-primary">useM3Confetti</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useContainerTransform</code> &rarr; <code class="font-mono text-primary">useM3ContainerTransform</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useMap</code> &rarr; <code class="font-mono text-primary">useM3Map</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useMapLayers</code> &rarr; <code class="font-mono text-primary">useM3MapLayers</code></li>
      <li class="flex items-center gap-2 bg-surface-container-low px-4 py-2.5"><code class="font-mono text-on-surface-variant">useMapFilter</code> &rarr; <code class="font-mono text-primary">useM3MapFilter</code></li>
    </ul>
    <p class="mb-10 text-body-small text-on-surface-variant">
      The map composables, like the map components, only when <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">maplibre-gl</code> is installed.
    </p>

    <h3 class="mb-3 text-title-large font-medium">Container transform</h3>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      <RouterLink to="/components/utility/mcontainertransform" class="text-primary underline">MContainerTransform</RouterLink>
      needs nothing extra: wrap an element, or open it from anywhere with
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">useM3ContainerTransform()</code>
      (the controller can live in a page, a component or a Pinia store). The server renders the elements that open
      it; the expanded view only ever renders in the browser, after hydration, even with
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">v-model:open</code> true from the
      start, so it never causes a hydration mismatch.
    </p>
    <MCodeEditor :model-value="containerTransformCode" language="vue" :readonly="true" :line-numbers="false" min-height="50px" max-height="250px" class="mb-10" />

    <!-- Options -->
    <h2 class="mb-4 text-headline-small font-medium">Module options</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      Everything <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">createM3UI()</code> takes,
      plus what the module itself does.
    </p>
    <PropsTable :props="options" class="mb-10" />

    <!-- i18n -->
    <h2 class="mb-4 text-headline-small font-medium">With @nuxtjs/i18n</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      With <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">locale: 'auto'</code>, the
      components' built-in text (pagination, pickers, dialogs…) follows the language
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">@nuxtjs/i18n</code> has active, on
      the server and whenever the user switches it. A language tag picks its language's preset (es-AR is Spanish), and
      a language without one falls back to English. All seven presets are bundled then (about 11 kB gzipped), since
      the language can change at any time. See <RouterLink to="/getting-started/i18n" class="text-primary underline">i18n</RouterLink>
      for the presets and your own strings.
    </p>
    <MCodeEditor :model-value="i18nCode" language="typescript" :readonly="true" :line-numbers="false" min-height="50px" max-height="300px" class="mb-10" />

    <!-- SSR -->
    <h2 class="mb-4 text-headline-small font-medium">What the server knows</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      The user's theme, palette, contrast and window size reach the server through cookies, from their second visit
      on. Their system's preferences don't, and three things follow from that.
    </p>

    <MCard class="mb-4 flex items-start gap-3 p-4">
      <MIcon name="dark_mode" :size="22" class="mt-0.5 shrink-0 text-primary" />
      <div>
        <p class="mb-2 text-body-medium font-medium text-on-surface">Theme-aware UI renders on the server</p>
        <p class="text-body-medium text-on-surface-variant">
          A small script in <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">&lt;head&gt;</code>
          applies the saved dark mode, palette and contrast before the page paints, and
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">useM3Theme()</code> and
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">useM3ColorPalette()</code> report
          the user's choice already on the server, so a theme toggle's icon or a selected palette swatch hydrate as they
          are. What stays in the browser is the system: with the <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">system</code>
          theme, whether the page ends up dark is decided there. The choice lives in the
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">m3-theme</code>,
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">m3-palette</code> and
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">m3-contrast</code> cookies, so your
          server can also set them, to apply a theme saved in the user's account for instance.
        </p>
      </div>
    </MCard>
    <MCodeEditor :model-value="themeToggleCode" language="vue" :readonly="true" :line-numbers="false" min-height="50px" max-height="250px" class="mb-4" />

    <MCard class="mb-4 flex items-start gap-3 p-4">
      <MIcon name="devices" :size="22" class="mt-0.5 shrink-0 text-primary" />
      <div>
        <p class="mb-2 text-body-medium font-medium text-on-surface">Adaptive layouts on a first visit</p>
        <p class="text-body-medium text-on-surface-variant">
          <RouterLink to="/components/layout/mnavigationsuite" class="text-primary underline">MNavigationSuite</RouterLink>,
          <RouterLink to="/components/layout/mlistdetail" class="text-primary underline">MListDetail</RouterLink> and
          <RouterLink to="/components/layout/msupportingpane" class="text-primary underline">MSupportingPane</RouterLink>
          adapt to their own size, which the server can't measure. The module keeps the window's size in a cookie
          too, so from the second visit on the server renders the layout that fits that screen (a layout in a narrower
          column corrects itself once the page is interactive). On a first visit there's no cookie yet: the server
          renders for a size that stands for the kind of device (a phone, a tablet or a desktop, from the request), and
          the layout settles on the exact one once the page is interactive. With
          <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">viewportHints</code>, Chromium sends
          the exact size from the first visit too (it repeats that first request once to do it).
        </p>
      </div>
    </MCard>

    <MCard class="mb-10 flex items-start gap-3 p-4">
      <MIcon name="palette" :size="22" class="mt-0.5 shrink-0 text-primary" />
      <div>
        <p class="mb-2 text-body-medium font-medium text-on-surface">A seed color shows up on load</p>
        <p class="text-body-medium text-on-surface-variant">
          A scheme generated from a <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">seed</code>
          is computed by the app, so on a first visit the page shows the default palette until it loads. Later
          visits reuse the saved scheme and paint with it right away.
        </p>
      </div>
    </MCard>

    <!-- Without Nuxt -->
    <h2 class="mb-4 text-headline-small font-medium">Without Nuxt</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      For your own server rendering (Vite SSR or similar), do what the module does. On the client, keep the choice
      in cookies with <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">cookies</code>, pass
      what they hold as <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">initialState</code>, and
      tell the plugin when hydration ends with <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">isHydrating</code>,
      so the composables and the adaptive layouts match the server's HTML:
    </p>
    <MCodeEditor :model-value="viteSsrCode" language="typescript" :readonly="true" :line-numbers="false" min-height="50px" max-height="250px" class="mb-6" />
    <p class="mb-3 text-body-medium text-on-surface-variant">
      On the server, give the plugin the same <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">initialState</code>
      from the request's cookies, and inline <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">themeInitScript()</code>
      in the page's <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">&lt;head&gt;</code>, with the
      same <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">palette</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">contrast</code> and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">persistPalette</code> you give the plugin:
    </p>
    <MCodeEditor :model-value="headScriptCode" language="typescript" :readonly="true" :line-numbers="false" min-height="50px" max-height="300px" class="mb-10" />
  </div>
</template>
