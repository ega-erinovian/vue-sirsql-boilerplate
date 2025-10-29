<script setup>
import LoadingScreen from "@/components/common/LoadingScreen.vue";
import NavbarComponent from "@/components/navbar/NavbarComponent.vue";
import SidebarComponent from "@/components/sidebar/SidebarComponent.vue";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useMenusByUserId } from "@/composables/queries/useMenus";
import { useAuthStore } from "@/store/auth";
import Cookies from "js-cookie";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { toast } from "vue3-toastify";

const authStore = useAuthStore();

const userId = computed(() => authStore.user?.id);
const accessToken = ref(Cookies.get("accessToken") || "");

const queryEnabled = computed(() => {
  const enabled = !!accessToken.value && !!userId.value;
  return enabled;
});

// Fetch menus
const { data: sidebarMenu, isLoading } = useMenusByUserId({
  enabled: queryEnabled,
  staleTime: 5 * 60 * 1000,
});

// Setup auto token refresh while browser is open
let refreshInterval = null;

onMounted(() => {
  if (authStore.accessDenied) {
    toast.error("Not allowed to open the page!");
    authStore.clearAccessDenied();
  }

  // Check and refresh token every 4 minutes
  refreshInterval = setInterval(
    async () => {
      await authStore.checkAndRefreshIfNeeded();
    },
    4 * 60 * 1000,
  );
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});

const user = computed(() => authStore.user);
const isFirstLogin = !authStore.isFirstLogin;
</script>

<template>
  <LoadingScreen v-if="isLoading" />

  <SidebarProvider v-else-if="isFirstLogin">
    <SidebarComponent :menus="sidebarMenu || []" />
    <SidebarInset class="bg-brand-primary">
      <NavbarComponent :user="user" />

      <!-- Loading state for menus -->
      <div v-if="isLoading" class="flex items-center justify-center h-64 gap-4">
        <Spinner />
        <p class="text-muted-foreground">Loading...</p>
      </div>
      <div v-else class="p-4 h-full">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>

  <slot v-else />
</template>
