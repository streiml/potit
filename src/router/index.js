import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/playerlist',
      name: 'PlayerList',
  
      component: () => import('../views/PlayerList.vue')
    },
    {
      path: '/settings',
      name: 'Settings',
  
      component: () => import('../views/Settings.vue')
    },
    {
      path: '/player/:id?',
      name: 'EditPlayer',
  
      component: () => import('../views/EditPlayer.vue')
    },
    {
      path: '/game',
      name: 'Game',
  
      component: () => import('../views/Game.vue')
    }
  ]
})

export default router
