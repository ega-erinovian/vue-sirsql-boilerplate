import { useAuthStore } from "@/store/auth";
import HomeView from "@/views/HomeView.vue";
import Cookies from "js-cookie";
import { createRouter, createWebHistory } from "vue-router";
import { authRoutes } from "./routes/auth";
import { pelayananRoutes } from "./routes/pelayanan";
import { konfigurasiSistemRoutes } from "./routes/konfigurasiSistem";
import { asuransiRoutes } from "./routes/asuransi";

// Your existing routes
const routes = [
  {
    path: "/",
    name: "Beranda",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  ...authRoutes,
  ...pelayananRoutes,
  ...konfigurasiSistemRoutes,
  ...asuransiRoutes
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const hasToken = !!Cookies.get("accessToken");

  // Route requires authentication
  if (requiresAuth) {
    // Ask user to change their password on first login
    // if(authStore.isFirstLogin && to.name !== 'Edit User'){
    //   return next({ name: 'Edit User' })
    // }

    // No token at all - redirect to login
    if (!hasToken) {
      return next({ name: "Login" });
    }

    // Has token but no user data (browser was closed) - redirect to login
    if (!authStore.user || !authStore.tokenExpiry) {
      authStore.logout();
      return next({ name: "Login" });
    }

    // Check if authenticated
    if (!authStore.isAuthenticated) {
      authStore.logout();
      return next({ name: "Login" });
    }

    // Check if token needs refresh (only while browser is open)
    if (authStore.isTokenExpiringSoon()) {
      try {
        await authStore.refreshToken();
      } catch (error) {
        authStore.logout();
        return next({ name: "Login" });
      }
    }

    if(authStore.isAuthenticated && authStore.allowedPath.length > 0 && to.name !== "Beranda"){
      if(!authStore.allowedPath.includes(to.path)){
        authStore.setAccessDenied();
        return next({ name: "Beranda" });
      }
    }

    return next();
  }

  // Route doesn't require auth
  // If already authenticated, redirect to dashboard
  if (to.name === "Login" && authStore.isAuthenticated) {
    return next({ name: "Beranda" });
  }

  next();
});

export default router;
