import Vue from 'vue'
import Router from 'vue-router'
import Login from './login/Login'

Vue.use(Router)

export default new Router({
  base: '/login',
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('./dashboard/Dashboard.vue')
    }
  ]
})
