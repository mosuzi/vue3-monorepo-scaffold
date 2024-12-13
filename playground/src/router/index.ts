import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import subRoutes from './subRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect: { name: subRoutes[0].name },
      children: subRoutes
    }
  ]
})

export default router
