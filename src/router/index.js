import {createRouter, createWebHistory} from 'vue-router'
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
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: '/order-collect',
          children: [
            {
              path: '',
              component: () => import('../views/OrderCollectView.vue'),
            },
            {
              path: ':id',
              component: () => import('../views/OrderCollectDetailsView.vue'),
            },
          ]
        },
        {
          path: '/product',
          children: [
            {
              path: ':id',
              component: () => import('../views/ProductDetailsView.vue'),
            },
          ]
        },
        {
          path: '/conversation',
          children: [
            {
              path: 'questions',
              component: () => import('../views/MarketplaceQuestionsView.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
    }
  ]
})

router.beforeEach(async (to) => {
  const system = useSystemStore()
  if (!system.user){
    try {
      await system.loadUser()
      if (!system.user){
        throw new Error('Пользователь не найден')
      }
    }catch (e) {
      if(to.name !== 'login'){
        return { name: 'login', query: {return: to.path} }
      }
     //
    }
  }


  if (system.user && to.name === 'login'){
    return '/'
  }


/*  if (
      // make sure the user is authenticated
      !system.isAuthenticated &&
      //  Avoid an infinite redirect
      to.name !== 'login'
  ) {
    // redirect the user to the login page
    return { name: 'login' }
  }else {
    if (system.isAuthenticated && to.name === 'login'){
      router.replace('/')
    }
  }*/
})

export default router
