import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SeasonsView from '../views/SeasonsView.vue'
import SeasonDetailView from '../views/SeasonDetailView.vue'
import EventsView from '../views/EventsView.vue'
import EventDetailView from '../views/EventDetailView.vue'
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
      path: '/season/:id',
      name: 'season',
      component: SeasonDetailView
    },
    {
      path: '/division/:id',
      name: 'division',
      component: DivisionDetailView,
    },
    {
      path: '/events',
      name: 'events',
      component: EventsView
    },
    {
      path: '/event/:id',
      name: 'event',
      component: EventDetailView
    }
  ]
})

export default router
