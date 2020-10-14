import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import TermineReservierenSchueler from '../views/TermineReservierenSchueler.vue'
import TermineErstellen from '../views/TermineErstellen.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path:'/Login',
    name: 'Login',
    component: Login
  },
  {
    path:'/TermineReservierenSchueler',
    name: 'TermineReservierenSchueler',
    component: TermineReservierenSchueler
  },
  {
    path:'/TermineErstellen',
    name: 'TermineErstellen',
    component: TermineErstellen
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
