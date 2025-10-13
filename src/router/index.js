import { useAuthStore } from '@/store/auth'
import LoginView from '@/views/auth/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import SampleView from '@/views/SampleView.vue'
import EditUserView from '@/views/user/EditUserView.vue'
import Cookies from 'js-cookie'
import { createRouter, createWebHistory } from 'vue-router'

// Your existing routes
const routes = [
  // auth
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  // Home
  {
    path: '/',
    name: 'Beranda',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  // Pelayanan
  {
    path: '/pelayanan/rawat-jalan',
    name: 'Rawat Jalan',
    component: SampleView,
    meta: { requiresAuth: true }
  },
  // User
  {
    path: '/konfigurasi-sistem/user/edit',
    name: 'Edit User',
    component: EditUserView,
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
    // Ask user to change their password on first login
    // if(authStore.isFirstLogin && to.name !== 'Edit User'){
    //   return next({ name: 'Edit User' })
    // }

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