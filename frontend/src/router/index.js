import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import PrestamosView from '../views/PrestamosView.vue'

const routes = [
  {
    path: '/',
    component: LoginView
  },
  {
    path: '/prestamos',
    component: PrestamosView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router