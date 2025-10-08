import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import Cookies from 'js-cookie'
import LoginView from '@/views/LoginView.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import HomeView from '@/views/HomeView.vue'
import SampleView from '@/views/SampleView.vue'

// Your existing routes
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Beranda',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/pelayanan/rawat-jalan',
    name: 'Rawat Jalan',
    component: SampleView,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const hasToken = !!Cookies.get('accessToken')
  
  // Route requires authentication
  if (requiresAuth) {
    // No token at all - redirect to login
    if (!hasToken) {
      return next({ name: 'Login' })
    }
    
    // Has token but no user data (browser was closed) - redirect to login
    if (!authStore.user || !authStore.tokenExpiry) {
      authStore.logout()
      return next({ name: 'Login' })
    }
    
    // Check if authenticated
    if (!authStore.isAuthenticated) {
      authStore.logout()
      return next({ name: 'Login' })
    }
    
    // Check if token needs refresh (only while browser is open)
    if (authStore.isTokenExpiringSoon()) {
      try {
        await authStore.refreshToken()
      } catch (error) {
        authStore.logout()
        return next({ name: 'Login' })
      }
    }
    
    return next()
  }
  
  // Route doesn't require auth (like login page)
  // If already authenticated, redirect to dashboard
  if (to.name === 'Login' && authStore.isAuthenticated) {
    return next({ name: 'Beranda' })
  }
  
  next()
})

export default router