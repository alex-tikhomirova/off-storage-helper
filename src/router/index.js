import { createRouter, createWebHistory } from 'vue-router'
import {useSystemStore} from "../stores/system.js";



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/LayoutMain.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
          meta: {title: 'Главная'}
        },
        {
          path: '/order-collect',
          name: 'order-collect',
          component: () => import('../views/OrderCollectView.vue'),
          meta: {title: 'Сборка заказа'}
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: {title: 'Авторизация'}
    }
  ]
})

router.beforeEach(async (to, from) => {
  const system = useSystemStore()
  if (
      // make sure the user is authenticated
      !system.isAuthenticated &&
      // ❗️ Avoid an infinite redirect
      to.name !== 'login'
  ) {
    // redirect the user to the login page
    return { name: 'login' }
  }else {
    if (system.isAuthenticated && to.name === 'login'){
      router.replace('/')
    }
  }
})

export default router
