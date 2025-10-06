<script>
export const description
  = "A sidebar that collapses to icons."
export const iframeHeight = "800px"
export const containerClass = "w-full h-full"
</script>

<script setup>
import AppSidebar from "@/components/AppSidebar.vue"
import LoadingScreen from "@/components/LoadingScreen.vue"
import NavUser from "@/components/NavUser.vue"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/auth"
import Cookies from "js-cookie"
import { onBeforeMount, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter();
const authStore = useAuthStore();

const user = ref({});
const loading = ref(true) // Add a loading state

onBeforeMount(async () => {
  const accessToken = Cookies.get('accessToken');
  
  user.value = authStore.user

  // Check if the token is expired or not present
  if (!accessToken) {
    authStore.logout()
    router.push({ name: 'Login' })
  } else {
    authStore.checkAndRefreshToken();
    setTimeout(() => {
      
      loading.value = false
    }, 1500);
  }
})
</script>

<template>
   <!-- Show loading state while checking authentication -->
  <LoadingScreen v-if="loading" />

  <SidebarProvider v-else>
    <AppSidebar :user="user" />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]">
      <div class="flex w-full items-center justify-between pe-2">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div>
          <NavUser :user="user" />
        </div>
      </div>
      </header>
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>
