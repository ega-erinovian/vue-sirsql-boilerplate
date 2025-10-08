<script setup>
import AppSidebar from "@/components/AppSidebar.vue"
import NavBreadcrumb from "@/components/ui/navbar/NavBreadcrumb.vue"
import NavUser from "@/components/ui/navbar/NavUser.vue"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useMenusByUserId } from "@/composables/queries/useMenus"
import { useAuthStore } from "@/store/auth"
import { useSidebarStore } from "@/store/sidebar"
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
  <SidebarProvider>
    <AppSidebar :menus="data?.data || []"/>
    <SidebarInset>
      <header class="flex h-16 bg-white shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]] sticky top-0 shadow-md shadow-b-2">
        <div class="flex w-full items-center justify-between pe-2">
          <div class="flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1 text-cyan-950" />
            <Separator orientation="vertical" class="mr-2 h-4" />
            <NavBreadcrumb />
          </div>
          <div>
            <NavUser :user="user" />
          </div>
        </div>
      </header>
      
      <!-- Loading state for menus -->
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <p class="text-muted-foreground">Loading...</p>
      </div>
      
      <slot v-else />
    </SidebarInset>
  </SidebarProvider>
</template>