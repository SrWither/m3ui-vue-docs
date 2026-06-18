import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
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
      path: '/styles/palettes',
      component: () => import('./pages/PalettesPage.vue'),
    },
  ],
})

export default router
