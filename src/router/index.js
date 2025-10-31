import Cookies from "js-cookie";
import { useAuthStore } from "@/store/auth";
import { createRouter, createWebHistory } from "vue-router";
import { allowedRoutes } from "./consts";

import HomeView from "@/views/HomeView.vue";

import { authRoutes } from "./routes/auth";
import { pelayananRoutes } from "./routes/pelayanan";
import { asuransiRoutes } from "./routes/asuransi";
import administratorRoutes from "./routes/administrator";
import PageNotFound from "@/components/common/PageNotFound.vue";
import PdfExportDemoView from "@/views/PdfExportDemoView.vue";

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
  ...administratorRoutes,
  ...asuransiRoutes,
  { path: "/:pathMatch(.*)*", component: PageNotFound },
  {
    path: "/pdf-export-demo",
    name: "PDF Export",
    component: PdfExportDemoView,
    meta: { requiresAuth: false },
  },
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
  const routeRecord = to.matched.find(record => 
    record.meta.allowedRoles && Array.isArray(record.meta.allowedRoles)
  );

  // Route requires authentication
  if (requiresAuth) {
    // Ask user to change their password on first login
    // if(authStore.isFirstLogin && to.name !== 'Edit User'){
    //   return next({ name: 'Edit User' })
    // }

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
        console.error(error);
        authStore.logout();
        return next({ name: "Login" });
      }
    }

    // AuthGuard
    if (
      authStore.isAuthenticated &&
      authStore.allowedPath.length > 0 &&
      to.name !== "Beranda" &&
      !allowedRoutes.includes(to.path)
    ) {
      if (!authStore.allowedPath.includes(to.path)) {
        authStore.setAccessDenied();
        return next({ name: "Beranda" });
      }
    }

    if (routeRecord) {
      const allowedRoles = routeRecord.meta.allowedRoles;
      const userRoles = authStore.user?.roles || [];
      
      const hasRequiredRole = allowedRoles.some(role => 
        userRoles.includes(role)
      );
      
      if (!hasRequiredRole) {
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
