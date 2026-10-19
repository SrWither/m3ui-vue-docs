import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { examples } from './examples/registry'

// Auto-discovers per-component doc pages from src/pages/components/<section>/<Component>.vue
// so adding a new component page doesn't require a manual route entry here — the file's own
// location on disk IS the route. Section index pages (the /components/<section> routes) stay
// explicit below since they live directly in src/pages/, outside this glob.
const componentPageModules = import.meta.glob('./pages/components/**/*.vue')
const componentRoutes: RouteRecordRaw[] = Object.entries(componentPageModules).map(([path, loader]) => {
  const match = path.match(/\.\/pages\/components\/([^/]+)\/([^/]+)\.vue$/)
  if (!match) throw new Error(`Unexpected component page path: ${path}`)
  const [, section, component] = match
  return {
    path: `/components/${section}/${component.toLowerCase()}`,
    component: loader as RouteRecordRaw['component'],
    meta: { title: component },
  }
})

// Same for the top-level Composables and Directives groups: src/pages/<group>/<name>.vue → /<group>/<name>.
const groupPageModules = import.meta.glob('./pages/{composables,directives}/*.vue')
const groupRoutes: RouteRecordRaw[] = Object.entries(groupPageModules).map(([path, loader]) => {
  const [, group, name] = path.match(/\.\/pages\/(composables|directives)\/([^/]+)\.vue$/)!
  return {
    path: `/${group}/${name.toLowerCase()}`,
    component: loader as RouteRecordRaw['component'],
    meta: { title: name },
  }
})

// Composable pages used to live under Components (until 0.9.3).
const movedPages: RouteRecordRaw[] = [
  ['feedback', 'usetoast'], ['feedback', 'usenotification'], ['layout', 'usewindowsizeclass'], ['utility', 'usedevice'],
].map(([section, name]) => ({ path: `/components/${section}/${name}`, redirect: `/composables/${name}` }))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...componentRoutes,
    ...groupRoutes,
    ...movedPages,
    {
      path: '/composables',
      component: () => import('./pages/ComposablesPage.vue'),
      meta: { title: 'Composables' },
    },
    {
      path: '/directives',
      component: () => import('./pages/DirectivesPage.vue'),
      meta: { title: 'Directives' },
    },
    {
      path: '/',
      component: () => import('./pages/HomePage.vue'),
    },
    {
      path: '/getting-started/setup',
      component: () => import('./pages/SetupPage.vue'),
      meta: { title: 'Setup' },
    },
    {
      path: '/getting-started/nuxt',
      component: () => import('./pages/NuxtPage.vue'),
      meta: { title: 'Nuxt & SSR' },
    },
    {
      path: '/getting-started/i18n',
      component: () => import('./pages/I18nPage.vue'),
      meta: { title: 'Internationalization (i18n)' },
    },
    {
      path: '/components/buttons',
      component: () => import('./pages/ButtonsPage.vue'),
      meta: { title: 'Buttons components' },
    },
    {
      path: '/components/inputs',
      component: () => import('./pages/InputsPage.vue'),
      meta: { title: 'Inputs components' },
    },
    {
      path: '/components/feedback',
      component: () => import('./pages/FeedbackPage.vue'),
      meta: { title: 'Feedback components' },
    },
    {
      path: '/components/data-display',
      component: () => import('./pages/DataDisplayPage.vue'),
      meta: { title: 'Data Display components' },
    },
    {
      path: '/components/navigation',
      component: () => import('./pages/NavigationPage.vue'),
      meta: { title: 'Navigation components' },
    },
    {
      path: '/components/layout',
      component: () => import('./pages/LayoutPage.vue'),
      meta: { title: 'Layout components' },
    },
    {
      path: '/components/overlays',
      component: () => import('./pages/OverlaysPage.vue'),
      meta: { title: 'Overlays components' },
    },
    {
      path: '/components/tables',
      component: () => import('./pages/TablesPage.vue'),
      meta: { title: 'Tables components' },
    },
    {
      path: '/components/utility',
      component: () => import('./pages/UtilityPage.vue'),
      meta: { title: 'Utility components' },
    },
    {
      path: '/components/editors',
      component: () => import('./pages/EditorsPage.vue'),
      meta: { title: 'Editors & Viewers components' },
    },
    {
      path: '/components/advanced',
      component: () => import('./pages/AdvancedPage.vue'),
      meta: { title: 'Advanced components' },
    },
    {
      path: '/examples',
      component: () => import('./pages/ExamplesPage.vue'),
      meta: { title: 'Examples' },
    },
    // Example apps render full screen, outside the docs layout (App.vue checks meta.fullscreen).
    ...examples.map((e): RouteRecordRaw => ({
      path: `/examples/${e.id}`,
      component: e.component,
      meta: { fullscreen: true, title: `${e.title} example` },
    })),
    {
      path: '/styles/palettes',
      component: () => import('./pages/PalettesPage.vue'),
      meta: { title: 'Color Palettes' },
    },
    {
      path: '/styles/colors',
      component: () => import('./pages/ColorsPage.vue'),
      meta: { title: 'Colors' },
    },
    {
      path: '/styles/typography',
      component: () => import('./pages/TypographyPage.vue'),
      meta: { title: 'Typography' },
    },
    {
      path: '/styles/shapes',
      component: () => import('./pages/ShapesPage.vue'),
      meta: { title: 'Shapes' },
    },
    {
      path: '/styles/motion',
      component: () => import('./pages/MotionPage.vue'),
      meta: { title: 'Motion' },
    },
    {
      path: '/styles/palette-builder',
      component: () => import('./pages/PaletteBuilderPage.vue'),
      meta: { title: 'Palette Builder' },
    },
    {
      path: '/changelog',
      component: () => import('./pages/ChangelogPage.vue'),
      meta: { title: 'Changelog' },
    },
    {
      path: '/about',
      component: () => import('./pages/AboutPage.vue'),
      meta: { title: 'About' },
    },
  ],
})

// Target pages are lazy-loaded chunks, some with 100+ demo blocks to render —
// a single fixed-delay check (as this used to be) gives up before the anchor
// exists on a cold chunk load, so poll for it instead.
// Same titles as the per-route HTML written by scripts/prerender-meta.mjs (from scripts/routes.mjs).
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} — M3UI Vue` : 'M3UI Vue — Documentation'
})

router.afterEach((to) => {
  if (!to.hash) return
  let attempts = 0
  const tryScroll = () => {
    const el = document.querySelector(to.hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (attempts++ < 40) {
      setTimeout(tryScroll, 75)
    }
  }
  setTimeout(tryScroll, 50)
})

export default router
