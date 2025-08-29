/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from "@/stores/app";

const ManufacturingPerformanceView = () => import('@/pages/ManufacturingPerformanceView.vue')
const ManufacturingWettingView = () => import('@/pages/ManufacturingWettingView.vue')
const ManufacturingDryingView = () => import('@/pages/ManufacturingDryingView.vue')
const ManufacturingCoatingView = () => import('@/pages/ManufacturingCoatingView.vue')
const ManufacturingCalenderingView = () => import('@/pages/ManufacturingCalenderingView.vue')
const ManufacturingHomepageView = () => import('@/pages/ManufacturingHomepage.vue')

const Login = () => import('@/pages/Login.vue')
const Register = () => import('@/pages/Register.vue')

const routes = [
  {
    path: '/',
    redirect: (to) => { return { path: '/ManufacturingHomepage', query: to.query } }
  },
  {
    path: '',
    redirect: (to) => { return { path: '/ManufacturingHomepage', query: to.query } }
  },
  {
    path: '/ManufacturingHomepage',
    name: 'ManufacturingHomepage',
    component: ManufacturingHomepageView
  },
  {
    path: '/ManufacturingDrying',
    name: 'ManufacturingDrying',
    component: ManufacturingDryingView,
    meta: { requiresAuth: true },
  },
  {
    path: '/ManufacturingWetting',
    name: 'ManufacturingWetting',
    component: ManufacturingWettingView,
    meta: { requiresAuth: true },
  },
  {
    path: '/ManufacturingPerformance',
    name: 'ManufacturingPerformance',
    component: ManufacturingPerformanceView,
    meta: { requiresAuth: true },
  },
  {
    path: '/manufacturingCoating',
    name: 'manufacturingCoating',
    component: ManufacturingCoatingView,
    meta: { requiresAuth: true },
  },
  {
    path: '/ManufacturingCalendering',
    name: 'ManufacturingCalendering',
    component: ManufacturingCalenderingView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
    {
    path: '/register',
    name: 'Register',
    component: Register
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = to.name
  const isAuthenticated = useAppStore().isAuthenticated()
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login') // Redirect to login if not authenticated
  } else {
    next() // Allow access
  }
})

export default router