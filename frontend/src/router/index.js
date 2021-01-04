import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import TermineReservierenSchueler from '../views/TermineReservierenSchueler.vue'
import TermineErstellen from '../views/TermineErstellen.vue'
import MeineTermineSchueler from '../views/MeineTermineSchueler.vue'
import MeineTermineLehrer from '../views/MeineTermineLehrer.vue'
import BuecherErstellung from '../views/BuecherErstellung.vue'
import Krankschreibung from '../views/Krankschreibung.vue'

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
  },
  {
    path:'/MeineTermineSchueler',
    name: 'MeineTermineSchueler',
    component: MeineTermineSchueler
  },
  {
    path:'/MeineTermineLehrer',
    name: 'MeineTermineLehrer',
    component: MeineTermineLehrer
  },
  {
    path:'/BuecherErstellung',
    name: 'BuecherErstellung',
    component: BuecherErstellung
  },
  {
    path:'/Krankschreibung',
    name: 'Krankschreibung',
    component: Krankschreibung
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
