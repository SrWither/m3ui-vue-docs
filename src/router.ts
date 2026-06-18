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
      path: '/styles/palettes',
      component: () => import('./pages/PalettesPage.vue'),
    },
  ],
})

export default router
