<script>
export const description
  = "A sidebar that collapses to icons."
export const iframeHeight = "800px"
export const containerClass = "w-full h-full"
</script>

<script setup>
import AppSidebar from "@/components/AppSidebar.vue"
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
import { onBeforeMount, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter();
const authStore = useAuthStore();

const user = ref({});

onBeforeMount(async () => {
  try {
    // Try to get user from store first
    user.value = authStore.user
    
    // If still no user, redirect to login
    if (!authStore.token) {
      router.replace({ name: 'Login' })
      return
    }
  } catch (error) {
    console.error('Failed to load user:', error)
    // Redirect to login on error
    router.push({ name: 'Login' })
  }
})
</script>

<template>
   <!-- Show loading state while checking authentication -->
  <div v-if="authStore.isLoading" class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col items-center gap-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      <p class="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>

  <SidebarProvider v-else>
    <AppSidebar :user="user" />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
      </header>
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>
