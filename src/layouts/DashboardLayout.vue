<script setup>
import LoadingScreen from "@/components/LoadingScreen.vue"
import NavbarComponent from "@/components/navbar/NavbarComponent.vue"
import SidebarComponent from "@/components/sidebar/SidebarComponent.vue"

import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar"
import { useMenusByUserId } from "@/composables/queries/useMenus"
import { useAuthStore } from "@/store/auth"
import Cookies from "js-cookie"
import { computed, onMounted, onUnmounted } from "vue"

const authStore = useAuthStore();

const userId = computed(() => authStore.user?.id);
const accessToken = computed(() => Cookies.get('accessToken') || "");

// Fetch menus
const { data, isLoading } = useMenusByUserId(
  userId,
  accessToken,
  {
    enabled: computed(() => !!accessToken.value && !!userId.value),
    staleTime: 5 * 60 * 1000,
  }
);

// Setup auto token refresh while browser is open
let refreshInterval = null;

onMounted(() => {
  // Check and refresh token every 4 minutes
  refreshInterval = setInterval(async () => {
    await authStore.checkAndRefreshIfNeeded();
  }, 4 * 60 * 1000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});

const user = computed(() => authStore.user);
</script>

<template>
  <LoadingScreen v-if="isLoading" />

  <SidebarProvider v-else>
    <SidebarComponent :menus="data?.data || []" />
    <SidebarInset>
      <NavbarComponent :user="user" />

      <!-- Loading state for menus -->
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <p class="text-muted-foreground">Loading...</p>
      </div>
      
      <slot v-else />
    </SidebarInset>
  </SidebarProvider>
</template>