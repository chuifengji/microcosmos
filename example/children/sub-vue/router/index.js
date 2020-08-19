import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from "../views/About.vue"
Vue.use(VueRouter)

const baseUrl = '/sub-vue'

const routes = [
  {
    path: baseUrl + '/',
    name: 'home',
    component: Home
  },
  {
    path: baseUrl + '/about',
    name: 'about',
    component: About
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
