import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

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
  }
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...componentRoutes,
    {
      path: '/',
      component: () => import('./pages/HomePage.vue'),
    },
    {
      path: '/getting-started/setup',
      component: () => import('./pages/SetupPage.vue'),
    },
    {
      path: '/getting-started/i18n',
      component: () => import('./pages/I18nPage.vue'),
    },
    {
      path: '/components/buttons',
      component: () => import('./pages/ButtonsPage.vue'),
    },
    {
      path: '/components/inputs',
      component: () => import('./pages/InputsPage.vue'),
    },
    {
      path: '/components/feedback',
      component: () => import('./pages/FeedbackPage.vue'),
    },
    {
      path: '/components/data-display',
      component: () => import('./pages/DataDisplayPage.vue'),
    },
    {
      path: '/components/navigation',
      component: () => import('./pages/NavigationPage.vue'),
    },
    {
      path: '/components/layout',
      component: () => import('./pages/LayoutPage.vue'),
    },
    {
      path: '/components/overlays',
      component: () => import('./pages/OverlaysPage.vue'),
    },
    {
      path: '/components/tables',
      component: () => import('./pages/TablesPage.vue'),
    },
    {
      path: '/components/utility',
      component: () => import('./pages/UtilityPage.vue'),
    },
    {
      path: '/components/editors',
      component: () => import('./pages/EditorsPage.vue'),
    },
    {
      path: '/components/advanced',
      component: () => import('./pages/AdvancedPage.vue'),
    },
    {
      path: '/examples',
      component: () => import('./pages/ExamplesPage.vue'),
    },
    {
      path: '/examples/apps',
      component: () => import('./pages/ExamplesAppsPage.vue'),
    },
    {
      path: '/styles/palettes',
      component: () => import('./pages/PalettesPage.vue'),
    },
    {
      path: '/styles/palette-builder',
      component: () => import('./pages/PaletteBuilderPage.vue'),
    },
    {
      path: '/changelog',
      component: () => import('./pages/ChangelogPage.vue'),
    },
  ],
})

// Target pages are lazy-loaded chunks, some with 100+ demo blocks to render —
// a single fixed-delay check (as this used to be) gives up before the anchor
// exists on a cold chunk load, so poll for it instead.
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
