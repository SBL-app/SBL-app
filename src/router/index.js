import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SeasonsView from '../views/SeasonsView.vue'
import EventsView from '../views/EventsView.vue'
import DivisionDetailView from '../views/DivisionDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/seasons',
      name: 'seasons',
      component: SeasonsView
    },
    {
      path: '/seasons/:id',
      name: 'season',
      component: DivisionDetailView,
    },
    {
      path: '/events',
      name: 'events',
      component: EventsView
    }
  ]
})

export default router
