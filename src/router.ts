import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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

router.afterEach((to) => {
  if (to.hash) {
    setTimeout(() => {
      const el = document.querySelector(to.hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }
})

export default router
